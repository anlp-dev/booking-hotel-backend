const Booking = require("../../models/hotel/Booking");

const getBookingByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user_id: userId })
      .populate("user_id") // Lấy thông tin user (chỉ username và email)
      .populate("room_id"); // Lấy thông tin phòng

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = getBookingByUser;
