"use client";

import React from "react";
import { Ticket, Check, Copy } from "lucide-react";
import { useVouchersSWR } from "@/hooks/useSwrApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { saveVoucherCode } from "@/store/slices/voucherWalletSlice";

// ============================================================================
// [YÊU CẦU CÔ - Lab 2 (Component) + useSWR + Redux Toolkit]
// 1. useSWR (`useVouchersSWR`): Gọi API `GET /api/vouchers`, tự cache trên RAM
//    và tự động reload khi người dùng quay lại tab (thay useState + useEffect).
// 2. Redux Toolkit (`useAppSelector`, `useAppDispatch`, `saveVoucherCode`):
//    Lưu mã ưu đãi vào Global Store để sang trang `/detail/[id]` tự động áp dụng.
// ============================================================================

export function VoucherStrip() {
  // [YÊU CẦU CÔ - useSWR]: Đọc dữ liệu mã ưu đãi từ API Backend MongoDB có cache
  const { vouchers, isLoading } = useVouchersSWR();

  // [YÊU CẦU CÔ - Redux Toolkit]: Đọc danh sách mã đã lưu & gửi action lưu mã mới
  const dispatch = useAppDispatch();
  const savedCodes = useAppSelector((state) => state.voucherWallet.savedCodes);

  const handleSave = (code: string) => {
    dispatch(saveVoucherCode(code));
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
  };

  return (
    <section id="vouchers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
              <Ticket className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              <span>Ví Voucher Ưu Đãi Học Phí</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Mã Giảm Giá Độc Quyền Dành Cho Bạn
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {savedCodes.length > 0
              ? `Đã lưu ${savedCodes.length} mã vào Ví Redux — tự động điền khi đăng ký khóa học`
              : "Lưu mã và áp dụng tự động tại bước thanh toán"}
          </span>
        </div>

        {/* Voucher Cards Grid */}
        {isLoading && vouchers.length === 0 ? (
          <div
            role="status"
            aria-busy="true"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-40 rounded-2xl bg-white/80 border border-amber-200/60 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vouchers.map((v) => {
              const isSaved = savedCodes.includes(v.code);
              return (
                <div
                  key={v.id || v.code}
                  className="relative bg-white rounded-2xl border-2 border-dashed border-amber-300 p-4 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-amber-500 transition-all group"
                >
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-50 border-r border-amber-200" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-50 border-l border-amber-200" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black text-[10px] uppercase tracking-wider">
                        {v.badge}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        {v.expiry}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-stone-900 text-sm group-hover:text-amber-700 transition-colors leading-tight">
                      {v.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-black text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200/80">
                      {v.code}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleSave(v.code)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                        isSaved
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-600 hover:bg-amber-700 text-white shadow-2xs active:scale-95"
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                          <span>Đã lưu</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          <span>Lưu mã</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
