"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  BookX,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Heart,
  PackagePlus,
  Search,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import { ICategory } from "@/interfaces/category";
import { BookEditionFormat, IPlan, IProduct } from "@/interfaces/product";
import { useAppDispatch } from "@/store";
import { addMultipleToCart, addToCart } from "@/store/slices/cartSlice";
import { BookEditionCover3D } from "./BookEditionCover3D";
import { DetailTabMode } from "./VanKhoCoverFlowHero";
import {
  BOXSET_BOOK_MAP,
  CourseArchivalMeta,
  formatVnd,
  getCourseArchivalMeta,
  normalizeVietnamese,
  resolveBookEditions,
} from "./vankho-data";

export type CourseSortMode =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "students-desc"
  | "rating-desc";

export type EditionFilterMode = "all" | "paperback" | "hardcover";

const SORT_OPTIONS: ReadonlyArray<{ value: CourseSortMode; label: string }> = [
  { value: "featured", label: "Ấn phẩm tiêu biểu" },
  { value: "price-asc", label: "Giá sách thấp → cao" },
  { value: "price-desc", label: "Giá sách cao → thấp" },
  { value: "students-desc", label: "Sách bán chạy nhất" },
  { value: "rating-desc", label: "Độc giả đánh giá cao" },
];

const EDITION_FILTER_OPTIONS: ReadonlyArray<{
  value: EditionFilterMode;
  label: string;
}> = [
  { value: "all", label: "Tất cả ấn bản" },
  { value: "paperback", label: "Bìa mềm còn hàng" },
  { value: "hardcover", label: "Bìa cứng sưu tầm" },
];

interface BookCatalogCardProps {
  book: IProduct;
  meta: CourseArchivalMeta;
  defaultEdition: BookEditionFormat;
  isWishlisted: boolean;
  onToggleWishlist: (id: string | number) => void;
  onOpenBookDrawer: (productId: string | number, tab: DetailTabMode) => void;
}

function BookCatalogCard({
  book,
  meta,
  defaultEdition,
  isWishlisted,
  onToggleWishlist,
  onOpenBookDrawer,
}: BookCatalogCardProps) {
  const dispatch = useAppDispatch();
  const editions = resolveBookEditions(book);
  const [selectedEdition, setSelectedEdition] =
    useState<BookEditionFormat>(defaultEdition);
  const [justAdded, setJustAdded] = useState(false);

  const activeEd = editions[selectedEdition];
  const isOutOfStock = activeEd.stock <= 0;
  const isLowStock = activeEd.stock > 0 && activeEd.stock <= 5;

  const handleAdd = () => {
    if (isOutOfStock) return;
    dispatch(
      addToCart({
        bookId: String(book.id),
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
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-(--vk-border) bg-(--vk-surface) transition-colors hover:border-(--vk-border-strong)">
      {/* Tactile 3D Hardcover Book Pedestal Showcase */}
      <div className="vankho-paper-grain relative flex w-full items-center justify-center overflow-hidden border-b border-(--vk-border) bg-(--vk-surface-subtle) px-6 pt-8 pb-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-12"
          style={{
            background: `radial-gradient(circle at 50% 54%, ${meta.accentHex} 0%, transparent 68%)`,
          }}
        />

        <button
          type="button"
          onClick={() => onOpenBookDrawer(book.id, "trial")}
          aria-label={`Mở đọc thử 10 trang & xem chi tiết ${book.name}`}
          className="relative z-10 block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--vk-primary)"
        >
          <BookEditionCover3D
            product={book}
            meta={meta}
            edition={selectedEdition}
            size="md"
            showCaptionBadge={true}
          />
        </button>

        {book.badge && (
          <span className="pointer-events-none absolute top-3 left-3 z-10 max-w-[calc(100%-4.75rem)] truncate rounded-full border border-(--vk-border-strong) bg-(--vk-surface)/95 px-2.5 py-1 vankho-mono text-[10px] font-semibold uppercase tracking-wider text-(--vk-brass) shadow-2xs">
            {book.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggleWishlist(book.id)}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Bỏ lưu ${book.name}`
              : `Lưu sách ${book.name} vào yêu thích`
          }
          className="absolute top-2.5 right-2.5 z-10 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-(--vk-border) bg-(--vk-surface)/92 text-(--vk-muted) transition-colors hover:bg-(--vk-surface) hover:text-(--vk-brass)"
        >
          <Heart
            className={`size-4 ${
              isWishlisted ? "fill-(--vk-brass) text-(--vk-brass)" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex min-w-0 flex-1 flex-col p-5">
        {/* Author & Rating */}
        <div className="flex items-center justify-between gap-2 text-xs text-(--vk-muted)">
          <span className="min-w-0 truncate font-medium text-(--vk-brass)">
            {book.author || book.categoryName || "NXB ĐH Ngôn Ngữ Bắc Kinh"}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 vankho-mono tabular-nums">
            <Star
              className="size-3.5 fill-amber-500 text-amber-500"
              aria-hidden="true"
            />
            <span className="font-semibold text-(--vk-fg)">
              {(book.rating || 4.9).toFixed(1)}
            </span>
          </span>
        </div>

        {/* Book Title */}
        <h3 className="mt-1.5 min-h-[3.25rem] vankho-serif text-lg font-medium leading-snug text-(--vk-fg) line-clamp-2">
          <button
            type="button"
            onClick={() => onOpenBookDrawer(book.id, "overview")}
            className="cursor-pointer text-left transition-colors hover:text-(--vk-brass)"
          >
            {book.name}
          </button>
        </h3>

        {/* Short Description */}
        <p className="mt-1 text-sm leading-relaxed text-(--vk-muted) line-clamp-2">
          {book.desc}
        </p>

        {/* Inline 2-Edition Switcher (Paperback vs Hardcover) */}
        <div
          role="group"
          aria-label={`Chọn ấn bản cho ${book.name}`}
          className="mt-3.5 grid grid-cols-2 gap-1.5 rounded-xl border border-(--vk-border) bg-(--vk-surface-subtle)/75 p-1"
        >
          {(["paperback", "hardcover"] as const).map((fmt) => {
            const isSelected = selectedEdition === fmt;
            const fmtEd = editions[fmt];
            return (
              <button
                key={fmt}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedEdition(fmt)}
                className={`min-h-[36px] cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                  isSelected
                    ? "bg-(--vk-surface) text-(--vk-fg) shadow-2xs border border-(--vk-border-strong)"
                    : "text-(--vk-muted) hover:text-(--vk-fg)"
                }`}
              >
                {fmt === "paperback" ? "Bìa mềm" : "Bìa cứng vải bố"}
                {fmtEd.stock <= 0 ? " (Hết)" : ""}
              </button>
            );
          })}
        </div>

        {/* Stock & Page Count Row */}
        <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-(--vk-muted)">
            <BookMarked className="size-3.5 text-(--vk-brass)" aria-hidden="true" />
            <span>
              {book.pages ? `${book.pages} trang` : book.duration || "Giấy kem"}
            </span>
          </span>
          <span
            className={`vankho-mono font-medium tabular-nums ${
              isOutOfStock
                ? "text-red-500"
                : isLowStock
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {isOutOfStock
              ? "Tạm hết hàng"
              : isLowStock
              ? `Chỉ còn ${activeEd.stock} cuốn`
              : `Còn ${activeEd.stock} cuốn`}
          </span>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-auto pt-4 flex items-end justify-between gap-2.5 border-t border-(--vk-border) mt-3.5">
          <div className="min-w-0">
            <span className="block text-[11px] text-(--vk-muted) truncate">
              {selectedEdition === "paperback"
                ? "Ấn bản bìa mềm"
                : "Bìa cứng dập nhũ vàng"}
            </span>
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="vankho-mono text-lg font-bold text-(--vk-brass) tabular-nums">
                {formatVnd(activeEd.price)}
              </span>
              {selectedEdition === "paperback" && book.originalPrice && (
                <span className="vankho-mono text-xs text-(--vk-muted) line-through tabular-nums">
                  {book.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenBookDrawer(book.id, "trial")}
              aria-label={`Đọc thử 3D ${book.name}`}
              title="Lật sách 3D đọc thử & nghe phát âm"
              className="inline-flex min-h-[42px] min-w-[42px] cursor-pointer items-center justify-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover)"
            >
              <BookOpen className="size-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl bg-(--vk-primary) px-3.5 text-xs font-semibold text-(--vk-primary-fg) transition-colors hover:bg-(--vk-primary-hover) disabled:cursor-not-allowed disabled:opacity-45"
            >
              {justAdded ? (
                <>
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                  <span>Đã thêm</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4 shrink-0" aria-hidden="true" />
                  <span>Thêm vào giỏ</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex justify-end">
          <Link
            href={`/detail/${book.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-(--vk-muted) hover:text-(--vk-brass)"
          >
            <span>Trang chi tiết ấn phẩm</span>
            <ExternalLink className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export interface VanKhoCatalogSectionProps {
  products: IProduct[];
  categories: ICategory[];
  plans: IPlan[];
  searchQuery: string;
  selectedCategoryId: string;
  sortBy: CourseSortMode;
  wishlistIds: Array<string | number>;
  onSearchChange: (q: string) => void;
  onCategoryChange: (catId: string) => void;
  onSortChange: (sort: CourseSortMode) => void;
  onResetFilters: () => void;
  onToggleWishlist: (id: string | number) => void;
  onOpenCourseDrawer: (productId: string | number, tab: DetailTabMode) => void;
}

export function VanKhoCatalogSection({
  products,
  categories,
  plans,
  searchQuery,
  selectedCategoryId,
  sortBy,
  wishlistIds,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
  onToggleWishlist,
  onOpenCourseDrawer,
}: VanKhoCatalogSectionProps) {
  const dispatch = useAppDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [editionFilter, setEditionFilter] = useState<EditionFilterMode>("all");

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategoryId !== "all" ||
    editionFilter !== "all" ||
    sortBy !== "featured";

  // [YÊU CẦU CÔ - useMemo]: Lọc & sắp xếp danh mục đầu sách theo từ khóa, chuyên đề & ấn bản
  const filteredBooks = useMemo(() => {
    const q = normalizeVietnamese(searchQuery);

    const matched = products.filter((book) => {
      if (
        selectedCategoryId !== "all" &&
        String(book.categoryId) !== selectedCategoryId
      ) {
        return false;
      }

      const eds = resolveBookEditions(book);
      if (editionFilter === "paperback" && eds.paperback.stock <= 0) {
        return false;
      }
      if (editionFilter === "hardcover" && eds.hardcover.stock <= 0) {
        return false;
      }

      if (q.length > 0) {
        const haystack = [
          book.name,
          book.desc,
          book.author || "",
          book.publisher || "",
          book.isbn || "",
          book.categoryName || "",
          book.level || "",
        ]
          .map(normalizeVietnamese)
          .join(" ");
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    if (sortBy === "featured") return matched;

    return [...matched].sort((a, b) => {
      const priceA = resolveBookEditions(a).paperback.price;
      const priceB = resolveBookEditions(b).paperback.price;
      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "students-desc":
          return (b.studentsCount || 0) - (a.studentsCount || 0);
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  }, [products, searchQuery, selectedCategoryId, editionFilter, sortBy]);

  const handleAddBoxset = (plan: IPlan) => {
    const mapped = BOXSET_BOOK_MAP[String(plan.id)];
    const entries =
      mapped && mapped.length > 0
        ? mapped
            .map((item) => {
              const found = products.find(
                (p) => String(p.id) === item.bookId
              );
              if (!found) return null;
              const eds = resolveBookEditions(found);
              return {
                bookId: String(found.id),
                edition: item.edition,
                maxStock: eds[item.edition].stock,
              };
            })
            .filter(
              (x): x is { bookId: string; edition: BookEditionFormat; maxStock: number } =>
                Boolean(x && x.maxStock > 0)
            )
        : products.slice(0, 3).map((p) => {
            const eds = resolveBookEditions(p);
            return {
              bookId: String(p.id),
              edition: "paperback" as BookEditionFormat,
              maxStock: eds.paperback.stock,
            };
          });

    if (entries.length === 0) return;
    dispatch(addMultipleToCart({ entries, openDrawer: true }));
  };

  return (
    <>
      {/* ================================================================= */}
      {/* KHU 3: KỆ SÁCH & HỌC LIỆU CHI TIẾT (BOOK CATALOG SECTION)        */}
      {/* ================================================================= */}
      <section
        id="catalog"
        aria-labelledby="vankho-catalog-heading"
        className="scroll-mt-16 border-t border-(--vk-border) bg-(--vk-paper) py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="vankho-mono text-xs uppercase tracking-[0.14em] text-(--vk-brass)">
                Kệ Sách Trực Tuyến · Kho Hàng Đồng Bộ MongoDB
              </p>
              <h2
                id="vankho-catalog-heading"
                className="mt-1 vankho-serif text-2xl font-medium tracking-tight text-(--vk-fg) sm:text-3xl"
              >
                Tủ Sách &amp; Học Liệu Tiếng Trung Chọn Lọc
              </h2>
            </div>

            <p
              aria-live="polite"
              className="shrink-0 vankho-mono text-sm tabular-nums text-(--vk-muted)"
            >
              Hiển thị{" "}
              <span className="font-semibold text-(--vk-fg)">
                {filteredBooks.length}
              </span>{" "}
              / {products.length} đầu sách
            </p>
          </div>

          {/* Search + Edition Segmented Filter + Sort Bar */}
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Input */}
              <div className="relative min-w-0 w-full lg:max-w-md">
                <label htmlFor="vankho-search-input" className="sr-only">
                  Tìm kiếm tên sách, tác giả, ISBN hoặc chủ đề Hán ngữ
                </label>
                <Search
                  className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-4 text-(--vk-muted)"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="vankho-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tìm sách HSK, 214 bộ thủ, thư pháp, tác giả, ISBN..."
                  className="h-11 w-full rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) pl-10 pr-9 text-sm text-(--vk-fg) placeholder:text-(--vk-muted)/70 focus:border-(--vk-primary) focus:outline-none focus:ring-2 focus:ring-(--vk-ring-focus)"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange("");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="absolute inset-y-0 right-1.5 my-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-(--vk-muted) hover:bg-(--vk-btn-hover) hover:text-(--vk-fg)"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Edition Segmented Switch + Sort Select */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div
                  role="group"
                  aria-label="Lọc theo hình thức đóng bìa"
                  className="inline-flex rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) p-1"
                >
                  {EDITION_FILTER_OPTIONS.map((opt) => {
                    const active = editionFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setEditionFilter(opt.value)}
                        className={`min-h-[34px] cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors ${
                          active
                            ? "bg-(--vk-primary) text-(--vk-primary-fg)"
                            : "text-(--vk-muted) hover:text-(--vk-fg)"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <label htmlFor="vankho-sort-select" className="sr-only">
                    Sắp xếp kệ sách
                  </label>
                  <select
                    id="vankho-sort-select"
                    value={sortBy}
                    onChange={(e) =>
                      onSortChange(e.target.value as CourseSortMode)
                    }
                    className="h-11 cursor-pointer appearance-none rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) pl-3.5 pr-9 text-sm font-medium text-(--vk-fg) focus:border-(--vk-primary) focus:outline-none"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute inset-y-0 right-3 my-auto size-4 text-(--vk-muted)"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div
              role="group"
              aria-label="Lọc theo chuyên mục sách"
              className="flex flex-wrap items-center gap-2"
            >
              <button
                type="button"
                aria-pressed={selectedCategoryId === "all"}
                onClick={() => onCategoryChange("all")}
                className={`inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-4 text-xs font-semibold transition-colors ${
                  selectedCategoryId === "all"
                    ? "border-(--vk-primary) bg-(--vk-primary) text-(--vk-primary-fg)"
                    : "border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-muted) hover:text-(--vk-fg)"
                }`}
              >
                Tất cả ({products.length})
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategoryId === String(cat.id);
                const countInCat = products.filter(
                  (p) => String(p.categoryId) === String(cat.id)
                ).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onCategoryChange(String(cat.id))}
                    className={`inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition-colors ${
                      isSelected
                        ? "border-(--vk-primary) bg-(--vk-primary) text-(--vk-primary-fg)"
                        : "border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-muted) hover:text-(--vk-fg)"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="vankho-mono opacity-75 tabular-nums">
                      ({countInCat})
                    </span>
                  </button>
                );
              })}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setEditionFilter("all");
                    onResetFilters();
                    searchInputRef.current?.focus();
                  }}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-full px-3 text-xs font-semibold text-(--vk-brass) hover:underline"
                >
                  <X className="size-3.5" aria-hidden="true" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Book Grid or Empty State */}
          {filteredBooks.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-(--vk-border) bg-(--vk-surface) px-6 py-16 text-center">
              <BookX
                className="size-10 text-(--vk-muted)"
                aria-hidden="true"
              />
              <p className="mt-3 vankho-serif text-xl font-medium text-(--vk-fg)">
                Không tìm thấy đầu sách phù hợp
              </p>
              <p className="mt-1 max-w-md text-sm text-(--vk-muted)">
                Chưa có ấn phẩm nào khớp với từ khóa hoặc bộ lọc ấn bản hiện tại. Bạn hãy thử đặt lại bộ lọc để xem toàn bộ kho sách.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditionFilter("all");
                  onResetFilters();
                }}
                className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center rounded-xl bg-(--vk-primary) px-5 text-sm font-semibold text-(--vk-primary-fg) transition-colors hover:bg-(--vk-primary-hover)"
              >
                Hiển thị lại toàn bộ {products.length} đầu sách
              </button>
            </div>
          ) : (
            <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book, idx) => {
                const globalIdx = products.findIndex(
                  (p) => String(p.id) === String(book.id)
                );
                const meta = getCourseArchivalMeta(
                  book,
                  globalIdx >= 0 ? globalIdx : idx
                );
                const isWishlisted = wishlistIds.some(
                  (id) => String(id) === String(book.id)
                );
                const initialFormat: BookEditionFormat =
                  editionFilter === "hardcover" ? "hardcover" : "paperback";

                return (
                  <BookCatalogCard
                    key={`${book.id}-${initialFormat}`}
                    book={book}
                    meta={meta}
                    defaultEdition={initialFormat}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={onToggleWishlist}
                    onOpenBookDrawer={onOpenCourseDrawer}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* KHU 4: COMBO BOXSET TIẾT KIỆM & HỘP QUÀ SƯU TẦM                   */}
      {/* ================================================================= */}
      {plans.length > 0 && (
        <section
          id="boxsets"
          aria-labelledby="vankho-plans-heading"
          className="scroll-mt-16 border-t border-(--vk-border) bg-(--vk-gallery) py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="vankho-mono text-xs uppercase tracking-[0.14em] text-(--vk-brass)">
                Combo Tiết Kiệm &amp; Hộp Quà Tàng Thư
              </p>
              <h2
                id="vankho-plans-heading"
                className="mt-1 vankho-serif text-2xl font-medium tracking-tight text-(--vk-fg) sm:text-3xl"
              >
                Bộ Sách Boxset Đóng Hộp Sưu Tập Theo Trình Độ
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-(--vk-muted)">
                Mua theo bộ giúp tiết kiệm tới 18% so với mua lẻ từng cuốn, miễn phí vận chuyển toàn quốc và tặng kèm bookmark đồng khắc chữ Hán.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {plans.map((plan) => {
                const isFeatured = Boolean(plan.popular);
                return (
                  <div
                    key={plan.id}
                    className={`flex flex-col justify-between rounded-2xl border p-6 transition-colors ${
                      isFeatured
                        ? "border-(--vk-primary) bg-(--vk-surface) ring-1 ring-(--vk-primary)/30"
                        : "border-(--vk-border) bg-(--vk-surface)"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="vankho-mono text-xs uppercase tracking-[0.14em] text-(--vk-brass)">
                          {plan.period}
                        </span>
                        {plan.badge && (
                          <span className="rounded-full border border-(--vk-primary)/30 bg-(--vk-primary-light) px-2.5 py-0.5 vankho-mono text-[11px] font-semibold text-(--vk-brass)">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 vankho-serif text-xl font-medium text-(--vk-fg)">
                        {plan.name}
                      </h3>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="vankho-mono text-2xl font-bold text-(--vk-fg) tabular-nums sm:text-3xl">
                          {plan.price}
                        </span>
                        {plan.originalPrice && (
                          <span className="vankho-mono text-xs text-(--vk-muted) line-through tabular-nums">
                            {plan.originalPrice}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-(--vk-muted)">{plan.desc}</p>

                      <ul className="mt-5 space-y-2.5 border-t border-(--vk-border) pt-4 text-sm text-(--vk-fg)/90">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2
                              className="mt-0.5 size-4 shrink-0 text-(--vk-brass)"
                              aria-hidden="true"
                            />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddBoxset(plan)}
                      className={`mt-6 inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${
                        isFeatured
                          ? "bg-(--vk-primary) text-(--vk-primary-fg) hover:bg-(--vk-primary-hover)"
                          : "border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) hover:bg-(--vk-btn-hover)"
                      }`}
                    >
                      <PackagePlus className="size-4 shrink-0" aria-hidden="true" />
                      <span>Thêm trọn bộ vào giỏ</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
