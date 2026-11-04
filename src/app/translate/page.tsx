"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import { pinyin } from "pinyin-pro";
import {
  Languages,
  Volume2,
  Copy,
  Check,
  Sparkles,
  ArrowRightLeft,
  Trash2,
  BookOpen,
} from "lucide-react";

// Common Sino-Vietnamese (Hán Việt) lookup map for popular Chinese characters
const SINO_VIETNAMESE_MAP: Record<string, string> = {
  你: "NHĨ",
  好: "HẢO",
  我: "NGÃ",
  他: "THA",
  她: "THA",
  们: "MÔN",
  这: "GIÁ",
  那: "NA",
  是: "THỊ",
  在: "TẠI",
  有: "HỮU",
  不: "BẤT",
  学: "HỌC",
  习: "TẬP",
  中: "TRUNG",
  国: "QUỐC",
  人: "NHÂN",
  老: "LÃO",
  师: "SƯ",
  朋: "BẰNG",
  友: "HỮU",
  包: "BAO",
  邮: "BƯU",
  板: "BẢN",
  现: "HIỆN",
  货: "HÓA",
  多: "ĐA",
  少: "THIỂU",
  钱: "TIỀN",
  买: "MÃI",
  卖: "MẠI",
  吃: "NGẬT",
  喝: "HÁT",
  茶: "TRÀ",
  饭: "PHẠN",
  大: "ĐẠI",
  小: "TIỂU",
  谢: "TẠ",
  见: "KIẾN",
  明: "MINH",
  天: "THIÊN",
  去: "KHỨ",
  想: "TƯỞNG",
  餐: "XAN",
  厅: "THÍNH",
};

export default function TranslatePage() {
  const [inputText, setInputText] = useState("老板，请问发到广西凭祥能包邮吗？");
  const [copied, setCopied] = useState(false);

  // Quick preset sentences
  const presets = [
    { label: "Mặc cả Taobao", text: "老板，我想订500件，发到广西能包邮吗？" },
    { label: "Gọi món nhà hàng", text: "服务员，这道菜请做微辣，不要太油腻。" },
    { label: "Hỏi đường du lịch", text: "请问去故宫博物院坐几号线地铁？" },
    { label: "Khách sạn check-in", text: "你好，我预订了一间大床房，这是护照。" },
  ];

  // Generate Pinyin using pinyin-pro
  const generatedPinyin = inputText
    ? pinyin(inputText, { toneType: "symbol" })
    : "";

  const handleSpeak = (text: string = inputText) => {
    try {
      soundManager.playClick();
      audioEngine.speak(text);
    } catch {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${inputText}\n${generatedPinyin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const characters = inputText.split("");

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HEADER */}
        <div className="space-y-2 border-b border-stone-200 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Languages className="w-3.5 h-3.5 text-amber-600" />
            <span>Công Cụ Tra Cứu & Bóc Tách Hán Tự 3 Tầng</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Dịch & Phân Tích Cấu Trúc Câu Tiếng Trung
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Dán bất kỳ câu tiếng Trung nào để tự động gán Pinyin có dấu thanh, bóc tách âm Hán Việt từng chữ và nghe giọng đọc Bắc Kinh chuẩn.
          </p>
        </div>

        {/* PRESET CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 shrink-0">
            Mẫu câu nhanh:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundManager.playClick();
                setInputText(p.text);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-xs font-semibold text-stone-700 whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* INPUT & ANALYSIS WORKSPACE */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-600">
                Văn bản tiếng Trung cần phân tích:
              </span>
              {inputText && (
                <button
                  onClick={() => setInputText("")}
                  className="text-stone-400 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa hết</span>
                </button>
              )}
            </div>

            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập hoặc dán chữ Hán vào đây..."
              className="w-full p-4 rounded-2xl border-2 border-stone-200 focus:border-amber-500 focus:outline-none font-hanzi text-xl sm:text-2xl text-stone-900 leading-relaxed resize-none transition-all placeholder:font-sans placeholder:text-stone-300"
            />
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between border-t border-stone-100 pt-4">
            <div className="flex items-center gap-2">
              <button
                disabled={!inputText.trim()}
                onClick={() => handleSpeak(inputText)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Đọc Văn Bản</span>
              </button>

              <button
                disabled={!inputText.trim()}
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Đã sao chép" : "Sao chép"}</span>
              </button>
            </div>

            <span className="text-xs text-stone-400">
              {inputText.length} ký tự
            </span>
          </div>

          {/* 3-LAYER BREAKDOWN CARD */}
          {inputText.trim() && (
            <div className="space-y-6 pt-4 border-t border-stone-100 animate-fadeIn">
              {/* Full Pinyin Row */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  Phiên Âm Pinyin Toàn Câu:
                </span>
                <p className="font-mono text-base sm:text-lg font-bold text-amber-900">
                  {generatedPinyin}
                </p>
              </div>

              {/* Character by Character Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Bóc Tách Từng Chữ & Âm Hán Việt Đối Ứng:
                </span>

                <div className="flex flex-wrap gap-2">
                  {characters.map((char, idx) => {
                    const charPinyin = pinyin(char, { toneType: "symbol" });
                    const hanViet = SINO_VIETNAMESE_MAP[char] || "—";
                    const isHanzi = /[\u4e00-\u9fa5]/.test(char);

                    if (!isHanzi) {
                      return (
                        <div key={idx} className="self-center px-1 font-hanzi text-xl text-stone-400">
                          {char}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSpeak(char)}
                        className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer flex flex-col items-center justify-center min-w-[56px] text-center shadow-2xs group"
                        title="Bấm để nghe phát âm chữ này"
                      >
                        <span className="font-hanzi text-2xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                          {char}
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 font-mono mt-0.5">
                          {charPinyin}
                        </span>
                        <span className="text-[9px] font-black text-stone-400 uppercase mt-0.5">
                          {hanViet}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
