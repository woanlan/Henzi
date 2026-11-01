"use client";

import React, { useState, useRef, useEffect } from "react";
import { WRITING_EXERCISES } from "@/data/writing";
import { useApp } from "@/context/AppContext";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  searchCharacters,
  buildExerciseForChar,
  CustomDictEntry,
} from "@/data/writing-custom-dict";
import { WritingExercise } from "@/types";
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
  AlertTriangle,
  Layers,
  Touchpad,
  Search,
  X,
  ArrowRight,
  Zap,
} from "lucide-react";

export function WritingLab() {
  const { currentHskLevel, audioSpeed, addXP } = useApp();
  const filteredExercises = WRITING_EXERCISES.filter((ex) => ex.hskLevel <= currentHskLevel);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Custom Character Search & Selection State
  const [customInput, setCustomInput] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customWord, setCustomWord] = useState<string | null>(null);
  const [customChars, setCustomChars] = useState<string[]>([]);
  const [activeCustomCharIndex, setActiveCustomCharIndex] = useState(0);
  const [customExercise, setCustomExercise] = useState<WritingExercise | null>(null);
  const [searchResults, setSearchResults] = useState<CustomDictEntry[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [dynamicStrokeCount, setDynamicStrokeCount] = useState<number | null>(null);

  // Current active character exercise
  const currentChar: WritingExercise =
    isCustomMode && customExercise
      ? customExercise
      : filteredExercises[currentIndex] || WRITING_EXERCISES[0];

  const totalStrokes = dynamicStrokeCount || currentChar.strokeCount;

  // Generate stroke types array if dynamic count differs from preset
  const strokeTypesList =
    currentChar.strokeTypes && currentChar.strokeTypes.length === totalStrokes
      ? currentChar.strokeTypes
      : Array.from({ length: totalStrokes }, (_, i) => `Nét thứ ${i + 1}`);

  // Engine selection: "hanzi_writer" (stroke sensor) | "freehand" (canvas drawing)
  const [engineType, setEngineType] = useState<"hanzi_writer" | "freehand">("hanzi_writer");
  const [mode, setMode] = useState<"trace" | "memory" | "dictation">("trace");
  const [showGuide, setShowGuide] = useState(true);

  // HanziWriter DOM ref & state
  const writerBoxRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writerInstanceRef = useRef<any>(null);
  const loadIdRef = useRef(0);
  const [hwCompletedStrokes, setHwCompletedStrokes] = useState(0);
  const [hwMistakes, setHwMistakes] = useState(0);

  // Freehand Canvas ref & state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnStrokeCount, setDrawnStrokeCount] = useState(0);

  // Common UI State
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [writingSuccess, setWritingSuccess] = useState(false);
  const [animatingStroke, setAnimatingStroke] = useState(false);
  const [strokeStep, setStrokeStep] = useState(0);

  // Re-initialize writer whenever active character or engine mode changes
  useEffect(() => {
    setWritingSuccess(false);
    setErrorMessage("");
    setStatusMessage("");
    setHwCompletedStrokes(0);
    setHwMistakes(0);
    setDrawnStrokeCount(0);
    setDynamicStrokeCount(null);

    if (engineType === "hanzi_writer") {
      initHanziWriter();
    } else {
      clearFreehandCanvas();
    }

    return () => {
      loadIdRef.current++;
      if (writerInstanceRef.current) {
        try {
          writerInstanceRef.current.cancelQuiz();
        } catch {}
        writerInstanceRef.current = null;
      }
      if (writerBoxRef.current) {
        writerBoxRef.current.innerHTML = "";
      }
    };
  }, [currentChar.character, engineType, mode, showGuide]);

  // Init HanziWriter instance with race-condition prevention & clean DOM isolation
  const initHanziWriter = async () => {
    const currentLoadId = ++loadIdRef.current;
    if (!writerBoxRef.current) return;

    // Immediately cancel and reset old writer
    if (writerInstanceRef.current) {
      try {
        writerInstanceRef.current.cancelQuiz();
      } catch {}
      writerInstanceRef.current = null;
    }
    writerBoxRef.current.innerHTML = "";

    try {
      const { default: HanziWriter } = await import("hanzi-writer");

      // Guard against stale async resolution from fast tab/char switching
      if (currentLoadId !== loadIdRef.current || !writerBoxRef.current) return;

      // Clear immediately before creating to guarantee exactly 1 SVG element
      writerBoxRef.current.innerHTML = "";

      // Adapt canvas size dynamically to viewport width for mobile screens
      const isMobileSmall = typeof window !== "undefined" && window.innerWidth < 400;
      const canvasDim = isMobileSmall ? 270 : 320;
      const pad = isMobileSmall ? 18 : 24;

      const writer = HanziWriter.create(writerBoxRef.current, currentChar.character, {
        width: canvasDim,
        height: canvasDim,
        padding: pad,
        showOutline: showGuide && mode !== "dictation",
        strokeAnimationSpeed: 1.2,
        delayBetweenStrokes: 200,
        strokeColor: "#172554", // Deep Navy ink
        outlineColor: "rgba(239, 68, 68, 0.22)", // Rice grid guide
        drawingColor: "#D97706", // Amber
        drawingWidth: 18,
        showCharacter: false,
        onLoadCharDataSuccess: (charData: any) => {
          if (currentLoadId !== loadIdRef.current) return;
          if (charData && charData.strokes && charData.strokes.length > 0) {
            setDynamicStrokeCount(charData.strokes.length);
          }
        },
        onLoadCharDataError: (err: any) => {
          if (currentLoadId !== loadIdRef.current) return;
          console.warn("HanziWriter character load note:", err);
          setErrorMessage(
            `Chữ "${currentChar.character}" chưa có dữ liệu nét thuận bút SVG tự động. Bạn có thể chuyển sang "Bút Vẽ Tự Do" để luyện viết trực tiếp.`
          );
        },
      });

      writerInstanceRef.current = writer;

      // Start stroke-by-stroke quiz with strict validation
      writer.quiz({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onMistake: (strokeData: any) => {
          if (currentLoadId !== loadIdRef.current) return;
          soundManager.playError();
          setHwMistakes((m) => m + 1);
          setErrorMessage(
            `Nét thứ ${strokeData.strokeNum + 1} chưa đúng chiều hoặc sai vị trí! Hãy quan sát mẫu và vẽ lại nét này.`
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onCorrectStroke: (strokeData: any) => {
          if (currentLoadId !== loadIdRef.current) return;
          soundManager.playSuccess();
          setErrorMessage("");
          const currentNum = strokeData.strokeNum + 1;
          setHwCompletedStrokes(currentNum);
          const strokeName = strokeTypesList[currentNum - 1] || `Nét thứ ${currentNum}`;
          setStatusMessage(
            `Đã vẽ đúng nét ${currentNum}/${totalStrokes} (${strokeName})! Tiếp tục vẽ nét tiếp theo.`
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onComplete: (summary: any) => {
          if (currentLoadId !== loadIdRef.current) return;
          soundManager.playFanfare();
          setWritingSuccess(true);
          setHwCompletedStrokes(totalStrokes);
          setStatusMessage(
            `Xuất sắc! Bạn đã viết hoàn chỉnh tất cả ${totalStrokes} nét của chữ "${currentChar.character}".`
          );
          addXP(summary.totalMistakes === 0 ? 35 : 20);
        },
      });
    } catch (e) {
      console.warn("HanziWriter initialization fallback:", e);
      setEngineType("freehand");
    }
  };

  // Play animation of stroke orders
  const playStrokeAnimation = () => {
    soundManager.playClick();
    if (writerInstanceRef.current && engineType === "hanzi_writer") {
      writerInstanceRef.current.animateCharacter({
        onComplete: () => {
          // Re-trigger quiz after animation
          initHanziWriter();
        },
      });
    } else {
      // Step by step fallback animation
      if (animatingStroke) return;
      setAnimatingStroke(true);
      setStrokeStep(0);
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setStrokeStep(step);
        if (step >= strokeTypesList.length) {
          clearInterval(interval);
          setTimeout(() => setAnimatingStroke(false), 500);
        }
      }, 700);
    }
  };

  // Clear Canvas
  const resetPractice = () => {
    soundManager.playClick();
    setWritingSuccess(false);
    setErrorMessage("");
    setStatusMessage("");
    setHwCompletedStrokes(0);
    setDrawnStrokeCount(0);
    if (engineType === "hanzi_writer") {
      initHanziWriter();
    } else {
      clearFreehandCanvas();
    }
  };

  // Freehand Canvas Handlers
  const clearFreehandCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnStrokeCount(0);
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
    ctx.strokeStyle = "#172554";
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
    setDrawnStrokeCount((prev) => {
      const nextCount = prev + 1;
      setStatusMessage(`Đã ghi nhận nét thứ ${nextCount} / ${totalStrokes}.`);
      return nextCount;
    });
  };

  // STRICT VALIDATION FOR FREEHAND CANVAS
  const verifyFreehandWriting = () => {
    soundManager.playClick();

    // Check if user has drawn enough strokes
    if (drawnStrokeCount < totalStrokes) {
      soundManager.playError();
      setErrorMessage(
        `Chưa hoàn thành đủ số nét! Chữ "${currentChar.character}" có tổng cộng ${totalStrokes} nét, nhưng bạn mới vẽ ${drawnStrokeCount}/${totalStrokes} nét. Hãy hoàn thành đầy đủ các nét bút.`
      );
      setWritingSuccess(false);
      return;
    }

    // Check canvas pixel density to prevent 1-dot cheat
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let filledPixels = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
          if (imgData.data[i] > 20) filledPixels++;
        }

        if (filledPixels < 1200) {
          soundManager.playError();
          setErrorMessage(
            `Nét vẽ quá mờ hoặc quá ngắn! Hãy viết rõ ràng từng nét chữ trên khung ô Mễ Tự Cách.`
          );
          setWritingSuccess(false);
          return;
        }
      }
    }

    // Success
    soundManager.playSuccess();
    setErrorMessage("");
    setWritingSuccess(true);
    setStatusMessage(`Rất tốt! Bạn đã hoàn thành toàn bộ ${totalStrokes} nét chữ.`);
    addXP(25);
  };

  const playPronunciation = () => {
    soundManager.playClick();
    audioEngine.speak(currentChar.character, { rate: audioSpeed });
  };

  // --- CUSTOM CHARACTER INPUT HANDLERS ---

  // Handle Search Input Typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    if (val.trim()) {
      const results = searchCharacters(val);
      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Activate a specific custom character or phrase
  const activateCustomCharacter = (charOrWord: string) => {
    soundManager.playClick();
    const hanziChars = charOrWord.match(/[\u4e00-\u9fa5]/g) || [];

    if (hanziChars.length === 0) {
      // If no direct Hanzi, try search
      const matches = searchCharacters(charOrWord);
      if (matches.length > 0) {
        activateSingleChar(matches[0].character, matches[0].character);
      } else {
        setErrorMessage(`Không tìm thấy chữ Hán hợp lệ từ "${charOrWord}". Vui lòng nhập trực tiếp chữ Hán.`);
      }
      return;
    }

    setCustomWord(charOrWord);
    setCustomChars(hanziChars);
    setActiveCustomCharIndex(0);
    setIsCustomMode(true);
    setShowSearchResults(false);

    const firstChar = hanziChars[0];
    if (!firstChar) return;
    const exercise = buildExerciseForChar(firstChar);
    setCustomExercise(exercise);
  };

  // Activate single char from list
  const activateSingleChar = (char: string, wordContext?: string) => {
    soundManager.playClick();
    const exercise = buildExerciseForChar(char);
    setCustomExercise(exercise);
    if (wordContext) {
      setCustomWord(wordContext);
    }
  };

  // Switch to character at index in current word
  const selectCustomCharIndex = (index: number) => {
    soundManager.playClick();
    if (index >= 0 && index < customChars.length) {
      setActiveCustomCharIndex(index);
      activateSingleChar(customChars[index], customWord || undefined);
    }
  };

  // Exit custom mode and return to standard HSK syllabus
  const exitCustomMode = () => {
    soundManager.playClick();
    setIsCustomMode(false);
    setCustomWord(null);
    setCustomChars([]);
    setCustomExercise(null);
    setCustomInput("");
    setShowSearchResults(false);
  };

  const currentStrokesDrawn =
    engineType === "hanzi_writer" ? hwCompletedStrokes : drawnStrokeCount;
  const progressPercent = Math.min(
    100,
    Math.round((currentStrokesDrawn / totalStrokes) * 100)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Unified Compact Header & Search Bar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        {/* Title & Engine Mode Switcher in One Crisp Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-amber-600" />
              <span>Phòng Luyện Viết Chữ Hán (Thuận Bút Chuẩn)</span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Cảm biến nhận diện thứ tự từng nét bút theo chuẩn Bộ Giáo Dục Trung Quốc
            </p>
          </div>

          {/* Engine Toggle */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl self-start sm:self-auto shrink-0">
            <button
              onClick={() => setEngineType("hanzi_writer")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                engineType === "hanzi_writer"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Touchpad className="w-3.5 h-3.5" />
              <span>Cảm Biến Nét Thông Minh</span>
            </button>
            <button
              onClick={() => setEngineType("freehand")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                engineType === "freehand"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bút Vẽ Tự Do</span>
            </button>
          </div>
        </div>

        {/* Custom Input Bar & Search */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span>Tự Nhập Bất Kỳ Chữ Hán Cần Tập Viết:</span>
              {isCustomMode && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full normal-case tracking-normal">
                  Chữ tùy chọn: {currentChar.character}
                </span>
              )}
            </div>

            {isCustomMode && (
              <button
                onClick={exitCustomMode}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Quay lại bài học HSK chuẩn</span>
              </button>
            )}
          </div>

          <div className="relative">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customInput.trim()) {
                      activateCustomCharacter(customInput.trim());
                    }
                  }}
                  onFocus={() => {
                    if (customInput.trim() && searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  placeholder="Gõ hoặc dán chữ Hán bất kỳ (VD: 爱, 福, 龙, 谢谢, 中国...) hoặc gõ Pinyin, tiếng Việt..."
                  className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                {customInput && (
                  <button
                    onClick={() => {
                      setCustomInput("");
                      setShowSearchResults(false);
                    }}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-600 absolute right-2.5 top-2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (customInput.trim()) {
                    activateCustomCharacter(customInput.trim());
                  }
                }}
                disabled={!customInput.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Tập Viết Ngay</span>
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto divide-y divide-stone-100 animate-fadeIn">
                {searchResults.map((entry) => (
                  <button
                    key={entry.character}
                    onClick={() => {
                      activateCustomCharacter(entry.character);
                      setCustomInput(entry.character);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-amber-50 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-hanzi text-2xl font-bold text-stone-900 group-hover:text-amber-700">
                        {entry.character}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-700">
                            {entry.pinyin}
                          </span>
                          <span className="text-[11px] text-stone-400 font-medium">
                            ({entry.sinoVietnamese})
                          </span>
                          {entry.hskLevel && (
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-semibold">
                              HSK {entry.hskLevel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-1">{entry.meaningVn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                      <span>Luyện viết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 no-scrollbar">
            <span className="text-[11px] font-bold text-stone-400 shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Gợi ý nhanh:
            </span>
            {[
              { zh: "爱", vn: "Yêu", pinyin: "ài" },
              { zh: "福", vn: "Phúc", pinyin: "fú" },
              { zh: "龙", vn: "Rồng", pinyin: "lóng" },
              { zh: "茶", vn: "Trà", pinyin: "chá" },
              { zh: "猫", vn: "Mèo", pinyin: "māo" },
              { zh: "美", vn: "Đẹp", pinyin: "měi" },
              { zh: "德", vn: "Đức", pinyin: "dé" },
              { zh: "春", vn: "Xuân", pinyin: "chūn" },
              { zh: "谢谢", vn: "Cảm ơn", pinyin: "xièxie" },
              { zh: "中国", vn: "Trung Quốc", pinyin: "zhōngguó" },
              { zh: "家", vn: "Nhà", pinyin: "jiā" },
              { zh: "学", vn: "Học", pinyin: "xué" },
            ].map((item) => (
              <button
                key={item.zh}
                onClick={() => {
                  setCustomInput(item.zh);
                  activateCustomCharacter(item.zh);
                }}
                className={`shrink-0 px-2 py-0.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                  currentChar.character === item.zh || customWord === item.zh
                    ? "bg-amber-600 text-white border-amber-600 shadow-2xs font-bold"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300"
                }`}
              >
                <span className="font-hanzi font-bold text-xs">{item.zh}</span>
                <span className="text-[10px] opacity-80">{item.vn}</span>
              </button>
            ))}
          </div>

          {/* Multi-Character Selector Strip (If word has 2+ characters) */}
          {isCustomMode && customChars.length > 1 && (
            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">
                  Từ vựng: <b className="text-stone-900">{customWord}</b>
                </span>
                <span className="text-xs text-stone-400">• Chọn chữ để luyện viết:</span>
              </div>

              <div className="flex items-center gap-1.5">
                {customChars.map((char, idx) => (
                  <button
                    key={`${char}-${idx}`}
                    onClick={() => selectCustomCharIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeCustomCharIndex === idx
                        ? "bg-amber-600 text-white shadow-xs scale-105"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    <span className="font-hanzi text-sm">{char}</span>
                    <span className="text-[10px] opacity-80">
                      ({idx + 1}/{customChars.length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Studio: Canvas & Character Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Rice Grid Box */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col items-center">
          {/* Navigation Controls */}
          <div className="w-full flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isCustomMode ? (
                <>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {customChars.length > 1
                      ? `Chữ ${activeCustomCharIndex + 1} / ${customChars.length} (${currentChar.character})`
                      : `Chữ tùy chọn: ${currentChar.character}`}
                  </span>
                  <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    HSK {currentChar.hskLevel}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Chữ {currentIndex + 1} / {filteredExercises.length}
                  </span>
                  <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    HSK {currentChar.hskLevel}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isCustomMode ? (
                customChars.length > 1 && (
                  <>
                    <button
                      onClick={() => selectCustomCharIndex(activeCustomCharIndex - 1)}
                      disabled={activeCustomCharIndex === 0}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Chữ trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => selectCustomCharIndex(activeCustomCharIndex + 1)}
                      disabled={activeCustomCharIndex === customChars.length - 1}
                      className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Chữ sau"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )
              ) : (
                <>
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Chữ trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => Math.min(filteredExercises.length - 1, prev + 1))
                    }
                    disabled={currentIndex === filteredExercises.length - 1}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Chữ sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stroke Progress Bar */}
          <div className="w-full mb-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span>
                Tiến độ nét: <b>{currentStrokesDrawn}</b> / <b>{totalStrokes}</b> nét
              </span>
              <span className="font-mono text-amber-700 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive Rice Grid (米字格) Container - Responsive for mobile 270px up to 320px */}
          <div className="relative w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] rounded-2xl overflow-hidden mizige-grid shadow-inner select-none touch-none flex items-center justify-center">
            {/* Engine 1: HanziWriter Interactive DOM */}
            {engineType === "hanzi_writer" && (
              <div
                ref={writerBoxRef}
                className="w-full h-full flex items-center justify-center cursor-crosshair z-10"
              />
            )}

            {/* Engine 2: Freehand HTML5 Canvas */}
            {engineType === "freehand" && (
              <>
                {showGuide && mode !== "dictation" && (
                  <div className="absolute inset-0 flex items-center justify-center font-hanzi text-[200px] sm:text-[240px] font-bold text-red-500/20 pointer-events-none select-none">
                    {currentChar.character}
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={320}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                />
              </>
            )}
          </div>

          {/* Status / Instruction Bar */}
          <div className="w-full mt-3 text-center min-h-[38px] flex items-center justify-center">
            {errorMessage ? (
              <div className="w-full p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2 animate-fadeIn text-left">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : statusMessage ? (
              <div className="w-full p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 animate-fadeIn">
                {statusMessage}
              </div>
            ) : (
              <p className="text-xs text-stone-500">
                {engineType === "hanzi_writer"
                  ? `Dùng chuột hoặc ngón tay vẽ từng nét chữ theo thứ tự từ nét 1 đến nét ${totalStrokes}.`
                  : `Vẽ đầy đủ cả ${totalStrokes} nét chữ lên ô Mễ Tự Cách rồi bấm Kiểm Tra.`}
              </p>
            )}
          </div>

          {/* Canvas Actions */}
          <div className="w-full mt-3 flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={resetPractice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa Viết Lại</span>
              </button>
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600 transition-colors cursor-pointer"
              >
                {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showGuide ? "Ẩn Mẫu" : "Hiện Mẫu"}</span>
              </button>
            </div>

            {engineType === "freehand" ? (
              <button
                onClick={verifyFreehandWriting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Kiểm Tra Nét Chữ</span>
              </button>
            ) : (
              <button
                onClick={playStrokeAnimation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Xem Hoạt Ảnh Nét</span>
              </button>
            )}
          </div>

          {/* Full Success Banner */}
          {writingSuccess && (
            <div className="w-full mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">
                    Chúc mừng! Bạn đã hoàn thành 100% tất cả ${totalStrokes} nét chữ.
                  </span>
                  <span className="text-[11px] text-emerald-700">Đã cộng +35 XP vào hồ sơ học tập.</span>
                </div>
              </div>

              {isCustomMode ? (
                customChars.length > 1 && activeCustomCharIndex < customChars.length - 1 ? (
                  <button
                    onClick={() => selectCustomCharIndex(activeCustomCharIndex + 1)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Viết chữ tiếp [{customChars[activeCustomCharIndex + 1]}]</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={exitCustomMode}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                  >
                    Về HSK chuẩn
                  </button>
                )
              ) : (
                <button
                  onClick={() => {
                    if (currentIndex < filteredExercises.length - 1) {
                      setCurrentIndex((prev) => prev + 1);
                    } else {
                      setCurrentIndex(0);
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                >
                  Chữ Kế Tiếp →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Character Details & Stroke Sequence */}
        <div className="lg:col-span-5 space-y-4">
          {/* Character Header Info */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3.5">
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
                className="w-10 h-10 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Nghe phát âm chuẩn"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Structure & Radicals Breakdown */}
            <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-stone-100 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Bộ Thủ (Radical)
                </span>
                <span className="font-bold text-stone-800 mt-0.5 block truncate">
                  {currentChar.radical}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                  Tổng Số Nét Bút
                </span>
                <span className="font-bold text-amber-700 mt-0.5 block">
                  {totalStrokes} nét bắt buộc
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
                <span>Thứ Tự {strokeTypesList.length} Nét Thuận Bút</span>
              </h3>

              <button
                onClick={playStrokeAnimation}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200/60 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-amber-700" />
                <span>Minh Họa Nét</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {strokeTypesList.map((stroke, idx) => {
                const isFinished = currentStrokesDrawn > idx;
                const isCurrent = currentStrokesDrawn === idx;

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isFinished
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium"
                        : isCurrent
                        ? "bg-amber-100 font-bold text-amber-950 border border-amber-300"
                        : "bg-stone-50 text-stone-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isFinished
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-amber-600 text-white"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {isFinished ? "✓" : idx + 1}
                      </span>
                      <span>
                        Nét {idx + 1}: {stroke}
                      </span>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-mono">
                        Nét cần vẽ
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <b>Nguyên tắc chấm điểm:</b> Hệ thống yêu cầu vẽ đúng vị trí, hướng kéo nét và hoàn thành trọn vẹn tất cả {totalStrokes} nét trước khi công nhận kết quả.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
