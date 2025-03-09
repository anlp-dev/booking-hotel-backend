const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");

const adminRouter = require("./admin/AdminRouter")
const paymentRouter = require("./payment/PaymentRouter");
const systemRouter = require("./system/SystemRouter")
const roomRouter = require("./room/RoomRouter");

router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/payment", paymentRouter);
router.use("/system", systemRouter);
router.use("/room", roomRouter);


module.exports = router;
