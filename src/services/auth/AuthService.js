const User = require("../../models/user/User");
const { v4: uuidv4 } = require("uuid");
const secret = require("../../configs/Secrets");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const STATUS_ACCOUNT = require("../../enums/statusAccount");
const Role = require("../../models/user/Role");
require('dotenv').config();

class authService {
  async login(data) {
    try {
      const { username, password } = data;
      const user = await User.findOne({ username }).populate("roleId", "code");
      
      if (!user) {
        throw new Error("Tài khoản không tồn tại!");
      }
      
      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Mật khẩu không chính xác!");
      }
      
      if (user.status === STATUS_ACCOUNT.INACTIVE) {
        throw new Error("Tài khoản chưa được kích hoạt.");
      }
      
      const token = this.generateToken(user._id, user.roleId.code);
      if (!token) {
        throw new Error("Lỗi khi tạo token!");
      }
      return token;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async loginWithGoogle(data){
    try{
      const {email, googleToken} = data;
      
      // Kiểm tra token Google (cần thêm thư viện axios)
      if (!googleToken) {
        throw new Error("Thiếu token xác thực Google!");
      }
      
      // TODO: Verify Google token using Google API
      // const verifyEndpoint = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`;
      // const response = await axios.get(verifyEndpoint);
      // if (!response.data || response.data.email !== email) {
      //   throw new Error("Token Google không hợp lệ!");
      // }
      
      const user = await User.findOne({email: email}).populate("roleId", "code");
      if(!user){
        throw new Error("Tài khoản không tồn tại, vui lòng đăng ký tài khoản!");
      }
      
      if (user.status === STATUS_ACCOUNT.INACTIVE) {
        throw new Error("Tài khoản chưa được kích hoạt.");
      }
      
      const token = this.generateToken(user._id, user.roleId.code);
      if(!token){
        throw new Error("Lỗi khi tạo token!");
      }
      return token;
    }catch(e){
      throw new Error(e.message);
    }
  }

  async getUserByID(userReq) {
    try {
      const user = await User.findById(userReq).populate("roleId", "code name");
      if (!user) {
        throw new Error("Không tìm thấy người dùng!");
      } else {
        return user;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  generateToken(userId, role) {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    return token;
  }
}

module.exports = new authService();
