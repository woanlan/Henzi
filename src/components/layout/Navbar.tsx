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
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, currentHskLevel, setCurrentHskLevel, switchRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Tổng Quan", icon: Compass },
    { href: "/curriculum", label: "Giáo Trình", icon: BookOpen },
    { href: "/vocabulary", label: "Từ Vựng SRS", icon: Zap },
    { href: "/listening", label: "Luyện Nghe", icon: Volume2 },
    { href: "/speaking", label: "Luyện Nói", icon: Mic },
    { href: "/writing", label: "Luyện Viết", icon: PenTool },
    { href: "/grammar", label: "Ngữ Pháp", icon: GraduationCap },
    { href: "/exams", label: "Thi Thử HSK", icon: FileCheck },
    { href: "/ai-tutor", label: "Gia Sư AI", icon: Sparkles, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/90 bg-[#FAFAF9]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-hanzi text-xl font-bold shadow-sm transition-transform group-hover:scale-105">
                汉
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-stone-900 text-lg leading-none font-sans">
                  HANZI <span className="text-amber-600">MASTER</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium tracking-wider uppercase mt-0.5">
                  HSK 1–6 Tiếng Trung
                </span>
              </div>
            </Link>

            {/* Level Switcher Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200/70 border border-stone-200 transition-colors"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                <span>HSK {currentHskLevel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {levelDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-44 rounded-xl bg-white border border-stone-200 shadow-lg py-1.5 z-50"
                  onMouseLeave={() => setLevelDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Chọn Cấp Độ Mục Tiêu
                  </div>
                  {([1, 2, 3, 4, 5, 6] as HSKLevelNumber[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setCurrentHskLevel(lvl);
                        setLevelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentHskLevel === lvl
                          ? "font-bold text-amber-700 bg-amber-50/70"
                          : "text-stone-700"
                      }`}
                    >
                      <span>Cấp độ HSK {lvl}</span>
                      {currentHskLevel === lvl && (
                        <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                          Đang học
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-amber-100/80 text-amber-900 font-semibold shadow-xs"
                      : link.highlight
                      ? "text-amber-700 hover:bg-amber-50 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      link.highlight ? "text-amber-600" : "text-stone-500"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Link if admin */}
            {user.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pathname === "/admin"
                    ? "bg-red-100 text-red-800"
                    : "text-red-700 hover:bg-red-50"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Quản Trị</span>
              </Link>
            )}
          </nav>

          {/* User Gamification Badges & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold" title="Chuỗi ngày học liên tục">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{user.dailyStreak} ngày</span>
            </div>

            {/* XP Badge */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold" title="Điểm kinh nghiệm học tập">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span>{user.totalXp} XP</span>
            </div>

            {/* Role Switcher Pill (Student / Teacher / Admin) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-xs"
              >
                <span className="capitalize font-semibold text-stone-900">
                  {user.role === "student"
                    ? "Học viên"
                    : user.role === "teacher"
                    ? "Giáo viên"
                    : "Quản trị"}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-stone-200 shadow-xl py-1.5 z-50"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Đổi Vai Trò Demo
                  </div>
                  <button
                    onClick={() => {
                      switchRole("student");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-stone-100 flex items-center justify-between"
                  >
                    <span>Học viên (Student)</span>
                    {user.role === "student" && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole("teacher");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-stone-100 flex items-center justify-between"
                  >
                    <span>Giáo viên (Teacher)</span>
                    {user.role === "teacher" && <span className="text-amber-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole("admin");
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-stone-100 flex items-center justify-between text-red-700 font-semibold"
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
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500">Cấp độ hiện tại:</span>
            <div className="flex gap-1.5">
              {([1, 2, 3, 4, 5, 6] as HSKLevelNumber[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCurrentHskLevel(lvl)}
                  className={`w-7 h-7 rounded text-xs font-bold ${
                    currentHskLevel === lvl
                      ? "bg-amber-600 text-white"
                      : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-700 hover:bg-red-50"
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Quản Trị</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
