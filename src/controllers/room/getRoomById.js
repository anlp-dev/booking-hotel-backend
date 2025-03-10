const Room = require("../../models/hotel/Room");

// 📌 Lấy phòng theo ID
const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params.roomId;
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
    throw error;
  }
};

module.exports = getRoomById;
