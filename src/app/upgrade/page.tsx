"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { soundManager } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  QrCode,
  Flame,
  Award,
  ArrowRight,
  X,
  Check,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  originalPrice?: string;
  period: string;
  desc: string;
  features: string[];
  popular?: boolean;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Cơ Bản (Miễn Phí)",
    price: "0đ",
    period: "Trọn đời",
    desc: "Khởi đầu làm quen với phát âm Pinyin và từ vựng HSK 1.",
    features: [
      "Truy cập đầy đủ từ vựng HSK 1",
      "Luyện viết chữ Hán cơ bản (Trace nét)",
      "Bảng âm tiết Pinyin & 214 Bộ thủ",
      "5 lượt trò chuyện cùng Gia Sư AI / ngày",
      "1 đề thi thử HSK 1",
    ],
    color: "border-stone-200 bg-white",
  },
  {
    id: "pro-6m",
    name: "Gói Bứt Phá HSK",
    badge: "Phổ Biến",
    price: "199.000đ",
    originalPrice: "399.000đ",
    period: "6 tháng học",
    desc: "Đầy đủ công cụ chinh phục nhanh chóng mục tiêu HSK 3 & 4.",
    features: [
      "Mở khóa toàn bộ từ vựng HSK 1 đến HSK 4",
      "Thuật toán lặp lại ngắt quãng SRS (SuperMemo) không giới hạn",
      "Phòng luyện đọc hiểu & hội thoại đa tầng",
      "Gia sư AI 6 tầng giải đáp 24/7 không giới hạn",
      "Kho đề thi thử HSK 1–4 chuẩn hóa",
      "Xuất danh sách từ vựng sang Anki & Quizlet",
    ],
    color: "border-amber-400 bg-amber-50/40 ring-1 ring-amber-400/50",
  },
  {
    id: "lifetime-vip",
    name: "Trọn Đời VIP Master",
    badge: "Tiết Kiệm 70% • Độc Quyền",
    popular: true,
    price: "499.000đ",
    originalPrice: "1.490.000đ",
    period: "Sở hữu vĩnh viễn",
    desc: "Đầu tư một lần, làm chủ hoàn toàn tiếng Trung HSK 1–6 & HSK 3.0 suốt đời.",
    features: [
      "Mở khóa TOÀN BỘ cấp độ HSK 1 đến HSK 6 & HSK 3.0",
      "Trọn bộ từ vựng Chuyên ngành: Đánh hàng Taobao/1688, Logistics, Nhà máy, Văn phòng",
      "Chuyên đề bẫy từ gần nghĩa (近义词辨析) độc quyền",
      "Phòng luyện phát âm AI & Chấm điểm thanh điệu chuẩn xác",
      "Kho 50+ đề thi thử HSK mô phỏng giao diện thi máy thật",
      "Gia sư AI 6 tầng tốc độ cao không giới hạn vĩnh viễn",
      "Tự động cập nhật mọi tính năng mới trong tương lai",
      "Huy hiệu VIP Hoàng Gia trên Bảng Xếp Hạng",
    ],
    color: "border-amber-600 bg-gradient-to-b from-amber-500/10 via-white to-orange-500/10 ring-2 ring-amber-600 shadow-xl",
  },
];

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[2]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleOpenPayment = (plan: Plan) => {
    soundManager.playClick();
    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setPaymentSuccess(false);
  };

  const handleConfirmPayment = () => {
    soundManager.playSuccess();
    setPaymentSuccess(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
            <Crown className="w-4 h-4 text-amber-700 fill-amber-700" />
            <span>Nâng Cấp Tài Khoản HANZI MASTER VIP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900">
            Đầu Tư Một Lần, <br />
            <span className="text-amber-600">Làm Chủ Tiếng Trung Trọn Đời</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Mở khóa toàn bộ kho tàng từ vựng HSK 1–6, hệ thống luyện thi bấm giờ, luyện viết chữ Hán và gia sư AI thông minh bóc tách đa tầng không giới hạn.
          </p>
        </section>

        {/* PRICING CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const isVip = plan.id === "lifetime-vip";

            return (
              <div
                key={plan.id}
                className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between relative transition-all ${plan.color}`}
              >
                {/* Badge if exists */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Desc */}
                  <div>
                    <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
                      {isVip && <Crown className="w-5 h-5 text-amber-600 fill-amber-600" />}
                      <span>{plan.name}</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 min-h-[32px]">
                      {plan.desc}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="border-b border-stone-200/80 pb-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-sm text-stone-400 line-through font-semibold">
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-amber-800 font-bold block mt-1">
                      {plan.period}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Đặc quyền bao gồm:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => handleOpenPayment(plan)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isVip
                        ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30"
                        : plan.id === "pro-6m"
                        ? "bg-stone-900 hover:bg-black text-white"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-800 shadow-none border border-stone-200"
                    }`}
                  >
                    <span>{plan.id === "free" ? "Đang Sử Dụng" : "Nâng Cấp Ngay"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* TRUST SIGNALS */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Kích Hoạt Tức Thời</h4>
            <p className="text-xs text-stone-500">Hệ thống mở khóa gói VIP ngay sau khi xác nhận chuyển khoản.</p>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Học Không Giới Hạn</h4>
            <p className="text-xs text-stone-500">Truy cập mọi lúc mọi nơi trên cả máy tính, tablet và điện thoại.</p>
          </div>
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Hỗ Trợ 100% Tiếng Việt</h4>
            <p className="text-xs text-stone-500">Đội ngũ trợ giảng hỗ trợ kỹ thuật và giải đáp bài tập 24/7.</p>
          </div>
        </div>
      </main>

      {/* PAYMENT MODAL (VietQR Simulation) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-4 top-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <div className="space-y-5 text-center">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Thanh Toán Chuyển Khoản VietQR</span>
                  </div>
                  <h3 className="text-xl font-black text-stone-900">
                    Nâng Cấp: {selectedPlan.name}
                  </h3>
                  <p className="text-2xl font-black text-amber-600">
                    {selectedPlan.price}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block mx-auto">
                  <div className="w-48 h-48 bg-white border border-stone-200 rounded-xl p-3 flex flex-col items-center justify-center shadow-inner relative group">
                    <div className="w-36 h-36 bg-[radial-gradient(#1c1917_2px,transparent_2px)] [background-size:12px_12px] flex items-center justify-center border border-stone-300 rounded-lg">
                      <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-hanzi font-black text-xl shadow-md">
                        汉
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase mt-2">
                      VietQR • Quét bằng App Ngân Hàng
                    </span>
                  </div>
                </div>

                {/* Transfer Details */}
                <div className="text-left bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ngân hàng:</span>
                    <span className="font-bold text-stone-800">MB Bank (Quân Đội)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Số tài khoản:</span>
                    <span className="font-mono font-bold text-amber-700">8888 6688 9999</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Chủ tài khoản:</span>
                    <span className="font-bold text-stone-800">HANZI MASTER VIETNAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Nội dung CK:</span>
                    <span className="font-mono font-bold text-stone-900 bg-amber-100 px-1.5 py-0.5 rounded">
                      HZ {selectedPlan.id.toUpperCase()} 0988
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Tôi Đã Chuyển Khoản Xong</span>
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-stone-900">
                  Nâng Cấp Thành Công!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600">
                  Chúc mừng bạn đã sở hữu <b>{selectedPlan.name}</b>! Toàn bộ quyền lợi VIP, bài học HSK nâng cao và Gia sư AI đã được mở khóa ngay bây giờ.
                </p>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer hover:bg-black transition-colors"
                >
                  Bắt Đầu Trải Nghiệm Ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
