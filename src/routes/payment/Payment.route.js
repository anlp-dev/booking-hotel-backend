const express = require("express");
const router = express.Router();
const PaymentController = require("../../controllers/payment/Payment.controller");
const { checkPermission } = require("../../middleware/AuthPermission");

router.post("/create-url-vnpay", PaymentController.createPayment)



module.exports = router;
