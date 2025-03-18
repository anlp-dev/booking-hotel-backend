const Booking = require("../../models/hotel/Booking");
const Payment = require("../../models/hotel/Payment");
const Room = require("../../models/hotel/Room");

class BookingService {
  generateRandomCode() {
    const prefix = "BKHT-";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomCode = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters[randomIndex];
    }

    return prefix + randomCode;
  }

  async createBooking(bookingData) {
    try {
      const {
        user_id,
        room_id,
        checkin_date,
        checkout_date,
        totalPrice,
        status,
        breakfast,
        payment_method,
        note
      } = bookingData;


      if (!user_id || !room_id || !checkin_date || !checkout_date || !totalPrice) {
        throw new Error("All fields are required");
      }

      let code;
      let isUnique = false;
      
      while (!isUnique) {
        code = this.generateRandomCode();
        const existingBooking = await Booking.findOne({ code: code });
        if (!existingBooking) {
          isUnique = true;
        }
      }

      const checkBooking = await Booking.findOne({
        user_id: user_id,
        room_id: room_id,
        checkin_date: { $lte: checkout_date },
        checkout_date: { $gte: checkin_date },
        status: { $ne: "cancelled" }
      });
      if (checkBooking) {
        throw new Error("Room is already booked for the selected dates");
      }

      const newBooking = new Booking({
        user_id: user_id,
        room_id: room_id,
        check_in: checkin_date,
        check_out: checkout_date,
        total_price: totalPrice,
        status: status ? status : "pending",
        breakfast: breakfast ? breakfast : false,
        code: code,
        note: note ? note : ""
      });

      await newBooking.save();

      const newPayment = new Payment({
        booking_id: newBooking._id,
        amount: totalPrice,
        method: payment_method ? payment_method : "vnpayqr",
      });

      await newPayment.save();

      const dataRoom = await Room.findById(room_id);
      dataRoom.status = "booked";
      await dataRoom.save();

      return newBooking;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateStatusBooking(bookingData) {
    try {
      const { id, status } = bookingData;
      if (!id || !status) {
        throw new Error("All fields are required");
      }

      const dataBooking = await Booking.findById(id);
      if (!dataBooking) {
        throw new Error("Booking not found");
      }

      if (status === "cancelled") {
        const room = await Room.findById(dataBooking.room_id);
        if (room) {
          room.status = "available";
          await room.save();
        }
      }

      dataBooking.status = status;
      await dataBooking.save();
      return dataBooking;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePaymentStatus(paymentData) {
    try {
      const { id, status } = paymentData;
      if (!id || !status) {
        throw new Error("All fields are required");
      }

      const dataPayment = await Payment.findById(id);
      if (!dataPayment) {
        throw new Error("Payment not found");
      }

      dataPayment.status = status;
      await dataPayment.save();
      return dataPayment;
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new BookingService();
