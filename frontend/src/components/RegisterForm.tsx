"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";
import { IRegisterForm } from "@/interfaces/user";
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
// [YÊU CẦU CÔ - Lab 4 (Form Validation)] Import các hàm validation dùng chung
import {
  validateUsername,
  validateFullName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  hasErrors,
} from "@/lib/validation";

// ============================================================================
// [YÊU CẦU CÔ - Lab 4 (useState + Form đăng ký) + API POST /api/auth/register]
// Quản lý trạng thái các ô input, kiểm tra mật khẩu khớp nhau và gửi dữ liệu
// tạo tài khoản mới lưu trực tiếp vào collection `users` trong MongoDB.
// [VALIDATION] Kiểm tra JS/TS trước khi gửi API:
//   + username: đúng format (a-z, 0-9, _), 3-20 ký tự
//   + email: đúng định dạng có @
//   + password: tối thiểu 6 ký tự
//   + confirmPassword: phải khớp với password
//   + phone: 10 số, bắt đầu bằng 0 (không bắt buộc)
// ============================================================================
export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<IRegisterForm>({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // [YÊU CẦU CÔ - Lab 4 (Form Validation)] State lưu lỗi riêng từng trường
  // Record<string, string>: key = tên field, value = thông báo lỗi tiếng Việt
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    // [YÊU CẦU CÔ - Validation] Xóa lỗi field vừa sửa ngay khi người dùng bắt đầu gõ
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Validate từng trường bằng hàm JS/TS thuần
    // Chạy TẤT CẢ validators một lúc để hiển thị hết lỗi cùng lúc (không dừng ở lỗi đầu tiên)
    const errors: Record<string, string> = {
      username: validateUsername(formData.username),
      fullName: validateFullName(formData.fullName ?? "", true, "Họ và tên"),
      email: validateEmail(formData.email, true),
      phone: validatePhone(formData.phone ?? "", true),
      password: validatePassword(formData.password, 6),
      confirmPassword: validateConfirmPassword(
        formData.password ?? "",
        formData.confirmPassword ?? ""
      ),
    };

    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return; // Dừng lại, không gọi API khi còn lỗi
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const result = await registerUser(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 800);
      } else {
        setError(result.message || "Đăng ký không thành công. Vui lòng thử lại!");
        setLoading(false);
      }
    } catch {
      setError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto p-8 sm:p-9 rounded-3xl border border-stone-200 bg-white shadow-xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-1.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-hanzi text-2xl font-black mx-auto mb-3 shadow-md border border-amber-400/30">
          字
        </div>
        <h2 className="vankho-serif text-2xl font-medium text-stone-900 tracking-tight">
          Mở Thẻ Độc Giả Mới
        </h2>
        <p className="text-xs text-stone-500">
          Lưu tủ sách yêu thích, nhận mã ưu đãi HANZI50K &amp; đặt giao sách nhanh tại HANZI
        </p>
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Feedback */}
      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...</span>
        </div>
      )}

      {/* Register Form (noValidate tắt popup HTML5 để hiển thị lỗi tiếng Việt dưới từng ô) */}
      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="reg-username"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
            >
              Tên Đăng Nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="reg-username"
                type="text"
                name="username"
                aria-invalid={Boolean(fieldErrors.username)}
                value={formData.username}
                onChange={handleChange}
                placeholder="vd: hocvien01"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white ${fieldErrors.username ? "border-red-400 bg-red-50/40" : "border-stone-200"}`}
              />
            </div>
            {/* [YÊU CẦU CÔ - Validation] Lỗi inline username */}
            {fieldErrors.username && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.username}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reg-fullname"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
            >
              Họ Và Tên <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-fullname"
              type="text"
              name="fullName"
              aria-invalid={Boolean(fieldErrors.fullName)}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white ${fieldErrors.fullName ? "border-red-400 bg-red-50/40" : "border-stone-200"}`}
            />
            {/* [YÊU CẦU CÔ - Validation] Lỗi inline fullName */}
            {fieldErrors.fullName && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.fullName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="reg-email"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="reg-email"
                type="email"
                name="email"
                aria-invalid={Boolean(fieldErrors.email)}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white ${fieldErrors.email ? "border-red-400 bg-red-50/40" : "border-stone-200"}`}
              />
            </div>
            {/* [YÊU CẦU CÔ - Validation] Lỗi inline email */}
            {fieldErrors.email && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reg-phone"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
            >
              Số Điện Thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                aria-invalid={Boolean(fieldErrors.phone)}
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912 345 678"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white ${fieldErrors.phone ? "border-red-400 bg-red-50/40" : "border-stone-200"}`}
              />
            </div>
            {/* [YÊU CẦU CÔ - Validation] Lỗi inline phone */}
            {fieldErrors.phone && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="reg-password"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
            >
              Mật Khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="reg-password"
                type="password"
                name="password"
                aria-invalid={Boolean(fieldErrors.password)}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white ${fieldErrors.password ? "border-red-400 bg-red-50/40" : "border-stone-200"}`}
              />
            </div>
            {/* [YÊU CẦU CÔ - Validation] Lỗi inline password */}
            {fieldErrors.password && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reg-confirmpass"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
            >
              Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="reg-confirmpass"
                type="password"
                name="confirmPassword"
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white ${fieldErrors.confirmPassword ? "border-red-400 bg-red-50/40" : "border-stone-200"}`}
              />
            </div>
            {/* [YÊU CẦU CÔ - Validation] Lỗi inline confirmPassword */}
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-amber-600/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? (
            <span>Đang mở thẻ độc giả...</span>
          ) : (
            <>
              <span>Hoàn Tất Mở Thẻ Độc Giả</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
        Bạn đã có thẻ độc giả?{" "}
        <Link
          href="/login"
          className="font-bold text-amber-700 hover:text-amber-800 hover:underline"
        >
          Đăng nhập ngay →
        </Link>
      </div>
    </div>
  );
}
