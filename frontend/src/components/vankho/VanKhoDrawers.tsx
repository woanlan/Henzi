"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  Heart,
  MapPin,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Star,
  Ticket,
  Trash2,
  Truck,
  Volume2,
  X,
} from "lucide-react";
import { IOrder, IOrderItem } from "@/interfaces/order";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { audioEngine } from "@/lib/audio";
import {
  hasErrors,
  validateEmail,
  validateFullName,
  validatePhone,
  validateShippingAddress,
  validateVoucherCode,
} from "@/lib/validation";
import { getSavedUser } from "@/services/auth.service";
import { createOrder, getAllOrders } from "@/services/order.service";
import { useVouchersSWR } from "@/hooks/useSwrApi";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addToCart,
  clearCart,
  closeCart,
  openCart,
  removeFromCart,
  updateCartQty,
} from "@/store/slices/cartSlice";
import {
  saveVoucherCode,
  selectActiveVoucher,
} from "@/store/slices/voucherWalletSlice";
import { BookEditionCover3D } from "./BookEditionCover3D";
import { CourseBook3DFlip } from "./CourseBook3DFlip";
import { DetailTabMode } from "./VanKhoCoverFlowHero";
import {
  formatVnd,
  FREE_SHIPPING_THRESHOLD,
  getCourseArchivalMeta,
  parseVndPrice,
  resolveBookEditions,
  STANDARD_SHIPPING_FEE,
} from "./vankho-data";

export interface VanKhoDrawersProps {
  products: IProduct[];
  selectedCourseId: string | number | null;
  initialTab: DetailTabMode;
  isWishlistOpen: boolean;
  isVoucherOpen: boolean;
  isOrdersOpen: boolean;
  wishlistIds: Array<string | number>;
  onCloseCourse: () => void;
  onOpenCourse: (productId: string | number, tab: DetailTabMode) => void;
  onCloseWishlist: () => void;
  onCloseVoucher: () => void;
  onCloseOrders: () => void;
  onOpenOrders?: () => void;
  onToggleWishlist: (id: string | number) => void;
  onOrderCreated?: () => void;
}

export function VanKhoDrawers({
  products,
  selectedCourseId,
  initialTab,
  isWishlistOpen,
  isVoucherOpen,
  isOrdersOpen,
  wishlistIds,
  onCloseCourse,
  onOpenCourse,
  onCloseWishlist,
  onCloseVoucher,
  onCloseOrders,
  onOpenOrders,
  onToggleWishlist,
  onOrderCreated,
}: VanKhoDrawersProps) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((s) => s.auth.currentUser);
  const { savedCodes, activeVoucherCode } = useAppSelector(
    (s) => s.voucherWallet
  );
  const { items: cartItems, isCartOpen } = useAppSelector((s) => s.cart);
  const { vouchers } = useVouchersSWR();

  const [activeTab, setActiveTab] = useState<DetailTabMode>(initialTab);
  const [selectedEdition, setSelectedEdition] =
    useState<BookEditionFormat>("paperback");
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  // Checkout form state inside CartDrawer (validated via validation.ts)
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [checkoutError, setCheckoutError] = useState("");
  const [createdReceipt, setCreatedReceipt] = useState<IOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Orders history state from MongoDB
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const selectedIndex =
    selectedCourseId !== null
      ? products.findIndex((p) => String(p.id) === String(selectedCourseId))
      : -1;
  const selectedBook = selectedIndex >= 0 ? products[selectedIndex] : null;
  const selectedMeta =
    selectedBook && selectedIndex >= 0
      ? getCourseArchivalMeta(selectedBook, selectedIndex)
      : null;

  useEffect(() => {
    if (!selectedBook) return;
    setActiveTab(initialTab);
    const eds = resolveBookEditions(selectedBook);
    setSelectedEdition(eds.paperback.stock > 0 ? "paperback" : "hardcover");
  }, [selectedBook, initialTab]);

  useEffect(() => {
    if (!isCartOpen) return;
    const saved = reduxUser || getSavedUser();
    setStudentName((prev) => prev || saved?.fullName || saved?.username || "");
    setEmail((prev) => prev || saved?.email || "");
    setPhone((prev) => prev || saved?.phone || "");
    if (activeVoucherCode && !voucherCode) {
      setVoucherCode(activeVoucherCode);
    }
    setFieldErrors({});
    setCheckoutError("");
  }, [isCartOpen, reduxUser, activeVoucherCode, voucherCode]);

  useEffect(() => {
    if (cartItems.length > 0 && createdReceipt) {
      setCreatedReceipt(null);
    }
  }, [cartItems.length, createdReceipt]);

  useEffect(() => {
    if (!isOrdersOpen) return;
    let ignore = false;
    setLoadingOrders(true);
    getAllOrders()
      .then((list) => {
        if (!ignore) setOrders(list);
      })
      .finally(() => {
        if (!ignore) setLoadingOrders(false);
      });
    return () => {
      ignore = true;
    };
  }, [isOrdersOpen]);

  // Close active drawer on Escape
  useEffect(() => {
    const anyOpen =
      selectedCourseId !== null ||
      isCartOpen ||
      isWishlistOpen ||
      isVoucherOpen ||
      isOrdersOpen;
    if (!anyOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseCourse();
        dispatch(closeCart());
        onCloseWishlist();
        onCloseVoucher();
        onCloseOrders();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    selectedCourseId,
    isCartOpen,
    isWishlistOpen,
    isVoucherOpen,
    isOrdersOpen,
    onCloseCourse,
    onCloseWishlist,
    onCloseVoucher,
    onCloseOrders,
    dispatch,
  ]);

  // Resolve full cart lines with book metadata, edition pricing & stock
  const resolvedCartLines = useMemo(() => {
    return cartItems
      .map((entry) => {
        const idx = products.findIndex(
          (p) => String(p.id) === String(entry.bookId)
        );
        if (idx < 0) return null;
        const book = products[idx];
        const meta = getCourseArchivalMeta(book, idx);
        const eds = resolveBookEditions(book);
        const ed = eds[entry.edition];
        const safeQty = Math.max(1, Math.min(Math.max(1, ed.stock), entry.quantity));
        return {
          book,
          meta,
          editionKey: entry.edition,
          editionObj: ed,
          quantity: safeQty,
          lineTotal: ed.price * safeQty,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cartItems, products]);

  const totalCartBooks = useMemo(
    () => resolvedCartLines.reduce((acc, item) => acc + item.quantity, 0),
    [resolvedCartLines]
  );

  const subtotal = useMemo(
    () => resolvedCartLines.reduce((acc, item) => acc + item.lineTotal, 0),
    [resolvedCartLines]
  );

  // Match voucher from MongoDB SWR list & compute discount
  const matchedVoucher = useMemo(() => {
    const clean = voucherCode.trim().toUpperCase();
    if (!clean) return null;
    return vouchers.find((v) => v.code.toUpperCase() === clean) || null;
  }, [voucherCode, vouchers]);

  const { discountAmount, shippingFee, voucherNotice } = useMemo(() => {
    if (subtotal <= 0) {
      return { discountAmount: 0, shippingFee: 0, voucherNotice: "" };
    }
    const baseShipping =
      subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

    if (!voucherCode.trim()) {
      return {
        discountAmount: 0,
        shippingFee: baseShipping,
        voucherNotice: "",
      };
    }

    if (!matchedVoucher) {
      return {
        discountAmount: 0,
        shippingFee: baseShipping,
        voucherNotice: "Mã chưa có trong danh mục ưu đãi hiện hành.",
      };
    }

    const minReq = matchedVoucher.minOrderAmount ?? 0;
    if (subtotal < minReq) {
      return {
        discountAmount: 0,
        shippingFee: baseShipping,
        voucherNotice: `Cần đơn từ ${formatVnd(minReq)} để áp mã ${matchedVoucher.code}.`,
      };
    }

    // Special FREESHIP handling
    if (matchedVoucher.code.toUpperCase().includes("SHIP")) {
      return {
        discountAmount: 0,
        shippingFee: 0,
        voucherNotice: `Đã miễn phí vận chuyển với mã ${matchedVoucher.code}!`,
      };
    }

    const rawDisc =
      matchedVoucher.discountAmount ?? parseVndPrice(matchedVoucher.badge) ?? 30000;
    const capped = Math.min(subtotal, rawDisc);
    return {
      discountAmount: capped,
      shippingFee: baseShipping,
      voucherNotice: `Đã giảm ${formatVnd(capped)} từ mã ${matchedVoucher.code}.`,
    };
  }, [subtotal, voucherCode, matchedVoucher]);

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSpeak = (text: string) => {
    setSpeakingWord(text);
    audioEngine.speak(text, {
      rate: 0.9,
      onEnd: () => setSpeakingWord(null),
      onError: () => setSpeakingWord(null),
    });
  };

  const handleAddSelectedBookToCart = () => {
    if (!selectedBook) return;
    const eds = resolveBookEditions(selectedBook);
    const chosen = eds[selectedEdition];
    if (chosen.stock <= 0) return;

    onCloseCourse();
    dispatch(
      addToCart({
        bookId: String(selectedBook.id),
        edition: selectedEdition,
        quantity: 1,
        maxStock: chosen.stock,
        openDrawer: true,
      })
    );
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvedCartLines.length === 0) return;

    // [YÊU CẦU CÔ - Validation JS/TS thuần] Kiểm tra đầy đủ Họ tên, SĐT, Địa chỉ nhận sách & Email/Voucher
    const errors: Record<string, string> = {
      studentName: validateFullName(studentName, true, "Họ và tên người nhận"),
      phone: validatePhone(phone, true),
      shippingAddress: validateShippingAddress(shippingAddress, true),
      email: validateEmail(email, false),
      voucherCode: validateVoucherCode(voucherCode, false),
    };

    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setCheckoutError("");

    const orderItems: IOrderItem[] = resolvedCartLines.map((line) => ({
      bookId: String(line.book.id),
      bookName: line.book.name,
      edition: line.editionKey,
      editionLabel:
        line.editionKey === "paperback" ? "Bìa mềm" : "Bìa cứng vải bố",
      unitPrice: line.editionObj.price,
      quantity: line.quantity,
    }));

    const summaryTitle = orderItems
      .map(
        (it) =>
          `${it.bookName} (${it.editionLabel}${
            it.quantity > 1 ? ` ×${it.quantity}` : ""
          })`
      )
      .join(" + ");

    try {
      const { order } = await createOrder({
        studentName: studentName.trim(),
        phone: phone.trim(),
        shippingAddress: shippingAddress.trim(),
        email: email.trim() || "docgia@hanzi.vn",
        courseId: orderItems[0].bookId,
        courseName: summaryTitle,
        items: orderItems,
        subtotal,
        discountAmount,
        shippingFee,
        totalNumeric: finalTotal,
        amount: formatVnd(finalTotal),
        voucherCode:
          matchedVoucher && subtotal >= (matchedVoucher.minOrderAmount ?? 0)
            ? matchedVoucher.code
            : voucherCode.trim() || undefined,
      });

      dispatch(clearCart());
      setCreatedReceipt(order);
      onOrderCreated?.();
    } catch {
      setCheckoutError(
        "Không thể gửi đơn đặt sách lúc này. Vui lòng kiểm tra kết nối máy chủ."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const wishlistedBooks = products.filter((p) =>
    wishlistIds.some((id) => String(id) === String(p.id))
  );

  const selectedBookEditions = selectedBook
    ? resolveBookEditions(selectedBook)
    : null;
  const activeBookEditionObj = selectedBookEditions
    ? selectedBookEditions[selectedEdition]
    : null;

  return (
    <>
      {/* ================================================================= */}
      {/* 1. BOOK DETAIL + 2-EDITION SELECTOR + 3D SAMPLE READING DRAWER    */}
      {/* ================================================================= */}
      <AnimatePresence>
        {selectedBook && selectedMeta && selectedBookEditions && activeBookEditionObj && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseCourse}
              aria-hidden="true"
              className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="vk-book-drawer-title"
              initial={{ x: "100%" }}
              animate={{
                x: 0,
                transition: { duration: 0.42, ease: [0.32, 0.72, 0, 1] },
              }}
              exit={{
                x: "100%",
                transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
              }}
              className="relative z-10 flex h-full w-full max-w-3xl flex-col border-l border-(--vk-border) bg-(--vk-surface) text-(--vk-fg) [box-shadow:var(--vk-elevation-drawer)]"
            >
              {/* Drawer Header */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-(--vk-border) bg-(--vk-surface) px-5 py-3.5 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate vankho-mono text-xs uppercase tracking-wider text-(--vk-brass) tabular-nums">
                    Ấn phẩm {selectedMeta.volumeCode} · ISBN {activeBookEditionObj.isbn}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(selectedBook.id)}
                    aria-label="Lưu sách vào tủ yêu thích"
                    className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-brass)"
                  >
                    <Heart
                      className={`size-4.5 ${
                        wishlistIds.some(
                          (id) => String(id) === String(selectedBook.id)
                        )
                          ? "fill-(--vk-brass) text-(--vk-brass)"
                          : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={onCloseCourse}
                    aria-label="Đóng ngăn kéo chi tiết sách"
                    className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) transition-colors hover:bg-(--vk-btn-hover) hover:text-(--vk-fg)"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Scrollable Drawer Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6">
                {/* Top Summary Block (3D Cover updates live between Paperback & Cloth Hardcover!) */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="mx-auto shrink-0 sm:mx-0">
                    <BookEditionCover3D
                      product={selectedBook}
                      meta={selectedMeta}
                      edition={selectedEdition}
                      size="sm"
                      showCaptionBadge={false}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-hanzi text-xs text-(--vk-muted)">
                      {selectedMeta.chineseSubtitle}
                    </p>
                    <h2
                      id="vk-book-drawer-title"
                      className="mt-1 vankho-serif text-2xl font-medium leading-tight text-(--vk-fg)"
                    >
                      {selectedBook.name}
                    </h2>

                    <p className="mt-1.5 text-xs font-medium text-(--vk-brass)">
                      {selectedBook.author || "Ban Biên Tập HANZI"} ·{" "}
                      {selectedBook.publisher || "NXB ĐH Ngôn Ngữ Bắc Kinh"}
                    </p>

                    <div className="mt-2 inline-flex items-center gap-1.5 vankho-mono text-xs tabular-nums text-(--vk-fg)">
                      <Star
                        className="size-3.5 fill-amber-500 text-amber-500"
                        aria-hidden="true"
                      />
                      <span className="font-semibold">
                        {(selectedBook.rating || 4.9).toFixed(1)}
                      </span>
                      <span className="text-(--vk-muted)">
                        ·{" "}
                        {(selectedBook.studentsCount || 850).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        bản đã phát hành
                      </span>
                    </div>

                    <p className="mt-3 border-l-2 border-(--vk-primary)/45 pl-3 vankho-serif text-sm italic leading-relaxed text-(--vk-muted)">
                      {selectedMeta.tagline}
                    </p>
                  </div>
                </div>

                {/* 2-Edition Selector Cards */}
                <div className="mt-6">
                  <p className="vankho-mono text-[11px] font-semibold uppercase tracking-wider text-(--vk-muted)">
                    Chọn hình thức ấn bản &amp; đóng gáy
                  </p>
                  <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {(["paperback", "hardcover"] as const).map((fmt) => {
                      const ed = selectedBookEditions[fmt];
                      const isChosen = selectedEdition === fmt;
                      const out = ed.stock <= 0;
                      return (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setSelectedEdition(fmt)}
                          aria-pressed={isChosen}
                          className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 text-left transition-colors ${
                            isChosen
                              ? "border-(--vk-primary) bg-(--vk-primary-light)/75 ring-1 ring-(--vk-primary)/35"
                              : "border-(--vk-border-strong) bg-(--vk-gallery) hover:bg-(--vk-btn-hover)"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-(--vk-fg)">
                              {ed.label}
                            </span>
                            {isChosen && (
                              <Check
                                className="size-4 shrink-0 text-(--vk-brass)"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <p className="mt-1.5 vankho-mono text-base font-bold text-(--vk-brass) tabular-nums">
                            {formatVnd(ed.price)}
                          </p>
                          <p className="mt-1 text-[11px] text-(--vk-muted)">
                            {ed.dimensions || "Giấy kem chống lóa"}
                          </p>
                          <p
                            className={`mt-1 vankho-mono text-[11px] font-medium tabular-nums ${
                              out
                                ? "text-red-500"
                                : ed.stock <= 5
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-700 dark:text-emerald-400"
                            }`}
                          >
                            {out ? "Tạm hết hàng" : `Còn ${ed.stock} cuốn trong kho`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2-Tab Navigation: Giới thiệu & Xuất bản | Đọc thử 3D & Phát âm */}
                <div
                  role="tablist"
                  aria-label="Chi tiết xuất bản và đọc thử 3D"
                  className="mt-6 flex items-center gap-5 border-b border-(--vk-border)"
                >
                  {(
                    [
                      { id: "trial", label: "Lật Đọc Thử 10 Trang (Sách 3D)" },
                      { id: "overview", label: "Giới thiệu & Xuất bản" },
                    ] as const
                  ).map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative min-h-[44px] cursor-pointer text-sm font-medium transition-colors ${
                          active
                            ? "text-(--vk-fg) after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-(--vk-primary)"
                            : "text-(--vk-muted) hover:text-(--vk-fg)"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: PUBLICATION DETAILS */}
                {activeTab === "overview" && (
                  <div className="space-y-6 pt-5">
                    <p className="text-sm leading-7 text-(--vk-fg)/90">
                      {selectedBook.fullDesc || selectedBook.desc}
                    </p>

                    <div>
                      <h3 className="vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-muted)">
                        Giá trị biên soạn &amp; Phụ lục đi kèm
                      </h3>
                      <ul className="mt-3 space-y-2.5">
                        {selectedBook.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3.5 text-sm text-(--vk-fg)"
                          >
                            <CheckCircle2
                              className="mt-0.5 size-4 shrink-0 text-(--vk-brass)"
                              aria-hidden="true"
                            />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bibliographic Spec Sheet */}
                    <div className="rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-4">
                      <h3 className="vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-muted)">
                        Thông tin thư mục xuất bản
                      </h3>
                      <dl className="mt-2 divide-y divide-(--vk-border) text-sm">
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                          <dt className="text-(--vk-muted)">Tác giả / Chủ biên</dt>
                          <dd className="font-medium text-(--vk-fg) text-right">
                            {selectedBook.author || "Ban Biên Tập HANZI"}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                          <dt className="text-(--vk-muted)">Nhà xuất bản</dt>
                          <dd className="font-medium text-(--vk-fg) text-right">
                            {selectedBook.publisher || "NXB ĐH Ngôn Ngữ Bắc Kinh"}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                          <dt className="text-(--vk-muted)">Số trang &amp; Năm in</dt>
                          <dd className="vankho-mono font-medium text-(--vk-fg)">
                            {selectedBook.pages || 240} trang ·{" "}
                            {selectedBook.publishYear || 2025}
                          </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                          <dt className="text-(--vk-muted)">Mã ISBN quốc tế</dt>
                          <dd className="vankho-mono text-xs font-medium text-(--vk-fg)">
                            {activeBookEditionObj.isbn}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href={`/detail/${selectedBook.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--vk-brass) hover:underline"
                      >
                        <span>Xem trên trang riêng /detail/{selectedBook.id}</span>
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB 2: 3D SAMPLE READING & AUDIO */}
                {activeTab === "trial" && (
                  <div className="space-y-6 pt-5">
                    <div className="rounded-xl border border-(--vk-border) bg-(--vk-gallery) px-4 py-5">
                      <p className="text-center vankho-mono text-[11px] uppercase tracking-[0.16em] text-(--vk-brass)">
                        Lật Trang Đọc Thử 3D · Nghe Audio Bắc Kinh Đi Kèm Sách
                      </p>
                      <CourseBook3DFlip
                        product={selectedBook}
                        meta={selectedMeta}
                        edition={selectedEdition}
                        initialOpen={true}
                      />
                    </div>

                    <div className="rounded-xl border border-(--vk-border) bg-(--vk-paper) p-5">
                      <p className="vankho-mono text-xs uppercase tracking-wider text-(--vk-brass)">
                        {selectedMeta.chapterTitle}
                      </p>
                      <h3 className="mt-1 vankho-serif text-lg font-medium text-(--vk-fg)">
                        Trích lục mục từ &amp; câu mẫu trong sách
                      </h3>

                      <div className="mt-4 space-y-3">
                        {selectedMeta.vocabSamples.map((v, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-(--vk-border) bg-(--vk-surface) p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-baseline gap-2.5">
                                  <span className="font-hanzi text-2xl font-bold text-(--vk-fg)">
                                    {v.hanzi}
                                  </span>
                                  <span className="vankho-mono text-xs font-semibold text-(--vk-brass)">
                                    [{v.pinyin}]
                                  </span>
                                </div>
                                <p className="mt-1 text-sm font-medium text-(--vk-fg)">
                                  {v.meaning}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSpeak(v.hanzi)}
                                className="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-(--vk-border-strong) bg-(--vk-surface-subtle) px-3 text-xs font-semibold text-(--vk-fg) transition-colors hover:border-(--vk-primary) hover:bg-(--vk-primary) hover:text-(--vk-primary-fg)"
                              >
                                <Volume2
                                  className={`size-3.5 ${
                                    speakingWord === v.hanzi
                                      ? "animate-pulse"
                                      : ""
                                  }`}
                                  aria-hidden="true"
                                />
                                <span>Nghe mẫu</span>
                              </button>
                            </div>

                            <div className="mt-3 border-t border-(--vk-border) pt-2.5 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-hanzi text-sm text-(--vk-fg)">
                                  例：{v.exampleZh}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleSpeak(v.exampleZh)}
                                  className="cursor-pointer text-(--vk-brass) hover:underline"
                                >
                                  Nghe câu
                                </button>
                              </div>
                              <p className="vankho-mono mt-0.5 text-[11px] text-(--vk-muted)">
                                {v.examplePinyin}
                              </p>
                              <p className="mt-0.5 italic text-(--vk-muted)">
                                → {v.exampleVn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Drawer Footer CTA */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-(--vk-border) bg-(--vk-surface) px-5 py-4 sm:px-6">
                <div>
                  <span className="block text-[11px] text-(--vk-muted)">
                    {activeBookEditionObj.label}
                  </span>
                  <span className="vankho-mono text-lg font-bold text-(--vk-brass) tabular-nums">
                    {formatVnd(activeBookEditionObj.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === "overview" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("trial")}
                      className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-3.5 text-xs font-semibold text-(--vk-fg) hover:bg-(--vk-btn-hover)"
                    >
                      <BookOpen className="size-4" />
                      <span>Đọc thử 3D</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAddSelectedBookToCart}
                    disabled={activeBookEditionObj.stock <= 0}
                    className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-(--vk-primary) px-5 text-sm font-semibold text-(--vk-primary-fg) hover:bg-(--vk-primary-hover) disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <ShoppingBag className="size-4" />
                    <span>
                      {activeBookEditionObj.stock <= 0
                        ? "Tạm hết hàng"
                        : "Thêm vào giỏ"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 2. REDUX SHOPPING CART + VOUCHER + SHIPPING CHECKOUT DRAWER       */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(closeCart())}
              aria-hidden="true"
              className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Giỏ sách và đặt giao hàng"
              initial={{ x: "100%" }}
              animate={{
                x: 0,
                transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
              }}
              exit={{ x: "100%", transition: { duration: 0.28 } }}
              className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-(--vk-border) bg-(--vk-surface) text-(--vk-fg) [box-shadow:var(--vk-elevation-drawer)]"
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-(--vk-border) px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-4.5 text-(--vk-brass)" />
                  <h2 className="vankho-serif text-lg font-medium">
                    Giỏ Sách HANZI ({totalCartBooks} cuốn)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(closeCart())}
                  aria-label="Đóng giỏ sách"
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) hover:bg-(--vk-btn-hover)"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {createdReceipt ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-5 space-y-3.5"
                  >
                    <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="size-5 shrink-0" />
                      <span>Đặt mua sách thành công!</span>
                    </div>

                    <p className="text-xs leading-relaxed text-(--vk-fg)/90">
                      Đơn hàng <strong className="vankho-mono">#{createdReceipt.id}</strong> đã được ghi vào <strong>MongoDB</strong> và tự động giữ tồn kho ấn bản cho bạn.
                    </p>

                    <div className="rounded-xl border border-(--vk-border) bg-(--vk-surface) p-3.5 space-y-1.5 text-xs">
                      <p className="font-semibold text-(--vk-fg)">
                        {createdReceipt.courseName}
                      </p>
                      <p className="text-(--vk-muted)">
                        Người nhận: <strong>{createdReceipt.studentName}</strong> ·{" "}
                        {createdReceipt.phone}
                      </p>
                      {createdReceipt.shippingAddress && (
                        <p className="text-(--vk-muted)">
                          Giao tới: {createdReceipt.shippingAddress}
                        </p>
                      )}
                      <p className="pt-1 vankho-mono text-sm font-bold text-(--vk-brass)">
                        Tổng thanh toán: {createdReceipt.amount}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCreatedReceipt(null);
                          dispatch(closeCart());
                          onOpenOrders?.();
                        }}
                        className="inline-flex min-h-[42px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-(--vk-primary) px-4 text-xs font-semibold text-(--vk-primary-fg) hover:bg-(--vk-primary-hover)"
                      >
                        <Package className="size-4" />
                        <span>Xem Sổ Đơn Mua Sách</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCreatedReceipt(null);
                          dispatch(closeCart());
                        }}
                        className="inline-flex min-h-[42px] cursor-pointer items-center justify-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-4 text-xs font-semibold text-(--vk-fg) hover:bg-(--vk-btn-hover)"
                      >
                        Tiếp tục chọn sách
                      </button>
                    </div>
                  </div>
                ) : resolvedCartLines.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <ShoppingBag className="size-10 text-(--vk-muted)/70" />
                    <p className="mt-3 vankho-serif text-lg font-medium text-(--vk-fg)">
                      Giỏ sách của bạn đang trống
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-(--vk-muted)">
                      Hãy chọn ấn bản Bìa mềm hoặc Bìa cứng khâu chỉ từ kệ sách 3D để bắt đầu tủ sách Hán ngữ của riêng bạn.
                    </p>
                    <button
                      type="button"
                      onClick={() => dispatch(closeCart())}
                      className="mt-5 inline-flex min-h-[42px] cursor-pointer items-center rounded-xl bg-(--vk-primary) px-5 text-xs font-semibold text-(--vk-primary-fg) hover:bg-(--vk-primary-hover)"
                    >
                      Khám phá kệ sách 3D
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Free Shipping Progress */}
                    <div className="rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-(--vk-fg)">
                        <Truck className="size-4 shrink-0 text-(--vk-brass)" />
                        {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                          <span>
                            Đơn sách đủ điều kiện{" "}
                            <strong className="text-emerald-700 dark:text-emerald-400">
                              Miễn phí giao hàng toàn quốc
                            </strong>
                            !
                          </span>
                        ) : (
                          <span>
                            Mua thêm{" "}
                            <strong className="vankho-mono text-(--vk-brass)">
                              {formatVnd(FREE_SHIPPING_THRESHOLD - subtotal)}
                            </strong>{" "}
                            để được miễn phí vận chuyển (hiện +25.000₫).
                          </span>
                        )}
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-(--vk-border)">
                        <div
                          className="h-full rounded-full bg-(--vk-primary) transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (subtotal / FREE_SHIPPING_THRESHOLD) * 100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Cart Items List */}
                    <ul className="space-y-3">
                      {resolvedCartLines.map((line) => (
                        <li
                          key={`${line.book.id}-${line.editionKey}`}
                          className="flex items-start gap-3 rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3"
                        >
                          <div className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-r-[4px] rounded-l-[2px] border border-black/20 shadow-sm">
                            <img
                              src={line.meta.bookCoverImage}
                              alt={line.book.name}
                              className="h-full w-full object-cover"
                            />
                            <span
                              aria-hidden="true"
                              className="vankho-spine-sheen pointer-events-none absolute inset-0"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="vankho-serif text-sm font-medium leading-snug text-(--vk-fg) line-clamp-2">
                                {line.book.name}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    removeFromCart({
                                      bookId: String(line.book.id),
                                      edition: line.editionKey,
                                    })
                                  )
                                }
                                aria-label={`Xóa ${line.book.name} khỏi giỏ`}
                                className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-(--vk-muted) hover:text-red-500"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>

                            <p className="mt-0.5 text-[11px] font-medium text-(--vk-muted)">
                              {line.editionKey === "paperback"
                                ? "Bìa mềm tiêu chuẩn"
                                : "Bìa cứng vải bố dập nhũ"}{" "}
                              · Kho còn {line.editionObj.stock}
                            </p>

                            <div className="mt-2.5 flex items-center justify-between gap-2">
                              <div className="inline-flex items-center rounded-lg border border-(--vk-border-strong) bg-(--vk-surface)">
                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch(
                                      updateCartQty({
                                        bookId: String(line.book.id),
                                        edition: line.editionKey,
                                        quantity: line.quantity - 1,
                                        maxStock: line.editionObj.stock,
                                      })
                                    )
                                  }
                                  aria-label="Giảm số lượng"
                                  className="inline-flex size-8 cursor-pointer items-center justify-center text-(--vk-fg) hover:bg-(--vk-btn-hover)"
                                >
                                  <Minus className="size-3.5" />
                                </button>
                                <span className="min-w-[28px] text-center vankho-mono text-xs font-semibold tabular-nums">
                                  {line.quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={line.quantity >= line.editionObj.stock}
                                  onClick={() =>
                                    dispatch(
                                      updateCartQty({
                                        bookId: String(line.book.id),
                                        edition: line.editionKey,
                                        quantity: line.quantity + 1,
                                        maxStock: line.editionObj.stock,
                                      })
                                    )
                                  }
                                  aria-label="Tăng số lượng"
                                  className="inline-flex size-8 cursor-pointer items-center justify-center text-(--vk-fg) hover:bg-(--vk-btn-hover) disabled:opacity-35"
                                >
                                  <Plus className="size-3.5" />
                                </button>
                              </div>

                              <span className="vankho-mono text-sm font-bold text-(--vk-brass) tabular-nums">
                                {formatVnd(line.lineTotal)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Voucher Input & Quick Redux/SWR Chips */}
                    <div className="rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="vk-cart-voucher"
                          className="text-xs font-semibold text-(--vk-fg)"
                        >
                          Mã giảm giá mua sách
                        </label>
                        {voucherCode && (
                          <button
                            type="button"
                            onClick={() => {
                              setVoucherCode("");
                              setFieldErrors((p) => ({ ...p, voucherCode: "" }));
                            }}
                            className="cursor-pointer text-[11px] text-(--vk-muted) hover:text-(--vk-fg)"
                          >
                            Bỏ mã
                          </button>
                        )}
                      </div>

                      <input
                        id="vk-cart-voucher"
                        type="text"
                        value={voucherCode}
                        aria-invalid={Boolean(fieldErrors.voucherCode)}
                        onChange={(e) => {
                          setVoucherCode(e.target.value.toUpperCase());
                          setFieldErrors((p) => ({ ...p, voucherCode: "" }));
                        }}
                        placeholder="Nhập HANZI50K, TANTHU30K, FREESHIP..."
                        className={`h-10 w-full rounded-xl border bg-(--vk-surface) px-3 vankho-mono text-xs text-(--vk-fg) focus:outline-none ${
                          fieldErrors.voucherCode
                            ? "border-red-400"
                            : "border-(--vk-border-strong)"
                        }`}
                      />

                      {fieldErrors.voucherCode && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{fieldErrors.voucherCode}</span>
                        </p>
                      )}

                      {voucherNotice && !fieldErrors.voucherCode && (
                        <p
                          className={`text-[11px] font-medium ${
                            discountAmount > 0 || shippingFee === 0
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {voucherNotice}
                        </p>
                      )}

                      {vouchers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {vouchers.map((v) => {
                            const active = voucherCode === v.code;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => {
                                  setVoucherCode(v.code);
                                  setFieldErrors((p) => ({
                                    ...p,
                                    voucherCode: "",
                                  }));
                                  dispatch(saveVoucherCode(v.code));
                                  dispatch(selectActiveVoucher(v.code));
                                }}
                                className={`cursor-pointer rounded-md border px-2 py-1 vankho-mono text-[11px] font-semibold transition-colors ${
                                  active
                                    ? "border-(--vk-primary) bg-(--vk-primary) text-(--vk-primary-fg)"
                                    : "border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-brass)"
                                }`}
                              >
                                {v.code} ({v.badge})
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Price Summary */}
                    <div className="rounded-xl border border-(--vk-border) bg-(--vk-paper) p-4 space-y-2 text-xs">
                      <div className="flex justify-between text-(--vk-muted)">
                        <span>Tạm tính ({totalCartBooks} cuốn)</span>
                        <span className="vankho-mono font-medium text-(--vk-fg) tabular-nums">
                          {formatVnd(subtotal)}
                        </span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                          <span>Ưu đãi Voucher</span>
                          <span className="vankho-mono font-semibold tabular-nums">
                            -{formatVnd(discountAmount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-(--vk-muted)">
                        <span>Đóng gói chống sốc &amp; Giao hàng</span>
                        <span className="vankho-mono font-medium text-(--vk-fg) tabular-nums">
                          {shippingFee === 0 ? "Miễn phí" : formatVnd(shippingFee)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between border-t border-(--vk-border) pt-2.5 text-sm font-semibold text-(--vk-fg)">
                        <span>Tổng thanh toán (COD)</span>
                        <span className="vankho-mono text-lg font-bold text-(--vk-brass) tabular-nums">
                          {formatVnd(finalTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Validated Shipping Form (`noValidate` + `validation.ts`) */}
                    <form
                      noValidate
                      onSubmit={handleCheckoutSubmit}
                      className="space-y-3.5 border-t border-(--vk-border) pt-4"
                    >
                      <p className="vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-brass)">
                        Thông tin người nhận &amp; Địa chỉ giao sách
                      </p>

                      {checkoutError && (
                        <div
                          role="alert"
                          className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-300"
                        >
                          {checkoutError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label
                            htmlFor="vk-ship-name"
                            className="block text-xs font-semibold text-(--vk-fg)"
                          >
                            Họ tên người nhận <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="vk-ship-name"
                            type="text"
                            aria-invalid={Boolean(fieldErrors.studentName)}
                            value={studentName}
                            onChange={(e) => {
                              setStudentName(e.target.value);
                              setFieldErrors((p) => ({ ...p, studentName: "" }));
                            }}
                            placeholder="Nguyễn Minh Anh"
                            className={`h-11 w-full rounded-xl border bg-(--vk-surface) px-3 text-sm text-(--vk-fg) focus:outline-none ${
                              fieldErrors.studentName
                                ? "border-red-400"
                                : "border-(--vk-border-strong)"
                            }`}
                          />
                          {fieldErrors.studentName && (
                            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                              <AlertCircle className="size-3.5 shrink-0" />
                              <span>{fieldErrors.studentName}</span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="vk-ship-phone"
                            className="block text-xs font-semibold text-(--vk-fg)"
                          >
                            Số điện thoại <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="vk-ship-phone"
                            type="tel"
                            aria-invalid={Boolean(fieldErrors.phone)}
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setFieldErrors((p) => ({ ...p, phone: "" }));
                            }}
                            placeholder="0901234567"
                            className={`h-11 w-full rounded-xl border bg-(--vk-surface) px-3 text-sm text-(--vk-fg) focus:outline-none ${
                              fieldErrors.phone
                                ? "border-red-400"
                                : "border-(--vk-border-strong)"
                            }`}
                          />
                          {fieldErrors.phone && (
                            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                              <AlertCircle className="size-3.5 shrink-0" />
                              <span>{fieldErrors.phone}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="vk-ship-address"
                          className="block text-xs font-semibold text-(--vk-fg)"
                        >
                          Địa chỉ nhận sách tận nơi{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="vk-ship-address"
                          type="text"
                          aria-invalid={Boolean(fieldErrors.shippingAddress)}
                          value={shippingAddress}
                          onChange={(e) => {
                            setShippingAddress(e.target.value);
                            setFieldErrors((p) => ({
                              ...p,
                              shippingAddress: "",
                            }));
                          }}
                          placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP"
                          className={`h-11 w-full rounded-xl border bg-(--vk-surface) px-3 text-sm text-(--vk-fg) focus:outline-none ${
                            fieldErrors.shippingAddress
                              ? "border-red-400"
                              : "border-(--vk-border-strong)"
                          }`}
                        />
                        {fieldErrors.shippingAddress && (
                          <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{fieldErrors.shippingAddress}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="vk-ship-email"
                          className="block text-xs font-semibold text-(--vk-fg)"
                        >
                          Email nhận phiếu xác nhận &amp; QR Audio (tùy chọn)
                        </label>
                        <input
                          id="vk-ship-email"
                          type="email"
                          aria-invalid={Boolean(fieldErrors.email)}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setFieldErrors((p) => ({ ...p, email: "" }));
                          }}
                          placeholder="docgia@hanzi.vn"
                          className={`h-11 w-full rounded-xl border bg-(--vk-surface) px-3 text-sm text-(--vk-fg) focus:outline-none ${
                            fieldErrors.email
                              ? "border-red-400"
                              : "border-(--vk-border-strong)"
                          }`}
                        />
                        {fieldErrors.email && (
                          <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>{fieldErrors.email}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--vk-primary) px-5 text-sm font-semibold text-(--vk-primary-fg) transition-colors hover:bg-(--vk-primary-hover) disabled:opacity-50"
                      >
                        <ShoppingBag className="size-4" />
                        <span>
                          {submitting
                            ? "Đang lưu đơn đặt sách vào MongoDB..."
                            : `Đặt mua sách · ${formatVnd(finalTotal)}`}
                        </span>
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 3. WISHLIST DRAWER (TỦ SÁCH YÊU THÍCH)                            */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseWishlist}
              aria-hidden="true"
              className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Tủ sách đã lưu"
              initial={{ x: "100%" }}
              animate={{
                x: 0,
                transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] },
              }}
              exit={{ x: "100%", transition: { duration: 0.28 } }}
              className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-(--vk-border) bg-(--vk-surface) text-(--vk-fg) [box-shadow:var(--vk-elevation-drawer)]"
            >
              <div className="flex items-center justify-between border-b border-(--vk-border) px-5 py-4">
                <div className="flex items-center gap-2">
                  <Heart className="size-4 text-(--vk-brass)" />
                  <h2 className="vankho-serif text-lg font-medium">
                    Sách Đã Lưu ({wishlistedBooks.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onCloseWishlist}
                  aria-label="Đóng danh sách yêu thích"
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) hover:bg-(--vk-btn-hover)"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {wishlistedBooks.length === 0 ? (
                  <p className="py-12 text-center text-sm text-(--vk-muted)">
                    Bạn chưa lưu ấn phẩm nào. Bấm biểu tượng trái tim trên bìa sách để lưu vào danh sách đọc sau.
                  </p>
                ) : (
                  wishlistedBooks.map((book, idx) => {
                    const wishMeta = getCourseArchivalMeta(book, idx);
                    const eds = resolveBookEditions(book);
                    const ed =
                      eds.paperback.stock > 0 ? eds.paperback : eds.hardcover;
                    const fmt: BookEditionFormat =
                      eds.paperback.stock > 0 ? "paperback" : "hardcover";

                    return (
                      <div
                        key={book.id}
                        className="flex items-center gap-3 rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3"
                      >
                        <div className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-r-[4px] rounded-l-[2px] border border-black/20 shadow-sm">
                          <img
                            src={wishMeta.bookCoverImage}
                            alt={book.name}
                            className="h-full w-full object-cover"
                          />
                          <span
                            aria-hidden="true"
                            className="vankho-spine-sheen pointer-events-none absolute inset-0"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => {
                              onCloseWishlist();
                              onOpenCourse(book.id, "overview");
                            }}
                            className="cursor-pointer text-left vankho-serif text-sm font-medium text-(--vk-fg) line-clamp-2 hover:text-(--vk-brass)"
                          >
                            {book.name}
                          </button>
                          <p className="mt-1 vankho-mono text-xs font-semibold text-(--vk-brass)">
                            {formatVnd(ed.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={ed.stock <= 0}
                            onClick={() => {
                              onCloseWishlist();
                              dispatch(
                                addToCart({
                                  bookId: String(book.id),
                                  edition: fmt,
                                  quantity: 1,
                                  maxStock: ed.stock,
                                  openDrawer: true,
                                })
                              );
                            }}
                            aria-label={`Thêm ${book.name} vào giỏ`}
                            className="inline-flex min-h-[38px] min-w-[38px] cursor-pointer items-center justify-center rounded-lg border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) hover:bg-(--vk-primary) hover:text-(--vk-primary-fg)"
                          >
                            <ShoppingBag className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(book.id)}
                            aria-label={`Xóa ${book.name} khỏi yêu thích`}
                            className="inline-flex min-h-[38px] min-w-[38px] cursor-pointer items-center justify-center rounded-lg text-(--vk-muted) hover:text-red-500"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 4. ARCHIVAL VOUCHER WALLET DRAWER (SWR + REDUX TOOLKIT)           */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isVoucherOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseVoucher}
              aria-hidden="true"
              className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Kho phiếu giảm giá mua sách"
              initial={{ x: "100%" }}
              animate={{
                x: 0,
                transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] },
              }}
              exit={{ x: "100%", transition: { duration: 0.28 } }}
              className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-(--vk-border) bg-(--vk-surface) text-(--vk-fg) [box-shadow:var(--vk-elevation-drawer)]"
            >
              <div className="flex items-center justify-between border-b border-(--vk-border) px-5 py-4">
                <div className="flex items-center gap-2">
                  <Ticket className="size-4 text-(--vk-brass)" />
                  <h2 className="vankho-serif text-lg font-medium">
                    Phiếu Ưu Đãi Mua Sách ({vouchers.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onCloseVoucher}
                  aria-label="Đóng kho mã ưu đãi"
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) hover:bg-(--vk-btn-hover)"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                <p className="text-xs leading-relaxed text-(--vk-muted)">
                  Danh sách phiếu giảm giá hiệu sách được đồng bộ từ MongoDB qua <b>useSWR</b>. Khi lưu mã vào <b>Ví Redux</b>, mã sẽ tự động áp dụng trong Giỏ Sách.
                </p>

                {vouchers.map((v) => {
                  const isSaved = savedCodes.includes(v.code);
                  const isSelected = activeVoucherCode === v.code;
                  return (
                    <div
                      key={v.id}
                      className="rounded-xl border border-(--vk-border-strong) bg-(--vk-gallery) p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md border border-(--vk-primary)/35 bg-(--vk-primary-light) px-2.5 py-0.5 vankho-mono text-xs font-bold text-(--vk-brass)">
                          {v.code}
                        </span>
                        <span className="vankho-mono text-[11px] text-(--vk-muted)">
                          {v.expiry}
                        </span>
                      </div>
                      <p className="vankho-serif text-base font-medium text-(--vk-fg)">
                        {v.title}
                      </p>
                      <p className="text-xs text-(--vk-muted)">
                        {v.desc} · {v.condition}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(saveVoucherCode(v.code));
                            dispatch(selectActiveVoucher(v.code));
                            setVoucherCode(v.code);
                          }}
                          className={`inline-flex min-h-[40px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isSelected
                              ? "bg-(--vk-primary) text-(--vk-primary-fg)"
                              : isSaved
                              ? "border border-(--vk-primary) bg-(--vk-primary-light) text-(--vk-brass)"
                              : "border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) hover:bg-(--vk-btn-hover)"
                          }`}
                        >
                          {isSaved && <Check className="size-3.5" />}
                          <span>
                            {isSelected
                              ? "Đang áp dụng"
                              : isSaved
                              ? "Đã lưu trong Ví"
                              : "Lưu & Chọn mã"}
                          </span>
                        </button>

                        {totalCartBooks > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(saveVoucherCode(v.code));
                              dispatch(selectActiveVoucher(v.code));
                              setVoucherCode(v.code);
                              onCloseVoucher();
                              dispatch(openCart());
                            }}
                            className="inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-lg border border-(--vk-border-strong) bg-(--vk-surface) px-3 text-xs font-semibold text-(--vk-brass) hover:bg-(--vk-btn-hover)"
                          >
                            Dùng ngay
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 5. MONGODB BOOK ORDER HISTORY DRAWER                              */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isOrdersOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseOrders}
              aria-hidden="true"
              className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Lịch sử đơn đặt sách MongoDB"
              initial={{ x: "100%" }}
              animate={{
                x: 0,
                transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] },
              }}
              exit={{ x: "100%", transition: { duration: 0.28 } }}
              className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-(--vk-border) bg-(--vk-surface) text-(--vk-fg) [box-shadow:var(--vk-elevation-drawer)]"
            >
              <div className="flex items-center justify-between border-b border-(--vk-border) px-5 py-4">
                <div className="flex items-center gap-2">
                  <Package className="size-4 text-(--vk-brass)" />
                  <h2 className="vankho-serif text-lg font-medium">
                    Sổ Đơn Mua Sách ({orders.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onCloseOrders}
                  aria-label="Đóng sổ đơn mua sách"
                  className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-(--vk-muted) hover:bg-(--vk-btn-hover)"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {loadingOrders ? (
                  <p className="py-10 text-center text-sm text-(--vk-muted)">
                    Đang tải lịch sử đơn đặt sách từ MongoDB...
                  </p>
                ) : orders.length === 0 ? (
                  <p className="py-10 text-center text-sm text-(--vk-muted)">
                    Chưa có đơn đặt sách nào được ghi nhận.
                  </p>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="vankho-mono text-[11px] text-(--vk-muted)">
                          #{ord.id} · {ord.createdAt}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            ord.status === "approved"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : ord.status === "cancelled"
                              ? "bg-red-500/15 text-red-600 dark:text-red-300"
                              : "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {ord.status === "approved"
                            ? "Đang giao sách"
                            : ord.status === "cancelled"
                            ? "Đã hủy · Hoàn kho"
                            : "Chờ xác nhận"}
                        </span>
                      </div>

                      <p className="vankho-serif text-sm font-medium leading-snug text-(--vk-fg)">
                        {ord.courseName}
                      </p>

                      {ord.shippingAddress && (
                        <p className="flex items-start gap-1.5 text-xs text-(--vk-muted)">
                          <MapPin className="mt-0.5 size-3.5 shrink-0 text-(--vk-brass)" />
                          <span>{ord.shippingAddress}</span>
                        </p>
                      )}

                      <div className="flex items-center justify-between border-t border-(--vk-border) pt-2 text-xs text-(--vk-muted)">
                        <span>
                          {ord.studentName} · {ord.phone}
                        </span>
                        <span className="vankho-mono font-bold text-(--vk-brass)">
                          {ord.amount}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
