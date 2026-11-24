import React from "react";
import LoginForm from "@/components/LoginForm";
import { VanKhoHeaderFooterShell } from "@/components/vankho/VanKhoHeaderFooterShell";
import { getAllProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Đăng Nhập Độc Giả & Quản Trị | HANZI",
  description:
    "Đăng nhập thẻ độc giả hoặc tài khoản quản trị hiệu sách HANZI.",
};

// [YÊU CẦU CÔ - Trang Đăng Nhập Độc Giả & Quản Trị Viên (/login)]
export default async function LoginPage() {
  const allProducts = await getAllProducts();

  return (
    <VanKhoHeaderFooterShell initialProducts={allProducts}>
      <div className="flex items-center justify-center px-4 py-16">
        <LoginForm />
      </div>
    </VanKhoHeaderFooterShell>
  );
}
