import { IProduct, IPlan, IHSKCourse } from "@/interfaces/product";
import { getApiUrl } from "@/lib/api-url";

// ============================================================================
// [YÊU CẦU CÔ - ASM 1 & ASM Nhóm: CRUD bằng React gọi REST API Node.js + MongoDB]
// Toàn bộ hàm gọi API sử dụng `fetch` kết hợp `async/await` và `try...catch`
// kết nối sang Backend Express (:3001/api) lưu trữ trực tiếp trong MongoDB.
// ============================================================================

// Kiểm tra trạng thái kết nối tới Backend MongoDB
export const checkJsonServerHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${getApiUrl()}/health`, { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.ok);
  } catch {
    return false;
  }
};

const isNextDynamicSignal = (err: unknown): boolean =>
  typeof err === "object" &&
  err !== null &&
  "digest" in err &&
  (err as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE";

// 1. READ — Lấy toàn bộ danh sách đầu sách từ MongoDB
export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    const res = await fetch(`${getApiUrl()}/products`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return (await res.json()) as IProduct[];
  } catch (error) {
    if (isNextDynamicSignal(error)) throw error;
    console.error("Không thể tải danh sách đầu sách từ Backend:", error);
    return [];
  }
};

// 2. READ BY ID — Lấy chi tiết đầu sách theo ID từ MongoDB
export const getProductById = async (id: string | number): Promise<IProduct | undefined> => {
  try {
    const res = await fetch(`${getApiUrl()}/products/${encodeURIComponent(String(id))}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return undefined;
    }
    return (await res.json()) as IProduct;
  } catch (error) {
    if (isNextDynamicSignal(error)) throw error;
    console.error("Không thể tải chi tiết đầu sách:", error);
    return undefined;
  }
};

// 3. READ BY CATEGORY — Lọc đầu sách theo danh mục từ MongoDB
export const getProductsByCategory = async (
  categoryId: string | number
): Promise<IProduct[]> => {
  try {
    const res = await fetch(
      `${getApiUrl()}/products?categoryId=${encodeURIComponent(String(categoryId))}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return (await res.json()) as IProduct[];
  } catch (error) {
    if (isNextDynamicSignal(error)) throw error;
    console.error("Không thể lọc đầu sách theo danh mục:", error);
    return [];
  }
};

// 4. CREATE — Thêm mới đầu sách vào MongoDB (POST /api/products)
export const createProduct = async (
  payload: Omit<IProduct, "id"> & { id?: string }
): Promise<{ product: IProduct; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Lỗi HTTP: ${res.status}`);
    }
    const created: IProduct = await res.json();
    return { product: created, source: "api" };
  } catch (error) {
    console.error("Lỗi thêm mới đầu sách:", error);
    throw error;
  }
};

// 5. UPDATE — Cập nhật đầu sách trong MongoDB (PUT /api/products/:id)
export const updateProduct = async (
  id: string | number,
  payload: Partial<IProduct>
): Promise<{ product: IProduct; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/products/${encodeURIComponent(String(id))}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Lỗi HTTP: ${res.status}`);
    }
    const updated: IProduct = await res.json();
    return { product: updated, source: "api" };
  } catch (error) {
    console.error("Lỗi cập nhật đầu sách:", error);
    throw error;
  }
};

// 6. DELETE — Xóa đầu sách khỏi MongoDB (DELETE /api/products/:id)
export const deleteProduct = async (
  id: string | number
): Promise<{ success: boolean; source: "api" | "local" }> => {
  try {
    const res = await fetch(`${getApiUrl()}/products/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return { success: true, source: "api" };
  } catch (error) {
    console.error("Lỗi xóa đầu sách:", error);
    throw error;
  }
};

// 7. Lấy danh sách bộ Boxset (Plans) từ MongoDB
export const getAllPlans = async (): Promise<IPlan[]> => {
  try {
    const res = await fetch(`${getApiUrl()}/plans`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return (await res.json()) as IPlan[];
  } catch (error) {
    if (isNextDynamicSignal(error)) throw error;
    console.error("Không thể tải danh sách Boxset:", error);
    return [];
  }
};

// 8. Lấy khung cấp độ HSK từ MongoDB
export const getAllHskCourses = async (): Promise<IHSKCourse[]> => {
  try {
    const res = await fetch(`${getApiUrl()}/hskCourses`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Lỗi HTTP: ${res.status}`);
    }
    return (await res.json()) as IHSKCourse[];
  } catch (error) {
    if (isNextDynamicSignal(error)) throw error;
    console.error("Không thể tải danh sách HSK:", error);
    return [];
  }
};
