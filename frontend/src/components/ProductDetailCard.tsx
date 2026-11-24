"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSWRConfig } from "swr";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { SWR_KEYS, useVouchersSWR } from "@/hooks/useSwrApi";
import { getSavedUser } from "@/services/auth.service";
import { createOrder } from "@/services/order.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { selectActiveVoucher } from "@/store/slices/voucherWalletSlice";
import { BookEditionCover3D } from "@/components/vankho/BookEditionCover3D";
import { CourseBook3DFlip } from "@/components/vankho/CourseBook3DFlip";
import {
  formatVnd,
  FREE_SHIPPING_THRESHOLD,
  getCourseArchivalMeta,
  parseVndPrice,
  resolveBookEditions,
  STANDARD_SHIPPING_FEE,
} from "@/components/vankho/vankho-data";
import {
  AlertCircle,
  ArrowLeft,
  BookMarked,
  Check,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";
// [YÊU CẦU CÔ - Lab 4 (Form Validation)] Import các hàm bắt lỗi dùng chung
import {
  hasErrors,
  validateEmail,
  validateFullName,
  validatePhone,
  validateShippingAddress,
  validateVoucherCode,
} from "@/lib/validation";

// ============================================================================
// [YÊU CẦU CÔ - Lab 3 (Props) + Lab 4 (useState + Form) + Redux Toolkit + API]
// - Nhận `product` qua Props từ trang `/detail/[id]`.
// - Hiển thị sách 3D lật trang đọc thử, chọn ấn bản Bìa mềm / Bìa cứng,
//   thêm vào Giỏ sách Redux hoặc Đặt mua nhanh trực tiếp lưu vào MongoDB.
// ============================================================================
interface ProductDetailCardProps {
  product: IProduct;
}

export default function ProductDetailCard({ product }: ProductDetailCardProps) {
  const dispatch = useAppDispatch();
  const { mutate } = useSWRConfig();
  const { vouchers } = useVouchersSWR();
  const reduxUser = useAppSelector((state) => state.auth.currentUser);
  const { savedCodes, activeVoucherCode } = useAppSelector(
    (state) => state.voucherWallet
  );

  const meta = getCourseArchivalMeta(product, 0);
  const editions = resolveBookEditions(product);

  const [selectedEdition, setSelectedEdition] = useState<BookEditionFormat>(
    editions.paperback.stock > 0 ? "paperback" : "hardcover"
  );
  const activeEd = editions[selectedEdition];
  const isOutOfStock = activeEd.stock <= 0;

  // [YÊU CẦU CÔ - Lab 4: Quản lý Form đặt mua sách nhanh bằng useState]
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [orderError, setOrderError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(
      addToCart({
        bookId: String(product.id),
        edition: selectedEdition,
        quantity: 1,
        maxStock: activeEd.stock,
        openDrawer: true,
      })
    );
  };

  const handleOpenQuickOrder = () => {
    if (isOutOfStock) return;
    const saved = reduxUser || getSavedUser();
    setStudentName(saved?.fullName || saved?.username || "");
    setEmail(saved?.email || "");
    setPhone(saved?.phone || "");
    if (activeVoucherCode && !voucherCode) {
      setVoucherCode(activeVoucherCode);
    }
    setOrderError("");
    setFieldErrors({});
    setIsQuickOrderOpen(true);
  };

  const cleanVoucher = voucherCode.trim().toUpperCase();
  const matchedVoucher = cleanVoucher
    ? vouchers.find((v) => v.code.toUpperCase() === cleanVoucher) || null
    : null;

  const quickOrderPricing = (() => {
    const subtotal = activeEd.price;
    const baseShipping =
      subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

    if (!cleanVoucher || !matchedVoucher) {
      return {
        subtotal,
        discountAmount: 0,
        shippingFee: baseShipping,
        finalTotal: subtotal + baseShipping,
      };
    }

    const minReq = matchedVoucher.minOrderAmount ?? 0;
    if (subtotal < minReq) {
      return {
        subtotal,
        discountAmount: 0,
        shippingFee: baseShipping,
        finalTotal: subtotal + baseShipping,
      };
    }

    if (matchedVoucher.code === "FREESHIP" || matchedVoucher.badge === "Freeship") {
      return {
        subtotal,
        discountAmount: 0,
        shippingFee: 0,
        finalTotal: subtotal,
      };
    }

    const rawDisc =
      matchedVoucher.discountAmount ?? parseVndPrice(matchedVoucher.badge) ?? 30000;
    const discountAmount = Math.min(subtotal, rawDisc);
    return {
      subtotal,
      discountAmount,
      shippingFee: baseShipping,
      finalTotal: Math.max(0, subtotal - discountAmount + baseShipping),
    };
  })();

  const handleQuickOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Kiểm tra bắt lỗi nhập thiếu / sai định dạng
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
    setOrderError("");
    setFieldErrors({});

    const { subtotal, discountAmount, shippingFee, finalTotal } =
      quickOrderPricing;
    const editionShort =
      selectedEdition === "paperback" ? "Bìa mềm" : "Bìa cứng vải bố";

    try {
      await createOrder({
        studentName: studentName.trim(),
        phone: phone.trim(),
        shippingAddress: shippingAddress.trim(),
        email: email.trim() || "docgia@hanzi.vn",
        courseId: String(product.id),
        courseName: `${product.name} (${editionShort})`,
        items: [
          {
            bookId: String(product.id),
            bookName: product.name,
            edition: selectedEdition,
            editionLabel: editionShort,
            unitPrice: activeEd.price,
            quantity: 1,
          },
        ],
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
      void mutate(SWR_KEYS.PRODUCTS);
      setIsQuickOrderOpen(false);
      setOrderSuccess(
        "Đặt mua sách thành công! Đơn hàng đã lưu vào MongoDB và bộ phận HANZI sẽ sớm đóng gói giao tận tay bạn."
      );
    } catch {
      setOrderError("Không thể gửi đơn đặt sách lúc này. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-(--vk-border) bg-(--vk-surface)">
      {/* TOP SHOWCASE: LIVE EDITION 3D COVER + PUBLICATION HEADER */}
      <div className="grid grid-cols-1 gap-8 border-b border-(--vk-border) bg-(--vk-gallery) p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
        {/* Left: Live Paperback vs Cloth Hardcover 3D Showcase */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-(--vk-border) bg-(--vk-paper) px-6 py-8 lg:col-span-5">
          <p className="mb-5 text-center vankho-mono text-[11px] uppercase tracking-[0.16em] text-(--vk-brass)">
            Xem Trước Hình Ảnh 2 Ấn Bản Bìa Mềm &amp; Bìa Cứng
          </p>
          <BookEditionCover3D
            product={product}
            meta={meta}
            edition={selectedEdition}
            size="lg"
            showCaptionBadge={true}
          />
        </div>

        {/* Right: Bibliographic Title & Edition Picker */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            {product.categoryName && (
              <span className="rounded-full border border-(--vk-border-strong) bg-(--vk-surface) px-3 py-1 vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-brass)">
                {product.categoryName}
              </span>
            )}
            {product.badge && (
              <span className="rounded-full bg-(--vk-primary) px-3 py-1 vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-primary-fg)">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="vankho-serif text-3xl font-medium leading-tight tracking-tight text-(--vk-fg) sm:text-4xl">
            {product.name}
          </h1>

          <p className="text-sm font-medium text-(--vk-brass)">
            Tác giả: {product.author || "Ban Biên Tập HANZI"} ·{" "}
            {product.publisher || "NXB ĐH Ngôn Ngữ Bắc Kinh"}
          </p>

          <p className="text-sm leading-relaxed text-(--vk-muted) sm:text-base">
            {product.desc}
          </p>

          <div className="flex flex-wrap items-center gap-5 border-y border-(--vk-border) py-3 text-xs text-(--vk-muted)">
            <span className="inline-flex items-center gap-1.5 font-semibold text-(--vk-fg)">
              <Star className="size-4 fill-amber-500 text-amber-500" />
              <span>{(product.rating || 4.9).toFixed(1)} / 5.0</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookMarked className="size-4 text-(--vk-brass)" />
              <span>{product.pages || 240} trang · Khổ lớn</span>
            </span>
            <span className="vankho-mono">ISBN: {activeEd.isbn}</span>
          </div>

          {/* 2-Edition Selector */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["paperback", "hardcover"] as const).map((fmt) => {
              const ed = editions[fmt];
              const active = selectedEdition === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedEdition(fmt)}
                  className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 text-left transition-colors ${
                    active
                      ? "border-(--vk-primary) bg-(--vk-primary-light)/70 ring-1 ring-(--vk-primary)/35"
                      : "border-(--vk-border-strong) bg-(--vk-surface) hover:bg-(--vk-btn-hover)"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-(--vk-fg)">
                      {ed.label}
                    </span>
                    {active && <Check className="size-4 text-(--vk-brass)" />}
                  </div>
                  <span className="mt-1 vankho-mono text-lg font-bold text-(--vk-brass) tabular-nums">
                    {formatVnd(ed.price)}
                  </span>
                  <span className="mt-0.5 text-[11px] text-(--vk-muted)">
                    {ed.dimensions} ·{" "}
                    {ed.stock > 0 ? `Còn ${ed.stock} cuốn` : "Hết hàng"}
                  </span>
                </button>
              );
            })}
          </div>

          {orderSuccess && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
            >
              {orderSuccess}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="inline-flex min-h-[46px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--vk-primary) px-6 text-sm font-semibold text-(--vk-primary-fg) transition-colors hover:bg-(--vk-primary-hover) disabled:opacity-45"
            >
              <ShoppingBag className="size-4" />
              <span>
                {isOutOfStock
                  ? "Ấn bản tạm hết hàng"
                  : `Thêm vào Giỏ Sách · ${formatVnd(activeEd.price)}`}
              </span>
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleOpenQuickOrder}
              className="inline-flex min-h-[46px] cursor-pointer items-center justify-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-5 text-sm font-semibold text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover) disabled:opacity-45"
            >
              Đặt Giao Nhanh 1 Cuốn
            </button>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH 2-PAGE OPEN BOOK READER (5 SPREADS = 10 REAL PAGES) */}
      <div className="border-b border-(--vk-border) bg-(--vk-paper) p-6 sm:p-10">
        <div className="mb-5 text-center">
          <p className="vankho-mono text-xs uppercase tracking-[0.16em] text-(--vk-brass)">
            Đọc Thử Trực Tuyến · 5 Tờ Đôi (10 Trang Ruột Sách Thật)
          </p>
          <h2 className="mt-1 vankho-serif text-2xl font-medium text-(--vk-fg)">
            Lật Từng Trang Sách &amp; Nghe Phát Âm Chuẩn Bắc Kinh
          </h2>
        </div>
        <div className="mx-auto max-w-4xl">
          <CourseBook3DFlip
            product={product}
            meta={meta}
            edition={selectedEdition}
            initialOpen={true}
          />
        </div>
      </div>

      {/* BOTTOM DETAILS: EDITORIAL SYNOPSIS & BOOKSTORE GUARANTEES */}
      <div className="grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div>
            <p className="vankho-mono text-xs uppercase tracking-wider text-(--vk-brass)">
              Lời Giới Thiệu Ấn Phẩm
            </p>
            <h2 className="mt-1 vankho-serif text-2xl font-medium text-(--vk-fg)">
              Nội Dung Biên Soạn &amp; Giá Trị Sưu Tập
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--vk-fg)/90 sm:text-base">
              {product.fullDesc || product.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {product.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-4 text-sm text-(--vk-fg)"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-(--vk-brass)" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-(--vk-border) bg-(--vk-gallery) p-6 space-y-4 text-xs text-(--vk-muted)">
            <p className="vankho-mono font-semibold uppercase tracking-wider text-(--vk-fg)">
              Quy Chuẩn Đóng Gói HANZI
            </p>
            <div className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-4 shrink-0 text-(--vk-brass)" />
              <span>
                Miễn phí giao sách toàn quốc cho đơn hàng từ{" "}
                <strong className="text-(--vk-fg)">300.000₫</strong>.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-(--vk-brass)" />
              <span>
                Bọc chống sốc 3 lớp + hộp carton cứng bảo vệ vuông vức 4 góc sách.
              </span>
            </div>
            <Link
              href="/products"
              className="mt-2 inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) font-semibold text-(--vk-fg) hover:bg-(--vk-btn-hover)"
            >
              <ArrowLeft className="size-3.5" />
              <span>Xem thêm các đầu sách khác</span>
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK ORDER MODAL (Validated with validation.ts) */}
      {isQuickOrderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[1px]"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) {
              setIsQuickOrderOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-order-dialog-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-(--vk-border) bg-(--vk-surface) text-(--vk-fg) shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-(--vk-border) bg-(--vk-gallery) px-5 py-4">
              <h3
                id="quick-order-dialog-title"
                className="vankho-serif text-lg font-medium"
              >
                Đặt Giao Nhanh Ấn Phẩm
              </h3>
              <button
                type="button"
                onClick={() => setIsQuickOrderOpen(false)}
                aria-label="Đóng hộp thoại đặt sách"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-(--vk-muted) hover:bg-(--vk-btn-hover)"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={handleQuickOrderSubmit}
              className="p-5 space-y-3.5"
            >
              <div className="rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3 text-xs space-y-1">
                <p className="font-semibold text-(--vk-fg)">{product.name}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 vankho-mono text-(--vk-brass)">
                  <span>
                    {activeEd.label} · {formatVnd(activeEd.price)}
                  </span>
                  <span>
                    Tổng thanh toán: <strong>{formatVnd(quickOrderPricing.finalTotal)}</strong>
                  </span>
                </div>
                {quickOrderPricing.discountAmount > 0 && (
                  <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                    Đã áp mã ưu đãi giảm {formatVnd(quickOrderPricing.discountAmount)}!
                  </p>
                )}
              </div>

              {orderError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-xs font-semibold text-red-600"
                >
                  {orderError}
                </div>
              )}

              <div className="space-y-1">
                <label
                  htmlFor="qo-name"
                  className="block text-xs font-semibold text-(--vk-fg)"
                >
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  id="qo-name"
                  type="text"
                  aria-invalid={Boolean(fieldErrors.studentName)}
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setFieldErrors((p) => ({ ...p, studentName: "" }));
                  }}
                  placeholder="Nguyễn Minh Anh"
                  className={`h-10 w-full rounded-xl border bg-(--vk-surface) px-3 text-sm text-(--vk-fg) focus:outline-none ${
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label
                    htmlFor="qo-phone"
                    className="block text-xs font-semibold text-(--vk-fg)"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="qo-phone"
                    type="tel"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFieldErrors((p) => ({ ...p, phone: "" }));
                    }}
                    placeholder="0901234567"
                    className={`h-10 w-full rounded-xl border bg-(--vk-surface) px-3 text-sm text-(--vk-fg) focus:outline-none ${
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

                <div className="space-y-1">
                  <label
                    htmlFor="qo-voucher"
                    className="block text-xs font-semibold text-(--vk-fg)"
                  >
                    Mã ưu đãi (nếu có)
                  </label>
                  <input
                    id="qo-voucher"
                    type="text"
                    aria-invalid={Boolean(fieldErrors.voucherCode)}
                    value={voucherCode}
                    onChange={(e) => {
                      setVoucherCode(e.target.value.toUpperCase());
                      setFieldErrors((p) => ({ ...p, voucherCode: "" }));
                    }}
                    placeholder="HANZI50K"
                    className={`h-10 w-full rounded-xl border bg-(--vk-surface) px-3 vankho-mono text-sm text-(--vk-fg) focus:outline-none ${
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
                </div>
              </div>

              {savedCodes.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[11px] text-(--vk-muted)">Ví đã lưu:</span>
                  {savedCodes.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setVoucherCode(code);
                        setFieldErrors((p) => ({ ...p, voucherCode: "" }));
                        dispatch(selectActiveVoucher(code));
                      }}
                      className="cursor-pointer rounded border border-(--vk-border-strong) bg-(--vk-gallery) px-2 py-0.5 vankho-mono text-[11px] font-semibold text-(--vk-brass)"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <label
                  htmlFor="qo-address"
                  className="block text-xs font-semibold text-(--vk-fg)"
                >
                  Địa chỉ nhận sách <span className="text-red-500">*</span>
                </label>
                <input
                  id="qo-address"
                  type="text"
                  aria-invalid={Boolean(fieldErrors.shippingAddress)}
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    setFieldErrors((p) => ({ ...p, shippingAddress: "" }));
                  }}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
                  className={`h-10 w-full rounded-xl border bg-(--vk-surface) px-3 text-sm text-(--vk-fg) focus:outline-none ${
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
                  htmlFor="qo-email"
                  className="block text-xs font-semibold text-(--vk-fg)"
                >
                  Email nhận phiếu xác nhận (tùy chọn)
                </label>
                <input
                  id="qo-email"
                  type="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="docgia@hanzi.vn"
                  className={`h-10 w-full rounded-xl border bg-(--vk-surface) px-3 text-sm text-(--vk-fg) focus:outline-none ${
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

              <div className="flex items-center justify-end gap-2 border-t border-(--vk-border) pt-3">
                <button
                  type="button"
                  onClick={() => setIsQuickOrderOpen(false)}
                  disabled={submitting}
                  className="min-h-[40px] cursor-pointer rounded-xl border border-(--vk-border-strong) px-4 text-xs font-semibold text-(--vk-fg)"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-[40px] cursor-pointer rounded-xl bg-(--vk-primary) px-5 text-xs font-semibold text-(--vk-primary-fg) disabled:opacity-50"
                >
                  {submitting ? "Đang lưu đơn..." : "Xác nhận đặt sách"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
