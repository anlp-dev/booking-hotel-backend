// routes/facilityRoutes.js
const express = require("express");
const router = express.Router();
const FacilityControllers = require("../../controllers/facility/FacilityControllers");

router.get("/", FacilityControllers.getAllFacilities);
router.get("/:id", FacilityControllers.getFacilityById);
router.post("/", FacilityControllers.createFacility);
router.put("/:id", FacilityControllers.updateFacility);
router.delete("/:id", FacilityControllers.deleteFacility);

module.exports = router;