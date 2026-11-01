"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { soundManager } from "@/lib/utils";
import {
  Trophy,
  Flame,
  Zap,
  Crown,
  Medal,
  Timer,
  ArrowUp,
  ArrowDown,
  Shield,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  hskLevel: number;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

const LEAGUES = [
  { id: "bronze", name: "Giải Đồng", icon: "🥉", color: "from-amber-700 to-amber-900", border: "border-amber-700", minXp: 0 },
  { id: "silver", name: "Giải Bạc", icon: "🥈", color: "from-slate-400 to-slate-600", border: "border-slate-400", minXp: 500 },
  { id: "gold", name: "Giải Vàng", icon: "🥇", color: "from-yellow-400 to-amber-600", border: "border-yellow-400", minXp: 1200 },
  { id: "diamond", name: "Giải Kim Cương", icon: "💎", color: "from-cyan-400 to-blue-600", border: "border-cyan-400", minXp: 2500 },
];

export function LeaderboardView() {
  const { user } = useApp();
  const [selectedLeague, setSelectedLeague] = useState("gold");

  // Mock competitive peers
  const baseUsers: Omit<LeaderboardUser, "rank">[] = [
    { id: "u-1", name: "Trần Bảo Ngọc", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", hskLevel: 3, xp: 2150, streak: 18 },
    { id: "u-2", name: "Lê Hoàng Long", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", hskLevel: 2, xp: 1890, streak: 14 },
    { id: "u-3", name: "Phạm Thu Thảo", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", hskLevel: 2, xp: 1620, streak: 11 },
    { id: "u-me", name: `${user.fullName} (Bạn)`, avatar: user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", hskLevel: user.currentHskLevel, xp: user.totalXp, streak: user.dailyStreak, isCurrentUser: true },
    { id: "u-4", name: "Đặng Quang Huy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", hskLevel: 1, xp: 1340, streak: 9 },
    { id: "u-5", name: "Ngô Mỹ Linh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80", hskLevel: 2, xp: 1180, streak: 6 },
    { id: "u-6", name: "Vũ Gia Bảo", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80", hskLevel: 1, xp: 950, streak: 5 },
    { id: "u-7", name: "Bùi Khánh Linh", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80", hskLevel: 1, xp: 820, streak: 4 },
    { id: "u-8", name: "Đỗ Minh Khang", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80", hskLevel: 1, xp: 640, streak: 3 },
    { id: "u-9", name: "Nguyễn Hải Yến", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", hskLevel: 1, xp: 480, streak: 2 },
  ];

  // Sort and assign ranks
  const sortedUsers: LeaderboardUser[] = [...baseUsers]
    .sort((a, b) => b.xp - a.xp)
    .map((u, idx) => ({ ...u, rank: idx + 1 }));

  const currentLeagueObj = LEAGUES.find((l) => l.id === selectedLeague) || LEAGUES[2];
  const userRankObj = sortedUsers.find((u) => u.isCurrentUser);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Giải Đấu Tuần • Xếp Hạng HSK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Đua Top Tuần — {currentLeagueObj.name} {currentLeagueObj.icon}
          </h1>
          <p className="text-amber-100/90 text-xs sm:text-sm max-w-lg">
            Học từ vựng, luyện viết và làm bài thi để tích lũy XP. <strong>Top 5 học viên cao nhất</strong> tuần sẽ được thăng hạng lên giải đấu cao hơn!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 space-y-1 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-200 font-bold">
            <Timer className="w-4 h-4" />
            <span>Kết thúc sau:</span>
          </div>
          <div className="text-xl font-black font-mono tracking-wider">
            2 ngày 14:32:10
          </div>
          <span className="text-[10px] text-amber-200/80 block">
            Chốt giải lúc 23:59 Chủ Nhật
          </span>
        </div>

        <div className="absolute -right-6 -bottom-10 font-hanzi text-9xl text-white/10 select-none font-black pointer-events-none">
          榜
        </div>
      </div>

      {/* League Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LEAGUES.map((l) => {
          const isSelected = selectedLeague === l.id;
          return (
            <button
              key={l.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedLeague(l.id);
              }}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                isSelected
                  ? "bg-white border-amber-500 shadow-md scale-102"
                  : "bg-white/80 hover:bg-white border-stone-200 text-stone-600"
              }`}
            >
              <span className="text-2xl">{l.icon}</span>
              <span className="font-extrabold text-xs sm:text-sm text-stone-900">
                {l.name}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                Từ {l.minXp} XP
              </span>
            </button>
          );
        })}
      </div>

      {/* Current User Quick Floating Stat */}
      {userRankObj && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs">
              #{userRankObj.rank}
            </div>
            <div>
              <span className="font-bold text-stone-900 text-xs sm:text-sm block">
                Vị trí hiện tại của bạn: Hạng #{userRankObj.rank}
              </span>
              <span className="text-[11px] text-amber-800">
                {userRankObj.rank <= 5
                  ? "🟢 Bạn đang nằm trong VÙNG THĂNG HẠNG lên giải đấu cao hơn!"
                  : "Cần thêm khoảng 150 XP để lọt vào Top 5 Thăng Hạng!"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm font-mono text-amber-900">
              {userRankObj.xp} XP
            </span>
          </div>
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-500">
          <div className="flex items-center gap-6">
            <span className="w-8 text-center">Hạng</span>
            <span>Học viên</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">Chuỗi Streak</span>
            <span>Kinh nghiệm</span>
          </div>
        </div>

        {/* List of 10 users */}
        <div className="divide-y divide-stone-100">
          {sortedUsers.map((u) => {
            const isTop1 = u.rank === 1;
            const isTop2 = u.rank === 2;
            const isTop3 = u.rank === 3;
            const isPromotion = u.rank <= 5;
            const isDemotion = u.rank >= 9;

            return (
              <div
                key={u.id}
                className={`px-6 py-3.5 flex items-center justify-between transition-colors ${
                  u.isCurrentUser
                    ? "bg-amber-50/90 font-bold border-l-4 border-l-amber-600"
                    : "hover:bg-stone-50/80"
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Rank indicator */}
                  <div className="w-8 flex items-center justify-center font-mono font-black text-sm">
                    {isTop1 ? (
                      <span className="text-xl">🥇</span>
                    ) : isTop2 ? (
                      <span className="text-xl">🥈</span>
                    ) : isTop3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span className={`${u.isCurrentUser ? "text-amber-700 font-extrabold" : "text-stone-500"}`}>
                        {u.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-stone-200"
                    />
                    {isTop1 && (
                      <Crown className="w-4 h-4 text-amber-500 fill-amber-500 absolute -top-2 -right-1 rotate-12" />
                    )}
                  </div>

                  {/* Name & HSK Level */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-sm font-bold ${u.isCurrentUser ? "text-amber-950 font-black" : "text-stone-900"}`}>
                        {u.name}
                      </span>
                      {u.isCurrentUser && (
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                          Bạn
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium">
                      Đang học HSK {u.hskLevel}
                    </span>
                  </div>
                </div>

                {/* Right: Streak & XP */}
                <div className="flex items-center gap-6 sm:gap-8">
                  {/* Streak */}
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-600">
                    <Flame className="w-4 h-4 fill-current" />
                    <span>{u.streak} ngày</span>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="font-mono font-black text-xs sm:text-sm text-stone-900 block">
                        {u.xp} XP
                      </span>
                      {isPromotion ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                          <ArrowUp className="w-2.5 h-2.5" /> Thăng hạng
                        </span>
                      ) : isDemotion ? (
                        <span className="text-[10px] font-bold text-rose-500 flex items-center justify-end gap-0.5">
                          <ArrowDown className="w-2.5 h-2.5" /> Giáng hạng
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400">Trụ hạng</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
