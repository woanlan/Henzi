import mongoose from "mongoose";

// [YÊU CẦU CÔ - Mongoose Schema & Model: Bảng `orders` (Đơn đặt mua sách & học liệu) trong MongoDB]
const orderItemSubSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true },
    bookName: { type: String, required: true },
    edition: {
      type: String,
      enum: ["paperback", "hardcover"],
      default: "paperback",
    },
    editionLabel: { type: String, default: "Bìa mềm tiêu chuẩn" },
    unitPrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, required: true, trim: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true, trim: true },
    shippingAddress: { type: String, default: "" },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    items: { type: [orderItemSubSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalNumeric: { type: Number, default: 0 },
    amount: { type: String, required: true },
    voucherCode: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    createdAt: { type: String, default: "Hôm nay" },
    timestampMs: { type: Number, default: () => Date.now(), index: true },
  },
  { timestamps: false }
);

orderSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Order = mongoose.model("Order", orderSchema);
