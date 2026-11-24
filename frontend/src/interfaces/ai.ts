export interface IAIVocabPart {
  word: string;
  pinyin: string;
  meaningVn: string;
  partOfSpeech?: string;
}

export interface IAIUsageExample {
  zh: string;
  pinyin: string;
  vn: string;
}

export interface IAIMessageBreakdown {
  originalZh: string;
  pinyin: string;
  vietnameseTranslation: string;
  direction?: "zh_to_vn" | "vn_to_zh";
  partOfSpeech?: string;
  collocations?: string[];
  synonyms?: string[];
  antonyms?: string[];
  vocabBreakdown: IAIVocabPart[];
  grammarAnalysis: string[];
  naturalUsageExamples: IAIUsageExample[];
}

export interface IAIChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  breakdown?: IAIMessageBreakdown | null;
  timestamp: string;
}

export type AIMessageBreakdown = IAIMessageBreakdown;
export type AIChatMessage = IAIChatMessage;
