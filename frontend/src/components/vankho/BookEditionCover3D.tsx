"use client";

import React from "react";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { CourseArchivalMeta } from "./vankho-data";

export interface BookEditionCover3DProps {
  product: IProduct;
  meta: CourseArchivalMeta;
  edition: BookEditionFormat;
  size?: "sm" | "md" | "lg";
  showCaptionBadge?: boolean;
}

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "w-[118px] sm:w-[132px]",
  md: "w-[152px] sm:w-[168px]",
  lg: "w-[196px] sm:w-[228px]",
};

export function BookEditionCover3D({
  product,
  meta,
  edition,
  size = "md",
  showCaptionBadge = true,
}: BookEditionCover3DProps) {
  const isHardcover = edition === "hardcover";
  const widthClass = SIZE_CLASSES[size];

  return (
    <div className="flex flex-col items-center">
      <div className="book3d-perspective relative block">
        {/* Ground Shadow (deeper & wider for thick hardcover) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full blur-md transition-all duration-500 ${
            isHardcover
              ? "h-4.5 w-[88%] bg-black/45 group-hover:w-[94%]"
              : "h-3.5 w-[78%] bg-black/28 group-hover:w-[84%]"
          }`}
        />

        {/* 3D Book Body */}
        <div
          className={`book3d-preserve relative aspect-[2/3] ${widthClass} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isHardcover
              ? "[transform:rotateY(-14deg)_rotateX(2.5deg)_scale(1.02)] group-hover:[transform:translateY(-5px)_rotateY(-7deg)_rotateX(1.5deg)_scale(1.03)]"
              : "[transform:rotateY(-8deg)_rotateX(1.5deg)] group-hover:[transform:translateY(-4px)_rotateY(-4deg)_rotateX(1deg)]"
          }`}
        >
          {/* Back Board (Thick overhanging cloth board for Hardcover vs Flush card for Paperback) */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute transition-all duration-500 ${
              isHardcover
                ? "-inset-y-[2px] left-0 -right-[3px] rounded-r-[6px] rounded-l-[2px] border border-amber-200/25 shadow-[0_22px_36px_-12px_rgba(15,12,10,0.58)]"
                : "inset-0 rounded-r-[4px] rounded-l-[2px] border border-stone-400/45 shadow-[0_14px_24px_-12px_rgba(28,25,23,0.34)]"
            }`}
            style={{
              backgroundColor: isHardcover ? meta.spineColor : "#dfd6c5",
              transform: isHardcover ? "translateZ(-12px)" : "translateZ(-5px)",
            }}
          />

          {/* Crimson Silk Bookmark Ribbon — Exclusive to Cloth Hardcover */}
          {isHardcover && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[10px] right-[24%] h-3.5 w-2.5 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(180deg, #7f1d1d 0%, #dc2626 62%, #991b1b 100%)",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)",
                transform: "translateZ(-6px) rotateZ(3deg)",
              }}
            />
          )}

          {/* Right Paper Block Striations (Thick 11px sewn block vs Slim 6px glued block) */}
          <div
            aria-hidden="true"
            className={`book3d-page-edges pointer-events-none absolute rounded-r-[2px] transition-all duration-500 ${
              isHardcover
                ? "top-[3px] -right-[3px] h-[calc(100%-6px)] w-[11px]"
                : "top-[1px] -right-[1px] h-[calc(100%-2px)] w-[6px]"
            }`}
            style={{
              transformOrigin: "right center",
              transform: "translateZ(-1px) rotateY(75deg)",
            }}
          />

          {/* Left Spine Strip */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 rounded-l-[2px] transition-all duration-500"
            style={{
              width: isHardcover ? "12px" : "6px",
              background: isHardcover
                ? `linear-gradient(90deg, #120e0b 0%, ${meta.spineColor} 55%, #1c1612 100%)`
                : `linear-gradient(90deg, ${meta.accentHex} 0%, #d6cbb8 100%)`,
              transformOrigin: "left center",
              transform: "rotateY(-82deg)",
            }}
          />

          {/* =============================================================== */}
          {/* FRONT COVER FACE: HARDCOVER CLOTH 24K vs PAPERBACK IVORY + OBI  */}
          {/* =============================================================== */}
          {isHardcover ? (
            <div
              className="book3d-face absolute inset-0 overflow-hidden rounded-r-[6px] rounded-l-[2px] border border-amber-300/35"
              style={{
                backgroundColor: meta.spineColor,
                transform: "translateZ(1px)",
              }}
            >
              <img
                src={meta.bookCoverImage}
                alt={`Bìa cứng vải bố — ${product.name}`}
                loading="lazy"
                className="h-full w-full object-cover select-none"
              />
              {/* Woven Cloth Texture + Gold Glint + Deep Spine Groove */}
              <div
                aria-hidden="true"
                className="vankho-cloth-weave pointer-events-none absolute inset-0 opacity-35"
              />
              <div
                aria-hidden="true"
                className="vankho-cover-glare pointer-events-none absolute inset-0"
              />
              <div
                aria-hidden="true"
                className="vankho-spine-sheen pointer-events-none absolute inset-0"
              />
              {/* Collector 24K Corner Foil Badge */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 right-2 rounded border border-amber-300/70 bg-stone-950/80 px-1.5 py-0.5 vankho-mono text-[8px] font-bold tracking-wider text-amber-300 shadow"
              >
                NHŨ 24K
              </span>
            </div>
          ) : (
            <div
              className="book3d-face vankho-paper-grain absolute inset-0 flex flex-col justify-between overflow-hidden rounded-r-[4px] rounded-l-[2px] border border-stone-300 bg-[#FCF9F2] text-[#1C1917]"
              style={{
                transform: "translateZ(1px)",
              }}
            >
              {/* Paperback Glued Spine Crease Line */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-[6px] z-20 w-px bg-stone-900/12"
              />

              {/* Top Colored Publisher Strip */}
              <div
                className="relative z-10 flex items-center justify-between px-2.5 py-1 text-white"
                style={{ backgroundColor: meta.accentHex }}
              >
                <span className="inline-flex items-center gap-1 vankho-mono text-[8px] font-bold tracking-wider uppercase">
                  <span className="font-hanzi text-[9px]">字</span>
                  <span>HANZI</span>
                </span>
                <span className="vankho-mono text-[7.5px] tracking-wider uppercase opacity-95">
                  BÌA MỀM
                </span>
              </div>

              {/* Editorial Ivory Cover Body */}
              <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-2.5 pt-2 pb-1 text-center">
                <div className="w-full">
                  <p className="truncate font-hanzi text-[8.5px] tracking-widest text-stone-500">
                    {meta.chineseSubtitle}
                  </p>
                  <p
                    className={`mt-0.5 line-clamp-2 vankho-serif font-semibold leading-tight text-stone-900 ${
                      size === "lg"
                        ? "text-sm"
                        : size === "sm"
                        ? "text-[10px]"
                        : "text-[11px]"
                    }`}
                  >
                    {product.name}
                  </p>
                </div>

                {/* Framed Artwork Vignette Window */}
                <div className="relative my-1.5 h-[44%] w-[78%] overflow-hidden rounded-[3px] border border-stone-300/90 bg-stone-900 shadow-inner">
                  <img
                    src={meta.bookCoverImage}
                    alt={`Bìa mềm — ${product.name}`}
                    loading="lazy"
                    className="h-full w-full scale-115 object-cover object-center opacity-95 select-none"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-1 border border-amber-200/35"
                  />
                </div>

                <p className="w-full truncate vankho-mono text-[7.5px] uppercase tracking-wider text-stone-500">
                  {product.pages || 248} trang · Giấy kem 100gsm
                </p>
              </div>

              {/* Wrap-Around Printed Paper Belly-Band (Đai Sách Obi) */}
              <div
                className="relative z-10 flex items-center justify-between gap-1.5 border-t-2 border-amber-300/75 px-2.5 py-1.5 text-[#FAF7F0]"
                style={{ backgroundColor: meta.spineColor }}
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-[2px] border border-amber-300/60 bg-red-800/90 font-hanzi text-[9px] font-bold text-amber-100">
                    {meta.sealChar}
                  </span>
                  <div className="min-w-0 text-left leading-none">
                    <span className="block truncate vankho-mono text-[7.5px] font-bold uppercase tracking-wider text-amber-200">
                      ĐAI SÁCH · QR AUDIO
                    </span>
                    <span className="mt-0.5 block truncate text-[7px] text-stone-200/90">
                      Bản học tập gọn nhẹ
                    </span>
                  </div>
                </div>

                {/* Mini Printed Barcode Motif on Obi */}
                <div
                  aria-hidden="true"
                  className="flex h-3.5 shrink-0 items-stretch gap-[1px] rounded-[1px] bg-white/95 px-1 py-0.5"
                >
                  <span className="w-[1.5px] bg-stone-900" />
                  <span className="w-[1px] bg-stone-900" />
                  <span className="w-[2px] bg-stone-900" />
                  <span className="w-[1px] bg-stone-900" />
                  <span className="w-[1.5px] bg-stone-900" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Visual Mode Indicator Pill Below Pedestal */}
      {showCaptionBadge && (
        <span
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 vankho-mono text-[10px] font-medium transition-colors ${
            isHardcover
              ? "border-amber-600/35 bg-amber-500/12 text-(--vk-brass)"
              : "border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-muted)"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              isHardcover ? "bg-amber-600" : "bg-stone-400"
            }`}
          />
          <span>
            {isHardcover
              ? "Bìa cứng vải bố · Nhũ 24K"
              : "Bìa mềm giấy mỹ thuật · Có đai sách"}
          </span>
        </span>
      )}
    </div>
  );
}
