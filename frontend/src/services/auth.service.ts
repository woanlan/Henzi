import { IUser, ILoginForm, IRegisterForm } from "@/interfaces/user";
import { getApiUrl } from "@/lib/api-url";

// ============================================================================
// [YÊU CẦU CÔ - Xác Thực Đăng Nhập / Đăng Ký + CRUD Tài Khoản Thành Viên]
// Quản lý phiên localStorage + gọi API `/api/auth/login`, `/api/auth/register`
// và 4 API CRUD `/api/users` kết nối trực tiếp MongoDB.
// ============================================================================
const CURRENT_USER_KEY = "hanzi_current_user";
export const AUTH_CHANGE_EVENT = "hanzi-auth-change";

/** Đọc thông tin độc giả đang đăng nhập từ localStorage (tự chuẩn hóa tên thương hiệu cũ nếu có) */
export const getSavedUser = (): IUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as IUser;
    let mutated = false;
    if (parsed.fullName && /Văn Khố/i.test(parsed.fullName)) {
      parsed.fullName = parsed.fullName
        .replace(/Quản Thư Văn Khố/gi, "Quản Trị HANZI")
        .replace(/Văn Khố/gi, "HANZI")
        .replace(/\s+/g, " ")
        .trim();
      mutated = true;
    }
    if (parsed.email && /hanzivankho\.vn/i.test(parsed.email)) {
      parsed.email = parsed.email.replace(/hanzivankho\.vn/gi, "hanzi.vn");
      mutated = true;
    }
    if (mutated) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return null;
  }
};

/** Lưu phiên người dùng đang đăng nhập trên trình duyệt và thông báo cho Navbar */
export const saveCurrentUser = (user: IUser): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
};

/** Xóa phiên đăng nhập trên trình duyệt */
export const clearCurrentUser = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
};

// 1. Đăng nhập xác thực trực tiếp qua Backend MongoDB (POST /api/auth/login)
export const loginUser = async (
  credentials: ILoginForm
): Promise<{ success: boolean; user?: IUser; message?: string }> => {
  try {
    const res = await fetch(`${getApiUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Tên đăng nhập hoặc mật khẩu không chính xác!",
      };
    }
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Lỗi kết nối Backend khi đăng nhập:", error);
    return {
      success: false,
      message: "Không kết nối được tới máy chủ Backend MongoDB (:3001)!",
    };
  }
};

// 2. Đăng ký tài khoản lưu vào MongoDB (POST /api/auth/register)
export const registerUser = async (
  form: IRegisterForm
): Promise<{ success: boolean; user?: IUser; message?: string }> => {
  try {
    if (!form.username || !form.email || !form.password) {
      return { success: false, message: "Vui lòng điền đầy đủ các thông tin bắt buộc!" };
    }
    if (form.password !== form.confirmPassword) {
      return { success: false, message: "Mật khẩu xác nhận không khớp!" };
    }

    const res = await fetch(`${getApiUrl()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.message || "Đăng ký không thành công!" };
    }
    return { success: true, user: data.user };
  } catch (error) {
    console.error("Lỗi kết nối Backend khi đăng ký:", error);
    return {
      success: false,
      message: "Không kết nối được tới máy chủ Backend MongoDB (:3001)!",
    };
  }
};

// ================= ADMIN CRUD TÀI KHOẢN HỌC VIÊN (/api/users) =================

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const res = await fetch(`${getApiUrl()}/users`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return (await res.json()) as IUser[];
  } catch (error) {
    console.error("Không thể tải danh sách tài khoản:", error);
    return [];
  }
};

export const createUserAccount = async (payload: {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  password?: string;
  role: string;
}): Promise<{ user: IUser; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Lỗi HTTP: ${res.status}`);
    }
    const created: IUser = await res.json();
    return { user: created, source: "api" };
  } catch (error) {
    console.error("Lỗi tạo tài khoản:", error);
    throw error;
  }
};

export const updateUserAccount = async (
  id: string | number,
  payload: Partial<IUser>
): Promise<{ user: IUser; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/users/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Lỗi HTTP: ${res.status}`);
    }
    const updated: IUser = await res.json();
    return { user: updated, source: "api" };
  } catch (error) {
    console.error("Lỗi cập nhật tài khoản:", error);
    throw error;
  }
};

export const deleteUserAccount = async (
  id: string | number
): Promise<{ success: boolean; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/users/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return { success: true, source: "api" };
  } catch (error) {
    console.error("Lỗi xóa tài khoản:", error);
    throw error;
  }
};
