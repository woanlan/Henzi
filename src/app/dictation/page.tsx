"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DICTATION_DATABASE, DictationSentence } from "@/data/dictation";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Headphones,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function DictationPage() {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<0.75 | 1.0>(1.0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);

  const sentencesForLevel = DICTATION_DATABASE.filter((s) => s.hskLevel === selectedLevel);
  const currentSentence: DictationSentence = sentencesForLevel[currentIndex] || sentencesForLevel[0] || DICTATION_DATABASE[0];

  const handlePlayAudio = (rate: 0.75 | 1.0 = playSpeed) => {
    try {
      soundManager.playClick();
      audioEngine.speak(currentSentence.sentenceZh, { rate });
    } catch {}
  };

  // Play audio on sentence load
  useEffect(() => {
    setUserInput("");
    setIsSubmitted(false);
    setShowHint(false);
    const timer = setTimeout(() => {
      handlePlayAudio(playSpeed);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIndex, selectedLevel]);

  // Clean strings for comparison
  const targetChars = currentSentence.sentenceZh.replace(/[^\u4e00-\u9fa5]/g, "").split("");
  const userChars = userInput.replace(/[^\u4e00-\u9fa5]/g, "").split("");

  let correctCount = 0;
  targetChars.forEach((ch, idx) => {
    if (userChars[idx] === ch) correctCount++;
  });
  const accuracy = Math.round((correctCount / Math.max(1, targetChars.length)) * 100);

  const handleCheckAnswer = () => {
    if (!userInput.trim()) return;
    setIsSubmitted(true);
    if (accuracy >= 90) {
      soundManager.playSuccess();
      setStreakCount((prev) => prev + 1);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } else {
      soundManager.playError();
      setStreakCount(0);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex < sentencesForLevel.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
              <Headphones className="w-3.5 h-3.5 text-amber-600" />
              <span>Phòng Luyện Chép Chính Tả (听写 Dictation Lab)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Luyện Tai Nghe & Gõ Chữ Hán
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Nghe câu phát âm chuẩn bản xứ và gõ lại bằng chữ Hán để rèn luyện phản xạ ghi nhớ sâu mặt chữ.
            </p>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl shrink-0">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedLevel(lvl);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200"
                }`}
              >
                HSK {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE CARD */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-10 space-y-8">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900">
                Câu {currentIndex + 1} / {sentencesForLevel.length}
              </span>
              <span>•</span>
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                HSK {selectedLevel}
              </span>
            </div>

            {streakCount > 0 && (
              <div className="flex items-center gap-1 font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                <span>🔥 Chuỗi đúng: {streakCount} câu</span>
              </div>
            )}
          </div>

          {/* AUDIO CONTROLS SECTION */}
          <div className="flex flex-col items-center justify-center space-y-5 py-4">
            <div className="relative group">
              <button
                onClick={() => handlePlayAudio(playSpeed)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-amber-100 group-hover:ring-amber-200"
                title="Bấm để nghe audio (Phím tắt: Space)"
              >
                <Volume2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </button>
            </div>

            {/* Speed Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setPlaySpeed(1.0);
                  handlePlayAudio(1.0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  playSpeed === 1.0
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                1.0x (Tốc độ thường)
              </button>
              <button
                onClick={() => {
                  setPlaySpeed(0.75);
                  handlePlayAudio(0.75);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  playSpeed === 0.75
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                0.75x (Nghe chậm)
              </button>
            </div>
          </div>

          {/* INPUT TYPING FIELD */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">
                Gõ câu bạn nghe được bằng chữ Hán (hoặc gõ Pinyin có dấu):
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-amber-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showHint ? "Ẩn từ gợi ý" : "Xem từ gợi ý"}</span>
              </button>
            </div>

            {showHint && (
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-wrap gap-2 text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Từ khóa trong câu:
                </span>
                {currentSentence.hintVocabulary.map((hint, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-white border border-amber-200/80 text-stone-800 shadow-2xs"
                  >
                    <b className="font-hanzi text-sm">{hint.word}</b> ({hint.pinyin}: {hint.meaningVn})
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <textarea
                rows={3}
                disabled={isSubmitted}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isSubmitted) handleCheckAnswer();
                  }
                }}
                placeholder="Ví dụ: 明天你想去..."
                className="w-full p-4 rounded-2xl border-2 border-stone-200 focus:border-amber-500 focus:outline-none font-hanzi text-lg sm:text-xl text-stone-900 leading-relaxed placeholder:font-sans placeholder:text-stone-300 resize-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => handlePlayAudio(playSpeed)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nghe lại</span>
            </button>

            {!isSubmitted ? (
              <button
                disabled={!userInput.trim()}
                onClick={handleCheckAnswer}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Kiểm Tra Đáp Án</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Câu Tiếp Theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* REAL-TIME COMPARISON RESULT MODAL / BOX */}
          {isSubmitted && (
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
                <div className="flex items-center gap-2">
                  {accuracy >= 90 ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Chính xác tuyệt vời! ({accuracy}%)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-700 font-black text-sm">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Cần chú ý thêm ({accuracy}% đúng)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Character Diff Rendering */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Đối Chiếu Từng Ký Tự:
                </span>
                <div className="flex flex-wrap gap-1.5 font-hanzi text-2xl font-bold">
                  {targetChars.map((targetChar, idx) => {
                    const userChar = userChars[idx];
                    const isMatch = userChar === targetChar;

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border ${
                          isMatch
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-800"
                        }`}
                      >
                        <span>{targetChar}</span>
                        <span className="text-[10px] font-mono mt-0.5 opacity-80">
                          {userChar ? (isMatch ? "✓" : userChar) : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Original Sentence & Meaning */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5">
                <p className="font-hanzi text-lg font-bold text-stone-900">
                  {currentSentence.sentenceZh}
                </p>
                <p className="text-xs text-amber-800 font-mono">
                  {currentSentence.sentencePinyin}
                </p>
                <p className="text-xs text-stone-600 italic">
                  Dịch nghĩa: {currentSentence.sentenceVn}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
