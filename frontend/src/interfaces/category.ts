// [YÊU CẦU CÔ - TypeScript Interface định nghĩa cấu trúc Danh mục đào tạo]
// Interface danh mục sản phẩm / khóa học
export interface ICategory {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  count?: number;
  badge?: string;
  color?: string;
}
