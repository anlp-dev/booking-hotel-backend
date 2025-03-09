const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const adminRouter = require("./admin/AdminRouter")
const paymentRouter = require("./payment/PaymentRouter");

router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/payment", paymentRouter);

module.exports = router;
