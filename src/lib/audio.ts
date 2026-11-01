// ====================================================================
// MANDARIN SPEECH & AUDIO ENGINE
// Web Speech API Synthesis (TTS) & Recognition (STT)
// ====================================================================

export interface SpeechOptions {
  rate?: number; // 0.75, 1.0, 1.25
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class AudioEngine {
  private synth: SpeechSynthesis | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize high-quality Mandarin voices (e.g., Google 普通话, Microsoft Xiaoxiao, Yaoyao, Tingting, Li-Mu)
    const zhVoices = voices.filter(
      (v) => v.lang === "zh-CN" || v.lang === "zh" || v.lang.startsWith("zh")
    );
    this.preferredVoice =
      zhVoices.find((v) => v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Xiaoxiao")) ||
      zhVoices[0] ||
      null;
  }

  speak(text: string, options: SpeechOptions = {}) {
    if (typeof window === "undefined" || !this.synth) {
      console.warn("SpeechSynthesis not supported in this browser.");
      return;
    }

    // Cancel current speaking if any
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    } else {
      this.initVoice();
      if (this.preferredVoice) utterance.voice = this.preferredVoice;
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Speech Recognition (STT for speaking practice)
  createRecognition(
    onResult: (transcript: string) => void,
    onError: (err: unknown) => void,
    onEnd: () => void
  ) {
    if (typeof window === "undefined") return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecConstructor) {
      console.warn("SpeechRecognition API not available in this browser.");
      return null;
    }

    const recognition = new SpeechRecConstructor();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      onResult(finalTranscript.trim());
    };

    recognition.onerror = onError;
    recognition.onend = onEnd;

    return recognition;
  }
}

export const audioEngine = new AudioEngine();

// Evaluate pronunciation similarity between expected text and user speech
export function evaluatePronunciation(expected: string, actual: string) {
  const cleanExp = expected.replace(/[^\u4e00-\u9fa5]/g, "");
  const cleanAct = actual.replace(/[^\u4e00-\u9fa5]/g, "");

  if (!cleanAct || !cleanExp) {
    return {
      score: 0,
      accuracy: 0,
      matchedChars: 0,
      totalChars: cleanExp.length,
      feedbackVn: "Chưa nhận diện được giọng nói rõ ràng. Hãy thử nói to và chậm hơn.",
    };
  }

  let matches = 0;
  for (let i = 0; i < cleanExp.length; i++) {
    if (cleanAct.includes(cleanExp[i])) {
      matches++;
    }
  }

  const accuracy = Math.min(100, Math.round((matches / cleanExp.length) * 100));

  let feedbackVn = "";
  if (accuracy >= 90) {
    feedbackVn = "Phát âm rất xuất sắc! Độ chuẩn xác cao, thanh điệu tự nhiên.";
  } else if (accuracy >= 70) {
    feedbackVn = "Phát âm tốt! Cần chú ý thêm về thanh điệu và sự liền mạch của câu.";
  } else if (accuracy >= 40) {
    feedbackVn = "Khá ổn, một vài âm tiết và thanh điệu chưa chuẩn xác. Hãy nghe lại và thử lại.";
  } else {
    feedbackVn = "Cần luyện tập thêm. Hãy nghe kỹ mẫu giọng chuẩn và nói chậm từng âm tiết.";
  }

  return {
    score: accuracy,
    accuracy,
    matchedChars: matches,
    totalChars: cleanExp.length,
    feedbackVn,
  };
}
