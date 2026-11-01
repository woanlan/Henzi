// Complete Chinese Pinyin Phonetics Data with audio mapping and Vietnamese tips

export interface PinyinInitial {
  pinyin: string;
  ipa: string;
  type: string;
  vietnameseEquivalent: string;
  tip: string;
  exampleWord: string;
  exampleZh: string;
}

export interface PinyinFinal {
  pinyin: string;
  ipa: string;
  vietnameseEquivalent: string;
  exampleWord: string;
  exampleZh: string;
}

// 21 Thanh Mẫu (Initials / Phụ âm đầu)
export const PINYIN_INITIALS: PinyinInitial[] = [
  // Âm môi (Lips)
  { pinyin: "b", ipa: "[p]", type: "Âm hai môi", vietnameseEquivalent: "gần giống chữ 'p' tiếng Việt nhưng không bật hơi (VD: ba ➔ pa)", tip: "Hai môi khép lại, đẩy nhẹ không khí ra ngoài, không bật hơi mạnh.", exampleWord: "bàba", exampleZh: "爸爸 (Bố)" },
  { pinyin: "p", ipa: "[pʰ]", type: "Âm hai môi (bật hơi)", vietnameseEquivalent: "chữ 'p' nhưng BẬT HƠI CỰC MẠNH", tip: "Đặt tờ giấy trước miệng, phát âm chữ 'p' sao cho tờ giấy bay tung lên.", exampleWord: "péngyou", exampleZh: "朋友 (Bạn bè)" },
  { pinyin: "m", ipa: "[m]", type: "Âm hai môi", vietnameseEquivalent: "giống hệt chữ 'm' tiếng Việt", tip: "Phát âm tự nhiên như mẹ, má.", exampleWord: "māma", exampleZh: "妈妈 (Mẹ)" },
  { pinyin: "f", ipa: "[f]", type: "Âm răng môi", vietnameseEquivalent: "giống chữ 'ph' tiếng Việt", tip: "Răng trên chạm môi dưới, luồng hơi ma sát thoát ra.", exampleWord: "fēijī", exampleZh: "飞机 (Máy bay)" },

  // Âm đầu lưỡi (Alveolar)
  { pinyin: "d", ipa: "[t]", type: "Âm đầu lưỡi", vietnameseEquivalent: "giống chữ 't' tiếng Việt (không bật hơi)", tip: "Đầu lưỡi chạm chân răng trên, bật nhẹ không khí không có gió.", exampleWord: "dìdi", exampleZh: "弟弟 (Em trai)" },
  { pinyin: "t", ipa: "[tʰ]", type: "Âm đầu lưỡi (bật hơi)", vietnameseEquivalent: "giống chữ 'th' tiếng Việt (bật hơi mạnh)", tip: "Luồng hơi đẩy mạnh qua kẽ đầu lưỡi như 'tha, thở'.", exampleWord: "tiānqì", exampleZh: "天气 (Thời tiết)" },
  { pinyin: "n", ipa: "[n]", type: "Âm đầu lưỡi", vietnameseEquivalent: "giống chữ 'n' tiếng Việt", tip: "Âm mũi, luồng hơi qua mũi tự nhiên.", exampleWord: "nǐ", exampleZh: "你 (Bạn)" },
  { pinyin: "l", ipa: "[l]", type: "Âm đầu lưỡi", vietnameseEquivalent: "giống chữ 'l' tiếng Việt", tip: "Đầu lưỡi chạm hàm trên, hơi thoát hai bên lưỡi.", exampleWord: "lǎoshī", exampleZh: "老师 (Thầy cô)" },

  // Âm gốc lưỡi (Velar)
  { pinyin: "g", ipa: "[k]", type: "Âm gốc lưỡi", vietnameseEquivalent: "giống chữ 'c / k' tiếng Việt", tip: "Gốc lưỡi chạm ngạc mềm, không bật hơi (VD: gē ➔ ca).", exampleWord: "gēge", exampleZh: "哥哥 (Anh trai)" },
  { pinyin: "k", ipa: "[kʰ]", type: "Âm gốc lưỡi (bật hơi)", vietnameseEquivalent: "giống chữ 'kh' nhưng BẬT HƠI MẠNH từ cổ họng", tip: "Luồng hơi gắt từ cuống họng tống mạnh ra ngoài.", exampleWord: "kāfēi", exampleZh: "咖啡 (Cà phê)" },
  { pinyin: "h", ipa: "[x]", type: "Âm gốc lưỡi", vietnameseEquivalent: "nằm giữa chữ 'h' và 'kh' tiếng Việt", tip: "Hơi cọ xát nhẹ ở cuống họng, đục hơn chữ 'h' tiếng Việt một chút.", exampleWord: "hǎo", exampleZh: "好 (Tốt, đẹp)" },

  // Âm mặt lưỡi (Palatal - j, q, x)
  { pinyin: "j", ipa: "[tɕ]", type: "Âm mặt lưỡi", vietnameseEquivalent: "gần giống chữ 'ch' tiếng Việt nhưng đầu lưỡi hạ thấp", tip: "Mặt lưỡi áp vào ngạc cứng, phát âm dẹt miệng sang hai bên.", exampleWord: "jīntiān", exampleZh: "今天 (Hôm nay)" },
  { pinyin: "q", ipa: "[tɕʰ]", type: "Âm mặt lưỡi (bật hơi)", vietnameseEquivalent: "giống chữ 'ch' nhưng BẬT HƠI CỰC MẠNH", tip: "Miệng cười dẹt, lưỡi ép sát rồi bật luồng hơi gió cực mạnh ra.", exampleWord: "qù", exampleZh: "去 (Đi)" },
  { pinyin: "x", ipa: "[ɕ]", type: "Âm mặt lưỡi", vietnameseEquivalent: "giống chữ 'x' nhẹ tiếng Việt", tip: "Miệng dẹt sang hai bên như đang cười mỉm, đẩy hơi xì nhẹ.", exampleWord: "xièxie", exampleZh: "谢谢 (Cảm ơn)" },

  // Âm uốn lưỡi (Retroflex - zh, ch, sh, r)
  { pinyin: "zh", ipa: "[ʈʂ]", type: "Âm uốn lưỡi", vietnameseEquivalent: "chữ 'tr' miền Nam (uốn cong đầu lưỡi lên ngạc cứng)", tip: "Cong đầu lưỡi lên vòm họng trên, không bật hơi, phát âm dứt khoát.", exampleWord: "Zhōngguó", exampleZh: "中国 (Trung Quốc)" },
  { pinyin: "ch", ipa: "[ʈʂʰ]", type: "Âm uốn lưỡi (bật hơi)", vietnameseEquivalent: "chữ 'tr' uốn lưỡi + BẬT HƠI MẠNH", tip: "Cong lưỡi chạm vòm họng, sau đó bật luồng hơi cực mạnh ra kèm uốn lưỡi.", exampleWord: "chī fàn", exampleZh: "吃饭 (Ăn cơm)" },
  { pinyin: "sh", ipa: "[ʂ]", type: "Âm uốn lưỡi", vietnameseEquivalent: "chữ 's' nặng miền Nam (uốn cong đầu lưỡi)", tip: "Cong đầu lưỡi lên gần ngạc cứng, cho luồng hơi ma sát thoát ra rào rào.", exampleWord: "shì", exampleZh: "是 (Là)" },
  { pinyin: "r", ipa: "[ʐ]", type: "Âm uốn lưỡi", vietnameseEquivalent: "giống chữ 'r' miền Nam nhẹ", tip: "Giữ nguyên khẩu hình uốn lưỡi của 'sh', rung nhẹ dây thanh quản.", exampleWord: "rén", exampleZh: "人 (Người)" },

  // Âm đầu lưỡi trước (Dental sibilants - z, c, s)
  { pinyin: "z", ipa: "[ts]", type: "Âm đầu lưỡi trước", vietnameseEquivalent: "gần giống chữ 'ch' nhưng thẳng đầu lưỡi ép mặt sau răng", tip: "Hai hàm răng khép hờ, đầu lưỡi thẳng chạm mặt sau răng trên, không bật hơi.", exampleWord: "zài", exampleZh: "在 (Ở, đang)" },
  { pinyin: "c", ipa: "[tsʰ]", type: "Âm đầu lưỡi trước (bật hơi)", vietnameseEquivalent: "âm 'xì hơi' có tiếng tắc BẬT HƠI MẠNH", tip: "Khép răng, đầu lưỡi chạm răng trên rồi bật hơi phì mạnh ra ngoài.", exampleWord: "cài", exampleZh: "菜 (Món ăn)" },
  { pinyin: "s", ipa: "[s]", type: "Âm đầu lưỡi trước", vietnameseEquivalent: "chữ 'x' tiếng Việt (thẳng lưỡi)", tip: "Đầu lưỡi thẳng để sát răng trên, luồng hơi ma sát xì nhẹ ra.", exampleWord: "sì", exampleZh: "四 (Số 4)" },
];

// Vận Mẫu Chính (Finals)
export const PINYIN_FINALS: PinyinFinal[] = [
  { pinyin: "a", ipa: "[a]", vietnameseEquivalent: "a", exampleWord: "bā", exampleZh: "八 (Tám)" },
  { pinyin: "o", ipa: "[o]", vietnameseEquivalent: "ô (hơi ngả uo)", exampleWord: "bō", exampleZh: "波 (Sóng)" },
  { pinyin: "e", ipa: "[ɤ]", vietnameseEquivalent: "ơ (hơi ngả ưa)", exampleWord: "hē", exampleZh: "喝 (Uống)" },
  { pinyin: "i", ipa: "[i]", vietnameseEquivalent: "i (sau zh/ch/sh/z/c/s đọc thành 'ư')", exampleWord: "qī", exampleZh: "七 (Bảy)" },
  { pinyin: "u", ipa: "[u]", vietnameseEquivalent: "u", exampleWord: "kū", exampleZh: "哭 (Khóc)" },
  { pinyin: "ü", ipa: "[y]", vietnameseEquivalent: "uy (tròn môi giữ nguyên)", exampleWord: "lǜ", exampleZh: "绿 (Xanh lá)" },
  { pinyin: "ai", ipa: "[aɪ]", vietnameseEquivalent: "ai", exampleWord: "ài", exampleZh: "爱 (Yêu)" },
  { pinyin: "ei", ipa: "[eɪ]", vietnameseEquivalent: "ây", exampleWord: "bēi", exampleZh: "杯 (Cốc)" },
  { pinyin: "ao", ipa: "[aʊ]", vietnameseEquivalent: "ao", exampleWord: "gāo", exampleZh: "高 (Cao)" },
  { pinyin: "ou", ipa: "[oʊ]", vietnameseEquivalent: "âu", exampleWord: "dōu", exampleZh: "都 (Đều)" },
  { pinyin: "an", ipa: "[an]", vietnameseEquivalent: "an", exampleWord: "sān", exampleZh: "三 (Ba)" },
  { pinyin: "en", ipa: "[ən]", vietnameseEquivalent: "ân", exampleWord: "rén", exampleZh: "人 (Người)" },
  { pinyin: "ang", ipa: "[ɑŋ]", vietnameseEquivalent: "ang", exampleWord: "cháng", exampleZh: "长 (Dài)" },
  { pinyin: "eng", ipa: "[ɤŋ]", vietnameseEquivalent: "âng", exampleWord: "fēng", exampleZh: "风 (Gió)" },
  { pinyin: "ong", ipa: "[ʊŋ]", vietnameseEquivalent: "ung (ngả uông)", exampleWord: "dōng", exampleZh: "东 (Đông)" },
];

// 4 Thanh Điệu (Tones)
export const PINYIN_TONES = [
  {
    toneNumber: 1,
    name: "Thanh 1 (Âm Bình)",
    mark: "ā",
    pitch: "55 (Cao & Đều)",
    desc: "Đọc cao, ngân đều và giữ nguyên cao độ, không lên không xuống như nốt Sol dài.",
    example: "mā (妈 - Mẹ)",
  },
  {
    toneNumber: 2,
    name: "Thanh 2 (Dương Bình)",
    mark: "á",
    pitch: "35 (Vút lên)",
    desc: "Tương đương dấu SẮC trong tiếng Việt, bắt đầu từ độ cao trung bình vút nhanh lên cao.",
    example: "má (麻 - Vừng)",
  },
  {
    toneNumber: 3,
    name: "Thanh 3 (Thượng Thanh)",
    mark: "ǎ",
    pitch: "214 (Xuống rồi lên)",
    desc: "Hạ giọng xuống trầm nhất rồi hơi móc nhẹ lên, gần giống dấu HỎI nhưng trầm sâu hơn.",
    example: "mǎ (马 - Con ngựa)",
  },
  {
    toneNumber: 4,
    name: "Thanh 4 (Khứ Thanh)",
    mark: "à",
    pitch: "51 (Hạ dứt khoát)",
    desc: "Bắt đầu từ đỉnh cao 5 hạ dứt khoát xuống 1 như tiếng chặt dao, mạnh và dứt khoát.",
    example: "mà (骂 - Mắng mỏ)",
  },
  {
    toneNumber: 0,
    name: "Khinh Thanh (Thanh Nhẹ)",
    mark: "ma",
    pitch: "Nhẹ & Ngắn",
    desc: "Đọc ngắn, nhẹ và lướt qua, không nhấn trọng âm.",
    example: "māma (妈妈 - Mẹ)",
  },
];

// Tricky Pair Comparisons for Vietnamese Learners
export const VIETNAMESE_TRICKY_PAIRS = [
  {
    pair: "zh vs z",
    zhSide: { sound: "zh", rule: "Uốn cong đầu lưỡi lên ngạc trên", example: "zhōng (Trung Quốc)", desc: "Giống 'tr' miền Nam" },
    zSide: { sound: "z", rule: "Thẳng lưỡi áp vào mặt sau răng cửa", example: "zài (ở, đang)", desc: "Giống 'ch' không uốn lưỡi" },
    sentencePractice: "Zhāng xiānshēng zài zhèli. (Trương tiên sinh ở đây.)",
  },
  {
    pair: "ch vs c",
    zhSide: { sound: "ch", rule: "Uốn cong lưỡi + BẬT HƠI CỰC MẠNH", example: "chī (ăn)", desc: "Tr uốn lưỡi có gió" },
    zSide: { sound: "c", rule: "Thẳng lưỡi chạm răng + BẬT HƠI", example: "cài (món ăn)", desc: "Xì hơi răng trước" },
    sentencePractice: "Chī cài bù chī cù. (Ăn thức ăn không ăn giấm.)",
  },
  {
    pair: "sh vs s",
    zhSide: { sound: "sh", rule: "Uốn lưỡi cong lên ngạc cứng", example: "shí (số 10)", desc: "Giống 's' nặng miền Nam" },
    zSide: { sound: "s", rule: "Thẳng lưỡi chạm răng dưới/trên", example: "sì (số 4)", desc: "Giống 'x' nhẹ tiếng Việt" },
    sentencePractice: "Sì shí sì, shí sì shí sì. (44 là 44, 14 là 14.)",
  },
  {
    pair: "b vs p",
    zhSide: { sound: "b", rule: "Không bật hơi (giống 'p' tiếng Việt)", example: "bàba (bố)", desc: "Đọc nhẹ như pa-pa" },
    zSide: { sound: "p", rule: "BẬT HƠI CỰC MẠNH thổi bay tờ giấy", example: "pà (sợ)", desc: "Bật hơi gió mạnh" },
    sentencePractice: "Bàba bù pà. (Bố không sợ.)",
  },
];
