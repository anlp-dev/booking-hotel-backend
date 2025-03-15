const Booking = require("../../models/hotel/Booking");

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params; // Lấy booking ID từ URL params

    const booking = await Booking.findById(id)
      .populate("user_id") // Lấy thông tin user (chỉ username và email)
      .populate("room_id"); // Lấy thông tin phòng (số phòng, loại phòng)

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = getBookingById;
