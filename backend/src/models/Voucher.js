import mongoose from "mongoose";

// [YÊU CẦU CÔ - Mongoose Schema & Model: Bảng `vouchers` (Phiếu giảm giá mua sách) trong MongoDB]
const voucherSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    condition: { type: String, default: "Đơn sách từ 150.000₫" },
    expiry: { type: String, default: "HSD: 31/12/2026" },
    badge: { type: String, default: "Ưu Đãi" },
    discountAmount: { type: Number, default: 30000 },
    minOrderAmount: { type: Number, default: 150000 },
  },
  { timestamps: true }
);

voucherSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Voucher = mongoose.model("Voucher", voucherSchema);
