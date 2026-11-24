"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Heart,
  LogOut,
  Menu,
  Moon,
  Package,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Ticket,
  User,
  X,
} from "lucide-react";
import { IProduct } from "@/interfaces/product";
import { useAiTutor } from "@/context/AiTutorContext";
import { useBackendHealthSWR, useProductsSWR } from "@/hooks/useSwrApi";
import { validateEmail } from "@/lib/validation";
import { clearCurrentUser } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearReduxUser } from "@/store/slices/authSlice";
import { openCart } from "@/store/slices/cartSlice";
import { CenteredBookReaderModal } from "./CenteredBookReaderModal";
import { DetailTabMode } from "./VanKhoCoverFlowHero";
import { VanKhoDrawers } from "./VanKhoDrawers";

interface BookReaderModalContextValue {
  openBookReader: (bookId: string | number) => void;
}

const BookReaderModalContext =
  createContext<BookReaderModalContextValue | null>(null);

export function useBookReaderModal(): BookReaderModalContextValue | null {
  return useContext(BookReaderModalContext);
}

export const WISHLIST_STORAGE_KEY = "hanzi_vankho_wishlist";
export const THEME_STORAGE_KEY = "hanzi_vankho_theme";

const HOME_ANCHOR_NAV = [
  { label: "Kệ Sách 3D", href: "#hero-archive" },
  { label: "Tủ Chuyên Đề", href: "#collections" },
  { label: "Kho Sách", href: "#catalog" },
  { label: "Combo Boxset", href: "#boxsets" },
] as const;

const SUBPAGE_NAV = [
  { label: "Kệ Sách 3D", href: "/" },
  { label: "Tất Cả Sách", href: "/products" },
  { label: "Danh Mục Sách", href: "/category" },
  { label: "Về Hiệu Sách", href: "/about" },
] as const;

export interface VanKhoHeaderFooterShellProps {
  children: React.ReactNode;
  initialProducts?: IProduct[];
  isHomeAnchors?: boolean;
  externalWishlistIds?: Array<string | number>;
  onExternalToggleWishlist?: (id: string | number) => void;
  externalSelectedBookId?: string | number | null;
  externalDrawerTab?: DetailTabMode;
  onExternalCloseBookDrawer?: () => void;
  onExternalOpenBookDrawer?: (id: string | number, tab: DetailTabMode) => void;
  onQuickSearchClick?: () => void;
}

export function VanKhoHeaderFooterShell({
  children,
  initialProducts,
  isHomeAnchors = false,
  externalWishlistIds,
  onExternalToggleWishlist,
  externalSelectedBookId,
  externalDrawerTab,
  onExternalCloseBookDrawer,
  onExternalOpenBookDrawer,
  onQuickSearchClick,
}: VanKhoHeaderFooterShellProps) {
  const dispatch = useAppDispatch();
  const { toggleAiChat } = useAiTutor();
  const { isOnline } = useBackendHealthSWR(true);
  const { products: swrProducts, mutateProducts } =
    useProductsSWR(initialProducts);

  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const savedVoucherCount = useAppSelector(
    (s) => s.voucherWallet.savedCodes.length
  );
  const cartTotalQty = useAppSelector((s) =>
    s.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Internal fallback state when used on standalone subpages (/products, /detail/[id], /about, /login...)
  const [localWishlistIds, setLocalWishlistIds] = useState<
    Array<string | number>
  >([]);
  const [localSelectedBookId, setLocalSelectedBookId] = useState<
    string | number | null
  >(null);
  const [localDrawerTab, setLocalDrawerTab] =
    useState<DetailTabMode>("overview");

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Footer Newsletter State (with validation.ts)
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      }
      const rawWish = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (rawWish) {
        const parsed = JSON.parse(rawWish);
        if (Array.isArray(parsed)) setLocalWishlistIds(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    dispatch(clearReduxUser());
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const wishlistIds = externalWishlistIds ?? localWishlistIds;
  const handleToggleWishlist = (bookId: string | number) => {
    if (onExternalToggleWishlist) {
      onExternalToggleWishlist(bookId);
      return;
    }
    setLocalWishlistIds((prev) => {
      const exists = prev.some((id) => String(id) === String(bookId));
      const next = exists
        ? prev.filter((id) => String(id) !== String(bookId))
        : [...prev, bookId];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const activeBookId =
    externalSelectedBookId !== undefined
      ? externalSelectedBookId
      : localSelectedBookId;
  const activeBookTab = externalDrawerTab ?? localDrawerTab;

  const handleOpenBookDrawer = (
    productId: string | number,
    tab: DetailTabMode = "overview"
  ) => {
    setIsMobileMenuOpen(false);
    if (onExternalOpenBookDrawer) {
      onExternalOpenBookDrawer(productId, tab);
      return;
    }
    setLocalSelectedBookId(productId);
    setLocalDrawerTab(tab);
  };

  const handleCloseBookDrawer = () => {
    if (onExternalCloseBookDrawer) {
      onExternalCloseBookDrawer();
      return;
    }
    setLocalSelectedBookId(null);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(newsletterEmail, true);
    if (err) {
      setNewsletterError(err);
      setNewsletterDone(false);
      return;
    }
    setNewsletterError("");
    setNewsletterDone(true);
    setNewsletterEmail("");
  };

  const navItems = isHomeAnchors ? HOME_ANCHOR_NAV : SUBPAGE_NAV;

  // Giá trị hiển thị sau khi mount client nhằm đảm bảo SSR & Client Hydration khớp 100%
  const displayUser = mounted ? currentUser : null;
  const displaySavedVoucherCount = mounted ? savedVoucherCount : 0;
  const displayCartTotalQty = mounted ? cartTotalQty : 0;
  const displayWishlistCount = mounted ? wishlistIds.length : 0;
  const displayIsOnline = mounted ? isOnline : false;

  return (
    <BookReaderModalContext.Provider
      value={{
        openBookReader: (bookId) => handleOpenBookDrawer(bookId, "trial"),
      }}
    >
      <div
        className={`vankho-theme min-h-screen flex flex-col ${
          theme === "dark" ? "dark" : ""
        }`}
      >
      {/* ================================================================= */}
      {/* HEADER HIỆU SÁCH HANZI                                            */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-40 border-b border-(--vk-border) bg-(--vk-paper)/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 xl:gap-5 xl:px-8">
          {/* Brand Logo: [字] HANZI */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2.5 rounded-xl text-(--vk-fg) transition-colors hover:text-(--vk-brass)"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-(--vk-primary)/30 bg-(--vk-primary) font-hanzi text-base font-bold text-(--vk-primary-fg)">
              字
            </span>
            <span className="vankho-serif text-base font-semibold tracking-wide whitespace-nowrap text-(--vk-fg) sm:text-lg">
              HANZI
            </span>
          </Link>

          {/* Center Nav — shrink-0 at xl+ (1280px+) so links NEVER overlap right actions at any viewport */}
          <nav
            aria-label="Điều hướng Hiệu Sách HANZI"
            className="hidden shrink-0 items-center gap-1 xl:flex"
          >
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-xl px-3 text-sm font-medium text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-fg)"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-xl px-3 text-sm font-medium text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-fg)"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Editorial Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {/* Light / Dark Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Chuyển sang nền sáng Trắng Kem Hổ Phách"
                  : "Chuyển sang nền tối Đêm Thư Các"
              }
              title={
                theme === "dark"
                  ? "Nền sáng Trắng Kem Hổ Phách"
                  : "Nền tối Đêm Thư Các"
              }
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-brass) xl:min-h-[40px] xl:min-w-[40px]"
            >
              {theme === "dark" ? (
                <Sun className="size-5" aria-hidden="true" />
              ) : (
                <Moon className="size-5" aria-hidden="true" />
              )}
            </button>

            {/* Quick Search */}
            {onQuickSearchClick ? (
              <button
                type="button"
                onClick={onQuickSearchClick}
                aria-label="Tìm kiếm đầu sách"
                className="hidden min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-fg) md:inline-flex xl:min-h-[40px] xl:min-w-[40px]"
              >
                <Search className="size-5" aria-hidden="true" />
              </button>
            ) : (
              <Link
                href="/products"
                aria-label="Tìm kiếm đầu sách"
                className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-fg) md:inline-flex xl:min-h-[40px] xl:min-w-[40px]"
              >
                <Search className="size-5" aria-hidden="true" />
              </Link>
            )}

            {/* Archival AI Book Advisor & Dictionary Trigger */}
            <button
              type="button"
              onClick={toggleAiChat}
              aria-label="Mở Cố vấn Sách AI và Tra từ điển Hán ngữ"
              title="Cố Vấn Sách AI & Tra Từ Điển Hán Ngữ"
              className="hidden min-h-[40px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-3 text-xs font-semibold text-(--vk-fg) transition-colors hover:border-(--vk-primary) hover:text-(--vk-brass) sm:inline-flex"
            >
              <span className="font-hanzi text-sm font-bold text-(--vk-brass)" aria-hidden="true">
                书
              </span>
              <span>Cố vấn AI</span>
            </button>

            {/* Voucher Wallet Trigger */}
            <button
              type="button"
              onClick={() => setIsVoucherOpen(true)}
              aria-label={`Phiếu giảm giá mua sách (${displaySavedVoucherCount} mã đã lưu)`}
              title="Phiếu giảm giá mua sách"
              className="relative hidden min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-fg) sm:inline-flex xl:min-h-[40px] xl:min-w-[40px]"
            >
              <Ticket className="size-5" aria-hidden="true" />
              {displaySavedVoucherCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-(--vk-primary) vankho-mono text-[10px] font-bold text-(--vk-primary-fg)">
                  {displaySavedVoucherCount}
                </span>
              )}
            </button>

            {/* MongoDB Order History Trigger */}
            <button
              type="button"
              onClick={() => setIsOrdersOpen(true)}
              aria-label="Sổ đơn mua sách MongoDB"
              title="Sổ đơn đặt mua sách lưu trên MongoDB"
              className="relative hidden min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-fg) sm:inline-flex xl:min-h-[40px] xl:min-w-[40px]"
            >
              <Package className="size-5" aria-hidden="true" />
              <span
                aria-hidden="true"
                className={`absolute top-2.5 right-2.5 size-2 rounded-full ${
                  displayIsOnline ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </button>

            {/* Wishlist Trigger */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              aria-label={`Sách đã lưu (${displayWishlistCount})`}
              className="relative hidden min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-fg) sm:inline-flex xl:min-h-[40px] xl:min-w-[40px]"
            >
              <Heart className="size-5" aria-hidden="true" />
              {displayWishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-(--vk-primary) vankho-mono text-[10px] font-bold text-(--vk-primary-fg)">
                  {displayWishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart Trigger (Always visible even on 375px mobile!) */}
            <button
              type="button"
              onClick={() => dispatch(openCart())}
              aria-label={`Giỏ sách (${displayCartTotalQty} cuốn)`}
              title="Mở giỏ sách & thanh toán"
              className="relative inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-brass) xl:min-h-[40px] xl:min-w-[40px]"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {displayCartTotalQty > 0 && (
                <span className="absolute top-1.5 right-1.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-(--vk-primary) px-1 vankho-mono text-[10px] font-bold text-(--vk-primary-fg) tabular-nums">
                  {displayCartTotalQty}
                </span>
              )}
            </button>

            {/* Account / Login Link */}
            <Link
              href={displayUser?.role === "admin" ? "/admin" : "/login"}
              className="hidden min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-3 text-xs font-medium text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover) lg:inline-flex"
            >
              <User className="size-3.5 shrink-0 text-(--vk-brass)" aria-hidden="true" />
              <span className="max-w-[92px] truncate">
                {displayUser
                  ? displayUser.role === "admin"
                    ? "Quản trị"
                    : displayUser.username
                  : "Độc giả"}
              </span>
            </Link>

            {/* Direct Logout Button for Logged-in Readers & Admins */}
            {displayUser && (
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Đăng xuất tài khoản"
                title="Đăng xuất"
                className="hidden min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-muted) transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 lg:inline-flex"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            )}

            {/* Mobile / Tablet Hamburger (shown below xl when center nav is hidden) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label={isMobileMenuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-fg) xl:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-(--vk-border) bg-(--vk-surface) px-4 py-3 space-y-1 xl:hidden">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-(--vk-fg) hover:bg-(--vk-btn-hover)"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-(--vk-fg) hover:bg-(--vk-btn-hover)"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-(--vk-border)">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  toggleAiChat();
                }}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-(--vk-border-strong) text-xs font-semibold text-(--vk-fg)"
              >
                <Sparkles className="size-3.5 text-(--vk-brass)" aria-hidden="true" />
                <span>Cố vấn Sách AI</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsVoucherOpen(true);
                }}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-(--vk-border-strong) text-xs font-semibold text-(--vk-fg)"
              >
                <Ticket className="size-3.5 text-(--vk-brass)" aria-hidden="true" />
                <span>Ví mã ({displaySavedVoucherCount})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-(--vk-border-strong) text-xs font-semibold text-(--vk-fg)"
              >
                <Heart className="size-3.5 text-(--vk-brass)" aria-hidden="true" />
                <span>Sách lưu ({displayWishlistCount})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsOrdersOpen(true);
                }}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-(--vk-border-strong) text-xs font-semibold text-(--vk-fg)"
              >
                <Package className="size-3.5 text-(--vk-brass)" aria-hidden="true" />
                <span>Đơn mua sách</span>
              </button>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Link
                href={displayUser?.role === "admin" ? "/admin" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-(--vk-primary-light) px-3 text-xs font-semibold text-(--vk-brass)"
              >
                <User className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {displayUser
                    ? displayUser.role === "admin"
                      ? "Vào trang Quản trị Hiệu sách"
                      : `Tài khoản: ${displayUser.username}`
                    : "Đăng nhập / Đăng ký Độc giả"}
                </span>
              </Link>
              {displayUser && (
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Đăng xuất tài khoản"
                  className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  <LogOut className="size-3.5" aria-hidden="true" />
                  <span>Đăng xuất</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================================================================= */}
      {/* PAGE CONTENT                                                      */}
      {/* ================================================================= */}
      <main className="flex-1">{children}</main>

      {/* ================================================================= */}
      {/* ARCHIVAL BOOKSTORE FOOTER                                         */}
      {/* ================================================================= */}
      <footer className="border-t border-(--vk-border) bg-(--vk-paper) py-14 text-sm text-(--vk-muted)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-(--vk-primary) font-hanzi text-base font-bold text-(--vk-primary-fg)">
                  字
                </span>
                <span className="vankho-serif text-lg font-semibold text-(--vk-fg)">
                  HANZI
                </span>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-(--vk-muted)">
                Nhà sách &amp; Học liệu tiếng Trung chuyên biệt: Giáo trình HSK chuẩn Bắc Kinh, Từ điển chiết tự 214 bộ thủ, Vở luyện thư pháp Mễ Tự và ấn bản bìa cứng vải bố sưu tầm.
              </p>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--vk-brass)">
                <ShieldCheck className="size-4" aria-hidden="true" />
                <span>
                  Đóng gói chống sốc 3 lớp · Đổi mới 1-1 trong 7 ngày nếu cong gáy
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-4 text-xs">
              <div className="space-y-2">
                <p className="vankho-mono font-semibold uppercase tracking-wider text-(--vk-fg)">
                  Tàng Thư
                </p>
                <ul className="space-y-1.5">
                  <li>
                    <Link href="/" className="hover:text-(--vk-brass)">
                      Kệ sách 3D CoverFlow
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-(--vk-brass)">
                      Toàn bộ {swrProducts.length || 30} đầu sách
                    </Link>
                  </li>
                  <li>
                    <Link href="/category" className="hover:text-(--vk-brass)">
                      Phân loại theo chuyên đề
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="vankho-mono font-semibold uppercase tracking-wider text-(--vk-fg)">
                  Độc Giả
                </p>
                <ul className="space-y-1.5">
                  <li>
                    <Link href="/login" className="hover:text-(--vk-brass)">
                      Đăng nhập độc giả
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-(--vk-brass)">
                      Mở thẻ độc giả mới
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-(--vk-brass)">
                      Về Hiệu Sách HANZI
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Validated Bookstore Newsletter */}
            <div className="space-y-2.5 lg:col-span-3">
              <p className="vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-fg)">
                Nhận Bản Tin Sách Mới &amp; Mã HANZI50K
              </p>
              <form
                noValidate
                onSubmit={handleNewsletterSubmit}
                className="space-y-2"
              >
                <div className="flex gap-2">
                  <input
                    type="email"
                    aria-label="Email nhận bản tin sách mới"
                    aria-invalid={Boolean(newsletterError)}
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      setNewsletterError("");
                    }}
                    placeholder="docgia@hanzi.vn"
                    className={`h-10 min-w-0 flex-1 rounded-xl border bg-(--vk-surface) px-3 text-xs text-(--vk-fg) focus:outline-none ${
                      newsletterError
                        ? "border-red-400"
                        : "border-(--vk-border-strong)"
                    }`}
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-(--vk-primary) px-3.5 text-xs font-semibold text-(--vk-primary-fg) hover:bg-(--vk-primary-hover)"
                  >
                    <Send className="size-3.5" aria-hidden="true" />
                    <span>{newsletterDone ? "Đã gửi ✓" : "Đăng ký"}</span>
                  </button>
                </div>
                {newsletterError && (
                  <p className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>{newsletterError}</span>
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </footer>

        {/* ================================================================= */}
        {/* CENTERED 3D BOOK SPOTLIGHT MODAL (OPEN -> LEAF FLIP -> CLOSE)     */}
        {/* ================================================================= */}
        <CenteredBookReaderModal
          products={swrProducts}
          selectedBookId={activeBookId}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onClose={handleCloseBookDrawer}
        />

        {/* ================================================================= */}
        {/* GLOBAL SLIDE-OVER DRAWERS (CART, WISHLIST, VOUCHER, ORDERS)       */}
        {/* ================================================================= */}
        <VanKhoDrawers
          products={swrProducts}
          selectedCourseId={null}
          initialTab={activeBookTab}
          isWishlistOpen={isWishlistOpen}
          isVoucherOpen={isVoucherOpen}
          isOrdersOpen={isOrdersOpen}
          wishlistIds={wishlistIds}
          onCloseCourse={handleCloseBookDrawer}
          onOpenCourse={handleOpenBookDrawer}
          onCloseWishlist={() => setIsWishlistOpen(false)}
          onCloseVoucher={() => setIsVoucherOpen(false)}
          onCloseOrders={() => setIsOrdersOpen(false)}
          onOpenOrders={() => setIsOrdersOpen(true)}
          onToggleWishlist={handleToggleWishlist}
          onOrderCreated={() => {
            void mutateProducts();
          }}
        />
      </div>
    </BookReaderModalContext.Provider>
  );
}
