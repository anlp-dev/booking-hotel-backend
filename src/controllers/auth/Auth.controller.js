const authServices = require('../../services/auth/Auth.service');
const {resExport} = require("../../enums/resExport");
const {MESSAGE} = require("../../messages/message");
const auth = require('../../middleware/AuthMiddleware');

class AuthController {
    async login (req, res){
        try{
            const resData = await authServices.login(req.body);
            resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.message, resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async loginGoogle(req, res){
      try{
        const resData = await authServices.loginWithGoogle(req.body);
        resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.message, resData, res);
      }catch(e){
        resExport(500, e.message, null, res);
      }
    }

    async logout(req, res) {
        try {
            const token = req.header('Authorization');
            await auth.invalidateToken(token);
            resExport(MESSAGE.SUCCESS.status, "Đăng xuất thành công", null, res);
        } catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getDetailUser(req, res){
        try{
            const res_data = await authServices.getUserByID(req.params.id);
            resExport(MESSAGE.SUCCESS.status, "Lấy thông tin người dùng thành công", res_data, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new AuthController();
