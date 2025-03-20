// routes/facilityRoutes.js
const express = require("express");
const router = express.Router();
const FacilityControllers = require("../../controllers/facility/Facility.controller");
const {checkPermission} = require("../../middleware/AuthPermission");

router.get("/", FacilityControllers.getAllFacilities);
router.get("/:id", FacilityControllers.getFacilityById);
router.post("/", checkPermission(["SUPER", "MANAGER_VATTU_ADMIN"]), FacilityControllers.createFacility);
router.put("/:id", checkPermission(["SUPER", "MANAGER_VATTU_ADMIN"]), FacilityControllers.updateFacility);
router.delete("/:id", checkPermission(["SUPER", "MANAGER_VATTU_ADMIN"]), FacilityControllers.deleteFacility);

module.exports = router;