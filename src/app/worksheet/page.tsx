"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pinyin } from "pinyin-pro";
import { soundManager } from "@/lib/utils";
import {
  Printer,
  Sparkles,
  PenTool,
  RotateCcw,
  Settings,
  Grid,
} from "lucide-react";

export default function WorksheetPage() {
  const [inputText, setInputText] = useState("你好中国学朋友谢谢茶水买钱");
  const [gridType, setGridType] = useState<"mi" | "tian">("mi"); // mi = 米字格, tian = 田字格
  const [traceCount, setTraceCount] = useState<number>(3); // number of light watermark boxes to trace

  // Clean characters to only Chinese
  const characters = Array.from(new Set(inputText.replace(/[^\u4e00-\u9fa5]/g, "").split(""))).slice(0, 16);

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      {/* Navbar hidden when printing */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* SCREEN-ONLY CONTROLS & HEADER */}
        <div className="print:hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Printer className="w-3.5 h-3.5 text-amber-600" />
                <span>Trình Tạo Phiếu Tập Viết Khổ A4 (Printable Worksheet)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                In Phiếu Luyện Viết Ô Mễ Tự Cách (米字格)
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">
                Nhập danh sách chữ Hán bạn muốn luyện $\rightarrow$ Xuất ngay trang phiếu chuẩn A4 có chữ in mờ để in ra giấy luyện viết bằng bút mực.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu A4 / Xuất PDF</span>
            </button>
          </div>

          {/* CONFIGURATION CARD */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Nhập các chữ Hán muốn tạo phiếu (tối đa 16 chữ mỗi trang):
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập chữ Hán..."
                className="w-full p-3 rounded-xl border border-stone-300 font-hanzi text-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-500">Loại ô kẻ:</span>
                <button
                  onClick={() => setGridType("mi")}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                    gridType === "mi" ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-stone-50 border-stone-200"
                  }`}
                >
                  Ô Mễ Tự Cách (米字格)
                </button>
                <button
                  onClick={() => setGridType("tian")}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                    gridType === "tian" ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-stone-50 border-stone-200"
                  }`}
                >
                  Ô Điền Tự Cách (田字格)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-500">Số ô in mờ để tô:</span>
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTraceCount(num)}
                    className={`w-7 h-7 rounded-lg border font-bold text-xs transition-colors cursor-pointer ${
                      traceCount === num ? "bg-amber-600 text-white border-amber-600" : "bg-stone-50 border-stone-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRINTABLE A4 SHEET CANVAS */}
        <div className="bg-white rounded-3xl border border-stone-300 shadow-xl p-8 sm:p-12 print:p-0 print:border-none print:shadow-none print:rounded-none mx-auto w-full max-w-[800px] text-stone-900">
          {/* Printable Sheet Header */}
          <div className="border-b-2 border-stone-900 pb-4 mb-6 flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-black tracking-wider uppercase text-stone-900">
                Phiếu Luyện Viết Chữ Hán
              </h2>
              <p className="text-xs text-stone-500 italic">
                HANZI MASTER • 一步一个脚印 (Vững chắc từng nét bút)
              </p>
            </div>

            <div className="text-xs text-stone-600 font-mono space-y-1 text-right">
              <div>Họ và tên: ....................................................</div>
              <div>Ngày luyện tập: ...... / ...... / 202...</div>
            </div>
          </div>

          {/* Rows for each character */}
          <div className="space-y-4">
            {characters.map((char, rowIndex) => {
              const charPinyin = pinyin(char, { toneType: "symbol" });
              const totalBoxes = 9; // 1 guide + traceCount trace boxes + remaining blank

              return (
                <div key={rowIndex} className="flex items-center gap-3">
                  {/* Left Column: Pinyin & Guide Character */}
                  <div className="w-14 flex flex-col items-center justify-center shrink-0 border-r border-stone-200 pr-2">
                    <span className="text-[11px] font-mono font-bold text-stone-600">
                      {charPinyin}
                    </span>
                    <span className="font-hanzi text-2xl font-black text-stone-900">
                      {char}
                    </span>
                  </div>

                  {/* Practice Grids (米字格) */}
                  <div className="flex-1 flex gap-1.5 sm:gap-2">
                    {Array.from({ length: totalBoxes }).map((_, boxIdx) => {
                      const isTraceBox = boxIdx < traceCount;

                      return (
                        <div
                          key={boxIdx}
                          className={`w-9 h-9 sm:w-11 sm:h-11 border border-stone-400 relative flex items-center justify-center shrink-0 select-none ${
                            gridType === "mi" ? "bg-white" : "bg-white"
                          }`}
                        >
                          {/* Inner Grid Cross & Diagonal Lines for 米字格 */}
                          <div className="absolute inset-0 border-t border-dashed border-stone-300 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <div className="absolute inset-0 border-l border-dashed border-stone-300 left-1/2 -translate-x-1/2 pointer-events-none" />
                          {gridType === "mi" && (
                            <>
                              <svg className="absolute inset-0 w-full h-full text-stone-200 pointer-events-none stroke-current" strokeDasharray="2,2">
                                <line x1="0" y1="0" x2="100%" y2="100%" strokeWidth="0.75" />
                                <line x1="100%" y1="0" x2="0" y2="100%" strokeWidth="0.75" />
                              </svg>
                            </>
                          )}

                          {/* Watermark trace character */}
                          {isTraceBox && (
                            <span className="font-hanzi text-xl sm:text-2xl font-normal text-stone-300 select-none relative z-10">
                              {char}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Printable Sheet Footer */}
          <div className="mt-8 pt-4 border-t border-stone-300 text-[10px] text-stone-400 flex justify-between items-center">
            <span>Tiêu chuẩn ô Mễ Tự Cách chữ Hán • Tải thêm bài tập tại https://hanzimaster.vn</span>
            <span>Trang 1 / 1</span>
          </div>
        </div>
      </main>

      {/* Footer hidden when printing */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
