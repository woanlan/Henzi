"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  Flame,
  Zap,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  Headphones,
  Mic,
  PenTool,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export function AnalyticsView() {
  const { user, stats, currentHskLevel } = useApp();

  const weeklyData = [
    { day: "Thứ 2", minutes: 35, xp: 120 },
    { day: "Thứ 3", minutes: 40, xp: 160 },
    { day: "Thứ 4", minutes: 25, xp: 90 },
    { day: "Thứ 5", minutes: 50, xp: 210 },
    { day: "Thứ 6", minutes: 30, xp: 130 },
    { day: "Thứ 7", minutes: 60, xp: 280 },
    { day: "CN", minutes: 45, xp: 190 },
  ];

  const skillData = [
    { subject: "Nghe Hiểu (听力)", score: 85, fullMark: 100 },
    { subject: "Nói & Phát Âm (口语)", score: 78, fullMark: 100 },
    { subject: "Đọc Hiểu (阅读)", score: 92, fullMark: 100 },
    { subject: "Viết Chữ Hán (书写)", score: 75, fullMark: 100 },
    { subject: "Từ Vựng SRS", score: 88, fullMark: 100 },
    { subject: "Ngữ Pháp HSK", score: 82, fullMark: 100 },
  ];

  const achievements = [
    {
      id: "ach-1",
      title: "Chiến Binh Lửa Đỏ",
      desc: "Duy trì chuỗi học tập 7 ngày liên tiếp",
      icon: Flame,
      color: "text-orange-500 bg-orange-100",
      unlocked: true,
    },
    {
      id: "ach-2",
      title: "Thợ Săn Nét Bút",
      desc: "Luyện viết thành công 50 chữ Hán chuẩn nét",
      icon: PenTool,
      color: "text-blue-500 bg-blue-100",
      unlocked: true,
    },
    {
      id: "ach-3",
      title: "Đôi Tai Vàng",
      desc: "Đạt 100% điểm nghe trong 5 bài luyện liên tục",
      icon: Headphones,
      color: "text-emerald-500 bg-emerald-100",
      unlocked: true,
    },
    {
      id: "ach-4",
      title: "Vua Trí Nhớ SM-2",
      desc: "Nắm vững 300 từ vựng trong hàng đợi ôn tập",
      icon: Zap,
      color: "text-amber-500 bg-amber-100",
      unlocked: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Profile Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-hanzi text-3xl font-bold shadow-md">
            汉
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              {user.fullName}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                HSK {currentHskLevel}
              </span>
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Học viên chuyên cần • Mục tiêu hoàn thành HSK {currentHskLevel} trong 30 ngày
            </p>
          </div>
        </div>

        {/* 4 Core Stat Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Streak
            </span>
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-orange-600 mt-0.5">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{user.dailyStreak} ngày</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Tổng XP
            </span>
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-amber-700 mt-0.5">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span>{user.totalXp}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Đã Thuộc (SRS)
            </span>
            <span className="text-lg font-bold text-emerald-700 mt-0.5 block">
              {stats.wordsMastered + 42} từ
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Hàng Đợi Ôn
            </span>
            <span className="text-lg font-bold text-blue-700 mt-0.5 block">
              {stats.reviewQueueCount + 12} từ
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section: Weekly Activity & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Time (BarChart) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Thời Lượng Học Tập Tuần Này (Phút)
              </h3>
              <p className="text-xs text-stone-500">
                Mục tiêu: 20 phút mỗi ngày để duy trì thói quen
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(val: any) => [`${val} phút`, "Thời gian"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E7E5E4", fontSize: "12px" }}
                />
                <Bar dataKey="minutes" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Skill Competency Radar */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Bản Đồ Năng Lực 6 Kỹ Năng HSK
              </h3>
              <p className="text-xs text-stone-500">
                Đánh giá toàn diện dựa trên bài kiểm tra thực tế
              </p>
            </div>
            <Award className="w-5 h-5 text-amber-600" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="#E7E5E4" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#44403C" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Kỹ năng" dataKey="score" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gamification: Badges & Achievements */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              Huy Hiệu & Thành Tích Đạt Được
            </h3>
            <p className="text-xs text-stone-500">
              Hoàn thành các thử thách hàng tuần để mở khóa phần thưởng đặc biệt
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-amber-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                  ach.unlocked
                    ? "bg-stone-50/80 border-stone-200"
                    : "bg-stone-50/30 border-dashed border-stone-200 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${ach.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {ach.unlocked && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Đã mở
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-stone-900">{ach.title}</h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
