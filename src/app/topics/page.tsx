"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TOPIC_CATEGORIES, TopicCategory, TopicWord } from "@/data/topic-vocabulary";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  ShoppingBag,
  Factory,
  Truck,
  UtensilsCrossed,
  Briefcase,
  Volume2,
  Copy,
  Check,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

export default function TopicVocabularyPage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPIC_CATEGORIES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentCategory = TOPIC_CATEGORIES.find((c) => c.id === selectedTopicId) || TOPIC_CATEGORIES[0];

  const handleSpeak = (text: string) => {
    try {
      soundManager.playClick();
      audioEngine.speak(text);
    } catch {}
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "ShoppingBag":
        return <ShoppingBag className={className} />;
      case "Factory":
        return <Factory className={className} />;
      case "Truck":
        return <Truck className={className} />;
      case "UtensilsCrossed":
        return <UtensilsCrossed className={className} />;
      case "Briefcase":
        return <Briefcase className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-9xl font-hanzi font-black select-none translate-x-12 translate-y-8">
            专
          </div>
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tiếng Trung Đi Làm & Thương Mại Thực Chiến</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Từ Vựng Chuyên Ngành & Giao Tiếp Đời Sống
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Không chỉ thi chứng chỉ HSK, việc thành thạo thuật ngữ đánh hàng 1688/Taobao, quản lý xưởng máy, xuất nhập khẩu hải quan và đàm phán phỏng vấn chính là chìa khóa mở rộng cơ hội thu nhập cho bạn.
            </p>
          </div>
        </section>

        {/* TOPIC SELECTOR TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TOPIC_CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedTopicId;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedTopicId(cat.id);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                    : "bg-white text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-amber-50/50"
                }`}
              >
                {renderIcon(cat.icon, "w-4 h-4")}
                <span>{cat.titleVn}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-amber-700/60 text-white" : "bg-stone-100 text-stone-500"}`}>
                  {cat.words.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE CATEGORY HEADER */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {currentCategory.titleVn}
              </h2>
              <span className="text-sm font-hanzi font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg">
                {currentCategory.titleZh}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-3xl">
              {currentCategory.descriptionVn}
            </p>
          </div>
          <button
            onClick={() => handleSpeak(currentCategory.titleZh)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Phát âm chủ đề</span>
          </button>
        </div>

        {/* WORD CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCategory.words.map((word) => (
            <div
              key={word.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 hover:border-amber-300 group"
            >
              <div className="space-y-3">
                {/* Header: Hanzi, Pinyin, Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-hanzi text-3xl font-black text-stone-900 group-hover:text-amber-700 transition-colors">
                      {word.simplified}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-amber-700 font-bold text-sm tracking-wide">
                        {word.pinyin}
                      </span>
                      <span className="text-stone-400 text-[11px] font-semibold">
                        Âm Hán Việt: <span className="text-stone-600">{word.hanViet}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeak(word.simplified)}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                      title="Nghe phát âm từ vựng"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(word.simplified, word.id)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                      title="Sao chép chữ Hán"
                    >
                      {copiedId === word.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Meaning & Part of Speech */}
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold">
                    {word.partOfSpeech}
                  </span>
                  <span className="text-sm font-bold text-stone-800">
                    {word.meaningVn}
                  </span>
                </div>

                {/* Example sentence */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Mẫu câu thực tế
                    </span>
                    <button
                      onClick={() => handleSpeak(word.exampleZh)}
                      className="text-amber-700 hover:text-amber-800 text-xs font-semibold flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe câu</span>
                    </button>
                  </div>
                  <p className="font-hanzi text-base font-semibold text-stone-900">
                    {word.exampleZh}
                  </p>
                  <p className="text-xs text-amber-800 font-medium">
                    {word.examplePinyin}
                  </p>
                  <p className="text-xs text-stone-600">
                    {word.exampleVn}
                  </p>
                </div>

                {/* Pro tip if exists */}
                {word.tips && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><b>Mẹo thực chiến:</b> {word.tips}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
