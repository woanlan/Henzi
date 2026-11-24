import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ============================================================================
// [YÊU CẦU CÔ - Redux Toolkit (createSlice, Reducers & Actions)]
// Slice quản lý Ví Mã Ưu Đãi dùng chung toàn ứng dụng:
// - Độc giả bấm "Lưu mã" ở ngăn kéo Phiếu ưu đãi (VanKhoDrawers) -> dispatch(saveVoucherCode)
// - Khi sang trang Chi tiết sách (/detail/[id]) hoặc Giỏ sách -> tự động điền
//   mã ưu đãi đã lưu vào ô Voucher nhờ useAppSelector!
// ============================================================================

export const VOUCHER_WALLET_STORAGE_KEY = "hanzi_voucher_wallet";

export interface VoucherWalletState {
  savedCodes: string[];
  activeVoucherCode: string;
}

const initialState: VoucherWalletState = {
  savedCodes: [],
  activeVoucherCode: "",
};

const persistWallet = (state: VoucherWalletState) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOUCHER_WALLET_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
};

const voucherWalletSlice = createSlice({
  name: "voucherWallet",
  initialState,
  reducers: {
    hydrateVoucherWallet: (state, action: PayloadAction<VoucherWalletState>) => {
      state.savedCodes = action.payload.savedCodes;
      state.activeVoucherCode = action.payload.activeVoucherCode;
    },
    saveVoucherCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      if (!code) return;
      if (!state.savedCodes.includes(code)) {
        state.savedCodes.push(code);
      }
      state.activeVoucherCode = code;
      persistWallet({
        savedCodes: state.savedCodes,
        activeVoucherCode: state.activeVoucherCode,
      });
    },
    selectActiveVoucher: (state, action: PayloadAction<string>) => {
      state.activeVoucherCode = action.payload.trim().toUpperCase();
      persistWallet({
        savedCodes: state.savedCodes,
        activeVoucherCode: state.activeVoucherCode,
      });
    },
    clearActiveVoucher: (state) => {
      state.activeVoucherCode = "";
      persistWallet({
        savedCodes: state.savedCodes,
        activeVoucherCode: "",
      });
    },
  },
});

export const {
  hydrateVoucherWallet,
  saveVoucherCode,
  selectActiveVoucher,
  clearActiveVoucher,
} = voucherWalletSlice.actions;

export default voucherWalletSlice.reducer;
