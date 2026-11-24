import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import voucherWalletReducer from "./slices/voucherWalletSlice";
import cartReducer from "./slices/cartSlice";

// ============================================================================
// [YÊU CẦU CÔ - Redux Toolkit (configureStore & Typed Hooks)]
// Kho lưu trữ Global State trung tâm của hiệu sách HANZI gồm 3 slice:
// 1. auth: thông tin độc giả / quản trị viên đang đăng nhập
// 2. voucherWallet: ví mã giảm giá đã lưu để áp dụng tự động khi đặt sách
// 3. cart: giỏ hàng nhiều đầu sách & ấn bản (Bìa mềm / Bìa cứng)
// ============================================================================

export const store = configureStore({
  reducer: {
    auth: authReducer,
    voucherWallet: voucherWalletReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom Typed Hooks của Redux Toolkit cho TypeScript
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
