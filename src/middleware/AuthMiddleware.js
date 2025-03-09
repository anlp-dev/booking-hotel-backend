const jwt = require("jsonwebtoken");
const secret = require("../configs/Secrets");
const User = require("../models/user/User");
const {getPermissionsForUser} = require('../database/db');

// Simple token blacklist for invalidated tokens
const tokenBlacklist = new Set();

// Simple user cache to reduce database queries
const userCache = new Map();
const USER_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Helper function to get user from cache or database
const getUserById = async (userId) => {
  // Check if user is in cache and not expired
  const cachedUser = userCache.get(userId);
  if (cachedUser && cachedUser.timestamp > Date.now() - USER_CACHE_TTL) {
    return cachedUser.user;
  }
  
  // Get user from database
  const user = await User.findById(userId);
  
  // Update cache
  if (user) {
    userCache.set(userId, {
      user,
      timestamp: Date.now()
    });
  }
  
  return user;
};

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Token has been invalidated",
      });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, secret.JWT_SECRET_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 401,
          message: "Đã hết phiên đăng nhập vui lòng đăng nhập lại !",
        });
      }
      throw error;
    }
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Invalid token",
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Token has expired",
      });
    }

    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Người dùng không tồn tại !",
      });
    }

    if(user.status === "00"){
      return res.status(401).json({
        status: 401,
        message: "Tài khoản đã bị khóa hoặc vô hiệu hóa !",
      });
    }

    req.account = decoded;
    req.user = user; // Add user object to request for convenience
    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error.message || "Authentication failed",
    });
  }
};

// Function to invalidate a token (for logout)
auth.invalidateToken = (token) => {
  if (token && token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '');
  }
  tokenBlacklist.add(token);
  
  // Optional: Clean up blacklist periodically to prevent memory leaks
  // This is a simple implementation - in production, consider using Redis or another solution
};

// Function to clear user cache (useful when user data is updated)
auth.clearUserCache = (userId) => {
  if (userId) {
    userCache.delete(userId);
  } else {
    userCache.clear();
  }
};

module.exports = auth;
