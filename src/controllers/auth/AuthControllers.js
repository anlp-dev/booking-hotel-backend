const authServices = require('../../services/auth/AuthService');
const {resExport} = require("../../enums/resExport");
const {MESSAGE} = require("../../messages/message");

class AuthControllers {
    async login (req, res){
        try{
            const resData = await authServices.login(req.body);
            resExport(MESSAGE.SUCCESS.status, MESSAGE.SUCCESS.message, resData, res);
        }catch (e) {
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

module.exports = new AuthControllers();