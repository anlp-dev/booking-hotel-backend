const express = require("express");
const router = express.Router();

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

module.exports = router;
