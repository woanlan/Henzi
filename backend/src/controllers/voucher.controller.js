import { Voucher } from "../models/Voucher.js";
import { isDatabaseConnected } from "../config/db.js";
import { getMemoryStore } from "../config/memoryStore.js";

// ============================================================================
// [YÊU CẦU CÔ - Controller Backend CRUD Mã Ưu Đãi (`vouchers` trong MongoDB)]
// Chuẩn hóa mã in hoa tự động và cung cấp dữ liệu cho `useVouchersSWR` ở Frontend.
// ============================================================================

export const getAllVouchers = async (_req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json(getMemoryStore().vouchers);
    }
    const list = await Voucher.find().sort({ createdAt: 1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createVoucher = async (req, res) => {
  try {
    const { id, code, title, desc, condition, expiry, badge } = req.body;
    if (!code || !title) {
      return res.status(400).json({ message: "Vui lòng nhập Mã code và Tên ưu đãi" });
    }

    const payload = {
      id: id || `vch-${Date.now().toString().slice(-4)}`,
      code: String(code).trim().toUpperCase(),
      title: String(title).trim(),
      desc: desc || "",
      condition: condition || "Mọi đơn sách",
      expiry: expiry || "HSD: 31/12/2026",
      badge: badge || "Ưu Đãi",
    };

    if (!isDatabaseConnected()) {
      getMemoryStore().vouchers.push(payload);
      return res.status(201).json(payload);
    }

    const created = await Voucher.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const patch = { ...req.body, id: req.params.id };
    if (patch.code) {
      patch.code = String(patch.code).trim().toUpperCase();
    }

    if (!isDatabaseConnected()) {
      const { vouchers } = getMemoryStore();
      const idx = vouchers.findIndex((v) => String(v.id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy mã ưu đãi" });
      }
      vouchers[idx] = { ...vouchers[idx], ...patch };
      return res.json(vouchers[idx]);
    }

    const updated = await Voucher.findOneAndUpdate(
      { id: req.params.id },
      { $set: patch },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy mã ưu đãi" });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { vouchers } = getMemoryStore();
      const idx = vouchers.findIndex((v) => String(v.id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy mã ưu đãi để xóa" });
      }
      vouchers.splice(idx, 1);
      return res.json({ success: true, id: req.params.id });
    }

    const deleted = await Voucher.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy mã ưu đãi để xóa" });
    }
    return res.json({ success: true, id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
