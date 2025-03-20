const express = require("express");
const router = express.Router();
const RoomController = require("../../controllers/room/Room.controller");
const {checkPermission} = require("../../middleware/AuthPermission");


router.get("/get-by-id/:roomId", RoomController.getRoomById);
router.get("/", RoomController.getAllRooms);
router.post("/", checkPermission(["SUPER", "MANAGER_ROOM_ADMIN"]), RoomController.createRoom);
router.put("/:roomId", checkPermission(["SUPER", "MANAGER_ROOM_ADMIN"]), RoomController.updateRoom);
router.delete("/:roomId", checkPermission(["SUPER", "MANAGER_ROOM_ADMIN"]), RoomController.deleteRoom);


module.exports = router;
