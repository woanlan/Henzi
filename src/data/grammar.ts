import { GrammarTopic } from "@/types";

export const GRAMMAR_DATA: GrammarTopic[] = [
  // --- HSK 1 ---
  {
    id: "gram-hsk1-001",
    hskLevel: 1,
    title: "Câu chữ 是 (Shì) - Phán đoán & Khẳng định",
    titleVn: "Cấu trúc: Chủ ngữ + 是 + Danh từ",
    pattern: "S + 是 + N (Phủ định: S + 不是 + N)",
    explanationVn: "Dùng để biểu thị quan hệ đồng nhất hoặc quy thuộc, tương đương với từ 'là' trong tiếng Việt. Khi phủ định, đặt phó từ '不' (bù) ngay trước '是'.",
    usageConditions: "Chỉ dùng để nối hai danh từ hoặc đại từ. KHÔNG dùng '是' trước tính từ (Ví dụ sai: *我是很高, câu đúng: 我很高).",
    commonMistakes: "Người Việt hay nhầm lẫn đặt '是' trước tính từ: Nói '他是一个很帅' thay vì '他很帅'.",
    comparison: "So sánh với 在 (ở) chỉ vị trí và 有 (có) chỉ sự sở hữu tồn tại.",
    searchKeywords: ["shi", "la", "cau chu shi", "khang dinh", "phu dinh"],
    examples: [
      {
        id: "gex-1",
        sentenceZh: "我是越南人。",
        sentencePinyin: "Wǒ shì Yuènán rén.",
        sentenceVn: "Tôi là người Việt Nam.",
        analysisNotes: "S (我) + 是 + N (越南人)",
      },
      {
        id: "gex-2",
        sentenceZh: "他不是我的老师。",
        sentencePinyin: "Tā bú shì wǒ de lǎoshī.",
        sentenceVn: "Thầy ấy không phải là giáo viên của tôi.",
        analysisNotes: "Phủ định: 不是 (bú shì - lưu ý biến điệu thanh 2 của 不)",
      },
    ],
    exercises: [
      {
        question: "Chọn câu đúng ngữ pháp diễn đạt: 'Cô ấy không phải là bác sĩ':",
        options: [
          "她不是医生。",
          "她没是医生。",
          "她是不医生。",
          "她是医生不。",
        ],
        correctIndex: 0,
        explanation: "Phủ định của '是' luôn là '不是' (bú shì).",
      },
    ],
  },
  {
    id: "gram-hsk1-002",
    hskLevel: 1,
    title: "Trợ từ nghi vấn 吗 (Ma) - Câu hỏi Có / Không",
    titleVn: "Cấu trúc câu hỏi: Câu trần thuật + 吗?",
    pattern: "Câu khẳng định / phủ định + 吗?",
    explanationVn: "Dùng đặt ở cuối câu trần thuật để biến câu đó thành câu hỏi nghi vấn '... có phải không?' hoặc '... không?'",
    usageConditions: "Trong câu đã có đại từ nghi vấn (như 谁 ai, 什么 cái gì, 哪 ở đâu) thì TUYỆT ĐỐI không dùng 吗 nữa.",
    commonMistakes: "*你是谁吗? (Sai nghiêm trọng vì đã có 谁 lại thêm 吗. Câu đúng: 你是谁?).",
    comparison: "Khác với 呢 (ne) dùng để hỏi ngược lại lửng lơ hoặc hỏi vị trí.",
    searchKeywords: ["ma", "cau hoi", "nghi van", "tro tu"],
    examples: [
      {
        id: "gex-3",
        sentenceZh: "你喜欢喝中国茶吗？",
        sentencePinyin: "Nǐ xǐhuan hē Zhōngguó chá ma?",
        sentenceVn: "Bạn có thích uống trà Trung Quốc không?",
        analysisNotes: "Câu trần thuật + 吗? tạo thành câu hỏi xác nhận.",
      },
    ],
    exercises: [
      {
        question: "Câu nào sau đây SAI ngữ pháp?",
        options: [
          "你认识他吗？",
          "这是什么东西吗？",
          "他是中国人吗？",
          "你好吗？",
        ],
        correctIndex: 1,
        explanation: "Trong câu đã có đại từ nghi vấn '什么' (cái gì) nên không được thêm '吗'.",
      },
    ],
  },

  // --- HSK 2 ---
  {
    id: "gram-hsk2-001",
    hskLevel: 2,
    title: "Phó từ 正在 (Zhèngzài) - Hành động đang tiếp diễn",
    titleVn: "Cấu trúc: Chủ ngữ + (正/在/正在) + Động từ + (呢)",
    pattern: "S + 正在 / 在 + V + O + (呢)",
    explanationVn: "Biểu thị hành động đang diễn ra tại một thời điểm nhất định (tương đương với 'đang ...' trong tiếng Việt).",
    usageConditions: "Phủ định dùng '没在' (méi zài) chứ không dùng '不在'.",
    commonMistakes: "*我正在看书不 (Sai, phủ định phải nói: 我没在看书).",
    comparison: "着 (zhe) biểu thị trạng thái đang duy trì, còn 正在 nhấn mạnh hành động đang diễn ra.",
    searchKeywords: ["dang", "dang lam gi", "zhengzai", "hien tai tiep dien"],
    examples: [
      {
        id: "gex-4",
        sentenceZh: "他正在准备明天的考试呢。",
        sentencePinyin: "Tā zhèngzài zhǔnbèi míngtiān de kǎoshì ne.",
        sentenceVn: "Cậu ấy đang chuẩn bị cho kỳ thi ngày mai đấy.",
        analysisNotes: "正在 + 准备 (Động từ) + 呢 (Trợ từ cuối câu ngữ khí sinh động)",
      },
    ],
  },

  // --- HSK 3 ---
  {
    id: "gram-hsk3-001",
    hskLevel: 3,
    title: "Câu chữ 把 (Bǎ) - Câu xử lý đối tượng",
    titleVn: "Cấu trúc: Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác",
    pattern: "S + 把 + O + V + Kết quả / Xu hướng / 了",
    explanationVn: "Dùng để nhấn mạnh sự tác động, xử lý của chủ ngữ lên tân ngữ, làm cho tân ngữ có sự thay đổi vị trí, trạng thái hoặc kết quả.",
    usageConditions: "Tân ngữ sau '把' phải là đối tượng đã được xác định cụ thể (người nghe và người nói đều biết). Động từ không thể đứng trơ trọi một mình mà phải có bổ ngữ hoặc '了'.",
    commonMistakes: "*我把书看 (Sai vì động từ '看' đứng trơ trọi. Đúng: 我把书看完了).",
    comparison: "Đối lập với câu chữ 被 (bèi) biểu thị bị động.",
    searchKeywords: ["ba", "cau chu ba", "cau xu ly", "ngu phap hsk3"],
    examples: [
      {
        id: "gex-5",
        sentenceZh: "请把这杯水喝了。",
        sentencePinyin: "Qǐng bǎ zhè bēi shuǐ hē le.",
        sentenceVn: "Xin hãy uống cốc nước này đi.",
        analysisNotes: "把 + 这杯水 (Tân ngữ xác định) + 喝 (Động từ) + 了 (Kết quả xử lý)",
      },
    ],
    exercises: [
      {
        question: "Sắp xếp lại câu đúng ngữ pháp câu chữ 把:",
        options: [
          "请把门关上。",
          "请门把关上。",
          "请把关上门。",
          "把门请关上。",
        ],
        correctIndex: 0,
        explanation: "Thứ tự chuẩn: Chủ ngữ/Lời mời + 把 + Tân ngữ (门) + Động từ (关) + Bổ ngữ (上).",
      },
    ],
  },

  // --- HSK 4 ---
  {
    id: "gram-hsk4-001",
    hskLevel: 4,
    title: "Liên từ 尽管...但是... (Mặc dù... nhưng...)",
    titleVn: "Cấu trúc nhượng bộ: 尽管... 但是 / 还是 / 却...",
    pattern: "尽管 + Mệnh đề điều kiện, 但是 / 却 + Mệnh đề kết quả",
    explanationVn: "Biểu thị quan hệ nhượng bộ, thừa nhận một sự thật ở vế trước nhưng kết quả ở vế sau không bị ảnh hưởng.",
    usageConditions: "Thường dùng trong văn viết và cả văn nói trang trọng.",
    commonMistakes: "Dùng trùng lặp cả '虽然' và '尽管' trong cùng một câu.",
    comparison: "Tương đồng với 虽然...但是... nhưng 尽管 mang ngữ khí khẳng định hiện thực dứt khoát hơn.",
    searchKeywords: ["jinguan", "danshi", "mac du", "nhuong bo"],
    examples: [
      {
        id: "gex-6",
        sentenceZh: "尽管路上堵车，他还是准时到了公司。",
        sentencePinyin: "Jǐnguǎn lùshang dǔchē, tā háishì zhǔnshí dào le gōngsī.",
        sentenceVn: "Mặc dù trên đường kẹt xe, anh ấy vẫn đến công ty đúng giờ.",
        analysisNotes: "尽管 + Tình huống kẹt xe, 还是 (vẫn) + Đến đúng giờ.",
      },
    ],
  },
];
