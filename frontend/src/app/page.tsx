import React from "react";
import { VanKhoExperience } from "@/components/vankho/VanKhoExperience";
import { getAllPlans, getAllProducts } from "@/services/product.service";
import { getAllCategories } from "@/services/category.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "HANZI — Nhà Sách & Học Liệu Tiếng Trung",
  description:
    "Hiệu sách trực tuyến chuyên biệt về Giáo trình HSK 1–6, Từ điển 214 Bộ thủ Khang Hy, Vở luyện thư pháp chữ Hán, Sổ tay giao tiếp và Cố vấn Sách AI.",
};

// ============================================================================
// [YÊU CẦU CÔ - ASM 1 (Giao diện Trang chủ + Gọi REST API Node.js + Truyền Props)]
// Server Component gọi đồng thời API lấy 6 Danh mục sách, 30 Đầu sách và 6 Bộ Boxset
// từ Backend MongoDB (:3001/api), sau đó truyền xuống <VanKhoExperience /> qua Props.
// ============================================================================
export default async function HomePage() {
  const [allProducts, categories, plans] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllPlans(),
  ]);

  return (
    <VanKhoExperience
      products={allProducts}
      categories={categories}
      plans={plans}
      isPreviewMode={false}
    />
  );
}
