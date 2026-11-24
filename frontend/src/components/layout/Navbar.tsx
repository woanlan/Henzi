"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IUser } from "@/interfaces/user";
import {
  AUTH_CHANGE_EVENT,
  clearCurrentUser,
  getSavedUser,
} from "@/services/auth.service";
import { useAiTutor } from "@/context/AiTutorContext";
import { useAppDispatch } from "@/store";
import { clearReduxUser } from "@/store/slices/authSlice";
import { TopBar } from "./TopBar";
import {
  Search,
  Phone,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  UserPlus,
  BookOpen,
  Layers,
  Award,
  Crown,
  LayoutDashboard,
} from "lucide-react";

// ============================================================================
// [YÊU CẦU CÔ - Lab 2 (Component) + useEffect + Context API + Redux Toolkit]
// - Context API (`useAiTutor`): Đọc `isAiChatOpen` và gọi `toggleAiChat` mở hộp AI.
// - useEffect: Lắng nghe sự kiện đăng nhập/đăng xuất để đồng bộ giao diện Navbar.
// - Redux Toolkit (`useAppDispatch`): Xóa user trên Redux Store khi bấm Đăng xuất.
// ============================================================================
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAiChatOpen, toggleAiChat } = useAiTutor();

  const [user, setUser] = useState<IUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // [YÊU CẦU CÔ - useEffect]: Đồng bộ trạng thái đăng nhập khi mở trang hoặc đổi tab
  useEffect(() => {
    const syncAuth = () => {
      setUser(getSavedUser());
    };

    syncAuth();
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const logout = () => {
    clearCurrentUser();
    dispatch(clearReduxUser());
    setUser(null);
  };

  const categories = [
    { id: "hsk", name: "Luyện Thi HSK Chuẩn Quốc Tế", desc: "HSK 1 đến HSK 6 & HSK 3.0", icon: Award },
    { id: "communication", name: "Tiếng Trung Giao Tiếp Đời Sống", desc: "Phản xạ du lịch, hỏi đường, mua sắm", icon: BookOpen },
    { id: "business", name: "Tiếng Trung Thương Mại & Đánh Hàng", desc: "Đàm phán Taobao, 1688, Logistics", icon: Crown },
    { id: "starter", name: "Nhập Môn Pinyin & Thuận Bút", desc: "Phát âm Bắc Kinh, 214 Bộ thủ", icon: Layers },
  ];

  const popularKeywords = ["HSK 1", "HSK 3", "Đánh hàng 1688", "Giao tiếp phản xạ", "Pinyin"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/products", label: "Khóa Học & Bảng Giá" },
    { href: "/category", label: "Lộ Trình HSK" },
    { href: "/about", label: "Về Hanzi Master" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-2xs">
      {/* 1. TOP BAR */}
      <TopBar />

      {/* 2. MAIN HEADER (Wolf Terra Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
            title="HANZI MASTER - Trang chủ học Tiếng Trung"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-center font-hanzi text-xl sm:text-2xl font-black shadow-md border border-amber-400/40 group-hover:scale-105 transition-transform shrink-0">
              字
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-stone-900 tracking-tight text-lg sm:text-xl group-hover:text-amber-600 transition-colors">
                  HANZI MASTER
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold uppercase tracking-wider hidden sm:inline-block">
                  HSK 3.0
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium hidden sm:block">
                Học Viện Tiếng Trung Chuyên Sâu
              </span>
            </div>
          </Link>

          {/* SEARCH BAR (Wolf Terra signature center search) */}
          <div className="hidden lg:flex flex-1 max-w-xl flex-col">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm khóa học HSK, từ vựng, Taobao, Pinyin..."
                className="w-full pl-4 pr-24 py-2.5 rounded-full border border-stone-300 bg-stone-50 text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-500 transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tìm kiếm</span>
              </button>
            </form>

            {/* Popular search tags */}
            <div className="flex items-center gap-2 pt-1 pl-2 text-[11px] text-stone-400">
              <span className="font-medium text-stone-500">Gợi ý:</span>
              {popularKeywords.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/products?q=${encodeURIComponent(tag)}`)}
                  className="hover:text-amber-600 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Hotline consultation */}
            <div className="hidden xl:flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-stone-400 font-medium">Tư vấn miễn phí</span>
                <span className="text-xs font-bold text-stone-900">1900 6868</span>
              </div>
            </div>

            {/* Auth / Account Profile */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold transition-colors shadow-2xs"
                    title="Vào trang Quản trị hệ thống dành cho Admin"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Vào Quản Trị</span>
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-stone-900 leading-tight">{user.username}</span>
                    <span className="text-[10px] text-amber-700 font-semibold uppercase">{user.role || "Học viên"}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Đăng xuất"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:text-amber-600 hover:bg-stone-50 transition-colors"
                >
                  <User className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">Tài Khoản</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                  <span>Đăng Ký</span>
                </Link>
              </div>
            )}

            {/* Cart / Enrolled Courses */}
            <Link
              href="/products"
              className="relative flex items-center gap-2 p-2 rounded-xl text-stone-700 hover:text-amber-600 transition-colors"
              title="Khóa học quan tâm"
            >
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-amber-100 hover:text-amber-800 transition-colors">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                3
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION BAR (Wolf Terra Sub-nav strip) */}
      <div className="bg-[#FAFAF9] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
          {/* CATEGORY MEGA DROPDOWN BUTTON */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Menu className="w-4 h-4" />
              <span>DANH MỤC KHÓA HỌC</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {categoryDropdownOpen && (
              <div
                onMouseLeave={() => setCategoryDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
              >
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      href={`/category?id=${cat.id}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-amber-50/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          {cat.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* MAIN NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "text-amber-700 font-bold bg-amber-50"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT HIGHLIGHT ACTIONS: THẦY GIÁO AI + VOUCHER */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleAiChat}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isAiChatOpen
                  ? "bg-stone-900 text-amber-300 border-stone-800 shadow-sm"
                  : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs"
              }`}
              title="Mở hộp thoại trò chuyện cùng Thầy Giáo AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Thầy Giáo AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <Link
              href="/products#vouchers"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-xs hover:shadow-md hover:scale-105 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Nhận Voucher 50K</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 p-1"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile nav links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Categories */}
          <div className="pt-2 border-t border-stone-100 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider pl-2">
              Danh Mục Khóa Học
            </span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category?id=${cat.id}`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-amber-50 hover:text-amber-700"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
