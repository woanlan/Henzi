"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { READING_ARTICLES, ReadingArticle, ReadingGlossaryItem } from "@/data/reading";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Languages,
  Check,
} from "lucide-react";

export default function ReadingLabPage() {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(READING_ARTICLES[0].id);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [activeGlossary, setActiveGlossary] = useState<ReadingGlossaryItem | null>(null);
  
  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const article = READING_ARTICLES.find((a) => a.id === selectedArticleId) || READING_ARTICLES[0];

  const handleSelectArticle = (id: string) => {
    soundManager.playClick();
    setSelectedArticleId(id);
    setUserAnswers({});
    setQuizSubmitted(false);
    setActiveGlossary(null);
  };

  const handleSpeak = (text: string) => {
    try {
      soundManager.playClick();
      audioEngine.speak(text);
    } catch {}
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    soundManager.playClick();
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    soundManager.playCorrect();
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    soundManager.playClick();
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    article.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return { correct, total: article.questions.length };
  };

  const scoreInfo = calculateScore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Phòng Luyện Đọc Hiểu Đa Tầng HSK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Đọc Hiểu Tương Tác & Bóc Tách Chữ Hán
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Rèn luyện phản xạ đọc văn bản thực tế, tra cứu từ mới trực tiếp và kiểm tra mức độ thấu hiểu bài đọc.
            </p>
          </div>

          {/* ARTICLE SWITCHER PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {READING_ARTICLES.map((a) => (
              <button
                key={a.id}
                onClick={() => handleSelectArticle(a.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  a.id === selectedArticleId
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span className="px-1.5 py-0.5 rounded-md bg-black/15 text-[10px] font-black">
                  HSK {a.hskLevel}
                </span>
                <span>{a.titleVn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN ARTICLE WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: READING PASSAGE & CONTROLS (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-8 space-y-6">
              {/* Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                      Cấp độ HSK {article.hskLevel}
                    </span>
                    <span className="text-xs text-stone-400 font-semibold">
                      Chủ đề: {article.topic} • {article.wordCount} chữ
                    </span>
                  </div>
                  <h2 className="font-hanzi text-2xl sm:text-3xl font-black text-stone-900">
                    {article.titleZh}
                  </h2>
                  <p className="text-sm font-semibold text-amber-800">
                    {article.titlePinyin} • {article.titleVn}
                  </p>
                </div>

                {/* View Toggles & Audio */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSpeak(article.audioText)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                    title="Nghe toàn bộ bài đọc"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span className="hidden sm:inline">Nghe bài</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowPinyin(!showPinyin);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      showPinyin
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                    title="Bật/Tắt phiên âm Pinyin"
                  >
                    <span>Pinyin</span>
                    {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowTranslation(!showTranslation);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      showTranslation
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                    title="Bật/Tắt bản dịch tiếng Việt"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>Dịch</span>
                  </button>
                </div>
              </div>

              {/* Passage Content Paragraphs */}
              <div className="space-y-6 leading-relaxed">
                {article.contentZh.map((paragraphZh, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAFAF9]/80 border border-stone-100 space-y-2 hover:border-amber-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-hanzi text-lg sm:text-xl font-medium text-stone-900 tracking-wide leading-loose">
                        {paragraphZh}
                      </p>
                      <button
                        onClick={() => handleSpeak(paragraphZh)}
                        className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-colors shrink-0"
                        title="Nghe đoạn này"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {showPinyin && (
                      <p className="text-xs sm:text-sm text-amber-800 font-medium font-sans leading-normal">
                        {article.contentPinyin[idx]}
                      </p>
                    )}

                    {showTranslation && (
                      <p className="text-xs sm:text-sm text-stone-600 border-t border-stone-200/50 pt-2 font-sans italic">
                        {article.translationVn[idx]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* COMPREHENSION QUIZ SECTION */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-stone-900">
                      Bài Tập Kiểm Tra Đọc Hiểu
                    </h3>
                    <p className="text-xs text-stone-500">
                      Chọn đáp án chính xác nhất dựa trên nội dung bài đọc
                    </p>
                  </div>
                </div>

                {quizSubmitted && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                      Điểm: {scoreInfo.correct} / {scoreInfo.total} đúng
                    </span>
                    <button
                      onClick={handleResetQuiz}
                      className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                      title="Làm lại bài kiểm tra"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {article.questions.map((q, qIndex) => {
                  const selectedOpt = userAnswers[q.id];
                  const isAnswered = selectedOpt !== undefined;

                  return (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-200 space-y-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                            {qIndex + 1}
                          </span>
                          <span className="font-hanzi font-bold text-base text-stone-900">
                            {q.questionZh}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 pl-7">
                          {q.questionVn}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-7">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = selectedOpt === oIndex;
                          const isCorrect = oIndex === q.correctIndex;

                          let btnStyle = "bg-white border-stone-200 text-stone-700 hover:border-amber-300";
                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold";
                            } else if (isSelected && !isCorrect) {
                              btnStyle = "bg-rose-50 border-rose-400 text-rose-900 line-through";
                            } else {
                              btnStyle = "bg-white border-stone-200 opacity-60";
                            }
                          } else if (isSelected) {
                            btnStyle = "bg-amber-100 border-amber-500 text-amber-900 font-bold shadow-2xs";
                          }

                          return (
                            <button
                              key={oIndex}
                              disabled={quizSubmitted}
                              onClick={() => handleAnswerSelect(q.id, oIndex)}
                              className={`text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle} cursor-pointer`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                              )}
                              {quizSubmitted && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation when submitted */}
                      {quizSubmitted && (
                        <div className="pl-7 pt-2">
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                            <span className="font-bold flex items-center gap-1 text-amber-900">
                              <Sparkles className="w-3.5 h-3.5" /> Giải thích chi tiết:
                            </span>
                            <p>{q.explanationVn}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted && (
                <div className="flex justify-end pt-2">
                  <button
                    disabled={Object.keys(userAnswers).length === 0}
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Nộp Bài & Xem Điểm</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: VOCABULARY GLOSSARY SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                    Từ Vựng Trọng Tâm Bài Đọc
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold">
                  {article.glossary.length} từ
                </span>
              </div>

              <p className="text-xs text-stone-500">
                Bấm vào từng từ để nghe phát âm và xem âm Hán Việt đối ứng:
              </p>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {article.glossary.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      handleSpeak(item.word);
                      setActiveGlossary(item);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      activeGlossary?.word === item.word
                        ? "bg-amber-50 border-amber-300 shadow-2xs"
                        : "bg-stone-50/70 border-stone-200/70 hover:bg-amber-50/40 hover:border-amber-200"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-hanzi text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                          {item.word}
                        </span>
                        <span className="text-xs font-bold text-amber-700">
                          {item.pinyin}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        <span className="text-stone-400">Hán Việt: </span>
                        <span className="font-semibold text-stone-700">{item.hanViet}</span>
                        <span className="mx-1">•</span>
                        <span className="font-medium text-stone-800">{item.meaningVn}</span>
                      </div>
                    </div>

                    <button
                      className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-400 group-hover:text-amber-700 group-hover:border-amber-300 transition-colors shrink-0"
                      title="Phát âm từ vựng"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
