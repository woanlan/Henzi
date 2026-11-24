"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
// [YÊU CẦU CÔ - Lab 4 (Form Validation)] Import hàm kiểm tra định dạng Email
import { validateEmail } from "@/lib/validation";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email, true);
    if (err) {
      setEmailError(err);
      setSubscribed(false);
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="mt-auto border-t border-stone-200 bg-white text-stone-600 text-xs">
      {/* 1. NEWSLETTER PROMO STRIP (Wolf Terra Signature) */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Đăng Ký Nhận Bản Tin Ưu Đãi
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Nhận Ngay Ebook Từ Vựng HSK & Mã Giảm Giá 50K
            </h3>
            <p className="text-xs text-stone-300">
              Cập nhật mẹo thi HSK điểm cao, tài liệu luyện viết chữ Hán và voucher khóa học mới nhất mỗi tuần.
            </p>
          </div>

          <form
            noValidate
            onSubmit={handleSubscribe}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-start gap-2 max-w-md"
          >
            <div className="relative w-full sm:w-72">
              <input
                type="email"
                aria-label="Email nhận bản tin ưu đãi"
                aria-invalid={Boolean(emailError)}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="Nhập email của bạn..."
                className={`w-full pl-4 pr-4 py-3 rounded-xl bg-white/10 border text-white placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white/15 transition-all ${
                  emailError ? "border-red-400 bg-red-500/10" : "border-white/20"
                }`}
              />
              {emailError && (
                <p className="text-[11px] text-red-300 font-medium flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-xs transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{subscribed ? "Đã Đăng Ký ✓" : "Nhận Mã Ngay"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* 2. MAIN FOOTER (4 Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Cột 1: Về Hanzi Master */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-center font-hanzi font-black text-lg shadow-sm">
                字
              </div>
              <div>
                <span className="font-extrabold text-stone-900 text-base tracking-tight">
                  HANZI MASTER
                </span>
                <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                  HSK 3.0
                </span>
              </div>
            </div>
            <p className="text-stone-500 text-xs leading-relaxed">
              Học viện đào tạo tiếng Trung & Luyện thi HSK toàn diện từ HSK 1 đến HSK 6, tích hợp thuật toán lặp lại ngắt quãng SRS, luyện viết chữ Hán thuận bút và gia sư AI thông minh.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-bold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cam kết chuẩn đầu ra chứng chỉ quốc tế</span>
            </div>
          </div>

          {/* Cột 2: Danh Mục Khóa Học */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
              Khóa Học Tiêu Biểu
            </h4>
            <ul className="space-y-2 text-stone-600 text-xs">
              <li>
                <Link href="/products" className="hover:text-amber-600 transition-colors">
                  • Trọn bộ khóa học HSK 1 đến HSK 6
                </Link>
              </li>
              <li>
                <Link href="/detail/business-taobao" className="hover:text-amber-600 transition-colors">
                  • Tiếng Trung Thương Mại Taobao & 1688
                </Link>
              </li>
              <li>
                <Link href="/detail/communication-daily" className="hover:text-amber-600 transition-colors">
                  • Tiếng Trung Giao Tiếp Phản Xạ Đời Sống
                </Link>
              </li>
              <li>
                <Link href="/detail/pinyin-master" className="hover:text-amber-600 transition-colors">
                  • Nhập Môn Phát Âm Pinyin & Thuận Bút
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-600 transition-colors font-bold text-amber-700">
                  • Gói Học VIP Trọn Đời (Giảm 70%)
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ Trợ Khách Hàng */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-stone-600 text-xs">
              <li>
                <Link href="/about" className="hover:text-amber-600 transition-colors">
                  • Giới thiệu về Học Viện Hanzi Master
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-600 transition-colors">
                  • Chính sách bảo hành học phí 7 ngày
                </Link>
              </li>
              <li>
                <Link href="/category" className="hover:text-amber-600 transition-colors">
                  • Hướng dẫn kiểm tra trình độ & xếp lớp
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-600 transition-colors">
                  • Điều khoản sử dụng & bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link href="/products#vouchers" className="hover:text-amber-600 transition-colors">
                  • Ví voucher & mã giảm giá độc quyền
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thông Tin Liên Hệ */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
              Hệ Thống Đào Tạo
            </h4>
            <div className="space-y-2 text-stone-600 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Trụ sở chính: Hà Nội & TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hotline: <strong className="text-stone-900">1900 6868</strong> (08:00 - 22:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Email: <strong className="text-stone-900">support@hanzimaster.edu.vn</strong></span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-bold text-stone-700 block mb-1.5">
                  Phương Thức Thanh Toán Hỗ Trợ:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-[10px]">VNPAY</span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-[10px]">MoMo</span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-[10px]">ZaloPay</span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-[10px]">ShopeePay</span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-[10px]">Visa / Master</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
          <div>
            © 2026 <strong>HANZI MASTER</strong> — Bản quyền thuộc về Học Viện Tiếng Trung Hanzi Master.
          </div>
          <div className="flex items-center gap-3 text-stone-500">
            <Link href="/about" className="hover:text-amber-600 transition-colors">
              Về Chúng Tôi
            </Link>
            <span>•</span>
            <Link href="/products" className="hover:text-amber-600 transition-colors">
              Chính Sách Hoàn Tiền 100%
            </Link>
            <span>•</span>
            <Link href="/products" className="hover:text-amber-600 transition-colors">
              Điều Khoản Dịch Vụ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
