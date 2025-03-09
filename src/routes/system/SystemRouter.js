const express = require("express");
const router = express.Router();
const systemRouter = require("../../controllers/system/SystemController");
const SystemController = require("../../controllers/system/SystemController");

router.get("/get-all-route", SystemController.getRouter)
router.post("/create-route", SystemController.createNewRoute)

module.exports = router;
