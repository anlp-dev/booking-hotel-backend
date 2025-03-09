const routerManage = require('../models/system/RouterManage');

let routePermissionsCache = null;
let routePermissionsMap = new Map();

const loadRoutePermissions = async () => {
  try {
    const allRoutes = await routerManage.find({});
    const publicRoutes = allRoutes.filter(
      (r) => r.requireToken === false && r.status === "01"
    );
    
    routePermissionsMap.clear();
    publicRoutes.forEach(route => {
      const key = `${route.method}:${route.path}`;
      routePermissionsMap.set(key, true);
      
      if (route.method === "*") {
        ["GET", "POST", "PUT", "DELETE", "PATCH"].forEach(method => {
          routePermissionsMap.set(`${method}:${route.path}`, true);
        });
      }
    });
    
    routePermissionsCache = publicRoutes;
    return publicRoutes;
  } catch (error) {
    console.error("⚠ Error loading routes:", error);
    return [];
  }
};

// Middleware to check route permissions
const routePermissionMiddleware = async (req, res, next) => {
  const routeKey = `${req.method}:${req.path}`;
  const isPublicRoute = routePermissionsMap.has(routeKey);
  
  if (isPublicRoute) {
    next();
  } else {
    const authMiddleware = require('./AuthMiddleware');
    authMiddleware(req, res, next);
  }
};

// Initialize route permissions
const initializeRoutePermissions = async () => {
  await loadRoutePermissions();
  
  // Log only in development environment
  if (process.env.NODE_ENV !== 'production') {
    console.log("✅ Public routes loaded:", routePermissionsCache.length);
  }
  
  // Refresh route permissions every hour
  setInterval(async () => {
    await loadRoutePermissions();
    if (process.env.NODE_ENV !== 'production') {
      console.log("🔄 Route permissions refreshed");
    }
  }, 60 * 60 * 1000); 
};

module.exports = {
  routePermissionMiddleware,
  initializeRoutePermissions,
  loadRoutePermissions
}; 
