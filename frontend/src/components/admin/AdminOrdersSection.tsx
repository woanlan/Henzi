"use client";

import React, { useMemo, useState } from "react";
import { IOrder, IOrderItem, OrderStatus } from "@/interfaces/order";
import { IProduct } from "@/interfaces/product";
import { parseVndPrice } from "@/components/vankho/vankho-data";
import { Check, Ban, Trash2, Plus, X, AlertCircle, MapPin } from "lucide-react";
// [YÊU CẦU CÔ - Lab 4 (Form Validation)] Import các hàm bắt lỗi dùng chung
import {
  validateFullName,
  validatePhone,
  validateEmail,
  validateShippingAddress,
  validateVoucherCode,
  hasErrors,
} from "@/lib/validation";

// ============================================================================
// [YÊU CẦU CÔ - Lab 3 (Props) + Lab 4 (Form) + useMemo + CRUD Đơn Đặt Sách]
// Quản lý danh sách đơn đặt mua sách: lọc trạng thái, tìm kiếm (useMemo),
// tạo đơn mới (`POST /api/orders`), xác nhận giao / hủy hoàn kho (`PUT /api/orders/:id`) và xóa.
// ============================================================================
interface AdminOrdersSectionProps {
  orders: IOrder[];
  products: IProduct[];
  onCreateOrder: (payload: {
    studentName: string;
    email: string;
    phone: string;
    shippingAddress?: string;
    courseId: string;
    courseName: string;
    items?: IOrderItem[];
    subtotal?: number;
    totalNumeric?: number;
    amount: string;
    voucherCode?: string;
    status?: OrderStatus;
  }) => Promise<void>;
  onChangeStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onRequestDelete: (order: IOrder) => void;
}

export default function AdminOrdersSection({
  orders,
  products,
  onCreateOrder,
  onChangeStatus,
  onRequestDelete,
}: AdminOrdersSectionProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [courseId, setCourseId] = useState(
    products[0] ? String(products[0].id) : "hsk-1"
  );
  const [voucherCode, setVoucherCode] = useState("");
  const [status, setStatus] = useState<OrderStatus>("approved");

  const counts = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      approved: orders.filter((o) => o.status === "approved").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((ord) => {
      const matchesStatus =
        statusFilter === "all" || ord.status === statusFilter;
      const matchesSearch =
        !q ||
        ord.studentName.toLowerCase().includes(q) ||
        ord.phone.toLowerCase().includes(q) ||
        (ord.shippingAddress || "").toLowerCase().includes(q) ||
        ord.courseName.toLowerCase().includes(q) ||
        ord.id.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  const handleQuickStatus = async (id: string, nextStatus: OrderStatus) => {
    setBusyId(id);
    try {
      await onChangeStatus(id, nextStatus);
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Kiểm tra bắt lỗi nhập thiếu / sai định dạng
    const errors: Record<string, string> = {
      studentName: validateFullName(studentName, true, "Họ tên người nhận"),
      phone: validatePhone(phone, true),
      shippingAddress: validateShippingAddress(shippingAddress, true),
      email: validateEmail(email, false),
      voucherCode: validateVoucherCode(voucherCode, false),
    };

    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    const selectedBook =
      products.find((p) => String(p.id) === courseId) || products[0];
    if (!selectedBook) {
      setFormError("Vui lòng chọn đầu sách.");
      return;
    }

    setSubmitting(true);
    setFormError("");
    setFieldErrors({});
    const unitPrice = parseVndPrice(selectedBook.price);
    try {
      await onCreateOrder({
        studentName: studentName.trim(),
        email: email.trim() || "docgia@hanzi.vn",
        phone: phone.trim(),
        shippingAddress: shippingAddress.trim(),
        courseId: String(selectedBook.id),
        courseName: `${selectedBook.name} (Bìa mềm)`,
        items: [
          {
            bookId: String(selectedBook.id),
            bookName: selectedBook.name,
            edition: "paperback",
            editionLabel: "Bìa mềm",
            unitPrice,
            quantity: 1,
          },
        ],
        subtotal: unitPrice,
        totalNumeric: unitPrice,
        amount: selectedBook.price,
        voucherCode: voucherCode.trim() || undefined,
        status,
      });
      setIsModalOpen(false);
      setStudentName("");
      setEmail("");
      setPhone("");
      setShippingAddress("");
      setVoucherCode("");
    } catch {
      setFormError("Không thể tạo đơn đặt sách. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="hidden sm:inline-flex p-1 rounded-xl bg-stone-200/70 border border-stone-200 w-fit">
          {(
            [
              { id: "all", label: "Tất cả", count: counts.all },
              { id: "pending", label: "Chờ xác nhận", count: counts.pending },
              { id: "approved", label: "Đang giao sách", count: counts.approved },
              { id: "cancelled", label: "Đã hủy", count: counts.cancelled },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>{tab.label}</span>{" "}
              <span className="font-tabular text-stone-400">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="sm:hidden w-fit">
          <label htmlFor="mobile-order-status" className="sr-only">
            Lọc trạng thái đơn sách
          </label>
          <select
            id="mobile-order-status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | OrderStatus)
            }
            className="h-10 px-3 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-800"
          >
            <option value="all">Trạng thái: Tất cả · {counts.all}</option>
            <option value="pending">
              Trạng thái: Chờ xác nhận · {counts.pending}
            </option>
            <option value="approved">
              Trạng thái: Đang giao sách · {counts.approved}
            </option>
            <option value="cancelled">
              Trạng thái: Đã hủy · {counts.cancelled}
            </option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="sm:w-64">
            <label htmlFor="admin-search-orders" className="sr-only">
              Tìm kiếm đơn đặt sách
            </label>
            <input
              id="admin-search-orders"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm người nhận, SĐT, địa chỉ, mã đơn..."
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setCourseId(products[0] ? String(products[0].id) : "hsk-1");
              setFormError("");
              setFieldErrors({});
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tạo đơn đặt sách</span>
          </button>
        </div>
      </div>

      {/* Bảng đơn đặt sách */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-10 px-4 text-center space-y-2">
            <p className="text-sm text-stone-500">
              Không có đơn đặt sách nào khớp với điều kiện lọc.
            </p>
            {(statusFilter !== "all" || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                }}
                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
              >
                Xóa lọc
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500">
                    <th scope="col" className="py-3 px-4">
                      Người nhận &amp; Địa chỉ giao
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Ấn phẩm đặt mua
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 text-right whitespace-nowrap"
                    >
                      Thanh toán
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 text-right whitespace-nowrap w-44"
                    >
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-sm">
                  {filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      className="hover:bg-stone-50/90 transition-colors"
                    >
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-stone-900 truncate">
                          {ord.studentName}
                        </div>
                        <div className="text-xs text-stone-500 truncate font-tabular">
                          {ord.phone} · {ord.email}
                        </div>
                        {ord.shippingAddress && (
                          <div
                            className="mt-0.5 flex items-center gap-1 text-xs text-stone-500 truncate"
                            title={ord.shippingAddress}
                          >
                            <MapPin className="w-3 h-3 shrink-0 text-amber-600" />
                            <span className="truncate">{ord.shippingAddress}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div
                          className="font-medium text-stone-800 line-clamp-2"
                          title={ord.courseName}
                        >
                          {ord.courseName}
                        </div>
                        <div className="text-xs text-stone-400 truncate mt-0.5">
                          Mã {ord.id} · {ord.createdAt}
                          {ord.voucherCode ? ` · Mã ${ord.voucherCode}` : ""}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            ord.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : ord.status === "cancelled"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-800"
                          }`}
                        >
                          {ord.status === "approved"
                            ? "Đang giao sách"
                            : ord.status === "cancelled"
                            ? "Đã hủy · Hoàn kho"
                            : "Chờ xác nhận"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-stone-900 font-tabular whitespace-nowrap">
                        {ord.amount}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1">
                          {ord.status !== "approved" && (
                            <button
                              type="button"
                              disabled={busyId === ord.id}
                              onClick={() =>
                                handleQuickStatus(ord.id, "approved")
                              }
                              aria-label={`Xác nhận giao sách đơn ${ord.id}`}
                              title="Xác nhận đóng gói & giao sách"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Giao sách</span>
                            </button>
                          )}
                          {ord.status === "pending" && (
                            <button
                              type="button"
                              disabled={busyId === ord.id}
                              onClick={() =>
                                handleQuickStatus(ord.id, "cancelled")
                              }
                              aria-label={`Hủy đơn của ${ord.studentName}`}
                              title="Hủy đơn & hoàn kho"
                              className="p-2 rounded-lg text-stone-500 hover:text-amber-800 hover:bg-amber-50 cursor-pointer disabled:opacity-50"
                            >
                              <Ban className="w-4 h-4" aria-hidden="true" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onRequestDelete(ord)}
                            aria-label={`Xóa đơn ${ord.id} của ${ord.studentName}`}
                            title="Xóa đơn"
                            className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="md:hidden divide-y divide-stone-200">
              {filteredOrders.map((ord) => (
                <li key={ord.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-stone-900 truncate">
                        {ord.studentName} · {ord.phone}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">
                        {ord.courseName}
                      </p>
                      {ord.shippingAddress && (
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          📍 {ord.shippingAddress}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0 ${
                        ord.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : ord.status === "cancelled"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {ord.status === "approved"
                        ? "Đang giao"
                        : ord.status === "cancelled"
                        ? "Đã hủy"
                        : "Chờ duyệt"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-black text-stone-900 font-tabular">
                      {ord.amount}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {ord.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(ord.id, "approved")}
                          className="px-3 min-h-10 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Giao sách
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onRequestDelete(ord)}
                        aria-label={`Xóa đơn ${ord.studentName}`}
                        className="px-3 min-h-10 rounded-xl border border-rose-200 bg-rose-50/70 text-xs font-bold text-rose-700 cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Modal tạo đơn đặt sách thủ công */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting)
              setIsModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-order-title"
            className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h2
                id="create-order-title"
                className="text-base font-black text-stone-900"
              >
                Tạo Đơn Đặt Sách Mới
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Đóng hộp thoại"
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={handleCreateSubmit}
              className="p-5 space-y-4 max-h-[82vh] overflow-y-auto"
            >
              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="ord-name"
                    className="block text-xs font-bold text-stone-700"
                  >
                    Họ tên người nhận <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="ord-name"
                    type="text"
                    aria-invalid={Boolean(fieldErrors.studentName)}
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      setFieldErrors((p) => ({ ...p, studentName: "" }));
                    }}
                    placeholder="Nguyễn Minh Anh"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      fieldErrors.studentName
                        ? "border-red-400 bg-red-50/40"
                        : "border-stone-300"
                    }`}
                  />
                  {fieldErrors.studentName && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.studentName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="ord-phone"
                    className="block text-xs font-bold text-stone-700"
                  >
                    Số điện thoại <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="ord-phone"
                    type="tel"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFieldErrors((p) => ({ ...p, phone: "" }));
                    }}
                    placeholder="0901234567"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      fieldErrors.phone
                        ? "border-red-400 bg-red-50/40"
                        : "border-stone-300"
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="ord-address"
                  className="block text-xs font-bold text-stone-700"
                >
                  Địa chỉ nhận sách tận nơi{" "}
                  <span className="text-rose-600">*</span>
                </label>
                <input
                  id="ord-address"
                  type="text"
                  aria-invalid={Boolean(fieldErrors.shippingAddress)}
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    setFieldErrors((p) => ({ ...p, shippingAddress: "" }));
                  }}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP"
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    fieldErrors.shippingAddress
                      ? "border-red-400 bg-red-50/40"
                      : "border-stone-300"
                  }`}
                />
                {fieldErrors.shippingAddress && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {fieldErrors.shippingAddress}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="ord-email"
                  className="block text-xs font-bold text-stone-700"
                >
                  Email độc giả (tùy chọn)
                </label>
                <input
                  id="ord-email"
                  type="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="docgia@hanzi.vn"
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    fieldErrors.email
                      ? "border-red-400 bg-red-50/40"
                      : "border-stone-300"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="ord-course"
                  className="block text-xs font-bold text-stone-700"
                >
                  Đầu sách đặt mua <span className="text-rose-600">*</span>
                </label>
                <select
                  id="ord-course"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name} ({p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="ord-voucher"
                    className="block text-xs font-bold text-stone-700"
                  >
                    Mã giảm giá áp dụng
                  </label>
                  <input
                    id="ord-voucher"
                    type="text"
                    aria-invalid={Boolean(fieldErrors.voucherCode)}
                    value={voucherCode}
                    onChange={(e) => {
                      setVoucherCode(e.target.value.toUpperCase());
                      setFieldErrors((p) => ({ ...p, voucherCode: "" }));
                    }}
                    placeholder="HANZI50K"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      fieldErrors.voucherCode
                        ? "border-red-400 bg-red-50/40"
                        : "border-stone-300"
                    }`}
                  />
                  {fieldErrors.voucherCode && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.voucherCode}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="ord-status"
                    className="block text-xs font-bold text-stone-700"
                  >
                    Trạng thái đơn
                  </label>
                  <select
                    id="ord-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="approved">Đang giao sách ngay</option>
                    <option value="pending">Chờ xác nhận</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs font-bold text-stone-700 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : "Lưu đơn đặt sách"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
