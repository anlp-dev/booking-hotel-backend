const { resExport } = require("../../enums/resExport");
const systemService = require("../../services/system/SystemService")

class SystemController {
  async getRouter(req, res){
    try{
      const resData = await systemService.getAllRoute();
      resExport(200, "Lấy danh sách route thành công", resData, res);
    }catch(e){
      resExport(500, e.message, null, res);
    }
  }

  async createNewRoute(req, res){
    try{
      const resData = await systemService.createRoute(req.body);
      resExport(200, "Tạo route thành công", resData, res);
    }catch(e){
      resExport(500, e.message, null, res);
    }
  }
}

module.exports = new SystemController();
