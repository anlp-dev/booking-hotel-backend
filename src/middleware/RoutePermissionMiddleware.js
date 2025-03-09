const mongoose = require("mongoose");
const routerManage = require('../models/system/RouterManage');

let routePermissionsCache = null;
let routePermissionsMap = new Map();

const pathToRegex = (path) => {
  const pattern = path.replace(/:[\w]+/g, "[^/]+");
  return new RegExp(`^${pattern}$`);
};

const loadRoutePermissions = async () => {
  try {
    const allRoutes = await routerManage.find({});
    const publicRoutes = allRoutes.filter(
      (r) => r.requireToken === false && r.status === "01"
    );
    publicRoutes.push({ method: "GET", path: "/register/verify/:id" });

    routePermissionsMap.clear(); 
    publicRoutes.forEach(route => {
      const key = `${route.method}:${route.path}`;
      const regex = pathToRegex(route.path);
      routePermissionsMap.set(key, { method: route.method, regex });

      if (route.method === "*") {
        ["GET", "POST", "PUT", "DELETE", "PATCH"].forEach(method => {
          const methodKey = `${method}:${route.path}`;
          routePermissionsMap.set(methodKey, { method, regex });
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

const routePermissionMiddleware = async (req, res, next) => {
  const isPublicRoute = Array.from(routePermissionsMap.values()).some(
    (route) => route.method === req.method && route.regex.test(req.path)
  );

  if (isPublicRoute) {
    next();
  } else {
    const authMiddleware = require('./AuthMiddleware');
    authMiddleware(req, res, next);
  }
};

const initializeRoutePermissions = async () => {
  await loadRoutePermissions();

  if (process.env.NODE_ENV !== 'production') {
    console.log("✅ Public routes loaded:", routePermissionsCache.length);
  }

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