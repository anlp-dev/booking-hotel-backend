const { resExport } = require("../../enums/resExport");
const BookingService = require("../../services/booking/Booking.service");

class BookingController {
  async createBooking(req, res) {
    try {
      const resData = await BookingService.createBooking(req.body);
      resExport(200, "Booking created successfully", resData, res);
    } catch (error) {
      resExport(500, error.message, null, res);
    }
  }

  async updateStatusBooking(req, res) {
    try {
      const resData = await BookingService.updateStatusBooking(req.body);
      resExport(200, "Booking updated successfully", resData, res);
    } catch (error) {
      resExport(500, error.message, null, res);
    }
  }

  async getBoookingById(req, res) {
    try {
      const resData = await BookingService.getBookingById(req.params.id);
      console.log("resData", resData);
      resExport(200, "Get booking by id successfully", resData, res);
    } catch (error) {
      resExport(500, error.message, null, res);
    }
  }

  async getBookingByUser(req, res) {
    try {
      const resData = await BookingService.getBookingByUser(req.params.userId);
      resExport(200, "Get booking by userId successfully", resData, res);
    } catch (error) {
      resExport(500, error.message, null, res);
    }
  }
}

module.exports = new BookingController();
