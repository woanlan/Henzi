import React from "react";
import Link from "next/link";
import { Phone, Clock, Sparkles, HelpCircle } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-stone-900 text-stone-300 text-[11px] py-1.5 px-4 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
        {/* Left: Promo Ticker */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Ưu Đãi Hôm Nay
          </span>
          <span className="font-medium text-stone-200">
            Nhập mã <strong className="text-amber-400 font-mono">HSKMASTER</strong> giảm ngay 50.000₫ cho mọi khóa học!
          </span>
        </div>

        {/* Right: Quick Links & Hotline */}
        <div className="hidden md:flex items-center gap-5 text-stone-400">
          <div className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <Phone className="w-3 h-3 text-amber-400" />
            <span>Tư vấn khóa học: <strong className="text-white">1900 6868</strong></span>
          </div>
          <span className="text-stone-700">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>Hỗ trợ: 08:00 - 22:00</span>
          </div>
          <span className="text-stone-700">|</span>
          <Link href="/about" className="hover:text-amber-300 transition-colors flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-stone-400" />
            <span>Hướng dẫn đăng ký</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
