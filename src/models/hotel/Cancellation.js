const mongoose = require("mongoose");

const CancellationSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  refund_eligible: {
    type: Boolean,
    default: false,
  },
  refund_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  cancelled_at: {
    type: Date,
    default: Date.now,
  },
  hours_before_checkin: {
    type: Number,
    default: 0,
  },
  cancellation_policy_applied: {
    type: String,
    enum: ["full_refund", "partial_refund", "no_refund"],
    default: "no_refund",
  },
  cancelled_by: {
    type: String,
    enum: ["guest", "hotel", "system"],
    default: "guest",
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed"],
    default: "pending",
  },
});

// Tạo model Cancellation
const Cancellation = mongoose.model("Cancellation", CancellationSchema);

module.exports = Cancellation;
