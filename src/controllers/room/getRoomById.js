const Room = require("../../models/hotel/Room");

// 📌 Lấy phòng theo ID
const getRoomById = async (req, res) => {
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
};

module.exports = getRoomById;
