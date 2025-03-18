const express = require("express");
const router = express.Router();
const SystemController = require("../../controllers/system/System.controller");
const { checkPermission } = require("../../middleware/AuthPermission");

router.get("/get-all-route", checkPermission(["SUPER", "MANAGER_ROUTER_ADMIN"]), SystemController.getRouter)
router.post("/create-route", checkPermission(["SUPER", "MANAGER_ROUTER_ADMIN"]), SystemController.createNewRoute)

module.exports = router;
