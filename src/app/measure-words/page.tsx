"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MEASURE_WORDS_DATABASE, MeasureWord } from "@/data/measure-words";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Layers,
  Search,
  Volume2,
  Gamepad2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Check,
} from "lucide-react";

export default function MeasureWordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeWordId, setActiveWordId] = useState<string>(MEASURE_WORDS_DATABASE[0].id);

  // Mini quiz state
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Generate quiz questions pool
  const quizPool = [
    { noun: "雨伞 (yǔsǎn - cái ô)", correct: "把", options: ["张", "把", "条", "只"], hint: "Vật có tay cầm" },
    { noun: "桌子 (zhuōzi - cái bàn)", correct: "张", options: ["张", "辆", "座", "把"], hint: "Vật có mặt phẳng" },
    { noun: "鱼 (yú - con cá)", correct: "条", options: ["件", "只", "条", "支"], hint: "Vật dài uốn lượn" },
    { noun: "衣服 (yīfu - chiếc áo)", correct: "件", options: ["件", "条", "张", "辆"], hint: "Trang phục thân trên" },
    { noun: "猫 (māo - con mèo)", correct: "只", options: ["头", "匹", "条", "只"], hint: "Loài động vật nhỏ" },
    { noun: "汽车 (qìchē - xe ô tô)", correct: "辆", options: ["艘", "架", "辆", "座"], hint: "Phương tiện có bánh" },
    { noun: "大楼 (dàlóu - tòa cao ốc)", correct: "座", options: ["所", "栋", "座", "把"], hint: "Công trình đồ sộ" },
    { noun: "笔 (bǐ - cây bút)", correct: "支", options: ["根", "张", "条", "支"], hint: "Vật hình cán que" },
  ];

  const filteredWords = MEASURE_WORDS_DATABASE.filter((mw) => {
    const matchesCat = selectedCategory === "all" || mw.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;
    return (
      matchesCat &&
      (mw.word.includes(query) ||
        mw.pinyin.toLowerCase().includes(query) ||
        mw.hanViet.toLowerCase().includes(query) ||
        mw.ruleExplanationVn.toLowerCase().includes(query) ||
        mw.collocations.some((c) => c.nounZh.includes(query) || c.nounVn.toLowerCase().includes(query)))
    );
  });

  const activeWord = MEASURE_WORDS_DATABASE.find((w) => w.id === activeWordId) || MEASURE_WORDS_DATABASE[0];

  const handleSpeak = (text: string) => {
    try {
      soundManager.playClick();
      audioEngine.speak(text);
    } catch {}
  };

  const handleAnswerQuiz = (selectedOpt: string) => {
    const currentQ = quizPool[quizQuestionIndex];
    if (selectedOpt === currentQ.correct) {
      soundManager.playSuccess();
      setQuizScore((prev) => prev + 1);
      setQuizFeedback({ isCorrect: true, text: `Chính xác! ${currentQ.correct} ${currentQ.noun.split(" ")[0]}` });
    } else {
      soundManager.playError();
      setQuizFeedback({ isCorrect: false, text: `Sai rồi! Đáp án đúng là: ${currentQ.correct} (Mẹo: ${currentQ.hint})` });
    }
  };

  const handleNextQuizQuestion = () => {
    soundManager.playClick();
    setQuizFeedback(null);
    if (quizQuestionIndex < quizPool.length - 1) {
      setQuizQuestionIndex((prev) => prev + 1);
    } else {
      setQuizQuestionIndex(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO BANNER */}
        <section className="bg-gradient-to-r from-amber-800 via-amber-700 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Bách Khoa Lượng Từ Tiếng Trung (量词大全)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Làm Chủ 50+ Lượng Từ Cốt Lõi HSK
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Khắc phục nỗi sợ mất điểm lớn nhất của người học tiếng Trung. Hiểu rõ quy tắc hình dung (vật phẳng dùng 张, vật có tay cầm dùng 把, vật uốn lượn dùng 条).
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsQuizMode(!isQuizMode);
              setQuizFeedback(null);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{isQuizMode ? "Về Tra Cứu Thư Viện" : "Chơi Thử Thách Ghép Từ"}</span>
          </button>
        </section>

        {/* MODE 1: INTERACTIVE QUIZ CHALLENGE */}
        {isQuizMode ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Câu hỏi {quizQuestionIndex + 1} / {quizPool.length}
              </span>
              <span className="text-xs font-bold text-stone-600">
                Điểm số: <b className="text-amber-600">{quizScore}</b> câu đúng
              </span>
            </div>

            <div className="text-center space-y-3 py-4">
              <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">
                Chọn lượng từ thích hợp cho danh từ sau:
              </span>
              <div className="font-hanzi text-3xl sm:text-4xl font-black text-stone-900">
                一 ____ {quizPool[quizQuestionIndex].noun.split(" ")[0]}
              </div>
              <p className="text-xs text-stone-500">
                {quizPool[quizQuestionIndex].noun}
              </p>
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-2 gap-3">
              {quizPool[quizQuestionIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={quizFeedback !== null}
                  onClick={() => handleAnswerQuiz(opt)}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-400 font-hanzi text-2xl font-black text-stone-800 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Feedback & Next */}
            {quizFeedback && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 ${
                  quizFeedback.isCorrect
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-rose-50 text-rose-900 border border-rose-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {quizFeedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span>{quizFeedback.text}</span>
                </div>
                <button
                  onClick={handleNextQuizQuestion}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black transition-colors shrink-0 cursor-pointer"
                >
                  Câu Tiếp
                </button>
              </div>
            )}
          </div>
        ) : (
          /* MODE 2: EXPLORER & DICTIONARY */
          <div className="space-y-6">
            {/* SEARCH & CATEGORY FILTER */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {[
                  { id: "all", label: "Tất Cả Lượng Từ" },
                  { id: "do_vat", label: "Đồ Vật" },
                  { id: "dong_vat", label: "Động Vật" },
                  { id: "trang_phuc", label: "Trang Phục" },
                  { id: "xe_co_nha_cua", label: "Xe Cộ & Công Trình" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm lượng từ: 把, 张, ghế, cá..."
                  className="w-full px-4 py-2 pl-9 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              </div>
            </div>

            {/* MAIN 2-COLUMN VIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: MEASURE WORD GRID (5 COLS) */}
              <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredWords.map((mw) => {
                  const isSelected = mw.id === activeWordId;
                  return (
                    <div
                      key={mw.id}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveWordId(mw.id);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5 ${
                        isSelected
                          ? "bg-amber-50 border-amber-400 ring-2 ring-amber-400/40 shadow-sm"
                          : "bg-white border-stone-200/90 hover:border-amber-300 hover:shadow-2xs"
                      }`}
                    >
                      <span className="font-hanzi text-3xl font-black text-stone-900">
                        {mw.word}
                      </span>
                      <span className="text-xs font-bold text-amber-700 font-mono">
                        {mw.pinyin}
                      </span>
                      <span className="text-[11px] text-stone-400 font-semibold">
                        Hán Việt: {mw.hanViet}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT: DETAILED COLLOCATIONS & RULES (7 COLS) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-8 space-y-6 sticky top-24">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-stone-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-hanzi text-5xl font-black text-stone-900">
                        {activeWord.word}
                      </span>
                      <span className="text-lg font-bold text-amber-700 font-mono">
                        {activeWord.pinyin}
                      </span>
                      <span className="text-xs text-stone-500 font-semibold">
                        (Âm Hán Việt: <b>{activeWord.hanViet}</b>)
                      </span>
                    </div>
                    <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold mt-1">
                      {activeWord.categoryVn}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSpeak(activeWord.word)}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                    title="Phát âm lượng từ"
                  >
                    <Volume2 className="w-5 h-5 text-amber-700" />
                  </button>
                </div>

                {/* Visual Rule */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
                  <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider block">
                    Quy tắc ghi nhớ nhanh:
                  </span>
                  <p className="leading-relaxed">{activeWord.ruleExplanationVn}</p>
                </div>

                {/* Common Collocations List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Cụm Danh Từ Thường Đi Kèm (Collocations):</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeWord.collocations.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#FAFAF9] border border-stone-200/80 hover:border-amber-300 transition-all flex items-start justify-between group"
                      >
                        <div className="space-y-1">
                          <div className="font-hanzi text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                            {item.phraseZh}
                          </div>
                          <div className="text-xs text-amber-800 font-mono">
                            {item.phrasePinyin}
                          </div>
                          <div className="text-xs text-stone-500">
                            {item.phraseVn}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSpeak(item.phraseZh)}
                          className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-400 group-hover:text-amber-700 transition-colors"
                          title="Nghe cụm từ"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
