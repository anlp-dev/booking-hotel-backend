const express = require("express");
const router = express.Router();
const authRouter = require("./auth/Auth.route");
const ProfileRoute = require("./user/Profile.route");
const DiscountRouter = require("./admin/Discount.route");
const adminRouter = require("./admin/Admin.route");
const paymentRouter = require("./payment/Payment.route");
const systemRouter = require("./system/System.route");
const roomRouter = require("./room/Room.route");
const RegisterRouter = require("./register/Register.route");
const bookingRouter = require("./booking/Booking.route");

router.use("/admin", adminRouter);
router.use("/admin_discount", DiscountRouter);
router.use("/auth", authRouter);
router.use("/user", ProfileRoute);
router.use("/payment", paymentRouter);
router.use("/system", systemRouter);
router.use("/room", roomRouter);
router.use("/register", RegisterRouter);
router.use("/booking", bookingRouter);

module.exports = router;
