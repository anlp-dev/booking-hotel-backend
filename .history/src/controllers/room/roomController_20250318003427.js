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

  //   Get room by Id
  async getRoomById(req, res) {
    try {
      const { roomId } = req.params;

      const room = await Room.findById(roomId)
        .populate("hotel_id")
        .populate("facility_id")
        .exec();

      if (!room) {
        throw new Error("Không tìm thấy phòng");
      }

      return res
        .status(200)
        .json({ message: "Get room by id successfully", data: room });
    } catch (error) {
      console.error("Lỗi khi lấy phòng:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = RoomController;
