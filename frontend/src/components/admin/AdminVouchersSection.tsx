"use client";

import React, { useMemo, useState } from "react";
import { IVoucher } from "@/interfaces/order";
import { Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";
// [YÊU CẦU CÔ - Lab 4 (Form Validation)] Import hàm validate dùng chung
import {
  validateRequired,
  validateMinLength,
  validateVoucherCode,
  hasErrors,
} from "@/lib/validation";

// ============================================================================
// [YÊU CẦU CÔ - Lab 3 (Props) + Lab 4 (Form) + useMemo + CRUD Mã Ưu Đãi]
// Quản lý kho Voucher học phí: tìm kiếm nhanh bằng `useMemo`, thêm mã mới
// (`POST /api/vouchers`), cập nhật (`PUT /api/vouchers/:id`) và xóa mã.
// ============================================================================
interface AdminVouchersSectionProps {
  vouchers: IVoucher[];
  onCreateVoucher: (payload: Omit<IVoucher, "id">) => Promise<void>;
  onUpdateVoucher: (id: string, payload: Partial<IVoucher>) => Promise<void>;
  onRequestDelete: (voucher: IVoucher) => void;
}

const EMPTY_VOUCHER_FORM: Omit<IVoucher, "id"> = {
  code: "",
  title: "",
  desc: "",
  condition: "Đơn từ 199.000₫",
  expiry: "HSD: 31/12/2026",
  badge: "Ưu Đãi",
};

export default function AdminVouchersSection({
  vouchers,
  onCreateVoucher,
  onUpdateVoucher,
  onRequestDelete,
}: AdminVouchersSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<IVoucher, "id">>(EMPTY_VOUCHER_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // [YÊU CẦU CÔ - Validation] Lỗi từng field trong form voucher
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const filteredVouchers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return vouchers.filter(
      (v) =>
        !q ||
        v.code.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q) ||
        v.desc.toLowerCase().includes(q)
    );
  }, [vouchers, searchTerm]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_VOUCHER_FORM);
    setFormError("");
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (v: IVoucher) => {
    setEditingId(v.id);
    setForm({
      code: v.code,
      title: v.title,
      desc: v.desc,
      condition: v.condition,
      expiry: v.expiry,
      badge: v.badge,
    });
    setFormError("");
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Validate form voucher bằng JS/TS thuần
    // validateVoucherCode: bắt buộc + chỉ chứa chữ HOA, số, dấu (-) hoặc (_)
    // validateMinLength / validateRequired: bắt buộc không để trống và đủ độ dài
    const errors: Record<string, string> = {
      code: validateVoucherCode(form.code, true),
      title: validateMinLength(form.title, 3, "Tên chương trình ưu đãi"),
      condition: validateRequired(form.condition, "Điều kiện áp dụng"),
      expiry: validateRequired(form.expiry, "Thời hạn sử dụng"),
      desc: validateMinLength(form.desc, 5, "Mô tả ngắn"),
    };

    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      if (editingId) {
        await onUpdateVoucher(editingId, form);
      } else {
        await onCreateVoucher(form);
      }
      setIsModalOpen(false);
    } catch {
      setFormError("Không thể lưu mã ưu đãi. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="sm:w-72">
          <label htmlFor="admin-search-vouchers" className="sr-only">
            Tìm mã ưu đãi
          </label>
          <input
            id="admin-search-vouchers"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã code hoặc tên ưu đãi..."
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Thêm mã ưu đãi</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {filteredVouchers.length === 0 ? (
          <div className="py-10 px-4 text-center text-sm text-stone-500">
            Không có mã ưu đãi nào phù hợp.
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500">
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Mã ưu đãi
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Chương trình khuyến mãi
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Điều kiện
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Hạn áp dụng
                    </th>
                    <th scope="col" className="py-3 px-4 text-right whitespace-nowrap w-28">
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-sm">
                  {filteredVouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-stone-50/90 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          {v.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 truncate">{v.title}</span>
                          {v.badge && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-bold shrink-0">
                              {v.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 truncate">{v.desc}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-600 whitespace-nowrap">
                        {v.condition}
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-600 whitespace-nowrap">
                        {v.expiry}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(v)}
                            aria-label={`Chỉnh sửa mã ${v.code}`}
                            className="p-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRequestDelete(v)}
                            aria-label={`Xóa mã ${v.code}`}
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
              {filteredVouchers.map((v) => (
                <li key={v.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-stone-900">{v.title}</p>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{v.desc}</p>
                    </div>
                    <span className="font-mono text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                      {v.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-stone-500">{v.expiry}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(v)}
                        className="px-3 min-h-10 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestDelete(v)}
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

      {/* Modal Thêm / Sửa Voucher */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) setIsModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="voucher-modal-title"
            className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h2 id="voucher-modal-title" className="text-base font-black text-stone-900">
                {editingId ? "Cập Nhật Mã Ưu Đãi" : "Thêm Mã Ưu Đãi Mới"}
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

            <form noValidate onSubmit={handleSave} className="p-5 space-y-4">
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
                  <label htmlFor="vch-code" className="block text-xs font-bold text-stone-700">
                    Mã code <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="vch-code"
                    type="text"
                    aria-invalid={Boolean(fieldErrors.code)}
                    value={form.code}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }));
                      setFieldErrors((p) => ({ ...p, code: "" }));
                    }}
                    placeholder="HSK100K"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.code ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                  />
                  {/* [YÊU CẦU CÔ - Validation] Lỗi inline mã voucher */}
                  {fieldErrors.code && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.code}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="vch-badge" className="block text-xs font-bold text-stone-700">
                    Nhãn nổi bật
                  </label>
                  <input
                    id="vch-badge"
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                    placeholder="Hot / Mới / Độc Quyền"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="vch-title" className="block text-xs font-bold text-stone-700">
                  Tên ưu đãi <span className="text-rose-600">*</span>
                </label>
                <input
                  id="vch-title"
                  type="text"
                  aria-invalid={Boolean(fieldErrors.title)}
                  value={form.title}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, title: e.target.value }));
                    setFieldErrors((p) => ({ ...p, title: "" }));
                  }}
                  placeholder="Giảm 50.000₫ Đơn Sách Từ 299.000₫"
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.title ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                />
                {/* [YÊU CẦU CÔ - Validation] Lỗi inline tên ưu đãi */}
                {fieldErrors.title && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="vch-cond" className="block text-xs font-bold text-stone-700">
                    Điều kiện áp dụng <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="vch-cond"
                    type="text"
                    aria-invalid={Boolean(fieldErrors.condition)}
                    value={form.condition}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, condition: e.target.value }));
                      setFieldErrors((p) => ({ ...p, condition: "" }));
                    }}
                    placeholder="Đơn từ 299.000₫"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.condition ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                  />
                  {/* [YÊU CẦU CÔ - Validation] Lỗi inline điều kiện */}
                  {fieldErrors.condition && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.condition}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="vch-exp" className="block text-xs font-bold text-stone-700">
                    Thời hạn sử dụng <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="vch-exp"
                    type="text"
                    aria-invalid={Boolean(fieldErrors.expiry)}
                    value={form.expiry}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, expiry: e.target.value }));
                      setFieldErrors((p) => ({ ...p, expiry: "" }));
                    }}
                    placeholder="HSD: 31/12/2026"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.expiry ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                  />
                  {/* [YÊU CẦU CÔ - Validation] Lỗi inline hạn sử dụng */}
                  {fieldErrors.expiry && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.expiry}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="vch-desc" className="block text-xs font-bold text-stone-700">
                  Mô tả ngắn (hiển thị ngoài trang chủ) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="vch-desc"
                  rows={2}
                  aria-invalid={Boolean(fieldErrors.desc)}
                  value={form.desc}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, desc: e.target.value }));
                    setFieldErrors((p) => ({ ...p, desc: "" }));
                  }}
                  placeholder="Áp dụng tự động cho độc giả đặt mua sách..."
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.desc ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                />
                {/* [YÊU CẦU CÔ - Validation] Lỗi inline mô tả */}
                {fieldErrors.desc && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.desc}
                  </p>
                )}
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
                  {submitting ? "Đang lưu..." : "Lưu mã ưu đãi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
