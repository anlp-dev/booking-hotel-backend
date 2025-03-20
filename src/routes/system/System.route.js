const express = require("express");
const router = express.Router();
const SystemController = require("../../controllers/system/System.controller");
const { checkPermission } = require("../../middleware/AuthPermission");

/**
 * @swagger
 * tags:
 *   name: System
 *   description: API quản lý hệ thống
 */

/**
 * @swagger
 * /api/system/get-all-route:
 *   get:
 *     summary: Lấy danh sách tất cả các route trong hệ thống
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách route thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   path:
 *                     type: string
 *                   method:
 *                     type: string
 *                   requireToken:
 *                     type: boolean
 *                   status:
 *                     type: string
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/get-all-route", checkPermission(["SUPER", "MANAGER_ROUTER_ADMIN"]), SystemController.getRouter)

/**
 * @swagger
 * /api/system/create-route:
 *   post:
 *     summary: Tạo route mới trong hệ thống
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 example: "/api/example"
 *               method:
 *                 type: string
 *                 example: "GET"
 *                 description: Phương thức HTTP (GET, POST, PUT, DELETE, PATCH hoặc * cho tất cả)
 *               requireToken:
 *                 type: boolean
 *                 example: true
 *                 description: Route có yêu cầu xác thực token hay không
 *     responses:
 *       200:
 *         description: Tạo route thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 path:
 *                   type: string
 *                 method:
 *                   type: string
 *                 requireToken:
 *                   type: boolean
 *                 status:
 *                   type: string
 *       400:
 *         description: Đường dẫn đã tồn tại hoặc dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post("/create-route", checkPermission(["SUPER", "MANAGER_ROUTER_ADMIN"]), SystemController.createNewRoute)

module.exports = router;
