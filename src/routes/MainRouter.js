const express = require("express");
const router = express.Router();
const authRouter = require("./auth/AuthRouter");
const adminRouter = require("./admin/AdminRouter");
const ProfileRoute = require('./user/ProfileRotes');
const DiscountRouter = require('./admin/DiscountRouter');

router.use("/admin", adminRouter);
router.use("/admin_discount", DiscountRouter);
router.use("/auth", authRouter);
router.use('/user', ProfileRoute);

module.exports = router;
