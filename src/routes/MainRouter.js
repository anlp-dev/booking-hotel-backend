const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const adminRouter = require("./admin/AdminRouter");
const roomRouter = require("./room/RoomRouter");

router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/room", roomRouter);

module.exports = router;
