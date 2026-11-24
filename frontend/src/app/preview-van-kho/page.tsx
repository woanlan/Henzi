import React from "react";
import { VanKhoExperience } from "@/components/vankho/VanKhoExperience";
import { getAllCategories } from "@/services/category.service";
import { getAllPlans, getAllProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "HANZI — Nhà Sách & Học Liệu Tiếng Trung",
  description:
    "Hiệu sách trực tuyến chuyên biệt về Giáo trình HSK 1–6, Từ điển 214 Bộ thủ Khang Hy, Vở luyện thư pháp chữ Hán và ấn bản bìa cứng sưu tầm.",
};

export default async function PreviewVanKhoPage() {
  const [products, categories, plans] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllPlans(),
  ]);

  return (
    <VanKhoExperience
      products={products}
      categories={categories}
      plans={plans}
      isPreviewMode={false}
    />
  );
}
