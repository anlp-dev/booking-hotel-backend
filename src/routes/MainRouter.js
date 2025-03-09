const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const adminRouter = require("./admin/AdminRouter")
const paymentRouter = require("./payment/PaymentRouter");
const systemRouter = require("./system/SystemRouter")

router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/payment", paymentRouter);
router.use("/system", systemRouter);

module.exports = router;
