"use client";

import useSWR from "swr";
import { IVoucher } from "@/interfaces/order";
import { IProduct } from "@/interfaces/product";
import { getAllVouchers } from "@/services/voucher.service";
import { checkJsonServerHealth, getAllProducts } from "@/services/product.service";

// ============================================================================
// [YÊU CẦU CÔ - useSWR & Custom Hooks (Server State Caching + Auto Revalidate)]
// Sử dụng thư viện `swr` thay cho cặp useState + useEffect gọi API GET thủ công:
// - Tự động cache dữ liệu trên bộ nhớ trình duyệt theo key
// - Tự động gọi lại API làm mới (revalidateOnFocus) khi người dùng quay lại tab
// - Hỗ trợ `mutate()` để đồng bộ tức thì giao diện ngay sau khi Admin Thêm/Sửa/Xóa
// ============================================================================

export const SWR_KEYS = {
  VOUCHERS: "/api/vouchers",
  PRODUCTS: "/api/products",
  BACKEND_HEALTH: "/api/health",
} as const;

/** Custom Hook SWR tải danh sách Mã ưu đãi từ MongoDB */
export function useVouchersSWR() {
  const { data, error, isLoading, mutate } = useSWR<IVoucher[]>(
    SWR_KEYS.VOUCHERS,
    () => getAllVouchers(),
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    vouchers: data ?? [],
    isLoading,
    isError: Boolean(error),
    mutateVouchers: mutate,
  };
}

/** Custom Hook SWR kiểm tra kết nối trực tiếp tới Backend Node.js + MongoDB (:3001) */
export function useBackendHealthSWR(enabled = true) {
  const { data, isLoading, mutate } = useSWR<boolean>(
    enabled ? SWR_KEYS.BACKEND_HEALTH : null,
    () => checkJsonServerHealth(),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
    }
  );

  return {
    isOnline: data ?? false,
    isCheckingHealth: isLoading,
    recheckHealth: mutate,
  };
}

/** Custom Hook SWR tải & cache danh sách Đầu sách từ MongoDB */
export function useProductsSWR(fallbackData?: IProduct[]) {
  const { data, error, isLoading, mutate } = useSWR<IProduct[]>(
    SWR_KEYS.PRODUCTS,
    () => getAllProducts(),
    {
      fallbackData,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    products: data ?? fallbackData ?? [],
    isLoading,
    isError: Boolean(error),
    mutateProducts: mutate,
  };
}
