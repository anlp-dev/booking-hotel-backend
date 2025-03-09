const routerManage = require('../models/system/RouterManage');

// Cache for storing route permissions
let routePermissionsCache = null;
let routePermissionsMap = new Map();

// Function to load route permissions from database
const loadRoutePermissions = async () => {
  try {
    const allRoutes = await routerManage.find({});
    const publicRoutes = allRoutes.filter(
      (r) => r.requireToken === false && r.status === "01"
    );
    
    // Create a more efficient lookup map
    routePermissionsMap.clear();
    publicRoutes.forEach(route => {
      const key = `${route.method}:${route.path}`;
      routePermissionsMap.set(key, true);
      
      // Also add wildcard method routes
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
    // Nếu không phải route công khai, chuyển sang middleware xác thực
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
  }, 60 * 60 * 1000); // Refresh every hour
};

module.exports = {
  routePermissionMiddleware,
  initializeRoutePermissions,
  loadRoutePermissions
}; 
