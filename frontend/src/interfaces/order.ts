import { BookEditionFormat } from "./product";

// [YÊU CẦU CÔ - TypeScript Interface định nghĩa Đơn đặt sách & Mã ưu đãi (Voucher)]
export type OrderStatus = "pending" | "approved" | "cancelled";

export interface IOrderItem {
  bookId: string;
  bookName: string;
  edition: BookEditionFormat;
  editionLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface IOrder {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  shippingAddress?: string;
  courseId: string;
  courseName: string;
  items?: IOrderItem[];
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  totalNumeric?: number;
  amount: string;
  voucherCode?: string;
  status: OrderStatus;
  createdAt: string;
  timestampMs?: number;
}

export interface IVoucher {
  id: string;
  code: string;
  title: string;
  desc: string;
  condition: string;
  expiry: string;
  badge: string;
  discountAmount?: number;
  minOrderAmount?: number;
}
