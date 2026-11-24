// [YÊU CẦU CÔ - TypeScript Interface định nghĩa cấu trúc Sách, Ấn bản, Combo Boxset & Cấp HSK]

export type BookEditionFormat = "paperback" | "hardcover";

export interface IBookEdition {
  label: string;
  price: number;
  stock: number;
  isbn?: string;
  dimensions?: string;
}

export interface IProduct {
  id: string | number;
  name: string;
  categoryId: string | number;
  categoryName?: string;
  author?: string;
  publisher?: string;
  pages?: number;
  publishYear?: number;
  isbn?: string;
  price: string;
  originalPrice?: string;
  period?: string;
  desc: string;
  fullDesc?: string;
  features: string[];
  duration?: string;
  level?: string;
  rating?: number;
  studentsCount?: number;
  popular?: boolean;
  badge?: string;
  color?: string;
  image?: string;
  lookbookImage?: string;
  editions?: {
    paperback: IBookEdition;
    hardcover: IBookEdition;
  };
}

// Interface cho các bộ Combo / Boxset sách tiết kiệm
export interface IPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  originalPrice?: string;
  period: string;
  desc: string;
  features: string[];
  popular?: boolean;
}

// Interface cho phân loại tủ sách theo cấp độ HSK
export interface IHSKCourse {
  level: number;
  title: string;
  titleVn: string;
  description: string;
  requiredVocabCount: number;
  passingScore: number;
  maxScore: number;
  colorHex: string;
}

export type Product = IProduct;
export type Plan = IPlan;
export type HSKCourse = IHSKCourse;
