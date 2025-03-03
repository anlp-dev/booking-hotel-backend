const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const adminRouter = require("./admin/AdminRouter")

router.use("/admin", adminRouter);
router.use("/auth", authRouter);


module.exports = router;
