const rateLimit = require('express-rate-limit');

// Giới hạn request cho các API thông thường
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP tối đa 100 request trong 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.'
  }
});

// Giới hạn nghiêm ngặt hơn cho API login để ngăn chặn tấn công brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn mỗi IP tối đa 5 request đăng nhập trong 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau 15 phút.'
  }
});

module.exports = {
  standardLimiter,
  loginLimiter
}; 
