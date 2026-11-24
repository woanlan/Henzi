import React, { Suspense } from "react";
import Link from "next/link";
import { getAllPlans, getAllProducts } from "@/services/product.service";
import WolfProductCard from "@/components/WolfProductCard";
import ProductCard from "@/components/ProductCard";
import { VanKhoHeaderFooterShell } from "@/components/vankho/VanKhoHeaderFooterShell";
import { BookOpen, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Toàn Bộ 30 Đầu Sách & Combo Boxset | HANZI",
  description:
    "Danh mục đầy đủ 30 đầu sách Hán ngữ, luyện đề HSK/HSKK, từ điển 214 bộ thủ, thơ Đường song ngữ và 6 bộ Boxset tại Hiệu sách HANZI.",
};

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

// ============================================================================
// [YÊU CẦU CÔ - Trang Danh Sách Sách + Tìm Kiếm URL (?q=) + Truyền Props]
// Gọi API `GET /api/products` & `GET /api/plans` từ MongoDB, lọc theo từ khóa
// tìm kiếm và truyền dữ liệu xuống các thẻ sách 3D.
// ============================================================================
async function ProductsContent({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const [plans, allProducts] = await Promise.all([
    getAllPlans(),
    getAllProducts(),
  ]);

  const filteredProducts = q
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.desc.toLowerCase().includes(q.toLowerCase()) ||
          (p.author && p.author.toLowerCase().includes(q.toLowerCase())) ||
          (p.categoryName &&
            p.categoryName.toLowerCase().includes(q.toLowerCase()))
      )
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
            Toàn Bộ Đầu Sách &amp; Boxset
          </span>
          {q && (
            <>
              <ChevronRight className="size-3.5 opacity-60" />
              <span className="font-semibold text-(--vk-brass)">
                Từ khóa: &ldquo;{q}&rdquo;
              </span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="border-b border-(--vk-border) pb-8 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-(--vk-border-strong) bg-(--vk-primary-light) px-3.5 py-1 vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-brass)">
            <BookOpen className="size-3.5" />
            <span>Tàng Thư Học Liệu Hán Ngữ · Ấn Bản In Cao Cấp</span>
          </div>
          <h1 className="vankho-serif text-3xl font-medium tracking-tight text-(--vk-fg) sm:text-4xl lg:text-5xl">
            Danh Mục Sách Tiếng Trung &amp; Hộp Quà Boxset
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--vk-muted) sm:text-base">
            Mỗi đầu sách đều có 2 lựa chọn đóng gáy: <b>Bìa mềm tiêu chuẩn</b> gọn nhẹ mang theo mỗi ngày và <b>Bìa cứng vải bố khâu chỉ dập nhũ vàng</b> mở phẳng 180° để lưu giữ lâu dài.
          </p>
        </div>

        {/* 1. ALL BOOKS GRID */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-(--vk-border) pb-4">
            <div>
              <p className="vankho-mono text-xs uppercase tracking-wider text-(--vk-brass)">
                Ấn Phẩm Lẻ Theo Từng Quyển
              </p>
              <h2 className="mt-0.5 vankho-serif text-2xl font-medium text-(--vk-fg) sm:text-3xl">
                1. Kệ Sách &amp; Tài Liệu Chuyên Sâu
              </h2>
            </div>
            <span className="rounded-full border border-(--vk-border) bg-(--vk-surface) px-3.5 py-1 vankho-mono text-xs font-semibold text-(--vk-muted) tabular-nums">
              {filteredProducts.length} đầu sách
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-(--vk-border) bg-(--vk-surface) p-12 text-center space-y-3">
              <p className="text-sm text-(--vk-muted)">
                Không tìm thấy đầu sách nào khớp với từ khóa &ldquo;{q}&rdquo;.
              </p>
              <Link
                href="/products"
                className="inline-flex min-h-[42px] items-center rounded-xl bg-(--vk-primary) px-5 text-xs font-semibold text-(--vk-primary-fg)"
              >
                Xem lại toàn bộ {allProducts.length} đầu sách
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((prod) => (
                <WolfProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>

        {/* 2. COMBO BOXSETS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-(--vk-border) pb-4">
            <div>
              <p className="vankho-mono text-xs uppercase tracking-wider text-(--vk-brass)">
                Mua Trọn Bộ Tiết Kiệm Tới 18%
              </p>
              <h2 className="mt-0.5 vankho-serif text-2xl font-medium text-(--vk-fg) sm:text-3xl">
                2. Bộ Sách Combo &amp; Boxset Đóng Hộp Sưu Tập
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <ProductCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      </div>
    </VanKhoHeaderFooterShell>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0] text-sm text-stone-500">
          Đang mở kho sách HANZI...
        </div>
      }
    >
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}
