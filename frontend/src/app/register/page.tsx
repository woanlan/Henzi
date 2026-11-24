import React from "react";
import RegisterForm from "@/components/RegisterForm";
import { VanKhoHeaderFooterShell } from "@/components/vankho/VanKhoHeaderFooterShell";
import { getAllProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mở Thẻ Độc Giả Mới | HANZI",
  description:
    "Đăng ký tài khoản độc giả tại Hiệu sách HANZI để lưu tủ sách yêu thích, ví voucher và theo dõi đơn giao sách.",
};

// [YÊU CẦU CÔ - Trang Đăng Ký Tài Khoản Độc Giả Mới (/register)]
export default async function RegisterPage() {
  const allProducts = await getAllProducts();

  return (
    <VanKhoHeaderFooterShell initialProducts={allProducts}>
      <div className="flex items-center justify-center px-4 py-16">
        <RegisterForm />
      </div>
    </VanKhoHeaderFooterShell>
  );
}
