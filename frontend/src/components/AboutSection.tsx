import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  PackageCheck,
  PenTool,
  Sparkles,
  Volume2,
} from "lucide-react";

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
}

export default function AboutSection({
  title = "HANZI — Nhà Sách & Học Liệu Tiếng Trung",
  subtitle = "Gìn giữ trải nghiệm lật giở từng trang giấy kem thơm mùi mực in, kết hợp cùng học liệu Audio Bắc Kinh và Cố vấn Sách AI 24/7.",
}: AboutSectionProps) {
  const highlights = [
    {
      icon: BookOpen,
      title: "2 Ấn Bản: Bìa Mềm & Bìa Cứng Khâu Chỉ",
      desc: "Mỗi đầu sách đều có bản Bìa mềm gọn nhẹ mang đi học và bản Bìa cứng bọc vải bố dập nhũ vàng 24K khâu chỉ mở phẳng 180° dành cho người sưu tầm.",
    },
    {
      icon: PenTool,
      title: "Giấy Kem 100–120gsm Chống Mỏi Mắt",
      desc: "Sử dụng định lượng giấy kem ngà tự nhiên không chói sáng dưới đèn bàn học và không thấm mực khi luyện viết chữ Hán trên ô Mễ Tự Cách.",
    },
    {
      icon: Volume2,
      title: "Tích Hợp QR Audio Giọng Bắc Kinh",
      desc: "Mỗi bài đọc, bảng từ vựng HSK và hội thoại thực tế đều đính kèm mã QR quét nghe trực tiếp phát âm chuẩn từ phát thanh viên Bắc Kinh.",
    },
    {
      icon: PackageCheck,
      title: "Đóng Gói Chống Sốc 3 Lớp Vuông Góc",
      desc: "Sách xuất kho từ HANZI luôn được bọc màng co, quấn xốp nổ chống sốc 3 lớp và đặt trong hộp carton cứng để giữ 4 góc sách nguyên vẹn.",
    },
  ];

  const commitments = [
    "100% sách bản quyền từ NXB Đại Học Ngôn Ngữ Bắc Kinh & NXB Thương Vụ Ấn Thư Quán",
    "Đổi mới 1-1 hoàn toàn miễn phí trong 7 ngày nếu sách bị cấn góc hoặc lỗi in ấn",
    "Miễn phí giao sách toàn quốc cho mọi đơn đặt hàng từ 300.000₫ trở lên",
    "Tặng kèm thẻ đánh dấu trang (bookmark) lụa đỏ cho mọi ấn bản bìa cứng",
    "Hỗ trợ tư vấn lộ trình chọn sách và giải nghĩa từ vựng cùng Cố vấn Sách AI 24/7",
    "Cập nhật tồn kho thực tế theo từng ấn bản ngay trên kệ sách trực tuyến",
  ];

  return (
    <div className="space-y-14">
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--vk-border-strong) bg-(--vk-primary-light) px-3.5 py-1 vankho-mono text-xs font-semibold uppercase tracking-wider text-(--vk-brass)">
          <Sparkles className="size-3.5" />
          <span>Triết Lý Xuất Bản &amp; Tuyển Chọn</span>
        </span>
        <h1 className="vankho-serif text-3xl font-medium leading-tight tracking-tight text-(--vk-fg) sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-(--vk-muted) sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-(--vk-border) bg-(--vk-surface) p-7 space-y-3"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-(--vk-primary) text-(--vk-primary-fg)">
                <Icon className="size-5" />
              </div>
              <h2 className="vankho-serif text-xl font-medium text-(--vk-fg)">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-(--vk-muted)">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-(--vk-border-strong) bg-(--vk-gallery) p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-(--vk-brass)">
          <Award className="size-5" />
          <span className="vankho-mono text-xs font-semibold uppercase tracking-wider">
            Cam Kết Dành Cho Độc Giả
          </span>
        </div>

        <h2 className="vankho-serif text-2xl font-medium text-(--vk-fg) sm:text-3xl">
          6 Tiêu Chuẩn Phục Vụ Tại Hiệu Sách HANZI
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {commitments.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-xl border border-(--vk-border) bg-(--vk-surface) p-3.5 text-xs sm:text-sm text-(--vk-fg)"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-(--vk-brass)" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-(--vk-primary) px-6 text-xs sm:text-sm font-semibold text-(--vk-primary-fg) hover:bg-(--vk-primary-hover)"
          >
            <BookOpen className="size-4" />
            <span>Dạo Kệ Sách 3D CoverFlow</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/products"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-(--vk-border-strong) bg-(--vk-surface) px-6 text-xs sm:text-sm font-semibold text-(--vk-fg) hover:bg-(--vk-btn-hover)"
          >
            <span>Xem Toàn Bộ 30 Đầu Sách</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
