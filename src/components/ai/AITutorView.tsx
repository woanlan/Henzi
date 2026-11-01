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
  GraduationCap,
  RotateCcw,
  Lightbulb,
  MessageSquare,
  Copy,
  Check,
  Key,
  X,
  ArrowRightLeft,
  Search,
  Bookmark,
  Layers,
  ExternalLink,
  BookMarked,
  FileText,
} from "lucide-react";

export function AITutorView() {
  const { currentHskLevel, audioSpeed, toggleNotebook, notebookIds } = useApp();

  // Mode: "dictionary" (Cambridge-style lookup) | "tutor_chat" (free conversation)
  const [activeTab, setActiveTab] = useState<"dictionary" | "tutor_chat">("dictionary");

  // Translation direction for Cambridge Dictionary mode: "vn_to_zh" (Việt -> Hán) | "zh_to_vn" (Hán -> Việt)
  const [dictDirection, setDictDirection] = useState<"vn_to_zh" | "zh_to_vn">("vn_to_zh");

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      content: "Chào mừng bạn đến với Từ Điển Song Hướng Hán-Việt & Việt-Hán chuẩn Cambridge Dictionary! Bạn có thể tra từ đơn (như 'căn hộ', 'phẳng', 'máy bay') hoặc câu hoàn chỉnh.",
      timestamp: "Vừa xong",
      breakdown: {
        originalZh: "公寓",
        pinyin: "gōngyù",
        vietnameseTranslation: "Căn hộ, chung cư (tương đương 'flat / apartment' trong tiếng Anh)",
        direction: "vn_to_zh",
        partOfSpeech: "Danh từ (Lượng từ: 套 tào, 间 jiān)",
        collocations: ["单身公寓 (căn hộ độc thân)", "公寓楼 (tòa nhà chung cư)", "租公寓 (thuê căn hộ)"],
        synonyms: ["单元房", "住宅"],
        vocabBreakdown: [
          { word: "公", pinyin: "gōng", meaningVn: "công (công cộng, chung)", partOfSpeech: "Tính từ" },
          { word: "寓", pinyin: "yù", meaningVn: "ngụ (nơi cư trú, ở)", partOfSpeech: "Động từ" },
        ],
        grammarAnalysis: [
          "Lượng từ thông dụng: Dùng '一套公寓' (yí tào gōngyù - một căn hộ khép kín) hoặc '一间公寓' (yì jiān gōngyù).",
          "So sánh với 房子 (fángzi): 房子 chỉ ngôi nhà nói chung (cả nhà mặt đất), còn 公寓 chỉ căn hộ thuộc tòa nhà chung cư.",
        ],
        naturalUsageExamples: [
          {
            zh: "他在市中心租了一套两居室的公寓。",
            pinyin: "Tā zài shì zhōngxīn zū le yí tào liǎng jū shì de gōngyù.",
            vn: "Anh ấy đã thuê một căn hộ 2 phòng ngủ ở trung tâm thành phố.",
          },
          {
            zh: "这栋公寓的环境非常安静舒适。",
            pinyin: "Zhè dòng gōngyù de huánjìng fēicháng ānjìng shūshì.",
            vn: "Môi trường của khu căn hộ này rất yên tĩnh và tiện nghi.",
          },
        ],
      },
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [savedKeyNotification, setSavedKeyNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hanzi_openai_key");
      if (stored) setApiKey(stored);
    }
  }, []);

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("hanzi_openai_key", apiKey.trim());
      setSavedKeyNotification(true);
      setTimeout(() => {
        setSavedKeyNotification(false);
        setShowKeyModal(false);
      }, 1200);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
          customApiKey: apiKey.trim() || undefined,
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

  // Dynamic suggestions based on direction
  const vnSuggestions = [
    "Căn hộ",
    "Thời tiết hôm nay rất lạnh, bạn nhớ mặc ấm nhé",
    "Bằng phẳng",
    "Tôi muốn đi du lịch Trung Quốc",
    "Cảm ơn sự giúp đỡ của bạn",
  ];

  const zhSuggestions = [
    "我是昨天坐飞机来的",
    "二 và 两 khác nhau như thế nào",
    "请把门关上",
    "博大精深",
  ];

  const currentSuggestions = dictDirection === "vn_to_zh" ? vnSuggestions : zhSuggestions;

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-6xl mx-auto w-full bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header: Mode & Cambridge Direction Switcher */}
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Branding & Cambridge badge */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-hanzi text-2xl font-black shadow-md border border-amber-400/40">
            典
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-stone-900 tracking-tight">
                Từ Điển Song Hướng Hán ⇄ Việt
              </h2>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
                Cambridge Style
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Tra cứu từ loại • Pinyin có dấu • Nghĩa đa ngữ cảnh • Câu ví dụ song ngữ
            </p>
          </div>
        </div>

        {/* Right: Direction Toggle & Settings */}
        <div className="flex items-center gap-2">
          {/* Cambridge Direction Switcher Pill */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-stone-200 shadow-2xs">
            <button
              onClick={() => {
                soundManager.playClick();
                setDictDirection("vn_to_zh");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dictDirection === "vn_to_zh"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Việt → Hán
            </button>

            <button
              onClick={toggleDirection}
              className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
              title="Đổi chiều tra cứu"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setDictDirection("zh_to_vn");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dictDirection === "zh_to_vn"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Hán → Việt
            </button>
          </div>

          {/* Reset chat */}
          <button
            onClick={() => {
              soundManager.playClick();
              setMessages([messages[0]]);
            }}
            className="text-stone-400 hover:text-stone-600 p-2 rounded-xl hover:bg-stone-200/50 transition-colors"
            title="Xóa làm mới tra cứu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message & Dictionary Results Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50/40">
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
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-bold text-stone-800">HANZI Cambridge Dictionary</span>
                </>
              ) : (
                <span className="font-bold text-stone-800">Yêu cầu của bạn</span>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-4xl w-full rounded-3xl p-5 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-amber-600 text-white shadow-xs rounded-br-xs ml-auto max-w-xl"
                  : "bg-white text-stone-900 border border-stone-200 shadow-sm rounded-bl-xs"
              }`}
            >
              <p className="whitespace-pre-wrap font-medium">{msg.content}</p>

              {/* ======================================================== */}
              {/* CAMBRIDGE-STYLE DICTIONARY ENTRY CARD                    */}
              {/* ======================================================== */}
              {msg.breakdown && (
                <div className="mt-5 pt-5 border-t border-stone-100 space-y-5 animate-fadeIn">
                  {/* Cambridge Headword Box */}
                  <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                          Mục Từ Tra Cứu (Headword)
                        </span>
                        {msg.breakdown.partOfSpeech && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                            {msg.breakdown.partOfSpeech}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          HSK {currentHskLevel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakText(msg.breakdown!.originalZh)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all shadow-2xs"
                        >
                          <Volume2 className="w-4 h-4 text-amber-700" />
                          <span>Phát âm (zh-CN)</span>
                        </button>

                        <button
                          onClick={() => copyToClipboard(msg.breakdown!.originalZh, msg.id)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                          title="Sao chép từ"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Large Headword typography */}
                    <div className="font-hanzi text-3xl sm:text-4xl font-black text-stone-900 tracking-wide">
                      {msg.breakdown.originalZh}
                    </div>

                    {/* Pinyin with tone marks */}
                    <div className="text-amber-800 font-mono text-base sm:text-lg font-bold">
                      /{msg.breakdown.pinyin}/
                    </div>

                    {/* Definition in Vietnamese */}
                    <div className="pt-3 border-t border-stone-200/70 text-stone-800 font-semibold text-base sm:text-lg">
                      {msg.breakdown.vietnameseTranslation}
                    </div>
                  </div>

                  {/* Collocations & Phrases (Cụm từ hay đi kèm) */}
                  {msg.breakdown.collocations && msg.breakdown.collocations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-600" />
                        <span>Cụm Từ Thông Dụng Đi Kèm (Collocations)</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {msg.breakdown.collocations.map((col, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 font-hanzi"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Synonyms & Antonyms */}
                  {(msg.breakdown.synonyms?.length || msg.breakdown.antonyms?.length) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {msg.breakdown.synonyms && msg.breakdown.synonyms.length > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                          <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider block">
                            Từ Đồng Nghĩa:
                          </span>
                          <span className="font-hanzi font-bold text-emerald-950">
                            {msg.breakdown.synonyms.join(", ")}
                          </span>
                        </div>
                      )}
                      {msg.breakdown.antonyms && msg.breakdown.antonyms.length > 0 && (
                        <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 space-y-1">
                          <span className="font-bold text-red-900 uppercase text-[10px] tracking-wider block">
                            Từ Trái Nghĩa:
                          </span>
                          <span className="font-hanzi font-bold text-red-950">
                            {msg.breakdown.antonyms.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Layer 4: Vocabulary Decomposition */}
                  {msg.breakdown.vocabBreakdown?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span>Chi Tiết Từng Chữ Hán Cấu Thành</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {msg.breakdown.vocabBreakdown.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-stone-200 rounded-xl p-3 hover:border-amber-300 transition-colors shadow-2xs"
                          >
                            <div className="flex items-baseline justify-between">
                              <span className="font-hanzi text-lg font-bold text-stone-900">
                                {item.word}
                              </span>
                              <span className="text-xs text-amber-800 font-mono font-medium">
                                {item.pinyin}
                              </span>
                            </div>
                            <div className="text-xs text-stone-700 font-medium mt-1">
                              {item.meaningVn}
                            </div>
                            {item.partOfSpeech && (
                              <span className="inline-block mt-1.5 text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-semibold">
                                {item.partOfSpeech}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Layer 5: Grammar & Usage Notes */}
                  {msg.breakdown.grammarAnalysis?.length > 0 && (
                    <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-amber-700" />
                        <span>Ngữ Pháp & Lưu Ý Cách Dùng (Grammar Notes)</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-amber-950 leading-relaxed list-disc list-inside">
                        {msg.breakdown.grammarAnalysis.map((gram, idx) => (
                          <li key={idx} className="leading-normal">{gram}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cambridge Example Sentences Block */}
                  {msg.breakdown.naturalUsageExamples?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>Câu Ví Dụ Thực Tế Song Ngữ (Examples)</span>
                      </h4>
                      <div className="space-y-2.5">
                        {msg.breakdown.naturalUsageExamples.map((ex, idx) => (
                          <div
                            key={idx}
                            className="bg-stone-50 rounded-2xl p-4 border-l-4 border-l-amber-500 border border-stone-200/80 flex items-start justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="font-hanzi font-bold text-stone-900 text-base">
                                {ex.zh}
                              </div>
                              <div className="text-xs text-amber-800 font-mono font-medium">
                                {ex.pinyin}
                              </div>
                              <div className="text-xs font-medium text-stone-700 mt-1 italic">
                                &ldquo;{ex.vn}&rdquo;
                              </div>
                            </div>
                            <button
                              onClick={() => speakText(ex.zh)}
                              className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-xl transition-colors shrink-0"
                              title="Nghe câu ví dụ"
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
          <div className="flex items-center gap-2.5 text-xs text-stone-600 animate-pulse bg-white p-3.5 rounded-2xl border border-stone-200 w-fit shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Gia sư AI đang dịch thuật và tra cứu dữ liệu từ điển Cambridge...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Search Prompts */}
      <div className="px-6 py-2.5 bg-stone-50 border-t border-stone-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
          Gợi ý tra cứu:
        </span>
        {currentSuggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sug)}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-900 transition-colors shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Search Box */}
      <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={
              dictDirection === "vn_to_zh"
                ? "Nhập từ hoặc câu tiếng Việt cần chuyển sang chữ Hán (Ví dụ: căn hộ, thời tiết, bằng phẳng, tôi muốn uống trà...)"
                : "Nhập chữ Hán cần tra cứu nghĩa, pinyin và ngữ pháp (Ví dụ: 公寓, 坐飞机, 博大精深...)"
            }
            className="w-full px-4 py-3.5 pr-10 text-sm rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-stone-400"
          />
          <Search className="absolute right-4 top-4 w-4 h-4 text-stone-400" />
        </div>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          <span>Tra Cứu</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Modal: API Key Setup */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                <span>Cấu Hình Khóa AI Trực Tuyến</span>
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hệ thống hiện đã tích hợp sẵn khóa <b>Google Gemini 3.8 Flash</b>. Nếu muốn sử dụng OpenAI key riêng, bạn có thể dán vào đây:
            </p>
            <form onSubmit={saveApiKey} className="space-y-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
                >
                  Lưu Khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
