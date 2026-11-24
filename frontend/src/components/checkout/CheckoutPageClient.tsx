"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSWRConfig } from "swr";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Ticket,
  Trash2,
  Truck,
} from "lucide-react";
import { IOrder, IOrderItem } from "@/interfaces/order";
import { IProduct } from "@/interfaces/product";
import { SWR_KEYS, useProductsSWR, useVouchersSWR } from "@/hooks/useSwrApi";
import {
  hasErrors,
  validateEmail,
  validateFullName,
  validatePhone,
  validateShippingAddress,
  validateVoucherCode,
} from "@/lib/validation";
import { getSavedUser } from "@/services/auth.service";
import { createOrder } from "@/services/order.service";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearCart,
  removeFromCart,
  updateCartQty,
} from "@/store/slices/cartSlice";
import {
  saveVoucherCode,
  selectActiveVoucher,
} from "@/store/slices/voucherWalletSlice";
import {
  formatVnd,
  FREE_SHIPPING_THRESHOLD,
  getCourseArchivalMeta,
  parseVndPrice,
  resolveBookEditions,
  STANDARD_SHIPPING_FEE,
} from "@/components/vankho/vankho-data";

type PaymentMethod = "cod" | "bank_transfer" | "e_wallet";

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethod;
  title: string;
  desc: string;
  badge: string;
}> = [
  {
    id: "cod",
    title: "Thanh toán khi nhận hàng (COD)",
    desc: "Kiểm tra sách nguyên seal, giấy in rõ nét, không cong gáy rồi mới thanh toán cho bưu tá.",
    badge: "Phổ biến",
  },
  {
    id: "bank_transfer",
    title: "Chuyển khoản ngân hàng (VietQR)",
    desc: "Chuyển khoản trực tiếp vào tài khoản Hiệu Sách HANZI, ưu tiên đóng gói xuất kho ngay.",
    badge: "Xử lý nhanh",
  },
  {
    id: "e_wallet",
    title: "Ví điện tử (MoMo / ZaloPay)",
    desc: "Thanh toán một chạm qua ví điện tử, tặng kèm kẹp sách thư pháp Mễ Tự.",
    badge: "Quà tặng",
  },
];

// ============================================================================
// [YÊU CẦU CÔ - Lab 4 (Form Validation) + useMemo + useSWR + Redux + POST API]
// Trang Thanh Toán chuyên biệt (/checkout):
// - Đọc giỏ sách từ Redux `cartSlice` và ví mã ưu đãi từ `voucherWalletSlice`
// - Đọc danh sách Voucher & Tồn kho sách từ MongoDB qua `useVouchersSWR` / `useProductsSWR`
// - Kiểm tra lỗi nhập liệu tiếng Việt thuần TS (`noValidate` + `validation.ts`)
// - Gửi đơn đặt sách qua `POST /api/orders` trừ tồn kho thực tế trong MongoDB
// ============================================================================
export function CheckoutPageClient({
  initialProducts,
}: {
  initialProducts: IProduct[];
}) {
  const dispatch = useAppDispatch();
  const { mutate } = useSWRConfig();
  const { products } = useProductsSWR(initialProducts);
  const { vouchers } = useVouchersSWR();

  const reduxUser = useAppSelector((s) => s.auth.currentUser);
  const { activeVoucherCode } = useAppSelector((s) => s.voucherWallet);
  const cartItems = useAppSelector((s) => s.cart.items);

  const [mounted, setMounted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [voucherCode, setVoucherCode] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [checkoutError, setCheckoutError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState<{
    order: IOrder;
    paymentMethod: PaymentMethod;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = reduxUser || getSavedUser();
    if (saved) {
      setStudentName((prev) => prev || saved.fullName || saved.username || "");
      setEmail((prev) => prev || saved.email || "");
      setPhone((prev) => prev || saved.phone || "");
    }
  }, [reduxUser]);

  useEffect(() => {
    if (activeVoucherCode && !voucherCode) {
      setVoucherCode(activeVoucherCode);
    }
  }, [activeVoucherCode, voucherCode]);

  const resolvedCartLines = useMemo(() => {
    if (!mounted) return [];
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
        const safeQty = Math.max(
          1,
          Math.min(Math.max(1, ed.stock), entry.quantity)
        );
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
  }, [mounted, cartItems, products]);

  const totalCartBooks = useMemo(
    () => resolvedCartLines.reduce((acc, item) => acc + item.quantity, 0),
    [resolvedCartLines]
  );

  const subtotal = useMemo(
    () => resolvedCartLines.reduce((acc, item) => acc + item.lineTotal, 0),
    [resolvedCartLines]
  );

  const matchedVoucher = useMemo(() => {
    const clean = voucherCode.trim().toUpperCase();
    if (!clean) return null;
    return vouchers.find((v) => v.code.toUpperCase() === clean) || null;
  }, [voucherCode, vouchers]);

  // [YÊU CẦU CÔ - useMemo]: Tự động tính tạm tính, mức giảm voucher & phí vận chuyển
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

    if (matchedVoucher.code.toUpperCase().includes("SHIP")) {
      return {
        discountAmount: 0,
        shippingFee: 0,
        voucherNotice: `Đã miễn phí vận chuyển với mã ${matchedVoucher.code}!`,
      };
    }

    const rawDisc =
      matchedVoucher.discountAmount ??
      parseVndPrice(matchedVoucher.badge) ??
      30000;
    const capped = Math.min(subtotal, rawDisc);
    return {
      discountAmount: capped,
      shippingFee: baseShipping,
      voucherNotice: `Đã giảm ${formatVnd(capped)} từ mã ${matchedVoucher.code}.`,
    };
  }, [subtotal, voucherCode, matchedVoucher]);

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvedCartLines.length === 0) return;

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Kiểm tra JS/TS thuần trước khi gọi API
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

    const paymentLabel =
      paymentMethod === "bank_transfer"
        ? "Chuyển khoản VietQR"
        : paymentMethod === "e_wallet"
        ? "Ví điện tử"
        : "COD";

    const fullAddress = note.trim()
      ? `${shippingAddress.trim()} (${paymentLabel} · Ghi chú: ${note.trim()})`
      : `${shippingAddress.trim()} (${paymentLabel})`;

    try {
      const { order } = await createOrder({
        studentName: studentName.trim(),
        phone: phone.trim(),
        shippingAddress: fullAddress,
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
      void mutate(SWR_KEYS.PRODUCTS);
      setCreatedReceipt({ order, paymentMethod });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setCheckoutError(
        "Không thể gửi đơn đặt sách lúc này. Vui lòng kiểm tra kết nối máy chủ và thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Success Receipt Screen (only shows THIS user's newly placed order)
  if (createdReceipt) {
    const { order, paymentMethod: paidMethod } = createdReceipt;
    const paidLabel =
      PAYMENT_OPTIONS.find((p) => p.id === paidMethod)?.title ||
      "Thanh toán khi nhận hàng (COD)";

    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          role="status"
          aria-live="polite"
          className="rounded-3xl border border-emerald-500/35 bg-(--vk-surface) p-6 sm:p-10 space-y-6"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </div>
            <p className="vankho-mono text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Đặt Sách Thành Công · #{order.id}
            </p>
            <h1 className="vankho-serif text-2xl font-medium text-(--vk-fg) sm:text-3xl">
              Cảm ơn bạn đã đặt sách tại HANZI!
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-(--vk-muted)">
              Đơn hàng của bạn đã được ghi nhận vào hệ thống và giữ sẵn ấn bản trong kho. Bộ phận đóng gói sẽ sớm liên hệ xác nhận giao sách tận nơi.
            </p>
          </div>

          <div className="rounded-2xl border border-(--vk-border) bg-(--vk-gallery) p-5 space-y-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--vk-border) pb-3">
              <span className="text-xs text-(--vk-muted)">Mã đơn hàng</span>
              <span className="vankho-mono font-bold text-(--vk-fg)">
                #{order.id}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--vk-muted)">
                Ấn phẩm đã đặt
              </p>
              <p className="vankho-serif text-base font-medium text-(--vk-fg)">
                {order.courseName}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 border-t border-(--vk-border) pt-3 text-xs sm:grid-cols-2">
              <div>
                <span className="block text-(--vk-muted)">Người nhận</span>
                <span className="font-semibold text-(--vk-fg)">
                  {order.studentName} · {order.phone}
                </span>
              </div>
              <div>
                <span className="block text-(--vk-muted)">
                  Phương thức thanh toán
                </span>
                <span className="font-semibold text-(--vk-fg)">
                  {paidLabel}
                </span>
              </div>
              {order.shippingAddress && (
                <div className="sm:col-span-2">
                  <span className="block text-(--vk-muted)">
                    Địa chỉ giao sách
                  </span>
                  <span className="font-medium text-(--vk-fg)">
                    {order.shippingAddress}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between border-t border-(--vk-border) pt-3">
              <span className="text-sm font-semibold text-(--vk-fg)">
                Tổng thanh toán
              </span>
              <span className="vankho-mono text-xl font-bold text-(--vk-brass) tabular-nums">
                {order.amount}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-(--vk-primary) px-6 text-sm font-semibold text-(--vk-primary-fg) transition-colors hover:bg-(--vk-primary-hover)"
            >
              <span>Quay về Kệ Sách 3D</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-6 text-sm font-semibold text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover)"
            >
              <span>Khám phá thêm sách khác</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Waiting for Client Redux Hydration
  if (!mounted) {
    return (
      <div
        role="status"
        aria-busy="true"
        className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-(--vk-muted)"
      >
        Đang chuẩn bị trang thanh toán đơn sách...
      </div>
    );
  }

  // 3. Empty Cart State
  if (resolvedCartLines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
        <div className="rounded-3xl border border-(--vk-border) bg-(--vk-surface) p-10 space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-(--vk-gallery) text-(--vk-muted)">
            <ShoppingBag className="size-7" aria-hidden="true" />
          </div>
          <h1 className="vankho-serif text-2xl font-medium text-(--vk-fg)">
            Giỏ sách của bạn đang trống
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-(--vk-muted)">
            Hãy chọn giáo trình HSK, từ điển 214 bộ thủ hoặc vở luyện thư pháp từ kệ sách HANZI trước khi tiến hành thanh toán.
          </p>
          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-(--vk-primary) px-6 text-sm font-semibold text-(--vk-primary-fg) hover:bg-(--vk-primary-hover)"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span>Về Kệ Sách 3D</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-6 text-sm font-semibold text-(--vk-fg) hover:bg-(--vk-btn-hover)"
            >
              Xem toàn bộ {products.length || 30} đầu sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Dedicated 2-Column Editorial Checkout Page
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb & Page Heading */}
      <div className="space-y-3 border-b border-(--vk-border) pb-6">
        <div className="flex items-center gap-2 text-xs text-(--vk-muted)">
          <Link href="/" className="hover:text-(--vk-brass) transition-colors">
            Kệ Sách 3D
          </Link>
          <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
          <Link
            href="/products"
            className="hover:text-(--vk-brass) transition-colors"
          >
            Kho Sách
          </Link>
          <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
          <span className="font-semibold text-(--vk-fg)">
            Thanh Toán Đơn Sách
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="vankho-serif text-3xl font-medium tracking-tight text-(--vk-fg) sm:text-4xl">
              Thanh Toán &amp; Giao Sách
            </h1>
            <p className="mt-1 text-sm text-(--vk-muted)">
              Hoàn tất thông tin người nhận và chọn phương thức thanh toán phù hợp cho{" "}
              <strong className="text-(--vk-fg)">{totalCartBooks} cuốn sách</strong> của bạn.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-4 text-xs font-semibold text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover)"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Chọn thêm sách</span>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* LEFT COLUMN: SHIPPING FORM + PAYMENT METHODS */}
        <form
          id="hanzi-checkout-form"
          noValidate
          onSubmit={handleCheckoutSubmit}
          className="space-y-6 lg:col-span-7"
        >
          {checkoutError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Step 1: Recipient & Shipping Address */}
          <section className="rounded-2xl border border-(--vk-border) bg-(--vk-surface) p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-3 border-b border-(--vk-border) pb-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--vk-primary) vankho-mono text-xs font-bold text-(--vk-primary-fg)">
                1
              </span>
              <div>
                <h2 className="vankho-serif text-xl font-medium text-(--vk-fg)">
                  Thông tin giao sách
                </h2>
                <p className="text-xs text-(--vk-muted)">
                  Sách được bọc chống sốc 3 lớp và giao tận nơi toàn quốc.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold text-(--vk-fg)"
                >
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-name"
                  name="studentName"
                  type="text"
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.studentName)}
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setFieldErrors((p) => ({ ...p, studentName: "" }));
                  }}
                  placeholder="Nguyễn Minh Anh"
                  className={`h-11 w-full rounded-xl border bg-(--vk-gallery) px-3.5 text-base sm:text-sm text-(--vk-fg) focus:outline-none focus:ring-2 focus:ring-(--vk-primary)/40 ${
                    fieldErrors.studentName
                      ? "border-red-400"
                      : "border-(--vk-border-strong)"
                  }`}
                />
                {fieldErrors.studentName && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>{fieldErrors.studentName}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-semibold text-(--vk-fg)"
                >
                  Số điện thoại nhận hàng <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(fieldErrors.phone)}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setFieldErrors((p) => ({ ...p, phone: "" }));
                  }}
                  placeholder="0901234567"
                  className={`h-11 w-full rounded-xl border bg-(--vk-gallery) px-3.5 text-base sm:text-sm text-(--vk-fg) focus:outline-none focus:ring-2 focus:ring-(--vk-primary)/40 ${
                    fieldErrors.phone
                      ? "border-red-400"
                      : "border-(--vk-border-strong)"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="checkout-address"
                className="block text-xs font-semibold text-(--vk-fg)"
              >
                Địa chỉ giao sách chi tiết <span className="text-red-500">*</span>
              </label>
              <input
                id="checkout-address"
                name="shippingAddress"
                type="text"
                autoComplete="street-address"
                aria-invalid={Boolean(fieldErrors.shippingAddress)}
                value={shippingAddress}
                onChange={(e) => {
                  setShippingAddress(e.target.value);
                  setFieldErrors((p) => ({ ...p, shippingAddress: "" }));
                }}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                className={`h-11 w-full rounded-xl border bg-(--vk-gallery) px-3.5 text-base sm:text-sm text-(--vk-fg) focus:outline-none focus:ring-2 focus:ring-(--vk-primary)/40 ${
                  fieldErrors.shippingAddress
                    ? "border-red-400"
                    : "border-(--vk-border-strong)"
                }`}
              />
              {fieldErrors.shippingAddress && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{fieldErrors.shippingAddress}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-semibold text-(--vk-fg)"
                >
                  Email nhận hóa đơn &amp; QR Audio (tùy chọn)
                </label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="docgia@hanzi.vn"
                  className={`h-11 w-full rounded-xl border bg-(--vk-gallery) px-3.5 text-base sm:text-sm text-(--vk-fg) focus:outline-none focus:ring-2 focus:ring-(--vk-primary)/40 ${
                    fieldErrors.email
                      ? "border-red-400"
                      : "border-(--vk-border-strong)"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-note"
                  className="block text-xs font-semibold text-(--vk-fg)"
                >
                  Ghi chú giao hàng (tùy chọn)
                </label>
                <input
                  id="checkout-note"
                  name="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Giao giờ hành chính, bọc thêm giấy gói quà..."
                  className="h-11 w-full rounded-xl border border-(--vk-border-strong) bg-(--vk-gallery) px-3.5 text-base sm:text-sm text-(--vk-fg) focus:outline-none focus:ring-2 focus:ring-(--vk-primary)/40"
                />
              </div>
            </div>
          </section>

          {/* Step 2: Payment Method Selection */}
          <section className="rounded-2xl border border-(--vk-border) bg-(--vk-surface) p-5 sm:p-7 space-y-4">
            <div className="flex items-center gap-3 border-b border-(--vk-border) pb-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--vk-primary) vankho-mono text-xs font-bold text-(--vk-primary-fg)">
                2
              </span>
              <div>
                <h2 className="vankho-serif text-xl font-medium text-(--vk-fg)">
                  Phương thức thanh toán
                </h2>
                <p className="text-xs text-(--vk-muted)">
                  Chọn hình thức thanh toán thuận tiện nhất cho bạn.
                </p>
              </div>
            </div>

            <div className="space-y-3" role="radiogroup" aria-label="Phương thức thanh toán">
              {PAYMENT_OPTIONS.map((opt) => {
                const selected = paymentMethod === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-colors ${
                      selected
                        ? "border-(--vk-primary) bg-(--vk-primary-light)/45"
                        : "border-(--vk-border) bg-(--vk-gallery) hover:border-(--vk-border-strong)"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={selected}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="mt-1 size-4 accent-amber-700"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-(--vk-fg)">
                          {opt.id === "cod" ? (
                            <Truck className="size-4 text-(--vk-brass)" aria-hidden="true" />
                          ) : opt.id === "bank_transfer" ? (
                            <Building2 className="size-4 text-(--vk-brass)" aria-hidden="true" />
                          ) : (
                            <Smartphone className="size-4 text-(--vk-brass)" aria-hidden="true" />
                          )}
                          <span>{opt.title}</span>
                        </span>
                        <span className="rounded-full border border-(--vk-border-strong) bg-(--vk-surface) px-2.5 py-0.5 vankho-mono text-[10px] font-semibold uppercase tracking-wider text-(--vk-brass)">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-(--vk-muted)">
                        {opt.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {paymentMethod === "bank_transfer" && (
              <div className="rounded-2xl border border-(--vk-border-strong) bg-(--vk-paper) p-4 text-xs space-y-1.5">
                <p className="vankho-mono font-semibold uppercase tracking-wider text-(--vk-brass)">
                  Thông tin chuyển khoản Hiệu Sách HANZI
                </p>
                <p className="text-(--vk-fg)">
                  Ngân hàng: <strong>Vietcombank (Chi nhánh TP.HCM)</strong>
                </p>
                <p className="text-(--vk-fg)">
                  Số tài khoản:{" "}
                  <strong className="vankho-mono">1028 6688 9999</strong> — Chủ TK:{" "}
                  <strong>HIEU SACH HANZI</strong>
                </p>
                <p className="text-(--vk-muted)">
                  Nội dung chuyển khoản:{" "}
                  <strong className="vankho-mono text-(--vk-fg)">
                    HANZI {phone.trim() || "SDT_CUA_BAN"}
                  </strong>
                </p>
              </div>
            )}
          </section>
        </form>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY, VOUCHER & SUBMIT */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-(--vk-border) bg-(--vk-surface) p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-(--vk-border) pb-3.5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-(--vk-brass)" aria-hidden="true" />
                <h2 className="vankho-serif text-lg font-medium text-(--vk-fg)">
                  Đơn Sách Của Bạn ({totalCartBooks} cuốn)
                </h2>
              </div>
              <span className="vankho-mono text-xs text-(--vk-muted)">
                {resolvedCartLines.length} ấn phẩm
              </span>
            </div>

            {/* Free Shipping Progress */}
            <div className="rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3.5">
              <div className="flex items-center gap-2 text-xs font-medium text-(--vk-fg)">
                <Truck className="size-4 shrink-0 text-(--vk-brass)" aria-hidden="true" />
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
                    để miễn phí ship (hiện +25.000₫).
                  </span>
                )}
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-(--vk-border)">
                <div
                  className="h-full rounded-full bg-(--vk-primary) transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Items List with Inline Quantity Adjust */}
            <ul className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
              {resolvedCartLines.map((line) => (
                <li
                  key={`${line.book.id}-${line.editionKey}`}
                  className="flex items-start gap-3 rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3"
                >
                  <div className="relative aspect-[2/3] w-13 shrink-0 overflow-hidden rounded-r-[4px] rounded-l-[2px] border border-black/20 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={line.meta.bookCoverImage}
                      alt={line.book.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/detail/${line.book.id}`}
                        className="vankho-serif text-sm font-medium leading-snug text-(--vk-fg) line-clamp-2 hover:text-(--vk-brass)"
                      >
                        {line.book.name}
                      </Link>
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
                        aria-label={`Xóa ${line.book.name} khỏi đơn`}
                        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-(--vk-muted) hover:text-red-500"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="mt-0.5 text-[11px] text-(--vk-muted)">
                      {line.editionKey === "paperback"
                        ? "Bìa mềm tiêu chuẩn"
                        : "Bìa cứng vải bố dập nhũ"}{" "}
                      · Kho còn {line.editionObj.stock}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-2">
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
                          aria-label={`Giảm số lượng ${line.book.name}`}
                          className="inline-flex size-7 cursor-pointer items-center justify-center text-(--vk-fg) hover:bg-(--vk-btn-hover)"
                        >
                          <Minus className="size-3" aria-hidden="true" />
                        </button>
                        <span className="min-w-[26px] text-center vankho-mono text-xs font-semibold tabular-nums">
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
                          aria-label={`Tăng số lượng ${line.book.name}`}
                          className="inline-flex size-7 cursor-pointer items-center justify-center text-(--vk-fg) hover:bg-(--vk-btn-hover) disabled:opacity-35"
                        >
                          <Plus className="size-3" aria-hidden="true" />
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

            {/* Voucher Input & Quick MongoDB SWR Chips */}
            <div className="rounded-xl border border-(--vk-border) bg-(--vk-gallery) p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="checkout-voucher"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--vk-fg)"
                >
                  <Ticket className="size-3.5 text-(--vk-brass)" aria-hidden="true" />
                  <span>Mã giảm giá mua sách</span>
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
                id="checkout-voucher"
                type="text"
                value={voucherCode}
                aria-invalid={Boolean(fieldErrors.voucherCode)}
                onChange={(e) => {
                  setVoucherCode(e.target.value.toUpperCase());
                  setFieldErrors((p) => ({ ...p, voucherCode: "" }));
                }}
                placeholder="Nhập HANZI50K, SACHMOI30K, FREESHIP25K..."
                className={`h-10 w-full rounded-xl border bg-(--vk-surface) px-3 vankho-mono text-xs text-(--vk-fg) focus:outline-none ${
                  fieldErrors.voucherCode
                    ? "border-red-400"
                    : "border-(--vk-border-strong)"
                }`}
              />

              {fieldErrors.voucherCode && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
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
                          setFieldErrors((p) => ({ ...p, voucherCode: "" }));
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

            {/* Totals Breakdown */}
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
                <span>Tổng thanh toán</span>
                <span className="vankho-mono text-xl font-bold text-(--vk-brass) tabular-nums">
                  {formatVnd(finalTotal)}
                </span>
              </div>
            </div>

            {/* Final Submit Button linked to Left Form */}
            <button
              type="submit"
              form="hanzi-checkout-form"
              disabled={submitting}
              className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--vk-primary) px-5 text-sm font-semibold text-(--vk-primary-fg) transition-colors hover:bg-(--vk-primary-hover) disabled:opacity-50"
            >
              <CreditCard className="size-4" aria-hidden="true" />
              <span>
                {submitting
                  ? "Đang xác nhận đơn đặt sách..."
                  : `Xác nhận đặt mua sách · ${formatVnd(finalTotal)}`}
              </span>
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-(--vk-muted)">
              <ShieldCheck className="size-3.5 shrink-0 text-(--vk-brass)" aria-hidden="true" />
              <span>Đổi mới 1-1 trong 7 ngày nếu sách lỗi in hoặc cong gáy</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
