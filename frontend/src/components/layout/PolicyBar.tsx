import React from "react";
import { ShieldCheck, RotateCcw, Headphones, BookOpen } from "lucide-react";

export function PolicyBar() {
  const policies = [
    {
      icon: ShieldCheck,
      title: "Cam Kết Đầu Ra HSK 3.0",
      desc: "Chuẩn hóa theo ngân hàng đề thi thật",
    },
    {
      icon: RotateCcw,
      title: "Bảo Hành Học Phí 7 Ngày",
      desc: "Hoàn tiền 100% nếu không hài lòng",
    },
    {
      icon: Headphones,
      title: "Trợ Giảng 1:1 24/7",
      desc: "Giải đáp thắc mắc bài tập mọi lúc",
    },
    {
      icon: BookOpen,
      title: "Tài Liệu Cập Nhật Trọn Đời",
      desc: "Tặng trọn bộ Flashcard & Đề thi thử",
    },
  ];

  return (
    <div className="border-y border-stone-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 p-2 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900 group-hover:text-amber-700 transition-colors leading-tight">
                    {p.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
