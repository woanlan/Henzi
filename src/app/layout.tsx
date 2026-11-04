import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AITutorChatBox } from "@/components/ai/AITutorChatBox";

export const viewport: Viewport = {
  themeColor: "#D97706",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "HANZI MASTER — Nền Tảng Học Tiếng Trung HSK 1–6",
  description: "Master Chinese, One Step at a Time. Nền tảng học tiếng Trung toàn diện dành cho người Việt kết hợp Duolingo, Anki, Quizlet và Gia sư AI.",
  keywords: ["tiếng Trung", "học HSK", "HSK 1-6", "từ vựng HSK", "luyện viết chữ Hán", "gia sư AI tiếng Trung", "đọc hiểu tiếng Trung", "hội thoại HSK"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HanziMaster",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
        <AppProvider>
          {children}
          <AITutorChatBox />
        </AppProvider>
      </body>
    </html>
  );
}
