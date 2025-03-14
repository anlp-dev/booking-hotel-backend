const { resExport } = require("../../enums/resExport");
const DiscountService = require("../../services/admin/DiscountService");

class DiscountController {
    async getDiscount(req, res) {
        try {
            const resData = await DiscountService.getAllDiscount();
            res.status(200).json(resData);
        } catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async createDiscount(req, res) {
        try {
            const resData = await DiscountService.createDiscount(req.body);
            res.status(201).json(resData);
        } catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async updateDiscount(req, res) {
        try {
            const resData = await DiscountService.updateDiscount(req.params.id, req.body);

            if (!resData) {
                return res.status(404).json({ message: "Không tìm thấy mã giảm giá để cập nhật" });
            }
            res.status(201).json(resData);
        } catch (e) {
            resExport(500, e.message, null, res);
        }
    }

    async getDiscountById(req, res) {
        try {
            const { id } = req.params;
            const resData = await DiscountService.detailDiscount(id);
            if (!resData) {
                return res.status(404).json({ message: "Không tìm thấy vật tư" });
            }
            res.status(200).json(resData);
        } catch (e) {
            resExport(500, e.message, null, res);
        }
    }


    async deleteDiscount(req, res) {
        try {
            const { id } = req.params;
            const resData = await DiscountService.deleteDiscount(id);
            if (!resData) {
                return res.status(404).json({ message: "Không tìm thấy mã giảm giá để xóa" });
            }
            res.status(200).json({ message: "Xóa mã giảm giá thành công" });
        } catch (e) {
            resExport(500, e.message, null, res);
        }
    }


}

module.exports = new DiscountController();