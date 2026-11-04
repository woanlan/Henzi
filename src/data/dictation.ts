export interface DictationSentence {
  id: string;
  hskLevel: number;
  sentenceZh: string;
  sentencePinyin: string;
  sentenceVn: string;
  audioUrl?: string;
  hintVocabulary: { word: string; pinyin: string; meaningVn: string }[];
}

export const DICTATION_DATABASE: DictationSentence[] = [
  // --- HSK 1 ---
  {
    id: "dic-hsk1-01",
    hskLevel: 1,
    sentenceZh: "明天你想去中国餐厅吃米饭吗？",
    sentencePinyin: "Míngtiān nǐ xiǎng qù Zhōngguó cāntīng chī mǐfàn ma?",
    sentenceVn: "Ngày mai bạn có muốn đi nhà hàng Trung Quốc ăn cơm không?",
    hintVocabulary: [
      { word: "明天", pinyin: "míngtiān", meaningVn: "ngày mai" },
      { word: "餐厅", pinyin: "cāntīng", meaningVn: "nhà hàng" },
      { word: "米饭", pinyin: "mǐfàn", meaningVn: "cơm trắng" },
    ],
  },
  {
    id: "dic-hsk1-02",
    hskLevel: 1,
    sentenceZh: "李老师在学校喝茶看书。",
    sentencePinyin: "Lǐ lǎoshī zài xuéxiào hē chá kàn shū.",
    sentenceVn: "Thầy Lý đang uống trà đọc sách ở trường học.",
    hintVocabulary: [
      { word: "学校", pinyin: "xuéxiào", meaningVn: "trường học" },
      { word: "喝茶", pinyin: "hē chá", meaningVn: "uống trà" },
      { word: "看书", pinyin: "kàn shū", meaningVn: "đọc sách" },
    ],
  },
  {
    id: "dic-hsk1-03",
    hskLevel: 1,
    sentenceZh: "桌子上有三个大苹果。",
    sentencePinyin: "Zhuōzi shang yǒu sān gè dà píngguǒ.",
    sentenceVn: "Trên bàn có ba quả táo to.",
    hintVocabulary: [
      { word: "桌子", pinyin: "zhuōzi", meaningVn: "cái bàn" },
      { word: "苹果", pinyin: "píngguǒ", meaningVn: "quả táo" },
    ],
  },

  // --- HSK 2 ---
  {
    id: "dic-hsk2-01",
    hskLevel: 2,
    sentenceZh: "外面下大雨了，你带雨伞了吗？",
    sentencePinyin: "Wàimiàn xià dàyǔ le, nǐ dài yǔsǎn le ma?",
    sentenceVn: "Bên ngoài trời mưa to rồi, bạn có mang ô (dù) không?",
    hintVocabulary: [
      { word: "外面", pinyin: "wàimiàn", meaningVn: "bên ngoài" },
      { word: "雨伞", pinyin: "yǔsǎn", meaningVn: "cái ô, dù" },
    ],
  },
  {
    id: "dic-hsk2-02",
    hskLevel: 2,
    sentenceZh: "去火车站坐地铁比坐出租车更快。",
    sentencePinyin: "Qù huǒchēzhàn zuò dìtiě bǐ zuò chūzūchē gèng kuài.",
    sentenceVn: "Đi ra ga tàu hỏa đi tàu điện ngầm nhanh hơn đi taxi.",
    hintVocabulary: [
      { word: "火车站", pinyin: "huǒchēzhàn", meaningVn: "ga xe lửa" },
      { word: "地铁", pinyin: "dìtiě", meaningVn: "tàu điện ngầm" },
      { word: "出租车", pinyin: "chūzūchē", meaningVn: "xe taxi" },
    ],
  },

  // --- HSK 3 ---
  {
    id: "dic-hsk3-01",
    hskLevel: 3,
    sentenceZh: "如果你遇到困难，大家一定会全力帮助你。",
    sentencePinyin: "Rúguǒ nǐ yùdào kùnnan, dàjiā yídìng huì quánlì bāngzhù nǐ.",
    sentenceVn: "Nếu bạn gặp phải khó khăn, mọi người nhất định sẽ hết sức giúp đỡ bạn.",
    hintVocabulary: [
      { word: "遇到", pinyin: "yùdào", meaningVn: "gặp phải" },
      { word: "困难", pinyin: "kùnnan", meaningVn: "khó khăn" },
      { word: "全力", pinyin: "quánlì", meaningVn: "hết sức, toàn lực" },
    ],
  },
  {
    id: "dic-hsk3-02",
    hskLevel: 3,
    sentenceZh: "请把空调温度调高一点，房间里有点冷。",
    sentencePinyin: "Qǐng bǎ kōngtiáo wēndù tiáo gāo yìdiǎn, fángjiān lǐ yǒudiǎn lěng.",
    sentenceVn: "Xin chỉnh nhiệt độ điều hòa cao lên một chút, trong phòng hơi lạnh.",
    hintVocabulary: [
      { word: "空调", pinyin: "kōngtiáo", meaningVn: "máy điều hòa" },
      { word: "温度", pinyin: "wēndù", meaningVn: "nhiệt độ" },
    ],
  },

  // --- HSK 4-5 ---
  {
    id: "dic-hsk4-01",
    hskLevel: 4,
    sentenceZh: "无论面对多么复杂的挑战，我们都要保持积极乐观的心态。",
    sentencePinyin: "Wúlùn miànduì duōme fùzá de tiǎozhàn, wǒmen dōu yào bǎochí jījí lèguān de xīntài.",
    sentenceVn: "Bất luận đối mặt với thử thách phức tạp đến đâu, chúng ta đều phải giữ tâm thế tích cực lạc quan.",
    hintVocabulary: [
      { word: "无论", pinyin: "wúlùn", meaningVn: "bất luận, dù cho" },
      { word: "挑战", pinyin: "tiǎozhàn", meaningVn: "thử thách" },
      { word: "心态", pinyin: "xīntài", meaningVn: "tâm thế, tâm lý" },
    ],
  },
  {
    id: "dic-hsk5-01",
    hskLevel: 5,
    sentenceZh: "在全球经济一体化的背景下，跨国贸易与文化交流日益频繁。",
    sentencePinyin: "Zài quánqiú jīngjì yītǐhuà de bèijǐng xià, kuàguó màoyì yǔ wénhuà jiāoliú rìyì pínfán.",
    sentenceVn: "Trong bối cảnh nhất thể hóa kinh tế toàn cầu, thương mại đa quốc gia và giao lưu văn hóa ngày càng trở nên thường xuyên.",
    hintVocabulary: [
      { word: "一体化", pinyin: "yītǐhuà", meaningVn: "nhất thể hóa" },
      { word: "日益", pinyin: "rìyì", meaningVn: "ngày càng" },
      { word: "频繁", pinyin: "pínfán", meaningVn: "thường xuyên, dồn dập" },
    ],
  },
];
