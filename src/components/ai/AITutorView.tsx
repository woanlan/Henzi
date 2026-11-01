"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { AIChatMessage, AIMessageBreakdown } from "@/types";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Sparkles,
  Send,
  Volume2,
  BookOpen,
  GraduationCap,
  RotateCcw,
  Lightbulb,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";

export function AITutorView() {
  const { currentHskLevel, audioSpeed } = useApp();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      content: "你好！(Nǐ hǎo!) Tôi là Trợ Lý & Gia Sư AI Tiếng Trung của bạn. Bạn muốn dịch câu, giải thích ngữ pháp HSK hay luyện tập đoạn hội thoại nào hôm nay?",
      timestamp: "Vừa xong",
      breakdown: {
        originalZh: "你好！很高兴为你提供中文学习辅导。",
        pinyin: "Nǐ hǎo! Hěn gāoxìng wèi nǐ tígōng Zhōngwén xuéxí fǔdǎo.",
        vietnameseTranslation: "Xin chào! Rất vui được hỗ trợ bạn học tiếng Trung.",
        vocabBreakdown: [
          { word: "辅导", pinyin: "fǔdǎo", meaningVn: "phụ đạo, gia sư, hướng dẫn", partOfSpeech: "Động từ / Danh từ" },
          { word: "提供", pinyin: "tígōng", meaningVn: "cung cấp, mang lại", partOfSpeech: "Động từ" },
        ],
        grammarAnalysis: [
          "Mẫu câu '为...提供...' nghĩa là 'Cung cấp ... cho ai đó'.",
          "Thanh điệu: Chú ý biến điệu của 你好 (Ní hǎo).",
        ],
        naturalUsageExamples: [
          {
            zh: "有什么我可以帮你的吗？",
            pinyin: "Yǒu shénme wǒ kěyǐ bāng nǐ de ma?",
            vn: "Có điều gì tôi có thể giúp được bạn không?",
          },
        ],
      },
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    soundManager.playClick();
    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          hskLevel: currentHskLevel,
          conversationHistory: messages.slice(-4),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: AIChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          content: data.content,
          breakdown: data.breakdown,
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        soundManager.playSuccess();
      }
    } catch (err) {
      console.error(err);
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  const speakText = (zh: string) => {
    soundManager.playClick();
    audioEngine.speak(zh, { rate: audioSpeed });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const promptSuggestions = [
    "Giải thích giúp tôi câu: '我是越南人'",
    "Phân biệt cách dùng của '二' (èr) và '两' (liǎng)",
    "Dịch sang tiếng Trung: 'Hôm nay trời rất đẹp, chúng mình đi uống trà nhé'",
    "Cách dùng câu chữ 把 (Bǎ) trong HSK 3",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto w-full bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
            <Sparkles className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              Gia Sư AI Tiếng Trung
              <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Chuẩn HSK {currentHskLevel}
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Phân tích đa tầng: Chữ Hán • Pinyin • Tiếng Việt • Từ vựng • Ngữ pháp
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            setMessages([messages[0]]);
          }}
          className="text-stone-400 hover:text-stone-600 p-2 rounded-lg hover:bg-stone-200/50 transition-colors"
          title="Xóa làm mới hội thoại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            {/* Sender identity */}
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-stone-400">
              {msg.sender === "assistant" ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold text-stone-700">HANZI AI Tutor</span>
                </>
              ) : (
                <span className="font-semibold text-stone-700">Bạn</span>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-3xl rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-amber-600 text-white shadow-xs rounded-br-xs"
                  : "bg-white text-stone-800 border border-stone-200 shadow-sm rounded-bl-xs"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* 6-Layer Educational Breakdown Card */}
              {msg.breakdown && (
                <div className="mt-4 pt-4 border-t border-stone-100 space-y-4">
                  {/* Layer 1 & 2: Chinese & Pinyin */}
                  <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/70">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Câu Tiếng Trung Chuẩn
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakText(msg.breakdown!.originalZh)}
                          className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-semibold bg-amber-100/70 hover:bg-amber-100 px-2 py-0.5 rounded transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Phát âm</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(msg.breakdown!.originalZh, msg.id)}
                          className="text-stone-400 hover:text-stone-600 p-1"
                          title="Sao chép"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="font-hanzi text-2xl font-bold text-stone-900 tracking-wide my-1">
                      {msg.breakdown.originalZh}
                    </div>
                    <div className="text-amber-700 font-mono text-sm font-medium">
                      {msg.breakdown.pinyin}
                    </div>
                    {/* Layer 3: Vietnamese Translation */}
                    <div className="mt-2 text-stone-700 font-medium text-sm flex items-start gap-1.5 pt-2 border-t border-stone-200/50">
                      <span className="text-stone-400 font-bold text-xs uppercase">Dịch:</span>
                      <span>{msg.breakdown.vietnameseTranslation}</span>
                    </div>
                  </div>

                  {/* Layer 4: Vocabulary Breakdown */}
                  {msg.breakdown.vocabBreakdown?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>Bóc Tách Từ Vựng Cốt Lõi</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.breakdown.vocabBreakdown.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-stone-200 rounded-lg p-2.5 hover:border-amber-300 transition-colors"
                          >
                            <div className="flex items-baseline justify-between">
                              <span className="font-hanzi text-base font-bold text-stone-900">
                                {item.word}
                              </span>
                              <span className="text-xs text-amber-700 font-mono">
                                {item.pinyin}
                              </span>
                            </div>
                            <div className="text-xs text-stone-600 mt-0.5">
                              {item.meaningVn}
                            </div>
                            {item.partOfSpeech && (
                              <span className="inline-block mt-1 text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded">
                                {item.partOfSpeech}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Layer 5: Grammar Analysis */}
                  {msg.breakdown.grammarAnalysis?.length > 0 && (
                    <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/60">
                      <h4 className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-amber-700" />
                        <span>Phân Tích Ngữ Pháp</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-amber-900 leading-relaxed list-disc list-inside">
                        {msg.breakdown.grammarAnalysis.map((gram, idx) => (
                          <li key={idx}>{gram}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Layer 6: Natural Usage Examples */}
                  {msg.breakdown.naturalUsageExamples?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>Mẫu Câu Mở Rộng Tự Nhiên</span>
                      </h4>
                      <div className="space-y-2">
                        {msg.breakdown.naturalUsageExamples.map((ex, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-stone-50 rounded-lg p-2.5 border border-stone-200/80 flex items-start justify-between gap-3"
                          >
                            <div>
                              <div className="font-hanzi font-semibold text-stone-900 text-sm">
                                {ex.zh}
                              </div>
                              <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                                {ex.pinyin}
                              </div>
                              <div className="text-xs text-stone-700 mt-1">
                                {ex.vn}
                              </div>
                            </div>
                            <button
                              onClick={() => speakText(ex.zh)}
                              className="text-amber-600 hover:text-amber-800 p-1.5 rounded hover:bg-amber-100/50"
                              title="Nghe mẫu câu"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-stone-500 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Gia sư AI đang phân tích ngữ nghĩa và ngữ pháp...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 overflow-x-auto flex gap-2 no-scrollbar">
        {promptSuggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sug)}
            className="whitespace-nowrap px-3 py-1 rounded-full text-xs bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-600 hover:text-amber-800 transition-colors shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-stone-200 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Hỏi từ vựng, ngữ pháp hoặc gõ câu tiếng Trung cần dịch / sửa..."
            className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-stone-400"
          />
          <MessageSquare className="absolute right-3 top-3 w-4 h-4 text-stone-400" />
        </div>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Gửi</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
