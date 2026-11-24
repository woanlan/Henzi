// ============================================================================
// [YÊU CẦU CÔ - Lab 4 (Form Validation) - Bộ Hàm Bắt Lỗi Thuần TypeScript]
// File chứa toàn bộ các hàm kiểm tra dữ liệu đầu vào ( nhập thiếu / nhập sai )
// bằng JavaScript/TypeScript thuần, KHÔNG phụ thuộc popup HTML5 mặc định.
// Mỗi hàm trả về chuỗi thông báo lỗi tiếng Việt hoặc "" nếu dữ liệu hợp lệ.
// Dùng chung cho tất cả 9 Form trên toàn hệ thống (Học viên & Quản trị Admin).
// ============================================================================

/** 1. Kiểm tra trường bắt buộc không được để trống */
export function validateRequired(value: string, fieldName: string): string {
  if (!value || !value.trim()) {
    return `${fieldName} không được để trống.`;
  }
  return "";
}

/** 2. Kiểm tra trường bắt buộc + độ dài tối thiểu */
export function validateMinLength(
  value: string,
  min: number,
  fieldName: string
): string {
  const requiredError = validateRequired(value, fieldName);
  if (requiredError) return requiredError;
  if (value.trim().length < min) {
    return `${fieldName} phải có ít nhất ${min} ký tự.`;
  }
  return "";
}

/** 3. Kiểm tra độ dài tối đa */
export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string
): string {
  if (value && value.trim().length > max) {
    return `${fieldName} không được vượt quá ${max} ký tự.`;
  }
  return "";
}

/**
 * 4. Kiểm tra định dạng Tên đăng nhập (username):
 * - Bắt buộc nhập
 * - Độ dài từ 3 đến 20 ký tự
 * - Chỉ gồm chữ cái không dấu (a-z, A-Z), số (0-9) và dấu gạch dưới (_)
 */
export function validateUsername(username: string): string {
  const required = validateRequired(username, "Tên đăng nhập");
  if (required) return required;
  const trimmed = username.trim();
  if (trimmed.length < 3) {
    return "Tên đăng nhập phải có ít nhất 3 ký tự.";
  }
  if (trimmed.length > 20) {
    return "Tên đăng nhập không được vượt quá 20 ký tự.";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return "Tên đăng nhập chỉ được chứa chữ cái không dấu, số và dấu gạch dưới (_).";
  }
  return "";
}

/**
 * 5. Kiểm tra Họ và tên học viên / người dùng:
 * - Nếu required = true: không được để trống
 * - Phải có ít nhất 2 ký tự
 */
export function validateFullName(
  fullName: string,
  required = true,
  fieldName = "Họ và tên"
): string {
  if (!fullName || !fullName.trim()) {
    return required ? `${fieldName} không được để trống.` : "";
  }
  if (fullName.trim().length < 2) {
    return `${fieldName} phải có ít nhất 2 ký tự.`;
  }
  return "";
}

/**
 * 6. Kiểm tra định dạng Email:
 * - Nếu required = true: bắt buộc không để trống
 * - Nếu có nhập: phải đúng cấu trúc name@domain.com
 */
export function validateEmail(email: string, required = true): string {
  if (!email || !email.trim()) {
    return required ? "Email không được để trống." : "";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Email không đúng định dạng (ví dụ: docgia@hanzi.vn).";
  }
  return "";
}

/**
 * 7. Kiểm tra Số điện thoại Việt Nam:
 * - Nếu required = true: bắt buộc không để trống
 * - Nếu có nhập: bỏ khoảng trắng thừa, phải bắt đầu bằng số 0 và đủ 10 chữ số
 */
export function validatePhone(phone: string, required = false): string {
  const cleaned = (phone || "").trim().replace(/\s+/g, "");
  if (!cleaned) {
    return required ? "Số điện thoại không được để trống." : "";
  }
  const phoneRegex = /^0[0-9]{9}$/;
  if (!phoneRegex.test(cleaned)) {
    return "Số điện thoại không hợp lệ (cần đúng 10 chữ số, bắt đầu bằng số 0).";
  }
  return "";
}

/**
 * 8. Kiểm tra Mật khẩu:
 * - Bắt buộc nhập
 * - Đạt độ dài tối thiểu (mặc định 6 ký tự khi đăng ký mới)
 */
export function validatePassword(password: string, minLength = 6): string {
  const required = validateRequired(password, "Mật khẩu");
  if (required) return required;
  if (password.length < minLength) {
    return `Mật khẩu phải có ít nhất ${minLength} ký tự.`;
  }
  return "";
}

/**
 * 9. Kiểm tra Xác nhận mật khẩu khớp với mật khẩu gốc
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string {
  const required = validateRequired(confirmPassword, "Xác nhận mật khẩu");
  if (required) return required;
  if (password !== confirmPassword) {
    return "Mật khẩu xác nhận không khớp với mật khẩu đã nhập.";
  }
  return "";
}

/**
 * 10. Kiểm tra Mã ưu đãi (Voucher Code):
 * - Nếu required = true: không được để trống
 * - Nếu có nhập: tối thiểu 3 ký tự, chỉ gồm chữ IN HOA, số, dấu (-) hoặc (_)
 */
export function validateVoucherCode(code: string, required = true): string {
  if (!code || !code.trim()) {
    return required ? "Mã voucher không được để trống." : "";
  }
  const trimmed = code.trim();
  if (trimmed.length < 3) {
    return "Mã voucher phải có ít nhất 3 ký tự.";
  }
  if (!/^[A-Z0-9_-]+$/.test(trimmed)) {
    return "Mã voucher chỉ được chứa chữ IN HOA, số, dấu (-) hoặc (_).";
  }
  return "";
}

/**
 * 11. Kiểm tra Giá bán ấn phẩm:
 * - Bắt buộc không để trống
 * - Phải có chứa chữ số hợp lệ (ví dụ: 169.000₫)
 */
export function validatePrice(price: string, fieldName = "Giá bán"): string {
  const required = validateRequired(price, fieldName);
  if (required) return required;
  if (!/\d/.test(price.trim())) {
    return `${fieldName} phải có chữ số hợp lệ (ví dụ: 169.000₫).`;
  }
  return "";
}

/**
 * 11b. Kiểm tra Số nguyên dương tối thiểu (ví dụ: Số trang in >= 16):
 */
export function validatePositiveInt(
  value: string,
  min = 1,
  fieldName = "Giá trị số"
): string {
  if (!value || !String(value).trim()) return "";
  const parsed = Number(String(value).trim());
  if (!Number.isInteger(parsed) || parsed < min) {
    return `${fieldName} phải là số nguyên từ ${min} trở lên.`;
  }
  return "";
}

/**
 * 12. Kiểm tra Mã màu Hex (#RRGGBB hoặc #RGB):
 * - Nếu có nhập thì phải đúng chuẩn mã màu Hex
 */
export function validateHexColor(color: string): string {
  if (!color || !color.trim()) return "";
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color.trim())) {
    return "Mã màu không hợp lệ (ví dụ đúng: #D97706).";
  }
  return "";
}

/**
 * 13. Kiểm tra Địa chỉ nhận sách giao tận nơi:
 * - Nếu required = true: bắt buộc nhập
 * - Phải ghi rõ ít nhất 8 ký tự (số nhà, tên đường, phường/xã, quận/huyện)
 */
export function validateShippingAddress(
  address: string,
  required = true
): string {
  if (!address || !address.trim()) {
    return required ? "Địa chỉ nhận sách không được để trống." : "";
  }
  if (address.trim().length < 8) {
    return "Địa chỉ nhận sách cần ghi rõ số nhà, đường, phường/xã, quận/huyện (ít nhất 8 ký tự).";
  }
  return "";
}

/**
 * 14. Hàm tổng hợp kiểm tra xem object lỗi có chứa lỗi nào không
 */
export function hasErrors(errors: Record<string, string>): boolean {
  return Object.values(errors).some((msg) => msg !== "");
}
