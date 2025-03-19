const CancellationService = require("../../services/booking/Cancellation.service");
const User = require("../../models/user/User");
const Booking = require("../../models/hotel/Booking");
const Cancellation = require("../../models/hotel/Cancellation");
const Refund = require("../../models/hotel/Refund");

/**
 * Cancel a booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with cancellation details
 */
const cancelBooking = async (req, res) => {
  try {
    const { booking_id, reason } = req.body;
    
    if (!booking_id || !reason) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and reason are required"
      });
    }

    // Create cancellation
    const result = await CancellationService.createCancellation({
      booking_id,
      reason,
      cancelled_by: "guest"
    });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get refund details for a cancelled booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with refund details
 */
const getRefundDetails = async (req, res) => {
  try {
    const { booking_id } = req.params;
    
    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }

    const booking = await Booking.findById(booking_id)
      .populate("user_id", "email fullname phone")
      .populate("room_id", "name price");
      
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const cancellation = await Cancellation.findOne({ booking_id })
      .sort({ cancelled_at: -1 })
      .limit(1);
      
    if (!cancellation) {
      return res.status(404).json({
        success: false,
        message: "Cancellation not found"
      });
    }

    const refund = await Refund.findOne({ booking_id, cancellation_id: cancellation._id });

    return res.status(200).json({
      success: true,
      data: {
        booking,
        cancellation,
        refund
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Submit refund information for processing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with updated refund details
 */
const submitRefundInfo = async (req, res) => {
  try {
    const { refund_id, payment_details, refund_method } = req.body;
    
    if (!refund_id) {
      return res.status(400).json({
        success: false,
        message: "Refund ID is required"
      });
    }

    // Process refund with provided payment details
    const refund = await CancellationService.processRefund({
      refund_id,
      payment_details,
      refund_method,
      notes: req.body.notes
    });

    // Get booking and user details for email notification
    const booking = await Booking.findById(refund.booking_id);
    const user = await User.findById(booking.user_id);
    const cancellation = await Cancellation.findById(refund.cancellation_id);

    // Send email notification
    if (user && user.email) {
      await CancellationService.sendRefundNotification(user.email, {
        booking,
        cancellation,
        refund
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refund information submitted successfully",
      data: refund
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Complete a refund process (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with completed refund details
 */
const completeRefund = async (req, res) => {
  try {
    const { refund_id } = req.body;
    
    if (!refund_id) {
      return res.status(400).json({
        success: false,
        message: "Refund ID is required"
      });
    }

    // Complete the refund process
    const result = await CancellationService.completeRefund(refund_id);

    // Get user details for email notification
    const user = await User.findById(result.booking.user_id);

    // Send email notification
    if (user && user.email) {
      await CancellationService.sendRefundNotification(user.email, {
        booking: result.booking,
        cancellation: result.cancellation,
        refund: result.refund
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refund completed successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  cancelBooking,
  getRefundDetails,
  submitRefundInfo,
  completeRefund
}; 
