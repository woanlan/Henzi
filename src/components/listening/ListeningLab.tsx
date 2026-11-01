"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LISTENING_DATA } from "@/data/listening";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Volume2,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from "lucide-react";

export function ListeningLab() {
  const { currentHskLevel, audioSpeed, setAudioSpeed, addXP } = useApp();
  const filteredList = LISTENING_DATA.filter((item) => item.hskLevel <= currentHskLevel);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = filteredList[currentIndex] || LISTENING_DATA[0];

  // Subtitle visibility toggles
  const [showChinese, setShowChinese] = useState(true);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showVietnamese, setShowVietnamese] = useState(false);

  // Exercise interaction
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [dictationInput, setDictationInput] = useState("");
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    soundManager.playClick();
    setIsPlaying(true);
    audioEngine.speak(currentItem.audioTextZh, {
      rate: audioSpeed,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleCheckAnswer = () => {
    let correct = false;
    if (currentItem.exerciseType === "dictation") {
      correct = dictationInput.trim() === currentItem.correctAnswer.trim();
    } else {
      correct = selectedOption === currentItem.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      soundManager.playSuccess();
      addXP(20);
    } else {
      soundManager.playError();
    }
  };

  const nextExercise = () => {
    setSelectedOption(null);
    setDictationInput("");
    setIsAnswerChecked(false);
    setIsCorrect(false);
    if (currentIndex < filteredList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Speed Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-600" />
            <span>Phòng Luyện Nghe Phổ Thông Bắc Kinh</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Luyện nghe giọng chuẩn, tùy chỉnh tốc độ và bài tập chép chính tả
          </p>
        </div>

        {/* Playback Speed Controls (0.75x, 1.0x, 1.25x) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Tốc độ:</span>
          <div className="flex items-center p-1 bg-stone-100 rounded-xl">
            {([0.75, 1.0, 1.25] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  soundManager.playClick();
                  setAudioSpeed(spd);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  audioSpeed === spd
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Audio Player Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Navigation & Level Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Bài {currentIndex + 1} / {filteredList.length}
            </span>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              HSK {currentItem.hskLevel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedOption(null);
                setDictationInput("");
                setIsAnswerChecked(false);
                setCurrentIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedOption(null);
                setDictationInput("");
                setIsAnswerChecked(false);
                setCurrentIndex((prev) => Math.min(filteredList.length - 1, prev + 1));
              }}
              disabled={currentIndex === filteredList.length - 1}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Audio Play Button & Waveform visual */}
        <div className="flex flex-col items-center justify-center py-6 border-y border-stone-100">
          <button
            onClick={playAudio}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
              isPlaying
                ? "bg-amber-500 scale-105 ring-4 ring-amber-300"
                : "bg-amber-600 hover:bg-amber-700 text-white hover:scale-105"
            }`}
          >
            {isPlaying ? (
              <Volume2 className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1 fill-white" />
            )}
          </button>
          <span className="text-xs font-semibold text-stone-600 mt-3">
            {isPlaying ? "Đang phát âm..." : "Nhấn để nghe đoạn hội thoại"}
          </span>

          {/* Subtitles Toggle Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <button
              onClick={() => setShowChinese(!showChinese)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                showChinese ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-white border-stone-200 text-stone-500"
              }`}
            >
              {showChinese ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Phụ đề Chữ Hán</span>
            </button>
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                showPinyin ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-white border-stone-200 text-stone-500"
              }`}
            >
              {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Phụ đề Pinyin</span>
            </button>
            <button
              onClick={() => setShowVietnamese(!showVietnamese)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                showVietnamese ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-white border-stone-200 text-stone-500"
              }`}
            >
              {showVietnamese ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Bản dịch Tiếng Việt</span>
            </button>
          </div>
        </div>

        {/* Subtitles Display Box */}
        {(showChinese || showPinyin || showVietnamese) && (
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2 text-center">
            {showChinese && (
              <div className="font-hanzi text-2xl font-bold text-stone-900">
                {currentItem.audioTextZh}
              </div>
            )}
            {showPinyin && (
              <div className="font-mono text-sm font-semibold text-amber-700">
                {currentItem.audioPinyin}
              </div>
            )}
            {showVietnamese && (
              <div className="text-sm font-medium text-stone-700 pt-2 border-t border-stone-200/60">
                {currentItem.audioTranslationVn}
              </div>
            )}
          </div>
        )}

        {/* Interactive Practice Question */}
        <div className="space-y-4 pt-2">
          <div className="font-bold text-base text-stone-900">
            {currentItem.question}
          </div>

          {/* Multiple choice options */}
          {currentItem.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentItem.options.map((opt, idx) => {
                let btnStyle = "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800";
                if (isAnswerChecked) {
                  if (opt === currentItem.correctAnswer) {
                    btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold";
                  } else if (selectedOption === opt) {
                    btnStyle = "bg-red-100 border-red-400 text-red-900 font-bold";
                  }
                } else if (selectedOption === opt) {
                  btnStyle = "bg-amber-100 border-amber-400 text-amber-900 font-bold";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerChecked}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedOption(opt);
                    }}
                    className={`p-3.5 rounded-xl border text-sm text-left transition-all ${btnStyle}`}
                  >
                    <span className="font-hanzi">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Dictation text input */}
          {currentItem.exerciseType === "dictation" && (
            <div className="space-y-2">
              <input
                type="text"
                disabled={isAnswerChecked}
                value={dictationInput}
                onChange={(e) => setDictationInput(e.target.value)}
                placeholder="Gõ chữ Hán bạn nghe được vào đây..."
                className="w-full px-4 py-3 text-base font-hanzi rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          )}

          {/* Action Button */}
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={
                currentItem.exerciseType === "dictation"
                  ? !dictationInput.trim()
                  : !selectedOption
              }
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-sm transition-all shadow-xs"
            >
              Kiểm Tra Kết Quả
            </button>
          ) : (
            <button
              onClick={nextExercise}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-xs"
            >
              Bài Luyện Nghe Kế Tiếp →
            </button>
          )}

          {/* Post-Exercise Explanation & Vocab Notes */}
          {isAnswerChecked && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3 animate-fadeIn text-xs text-stone-800">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Chính xác tuyệt đối! Bạn được cộng +20 XP.</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-red-600" />
                    <span>
                      Đáp án chính xác là: <span className="underline font-hanzi">{currentItem.correctAnswer}</span>
                    </span>
                  </>
                )}
              </div>

              <p className="text-stone-700">{currentItem.explanationVn}</p>

              {currentItem.vocabNotes && (
                <div className="pt-2 border-t border-amber-200/60">
                  <span className="font-bold text-stone-900 block mb-1.5">
                    Từ vựng cần nhớ trong bài:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {currentItem.vocabNotes.map((v, i) => (
                      <div key={i} className="bg-white p-2 rounded-lg border border-amber-200/50">
                        <span className="font-hanzi font-bold text-stone-900">{v.word}</span>
                        <span className="text-amber-700 font-mono ml-2">({v.pinyin})</span>: {v.meaning}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
