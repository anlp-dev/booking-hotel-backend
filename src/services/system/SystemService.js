const { loadRoutePermissions } = require("../../middleware/RoutePermissionMiddleware");
const RouteManage = require("../../models/system/RouterManage");

class SystemService {
  async getAllRoute(){
    try{
      const routes = await RouteManage.find({});
      if(!routes){
        throw new Error("Không tìm thấy dữ liệu");
      }
      return routes;
    }catch(e){
      throw new Error(e);
    }
  }

  async createRoute(dataReq){
    try{
      const {path, method, requireToken} = dataReq;
      const checkRoute = await RouteManage.findOne({path, method});
      if(checkRoute){
        throw new Error("Đường dẫn đã tồn tại");
      }
      const newRoute = new RouteManage({
        path,
        method,
        requireToken
      })
      await newRoute.save();
      await loadRoutePermissions();
      return newRoute;
    }catch(e){
      throw new Error(e);
    }
  }
}

module.exports = new SystemService();
