"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// ============================================================================
// [YÊU CẦU CÔ - Context API (createContext + useContext + Provider)]
// Chia sẻ trạng thái đóng/mở hộp thoại Gia sư AI & cấp độ HSK giữa Navbar và
// AITutorChatBox xuyên nhiều tầng component mà không cần truyền Props trung gian.
// ============================================================================

interface AiTutorContextValue {
  isAiChatOpen: boolean;
  currentHskLevel: number;
  setCurrentHskLevel: (level: number) => void;
  openAiChat: () => void;
  closeAiChat: () => void;
  toggleAiChat: () => void;
}

const AiTutorContext = createContext<AiTutorContextValue | null>(null);

export function AiTutorProvider({ children }: { children: React.ReactNode }) {
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [currentHskLevel, setCurrentHskLevel] = useState<number>(1);

  const openAiChat = useCallback(() => setIsAiChatOpen(true), []);
  const closeAiChat = useCallback(() => setIsAiChatOpen(false), []);
  const toggleAiChat = useCallback(() => setIsAiChatOpen((prev) => !prev), []);

  // Tương thích ngược với các sự kiện trình duyệt mở nhanh hộp chat AI
  useEffect(() => {
    const handleOpen = () => setIsAiChatOpen(true);
    const handleToggle = () => setIsAiChatOpen((prev) => !prev);

    window.addEventListener("hanzi-open-ai-chat", handleOpen);
    window.addEventListener("hanzi-toggle-ai-chat", handleToggle);
    return () => {
      window.removeEventListener("hanzi-open-ai-chat", handleOpen);
      window.removeEventListener("hanzi-toggle-ai-chat", handleToggle);
    };
  }, []);

  const value = useMemo(
    () => ({
      isAiChatOpen,
      currentHskLevel,
      setCurrentHskLevel,
      openAiChat,
      closeAiChat,
      toggleAiChat,
    }),
    [isAiChatOpen, currentHskLevel, openAiChat, closeAiChat, toggleAiChat]
  );

  return <AiTutorContext.Provider value={value}>{children}</AiTutorContext.Provider>;
}

// [YÊU CẦU CÔ - Custom Hook bọc useContext]
export function useAiTutor() {
  const ctx = useContext(AiTutorContext);
  if (!ctx) {
    throw new Error("useAiTutor phải được sử dụng bên trong <AiTutorProvider>");
  }
  return ctx;
}
