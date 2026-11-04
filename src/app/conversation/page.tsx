"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CONVERSATION_TOPICS, ConversationTopic, DialogueLine } from "@/data/conversations";
import { audioEngine } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  MessageSquare,
  Volume2,
  Mic,
  Play,
  Pause,
  RotateCcw,
  User,
  Users,
  Eye,
  EyeOff,
  Languages,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function ConversationLabPage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(CONVERSATION_TOPICS[0].id);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // Roleplay mode state: null (Listening mode), 'A' (User is A), 'B' (User is B)
  const [roleplayMode, setRoleplayMode] = useState<'A' | 'B' | null>(null);
  const [roleplayStep, setRoleplayStep] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [roleplayFeedback, setRoleplayFeedback] = useState<string | null>(null);

  const topic = CONVERSATION_TOPICS.find((t) => t.id === selectedTopicId) || CONVERSATION_TOPICS[0];

  const handleSelectTopic = (id: string) => {
    soundManager.playClick();
    setSelectedTopicId(id);
    setActiveLineId(null);
    setIsPlayingAll(false);
    setRoleplayMode(null);
    setRoleplayStep(0);
    setRoleplayFeedback(null);
  };

  const handleSpeakLine = (line: DialogueLine) => {
    setActiveLineId(line.id);
    try {
      audioEngine.speak(line.sentenceZh);
    } catch {}
  };

  // Play whole conversation sequentially
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAll) {
      let currentIndex = 0;
      const playNext = () => {
        if (currentIndex < topic.lines.length) {
          const line = topic.lines[currentIndex];
          setActiveLineId(line.id);
          try {
            audioEngine.speak(line.sentenceZh);
          } catch {}
          currentIndex++;
          // Estimate delay based on sentence length
          const delay = Math.max(2500, line.sentenceZh.length * 300);
          timer = setTimeout(playNext, delay);
        } else {
          setIsPlayingAll(false);
          setActiveLineId(null);
        }
      };
      playNext();
    }
    return () => clearTimeout(timer);
  }, [isPlayingAll, topic]);

  // Handle Roleplay flow
  const startRoleplay = (role: 'A' | 'B') => {
    soundManager.playClick();
    setRoleplayMode(role);
    setRoleplayStep(0);
    setRoleplayFeedback(null);

    // If computer speaks first
    const firstLine = topic.lines[0];
    if (firstLine.speaker !== role) {
      setTimeout(() => {
        handleSpeakLine(firstLine);
      }, 500);
    }
  };

  const handleAdvanceRoleplay = () => {
    soundManager.playCorrect();
    const nextStep = roleplayStep + 1;
    if (nextStep < topic.lines.length) {
      setRoleplayStep(nextStep);
      const nextLine = topic.lines[nextStep];
      if (nextLine.speaker !== roleplayMode) {
        handleSpeakLine(nextLine);
      }
      setRoleplayFeedback(null);
    } else {
      setRoleplayFeedback("Tuyệt vời! Bạn đã hoàn thành toàn bộ đoạn hội thoại với ngữ điệu chuẩn xác.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#0F172A] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>Phòng Luyện Hội Thoại & Đóng Vai A/B</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Giao Tiếp Tình Huống Bản Xứ
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Luyện nghe phản xạ với audio chạy từng câu hoặc chọn đóng vai nhân vật A/B để luyện nói thực tế.
            </p>
          </div>

          {/* TOPIC SELECTOR */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CONVERSATION_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectTopic(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  t.id === selectedTopicId
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span className="px-1.5 py-0.5 rounded-md bg-black/15 text-[10px] font-black">
                  HSK {t.hskLevel}
                </span>
                <span>{t.titleVn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DIALOGUE CONTAINER (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-8 space-y-6">
              {/* Context and Topic Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                      HSK {topic.hskLevel}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      Bối cảnh: {topic.contextVn}
                    </span>
                  </div>
                  <h2 className="font-hanzi text-2xl sm:text-3xl font-black text-stone-900">
                    {topic.titleZh}
                  </h2>
                  <p className="text-sm font-semibold text-amber-800">
                    {topic.titleVn}
                  </p>
                </div>

                {/* Controls: Play All, Toggles */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setIsPlayingAll(!isPlayingAll);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isPlayingAll
                        ? "bg-rose-50 border-rose-300 text-rose-700"
                        : "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm"
                    }`}
                  >
                    {isPlayingAll ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Dừng đọc</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Đọc toàn bài</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowPinyin(!showPinyin);
                    }}
                    className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                      showPinyin ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-stone-50 text-stone-600 border-stone-200"
                    }`}
                    title="Bật/Tắt Pinyin"
                  >
                    {showPinyin ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowTranslation(!showTranslation);
                    }}
                    className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                      showTranslation ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-stone-50 text-stone-600 border-stone-200"
                    }`}
                    title="Bật/Tắt Bản dịch tiếng Việt"
                  >
                    <Languages className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dialogue Speech Bubbles */}
              <div className="space-y-4">
                {topic.lines.map((line, index) => {
                  const isRoleA = line.speaker === "A";
                  const isActive = activeLineId === line.id;
                  const isMyTurnInRoleplay = roleplayMode && roleplayMode === line.speaker && roleplayStep === index;

                  return (
                    <div
                      key={line.id}
                      className={`flex gap-3 items-start transition-all ${
                        isRoleA ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm ${line.avatarColor}`}
                        title={line.speakerNameZh}
                      >
                        {line.speaker}
                      </div>

                      {/* Bubble */}
                      <div
                        onClick={() => handleSpeakLine(line)}
                        className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-3xl border transition-all cursor-pointer space-y-1.5 ${
                          isActive
                            ? "bg-amber-50/90 border-amber-400 shadow-md ring-2 ring-amber-400/30"
                            : isMyTurnInRoleplay
                            ? "bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-400/40 animate-pulse"
                            : "bg-[#FAFAF9] border-stone-200/80 hover:border-amber-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="font-bold text-stone-500">
                            {line.speakerNameZh} ({line.speakerNameVn})
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeakLine(line);
                            }}
                            className="text-stone-400 hover:text-amber-700"
                            title="Nghe câu này"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Chinese Sentence */}
                        <p className="font-hanzi text-base sm:text-lg font-bold text-stone-900 leading-snug">
                          {line.sentenceZh}
                        </p>

                        {/* Pinyin */}
                        {showPinyin && (
                          <p className="text-xs text-amber-800 font-medium">
                            {line.sentencePinyin}
                          </p>
                        )}

                        {/* Translation */}
                        {showTranslation && (
                          <p className="text-xs text-stone-600 border-t border-stone-200/50 pt-1.5 italic">
                            {line.sentenceVn}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ROLEPLAY SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 space-y-5 sticky top-24">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Users className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                    Chế Độ Đóng Vai (Roleplay)
                  </h3>
                  <p className="text-[11px] text-stone-400">Chọn vai để đối thoại với hệ thống</p>
                </div>
              </div>

              {/* Role Selectors */}
              <div className="space-y-3">
                <button
                  onClick={() => startRoleplay("A")}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    roleplayMode === "A"
                      ? "bg-amber-600 text-white border-amber-600 shadow-md"
                      : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase">Vai A: {topic.roleA.nameZh}</span>
                    <span className="text-[11px] opacity-80">({topic.roleA.nameVn})</span>
                  </div>
                  <p className="text-[11px] mt-1 opacity-80">{topic.roleA.roleDesc}</p>
                </button>

                <button
                  onClick={() => startRoleplay("B")}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    roleplayMode === "B"
                      ? "bg-amber-600 text-white border-amber-600 shadow-md"
                      : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase">Vai B: {topic.roleB.nameZh}</span>
                    <span className="text-[11px] opacity-80">({topic.roleB.nameVn})</span>
                  </div>
                  <p className="text-[11px] mt-1 opacity-80">{topic.roleB.roleDesc}</p>
                </button>
              </div>

              {/* Roleplay Interactive Action Box */}
              {roleplayMode && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">
                      Tiến độ: Câu {roleplayStep + 1} / {topic.lines.length}
                    </span>
                    <button
                      onClick={() => {
                        setRoleplayMode(null);
                        setRoleplayFeedback(null);
                      }}
                      className="text-[11px] text-stone-500 hover:text-stone-800"
                    >
                      Thoát đóng vai
                    </button>
                  </div>

                  {roleplayFeedback ? (
                    <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-semibold space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>{roleplayFeedback}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-stone-600">
                        {topic.lines[roleplayStep]?.speaker === roleplayMode ? (
                          <span className="text-amber-800 font-bold">
                            👉 Lượt của bạn! Hãy đọc to câu được làm nổi bật bên trái.
                          </span>
                        ) : (
                          <span className="text-stone-500">
                            🎧 Đang nghe bạn diễn phát âm...
                          </span>
                        )}
                      </p>

                      <button
                        onClick={handleAdvanceRoleplay}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        <span>Đã phát âm xong & Tiếp tục</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
