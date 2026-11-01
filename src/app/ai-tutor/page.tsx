"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function AITutorPage() {
  const router = useRouter();
  const { setIsAiChatOpen } = useApp();

  useEffect(() => {
    setIsAiChatOpen(true);
    router.replace("/dashboard");
  }, [router, setIsAiChatOpen]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] text-stone-500 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
        <span>Đang mở Thầy Giáo AI box chat...</span>
      </div>
    </div>
  );
}
