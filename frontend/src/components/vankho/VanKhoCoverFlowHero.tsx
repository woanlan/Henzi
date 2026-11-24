"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ShoppingBag,
} from "lucide-react";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { CourseSleeve3D } from "./CourseSleeve3D";
import { CourseTimelineScrubber } from "./CourseTimelineScrubber";
import {
  clampProgress,
  computeCoverFlowStyle,
  formatVnd,
  getCourseArchivalMeta,
  resolveBookEditions,
  snapProgress,
} from "./vankho-data";

export type DetailTabMode = "overview" | "trial";

export interface VanKhoCoverFlowHeroProps {
  products: IProduct[];
  activeCourseIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpenCourseDrawer: (productId: string | number, tab: DetailTabMode) => void;
}

interface StageDragState {
  active: boolean;
  pointerId: number | null;
  intent: "none" | "pending" | "horizontal" | "vertical";
  startX: number;
  startY: number;
  startProgress: number;
  lastX: number;
  lastTime: number;
  velocity: number;
}

export function VanKhoCoverFlowHero({
  products,
  activeCourseIndex,
  onActiveIndexChange,
  onOpenCourseDrawer,
}: VanKhoCoverFlowHeroProps) {
  const dispatch = useAppDispatch();
  const totalCourses = products.length;
  const metas = useMemo(
    () => products.map((p, idx) => getCourseArchivalMeta(p, idx)),
    [products]
  );

  const safeIndex = Math.max(
    0,
    Math.min(
      Math.max(0, totalCourses - 1),
      Math.round(clampProgress(activeCourseIndex, totalCourses, false))
    )
  );

  const [isFlipped3D, setIsFlipped3D] = useState(false);
  const [heroEdition, setHeroEdition] =
    useState<BookEditionFormat>("hardcover");
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visualProgress, setVisualProgress] = useState<number>(safeIndex);
  const [isDraggingStage, setIsDraggingStage] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const currentProgressRef = useRef<number>(safeIndex);
  const targetProgressRef = useRef<number>(safeIndex);
  const isDraggingRef = useRef<boolean>(false);
  const isScrubbingRef = useRef<boolean>(false);
  const wasDraggingRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const wheelSettleTimerRef = useRef<number | null>(null);
  const dragClickResetTimerRef = useRef<number | null>(null);

  const isCompactRef = useRef<boolean>(false);
  const reducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqCompact = window.matchMedia("(max-width: 767px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setIsCompactViewport(mqCompact.matches);
      setReducedMotion(mqMotion.matches);
      isCompactRef.current = mqCompact.matches;
      reducedMotionRef.current = mqMotion.matches;
    };
    sync();

    mqCompact.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqCompact.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  const dragStateRef = useRef<StageDragState>({
    active: false,
    pointerId: null,
    intent: "none",
    startX: 0,
    startY: 0,
    startProgress: safeIndex,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const cancelAnimationLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    lastFrameTimeRef.current = null;
  }, []);

  const scheduleAnimation = useCallback(() => {
    if (reducedMotionRef.current) {
      cancelAnimationLoop();
      const snapped = clampProgress(
        targetProgressRef.current,
        totalCourses,
        isDraggingRef.current
      );
      currentProgressRef.current = snapped;
      setVisualProgress(snapped);
      return;
    }

    if (rafIdRef.current !== null) return;
    lastFrameTimeRef.current = null;

    const tick = (timestamp: number) => {
      const prevTime = lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      const dt =
        prevTime === null
          ? 1 / 60
          : Math.min(0.05, Math.max(0.001, (timestamp - prevTime) / 1000));

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (!Number.isFinite(diff)) {
        const fallback = clampProgress(safeIndex, totalCourses, false);
        currentProgressRef.current = fallback;
        targetProgressRef.current = fallback;
        setVisualProgress(fallback);
        rafIdRef.current = null;
        lastFrameTimeRef.current = null;
        return;
      }

      if (
        !isDraggingRef.current &&
        !isScrubbingRef.current &&
        Math.abs(diff) < 0.0008
      ) {
        const settled = clampProgress(target, totalCourses, false);
        currentProgressRef.current = settled;
        setVisualProgress(settled);
        rafIdRef.current = null;
        lastFrameTimeRef.current = null;
        return;
      }

      const lambda = isDraggingRef.current
        ? 32
        : isScrubbingRef.current
        ? 18
        : 11;
      const alpha = 1 - Math.exp(-lambda * dt);
      const rawNext = current + diff * alpha;
      const maxOverscroll = 0.35;
      const safeNext = Number.isFinite(rawNext)
        ? Math.max(
            -maxOverscroll,
            Math.min(totalCourses - 1 + maxOverscroll, rawNext)
          )
        : 0;

      currentProgressRef.current = safeNext;
      setVisualProgress(safeNext);
      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    rafIdRef.current = window.requestAnimationFrame(tick);
  }, [cancelAnimationLoop, safeIndex, totalCourses]);

  useEffect(() => {
    if (isDraggingRef.current || isScrubbingRef.current) return;
    targetProgressRef.current = safeIndex;
    scheduleAnimation();
  }, [safeIndex, scheduleAnimation]);

  useEffect(() => {
    return () => {
      cancelAnimationLoop();
      if (wheelSettleTimerRef.current !== null) {
        window.clearTimeout(wheelSettleTimerRef.current);
      }
      if (dragClickResetTimerRef.current !== null) {
        window.clearTimeout(dragClickResetTimerRef.current);
      }
    };
  }, [cancelAnimationLoop]);

  const navigateToIndex = useCallback(
    (nextIndex: number) => {
      if (totalCourses <= 0) return;
      const clamped = Math.max(0, Math.min(totalCourses - 1, Math.round(nextIndex)));
      isDraggingRef.current = false;
      isScrubbingRef.current = false;
      targetProgressRef.current = clamped;
      onActiveIndexChange(clamped);
      scheduleAnimation();
    },
    [onActiveIndexChange, scheduleAnimation, totalCourses]
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el || totalCourses <= 1) return;

    const handleWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX <= absY || absX < 4) return;

      event.preventDefault();
      isScrubbingRef.current = true;
      const step = event.deltaX / 220;
      const nextTarget = clampProgress(
        targetProgressRef.current + step,
        totalCourses,
        true
      );
      targetProgressRef.current = nextTarget;
      scheduleAnimation();

      if (wheelSettleTimerRef.current !== null) {
        window.clearTimeout(wheelSettleTimerRef.current);
      }
      wheelSettleTimerRef.current = window.setTimeout(() => {
        isScrubbingRef.current = false;
        const snapped = snapProgress(targetProgressRef.current, totalCourses, 0);
        targetProgressRef.current = snapped;
        onActiveIndexChange(snapped);
        scheduleAnimation();
      }, 140);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [onActiveIndexChange, scheduleAnimation, totalCourses]);

  const handleStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (totalCourses <= 1) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const now = performance.now();
    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      intent: "pending",
      startX: event.clientX,
      startY: event.clientY,
      startProgress: currentProgressRef.current,
      lastX: event.clientX,
      lastTime: now,
      velocity: 0,
    };
    wasDraggingRef.current = false;
  };

  const handleStagePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current;
    if (!ds.active || ds.pointerId !== event.pointerId) return;

    const dx = event.clientX - ds.startX;
    const dy = event.clientY - ds.startY;

    if (ds.intent === "pending") {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dx) >= Math.abs(dy)) {
        ds.intent = "horizontal";
        isDraggingRef.current = true;
        wasDraggingRef.current = true;
        setIsDraggingStage(true);
        setIsFlipped3D(false);
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // ignore
        }
      } else {
        ds.intent = "vertical";
        ds.active = false;
        return;
      }
    }

    if (ds.intent !== "horizontal") return;

    const now = performance.now();
    const dtMs = Math.max(1, now - ds.lastTime);
    const dragDivisor = isCompactRef.current ? 165 : 220;
    const instantVel = -(event.clientX - ds.lastX) / dragDivisor / (dtMs / 16.67);
    ds.velocity = ds.velocity * 0.65 + instantVel * 0.35;
    ds.lastX = event.clientX;
    ds.lastTime = now;

    const nextProgress = clampProgress(
      ds.startProgress - dx / dragDivisor,
      totalCourses,
      true
    );
    targetProgressRef.current = nextProgress;
    scheduleAnimation();
  };

  const finishStageDrag = (event: PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current;
    if (!ds.active || ds.pointerId !== event.pointerId) return;

    if (
      ds.intent === "horizontal" &&
      typeof event.currentTarget.hasPointerCapture === "function" &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const wasHorizontal = ds.intent === "horizontal";
    const finalVelocity = ds.velocity;

    ds.active = false;
    ds.pointerId = null;
    ds.intent = "none";
    isDraggingRef.current = false;
    setIsDraggingStage(false);

    if (wasHorizontal) {
      const snapped = snapProgress(
        targetProgressRef.current,
        totalCourses,
        finalVelocity
      );
      targetProgressRef.current = snapped;
      onActiveIndexChange(snapped);
      scheduleAnimation();

      if (dragClickResetTimerRef.current !== null) {
        window.clearTimeout(dragClickResetTimerRef.current);
      }
      dragClickResetTimerRef.current = window.setTimeout(() => {
        wasDraggingRef.current = false;
      }, 90);
    }
  };

  const handleScrubStart = () => {
    isScrubbingRef.current = true;
    setIsFlipped3D(false);
  };

  const handleScrubMove = (nextProgress: number) => {
    targetProgressRef.current = clampProgress(nextProgress, totalCourses, false);
    scheduleAnimation();
  };

  const handleScrubEnd = (finalIndex: number) => {
    isScrubbingRef.current = false;
    navigateToIndex(finalIndex);
  };

  const handleSectionKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateToIndex(displayIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateToIndex(displayIndex - 1);
    }
  };

  const clampedDisplayProgress = clampProgress(
    visualProgress,
    totalCourses,
    false
  );
  const displayIndex =
    totalCourses > 0
      ? Math.max(
          0,
          Math.min(totalCourses - 1, Math.round(clampedDisplayProgress))
        )
      : 0;

  useEffect(() => {
    setIsFlipped3D(false);
  }, [displayIndex]);

  if (totalCourses === 0) return null;

  const activeBook = products[displayIndex] ?? products[0];
  const activeMeta = metas[displayIndex] ?? metas[0];
  const editions = resolveBookEditions(activeBook);
  const effectiveHeroEdition: BookEditionFormat =
    editions[heroEdition].stock > 0
      ? heroEdition
      : heroEdition === "hardcover"
      ? "paperback"
      : "hardcover";
  const activeEditionObj = editions[effectiveHeroEdition];
  const isOutOfStock =
    editions.paperback.stock <= 0 && editions.hardcover.stock <= 0;
  const isFirst = displayIndex === 0;
  const isLast = displayIndex === totalCourses - 1;

  const handleQuickAddActiveBook = () => {
    if (isOutOfStock) return;
    dispatch(
      addToCart({
        bookId: String(activeBook.id),
        edition: effectiveHeroEdition,
        quantity: 1,
        maxStock: activeEditionObj.stock,
        openDrawer: true,
      })
    );
  };

  return (
    <section
      id="hero-archive"
      aria-label="Kệ sách Hán Ngữ 3D CoverFlow"
      onKeyDown={handleSectionKeyDown}
      className="relative overflow-x-clip bg-(--vk-paper) pt-7 pb-10 sm:pt-9 sm:pb-12"
    >
      {/* Subtle archival paper grain */}
      <div
        aria-hidden="true"
        className="vankho-paper-grain pointer-events-none absolute inset-0 opacity-85"
      />

      {/* Warm Amber Spotlight synced to active volume */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-colors duration-700 ease-out"
        style={{
          backgroundColor: activeMeta.accentHex,
          opacity: 0.12,
          maskImage:
            "radial-gradient(ellipse 68% 58% at 50% 42%, black 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 68% 58% at 50% 42%, black 0%, transparent 72%)",
        }}
      />

      {/* Vertical Chinese Calligraphy Watermarks on lg+ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[43%] left-5 hidden -translate-y-1/2 select-none lg:flex xl:left-10"
      >
        <span className="vankho-writing-vertical font-hanzi text-3xl font-normal tracking-[0.38em] text-(--vk-watermark)/25 xl:text-4xl">
          書香致遠
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[43%] right-5 hidden -translate-y-1/2 select-none lg:flex xl:right-10"
      >
        <span className="vankho-writing-vertical font-hanzi text-3xl font-normal tracking-[0.38em] text-(--vk-watermark)/25 xl:text-4xl">
          漢語文庫藏書
        </span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* Compact Archival Eyebrow */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2.5 px-4 vankho-mono text-[11px] tracking-[0.18em] uppercase text-(--vk-muted) tabular-nums sm:mb-6">
          <span className="font-semibold text-(--vk-brass)">
            Nhà Sách &amp; Học Liệu Tiếng Trung · HANZI
          </span>
          <span aria-hidden="true" className="h-px w-4 bg-(--vk-border-strong)" />
          <span>{totalCourses} Ấn Phẩm Chọn Lọc · Bìa Mềm &amp; Bìa Cứng Khâu Chỉ</span>
        </div>

        {/* 3D CoverFlow Stage */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Kệ sách 3D CoverFlow — kéo ngang hoặc dùng phím mũi tên trái phải để lật ấn phẩm"
          onPointerDown={handleStagePointerDown}
          onPointerMove={handleStagePointerMove}
          onPointerUp={finishStageDrag}
          onPointerCancel={finishStageDrag}
          style={{ perspective: isCompactViewport ? "960px" : "1400px" }}
          className={`relative flex h-[336px] w-full touch-pan-y select-none items-center justify-center rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--vk-primary) sm:h-[378px] md:h-[408px] lg:h-[422px] ${
            isDraggingStage ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Grounding floor shadow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-1/2 h-6 w-52 -translate-x-1/2 rounded-full bg-amber-950/20 blur-xl sm:bottom-4 sm:w-64"
          />

          <div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {products.map((book, idx) => {
              if (Math.abs(idx - clampedDisplayProgress) > 5) {
                return null;
              }
              const cardStyle = computeCoverFlowStyle(
                idx,
                visualProgress,
                isCompactViewport,
                reducedMotion
              );
              const isActive = idx === displayIndex;
              const isNearCenter = Math.abs(idx - displayIndex) <= 2;

              return (
                <CourseSleeve3D
                  key={book.id}
                  product={book}
                  meta={metas[idx]}
                  index={idx}
                  total={totalCourses}
                  cardStyle={cardStyle}
                  isActive={isActive}
                  isNearCenter={isNearCenter}
                  edition={heroEdition}
                  isFlippedOpen={isActive && isFlipped3D}
                  onSelect={() => {
                    if (wasDraggingRef.current) return;
                    navigateToIndex(idx);
                  }}
                  onQuickTrial={() => {
                    if (wasDraggingRef.current) return;
                    onOpenCourseDrawer(book.id, "trial");
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Centered Editorial Book Metadata */}
        <div className="mx-auto mt-5 flex w-full max-w-3xl flex-col items-center px-4 text-center sm:mt-6">
          <span
            aria-hidden="true"
            className="h-[2px] w-10 rounded-full transition-colors duration-500"
            style={{ backgroundColor: activeMeta.accentHex }}
          />

          <p className="mt-3 vankho-mono text-[11px] uppercase tracking-[0.18em] text-(--vk-brass) tabular-nums">
            Ấn phẩm {activeMeta.volumeCode} / {String(totalCourses).padStart(2, "0")} ·{" "}
            {activeBook.categoryName || activeBook.level || "Tàng Thư Hán Ngữ"}
          </p>

          <h1 className="mt-1.5 max-w-2xl vankho-serif text-2xl font-medium leading-tight tracking-tight text-(--vk-fg) text-balance sm:text-4xl">
            {activeBook.name}
          </h1>

          <p className="mt-1.5 text-sm text-(--vk-muted)">
            <span>{activeBook.author || "Ban Biên Tập HANZI"}</span>
            <span className="mx-2 opacity-50">·</span>
            <span className="font-hanzi">{activeMeta.chineseSubtitle}</span>
          </p>

          {/* Interactive Edition Visual Switcher on Hero */}
          <div
            role="group"
            aria-label="Xem trước bìa mềm hoặc bìa cứng vải bố"
            className="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) p-1 vankho-mono text-xs tabular-nums"
          >
            {(["paperback", "hardcover"] as const).map((fmt) => {
              const chosen = heroEdition === fmt;
              const ed = editions[fmt];
              return (
                <button
                  key={fmt}
                  type="button"
                  aria-pressed={chosen}
                  onClick={() => setHeroEdition(fmt)}
                  className={`min-h-[34px] cursor-pointer rounded-lg px-3 py-1 transition-colors ${
                    chosen
                      ? "bg-(--vk-primary) font-semibold text-(--vk-primary-fg)"
                      : "text-(--vk-muted) hover:text-(--vk-fg)"
                  }`}
                >
                  {fmt === "paperback" ? "Bìa mềm" : "Bìa cứng vải bố"} ·{" "}
                  {formatVnd(ed.price)}
                </button>
              );
            })}
          </div>

          {/* Action Row: Prev | Lật bìa 3D | Đọc thử 10 trang | Thêm vào giỏ | Next */}
          <div className="mt-4 grid w-full max-w-[380px] grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 sm:mt-5 sm:flex sm:w-auto sm:max-w-none sm:flex-nowrap sm:items-center sm:justify-center sm:gap-2.5">
            <button
              type="button"
              onClick={() => navigateToIndex(displayIndex - 1)}
              disabled={isFirst}
              aria-label="Ấn phẩm trước"
              className="inline-flex min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover) disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-2">
              <button
                type="button"
                onClick={() => onOpenCourseDrawer(activeBook.id, "trial")}
                className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-4 text-sm font-semibold text-(--vk-fg) transition-colors hover:border-(--vk-primary) hover:bg-(--vk-btn-hover) sm:w-auto"
              >
                <BookOpen
                  className="size-4 shrink-0 text-(--vk-brass)"
                  aria-hidden="true"
                />
                <span>Mở sách đọc thử 3D</span>
              </button>

              <button
                type="button"
                onClick={handleQuickAddActiveBook}
                disabled={isOutOfStock}
                className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-(--vk-primary) px-4 text-sm font-semibold text-(--vk-primary-fg) transition-colors hover:bg-(--vk-primary-hover) disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <ShoppingBag className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  {isOutOfStock
                    ? "Tạm hết hàng"
                    : `Thêm vào giỏ · ${formatVnd(activeEditionObj.price)}`}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigateToIndex(displayIndex + 1)}
              disabled={isLast}
              aria-label="Ấn phẩm tiếp theo"
              className="inline-flex min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) transition-colors hover:bg-(--vk-btn-hover) disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Chronological / Volume Timeline Scrubber */}
        <div className="mx-auto mt-7 w-full max-w-3xl px-4 sm:mt-9 sm:px-6">
          <CourseTimelineScrubber
            products={products}
            metas={metas}
            progress={clampedDisplayProgress}
            activeIndex={displayIndex}
            onScrubStart={handleScrubStart}
            onScrubMove={handleScrubMove}
            onScrubEnd={handleScrubEnd}
            onSelectIndex={navigateToIndex}
          />
        </div>
      </div>
    </section>
  );
}
