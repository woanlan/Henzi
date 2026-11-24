"use client";

import React, { useEffect, useState } from "react";
import { ICategory } from "@/interfaces/category";
import { IPlan, IProduct } from "@/interfaces/product";
import { useProductsSWR } from "@/hooks/useSwrApi";
import {
  CourseSortMode,
  VanKhoCatalogSection,
} from "./VanKhoCatalogSection";
import {
  DetailTabMode,
  VanKhoCoverFlowHero,
} from "./VanKhoCoverFlowHero";
import {
  VanKhoHeaderFooterShell,
  WISHLIST_STORAGE_KEY,
} from "./VanKhoHeaderFooterShell";
import { VanKhoLookbook } from "./VanKhoLookbook";

export interface VanKhoExperienceProps {
  products: IProduct[];
  categories: ICategory[];
  plans: IPlan[];
  isPreviewMode?: boolean;
}

export function VanKhoExperience({
  products: initialProducts,
  categories,
  plans,
}: VanKhoExperienceProps) {
  // [YÊU CẦU CÔ - useSWR]: Đồng bộ danh sách 30 đầu sách & số lượng tồn kho trực tiếp từ MongoDB
  const { products } = useProductsSWR(initialProducts);

  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [sortBy, setSortBy] = useState<CourseSortMode>("featured");
  const [wishlistIds, setWishlistIds] = useState<Array<string | number>>([]);

  const [selectedBookId, setSelectedBookId] = useState<
    string | number | null
  >(null);
  const [drawerInitialTab, setDrawerInitialTab] =
    useState<DetailTabMode>("trial");

  useEffect(() => {
    try {
      const rawWish = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (rawWish) {
        const parsed = JSON.parse(rawWish);
        if (Array.isArray(parsed)) setWishlistIds(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleToggleWishlist = (bookId: string | number) => {
    setWishlistIds((prev) => {
      const exists = prev.some((id) => String(id) === String(bookId));
      const next = exists
        ? prev.filter((id) => String(id) !== String(bookId))
        : [...prev, bookId];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleOpenBookDrawer = (
    productId: string | number,
    tab: DetailTabMode = "overview"
  ) => {
    setSelectedBookId(productId);
    setDrawerInitialTab(tab);
  };

  const handleFilterByCategoryAndScroll = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const el = document.getElementById("catalog");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleQuickSearchJump = () => {
    const el = document.getElementById("catalog");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      const input = document.getElementById("vankho-search-input");
      if (input instanceof HTMLInputElement) {
        input.focus({ preventScroll: true });
      }
    }, 350);
  };

  return (
    <VanKhoHeaderFooterShell
      initialProducts={products}
      isHomeAnchors={true}
      externalWishlistIds={wishlistIds}
      onExternalToggleWishlist={handleToggleWishlist}
      externalSelectedBookId={selectedBookId}
      externalDrawerTab={drawerInitialTab}
      onExternalCloseBookDrawer={() => setSelectedBookId(null)}
      onExternalOpenBookDrawer={handleOpenBookDrawer}
      onQuickSearchClick={handleQuickSearchJump}
    >
      {/* 1. KỆ SÁCH 3D COVERFLOW + LẬT BÌA 3D + THANH KÉO ẤN PHẨM */}
      <VanKhoCoverFlowHero
        products={products}
        activeCourseIndex={activeCourseIndex}
        onActiveIndexChange={setActiveCourseIndex}
        onOpenCourseDrawer={handleOpenBookDrawer}
      />

      {/* 2. TỦ SÁCH CHUYÊN ĐỀ (EDITORIAL LOOKBOOK + SHOPPABLE RAIL) */}
      <VanKhoLookbook
        categories={categories}
        products={products}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onOpenCourseDrawer={handleOpenBookDrawer}
        onFilterByCategory={handleFilterByCategoryAndScroll}
      />

      {/* 3. KHO SÁCH ĐẦY ĐỦ + COMBO BOXSET SƯU TẬP */}
      <VanKhoCatalogSection
        products={products}
        categories={categories}
        plans={plans}
        searchQuery={searchQuery}
        selectedCategoryId={selectedCategoryId}
        sortBy={sortBy}
        wishlistIds={wishlistIds}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategoryId}
        onSortChange={setSortBy}
        onResetFilters={() => {
          setSearchQuery("");
          setSelectedCategoryId("all");
          setSortBy("featured");
        }}
        onToggleWishlist={handleToggleWishlist}
        onOpenCourseDrawer={handleOpenBookDrawer}
      />
    </VanKhoHeaderFooterShell>
  );
}
