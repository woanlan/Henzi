"use client";

import React, { useState } from "react";
import {
  PINYIN_INITIALS,
  PINYIN_FINALS,
  PINYIN_TONES,
  VIETNAMESE_TRICKY_PAIRS,
  PinyinInitial,
} from "@/data/pinyin-data";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Volume2,
  Sparkles,
  BookOpen,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";

export function PinyinMatrix() {
  const [activeTab, setActiveTab] = useState<"initials" | "finals" | "tones" | "tricky_pairs">("initials");
  const [selectedInitial, setSelectedInitial] = useState<PinyinInitial>(PINYIN_INITIALS[0]);
  const [selectedToneBase, setSelectedToneBase] = useState<string>("ma");

  const playSound = (text: string) => {
    soundManager.playClick();
    audioEngine.speak(text, { rate: 0.9 });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nền Móng Phát Âm Chuẩn Bắc Kinh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bảng Bính Âm Pinyin Tương Tác & 4 Thanh Điệu
          </h1>
          <p className="text-amber-100/90 text-xs sm:text-sm leading-relaxed">
            Nắm vững 21 Thanh Mẫu, 36 Vận Mẫu, và quy tắc biến điệu thanh 3. Bấm vào bất kỳ âm nào để nghe người bản xứ phát âm kèm mẹo chuẩn xác cho người Việt.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-8 font-hanzi text-9xl text-white/10 select-none font-black pointer-events-none">
          拼音
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200/80 scrollbar-none">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab("initials");
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "initials"
              ? "bg-white text-stone-900 shadow-xs border border-stone-200/90"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          21 Thanh Mẫu (Phụ âm đầu)
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab("finals");
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "finals"
              ? "bg-white text-stone-900 shadow-xs border border-stone-200/90"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          Vận Mẫu (Nguyên âm)
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab("tones");
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "tones"
              ? "bg-white text-stone-900 shadow-xs border border-stone-200/90"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          4 Thanh Điệu (Tones 1–4)
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab("tricky_pairs");
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "tricky_pairs"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-amber-800 bg-amber-500/10 hover:bg-amber-500/20"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Mẹo Tránh Nhầm Cho Người Việt</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: 21 INITIALS (THANH MẪU)                           */}
      {/* ======================================================== */}
      {activeTab === "initials" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Left Grid: 21 Initials Cards */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                Bảng 21 Thanh Mẫu Chuẩn
              </h2>
              <span className="text-xs text-stone-500">
                Bấm vào ô để nghe và xem chi tiết
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {PINYIN_INITIALS.map((init) => {
                const isSelected = selectedInitial.pinyin === init.pinyin;
                return (
                  <button
                    key={init.pinyin}
                    onClick={() => {
                      setSelectedInitial(init);
                      playSound(init.exampleWord);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group relative ${
                      isSelected
                        ? "bg-amber-600 text-white border-amber-600 shadow-md scale-105 z-10"
                        : "bg-stone-50 hover:bg-amber-50/80 border-stone-200 text-stone-800"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-black font-mono leading-none">
                      {init.pinyin}
                    </span>
                    <span className={`text-[10px] font-mono ${isSelected ? "text-amber-200" : "text-stone-400"}`}>
                      {init.ipa}
                    </span>
                    <Volume2 className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isSelected ? "text-white" : "text-amber-600"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Detail Card for Selected Initial */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
                {selectedInitial.type}
              </span>
              <button
                onClick={() => playSound(selectedInitial.exampleWord)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe mẫu</span>
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className="text-5xl font-black font-mono text-stone-900 block">
                {selectedInitial.pinyin}
              </span>
              <span className="text-xs font-mono text-stone-400 block">
                Ký hiệu quốc tế: {selectedInitial.ipa}
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/80 space-y-1">
                <span className="font-bold text-stone-700 block">Mẹo phát âm cho người Việt:</span>
                <p className="text-stone-800 font-medium">{selectedInitial.vietnameseEquivalent}</p>
              </div>

              <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/60 space-y-1">
                <span className="font-bold text-amber-900 block">Khẩu hình & vị trí lưỡi:</span>
                <p className="text-stone-700">{selectedInitial.tip}</p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/80 space-y-1.5">
                <span className="font-bold text-stone-700 block">Ví dụ từ vựng thực tế:</span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-hanzi text-lg font-bold text-amber-700 block">
                      {selectedInitial.exampleZh}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">
                      Pinyin: [{selectedInitial.exampleWord}]
                    </span>
                  </div>
                  <button
                    onClick={() => playSound(selectedInitial.exampleWord)}
                    className="p-2 rounded-xl text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: FINALS (VẬN MẪU)                                  */}
      {/* ======================================================== */}
      {activeTab === "finals" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                Các Vận Mẫu Thông Dụng Trong Tiếng Hán
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Bấm vào thẻ để nghe phát âm chuẩn giọng Bắc Kinh
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {PINYIN_FINALS.map((f) => (
              <button
                key={f.pinyin}
                onClick={() => playSound(f.exampleWord)}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-stone-900 group-hover:text-amber-700">
                    {f.pinyin}
                  </span>
                  <Volume2 className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <div className="text-xs text-stone-600">
                  <span className="font-bold text-stone-700">Giống: </span>
                  {f.vietnameseEquivalent}
                </div>
                <div className="text-[11px] text-amber-800 font-mono pt-1 border-t border-stone-200/60">
                  Ví dụ: {f.exampleZh} [{f.exampleWord}]
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: 4 TONES (THANH ĐIỆU)                              */}
      {/* ======================================================== */}
      {activeTab === "tones" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-stone-900">
                Quy Luật 4 Thanh Điệu Tiếng Trung (Tones 1–4)
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Tiếng Trung là ngôn ngữ thanh điệu. Cùng một âm tiết "ma" nhưng mang 4 dấu thanh điệu khác nhau sẽ mang 4 ý nghĩa hoàn toàn khác biệt.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PINYIN_TONES.slice(0, 4).map((tone) => (
                <div
                  key={tone.toneNumber}
                  className="bg-stone-50 rounded-2xl p-5 border border-stone-200/90 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        {tone.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-400">
                        {tone.pitch}
                      </span>
                    </div>

                    <div className="text-center py-3">
                      <span className="text-4xl font-black font-mono text-amber-600 block">
                        {tone.mark}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {tone.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200">
                    <button
                      onClick={() => playSound(tone.example.split(" ")[0])}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-amber-500 hover:text-white border border-stone-200 font-bold text-xs text-stone-800 transition-all shadow-2xs cursor-pointer group"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600 group-hover:text-white" />
                      <span>Nghe: {tone.example}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Syllable Tone Practice Box */}
            <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-extrabold text-amber-950">
                  Luyện Phản Xạ 4 Thanh Điệu với âm "MA"
                </h3>
                <p className="text-xs text-amber-900/80">
                  mā (mẹ) • má (vừng) • mǎ (ngựa) • mà (mắng)
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { text: "mā", meaning: "妈 (Mẹ)" },
                  { text: "má", meaning: "麻 (Vừng)" },
                  { text: "mǎ", meaning: "马 (Ngựa)" },
                  { text: "mà", meaning: "骂 (Mắng)" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => playSound(item.text)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-600 hover:text-white text-stone-900 font-mono font-bold text-sm border border-amber-200 shadow-2xs transition-all flex flex-col items-center cursor-pointer"
                  >
                    <span>{item.text}</span>
                    <span className="text-[10px] text-stone-400 font-sans">{item.meaning.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: TRICKY PAIRS FOR VIETNAMESE LEARNERS              */}
      {/* ======================================================== */}
      {activeTab === "tricky_pairs" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Các Cặp Âm Người Việt Hay Phát Âm Nhầm Lẫn Nhất</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Người Việt thường bị cứng lưỡi ở các âm uốn lưỡi (zh, ch, sh) và âm đầu lưỡi (z, c, s). Dưới đây là bảng đối chiếu chi tiết để phân biệt rõ ràng.
            </p>
          </div>

          <div className="space-y-4">
            {VIETNAMESE_TRICKY_PAIRS.map((pair, idx) => (
              <div
                key={idx}
                className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
                  <span className="font-mono text-base font-black text-amber-700">
                    Cặp đối chiếu: {pair.pair}
                  </span>
                  <button
                    onClick={() => playSound(pair.sentencePractice)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Luyện câu mẫu</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Side */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-black text-amber-600">
                        {pair.zhSide.sound}
                      </span>
                      <button
                        onClick={() => playSound(pair.zhSide.example.split(" ")[0])}
                        className="p-1 text-stone-400 hover:text-amber-700 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-stone-800">{pair.zhSide.rule}</p>
                    <p className="text-xs text-stone-500 font-mono">Ví dụ: {pair.zhSide.example}</p>
                  </div>

                  {/* Right Side */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-black text-stone-700">
                        {pair.zSide.sound}
                      </span>
                      <button
                        onClick={() => playSound(pair.zSide.example.split(" ")[0])}
                        className="p-1 text-stone-400 hover:text-amber-700 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-stone-800">{pair.zSide.rule}</p>
                    <p className="text-xs text-stone-500 font-mono">Ví dụ: {pair.zSide.example}</p>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-2.5 rounded-xl text-xs text-amber-950 font-medium">
                  <strong>Câu luyện uốn lưỡi: </strong> {pair.sentencePractice}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
