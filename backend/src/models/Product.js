import mongoose from "mongoose";

// [YÊU CẦU CÔ - Mongoose Schema & Model: Bảng `products` (Sách & Học liệu Tiếng Trung) trong MongoDB]
const editionSubSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Bìa mềm tiêu chuẩn" },
    price: { type: Number, default: 129000 },
    stock: { type: Number, default: 20 },
    dimensions: { type: String, default: "16 × 24 cm · Giấy kem chống lóa" },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    categoryId: { type: String, required: true, index: true },
    categoryName: { type: String, default: "" },
    author: { type: String, default: "Khương Lệ Bình · Học Viện Ngôn Ngữ Bắc Kinh" },
    publisher: { type: String, default: "NXB Tổng Hợp · Ấn Bản HANZI" },
    pages: { type: Number, default: 248 },
    publishYear: { type: Number, default: 2026 },
    isbn: { type: String, default: "978-604-892-101-8" },
    price: { type: String, required: true },
    originalPrice: { type: String, default: "" },
    period: { type: String, default: "Bìa mềm / Bìa cứng" },
    desc: { type: String, required: true },
    fullDesc: { type: String, default: "" },
    features: { type: [String], default: [] },
    duration: { type: String, default: "248 trang · Kèm Audio" },
    level: { type: String, default: "Sơ cấp HSK 1" },
    rating: { type: Number, default: 4.9 },
    studentsCount: { type: Number, default: 320 },
    popular: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    color: { type: String, default: "#D97706" },
    image: { type: String, default: "/images/book-covers/hsk-1.jpg" },
    lookbookImage: { type: String, default: "/images/courses/hsk-1.jpg" },
    editions: {
      paperback: {
        type: editionSubSchema,
        default: () => ({
          label: "Bìa mềm tiêu chuẩn",
          price: 129000,
          stock: 24,
          dimensions: "16 × 24 cm · Giấy kem chống lóa",
        }),
      },
      hardcover: {
        type: editionSubSchema,
        default: () => ({
          label: "Bìa cứng vải bố dập nhũ",
          price: 229000,
          stock: 10,
          dimensions: "17 × 24.5 cm · Bìa vải nhũ vàng 24K",
        }),
      },
    },
  },
  { timestamps: true }
);

productSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Product = mongoose.model("Product", productSchema);
