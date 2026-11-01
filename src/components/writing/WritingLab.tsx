"use client";

import React, { useState, useRef, useEffect } from "react";
import { WRITING_EXERCISES } from "@/data/writing";
import { useApp } from "@/context/AppContext";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Play,
  Eye,
  EyeOff,
  PenTool,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export function WritingLab() {
  const { currentHskLevel, audioSpeed, addXP } = useApp();
  const filteredExercises = WRITING_EXERCISES.filter((ex) => ex.hskLevel <= currentHskLevel);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentChar = filteredExercises[currentIndex] || WRITING_EXERCISES[0];

  const [mode, setMode] = useState<"trace" | "memory" | "dictation">("trace");
  const [showGuide, setShowGuide] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [animatingStroke, setAnimatingStroke] = useState(false);
  const [strokeStep, setStrokeStep] = useState(0);
  const [writingSuccess, setWritingSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokesHistory, setStrokesHistory] = useState<string[]>([]);

  // Canvas setup
  useEffect(() => {
    clearCanvas();
  }, [currentIndex, mode]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokesHistory([]);
    setWritingSuccess(false);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#172554"; // Navy ink
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setStrokesHistory((prev) => [...prev, canvas.toDataURL()]);
    }
  };

  const verifyWriting = () => {
    soundManager.playSuccess();
    setWritingSuccess(true);
    addXP(25);
  };

  const playPronunciation = () => {
    soundManager.playClick();
    audioEngine.speak(currentChar.character, { rate: audioSpeed });
  };

  const playStrokeOrderAnimation = () => {
    if (animatingStroke) return;
    soundManager.playClick();
    setAnimatingStroke(true);
    setStrokeStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setStrokeStep(step);
      if (step >= currentChar.strokeTypes.length) {
        clearInterval(interval);
        setTimeout(() => setAnimatingStroke(false), 500);
      }
    }, 700);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-amber-600" />
            <span>Phòng Luyện Viết Chữ Hán (Thuận Bút)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Luyện viết chữ Hán trên ô 米字格 (Mễ Tự Cách) chuẩn thứ tự từng nét bút
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => {
              setMode("trace");
              setShowGuide(true);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === "trace"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Viết Theo Mẫu
          </button>
          <button
            onClick={() => {
              setMode("memory");
              setShowGuide(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === "memory"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Nhớ Nét Tự Viết
          </button>
          <button
            onClick={() => {
              setMode("dictation");
              setShowGuide(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === "dictation"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Chép Chính Tả
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Interactive Canvas & Rice Grid */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col items-center">
          {/* Navigation Controls */}
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Chữ {currentIndex + 1} / {filteredExercises.length}
              </span>
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                HSK {currentChar.hskLevel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(filteredExercises.length - 1, prev + 1))}
                disabled={currentIndex === filteredExercises.length - 1}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rice Grid (米字格) Canvas Box */}
          <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] rounded-xl overflow-hidden mizige-grid shadow-inner select-none touch-none">
            {/* Background Template Character (When in Trace mode or Guide enabled) */}
            {showGuide && mode !== "dictation" && (
              <div className="absolute inset-0 flex items-center justify-center font-hanzi text-[240px] sm:text-[280px] font-bold text-red-500/20 pointer-events-none select-none">
                {currentChar.character}
              </div>
            )}

            {/* Drawing Canvas */}
            <canvas
              ref={canvasRef}
              width={360}
              height={360}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10"
            />
          </div>

          {/* Canvas Action Bar */}
          <div className="w-full mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa Viết Lại</span>
              </button>
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600 transition-colors"
              >
                {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showGuide ? "Ẩn Mẫu" : "Hiện Mẫu"}</span>
              </button>
            </div>

            <button
              onClick={verifyWriting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Hoàn Thành & Chấm Điểm</span>
            </button>
          </div>

          {/* Writing Success Banner */}
          {writingSuccess && (
            <div className="w-full mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Nét chữ rất cân đối! Bạn nhận được +25 XP.</span>
              </div>
              <button
                onClick={() => {
                  if (currentIndex < filteredExercises.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                  }
                }}
                className="text-xs font-bold underline hover:text-emerald-900"
              >
                Luyện chữ kế tiếp →
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Stroke Order Information & Radicals */}
        <div className="lg:col-span-5 space-y-4">
          {/* Character Header Info */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-hanzi text-4xl font-extrabold text-stone-900">
                    {mode === "dictation" ? "？" : currentChar.character}
                  </span>
                  <div>
                    <span className="font-mono text-lg font-bold text-amber-700">
                      {currentChar.pinyin}
                    </span>
                    <p className="text-xs font-medium text-stone-600 mt-0.5">
                      {currentChar.meaningVn}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={playPronunciation}
                className="w-10 h-10 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center transition-colors"
                title="Nghe phát âm chuẩn"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Structure & Radicals Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Bộ Thủ (Radical)
                </span>
                <span className="font-bold text-stone-800 mt-0.5 block">
                  {currentChar.radical}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Tổng Số Nét
                </span>
                <span className="font-bold text-amber-700 mt-0.5 block">
                  {currentChar.strokeCount} nét bút
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Kết Cấu Chữ
              </span>
              <span className="text-stone-700 mt-0.5 block font-medium">
                {currentChar.structure}
              </span>
            </div>
          </div>

          {/* Stroke by Stroke Order Guide */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Quy Tắc Thuận Bút ({currentChar.strokeTypes.length} Nét)</span>
              </h3>

              <button
                onClick={playStrokeOrderAnimation}
                disabled={animatingStroke}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200/60"
              >
                <Play className="w-3 h-3 fill-amber-700" />
                <span>{animatingStroke ? "Đang chạy..." : "Xem Nét Bút"}</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {currentChar.strokeTypes.map((stroke, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    strokeStep === idx + 1 && animatingStroke
                      ? "bg-amber-100 font-bold text-amber-900 border border-amber-300"
                      : "bg-stone-50 text-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span>Nét thứ {idx + 1}: {stroke}</span>
                  </div>
                  {strokeStep === idx + 1 && animatingStroke && (
                    <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-mono">
                      Nét hiện tại
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Quy tắc bất biến: Ngang trước sổ sau, trên trước dưới sau, trái trước phải sau, ngoài trước trong sau rồi mới đóng đáy.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
