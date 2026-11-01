// ====================================================================
// HANZI MASTER - CORE TYPES & DOMAIN INTERFACES
// ====================================================================

export type HSKLevelNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  currentHskLevel: HSKLevelNumber;
  dailyGoalMinutes: number;
  dailyStreak: number;
  longestStreak: number;
  totalXp: number;
  preferredScript: 'simplified' | 'traditional';
  audioSpeed: 0.75 | 1.00 | 1.25;
  themePreference: 'light' | 'dark' | 'system';
}

export interface HSKLevelInfo {
  level: HSKLevelNumber;
  title: string;
  titleVn: string;
  description: string;
  requiredVocabCount: number;
  passingScore: number;
  maxScore: number;
  colorHex: string;
}

export interface Unit {
  id: string;
  hskLevel: HSKLevelNumber;
  unitNumber: number;
  title: string;
  titleVn: string;
  descriptionVn: string;
  iconName: string;
  estimatedHours: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  unitId: string;
  lessonNumber: number;
  title: string;
  titleVn: string;
  learningObjectives: string[];
  estimatedMinutes: number;
  vocabularyCount: number;
  grammarPointsCount: number;
  isCompleted?: boolean;
}

export interface VocabularyExample {
  id: string;
  sentenceZh: string;
  sentencePinyin: string;
  sentenceVn: string;
  sentenceEn?: string;
  audioUrl?: string;
}

export interface VocabularyItem {
  id: string;
  hskLevel: HSKLevelNumber;
  lessonId?: string;
  simplified: string;
  traditional?: string;
  pinyin: string;
  pinyinClean: string;
  meaningVn: string;
  meaningEn: string;
  partOfSpeech: string; // danh từ, động từ, tính từ, lượng từ, trợ từ, liên từ
  radical?: string;
  strokeCount?: number;
  audioUrl?: string;
  isOfficialSyllabus: boolean;
  difficultyRating: number; // 1 to 5
  examples: VocabularyExample[];
  synonyms?: string[];
  antonyms?: string[];
  userStatus?: 'learning' | 'known' | 'difficult' | 'mastered';
  inNotebook?: boolean;
}

// Spaced Repetition System (SM-2)
export interface SRSData {
  vocabularyId: string;
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewAt: string;
  lastReviewedAt?: string;
  status: 'learning' | 'known' | 'difficult' | 'mastered';
}

export interface GrammarTopic {
  id: string;
  hskLevel: HSKLevelNumber;
  title: string;
  titleVn: string;
  pattern: string;
  explanationVn: string;
  usageConditions: string;
  commonMistakes: string;
  comparison?: string;
  searchKeywords: string[];
  examples: {
    id: string;
    sentenceZh: string;
    sentencePinyin: string;
    sentenceVn: string;
    analysisNotes?: string;
  }[];
  exercises?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ListeningExercise {
  id: string;
  hskLevel: HSKLevelNumber;
  title: string;
  audioTextZh: string;
  audioPinyin: string;
  audioTranslationVn: string;
  exerciseType: 'select_correct' | 'dictation' | 'fill_blank' | 'arrange_order';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanationVn: string;
  vocabNotes?: { word: string; pinyin: string; meaning: string }[];
  grammarNotes?: string[];
}

export interface SpeakingScenario {
  id: string;
  hskLevel: HSKLevelNumber;
  topicVn: string;
  title: string;
  context: string;
  roleAi: string;
  roleUser: string;
  initialAiMessage: string;
  initialPinyin: string;
  initialMeaningVn: string;
  suggestedPhrases: { zh: string; pinyin: string; vn: string }[];
  evaluationCriteria: string[];
}

export interface WritingExercise {
  id: string;
  hskLevel: HSKLevelNumber;
  character: string;
  pinyin: string;
  meaningVn: string;
  strokeCount: number;
  radical: string;
  structure: string; // Kết cấu: Trái-Phải, Trên-Dưới, Bao bọc, Đơn thể
  strokeTypes: string[]; // Các nét: Ngang, Sổ, Phẩy, Mác, Gập
}

export interface ExamQuestion {
  id: string;
  hskLevel: HSKLevelNumber;
  section: 'listening' | 'reading' | 'writing';
  partNumber: number;
  questionNumber: number;
  questionType: 'single_choice' | 'true_false' | 'matching' | 'reorder' | 'fill_blank';
  promptZh?: string;
  promptPinyin?: string;
  promptAudioText?: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanationVn: string;
}

export interface ExamAttempt {
  id: string;
  hskLevel: HSKLevelNumber;
  scoreListening: number;
  scoreReading: number;
  scoreWriting: number;
  totalScore: number;
  isPassed: boolean;
  durationSeconds: number;
  userAnswers: Record<string, string>;
  weakAreas: { topic: string; incorrectCount: number; recommendation: string }[];
  completedAt: string;
}

export interface AIMessageBreakdown {
  originalZh: string;
  pinyin: string;
  vietnameseTranslation: string;
  vocabBreakdown: { word: string; pinyin: string; meaningVn: string; partOfSpeech?: string }[];
  grammarAnalysis: string[];
  naturalUsageExamples: { zh: string; pinyin: string; vn: string }[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  breakdown?: AIMessageBreakdown;
  timestamp: string;
}

export interface GamificationStats {
  xp: number;
  level: number;
  dailyStreak: number;
  wordsMastered: number;
  wordsReviewQueue: number;
  listeningAccuracy: number;
  speakingFluencyScore: number;
  writingCompletedCount: number;
  mockExamHighestScore: number;
  studyTimeTodayMinutes: number;
  weeklyActivity: { day: string; minutes: number; xp: number }[];
}
