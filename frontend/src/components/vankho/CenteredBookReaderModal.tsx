"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, Heart, ShoppingBag } from "lucide-react";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { useAppDispatch } from "@/store";
import { addToCart, openCart } from "@/store/slices/cartSlice";
import { CourseBook3DFlip } from "./CourseBook3DFlip";
import {
  formatVnd,
  getCourseArchivalMeta,
  resolveBookEditions,
} from "./vankho-data";

export interface CenteredBookReaderModalProps {
  products: IProduct[];
  selectedBookId: string | number | null;
  wishlistIds: Array<string | number>;
  onToggleWishlist: (id: string | number) => void;
  onClose: () => void;
}

export function CenteredBookReaderModal({
  products,
  selectedBookId,
  wishlistIds,
  onToggleWishlist,
  onClose,
}: CenteredBookReaderModalProps) {
  const dispatch = useAppDispatch();

  const bookIndex = useMemo(
    () =>
      selectedBookId !== null
        ? products.findIndex((p) => String(p.id) === String(selectedBookId))
        : -1,
    [products, selectedBookId]
  );
  const selectedBook = bookIndex >= 0 ? products[bookIndex] : null;
  const selectedMeta = useMemo(
    () =>
      selectedBook ? getCourseArchivalMeta(selectedBook, bookIndex) : null,
    [selectedBook, bookIndex]
  );

  // 0 = Closed 3D Cover, 1..5 = 5 Open Two-Page Spreads (Pages 01..10)
  const [spreadIndex, setSpreadIndex] = useState<number>(0);
  const [isClosingBook, setIsClosingBook] = useState<boolean>(false);
  const [selectedEdition, setSelectedEdition] =
    useState<BookEditionFormat>("hardcover");
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  // =========================================================================
  // ANIMATION 1: AUTO-OPEN BOOK COVER WHEN MODAL APPEARS IN CENTER OF SCREEN
  // =========================================================================
  useEffect(() => {
    if (!selectedBook) {
      setSpreadIndex(0);
      setIsClosingBook(false);
      return;
    }

    const eds = resolveBookEditions(selectedBook);
    setSelectedEdition(eds.hardcover.stock > 0 ? "hardcover" : "paperback");
    setSpreadIndex(0);
    setIsClosingBook(false);
    setJustAdded(false);

    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
    }
    // Brief pause on centered closed cover, then swing cover open to Page 01-02!
    openTimerRef.current = window.setTimeout(() => {
      setSpreadIndex(1);
    }, 220);

    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [selectedBook]);

  // =========================================================================
  // ANIMATION 3: CLOSE ALL PAGES & FRONT COVER FIRST, THEN DISMISS MODAL
  // =========================================================================
  const triggerCloseBookSequence = useCallback(() => {
    if (isClosingBook) return;
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
    }

    if (spreadIndex > 0) {
      setIsClosingBook(true);
      setSpreadIndex(0);
      closeTimerRef.current = window.setTimeout(() => {
        setIsClosingBook(false);
        onClose();
      }, 780);
    } else {
      onClose();
    }
  }, [isClosingBook, onClose, spreadIndex]);

  // Lock background scroll & support ArrowLeft / ArrowRight / Escape keys
  useEffect(() => {
    if (!selectedBook) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        triggerCloseBookSequence();
      } else if (e.key === "ArrowRight" && !isClosingBook) {
        e.preventDefault();
        setSpreadIndex((prev) => Math.min(5, prev + 1));
      } else if (e.key === "ArrowLeft" && !isClosingBook) {
        e.preventDefault();
        if (spreadIndex <= 1) {
          triggerCloseBookSequence();
        } else {
          setSpreadIndex((prev) => Math.max(0, prev - 1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBook, isClosingBook, spreadIndex, triggerCloseBookSequence]);

  const editions = useMemo(
    () => (selectedBook ? resolveBookEditions(selectedBook) : null),
    [selectedBook]
  );

  const handleAddToCartFromReader = () => {
    if (!selectedBook || !editions) return;
    const activeEd = editions[selectedEdition];
    if (activeEd.stock <= 0) return;

    dispatch(
      addToCart({
        bookId: String(selectedBook.id),
        edition: selectedEdition,
        quantity: 1,
        maxStock: activeEd.stock,
        openDrawer: false,
      })
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const isWishlisted = selectedBook
    ? wishlistIds.some((id) => String(id) === String(selectedBook.id))
    : false;

  return (
    <AnimatePresence>
      {selectedBook && selectedMeta && editions && (
        <motion.div
          key="centered-book-spotlight"
          role="dialog"
          aria-modal="true"
          aria-labelledby="centered-book-reader-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              triggerCloseBookSequence();
            }
          }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-y-auto bg-stone-950/80 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-6"
        >
          {/* Warm overhead library spotlight glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${selectedMeta.accentHex}28 0%, transparent 72%)`,
            }}
          />

          <motion.div
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex w-full max-w-4xl flex-col items-center"
          >
            {/* ============================================================= */}
            {/* 1. CONCISE BOOK INTRODUCTION ABOVE THE BOOK                   */}
            {/* ============================================================= */}
            <div className="mb-3 max-w-2xl px-2 text-center sm:mb-4">
              <p className="vankho-mono text-[11px] uppercase tracking-[0.18em] text-amber-300/95 tabular-nums">
                Ấn phẩm {selectedMeta.volumeCode} ·{" "}
                {selectedBook.author || "Ban Biên Tập HANZI"} ·{" "}
                {selectedBook.pages || 248} trang
              </p>

              <h2
                id="centered-book-reader-title"
                className="mt-1 vankho-serif text-xl font-medium leading-snug text-[#FAF7F0] sm:text-2xl"
              >
                {selectedBook.name}
              </h2>

              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-300 sm:text-sm">
                {selectedBook.desc}
              </p>
            </div>

            {/* ============================================================= */}
            {/* 2. DEAD-CENTER 3D BOOK (OPEN -> LEAF FLIP -> CLOSE)           */}
            {/* ============================================================= */}
            <CourseBook3DFlip
              product={selectedBook}
              meta={selectedMeta}
              edition={selectedEdition}
              controlledSpread={spreadIndex}
              onSpreadChange={(next) => {
                if (!isClosingBook) setSpreadIndex(next);
              }}
              onRequestCloseBook={triggerCloseBookSequence}
              isClosingAnimation={isClosingBook}
            />

            {/* ============================================================= */}
            {/* 3. COMPACT EDITION PICKER & ADD-TO-CART BAR BELOW             */}
            {/* ============================================================= */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/15 bg-stone-900/88 px-3 py-2 text-xs shadow-2xl backdrop-blur-md sm:mt-4 sm:gap-3 sm:px-4">
              {/* Paperback vs Hardcover Selector */}
              <div
                role="group"
                aria-label="Chọn loại bìa"
                className="inline-flex items-center gap-1 rounded-xl border border-white/12 bg-stone-950/70 p-1"
              >
                {(["paperback", "hardcover"] as const).map((fmt) => {
                  const chosen = selectedEdition === fmt;
                  const ed = editions[fmt];
                  return (
                    <button
                      key={fmt}
                      type="button"
                      aria-pressed={chosen}
                      onClick={() => setSelectedEdition(fmt)}
                      className={`min-h-[34px] cursor-pointer rounded-lg px-2.5 py-1 vankho-mono text-[11px] transition-colors tabular-nums ${
                        chosen
                          ? "bg-(--vk-primary) font-semibold text-(--vk-primary-fg)"
                          : "text-stone-300 hover:text-white"
                      }`}
                    >
                      {fmt === "paperback" ? "Bìa mềm" : "Bìa cứng vải bố"} ·{" "}
                      {formatVnd(ed.price)}
                    </button>
                  );
                })}
              </div>

              {/* Quick Add to Cart */}
              <button
                type="button"
                disabled={editions[selectedEdition].stock <= 0}
                onClick={handleAddToCartFromReader}
                className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl bg-amber-500 px-4 text-xs font-bold text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-45"
              >
                {justAdded ? (
                  <>
                    <Check className="size-4" aria-hidden="true" />
                    <span>Đã thêm vào giỏ!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-3.5" aria-hidden="true" />
                    <span>
                      Thêm vào giỏ ·{" "}
                      {formatVnd(editions[selectedEdition].price)}
                    </span>
                  </>
                )}
              </button>

              {justAdded && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    dispatch(openCart());
                  }}
                  className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-xl border border-amber-400/50 bg-amber-500/15 px-3 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/25"
                >
                  <span>Mở giỏ sách →</span>
                </button>
              )}

              {/* Wishlist Toggle */}
              <button
                type="button"
                onClick={() => onToggleWishlist(selectedBook.id)}
                aria-pressed={isWishlisted}
                aria-label="Lưu sách yêu thích"
                className={`inline-flex min-h-[38px] min-w-[38px] cursor-pointer items-center justify-center rounded-xl border transition-colors ${
                  isWishlisted
                    ? "border-amber-400/50 bg-amber-500/20 text-amber-300"
                    : "border-white/15 bg-stone-950/60 text-stone-300 hover:text-white"
                }`}
              >
                <Heart
                  className={`size-4 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>

              {/* Standalone Detail Page Link */}
              <Link
                href={`/detail/${selectedBook.id}`}
                className="inline-flex min-h-[38px] items-center gap-1 rounded-xl px-2.5 text-[11px] font-medium text-stone-300 transition-colors hover:text-amber-300"
              >
                <span>Trang chi tiết</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
