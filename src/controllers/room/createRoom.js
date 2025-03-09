const Room = require("../../models/hotel/Room");

const createRoom = async (req, res) => {
  try {
    const {
      hotel_id,
      room_number,
      type,
      price,
      capacity,
      status,
      description,
      facility,
    } = req.body;

    // Tạo danh sách các trường thiếu
    const missingFields = [];

    if (!hotel_id) missingFields.push("hotel_id");
    if (!room_number) missingFields.push("room_number");
    if (!type) missingFields.push("type");
    if (!price) missingFields.push("price");
    if (!capacity) missingFields.push("capacity");
    if (!status) missingFields.push("status");
    if (!description) missingFields.push("description");
    if (!facility) missingFields.push("facility");

    // Nếu có trường thiếu, trả về lỗi
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `You have to fill all fields: ${missingFields.join(", ")}`,
      });
    }

    const newRoom = new Room({
      hotel_id,
      room_number,
      type,
      price,
      capacity,
      status,
      description,
      facility_id: facility,
    });
    await newRoom.save();

    return res
      .status(201)
      .json({ message: "Create room successfully", data: newRoom });
  } catch (error) {
    console.error("Lỗi khi tạo phòng:", error);
    return res.status(500).json({ message: "Lỗi khi tạo phòng", error });
  }
};

module.exports = createRoom;
