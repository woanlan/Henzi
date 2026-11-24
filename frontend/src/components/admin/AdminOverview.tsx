"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { IProduct } from "@/interfaces/product";
import { ICategory } from "@/interfaces/category";
import { IOrder } from "@/interfaces/order";
import { IUser } from "@/interfaces/user";
import { Check } from "lucide-react";

export type AdminSectionId =
  | "overview"
  | "orders"
  | "products"
  | "categories"
  | "users"
  | "vouchers";

// ============================================================================
// [YÊU CẦU CÔ - Lab 3 (Props) + Hooks (useState, useEffect, useMemo)]
// - Nhận dữ liệu `products`, `categories`, `orders`, `users` & hàm `onQuickApproveOrder`
//   từ Component cha `AdminDashboard` qua Props.
// - Sử dụng `useMemo` để tối ưu tính doanh thu, tỷ trọng danh mục & biểu đồ 6 tháng.
// ============================================================================
interface AdminOverviewProps {
  products: IProduct[];
  categories: ICategory[];
  orders: IOrder[];
  users: IUser[];
  loading: boolean;
  onNavigate: (section: AdminSectionId) => void;
  onQuickApproveOrder: (orderId: string) => void;
}

const parseVndAmount = (raw: string): number => {
  const digits = raw.replace(/[^0-9]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
};

export default function AdminOverview({
  products,
  categories,
  orders,
  users,
  loading,
  onNavigate,
  onQuickApproveOrder,
}: AdminOverviewProps) {
  const [chartMetric, setChartMetric] = useState<"revenue" | "students">("revenue");
  const [chartMounted, setChartMounted] = useState(false);

  useEffect(() => {
    setChartMounted(true);
  }, []);

  const { approvedOrders, pendingOrders, approvedOrderSum, totalRevenueVnd } =
    useMemo(() => {
      const approved = orders.filter((o) => o.status === "approved");
      const pending = orders.filter((o) => o.status === "pending");
      const sum = approved.reduce((acc, o) => acc + parseVndAmount(o.amount), 0);
      // Doanh thu lũy kế 6 tháng + các đơn vừa duyệt trực tiếp
      return {
        approvedOrders: approved,
        pendingOrders: pending,
        approvedOrderSum: sum,
        totalRevenueVnd: 184_000_000 + sum,
      };
    }, [orders]);

  const monthlyStats = useMemo(() => {
    const currentMonthMillion = Math.round((42_000_000 + approvedOrderSum) / 1_000_000);
    return [
      { month: "T6", revenue: 24, students: 185 },
      { month: "T7", revenue: 29, students: 210 },
      { month: "T8", revenue: 33, students: 248 },
      { month: "T9", revenue: 31, students: 232 },
      { month: "T10", revenue: 38, students: 290 },
      {
        month: "T11",
        revenue: currentMonthMillion,
        students: 315 + approvedOrders.length,
      },
    ].map((d) => ({
      ...d,
      value: chartMetric === "revenue" ? d.revenue : d.students,
      display: chartMetric === "revenue" ? `${d.revenue} tr` : `${d.students}`,
    }));
  }, [approvedOrderSum, approvedOrders.length, chartMetric]);

  const adminCount = useMemo(
    () => users.filter((u) => u.role === "admin").length,
    [users]
  );

  const categoryDistribution = useMemo(
    () =>
      categories.map((cat) => {
        const actualCount = products.filter(
          (p) => String(p.categoryId) === String(cat.id)
        ).length;
        const pct =
          products.length > 0
            ? Math.round((actualCount / products.length) * 100)
            : 0;
        return {
          id: cat.id,
          name: cat.name,
          actualCount,
          pct,
        };
      }),
    [categories, products]
  );

  return (
    <div className="space-y-6">
      {/* 1. KHỐI 4 CHỈ SỐ TỔNG HỢP (1 khung chia kẻ, số đồng nhất 1 màu chữ chính) */}
      <div className="bg-white rounded-2xl border border-stone-200 grid grid-cols-2 xl:grid-cols-4 divide-y xl:divide-y-0 divide-x divide-stone-200 overflow-hidden">
        <div className="p-4 sm:p-5 space-y-1">
          <div className="text-xs font-medium text-stone-500">Tổng doanh thu bán sách</div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 font-tabular">
            {totalRevenueVnd.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-xs text-stone-400">
            Đã xuất kho {approvedOrders.length} đơn gần nhất
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-1">
          <div className="text-xs font-medium text-stone-500">Đơn đặt sách chờ duyệt</div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 font-tabular">
            {pendingOrders.length}
          </div>
          <div className="text-xs text-stone-400">
            {pendingOrders.length > 0 ? (
              <span className="text-amber-700 font-semibold">
                {pendingOrders.length} đơn đang chờ đóng gói
              </span>
            ) : (
              "Đã đóng gói hết đơn hôm nay"
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-1">
          <div className="text-xs font-medium text-stone-500">Đầu sách đang phát hành</div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 font-tabular">
            {products.length}
          </div>
          <div className="text-xs text-stone-400">
            Thuộc {categories.length} tủ sách chuyên đề
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-1">
          <div className="text-xs font-medium text-stone-500">Tài khoản thành viên</div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 font-tabular">
            {users.length}
          </div>
          <div className="text-xs text-stone-400">
            Gồm {adminCount} quản trị · {Math.max(0, users.length - adminCount)} độc giả
          </div>
        </div>
      </div>

      {/* 2. HÀNG TRÊN: BIỂU ĐỒ CỘT 6 THÁNG (col-span-2) + TỶ TRỌNG DANH MỤC (col-span-1) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">
        {/* Widget chính: Biểu đồ cột (1 màu nhấn, số trên đầu cột, không lưới/trục Y) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Xu hướng phát hành sách 6 tháng gần nhất
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {chartMetric === "revenue"
                  ? "Doanh thu bán sách ghi nhận theo từng tháng (triệu đồng)"
                  : "Số lượng đơn đặt mua sách theo từng tháng"}
              </p>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 w-fit">
              <button
                type="button"
                onClick={() => setChartMetric("revenue")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  chartMetric === "revenue"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Doanh thu
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("students")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  chartMetric === "students"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Đơn sách
              </button>
            </div>
          </div>

          <div className="h-60 w-full">
            {chartMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyStats}
                  margin={{ top: 24, right: 12, left: 12, bottom: 4 }}
                >
                  <YAxis hide domain={[0, "dataMax + 10"]} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: "#E7E5E4" }}
                    tick={{ fill: "#78716C", fontSize: 12 }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#D97706"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey="display"
                      position="top"
                      fill="#57534E"
                      fontSize={12}
                      fontWeight={600}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-xl bg-stone-50" />
            )}
          </div>
        </div>

        {/* Widget phụ: Tỷ trọng đầu sách theo tủ chuyên đề */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Phân bổ kho sách</h2>
              <p className="text-xs text-stone-500 mt-0.5">Tỷ lệ đầu sách trong từng tủ chuyên đề</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("categories")}
              className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer shrink-0"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4 my-auto">
            {categoryDistribution.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-stone-800 truncate">{cat.name}</span>
                  <span className="text-stone-500 font-tabular shrink-0">
                    {cat.actualCount} sách · {cat.pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${Math.max(10, cat.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Tổng số ấn phẩm</span>
            <strong className="text-stone-900 font-tabular">{products.length} đầu sách</strong>
          </div>
        </div>
      </div>

      {/* 3. HÀNG DƯỚI: ĐƠN ĐẶT SÁCH GẦN ĐÂY (col-span-2) + HOẠT ĐỘNG KHO (col-span-1) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        {/* Khối đơn đặt sách mới nhất */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-stone-900">Đơn đặt sách gần đây</h2>
            <button
              type="button"
              onClick={() => onNavigate("orders")}
              className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
            >
              Xem tất cả ({orders.length})
            </button>
          </div>

          {loading ? (
            <div className="p-5 space-y-3" role="status" aria-busy="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-11 rounded-xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 px-4 text-center text-sm text-stone-500">
              Chưa có đơn đặt mua sách nào.
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {orders.slice(0, 5).map((ord) => (
                <li
                  key={ord.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-stone-900 truncate">
                        {ord.studentName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0 ${
                          ord.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : ord.status === "cancelled"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {ord.status === "approved"
                          ? "Đang giao sách"
                          : ord.status === "cancelled"
                          ? "Đã hủy"
                          : "Chờ xác nhận"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {ord.courseName} · {ord.createdAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-stone-900 font-tabular">
                      {ord.amount}
                    </span>
                    {ord.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => onQuickApproveOrder(ord.id)}
                        aria-label={`Duyệt giao sách cho ${ord.studentName}`}
                        title="Xác nhận giao sách ngay"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Giao sách</span>
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Luồng hoạt động gần đây */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden self-start">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-stone-900">Hoạt động hiệu sách</h2>
            <button
              type="button"
              onClick={() => onNavigate("users")}
              className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
            >
              Độc giả
            </button>
          </div>

          <ul className="divide-y divide-stone-200">
            {orders.slice(0, 5).map((ord) => {
              const actionVerb =
                ord.status === "approved"
                  ? "đã được xuất kho giao"
                  : ord.status === "cancelled"
                  ? "đã hủy đơn"
                  : "vừa đặt mua";
              return (
                <li key={`act-${ord.id}`} className="px-5 py-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {ord.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-stone-500 line-clamp-2 leading-snug">
                      <span className="font-medium text-stone-900">{ord.studentName}</span>{" "}
                      {actionVerb}{" "}
                      <button
                        type="button"
                        onClick={() => onNavigate("orders")}
                        className="font-medium text-stone-900 hover:text-amber-700 hover:underline text-left cursor-pointer"
                      >
                        {ord.courseName}
                      </button>
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5 truncate">
                      Mã {ord.id} · {ord.createdAt}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
