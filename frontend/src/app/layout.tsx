import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  JetBrains_Mono,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import { AITutorChatBox } from "@/components/ai/AITutorChatBox";
import { AppProviders } from "@/store/AppProviders";

// ============================================================================
// [YÊU CẦU CÔ - Lab 1 (Khởi tạo Project) + Redux Provider & Context Provider]
// Layout gốc của Hiệu Sách HANZI bọc toàn bộ ứng dụng bằng
// <AppProviders> (gồm Redux Store: auth + voucherWallet + cart & AiTutorContext).
// ============================================================================

const newsreader = Newsreader({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-vk-serif",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vk-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-vk-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HANZI — Nhà Sách & Học Liệu Tiếng Trung",
  description:
    "Hiệu sách trực tuyến chuyên biệt về Giáo trình HSK 1–6, Từ điển 214 Bộ thủ Khang Hy, Tập luyện thư pháp chữ Hán, Sổ tay giao tiếp và Cố vấn Sách AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`h-full ${newsreader.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F0] text-[#1C1917] selection:bg-amber-100 selection:text-amber-900 font-sans">
        <AppProviders>
          {children}
          <AITutorChatBox />
        </AppProviders>
      </body>
    </html>
  );
}
