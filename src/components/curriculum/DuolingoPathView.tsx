"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { soundManager } from "@/lib/utils";
import { audioEngine } from "@/lib/audio";
import confetti from "canvas-confetti";
import {
  Crown,
  Lock,
  Gift,
  Trophy,
  Play,
  Check,
  Star,
  Sparkles,
  Volume2,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Compass,
  Flame,
  Award,
} from "lucide-react";
import { PandaMascot } from "@/components/mascot/PandaMascot";

export interface PathNode {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  type: "lesson" | "chest" | "checkpoint";
  status: "completed" | "current" | "locked";
  stars: number;
  xpReward: number;
  x: number;
  y: number;
  environmentName?: string;
}

export function DuolingoPathView() {
  const { currentHskLevel, addXP } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [activeLessonModal, setActiveLessonModal] = useState<PathNode | null>(null);
  const [chestOpened, setChestOpened] = useState<Record<string, boolean>>({});
  const [bonusNotification, setBonusNotification] = useState<string | null>(null);

  // Lesson quiz modal state
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);

  // 9 Winding nodes positioned HORIZONTALLY with generous vertical headroom
  const [nodes, setNodes] = useState<PathNode[]>([
    {
      id: "node-1",
      number: 1,
      title: "Khởi Động: Lời Chào",
      subtitle: "你好, 谢谢, 再见",
      type: "lesson",
      status: "completed",
      stars: 3,
      xpReward: 20,
      x: 100,
      y: 265,
      environmentName: "Ngôi Làng Chào Hỏi",
    },
    {
      id: "node-2",
      number: 2,
      title: "Danh Xưng & Đại Từ",
      subtitle: "我, 你, 他, 我们",
      type: "lesson",
      status: "completed",
      stars: 3,
      xpReward: 20,
      x: 270,
      y: 205,
      environmentName: "Đồi Giao Tiếp",
    },
    {
      id: "node-3",
      number: 3,
      title: "Rương Kho Báu HSK",
      subtitle: "Thưởng chuỗi ngày học",
      type: "chest",
      status: "current",
      stars: 0,
      xpReward: 50,
      x: 440,
      y: 315,
      environmentName: "Đảo Kho Báu",
    },
    {
      id: "node-4",
      number: 4,
      title: "Số Đếm & Chữ Số",
      subtitle: "一 到 十, 两",
      type: "lesson",
      status: "current",
      stars: 1,
      xpReward: 25,
      x: 620,
      y: 205,
      environmentName: "Thung Lũng Con Số",
    },
    {
      id: "node-5",
      number: 5,
      title: "Gia Đình & Bạn Bè",
      subtitle: "爸爸, 妈妈, 朋友",
      type: "lesson",
      status: "locked",
      stars: 0,
      xpReward: 25,
      x: 800,
      y: 315,
      environmentName: "Vườn Tình Thân",
    },
    {
      id: "node-6",
      number: 6,
      title: "Rương Huyền Bí",
      subtitle: "Tích lũy XP tuần",
      type: "chest",
      status: "locked",
      stars: 0,
      xpReward: 60,
      x: 980,
      y: 205,
      environmentName: "Rừng Bí Ẩn",
    },
    {
      id: "node-7",
      number: 7,
      title: "Ăn Uống Hàng Ngày",
      subtitle: "喝茶, 吃饭, 米饭",
      type: "lesson",
      status: "locked",
      stars: 0,
      xpReward: 30,
      x: 1160,
      y: 315,
      environmentName: "Phố Ẩm Thực",
    },
    {
      id: "node-8",
      number: 8,
      title: "Thời Gian & Lịch Trình",
      subtitle: "今天, 明天, 几月几号",
      type: "lesson",
      status: "locked",
      stars: 0,
      xpReward: 30,
      x: 1330,
      y: 205,
      environmentName: "Tháp Thời Gian",
    },
    {
      id: "node-9",
      number: 9,
      title: "Cổng Vượt Cấp HSK",
      subtitle: "Bài thi sát hạch toàn diện",
      type: "checkpoint",
      status: "locked",
      stars: 0,
      xpReward: 100,
      x: 1510,
      y: 260,
      environmentName: "Đại Điện HSK",
    },
  ]);

  // Mini quiz sample questions
  const miniQuestions = [
    {
      zh: "你好",
      pinyin: "nǐ hǎo",
      question: "Chọn nghĩa tiếng Việt chính xác của từ sau:",
      options: ["Xin chào", "Cảm ơn", "Tạm biệt", "Bạn bè"],
      correct: 0,
    },
    {
      zh: "我是越南人",
      pinyin: "wǒ shì Yuènán rén",
      question: "Câu này có nghĩa là gì?",
      options: ["Tôi thích đi du lịch", "Tôi là người Việt Nam", "Tôi có hai người bạn", "Tôi muốn uống trà"],
      correct: 1,
    },
    {
      zh: "谢谢",
      pinyin: "xièxie",
      question: "Phiên âm pinyin của chữ này là:",
      options: ["zàijiàn", "nǐ hǎo", "xièxie", "péngyou"],
      correct: 2,
    },
  ];

  // Auto-scroll to active node on mount
  useEffect(() => {
    scrollToActiveNode();
  }, [currentHskLevel]);

  const scrollToActiveNode = () => {
    if (scrollContainerRef.current) {
      const activeNode = nodes.find((n) => n.status === "current") || nodes[0];
      const containerWidth = scrollContainerRef.current.clientWidth;
      const targetScrollLeft = activeNode.x - containerWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const handleNodeClick = (node: PathNode) => {
    if (node.status === "locked") {
      soundManager.playError();
      return;
    }

    if (node.type === "chest") {
      soundManager.playSuccess();
      if (!chestOpened[node.id]) {
        setChestOpened((prev) => ({ ...prev, [node.id]: true }));
        addXP(node.xpReward);

        // Confetti celebration
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setBonusNotification(`🎉 Mở rương thành công! Bạn nhận được +${node.xpReward} XP!`);
        setTimeout(() => setBonusNotification(null), 3000);
      }
      return;
    }

    // Open lesson modal
    soundManager.playClick();
    setActiveLessonModal(node);
    setQuizStep(0);
    setQuizScore(0);
    setSelectedAns(null);
    setIsAnswerChecked(false);
  };

  const handleCheckAnswer = () => {
    if (selectedAns === null) return;
    setIsAnswerChecked(true);

    if (selectedAns === miniQuestions[quizStep].correct) {
      soundManager.playSuccess();
      setQuizScore((prev) => prev + 1);
    } else {
      soundManager.playError();
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    setSelectedAns(null);
    setIsAnswerChecked(false);

    if (quizStep < miniQuestions.length - 1) {
      setQuizStep((prev) => prev + 1);
    } else {
      // Completed lesson!
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}

      addXP(activeLessonModal?.xpReward || 25);
      setActiveLessonModal(null);
      setBonusNotification(`🌟 Chúc mừng bạn đã hoàn thành bài học! Nhận +${activeLessonModal?.xpReward || 25} XP!`);
      setTimeout(() => setBonusNotification(null), 3500);
    }
  };

  // Generate SVG cubic Bezier path running smoothly from Left to Right
  const generateTrailPath = (nodeList: PathNode[]) => {
    if (nodeList.length < 2) return "";
    let d = `M ${nodeList[0].x} ${nodeList[0].y}`;
    for (let i = 0; i < nodeList.length - 1; i++) {
      const p0 = nodeList[i];
      const p1 = nodeList[i + 1];
      const midX = (p0.x + p1.x) / 2;
      d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const completedNodes = nodes.filter((n) => n.status === "completed");
  const totalCompletedCount = completedNodes.length;
  const progressPercent = Math.round((totalCompletedCount / nodes.length) * 100);

  const fullTrailPath = generateTrailPath(nodes);
  // Active trail up to the current active node
  const activeNodesSlice = nodes.slice(
    0,
    nodes.findIndex((n) => n.status === "current") + 1 || nodes.length
  );
  const activeTrailPath = generateTrailPath(activeNodesSlice);

  return (
    <div className="w-full bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      {/* Toast notification */}
      {bonusNotification && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-600 text-white font-extrabold text-sm shadow-xl animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{bonusNotification}</span>
        </div>
      )}

      {/* --- TOP CONTROL & PROGRESS BAR --- */}
      <div className="p-4 sm:p-5 bg-linear-to-r from-amber-500/10 via-stone-50 to-emerald-500/10 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-hanzi text-xl font-black shadow-md border-2 border-amber-400">
            HSK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Lộ Trình Cấp Độ {currentHskLevel}
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full">
                Chặng 1 / 3
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-1.5">
              <span>Bản Đồ Hành Trình Khám Phá HSK {currentHskLevel}</span>
              <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h2>
          </div>
        </div>

        {/* Progress & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Progress Pill */}
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-stone-200 shadow-2xs flex items-center gap-2.5 text-xs font-bold">
            <span className="text-stone-500">Tiến độ:</span>
            <span className="text-emerald-700 font-extrabold font-mono">
              {totalCompletedCount} / {nodes.length} trạm
            </span>
            <div className="w-20 bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-stone-400 font-mono text-[11px]">{progressPercent}%</span>
          </div>

          {/* Quick Jump & Scroll Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs">
            <button
              onClick={scrollLeft}
              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToActiveNode}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
              title="Nhảy tới vị trí đang học"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>Vị trí hiện tại</span>
            </button>
            <button
              onClick={scrollRight}
              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- HORIZONTAL ADVENTURE MAP VIEWPORT (LEFT TO RIGHT) --- */}
      <div
        ref={scrollContainerRef}
        className="relative w-full h-[520px] overflow-x-auto overflow-y-hidden bg-linear-to-b from-amber-50/40 via-[#FDFBF7] to-emerald-50/30 select-none custom-scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {/* Landscape Background Canvas */}
        <div className="relative w-[1640px] h-full min-h-[520px]">
          {/* Decorative Oriental Mountains & Clouds Background Layer */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Distant Misty Mountain peaks */}
            <svg
              className="absolute bottom-0 left-0 w-full h-44 text-stone-300/30"
              viewBox="0 0 1640 160"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M0,160 L0,80 Q200,20 400,90 T800,60 T1200,100 T1640,40 L1640,160 Z" />
            </svg>

            {/* Floating Stylized Clouds */}
            <div className="absolute top-6 left-36 text-2xl select-none">☁️</div>
            <div className="absolute top-12 left-[520px] text-xl select-none">☁️</div>
            <div className="absolute top-5 left-[960px] text-2xl select-none">☁️</div>
            <div className="absolute top-10 left-[1380px] text-xl select-none">☁️</div>

            {/* Oriental Garden Landmarks along the landscape */}
            <div className="absolute top-6 left-[180px] flex items-center gap-1 text-xs font-serif text-stone-400">
              <span>🏮</span>
              <span>Làng Nhập Môn</span>
            </div>
            <div className="absolute top-10 left-[500px] flex items-center gap-1 text-xs font-serif text-stone-400">
              <span>🎋</span>
              <span>Rừng Trúc</span>
            </div>
            <div className="absolute top-6 left-[880px] flex items-center gap-1 text-xs font-serif text-stone-400">
              <span>🏮</span>
              <span>Phố Ẩm Thực</span>
            </div>
            <div className="absolute top-10 left-[1220px] flex items-center gap-1 text-xs font-serif text-stone-400">
              <span>⛩️</span>
              <span>Cổng Thành HSK</span>
            </div>
          </div>

          {/* Continuous SVG Winding Trail Connecting Nodes from Left to Right */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="activeTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Inactive Base Trail (Wide stone road) */}
            <path
              d={fullTrailPath}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dashed center line of paving stones */}
            <path
              d={fullTrailPath}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="4"
              strokeDasharray="8 12"
              strokeLinecap="round"
            />

            {/* Active / Completed Journey Overlay Trail */}
            {activeTrailPath && (
              <path
                d={activeTrailPath}
                fill="none"
                stroke="url(#activeTrailGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              />
            )}
          </svg>

          {/* --- INTERACTIVE ROADMAP NODES (1 to 9) --- */}
          {nodes.map((node, index) => {
            const isOpened = chestOpened[node.id];
            const isCompleted = node.status === "completed";
            const isCurrent = node.status === "current";
            const isLocked = node.status === "locked";

            return (
              <div
                key={node.id}
                className="absolute z-10 flex flex-col items-center -translate-x-1/2 transition-transform duration-300"
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
              >
                {/* Button Anchor Container (Centered at node.x, node.y) */}
                <div className="relative -translate-y-1/2 flex items-center justify-center">
                  {/* Cheering Mascot Floating on Active Node (Fully Visible with Zero Clipping) */}
                  {isCurrent && node.type === "lesson" && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 animate-float-gentle">
                      <PandaMascot mood="cheering" size="sm" />
                      <div className="bg-linear-to-r from-amber-600 to-orange-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-lg border border-white/60 whitespace-nowrap -mt-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                        <span>Bài học tiếp theo!</span>
                      </div>
                    </div>
                  )}

                  {/* Main 3D Node Button */}
                  <button
                    onClick={() => handleNodeClick(node)}
                    className={`relative rounded-full flex flex-col items-center justify-center transition-all select-none cursor-pointer group shadow-lg ${
                      node.type === "checkpoint"
                        ? "w-22 h-22 sm:w-24 sm:h-24 bg-linear-to-br from-amber-500 to-amber-700 border-4 border-amber-400 text-white shadow-[0_8px_0_#B45309] hover:scale-105 active:translate-y-1.5 active:shadow-none"
                        : isCompleted
                        ? "w-20 h-20 sm:w-22 sm:h-22 bg-[#58CC02] border-4 border-[#46A302] text-white shadow-[0_7px_0_#46A302] hover:scale-105 active:translate-y-1.5 active:shadow-none"
                        : isCurrent
                        ? "w-20 h-20 sm:w-22 sm:h-22 bg-amber-500 border-4 border-amber-600 text-white shadow-[0_7px_0_#D97706] hover:scale-105 active:translate-y-1.5 active:shadow-none ring-8 ring-amber-500/25"
                        : "w-18 h-18 sm:w-20 sm:h-20 bg-stone-200 border-4 border-stone-300 text-stone-400 shadow-[0_6px_0_#CBD5E1] cursor-not-allowed"
                    }`}
                    title={node.title}
                  >
                    {/* Node Inner Graphic */}
                    {node.type === "chest" ? (
                      <div className="flex flex-col items-center">
                        <Gift
                          className={`w-9 h-9 ${
                            isOpened ? "text-stone-300" : isCurrent ? "text-white animate-bounce" : "text-stone-400"
                          }`}
                        />
                      </div>
                    ) : node.type === "checkpoint" ? (
                      <Trophy className="w-10 h-10 text-amber-200 fill-amber-200" />
                    ) : isCompleted ? (
                      <Check className="w-9 h-9 stroke-[3]" />
                    ) : isCurrent ? (
                      <Play className="w-9 h-9 fill-current ml-1" />
                    ) : (
                      <Lock className="w-7 h-7" />
                    )}

                    {/* 3 Golden Stars on Completed Nodes */}
                    {isCompleted && (
                      <div className="absolute -bottom-2 flex gap-0.5 bg-white/90 px-1.5 py-0.5 rounded-full shadow-2xs border border-amber-200">
                        {[1, 2, 3].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                    )}

                    {/* Chest Opened Checkmark Badge */}
                    {node.type === "chest" && isOpened && (
                      <div className="absolute -bottom-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Node Title & Subtitle Card (Placed Below Each Node) */}
                <div className="text-center -mt-2 max-w-[155px] pointer-events-none">
                  <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 border border-stone-200 shadow-2xs text-stone-600 uppercase tracking-wider mb-0.5">
                    Trạm {node.number}
                  </div>
                  <span className="font-extrabold text-xs text-stone-900 block leading-tight">
                    {node.title}
                  </span>
                  <span className="text-[10px] text-stone-500 block leading-tight mt-0.5 line-clamp-1">
                    {node.subtitle}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
                    +{node.xpReward} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- DUOLINGO MINI-LESSON QUIZ MODAL --- */}
      {activeLessonModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
            {/* Header */}
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Câu {quizStep + 1} / {miniQuestions.length}
                </span>
                <h3 className="text-sm font-black text-stone-900">
                  {activeLessonModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLessonModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <span className="font-hanzi text-5xl font-black text-stone-900 block">
                  {miniQuestions[quizStep].zh}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-mono font-bold text-amber-700">
                    [{miniQuestions[quizStep].pinyin}]
                  </span>
                  <button
                    onClick={() => audioEngine.speak(miniQuestions[quizStep].zh, { rate: 1.0 })}
                    className="p-1.5 rounded-full text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-stone-500 font-medium pt-1">
                  {miniQuestions[quizStep].question}
                </p>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {miniQuestions[quizStep].options.map((opt, idx) => {
                  const isSelected = selectedAns === idx;
                  const isCorrect = isAnswerChecked && idx === miniQuestions[quizStep].correct;
                  const isWrong = isAnswerChecked && isSelected && idx !== miniQuestions[quizStep].correct;

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedAns(idx);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer ${
                        isCorrect
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs"
                          : isWrong
                          ? "bg-rose-50 border-rose-500 text-rose-900"
                          : isSelected
                          ? "bg-amber-50 border-amber-600 text-amber-950 shadow-xs"
                          : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              {isAnswerChecked ? (
                <div className="flex items-center gap-2">
                  {selectedAns === miniQuestions[quizStep].correct ? (
                    <span className="text-sm font-extrabold text-emerald-600 flex items-center gap-1.5">
                      <Check className="w-5 h-5 stroke-[3]" /> Chính xác! Tuyệt vời!
                    </span>
                  ) : (
                    <span className="text-sm font-extrabold text-rose-600">
                      Chưa chính xác, cố lên nhé!
                    </span>
                  )}
                </div>
              ) : (
                <div />
              )}

              {isAnswerChecked ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-sm uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAns === null}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                    selectedAns !== null
                      ? "bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  Kiểm tra
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
