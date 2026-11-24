"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { hydrateAuthUser } from "./slices/authSlice";
import {
  hydrateVoucherWallet,
  VOUCHER_WALLET_STORAGE_KEY,
  VoucherWalletState,
} from "./slices/voucherWalletSlice";
import {
  CART_STORAGE_KEY,
  CartEntry,
  hydrateCart,
} from "./slices/cartSlice";
import { AUTH_CHANGE_EVENT, getSavedUser } from "@/services/auth.service";
import { AiTutorProvider } from "@/context/AiTutorContext";

// ============================================================================
// [YÊU CẦU CÔ - Redux Provider & Context Provider cấp toàn ứng dụng]
// Bọc ngoài toàn bộ ứng dụng tại src/app/layout.tsx và đồng bộ dữ liệu từ
// localStorage vào Redux Store sau khi trình duyệt mount (tránh lỗi SSR Hydration).
// ============================================================================

function StoreHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const syncUserToStore = () => {
      store.dispatch(hydrateAuthUser(getSavedUser()));
    };

    syncUserToStore();

    try {
      const rawWallet = localStorage.getItem(VOUCHER_WALLET_STORAGE_KEY);
      if (rawWallet) {
        const parsed = JSON.parse(rawWallet) as Partial<VoucherWalletState>;
        const migratedCodes = Array.isArray(parsed.savedCodes)
          ? Array.from(
              new Set(
                parsed.savedCodes.map((c) =>
                  c === "VANKHO50K" ? "HANZI50K" : c
                )
              )
            )
          : [];
        const migratedActive =
          typeof parsed.activeVoucherCode === "string"
            ? parsed.activeVoucherCode === "VANKHO50K"
              ? "HANZI50K"
              : parsed.activeVoucherCode
            : "";
        const nextWallet = {
          savedCodes: migratedCodes,
          activeVoucherCode: migratedActive,
        };
        localStorage.setItem(
          VOUCHER_WALLET_STORAGE_KEY,
          JSON.stringify(nextWallet)
        );
        store.dispatch(hydrateVoucherWallet(nextWallet));
      }
    } catch {
      // Bỏ qua nếu dữ liệu localStorage không hợp lệ
    }

    try {
      const rawCart = localStorage.getItem(CART_STORAGE_KEY);
      if (rawCart) {
        const parsedCart = JSON.parse(rawCart) as CartEntry[];
        if (Array.isArray(parsedCart)) {
          store.dispatch(hydrateCart(parsedCart));
        }
      }
    } catch {
      // Bỏ qua nếu dữ liệu giỏ hàng không hợp lệ
    }

    window.addEventListener(AUTH_CHANGE_EVENT, syncUserToStore);
    window.addEventListener("storage", syncUserToStore);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUserToStore);
      window.removeEventListener("storage", syncUserToStore);
    };
  }, []);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AiTutorProvider>
        <StoreHydrator>{children}</StoreHydrator>
      </AiTutorProvider>
    </Provider>
  );
}
