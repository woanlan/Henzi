"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HSKLevelNumber } from "@/types";
import {
  Flame,
  Zap,
  Sparkles,
  BookOpen,
  Volume2,
  Mic,
  PenTool,
  GraduationCap,
  FileCheck,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Compass,
  Layers,
  Trophy,
  Gamepad2,
  Map,
  MessageSquare,
  Briefcase,
  Crown,
  Headphones,
  Printer,
  Languages,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, currentHskLevel, setCurrentHskLevel, switchRole, toggleAiChat, isAiChatOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);

  // 4 Core Primary Links only (Clean, spacious, uncrowded)
  const primaryNavLinks = [
    { href: "/dashboard", label: "Tổng Quan", icon: Compass },
    { href: "/vocabulary", label: "Từ Vựng", icon: Zap },
    { href: "/writing", label: "Luyện Viết", icon: PenTool },
    { href: "/exams", label: "Thi Thử HSK", icon: FileCheck },
  ];

  // Extended categorized skills in the dropdown
  const skillCategories = [
    {
      title: "Kỹ Năng Giao Tiếp",
      items: [
        { href: "/reading", label: "Đọc Hiểu Đa Tầng", icon: BookOpen, desc: "Tra từ trực tiếp & trắc nghiệm HSK" },
        { href: "/conversation", label: "Hội Thoại & Đóng Vai", icon: MessageSquare, desc: "Giao tiếp A/B thực tế, karaoke audio" },
        { href: "/dictation", label: "Chép Chính Tả (听写)", icon: Headphones, desc: "Luyện tai nghe & gõ chữ Hán" },
        { href: "/listening", label: "Luyện Nghe Giọng Chuẩn", icon: Volume2, desc: "Giọng đọc Bắc Kinh đa tốc độ" },
        { href: "/speaking", label: "Luyện Nói & Chấm Điểm", icon: Mic, desc: "Nhận diện & sửa thanh điệu AI" },
      ],
    },
    {
      title: "Bách Khoa Hán Ngữ & Công Cụ",
      items: [
        { href: "/measure-words", label: "Bách Khoa Lượng Từ", icon: Layers, desc: "50+ lượng từ cốt lõi & thử thách ghép" },
        { href: "/translate", label: "Dịch & Bóc Tách 3 Tầng", icon: Languages, desc: "Hán tự, Pinyin & Hán Việt tức thời" },
        { href: "/worksheet", label: "In Phiếu Viết Ô Mễ A4", icon: Printer, desc: "Xuất giấy luyện viết chữ Hán in mờ" },
        { href: "/grammar", label: "Ngữ Pháp & Bẫy Từ", icon: GraduationCap, desc: "Bách khoa toàn thư & bẫy 近义词" },
        { href: "/topics", label: "Từ Vựng Chuyên Ngành", icon: Briefcase, desc: "Đánh hàng 1688/Taobao, Logistics" },
      ],
    },
    {
      title: "Học Tập Mở Rộng",
      items: [
        { href: "/curriculum", label: "Hành Trình Duolingo", icon: Map, desc: "Lộ trình 9 trạm S-curve bài khóa" },
        { href: "/pinyin", label: "Bảng Âm Tiết Pinyin", icon: Sparkles, desc: "Ma trận 21 thanh mẫu & 4 thanh điệu" },
        { href: "/radicals", label: "Chiết Tự 214 Bộ Thủ", icon: BookOpen, desc: "Nguồn gốc chữ tượng hình" },
        { href: "/match", label: "Nối Từ 60 Giây", icon: Gamepad2, desc: "Phản xạ từ vựng chạy đua cực vui" },
        { href: "/leaderboard", label: "Bảng Vàng Đua Top", icon: Trophy, desc: "Xếp hạng kinh nghiệm học tập" },
      ],
    },
  ];

  const allSkills = skillCategories.flatMap((c) => c.items);
  const isSkillActive = allSkills.some((s) => pathname === s.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/90 bg-[#FAFAF9]/95 backdrop-blur-md shadow-2xs transition-all">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* ======================================================== */}
          {/* 1. BRAND LOGO & LEVEL PICKER                             */}
          {/* ======================================================== */}
          <div className="flex items-center shrink-0 gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group hover:opacity-95 transition-opacity shrink-0"
              title="Về Trang Chủ HANZI MASTER"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-hanzi text-lg font-black shadow-md border border-amber-400/40 transition-transform group-hover:scale-105 shrink-0">
                汉
              </div>
              <div className="flex flex-col shrink-0">
                <span className="font-black tracking-tight text-stone-900 text-base sm:text-lg leading-none font-sans whitespace-nowrap">
                  HANZI <span className="text-amber-600">MASTER</span>
                </span>
                <span className="text-[9px] text-stone-400 font-bold tracking-wider uppercase mt-0.5 whitespace-nowrap hidden sm:block">
                  HSK 1–6 Tiếng Trung
                </span>
              </div>
            </Link>

            {/* Level Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-stone-800 transition-all shadow-2xs hover:border-amber-300 whitespace-nowrap shrink-0 cursor-pointer"
                title="Thay đổi cấp độ HSK mục tiêu"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span>HSK {currentHskLevel}</span>
                <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
              </button>

              {levelDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-44 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setLevelDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Cấp Độ Mục Tiêu
                  </div>
                  {([1, 2, 3, 4, 5, 6] as HSKLevelNumber[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setCurrentHskLevel(lvl);
                        setLevelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors cursor-pointer ${
                        currentHskLevel === lvl
                          ? "font-extrabold text-amber-800 bg-amber-50"
                          : "text-stone-700 font-medium"
                      }`}
                    >
                      <span>Cấp độ HSK {lvl}</span>
                      {currentHskLevel === lvl && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. PRIMARY NAV LINKS & KỸ NĂNG DROPDOWN                  */}
          {/* ======================================================== */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs xl:text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold shadow-2xs border border-amber-200/80"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-700" : "text-stone-500"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Unified Mega Dropdown: Phòng Luyện Tập & Kỹ Năng */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs xl:text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSkillActive
                    ? "bg-amber-100 text-amber-900 font-bold shadow-2xs border border-amber-200/80"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Layers className={`w-3.5 h-3.5 shrink-0 ${isSkillActive ? "text-amber-700" : "text-stone-500"}`} />
                <span>Kỹ Năng Khác</span>
                <ChevronDown className={`w-3 h-3 text-stone-400 shrink-0 transition-transform ${skillsDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {skillsDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-[520px] rounded-3xl bg-white border border-stone-200 shadow-2xl p-5 z-50 animate-fadeIn grid grid-cols-2 gap-5"
                  onMouseLeave={() => setSkillsDropdownOpen(false)}
                >
                  {skillCategories.slice(0, 2).map((cat, cIdx) => (
                    <div key={cIdx} className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block pb-1 border-b border-stone-100">
                        {cat.title}
                      </span>
                      <div className="space-y-1">
                        {cat.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isCurrent = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setSkillsDropdownOpen(false)}
                              className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                                isCurrent
                                  ? "bg-amber-50 text-amber-900 font-bold"
                                  : "hover:bg-stone-50 text-stone-800"
                              }`}
                            >
                              <div className="p-1.5 rounded-lg bg-stone-100 text-amber-700 shrink-0 mt-0.5">
                                <ItemIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-stone-900 block leading-tight">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Bottom strip inside dropdown */}
                  <div className="col-span-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400 text-[11px]">
                      Khám phá thêm công cụ học tập HSK:
                    </span>
                    <div className="flex items-center gap-3 font-semibold text-amber-700">
                      <Link href="/pinyin" onClick={() => setSkillsDropdownOpen(false)} className="hover:underline">Bảng Pinyin</Link>
                      <Link href="/radicals" onClick={() => setSkillsDropdownOpen(false)} className="hover:underline">214 Bộ Thủ</Link>
                      <Link href="/match" onClick={() => setSkillsDropdownOpen(false)} className="hover:underline">Nối Từ 60s</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ======================================================== */}
          {/* 3. RIGHT ACTIONS: VIP, AI TUTOR, STREAK, MOBILE TOGGLE    */}
          {/* ======================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* VIP Upgrade Pill */}
            <Link
              href="/upgrade"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs whitespace-nowrap shrink-0 border border-amber-400/40"
              title="Nâng cấp VIP Master"
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>Nâng Cấp VIP</span>
            </Link>

            {/* Gia Sư AI Action */}
            <button
              onClick={toggleAiChat}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
                isAiChatOpen
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-linear-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border-amber-200/90 shadow-2xs"
              }`}
              title="Mở Gia Sư AI & Từ Điển Song Hướng"
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isAiChatOpen ? "text-white fill-white" : "text-amber-600 fill-amber-500/30"}`} />
              <span className="hidden sm:inline">Gia Sư AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </button>

            {/* Streak Badge */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-2xs whitespace-nowrap shrink-0"
              title="Chuỗi ngày học liên tục"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse shrink-0" />
              <span>{user.dailyStreak} ngày</span>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 lg:hidden shrink-0 cursor-pointer"
              title="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto animate-fadeIn">
          {/* Level Switcher in Mobile Drawer */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-600">Cấp độ HSK mục tiêu:</span>
            <div className="flex gap-1.5">
              {([1, 2, 3, 4, 5, 6] as HSKLevelNumber[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCurrentHskLevel(lvl)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentHskLevel === lvl
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { href: "/dashboard", label: "Tổng Quan", icon: Compass },
              { href: "/vocabulary", label: "Từ Vựng SRS", icon: Zap },
              { href: "/reading", label: "Luyện Đọc Hiểu", icon: BookOpen },
              { href: "/conversation", label: "Luyện Hội Thoại", icon: MessageSquare },
              { href: "/dictation", label: "Chép Chính Tả", icon: Headphones },
              { href: "/measure-words", label: "Bách Khoa Lượng Từ", icon: Layers },
              { href: "/translate", label: "Dịch & Bóc Tách", icon: Languages },
              { href: "/worksheet", label: "In Phiếu Viết A4", icon: Printer },
              { href: "/writing", label: "Luyện Viết Chữ", icon: PenTool },
              { href: "/exams", label: "Thi Thử HSK", icon: FileCheck },
              { href: "/topics", label: "Từ Vựng Chuyên Ngành", icon: Briefcase },
              { href: "/grammar", label: "Ngữ Pháp & Bẫy Từ", icon: GraduationCap },
              { href: "/pinyin", label: "Bảng Pinyin", icon: Sparkles },
              { href: "/radicals", label: "214 Bộ Thủ", icon: BookOpen },
              { href: "/match", label: "Nối Từ 60 Giây", icon: Gamepad2 },
              { href: "/upgrade", label: "Nâng Cấp Gói VIP", icon: Crown },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                toggleAiChat();
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all text-left col-span-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500/30 shrink-0" />
              <span>Gia Sư AI (Bật Hộp Thoại Chat & Voice)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
