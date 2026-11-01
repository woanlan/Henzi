import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50/70 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-600 text-white flex items-center justify-center font-hanzi text-base font-bold">
                汉
              </div>
              <span className="font-bold text-stone-900 tracking-tight text-sm">
                HANZI MASTER
              </span>
            </div>
            <p className="text-stone-500 leading-relaxed text-xs">
              Master Chinese, One Step at a Time. Nền tảng học tiếng Trung toàn diện kết hợp Duolingo, Anki, Quizlet và Gia sư AI thông minh dành riêng cho người Việt.
            </p>
            <div className="text-[11px] text-stone-400">
              Thiết kế theo tiêu chuẩn chống rập khuôn từ tasteskill.dev.
            </div>
          </div>

          {/* Curriculum HSK 1 to 6 */}
          <div>
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Lộ Trình HSK Chuẩn
            </h4>
            <ul className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <li key={lvl}>
                  <Link
                    href={`/curriculum?level=${lvl}`}
                    className="hover:text-amber-700 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Giáo trình HSK {lvl}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Không Gian Luyện Tập
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/vocabulary" className="hover:text-amber-700 transition-colors">
                  Thẻ Flashcard SRS (Spaced Repetition)
                </Link>
              </li>
              <li>
                <Link href="/writing" className="hover:text-amber-700 transition-colors">
                  Tập Viết Thứ Tự Nét Chữ Hán (HanziWriter)
                </Link>
              </li>
              <li>
                <Link href="/listening" className="hover:text-amber-700 transition-colors">
                  Phòng Luyện Nghe Đa Tốc Độ
                </Link>
              </li>
              <li>
                <Link href="/speaking" className="hover:text-amber-700 transition-colors">
                  Luyện Nói & Chấm Thanh Điệu AI
                </Link>
              </li>
              <li>
                <Link href="/grammar" className="hover:text-amber-700 transition-colors">
                  Kho Bách Khoa Ngữ Pháp HSK
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-amber-700 transition-colors">
                  Trung Tâm Thi Thử HSK Bấm Giờ
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tutor & System */}
          <div>
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Công Nghệ & Bảo Mật
            </h4>
            <p className="text-stone-500 leading-relaxed mb-3">
              Tích hợp cơ chế Dual-Mode: Chạy offline độc lập với dữ liệu mẫu phong phú hoặc kết nối Supabase PostgreSQL với bảo mật cấp hàng (RLS).
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] text-stone-600 font-medium">Hệ thống đang hoạt động ổn định</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400">
          <p>© 2026 HANZI MASTER. Bản quyền thuộc về đội ngũ phát triển.</p>
          <p>Phiên bản 1.0.0 — Sẵn sàng cho triển khai thực tế.</p>
        </div>
      </div>
    </footer>
  );
}
