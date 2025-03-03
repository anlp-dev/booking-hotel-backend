const User = require("../../models/user/User");
const { v4: uuidv4 } = require("uuid");
const secret = require("../../configs/Secrets");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const STATUS_ACCOUNT = require('../../enums/statusAccount');
const Role = require('../../models/user/Role');
class authService {
    async login(data) {
        try {
            const { username, password } = data;
            const user = await User.findOne({ username }).populate('roleId', 'code');
            const token = this.generateToken(user._id, user.roleId.code);
            if (!token) {
                throw new Error("Lỗi khi tạo token!");
            }
            return token;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getUserByID(userReq){
        try{
            const user = await User.findById(userReq).populate('roleId', 'code name');
            if(!user){
                throw new Error("Không tìm thấy người dùng!");
            }
            else{
                return user;
            }
        }catch (e) {
            throw new Error(e);
        }
    }


    generateToken(userId, role) {
        const token = jwt.sign({ userId, role }, secret.JWT_SECRET_KEY, { expiresIn: '30m' });
        return token;
    }
}

module.exports = new authService();