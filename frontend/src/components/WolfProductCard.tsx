"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { BookEditionCover3D } from "@/components/vankho/BookEditionCover3D";
import { useBookReaderModal } from "@/components/vankho/VanKhoHeaderFooterShell";
import {
  formatVnd,
  getCourseArchivalMeta,
  resolveBookEditions,
} from "@/components/vankho/vankho-data";
import {
  BookMarked,
  Check,
  ExternalLink,
  ShoppingBag,
  Star,
} from "lucide-react";

// ============================================================================
// [YÊU CẦU CÔ - Lab 2 (Tạo Component thẻ Đầu sách) + Lab 3 (Nhận Props)]
// Component con hiển thị bìa sách 3D, chuyển đổi ấn bản Bìa mềm / Bìa cứng
// và thêm vào Redux Giỏ hàng, nhận dữ liệu từ Cha qua prop `product`.
// ============================================================================
interface WolfProductCardProps {
  product: IProduct;
}

export default function WolfProductCard({ product }: WolfProductCardProps) {
  const dispatch = useAppDispatch();
  const bookReader = useBookReaderModal();
  const meta = getCourseArchivalMeta(product, 0);
  const editions = resolveBookEditions(product);
  const [selectedEdition, setSelectedEdition] = useState<BookEditionFormat>(
    editions.paperback.stock > 0 ? "paperback" : "hardcover"
  );
  const [justAdded, setJustAdded] = useState(false);

  const activeEd = editions[selectedEdition];
  const isOutOfStock = activeEd.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(
      addToCart({
        bookId: String(product.id),
        edition: selectedEdition,
        quantity: 1,
        maxStock: activeEd.stock,
        openDrawer: true,
      })
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-(--vk-border) bg-(--vk-surface) transition-colors hover:border-(--vk-border-strong)">
      {/* 3D Standing Book Showcase */}
      <div className="vankho-paper-grain relative flex w-full items-center justify-center overflow-hidden border-b border-(--vk-border) bg-(--vk-surface-subtle) px-6 pt-8 pb-9">
        <Link
          href={`/detail/${product.id}`}
          onClick={(e) => {
            if (bookReader) {
              e.preventDefault();
              bookReader.openBookReader(product.id);
            }
          }}
          aria-label={`Mở đọc thử sách ${product.name}`}
          className="relative z-10 block cursor-pointer"
        >
          <BookEditionCover3D
            product={product}
            meta={meta}
            edition={selectedEdition}
            size="md"
            showCaptionBadge={true}
          />
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full border border-(--vk-border-strong) bg-(--vk-surface)/95 px-2.5 py-1 vankho-mono text-[10px] font-semibold uppercase tracking-wider text-(--vk-brass)">
            {product.badge}
          </span>
        )}
      </div>

      {/* Book Info Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-(--vk-muted)">
          <span className="truncate font-medium text-(--vk-brass)">
            {product.author || product.categoryName || "NXB ĐH Ngôn Ngữ Bắc Kinh"}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 vankho-mono tabular-nums">
            <Star className="size-3.5 fill-amber-500 text-amber-500" />
            <span className="font-semibold text-(--vk-fg)">
              {(product.rating || 4.9).toFixed(1)}
            </span>
          </span>
        </div>

        <h3 className="mt-1.5 min-h-[3.25rem] vankho-serif text-lg font-medium leading-snug text-(--vk-fg) line-clamp-2">
          <Link
            href={`/detail/${product.id}`}
            onClick={(e) => {
              if (bookReader) {
                e.preventDefault();
                bookReader.openBookReader(product.id);
              }
            }}
            className="transition-colors hover:text-(--vk-brass)"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-(--vk-muted) line-clamp-2">
          {product.desc}
        </p>

        {/* Edition Switcher */}
        <div className="mt-3.5 grid grid-cols-2 gap-1.5 rounded-xl border border-(--vk-border) bg-(--vk-surface-subtle)/75 p-1">
          {(["paperback", "hardcover"] as const).map((fmt) => {
            const active = selectedEdition === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedEdition(fmt)}
                className={`min-h-[34px] cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-(--vk-surface) text-(--vk-fg) border border-(--vk-border-strong)"
                    : "text-(--vk-muted) hover:text-(--vk-fg)"
                }`}
              >
                {fmt === "paperback" ? "Bìa mềm" : "Bìa cứng vải bố"}
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center justify-between text-xs text-(--vk-muted)">
          <span className="inline-flex items-center gap-1.5">
            <BookMarked className="size-3.5 text-(--vk-brass)" />
            <span>{product.pages ? `${product.pages} trang` : product.duration}</span>
          </span>
          <span className="vankho-mono tabular-nums">
            {isOutOfStock ? "Tạm hết" : `Còn ${activeEd.stock} cuốn`}
          </span>
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between gap-2 border-t border-(--vk-border) mt-3.5">
          <div>
            <span className="block text-[11px] text-(--vk-muted)">
              {selectedEdition === "paperback"
                ? "Ấn bản bìa mềm"
                : "Bìa cứng dập nhũ"}
            </span>
            <span className="vankho-mono text-lg font-bold text-(--vk-brass) tabular-nums">
              {formatVnd(activeEd.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/detail/${product.id}`}
              aria-label={`Mở trang chi tiết ${product.name}`}
              className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) hover:bg-(--vk-btn-hover)"
            >
              <ExternalLink className="size-4" />
            </Link>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-xl bg-(--vk-primary) px-3.5 text-xs font-semibold text-(--vk-primary-fg) hover:bg-(--vk-primary-hover) disabled:opacity-45"
            >
              {justAdded ? (
                <>
                  <Check className="size-4" />
                  <span>Đã thêm</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" />
                  <span>Thêm vào giỏ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
