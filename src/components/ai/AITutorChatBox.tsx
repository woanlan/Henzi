"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { AIChatMessage } from "@/types";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Sparkles,
  Send,
  Volume2,
  BookOpen,
  RotateCcw,
  Copy,
  Check,
  X,
  ArrowRightLeft,
  Minus,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Radio,
} from "lucide-react";
import { PandaMascot } from "@/components/mascot/PandaMascot";

export function AITutorChatBox() {
  const { currentHskLevel, audioSpeed, isAiChatOpen, setIsAiChatOpen, toggleAiChat } = useApp();

  const [dictDirection, setDictDirection] = useState<"vn_to_zh" | "zh_to_vn">("vn_to_zh");
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real-time Voice Walkie-Talkie Mode
  const [isVoiceCallMode, setIsVoiceCallMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceCallStatus, setVoiceCallStatus] = useState<string>("Sẵn sàng trò chuyện. Bấm micro để nói tiếng Trung!");
  const [selectedScenario, setSelectedScenario] = useState<string>("boba");

  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      content: "Xin chào! Thầy là Gia Sư AI Tiếng Trung tại HANZI MASTER 🐼.\n\nThầy có thể giúp bạn giải đáp mọi thắc mắc về ngữ pháp HSK, sửa lỗi phát âm, tra cứu từ vựng, hoặc cùng bạn luyện hội thoại phản xạ trực tiếp. Bạn muốn hỏi điều gì hôm nay?",
      timestamp: "Vừa xong",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAiChatOpen && !isVoiceCallMode) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, loading, isAiChatOpen, isVoiceCallMode]);

  const toggleDirection = () => {
    soundManager.playClick();
    setDictDirection((prev) => (prev === "vn_to_zh" ? "zh_to_vn" : "vn_to_zh"));
  };

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
          direction: dictDirection,
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

        // If in voice call mode, automatically speak aloud
        if (isVoiceCallMode) {
          const textToSpeak = data.breakdown?.originalZh || data.content;
          audioEngine.speak(textToSpeak, { rate: 1.0 });
          setVoiceCallStatus(`Thầy AI: "${textToSpeak}"`);
        }
      } else {
        soundManager.playError();
      }
    } catch (err) {
      console.error(err);
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  // Voice Call Walkie-Talkie Functions
  const startVoiceRecording = () => {
    soundManager.playClick();
    setIsListening(true);
    setVoiceTranscript("");
    setVoiceCallStatus("Đang lắng nghe giọng bạn... Hãy nói tiếng Trung!");

    const rec = audioEngine.createRecognition(
      (text) => {
        setVoiceTranscript(text);
      },
      (err) => {
        console.warn("STT Error:", err);
        setIsListening(false);
        setVoiceCallStatus("Không nghe rõ, vui lòng thử nói lại!");
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      recognitionRef.current = rec;
      rec.start();
    } else {
      setIsListening(false);
      setVoiceCallStatus("Trình duyệt chưa cấp quyền micro. Bạn hãy gõ chữ nhé!");
    }
  };

  const stopVoiceRecordingAndSend = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);

    if (voiceTranscript.trim()) {
      handleSend(voiceTranscript);
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

  const scenarios = [
    { id: "boba", title: "🧋 Mua Trà Sữa Thượng Hải", prompt: "老板，我想买一杯珍珠奶茶，半糖少冰。" },
    { id: "bargain", title: "🛍️ Mặc Cả Chợ Quảng Châu", prompt: "这件衣服太贵了，能不能便宜一点？" },
    { id: "interview", title: "💼 Phỏng Vấn Xin Việc", prompt: "你好，我是来参加今天的面试的。" },
  ];

  return (
    <>
      {/* 1. Floating Trigger Button */}
      {!isAiChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center">
          <button
            onClick={toggleAiChat}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-extrabold text-sm shadow-xl shadow-amber-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border border-amber-300/50 cursor-pointer group"
            title="Mở Thầy Giáo AI & Từ Điển Song Hướng"
          >
            <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center font-hanzi text-base font-black group-hover:rotate-12 transition-transform shadow-2xs">
              师
            </div>
            <span className="tracking-tight font-black whitespace-nowrap flex items-center gap-1.5">
              Thầy Giáo AI
              <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </button>
        </div>
      )}

      {/* 2. Floating Chat Box (Responsive App Modal on Mobile & Anchor Pill on Desktop) */}
      {isAiChatOpen && (
        <div
          className={`fixed z-50 bg-white border border-stone-200/90 shadow-2xl rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? "inset-2 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[560px] sm:h-[84vh]"
              : "bottom-2 right-2 left-2 top-14 sm:inset-auto sm:bottom-6 sm:right-6 w-auto sm:w-[450px] sm:h-[600px] sm:max-h-[88vh]"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-hanzi text-lg font-black shadow-xs border border-amber-400/40">
                师
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-stone-900 tracking-tight flex items-center gap-1">
                    Thầy Giáo AI
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full">
                    HSK {currentHskLevel}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium">
                  {isVoiceCallMode ? "Đang Trong Cuộc Gọi Thoại AI" : "Từ Điển Cambridge & Trợ Lý Học"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              {/* Voice Call Mode Toggle */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsVoiceCallMode(!isVoiceCallMode);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  isVoiceCallMode
                    ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200"
                }`}
                title={isVoiceCallMode ? "Tắt gọi thoại" : "Bật gọi thoại đàm thoại với Thầy AI"}
              >
                {isVoiceCallMode ? <PhoneOff className="w-3.5 h-3.5" /> : <PhoneCall className="w-3.5 h-3.5" />}
                <span>{isVoiceCallMode ? "Ngắt máy" : "Gọi thoại"}</span>
              </button>

              {/* Direction Switcher (When not in call) */}
              {!isVoiceCallMode && (
                <button
                  onClick={toggleDirection}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white border border-stone-200 text-[11px] font-bold text-stone-700 hover:border-amber-400 transition-colors shadow-2xs"
                  title="Đổi chiều tra cứu"
                >
                  <span>{dictDirection === "vn_to_zh" ? "Việt→Hán" : "Hán→Việt"}</span>
                  <ArrowRightLeft className="w-3 h-3 text-amber-600" />
                </button>
              )}

              {/* Expand / Minimize */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsAiChatOpen(false);
                }}
                className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MODE A: REAL-TIME VOICE CALL OVERLAY                     */}
          {/* ======================================================== */}
          {isVoiceCallMode ? (
            <div className="flex-1 bg-[#131F24] text-white p-6 flex flex-col justify-between items-center text-center animate-fadeIn">
              {/* Scenario selector */}
              <div className="w-full space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Chọn Tình Huống Nhập Vai Thực Tế:
                </span>
                <div className="flex gap-1.5 overflow-x-auto justify-center scrollbar-none">
                  {scenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedScenario(s.id);
                        handleSend(s.prompt);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        selectedScenario === s.id
                          ? "bg-amber-500 text-[#131F24] shadow-md"
                          : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mascot Center with Audio Visualizer Ring */}
              <div className="py-4 relative flex flex-col items-center">
                <div className={`relative p-4 rounded-full transition-all ${
                  isListening ? "ring-8 ring-amber-500/30 animate-pulse" : ""
                }`}>
                  <PandaMascot mood={isListening ? "thinking" : "happy"} size="md" />
                </div>
                <p className="text-xs text-stone-300 font-medium max-w-xs mt-3 bg-stone-800/80 p-2.5 rounded-2xl border border-stone-700">
                  {voiceCallStatus}
                </p>
                {voiceTranscript && (
                  <p className="text-amber-400 text-sm font-bold font-hanzi mt-2">
                    Bạn vừa nói: "{voiceTranscript}"
                  </p>
                )}
              </div>

              {/* Big Talk Button */}
              <div className="space-y-3 pb-2 w-full max-w-xs">
                <button
                  onMouseDown={startVoiceRecording}
                  onMouseUp={stopVoiceRecordingAndSend}
                  onTouchStart={startVoiceRecording}
                  onTouchEnd={stopVoiceRecordingAndSend}
                  className={`w-full py-4 rounded-3xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer select-none ${
                    isListening
                      ? "bg-rose-600 text-white scale-105 ring-4 ring-rose-400"
                      : "bg-amber-500 hover:bg-amber-400 text-[#131F24]"
                  }`}
                >
                  {isListening ? <Radio className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                  <span>{isListening ? "Thả ra để gửi..." : "Giữ nút để nói tiếng Trung"}</span>
                </button>
                <span className="text-[10px] text-stone-500 block">
                  Giữ chuột hoặc ngón tay để phát âm tiếng Trung
                </span>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* MODE B: STANDARD CAMBRIDGE DICTIONARY CHAT               */
            /* ======================================================== */
            <>
              {/* Direction Sub-banner */}
              <div className="px-4 py-1.5 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between text-[11px] text-amber-900 shrink-0">
                <span>
                  Chế độ:{" "}
                  <strong>
                    {dictDirection === "vn_to_zh"
                      ? "Tiếng Việt ➔ Chữ Hán + Pinyin + Ngữ Pháp"
                      : "Chữ Hán ➔ Nghĩa Tiếng Việt + Bóc Tách"}
                  </strong>
                </span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setMessages([messages[0]]);
                  }}
                  className="text-stone-400 hover:text-stone-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa</span>
                </button>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-stone-50/40 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl p-3.5 leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-amber-600 text-white shadow-2xs rounded-br-xs"
                          : "bg-white text-stone-900 border border-stone-200 shadow-2xs rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap font-medium">{msg.content}</p>

                      {msg.breakdown && (
                        <div className="mt-3 pt-3 border-t border-stone-100 space-y-3">
                          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-stone-400 uppercase">
                                Mục từ tra cứu
                              </span>
                              {msg.breakdown.partOfSpeech && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                                  {msg.breakdown.partOfSpeech}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-hanzi text-2xl font-black text-amber-700 tracking-wide">
                                {msg.breakdown.originalZh}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => speakText(msg.breakdown!.originalZh)}
                                  className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                                  title="Phát âm tiếng Trung"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    copyToClipboard(msg.breakdown!.originalZh, `copy-${msg.id}`)
                                  }
                                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
                                  title="Sao chép chữ Hán"
                                >
                                  {copiedId === `copy-${msg.id}` ? (
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="text-amber-800 font-mono font-bold text-xs tracking-wide">
                              [{msg.breakdown.pinyin}]
                            </div>

                            <div className="text-stone-800 font-bold text-xs pt-1 border-t border-stone-200/60">
                              {msg.breakdown.vietnameseTranslation}
                            </div>
                          </div>

                          {/* Sub-vocab breakdown */}
                          {msg.breakdown.vocabBreakdown && msg.breakdown.vocabBreakdown.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                                Bóc tách từng từ tố:
                              </span>
                              <div className="grid grid-cols-1 gap-1">
                                {msg.breakdown.vocabBreakdown.map((v, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-1.5 bg-stone-50 rounded-lg border border-stone-200/60 text-[11px]"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-hanzi font-bold text-amber-700 text-sm">
                                        {v.word}
                                      </span>
                                      <span className="font-mono text-[10px] text-stone-500">
                                        [{v.pinyin}]
                                      </span>
                                    </div>
                                    <span className="text-stone-700 font-medium truncate max-w-[160px]">
                                      {v.meaningVn}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Grammar Analysis */}
                          {msg.breakdown.grammarAnalysis && msg.breakdown.grammarAnalysis.length > 0 && (
                            <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-200/60 space-y-1 text-[11px]">
                              <span className="font-bold text-amber-900 block">
                                Lưu ý ngữ pháp & cách dùng:
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                                {msg.breakdown.grammarAnalysis.map((item, idx) => (
                                  <li key={idx} className="leading-snug">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 max-w-xs shadow-2xs">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.15s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.3s]" />
                    </div>
                    <span className="text-stone-500 text-xs font-medium">Thầy AI đang trả lời...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-stone-200 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      dictDirection === "vn_to_zh"
                        ? "Nhập tiếng Việt (từ đơn hoặc câu)..."
                        : "Nhập chữ Hán hoặc câu hỏi tiếng Trung..."
                    }
                    className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-stone-900"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="px-4 py-2.5 rounded-2xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Gửi</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
