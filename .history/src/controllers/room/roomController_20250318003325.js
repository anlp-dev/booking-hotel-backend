const Room = require("../../models/room/Room");

const RoomController = {
  async getAllRooms(req, res) {
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
  },
};

module.exports = RoomController;
