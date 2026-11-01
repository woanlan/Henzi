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
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, currentHskLevel, setCurrentHskLevel, switchRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);

  // Core main nav items
  const primaryNavLinks = [
    { href: "/dashboard", label: "Tổng Quan", icon: Compass },
    { href: "/curriculum", label: "Giáo Trình", icon: BookOpen },
    { href: "/vocabulary", label: "Từ Vựng SRS", icon: Zap },
  ];

  // Practice skill labs
  const practiceSkills = [
    { href: "/listening", label: "Luyện Nghe", icon: Volume2, desc: "Giọng đọc Bắc Kinh đa tốc độ" },
    { href: "/speaking", label: "Luyện Nói", icon: Mic, desc: "Nhận diện & chấm điểm phát âm" },
    { href: "/writing", label: "Luyện Viết", icon: PenTool, desc: "Tập viết chữ Hán thuận bút" },
    { href: "/grammar", label: "Ngữ Pháp", icon: GraduationCap, desc: "Bách khoa toàn thư ngữ pháp HSK" },
  ];

  const secondaryNavLinks = [
    { href: "/exams", label: "Thi Thử HSK", icon: FileCheck },
    { href: "/ai-tutor", label: "Gia Sư AI", icon: Sparkles, highlight: true },
  ];

  const isPracticeActive = practiceSkills.some((s) => pathname === s.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/90 bg-[#FAFAF9]/95 backdrop-blur-md shadow-2xs transition-all">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ======================================================== */}
          {/* 1. SEPARATE LOGO & BRAND SECTION                         */}
          {/* ======================================================== */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3.5 group pr-2 hover:opacity-95 transition-opacity"
            >
              {/* Distinct Large Brand Icon */}
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-hanzi text-2xl font-black shadow-md border-2 border-amber-400/40 transition-transform group-hover:scale-105">
                汉
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-tight text-stone-900 text-xl sm:text-2xl leading-none font-sans">
                  HANZI <span className="text-amber-600">MASTER</span>
                </span>
                <span className="text-xs text-stone-500 font-bold tracking-wider uppercase mt-1">
                  HSK 1–6 Tiếng Trung
                </span>
              </div>
            </Link>

            {/* Prominent Vertical Divider separating Logo from controls */}
            <div className="h-10 w-px bg-stone-300 mx-5 lg:mx-6 hidden md:block" />

            {/* Level Switcher Selector (Enlarged) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold bg-amber-50/90 hover:bg-amber-100 border border-amber-200 text-stone-800 transition-all shadow-2xs hover:border-amber-300"
              >
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Cấp Độ HSK {currentHskLevel}</span>
                <ChevronDown className="w-4 h-4 text-stone-500" />
              </button>

              {levelDropdownOpen && (
                <div
                  className="absolute left-0 mt-2.5 w-52 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setLevelDropdownOpen(false)}
                >
                  <div className="px-4 py-1.5 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Chọn Cấp Độ Mục Tiêu
                  </div>
                  {([1, 2, 3, 4, 5, 6] as HSKLevelNumber[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setCurrentHskLevel(lvl);
                        setLevelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentHskLevel === lvl
                          ? "font-extrabold text-amber-800 bg-amber-50"
                          : "text-stone-700 font-medium"
                      }`}
                    >
                      <span>Cấp độ HSK {lvl}</span>
                      {currentHskLevel === lvl && (
                        <span className="text-[11px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
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
          {/* 2. ENLARGED & WELL-SPACED NAVIGATION                     */}
          {/* ======================================================== */}
          <nav className="hidden xl:flex items-center gap-2">
            {/* Primary items */}
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold shadow-2xs border border-amber-200/80"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-amber-700" : "text-stone-500"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Practice Skills (Drop-down or Direct Pills) */}
            <div className="relative">
              <button
                onClick={() => setPracticeDropdownOpen(!practiceDropdownOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isPracticeActive
                    ? "bg-amber-100 text-amber-900 font-bold shadow-2xs border border-amber-200/80"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Layers className={`w-4.5 h-4.5 ${isPracticeActive ? "text-amber-700" : "text-stone-500"}`} />
                <span>Luyện Kỹ Năng</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {practiceDropdownOpen && (
                <div
                  className="absolute left-0 mt-2.5 w-64 rounded-2xl bg-white border border-stone-200 shadow-xl p-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setPracticeDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    4 Kỹ Năng & Ngữ Pháp
                  </div>
                  {practiceSkills.map((skill) => {
                    const SkillIcon = skill.icon;
                    const isCurrent = pathname === skill.href;
                    return (
                      <Link
                        key={skill.href}
                        href={skill.href}
                        onClick={() => setPracticeDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl text-sm transition-colors ${
                          isCurrent
                            ? "bg-amber-50 text-amber-900 font-bold"
                            : "hover:bg-stone-50 text-stone-800"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-stone-100 text-amber-700 shrink-0 mt-0.5">
                          <SkillIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold block text-stone-900 text-sm">
                            {skill.label}
                          </span>
                          <span className="text-xs text-stone-500 block leading-tight mt-0.5">
                            {skill.desc}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Secondary items: Exam & AI Tutor */}
            {secondaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold shadow-2xs border border-amber-200/80"
                      : link.highlight
                      ? "bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200/70"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 ${
                      link.highlight ? "text-amber-600 fill-amber-500/20" : isActive ? "text-amber-700" : "text-stone-500"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Link if role is admin */}
            {user.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  pathname === "/admin"
                    ? "bg-red-100 text-red-800 shadow-2xs"
                    : "text-red-700 hover:bg-red-50"
                }`}
              >
                <ShieldAlert className="w-4.5 h-4.5 text-red-600" />
                <span>Quản Trị</span>
              </Link>
            )}
          </nav>

          {/* ======================================================== */}
          {/* 3. ENLARGED USER BADGES & ROLE SWITCHER                  */}
          {/* ======================================================== */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Streak Badge (Enlarged) */}
            <div
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-sm font-bold shadow-2xs"
              title="Chuỗi ngày học liên tục"
            >
              <Flame className="w-4.5 h-4.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{user.dailyStreak} ngày</span>
            </div>

            {/* XP Badge (Enlarged) */}
            <div
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-bold shadow-2xs"
              title="Điểm kinh nghiệm học tập"
            >
              <Zap className="w-4.5 h-4.5 fill-amber-500 text-amber-600" />
              <span>{user.totalXp} XP</span>
            </div>

            {/* Role Switcher Pill (Enlarged) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold text-stone-800 bg-white hover:bg-stone-50 transition-all shadow-2xs"
              >
                <span className="capitalize">
                  {user.role === "student"
                    ? "Học viên"
                    : user.role === "teacher"
                    ? "Giáo viên"
                    : "Quản trị"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-52 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-4 py-1.5 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Đổi Vai Trò Trải Nghiệm
                  </div>
                  <button
                    onClick={() => {
                      switchRole("student");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 flex items-center justify-between font-medium"
                  >
                    <span>Học viên (Student)</span>
                    {user.role === "student" && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole("teacher");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 flex items-center justify-between font-medium"
                  >
                    <span>Giáo viên (Teacher)</span>
                    {user.role === "teacher" && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole("admin");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 flex items-center justify-between text-red-700 font-bold"
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
              className="xl:hidden p-2.5 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. EXPANDED MOBILE MENU DRAWER                           */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-5 pt-4 pb-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-sm font-bold text-stone-600">Cấp độ HSK mục tiêu:</span>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5, 6] as HSKLevelNumber[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCurrentHskLevel(lvl)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
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

          <div className="grid grid-cols-2 gap-2 pt-2">
            {[...primaryNavLinks, ...practiceSkills, ...secondaryNavLinks].map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 text-amber-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold text-red-700 hover:bg-red-50 col-span-2 border border-red-200 bg-red-50/50"
            >
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Quản Trị Hệ Thống</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
