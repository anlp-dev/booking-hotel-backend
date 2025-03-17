const express = require("express");
const router = express.Router();
const RoomController = require("../../controllers/room/roomController");


router.get("/:roomId", RoomController.getRoomById);
router.get("/", RoomController.getAllRooms);
router.post("/", RoomController.createRoom);
router.put("/:roomId", RoomController.updateRoom);
router.delete("/:roomId", RoomController.deleteRoom);


module.exports = router;
