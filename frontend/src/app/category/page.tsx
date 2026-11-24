import React, { Suspense } from "react";
import Link from "next/link";
import { getAllCategories, getCategoryById } from "@/services/category.service";
import { getAllProducts, getProductsByCategory } from "@/services/product.service";
import CategoryCard from "@/components/CategoryCard";
import WolfProductCard from "@/components/WolfProductCard";
import { VanKhoHeaderFooterShell } from "@/components/vankho/VanKhoHeaderFooterShell";
import { ChevronRight, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Phân Loại 6 Tủ Sách Chuyên Đề | HANZI",
  description:
    "Khám phá 6 tủ sách tiếng Trung chuyên biệt: Giáo trình HSK 1–6, Luyện đề & Ngữ pháp, Từ điển Bộ thủ & Thư pháp, Khẩu ngữ Đời sống, Hoa ngữ Kinh doanh XNK và Văn học Song ngữ.",
};

interface CategoryPageProps {
  searchParams: Promise<{ id?: string }>;
}

// ============================================================================
// [YÊU CẦU CÔ - Trang Lọc Đầu Sách Theo Danh Mục (?id=) + Gọi API Backend]
// Gọi `GET /api/categories`, `GET /api/categories/:id` và `GET /api/products?categoryId=...`
// từ Backend Node.js + MongoDB để hiển thị đầu sách theo từng tủ chuyên đề.
// ============================================================================
async function CategoryContent({ searchParams }: CategoryPageProps) {
  const { id } = await searchParams;

  const [categories, allProducts] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);
  const selectedCategory = id ? await getCategoryById(id) : undefined;
  const filteredProducts = id
    ? await getProductsByCategory(id)
    : allProducts;

  return (
    <VanKhoHeaderFooterShell initialProducts={allProducts}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-(--vk-muted)">
          <Link href="/" className="hover:text-(--vk-brass) transition-colors">
            Kệ Sách 3D
          </Link>
          <ChevronRight className="size-3.5 opacity-60" />
          <span className="font-semibold text-(--vk-fg)">
            Tủ Sách Theo Chuyên Đề
          </span>
          {selectedCategory && (
            <>
              <ChevronRight className="size-3.5 opacity-60" />
              <span className="font-semibold text-(--vk-brass)">
                {selectedCategory.name}
              </span>
            </>
          )}
        </div>

        {/* Page Heading */}
        <div className="border-b border-(--vk-border) pb-8 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-(--vk-border-strong) bg-(--vk-primary-light) px-3.5 py-1 vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-brass)">
            <Layers className="size-3.5" />
            <span>Phân Loại Thư Mục Tàng Thư</span>
          </div>
          <h1 className="vankho-serif text-3xl font-medium tracking-tight text-(--vk-fg) sm:text-4xl lg:text-5xl">
            Các Tủ Sách Chuyên Đề Tại HANZI
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--vk-muted) sm:text-base">
            Chọn tủ sách phù hợp với nhu cầu đọc và tra cứu của bạn: luyện thi HSK học thuật, bỏ túi du lịch tự túc, đàm phán nguồn hàng Quảng Châu hay rèn thư pháp chữ Hán.
          </p>
        </div>

        {/* Category Cards */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="vankho-serif text-2xl font-medium text-(--vk-fg)">
              1. Chọn Tủ Sách Chuyên Đề
            </h2>
            {selectedCategory && (
              <Link
                href="/category"
                className="rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-3.5 py-1.5 text-xs font-semibold text-(--vk-brass) hover:bg-(--vk-btn-hover)"
              >
                ✕ Bỏ lọc · Xem toàn bộ {allProducts.length} đầu sách
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isActive={String(cat.id) === id}
              />
            ))}
          </div>
        </section>

        {/* Filtered Books */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-(--vk-border) pb-4">
            <h2 className="vankho-serif text-2xl font-medium text-(--vk-fg)">
              2. Ấn Phẩm Thuộc:{" "}
              <span className="text-(--vk-brass)">
                {selectedCategory ? selectedCategory.name : "Tất Cả Tủ Sách"}
              </span>
            </h2>
            <span className="rounded-full border border-(--vk-border) bg-(--vk-surface) px-3.5 py-1 vankho-mono text-xs font-semibold text-(--vk-muted) tabular-nums">
              {filteredProducts.length} đầu sách
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((prod) => (
              <WolfProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </div>
    </VanKhoHeaderFooterShell>
  );
}

export default function CategoryPage({ searchParams }: CategoryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0] text-sm text-stone-500">
          Đang mở danh mục tủ sách...
        </div>
      }
    >
      <CategoryContent searchParams={searchParams} />
    </Suspense>
  );
}
