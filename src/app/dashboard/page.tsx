"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import { HSK_LEVELS } from "@/data/hsk-levels";
import { UNITS_DATA } from "@/data/units";
import { soundManager } from "@/lib/utils";
import {
  Flame,
  Zap,
  BookOpen,
  Volume2,
  Mic,
  PenTool,
  GraduationCap,
  FileCheck,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Bookmark,
} from "lucide-react";

export default function DashboardPage() {
  const { user, currentHskLevel, stats } = useApp();
  const currentLvlInfo = HSK_LEVELS.find((l) => l.level === currentHskLevel) || HSK_LEVELS[0];
  const nextLesson = UNITS_DATA[0]?.lessons[0];

  const quickModules = [
    {
      href: "/vocabulary",
      title: "Flashcard SRS",
      desc: `${stats.reviewQueueCount + 12} từ vựng đang chờ ôn tập`,
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      btnText: "Ôn Tập Ngay",
    },
    {
      href: "/writing",
      title: "Luyện Viết Chữ Hán",
      desc: "Tập viết thứ tự nét bút trên ô 米字格",
      icon: PenTool,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      btnText: "Vào Phòng Viết",
    },
    {
      href: "/listening",
      title: "Luyện Nghe Giọng Chuẩn",
      desc: "Luyện nghe Bắc Kinh đa tốc độ & chép chính tả",
      icon: Volume2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      btnText: "Luyện Nghe",
    },
    {
      href: "/speaking",
      title: "Luyện Nói & Chấm Điểm",
      desc: "Nhận diện thanh điệu và đối thoại tình huống AI",
      icon: Mic,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      btnText: "Bật Micro",
    },
    {
      href: "/grammar",
      title: "Ngữ Pháp HSK",
      desc: "Cấu trúc, lỗi sai phổ biến & bài tập trắc nghiệm",
      icon: GraduationCap,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      btnText: "Tra Cứu",
    },
    {
      href: "/exams",
      title: "Thi Thử HSK Bấm Giờ",
      desc: "Đề thi mô phỏng tính điểm chuẩn Hanban",
      icon: FileCheck,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      btnText: "Vào Phòng Thi",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider">
                Bảng Điều Khiển Học Tập
              </span>
              <span className="text-xs font-medium text-stone-500">
                Chào mừng trở lại, {user.fullName}!
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Lộ Trình Chinh Phục: <span className="text-amber-600">{currentLvlInfo.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {currentLvlInfo.description}
            </p>
          </div>

          {/* Quick AI Tutor Pill */}
          <Link
            href="/ai-tutor"
            className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-200/80 transition-all flex items-center gap-3 shrink-0 group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-sm block">
                Hỏi Gia Sư AI
              </span>
              <span className="text-xs text-amber-800">
                Giải thích câu & ngữ pháp tức thì →
              </span>
            </div>
          </Link>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider">Chuỗi Học Tập</span>
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
            <div className="text-2xl font-extrabold text-stone-900 font-mono">
              {user.dailyStreak} <span className="text-sm font-normal text-stone-500">ngày liên tiếp</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              ↑ Giữ vững ngọn lửa học tập
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider">Điểm Tích Lũy</span>
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-stone-900 font-mono">
              {user.totalXp} <span className="text-sm font-normal text-stone-500">XP</span>
            </div>
            <div className="text-[11px] text-amber-700 font-medium">
              Hạng: Học viên chăm chỉ
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider">Từ Vựng Đã Thuộc</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-stone-900 font-mono">
              {stats.wordsMastered + 45} <span className="text-sm font-normal text-stone-500">/ {currentLvlInfo.requiredVocabCount}</span>
            </div>
            <div className="text-[11px] text-stone-500">
              Thuật toán lặp lại ngắt quãng SM-2
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-bold uppercase tracking-wider">Mục Tiêu Hôm Nay</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-stone-900 font-mono">
              15 <span className="text-sm font-normal text-stone-500">/ 20 phút</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-amber-500 h-full w-3/4 rounded-full" />
            </div>
          </div>
        </div>

        {/* Recommended Next Lesson Card */}
        {nextLesson && (
          <div className="bg-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Bài Học Tiếp Theo Cần Hoàn Thành
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {nextLesson.title}: {nextLesson.titleVn}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                Mục tiêu: {nextLesson.learningObjectives.join(" • ")}
              </p>
            </div>

            <Link
              href="/curriculum"
              className="px-6 py-3 rounded-2xl bg-white text-stone-950 font-bold text-sm hover:bg-stone-100 transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <span>Tiếp Tục Học Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* 6 Core Practice Rooms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Các Không Gian Luyện Tập Trọng Tâm
              </h2>
              <p className="text-xs text-stone-500">
                Được thiết kế toàn diện theo 4 kỹ năng Nghe - Nói - Đọc - Viết và Gia Sư AI
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickModules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${mod.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <Link
                    href={mod.href}
                    className="w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs text-stone-800 text-center flex items-center justify-center gap-1.5 transition-colors group-hover:border-amber-400 group-hover:bg-amber-50/60"
                  >
                    <span>{mod.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
