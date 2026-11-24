"use client";

import React, {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { IProduct } from "@/interfaces/product";
import {
  clampProgress,
  CourseArchivalMeta,
} from "./vankho-data";

export interface CourseTimelineScrubberProps {
  products: readonly IProduct[];
  metas: readonly CourseArchivalMeta[];
  progress: number;
  activeIndex: number;
  onScrubStart?: () => void;
  onScrubMove: (nextProgress: number) => void;
  onScrubEnd: (finalIndex: number) => void;
  onSelectIndex: (index: number) => void;
}

export function CourseTimelineScrubber({
  products,
  metas,
  progress,
  activeIndex,
  onScrubStart,
  onScrubMove,
  onScrubEnd,
  onSelectIndex,
}: CourseTimelineScrubberProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isScrubbingRef = useRef(false);
  const latestProgressRef = useRef(progress);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const count = products.length;
  if (count === 0) return null;

  const maxIndex = Math.max(0, count - 1);
  const safeProgress = clampProgress(progress, count, false);
  const safeActiveIndex = Math.max(0, Math.min(maxIndex, Math.round(activeIndex)));
  const activeProduct = products[safeActiveIndex] ?? products[0];
  const activeMeta = metas[safeActiveIndex] ?? metas[0];
  const firstLabel = metas[0]?.shortTimelineTag ?? "Quyển 01";
  const lastLabel = metas[maxIndex]?.shortTimelineTag ?? `Quyển ${count}`;
  const ratio = maxIndex > 0 ? safeProgress / maxIndex : 0;
  const percent = ratio * 100;

  const progressFromClientX = (clientX: number): number => {
    const track = trackRef.current;
    if (!track || maxIndex <= 0) return 0;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return safeActiveIndex;
    const normalized = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return normalized * maxIndex;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus();
    if (typeof event.currentTarget.setPointerCapture === "function") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // ignore synthetic capture error
      }
    }

    const nextProgress = progressFromClientX(event.clientX);
    isScrubbingRef.current = true;
    latestProgressRef.current = nextProgress;
    setIsScrubbing(true);
    onScrubStart?.();
    onScrubMove(nextProgress);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;
    const nextProgress = progressFromClientX(event.clientX);
    latestProgressRef.current = nextProgress;
    onScrubMove(nextProgress);
  };

  const finishScrub = (event: PointerEvent<HTMLDivElement>) => {
    if (!isScrubbingRef.current) return;
    if (
      typeof event.currentTarget.hasPointerCapture === "function" &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    isScrubbingRef.current = false;
    setIsScrubbing(false);

    const finalIndex = Math.max(
      0,
      Math.min(maxIndex, Math.round(clampProgress(latestProgressRef.current, count, false)))
    );
    onScrubEnd(finalIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextIndex = Math.min(maxIndex, safeActiveIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextIndex = Math.max(0, safeActiveIndex - 1);
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = maxIndex;
    } else {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    onSelectIndex(nextIndex);
  };

  return (
    <div className="w-full select-none">
      {/* Floating Active Course Level Readout */}
      <div className="relative mb-1.5 h-6 w-full" aria-hidden="true">
        <div
          className="absolute top-0 inline-flex items-center gap-1.5 rounded-full border border-(--vk-border) bg-(--vk-surface)/92 px-2.5 py-0.5 vankho-mono text-[11px] font-medium tracking-[0.12em] text-(--vk-fg) tabular-nums shadow-2xs"
          style={{
            left: `${percent}%`,
            transform: `translateX(-${percent}%)`,
          }}
        >
          <span
            className="inline-block size-1.5 rounded-full"
            style={{ backgroundColor: activeMeta?.accentHex || "#D97706" }}
          />
          <span className="whitespace-nowrap">
            {activeMeta?.shortTimelineTag}
          </span>
        </div>
      </div>

      {/* Slider Ruler Track */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Thanh kéo kệ sách Hán Ngữ 3D"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={maxIndex}
        aria-valuenow={safeActiveIndex}
        aria-valuetext={`${activeMeta?.shortTimelineTag} — ${activeProduct.name}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishScrub}
        onPointerCancel={finishScrub}
        onKeyDown={handleKeyDown}
        className={`group relative flex min-h-[44px] w-full touch-none items-center rounded-lg transition-colors hover:bg-(--vk-fg)/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--vk-primary) ${
          isScrubbing ? "cursor-grabbing" : "cursor-pointer"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none relative h-px w-full bg-(--vk-border-strong)"
        >
          <div
            className="absolute inset-y-0 left-0 bg-(--vk-primary)/65"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Ticks & Needle */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {products.map((prod, idx) => {
            const tickPercent = maxIndex > 0 ? (idx / maxIndex) * 100 : 0;
            const isCurrent = idx === safeActiveIndex;
            const isPast = idx <= safeActiveIndex;

            return (
              <div key={prod.id}>
                <span
                  className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
                    isCurrent
                      ? "h-5 w-[2px] bg-(--vk-primary)"
                      : isPast
                      ? "h-3 w-px bg-(--vk-fg)/45"
                      : "h-2.5 w-px bg-(--vk-border-strong)"
                  }`}
                  style={{ left: `${tickPercent}%` }}
                />
                {idx < maxIndex && count <= 12 && (
                  <>
                    <span
                      className="absolute top-1/2 hidden h-1.5 w-px -translate-x-1/2 -translate-y-1/2 bg-(--vk-border-strong)/60 sm:block"
                      style={{ left: `${((idx + 0.333) / maxIndex) * 100}%` }}
                    />
                    <span
                      className="absolute top-1/2 hidden h-1.5 w-px -translate-x-1/2 -translate-y-1/2 bg-(--vk-border-strong)/60 sm:block"
                      style={{ left: `${((idx + 0.666) / maxIndex) * 100}%` }}
                    />
                  </>
                )}
              </div>
            );
          })}

          <div
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ${
              isScrubbing ? "scale-115" : "scale-100 group-hover:scale-110"
            }`}
            style={{ left: `${percent}%` }}
          >
            <div className="flex flex-col items-center">
              <span className="h-6 w-[2px] rounded-full bg-(--vk-primary)" />
              <span className="mt-0.5 size-2 rounded-full border border-(--vk-paper) bg-(--vk-primary)" />
            </div>
          </div>
        </div>
      </div>

      {/* Boundary Labels */}
      <div className="mt-0.5 flex items-center justify-between vankho-mono text-[11px] tracking-[0.14em] text-(--vk-muted) tabular-nums">
        <span>{firstLabel}</span>
        <span>
          ẤN PHẨM {String(safeActiveIndex + 1).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </span>
        <span>{lastLabel}</span>
      </div>
    </div>
  );
}
