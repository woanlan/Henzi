import { IOrder, IOrderItem, OrderStatus } from "@/interfaces/order";
import { getApiUrl } from "@/lib/api-url";

// ============================================================================
// [YÊU CẦU CÔ - CRUD Đơn Đặt Sách bằng fetch + try...catch (:3001/api)]
// Gồm đủ 4 thao tác: GET danh sách đơn, POST tạo đơn, PUT duyệt/hủy đơn, DELETE xóa.
// ============================================================================

// 1. READ — Lấy danh sách đơn đặt sách từ MongoDB (mới nhất xếp đầu)
export const getAllOrders = async (): Promise<IOrder[]> => {
  try {
    const res = await fetch(`${getApiUrl()}/orders`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return (await res.json()) as IOrder[];
  } catch (error) {
    console.error("Không thể tải đơn đặt sách:", error);
    return [];
  }
};

// 2. CREATE — Gửi đơn đặt mua sách lưu vào MongoDB (kèm trừ kho theo ấn bản)
export const createOrder = async (payload: {
  studentName: string;
  email?: string;
  phone: string;
  shippingAddress?: string;
  courseId: string;
  courseName: string;
  items?: IOrderItem[];
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  totalNumeric?: number;
  amount: string;
  voucherCode?: string;
  status?: OrderStatus;
}): Promise<{ order: IOrder; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Lỗi HTTP: ${res.status}`);
    }
    const created: IOrder = await res.json();
    return { order: created, source: "api" };
  } catch (error) {
    console.error("Lỗi tạo đơn đặt sách:", error);
    throw error;
  }
};

// 3. UPDATE — Cập nhật trạng thái đơn đặt sách trong MongoDB
export const updateOrder = async (
  id: string,
  patch: Partial<IOrder>
): Promise<{ order: IOrder; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/orders/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    const updated: IOrder = await res.json();
    return { order: updated, source: "api" };
  } catch (error) {
    console.error("Lỗi cập nhật đơn đặt sách:", error);
    throw error;
  }
};

// 4. DELETE — Xóa đơn đặt sách khỏi MongoDB
export const deleteOrder = async (
  id: string
): Promise<{ success: boolean; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/orders/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return { success: true, source: "api" };
  } catch (error) {
    console.error("Lỗi xóa đơn đặt sách:", error);
    throw error;
  }
};
