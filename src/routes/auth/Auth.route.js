const express = require("express");
const {inputValidationLogin} = require("../../middleware/InputValidation");
const router = express.Router();
const authController = require("../../controllers/auth/Auth.controller");
const { loginLimiter } = require("../../middleware/RateLimitMiddleware");
const auth = require("../../middleware/AuthMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập và nhận token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user"
 *               password:
 *                 type: string
 *                 example: "123456"
 */
router.post("/login", loginLimiter, inputValidationLogin, authController.login);
router.post("/login-google", loginLimiter, authController.loginGoogle);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Không có token xác thực
 *       500:
 *         description: Lỗi server
 */
router.post("/logout", auth, authController.logout);

/**
 * @swagger
 * /auth/profile/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 */
router.get("/profile/:id", authController.getDetailUser);
router.put("/update_fullname/:id", authController.updateNameUser);
router.put("/update_username/:id", authController.updateUsername);
router.put("/update_email/:id", authController.updateEmail);
router.put("/update_phone/:id", authController.updatePhone);
router.put("/update_address/:id", authController.updateAddress);
router.put("/update_Gender/:id", authController.updateGender);
router.put("/update_Dob/:id", authController.updateDob);
router.put("/update_avatar/:id", authController.updateAvatar);

module.exports = router;
