"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { soundManager } from "@/lib/utils";
import { VocabularyItem } from "@/types";
import {
  ShieldAlert,
  Users,
  BookOpen,
  Zap,
  GraduationCap,
  FileCheck,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  Search,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export function AdminDashboard() {
  const { user, vocabulary, currentHskLevel } = useApp();
  const [activeTab, setActiveTab] = useState<"vocab" | "grammar" | "users" | "exams">("vocab");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New word form state
  const [newChar, setNewChar] = useState("");
  const [newPinyin, setNewPinyin] = useState("");
  const [newMeaningVn, setNewMeaningVn] = useState("");
  const [newLevel, setNewLevel] = useState<number>(currentHskLevel);
  const [successMsg, setSuccessMsg] = useState("");

  const filteredWords = vocabulary.filter((w) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      w.simplified.includes(q) ||
      w.pinyin.toLowerCase().includes(q) ||
      w.meaningVn.toLowerCase().includes(q)
    );
  });

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChar.trim() || !newPinyin.trim() || !newMeaningVn.trim()) return;

    soundManager.playSuccess();
    setSuccessMsg(`Đã thêm thành công từ vựng "${newChar}" vào kho dữ liệu HSK ${newLevel}!`);
    setNewChar("");
    setNewPinyin("");
    setNewMeaningVn("");
    setShowAddModal(false);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const sampleUsers = [
    { id: "u-1", name: "Nguyễn Minh Châu", email: "hocvien@hanzimaster.edu.vn", role: "Học viên", streak: 7, xp: 1450, level: "HSK 1" },
    { id: "u-2", name: "Cô Trương Mỹ Linh", email: "linh.truong@hanzimaster.edu.vn", role: "Giáo viên", streak: 45, xp: 8200, level: "HSK 6" },
    { id: "u-3", name: "Lê Hoàng Long", email: "long.le@gmail.com", role: "Học viên", streak: 12, xp: 2100, level: "HSK 2" },
    { id: "u-4", name: "Trần Quản Trị", email: "admin@hanzimaster.edu.vn", role: "Quản trị viên", streak: 90, xp: 15400, level: "HSK 6" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Khu Vực Quản Trị Hệ Thống</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-stone-900 mt-2">
            Bảng Điều Khiển Quản Trị Viên (Admin Center)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Quản lý giáo trình HSK 1–6, từ vựng, ngữ pháp, ngân hàng đề thi và học viên
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveTab("vocab")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "vocab" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Từ Vựng ({vocabulary.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "users" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Người Dùng ({sampleUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "exams" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Đề Thi HSK
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. VOCABULARY MANAGEMENT */}
      {activeTab === "vocab" && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm từ vựng..."
                className="w-full px-4 py-2 pl-9 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabulary, null, 2));
                  const downloadAnchor = document.createElement("a");
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `hsk_curriculum_export.json`);
                  downloadAnchor.click();
                }}
                className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất JSON</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Từ Mới</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Chữ Hán</th>
                  <th className="py-3 px-4">Pinyin</th>
                  <th className="py-3 px-4">Nghĩa Tiếng Việt</th>
                  <th className="py-3 px-4">Cấp độ HSK</th>
                  <th className="py-3 px-4">Độ khó</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredWords.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-hanzi font-bold text-stone-900 text-base">
                      {item.simplified}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-800">
                      {item.pinyin}
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {item.meaningVn}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        HSK {item.hskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      ★ {item.difficultyRating}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => soundManager.playClick()}
                          className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100"
                          title="Sửa từ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => soundManager.playError()}
                          className="p-1.5 text-red-400 hover:text-red-700 rounded hover:bg-red-50"
                          title="Xóa từ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. USERS MANAGEMENT */}
      {activeTab === "users" && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">
            Danh Sách Người Dùng & Học Viên Nền Tảng
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Họ và Tên</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Vai trò</th>
                  <th className="py-3 px-4">Trình độ</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4">Tổng XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sampleUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900">{u.name}</td>
                    <td className="py-3 px-4 text-stone-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === "Quản trị viên"
                          ? "bg-red-100 text-red-800"
                          : u.role === "Giáo viên"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-stone-100 text-stone-800"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-700">{u.level}</td>
                    <td className="py-3 px-4 text-orange-600 font-bold">{u.streak} ngày</td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{u.xp} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. EXAMS MANAGEMENT */}
      {activeTab === "exams" && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">
              Ngân Hàng Đề Thi HSK 1–6
            </h3>
            <button
              onClick={() => soundManager.playClick()}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Đề Thi Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[1, 2, 3, 4, 5, 6].map((lvl) => (
              <div key={lvl} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">Bộ Đề Thi HSK {lvl}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                    Chuẩn HSK 3.0
                  </span>
                </div>
                <p className="text-stone-500 text-[11px]">
                  Cấu trúc gồm 2-3 phần: Nghe Hiểu, Đọc Hiểu, Viết chữ Hán.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-stone-200/70">
                  <span className="text-stone-600 font-semibold">12 Đề khả dụng</span>
                  <button className="text-amber-700 hover:underline font-bold text-xs">
                    Quản lý đề →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-base font-bold text-stone-900">
              Thêm Từ Vựng Mới Vào Giáo Trình HSK
            </h3>

            <form onSubmit={handleCreateWord} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Chữ Hán (Giản thể):
                </label>
                <input
                  type="text"
                  required
                  value={newChar}
                  onChange={(e) => setNewChar(e.target.value)}
                  placeholder="Ví dụ: 老师"
                  className="w-full px-3 py-2 font-hanzi text-base rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Phiên âm Pinyin (có dấu):
                </label>
                <input
                  type="text"
                  required
                  value={newPinyin}
                  onChange={(e) => setNewPinyin(e.target.value)}
                  placeholder="Ví dụ: lǎoshī"
                  className="w-full px-3 py-2 font-mono text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Nghĩa Tiếng Việt:
                </label>
                <input
                  type="text"
                  required
                  value={newMeaningVn}
                  onChange={(e) => setNewMeaningVn(e.target.value)}
                  placeholder="Ví dụ: Giáo viên, thầy cô giáo"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Cấp độ HSK:
                </label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500 font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6].map((l) => (
                    <option key={l} value={l}>
                      HSK {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-2xs"
                >
                  Lưu Từ Vựng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
