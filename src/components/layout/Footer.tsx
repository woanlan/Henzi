import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50/70 text-stone-600 text-xs print:hidden">
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
                <Link href="/dictation" className="hover:text-amber-700 transition-colors">
                  Phòng Luyện Chép Chính Tả (听写)
                </Link>
              </li>
              <li>
                <Link href="/measure-words" className="hover:text-amber-700 transition-colors">
                  Bách Khoa Lượng Từ Tiếng Trung
                </Link>
              </li>
              <li>
                <Link href="/translate" className="hover:text-amber-700 transition-colors">
                  Tra Cứu & Dịch Bóc Tách 3 Tầng
                </Link>
              </li>
              <li>
                <Link href="/worksheet" className="hover:text-amber-700 transition-colors">
                  In Phiếu Luyện Viết Ô Mễ Khổ A4
                </Link>
              </li>
              <li>
                <Link href="/reading" className="hover:text-amber-700 transition-colors">
                  Phòng Luyện Đọc Hiểu Đa Tầng HSK
                </Link>
              </li>
              <li>
                <Link href="/conversation" className="hover:text-amber-700 transition-colors">
                  Luyện Hội Thoại & Đóng Vai A/B
                </Link>
              </li>
              <li>
                <Link href="/topics" className="hover:text-amber-700 transition-colors">
                  Từ Vựng Chuyên Ngành & Đi Làm
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-amber-700 transition-colors">
                  Trung Tâm Thi Thử HSK Bấm Giờ
                </Link>
              </li>
            </ul>
          </div>

          {/* Premium & System */}
          <div>
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Gói Học VIP & Bảo Mật
            </h4>
            <p className="text-stone-500 leading-relaxed mb-3">
              Trải nghiệm học tập trọn đời không giới hạn với Gia sư AI 6 tầng, kho 50+ đề thi mô phỏng và hỗ trợ 24/7.
            </p>
            <div className="mb-4">
              <Link
                href="/upgrade"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <span>Xem Bảng Giá Gói VIP</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] text-stone-600 font-medium">Hệ thống đang hoạt động ổn định</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <span>© 2026 HANZI MASTER. Bản quyền thuộc về nền tảng giáo dục tiếng Trung trực tuyến.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-stone-600">Trang chủ</Link>
            <Link href="/upgrade" className="hover:text-stone-600">Nâng cấp VIP</Link>
            <Link href="/dashboard" className="hover:text-stone-600">Bảng điều khiển</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
