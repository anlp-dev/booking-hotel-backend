const express = require("express");
const router = express.Router();
const BookingController = require("../../controllers/booking/Booking.controller");
const CancelBookingController = require("../../controllers/booking/CancelBooking.controller");
const { checkPermission } = require('../../middleware/checkPermission');

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

/**
 * @route POST /api/booking/cancel
 * @description Cancel a booking
 */
router.post("/cancel", CancelBookingController.cancelBooking);

/**
 * @route GET /api/booking/refund/:booking_id
 * @description Get refund details for a cancelled booking
 */
router.get("/refund/:booking_id", CancelBookingController.getRefundDetails);

/**
 * @route POST /api/booking/refund/submit
 * @description Submit refund information for processing
 */
router.post("/refund/submit", CancelBookingController.submitRefundInfo);

/**
 * @route POST /api/booking/refund/complete
 * @description Complete a refund process (admin only)
 */
router.post("/refund/complete", checkPermission(["SUPER", "ADMIN"]), CancelBookingController.completeRefund);

module.exports = router;
