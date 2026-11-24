"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { IProduct } from "@/interfaces/product";
import WolfProductCard from "./WolfProductCard";
import { ArrowRight, Flame } from "lucide-react";

// ============================================================================
// [YÊU CẦU CÔ - Lab 2 (Component) + Lab 3 (Props) + useState + useMemo]
// - Nhận danh sách `products` qua Props từ Server Component Trang chủ (`/`).
// - Dùng `useState` lưu tab đang chọn & `useMemo` ghi nhớ danh sách lọc khóa học.
// - Truyền từng `product` xuống Component con `<WolfProductCard />` qua Props.
// ============================================================================
interface WolfFeaturedCoursesProps {
  products: IProduct[];
}

export default function WolfFeaturedCourses({ products }: WolfFeaturedCoursesProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabs = [
    { id: "all", label: "Tất Cả Khóa Học" },
    { id: "starter", label: "HSK 1 - 2 (Sơ Cấp)" },
    { id: "intermediate", label: "HSK 3 - 4 (Trung Cấp)" },
    { id: "business", label: "Thương Mại & Taobao" },
    { id: "pinyin", label: "Nhập Môn & Pinyin" },
  ];

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (activeTab === "all") return true;
        if (activeTab === "starter") return p.id === "hsk-1" || p.id === "hsk-2";
        if (activeTab === "intermediate") return p.id === "hsk-3" || p.id === "hsk-4";
        if (activeTab === "business")
          return (
            p.categoryId === "business" ||
            p.id === "business-taobao" ||
            p.categoryId === "communication"
          );
        if (activeTab === "pinyin")
          return p.categoryId === "starter" || p.id === "pinyin-master";
        return true;
      }),
    [products, activeTab]
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header with Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/90 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Chương Trình Đào Tạo Tiêu Biểu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Khóa Học Nổi Bật Được Yêu Thích Nhất
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Hơn 50.000 học viên đã tin tưởng và bứt phá điểm số cùng lộ trình chuẩn hóa của Hanzi Master
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Xem tất cả ({products.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Wolf Terra Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-600/30"
                  : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-400"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <WolfProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
