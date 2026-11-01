"use client";

import React, { useState } from "react";
import { COMMON_RADICALS, RadicalItem } from "@/data/radicals-data";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  BookOpen,
  Search,
  Sparkles,
  Volume2,
  ChevronRight,
  Lightbulb,
  Layers,
} from "lucide-react";

export function RadicalsExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStroke, setSelectedStroke] = useState<number | null>(null);
  const [activeRadical, setActiveRadical] = useState<RadicalItem>(COMMON_RADICALS[0]);

  const filteredRadicals = COMMON_RADICALS.filter((rad) => {
    const matchesSearch =
      rad.radical.includes(searchTerm) ||
      rad.sinoVietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rad.meaningVn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rad.pinyin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStroke = selectedStroke ? rad.strokeCount === selectedStroke : true;

    return matchesSearch && matchesStroke;
  });

  const playSound = (zh: string) => {
    soundManager.playClick();
    audioEngine.speak(zh, { rate: 1.0 });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-700 via-amber-800 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phương Pháp Nhớ Chữ Hán Vĩnh Viễn</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            214 Bộ Thủ & Chiết Tự Chữ Hán Thông Minh
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Chữ Hán không phải là những nét vẽ tùy tiện mà được ghép từ 214 Bộ Thủ mang ý nghĩa triết học thâm sâu. Hiểu câu chuyện chiết tự sẽ giúp bạn nhớ hàng nghìn chữ Hán chỉ sau một lần đọc.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-10 font-hanzi text-9xl text-white/10 select-none font-black pointer-events-none">
          部首
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên bộ thủ (Nhân, Thủy...), chữ Hán, nghĩa..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Stroke Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <span className="text-xs font-bold text-stone-400 mr-1 whitespace-nowrap">Nét:</span>
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedStroke(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedStroke === null
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Tất cả
          </button>
          {[2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => {
                soundManager.playClick();
                setSelectedStroke(s);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStroke === s
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {s} nét
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left List + Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Radical Grid */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Danh Sách Bộ Thủ ({filteredRadicals.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
            {filteredRadicals.map((rad) => {
              const isSelected = activeRadical.id === rad.id;
              return (
                <button
                  key={rad.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveRadical(rad);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "bg-amber-50 border-amber-500 shadow-xs"
                      : "bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-stone-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-hanzi text-3xl font-black text-amber-700">
                      {rad.radical}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-stone-900 block truncate max-w-[100px]">
                        Bộ {rad.sinoVietnamese.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono block">
                        {rad.strokeCount} nét • [{rad.pinyin}]
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-amber-600 translate-x-0.5" : "text-stone-300"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Radical Etymology Deep Dive */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6 sticky top-24">
          {/* Radical Header */}
          <div className="flex items-start justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center font-hanzi text-4xl font-black text-amber-700 shadow-inner">
                {activeRadical.radical}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-stone-900">
                    Bộ {activeRadical.sinoVietnamese}
                  </h2>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    {activeRadical.strokeCount} nét
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                  <span className="font-mono text-amber-800 font-bold">Pinyin: [{activeRadical.pinyin}]</span>
                  <span>•</span>
                  <span>Ý nghĩa: <strong>{activeRadical.meaningVn}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => playSound(activeRadical.radical)}
              className="p-2.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
              title="Phát âm bộ thủ"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
            <strong className="text-stone-900 block mb-1">Đặc điểm nhận diện:</strong>
            {activeRadical.description}
          </div>

          {/* Etymological Character Examples (Chiết Tự) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Câu Chuyện Chiết Tự Của Các Chữ Thuộc Bộ Này</span>
            </div>

            <div className="space-y-3">
              {activeRadical.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/80 space-y-2 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-hanzi text-3xl font-black text-amber-800">
                        {ex.zh}
                      </span>
                      <div>
                        <span className="font-bold text-stone-900 text-sm">
                          {ex.vn}
                        </span>
                        <span className="text-xs font-mono text-stone-500 block">
                          [{ex.pinyin}]
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => playSound(ex.zh)}
                      className="p-2 rounded-xl text-amber-700 hover:bg-amber-100 transition-colors"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed pt-1 border-t border-amber-200/50">
                    💡 <strong>Câu chuyện nhớ chữ: </strong> {ex.story}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
