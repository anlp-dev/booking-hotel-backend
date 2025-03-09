const setupSessionMiddleware = require('../middleware/SessionMiddleware');
const { routePermissionMiddleware, initializeRoutePermissions } = require('../middleware/RoutePermissionMiddleware');


/**
 * Cấu hình bảo mật cho ứng dụng
 * @param {Express} app - Express application instance
 * @returns {Promise<void>}
 */
const security = async (app) => {
  // Thiết lập session và các middleware cơ bản
  setupSessionMiddleware(app);
  
  // Khởi tạo và cấu hình route permissions
  await initializeRoutePermissions();
  
  // Áp dụng middleware kiểm tra quyền truy cập route
  app.use(routePermissionMiddleware);

};

module.exports = security;
