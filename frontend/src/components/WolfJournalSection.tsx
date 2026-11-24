import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export function WolfJournalSection() {
  const articles = [
    {
      id: 1,
      title: "Chiến Lược Đạt Điểm Tuyệt Đối HSK 3.0 Trong 3 Tháng Cho Người Bắt Đầu",
      excerpt: "Phân tích cấu trúc đề thi mới nhất, phương pháp phân bổ thời gian làm bài nghe - đọc hiểu và mẹo tránh bẫy từ gần nghĩa.",
      date: "10/11/2026",
      readTime: "5 phút đọc",
      category: "Bí Quyết Thi Cử",
      hanziWatermark: "考",
    },
    {
      id: 2,
      title: "Bí Quyết Đàm Phán Giảm Giá 20% Khi Đánh Hàng Taobao & 1688 Tận Xưởng",
      excerpt: "Tổng hợp 50+ mẫu câu chat thương mại với chủ xưởng Quảng Châu, cách yêu cầu mẫu thử và xử lý khi hàng bị lỗi.",
      date: "08/11/2026",
      readTime: "7 phút đọc",
      category: "Thương Mại & Đánh Hàng",
      hanziWatermark: "商",
    },
    {
      id: 3,
      title: "Giải Mã 214 Bộ Thủ: Chìa Khóa Vàng Nhớ Nhanh 5.000 Chữ Hán Không Quên",
      excerpt: "Khám phá quy luật tượng hình và biểu ý của chữ Hán, liên hệ âm Hán Việt để đoán nghĩa từ vựng một cách chuẩn xác.",
      date: "05/11/2026",
      readTime: "6 phút đọc",
      category: "Phương Pháp Học",
      hanziWatermark: "文",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200/90 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-600">
            Cẩm Nang Hán Ngữ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-0.5">
            Kinh Nghiệm & Chia Sẻ Từ Giảng Viên
          </h2>
        </div>
        <Link
          href="/about"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
        >
          <span>Xem tất cả bài viết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <article
            key={art.id}
            className="group flex flex-col bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 overflow-hidden"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 p-6 flex flex-col justify-between overflow-hidden">
              <div className="absolute right-3 -bottom-3 font-hanzi text-7xl text-white/10 select-none pointer-events-none group-hover:scale-110 group-hover:text-amber-500/20 transition-all duration-500">
                {art.hanziWatermark}
              </div>
              <span className="self-start px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                {art.category}
              </span>
              <div className="flex items-center gap-3 text-[11px] text-stone-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {art.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {art.readTime}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-stone-900 text-base line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                <span>Đọc bài viết chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
