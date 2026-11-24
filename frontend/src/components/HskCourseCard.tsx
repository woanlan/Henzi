import React from "react";
import Link from "next/link";
import { IHSKCourse } from "@/interfaces/product";
import { BookOpen, Trophy, ArrowRight, Award } from "lucide-react";

interface HskCourseCardProps {
  course: IHSKCourse;
}

// Component hiển thị thông tin từng cấp độ khóa học HSK nhận Props là IHSKCourse
export default function HskCourseCard({ course }: HskCourseCardProps) {
  return (
    <div className="group relative flex flex-col p-6 rounded-3xl border border-stone-200/90 bg-white hover:border-amber-400/80 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      {/* Top Header with Level Badge & Score */}
      <div className="flex items-center justify-between mb-3.5">
        <span
          className="px-3 py-1 rounded-xl text-xs font-black text-white shadow-2xs flex items-center gap-1.5"
          style={{ backgroundColor: course.colorHex }}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Level {course.level}</span>
        </span>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span>
            {course.passingScore}/{course.maxScore}đ
          </span>
        </div>
      </div>

      {/* Course Title & Chinese Subtitle */}
      <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-amber-600 transition-colors tracking-tight">
        {course.title}
      </h3>
      <p className="text-xs font-bold text-amber-700/90 mt-0.5 mb-2 font-hanzi">
        {course.titleVn}
      </p>

      {/* Description */}
      <p className="text-xs sm:text-sm text-stone-600 mb-5 flex-1 leading-relaxed">
        {course.description}
      </p>

      {/* Meta Footer */}
      <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-stone-500">
          <BookOpen className="w-3.5 h-3.5 text-stone-400" />
          <span>
            <strong className="text-stone-800 font-bold font-tabular">
              {course.requiredVocabCount}
            </strong>{" "}
            từ vựng
          </span>
        </div>
        <Link
          href={`/detail/hsk-${course.level}`}
          className="inline-flex items-center gap-1 font-bold text-amber-600 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg px-2 py-1"
        >
          <span>Chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
