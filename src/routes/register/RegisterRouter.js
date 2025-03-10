const express = require("express");
const {inputValidationRegister} = require("../../middleware/InputValidation");
const router = express.Router();
const RegisterControllers = require("../../controllers/register/RegisterControllers");

router.post("/account", inputValidationRegister, RegisterControllers.registerUser);
router.get("/verify/:token", RegisterControllers.verifyUser);

module.exports = router;