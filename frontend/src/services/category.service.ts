import { ICategory } from "@/interfaces/category";
import { getApiUrl } from "@/lib/api-url";

// ============================================================================
// [YÊU CẦU CÔ - CRUD Tủ Sách Chuyên Đề bằng React fetch + try...catch (:3001/api)]
// Gồm đủ 5 hàm: GET danh sách, GET theo ID, POST thêm mới, PUT cập nhật, DELETE xóa.
// ============================================================================

const isNextDynamicSignal = (err: unknown): boolean =>
  typeof err === "object" &&
  err !== null &&
  "digest" in err &&
  (err as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE";

// 1. READ — Lấy toàn bộ danh mục từ MongoDB
export const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    const res = await fetch(`${getApiUrl()}/categories`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return (await res.json()) as ICategory[];
  } catch (error) {
    if (isNextDynamicSignal(error)) throw error;
    console.error("Không thể tải danh mục từ Backend:", error);
    return [];
  }
};

// 2. READ BY ID — Lấy chi tiết danh mục theo ID
export const getCategoryById = async (id: string | number): Promise<ICategory | undefined> => {
  try {
    const res = await fetch(`${getApiUrl()}/categories/${encodeURIComponent(String(id))}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return undefined;
    }
    return (await res.json()) as ICategory;
  } catch (error) {
    if (isNextDynamicSignal(error)) throw error;
    console.error("Không thể tải chi tiết danh mục:", error);
    return undefined;
  }
};

// 3. CREATE — Thêm mới danh mục vào MongoDB
export const createCategory = async (
  payload: Omit<ICategory, "id"> & { id?: string }
): Promise<{ category: ICategory; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Lỗi HTTP: ${res.status}`);
    }
    const created: ICategory = await res.json();
    return { category: created, source: "api" };
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    throw error;
  }
};

// 4. UPDATE — Cập nhật danh mục trong MongoDB
export const updateCategory = async (
  id: string | number,
  payload: Partial<ICategory>
): Promise<{ category: ICategory; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/categories/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Lỗi HTTP: ${res.status}`);
    }
    const updated: ICategory = await res.json();
    return { category: updated, source: "api" };
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    throw error;
  }
};

// 5. DELETE — Xóa danh mục khỏi MongoDB
export const deleteCategory = async (
  id: string | number
): Promise<{ success: boolean; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/categories/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return { success: true, source: "api" };
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error);
    throw error;
  }
};
