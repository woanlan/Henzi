import { IVoucher } from "@/interfaces/order";
import { getApiUrl } from "@/lib/api-url";

// ============================================================================
// [YÊU CẦU CÔ - CRUD Mã Ưu Đãi Mua Sách bằng fetch + try...catch (:3001/api)]
// Kết hợp cùng Custom Hook `useVouchersSWR` (swr) và Ví Redux (`voucherWalletSlice`).
// ============================================================================

// 1. READ — Lấy danh sách mã ưu đãi từ MongoDB
export const getAllVouchers = async (): Promise<IVoucher[]> => {
  try {
    const res = await fetch(`${getApiUrl()}/vouchers`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return (await res.json()) as IVoucher[];
  } catch (error) {
    console.error("Không thể tải danh sách mã ưu đãi:", error);
    return [];
  }
};

// 2. CREATE — Tạo mã ưu đãi mới trong MongoDB
export const createVoucher = async (
  payload: Omit<IVoucher, "id">
): Promise<{ voucher: IVoucher; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/vouchers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Lỗi HTTP: ${res.status}`);
    }
    const created: IVoucher = await res.json();
    return { voucher: created, source: "api" };
  } catch (error) {
    console.error("Lỗi tạo mã ưu đãi:", error);
    throw error;
  }
};

// 3. UPDATE — Cập nhật mã ưu đãi trong MongoDB
export const updateVoucher = async (
  id: string,
  payload: Partial<IVoucher>
): Promise<{ voucher: IVoucher; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/vouchers/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    const updated: IVoucher = await res.json();
    return { voucher: updated, source: "api" };
  } catch (error) {
    console.error("Lỗi cập nhật mã ưu đãi:", error);
    throw error;
  }
};

// 4. DELETE — Xóa mã ưu đãi khỏi MongoDB
export const deleteVoucher = async (
  id: string
): Promise<{ success: boolean; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/vouchers/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return { success: true, source: "api" };
  } catch (error) {
    console.error("Lỗi xóa mã ưu đãi:", error);
    throw error;
  }
};
