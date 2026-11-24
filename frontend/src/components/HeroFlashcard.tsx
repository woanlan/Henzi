"use client";

import React, { useState } from "react";
import Link from "next/link";
import Tilt3DCard from "@/components/ui/Tilt3DCard";
import { Volume2, PenTool, Sparkles, RotateCw, Bot } from "lucide-react";

export default function HeroFlashcard() {
  const [flipped, setFlipped] = useState(false);

  const openAiChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hanzi-open-ai-chat"));
    }
  };

  const speak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("学，学习");
        utterance.lang = "zh-CN";
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Tilt3DCard maxTilt={7} className="rounded-3xl">
        <div className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-7 space-y-6 relative group text-left">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span className="uppercase tracking-wider">Thẻ Từ Vựng Trực Quan</span>
            <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
              HSK 1
            </span>
          </div>

          {/* 3D Flip Character Flash Box */}
          <div
            onClick={() => setFlipped(!flipped)}
            className="perspective-1000 cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setFlipped(!flipped);
              }
            }}
            aria-label="Lật thẻ từ vựng 3D"
          >
            <div
              className={`relative min-h-[190px] transition-transform duration-500 preserve-3d ${
                flipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div className="backface-hidden absolute inset-0 p-7 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400 flex flex-col items-center justify-center text-center space-y-2.5 shadow-2xs transition-colors">
                <span className="absolute top-3 right-3 p-1.5 rounded-lg text-stone-400">
                  <RotateCw className="w-3.5 h-3.5" />
                </span>
                <div className="font-hanzi text-7xl font-extrabold text-stone-900 tracking-wider">
                  学
                </div>
                <div className="text-amber-800 font-bold font-mono text-base">
                  xué
                </div>
                <p className="text-xs text-stone-400">
                  (Chạm vào đây để lật xem nghĩa & âm Hán Việt)
                </p>
              </div>

              {/* Back */}
              <div className="backface-hidden rotate-y-180 absolute inset-0 p-7 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-col items-center justify-center text-center space-y-2 shadow-2xs">
                <span className="absolute top-3 right-3 p-1.5 rounded-lg text-amber-600">
                  <RotateCw className="w-3.5 h-3.5" />
                </span>
                <div className="text-xl font-bold text-stone-900">
                  Học, Học tập
                </div>
                <div className="text-xs text-amber-800 font-semibold">
                  Âm Hán Việt: HỌC (Bộ Tử 子)
                </div>
                <p className="text-xs text-stone-600 italic mt-1">
                  &quot;好好学习，天天向上&quot;
                  <br />
                  <span className="text-[11px] text-stone-500">Học tập tốt, ngày ngày tiến bộ</span>
                </p>
              </div>
            </div>
          </div>

          {/* Audio Speaker & Quick Actions */}
          <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={speak}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Nghe Âm</span>
            </button>

            <button
              type="button"
              onClick={openAiChat}
              className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Hỏi Thầy AI</span>
            </button>

            <Link
              href="/products"
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              title="Xem các khóa học"
            >
              <PenTool className="w-4 h-4 text-stone-600" />
            </Link>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl text-[11px] text-amber-900 border border-amber-200/60 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Thuật toán lặp lại ngắt quãng SRS kết hợp Thầy Giáo AI giải đáp ngữ pháp 24/7.
            </span>
          </div>
        </div>
      </Tilt3DCard>
    </div>
  );
}
