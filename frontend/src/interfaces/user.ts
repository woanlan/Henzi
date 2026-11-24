// [YÊU CẦU CÔ - TypeScript Interface định nghĩa Người dùng, Form Đăng nhập & Đăng ký]
// Interface người dùng theo mẫu trong tài liệu môn React
export interface IUser {
  id?: number | string;
  username: string;
  email?: string;
  password?: string;
  role?: number | string;
  fullName?: string;
  phone?: string;
}

// Interface dữ liệu form đăng ký
export interface IRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  fullName: string;
  phone?: string;
}

// Interface dữ liệu form đăng nhập
export interface ILoginForm {
  username: string;
  password: string;
}

