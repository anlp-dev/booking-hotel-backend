const Room = require("../../models/hotel/Room");

const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Không tìm thấy phòng để xóa" });
    }

    return res
      .status(200)
      .json({ message: "Delete room successfully", data: deletedRoom });
  } catch (error) {
    console.error("Lỗi khi xóa phòng:", error);
    return res.status(500).json({ message: "Lỗi khi xóa phòng", error });
  }
};

module.exports = deleteRoom;
