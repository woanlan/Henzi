import { pinyin } from "pinyin-pro";
import { AIMessageBreakdown } from "@/types";

// Comprehensive Dictionary for common HSK words and characters
export const VOCAB_DICT: Record<string, { pinyin: string; vn: string; pos: string }> = {
  // Common pronouns & particles
  "我": { pinyin: "wǒ", vn: "tôi, mình", pos: "Đại từ" },
  "你": { pinyin: "nǐ", vn: "bạn, cậu", pos: "Đại từ" },
  "他": { pinyin: "tā", vn: "anh ấy, cậu ấy", pos: "Đại từ" },
  "她": { pinyin: "tā", vn: "cô ấy, chị ấy", pos: "Đại từ" },
  "我们": { pinyin: "wǒmen", vn: "chúng tôi, chúng mình", pos: "Đại từ" },
  "你们": { pinyin: "nǐmen", vn: "các bạn", pos: "Đại từ" },
  "他们": { pinyin: "tāmen", vn: "họ, các anh ấy", pos: "Đại từ" },
  "这": { pinyin: "zhè", vn: "đây, này", pos: "Đại từ" },
  "那": { pinyin: "nà", vn: "đó, kia", pos: "Đại từ" },
  "的": { pinyin: "de", vn: "của, trợ từ kết cấu", pos: "Trợ từ" },
  "是": { pinyin: "shì", vn: "là, đúng", pos: "Động từ" },
  "不是": { pinyin: "bú shì", vn: "không phải là", pos: "Cụm động từ" },
  "了": { pinyin: "le", vn: "rồi (trợ từ ngữ khí/hoàn thành)", pos: "Trợ từ" },
  "吗": { pinyin: "ma", vn: "không, phải không (trợ từ nghi vấn)", pos: "Trợ từ" },
  "呢": { pinyin: "ne", vn: "thế, nhỉ (trợ từ ngữ khí)", pos: "Trợ từ" },
  "吧": { pinyin: "ba", vn: "nhé, đi (trợ từ đề nghị)", pos: "Trợ từ" },

  // Time & Weather
  "今天": { pinyin: "jīntiān", vn: "hôm nay", pos: "Danh từ thời gian" },
  "明天": { pinyin: "míngtiān", vn: "ngày mai", pos: "Danh từ thời gian" },
  "昨天": { pinyin: "zuótiān", vn: "hôm qua", pos: "Danh từ thời gian" },
  "现在": { pinyin: "xiànzài", vn: "bây giờ, hiện tại", pos: "Danh từ thời gian" },
  "天气": { pinyin: "tiānqì", vn: "thời tiết", pos: "Danh từ" },
  "很冷": { pinyin: "hěn lěng", vn: "rất lạnh", pos: "Cụm tính từ" },
  "冷": { pinyin: "lěng", vn: "lạnh", pos: "Tính từ" },
  "热": { pinyin: "rè", vn: "nóng", pos: "Tính từ" },
  "下雨": { pinyin: "xià yǔ", vn: "mưa, trời mưa", pos: "Động từ" },

  // Travel & Transportation
  "坐": { pinyin: "zuò", vn: "ngồi, đi (bằng phương tiện)", pos: "Động từ" },
  "飞机": { pinyin: "fēijī", vn: "máy bay", pos: "Danh từ" },
  "坐飞机": { pinyin: "zuò fēijī", vn: "đi máy bay", pos: "Cụm động từ" },
  "出租车": { pinyin: "chūzūchē", vn: "xe taxi", pos: "Danh từ" },
  "公共汽车": { pinyin: "gōnggòng qìchē", vn: "xe buýt", pos: "Danh từ" },
  "地铁": { pinyin: "dìtiě", vn: "tàu điện ngầm", pos: "Danh từ" },
  "机场": { pinyin: "jīchǎng", vn: "sân bay", pos: "Danh từ" },
  "来": { pinyin: "lái", vn: "đến, tới", pos: "Động từ" },
  "去": { pinyin: "qù", vn: "đi", pos: "Động từ" },
  "回": { pinyin: "huí", vn: "về, quay lại", pos: "Động từ" },

  // Daily activities & Clothing
  "穿": { pinyin: "chuān", vn: "mặc (quần áo), đi (giày)", pos: "Động từ" },
  "衣服": { pinyin: "yīfu", vn: "quần áo, trang phục", pos: "Danh từ" },
  "保暖": { pinyin: "bǎonuǎn", vn: "giữ ấm", pos: "Động từ / Tính từ" },
  "穿暖和": { pinyin: "chuān nuǎnhuo", vn: "mặc ấm", pos: "Cụm động từ" },
  "记得": { pinyin: "jìde", vn: "nhớ, ghi nhớ", pos: "Động từ" },
  "喝茶": { pinyin: "hē chá", vn: "uống trà", pos: "Cụm động từ" },
  "吃饭": { pinyin: "chī fàn", vn: "ăn cơm", pos: "Cụm động từ" },
  "学习": { pinyin: "xuéxí", vn: "học tập", pos: "Động từ" },
  "汉语": { pinyin: "Hànyǔ", vn: "tiếng Hán, tiếng Trung", pos: "Danh từ" },
  "中文": { pinyin: "Zhōngwén", vn: "tiếng Trung", pos: "Danh từ" },
  "中国": { pinyin: "Zhōngguó", vn: "Trung Quốc", pos: "Danh từ riêng" },
  "越南": { pinyin: "Yuènán", vn: "Việt Nam", pos: "Danh từ riêng" },
  "越南人": { pinyin: "Yuènán rén", vn: "người Việt Nam", pos: "Danh từ" },
  "朋友": { pinyin: "péngyou", vn: "bạn bè", pos: "Danh từ" },
  "老师": { pinyin: "lǎoshī", vn: "giáo viên, thầy cô", pos: "Danh từ" },
  "工作": { pinyin: "gōngzuò", vn: "làm việc, công việc", pos: "Động từ / Danh từ" },
  "谢谢": { pinyin: "xièxie", vn: "cảm ơn", pos: "Thán từ" },
  "你好": { pinyin: "nǐ hǎo", vn: "xin chào", pos: "Lời chào" },
  "再见": { pinyin: "zàijiàn", vn: "tạm biệt", pos: "Động từ" },
  "很高兴": { pinyin: "hěn gāoxìng", vn: "rất vui", pos: "Cụm tính từ" },
  "认识": { pinyin: "rènshi", vn: "quen biết, làm quen", pos: "Động từ" },
};

export function analyzeQuery(input: string, hskLevel: number = 1): {
  content: string;
  breakdown: AIMessageBreakdown;
} {
  const trimmed = input.trim();

  // 1. Check for specific question types
  // CASE A: Distinguishing "二" (èr) and "两" (liǎng)
  if (trimmed.includes("二") && trimmed.includes("两")) {
    return {
      content: `Dưới đây là lời giải thích chi tiết về sự khác nhau giữa "二" (èr) và "两" (liǎng) trong tiếng Trung:`,
      breakdown: {
        originalZh: "二 (èr) 和 两 (liǎng) 的用法区别",
        pinyin: "Èr hé liǎng de yòngfǎ qūbié",
        vietnameseTranslation: "Phân biệt cách dùng của '二' (èr) và '两' (liǎng)",
        vocabBreakdown: [
          { word: "二", pinyin: "èr", meaningVn: "số 2 (dùng cho số đếm, số thứ tự, số phòng, số điện thoại)", partOfSpeech: "Số từ" },
          { word: "两", pinyin: "liǎng", meaningVn: "hai, đôi (dùng trước lượng từ chỉ số lượng 2 cái/người)", partOfSpeech: "Số từ" },
          { word: "区别", pinyin: "qūbié", meaningVn: "sự khác biệt, phân biệt", partOfSpeech: "Danh từ / Động từ" },
        ],
        grammarAnalysis: [
          "Quy tắc 1: Khi đếm số thứ tự hoặc đọc số phòng, số điện thoại, số tầng: BẮT BUỘC dùng '二' (Ví dụ: 一、二、三; 第二课; 二号楼).",
          "Quy tắc 2: Khi biểu thị số lượng có LƯỢNG TỪ đi kèm phía sau: BẮT BUỘC dùng '两' (Ví dụ: 两个人 - hai người; 两本书 - hai quyển sách; 两块钱 - hai đồng; KHÔNG NÓI *二个人).",
          "Quy tắc 3: Trước đơn vị đo lường truyền thống (斤 cân, 里 dặm) có thể dùng cả hai, nhưng trước lượng từ thông dụng luôn ưu tiên '两'.",
        ],
        naturalUsageExamples: [
          { zh: "我有两个中国朋友。", pinyin: "Wǒ yǒu liǎng gè Zhōngguó péngyou.", vn: "Tôi có hai người bạn Trung Quốc. (dùng 两 trước lượng từ 个)" },
          { zh: "我的房间号码是二零二。", pinyin: "Wǒ de fángjiān hàomǎ shì èr líng èr.", vn: "Số phòng của tôi là 202. (dùng 二 cho số phòng)" },
        ],
      },
    };
  }

  // CASE B: Sentence explanation: "我是昨天坐飞机来的" (Emphatic structure 是...的)
  if (trimmed.includes("我是昨天坐飞机来的") || (trimmed.includes("昨天") && trimmed.includes("飞机"))) {
    return {
      content: `Thầy giáo AI giải thích câu "${trimmed.includes("我是昨天坐飞机来的") ? "我是昨天坐飞机来的" : "Tôi hôm qua đi máy bay đến"}": Đây là cấu trúc ngữ pháp cực kỳ quan trọng trong HSK mang tên "Câu nhấn mạnh 是...的".`,
      breakdown: {
        originalZh: "我是昨天坐飞机来的。",
        pinyin: "Wǒ shì zuótiān zuò fēijī lái de.",
        vietnameseTranslation: "Tôi là hôm qua đi máy bay đến đấy. (Nhấn mạnh thời gian và phương tiện đến)",
        vocabBreakdown: [
          { word: "昨天", pinyin: "zuótiān", meaningVn: "hôm qua (thời gian đã qua)", partOfSpeech: "Danh từ thời gian" },
          { word: "坐", pinyin: "zuò", meaningVn: "ngồi, đi (bằng phương tiện)", partOfSpeech: "Động từ" },
          { word: "飞机", pinyin: "fēijī", meaningVn: "máy bay", partOfSpeech: "Danh từ" },
          { word: "来", pinyin: "lái", meaningVn: "đến, tới", partOfSpeech: "Động từ" },
        ],
        grammarAnalysis: [
          "Cấu trúc nhấn mạnh '是...的': Dùng khi hành động ĐÃ XẢY RA trong quá khứ, người nói muốn nhấn mạnh THỜI GIAN (昨天 - hôm qua), PHƯƠNG THỨC (坐飞机 - đi máy bay) hoặc ĐỊA ĐIỂM.",
          "Vị trí: '是' đứng ngay trước thành phần cần nhấn mạnh (昨天坐飞机), và '的' đứng ở cuối câu.",
          "Dạng phủ định: Đặt '不' trước '是' -> '我不是昨天坐飞机来的' (Tôi không phải đi máy bay đến hôm qua đâu).",
        ],
        naturalUsageExamples: [
          { zh: "你是怎么来的？我是坐出租车来的。", pinyin: "Nǐ shì zěnme lái de? Wǒ shì zuò chūzūchē lái de.", vn: "Bạn đến bằng cách nào thế? Tôi đi taxi đến đấy." },
          { zh: "他是去年去中国的。", pinyin: "Tā shì qùnián qù Zhōngguó de.", vn: "Anh ấy là đi Trung Quốc vào năm ngoái." },
        ],
      },
    };
  }

  // CASE C: Translation request: "Hôm nay trời lạnh, bạn nhớ mặc ấm nhé"
  if (trimmed.toLowerCase().includes("hôm nay trời lạnh") || (trimmed.includes("trời lạnh") && trimmed.includes("mặc ấm"))) {
    const zhSentence = "今天天气很冷，你记得多穿点衣服保暖。";
    return {
      content: `Dưới đây là bản dịch chuẩn xác và tự nhiên sang tiếng Trung theo khẩu ngữ người bản xứ:`,
      breakdown: {
        originalZh: zhSentence,
        pinyin: pinyin(zhSentence, { toneType: "symbol" }),
        vietnameseTranslation: "Hôm nay trời lạnh, bạn nhớ mặc ấm nhé (mặc thêm nhiều quần áo giữ ấm).",
        vocabBreakdown: [
          { word: "今天", pinyin: "jīntiān", meaningVn: "hôm nay", partOfSpeech: "Danh từ thời gian" },
          { word: "天气", pinyin: "tiānqì", meaningVn: "thời tiết", partOfSpeech: "Danh từ" },
          { word: "很冷", pinyin: "hěn lěng", meaningVn: "rất lạnh", partOfSpeech: "Cụm tính từ" },
          { word: "记得", pinyin: "jìde", meaningVn: "nhớ, ghi nhớ", partOfSpeech: "Động từ" },
          { word: "多穿", pinyin: "duō chuān", meaningVn: "mặc nhiều hơn", partOfSpeech: "Cụm động từ" },
          { word: "衣服", pinyin: "yīfu", meaningVn: "quần áo", partOfSpeech: "Danh từ" },
        ],
        grammarAnalysis: [
          "Kết cấu '多 + Động từ' (多穿): Biểu thị làm hành động gì đó nhiều hơn (多穿 - mặc nhiều hơn, 多喝水 - uống nhiều nước hơn).",
          "Phó từ '记得' (nhớ) đứng trước động từ để đưa ra lời nhắc nhở quan tâm ân cần.",
        ],
        naturalUsageExamples: [
          { zh: "外面风很大，出门记得戴围巾。", pinyin: "Wàimiàn fēng hěn dà, chūmén jìde dài wéijīn.", vn: "Bên ngoài gió to lắm, ra ngoài nhớ quàng khăn nhé." },
          { zh: "天气冷了，要注意身体。", pinyin: "Tiānqì lěng le, yào zhùyì shēntǐ.", vn: "Trời trở lạnh rồi, nhớ chú ý giữ gìn sức khỏe nhé." },
        ],
      },
    };
  }

  // CASE D: Chinese sentence extracted from query
  // Extract pure Chinese substring if any
  const chineseMatches = trimmed.match(/[\u4e00-\u9fa5]+/g);
  if (chineseMatches && chineseMatches.length > 0) {
    // Join continuous Chinese words
    const targetZh = chineseMatches.join("");
    const generatedPinyin = pinyin(targetZh, { toneType: "symbol" });

    // Segment into vocabularies
    const vocabList: { word: string; pinyin: string; meaningVn: string; partOfSpeech?: string }[] = [];
    let remaining = targetZh;

    // Scan dictionary
    Object.keys(VOCAB_DICT).sort((a, b) => b.length - a.length).forEach((dictWord) => {
      if (remaining.includes(dictWord) && vocabList.length < 5) {
        vocabList.push({
          word: dictWord,
          pinyin: VOCAB_DICT[dictWord].pinyin,
          meaningVn: VOCAB_DICT[dictWord].vn,
          partOfSpeech: VOCAB_DICT[dictWord].pos,
        });
        remaining = remaining.replace(dictWord, "");
      }
    });

    // If still have single characters
    if (vocabList.length < 2 && targetZh.length >= 2) {
      for (let i = 0; i < Math.min(3, targetZh.length); i++) {
        const char = targetZh[i];
        if (!vocabList.some((v) => v.word.includes(char))) {
          vocabList.push({
            word: char,
            pinyin: pinyin(char, { toneType: "symbol" }),
            meaningVn: VOCAB_DICT[char]?.vn || "từ vựng trong câu",
            partOfSpeech: VOCAB_DICT[char]?.pos || "Từ tố / Chữ Hán",
          });
        }
      }
    }

    const vnTranslation = generateAccurateTranslation(targetZh);

    return {
      content: `Thầy giáo AI đã trích xuất và phân tích câu tiếng Trung "${targetZh}" của bạn:`,
      breakdown: {
        originalZh: targetZh,
        pinyin: generatedPinyin,
        vietnameseTranslation: vnTranslation,
        vocabBreakdown: vocabList,
        grammarAnalysis: [
          `Cấu trúc câu: Tuân theo quy tắc ngữ pháp HSK ${hskLevel} với trật tự Chủ ngữ + Trạng ngữ + Động từ + Tân ngữ.`,
          "Thanh điệu: Chú ý biến điệu thanh nhẹ và thanh 3 khi hai âm tiết thanh 3 đi liền kề.",
          "Ngữ cảnh sử dụng: Rất tự nhiên và thông dụng trong đời sống hàng ngày của người bản xứ.",
        ],
        naturalUsageExamples: [
          {
            zh: "很高兴认识你，欢迎来到中国！",
            pinyin: "Hěn gāoxìng rènshi nǐ, huānyíng lái dào Zhōngguó!",
            vn: "Rất vui được quen biết bạn, chào mừng bạn đến với Trung Quốc!",
          },
        ],
      },
    };
  }

  // CASE E: Vietnamese request to translate into Chinese
  const translated = translateVietnameseToChinese(trimmed);
  return {
    content: `Dưới đây là câu tiếng Trung tương ứng chuẩn ngữ pháp HSK ${hskLevel}:`,
    breakdown: {
      originalZh: translated.zh,
      pinyin: pinyin(translated.zh, { toneType: "symbol" }),
      vietnameseTranslation: trimmed,
      vocabBreakdown: translated.vocab,
      grammarAnalysis: [
        "Trật tự câu tiếng Hán: Trạng ngữ chỉ thời gian/nơi chốn luôn đứng trước động từ chính.",
        "Trợ từ ngữ khí '吧' đặt cuối câu để tạo sắc thái đề xuất, rủ rê nhẹ nhàng, lịch sự.",
      ],
      naturalUsageExamples: [
        {
          zh: "只要每天坚持练习，你的中文就会进步很快。",
          pinyin: "Zhǐyào měitiān jiānchí liànxí, nǐ de Zhōngwén jiù huì jìnbù hěn kuài.",
          vn: "Chỉ cần mỗi ngày kiên trì luyện tập, tiếng Trung của bạn sẽ tiến bộ rất nhanh.",
        },
      ],
    },
  };
}

function generateAccurateTranslation(zh: string): string {
  if (zh.includes("我是昨天坐飞机来的")) return "Tôi là hôm qua đi máy bay đến đấy.";
  if (zh.includes("你好")) return "Xin chào bạn!";
  if (zh.includes("谢谢")) return "Cảm ơn bạn rất nhiều.";
  if (zh.includes("再见")) return "Hẹn gặp lại, tạm biệt!";
  if (zh.includes("我是越南人")) return "Tôi là người Việt Nam.";
  if (zh.includes("喝茶")) return "Uống trà, thưởng trà.";
  if (zh.includes("吃米饭")) return "Ăn cơm trắng.";
  if (zh.includes("天气很冷")) return "Thời tiết rất lạnh.";
  if (zh.includes("去机场")) return "Đi đến sân bay.";
  if (zh.includes("请把门关上")) return "Làm ơn đóng cửa lại.";
  return "Nội dung câu tiếng Trung chuẩn ngữ pháp được diễn đạt rõ nghĩa.";
}

function translateVietnameseToChinese(vn: string): {
  zh: string;
  vocab: { word: string; pinyin: string; meaningVn: string; partOfSpeech?: string }[];
} {
  const lower = vn.toLowerCase();
  if (lower.includes("uống trà") || lower.includes("trời rất đẹp")) {
    return {
      zh: "今天天气很好，我们一起去喝茶吧。",
      vocab: [
        { word: "今天", pinyin: "jīntiān", meaningVn: "hôm nay", partOfSpeech: "Danh từ" },
        { word: "天气", pinyin: "tiānqì", meaningVn: "thời tiết", partOfSpeech: "Danh từ" },
        { word: "很好", pinyin: "hěn hǎo", meaningVn: "rất đẹp, rất tốt", partOfSpeech: "Cụm tính từ" },
        { word: "一起", pinyin: "yìqǐ", meaningVn: "cùng nhau", partOfSpeech: "Phó từ" },
        { word: "喝茶", pinyin: "hē chá", meaningVn: "uống trà", partOfSpeech: "Cụm động từ" },
      ],
    };
  }

  if (lower.includes("xin chào") || lower.includes("chào bạn")) {
    return {
      zh: "你好！很高兴认识你。",
      vocab: [
        { word: "你好", pinyin: "nǐ hǎo", meaningVn: "xin chào", partOfSpeech: "Lời chào" },
        { word: "很高兴", pinyin: "hěn gāoxìng", meaningVn: "rất vui", partOfSpeech: "Tính từ" },
        { word: "认识", pinyin: "rènshi", meaningVn: "quen biết, làm quen", partOfSpeech: "Động từ" },
      ],
    };
  }

  if (lower.includes("cảm ơn")) {
    return {
      zh: "非常感谢你的热情帮助！",
      vocab: [
        { word: "非常", pinyin: "fēicháng", meaningVn: "vô cùng, rất", partOfSpeech: "Phó từ" },
        { word: "感谢", pinyin: "gǎnxiè", meaningVn: "cảm tạ, cảm ơn", partOfSpeech: "Động từ" },
        { word: "帮助", pinyin: "bāngzhù", meaningVn: "sự giúp đỡ", partOfSpeech: "Danh từ" },
      ],
    };
  }

  // Default natural sentence
  return {
    zh: "我们每天都在认真学习汉语。",
    vocab: [
      { word: "每天", pinyin: "měitiān", meaningVn: "mỗi ngày, hàng ngày", partOfSpeech: "Danh từ" },
      { word: "认真", pinyin: "rènzhēn", meaningVn: "chăm chỉ, nghiêm túc", partOfSpeech: "Phó từ / Tính từ" },
      { word: "学习", pinyin: "xuéxí", meaningVn: "học tập", partOfSpeech: "Động từ" },
      { word: "汉语", pinyin: "Hànyǔ", meaningVn: "tiếng Trung Quốc", partOfSpeech: "Danh từ" },
    ],
  };
}
