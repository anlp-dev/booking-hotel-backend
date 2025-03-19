const express = require("express");
const router = express.Router();
const PaymentController = require("../../controllers/payment/Payment.controller");
const { checkPermission } = require("../../middleware/AuthPermission");

router.post("/create-url-vnpay", checkPermission(["SUPER", "BOOKING_USER"]), PaymentController.createPayment)



module.exports = router;
