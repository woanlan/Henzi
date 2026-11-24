"use client";

import React from "react";
import { IPlan } from "@/interfaces/product";
import { useAppDispatch } from "@/store";
import { addMultipleToCart } from "@/store/slices/cartSlice";
import { BOXSET_BOOK_MAP } from "@/components/vankho/vankho-data";
import { CheckCircle2, PackagePlus } from "lucide-react";

// [YÊU CẦU CÔ - Lab 2 (Component thẻ Bộ Boxset Sách) + Lab 3 (Nhận Props `plan`)]
interface ProductCardProps {
  plan: IPlan;
}

export default function ProductCard({ plan }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddBoxset = () => {
    const mapped = BOXSET_BOOK_MAP[String(plan.id)] ?? [
      { bookId: "pinyin-master", edition: "paperback" as const },
      { bookId: "hsk-1", edition: "paperback" as const },
    ];
    dispatch(
      addMultipleToCart({
        entries: mapped.map((m) => ({
          bookId: m.bookId,
          edition: m.edition,
          maxStock: 20,
        })),
        openDrawer: true,
      })
    );
  };

  return (
    <div
      className={`flex h-full flex-col justify-between rounded-2xl border p-6 transition-colors ${
        plan.popular
          ? "border-(--vk-primary) bg-(--vk-surface) ring-1 ring-(--vk-primary)/30"
          : "border-(--vk-border) bg-(--vk-surface)"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="vankho-mono text-xs uppercase tracking-[0.14em] text-(--vk-brass)">
            {plan.period}
          </span>
          {plan.badge && (
            <span className="rounded-full border border-(--vk-primary)/30 bg-(--vk-primary-light) px-2.5 py-0.5 vankho-mono text-[11px] font-semibold text-(--vk-brass)">
              {plan.badge}
            </span>
          )}
        </div>

        <h3 className="mt-2 vankho-serif text-xl font-medium text-(--vk-fg)">
          {plan.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="vankho-mono text-2xl font-bold text-(--vk-fg) tabular-nums sm:text-3xl">
            {plan.price}
          </span>
          {plan.originalPrice && (
            <span className="vankho-mono text-xs text-(--vk-muted) line-through tabular-nums">
              {plan.originalPrice}
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-(--vk-muted)">{plan.desc}</p>

        <ul className="mt-5 space-y-2.5 border-t border-(--vk-border) pt-4 text-sm text-(--vk-fg)/90">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-(--vk-brass)" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={handleAddBoxset}
        className={`mt-6 inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${
          plan.popular
            ? "bg-(--vk-primary) text-(--vk-primary-fg) hover:bg-(--vk-primary-hover)"
            : "border border-(--vk-border-strong) bg-(--vk-surface) text-(--vk-fg) hover:bg-(--vk-btn-hover)"
        }`}
      >
        <PackagePlus className="size-4 shrink-0" />
        <span>Thêm trọn bộ vào giỏ</span>
      </button>
    </div>
  );
}
