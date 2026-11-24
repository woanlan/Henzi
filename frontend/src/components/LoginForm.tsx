"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearCurrentUser, loginUser, saveCurrentUser } from "@/services/auth.service";
import { ILoginForm } from "@/interfaces/user";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearReduxUser, setReduxUser } from "@/store/slices/authSlice";
import { User, Lock, ArrowRight, CheckCircle2, AlertCircle, Sparkles, LogOut } from "lucide-react";
// [YÊU CẦU CÔ - Lab 4 (Form Validation)] Import hàm validation dùng chung từ lib/validation.ts
import { validateUsername, validateMinLength, hasErrors } from "@/lib/validation";

// ============================================================================
// [YÊU CẦU CÔ - Lab 4 (useState + Form) + Redux Toolkit + API POST /api/auth/login]
// - Quản lý Controlled Form (username, password, loading, error) bằng useState.
// - Khi đăng nhập thành công qua Backend MongoDB, cập nhật user vào Redux Store.
// - [VALIDATION] Kiểm tra dữ liệu bằng JS/TS trước khi gửi lên server:
//   + Tên đăng nhập: bắt buộc, tối thiểu 3 ký tự
//   + Mật khẩu: bắt buộc, không để trống
// ============================================================================
export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [mounted, setMounted] = useState(false);
  const [credentials, setCredentials] = useState<ILoginForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    dispatch(clearReduxUser());
  };

  // [YÊU CẦU CÔ - Lab 4 (Form Validation)] State lưu lỗi riêng từng trường input
  // Record<string, string>: key = tên field, value = thông báo lỗi (tiếng Việt)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
    // [YÊU CẦU CÔ - Validation] Xóa lỗi của field vừa được chỉnh sửa (real-time clear)
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFillDemo = (username: string, pass: string) => {
    setCredentials({ username, password: pass });
    setError("");
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Kiểm tra dữ liệu bằng JavaScript/TypeScript
    // TRƯỚC KHI gọi API - dùng noValidate trên <form> để hiển thị lỗi tiếng Việt thay cho HTML5
    const errors: Record<string, string> = {
      username: validateUsername(credentials.username),
      password: validateMinLength(credentials.password, 3, "Mật khẩu"),
    };

    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return; // Dừng lại, KHÔNG gọi API
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const result = await loginUser(credentials);
      if (result.success && result.user) {
        saveCurrentUser(result.user);
        dispatch(setReduxUser(result.user));
        setSuccess(true);
        const params =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;
        const redirectParam = params?.get("redirect");
        const nextUrl =
          redirectParam &&
          redirectParam.startsWith("/admin") &&
          result.user.role === "admin"
            ? "/admin"
            : "/";
        setTimeout(() => {
          router.push(nextUrl);
        }, 600);
      } else {
        setError(result.message || "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại!");
        setLoading(false);
      }
    } catch {
      setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 sm:p-9 rounded-3xl border border-stone-200 bg-white shadow-xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-1.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-hanzi text-2xl font-black mx-auto mb-3 shadow-md border border-amber-400/30">
          字
        </div>
        <h2 className="vankho-serif text-2xl font-medium text-stone-900 tracking-tight">
          Đăng Nhập Độc Giả &amp; Quản Trị
        </h2>
        <p className="text-xs text-stone-500">
          Tra cứu đơn đặt sách, ví phiếu ưu đãi &amp; quản lý kho sách HANZI
        </p>
      </div>

      {/* Active Session Banner (when already logged in) */}
      {mounted && currentUser && !success && (
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span>
              Đang đăng nhập:{" "}
              <strong className="font-mono text-stone-900">{currentUser.username}</strong>{" "}
              ({currentUser.role === "admin" ? "Quản trị viên" : "Độc giả"})
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {currentUser.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors"
              >
                <span>Vào trang Quản trị</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Demo Fill Helper */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Tài khoản trải nghiệm nhanh (bấm để tự điền):</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => handleFillDemo("admin", "123")}
            className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-mono text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
          >
            admin / 123 (Quản lý kho sách)
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo("student", "123")}
            className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-mono text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
          >
            student / 123 (Độc giả)
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đăng nhập thành công! Đang chuyển hướng về trang chủ...</span>
        </div>
      )}

      {/* Form Fields (noValidate tắt popup HTML5 để dùng bộ bắt lỗi React/TS) */}
      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
          >
            Tên Đăng Nhập <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </span>
            <input
              id="username"
              type="text"
              name="username"
              aria-invalid={Boolean(fieldErrors.username)}
              value={credentials.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white ${fieldErrors.username ? "border-red-400 bg-red-50/40" : "border-stone-200"}`}
            />
          </div>
          {/* [YÊU CẦU CÔ - Validation] Hiển thị lỗi inline bên dưới input */}
          {fieldErrors.username && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {fieldErrors.username}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
          >
            Mật Khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="password"
              type="password"
              name="password"
              aria-invalid={Boolean(fieldErrors.password)}
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white ${fieldErrors.password ? "border-red-400 bg-red-50/40" : "border-stone-200"}`}
            />
          </div>
          {/* [YÊU CẦU CÔ - Validation] Hiển thị lỗi inline bên dưới input password */}
          {fieldErrors.password && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-amber-600/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Đang xác thực tài khoản...</span>
          ) : (
            <>
              <span>Đăng Nhập Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
        Bạn chưa có thẻ độc giả?{" "}
        <Link
          href="/register"
          className="font-bold text-amber-700 hover:text-amber-800 hover:underline"
        >
          Mở thẻ độc giả mới ngay →
        </Link>
      </div>
    </div>
  );
}
