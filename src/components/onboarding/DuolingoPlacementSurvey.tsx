"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { HSKLevelNumber } from "@/types";
import { PandaMascot } from "@/components/mascot/PandaMascot";
import { soundManager } from "@/lib/utils";
import { audioEngine } from "@/lib/audio";
import {
  X,
  Volume2,
  Check,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Plane,
  Film,
  Brain,
  RotateCcw,
  Compass,
} from "lucide-react";

// Signal Bars icon matching Duolingo design
function SignalBars({ level, isSelected }: { level: number; isSelected: boolean }) {
  return (
    <div className="flex items-end gap-1 h-6 shrink-0 px-1">
      {[1, 2, 3, 4, 5].map((bar) => {
        const isLit = bar <= level;
        return (
          <span
            key={bar}
            className={`w-1.5 rounded-xs transition-colors duration-200 ${
              isLit
                ? isSelected
                  ? "bg-amber-400"
                  : "bg-amber-500"
                : "bg-stone-700/60"
            }`}
            style={{ height: `${bar * 4 + 4}px` }}
          />
        );
      })}
    </div>
  );
}

export function DuolingoPlacementSurvey() {
  const router = useRouter();
  const { setCurrentHskLevel, setUser } = useApp();

  // Steps: 1: Current Level | 2: Goal | 3: Daily Target | 4: Placement Quiz | 5: Final Result
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Selections (Default to sensible choices so button is always interactive)
  const [selectedProficiency, setSelectedProficiency] = useState<number | null>(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>("career");
  const [selectedDailyTime, setSelectedDailyTime] = useState<number | null>(15);

  // Quiz state (for Step 4)
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState<number>(0);

  // Calculated placement level
  const [assignedLevel, setAssignedLevel] = useState<HSKLevelNumber>(1);

  // 1. Proficiency Levels
  const proficiencyOptions = [
    {
      id: 1,
      bars: 1,
      title: "Tôi mới học tiếng Trung (giản thể)",
      desc: "Chưa biết gì, muốn bắt đầu từ con số 0 (Phát âm Pinyin & nét cơ bản)",
      targetHsk: 1 as HSKLevelNumber,
    },
    {
      id: 2,
      bars: 2,
      title: "Tôi biết một vài từ thông dụng",
      desc: "Đã nắm bính âm Pinyin cơ bản và vài câu chào hỏi quen thuộc",
      targetHsk: 1 as HSKLevelNumber,
    },
    {
      id: 3,
      bars: 3,
      title: "Tôi có thể giao tiếp cơ bản",
      desc: "Tự tin giới thiệu bản thân, mua sắm, hỏi đường hàng ngày",
      targetHsk: 2 as HSKLevelNumber,
    },
    {
      id: 4,
      bars: 4,
      title: "Tôi có thể trao đổi về nhiều chủ đề",
      desc: "Giao tiếp trôi chảy trong công việc, đời sống và du lịch",
      targetHsk: 3 as HSKLevelNumber,
    },
    {
      id: 5,
      bars: 5,
      title: "Tôi có thể nói về hầu hết các chủ đề chuyên sâu",
      desc: "Muốn chinh phục đỉnh cao HSK 4, 5, 6 và đọc báo chí kinh doanh",
      targetHsk: 4 as HSKLevelNumber,
    },
  ];

  // 2. Learning Goals
  const goalOptions = [
    {
      id: "career",
      icon: Briefcase,
      title: "Cơ hội nghề nghiệp & Kinh doanh",
      desc: "Làm việc tại công ty Trung Quốc, đàm phán, tìm nguồn hàng",
    },
    {
      id: "study_hsk",
      icon: GraduationCap,
      title: "Luyện thi chứng chỉ HSK 1–6 & Du học",
      desc: "Săn học bổng du học, chuẩn hóa văn bằng quốc tế",
    },
    {
      id: "travel",
      icon: Plane,
      title: "Du lịch & Giao tiếp tự nhiên",
      desc: "Khám phá ẩm thực, văn hóa và kết bạn bản xứ",
    },
    {
      id: "entertainment",
      icon: Film,
      title: "Xem phim, nghe nhạc & Giải trí",
      desc: "Thưởng thức phim ảnh không cần phụ đề tiếng Việt",
    },
    {
      id: "mind",
      icon: Brain,
      title: "Rèn luyện trí não & Sở thích cá nhân",
      desc: "Thử thách bản thân với chữ tượng hình độc đáo",
    },
  ];

  // 3. Daily Commitments
  const dailyTimeOptions = [
    { minutes: 5, label: "Thư thả", sub: "5 phút / ngày (Khoảng 3–5 từ mới)" },
    { minutes: 10, label: "Vừa phải", sub: "10 phút / ngày (Chuẩn phản xạ Duolingo)" },
    { minutes: 15, label: "Nghiêm túc", sub: "15 phút / ngày (Tiến bộ vượt bậc sau 1 tháng)" },
    { minutes: 20, label: "Siêu cấp", sub: "20+ phút / ngày (Tăng tốc bứt phá HSK)" },
  ];

  // 4. Quick Mini Placement Quiz
  const placementQuestions = [
    {
      audioZh: "你好",
      question: "Nghe phát âm và chọn chữ Hán chính xác:",
      options: [
        { key: "A", zh: "你好", pinyin: "nǐ hǎo", vn: "Xin chào" },
        { key: "B", zh: "谢谢", pinyin: "xièxie", vn: "Cảm ơn" },
        { key: "C", zh: "再见", pinyin: "zàijiàn", vn: "Tạm biệt" },
        { key: "D", zh: "吃饭", pinyin: "chī fàn", vn: "Ăn cơm" },
      ],
      correctKey: "A",
    },
    {
      audioZh: "我是越南人",
      question: "Chọn từ điền vào chỗ trống: \"我是_____人\" (Tôi là người Việt Nam)",
      options: [
        { key: "A", zh: "衣服", pinyin: "yīfu", vn: "quần áo" },
        { key: "B", zh: "越南", pinyin: "Yuènán", vn: "Việt Nam" },
        { key: "C", zh: "飞机", pinyin: "fēijī", vn: "máy bay" },
        { key: "D", zh: "喝茶", pinyin: "hē chá", vn: "uống trà" },
      ],
      correctKey: "B",
    },
    {
      audioZh: "今天天气很好",
      question: "Câu \"今天天气很好\" có ý nghĩa là gì?",
      options: [
        { key: "A", zh: "Hôm nay trời rất lạnh", pinyin: "", vn: "今天天气很冷" },
        { key: "B", zh: "Hôm nay thời tiết rất đẹp", pinyin: "", vn: "Nghĩa tiếng Việt chuẩn xác" },
        { key: "C", zh: "Ngày mai tôi đi làm", pinyin: "", vn: "明天我去工作" },
        { key: "D", zh: "Rất vui được quen bạn", pinyin: "", vn: "很高兴认识你" },
      ],
      correctKey: "B",
    },
  ];

  // Check if current step is ready to proceed
  const canContinue = () => {
    if (currentStep === 1) return selectedProficiency !== null;
    if (currentStep === 2) return selectedGoal !== null;
    if (currentStep === 3) return selectedDailyTime !== null;
    if (currentStep === 4) return quizAnswers[quizIndex] !== undefined;
    if (currentStep === 5) return true;
    return true;
  };

  const handleNextStep = () => {
    try { soundManager.playClick(); } catch {}

    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      setQuizIndex(0);
      return;
    }

    if (currentStep === 4) {
      if (quizIndex < placementQuestions.length - 1) {
        setQuizIndex((prev) => prev + 1);
      } else {
        let score = 0;
        placementQuestions.forEach((q, idx) => {
          if (quizAnswers[idx] === q.correctKey) score++;
        });
        setQuizScore(score);

        let finalLvl: HSKLevelNumber = 1;
        const prof = proficiencyOptions.find((p) => p.id === selectedProficiency);
        if (prof) {
          finalLvl = prof.targetHsk;
          if (score === 3 && finalLvl < 6) {
            finalLvl = Math.min(6, finalLvl + 1) as HSKLevelNumber;
          }
        }

        setAssignedLevel(finalLvl);
        setCurrentStep(5);
        try { soundManager.playSuccess(); } catch {}
      }
      return;
    }

    if (currentStep === 5) {
      setCurrentHskLevel(assignedLevel);
      setUser((prev) => ({
        ...prev,
        currentHskLevel: assignedLevel,
        dailyGoalMinutes: selectedDailyTime || 15,
      }));

      if (typeof window !== "undefined") {
        localStorage.setItem("hanzi_current_level", String(assignedLevel));
        localStorage.setItem("hanzi_onboarding_done", "true");
      }

      router.push("/dashboard");
    }
  };

  const playAudio = (text: string) => {
    try {
      soundManager.playClick();
      audioEngine.speak(text, { rate: 1.0 });
    } catch {}
  };

  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#131F24] text-white flex flex-col font-sans selection:bg-amber-500/30">
      {/* 1. TOP PROGRESS BAR & NAVIGATION BUTTONS */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-xs font-bold text-stone-400 hover:text-white px-3 py-1.5 rounded-xl border border-stone-700 hover:bg-stone-800 transition-colors shrink-0 flex items-center gap-1.5"
          title="Quay lại trang chủ HANZI MASTER"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Trang Chủ</span>
        </Link>

        {/* Progress bar container */}
        <div className="flex-1 h-3.5 bg-[#2B383F] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-linear-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${Math.max(12, progressPercent)}%` }}
          />
        </div>

        {/* Step Counter */}
        <span className="text-xs font-bold text-stone-400 shrink-0">
          {currentStep}/{totalSteps}
        </span>

        {/* Skip to Dashboard */}
        <Link
          href="/dashboard"
          className="text-xs font-bold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-400/30 hover:bg-amber-400/10 transition-colors shrink-0 flex items-center gap-1.5"
          title="Bỏ qua khảo sát để vào thẳng Bảng điều khiển"
        >
          <span>Vào Bảng Điều Khiển</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* 2. MAIN ONBOARDING & ASSESSMENT WORKSPACE */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center">
        {/* STEP 1: CURRENT PROFICIENCY */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-start gap-4 sm:gap-6">
              <PandaMascot mood="happy" size="md" />

              <div className="relative bg-[#202F36] border-2 border-[#2B3D47] rounded-3xl p-5 sm:p-6 shadow-xl flex-1 mt-2">
                <div className="absolute top-6 -left-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-[#202F36]" />
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Trình độ tiếng Trung (giản thể) của bạn ở mức nào?
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Chọn mức độ phù hợp nhất để hệ thống đề xuất bài học chính xác.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {proficiencyOptions.map((opt) => {
                const isSelected = selectedProficiency === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      try { soundManager.playClick(); } catch {}
                      setSelectedProficiency(opt.id);
                    }}
                    className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer select-none group ${
                      isSelected
                        ? "bg-[#18343D] border-[#46A2C2] text-white shadow-lg shadow-[#46A2C2]/10 scale-[1.01]"
                        : "bg-[#202F36] border-[#2B3D47] text-stone-200 hover:bg-[#253842] hover:border-[#384E5A]"
                    }`}
                  >
                    <SignalBars level={opt.bars} isSelected={isSelected} />

                    <div className="flex-1">
                      <span className="font-extrabold text-sm sm:text-base block leading-snug">
                        {opt.title}
                      </span>
                      <span className="text-xs text-stone-400 block mt-0.5 leading-tight">
                        {opt.desc}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#46A2C2] border-[#46A2C2] text-[#131F24]"
                          : "border-stone-600 group-hover:border-stone-500"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: LEARNING GOAL */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-start gap-4 sm:gap-6">
              <PandaMascot mood="thinking" size="md" />

              <div className="relative bg-[#202F36] border-2 border-[#2B3D47] rounded-3xl p-5 sm:p-6 shadow-xl flex-1 mt-2">
                <div className="absolute top-6 -left-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-[#202F36]" />
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Mục tiêu chính khi học tiếng Trung của bạn là gì?
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  HANZI MASTER sẽ thiết kế các chủ đề từ vựng và bài nghe xoay quanh mục tiêu này.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {goalOptions.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      try { soundManager.playClick(); } catch {}
                      setSelectedGoal(goal.id);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer select-none group ${
                      isSelected
                        ? "bg-[#18343D] border-[#46A2C2] text-white shadow-lg shadow-[#46A2C2]/10 scale-[1.01]"
                        : "bg-[#202F36] border-[#2B3D47] text-stone-200 hover:bg-[#253842] hover:border-[#384E5A]"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#46A2C2]/20 text-[#46A2C2]"
                          : "bg-stone-800 text-stone-400 group-hover:text-amber-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <span className="font-extrabold text-sm sm:text-base block">
                        {goal.title}
                      </span>
                      <span className="text-xs text-stone-400 block mt-0.5">
                        {goal.desc}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#46A2C2] border-[#46A2C2] text-[#131F24]"
                          : "border-stone-600 group-hover:border-stone-500"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: DAILY COMMITMENT */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-start gap-4 sm:gap-6">
              <PandaMascot mood="happy" size="md" />

              <div className="relative bg-[#202F36] border-2 border-[#2B3D47] rounded-3xl p-5 sm:p-6 shadow-xl flex-1 mt-2">
                <div className="absolute top-6 -left-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-[#202F36]" />
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Mỗi ngày bạn muốn dành bao nhiêu thời gian?
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Duy trì thói quen mỗi ngày là chìa khóa để giữ chuỗi ngọn lửa Streak bền vững.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {dailyTimeOptions.map((time) => {
                const isSelected = selectedDailyTime === time.minutes;
                return (
                  <button
                    key={time.minutes}
                    onClick={() => {
                      try { soundManager.playClick(); } catch {}
                      setSelectedDailyTime(time.minutes);
                    }}
                    className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer select-none group h-28 ${
                      isSelected
                        ? "bg-[#18343D] border-[#46A2C2] text-white shadow-lg shadow-[#46A2C2]/10 scale-[1.02]"
                        : "bg-[#202F36] border-[#2B3D47] text-stone-200 hover:bg-[#253842] hover:border-[#384E5A]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base sm:text-lg flex items-center gap-2">
                        <Flame className={`w-4.5 h-4.5 ${isSelected ? "text-amber-400 fill-amber-400" : "text-stone-500"}`} />
                        {time.label}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-amber-400 text-[#131F24]" : "bg-stone-800 text-stone-400"}`}>
                        {time.minutes} phút
                      </span>
                    </div>

                    <span className="text-xs text-stone-400 leading-snug">
                      {time.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: QUICK PLACEMENT QUIZ */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-start gap-4 sm:gap-6">
              <PandaMascot mood="thinking" size="md" />

              <div className="relative bg-[#202F36] border-2 border-[#2B3D47] rounded-3xl p-5 shadow-xl flex-1 mt-2">
                <div className="absolute top-6 -left-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-[#202F36]" />
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                  <span>THỬ THÁCH PHẢN XẠ NHANH</span>
                  <span>Câu {quizIndex + 1}/3</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {placementQuestions[quizIndex].question}
                </h2>
              </div>
            </div>

            <div className="flex items-center justify-center py-2">
              <button
                onClick={() => playAudio(placementQuestions[quizIndex].audioZh)}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-[#131F24] font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className="w-5 h-5 fill-current" />
                <span>Bấm để nghe phát âm</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {placementQuestions[quizIndex].options.map((opt) => {
                const isSelected = quizAnswers[quizIndex] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => {
                      try { soundManager.playClick(); } catch {}
                      setQuizAnswers({ ...quizAnswers, [quizIndex]: opt.key });
                    }}
                    className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer select-none group ${
                      isSelected
                        ? "bg-[#18343D] border-[#46A2C2] text-white shadow-lg shadow-[#46A2C2]/10 scale-[1.02]"
                        : "bg-[#202F36] border-[#2B3D47] text-stone-200 hover:bg-[#253842] hover:border-[#384E5A]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-stone-800 text-stone-300 font-mono font-bold text-xs flex items-center justify-center">
                        {opt.key}
                      </span>
                      <div>
                        <span className="font-hanzi text-lg font-bold block text-white">
                          {opt.zh}
                        </span>
                        {opt.pinyin && (
                          <span className="text-[11px] font-mono text-amber-400 block">
                            [{opt.pinyin}]
                          </span>
                        )}
                        <span className="text-xs text-stone-400 block">
                          {opt.vn}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#46A2C2] border-[#46A2C2] text-[#131F24]"
                          : "border-stone-600 group-hover:border-stone-500"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: FINAL PLACEMENT RESULT */}
        {currentStep === 5 && (
          <div className="text-center space-y-6 animate-fadeIn py-2">
            <div className="flex justify-center">
              <PandaMascot mood="cheering" size="lg" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Đánh giá hoàn tất • Xếp lớp cá nhân hóa
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Lộ trình phù hợp nhất với bạn: <br />
                <span className="text-amber-400 font-hanzi">
                  Cấp Độ HSK {assignedLevel}
                </span>
              </h1>
              <p className="text-sm text-stone-300 max-w-lg mx-auto">
                Dựa trên mục tiêu và bài kiểm tra phản xạ, hệ thống đã mở khóa lộ trình học chuẩn khung quốc tế cho bạn.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-[#202F36] border-2 border-[#2B3D47] rounded-3xl p-5 text-left space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-700/60 text-xs">
                <span className="text-stone-400">Trình độ bắt đầu:</span>
                <span className="font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  HSK {assignedLevel} (Sơ cấp)
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-stone-700/60 text-xs">
                <span className="text-stone-400">Mục tiêu luyện tập:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  {selectedDailyTime} phút mỗi ngày
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Gia sư AI đồng hành:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Sẵn sàng giải đáp 24/7
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. FIXED BOTTOM BAR (3D Duolingo Continue Button) */}
      <footer className="w-full border-t border-[#2B383F] bg-[#131F24] py-4 sm:py-5 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              onClick={() => {
                try { soundManager.playClick(); } catch {}
                setCurrentStep((prev) => Math.max(1, prev - 1));
              }}
              className="px-4 py-3 rounded-2xl border-2 border-[#2B3D47] text-stone-400 hover:text-white hover:bg-[#202F36] font-bold text-sm transition-colors cursor-pointer"
            >
              Quay lại
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNextStep}
            disabled={!canContinue()}
            className={`px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider transition-all select-none flex items-center gap-2 cursor-pointer shadow-[0_4px_0_#46A302] active:translate-y-1 active:shadow-none ${
              canContinue()
                ? "bg-[#58CC02] hover:bg-[#46A302] text-white"
                : "bg-[#58CC02]/80 hover:bg-[#46A302] text-white"
            }`}
          >
            <span>{currentStep === 5 ? "Bắt Đầu Học Ngay" : "Tiếp Tục"}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>
      </footer>
    </div>
  );
}
