"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { SPEAKING_SCENARIOS } from "@/data/speaking";
import { audioEngine, evaluatePronunciation } from "@/lib/audio";
import { soundManager } from "@/lib/utils";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  MessageSquare,
  Award,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
} from "lucide-react";

export function SpeakingLab() {
  const { currentHskLevel, audioSpeed, addXP } = useApp();
  const scenarios = SPEAKING_SCENARIOS.filter((s) => s.hskLevel <= currentHskLevel);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const currentScenario = scenarios[scenarioIndex] || SPEAKING_SCENARIOS[0];

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);
  const [feedback, setFeedback] = useState<{
    score: number;
    accuracy: number;
    matchedChars: number;
    totalChars: number;
    feedbackVn: string;
  } | null>(null);

  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const targetPhrase = currentScenario.suggestedPhrases[activePhraseIndex] || currentScenario.suggestedPhrases[0];

  useEffect(() => {
    // Setup recognition
    const rec = audioEngine.createRecognition(
      (text) => {
        setTranscript(text);
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
    setRecognition(rec);
  }, []);

  const playAiMessage = () => {
    soundManager.playClick();
    audioEngine.speak(currentScenario.initialAiMessage, { rate: audioSpeed });
  };

  const playTargetPhrase = () => {
    soundManager.playClick();
    audioEngine.speak(targetPhrase.zh, { rate: audioSpeed });
  };

  const startRecord = () => {
    soundManager.playClick();
    setTranscript("");
    setFeedback(null);
    if (recognition) {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        console.warn(e);
      }
    } else {
      // Fallback if browser doesn't permit microphone: simulate transcript for testing
      setIsRecording(true);
      setTimeout(() => {
        setTranscript(targetPhrase.zh);
        setIsRecording(false);
      }, 2500);
    }
  };

  const stopRecord = () => {
    soundManager.playClick();
    if (recognition && isRecording) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const analyzeSpeech = () => {
    if (!transcript) return;
    const res = evaluatePronunciation(targetPhrase.zh, transcript);
    setFeedback(res);
    if (res.accuracy >= 70) {
      soundManager.playSuccess();
      addXP(30);
    } else {
      soundManager.playError();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-amber-600" />
            <span>Phòng Luyện Nói & Đối Thoại AI</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Ghi âm giọng nói, nhận diện ký tự Pinyin và đánh giá độ chuẩn xác thanh điệu
          </p>
        </div>

        {/* Navigation scenarios */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-400">
            Kịch bản {scenarioIndex + 1} / {scenarios.length}
          </span>
          <button
            onClick={() => {
              setTranscript("");
              setFeedback(null);
              setScenarioIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={scenarioIndex === 0}
            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setTranscript("");
              setFeedback(null);
              setScenarioIndex((prev) => Math.min(scenarios.length - 1, prev + 1));
            }}
            disabled={scenarioIndex === scenarios.length - 1}
            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Roleplay Context Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {currentScenario.topicVn}
            </span>
            <h2 className="text-lg font-bold text-stone-900 mt-2">
              {currentScenario.title}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Bối cảnh: {currentScenario.context}
            </p>
          </div>
        </div>

        {/* AI Dialogue Box */}
        <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold font-hanzi">
                AI
              </div>
              <span className="text-xs font-bold text-stone-800">
                {currentScenario.roleAi}
              </span>
            </div>
            <button
              onClick={playAiMessage}
              className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100/70 hover:bg-amber-100 px-2.5 py-1 rounded-lg font-semibold transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe câu thoại</span>
            </button>
          </div>

          <div className="font-hanzi text-xl font-bold text-stone-900">
            {currentScenario.initialAiMessage}
          </div>
          <div className="font-mono text-xs text-amber-800">
            {currentScenario.initialPinyin}
          </div>
          <div className="text-xs text-stone-600 italic">
            Dịch: &ldquo;{currentScenario.initialMeaningVn}&rdquo;
          </div>
        </div>

        {/* Target Response Selected */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Chọn câu gợi ý bạn muốn luyện nói:
            </span>
            <button
              onClick={playTargetPhrase}
              className="text-xs text-amber-700 font-semibold flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe mẫu phát âm</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {currentScenario.suggestedPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundManager.playClick();
                  setActivePhraseIndex(idx);
                  setTranscript("");
                  setFeedback(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activePhraseIndex === idx
                    ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300/40"
                    : "bg-white border-stone-200 hover:bg-stone-50"
                }`}
              >
                <div className="font-hanzi text-base font-bold text-stone-900">
                  {phrase.zh}
                </div>
                <div className="font-mono text-xs text-amber-800 mt-0.5">
                  {phrase.pinyin}
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  {phrase.vn}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Microphone Recording Area */}
        <div className="pt-4 border-t border-stone-100 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={isRecording ? stopRecord : startRecord}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
              isRecording
                ? "bg-red-500 text-white animate-pulse ring-8 ring-red-200"
                : "bg-amber-600 hover:bg-amber-700 text-white hover:scale-105"
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <span className="text-xs font-semibold text-stone-600">
            {isRecording ? "Đang lắng nghe giọng của bạn..." : "Bấm micro để bắt đầu nói"}
          </span>

          {/* User's spoken transcript */}
          {transcript && (
            <div className="w-full bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Kết Quả Nhận Diện Giọng Nói
              </span>
              <div className="font-hanzi text-xl font-bold text-stone-900">
                {transcript}
              </div>

              {!feedback && (
                <button
                  onClick={analyzeSpeech}
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-2xs mt-2"
                >
                  Đánh Giá & Chấm Điểm Phát Âm
                </button>
              )}
            </div>
          )}

          {/* Detailed Feedback Report */}
          {feedback && (
            <div className="w-full p-5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-bold text-stone-900">
                    Báo Cáo Điểm Phát Âm
                  </span>
                </div>
                <span className="text-xl font-extrabold text-amber-700">
                  {feedback.accuracy}%
                </span>
              </div>

              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${feedback.accuracy}%` }}
                />
              </div>

              <p className="text-stone-700 font-medium">
                {feedback.feedbackVn}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/50 text-[11px] text-stone-600">
                <div>
                  Ký tự khớp chuẩn: <b>{feedback.matchedChars} / {feedback.totalChars}</b>
                </div>
                <div>
                  Khen thưởng: <b>+{feedback.accuracy >= 70 ? 30 : 10} XP</b>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
