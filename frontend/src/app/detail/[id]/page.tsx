import React, { Suspense } from "react";
import Link from "next/link";
import { getAllProducts, getProductById } from "@/services/product.service";
import ProductDetailCard from "@/components/ProductDetailCard";
import { VanKhoHeaderFooterShell } from "@/components/vankho/VanKhoHeaderFooterShell";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

// ============================================================================
// [YÊU CẦU CÔ - Dynamic Route Chi Tiết Đầu Sách (/detail/[id]) + Truyền Props]
// Nhận tham số động `id` trên URL, gọi `GET /api/products/:id` từ MongoDB và
// truyền dữ liệu `product` qua Props xuống `<ProductDetailCard />`.
// ============================================================================
async function DetailContent({ params }: DetailPageProps) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([
    getProductById(id),
    getAllProducts(),
  ]);

  if (!product) {
    return (
      <VanKhoHeaderFooterShell initialProducts={allProducts}>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
          <h1 className="vankho-serif text-3xl font-medium text-(--vk-fg)">
            Không Tìm Thấy Ấn Phẩm
          </h1>
          <p className="text-sm text-(--vk-muted)">
            Đầu sách bạn đang tìm kiếm không tồn tại hoặc đã cập nhật mã lưu trữ mới.
          </p>
          <Link
            href="/products"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-(--vk-primary) px-6 text-xs font-semibold text-(--vk-primary-fg)"
          >
            <ArrowLeft className="size-4" />
            <span>Quay Lại Kệ Sách HANZI</span>
          </Link>
        </div>
      </VanKhoHeaderFooterShell>
    );
  }

  return (
    <VanKhoHeaderFooterShell initialProducts={allProducts}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-(--vk-muted)">
          <Link href="/" className="hover:text-(--vk-brass) transition-colors">
            Kệ Sách 3D
          </Link>
          <ChevronRight className="size-3.5 opacity-60" />
          <Link
            href="/products"
            className="hover:text-(--vk-brass) transition-colors"
          >
            Kho Sách
          </Link>
          <ChevronRight className="size-3.5 opacity-60" />
          <span className="truncate max-w-xs font-semibold text-(--vk-fg)">
            {product.name}
          </span>
        </div>

        <ProductDetailCard product={product} />
      </div>
    </VanKhoHeaderFooterShell>
  );
}

export default function ProductDetailPage({ params }: DetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0] text-sm text-stone-500">
          Đang mở hồ sơ ấn phẩm...
        </div>
      }
    >
      <DetailContent params={params} />
    </Suspense>
  );
}
