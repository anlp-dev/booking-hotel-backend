const User = require("../models/user/User");
const bcrypt = require("bcryptjs");
const STATUS_ACCOUNT = require("../enums/statusAccount");

const inputValidationLogin = async (req, res, next) => {
  try{
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 400, message: "Thiếu tài khoản hoặc mật khẩu" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ status: 401, message: "Tài khoản không tồn tại" });
    }

    if (user.status === STATUS_ACCOUNT.INACTIVE) {
      return res.status(401).json({ status: 401, message: "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt."})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 401, message: "Mật khẩu không chính xác" });
    }
    next();
  }catch (e) {
    res.status(500).json({ message: "Lỗi server: " + e.message });
  }
}

module.exports = { inputValidationLogin };
