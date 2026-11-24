import React from "react";
import AboutSection from "@/components/AboutSection";
import { VanKhoHeaderFooterShell } from "@/components/vankho/VanKhoHeaderFooterShell";
import { getAllProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Về Hiệu Sách HANZI | Nhà Sách & Học Liệu Tiếng Trung",
  description:
    "Tìm hiểu quy chuẩn tuyển chọn ấn phẩm, giấy kem chống mỏi mắt, kỹ thuật đóng gáy khâu chỉ mở phẳng 180° và dịch vụ Cố vấn Sách AI tại HANZI.",
};

export default async function AboutPage() {
  const allProducts = await getAllProducts();

  return (
    <VanKhoHeaderFooterShell initialProducts={allProducts}>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <AboutSection
          title="HANZI — Nơi Lưu Giữ Những Ấn Phẩm Hán Ngữ Tinh Tuyển"
          subtitle="Khởi nguồn từ niềm trân quý sách in truyền thống, chúng tôi tuyển chọn giáo trình HSK chuẩn Bắc Kinh, từ điển chiết tự bộ thủ và vở luyện thư pháp cho người đọc Việt Nam."
        />
      </div>
    </VanKhoHeaderFooterShell>
  );
}
