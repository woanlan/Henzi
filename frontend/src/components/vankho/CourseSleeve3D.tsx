"use client";

import React, { useEffect, useMemo, useState, type CSSProperties } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { audioEngine } from "@/lib/audio";
import { buildBookFiveSpreads } from "./book-preview-pages";
import {
  CourseArchivalMeta,
  CoverFlowCardStyle,
} from "./vankho-data";

export interface CourseSleeve3DProps {
  product: IProduct;
  meta: CourseArchivalMeta;
  index: number;
  total: number;
  cardStyle: CoverFlowCardStyle;
  isActive: boolean;
  isNearCenter: boolean;
  edition?: BookEditionFormat;
  isFlippedOpen?: boolean;
  onSelect: () => void;
  onQuickTrial: () => void;
}

export function CourseSleeve3D({
  product,
  meta,
  index,
  total,
  cardStyle,
  isActive,
  edition = "hardcover",
  isFlippedOpen = false,
  onSelect,
  onQuickTrial,
}: CourseSleeve3DProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);
  const [heroPageIdx, setHeroPageIdx] = useState(0);

  useEffect(() => {
    setImageFailed(false);
    setHeroPageIdx(0);
  }, [meta.bookCoverImage, product.id]);

  const open3D = isActive && isFlippedOpen;
  const effectiveEdition: BookEditionFormat = isActive ? edition : "hardcover";
  const isHardcover = effectiveEdition === "hardcover";

  const pack = useMemo(
    () => (isActive ? buildBookFiveSpreads(product, meta) : null),
    [isActive, product, meta]
  );

  const wrapperStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: cardStyle.zIndex,
    opacity: cardStyle.opacity,
    transform: `translate3d(-50%, -50%, 0) translate3d(${cardStyle.translateX}px, 0px, ${cardStyle.translateZ}px) rotateY(${cardStyle.rotateY}deg) scale(${cardStyle.scale})`,
    filter: cardStyle.blur > 0.05 ? `blur(${cardStyle.blur}px)` : "none",
    willChange: cardStyle.isVisible ? "transform, opacity" : "auto",
    transformStyle: "preserve-3d",
  };

  const handleCoverActivate = () => {
    if (isActive) {
      onQuickTrial();
    } else {
      onSelect();
    }
  };

  const handleSpeakSample = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setSpeakingWord(text);
    audioEngine.speak(text, {
      rate: 0.9,
      onEnd: () => setSpeakingWord(null),
      onError: () => setSpeakingWord(null),
    });
  };

  const restingTransform = open3D
    ? "translateX(24%) rotateY(-10deg) rotateX(3deg)"
    : isActive
    ? isHardcover
      ? "translateX(0%) rotateY(-8deg) rotateX(1.5deg)"
      : "translateX(0%) rotateY(-5deg) rotateX(1deg)"
    : "translateX(0%)";

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} trên ${total}: ${product.name}`}
      aria-hidden={!cardStyle.isVisible}
      style={wrapperStyle}
      className={`absolute ${
        cardStyle.isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className="book3d-preserve group relative block aspect-[2/3] w-[204px] sm:w-[236px] md:w-[258px] lg:w-[272px] text-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: restingTransform }}
      >
        {/* Realistic Contact Shadow directly beneath bottom cover edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 left-2 right-1 h-4 rounded-full bg-black/45 blur-md transition-opacity duration-500"
          style={{
            transform: "translateZ(-10px)",
            opacity: isActive ? (isHardcover ? 0.88 : 0.62) : 0.55,
          }}
        />

        {/* Back Board (Thick overhanging cloth board vs Flush paperback back) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute transition-all duration-500 ${
            isHardcover
              ? "-inset-y-[1px] left-0 -right-[2px] rounded-r-[7px] rounded-l-[2px] border border-black/35"
              : "inset-0 rounded-r-[4px] rounded-l-[2px] border border-stone-400/50"
          }`}
          style={{
            backgroundColor: isHardcover ? meta.spineColor : "#ded5c4",
            transform: isHardcover ? "translateZ(-14px)" : "translateZ(-6px)",
            boxShadow: isActive
              ? "0 30px 58px -14px rgba(15, 12, 10, 0.62), 0 14px 24px -10px rgba(15, 12, 10, 0.42)"
              : "0 18px 34px -12px rgba(15, 12, 10, 0.45)",
          }}
        />

        {/* Silk Crimson Bookmark Ribbon — Exclusive to Hardcover */}
        {isHardcover && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[11px] right-[24%] h-3.5 w-2.5 shadow-sm"
            style={{
              background:
                "linear-gradient(180deg, #7f1d1d 0%, #dc2626 60%, #991b1b 100%)",
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)",
              transform: "translateZ(-6px) rotateZ(3deg)",
            }}
          />
        )}

        {/* ================================================================= */}
        {/* INTERIOR 5-PAGE MINI READER (Revealed when "Lật bìa 3D" opens)    */}
        {/* ================================================================= */}
        <div
          onPointerDown={(e) => {
            if (open3D) e.stopPropagation();
          }}
          className="absolute inset-y-[3px] left-[2px] right-[2px] flex flex-col justify-between overflow-hidden rounded-r-[5px] rounded-l-[1px] border border-black/15 p-3.5 sm:p-4"
          style={{
            backgroundColor: "#FBF7EE",
            color: "#1C1917",
            transform: "translateZ(-1px)",
            boxShadow: "inset 14px 0 22px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Running Header + 5-Page Flipper */}
          <div className="flex items-center justify-between border-b border-amber-950/15 pb-1.5 vankho-mono text-[9.5px] uppercase tracking-wider text-[#786146]">
            <span>Trang 0{heroPageIdx + 1} / 05</span>
            {open3D && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={heroPageIdx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeroPageIdx((p) => Math.max(0, p - 1));
                  }}
                  aria-label="Trang trước trên bìa 3D"
                  className="inline-flex size-5 cursor-pointer items-center justify-center rounded border border-amber-900/25 bg-white text-[#1c1917] hover:bg-amber-700 hover:text-white disabled:opacity-35"
                >
                  <ChevronLeft className="size-3" />
                </button>
                <button
                  type="button"
                  disabled={heroPageIdx >= 4}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeroPageIdx((p) => Math.min(4, p + 1));
                  }}
                  aria-label="Lật trang tiếp theo trên bìa 3D"
                  className="inline-flex size-5 cursor-pointer items-center justify-center rounded border border-amber-900/25 bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-35"
                >
                  <ChevronRight className="size-3" />
                </button>
              </div>
            )}
          </div>

          {/* 5 Distinct Authentic Book Pages Inside the 3D Sleeve */}
          {pack && (
            <div className="my-auto space-y-2 py-1 text-left">
              {heroPageIdx === 0 && (
                <>
                  <p className="font-hanzi text-[11px] font-bold text-[#92400e]">
                    目录 · Mục Lục Trọng Tâm
                  </p>
                  <ul className="space-y-1.5 text-[10.5px]">
                    {pack.tocRows.slice(0, 4).map((r) => (
                      <li
                        key={r.code}
                        className="rounded bg-amber-900/[0.05] px-2 py-1"
                      >
                        <div className="flex justify-between font-semibold text-[#1c1917]">
                          <span>{r.code}</span>
                          <span className="vankho-mono text-[9.5px] text-[#92400e]">
                            tr.{r.pageNo}
                          </span>
                        </div>
                        <p className="line-clamp-1 text-[10px] text-[#574c3f]">
                          {r.vnTitle}
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {heroPageIdx === 1 && (
                <>
                  <p className="font-hanzi text-[11px] font-bold text-[#92400e]">
                    课文精读 · Bài Khóa Song Ngữ
                  </p>
                  {pack.dialogueTurns.slice(0, 2).map((t, i) => (
                    <div
                      key={i}
                      className="rounded border border-amber-950/12 bg-white/80 p-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-hanzi text-[11.5px] font-bold leading-snug text-[#1c1917]">
                          {t.zh}
                        </p>
                        {open3D && (
                          <button
                            type="button"
                            onClick={(e) => handleSpeakSample(e, t.zh)}
                            className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#92400e] hover:bg-amber-700/15"
                          >
                            <Volume2
                              className={`size-3 ${
                                speakingWord === t.zh ? "animate-pulse" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      <p className="vankho-mono text-[9.5px] text-[#92400e]">
                        {t.pinyin}
                      </p>
                      <p className="text-[10px] italic text-[#574c3f]">
                        {t.vn}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {heroPageIdx === 2 && (
                <>
                  <p className="font-hanzi text-[11px] font-bold text-[#92400e]">
                    重点生词 · Bảng Từ &amp; Ô Mễ Tự
                  </p>
                  <div className="space-y-1">
                    {pack.vocabTable.slice(0, 3).map((v, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-1.5 rounded bg-white/85 px-2 py-1 text-[10.5px]"
                      >
                        <div className="min-w-0">
                          <span className="font-hanzi text-xs font-bold text-[#1c1917]">
                            {v.hanzi}
                          </span>{" "}
                          <span className="vankho-mono text-[9.5px] text-[#92400e]">
                            [{v.pinyin}]
                          </span>
                          <p className="truncate text-[10px] text-[#443c34]">
                            {v.meaning}
                          </p>
                        </div>
                        {open3D && (
                          <button
                            type="button"
                            onClick={(e) => handleSpeakSample(e, v.hanzi)}
                            className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded border border-amber-900/20 text-[#92400e]"
                          >
                            <Volume2 className="size-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {heroPageIdx === 3 && (
                <>
                  <p className="font-hanzi text-[11px] font-bold text-[#92400e]">
                    语法辨析 · Công Thức &amp; Bắt Lỗi
                  </p>
                  <div className="rounded bg-amber-900/[0.07] p-2 text-[10px] font-semibold text-[#1c1917]">
                    {pack.grammar.formula}
                  </div>
                  <div className="rounded bg-red-950/[0.06] px-2 py-1 text-[10px] text-[#7f1d1d]">
                    {pack.grammar.wrongZh}
                  </div>
                  <div className="rounded bg-emerald-950/[0.06] px-2 py-1 text-[10px] text-[#14532d]">
                    <p className="font-hanzi font-bold">{pack.grammar.rightZh}</p>
                    <p className="italic">{pack.grammar.rightVn}</p>
                  </div>
                </>
              )}

              {heroPageIdx === 4 && (
                <>
                  <p className="font-hanzi text-[11px] font-bold text-[#92400e]">
                    课后自测 · Bài Tập Kiểm Tra
                  </p>
                  <div className="rounded border border-amber-950/15 bg-white/85 p-2 text-[10.5px] space-y-1.5">
                    <p className="font-hanzi font-bold text-[#1c1917]">
                      {pack.quiz.promptSentenceZh}
                    </p>
                    <p className="text-[10px] italic text-[#574c3f]">
                      “{pack.quiz.promptVn}”
                    </p>
                    <div className="grid grid-cols-3 gap-1 pt-0.5 text-center font-hanzi text-[10.5px] font-bold">
                      {pack.quiz.options.map((o, idx) => (
                        <span
                          key={o.label}
                          className={`rounded border py-0.5 ${
                            idx === pack.quiz.correctIndex
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                              : "border-amber-900/20 bg-[#FAF6EC]"
                          }`}
                        >
                          {o.label}.{o.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Running Footer inside Hero Sleeve */}
          <div className="flex items-center justify-between border-t border-amber-950/12 pt-1.5 vankho-mono text-[9.5px] text-[#786146]">
            <span className="truncate pr-1">
              {product.pages || 248} tr.
            </span>
            {open3D ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickTrial();
                }}
                className="shrink-0 cursor-pointer font-bold text-[#92400e] hover:underline"
              >
                Mở rộng 10 trang →
              </button>
            ) : (
              <span className="shrink-0 font-semibold text-[#92400e]">
                Đọc thử →
              </span>
            )}
          </div>
        </div>

        {/* Physical 3D Right Paper Block Thickness */}
        <div
          aria-hidden="true"
          className={`book3d-page-edges pointer-events-none absolute rounded-r-[2px] transition-all duration-500 ${
            isHardcover
              ? "top-[4px] -right-[4px] h-[calc(100%-8px)] w-[14px]"
              : "top-[1px] -right-[1px] h-[calc(100%-2px)] w-[7px]"
          }`}
          style={{
            transformOrigin: "right center",
            transform: "translateZ(-1px) rotateY(76deg)",
          }}
        />

        {/* Physical 3D Left Spine */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center overflow-hidden rounded-l-[3px] border-y border-l border-black/30"
          style={{
            width: isHardcover ? "18px" : "8px",
            background: isHardcover
              ? `linear-gradient(90deg, #120e0c 0%, ${meta.spineColor} 48%, #1f1915 100%)`
              : `linear-gradient(90deg, ${meta.accentHex} 0%, #dcd2be 100%)`,
            transformOrigin: "left center",
            transform: isHardcover
              ? "rotateY(-86deg) translateX(-14px)"
              : "rotateY(-86deg) translateX(-6px)",
          }}
        >
          {isHardcover && (
            <>
              <span className="absolute top-3 inset-x-0 h-[1.5px] bg-amber-300/45" />
              <span className="vankho-writing-vertical select-none vankho-mono text-[8px] tracking-[0.22em] uppercase text-amber-200/80">
                HANZI · {meta.volumeCode}
              </span>
              <span className="absolute bottom-3 inset-x-0 h-[1.5px] bg-amber-300/45" />
            </>
          )}
        </div>

        {/* Hinged Front Cover (Cloth 24K Hardcover vs Ivory Paperback + Obi) */}
        <button
          type="button"
          onClick={handleCoverActivate}
          aria-label={
            isActive
              ? `Mở đọc thử và xem ấn bản ${product.name}`
              : `Đưa cuốn ${product.name} ra giữa kệ sách`
          }
          style={{
            transform: open3D
              ? "translateZ(2px) rotateY(-158deg)"
              : "translateZ(2px) rotateY(0deg)",
          }}
          className={`book3d-preserve absolute inset-0 z-20 block h-full w-full origin-left cursor-pointer text-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--vk-primary) ${
            isHardcover
              ? "rounded-r-[7px] rounded-l-[2px]"
              : "rounded-r-[4px] rounded-l-[2px]"
          } ${open3D ? "pointer-events-none" : ""}`}
        >
          {isHardcover ? (
            <div
              className="book3d-face absolute inset-0 overflow-hidden rounded-r-[7px] rounded-l-[2px] border border-black/30"
              style={{ backgroundColor: meta.spineColor }}
            >
              {meta.isDedicatedBookCover && !imageFailed ? (
                <img
                  src={meta.bookCoverImage}
                  alt={`Bìa cứng — ${product.name}`}
                  loading={index <= 3 ? "eager" : "lazy"}
                  onError={() => setImageFailed(true)}
                  className="h-full w-full object-cover select-none"
                />
              ) : (
                <div
                  className="vankho-cloth-weave relative flex h-full w-full flex-col items-center justify-between p-4 text-center text-[#f5ecd7]"
                  style={{
                    background: `radial-gradient(circle at 50% 35%, ${meta.accentHex}38 0%, ${meta.spineColor} 78%)`,
                  }}
                >
                  <div className="pointer-events-none absolute inset-2.5 border border-amber-300/45" />
                  <div className="relative z-10 pt-3">
                    <p className="vankho-mono text-[9px] tracking-[0.22em] uppercase text-amber-300/85">
                      ẤN PHẨM {meta.volumeCode} · HANZI
                    </p>
                    <p className="mt-1.5 vankho-serif text-base font-semibold leading-snug text-amber-100 line-clamp-2 px-2">
                      {product.name}
                    </p>
                  </div>
                  <span className="font-hanzi text-4xl text-amber-300/80">
                    {meta.sealChar}
                  </span>
                  <div className="relative z-10 pb-2">
                    <p className="mt-1.5 vankho-mono text-[8px] tracking-[0.22em] uppercase text-amber-200/70">
                      HANZI PRESS
                    </p>
                  </div>
                </div>
              )}

              <div
                aria-hidden="true"
                className="vankho-cover-glare pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
              />
              <div
                aria-hidden="true"
                className="vankho-spine-sheen pointer-events-none absolute inset-0"
              />

              {isActive && !open3D && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-stone-950/85 px-3 py-1 vankho-mono text-[10px] font-semibold uppercase tracking-wider text-[#faf7f0] opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 translate-y-1"
                >
                  <BookOpen className="size-3 text-amber-400" aria-hidden="true" />
                  <span>Đọc thử 10 trang</span>
                </span>
              )}
            </div>
          ) : (
            /* DISTINCT PAPERBACK EDITION FRONT FACE ON HERO */
            <div className="book3d-face vankho-paper-grain absolute inset-0 flex flex-col justify-between overflow-hidden rounded-r-[4px] rounded-l-[2px] border border-stone-300 bg-[#FCF9F2] text-[#1C1917]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-[8px] z-20 w-px bg-stone-900/12"
              />
              <div
                className="relative z-10 flex items-center justify-between px-3 py-1.5 text-white"
                style={{ backgroundColor: meta.accentHex }}
              >
                <span className="inline-flex items-center gap-1 vankho-mono text-[9px] font-bold uppercase tracking-wider">
                  <span className="font-hanzi text-[10px]">字</span>
                  <span>HANZI</span>
                </span>
                <span className="vankho-mono text-[8.5px] uppercase tracking-wider">
                  ẤN BẢN BÌA MỀM
                </span>
              </div>

              <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-3.5 pt-3 pb-2 text-center">
                <div className="w-full">
                  <p className="truncate font-hanzi text-[10px] tracking-widest text-stone-500">
                    {meta.chineseSubtitle}
                  </p>
                  <p className="mt-1 line-clamp-2 vankho-serif text-sm font-semibold leading-snug text-stone-900 sm:text-base">
                    {product.name}
                  </p>
                </div>

                <div className="relative my-2 h-[45%] w-[80%] overflow-hidden rounded border border-stone-300 bg-stone-900 shadow-inner">
                  <img
                    src={meta.bookCoverImage}
                    alt={`Bìa mềm — ${product.name}`}
                    className="h-full w-full scale-115 object-cover object-center select-none"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-1.5 border border-amber-200/40"
                  />
                </div>

                <p className="vankho-mono text-[8.5px] uppercase tracking-wider text-stone-500">
                  {product.pages || 248} trang · Giấy kem chống mỏi mắt
                </p>
              </div>

              <div
                className="relative z-10 flex items-center justify-between gap-2 border-t-2 border-amber-300/75 px-3 py-2 text-[#FAF7F0]"
                style={{ backgroundColor: meta.spineColor }}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-[2px] border border-amber-300/60 bg-red-800/90 font-hanzi text-xs font-bold text-amber-100">
                    {meta.sealChar}
                  </span>
                  <div className="min-w-0 text-left leading-tight">
                    <span className="block truncate vankho-mono text-[8.5px] font-bold uppercase tracking-wider text-amber-200">
                      ĐAI SÁCH OBI · QR AUDIO
                    </span>
                    <span className="block truncate text-[8px] text-stone-200/90">
                      Bìa mềm giấy mỹ thuật gọn nhẹ
                    </span>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="flex h-4 shrink-0 items-stretch gap-[1.5px] rounded-[1px] bg-white/95 px-1 py-0.5"
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

          {/* Inner Front Cover Ex-Libris Bookplate */}
          <div
            aria-hidden="true"
            className="book3d-face absolute inset-0 flex flex-col items-center justify-between rounded-l-[7px] rounded-r-[2px] border border-black/20 p-5 text-center"
            style={{
              backgroundColor: "#F5EFE1",
              color: "#1f1b17",
              transform: "rotateY(180deg)",
              boxShadow: "inset -14px 0 22px -12px rgba(0,0,0,0.28)",
            }}
          >
            <div className="w-full border border-amber-900/25 px-3 py-2.5">
              <p className="vankho-mono text-[9px] tracking-[0.2em] uppercase text-[#785c38]">
                EX LIBRIS · HANZI
              </p>
              <p className="mt-1 vankho-serif text-sm font-semibold line-clamp-2">
                {product.name}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-red-800/65 bg-red-800/10 font-hanzi text-2xl font-bold text-[#991b1b]">
              {meta.sealChar}
            </div>

            <p className="vankho-serif text-xs italic text-[#4d4237] line-clamp-3">
              “{meta.tagline}”
            </p>

            <p className="vankho-mono text-[10px] text-[#66594a]">
              ISBN · {product.isbn || `978-7-5619-${meta.volumeCode}8-4`}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
