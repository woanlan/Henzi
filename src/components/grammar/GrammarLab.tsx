"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { GRAMMAR_DATA } from "@/data/grammar";
import { WORD_DISCRIMINATION_PAIRS, WordDiscriminationPair } from "@/data/word-discrimination";
import { GrammarTopic } from "@/types";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  GraduationCap,
  Search,
  BookOpen,
  Volume2,
  AlertTriangle,
  GitCompare,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Check,
} from "lucide-react";

export function GrammarLab() {
  const { currentHskLevel, audioSpeed, addXP } = useApp();
  const [activeTab, setActiveTab] = useState<'grammar' | 'discrimination'>('grammar');
  
  // Grammar state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarTopic>(GRAMMAR_DATA[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Discrimination state
  const [selectedPair, setSelectedPair] = useState<WordDiscriminationPair>(WORD_DISCRIMINATION_PAIRS[0]);
  const [discrimQuizAnswer, setDiscrimQuizAnswer] = useState<number | null>(null);
  const [discrimSubmitted, setDiscrimSubmitted] = useState(false);

  const filteredGrammar = GRAMMAR_DATA.filter((item) => {
    if (!searchQuery.trim()) return item.hskLevel <= currentHskLevel;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.titleVn.toLowerCase().includes(query) ||
      item.pattern.toLowerCase().includes(query) ||
      item.explanationVn.toLowerCase().includes(query) ||
      item.searchKeywords.some((k) => k.toLowerCase().includes(query))
    );
  });

  const speak = (zh: string) => {
    soundManager.playClick();
    audioEngine.speak(zh, { rate: audioSpeed });
  };

  const handleSelectQuizOption = (exerciseIdx: number, optionIdx: number) => {
    soundManager.playClick();
    setQuizAnswers((prev) => ({ ...prev, [exerciseIdx]: optionIdx }));
  };

  const handleCheckQuiz = (exerciseIdx: number, correctIdx: number) => {
    setQuizSubmitted((prev) => ({ ...prev, [exerciseIdx]: true }));
    if (quizAnswers[exerciseIdx] === correctIdx) {
      soundManager.playSuccess();
      addXP(15);
    } else {
      soundManager.playError();
    }
  };

  const handleSelectPair = (pair: WordDiscriminationPair) => {
    soundManager.playClick();
    setSelectedPair(pair);
    setDiscrimQuizAnswer(null);
    setDiscrimSubmitted(false);
  };

  const handleCheckDiscrimQuiz = () => {
    setDiscrimSubmitted(true);
    if (discrimQuizAnswer === selectedPair.quiz.correctIndex) {
      soundManager.playSuccess();
      addXP(20);
    } else {
      soundManager.playError();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Main Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-600" />
            <span>Ngữ Pháp & Phân Biệt Từ Gần Nghĩa HSK</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Bách khoa toàn thư cấu trúc ngữ pháp và chuyên đề bẫy từ đồng nghĩa (近义词辨析)
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('grammar');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'grammar'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Cấu Trúc Ngữ Pháp</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('discrimination');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'discrimination'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Phân Biệt Từ (辨析)</span>
            <span className="text-[10px] px-1 py-0.2 rounded-full bg-amber-500/30 text-white font-black">
              HOT
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: GRAMMAR POINTS */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm ngữ pháp: 是, 把, 吗, mặc dù..."
              className="w-full px-4 py-2.5 pl-10 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Grammar Topic List */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-2 max-h-[600px] overflow-y-auto">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 block mb-2">
                Chủ Điểm Ngữ Pháp ({filteredGrammar.length})
              </span>

              {filteredGrammar.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGrammar(topic);
                    setQuizAnswers({});
                    setQuizSubmitted({});
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 cursor-pointer ${
                    selectedGrammar.id === topic.id
                      ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300/30 text-amber-950 font-semibold"
                      : "bg-white border-stone-200/80 hover:bg-stone-50 text-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">
                      {topic.title}
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                      HSK {topic.hskLevel}
                    </span>
                  </div>
                  <span className="text-stone-500 font-mono text-[11px]">
                    {topic.pattern}
                  </span>
                </button>
              ))}
            </div>

            {/* Right Column: Detailed Grammar Explanation */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    HSK {selectedGrammar.hskLevel}
                  </span>
                  <h2 className="text-xl font-bold text-stone-900">
                    {selectedGrammar.title}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-amber-800 mt-2 font-mono bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 inline-block">
                  {selectedGrammar.pattern}
                </p>
              </div>

              {/* Explanation */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Giải Thích Ngữ Pháp</span>
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {selectedGrammar.explanationVn}
                </p>
              </div>

              {/* Usage Conditions */}
              {selectedGrammar.usageConditions && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1">
                  <span className="font-bold text-stone-800 uppercase text-[10px] tracking-wider block">
                    Điều Kiện & Ngữ Cảnh Sử Dụng:
                  </span>
                  <p className="text-stone-600 leading-relaxed">
                    {selectedGrammar.usageConditions}
                  </p>
                </div>
              )}

              {/* Example Sentences */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Mẫu Câu Ví Dụ Thực Tế</span>
                </h3>

                <div className="space-y-2">
                  {selectedGrammar.examples.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="font-hanzi text-base font-bold text-stone-900">
                          {ex.sentenceZh}
                        </div>
                        <div className="font-mono text-amber-800 text-xs font-medium">
                          {ex.sentencePinyin}
                        </div>
                        <div className="text-stone-700 font-medium">
                          {ex.sentenceVn}
                        </div>
                        {ex.analysisNotes && (
                          <div className="text-[11px] text-stone-500 italic pt-1">
                            → {ex.analysisNotes}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => speak(ex.sentenceZh)}
                        className="p-2 rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
                        title="Phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes & Comparison */}
              {(selectedGrammar.commonMistakes || selectedGrammar.comparison) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {selectedGrammar.commonMistakes && (
                    <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-xs text-red-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-red-800">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>Lỗi Thường Gặp Của Người Việt</span>
                      </div>
                      <p className="leading-relaxed">{selectedGrammar.commonMistakes}</p>
                    </div>
                  )}
                  {selectedGrammar.comparison && (
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-blue-800">
                        <GitCompare className="w-4 h-4 text-blue-600" />
                        <span>So Sánh Ngữ Pháp Tương Đồng</span>
                      </div>
                      <p className="leading-relaxed">{selectedGrammar.comparison}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Practice Quizzes */}
              {selectedGrammar.exercises && selectedGrammar.exercises.length > 0 && (
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Bài Tập Trắc Nghiệm Củng Cố</span>
                  </h3>

                  {selectedGrammar.exercises.map((ex, eIdx) => {
                    const isSubmitted = quizSubmitted[eIdx];
                    const selectedOpt = quizAnswers[eIdx];

                    return (
                      <div
                        key={eIdx}
                        className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-3"
                      >
                        <p className="font-semibold text-stone-900">{ex.question}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ex.options.map((opt, oIdx) => {
                            let btnStyle = "bg-white border-stone-200 hover:bg-stone-100 text-stone-800";
                            if (isSubmitted) {
                              if (oIdx === ex.correctIndex) {
                                btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold";
                              } else if (selectedOpt === oIdx) {
                                btnStyle = "bg-red-100 border-red-400 text-red-900 font-bold";
                              }
                            } else if (selectedOpt === oIdx) {
                              btnStyle = "bg-amber-100 border-amber-400 text-amber-900 font-bold";
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={isSubmitted}
                                onClick={() => handleSelectQuizOption(eIdx, oIdx)}
                                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${btnStyle}`}
                              >
                                <span className="font-hanzi">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {!isSubmitted ? (
                          <button
                            disabled={selectedOpt === undefined}
                            onClick={() => handleCheckQuiz(eIdx, ex.correctIndex)}
                            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Kiểm Tra Đáp Án
                          </button>
                        ) : (
                          <div className="p-2.5 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: WORD DISCRIMINATION (近义词辨析) */}
      {activeTab === 'discrimination' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Pairs List */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 block mb-2">
              Các Cặp Từ Dễ Nhầm Lẫn ({WORD_DISCRIMINATION_PAIRS.length})
            </span>

            {WORD_DISCRIMINATION_PAIRS.map((pair) => {
              const isSelected = pair.id === selectedPair.id;
              return (
                <button
                  key={pair.id}
                  onClick={() => handleSelectPair(pair)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1 cursor-pointer ${
                    isSelected
                      ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300/30 text-amber-950 font-semibold"
                      : "bg-white border-stone-200/80 hover:bg-stone-50 text-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-hanzi font-black text-stone-900 text-base">
                      {pair.pair[0]} vs {pair.pair[1]}
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                      HSK {pair.hskLevel}
                    </span>
                  </div>
                  <span className="text-stone-500 text-[11px]">
                    {pair.titleVn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Comparison Detail & Interactive Quiz */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-6">
            {/* Header & Core Difference */}
            <div className="border-b border-stone-100 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  HSK {selectedPair.hskLevel}
                </span>
                <h2 className="text-xl font-black text-stone-900">
                  {selectedPair.titleVn}
                </h2>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs font-semibold">
                <b>Khác biệt cốt lõi:</b> {selectedPair.coreDifferenceVn}
              </div>
            </div>

            {/* Side-by-Side Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedPair.words.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-hanzi text-2xl font-black text-stone-900">
                          {item.word}
                        </span>
                        <span className="text-xs font-bold text-amber-700">
                          {item.pinyin}
                        </span>
                      </div>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-bold inline-block mt-1">
                        {item.partOfSpeech}
                      </span>
                    </div>

                    <button
                      onClick={() => speak(item.word)}
                      className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Phát âm từ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-800 font-medium">
                    {item.definitionVn}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Đặc điểm sử dụng:
                    </span>
                    <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                      {item.uniqueUsage.map((u, uIdx) => (
                        <li key={uIdx} className="leading-snug">{u}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Example */}
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-hanzi font-bold text-stone-900 text-sm">
                        {item.exampleZh}
                      </span>
                      <button
                        onClick={() => speak(item.exampleZh)}
                        className="text-stone-400 hover:text-amber-700 cursor-pointer"
                        title="Nghe ví dụ"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-800 font-mono">{item.examplePinyin}</p>
                    <p className="text-[11px] text-stone-500">{item.exampleVn}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trap Note */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-900 mb-0.5">Bí kíp thi HSK không bao giờ sai:</span>
                <p>{selectedPair.trapNote}</p>
              </div>
            </div>

            {/* Interactive Mini Quiz */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                  Thử Tài Phân Biệt Ngay (Chọn từ điền vào chỗ trống)
                </h3>
              </div>

              <div className="space-y-1">
                <p className="font-hanzi text-base font-bold text-stone-900">
                  {selectedPair.quiz.sentenceWithBlank}
                </p>
                <p className="text-xs text-amber-800 font-mono">
                  {selectedPair.quiz.pinyinWithBlank}
                </p>
                <p className="text-xs text-stone-500">
                  {selectedPair.quiz.translationVn}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {selectedPair.quiz.options.map((opt, oIdx) => {
                  const isSelected = discrimQuizAnswer === oIdx;
                  const isCorrect = oIdx === selectedPair.quiz.correctIndex;

                  let style = "bg-white border-stone-200 hover:bg-stone-100 text-stone-800";
                  if (discrimSubmitted) {
                    if (isCorrect) {
                      style = "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold";
                    } else if (isSelected && !isCorrect) {
                      style = "bg-red-100 border-red-400 text-red-900 line-through";
                    }
                  } else if (isSelected) {
                    style = "bg-amber-100 border-amber-500 text-amber-900 font-bold";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={discrimSubmitted}
                      onClick={() => {
                        soundManager.playClick();
                        setDiscrimQuizAnswer(oIdx);
                      }}
                      className={`p-3 rounded-xl border text-center font-hanzi text-base font-bold transition-all cursor-pointer ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!discrimSubmitted ? (
                <button
                  disabled={discrimQuizAnswer === null}
                  onClick={handleCheckDiscrimQuiz}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Kiểm Tra Đáp Án
                </button>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-950 border border-amber-200">
                  <span className="font-bold block text-amber-900 mb-1">Giải thích chi tiết:</span>
                  <p>{selectedPair.quiz.explanationVn}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
