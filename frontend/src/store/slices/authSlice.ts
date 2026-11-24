import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/interfaces/user";

// ============================================================================
// [YÊU CẦU CÔ - Redux Toolkit (Slice quản lý Phiên đăng nhập toàn cục)]
// Lưu trữ thông tin user (Độc giả / Admin) tập trung trên Redux Store để
// VanKhoHeaderFooterShell, LoginForm, ProductDetailCard và AdminDashboard truy cập đồng bộ.
// ============================================================================

export interface AuthSliceState {
  currentUser: IUser | null;
  hydrated: boolean;
}

const initialState: AuthSliceState = {
  currentUser: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuthUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
      state.hydrated = true;
    },
    setReduxUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.hydrated = true;
    },
    clearReduxUser: (state) => {
      state.currentUser = null;
      state.hydrated = true;
    },
  },
});

export const { hydrateAuthUser, setReduxUser, clearReduxUser } = authSlice.actions;

export default authSlice.reducer;
