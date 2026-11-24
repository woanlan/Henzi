import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookEditionFormat } from "@/interfaces/product";

// ============================================================================
// [YÊU CẦU CÔ - Redux Toolkit Slice Quản Lý Giỏ Hàng Hiệu Sách (cartSlice)]
// Hỗ trợ thêm nhiều đầu sách & ấn bản (Bìa mềm / Bìa cứng), cộng/trừ số lượng,
// thêm trọn bộ Boxset/Tuyển tập, đóng/mở CartDrawer và đồng bộ localStorage.
// ============================================================================

export const CART_STORAGE_KEY = "hanzi_vankho_cart";

export interface CartEntry {
  bookId: string;
  edition: BookEditionFormat;
  quantity: number;
}

export interface CartState {
  items: CartEntry[];
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

const persistCart = (items: CartEntry[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Bỏ qua lỗi ghi localStorage ở môi trường ẩn danh
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartEntry[]>) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },

    addToCart(
      state,
      action: PayloadAction<{
        bookId: string;
        edition: BookEditionFormat;
        quantity?: number;
        maxStock?: number;
        openDrawer?: boolean;
      }>
    ) {
      const { bookId, edition, quantity = 1, maxStock = 99, openDrawer = false } = action.payload;
      if (maxStock <= 0) return;

      const existing = state.items.find(
        (item) => item.bookId === bookId && item.edition === edition
      );
      if (existing) {
        existing.quantity = Math.min(maxStock, existing.quantity + quantity);
      } else {
        state.items.push({
          bookId,
          edition,
          quantity: Math.min(maxStock, Math.max(1, quantity)),
        });
      }
      if (openDrawer) {
        state.isCartOpen = true;
      }
      persistCart(state.items);
    },

    addMultipleToCart(
      state,
      action: PayloadAction<{
        entries: Array<{ bookId: string; edition: BookEditionFormat; maxStock?: number }>;
        openDrawer?: boolean;
      }>
    ) {
      for (const entry of action.payload.entries) {
        const cap = entry.maxStock ?? 99;
        if (cap <= 0) continue;
        const existing = state.items.find(
          (item) => item.bookId === entry.bookId && item.edition === entry.edition
        );
        if (existing) {
          existing.quantity = Math.min(cap, existing.quantity + 1);
        } else {
          state.items.push({
            bookId: entry.bookId,
            edition: entry.edition,
            quantity: 1,
          });
        }
      }
      if (action.payload.openDrawer) {
        state.isCartOpen = true;
      }
      persistCart(state.items);
    },

    updateCartQty(
      state,
      action: PayloadAction<{
        bookId: string;
        edition: BookEditionFormat;
        quantity: number;
        maxStock?: number;
      }>
    ) {
      const { bookId, edition, quantity, maxStock = 99 } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => !(item.bookId === bookId && item.edition === edition)
        );
      } else {
        const target = state.items.find(
          (item) => item.bookId === bookId && item.edition === edition
        );
        if (target) {
          target.quantity = Math.min(maxStock, quantity);
        }
      }
      persistCart(state.items);
    },

    removeFromCart(
      state,
      action: PayloadAction<{ bookId: string; edition: BookEditionFormat }>
    ) {
      state.items = state.items.filter(
        (item) =>
          !(item.bookId === action.payload.bookId && item.edition === action.payload.edition)
      );
      persistCart(state.items);
    },

    clearCart(state) {
      state.items = [];
      persistCart(state.items);
    },

    openCart(state) {
      state.isCartOpen = true;
    },

    closeCart(state) {
      state.isCartOpen = false;
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  addMultipleToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
