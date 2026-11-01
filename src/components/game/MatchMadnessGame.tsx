"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { soundManager } from "@/lib/utils";
import { audioEngine } from "@/lib/audio";
import {
  Zap,
  Timer,
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Volume2,
} from "lucide-react";

interface WordPair {
  id: string;
  zh: string;
  pinyin: string;
  vn: string;
}

const MATCH_WORD_POOL: WordPair[] = [
  { id: "w1", zh: "你好", pinyin: "nǐ hǎo", vn: "Xin chào" },
  { id: "w2", zh: "谢谢", pinyin: "xièxie", vn: "Cảm ơn" },
  { id: "w3", zh: "再见", pinyin: "zàijiàn", vn: "Tạm biệt" },
  { id: "w4", zh: "朋友", pinyin: "péngyou", vn: "Bạn bè" },
  { id: "w5", zh: "老师", pinyin: "lǎoshī", vn: "Giáo viên" },
  { id: "w6", zh: "喝茶", pinyin: "hē chá", vn: "Uống trà" },
  { id: "w7", zh: "吃饭", pinyin: "chī fàn", vn: "Ăn cơm" },
  { id: "w8", zh: "飞机", pinyin: "fēijī", vn: "Máy bay" },
  { id: "w9", zh: "天气", pinyin: "tiānqì", vn: "Thời tiết" },
  { id: "w10", zh: "今天", pinyin: "jīntiān", vn: "Hôm nay" },
  { id: "w11", zh: "中国", pinyin: "Zhōngguó", vn: "Trung Quốc" },
  { id: "w12", zh: "越南", pinyin: "Yuènán", vn: "Việt Nam" },
  { id: "w13", zh: "衣服", pinyin: "yīfu", vn: "Quần áo" },
  { id: "w14", zh: "学习", pinyin: "xuéxí", vn: "Học tập" },
  { id: "w15", zh: "喜欢", pinyin: "xǐhuan", vn: "Thích" },
  { id: "w16", zh: "高兴", pinyin: "gāoxìng", vn: "Vui vẻ" },
  { id: "w17", zh: "水", pinyin: "shuǐ", vn: "Nước" },
  { id: "w18", zh: "苹果", pinyin: "píngguǒ", vn: "Quả táo" },
  { id: "w19", zh: "出租车", pinyin: "chūzūchē", vn: "Xe taxi" },
  { id: "w20", zh: "漂亮", pinyin: "piàoliang", vn: "Xinh đẹp" },
];

export function MatchMadnessGame() {
  const { addXP } = useApp();

  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [matchesCount, setMatchesCount] = useState<number>(0);

  // Active board slots (5 left words and 5 right words)
  const [leftWords, setLeftWords] = useState<WordPair[]>([]);
  const [rightWords, setRightWords] = useState<WordPair[]>([]);

  // Selected item tracking
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);

  const poolRef = useRef<WordPair[]>(MATCH_WORD_POOL);
  const nextPoolIndex = useRef<number>(10);

  // Initialize game board
  const startGame = () => {
    soundManager.playClick();
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setMatchesCount(0);
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongPair(null);

    // Shuffle pool
    const shuffled = [...MATCH_WORD_POOL].sort(() => Math.random() - 0.5);
    poolRef.current = shuffled;
    nextPoolIndex.current = 5;

    const initialSubset = shuffled.slice(0, 5);
    setLeftWords([...initialSubset].sort(() => Math.random() - 0.5));
    setRightWords([...initialSubset].sort(() => Math.random() - 0.5));

    setGameState("playing");
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      setGameState("finished");
      soundManager.playSuccess();
      const earnedXp = Math.min(100, Math.floor(score / 5) + matchesCount * 2);
      addXP(earnedXp);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, matchesCount, addXP]);

  // Handle pair matching check
  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;

    if (selectedLeft === selectedRight) {
      // MATCH SUCCESS!
      soundManager.playSuccess();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const multiplier = newCombo >= 6 ? 3 : newCombo >= 3 ? 2 : 1;
      setScore((prev) => prev + 10 * multiplier);
      setMatchesCount((prev) => prev + 1);

      // Play audio of matched Chinese word
      const matched = MATCH_WORD_POOL.find((w) => w.id === selectedLeft);
      if (matched) audioEngine.speak(matched.zh, { rate: 1.1 });

      // Replace matched pair with a new word from the pool
      const nextWord = poolRef.current[nextPoolIndex.current % poolRef.current.length];
      nextPoolIndex.current++;

      setLeftWords((prev) => prev.map((w) => (w.id === selectedLeft ? nextWord : w)));
      setRightWords((prev) => prev.map((w) => (w.id === selectedRight ? nextWord : w)));

      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      // WRONG MATCH
      soundManager.playError();
      setCombo(0);
      setWrongPair({ left: selectedLeft, right: selectedRight });

      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  }, [selectedLeft, selectedRight, combo, maxCombo]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
              Match Madness — Nối Từ Tốc Độ
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                60 Giây Phản Xạ
              </span>
            </h1>
            <p className="text-xs text-stone-500">
              Ghép đúng chữ Hán với nghĩa tiếng Việt càng nhanh điểm số càng cao!
            </p>
          </div>
        </div>

        {/* Live Game Stats */}
        {gameState === "playing" && (
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-mono font-bold text-sm border ${
              timeLeft <= 10
                ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse"
                : "bg-stone-50 text-stone-800 border-stone-200"
            }`}>
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-black text-sm">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{score} điểm</span>
            </div>

            {/* Combo Streak */}
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-xs ${
              combo >= 3
                ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs"
                : "bg-stone-100 text-stone-600"
            }`}>
              <Flame className="w-4 h-4 fill-current" />
              <span>x{combo} Combo</span>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. READY SCREEN                                          */}
      {/* ======================================================== */}
      {gameState === "ready" && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border-4 border-amber-100 shadow-inner">
            <Zap className="w-12 h-12 fill-current" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Sẵn Sàng Thử Thách Phản Xạ?
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Bạn có <strong>60 giây</strong> để ghép nhiều cặp chữ Hán và tiếng Việt nhất có thể. Duy trì chuỗi đúng liên tiếp để nhân gấp đôi, gấp ba điểm số!
            </p>
          </div>

          <button
            onClick={startGame}
            className="px-10 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Bắt Đầu Ngay (60s)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PLAYING BOARD (2 COLUMNS - RESPONSIVE TOUCH)          */}
      {/* ======================================================== */}
      {gameState === "playing" && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 animate-fadeIn">
          {/* Left Column: Hanzi & Pinyin */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block text-center">
              Cột Chữ Hán
            </span>
            {leftWords.map((word) => {
              const isSelected = selectedLeft === word.id;
              const isWrong = wrongPair?.left === word.id;

              return (
                <button
                  key={`left-${word.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedLeft(word.id);
                  }}
                  className={`w-full p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group text-left h-[68px] sm:h-[88px] ${
                    isWrong
                      ? "bg-rose-50 border-rose-500 text-rose-900 animate-shake"
                      : isSelected
                      ? "bg-amber-100 border-amber-600 shadow-md scale-[1.02]"
                      : "bg-white hover:bg-stone-50 border-stone-200 text-stone-900 shadow-2xs"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-hanzi text-xl sm:text-3xl font-black block truncate">
                      {word.zh}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-400 mt-0.5 block truncate">
                      [{word.pinyin}]
                    </span>
                  </div>
                  <Volume2 className="w-4 h-4 text-stone-300 group-hover:text-amber-600 transition-colors shrink-0 hidden xs:block" />
                </button>
              );
            })}
          </div>

          {/* Right Column: Vietnamese Meaning */}
          <div className="space-y-2.5 sm:space-y-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block text-center">
              Cột Nghĩa Tiếng Việt
            </span>
            {rightWords.map((word) => {
              const isSelected = selectedRight === word.id;
              const isWrong = wrongPair?.right === word.id;

              return (
                <button
                  key={`right-${word.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedRight(word.id);
                  }}
                  className={`w-full p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-center text-center font-bold text-xs sm:text-base group h-[68px] sm:h-[88px] leading-snug ${
                    isWrong
                      ? "bg-rose-50 border-rose-500 text-rose-900 animate-shake"
                      : isSelected
                      ? "bg-amber-100 border-amber-600 shadow-md scale-[1.02] text-amber-950 font-black"
                      : "bg-white hover:bg-stone-50 border-stone-200 text-stone-800 shadow-2xs"
                  }`}
                >
                  <span className="line-clamp-2">{word.vn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FINISHED SUMMARY SCREEN                               */}
      {/* ======================================================== */}
      {gameState === "finished" && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-lg text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Hoàn Thành Thử Thách
            </span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              Tuyệt Vời! Bạn Đạt {score} Điểm
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Phản xạ nhận diện chữ Hán của bạn đang tiến bộ rất nhanh chóng!
            </p>
          </div>

          {/* 3 Stat Badges */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 block">Số cặp ghép</span>
              <span className="text-2xl font-black text-stone-900">{matchesCount}</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 block">Combo lớn nhất</span>
              <span className="text-2xl font-black text-orange-600">x{maxCombo}</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-xs text-amber-800 block">XP Thưởng</span>
              <span className="text-2xl font-black text-amber-900">
                +{Math.min(100, Math.floor(score / 5) + matchesCount * 2)}
              </span>
            </div>
          </div>

          {/* Play again button */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi Lại Ván Mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
