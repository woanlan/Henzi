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
  Home,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, currentHskLevel, setCurrentHskLevel, switchRole, toggleAiChat, isAiChatOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);

  // Core primary nav items (clean, uncluttered, perfectly balanced)
  const primaryNavLinks = [
    { href: "/dashboard", label: "Tổng Quan", icon: Compass },
    { href: "/vocabulary", label: "Từ Vựng", icon: Zap },
    { href: "/writing", label: "Luyện Viết", icon: PenTool },
    { href: "/exams", label: "Thi Thử HSK", icon: FileCheck },
    { href: "/leaderboard", label: "Đua Top", icon: Trophy },
  ];

  // Extended practice skills & labs in dropdown
  const practiceSkills = [
    { href: "/curriculum", label: "Hành Trình Duolingo & Giáo Trình", icon: Map, desc: "Bản đồ 9 trạm S-curve & 12 bài khóa HSK", badge: "Bản Đồ" },
    { href: "/match", label: "Mini-Game Nối Từ 60s", icon: Gamepad2, desc: "Phản xạ từ vựng chạy đua 60s cực vui", badge: "Game" },
    { href: "/writing", label: "Luyện Viết Chữ Hán", icon: PenTool, desc: "Tập viết thuận bút & Tự gõ mọi chữ" },
    { href: "/pinyin", label: "Bảng Âm Tiết Pinyin", icon: Sparkles, desc: "Ma trận 21 thanh mẫu & 4 thanh điệu" },
    { href: "/radicals", label: "Chiết Tự 214 Bộ Thủ", icon: BookOpen, desc: "Nguồn gốc chữ tượng hình & mẹo nhớ" },
    { href: "/listening", label: "Luyện Nghe Giọng Chuẩn", icon: Volume2, desc: "Giọng đọc Bắc Kinh đa tốc độ" },
    { href: "/speaking", label: "Luyện Nói & Chấm Điểm", icon: Mic, desc: "Nhận diện & chấm điểm phát âm" },
    { href: "/grammar", label: "Ngữ Pháp HSK", icon: GraduationCap, desc: "Bách khoa toàn thư ngữ pháp HSK" },
    { href: "/onboarding", label: "Đánh Giá Trình Độ", icon: Compass, desc: "Khảo sát mục tiêu & bài test chuẩn Duolingo" },
  ];

  const isPracticeActive = practiceSkills.some((s) => pathname === s.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/90 bg-[#FAFAF9]/95 backdrop-blur-md shadow-2xs transition-all overflow-x-clip">
      <div className="w-full max-w-[1600px] mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-1.5 sm:gap-2">
          {/* ======================================================== */}
          {/* 1. SEPARATE LOGO & BRAND SECTION                         */}
          {/* ======================================================== */}
          <div className="flex items-center shrink-0 gap-1.5 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 group hover:opacity-95 transition-opacity shrink-0"
              title="Về Trang Chủ HANZI MASTER"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-hanzi text-lg sm:text-xl font-black shadow-md border-2 border-amber-400/40 transition-transform group-hover:scale-105 shrink-0">
                汉
              </div>
              <div className="flex flex-col shrink-0">
                <span className="font-black tracking-tight text-stone-900 text-base sm:text-lg lg:text-xl leading-none font-sans whitespace-nowrap">
                  HANZI <span className="text-amber-600">MASTER</span>
                </span>
                <span className="text-[10px] text-stone-400 font-bold tracking-wider uppercase mt-0.5 whitespace-nowrap hidden 2xl:block">
                  HSK 1–6 Tiếng Trung
                </span>
              </div>
            </Link>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-stone-200 hidden md:block shrink-0" />

            {/* Level Switcher Selector (Responsive & Compact) */}
            <div className="relative hidden md:block shrink-0">
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="flex items-center gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-stone-800 transition-all shadow-2xs hover:border-amber-300 whitespace-nowrap shrink-0 cursor-pointer"
                title="Thay đổi cấp độ HSK mục tiêu"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="whitespace-nowrap">
                  <span className="hidden xl:inline">Cấp Độ </span>HSK {currentHskLevel}
                </span>
                <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-stone-400 shrink-0" />
              </button>

              {levelDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-48 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setLevelDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Chọn Cấp Độ Mục Tiêu
                  </div>
                  {([1, 2, 3, 4, 5, 6] as HSKLevelNumber[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setCurrentHskLevel(lvl);
                        setLevelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentHskLevel === lvl
                          ? "font-extrabold text-amber-800 bg-amber-50"
                          : "text-stone-700 font-medium"
                      }`}
                    >
                      <span>Cấp độ HSK {lvl}</span>
                      {currentHskLevel === lvl && (
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
                          Đang học
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. NAVIGATION BAR (RESPONSIVE & AUTO-BALANCED)            */}
          {/* ======================================================== */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-2 shrink-0">
            {/* Primary items */}
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-xl text-xs xl:text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold shadow-2xs border border-amber-200/80"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${isActive ? "text-amber-700" : "text-stone-500"}`} />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}

            {/* Practice Skills (Drop-down) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setPracticeDropdownOpen(!practiceDropdownOpen)}
                className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-xl text-xs xl:text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isPracticeActive
                    ? "bg-amber-100 text-amber-900 font-bold shadow-2xs border border-amber-200/80"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Layers className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${isPracticeActive ? "text-amber-700" : "text-stone-500"}`} />
                <span className="whitespace-nowrap">Kỹ Năng Khác</span>
                <ChevronDown className={`w-3 h-3 xl:w-3.5 xl:h-3.5 text-stone-400 shrink-0 transition-transform ${practiceDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {practiceDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 max-h-[82vh] overflow-y-auto rounded-2xl bg-white border border-stone-200 shadow-xl p-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setPracticeDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Các Phòng Luyện Tập & Công Cụ
                  </div>
                  {practiceSkills.map((skill) => {
                    const SkillIcon = skill.icon;
                    const isCurrent = pathname === skill.href;
                    return (
                      <Link
                        key={skill.href}
                        href={skill.href}
                        onClick={() => setPracticeDropdownOpen(false)}
                        className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                          isCurrent
                            ? "bg-amber-50 text-amber-900 font-bold"
                            : "hover:bg-stone-50 text-stone-800"
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-stone-100 text-amber-700 shrink-0 mt-0.5">
                          <SkillIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-stone-900 text-xs whitespace-nowrap">
                              {skill.label}
                            </span>
                            {skill.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 shrink-0">
                                {skill.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 block leading-tight mt-0.5 truncate">
                            {skill.desc}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Admin Link if role is admin */}
            {user.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                  pathname === "/admin"
                    ? "bg-red-100 text-red-800 shadow-2xs"
                    : "text-red-700 hover:bg-red-50"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span className="whitespace-nowrap">Quản Trị</span>
              </Link>
            )}
          </nav>

          {/* ======================================================== */}
          {/* 3. USER BADGES, GIA SƯ AI & ROLE SWITCHER                */}
          {/* ======================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Gia Sư AI - Always Prominent Action Button */}
            <button
              onClick={toggleAiChat}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-xs font-bold transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
                isAiChatOpen
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-linear-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border-amber-200/90 shadow-2xs"
              }`}
              title="Mở Gia Sư AI & Từ Điển Song Hướng"
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isAiChatOpen ? "text-white fill-white" : "text-amber-600 fill-amber-500/30"}`} />
              <span className="whitespace-nowrap">Gia Sư AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </button>

            {/* Streak Badge */}
            <div
              className="flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-2xs whitespace-nowrap shrink-0"
              title="Chuỗi ngày học liên tục"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse shrink-0" />
              <span className="whitespace-nowrap">
                {user.dailyStreak}
                <span className="hidden xl:inline"> ngày</span>
              </span>
            </div>

            {/* XP Badge (Visible on wider screens to keep compact view uncluttered) */}
            <div
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs whitespace-nowrap shrink-0"
              title="Điểm kinh nghiệm học tập"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600 shrink-0" />
              <span className="whitespace-nowrap">{user.totalXp} XP</span>
            </div>

            {/* Role Switcher Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-white hover:bg-stone-50 transition-all shadow-2xs whitespace-nowrap shrink-0 cursor-pointer"
                title="Thay đổi vai trò hiển thị"
              >
                <span className="capitalize whitespace-nowrap">
                  {user.role === "student"
                    ? "Học viên"
                    : user.role === "teacher"
                    ? "Giáo viên"
                    : "Quản trị"}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Đổi Vai Trò Trải Nghiệm
                  </div>
                  <button
                    onClick={() => {
                      switchRole("student");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-stone-100 flex items-center justify-between font-medium"
                  >
                    <span>Học viên (Student)</span>
                    {user.role === "student" && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole("teacher");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-stone-100 flex items-center justify-between font-medium"
                  >
                    <span>Giáo viên (Teacher)</span>
                    {user.role === "teacher" && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole("admin");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-stone-100 flex items-center justify-between text-red-700 font-bold"
                  >
                    <span>Quản trị viên (Admin)</span>
                    {user.role === "admin" && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 shrink-0 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. EXPANDED MOBILE MENU DRAWER                           */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-600">Cấp độ HSK mục tiêu:</span>
            <div className="flex gap-1.5">
              {([1, 2, 3, 4, 5, 6] as HSKLevelNumber[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCurrentHskLevel(lvl)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
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

          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { href: "/dashboard", label: "Tổng Quan", icon: Compass },
              { href: "/vocabulary", label: "Từ Vựng SRS", icon: Zap },
              { href: "/writing", label: "Luyện Viết Chữ", icon: PenTool },
              { href: "/exams", label: "Thi Thử HSK", icon: FileCheck },
              { href: "/leaderboard", label: "Đua Top Tuần", icon: Trophy },
              { href: "/curriculum", label: "Bản Đồ Duolingo", icon: Map, badge: "RPG" },
              { href: "/match", label: "Game Nối Từ 60s", icon: Gamepad2, badge: "Hot" },
              { href: "/pinyin", label: "Bảng Pinyin", icon: Sparkles },
              { href: "/radicals", label: "214 Bộ Thủ", icon: BookOpen },
              { href: "/listening", label: "Luyện Nghe", icon: Volume2 },
              { href: "/speaking", label: "Luyện Nói", icon: Mic },
              { href: "/grammar", label: "Ngữ Pháp", icon: GraduationCap },
              { href: "/onboarding", label: "Test Trình Độ", icon: Compass },
            ].map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500 text-white">
                      {link.badge}
                    </span>
                  )}
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

            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 col-span-2 border border-red-200 bg-red-50/50"
              >
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>Quản Trị Hệ Thống</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
