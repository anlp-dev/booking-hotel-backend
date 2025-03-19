const express = require("express");
const router = express.Router();
const DiscountController = require("../../controllers/admin/Discount.controller");
const { checkPermission } = require("../../middleware/AuthPermission");
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API dành cho quản trị viên
 */

/**
 * @swagger
 * /admin/role:
 *   get:
 *     summary: Lấy danh sách vai trò (roles)
 *     tags: [Admin]
 */
router.get("/list_discount", checkPermission(["SUPER", "MANAGER_DISCOUNT_ADMIN"]), DiscountController.getDiscount);
/**
 * @swagger
 * /admin/role:
 *   post:
 *     summary: Thêm mới vai vai trò (roles)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user"
 *               code:
 *                 type: string
 *                 example: "ROLE_CODE"
 *               description:
 *                  type: string
 *                  example: "description"
 *               color:
 *                  type: string
 *                  example: "#ff0000"
 */
router.post("/add_discount", checkPermission(["SUPER", "MANAGER_DISCOUNT_ADMIN"]), DiscountController.createDiscount);
/**
 * @swagger
 * /admin/role:
 *   put:
 *     summary: Cập nhật vai vai trò (roles)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user"
 *               description:
 *                  type: string
 *                  example: "description"
 *               color:
 *                  type: string
 *                  example: "#ff0000"
 */
router.put("/update_discount/:id", checkPermission(["SUPER", "MANAGER_DISCOUNT_ADMIN"]), DiscountController.updateDiscount);

/**
 * @swagger
 * /admin/permission:
 *   get:
 *     summary: Lấy danh sách quyền (permissions)
 *     tags: [Admin]
 */
router.get("/:id", checkPermission(["SUPER", "MANAGER_DISCOUNT_ADMIN"]), DiscountController.getDiscountById);

/**
 * @swagger
 * /admin/permission:
 *   post:
 *     summary: Thêm mới vai quyền (permission)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "user can do something"
 *               code:
 *                 type: string
 *                 example: "PERMISSION_CODE"
 *               description:
 *                  type: string
 *                  example: "description"
 */
router.delete("/delete_discount/:id", checkPermission(["SUPER", "MANAGER_DISCOUNT_ADMIN"]), DiscountController.deleteDiscount);

/**
 * @swagger
 * /admin/rolePermission:
 *   get:
 *     summary: Lấy danh sách quyền theo vai trò (role-permissions)
 *     tags: [Admin]
 */

module.exports = router;
