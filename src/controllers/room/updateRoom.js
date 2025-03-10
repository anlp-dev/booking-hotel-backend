const Room = require("../../models/hotel/Room");

const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const updateData = req.body.roomData;
    console.log("uipdate dât", updateData);

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $set: updateData },
      {
        new: true,
        runValidators: true, // Đảm bảo dữ liệu hợp lệ theo schema
      }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    console.log("update room", updatedRoom);

    return res
      .status(200)
      .json({ message: "Update room successfully", data: updatedRoom });
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng:", error);
    return res.status(500).json({ message: "Lỗi khi cập nhật phòng", error });
  }
};

module.exports = updateRoom;
