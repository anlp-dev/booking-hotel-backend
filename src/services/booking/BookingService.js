const Booking = require("../../models/hotel/Booking");

class BookingService {
  async createBooking(bookingData){
    try{
      const {user_id, room_id, checkin_date, checkout_date, totalPrice, status, breakfast} = bookingData;
      if(!user_id || !room_id || !checkin_date || !checkout_date || !totalPrice || !status || !breakfast){
        throw new Error('All fields are required');
      }

      const checkBooking = await Booking.findOne({user_id: user_id, room_id: room_id, check_in: {$lte: checkout_date}, check_out: {$gte: checkin_date}});
      if(checkBooking){
        throw new Error('Room is already booked for the selected dates');
      }
      
      const newBooking = new Booking({
        user_id: user_id,
        room_id: room_id,
        checkin_date: checkin_date,
        checkout_date: checkout_date,
        totalPrice: totalPrice,
        status: status ? status : 'pending',
        breakfast: breakfast ? breakfast : false
      })

      await newBooking.save();
      return newBooking;
    }catch(error){
      throw new Error(error);
    }
  }

  async updateStatusBooking(bookingData){
    try{
      const {id, status} = bookingData;
      if(!id || !status){
        throw new Error('All fields are required');
      }

      

    }catch(error){
      throw new Error(error)
    }
  }

  async cancelBooking(bookingId){

  }
}

module.exports = new BookingService();
