const Room = require("../../models/hotel/Room"); // Đường dẫn tới model Room
const Hotel = require("../../models/hotel/Hotel");
const Facility = require("../../models/hotel/Facility");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("hotel_id") // Lấy thông tin khách sạn
      .populate("facility_id"); // Lấy thông tin tiện ích

    if (!rooms) {
      return res.status(404).json({ message: "Can not get list room" });
    }

    return res
      .status(200)
      .json({ message: "Get list room successfully", data: rooms });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng:", error);
    throw error;
  }
};

module.exports = getAllRooms;
