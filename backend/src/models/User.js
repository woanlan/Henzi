import mongoose from "mongoose";

// [YÊU CẦU CÔ - Mongoose Schema & Model: Bảng `users` (Tài khoản + Tự ẩn password khi trả JSON)]
const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true, index: true },
    password: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["student", "admin"], default: "student" },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
