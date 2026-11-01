"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { UNITS_DATA } from "@/data/units";
import { HSK_LEVELS } from "@/data/hsk-levels";
import { soundManager } from "@/lib/utils";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  GraduationCap,
  Volume2,
  PenTool,
  ShieldCheck,
} from "lucide-react";

export function CurriculumView() {
  const { currentHskLevel, setCurrentHskLevel } = useApp();
  const levelInfo = HSK_LEVELS.find((l) => l.level === currentHskLevel) || HSK_LEVELS[0];
  const units = UNITS_DATA.filter((u) => u.hskLevel === currentHskLevel);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Level Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider">
                Giáo Trình Chuẩn Hóa
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Khung Đào Tạo HSK 3.0</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 mt-2">
              {levelInfo.title}
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              {levelInfo.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
            <span className="text-xs text-stone-500">Mục tiêu từ vựng:</span>
            <span className="text-xl font-bold text-amber-700 font-mono">
              {levelInfo.requiredVocabCount} Từ
            </span>
          </div>
        </div>

        {/* Level Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
          {HSK_LEVELS.map((lvl) => (
            <button
              key={lvl.level}
              onClick={() => {
                soundManager.playClick();
                setCurrentHskLevel(lvl.level);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentHskLevel === lvl.level
                  ? "bg-amber-600 text-white shadow-xs scale-102"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Cấp độ HSK {lvl.level}
            </button>
          ))}
        </div>
      </div>

      {/* Units & Lessons List */}
      <div className="space-y-6">
        {units.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-2">
            <p className="text-stone-700 font-bold text-sm">
              Đang đồng bộ hóa kho dữ liệu cho HSK {currentHskLevel}...
            </p>
            <p className="text-xs text-stone-500">
              Bạn có thể sử dụng tính năng Quản Trị hoặc tải dữ liệu từ vựng HSK tương ứng.
            </p>
          </div>
        ) : (
          units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden"
            >
              {/* Unit Header */}
              <div className="p-5 sm:p-6 bg-stone-50/70 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-200 font-bold text-base">
                    {unit.unitNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">
                      {unit.titleVn}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {unit.descriptionVn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{unit.estimatedHours} giờ học</span>
                  </div>
                </div>
              </div>

              {/* Lessons within this unit */}
              <div className="divide-y divide-stone-100 p-2 sm:p-4 space-y-2">
                {unit.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 rounded-2xl hover:bg-stone-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 border border-transparent hover:border-stone-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-hanzi text-lg font-bold text-stone-900">
                          {lesson.title}
                        </span>
                        <span className="text-xs text-stone-600 font-medium">
                          • {lesson.titleVn}
                        </span>
                        {lesson.isCompleted && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đã hoàn thành</span>
                          </span>
                        )}
                      </div>

                      {/* Objectives */}
                      <ul className="text-xs text-stone-600 space-y-1">
                        {lesson.learningObjectives.map((obj, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-amber-500" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-4 text-[11px] text-stone-400 font-medium pt-1">
                        <span>Thời lượng: ~{lesson.estimatedMinutes} phút</span>
                        <span>{lesson.vocabularyCount} Từ mới</span>
                        <span>{lesson.grammarPointsCount} Ngữ pháp</span>
                      </div>
                    </div>

                    {/* Quick Access Actions for this lesson */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/vocabulary?lesson=${lesson.id}`}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1 transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>Từ Vựng</span>
                      </Link>
                      <Link
                        href="/writing"
                        className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1 transition-colors"
                      >
                        <PenTool className="w-3.5 h-3.5 text-blue-600" />
                        <span>Luyện Viết</span>
                      </Link>
                      <Link
                        href="/listening"
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <span>Học Ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
