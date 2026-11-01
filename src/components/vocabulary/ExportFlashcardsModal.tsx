"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { VocabularyItem } from "@/types";
import { soundManager } from "@/lib/utils";
import {
  X,
  Download,
  Printer,
  FileText,
  Sparkles,
  Check,
  Copy,
  BookOpen,
} from "lucide-react";

interface ExportFlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabItems: VocabularyItem[];
}

export function ExportFlashcardsModal({
  isOpen,
  onClose,
  vocabItems,
}: ExportFlashcardsModalProps) {
  const { currentHskLevel } = useApp();
  const [activeTab, setActiveTab] = useState<"anki" | "print" | "json">("anki");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate Anki Tab-delimited text
  const generateAnkiText = () => {
    return vocabItems
      .map((item) => {
        const front = `<div style="font-size: 40px; font-weight: bold; text-align: center;">${item.simplified}</div>`;
        const ex = item.examples?.[0];
        const exHtml = ex
          ? `<hr style="margin: 12px 0; border: none; border-top: 1px dashed #ccc;" /><div style="font-size: 15px; color: #1e3a8a;">${ex.sentenceZh}</div><div style="font-size: 13px; color: #4b5563;">${ex.sentencePinyin}</div><div style="font-size: 13px; color: #374151;">${ex.sentenceVn}</div>`
          : "";
        const back = `<div style="text-align: center;"><div style="font-size: 20px; color: #d97706; font-weight: bold;">[${item.pinyin}]</div><div style="font-size: 18px; margin-top: 8px;"><b>${item.meaningVn}</b></div><div style="font-size: 14px; color: #6b7280; margin-top: 4px;">(${item.partOfSpeech})</div>${exHtml}</div>`;
        const tags = `HSK${item.hskLevel} HanziMaster`;
        return `${front}\t${back}\t${tags}`;
      })
      .join("\n");
  };

  const ankiData = generateAnkiText();

  // Download Anki file
  const handleDownloadAnki = () => {
    soundManager.playSuccess();
    const blob = new Blob([ankiData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Hanzi_Master_HSK${currentHskLevel}_Anki_Deck.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download JSON
  const handleDownloadJSON = () => {
    soundManager.playSuccess();
    const jsonStr = JSON.stringify(vocabItems, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Hanzi_Master_HSK${currentHskLevel}_Vocab.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAnki = () => {
    navigator.clipboard.writeText(ankiData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900">
                Xuất Dữ Liệu Anki & In Thẻ Giấy Flashcard
              </h2>
              <p className="text-xs text-stone-500">
                Đồng bộ hóa {vocabItems.length} từ vựng sang ứng dụng Anki hoặc in thẻ học cầm tay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab("anki")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "anki"
                ? "border-amber-600 text-amber-900 bg-white rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            Định Dạng Anki (.txt / CSV)
          </button>
          <button
            onClick={() => setActiveTab("print")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "print"
                ? "border-amber-600 text-amber-900 bg-white rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Dàn Trang In Thẻ Giấy (PDF)</span>
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "json"
                ? "border-amber-600 text-amber-900 bg-white rounded-t-xl"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            Xuất JSON Đầy Đủ
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: ANKI */}
          {activeTab === "anki" && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 space-y-1">
                <span className="font-bold text-amber-900 block">Hướng dẫn nhập vào Anki:</span>
                <ol className="list-decimal list-inside space-y-0.5 text-stone-700">
                  <li>Tải file <strong>.txt</strong> về máy tính bằng nút bên dưới.</li>
                  <li>Mở ứng dụng Anki (hoặc AnkiMobile / AnkiDroid) ➔ Chọn <strong>File ➔ Import</strong>.</li>
                  <li>Chọn file vừa tải, chọn bộ thẻ mục tiêu và bấm <strong>Import</strong>. Toàn bộ chữ Hán, Pinyin, và ví dụ sẽ tự động định dạng đẹp mắt!</li>
                </ol>
              </div>

              {/* Preview Box */}
              <div className="space-y-1">
                <span className="font-bold text-stone-700 block">Xem trước dữ liệu (Tab-separated):</span>
                <textarea
                  readOnly
                  value={ankiData}
                  rows={8}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px] text-stone-600 select-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleCopyAnki}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Đã chép" : "Sao chép"}</span>
                </button>
                <button
                  onClick={handleDownloadAnki}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Cho Anki (.txt)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PRINT FLASHCARD */}
          {activeTab === "print" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Dàn trang 2 mặt chuẩn để in ra giấy A4 và cắt rời thành bộ thẻ học cầm tay.
                </p>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Thẻ Ngay / Xuất PDF</span>
                </button>
              </div>

              {/* Printable Grid Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 print:grid-cols-3">
                {vocabItems.slice(0, 9).map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl border-2 border-dashed border-stone-300 bg-white flex flex-col justify-between h-36 text-center shadow-2xs"
                  >
                    <span className="font-hanzi text-3xl font-black text-stone-900 block pt-1">
                      {v.simplified}
                    </span>
                    <div className="space-y-0.5 border-t border-stone-100 pt-1">
                      <span className="font-mono text-xs font-bold text-amber-700 block">
                        [{v.pinyin}]
                      </span>
                      <span className="text-xs font-bold text-stone-800 block truncate">
                        {v.meaningVn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: JSON */}
          {activeTab === "json" && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-600">
                Toàn bộ dữ liệu {vocabItems.length} từ vựng chuẩn JSON bao gồm từ loại, câu ví dụ và âm thanh.
              </p>
              <textarea
                readOnly
                value={JSON.stringify(vocabItems, null, 2)}
                rows={10}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px] text-stone-600 select-all"
              />
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleDownloadJSON}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File JSON</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
