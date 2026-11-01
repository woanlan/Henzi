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
  Trophy,
  Gamepad2,
  Map,
  Compass,
  Star,
  Play,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const { user, currentHskLevel, stats, toggleAiChat } = useApp();
  const currentLvlInfo = HSK_LEVELS.find((l) => l.level === currentHskLevel) || HSK_LEVELS[0];
  const nextLesson = UNITS_DATA[0]?.lessons[0];

  // 12 Comprehensive modules covering every single feature
  const quickModules = [
    {
      href: "/curriculum",
      title: "Lộ Trình Học Kiểu Duolingo",
      desc: "Lộ trình snake path mở khóa bài học, tích lũy vương miện & mở rương báu",
      icon: Map,
      badge: "HOT • Duolingo",
      badgeColor: "bg-emerald-100 text-emerald-800",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      btnText: "Khám Phá Lộ Trình",
    },
    {
      href: "/match",
      title: "Nối Từ Phản Xạ 60 Giây",
      desc: "Thử thách ghép cặp chữ Hán & nghĩa tiếng Việt chạy đua với thời gian, tích combo x2, x3",
      icon: Gamepad2,
      badge: "Luyện Phản Xạ",
      badgeColor: "bg-rose-100 text-rose-800",
      color: "text-rose-600 bg-rose-50 border-rose-200",
      btnText: "Bắt Đầu Chơi",
    },
    {
      href: "/leaderboard",
      title: "Đua Top Bảng Xếp Hạng",
      desc: "Tranh tài tích lũy XP hàng tuần tại các giải Đồng, Bạc, Vàng và Kim Cương",
      icon: Trophy,
      badge: "Giải Đấu Tuần",
      badgeColor: "bg-amber-100 text-amber-800",
      color: "text-amber-600 bg-amber-50 border-amber-200",
      btnText: "Xem Bảng Xếp Hạng",
    },
    {
      href: "/writing",
      title: "Luyện Viết Chữ Hán (Tự Nhập Chữ)",
      desc: "MỚI: Tự gõ bất kỳ chữ Hán nào để xem hoạt họa nét bút & cảm biến chấm điểm thuận bút",
      icon: PenTool,
      badge: "Mới Nâng Cấp",
      badgeColor: "bg-blue-100 text-blue-800",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      btnText: "Vào Phòng Viết",
    },
    {
      href: "/pinyin",
      title: "Bảng Âm Tiết Pinyin Tương Tác",
      desc: "Ma trận 21 thanh mẫu, vận mẫu, đồ thị cao độ 4 thanh điệu & mẹo sửa lỗi phát âm người Việt",
      icon: Sparkles,
      badge: "Mới Ra Mắt",
      badgeColor: "bg-purple-100 text-purple-800",
      color: "text-purple-600 bg-purple-50 border-purple-200",
      btnText: "Tra Cứu Pinyin",
    },
    {
      href: "/radicals",
      title: "214 Bộ Thủ & Chiết Tự Chữ Hán",
      desc: "Giải mã nguồn gốc chữ tượng hình, câu chuyện ghi nhớ và phân loại 214 bộ thủ kinh điển",
      icon: BookOpen,
      badge: "Mới Ra Mắt",
      badgeColor: "bg-indigo-100 text-indigo-800",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      btnText: "Khám Phá Bộ Thủ",
    },
    {
      href: "/vocabulary",
      title: "Từ Vựng SRS & Xuất Anki",
      desc: `${stats.reviewQueueCount + 12} từ vựng chờ ôn tập • Hỗ trợ tải Anki deck & in PDF`,
      icon: Zap,
      badge: "SuperMemo SM-2",
      badgeColor: "bg-amber-100 text-amber-800",
      color: "text-amber-600 bg-amber-50 border-amber-200",
      btnText: "Ôn Tập Từ Vựng",
    },
    {
      href: "/onboarding",
      title: "Khảo Sát & Đánh Giá Trình Độ",
      desc: "Khảo sát mục tiêu học tập, bài test năng lực chuẩn Duolingo và xếp lớp HSK phù hợp",
      icon: Compass,
      badge: "Chuẩn Duolingo",
      badgeColor: "bg-teal-100 text-teal-800",
      color: "text-teal-600 bg-teal-50 border-teal-200",
      btnText: "Làm Bài Đánh Giá",
    },
    {
      href: "/listening",
      title: "Luyện Nghe Giọng Chuẩn",
      desc: "Luyện nghe Bắc Kinh đa tốc độ, hội thoại thực tế & chép chính tả",
      icon: Volume2,
      badge: "Bắc Kinh 100%",
      badgeColor: "bg-emerald-100 text-emerald-800",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      btnText: "Luyện Nghe",
    },
    {
      href: "/speaking",
      title: "Luyện Nói & Chấm Điểm AI",
      desc: "Nhận diện thanh điệu giọng nói và đối thoại tình huống thực tế qua micro",
      icon: Mic,
      badge: "Chấm Điểm Voice",
      badgeColor: "bg-purple-100 text-purple-800",
      color: "text-purple-600 bg-purple-50 border-purple-200",
      btnText: "Bật Micro Luyện Nói",
    },
    {
      href: "/grammar",
      title: "Bách Khoa Ngữ Pháp HSK",
      desc: "Cấu trúc ngữ pháp trọng điểm, bẫy đề thi và phân tích lỗi sai người Việt",
      icon: GraduationCap,
      badge: "Toàn Diện",
      badgeColor: "bg-stone-100 text-stone-800",
      color: "text-rose-600 bg-rose-50 border-rose-200",
      btnText: "Tra Cứu Ngữ Pháp",
    },
    {
      href: "/exams",
      title: "Thi Thử HSK Bấm Giờ",
      desc: "Đề thi mô phỏng tính điểm chuẩn Hanban, phân tích điểm yếu sau khi nộp bài",
      icon: FileCheck,
      badge: "Đề Chuẩn Hanban",
      badgeColor: "bg-blue-100 text-blue-800",
      color: "text-blue-600 bg-blue-50 border-blue-200",
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider">
                Bảng Điều Khiển Học Tập
              </span>
              <span className="text-xs font-medium text-stone-500">
                Chào mừng trở lại, {user.fullName}!
              </span>
              <Link
                href="/onboarding"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 underline decoration-amber-300 underline-offset-4 flex items-center gap-1 ml-1"
                title="Khảo sát & Đánh giá lại trình độ chuẩn Duolingo"
              >
                <span>Đánh giá lại trình độ</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Lộ Trình Chinh Phục: <span className="text-amber-600">{currentLvlInfo.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {currentLvlInfo.description}
            </p>
          </div>

          {/* Quick AI Tutor Pill - Opens Floating Chat Box */}
          <button
            onClick={() => {
              soundManager.playClick();
              toggleAiChat();
            }}
            className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-200/80 transition-all flex items-center gap-3 shrink-0 group cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-sm block flex items-center gap-1.5">
                Hỏi Thầy Giáo AI
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs text-amber-800">
                Bật box chat tra từ & hỏi ngữ pháp →
              </span>
            </div>
          </button>
        </div>

        {/* --- QUICK ACTION SHORTCUT STRIP (ALL NEW FEATURES PROMINENTLY VISIBLE) --- */}
        <div className="bg-amber-500/10 border border-amber-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 px-1">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
              Truy Cập Nhanh Các Tính Năng Đột Phá Mới
            </span>
            <span className="text-[11px] text-amber-800 font-medium">
              Bấm vào các nút bên dưới để trải nghiệm ngay
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            <Link
              href="/curriculum"
              className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 shadow-2xs flex flex-col items-center text-center transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Map className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-700">
                Học Duolingo
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Lộ trình rắn</span>
            </Link>

            <Link
              href="/match"
              className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-300 shadow-2xs flex flex-col items-center text-center transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-rose-700">
                Game Nối Từ
              </span>
              <span className="text-[10px] text-rose-600 font-bold">Phản xạ 60s</span>
            </Link>

            <Link
              href="/leaderboard"
              className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 shadow-2xs flex flex-col items-center text-center transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-amber-700">
                Đua Top Tuần
              </span>
              <span className="text-[10px] text-amber-700 font-bold">4 Hạng Đấu</span>
            </Link>

            <Link
              href="/writing"
              className="p-2.5 rounded-xl bg-white hover:bg-blue-50 border border-stone-200 hover:border-blue-300 shadow-2xs flex flex-col items-center text-center transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <PenTool className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-blue-700">
                Tập Viết Chữ
              </span>
              <span className="text-[10px] text-blue-600 font-bold">Tự nhập mọi chữ</span>
            </Link>

            <Link
              href="/pinyin"
              className="p-2.5 rounded-xl bg-white hover:bg-purple-50 border border-stone-200 hover:border-purple-300 shadow-2xs flex flex-col items-center text-center transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-purple-700">
                Bảng Pinyin
              </span>
              <span className="text-[10px] text-purple-600 font-bold">4 Thanh Điệu</span>
            </Link>

            <Link
              href="/radicals"
              className="p-2.5 rounded-xl bg-white hover:bg-indigo-50 border border-stone-200 hover:border-indigo-300 shadow-2xs flex flex-col items-center text-center transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-indigo-700">
                214 Bộ Thủ
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">Chiết tự chữ Hán</span>
            </Link>

            <Link
              href="/onboarding"
              className="p-2.5 rounded-xl bg-white hover:bg-teal-50 border border-stone-200 hover:border-teal-300 shadow-2xs flex flex-col items-center text-center transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-teal-700">
                Test Trình Độ
              </span>
              <span className="text-[10px] text-teal-600 font-bold">Khảo sát đầu vào</span>
            </Link>

            <button
              onClick={() => {
                soundManager.playClick();
                toggleAiChat();
              }}
              className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 shadow-2xs flex flex-col items-center text-center transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-amber-700">
                Gia Sư AI
              </span>
              <span className="text-[10px] text-amber-700 font-bold">Walkie-Talkie</span>
            </button>
          </div>
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

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/curriculum"
                className="px-5 py-3 rounded-2xl bg-white text-stone-950 font-bold text-sm hover:bg-stone-100 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Map className="w-4 h-4 text-emerald-600" />
                <span>Học Theo Bản Đồ Duolingo</span>
              </Link>
              <Link
                href="/curriculum"
                className="px-5 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Xem Dạng Danh Sách</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 12 Core Practice Rooms & Interactive Learning Hub */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span>Toàn Bộ Các Không Gian Học Tập & Tính Năng Đột Phá</span>
              </h2>
              <p className="text-xs text-stone-500">
                Bấm vào nút của từng tính năng bên dưới để trực tiếp trải nghiệm và làm chủ tiếng Trung
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
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${mod.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {mod.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mod.badgeColor}`}>
                          {mod.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-base group-hover:text-amber-700 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed mt-1">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={mod.href}
                    className="w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs text-stone-800 text-center flex items-center justify-center gap-1.5 transition-colors group-hover:border-amber-400 group-hover:bg-amber-50/60"
                  >
                    <span>{mod.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
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
