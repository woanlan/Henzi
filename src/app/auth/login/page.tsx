"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { soundManager } from "@/lib/utils";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickDemoLogin = (role: "student" | "teacher" | "admin") => {
    soundManager.playSuccess();
    switchRole(role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-hanzi text-2xl font-bold shadow-sm">
            汉
          </div>
          <span className="font-extrabold text-stone-900 text-2xl tracking-tight">
            HANZI <span className="text-amber-600">MASTER</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-stone-900">
          {isRegister ? "Đăng ký tài khoản học tập mới" : "Đăng nhập vào tài khoản HANZI"}
        </h2>
        <p className="text-xs text-stone-500">
          Nền tảng học tiếng Trung HSK 1–6 hàng đầu cho người Việt
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          {/* Quick Demo Access Buttons */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block text-center">
              ⚡ Truy Cập Nhanh Trải Nghiệm Demo
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("student")}
                className="py-2 px-1 bg-white border border-amber-300 rounded-xl font-bold text-amber-800 hover:bg-amber-100/50 transition-colors text-center"
              >
                Học Viên
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("teacher")}
                className="py-2 px-1 bg-white border border-amber-300 rounded-xl font-bold text-amber-800 hover:bg-amber-100/50 transition-colors text-center"
              >
                Giáo Viên
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                className="py-2 px-1 bg-red-100 border border-red-300 rounded-xl font-bold text-red-800 hover:bg-red-200/50 transition-colors text-center"
              >
                Quản Trị
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hocvien@hanzimaster.edu.vn"
                  className="w-full px-4 py-2.5 pl-10 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pl-10 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span>{isRegister ? "Tạo Tài Khoản Mới" : "Đăng Nhập"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              {isRegister
                ? "Đã có tài khoản? Đăng nhập ngay"
                : "Chưa có tài khoản? Đăng ký miễn phí"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
