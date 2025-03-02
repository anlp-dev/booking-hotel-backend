const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer", "cash"],
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid", "failed"],
    required: true,
    default: "unpaid",
  },
});

// Tạo model Payment
const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
