const express = require("express");
const router = express.Router();
const AdminController = require("../../controllers/admin/Admin.controller");
const FacilityControllers = require("../../controllers/facility/Facility.controller"); // Controller mới cho facility
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
router.get("/role", checkPermission(["SUPER", "MANAGER_ROLE_ADMIN"]), AdminController.getRole);

/**
 * @swagger
 * /admin/role:
 *   post:
 *     summary: Thêm mới vai trò (roles)
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
router.post("/role", checkPermission(["SUPER", "MANAGER_ROLE_ADMIN"]), AdminController.createRole);

/**
 * @swagger
 * /admin/role:
 *   put:
 *     summary: Cập nhật vai trò (roles)
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
router.put("/role", checkPermission(["SUPER", "MANAGER_ROLE_ADMIN"]), AdminController.updateRole);

/**
 * @swagger
 * /admin/permission:
 *   get:
 *     summary: Lấy danh sách quyền (permissions)
 *     tags: [Admin]
 */
router.get("/permission", checkPermission(["SUPER", "MANAGER_ROLE_ADMIN"]), AdminController.getPermission);

/**
 * @swagger
 * /admin/permission:
 *   post:
 *     summary: Thêm mới quyền (permission)
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
router.post("/permission", checkPermission(["SUPER", "MANAGER_ROLE_ADMIN"]), AdminController.createPermission);

/**
 * @swagger
 * /admin/rolePermission:
 *   get:
 *     summary: Lấy danh sách quyền theo vai trò (role-permissions)
 *     tags: [Admin]
 */
router.get("/rolePermission", checkPermission(["SUPER", "MANAGER_ROLE_ADMIN"]), AdminController.getRolePermission);

/**
 * @swagger
 * /admin/rolePermission:
 *   put:
 *     summary: Cập nhật quyền cho từng role (role_permission)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "7671DWA((**&...."
 *               permissions:
 *                 type: array
 *                 example: ["PERMISSION_CODE_1", "PERMISSION_CODE_2"]
 */
router.put("/rolePermission", checkPermission(["SUPER", "MANAGER_ROLE_ADMIN"]), AdminController.updateRolePermission);


module.exports = router;
