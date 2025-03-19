const express = require("express");
const router = express.Router();
const BookingController = require("../../controllers/booking/Booking.controller");

// Define routes
/**
 * @route GET /api/booking
 * @description Get all bookings
 * @access Private (Admin)
 */
router.get("/:userId", require("../../controllers/booking/getBookingByUser"));

/**
 * @route GET /api/booking/:id
 * @description Get booking by ID
 * @access Private (Admin or Owner)
 */
router.get("/:id", require("../../controllers/booking/getBookingById"));

router.post("/create", BookingController.createBooking);
router.put("/update-status", BookingController.updateStatusBooking);

module.exports = router;
