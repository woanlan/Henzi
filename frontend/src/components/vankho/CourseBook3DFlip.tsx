"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Volume2,
  X,
  XCircle,
} from "lucide-react";
import { BookEditionFormat, IProduct } from "@/interfaces/product";
import { audioEngine } from "@/lib/audio";
import { buildBookFiveSpreads } from "./book-preview-pages";
import { CourseArchivalMeta, resolveBookEditions } from "./vankho-data";

export interface CourseBook3DFlipProps {
  product: IProduct;
  meta: CourseArchivalMeta;
  edition?: BookEditionFormat;
  initialOpen?: boolean;
  /** Controlled mode for Centered Spotlight Modal (0 = closed, 1..5 = open spreads) */
  controlledSpread?: number;
  onSpreadChange?: (nextSpread: number) => void;
  /** Optional handler when user clicks "Đóng sách" button in standalone/modal mode */
  onRequestCloseBook?: () => void;
  isClosingAnimation?: boolean;
  hideBottomControls?: boolean;
}

export function CourseBook3DFlip({
  product,
  meta,
  edition = "hardcover",
  initialOpen = false,
  controlledSpread,
  onSpreadChange,
  onRequestCloseBook,
  isClosingAnimation = false,
  hideBottomControls = false,
}: CourseBook3DFlipProps) {
  const [internalSpread, setInternalSpread] = useState<number>(
    initialOpen ? 1 : 0
  );
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [selectedQuizIdx, setSelectedQuizIdx] = useState<number | null>(null);
  const [isCompactMobile, setIsCompactMobile] = useState<boolean>(false);
  // Mobile single-page index (1..10) when open on narrow screens < 640px
  const [mobilePageIdx, setMobilePageIdx] = useState<number>(1);

  const isControlled = controlledSpread !== undefined;
  const turnedCount = isControlled ? controlledSpread : internalSpread;
  const maxSpread = 5;

  const pack = useMemo(
    () => buildBookFiveSpreads(product, meta),
    [product, meta]
  );
  const editions = useMemo(() => resolveBookEditions(product), [product]);
  const isHardcover = edition === "hardcover";

  useEffect(() => {
    if (!isControlled) {
      setInternalSpread(initialOpen ? 1 : 0);
    }
    setSelectedQuizIdx(null);
    setMobilePageIdx(1);
  }, [product.id, initialOpen, isControlled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsCompactMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const setSpread = (next: number) => {
    const clamped = Math.max(0, Math.min(maxSpread, next));
    if (onSpreadChange) {
      onSpreadChange(clamped);
    } else {
      setInternalSpread(clamped);
    }
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setSpeakingText(text);
    audioEngine.speak(text, {
      rate: 0.9,
      onEnd: () => setSpeakingText(null),
      onError: () => setSpeakingText(null),
    });
  };

  // =========================================================================
  // RENDER FRONT COVER FACE (Paperback w/ Obi vs Cloth Hardcover 24K)
  // =========================================================================
  const renderFrontCoverFace = () => {
    if (isHardcover) {
      return (
        <div
          className="relative h-full w-full overflow-hidden rounded-r-[10px] rounded-l-[3px] border border-amber-300/35 shadow-2xl"
          style={{ backgroundColor: meta.spineColor }}
        >
          <img
            src={meta.bookCoverImage}
            alt={`Bìa cứng — ${product.name}`}
            className="h-full w-full object-cover select-none"
          />
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
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 right-3 rounded border border-amber-300/75 bg-stone-950/85 px-2 py-0.5 vankho-mono text-[9px] font-bold tracking-wider text-amber-300 shadow"
          >
            BÌA CỨNG NHŨ 24K
          </span>
          {turnedCount === 0 && !isClosingAnimation && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 bottom-5 flex items-center justify-center gap-1.5 rounded-full border border-amber-300/60 bg-stone-950/88 py-2 vankho-mono text-[11px] font-semibold uppercase tracking-wider text-amber-200 shadow-lg"
            >
              <BookOpen className="size-3.5" />
              <span>Nhấn để mở sách</span>
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="vankho-paper-grain relative flex h-full w-full flex-col justify-between overflow-hidden rounded-r-[7px] rounded-l-[2px] border border-stone-300 bg-[#FCF9F2] text-[#1C1917] shadow-xl">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[10px] z-20 w-px bg-stone-900/12"
        />
        <div
          className="relative z-10 flex items-center justify-between px-4 py-2 text-white"
          style={{ backgroundColor: meta.accentHex }}
        >
          <span className="inline-flex items-center gap-1.5 vankho-mono text-[10px] font-bold uppercase tracking-wider">
            <span className="font-hanzi text-xs">字</span>
            <span>HANZI</span>
          </span>
          <span className="vankho-mono text-[9.5px] uppercase tracking-wider">
            ẤN BẢN BÌA MỀM
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-5 py-4 text-center">
          <div className="w-full">
            <p className="truncate font-hanzi text-xs tracking-widest text-stone-500">
              {meta.chineseSubtitle}
            </p>
            <p className="mt-1.5 line-clamp-2 vankho-serif text-lg font-semibold leading-snug text-stone-900">
              {product.name}
            </p>
          </div>

          <div className="relative my-2 h-[46%] w-[78%] overflow-hidden rounded border border-stone-300 bg-stone-900 shadow-inner">
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

          <p className="vankho-mono text-[10px] uppercase tracking-wider text-stone-500">
            {product.pages || 248} trang · Giấy kem 100gsm chống lóa
          </p>
        </div>

        <div
          className="relative z-10 flex items-center justify-between gap-2 border-t-2 border-amber-300/75 px-4 py-2.5 text-[#FAF7F0]"
          style={{ backgroundColor: meta.spineColor }}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-[2px] border border-amber-300/60 bg-red-800/90 font-hanzi text-sm font-bold text-amber-100">
              {meta.sealChar}
            </span>
            <div className="min-w-0 text-left leading-tight">
              <span className="block truncate vankho-mono text-[9.5px] font-bold uppercase tracking-wider text-amber-200">
                ĐAI SÁCH OBI · KÈM QR AUDIO
              </span>
              <span className="block truncate text-[9px] text-stone-200/90">
                Bìa mềm giấy mỹ thuật gọn nhẹ
              </span>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="flex h-5 shrink-0 items-stretch gap-[1.5px] rounded-[1px] bg-white/95 px-1.5 py-0.5"
          >
            <span className="w-[1.5px] bg-stone-900" />
            <span className="w-[1px] bg-stone-900" />
            <span className="w-[2px] bg-stone-900" />
            <span className="w-[1px] bg-stone-900" />
            <span className="w-[1.5px] bg-stone-900" />
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // RENDER ANY INDIVIDUAL PRINTED BOOK PAGE (1..10)
  // =========================================================================
  const renderPageContent = (
    pageNo: number,
    side: "left" | "right",
    canTurnHint: boolean
  ) => {
    const paddedNo = String(pageNo).padStart(2, "0");

    return (
      <div
        className={`vankho-paper-grain relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#FBF7EE] p-4 text-[#1C1917] sm:p-5 lg:p-6 ${
          side === "left"
            ? "rounded-l-[8px] border-y border-l border-[#d8ceb8] shadow-[inset_-24px_0_30px_-18px_rgba(28,18,10,0.3)]"
            : "rounded-r-[8px] border-y border-r border-[#d8ceb8] shadow-[inset_24px_0_30px_-18px_rgba(28,18,10,0.3)]"
        }`}
      >
        {/* Running Page Header */}
        <div className="mb-2 flex shrink-0 items-center justify-between border-b border-amber-950/15 pb-1.5 vankho-mono text-[10px] tracking-[0.12em] text-[#786146]">
          {side === "left" ? (
            <>
              <span className="uppercase">HANZI · TẬP {meta.volumeCode}</span>
              <span className="uppercase">{meta.shortTimelineTag}</span>
            </>
          ) : (
            <>
              <span className="truncate font-hanzi">{meta.chineseSubtitle}</span>
              <span className="shrink-0 uppercase">{editions[edition].isbn}</span>
            </>
          )}
        </div>

        {/* PAGE BODY BY NUMBER (1..10) */}
        <div className="my-auto flex-1 flex flex-col justify-center overflow-y-auto py-1">
          {/* PAGE 01: TITLE & IMPRINT PAGE */}
          {pageNo === 1 && (
            <div className="flex h-full max-h-[340px] flex-col justify-between border-2 border-double border-amber-900/30 bg-[#f7f1e3]/75 p-4 text-center">
              <div>
                <p className="vankho-mono text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#92400e]">
                  NHÀ SÁCH &amp; HỌC LIỆU HANZI
                </p>
                <p className="mt-2 font-hanzi text-sm tracking-widest text-[#5c4a36]">
                  {meta.chineseSubtitle}
                </p>
                <h4 className="mt-1.5 vankho-serif text-base font-semibold leading-snug text-[#1c1917] sm:text-lg">
                  {product.name}
                </h4>
                <p className="mt-1 text-xs font-medium text-[#785c38]">
                  {product.author || "Ban Biên Tập HANZI"}
                </p>
              </div>

              <div className="mx-auto flex size-12 items-center justify-center rounded-sm border-2 border-red-800/70 bg-red-800/10 font-hanzi text-2xl font-bold text-[#991b1b]">
                {meta.sealChar}
              </div>

              <div className="space-y-1 border-t border-amber-900/15 pt-2 text-[11px] text-[#574c3f]">
                <p className="font-medium">
                  {product.publisher || "NXB Tổng Hợp · Ấn Bản HANZI"}
                </p>
                <p className="vankho-mono text-[9.5px] text-[#786146]">
                  {pack.imprintNote}
                </p>
              </div>
            </div>
          )}

          {/* PAGE 02: TABLE OF CONTENTS */}
          {pageNo === 2 && (
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <h4 className="font-hanzi text-base font-bold text-[#1c1917]">
                  目录 · Mục Lục Trọng Tâm
                </h4>
                <span className="vankho-mono text-[10px] text-[#92400e]">
                  {product.pages || 264} trang
                </span>
              </div>
              <ul className="space-y-1.5 text-xs">
                {pack.tocRows.map((row) => (
                  <li
                    key={row.code}
                    className="rounded-md border border-amber-950/8 bg-white/65 px-2.5 py-1.5"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="vankho-mono text-[10.5px] font-bold text-[#92400e]">
                        {row.code} ·{" "}
                        <span className="font-hanzi font-normal text-[#574c3f]">
                          {row.zhTitle}
                        </span>
                      </span>
                      <span className="shrink-0 vankho-mono text-[10px] font-semibold text-[#574c3f] tabular-nums">
                        tr. {row.pageNo}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[#292524]">
                      {row.vnTitle}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PAGE 03: CHINESE DIALOGUE / PASSAGE + PINYIN */}
          {pageNo === 3 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 rounded-lg bg-amber-900/[0.07] px-3 py-2">
                <div className="min-w-0">
                  <p className="font-hanzi text-xs font-bold text-[#92400e]">
                    {pack.lessonTitleZh}
                  </p>
                  <p className="truncate text-[11px] font-medium text-[#443c34]">
                    {pack.lessonTitleVn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) =>
                    handleSpeak(
                      e,
                      pack.dialogueTurns.map((d) => d.zh).join(" ")
                    )
                  }
                  className="inline-flex min-h-[32px] shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-amber-800/30 bg-white px-2.5 text-[11px] font-semibold text-[#92400e] hover:bg-amber-700 hover:text-white"
                >
                  <Volume2 className="size-3.5" aria-hidden="true" />
                  <span>Nghe bài</span>
                </button>
              </div>

              <div className="space-y-2">
                {pack.dialogueTurns.map((turn, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-amber-950/10 bg-white/70 px-3 py-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-hanzi text-[13px] leading-snug text-[#1c1917]">
                        <strong className="mr-1 text-xs text-[#92400e]">
                          {turn.speaker}：
                        </strong>
                        {turn.zh}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(e, turn.zh)}
                        aria-label={`Nghe câu ${idx + 1}`}
                        className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#92400e] hover:bg-amber-700/15"
                      >
                        <Volume2
                          className={`size-3.5 ${
                            speakingText === turn.zh ? "animate-pulse" : ""
                          }`}
                        />
                      </button>
                    </div>
                    <p className="mt-0.5 vankho-mono text-[10px] leading-snug text-[#785c38]">
                      {turn.pinyin}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 04: VIETNAMESE TRANSLATION & CULTURAL CALLOUT */}
          {pageNo === 4 && (
            <div className="space-y-3">
              <h4 className="font-hanzi text-xs font-bold uppercase tracking-wider text-[#92400e]">
                译文与注释 · Bản Dịch Đối Chiếu &amp; Chú Giải
              </h4>
              <div className="space-y-2">
                {pack.dialogueTurns.map((turn, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-amber-800/30 pl-3 text-xs leading-relaxed text-[#292524]"
                  >
                    <strong className="text-[#785c38]">{turn.speaker}: </strong>
                    <span>{turn.vn}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-amber-900/20 bg-[#f5ecd9] p-3 text-xs">
                <p className="vankho-mono text-[10px] font-bold uppercase tracking-wider text-[#92400e]">
                  ✦ {pack.culturalCalloutTitle}
                </p>
                <p className="mt-1 leading-relaxed text-[#3f372e]">
                  {pack.culturalCalloutBody}
                </p>
              </div>
            </div>
          )}

          {/* PAGE 05: STRUCTURED VOCABULARY TABLE */}
          {pageNo === 5 && (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <h4 className="font-hanzi text-sm font-bold text-[#92400e]">
                  一、重点生词表 (Bảng Từ Vựng Cốt Lõi)
                </h4>
                <span className="vankho-mono text-[10px] text-[#786146]">
                  {pack.vocabTable.length} mục từ
                </span>
              </div>
              <div className="overflow-hidden rounded-lg border border-amber-950/15 bg-white/80">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-amber-950/15 bg-amber-900/[0.06] text-[10px] uppercase text-[#6b563e]">
                      <th scope="col" className="px-2.5 py-1.5">
                        Từ mới
                      </th>
                      <th scope="col" className="px-2 py-1.5">
                        Pinyin &amp; Nghĩa
                      </th>
                      <th scope="col" className="w-8 px-1.5 py-1.5 text-center">
                        Âm
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-950/10">
                    {pack.vocabTable.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-2.5 py-1.5 align-top">
                          <span className="block font-hanzi text-[15px] font-bold text-[#1c1917]">
                            {row.hanzi}
                          </span>
                          <span className="text-[9px] text-[#856d52]">
                            {row.pos}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 align-top">
                          <span className="block vankho-mono text-[10.5px] font-semibold text-[#92400e]">
                            {row.pinyin}
                          </span>
                          <span className="block text-[11px] leading-snug text-[#292524]">
                            {row.meaning}
                          </span>
                        </td>
                        <td className="px-1.5 py-1.5 text-center align-middle">
                          <button
                            type="button"
                            onClick={(e) => handleSpeak(e, row.hanzi)}
                            aria-label={`Nghe từ ${row.hanzi}`}
                            className="inline-flex size-6.5 cursor-pointer items-center justify-center rounded border border-amber-900/20 bg-amber-50 text-[#92400e] hover:bg-amber-700 hover:text-white"
                          >
                            <Volume2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAGE 06: RADICAL BREAKDOWN & MỄ TỰ CÁCH GRID */}
          {pageNo === 6 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-hanzi text-sm font-bold text-[#92400e]">
                  二、部首字源拆解 (Chiết Tự Nhớ Nhanh)
                </h4>
                <div className="mt-2 space-y-2">
                  {pack.radicalNotes.map((rad) => (
                    <div
                      key={rad.char}
                      className="flex items-start gap-2.5 rounded-lg border border-amber-950/15 bg-white/80 p-2.5 text-xs"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded border border-red-800/35 bg-red-50/60 font-hanzi text-lg font-bold text-[#991b1b]">
                        {rad.char}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1c1917]">
                          {rad.radical}{" "}
                          <span className="vankho-mono text-[10px] font-normal text-[#786146]">
                            ({rad.strokes})
                          </span>
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-[#443c34]">
                          {rad.memoryTip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-hanzi text-xs font-bold text-[#92400e]">
                    三、米字格描红示范 (Ô Luyện Viết Mễ Tự)
                  </span>
                  <span className="vankho-mono text-[9.5px] text-[#786146]">
                    Bấm chữ để nghe
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {pack.calligraphyGridChars.map((ch, idx) => (
                    <button
                      key={`${ch}-${idx}`}
                      type="button"
                      onClick={(e) => handleSpeak(e, ch)}
                      title={`Bấm nghe âm chữ ${ch}`}
                      className="relative flex aspect-square cursor-pointer items-center justify-center border border-red-700/45 bg-[#fffdf8] hover:border-red-700"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-red-500/30"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-dashed border-red-500/30"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none relative z-10 font-hanzi text-lg font-medium"
                        style={{
                          color:
                            idx < 2
                              ? "#1c1917"
                              : idx < 4
                              ? "rgba(28,25,23,0.52)"
                              : "rgba(28,25,23,0.24)",
                        }}
                      >
                        {ch}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 07: GRAMMAR FORMULA & RIGHT/WRONG CONTRAST */}
          {pageNo === 7 && (
            <div className="space-y-2.5">
              <div>
                <p className="font-hanzi text-xs font-bold text-[#92400e]">
                  {pack.grammar.zhHeading}
                </p>
                <h4 className="mt-0.5 vankho-serif text-[15px] font-semibold text-[#1c1917]">
                  {pack.grammar.vnHeading}
                </h4>
              </div>

              <div className="rounded-lg border-l-3 border-[#b45309] bg-amber-900/[0.07] p-2.5">
                <p className="vankho-mono text-[9.5px] font-bold uppercase tracking-wider text-[#92400e]">
                  Công thức cấu trúc
                </p>
                <p className="mt-0.5 font-hanzi text-xs font-bold text-[#1c1917]">
                  {pack.grammar.formula}
                </p>
              </div>

              <p className="text-[11.5px] leading-relaxed text-[#3f372e]">
                {pack.grammar.usageNote}
              </p>

              <div className="space-y-1.5 rounded-lg border border-amber-950/15 bg-white/80 p-2.5 text-xs">
                <p className="vankho-mono text-[9.5px] font-bold uppercase tracking-wider text-[#785c38]">
                  Đối chiếu lỗi sai thường gặp (正误对比)
                </p>
                <div className="rounded bg-red-950/[0.05] px-2 py-1 text-[#7f1d1d]">
                  <p className="font-hanzi text-xs font-semibold">
                    {pack.grammar.wrongZh}
                  </p>
                  <p className="text-[10.5px] opacity-90">
                    → {pack.grammar.wrongNote}
                  </p>
                </div>
                <div className="rounded bg-emerald-950/[0.06] px-2 py-1 text-[#14532d]">
                  <p className="font-hanzi text-xs font-semibold">
                    {pack.grammar.rightZh}
                  </p>
                  <p className="vankho-mono text-[10px]">
                    {pack.grammar.rightPinyin}
                  </p>
                  <p className="text-[10.5px] italic">{pack.grammar.rightVn}</p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 08: APPLIED MODEL SENTENCES */}
          {pageNo === 8 && (
            <div className="space-y-2.5">
              <h4 className="font-hanzi text-xs font-bold uppercase tracking-wider text-[#92400e]">
                扩展实用例句 · Mẫu Câu Ứng Dụng Mở Rộng
              </h4>
              <div className="space-y-2">
                {pack.modelSentences.map((sent, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-amber-950/15 bg-white/80 p-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-hanzi text-[13.5px] font-bold text-[#1c1917]">
                        0{idx + 1}. {sent.zh}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(e, sent.zh)}
                        aria-label={`Nghe câu mẫu ${idx + 1}`}
                        className="inline-flex size-6.5 shrink-0 cursor-pointer items-center justify-center rounded bg-amber-900/10 text-[#92400e] hover:bg-amber-700 hover:text-white"
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                    </div>
                    <p className="mt-0.5 vankho-mono text-[10.5px] text-[#92400e]">
                      {sent.pinyin}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-[#443c34]">
                      → {sent.vn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 09: INTERACTIVE QUIZ ON BOOK PAGE */}
          {pageNo === 9 && (
            <div className="space-y-3">
              <div>
                <p className="font-hanzi text-xs font-bold text-[#92400e]">
                  课后实战练习 · Bài Tập Tự Kiểm Tra
                </p>
                <p className="mt-0.5 text-[11px] text-[#574c3f]">
                  Bấm chọn đáp án A, B hoặc C ngay trên trang sách:
                </p>
              </div>

              <div className="space-y-2 rounded-lg border border-amber-950/15 bg-white/85 p-3">
                <p className="vankho-mono text-[9.5px] font-bold uppercase text-[#785c38]">
                  Bài 1 · Chọn từ điền vào chỗ trống
                </p>
                <p className="font-hanzi text-sm font-bold text-[#1c1917]">
                  {pack.quiz.promptSentenceZh}
                </p>
                <p className="vankho-mono text-[10px] text-[#785c38]">
                  {pack.quiz.promptPinyinHint}
                </p>
                <p className="text-[11px] italic text-[#574c3f]">
                  Nghĩa câu: “{pack.quiz.promptVn}”
                </p>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {pack.quiz.options.map((opt, idx) => {
                    const picked = selectedQuizIdx === idx;
                    const isCorrect = idx === pack.quiz.correctIndex;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuizIdx(idx);
                        }}
                        className={`cursor-pointer rounded-lg border px-1.5 py-1.5 text-center transition-colors ${
                          picked
                            ? isCorrect
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                              : "border-red-500 bg-red-50 text-red-900"
                            : "border-amber-900/20 bg-[#FAF6EC] text-[#1c1917] hover:border-amber-700"
                        }`}
                      >
                        <span className="block font-hanzi text-xs font-bold sm:text-sm">
                          {opt.label}. {opt.value}
                        </span>
                        <span className="block vankho-mono text-[9.5px] opacity-80">
                          {opt.pinyin}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedQuizIdx !== null && (
                  <div
                    className={`mt-1 flex items-start gap-1.5 rounded-md p-2 text-[10.5px] font-medium ${
                      selectedQuizIdx === pack.quiz.correctIndex
                        ? "bg-emerald-900/10 text-emerald-900"
                        : "bg-red-900/10 text-red-900"
                    }`}
                  >
                    {selectedQuizIdx === pack.quiz.correctIndex ? (
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-700" />
                    ) : (
                      <XCircle className="mt-0.5 size-3.5 shrink-0 text-red-700" />
                    )}
                    <span>{pack.quiz.explanation}</span>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-amber-950/15 bg-[#f6efe0]/85 p-2.5 text-xs">
                <p className="vankho-mono text-[9.5px] font-bold uppercase text-[#785c38]">
                  Bài 2 · Dịch câu sang tiếng Trung (Xem đáp án trang 10)
                </p>
                <p className="mt-0.5 font-medium text-[#1c1917]">
                  “{pack.quiz.translationChallengeVn}”
                </p>
              </div>
            </div>
          )}

          {/* PAGE 10: ANSWER KEY & QR AUDIO COLOPHON */}
          {pageNo === 10 && (
            <div className="space-y-3">
              <div className="space-y-2 rounded-lg border border-amber-950/15 bg-white/85 p-3 text-xs">
                <p className="vankho-mono text-[10px] font-bold uppercase tracking-wider text-[#92400e]">
                  参考答案 · Đáp Án &amp; Lời Giải Chi Tiết
                </p>
                <p className="text-[#292524]">
                  <strong>Bài 1:</strong> {pack.quiz.explanation}
                </p>
                <div className="border-t border-amber-950/10 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <strong>Bài 2 (Câu dịch chuẩn):</strong>
                    <button
                      type="button"
                      onClick={(e) =>
                        handleSpeak(e, pack.quiz.translationAnswerZh)
                      }
                      className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-[#92400e]"
                    >
                      <Volume2 className="size-3.5" />
                      <span>Nghe câu</span>
                    </button>
                  </div>
                  <p className="mt-1 font-hanzi text-sm font-bold text-[#1c1917]">
                    {pack.quiz.translationAnswerZh}
                  </p>
                  <p className="vankho-mono text-[10.5px] text-[#785c38]">
                    {pack.quiz.translationAnswerPinyin}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-amber-900/25 bg-[#f4ebd6] p-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-amber-900/30 bg-white text-[#1c1917]">
                  <QrCode className="size-7" aria-hidden="true" />
                </div>
                <div className="min-w-0 text-xs">
                  <p className="vankho-mono text-[9.5px] font-bold uppercase text-[#92400e]">
                    QR Audio Bắc Kinh · {pack.audioCode}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[#3f372e]">
                    Quét mã QR in ở bìa sau sách thật để mở trọn bộ File nghe MP3 bản xứ.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Running Page Footer + Subtle Edge-Click Hint */}
        <div className="mt-2 flex shrink-0 items-center justify-between border-t border-amber-950/12 pt-1.5 vankho-mono text-[10px] text-[#786146] tabular-nums">
          {side === "left" ? (
            <>
              <span>Trang {paddedNo}</span>
              <span className="text-[#92400e]/80">
                {canTurnHint ? "← Bấm mép trái lật lại" : "HANZI"}
              </span>
            </>
          ) : (
            <>
              <span className="text-[#92400e]/80">
                {canTurnHint ? "Bấm mép phải lật tiếp →" : "Hết phần đọc thử"}
              </span>
              <span>Trang {paddedNo}</span>
            </>
          )}
        </div>
      </div>
    );
  };

  // =========================================================================
  // DESKTOP / TABLET (>= 640px): TRUE HINGED 3D MULTI-SHEET BOOK
  // =========================================================================
  // 5 Hinged Sheets around spine (left: 50%, width: 50%, origin: left center):
  //   k=0: Front = Cover,   Back = Page 01
  //   k=1: Front = Page 02, Back = Page 03
  //   k=2: Front = Page 04, Back = Page 05
  //   k=3: Front = Page 06, Back = Page 07
  //   k=4: Front = Page 08, Back = Page 09
  // Stationary Right Base: Page 10 + Back Cover Board
  const sheets = [0, 1, 2, 3, 4] as const;

  const handleCloseAction = () => {
    if (onRequestCloseBook) {
      onRequestCloseBook();
    } else {
      setSpread(0);
    }
  };

  return (
    <div className="flex w-full flex-col items-center select-none">
      {!isCompactMobile ? (
        /* ================================================================= */
        /* 2-PAGE PHYSICAL HINGED 3D BOOK STAGE                              */
        /* ================================================================= */
        <div
          className="relative flex w-full items-center justify-center py-2"
          style={{ perspective: "2200px" }}
        >
          <div
            className="book3d-preserve relative h-[456px] w-full max-w-[820px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-[488px]"
            style={{
              transform:
                turnedCount === 0
                  ? "translateX(-25%) rotateX(4deg) rotateY(-8deg)"
                  : "translateX(0%) rotateX(3.5deg) rotateY(0deg)",
            }}
          >
            {/* Under-Book Ambient Desk Shadow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 left-[6%] right-[6%] h-8 rounded-full bg-black/45 blur-xl transition-all duration-700"
              style={{
                opacity: turnedCount === 0 ? 0.45 : 0.78,
                transform:
                  turnedCount === 0
                    ? "translateX(25%) scaleX(0.5)"
                    : "translateX(0%) scaleX(1)",
              }}
            />

            {/* LEFT OUTER HARDCOVER / SOFTCOVER BOARD UNDERLAY (Visible once Cover k=0 opens!) */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-[-4px] left-[-6px] w-[calc(50%+6px)] rounded-l-[11px] transition-opacity duration-500 ${
                turnedCount > 0 ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundColor: isHardcover ? meta.spineColor : "#d8ceb8",
                transform: "translateZ(0px)",
                boxShadow: "0 22px 44px -16px rgba(0,0,0,0.55)",
              }}
            >
              {/* Stacked Paper Fan Edge on Left */}
              <div className="absolute inset-y-[4px] left-[6px] w-[6px] rounded-l-[3px] bg-gradient-to-r from-[#d4c9b2] to-[#efe8d8]" />
            </div>

            {/* RIGHT STATIONARY BACK COVER BOARD + INSIDE PAGE 10 */}
            <div
              className={`absolute inset-y-0 left-1/2 w-1/2 ${
                turnedCount === 5 ? "pointer-events-auto" : "pointer-events-none"
              }`}
              style={{ transform: "translateZ(0px)" }}
            >
              {/* Back Board Lip */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-[-4px] left-0 right-[-6px] rounded-r-[11px]"
                style={{
                  backgroundColor: isHardcover ? meta.spineColor : "#d8ceb8",
                  boxShadow: "0 22px 44px -16px rgba(0,0,0,0.55)",
                }}
              />
              {/* Stacked Paper Fan Edge on Right */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-[2px] -right-[4px] z-10 w-[6px] rounded-r-[3px] bg-gradient-to-l from-[#cfc3ab] to-[#f3ede0]"
              />
              {/* Stationary Page 10 */}
              <div className="relative h-full w-full pr-[2px]">
                {renderPageContent(10, "right", false)}
              </div>
            </div>

            {/* CENTER SPINE HINGE CYLINDER & CRIMSON SILK RIBBON */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-[-4px] left-1/2 z-40 w-[14px] -translate-x-1/2 rounded-xs transition-opacity duration-500"
              style={{
                background: isHardcover
                  ? `linear-gradient(90deg, #120d0a 0%, ${meta.spineColor} 50%, #120d0a 100%)`
                  : `linear-gradient(90deg, #b8ad98 0%, ${meta.accentHex} 50%, #b8ad98 100%)`,
                transform: "translateZ(1px)",
                opacity: turnedCount > 0 ? 0.92 : 0.4,
              }}
            >
              {isHardcover && turnedCount > 0 && (
                <span
                  className="absolute -bottom-3 left-1/2 h-6 w-2.5 -translate-x-1/2 shadow"
                  style={{
                    background:
                      "linear-gradient(180deg, #7f1d1d 0%, #dc2626 70%, #991b1b 100%)",
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)",
                  }}
                />
              )}
            </div>

            {/* ============================================================= */}
            {/* 5 PHYSICAL HINGED 3D SHEETS (k = 0 Front Cover, k = 1..4 Pages) */}
            {/* ============================================================= */}
            {sheets.map((k) => {
              const isTurned = k < turnedCount;
              // Collision-free world-Z depth:
              // Unturned on right stack: k=0 -> 10px, k=1 -> 8px, ..., k=4 -> 2px
              // Turned on left stack:    k=0 -> 2px,  k=1 -> 4px, ..., k=4 -> 10px
              const zDepth = isTurned ? (k + 1) * 2.2 : (5 - k) * 2.2;
              const angle = isTurned ? -180 : 0;

              // Staggered closing delay so inner pages tuck in BEFORE rigid front cover closes!
              const closingDelayMs = isClosingAnimation
                ? k === 0
                  ? 90
                  : (4 - k) * 20
                : 0;

              const isTopRightInteractive = !isTurned && k === turnedCount;
              const isTopLeftInteractive = isTurned && k === turnedCount - 1;
              const isInteractiveSheet =
                !isClosingAnimation &&
                (isTopRightInteractive || isTopLeftInteractive);

              const frontPageNo = k * 2; // k=1 -> 2, k=2 -> 4, k=3 -> 6, k=4 -> 8
              const backPageNo = k * 2 + 1; // k=0 -> 1, k=1 -> 3, k=2 -> 5, k=3 -> 7, k=4 -> 9

              return (
                <div
                  key={k}
                  style={{
                    transformOrigin: "left center",
                    transform: `translateZ(${zDepth}px) rotateY(${angle}deg)`,
                    transitionProperty: "transform",
                    transitionDuration: k === 0 ? "820ms" : "700ms",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    transitionDelay: `${closingDelayMs}ms`,
                  }}
                  className={`book3d-preserve absolute inset-y-0 left-1/2 h-full w-1/2 ${
                    isInteractiveSheet
                      ? "pointer-events-auto"
                      : "pointer-events-none"
                  }`}
                >
                  {/* FRONT FACE OF SHEET k (Visible on RIGHT when angle === 0deg) */}
                  <div
                    onClick={() => {
                      if (!isTopRightInteractive || isClosingAnimation) return;
                      setSpread(k + 1);
                    }}
                    className={`book3d-face absolute inset-0 h-full w-full ${
                      isTopRightInteractive ? "cursor-pointer" : ""
                    }`}
                  >
                    {k === 0
                      ? renderFrontCoverFace()
                      : renderPageContent(frontPageNo, "right", true)}
                  </div>

                  {/* BACK FACE OF SHEET k (Visible on LEFT when angle === -180deg) */}
                  <div
                    onClick={() => {
                      if (!isTopLeftInteractive || isClosingAnimation) return;
                      // Clicking left page flips back 1 sheet (or closes cover if on Page 01!)
                      if (k === 0) {
                        handleCloseAction();
                      } else {
                        setSpread(k);
                      }
                    }}
                    style={{ transform: "rotateY(180deg)" }}
                    className={`book3d-face absolute inset-0 h-full w-full ${
                      isTopLeftInteractive ? "cursor-pointer" : ""
                    }`}
                  >
                    {renderPageContent(backPageNo, "left", k > 0)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================================================================= */
        /* COMPACT MOBILE (< 640px): SINGLE-LEAF 3D OPEN / FLIP / CLOSE      */
        /* ================================================================= */
        <div
          className="relative flex w-full items-center justify-center py-2"
          style={{ perspective: "1500px" }}
        >
          <div className="book3d-preserve relative h-[430px] w-full max-w-[332px]">
            {/* Interior Single Page (1..10) */}
            <div className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl">
              {renderPageContent(
                mobilePageIdx,
                mobilePageIdx % 2 === 1 ? "left" : "right",
                false
              )}
            </div>

            {/* Hinged Front Cover that swings open -175deg on Animation 1 & closes 0deg on Animation 3 */}
            <div
              onClick={() => {
                if (turnedCount === 0 && !isClosingAnimation) {
                  setSpread(1);
                }
              }}
              style={{
                transformOrigin: "left center",
                transform:
                  turnedCount > 0 && !isClosingAnimation
                    ? "translateZ(6px) rotateY(-174deg)"
                    : "translateZ(6px) rotateY(0deg)",
                transition: "transform 780ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className={`book3d-preserve absolute inset-0 z-30 ${
                turnedCount > 0 ? "pointer-events-none opacity-0 transition-opacity delay-300" : "pointer-events-auto cursor-pointer"
              }`}
            >
              <div className="book3d-face absolute inset-0">
                {renderFrontCoverFace()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* COMPACT PAGE-TURN & CLOSE BOOK CONTROLS                             */}
      {/* =================================================================== */}
      {!hideBottomControls && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* Previous Page / Close Cover */}
          <button
            type="button"
            disabled={turnedCount === 0 || isClosingAnimation}
            onClick={() => {
              if (isCompactMobile && turnedCount > 0 && mobilePageIdx > 1) {
                const nextP = mobilePageIdx - 1;
                setMobilePageIdx(nextP);
                setSpread(Math.ceil(nextP / 2));
                return;
              }
              if (turnedCount <= 1) {
                handleCloseAction();
              } else {
                setSpread(turnedCount - 1);
              }
            }}
            className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-stone-900/85 px-4 text-xs font-semibold text-[#FAF7F0] backdrop-blur-sm transition-colors hover:border-amber-400/60 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span>
              {turnedCount <= 1 ? "Gấp bìa lại" : "Trang trước"}
            </span>
          </button>

          {/* Current Page Indicator Dots */}
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-stone-900/80 px-3.5 py-2 vankho-mono text-xs text-amber-100 tabular-nums">
            <span>
              {turnedCount === 0
                ? "Bìa đóng"
                : isCompactMobile
                ? `Trang ${String(mobilePageIdx).padStart(2, "0")} / 10`
                : `Trang ${String(turnedCount * 2 - 1).padStart(2, "0")}–${String(
                    turnedCount * 2
                  ).padStart(2, "0")} / 10`}
            </span>
          </div>

          {/* Next Page / Open Cover */}
          <button
            type="button"
            disabled={
              isClosingAnimation ||
              (isCompactMobile
                ? turnedCount > 0 && mobilePageIdx >= 10
                : turnedCount >= maxSpread)
            }
            onClick={() => {
              if (turnedCount === 0) {
                setMobilePageIdx(1);
                setSpread(1);
                return;
              }
              if (isCompactMobile) {
                const nextP = Math.min(10, mobilePageIdx + 1);
                setMobilePageIdx(nextP);
                setSpread(Math.ceil(nextP / 2));
                return;
              }
              setSpread(turnedCount + 1);
            }}
            className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-full bg-(--vk-primary) px-4 text-xs font-semibold text-(--vk-primary-fg) shadow-md transition-colors hover:bg-(--vk-primary-hover) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>
              {turnedCount === 0 ? "Mở sách đọc thử" : "Lật trang tiếp"}
            </span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>

          {/* Explicit Close Book Button (Animation 3) */}
          {(turnedCount > 0 || onRequestCloseBook) && (
            <button
              type="button"
              disabled={isClosingAnimation}
              onClick={handleCloseAction}
              className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-full border border-red-400/35 bg-stone-900/85 px-4 text-xs font-semibold text-amber-100 transition-colors hover:border-amber-300 hover:bg-stone-800 disabled:opacity-40"
            >
              <X className="size-3.5" aria-hidden="true" />
              <span>Đóng sách</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
