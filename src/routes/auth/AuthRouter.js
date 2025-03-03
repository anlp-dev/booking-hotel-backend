const express = require("express");
const {inputValidationLogin} = require("../../middleware/InputValidation");
const router = express.Router();
const authController = require("../../controllers/auth/AuthControllers");

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
router.post("/login", inputValidationLogin, authController.login);

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


module.exports = router;
