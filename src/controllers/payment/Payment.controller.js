const {resExport} = require("../../enums/resExport");
const PaymentService = require("../../services/payment/Payment.service");
class PaymentController{
    createPayment(req, res){
        try{
            const resData = PaymentService.createPaymentUrl(req);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }
}

module.exports = new PaymentController();
