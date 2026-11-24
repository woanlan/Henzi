import React from "react";
import Link from "next/link";
import { ICategory } from "@/interfaces/category";
import {
  GraduationCap,
  MessageSquare,
  Briefcase,
  PenTool,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

// [YÊU CẦU CÔ - Lab 2 (Component thẻ Danh mục Sách) + Lab 3 (Nhận Props `category`, `isActive`)]
interface CategoryCardProps {
  category: ICategory;
  isActive?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  MessageSquare,
  Briefcase,
  PenTool,
  BookOpen,
  Sparkles,
};

export default function CategoryCard({
  category,
  isActive = false,
}: CategoryCardProps) {
  const IconComponent =
    category.icon && iconMap[category.icon]
      ? iconMap[category.icon]
      : GraduationCap;

  return (
    <Link
      href={`/category?id=${category.id}`}
      className={`group flex h-full flex-col rounded-2xl border p-6 transition-colors ${
        isActive
          ? "border-(--vk-primary) bg-(--vk-primary-light)/50 ring-1 ring-(--vk-primary)/35"
          : "border-(--vk-border) bg-(--vk-surface) hover:border-(--vk-border-strong)"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div
          className="flex size-11 items-center justify-center rounded-xl text-white shadow-xs"
          style={{ backgroundColor: category.color || "#B45309" }}
        >
          <IconComponent className="size-5" />
        </div>
        {category.badge && (
          <span className="rounded-full border border-(--vk-border-strong) bg-(--vk-surface-subtle) px-2.5 py-0.5 vankho-mono text-[10px] font-semibold uppercase tracking-wider text-(--vk-brass)">
            {category.badge}
          </span>
        )}
      </div>

      <h3 className="vankho-serif text-lg font-medium text-(--vk-fg) transition-colors group-hover:text-(--vk-brass)">
        {category.name}
      </h3>
      <p className="mt-1.5 mb-5 flex-1 text-xs leading-relaxed text-(--vk-muted) line-clamp-2">
        {category.description}
      </p>

      <div className="flex items-center justify-between border-t border-(--vk-border) pt-3.5 text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-(--vk-muted)">
          <BookOpen className="size-3.5 text-(--vk-brass)" />
          <span>{category.count || 0} đầu sách</span>
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-(--vk-brass)">
          <span>Mở tủ sách</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
