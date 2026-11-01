"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Sparkles,
  Zap,
  Volume2,
  PenTool,
  Mic,
  GraduationCap,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  ShieldCheck,
  RotateCw,
  Compass,
} from "lucide-react";

export default function HomePage() {
  const [heroCardFlipped, setHeroCardFlipped] = useState(false);

  const speak = (zh: string) => {
    try {
      soundManager.playClick();
      audioEngine.speak(zh);
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 space-y-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative pt-10 sm:pt-16 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline & Value Proposition */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Chuẩn Khung Đào Tạo HSK 3.0 Quốc Tế</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.12]">
                  Chinh phục Tiếng Trung <br />
                  <span className="text-amber-600 font-hanzi">一步一个脚印</span>
                  <br />
                  <span className="text-stone-700 text-3xl sm:text-4xl font-bold">
                    Master Chinese, One Step at a Time.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Nền tảng học tiếng Trung toàn diện kết hợp tinh hoa của <b>Duolingo</b> (chuỗi lửa học tập & bản đồ phiêu lưu), <b>Anki</b> (thuật toán lặp lại ngắt quãng SM-2), <b>Quizlet</b> (đa chế độ phản xạ) và <b>Gia Sư AI</b> bóc tách đa tầng ngữ pháp dành riêng cho người Việt.
                </p>

                {/* Trust Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Phát âm giọng chuẩn Bắc Kinh
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Luyện viết chữ Hán thuận bút
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Gia sư AI giải đáp 24/7
                  </span>
                </div>
              </div>

              {/* Right Column: Live Interactive Taste-Skill Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-xl p-6 space-y-6 relative group">
                  <div className="flex items-center justify-between text-xs text-stone-400 font-semibold">
                    <span className="uppercase tracking-wider">Thẻ Từ Vựng Trực Quan</span>
                    <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                      HSK 1
                    </span>
                  </div>

                  {/* Character Flash Box */}
                  <div
                    onClick={() => {
                      try { soundManager.playClick(); } catch {}
                      setHeroCardFlipped(!heroCardFlipped);
                    }}
                    className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 text-center cursor-pointer hover:border-amber-400 transition-all select-none space-y-3"
                  >
                    {!heroCardFlipped ? (
                      <>
                        <div className="font-hanzi text-7xl font-extrabold text-stone-900 tracking-wider">
                          学
                        </div>
                        <div className="text-xs text-stone-500 flex items-center justify-center gap-1">
                          <RotateCw className="w-3.5 h-3.5 text-stone-400" />
                          <span>Chạm vào thẻ để lật xem phiên âm</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 animate-fadeIn">
                        <div className="font-mono text-2xl font-bold text-amber-700">
                          xué
                        </div>
                        <div className="text-xl font-bold text-stone-900">
                          Học (học tập, nghiên cứu)
                        </div>
                        <div className="text-xs text-stone-500">
                          Bộ Tử (子) • 8 nét bút
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Audio Speaker & Quick Writing Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => speak("学，学习")}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <span>Nghe Phát Âm</span>
                    </button>

                    <Link
                      href="/writing"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <PenTool className="w-4 h-4 text-stone-600" />
                      <span>Tập Viết Nét</span>
                    </Link>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl text-[11px] text-amber-900 border border-amber-200/60 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Hệ thống tự động đồng bộ tiến độ ôn tập vào hàng đợi lặp lại ngắt quãng SM-2 của bạn.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CORE ADVANTAGES (DUOLINGO + ANKI + QUIZLET + AI) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Phương Pháp Sư Phạm Hiện Đại
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Sức Mạnh Tích Hợp 4 Trong 1
            </h2>
            <p className="text-sm text-stone-600">
              Không còn cảm giác nhàm chán khi học chữ Hán. Chúng tôi kết hợp những công nghệ học ngôn ngữ hiệu quả nhất thế giới.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
                <Flame className="w-6 h-6 fill-orange-500" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                Gamification Duolingo
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Chuỗi ngày học liên tục (Streak), bảng xếp hạng XP, huy hiệu thành tích và bản đồ phiêu lưu tạo động lực học tập mỗi ngày.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <Zap className="w-6 h-6 fill-amber-500" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                Thuật Toán SRS Anki (SM-2)
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tự động tính toán chu kỳ lặp lại ngắt quãng dựa trên mức độ thuộc từ, đảm bảo chuyển từ vựng từ trí nhớ ngắn hạn sang dài hạn.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                Writing Lab (Thuận Bút)
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Luyện viết chữ Hán trên ô Mễ Tự Cách (米字格) với hoạt ảnh thứ tự nét bút chính xác, tự nhập chữ tùy thích và cảm biến chấm điểm.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 fill-emerald-500" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                Gia Sư AI Đa Tầng
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Bóc tách 6 tầng cấu trúc câu: Chữ Hán • Pinyin • Tiếng Việt • Từ vựng cốt lõi • Phân tích ngữ pháp • Gọi thoại đàm thoại trực tiếp.
              </p>
            </div>
          </div>
        </section>

        {/* HSK 1 TO 6 CURRICULUM ROADMAP OVERVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Lộ Trình Toàn Diện
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                Giáo Trình HSK 1 Đến HSK 6
              </h2>
            </div>
            <Link
              href="/curriculum"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Xem chi tiết từng bài học</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { lvl: 1, words: 150, title: "Nhập Môn Giao Tiếp", desc: "Ngữ âm, thanh điệu, chào hỏi & sinh hoạt hàng ngày" },
              { lvl: 2, words: 300, title: "Giao Tiếp Cơ Bản", desc: "Mua sắm, phương hướng, sân bay, đặt phòng khách sạn" },
              { lvl: 3, words: 600, title: "Giao Tiếp Trung Cấp", desc: "Du lịch tự túc, văn phòng, câu chữ 把, xử lý tình huống" },
              { lvl: 4, words: 1200, title: "Diễn Đạt Lưu Loát", desc: "Đọc báo chí, đối thoại chuyên sâu, liên từ nhượng bộ" },
              { lvl: 5, words: 2500, title: "Thông Thạo Học Thuật", desc: "Xem phim không phụ đề, viết luận văn & thuyết trình" },
              { lvl: 6, words: 5000, title: "Đẳng Cấp Bản Xứ", desc: "Thành ngữ uyên thâm, ngôn ngữ tinh hoa chuẩn mực" },
            ].map((c) => (
              <div
                key={c.lvl}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3 hover:border-amber-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                    CẤP ĐỘ HSK {c.lvl}
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-500">
                    {c.words} Từ vựng
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-base">{c.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{c.desc}</p>
                <div className="pt-2">
                  <Link
                    href={`/curriculum?level=${c.lvl}`}
                    className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                  >
                    <span>Vào lộ trình HSK {c.lvl}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Bắt Đầu Ngay Hôm Nay
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Làm Chủ Tiếng Trung Cùng HANZI MASTER
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Đăng ký tài khoản miễn phí để lưu trữ tiến độ học tập trên đám mây, tham gia kỳ thi thử HSK bấm giờ và tương tác với Gia Sư AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/auth/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-md hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Đăng Ký Học Viên Miễn Phí</span>
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Vào Bảng Điều Khiển</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
