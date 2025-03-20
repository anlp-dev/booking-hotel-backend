const {resExport} = require("../../enums/resExport");
const PaymentService = require("../../services/payment/PaymentService");
class PaymentController{
    async  createPayment(req, res){
        try{
            const resData = PaymentService.createPaymentUrl(req);
            resExport(200, "Thành công", resData, res);
        }catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getAllPayments(req, res){
        try {
            const payments = await PaymentService.getAllPayments();
            res.status(200).json(payments);
          } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách paymemt", error });
          }
    }


}

module.exports = new PaymentController();
