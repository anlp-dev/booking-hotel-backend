const express = require("express");
const router = express.Router();

router.get("/:roomId", require("../../controllers/room/getRoomById"));
router.get("/", require("../../controllers/room/getRoomList"));
router.post("/", require("../../controllers/room/createRoom"));
router.put("/:roomId", require("../../controllers/room/updateRoom"));
router.delete("/:roomId", require("../../controllers/room/deleteRoom"));

module.exports = router;
