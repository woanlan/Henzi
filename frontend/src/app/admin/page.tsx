import React from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Quản Trị Hiệu Sách | HANZI",
  description:
    "Không gian quản trị dành riêng cho Admin hiệu sách HANZI: tổng quan doanh thu, đơn đặt sách, kho ấn phẩm, tủ chuyên đề và độc giả.",
};

// ============================================================================
// [YÊU CẦU CÔ - Route Quản Trị Độc Lập (/admin) Chỉ Dành Cho Tài Khoản Admin]
// Tách biệt hoàn toàn khỏi giao diện độc giả và được bảo vệ phân quyền RBAC
// bên trong `<AdminDashboard />`.
// ============================================================================
export default function AdminPage() {
  return <AdminDashboard />;
}
