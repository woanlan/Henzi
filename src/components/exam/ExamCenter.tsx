"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { EXAM_MANIFESTS, MOCK_EXAM_QUESTIONS } from "@/data/mock-exams";
import { audioEngine } from "@/lib/audio";
import { soundManager, formatSecondsToMinutes } from "@/lib/utils";
import {
  FileCheck,
  Clock,
  Volume2,
  CheckCircle,
  XCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Play,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export function ExamCenter() {
  const { currentHskLevel, audioSpeed, addXP } = useApp();
  const manifest = EXAM_MANIFESTS[currentHskLevel] || EXAM_MANIFESTS[1];
  const questions = MOCK_EXAM_QUESTIONS.filter((q) => q.hskLevel === currentHskLevel);

  // Exam states: "idle" | "in_progress" | "submitted"
  const [examState, setExamState] = useState<"idle" | "in_progress" | "submitted">("idle");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(manifest.durationMinutes * 60);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examState === "in_progress" && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeRemainingSeconds]);

  const startExam = () => {
    soundManager.playClick();
    setExamState("in_progress");
    setAnswers({});
    setCurrentQuestionIdx(0);
    setTimeRemainingSeconds(manifest.durationMinutes * 60);
  };

  const selectAnswer = (questionId: string, answer: string) => {
    soundManager.playClick();
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitExam = () => {
    setExamState("submitted");
    soundManager.playFanfare();
    addXP(100);
  };

  const currentQ = questions[currentQuestionIdx] || questions[0];

  // Score calculation
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let listeningScore = 0;
  let readingScore = 0;

  if (examState === "submitted") {
    questions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) {
        totalScore += q.points;
        correctCount += 1;
        if (q.section === "listening") listeningScore += q.points;
        if (q.section === "reading") readingScore += q.points;
      } else {
        incorrectCount += 1;
      }
    });
  }

  const isPassed = totalScore >= manifest.passingScore;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title & Official Notice */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <span>Trung Tâm Thi Thử HSK {currentHskLevel} Bấm Giờ</span>
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Mô phỏng kỳ thi HSK chuẩn hóa quốc tế với đề thi phân mục Nghe Hiểu & Đọc Hiểu
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Thời gian: {manifest.durationMinutes} phút</span>
          </div>
        </div>

        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <b>Lưu ý giáo dục:</b> Đây là hệ thống thi thử mô phỏng giáo trình chuẩn HANZI MASTER nhằm phục vụ luyện tập kỹ năng làm bài, không thay thế chứng chỉ thi HSK chính thức tại các điểm thi Hanban.
          </span>
        </div>
      </div>

      {/* STATE 1: IDLE / INTRO */}
      {examState === "idle" && (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300">
            <FileCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-stone-900">
              {manifest.title}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Bài thi gồm {manifest.totalQuestions} câu hỏi. Thí sinh cần đạt tối thiểu <b>{manifest.passingScore} / {manifest.maxScore} điểm</b> để vượt qua cấp độ HSK {currentHskLevel}.
            </p>
          </div>

          {/* Section details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left">
            {manifest.sections.map((sec, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-stone-900 block">{sec.titleVn}</span>
                <span className="text-stone-500 block">Số lượng: {sec.questionCount} câu</span>
                <span className="text-amber-700 font-semibold block">Tối đa: {sec.maxScore} điểm</span>
              </div>
            ))}
          </div>

          <button
            onClick={startExam}
            className="px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-md hover:scale-105 inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Bắt Đầu Làm Bài Thi Ngay</span>
          </button>
        </div>
      )}

      {/* STATE 2: IN PROGRESS */}
      {examState === "in_progress" && (
        <div className="space-y-6">
          {/* Top Exam Bar: Timer & Progress */}
          <div className="sticky top-20 z-40 bg-stone-900 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded">
                Câu {currentQuestionIdx + 1} / {questions.length}
              </span>
              <span className="text-xs font-medium text-stone-300 hidden sm:inline">
                Phần: {currentQ.section === "listening" ? "听力 (Nghe Hiểu)" : "阅读 (Đọc Hiểu)"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-amber-400">
                <Clock className="w-4 h-4" />
                <span>{formatSecondsToMinutes(timeRemainingSeconds)}</span>
              </div>
              <button
                onClick={submitExam}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Nộp Bài Sớm
              </button>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Câu hỏi số {currentQ.questionNumber} ({currentQ.points} điểm)
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                {currentQ.section}
              </span>
            </div>

            {/* Audio player if listening question */}
            {currentQ.section === "listening" && currentQ.promptAudioText && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Băng ghi âm câu hỏi (Nhấn để nghe)
                  </span>
                  <span className="text-xs text-amber-950 font-medium">
                    Hãy lắng nghe kỹ và chọn đáp án chính xác
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    audioEngine.speak(currentQ.promptAudioText!, { rate: audioSpeed });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Phát Đoạn Băng</span>
                </button>
              </div>
            )}

            {/* Prompt text */}
            <div className="font-hanzi text-lg sm:text-xl font-bold text-stone-900 leading-relaxed">
              {currentQ.promptZh}
            </div>

            {/* Options */}
            {currentQ.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(currentQ.id, opt)}
                      className={`p-4 rounded-xl border text-sm text-left transition-all font-hanzi flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-100 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-300/40"
                          : "bg-stone-50 border-stone-200/90 hover:bg-stone-100 text-stone-800"
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-amber-700" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Navigation between questions */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-100">
              <button
                onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIdx === 0}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-40"
              >
                ← Câu Trước
              </button>

              {currentQuestionIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                  className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
                >
                  Câu Kế Tiếp →
                </button>
              ) : (
                <button
                  onClick={submitExam}
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Nộp Bài Thi
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: SUBMITTED REPORT */}
      {examState === "submitted" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Result Banner */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center space-y-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
                isPassed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}
            >
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-stone-900">
                {isPassed ? "Chúc Mừng! Bạn Đã Đỗ Kỳ Thi" : "Chưa Đạt Điểm Qua! Cần Cố Gắng Hơn"}
              </h2>
              <p className="text-xs text-stone-500">
                Kết quả bài thi mô phỏng tiêu chuẩn HSK {currentHskLevel}
              </p>
            </div>

            {/* Big Score Card */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 max-w-sm mx-auto">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Tổng Điểm Đạt Được
              </span>
              <div className="text-5xl font-extrabold text-amber-700 my-1 font-mono">
                {totalScore} <span className="text-lg text-stone-400 font-normal">/ {manifest.maxScore}</span>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                  isPassed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                }`}
              >
                {isPassed ? "ĐẠT CHUẨN (PASSED)" : "KHÔNG ĐẠT (FAILED)"}
              </span>
            </div>

            {/* Score Breakdown by Section */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Nghe Hiểu (听力):</span>
                <span className="font-bold text-stone-900 text-base">{listeningScore} / 100</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Đọc Hiểu (阅读):</span>
                <span className="font-bold text-stone-900 text-base">{readingScore} / 100</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={startExam}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-2xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm Lại Đề Thi Này</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Chi Tiết Từng Câu Hỏi & Lời Giải Thích
            </h3>

            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect ? "bg-emerald-50/50 border-emerald-200" : "bg-red-50/50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">
                        Câu {idx + 1}: {q.promptZh}
                      </span>
                      {isCorrect ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Đúng (+{q.points}đ)
                        </span>
                      ) : (
                        <span className="text-red-700 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Sai (0đ)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-stone-700 pt-1">
                      <div>Đáp án của bạn: <b className="font-hanzi">{userAns || "Chưa chọn"}</b></div>
                      <div>Đáp án đúng: <b className="font-hanzi text-emerald-800">{q.correctAnswer}</b></div>
                    </div>

                    <p className="text-stone-600 italic pt-1 border-t border-stone-200/50">
                      → Giải thích: {q.explanationVn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
