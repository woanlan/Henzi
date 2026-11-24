"use client";

import React, {
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  Check,
  Heart,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ICategory } from "@/interfaces/category";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { useAppDispatch } from "@/store";
import { addMultipleToCart, addToCart } from "@/store/slices/cartSlice";
import { DetailTabMode } from "./VanKhoCoverFlowHero";
import {
  buildEditorialCollections,
  EditorialCourseCollection,
  formatVnd,
  getCourseArchivalMeta,
  resolveBookEditions,
} from "./vankho-data";

export interface VanKhoLookbookProps {
  categories: ICategory[];
  products: IProduct[];
  wishlistIds: Array<string | number>;
  onToggleWishlist: (id: string | number) => void;
  onOpenCourseDrawer: (productId: string | number, tab: DetailTabMode) => void;
  onFilterByCategory: (categoryId: string) => void;
}

const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 0.9,
};

interface ShelfBookItemProps {
  book: IProduct;
  globalIndex: number;
  interactive: boolean;
  onSelectBook: (id: string | number) => void;
}

function ShelfBookItem({
  book,
  globalIndex,
  interactive,
  onSelectBook,
}: ShelfBookItemProps) {
  const meta = getCourseArchivalMeta(book, globalIndex);

  const bookVisual = (
    <div className="book3d-perspective relative flex h-full flex-col items-center justify-end">
      {/* Standing 3D Hardcover Book Scaled Proportionally to the 4:3 Cabinet Bay */}
      <div
        className={`book3d-preserve relative z-10 aspect-[2/3] h-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:rotateY(-10deg)_rotateX(1.5deg)] ${
          interactive
            ? "group-hover/shelfbook:[transform:translateY(-6px)_rotateY(-3deg)_scale(1.05)]"
            : ""
        }`}
      >
        {/* Back Hardcover Board + Deep Ambient Rear Shadow Against Walnut Back Wall */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-y-[1px] left-0 -right-[2px] rounded-r-[4px] rounded-l-[2px] border border-black/45 shadow-[0_14px_24px_-4px_rgba(12,6,2,0.72),-6px_6px_16px_rgba(10,5,2,0.55)]"
          style={{
            backgroundColor: meta.spineColor,
            transform: "translateZ(-7px)",
          }}
        />

        {/* Cream Sewn Page Block on Right */}
        <div
          aria-hidden="true"
          className="book3d-page-edges pointer-events-none absolute top-[2px] -right-[3px] h-[calc(100%-4px)] w-[7px] rounded-r-[2px]"
          style={{
            transformOrigin: "right center",
            transform: "translateZ(-1px) rotateY(74deg)",
          }}
        />

        {/* Left Cloth Spine Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[6px] rounded-l-[2px]"
          style={{
            backgroundColor: meta.spineColor,
            transformOrigin: "left center",
            transform: "rotateY(-78deg)",
          }}
        />

        {/* Front Gold-Foil Cover + Overhead LED Strip Rim Light */}
        <div
          className="book3d-face absolute inset-0 overflow-hidden rounded-r-[4px] rounded-l-[2px] border border-black/35"
          style={{
            backgroundColor: meta.spineColor,
            transform: "translateZ(1px)",
          }}
        >
          <img
            src={meta.bookCoverImage}
            alt={book.name}
            loading="lazy"
            className="h-full w-full object-cover select-none"
          />
          {/* Overhead Warm Linear LED Rim Highlight on Top Edge of Book */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-100/25 via-amber-100/70 to-amber-100/25"
          />
          <div
            aria-hidden="true"
            className="vankho-cover-glare pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden="true"
            className="vankho-spine-sheen pointer-events-none absolute inset-0"
          />
        </div>

        {/* Hover Quick-Open Pill */}
        {interactive && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-1 bottom-1.5 z-20 truncate rounded border border-amber-300/45 bg-stone-950/90 px-1.5 py-0.5 text-center vankho-mono text-[8.5px] font-semibold text-amber-200 opacity-0 shadow-md transition-opacity duration-200 group-hover/shelfbook:opacity-100 sm:text-[9.5px]"
          >
            Mở sách
          </span>
        )}
      </div>

      {/* Dual-Layer Grounded Contact + Cast Shadow Onto Satin Walnut Shelf Surface */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[3px] left-1/2 z-0 h-[5px] w-[92%] -translate-x-1/2 rounded-full bg-black/80 blur-[2px] transition-all duration-300 group-hover/shelfbook:w-[78%] group-hover/shelfbook:bg-black/50"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[7px] left-1/2 z-0 h-[9px] w-[112%] -translate-x-1/2 rounded-full bg-[#1a0c04]/55 blur-[5px] transition-all duration-300 group-hover/shelfbook:opacity-40"
      />
    </div>
  );

  if (!interactive) {
    return <div className="h-full shrink-0">{bookVisual}</div>;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelectBook(book.id);
      }}
      title={`${book.name} — Nhấn để mở sách đọc thử 3D`}
      aria-label={`Mở đọc thử sách ${book.name}`}
      className="group/shelfbook relative h-full shrink-0 cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
    >
      {bookVisual}
    </button>
  );
}

export function VanKhoLookbook({
  categories,
  products,
  wishlistIds,
  onToggleWishlist,
  onOpenCourseDrawer,
  onFilterByCategory,
}: VanKhoLookbookProps) {
  const dispatch = useAppDispatch();
  const collections: EditorialCourseCollection[] = useMemo(
    () => buildEditorialCollections(categories, products),
    [categories, products]
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const dragStartXRef = useRef<number | null>(null);

  const total = collections.length;
  if (total === 0) return null;

  const safeIndex = ((activeIdx % total) + total) % total;
  const activeCollection = collections[safeIndex];
  const formattedTotal = String(total).padStart(2, "0");

  const collectionBundleTotal = activeCollection.products.reduce((sum, book) => {
    const eds = resolveBookEditions(book);
    const chosen = eds.paperback.stock > 0 ? eds.paperback : eds.hardcover;
    return sum + (chosen.stock > 0 ? chosen.price : 0);
  }, 0);

  const goTo = (idx: number) => {
    setActiveIdx(((idx % total) + total) % total);
  };

  const handleQuickAddSingle = (book: IProduct) => {
    const eds = resolveBookEditions(book);
    const format: BookEditionFormat =
      eds.paperback.stock > 0 ? "paperback" : "hardcover";
    const chosen = eds[format];
    if (chosen.stock <= 0) return;

    dispatch(
      addToCart({
        bookId: String(book.id),
        edition: format,
        quantity: 1,
        maxStock: chosen.stock,
        openDrawer: false,
      })
    );
    setJustAddedId(String(book.id));
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === String(book.id) ? null : curr));
    }, 1200);
  };

  const handleAddCollectionToCart = () => {
    const entries = activeCollection.products
      .map((book) => {
        const eds = resolveBookEditions(book);
        const format: BookEditionFormat =
          eds.paperback.stock > 0 ? "paperback" : "hardcover";
        return {
          bookId: String(book.id),
          edition: format,
          maxStock: eds[format].stock,
        };
      })
      .filter((item) => item.maxStock > 0);

    if (entries.length === 0) return;
    dispatch(addMultipleToCart({ entries, openDrawer: true }));
  };

  const handleStagePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStartXRef.current = e.clientX;
  };

  const handleStagePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current !== null) {
      const dx = e.clientX - dragStartXRef.current;
      if (Math.abs(dx) > 48) {
        goTo(dx < 0 ? safeIndex + 1 : safeIndex - 1);
      }
      dragStartXRef.current = null;
    }
  };

  const handleStagePointerLeave = () => {
    dragStartXRef.current = null;
  };

  return (
    <section
      id="collections"
      aria-labelledby="vankho-lookbook-heading"
      className="scroll-mt-16 border-t border-(--vk-border) bg-(--vk-gallery)"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* LEFT: Architectural Satin-Walnut 2-Tier Bookstore Display Cabinet */}
          <div className="min-w-0 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 vankho-mono text-xs uppercase tracking-[0.14em] text-(--vk-muted)">
              <span className="font-semibold text-(--vk-brass) tabular-nums">
                TỦ SÁCH CHUYÊN ĐỀ {activeCollection.indexLabel} / {formattedTotal}
              </span>
              <span aria-hidden="true" className="text-(--vk-border-strong)">
                ·
              </span>
              <span>{activeCollection.seasonTag}</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCollection.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2
                  id="vankho-lookbook-heading"
                  className="mt-3 vankho-serif text-3xl font-normal leading-tight tracking-[-0.02em] text-(--vk-fg) text-balance sm:text-4xl lg:text-5xl"
                >
                  {activeCollection.title}
                </h2>

                <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-(--vk-fg)/85 sm:text-lg">
                  {activeCollection.subtitle}
                </p>

                <p className="mt-2.5 max-w-[60ch] text-sm leading-relaxed text-(--vk-muted)">
                  {activeCollection.editorialNote}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* 3-Layer Stacked Photorealistic 4:3 Walnut Bookcases */}
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Tủ kệ gỗ óc chó trưng bày sách theo chuyên đề"
              onPointerDown={handleStagePointerDown}
              onPointerUp={handleStagePointerUp}
              onPointerLeave={handleStagePointerLeave}
              className="relative mt-7 w-full touch-pan-y select-none pb-4 sm:mt-9 sm:pb-5"
            >
              {/* Strict 4:3 Aspect Ratio Locked to Photographed Cabinet Geometry */}
              <div className="relative aspect-[4/3] w-[91%] sm:w-[88%]">
                {collections.map((col, idx) => {
                  const depth = (idx - safeIndex + total) % total;
                  if (depth > 2) return null;

                  const isActive = depth === 0;
                  const isNext = depth === 1;

                  const targetX = isActive ? "0%" : isNext ? "9.5%" : "16%";
                  const targetY = isActive ? "0%" : isNext ? "2.5%" : "5%";
                  const targetScale = isActive ? 1 : isNext ? 0.91 : 0.83;
                  const targetOpacity = isActive ? 1 : isNext ? 0.74 : 0.38;
                  const targetBlur = isActive
                    ? "blur(0px)"
                    : isNext
                    ? "blur(2px)"
                    : "blur(4px)";
                  const zIndex = isActive ? 30 : isNext ? 20 : 10;

                  const midpoint = Math.ceil(col.products.length / 2);
                  const topShelfBooks = col.products.slice(0, midpoint);
                  const bottomShelfBooks = col.products.slice(midpoint);

                  return (
                    <motion.div
                      key={col.id}
                      aria-hidden={!isActive}
                      initial={false}
                      animate={{
                        x: targetX,
                        y: targetY,
                        scale: targetScale,
                        opacity: targetOpacity,
                        filter: targetBlur,
                      }}
                      transition={SPRING_CONFIG}
                      style={{ zIndex }}
                      onClick={!isActive ? () => goTo(idx) : undefined}
                      className={`absolute inset-0 will-change-transform ${
                        isActive ? "" : "cursor-pointer"
                      }`}
                    >
                      {/* Full-Bleed Studio Satin-Walnut Display Bookcase */}
                      <div
                        className={`relative h-full w-full overflow-hidden rounded-2xl border border-amber-300/25 bg-[#23150c] ${
                          isActive
                            ? "shadow-[0_32px_64px_-22px_rgba(12,8,4,0.68)] ring-1 ring-black/40"
                            : "shadow-xl"
                        }`}
                      >
                        {/* Photorealistic 4:3 Satin Walnut Cabinet Architecture */}
                        <img
                          src="/images/bookshelf-cabinet.jpg"
                          alt={`Tủ kệ gỗ trưng bày ${col.title}`}
                          loading={isActive ? "eager" : "lazy"}
                          className="pointer-events-none absolute inset-0 h-full w-full object-fill select-none"
                        />

                        {/* Engraved Brushed-Brass Museum Nameplate Mounted on Top Walnut Frieze */}
                        <div className="pointer-events-none absolute inset-x-0 top-[1.8%] z-20 flex justify-center px-4">
                          <span className="inline-flex items-center gap-2 rounded-xs border border-amber-300/45 bg-gradient-to-b from-[#2f1d11]/92 to-[#1c1008]/95 px-3 py-0.5 vankho-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-200/95 shadow-md sm:px-4 sm:text-[10px]">
                            <span
                              className="size-1.5 rounded-full"
                              style={{ backgroundColor: col.accentColor }}
                            />
                            <span>
                              TỦ HANZI {col.indexLabel} · {col.products.length} ẤN PHẨM
                            </span>
                          </span>
                        </div>

                        {/* ================================================= */}
                        {/* UPPER SHELF BAY (Resting on Middle Walnut Plank)  */}
                        {/* ================================================= */}
                        <div className="pointer-events-none absolute inset-x-[11%] top-[14.2%] bottom-[54.2%] z-10 flex items-end justify-center gap-[5.5%] sm:gap-[7%]">
                          {topShelfBooks.map((book) => {
                            const gIdx = products.findIndex(
                              (p) => String(p.id) === String(book.id)
                            );
                            return (
                              <div
                                key={book.id}
                                className="pointer-events-auto h-full"
                              >
                                <ShelfBookItem
                                  book={book}
                                  globalIndex={gIdx >= 0 ? gIdx : 0}
                                  interactive={isActive}
                                  onSelectBook={(id) =>
                                    onOpenCourseDrawer(id, "trial")
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* ================================================= */}
                        {/* LOWER SHELF BAY (Resting on Bottom Walnut Plank)  */}
                        {/* ================================================= */}
                        {bottomShelfBooks.length > 0 && (
                          <div className="pointer-events-none absolute inset-x-[11%] top-[56.2%] bottom-[12.4%] z-10 flex items-end justify-center gap-[5.5%] sm:gap-[7%]">
                            {bottomShelfBooks.map((book) => {
                              const gIdx = products.findIndex(
                                (p) => String(p.id) === String(book.id)
                              );
                              return (
                                <div
                                  key={book.id}
                                  className="pointer-events-auto h-full"
                                >
                                  <ShelfBookItem
                                    book={book}
                                    globalIndex={gIdx >= 0 ? gIdx : 0}
                                    interactive={isActive}
                                    onSelectBook={(id) =>
                                      onOpenCourseDrawer(id, "trial")
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Subtle Plinth Caption Along Bottom Dark Walnut Base */}
                        <div className="absolute inset-x-0 bottom-0 z-20 flex h-[6.2%] items-center justify-between px-3.5 sm:px-5">
                          <span className="truncate vankho-mono text-[9px] uppercase tracking-[0.14em] text-amber-200/80 sm:text-[10px]">
                            Nhấn vào cuốn sách trên kệ để mở đọc 3D
                          </span>
                          {isActive && (
                            <button
                              type="button"
                              onClick={() => goTo(safeIndex + 1)}
                              className="shrink-0 cursor-pointer vankho-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-amber-300 transition-colors hover:text-amber-100 sm:text-[10.5px]"
                            >
                              Tủ kế tiếp →
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Collection Switcher Bar */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 sm:mt-6 sm:flex-nowrap sm:gap-3">
              <button
                type="button"
                onClick={() => goTo(safeIndex - 1)}
                className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-(--vk-border-strong) bg-(--vk-surface) px-3.5 text-xs font-medium text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover) sm:px-4 sm:text-sm"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Tủ trước</span>
                <span className="sm:hidden">Trước</span>
              </button>

              <div
                role="group"
                aria-label="Chọn nhanh tủ sách chuyên đề"
                className="order-last flex w-full items-center justify-center gap-1.5 sm:order-none sm:w-auto sm:gap-2"
              >
                {collections.map((col, idx) => {
                  const isCurrent = idx === safeIndex;
                  const numLabel = String(idx + 1).padStart(2, "0");
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => goTo(idx)}
                      aria-pressed={isCurrent}
                      aria-label={`Xem tủ ${numLabel}: ${col.title}`}
                      className={`inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border vankho-mono text-xs font-semibold tabular-nums transition-colors ${
                        isCurrent
                          ? "border-(--vk-primary) bg-(--vk-primary) text-(--vk-primary-fg)"
                          : "border-(--vk-border) bg-(--vk-surface) text-(--vk-muted) hover:border-(--vk-border-strong) hover:text-(--vk-fg)"
                      }`}
                    >
                      {numLabel}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goTo(safeIndex + 1)}
                className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-(--vk-border-strong) bg-(--vk-surface) px-3.5 text-xs font-medium text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover) sm:px-4 sm:text-sm"
              >
                <span className="hidden sm:inline">Tủ tiếp theo</span>
                <span className="sm:hidden">Tiếp</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* RIGHT: Sticky Bookstore Shoppable Rail */}
          <aside
            aria-label={`Danh sách ấn phẩm thuộc ${activeCollection.title}`}
            className="min-w-0 lg:col-span-5 lg:sticky lg:top-24"
          >
            <div className="flex items-baseline justify-between gap-3 border-b border-(--vk-border) pb-3.5">
              <h3 className="vankho-serif text-xl font-medium text-(--vk-fg)">
                Ấn phẩm trong tủ sách này
              </h3>
              <span className="shrink-0 vankho-mono text-xs uppercase tracking-[0.12em] text-(--vk-muted) tabular-nums">
                {activeCollection.products.length} đầu sách
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={activeCollection.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-4 flex max-h-[540px] flex-col gap-3 overflow-y-auto pr-1"
              >
                {activeCollection.products.map((book, idx) => {
                  const globalIdx = products.findIndex(
                    (p) => String(p.id) === String(book.id)
                  );
                  const meta = getCourseArchivalMeta(
                    book,
                    globalIdx >= 0 ? globalIdx : idx
                  );
                  const eds = resolveBookEditions(book);
                  const chosenEd =
                    eds.paperback.stock > 0 ? eds.paperback : eds.hardcover;
                  const outOfStock = chosenEd.stock <= 0;
                  const isSaved = wishlistIds.some(
                    (id) => String(id) === String(book.id)
                  );
                  const isJustAdded = justAddedId === String(book.id);

                  return (
                    <li
                      key={book.id}
                      className="flex items-center gap-3.5 rounded-xl border border-(--vk-border) bg-(--vk-surface) p-3.5 transition-colors hover:border-(--vk-border-strong)"
                    >
                      {/* Miniature 3D Cloth-Bound Hardcover Book Thumbnail */}
                      <button
                        type="button"
                        onClick={() => onOpenCourseDrawer(book.id, "trial")}
                        aria-label={`Mở đọc thử ${book.name}`}
                        className="group relative aspect-[2/3] w-16 shrink-0 cursor-pointer overflow-hidden rounded-r-[5px] rounded-l-[2px] border border-black/25 bg-stone-900 shadow-md sm:w-[70px]"
                      >
                        <img
                          src={meta.bookCoverImage}
                          alt={book.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span
                          aria-hidden="true"
                          className="vankho-cover-glare pointer-events-none absolute inset-0"
                        />
                        <span
                          aria-hidden="true"
                          className="vankho-spine-sheen pointer-events-none absolute inset-0"
                        />
                      </button>

                      {/* Book Details */}
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onOpenCourseDrawer(book.id, "trial")}
                          className="block max-w-full cursor-pointer text-left vankho-serif text-base font-medium leading-snug text-(--vk-fg) line-clamp-2 transition-colors hover:text-(--vk-brass)"
                        >
                          {book.name}
                        </button>

                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-(--vk-muted)">
                          <span className="truncate max-w-[160px]">
                            {book.author || "NXB ĐH Ngôn Ngữ Bắc Kinh"}
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 vankho-mono tabular-nums">
                            <BookMarked className="size-3" aria-hidden="true" />
                            {book.pages ? `${book.pages} tr.` : book.duration}
                          </span>
                        </p>

                        <div className="mt-2 flex flex-wrap items-baseline gap-2">
                          <span className="vankho-mono text-sm font-semibold text-(--vk-brass) tabular-nums">
                            {formatVnd(chosenEd.price)}
                          </span>
                          <span className="vankho-mono text-[11px] text-(--vk-muted) tabular-nums">
                            {outOfStock
                              ? "Tạm hết"
                              : eds.paperback.stock > 0
                              ? `Bìa mềm (còn ${eds.paperback.stock})`
                              : `Bìa cứng (còn ${eds.hardcover.stock})`}
                          </span>
                        </div>
                      </div>

                      {/* Quick Actions: Wishlist + Quick Add (+) */}
                      <div className="flex shrink-0 flex-col items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleWishlist(book.id)}
                          aria-pressed={isSaved}
                          aria-label={
                            isSaved
                              ? `Bỏ lưu ${book.name}`
                              : `Lưu sách ${book.name}`
                          }
                          className={`inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                            isSaved
                              ? "border-amber-500/40 bg-(--vk-primary-light) text-(--vk-brass)"
                              : "border-(--vk-border) bg-(--vk-surface) text-(--vk-muted) hover:border-(--vk-border-strong) hover:text-(--vk-fg)"
                          }`}
                        >
                          <Heart
                            className={`size-4 ${isSaved ? "fill-current" : ""}`}
                            aria-hidden="true"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickAddSingle(book)}
                          disabled={outOfStock}
                          aria-label={`Thêm ${book.name} vào giỏ sách`}
                          title="Thêm nhanh vào giỏ sách"
                          className={`inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            isJustAdded
                              ? "border-(--vk-primary) bg-(--vk-primary) text-(--vk-primary-fg)"
                              : "border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) hover:border-(--vk-primary) hover:bg-(--vk-primary) hover:text-(--vk-primary-fg)"
                          }`}
                        >
                          {isJustAdded ? (
                            <Check className="size-4" aria-hidden="true" />
                          ) : (
                            <Plus className="size-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>

            {/* Add Entire Collection to Cart + Filter Link */}
            <div className="mt-4 rounded-xl border border-(--vk-border) bg-(--vk-surface-subtle)/80 p-4 space-y-2.5">
              <button
                type="button"
                onClick={handleAddCollectionToCart}
                disabled={collectionBundleTotal <= 0}
                className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--vk-primary) px-4 py-2.5 text-sm font-semibold text-(--vk-primary-fg) transition-colors hover:bg-(--vk-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  Thêm trọn bộ vào giỏ · {formatVnd(collectionBundleTotal)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onFilterByCategory(activeCollection.id)}
                className="inline-flex min-h-[40px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-(--vk-muted) transition-colors hover:text-(--vk-brass)"
              >
                <span>Lọc riêng tủ này dưới Kệ Sách Chi Tiết</span>
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
