const Booking = require("../../models/hotel/Booking");
const Cancellation = require("../../models/hotel/Cancellation");
const Refund = require("../../models/hotel/Refund");
const Room = require("../../models/hotel/Room");
const Payment = require("../../models/hotel/Payment");
const nodemailer = require("nodemailer");

class CancellationService {
  /**
   * Calculate hours before check-in
   * @param {Date} checkInDate - The check-in date
   * @returns {number} Hours before check-in
   */
  calculateHoursBeforeCheckin(checkInDate) {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = checkIn - now;
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours;
  }

  /**
   * Calculate refund percentage based on cancellation policy
   * @param {number} hoursBeforeCheckin - Hours before check-in
   * @returns {Object} Refund policy information
   */
  calculateRefundPercentage(hoursBeforeCheckin) {
    let refundPercentage = 0;
    let policyApplied = "no_refund";
    let isEligible = false;

    if (hoursBeforeCheckin >= 48) {
      refundPercentage = 100;
      policyApplied = "full_refund";
      isEligible = true;
    } else if (hoursBeforeCheckin >= 24 && hoursBeforeCheckin < 48) {
      refundPercentage = 50;
      policyApplied = "partial_refund";
      isEligible = true;
    }

    return {
      refundPercentage,
      policyApplied,
      isEligible
    };
  }

  /**
   * Create a cancellation record
   * @param {Object} cancellationData - Cancellation data
   * @returns {Promise<Object>} Created cancellation record
   */
  async createCancellation(cancellationData) {
    try {
      const { booking_id, reason, cancelled_by } = cancellationData;
      
      if (!booking_id || !reason) {
        throw new Error("Booking ID and reason are required");
      }

      // Find the booking
      const booking = await Booking.findById(booking_id);
      if (!booking) {
        throw new Error("Booking not found");
      }

      // Check if booking is already cancelled
      if (booking.status === "cancelled" || booking.status === "refunded") {
        throw new Error("Booking is already cancelled or refunded");
      }

      // Calculate hours before check-in
      const hoursBeforeCheckin = this.calculateHoursBeforeCheckin(booking.check_in);
      
      // Calculate refund percentage
      const { refundPercentage, policyApplied, isEligible } = this.calculateRefundPercentage(hoursBeforeCheckin);

      // Create cancellation record
      const cancellation = new Cancellation({
        booking_id,
        reason,
        refund_eligible: isEligible,
        refund_percentage: refundPercentage,
        hours_before_checkin: hoursBeforeCheckin,
        cancellation_policy_applied: policyApplied,
        cancelled_by: cancelled_by || "guest",
        status: "pending"
      });

      await cancellation.save();

      // Update booking status
      booking.status = "cancelled";
      await booking.save();

      // Update room status
      const room = await Room.findById(booking.room_id);
      if (room) {
        room.status = "available";
        await room.save();
      }

      // If eligible for refund, create a pending refund record
      if (isEligible) {
        const payment = await Payment.findOne({ booking_id: booking._id });
        
        if (payment) {
          const refundAmount = (payment.amount * refundPercentage) / 100;
          
          const refund = new Refund({
            cancellation_id: cancellation._id,
            booking_id: booking._id,
            amount: refundAmount,
            refund_method: payment.method || "bank_transfer",
            refund_percentage: refundPercentage,
            status: "pending"
          });
          
          await refund.save();
        }
      }

      return {
        cancellation,
        refundPercentage,
        policyApplied,
        isEligible
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Process a refund
   * @param {Object} refundData - Refund data
   * @returns {Promise<Object>} Updated refund record
   */
  async processRefund(refundData) {
    try {
      const { refund_id, payment_details, refund_method, notes } = refundData;
      
      if (!refund_id) {
        throw new Error("Refund ID is required");
      }

      const refund = await Refund.findById(refund_id);
      if (!refund) {
        throw new Error("Refund not found");
      }

      // Update refund record
      refund.status = "processing";
      if (payment_details) {
        refund.payment_details = {
          ...refund.payment_details,
          ...payment_details
        };
      }
      
      if (refund_method) {
        refund.refund_method = refund_method;
      }
      
      if (notes) {
        refund.notes = notes;
      }

      await refund.save();

      return refund;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Complete a refund
   * @param {string} refund_id - Refund ID
   * @returns {Promise<Object>} Updated refund and booking records
   */
  async completeRefund(refund_id) {
    try {
      if (!refund_id) {
        throw new Error("Refund ID is required");
      }

      const refund = await Refund.findById(refund_id);
      if (!refund) {
        throw new Error("Refund not found");
      }

      // Update refund record
      refund.status = "completed";
      refund.processed_at = new Date();
      await refund.save();

      // Update booking status
      const booking = await Booking.findById(refund.booking_id);
      if (booking) {
        booking.status = "refunded";
        await booking.save();
      }

      // Update cancellation status
      const cancellation = await Cancellation.findById(refund.cancellation_id);
      if (cancellation) {
        cancellation.status = "completed";
        await cancellation.save();
      }

      return { refund, booking, cancellation };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Send refund notification email
   * @param {string} email - User email
   * @param {Object} data - Email data
   * @returns {Promise<Object>} Email send result
   */
  async sendRefundNotification(email, data) {
    try {
      const { booking, cancellation, refund } = data;
      
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const refundStatusText = {
        pending: "đang chờ xử lý",
        processing: "đang được xử lý",
        completed: "đã hoàn thành",
        failed: "thất bại"
      };

      const refundMethodText = {
        credit_card: "Thẻ tín dụng/thẻ ngân hàng",
        bank_transfer: "Chuyển khoản ngân hàng",
        e_wallet: "Ví điện tử",
        cash: "Tiền mặt tại khách sạn"
      };

      const policyText = {
        full_refund: "Hoàn lại 100% tiền đặt cọc",
        partial_refund: "Hoàn lại 50% tiền đặt cọc",
        no_refund: "Không hoàn tiền"
      };

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `[Khách sạn] Xác nhận hủy phòng & hoàn tiền đặt cọc`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Xác nhận hủy phòng & hoàn tiền đặt cọc</h2>
            <p>Kính gửi Quý khách,</p>
            <p>Quý khách đã yêu cầu hủy đặt phòng <strong>#${booking.code}</strong>.</p>
            <p>Theo chính sách của chúng tôi, chúng tôi sẽ áp dụng: <strong>${policyText[cancellation.cancellation_policy_applied]}</strong></p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #333;">Chi tiết hoàn tiền:</h3>
              <p><strong>Số tiền hoàn lại:</strong> ${refund.amount.toLocaleString('vi-VN')} VND (${refund.refund_percentage}% tiền đặt cọc)</p>
              <p><strong>Phương thức hoàn tiền:</strong> ${refundMethodText[refund.refund_method]}</p>
              <p><strong>Trạng thái hoàn tiền:</strong> ${refundStatusText[refund.status]}</p>
              <p><strong>Thời gian xử lý:</strong> 3-7 ngày làm việc</p>
            </div>
            
            <p>Mọi thắc mắc, vui lòng liên hệ hotline: <strong>0987 654 321</strong>.</p>
            <p>Trân trọng,<br/>Khách sạn</p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

module.exports = new CancellationService(); 
