"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { HSKLevelNumber, UserProfile, VocabularyItem, SRSData } from "@/types";
import { INITIAL_VOCABULARY } from "@/data/vocabulary";
import { calculateNextReview, createInitialSRS } from "@/lib/srs";
import { soundManager } from "@/lib/utils";

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentHskLevel: HSKLevelNumber;
  setCurrentHskLevel: (level: HSKLevelNumber) => void;
  vocabulary: VocabularyItem[];
  userSrsMap: Record<string, SRSData>;
  notebookIds: Set<string>;
  toggleNotebook: (vocabId: string) => void;
  recordReview: (vocabId: string, rating: number) => void;
  addXP: (amount: number) => void;
  switchRole: (role: "student" | "teacher" | "admin") => void;
  audioSpeed: 0.75 | 1.0 | 1.25;
  setAudioSpeed: (speed: 0.75 | 1.0 | 1.25) => void;
  preferredScript: "simplified" | "traditional";
  setPreferredScript: (script: "simplified" | "traditional") => void;
  stats: {
    wordsMastered: number;
    wordsLearning: number;
    wordsDifficult: number;
    reviewQueueCount: number;
  };
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  toggleAiChat: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: "user-demo-01",
  email: "hocvien@hanzimaster.edu.vn",
  fullName: "Nguyễn Minh Châu",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "student",
  currentHskLevel: 1,
  dailyGoalMinutes: 20,
  dailyStreak: 7,
  longestStreak: 14,
  totalXp: 1450,
  preferredScript: "simplified",
  audioSpeed: 1.0,
  themePreference: "light",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [currentHskLevel, setCurrentHskLevelState] = useState<HSKLevelNumber>(1);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);
  const [userSrsMap, setUserSrsMap] = useState<Record<string, SRSData>>({});
  const [notebookIds, setNotebookIds] = useState<Set<string>>(new Set(["vocab-hsk1-001", "vocab-hsk1-002"]));
  const [audioSpeed, setAudioSpeedState] = useState<0.75 | 1.0 | 1.25>(1.0);
  const [preferredScript, setPreferredScriptState] = useState<"simplified" | "traditional">("simplified");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const toggleAiChat = () => {
    soundManager.playClick();
    setIsAiChatOpen((prev) => !prev);
  };

  // Load from LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedUser = localStorage.getItem("hanzi_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedLevel = localStorage.getItem("hanzi_current_level");
      if (savedLevel) setCurrentHskLevelState(Number(savedLevel) as HSKLevelNumber);

      const savedSrs = localStorage.getItem("hanzi_srs_data");
      if (savedSrs) setUserSrsMap(JSON.parse(savedSrs));

      const savedNotebook = localStorage.getItem("hanzi_notebook");
      if (savedNotebook) setNotebookIds(new Set(JSON.parse(savedNotebook)));
    } catch {
      // Storage parsing fallback
    }
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("hanzi_user", JSON.stringify(user));
      localStorage.setItem("hanzi_current_level", currentHskLevel.toString());
      localStorage.setItem("hanzi_srs_data", JSON.stringify(userSrsMap));
      localStorage.setItem("hanzi_notebook", JSON.stringify(Array.from(notebookIds)));
    } catch {
      // Storage error fallback
    }
  }, [user, currentHskLevel, userSrsMap, notebookIds]);

  const setCurrentHskLevel = (level: HSKLevelNumber) => {
    setCurrentHskLevelState(level);
    setUser((prev) => ({ ...prev, currentHskLevel: level }));
  };

  const toggleNotebook = (vocabId: string) => {
    soundManager.playClick();
    setNotebookIds((prev) => {
      const next = new Set(prev);
      if (next.has(vocabId)) {
        next.delete(vocabId);
      } else {
        next.add(vocabId);
      }
      return next;
    });
  };

  const recordReview = (vocabId: string, rating: number) => {
    const current = userSrsMap[vocabId] || createInitialSRS(vocabId);
    const updated = calculateNextReview(current, rating);

    setUserSrsMap((prev) => ({
      ...prev,
      [vocabId]: updated,
    }));

    // Update vocabulary status
    setVocabulary((prev) =>
      prev.map((v) => (v.id === vocabId ? { ...v, userStatus: updated.status } : v))
    );

    // Award XP and play sound
    const xpBonus = rating >= 3 ? 15 : 5;
    addXP(xpBonus);
    if (rating >= 3) {
      soundManager.playSuccess();
    } else {
      soundManager.playError();
    }
  };

  const addXP = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      totalXp: prev.totalXp + amount,
    }));
  };

  const switchRole = (role: "student" | "teacher" | "admin") => {
    soundManager.playClick();
    setUser((prev) => ({
      ...prev,
      role,
      fullName:
        role === "admin"
          ? "Trần Quản Trị (Admin)"
          : role === "teacher"
          ? "Cô Trương Mỹ Linh (Giáo viên)"
          : "Nguyễn Minh Châu (Học viên)",
    }));
  };

  const setAudioSpeed = (speed: 0.75 | 1.0 | 1.25) => {
    setAudioSpeedState(speed);
    setUser((prev) => ({ ...prev, audioSpeed: speed }));
  };

  const setPreferredScript = (script: "simplified" | "traditional") => {
    setPreferredScriptState(script);
    setUser((prev) => ({ ...prev, preferredScript: script }));
  };

  // Compute stats inside useEffect to avoid unstable date evaluation during prerender
  const [stats, setStats] = useState({
    wordsMastered: 0,
    wordsLearning: 0,
    wordsDifficult: 0,
    reviewQueueCount: 0,
  });

  useEffect(() => {
    const now = new Date();
    let wordsMastered = 0;
    let wordsLearning = 0;
    let wordsDifficult = 0;
    let reviewQueueCount = 0;

    Object.values(userSrsMap).forEach((item) => {
      if (item.status === "mastered") wordsMastered++;
      else if (item.status === "difficult") wordsDifficult++;
      else wordsLearning++;

      if (new Date(item.nextReviewAt) <= now) {
        reviewQueueCount++;
      }
    });

    setStats({
      wordsMastered,
      wordsLearning,
      wordsDifficult,
      reviewQueueCount,
    });
  }, [userSrsMap]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentHskLevel,
        setCurrentHskLevel,
        vocabulary,
        userSrsMap,
        notebookIds,
        toggleNotebook,
        recordReview,
        addXP,
        switchRole,
        audioSpeed,
        setAudioSpeed,
        preferredScript,
        setPreferredScript,
        stats,
        isAiChatOpen,
        setIsAiChatOpen,
        toggleAiChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
