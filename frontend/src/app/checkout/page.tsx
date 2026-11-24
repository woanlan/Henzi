import React from "react";
import { getAllProducts } from "@/services/product.service";
import { VanKhoHeaderFooterShell } from "@/components/vankho/VanKhoHeaderFooterShell";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Thanh Toán Đơn Sách | HANZI — Nhà Sách & Học Liệu Tiếng Trung",
  description:
    "Hoàn tất thông tin nhận sách, chọn phương thức thanh toán, áp dụng mã ưu đãi và xác nhận đơn đặt sách tại Hiệu sách HANZI.",
};

// ============================================================================
// [YÊU CẦU CÔ - Trang Thanh Toán Riêng Biệt (/checkout) + SSR + Props]
// Tách biệt hoàn toàn bước Thanh toán khỏi ngăn kéo Giỏ sách, tải danh mục
// ấn phẩm từ Backend MongoDB rồi truyền xuống `<CheckoutPageClient />`.
// ============================================================================
export default async function CheckoutPage() {
  const allProducts = await getAllProducts();

  return (
    <VanKhoHeaderFooterShell initialProducts={allProducts}>
      <CheckoutPageClient initialProducts={allProducts} />
    </VanKhoHeaderFooterShell>
  );
}
