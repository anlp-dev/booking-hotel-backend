const mongoose = require("mongoose");

const RefundSchema = new mongoose.Schema({
  cancellation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cancellation",
    required: true,
  },
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
  refund_method: {
    type: String,
    enum: ["credit_card", "bank_transfer", "e_wallet", "cash"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  refund_percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  payment_details: {
    // For bank transfers or other payment methods
    account_number: { type: String },
    bank_name: { type: String },
    account_holder: { type: String },
    e_wallet_id: { type: String },
    card_last_digits: { type: String },
  },
  notes: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  processed_at: {
    type: Date,
  },
});

const Refund = mongoose.model("Refund", RefundSchema);

module.exports = Refund; 
