const { resExport } = require("../../enums/resExport");
const BookingService = require("../../services/booking/Booking.service");

class BookingController {
  async createBooking(req, res){
    try {
      const resData = await BookingService.createBooking(req.body);
      resExport(200, 'Booking created successfully', resData, res);
    }catch(error){
      resExport(500, error.message, null, res);
    }
  }

  async updateStatusBooking(req, res){
    try {
      const resData = await BookingService.updateStatusBooking(req.body);
      resExport(200, 'Booking updated successfully', resData, res);
    }catch(error){
      resExport(500, error.message, null, res);
    }
  }

  async getBookingByCode(req, res) {
    try{
      const resData = await BookingService.getBookingByCode(req.params.code);
      resExport(200, 'Get booking by code successfully', resData, res);
    }catch (e) {
      resExport(500, e.message, null, res);
    }
  }

  async updatePaymentStatus(req, res){
    try{
      const resData = await BookingService.updatePaymentStatus(req.body);
      resExport(200, 'Payment status updated successfully', resData, res);
    }catch (e) {
      resExport(500, e.message, null, res);
    }
  }
}

module.exports = new BookingController();
