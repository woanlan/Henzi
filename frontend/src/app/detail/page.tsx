import React, { Suspense } from "react";
import Link from "next/link";
import { getAllProducts } from "@/services/product.service";
import ProductDetailCard from "@/components/ProductDetailCard";
import { VanKhoHeaderFooterShell } from "@/components/vankho/VanKhoHeaderFooterShell";
import { ArrowRight, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Chi Tiết Ấn Phẩm | HANZI — Nhà Sách & Học Liệu Tiếng Trung",
  description:
    "Thông tin chi tiết ấn phẩm, chọn bản Bìa mềm / Bìa cứng vải bố, đọc thử 3D và đặt mua sách trực tiếp tại Hiệu sách HANZI.",
};

async function DetailIndexContent() {
  const products = await getAllProducts();
  const product = products[0];

  if (!product) {
    return (
      <VanKhoHeaderFooterShell initialProducts={products}>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
          <h1 className="vankho-serif text-3xl font-medium text-(--vk-fg)">
            Chưa tải được dữ liệu ấn phẩm
          </h1>
          <p className="text-sm text-(--vk-muted)">
            Vui lòng kiểm tra máy chủ Backend MongoDB ở cổng 3001 và tải lại trang.
          </p>
          <Link
            href="/products"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-(--vk-primary) px-6 text-xs font-semibold text-(--vk-primary-fg)"
          >
            <span>Quay lại kho sách HANZI</span>
          </Link>
        </div>
      </VanKhoHeaderFooterShell>
    );
  }

  return (
    <VanKhoHeaderFooterShell initialProducts={products}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
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

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-(--vk-brass) hover:underline"
          >
            <span>Xem toàn bộ {products.length} đầu sách</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <ProductDetailCard product={product} />
      </div>
    </VanKhoHeaderFooterShell>
  );
}

export default function DetailIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0] text-sm text-stone-500">
          Đang mở hồ sơ ấn phẩm...
        </div>
      }
    >
      <DetailIndexContent />
    </Suspense>
  );
}
