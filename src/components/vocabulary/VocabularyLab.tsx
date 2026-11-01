"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { VocabularyItem } from "@/types";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Zap,
  Volume2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCw,
  Search,
  BookMarked,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function VocabularyLab() {
  const {
    currentHskLevel,
    vocabulary,
    userSrsMap,
    notebookIds,
    toggleNotebook,
    recordReview,
    audioSpeed,
  } = useApp();

  // Active view: "flashcards" | "quiz" | "notebook" | "all"
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz" | "notebook" | "all">("flashcards");
  const [quizMode, setQuizMode] = useState<"zh_to_vn" | "vn_to_zh" | "pinyin_to_zh" | "audio_to_word">("zh_to_vn");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);

  // Flashcard states
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filtered vocabulary by level
  const levelVocab = vocabulary.filter((v) => v.hskLevel === currentHskLevel);
  const displayVocab = activeTab === "notebook"
    ? vocabulary.filter((v) => notebookIds.has(v.id))
    : levelVocab;

  const filteredVocab = displayVocab.filter((v) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      v.simplified.includes(query) ||
      v.pinyin.toLowerCase().includes(query) ||
      v.meaningVn.toLowerCase().includes(query) ||
      v.meaningEn.toLowerCase().includes(query)
    );
  });

  const currentCard = filteredVocab[cardIndex] || filteredVocab[0];

  // Quiz states
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizAnswerChecked, setQuizAnswerChecked] = useState(false);

  const speak = (text: string) => {
    soundManager.playClick();
    audioEngine.speak(text, { rate: audioSpeed });
  };

  const handleRating = (rating: number) => {
    if (!currentCard) return;
    recordReview(currentCard.id, rating);
    setIsFlipped(false);
    if (cardIndex < filteredVocab.length - 1) {
      setCardIndex((prev) => prev + 1);
    } else {
      setCardIndex(0);
    }
  };

  // Generate 4 multiple-choice options inside useEffect
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!currentCard) return;
    let correct = "";
    if (quizMode === "zh_to_vn") correct = currentCard.meaningVn;
    else if (quizMode === "vn_to_zh" || quizMode === "pinyin_to_zh" || quizMode === "audio_to_word") correct = currentCard.simplified;

    const wrongs = vocabulary
      .filter((v) => v.id !== currentCard.id)
      .slice(0, 3)
      .map((v) => (quizMode === "zh_to_vn" ? v.meaningVn : v.simplified));

    const combined = [correct, ...wrongs];
    const rotated = combined.slice(1).concat(combined[0]);
    setCurrentOptions(rotated);
  }, [currentCard?.id, quizMode, vocabulary]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Tab Switcher & Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 fill-amber-500" />
            <span>Kho Từ Vựng HSK {currentHskLevel} & Flashcard SRS</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Ứng dụng thuật toán lặp lại ngắt quãng SuperMemo SM-2 giúp ghi nhớ từ vựng vĩnh viễn
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "flashcards" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Thẻ Flashcard SRS
          </button>
          <button
            onClick={() => {
              setActiveTab("quiz");
              setQuizSelectedAnswer(null);
              setQuizAnswerChecked(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "quiz" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Luyện Trắc Nghiệm
          </button>
          <button
            onClick={() => setActiveTab("notebook")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "notebook" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Sổ Tay ({notebookIds.size})</span>
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "all" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Tra Cứu Tất Cả
          </button>
        </div>
      </div>

      {/* 1. FLASHCARD SRS MODE */}
      {activeTab === "flashcards" && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>
              Thẻ {cardIndex + 1} / {filteredVocab.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                HSK {currentCard.hskLevel}
              </span>
              <button
                onClick={() => toggleNotebook(currentCard.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  notebookIds.has(currentCard.id)
                    ? "bg-amber-100 border-amber-300 text-amber-800"
                    : "border-stone-200 text-stone-400 hover:text-stone-600"
                }`}
                title="Lưu vào sổ tay từ vựng"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive 3D Flip Flashcard */}
          <div
            onClick={() => {
              soundManager.playClick();
              setIsFlipped(!isFlipped);
            }}
            className="w-full min-h-[340px] bg-white rounded-3xl border border-stone-200 shadow-sm p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400/80 transition-all select-none relative group"
          >
            <span className="absolute top-4 right-4 text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
              {isFlipped ? "Mặt Sau (Nghĩa)" : "Mặt Trước (Nhấn để lật thẻ)"}
            </span>

            {!isFlipped ? (
              // Front: Chinese Characters
              <div className="space-y-4 my-auto">
                <div className="font-hanzi text-7xl font-extrabold text-stone-900 tracking-wider">
                  {currentCard.simplified}
                </div>
                {currentCard.traditional && currentCard.traditional !== currentCard.simplified && (
                  <div className="text-xs text-stone-400">
                    Phồn thể: <span className="font-hanzi font-semibold">{currentCard.traditional}</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium group-hover:bg-amber-50 group-hover:text-amber-800 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Nhấn để xem Pinyin & Nghĩa tiếng Việt</span>
                </div>
              </div>
            ) : (
              // Back: Pinyin, Vietnamese & Example Sentence
              <div className="space-y-4 my-auto animate-fadeIn w-full">
                <div className="font-hanzi text-5xl font-bold text-stone-900">
                  {currentCard.simplified}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl font-mono font-bold text-amber-700">
                    {currentCard.pinyin}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentCard.simplified);
                    }}
                    className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-lg font-bold text-stone-800 pt-2 border-t border-stone-100">
                  {currentCard.meaningVn}
                </div>
                <div className="text-xs text-stone-400">
                  English: {currentCard.meaningEn} • {currentCard.partOfSpeech}
                </div>

                {/* Example sentence */}
                {currentCard.examples?.[0] && (
                  <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-left text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-400 uppercase text-[10px]">Ví dụ:</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(currentCard.examples[0].sentenceZh);
                        }}
                        className="text-amber-700 hover:text-amber-800"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-hanzi text-stone-900 font-medium">
                      {currentCard.examples[0].sentenceZh}
                    </div>
                    <div className="text-amber-800 font-mono text-[11px]">
                      {currentCard.examples[0].sentencePinyin}
                    </div>
                    <div className="text-stone-600">
                      {currentCard.examples[0].sentenceVn}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SM-2 SRS Review Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block text-center">
              Đánh giá độ ghi nhớ để thuật toán xếp lịch ôn tập:
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleRating(1)}
                className="py-3 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 font-bold text-xs flex flex-col items-center gap-1 transition-colors shadow-2xs"
              >
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Từ Khó (Quên)</span>
                <span className="text-[10px] font-normal text-red-600">Ôn lại ngay mai</span>
              </button>
              <button
                onClick={() => handleRating(3)}
                className="py-3 px-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex flex-col items-center gap-1 transition-colors shadow-2xs"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Đang Học (Gợi nhớ)</span>
                <span className="text-[10px] font-normal text-amber-700">Ôn sau 3 ngày</span>
              </button>
              <button
                onClick={() => handleRating(5)}
                className="py-3 px-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex flex-col items-center gap-1 transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã Thuộc (Nhớ rõ)</span>
                <span className="text-[10px] font-normal text-emerald-700">Ôn sau 7 ngày</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. QUIZ MODE */}
      {activeTab === "quiz" && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Quiz Mode Selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: "zh_to_vn", label: "Chữ Hán → Nghĩa Việt" },
              { id: "vn_to_zh", label: "Nghĩa Việt → Chữ Hán" },
              { id: "pinyin_to_zh", label: "Pinyin → Chữ Hán" },
              { id: "audio_to_word", label: "Âm thanh → Chữ Hán" },
            ].map((m) => (
              <button
                key={m.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setQuizMode(m.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  quizMode === m.id
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Quiz Question Card */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center space-y-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Câu hỏi trắc nghiệm từ vựng
            </span>

            {quizMode === "zh_to_vn" && (
              <div className="font-hanzi text-6xl font-bold text-stone-900 my-4">
                {currentCard.simplified}
              </div>
            )}

            {quizMode === "vn_to_zh" && (
              <div className="text-2xl font-bold text-stone-900 my-4">
                &ldquo;{currentCard.meaningVn}&rdquo;
              </div>
            )}

            {quizMode === "pinyin_to_zh" && (
              <div className="font-mono text-3xl font-bold text-amber-700 my-4">
                {currentCard.pinyin}
              </div>
            )}

            {quizMode === "audio_to_word" && (
              <div className="my-4">
                <button
                  onClick={() => speak(currentCard.simplified)}
                  className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md transition-transform hover:scale-105"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
                <p className="text-xs text-stone-500 mt-2">Bấm loa để nghe phát âm</p>
              </div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {currentOptions.map((opt, idx) => {
                let btnStyle = "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800";
                const isCorrect =
                  quizMode === "zh_to_vn"
                    ? opt === currentCard.meaningVn
                    : opt === currentCard.simplified;

                if (quizAnswerChecked) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold";
                  } else if (quizSelectedAnswer === opt) {
                    btnStyle = "bg-red-100 border-red-400 text-red-900 font-bold";
                  }
                } else if (quizSelectedAnswer === opt) {
                  btnStyle = "bg-amber-100 border-amber-400 text-amber-900 font-bold";
                }

                return (
                  <button
                    key={idx}
                    disabled={quizAnswerChecked}
                    onClick={() => {
                      soundManager.playClick();
                      setQuizSelectedAnswer(opt);
                    }}
                    className={`p-4 rounded-xl border text-sm text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span className="font-hanzi text-base">{opt}</span>
                    {quizAnswerChecked && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Check Button */}
            {!quizAnswerChecked ? (
              <button
                disabled={!quizSelectedAnswer}
                onClick={() => {
                  setQuizAnswerChecked(true);
                  const isCorrect =
                    quizMode === "zh_to_vn"
                      ? quizSelectedAnswer === currentCard.meaningVn
                      : quizSelectedAnswer === currentCard.simplified;
                  if (isCorrect) {
                    soundManager.playSuccess();
                  } else {
                    soundManager.playError();
                  }
                }}
                className="mt-6 px-8 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-sm transition-all shadow-xs"
              >
                Kiểm Tra Đáp Án
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizSelectedAnswer(null);
                  setQuizAnswerChecked(false);
                  if (cardIndex < filteredVocab.length - 1) {
                    setCardIndex((prev) => prev + 1);
                  } else {
                    setCardIndex(0);
                  }
                }}
                className="mt-6 px-8 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-xs"
              >
                Câu Kế Tiếp →
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. TABLE / SEARCH / NOTEBOOK VIEW */}
      {(activeTab === "all" || activeTab === "notebook") && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo chữ Hán, Pinyin hoặc nghĩa tiếng Việt..."
              className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
          </div>

          {/* Vocabulary Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Chữ Hán</th>
                  <th className="py-3 px-4">Pinyin</th>
                  <th className="py-3 px-4">Nghĩa Tiếng Việt</th>
                  <th className="py-3 px-4">Cấp độ</th>
                  <th className="py-3 px-4">Bộ thủ</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredVocab.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-hanzi text-lg font-bold text-stone-900">
                        {item.simplified}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-800 font-medium">
                      {item.pinyin}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800">
                      {item.meaningVn}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        HSK {item.hskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {item.radical || "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => speak(item.simplified)}
                          className="p-1.5 rounded hover:bg-stone-200/60 text-amber-700"
                          title="Phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleNotebook(item.id)}
                          className={`p-1.5 rounded hover:bg-stone-200/60 transition-colors ${
                            notebookIds.has(item.id)
                              ? "text-amber-600"
                              : "text-stone-300 hover:text-stone-500"
                          }`}
                          title="Lưu sổ tay"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
