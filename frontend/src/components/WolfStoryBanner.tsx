import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function WolfStoryBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-stone-800">
        {/* Background Decorative Calligraphy Watermarks */}
        <div className="absolute -right-6 -bottom-10 font-hanzi text-9xl sm:text-[180px] text-white/5 select-none pointer-events-none">
          道
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Triết Lý Đào Tạo Của Hanzi Master</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
            Tôn vinh vẻ đẹp của chữ Hán <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              qua từng nét bút mộc mạc và chuẩn xác
            </span>
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Học chữ Hán không phải là sự nhồi nhét thuộc lòng máy móc. Tại HANZI MASTER, chúng tôi biến mỗi buổi học thành một hành trình khám phá chiết tự, hiểu rõ nguồn gốc từng bộ thủ, luyện tai nghe giọng Bắc Kinh chuẩn xác và phản xạ đàm phán trong đời sống thực tế.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center sm:text-left space-y-1">
              <div className="text-2xl font-black text-amber-400 font-tabular">50,000+</div>
              <div className="text-xs text-stone-300">Học viên tin tưởng theo học</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center sm:text-left space-y-1">
              <div className="text-2xl font-black text-emerald-400 font-tabular">98.2%</div>
              <div className="text-xs text-stone-300">Tỷ lệ đỗ HSK ngay lần đầu</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center sm:text-left space-y-1">
              <div className="text-2xl font-black text-amber-400 font-tabular">50+ Đề</div>
              <div className="text-xs text-stone-300">Thi thử bấm giờ máy tính</div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/30 transition-all flex items-center gap-2"
            >
              <span>Tìm Hiểu Câu Chuyện Học Viện</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <span>Xem Trọn Bộ Khóa Học</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
