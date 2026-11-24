import mongoose from "mongoose";

// [YÊU CẦU CÔ - Mongoose Schema & Model: Bảng `categories` (Danh mục) trong MongoDB]
const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "BookOpen" },
    count: { type: Number, default: 0 },
    badge: { type: String, default: "" },
    color: { type: String, default: "#D97706" },
  },
  { timestamps: true }
);

categorySchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Category = mongoose.model("Category", categorySchema);
