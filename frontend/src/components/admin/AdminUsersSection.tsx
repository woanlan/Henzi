"use client";

import React, { useMemo, useState } from "react";
import { IUser } from "@/interfaces/user";
import { Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";
// [YÊU CẦU CÔ - Lab 4 (Form Validation)] Import hàm validate dùng chung
import {
  validateUsername,
  validateFullName,
  validateEmail,
  validatePhone,
  validateMinLength,
  hasErrors,
} from "@/lib/validation";

// ============================================================================
// [YÊU CẦU CÔ - Lab 3 (Props) + Lab 4 (Form) + useMemo + CRUD Thành Viên]
// Quản lý tài khoản Học viên & Quản trị viên: lọc vai trò, tìm kiếm (useMemo),
// thêm mới (`POST /api/users`), sửa quyền (`PUT /api/users/:id`) và xóa tài khoản.
// ============================================================================
interface AdminUsersSectionProps {
  users: IUser[];
  currentAdminUsername: string;
  onCreateUser: (payload: {
    username: string;
    email: string;
    fullName: string;
    phone?: string;
    password?: string;
    role: string;
  }) => Promise<void>;
  onUpdateUser: (id: string | number, payload: Partial<IUser>) => Promise<void>;
  onRequestDelete: (user: IUser) => void;
}

interface UserFormState {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

const EMPTY_USER_FORM: UserFormState = {
  username: "",
  fullName: "",
  email: "",
  phone: "",
  password: "123",
  role: "student",
};

export default function AdminUsersSection({
  users,
  currentAdminUsername,
  onCreateUser,
  onUpdateUser,
  onRequestDelete,
}: AdminUsersSectionProps) {
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "admin">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | number | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_USER_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // [YÊU CẦU CÔ - Validation] Lỗi từng field trong form tạo/sửa user
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const adminCount = useMemo(
    () => users.filter((u) => u.role === "admin").length,
    [users]
  );
  const studentCount = users.length - adminCount;

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      const roleStr = u.role === "admin" ? "admin" : "student";
      const matchesRole = roleFilter === "all" || roleStr === roleFilter;
      const matchesSearch =
        !q ||
        u.username.toLowerCase().includes(q) ||
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchTerm]);

  const openCreateModal = () => {
    setEditingUserId(null);
    setForm(EMPTY_USER_FORM);
    setFormError("");
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (user: IUser) => {
    setEditingUserId(user.id ?? user.username);
    setForm({
      username: user.username,
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role === "admin" ? "admin" : "student",
    });
    setFormError("");
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Validate form quản lý user bằng JS/TS thuần
    // validateUsername: format a-z/0-9/_, 3-20 ký tự
    // validateFullName: bắt buộc, >= 2 ký tự
    // validateEmail: có @, đúng định dạng
    // validatePhone: 10 số bắt đầu 0 (không bắt buộc khi để trống)
    const errors: Record<string, string> = {
      username: validateUsername(form.username),
      fullName: validateFullName(form.fullName, true, "Họ và tên hiển thị"),
      email: validateEmail(form.email, true),
      phone: validatePhone(form.phone, false),
      password:
        editingUserId === null
          ? validateMinLength(form.password, 3, "Mật khẩu")
          : form.password.trim()
          ? validateMinLength(form.password, 3, "Mật khẩu mới")
          : "",
    };

    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      if (editingUserId !== null) {
        await onUpdateUser(editingUserId, {
          username: form.username.trim(),
          fullName: form.fullName.trim() || form.username.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
          ...(form.password.trim() ? { password: form.password.trim() } : {}),
        });
      } else {
        await onCreateUser({
          username: form.username.trim(),
          fullName: form.fullName.trim() || form.username.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password.trim() || "123",
          role: form.role,
        });
      }
      setIsModalOpen(false);
    } catch {
      setFormError("Không thể lưu tài khoản. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Thanh công cụ lọc vai trò + Tìm kiếm + Thêm tài khoản */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="hidden sm:inline-flex p-1 rounded-xl bg-stone-200/70 border border-stone-200 w-fit">
          {(
            [
              { id: "all", label: "Tất cả", count: users.length },
              { id: "student", label: "Độc giả", count: studentCount },
              { id: "admin", label: "Quản trị viên", count: adminCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                roleFilter === tab.id
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
          <label htmlFor="mobile-role-filter" className="sr-only">
            Lọc vai trò thành viên
          </label>
          <select
            id="mobile-role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | "student" | "admin")}
            className="h-10 px-3 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-800"
          >
            <option value="all">Vai trò: Tất cả · {users.length}</option>
            <option value="student">Vai trò: Độc giả · {studentCount}</option>
            <option value="admin">Vai trò: Quản trị viên · {adminCount}</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="sm:w-64">
            <label htmlFor="admin-search-users" className="sr-only">
              Tìm kiếm thành viên
            </label>
            <input
              id="admin-search-users"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên, tài khoản, email..."
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Thêm tài khoản</span>
          </button>
        </div>
      </div>

      {/* Bảng thành viên */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-10 px-4 text-center space-y-2">
            <p className="text-sm text-stone-500">
              Không tìm thấy tài khoản thành viên nào phù hợp.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500">
                    <th scope="col" className="py-3 px-4">
                      Thành viên
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Email liên hệ
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Số điện thoại
                    </th>
                    <th scope="col" className="py-3 px-4 whitespace-nowrap">
                      Vai trò
                    </th>
                    <th scope="col" className="py-3 px-4 text-right whitespace-nowrap w-28">
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-sm">
                  {filteredUsers.map((u) => {
                    const isSelf = u.username === currentAdminUsername;
                    const isAdmin = u.role === "admin";
                    return (
                      <tr
                        key={String(u.id ?? u.username)}
                        className="hover:bg-stone-50/90 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                isAdmin
                                  ? "bg-stone-900 text-amber-300"
                                  : "bg-stone-200 text-stone-700"
                              }`}
                            >
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-stone-900 truncate">
                                {u.fullName || u.username}
                                {isSelf && (
                                  <span className="ml-2 text-[11px] font-medium text-stone-400">
                                    (Bạn)
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-stone-500 font-mono truncate">
                                @{u.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600 truncate max-w-xs">
                          {u.email || "—"}
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-tabular whitespace-nowrap">
                          {u.phone || "—"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isAdmin ? (
                            <span className="inline-flex px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                              Quản trị viên
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-stone-600">Độc giả</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              aria-label={`Chỉnh sửa tài khoản ${u.username}`}
                              className="p-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" aria-hidden="true" />
                            </button>
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => onRequestDelete(u)}
                                aria-label={`Xóa tài khoản ${u.username}`}
                                className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Danh sách trên mobile (< md) */}
            <ul className="md:hidden divide-y divide-stone-200">
              {filteredUsers.map((u) => {
                const isSelf = u.username === currentAdminUsername;
                const isAdmin = u.role === "admin";
                return (
                  <li key={String(u.id ?? u.username)} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-stone-900 truncate">
                            {u.fullName || u.username}
                          </p>
                          <p className="text-xs text-stone-500 truncate">
                            @{u.username} · {u.email || "—"}
                          </p>
                        </div>
                      </div>
                      {isAdmin && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold shrink-0">
                          Quản trị
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-stone-500 font-tabular">
                        {u.phone || "Chưa cập nhật SĐT"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="px-3 min-h-10 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 cursor-pointer"
                        >
                          Sửa
                        </button>
                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => onRequestDelete(u)}
                            className="px-3 min-h-10 rounded-xl border border-rose-200 bg-rose-50/70 text-xs font-bold text-rose-700 cursor-pointer"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Modal Thêm / Sửa Tài khoản */}
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
            aria-labelledby="user-modal-title"
            className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h2 id="user-modal-title" className="text-base font-black text-stone-900">
                {editingUserId !== null ? "Cập Nhật Tài Khoản" : "Thêm Tài Khoản Mới"}
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
                  <label htmlFor="usr-username" className="block text-xs font-bold text-stone-700">
                    Tên đăng nhập <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="usr-username"
                    type="text"
                    aria-invalid={Boolean(fieldErrors.username)}
                    disabled={editingUserId !== null}
                    value={form.username}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, username: e.target.value }));
                      setFieldErrors((p) => ({ ...p, username: "" }));
                    }}
                    placeholder="hocvien_hsk"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 disabled:bg-stone-100 disabled:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.username ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                  />
                  {/* [YÊU CẦU CÔ - Validation] Lỗi inline username */}
                  {fieldErrors.username && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.username}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="usr-role" className="block text-xs font-bold text-stone-700">
                    Phân quyền tài khoản
                  </label>
                  <select
                    id="usr-role"
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="student">Độc giả (Reader)</option>
                    <option value="admin">Quản trị hiệu sách (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="usr-fullname" className="block text-xs font-bold text-stone-700">
                  Họ và tên hiển thị <span className="text-rose-600">*</span>
                </label>
                <input
                  id="usr-fullname"
                  type="text"
                  aria-invalid={Boolean(fieldErrors.fullName)}
                  value={form.fullName}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, fullName: e.target.value }));
                    setFieldErrors((p) => ({ ...p, fullName: "" }));
                  }}
                  placeholder="Nguyễn Minh Châu"
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.fullName ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                />
                {/* [YÊU CẦU CÔ - Validation] Lỗi inline họ tên */}
                {fieldErrors.fullName && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="usr-email" className="block text-xs font-bold text-stone-700">
                    Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="usr-email"
                    type="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    value={form.email}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, email: e.target.value }));
                      setFieldErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="hocvien@gmail.com"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.email ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                  />
                  {/* [YÊU CẦU CÔ - Validation] Lỗi inline email */}
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="usr-phone" className="block text-xs font-bold text-stone-700">
                    Số điện thoại
                  </label>
                  <input
                    id="usr-phone"
                    type="tel"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    value={form.phone}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, phone: e.target.value }));
                      setFieldErrors((p) => ({ ...p, phone: "" }));
                    }}
                    placeholder="0901234567"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.phone ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                  />
                  {/* [YÊU CẦU CÔ - Validation] Lỗi inline số điện thoại */}
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="usr-pass" className="block text-xs font-bold text-stone-700">
                  {editingUserId !== null ? (
                    "Mật khẩu mới (để trống nếu giữ nguyên)"
                  ) : (
                    <>
                      Mật khẩu mặc định <span className="text-rose-600">*</span>
                    </>
                  )}
                </label>
                <input
                  id="usr-pass"
                  type="text"
                  aria-invalid={Boolean(fieldErrors.password)}
                  value={form.password}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, password: e.target.value }));
                    setFieldErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder={editingUserId !== null ? "Giữ nguyên mật khẩu cũ" : "123"}
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${fieldErrors.password ? "border-red-400 bg-red-50/40" : "border-stone-300"}`}
                />
                {/* [YÊU CẦU CÔ - Validation] Lỗi inline mật khẩu */}
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />{fieldErrors.password}
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
                  {submitting ? "Đang lưu..." : "Lưu tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
