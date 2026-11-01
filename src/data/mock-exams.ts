import { ExamQuestion } from "@/types";

export interface MockExamManifest {
  hskLevel: number;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  maxScore: number;
  passingScore: number;
  sections: {
    name: 'listening' | 'reading' | 'writing';
    titleVn: string;
    questionCount: number;
    maxScore: number;
  }[];
}

export const EXAM_MANIFESTS: Record<number, MockExamManifest> = {
  1: {
    hskLevel: 1,
    title: "HSK 1 - Đề Thi Mô Phỏng Tiêu Chuẩn (Mã đề: H11003)",
    durationMinutes: 35,
    totalQuestions: 10,
    maxScore: 200,
    passingScore: 120,
    sections: [
      { name: "listening", titleVn: "Phần 1: Nghe Hiểu (听力)", questionCount: 5, maxScore: 100 },
      { name: "reading", titleVn: "Phần 2: Đọc Hiểu (阅读)", questionCount: 5, maxScore: 100 },
    ],
  },
  2: {
    hskLevel: 2,
    title: "HSK 2 - Đề Thi Mô Phỏng Toàn Diện (Mã đề: H21004)",
    durationMinutes: 50,
    totalQuestions: 12,
    maxScore: 200,
    passingScore: 120,
    sections: [
      { name: "listening", titleVn: "Phần 1: Nghe Hiểu (听力)", questionCount: 6, maxScore: 100 },
      { name: "reading", titleVn: "Phần 2: Đọc Hiểu (阅读)", questionCount: 6, maxScore: 100 },
    ],
  },
  3: {
    hskLevel: 3,
    title: "HSK 3 - Đề Thi Chuẩn Hóa Quốc Tế (Mã đề: H31005)",
    durationMinutes: 85,
    totalQuestions: 15,
    maxScore: 300,
    passingScore: 180,
    sections: [
      { name: "listening", titleVn: "Phần 1: Nghe Hiểu (听力)", questionCount: 5, maxScore: 100 },
      { name: "reading", titleVn: "Phần 2: Đọc Hiểu (阅读)", questionCount: 5, maxScore: 100 },
      { name: "writing", titleVn: "Phần 3: Viết & Sắp xếp câu (书写)", questionCount: 5, maxScore: 100 },
    ],
  },
};

export const MOCK_EXAM_QUESTIONS: ExamQuestion[] = [
  // --- HSK 1 - LISTENING ---
  {
    id: "q-hsk1-l-01",
    hskLevel: 1,
    section: "listening",
    partNumber: 1,
    questionNumber: 1,
    questionType: "single_choice",
    promptAudioText: "下午我想去商店买一个大苹果。",
    promptZh: "听录音，选择听到的物品：(Nghe đoạn ghi âm, chọn đồ vật được nhắc đến)",
    options: ["香蕉 (Xiāngjiāo)", "苹果 (Píngguǒ)", "西瓜 (Xīguā)", "米饭 (Mǐfàn)"],
    correctAnswer: "苹果 (Píngguǒ)",
    points: 20,
    explanationVn: "Đoạn ghi âm phát: '买一个大苹果' (Mua một quả táo to).",
  },
  {
    id: "q-hsk1-l-02",
    hskLevel: 1,
    section: "listening",
    partNumber: 1,
    questionNumber: 2,
    questionType: "true_false",
    promptAudioText: "我爸爸是医生，他在医院工作。",
    promptZh: "判断对错 (Đúng hay Sai): 他爸爸在学校工作。",
    options: ["正确 (Đúng)", "错误 (Sai)"],
    correctAnswer: "错误 (Sai)",
    points: 20,
    explanationVn: "Đoạn ghi âm nói bố làm việc ở bệnh viện (在医院工作), nhưng câu hỏi lại ghi ở trường học (在学校工作), do đó câu hỏi là Sai.",
  },
  {
    id: "q-hsk1-l-03",
    hskLevel: 1,
    section: "listening",
    partNumber: 2,
    questionNumber: 3,
    questionType: "single_choice",
    promptAudioText: "现在是上午十点半，我们十一点吃午饭。",
    promptZh: "他们几点吃午饭？ (Mấy giờ họ ăn trưa?)",
    options: ["10:00", "10:30", "11:00", "11:30"],
    correctAnswer: "11:00",
    points: 20,
    explanationVn: "Băng ghi âm nói rõ: '我们十一点吃午饭' (Chúng tôi 11 giờ ăn trưa).",
  },
  {
    id: "q-hsk1-l-04",
    hskLevel: 1,
    section: "listening",
    partNumber: 2,
    questionNumber: 4,
    questionType: "single_choice",
    promptAudioText: "桌子上有一本书和两杯水。",
    promptZh: "桌子上有几本书？ (Trên bàn có mấy quyển sách?)",
    options: ["一本书", "两本书", "三本书", "四本书"],
    correctAnswer: "一本书",
    points: 20,
    explanationVn: "Trong câu: '有一本书' (Có một quyển sách).",
  },
  {
    id: "q-hsk1-l-05",
    hskLevel: 1,
    section: "listening",
    partNumber: 2,
    questionNumber: 5,
    questionType: "single_choice",
    promptAudioText: "对不起，我今天太忙了，明天再去你家吧。",
    promptZh: "说话人今天为什么不去朋友家？ (Tại sao hôm nay người nói không đến nhà bạn?)",
    options: ["生病了", "今天太忙了", "没有车", "天气不好"],
    correctAnswer: "今天太忙了",
    points: 20,
    explanationVn: "Lý do trực tiếp: '我今天太忙了' (Hôm nay tôi bận quá).",
  },

  // --- HSK 1 - READING ---
  {
    id: "q-hsk1-r-01",
    hskLevel: 1,
    section: "reading",
    partNumber: 1,
    questionNumber: 6,
    questionType: "matching",
    promptZh: "Chọn từ thích hợp điền vào chỗ trống: 他是我的好____。",
    options: ["朋友 (péngyou)", "电脑 (diànnǎo)", "昨天 (zuótiān)", "天气 (tiānqì)"],
    correctAnswer: "朋友 (péngyou)",
    points: 20,
    explanationVn: "Cụm danh từ '好朋友' (bạn tốt) là cách kết hợp tự nhiên và chính xác nhất.",
  },
  {
    id: "q-hsk1-r-02",
    hskLevel: 1,
    section: "reading",
    partNumber: 1,
    questionNumber: 7,
    questionType: "single_choice",
    promptZh: "Đọc câu sau và chọn đại từ nghi vấn thích hợp: 你在____工作？",
    options: ["哪儿 (nǎr)", "谁 (shéi)", "什么 (shénme)", "多少 (duōshao)"],
    correctAnswer: "哪儿 (nǎr)",
    points: 20,
    explanationVn: "Hỏi địa điểm làm việc: '你在哪儿工作？' (Bạn làm việc ở đâu?).",
  },
  {
    id: "q-hsk1-r-03",
    hskLevel: 1,
    section: "reading",
    partNumber: 2,
    questionNumber: 8,
    questionType: "single_choice",
    promptZh: "Chọn nghĩa tiếng Việt chính xác của câu: '外面下雨了，很冷。'",
    options: [
      "Bên ngoài đang mưa, rất lạnh.",
      "Bên ngoài có tuyết rơi, rất đẹp.",
      "Bên ngoài trời nắng gắt, rất nóng.",
      "Bên ngoài gió to, mau vào nhà.",
    ],
    correctAnswer: "Bên ngoài đang mưa, rất lạnh.",
    points: 20,
    explanationVn: "下雨 (xiàyǔ) = trời mưa; 很冷 (hěn lěng) = rất lạnh.",
  },
  {
    id: "q-hsk1-r-04",
    hskLevel: 1,
    section: "reading",
    partNumber: 2,
    questionNumber: 9,
    questionType: "single_choice",
    promptZh: "Chọn lượng từ thích hợp: 我买了一____衣服。",
    options: ["件 (jiàn)", "个 (gè)", "本 (běn)", "只 (zhī)"],
    correctAnswer: "件 (jiàn)",
    points: 20,
    explanationVn: "Lượng từ dùng cho quần áo là '件' (jiàn).",
  },
  {
    id: "q-hsk1-r-05",
    hskLevel: 1,
    section: "reading",
    partNumber: 2,
    questionNumber: 10,
    questionType: "single_choice",
    promptZh: "Chọn câu sắp xếp đúng trật tự từ: (1) 汉语 (2) 学习 (3) 我 (4) 在学校",
    options: [
      "我在学校学习汉语。",
      "我学习汉语在学校。",
      "在学校我汉语学习。",
      "学习汉语我在学校。",
    ],
    correctAnswer: "我在学校学习汉语。",
    points: 20,
    explanationVn: "Quy tắc ngữ pháp tiếng Hán: Chủ ngữ (我) + Trạng ngữ chỉ nơi chốn (在学校) + Động từ (学习) + Tân ngữ (汉语).",
  },
];
