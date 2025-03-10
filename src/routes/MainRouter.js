const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const ProfileRoute = require('./user/ProfileRotes');
const DiscountRouter = require('./admin/DiscountRouter');


const adminRouter = require("./admin/AdminRouter")
const paymentRouter = require("./payment/PaymentRouter");
const systemRouter = require("./system/SystemRouter")
const roomRouter = require("./room/RoomRouter");
const RegisterRouter = require("./register/RegisterRouter")
router.use("/admin", adminRouter);
router.use("/admin_discount", DiscountRouter);
router.use("/auth", authRouter);
router.use('/user', ProfileRoute);
router.use("/payment", paymentRouter);
router.use("/system", systemRouter);
router.use("/room", roomRouter);
router.use("/register", RegisterRouter);


module.exports = router;
