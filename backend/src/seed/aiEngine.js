import { pinyin } from "pinyin-pro";


// 1. Comprehensive Educational Knowledge Base for Common Vocabulary & Queries
export const KNOWLEDGE_BASE = {
  // Family & Kinship
  "bố": {
    zh: "爸爸",
    pinyin: "bàba",
    meaningVn: "bố, ba, cha",
    sinoVn: "Ba ba / Phụ",
    partOfSpeech: "Danh từ xưng hô gia đình",
    strokeGuide: "Chữ 爸 có 8 nét: Phẩy (撇) ➔ Chấm (点) ➔ Phẩy ➔ Mác (捺) [Bộ Phụ 父] ➔ Ngang gập (横折) ➔ Sổ (竖) ➔ Ngang (横) ➔ Sổ cong móc (竖弯钩) [Chữ Ba 巴].",
    radicals: "Bộ Phụ (父 - người cha) ở trên + Chữ Ba (巴) ở dưới hài thanh (chỉ âm đọc).",
    vocabBreakdown: [
      { word: "爸", pinyin: "bà", meaningVn: "bố, ba, cha (âm Hán Việt: Ba)", partOfSpeech: "Danh từ" },
      { word: "父", pinyin: "fù", meaningVn: "người cha, phụ thân (bộ thủ chỉ nghĩa)", partOfSpeech: "Bộ thủ" },
    ],
    grammarAnalysis: [
      "Quy tắc phát âm: Từ '爸爸' có chữ thứ hai đọc thanh nhẹ không dấu (bàba), đọc lướt nhanh.",
      "Trong văn phong trang trọng, xưng hô tôn kính có thể dùng '父亲' (fùqīn - phụ thân).",
      "Khi gọi thân mật trong gia đình: 老爸 (lǎobà - bố già, bố yêu).",
    ],
    examples: [
      { zh: "我爸爸是一名医生。", pinyin: "Wǒ bàba shì yì míng yīshēng.", vn: "Bố tôi là một bác sĩ." },
      { zh: "爸爸，祝您父亲节快乐！", pinyin: "Bàba, zhù nín fùqīnjié kuàilè!", vn: "Bố ơi, chúc bố ngày của Cha vui vẻ!" },
      { zh: "我爱我的爸爸妈妈。", pinyin: "Wǒ ài wǒ de bàba māma.", vn: "Tôi yêu bố mẹ của tôi." },
    ],
  },
  "ba": {
    zh: "爸爸",
    pinyin: "bàba",
    meaningVn: "ba, bố, cha",
    sinoVn: "Ba ba / Phụ",
    partOfSpeech: "Danh từ xưng hô",
    strokeGuide: "Chữ 爸 có 8 nét: Bộ Phụ (父) 4 nét ở trên + chữ Ba (巴) 4 nét ở dưới.",
    radicals: "Bộ Phụ (父) chỉ ý nghĩa người cha.",
    vocabBreakdown: [
      { word: "爸", pinyin: "bà", meaningVn: "ba, bố", partOfSpeech: "Danh từ" },
      { word: "爸爸", pinyin: "bàba", meaningVn: "ba, bố", partOfSpeech: "Danh từ" },
    ],
    grammarAnalysis: [
      "Chữ thứ hai đọc thanh nhẹ (bàba).",
      "Có thể dùng '老爸' (lǎobà) để xưng hô thân mật.",
    ],
    examples: [
      { zh: "我爸爸今天去上班。", pinyin: "Wǒ bàba jīntiān qù shàngbān.", vn: "Hôm nay ba tôi đi làm." },
      { zh: "爸爸对我很好。", pinyin: "Bàba duì wǒ hěn hǎo.", vn: "Ba đối xử với tôi rất tốt." },
    ],
  },
  "cha": {
    zh: "爸爸",
    pinyin: "bàba",
    meaningVn: "cha, bố, ba",
    sinoVn: "Phụ thân",
    partOfSpeech: "Danh từ xưng hô",
    strokeGuide: "Chữ 爸 có 8 nét: Bộ Phụ (父) ở trên + chữ Ba (巴) ở dưới.",
    radicals: "Bộ Phụ (父) chỉ nghĩa người cha.",
    vocabBreakdown: [
      { word: "爸爸", pinyin: "bàba", meaningVn: "cha, bố", partOfSpeech: "Danh từ" },
      { word: "父亲", pinyin: "fùqīn", meaningVn: "phụ thân, người cha (trang trọng)", partOfSpeech: "Danh từ" },
    ],
    grammarAnalysis: [
      "Khẩu ngữ hàng ngày dùng '爸爸', văn viết hoặc trang trọng dùng '父亲'.",
    ],
    examples: [
      { zh: "父亲节快乐！", pinyin: "Fùqīnjié kuàilè!", vn: "Chúc mừng ngày của Cha!" },
    ],
  },
  "mẹ": {
    zh: "妈妈",
    pinyin: "māma",
    meaningVn: "mẹ, má, u",
    sinoVn: "Ma ma / Mẫu",
    partOfSpeech: "Danh từ xưng hô",
    strokeGuide: "Chữ 妈 có 6 nét: Gồm bộ Nữ (女) 3 nét bên trái + chữ Mã (马) 3 nét bên phải.",
    radicals: "Bộ Nữ (女 - người phụ nữ) chỉ ý nghĩa + chữ Mã (马) chỉ âm đọc.",
    vocabBreakdown: [
      { word: "妈", pinyin: "mā", meaningVn: "mẹ (âm Hán Việt: Ma)", partOfSpeech: "Danh từ" },
      { word: "女", pinyin: "nǚ", meaningVn: "người nữ, phụ nữ (bộ thủ)", partOfSpeech: "Bộ thủ" },
    ],
    grammarAnalysis: [
      "Chữ thứ hai đọc thanh nhẹ (māma).",
      "Trang trọng dùng '母亲' (mǔqīn - mẫu thân). Thân mật dùng '老妈' (lǎomā).",
    ],
    examples: [
      { zh: "我妈妈做的饭很好吃。", pinyin: "Wǒ māma zuò de fàn hěn hǎochī.", vn: "Cơm mẹ tôi nấu rất ngon." },
      { zh: "妈妈，我爱你！", pinyin: "Māma, wǒ ài nǐ!", vn: "Mẹ ơi, con yêu mẹ!" },
    ],
  },
  "má": {
    zh: "妈妈",
    pinyin: "māma",
    meaningVn: "má, mẹ",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "妈妈", pinyin: "māma", meaningVn: "mẹ, má", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我妈妈很漂亮。", pinyin: "Wǒ māma hěn piàoliang.", vn: "Má tôi rất đẹp." }],
  },
  "con": {
    zh: "孩子",
    pinyin: "háizi",
    meaningVn: "con, đứa trẻ",
    sinoVn: "Hài tử",
    partOfSpeech: "Danh từ",
    strokeGuide: "Chữ 孩 có 9 nét (bộ Tử 子 bên trái), chữ 子 có 3 nét.",
    vocabBreakdown: [
      { word: "孩子", pinyin: "háizi", meaningVn: "con, đứa trẻ", partOfSpeech: "Danh từ" },
      { word: "儿子", pinyin: "érzi", meaningVn: "con trai", partOfSpeech: "Danh từ" },
      { word: "女儿", pinyin: "nǚ'ér", meaningVn: "con gái", partOfSpeech: "Danh từ" },
    ],
    grammarAnalysis: ["'孩子' chỉ con cái nói chung hoặc trẻ em."],
    examples: [{ zh: "他们有两个孩子。", pinyin: "Tāmen yǒu liǎng gè háizi.", vn: "Họ có hai đứa con." }],
  },
  "con trai": {
    zh: "儿子",
    pinyin: "érzi",
    meaningVn: "con trai",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "儿子", pinyin: "érzi", meaningVn: "con trai", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我儿子今年五岁了。", pinyin: "Wǒ érzi jīnnián wǔ suì le.", vn: "Con trai tôi năm nay 5 tuổi rồi." }],
  },
  "con gái": {
    zh: "女儿",
    pinyin: "nǚ'ér",
    meaningVn: "con gái",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "女儿", pinyin: "nǚ'ér", meaningVn: "con gái", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我女儿很聪明。", pinyin: "Wǒ nǚ'ér hěn cōngmíng.", vn: "Con gái tôi rất thông minh." }],
  },
  "anh trai": {
    zh: "哥哥",
    pinyin: "gēge",
    meaningVn: "anh trai",
    sinoVn: "Ca ca",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "哥哥", pinyin: "gēge", meaningVn: "anh trai", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我哥哥在北京工作。", pinyin: "Wǒ gēge zài Běijīng gōngzuò.", vn: "Anh trai tôi làm việc ở Bắc Kinh." }],
  },
  "em trai": {
    zh: "弟弟",
    pinyin: "dìdi",
    meaningVn: "em trai",
    sinoVn: "Đệ đệ",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "弟弟", pinyin: "dìdi", meaningVn: "em trai", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我弟弟在上大学。", pinyin: "Wǒ dìdi zài shàng dàxué.", vn: "Em trai tôi đang học đại học." }],
  },
  "chị gái": {
    zh: "姐姐",
    pinyin: "jiějie",
    meaningVn: "chị gái",
    sinoVn: "Tỷ tỷ",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "姐姐", pinyin: "jiějie", meaningVn: "chị gái", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "姐姐喜欢看书。", pinyin: "Jiějie xǐhuan kàn shū.", vn: "Chị gái thích đọc sách." }],
  },
  "em gái": {
    zh: "妹妹",
    pinyin: "mèimei",
    meaningVn: "em gái",
    sinoVn: "Muội muội",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "妹妹", pinyin: "mèimei", meaningVn: "em gái", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我妹妹会跳舞。", pinyin: "Wǒ mèimei huì tiàowǔ.", vn: "Em gái tôi biết múa." }],
  },
  "ông nội": {
    zh: "爷爷",
    pinyin: "yéye",
    meaningVn: "ông nội",
    sinoVn: "Da da",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "爷爷", pinyin: "yéye", meaningVn: "ông nội", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "爷爷今年八十岁了。", pinyin: "Yéye jīnnián bāshí suì le.", vn: "Ông nội năm nay 80 tuổi rồi." }],
  },
  "bà nội": {
    zh: "奶奶",
    pinyin: "nǎinai",
    meaningVn: "bà nội",
    sinoVn: "Nãi nãi",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "奶奶", pinyin: "nǎinai", meaningVn: "bà nội", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "奶奶身体很好。", pinyin: "Nǎinai shēntǐ hěn hǎo.", vn: "Bà nội sức khỏe rất tốt." }],
  },
  "gia đình": {
    zh: "家庭",
    pinyin: "jiātíng",
    meaningVn: "gia đình, nhà",
    sinoVn: "Gia đình",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "家", pinyin: "jiā", meaningVn: "nhà, gia đình", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我家有四口人。", pinyin: "Wǒ jiā yǒu sì kǒu rén.", vn: "Nhà tôi có 4 người." }],
  },

  // Greetings & Social
  "xin chào": {
    zh: "你好",
    pinyin: "nǐ hǎo",
    meaningVn: "xin chào, chào bạn",
    sinoVn: "Nhĩ hảo",
    partOfSpeech: "Lời chào hỏi",
    vocabBreakdown: [
      { word: "你", pinyin: "nǐ", meaningVn: "bạn, cậu", partOfSpeech: "Đại từ" },
      { word: "好", pinyin: "hǎo", meaningVn: "tốt, lành, khỏe", partOfSpeech: "Tính từ" },
    ],
    grammarAnalysis: ["Biến điệu thanh 3: 'nǐ' và 'hǎo' đều là thanh 3, khi đọc liền 'nǐ' chuyển thành thanh 2 ('ní hǎo')."],
    examples: [{ zh: "你好！很高兴认识你。", pinyin: "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.", vn: "Xin chào! Rất vui được quen biết bạn." }],
  },
  "chào": {
    zh: "你好",
    pinyin: "nǐ hǎo",
    meaningVn: "chào bạn, xin chào",
    partOfSpeech: "Lời chào",
    vocabBreakdown: [{ word: "你好", pinyin: "nǐ hǎo", meaningVn: "xin chào", partOfSpeech: "Lời chào" }],
    examples: [{ zh: "你好，欢迎光临！", pinyin: "Nǐ hǎo, huānyíng guānglín!", vn: "Chào bạn, hoan nghênh ghé thăm!" }],
  },
  "chào buổi sáng": {
    zh: "早上好",
    pinyin: "zǎoshang hǎo",
    meaningVn: "chào buổi sáng, sớm an",
    sinoVn: "Tảo thượng hảo",
    partOfSpeech: "Lời chào",
    vocabBreakdown: [
      { word: "早上", pinyin: "zǎoshang", meaningVn: "buổi sáng", partOfSpeech: "Danh từ" },
      { word: "好", pinyin: "hǎo", meaningVn: "tốt, khỏe", partOfSpeech: "Tính từ" },
    ],
    examples: [{ zh: "老师，早上好！", pinyin: "Lǎoshī, zǎoshang hǎo!", vn: "Em chào thầy, buổi sáng tốt lành!" }],
  },
  "chúc ngủ ngon": {
    zh: "晚安",
    pinyin: "wǎn'ān",
    meaningVn: "chúc ngủ ngon, vãn an",
    sinoVn: "Vãn an",
    partOfSpeech: "Lời chúc",
    vocabBreakdown: [
      { word: "晚", pinyin: "wǎn", meaningVn: "muộn, tối", partOfSpeech: "Tính từ" },
      { word: "安", pinyin: "ān", meaningVn: "bình an, an lành", partOfSpeech: "Tính từ" },
    ],
    examples: [{ zh: "时间不早了，晚安！", pinyin: "Shíjiān bù zǎo le, wǎn'ān!", vn: "Không còn sớm nữa, chúc ngủ ngon!" }],
  },
  "cảm ơn": {
    zh: "谢谢",
    pinyin: "xièxie",
    meaningVn: "cảm ơn",
    sinoVn: "Tạ tạ",
    partOfSpeech: "Thán từ cảm tạ",
    vocabBreakdown: [{ word: "谢", pinyin: "xiè", meaningVn: "cảm ơn, tạ ơn", partOfSpeech: "Động từ" }],
    grammarAnalysis: ["Chữ thứ hai đọc thanh nhẹ: xièxie."],
    examples: [{ zh: "谢谢你的帮助！", pinyin: "Xièxie nǐ de bāngzhù!", vn: "Cảm ơn sự giúp đỡ của bạn!" }],
  },
  "không có chi": {
    zh: "不客气",
    pinyin: "bú kèqi",
    meaningVn: "không có chi, đừng khách sáo",
    sinoVn: "Bất khách khí",
    partOfSpeech: "Khẩu ngữ đáp lễ",
    vocabBreakdown: [{ word: "客气", pinyin: "kèqi", meaningVn: "khách sáo", partOfSpeech: "Tính từ" }],
    examples: [{ zh: "不用谢，不客气！", pinyin: "Bú yòng xiè, bú kèqi!", vn: "Không cần cảm ơn, đừng khách sáo!" }],
  },
  "xin lỗi": {
    zh: "对不起",
    pinyin: "duìbuqǐ",
    meaningVn: "xin lỗi",
    sinoVn: "Đối bất khởi",
    partOfSpeech: "Khẩu ngữ xin lỗi",
    vocabBreakdown: [{ word: "对不起", pinyin: "duìbuqǐ", meaningVn: "xin lỗi", partOfSpeech: "Động từ" }],
    examples: [{ zh: "对不起，我迟到了。", pinyin: "Duìbuqǐ, wǒ chídào le.", vn: "Xin lỗi, tôi đến muộn rồi." }],
  },
  "không sao": {
    zh: "没关系",
    pinyin: "méi guānxi",
    meaningVn: "không sao đâu, không hề gì",
    sinoVn: "Một quan hệ",
    partOfSpeech: "Khẩu ngữ đáp lại lời xin lỗi",
    vocabBreakdown: [{ word: "没关系", pinyin: "méi guānxi", meaningVn: "không sao", partOfSpeech: "Cụm từ" }],
    examples: [{ zh: "没关系，下次注意就好。", pinyin: "Méi guānxi, xià cì zhùyì jiù hǎo.", vn: "Không sao đâu, lần sau chú ý là được." }],
  },
  "tạm biệt": {
    zh: "再见",
    pinyin: "zàijiàn",
    meaningVn: "tạm biệt, hẹn gặp lại",
    sinoVn: "Tái kiến",
    partOfSpeech: "Lời chào từ biệt",
    vocabBreakdown: [
      { word: "再", pinyin: "zài", meaningVn: "lại, lần nữa", partOfSpeech: "Phó từ" },
      { word: "见", pinyin: "jiàn", meaningVn: "thấy, gặp", partOfSpeech: "Động từ" },
    ],
    examples: [{ zh: "明天见，再见！", pinyin: "Míngtiān jiàn, zàijiàn!", vn: "Mai gặp lại nhé, tạm biệt!" }],
  },

  // Daily Communication & Verbs
  "tôi yêu bạn": {
    zh: "我爱你",
    pinyin: "wǒ ài nǐ",
    meaningVn: "tôi yêu bạn, anh yêu em, em yêu anh",
    sinoVn: "Ngã ái nhĩ",
    partOfSpeech: "Mẫu câu biểu đạt tình cảm",
    vocabBreakdown: [
      { word: "我", pinyin: "wǒ", meaningVn: "tôi, mình", partOfSpeech: "Đại từ" },
      { word: "爱", pinyin: "ài", meaningVn: "yêu, thương", partOfSpeech: "Động từ" },
      { word: "你", pinyin: "nǐ", meaningVn: "bạn, em, anh", partOfSpeech: "Đại từ" },
    ],
    examples: [{ zh: "我爱你，一生一世。", pinyin: "Wǒ ài nǐ, yì shēng yí shì.", vn: "Anh yêu em trọn đời trọn kiếp." }],
  },
  "bạn tên gì": {
    zh: "你叫什么名字？",
    pinyin: "Nǐ jiào shénme míngzi?",
    meaningVn: "bạn tên là gì?",
    sinoVn: "Nhĩ khiếu thập ma danh tự",
    partOfSpeech: "Câu hỏi nghi vấn",
    vocabBreakdown: [
      { word: "叫", pinyin: "jiào", meaningVn: "gọi là, tên là", partOfSpeech: "Động từ" },
      { word: "什么", pinyin: "shénme", meaningVn: "cái gì, gì", partOfSpeech: "Đại từ nghi vấn" },
      { word: "名字", pinyin: "míngzi", meaningVn: "tên gọi", partOfSpeech: "Danh từ" },
    ],
    examples: [{ zh: "你好，请问你叫什么名字？", pinyin: "Nǐ hǎo, qǐngwèn nǐ jiào shénme míngzi?", vn: "Xin chào, cho hỏi bạn tên gì thế?" }],
  },
  "ăn cơm": {
    zh: "吃饭",
    pinyin: "chī fàn",
    meaningVn: "ăn cơm, dùng bữa",
    sinoVn: "Cật phạn",
    partOfSpeech: "Cụm động từ",
    vocabBreakdown: [
      { word: "吃", pinyin: "chī", meaningVn: "ăn", partOfSpeech: "Động từ" },
      { word: "饭", pinyin: "fàn", meaningVn: "cơm, bữa ăn", partOfSpeech: "Danh từ" },
    ],
    examples: [{ zh: "你吃饭了吗？", pinyin: "Nǐ chī fàn le ma?", vn: "Bạn đã ăn cơm chưa?" }],
  },
  "uống nước": {
    zh: "喝水",
    pinyin: "hē shuǐ",
    meaningVn: "uống nước",
    partOfSpeech: "Cụm động từ",
    vocabBreakdown: [
      { word: "喝", pinyin: "hē", meaningVn: "uống", partOfSpeech: "Động từ" },
      { word: "水", pinyin: "shuǐ", meaningVn: "nước", partOfSpeech: "Danh từ" },
    ],
    examples: [{ zh: "多喝水对身体好。", pinyin: "Duō hē shuǐ duì shēntǐ hǎo.", vn: "Uống nhiều nước rất tốt cho cơ thể." }],
  },
  "uống trà": {
    zh: "喝茶",
    pinyin: "hē chá",
    meaningVn: "uống trà, thưởng trà",
    partOfSpeech: "Cụm động từ",
    vocabBreakdown: [{ word: "喝茶", pinyin: "hē chá", meaningVn: "uống trà", partOfSpeech: "Cụm động từ" }],
    examples: [{ zh: "我们一起去喝茶吧。", pinyin: "Wǒmen yìqǐ qù hē chá ba.", vn: "Chúng mình cùng đi uống trà nhé." }],
  },
  "trà sữa": {
    zh: "奶茶",
    pinyin: "nǎichá",
    meaningVn: "trà sữa",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "奶茶", pinyin: "nǎichá", meaningVn: "trà sữa", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我想买一杯珍珠奶茶。", pinyin: "Wǒ xiǎng mǎi yì bēi zhēnzhū nǎichá.", vn: "Tôi muốn mua một cốc trà sữa trân châu." }],
  },
  "cà phê": {
    zh: "咖啡",
    pinyin: "kāfēi",
    meaningVn: "cà phê",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "咖啡", pinyin: "kāfēi", meaningVn: "cà phê", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "来一杯热咖啡。", pinyin: "Lái yì bēi rè kāfēi.", vn: "Cho một cốc cà phê nóng." }],
  },
  "bao nhiêu tiền": {
    zh: "多少钱",
    pinyin: "duōshao qián",
    meaningVn: "bao nhiêu tiền?",
    sinoVn: "Đa thiểu tiền",
    partOfSpeech: "Cụm từ nghi vấn giá cả",
    vocabBreakdown: [
      { word: "多少", pinyin: "duōshao", meaningVn: "bao nhiêu", partOfSpeech: "Đại từ nghi vấn" },
      { word: "钱", pinyin: "qián", meaningVn: "tiền", partOfSpeech: "Danh từ" },
    ],
    examples: [{ zh: "老板，这个多少钱？", pinyin: "Lǎobǎn, zhè ge duōshao qián?", vn: "Ông chủ ơi, cái này bao nhiêu tiền?" }],
  },
  "đắt quá": {
    zh: "太贵了",
    pinyin: "tài guì le",
    meaningVn: "đắt quá rồi, mắc quá",
    partOfSpeech: "Cụm cảm thán",
    vocabBreakdown: [
      { word: "太...了", pinyin: "tài...le", meaningVn: "quá... rồi (cấu trúc cảm thán)", partOfSpeech: "Cấu trúc ngữ pháp" },
      { word: "贵", pinyin: "guì", meaningVn: "đắt, quý", partOfSpeech: "Tính từ" },
    ],
    examples: [{ zh: "太贵了，能不能便宜点？", pinyin: "Tài guì le, néng bu néng piányi diǎn?", vn: "Đắt quá, có thể rẻ hơn chút được không?" }],
  },
  "rẻ hơn": {
    zh: "便宜一点",
    pinyin: "piányi yìdiǎn",
    meaningVn: "rẻ hơn một chút",
    partOfSpeech: "Cụm từ",
    vocabBreakdown: [{ word: "便宜", pinyin: "piányi", meaningVn: "rẻ", partOfSpeech: "Tính từ" }],
    examples: [{ zh: "便宜一点我就买。", pinyin: "Piányi yìdiǎn wǒ jiù mǎi.", vn: "Rẻ hơn chút thì tôi mua." }],
  },
  "ở đâu": {
    zh: "在哪里",
    pinyin: "zài nǎlǐ",
    meaningVn: "ở đâu, tại đâu?",
    partOfSpeech: "Cụm từ nghi vấn",
    vocabBreakdown: [{ word: "哪里", pinyin: "nǎlǐ", meaningVn: "ở đâu", partOfSpeech: "Đại từ" }],
    examples: [{ zh: "请问洗手间在哪里？", pinyin: "Qǐngwèn xǐshǒujiān zài nǎlǐ?", vn: "Xin hỏi nhà vệ sinh ở đâu ạ?" }],
  },
  "nhà vệ sinh": {
    zh: "洗手间",
    pinyin: "xǐshǒujiān",
    meaningVn: "nhà vệ sinh, toilet",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "洗手间", pinyin: "xǐshǒujiān", meaningVn: "nhà vệ sinh", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "洗手间在左边。", pinyin: "Xǐshǒujiān zài zuǒbiān.", vn: "Nhà vệ sinh ở bên tay trái." }],
  },
  "sân bay": {
    zh: "机场",
    pinyin: "jīchǎng",
    meaningVn: "sân bay, phi trường",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "机场", pinyin: "jīchǎng", meaningVn: "sân bay", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我要去机场接朋友。", pinyin: "Wǒ yào qù jīchǎng jiē péngyou.", vn: "Tôi phải ra sân bay đón bạn." }],
  },
  "máy bay": {
    zh: "飞机",
    pinyin: "fēijī",
    meaningVn: "máy bay",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [{ word: "飞机", pinyin: "fēijī", meaningVn: "máy bay", partOfSpeech: "Danh từ" }],
    examples: [{ zh: "我是坐飞机来的。", pinyin: "Wǒ shì zuò fēijī lái de.", vn: "Tôi là đi máy bay đến đấy." }],
  },
  "người việt nam": {
    zh: "越南人",
    pinyin: "Yuènán rén",
    meaningVn: "người Việt Nam",
    partOfSpeech: "Danh từ",
    vocabBreakdown: [
      { word: "越南", pinyin: "Yuènán", meaningVn: "Việt Nam", partOfSpeech: "Danh từ riêng" },
      { word: "人", pinyin: "rén", meaningVn: "người", partOfSpeech: "Danh từ" },
    ],
    examples: [{ zh: "我是越南人，我正在学中文。", pinyin: "Wǒ shì Yuènán rén, wǒ zhèngzài xué Zhōngwén.", vn: "Tôi là người Việt Nam, tôi đang học tiếng Trung." }],
  },
};

// 2. Intelligent Keyword Extractor from Vietnamese Inquiries
export function extractVietnameseTarget(query) {
  const clean = query.trim().toLowerCase().replace(/[?.,!]/g, "");

  // Patterns like: "bố ghi sao", "bố viết sao", "bố nói sao", "bố tiếng trung là gì"
  const patterns = [
    /^(?:từ|chữ|tiếng)?\s*(.+?)\s+(?:ghi\s+sao|viết\s+sao|nói\s+sao|đọc\s+sao|dịch\s+sao|là\s+gì|tiếng\s+trung\s+là\s+gì|viết\s+như\s+thế\s+nào|đọc\s+như\s+thế\s+nào)$/,
    /^(?:cách\s+viết|cách\s+ghi|cách\s+đọc|cách\s+nói|cách\s+dịch)\s+(?:từ|chữ)?\s*(.+?)$/,
    /^(?:làm\s+sao\s+để\s+(?:viết|ghi|đọc|nói)|dịch\s+giúp\s+tôi\s+từ)\s*(.+?)$/,
    /^(?:từ|chữ)\s*(.+?)\s+(?:trong\s+tiếng\s+trung|nghĩa\s+là\s+gì)$/,
  ];

  for (const pat of patterns) {
    const match = clean.match(pat);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return clean;
}

// 3. Main NLP Engine Query Analyzer
export function analyzeQuery(input, hskLevel = 1) {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // BOOKSTORE ADVISOR: Recommend books from the 30-volume HANZI catalog
  if (
    lower.includes("mua sách") ||
    lower.includes("chọn sách") ||
    lower.includes("sách nào") ||
    lower.includes("gợi ý sách") ||
    lower.includes("mất gốc") ||
    lower.includes("tư vấn sách") ||
    lower.includes("giáo trình nào") ||
    lower.includes("thư pháp") ||
    lower.includes("bộ thủ") ||
    lower.includes("luyện đề") ||
    lower.includes("thơ đường")
  ) {
    return {
      content: `📚 **Cố Vấn Sách HANZI** (Kho 30 ấn phẩm chọn lọc — gợi ý cho trình độ HSK ${hskLevel}):\n\n1. **Người mới / Nhập môn Hán tự**: *Tinh Giảng Ngữ Âm Pinyin* (119.000₫) + *Giáo Trình Chuẩn HSK 1* (159.000₫) + *500 Chữ Hán Tượng Hình* (155.000₫) + *Vở Luyện Thư Pháp Ô Mễ* (98.000₫).\n2. **Học thuật & Luyện thi điểm cao**: Trọn bộ *Giáo Trình Chuẩn HSK 1–6*, *Cẩm Nang Ngữ Pháp Toàn Tập* (185.000₫), *Sổ Tay 5000 Từ Vựng Mindmap* (165.000₫) và *Bí Quyết Thi Nói HSKK* (145.000₫).\n3. **Thực chiến Kinh doanh & Đời sống**: *301 Câu Đàm Thoại* (129.000₫), *Khẩu Ngữ Douyin/Xiaohongshu* (139.000₫), *Logistics & Xuất Nhập Khẩu* (189.000₫), *Tiếng Trung Quản Lý Nhà Máy QC* (182.000₫).\n4. **Sưu tầm bìa cứng 24K**: *Từ Điển 214 Bộ Thủ* (265.000₫), *100 Điển Tích Thành Ngữ* (169.000₫) và *300 Bài Thơ Đường Song Ngữ* (198.000₫).\n\n💡 Áp mã **HANZI50K** trong giỏ hàng để giảm ngay 50.000₫ và miễn phí ship cho đơn từ 300.000₫!`,
      breakdown: {
        originalZh: "开卷有益 · 书香致远",
        pinyin: "Kāijuàn yǒuyì · Shūxiāng zhìyuǎn",
        vietnameseTranslation: "Mở sách ra là có ích · Hương sách bay xa bền lâu",
        vocabBreakdown: [
          { word: "书", pinyin: "shū", meaningVn: "sách, thư tịch (Bộ Viết 曰)", partOfSpeech: "Danh từ" },
          { word: "词典", pinyin: "cídiǎn", meaningVn: "từ điển tra cứu", partOfSpeech: "Danh từ" },
          { word: "教材", pinyin: "jiàocái", meaningVn: "giáo trình, tài liệu học", partOfSpeech: "Danh từ" },
        ],
        grammarAnalysis: [
          "Mẹo chọn ấn bản: Bản 'Bìa mềm tiêu chuẩn' nhẹ, tiện mang đi học; bản 'Bìa cứng vải bố dập nhũ' khâu chỉ mở phẳng 180°, rất bền để tra cứu lâu dài.",
        ],
        naturalUsageExamples: [
          { zh: "我想买两本汉语教材。", pinyin: "Wǒ xiǎng mǎi liǎng běn Hànyǔ jiàocái.", vn: "Tôi muốn mua hai quyển giáo trình tiếng Trung." },
        ],
      },
      engine: "vankho-book-advisor",
    };
  }

  // SPECIAL GRAMMAR A: Distinguishing "二" (èr) and "两" (liǎng)
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
        ],
        grammarAnalysis: [
          "Quy tắc 1: Khi đếm số thứ tự hoặc đọc số phòng, số điện thoại: BẮT BUỘC dùng '二' (Ví dụ: 一、二、三; 第二课; 二号楼).",
          "Quy tắc 2: Khi biểu thị số lượng có LƯỢNG TỪ đi kèm phía sau: BẮT BUỘC dùng '两' (Ví dụ: 两个人 - hai người; 两本书 - hai quyển sách; KHÔNG NÓI *二个人).",
        ],
        naturalUsageExamples: [
          { zh: "我有两个中国朋友。", pinyin: "Wǒ yǒu liǎng gè Zhōngguó péngyou.", vn: "Tôi có hai người bạn Trung Quốc." },
          { zh: "我的房间号码是二零二。", pinyin: "Wǒ de fángjiān hàomǎ shì èr líng èr.", vn: "Số phòng của tôi là 202." },
        ],
      },
      engine: "offline-pedagogy",
    };
  }

  // SPECIAL GRAMMAR B: Sentence explanation: "我是昨天坐飞机来的" (Emphatic structure 是...的)
  if (trimmed.includes("我是昨天坐飞机来的") || (trimmed.includes("昨天") && trimmed.includes("飞机"))) {
    return {
      content: `Thầy giáo AI giải thích câu: Đây là cấu trúc ngữ pháp cực kỳ quan trọng trong HSK mang tên "Câu nhấn mạnh 是...的".`,
      breakdown: {
        originalZh: "我是昨天坐飞机来的。",
        pinyin: "Wǒ shì zuótiān zuò fēijī lái de.",
        vietnameseTranslation: "Tôi là hôm qua đi máy bay đến đấy. (Nhấn mạnh thời gian và phương thức)",
        vocabBreakdown: [
          { word: "昨天", pinyin: "zuótiān", meaningVn: "hôm qua (thời gian đã qua)", partOfSpeech: "Danh từ thời gian" },
          { word: "坐飞机", pinyin: "zuò fēijī", meaningVn: "đi máy bay", partOfSpeech: "Cụm động từ" },
          { word: "来", pinyin: "lái", meaningVn: "đến, tới", partOfSpeech: "Động từ" },
        ],
        grammarAnalysis: [
          "Cấu trúc nhấn mạnh '是...的': Dùng khi hành động ĐÃ XẢY RA trong quá khứ, người nói muốn nhấn mạnh THỜI GIAN (昨天), PHƯƠNG THỨC (坐飞机) hoặc ĐỊA ĐIỂM.",
          "Vị trí: '是' đứng ngay trước thành phần cần nhấn mạnh, và '的' đứng ở cuối câu.",
        ],
        naturalUsageExamples: [
          { zh: "你是怎么来的？我是坐出租车来的。", pinyin: "Nǐ shì zěnme lái de? Wǒ shì zuò chūzūchē lái de.", vn: "Bạn đến bằng cách nào thế? Tôi đi taxi đến đấy." },
        ],
      },
      engine: "offline-pedagogy",
    };
  }

  // CHECK 1: Look up extracted Vietnamese keyword in Knowledge Base
  const extractedKeyword = extractVietnameseTarget(trimmed);
  let matchedItem = null;
  let matchedKey = "";

  // Exact or contains match on Knowledge Base
  if (KNOWLEDGE_BASE[extractedKeyword]) {
    matchedItem = KNOWLEDGE_BASE[extractedKeyword];
    matchedKey = extractedKeyword;
  } else {
    // Substring match: find key in query or query in key
    for (const key of Object.keys(KNOWLEDGE_BASE)) {
      if (lower.includes(key) || extractedKeyword.includes(key)) {
        matchedItem = KNOWLEDGE_BASE[key];
        matchedKey = key;
        break;
      }
    }
  }

  if (matchedItem) {
    const isAskingHowToWrite =
      lower.includes("ghi sao") ||
      lower.includes("viết sao") ||
      lower.includes("viết như thế nào") ||
      lower.includes("cách viết") ||
      lower.includes("cách ghi");

    let explanationContent = "";
    if (isAskingHowToWrite && matchedItem.strokeGuide) {
      explanationContent = `Từ **"${matchedKey.toUpperCase()}"** trong tiếng Trung được viết là: **${matchedItem.zh}** (Phiên âm Pinyin: **${matchedItem.pinyin}**).\n\n✍️ **Hướng dẫn cách viết**:\n${matchedItem.strokeGuide}\n\n💡 **Ý nghĩa bộ thủ & Mẹo nhớ**:\n${matchedItem.radicals || "Gồm các nét chữ Hán quy chuẩn theo HSK."}`;
    } else {
      explanationContent = `Thầy giáo AI giải đáp: Từ/khái niệm **"${matchedKey}"** trong tiếng Trung tương ứng là **${matchedItem.zh}** (Phiên âm: **${matchedItem.pinyin}**).\n\n📖 Nghĩa tiếng Việt: **${matchedItem.meaningVn}**${matchedItem.sinoVn ? ` (Âm Hán Việt: *${matchedItem.sinoVn}*)` : ""}.`;
    }

    return {
      content: explanationContent,
      breakdown: {
        originalZh: matchedItem.zh,
        pinyin: matchedItem.pinyin,
        vietnameseTranslation: matchedItem.meaningVn,
        direction: "vn_to_zh",
        partOfSpeech: matchedItem.partOfSpeech,
        vocabBreakdown: matchedItem.vocabBreakdown || [
          { word: matchedItem.zh, pinyin: matchedItem.pinyin, meaningVn: matchedItem.meaningVn, partOfSpeech: matchedItem.partOfSpeech },
        ],
        grammarAnalysis: matchedItem.grammarAnalysis || [
          "Phát âm chuẩn theo thanh điệu và ngữ cảnh giao tiếp tự nhiên.",
        ],
        naturalUsageExamples: matchedItem.examples || [
          { zh: `${matchedItem.zh}，很好！`, pinyin: `${matchedItem.pinyin}, hěn hǎo!`, vn: `${matchedItem.meaningVn}, rất tốt!` },
        ],
      },
      engine: "offline-knowledge-base",
    };
  }

  // CHECK 2: If query contains pure Chinese characters
  const chineseMatches = trimmed.match(/[\u4e00-\u9fa5]+/g);
  if (chineseMatches && chineseMatches.length > 0) {
    const targetZh = chineseMatches.join("");
    const generatedPinyin = pinyin(targetZh, { toneType: "symbol" });

    return {
      content: `Thầy giáo AI đã phân tích chữ Hán "${targetZh}" của bạn:`,
      breakdown: {
        originalZh: targetZh,
        pinyin: generatedPinyin,
        vietnameseTranslation: `Chữ Hán: ${targetZh}`,
        vocabBreakdown: [
          { word: targetZh, pinyin: generatedPinyin, meaningVn: "Mục từ tiếng Trung", partOfSpeech: "Từ vựng" },
        ],
        grammarAnalysis: [
          `Độ dài: ${targetZh.length} chữ Hán. Hãy chú ý thanh điệu khi phát âm.`,
        ],
        naturalUsageExamples: [
          { zh: `${targetZh}。`, pinyin: generatedPinyin, vn: "Ví dụ phát âm và ngữ cảnh chuẩn." },
        ],
      },
      engine: "offline-chinese-parser",
    };
  }

  // CHECK 3: Honest, Pedagogical Fallback when word is unknown offline
  return {
    content: `**Cố Vấn Sách AI · HANZI** đã nhận câu hỏi: **"${trimmed}"**.\n\n⚠️ Hiện tại hệ thống đang ở chế độ **Từ Điển & Danh Mục Sách Nội Bộ** (chưa nhập Gemini API Key Cloud), và mục từ này chưa có trong kho tra nhanh.\n\n💡 **Độc giả có thể thử hỏi ngay:**\n- Tư vấn chọn sách: *"Mất gốc nên mua sách nào?"*, *"Tư vấn sách luyện viết thư pháp"*...\n- Tra từ & bút thuận: *"Bố ghi sao?"*, *"Mẹ viết thế nào?"*, *"Xin chào"*, *"Cảm ơn"*, *"Bao nhiêu tiền"*...\n- Phân biệt ngữ pháp HSK: *"Phân biệt 二 và 两"*, *"Giải thích câu 我是昨天坐飞机来的"*!`,
    breakdown: null,
    engine: "offline-fallback",
  };
}
