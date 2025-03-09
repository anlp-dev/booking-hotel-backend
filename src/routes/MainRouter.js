const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const adminRouter = require("./admin/AdminRouter")
const RegisterRouter = require("./register/RegisterRouter")

router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/register", RegisterRouter);


module.exports = router;
