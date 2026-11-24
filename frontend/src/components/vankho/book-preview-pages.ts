import { IProduct } from "@/interfaces/product";
import {
  CourseArchivalMeta,
  resolveBookEditions,
  VocabSampleItem,
} from "./vankho-data";

export interface TocChapterRow {
  code: string;
  zhTitle: string;
  vnTitle: string;
  pageNo: string;
}

export interface DialogueTurn {
  speaker: string;
  zh: string;
  pinyin: string;
  vn: string;
}

export interface VocabTableRow {
  hanzi: string;
  pinyin: string;
  pos: string;
  meaning: string;
}

export interface RadicalNoteItem {
  char: string;
  radical: string;
  strokes: string;
  memoryTip: string;
}

export interface GrammarPointBlock {
  zhHeading: string;
  vnHeading: string;
  formula: string;
  usageNote: string;
  wrongZh: string;
  wrongNote: string;
  rightZh: string;
  rightPinyin: string;
  rightVn: string;
}

export interface QuizExerciseBlock {
  promptSentenceZh: string;
  promptPinyinHint: string;
  promptVn: string;
  options: Array<{ label: string; value: string; pinyin: string }>;
  correctIndex: number;
  explanation: string;
  translationChallengeVn: string;
  translationAnswerZh: string;
  translationAnswerPinyin: string;
}

export interface BookFiveSpreadPack {
  spreadLabels: readonly [string, string, string, string, string];
  imprintNote: string;
  tocRows: TocChapterRow[];
  lessonTitleZh: string;
  lessonTitleVn: string;
  dialogueTurns: DialogueTurn[];
  culturalCalloutTitle: string;
  culturalCalloutBody: string;
  vocabTable: VocabTableRow[];
  radicalNotes: RadicalNoteItem[];
  calligraphyGridChars: string[];
  grammar: GrammarPointBlock;
  modelSentences: Array<{ zh: string; pinyin: string; vn: string }>;
  quiz: QuizExerciseBlock;
  audioCode: string;
}

interface CategoryDomainPreset {
  lessonTitleZh: string;
  dialogueContext: [DialogueTurn, DialogueTurn];
  culturalTitle: string;
  culturalBody: string;
  extraVocab: VocabTableRow[];
  radicals: [RadicalNoteItem, RadicalNoteItem];
  grammar: GrammarPointBlock;
  extraSentences: Array<{ zh: string; pinyin: string; vn: string }>;
  distractors: Array<{ value: string; pinyin: string }>;
}

const DOMAIN_PRESETS: Record<string, CategoryDomainPreset> = {
  hsk: {
    lessonTitleZh: "标准课文 · 情景交际与阅读理解",
    dialogueContext: [
      {
        speaker: "王老师",
        zh: "今天我们学习新课文，大家预习生词了吗？",
        pinyin: "Jīntiān wǒmen xuéxí xīn kèwén, dàjiā yùxí shēngcí le ma?",
        vn: "Hôm nay chúng ta học bài khóa mới, cả lớp đã xem trước từ mới chưa?",
      },
      {
        speaker: "明安",
        zh: "我已经把重点词语读了三遍，还做了笔记。",
        pinyin: "Wǒ yǐjīng bǎ zhòngdiǎn cíyǔ dú le sān biàn, hái zuò le bǐjì.",
        vn: "Em đã đọc từ trọng tâm ba lượt và còn ghi chép đầy đủ vào sổ tay rồi ạ.",
      },
    ],
    culturalTitle: "Ghi chú Học thuật Chuẩn Đề Thi HSK",
    culturalBody:
      "Trong bài thi Đọc & Viết HSK, thí sinh nên học từ vựng theo cụm động – tân cố định (搭配) thay vì học từng chữ rời rạc, giúp tăng gấp đôi tốc độ chọn đáp án điền từ.",
    extraVocab: [
      {
        hanzi: "预习",
        pinyin: "yù xí",
        pos: "动 (Động)",
        meaning: "Chuẩn bị bài mới trước khi lên lớp",
      },
      {
        hanzi: "重点",
        pinyin: "zhòng diǎn",
        pos: "名 (Danh)",
        meaning: "Trọng tâm, điểm mấu chốt cần nhớ",
      },
      {
        hanzi: "流利",
        pinyin: "liú lì",
        pos: "形 (Tính)",
        meaning: "Lưu loát, trôi chảy tự nhiên",
      },
    ],
    radicals: [
      {
        char: "学",
        radical: "Bộ Tử (子 — con trẻ)",
        strokes: "8 nét · Từ trên xuống dưới",
        memoryTip: "Mái trường che chở đứa trẻ (子) đang chăm chỉ tiếp thu tri thức.",
      },
      {
        char: "语",
        radical: "Bộ Ngôn (讠— lời nói)",
        strokes: "9 nét · Trái trước phải sau",
        memoryTip: "Bộ Ngôn (讠) ghép cùng chữ Ngô (吾) biểu thị ngôn ngữ giao tiếp.",
      },
    ],
    grammar: {
      zhHeading: "重点语法 · “已经……了”与动量补语",
      vnHeading: "Cấu trúc Nhấn mạnh Hoàn thành & Bổ ngữ Động lượng",
      formula: "Chủ ngữ + 已经 (yǐjīng) + Động từ + Số lần (遍 / 次) + 了",
      usageNote:
        "Dùng “遍” (biàn) khi nhấn mạnh quá trình đọc/xem trọn vẹn từ đầu tới cuối cuốn sách hoặc bài nghe; dùng “次” (cì) khi chỉ đếm số lần lặp lại đơn thuần.",
      wrongZh: "✗ 我读三遍这本书了。",
      wrongNote: "Đặt sai vị trí bổ ngữ động lượng sau động từ khi tân ngữ xác định.",
      rightZh: "✓ 这本书我已经认真读了三遍。",
      rightPinyin: "Zhè běn shū wǒ yǐjīng rènzhēn dú le sān biàn.",
      rightVn: "Cuốn sách này tôi đã chăm chú đọc trọn vẹn ba lượt rồi.",
    },
    extraSentences: [
      {
        zh: "只要每天坚持听录音，你的听力一定会提高。",
        pinyin: "Zhǐyào měitiān jiānchí tīng lùyīn, nǐ de tīnglì yídìng huì tígāo.",
        vn: "Chỉ cần mỗi ngày kiên trì nghe băng ghi âm, kỹ năng nghe của bạn chắc chắn sẽ tiến bộ.",
      },
    ],
    distractors: [
      { value: "休息", pinyin: "xiūxi" },
      { value: "忘记", pinyin: "wàngjì" },
    ],
  },

  exam: {
    lessonTitleZh: "真题精析 · 高频考点与答题策略",
    dialogueContext: [
      {
        speaker: "考官提示",
        zh: "做阅读理解时，请先看问题再回原文找关键词。",
        pinyin: "Zuò yuèdú lǐjiě shí, qǐng xiān kàn wèntí zài huí yuánwén zhǎo guānjiàncí.",
        vn: "Khi làm phần đọc hiểu, hãy đọc câu hỏi trước rồi quay lại văn bản tìm từ khóa.",
      },
      {
        speaker: "高分考生",
        zh: "掌握同义词替换规律，能避开大部分干扰项。",
        pinyin: "Zhǎngwò tóngyìcí tìhuàn guīlǜ, néng bìkāi dàbùfen gānrǎoxiàng.",
        vn: "Nắm vững quy luật thay thế từ đồng nghĩa sẽ giúp tránh được hầu hết đáp án bẫy.",
      },
    ],
    culturalTitle: "Mẹo Phân Bổ Thời Gian Phòng Thi Thực Chiến",
    culturalBody:
      "Ở phần Nghe hiểu, 15 giây nghỉ giữa hai câu chính là thời điểm vàng để gạch chân động từ chính và phủ định từ (不, 没, 别) trong 4 đáp án A–B–C–D.",
    extraVocab: [
      {
        hanzi: "干扰项",
        pinyin: "gān rǎo xiàng",
        pos: "名 (Danh)",
        meaning: "Phương án gây nhiễu (đáp án bẫy)",
      },
      {
        hanzi: "同义词",
        pinyin: "tóng yì cí",
        pos: "名 (Danh)",
        meaning: "Từ đồng nghĩa / cận nghĩa",
      },
      {
        hanzi: "归纳",
        pinyin: "guī nà",
        pos: "动 (Động)",
        meaning: "Tổng hợp, đúc kết ý chính đoạn văn",
      },
    ],
    radicals: [
      {
        char: "考",
        radical: "Bộ Lão (耂 — từng trải)",
        strokes: "6 nét · Phẩy dài bao trùm",
        memoryTip: "Khảo thí đòi hỏi sự rèn giũa chín chắn và tích lũy bền bỉ.",
      },
      {
        char: "辨",
        radical: "Bộ Tân (辛 — sắc bén)",
        strokes: "16 nét · Đối xứng hai bên",
        memoryTip: "Hai chữ Tân (辛) kẹp nét phân định ở giữa: phân biệt rạch ròi đúng – sai.",
      },
    ],
    grammar: {
      zhHeading: "易混虚词辨析 · “才”与“就”",
      vnHeading: "Phân biệt cặp Phó từ tần suất cao trong đề thi: 才 (cái) vs 就 (jiù)",
      formula: "Thời gian + 就 + Động từ + 了 (Sớm)  |  Thời gian + 才 + Động từ (Muộn, không có 了)",
      usageNote:
        "“就” nhấn mạnh hành động diễn ra sớm, nhanh, thuận lợi; ngược lại “才” hàm ý hành động xảy ra muộn, khó khăn mới đạt được (cuối câu dùng 才 tuyệt đối không thêm 了).",
      wrongZh: "✗ 他昨天晚上十一点才回家了。",
      wrongNote: "Dùng thừa trợ từ “了” ở cuối câu có phó từ “才” chỉ sự chậm muộn.",
      rightZh: "✓ 他昨天晚上十一点才回家。",
      rightPinyin: "Tā zuótiān wǎnshang shíyī diǎn cái huíjiā.",
      rightVn: "Tối hôm qua mãi tới 11 giờ khuya anh ấy mới về đến nhà.",
    },
    extraSentences: [
      {
        zh: "无论题目多难，保持冷静才能发挥出最好水平。",
        pinyin: "Wúlùn tímù duō nán, bǎochí lěngjìng cáinéng fāhuī chū zuì hǎo shuǐpíng.",
        vn: "Bất kể đề thi khó đến đâu, giữ bình tĩnh mới phát huy được phong độ tốt nhất.",
      },
    ],
    distractors: [
      { value: "马虎", pinyin: "mǎhu" },
      { value: "放弃", pinyin: "fàngqì" },
    ],
  },

  starter: {
    lessonTitleZh: "字源与书法 · 汉字结构与运笔法则",
    dialogueContext: [
      {
        speaker: "书法导师",
        zh: "写汉字讲究“横平竖直”，落笔要先看清米字格中心。",
        pinyin: "Xiě Hànzì jiǎngjiu “héng píng shù zhí”, luòbǐ yào xiān kànqīng mǐzìgé zhōngxīn.",
        vn: "Viết chữ Hán coi trọng “ngang bằng sổ thẳng”, trước khi đặt bút cần nhìn rõ tâm ô Mễ Tự.",
      },
      {
        speaker: "学员",
        zh: "了解部首的甲骨文图画以后，记字形容易多了！",
        pinyin: "Liǎojiě bùshǒu de jiǎgǔwén túhuà yǐhòu, jì zìxíng róngyì duō le!",
        vn: "Sau khi hiểu hình vẽ Giáp cốt của bộ thủ, việc nhớ mặt chữ trở nên dễ hơn hẳn!",
      },
    ],
    culturalTitle: "Tinh Hoa Lục Thư & Quy Tắc Thuận Bút Cổ Truyền",
    culturalBody:
      "80% chữ Hán hiện đại thuộc nhóm Hình Thanh (形声字): một nửa là Bộ thủ gợi ý nghĩa (như Thủy 氵 liên quan tới nước), nửa còn lại gợi âm đọc.",
    extraVocab: [
      {
        hanzi: "结构",
        pinyin: "jié gòu",
        pos: "名 (Danh)",
        meaning: "Kết cấu bố cục chữ Hán (trái-phải, trên-dưới)",
      },
      {
        hanzi: "偏旁",
        pinyin: "piān páng",
        pos: "名 (Danh)",
        meaning: "Bộ phận cấu tạo bên cạnh chữ Hán",
      },
      {
        hanzi: "端正",
        pinyin: "duān zhèng",
        pos: "形 (Tính)",
        meaning: "Ngay ngắn, cân đối, chuẩn mực",
      },
    ],
    radicals: [
      {
        char: "永",
        radical: "Bộ Thủy (水 — dòng nước)",
        strokes: "5 nét · Vĩnh Tự Bát Pháp",
        memoryTip: "Một chữ Vĩnh (永) hội tụ đủ 8 phép viết nét cơ bản của thư pháp chữ Hán.",
      },
      {
        char: "好",
        radical: "Bộ Nữ (女) + Tử (子)",
        strokes: "6 nét · Kết cấu trái – phải",
        memoryTip: "Người mẹ (女) ôm con thơ (子) trong vòng tay — biểu tượng của sự Tốt lành.",
      },
    ],
    grammar: {
      zhHeading: "汉字笔顺七大基本规则",
      vnHeading: "7 Quy Tắc Bút Thuận Bất Di Bất Dịch Khi Viết Chữ Hán",
      formula: "Ngang trước Sổ sau (十) → Phẩy trước Mác sau (人) → Vào nhà trước đóng cửa sau (回)",
      usageNote:
        "Viết đúng thứ tự nét giúp chữ cân đối tự nhiên trên ô Mễ Tự và là nền tảng bắt buộc khi chuyển sang viết nhanh chữ Hành Khải liền nét.",
      wrongZh: "✗  viết khung kín chữ 口 / 国 trước rồi mới điền nét bên trong.",
      wrongNote: "Vi phạm quy tắc “Vào trong trước, đóng khung sau” khiến chữ bị lệch tâm.",
      rightZh: "✓ 先里头后封口：先写“玉”，最后写外框底横“国”。",
      rightPinyin: "Xiān lǐtou hòu fēngkǒu: xiān xiě “yù”, zuìhòu xiě wàikuāng dǐhéng “guó”.",
      rightVn: "Viết phần nhân Ngọc (玉) bên trong trước, nét ngang đáy đóng khung chữ Quốc (国) viết sau cùng.",
    },
    extraSentences: [
      {
        zh: "每天静心临摹二十个汉字，字迹会越来越秀丽。",
        pinyin: "Měitiān jìngxīn línmó èrshí gè Hànzì, zìjì huì yuèláiyuè xiùlì.",
        vn: "Mỗi ngày tĩnh tâm tập chép 20 chữ Hán, nét chữ sẽ ngày càng thanh tú.",
      },
    ],
    distractors: [
      { value: "草率", pinyin: "cǎoshuài" },
      { value: "模糊", pinyin: "móhu" },
    ],
  },

  communication: {
    lessonTitleZh: "实用会话 · 地道口语与生活场景",
    dialogueContext: [
      {
        speaker: "林悦",
        zh: "不好意思请问一下，这附近有口碑好的书店和茶馆吗？",
        pinyin: "Bù hǎoyìsi qǐngwèn yíxià, zhè fùjìn yǒu kǒubēi hǎo de shūdiàn hé cháguǎn ma?",
        vn: "Xin phép cho mình hỏi thăm chút, quanh đây có hiệu sách và quán trà nào được khen nhiều không?",
      },
      {
        speaker: "本地朋友",
        zh: "往前走两百米就有一家，环境很安静，扫码就能点茶。",
        pinyin: "Wǎng qián zǒu liǎngbǎi mǐ jiù yǒu yì jiā, huánjìng hěn ānjìng, sǎomǎ jiù néng diǎn chá.",
        vn: "Đi thẳng 200 mét là tới ngay một quán rất yên tĩnh, quét mã QR trên bàn là gọi trà được liền.",
      },
    ],
    culturalTitle: "Văn Hóa Giao Tiếp Đời Sống & Thanh Toán Số Tại Trung Quốc",
    culturalBody:
      "Người bản xứ rất chuộng dùng “不好意思” (Bù hǎoyìsi) mở đầu khi hỏi đường hoặc nhờ giúp đỡ nhẹ nhàng thay cho “对不起” (vốn mang sắc thái xin lỗi nặng nề hơn).",
    extraVocab: [
      {
        hanzi: "口碑",
        pinyin: "kǒu bēi",
        pos: "名 (Danh)",
        meaning: "Uy tín truyền miệng, đánh giá tốt từ khách thật",
      },
      {
        hanzi: "扫码",
        pinyin: "sǎo mǎ",
        pos: "动 (Động)",
        meaning: "Quét mã QR (WeChat Pay / Alipay / gọi món)",
      },
      {
        hanzi: "推荐",
        pinyin: "tuī jiàn",
        pos: "动 (Động)",
        meaning: "Giới thiệu, đề cử món ngon / điểm đến",
      },
    ],
    radicals: [
      {
        char: "话",
        radical: "Bộ Ngôn (讠— lời nói)",
        strokes: "8 nét · Ngôn + Thiệt (lưỡi)",
        memoryTip: "Lời nói (讠) phát ra từ đầu lưỡi (舌) tạo nên cuộc hội thoại sinh động.",
      },
      {
        char: "茶",
        radical: "Bộ Thảo (艹 — thảo mộc)",
        strokes: "9 nét · Thảo + Nhân + Mộc",
        memoryTip: "Con người (人) đứng giữa cỏ cây (艹, 木) hái búp trà xanh thanh khiết.",
      },
    ],
    grammar: {
      zhHeading: "口语委婉表达 · 动词重叠“V一下”",
      vnHeading: "Cách nói lịch sự, tự nhiên bằng lặp động từ & “一下”",
      formula: "请 + Động từ + 一下 (qǐng wèn yíxià / kàn yíxià / děng yíxià)",
      usageNote:
        "Thêm “一下” sau động từ làm câu cầu khiến mềm mại, thân thiện hơn hẳn, tránh cảm giác ra lệnh cộc lốc khi giao tiếp với người lạ hoặc nhân viên phục vụ.",
      wrongZh: "✗ 你给我看菜单！",
      wrongNote: "Câu mệnh lệnh trực tiếp dễ gây cảm giác thiếu lịch thiệp nơi công cộng.",
      rightZh: "✓ 服务员，麻烦给我看一下菜单。",
      rightPinyin: "Fúwùyuán, máfan gěi wǒ kàn yíxià càidān.",
      rightVn: "Bạn phục vụ ơi, làm phiền cho mình xem qua thực đơn một chút nhé.",
    },
    extraSentences: [
      {
        zh: "这家老字号点心店值得去打卡尝一尝。",
        pinyin: "Zhè jiā lǎozìhào diǎnxīndiàn zhídé qù dǎkǎ cháng yì cháng.",
        vn: "Tiệm điểm tâm lâu đời này rất đáng ghé check-in và thưởng thức thử.",
      },
    ],
    distractors: [
      { value: "迟到", pinyin: "chídào" },
      { value: "紧张", pinyin: "jǐnzhāng" },
    ],
  },

  business: {
    lessonTitleZh: "商务实务 · 询盘谈判与合同履约",
    dialogueContext: [
      {
        speaker: "采购经理",
        zh: "陈总您好，如果首单订购一千件，交货期和含税价怎么算？",
        pinyin: "Chén zǒng nínhǎo, rúguǒ shǒudān dìnggòu yìqiān jiàn, jiāohuòqī hé hánshuìjià zěnme suàn?",
        vn: "Chào Giám đốc Trần, nếu đơn đầu đặt 1.000 sản phẩm thì thời hạn giao hàng và giá đã gồm thuế tính thế nào?",
      },
      {
        speaker: "供应商",
        zh: "老客户我们可以给到出厂最优价，收到定金后七天内准时发货。",
        pinyin: "Lǎo kèhù wǒmen kěyǐ gěidào chūchǎng zuìyōujià, shōudào dìngjīn hòu qī tiān nèi zhǔnshí fāhuò.",
        vn: "Với đối tác thân thiết chúng tôi để mức giá xuất xưởng ưu đãi nhất, nhận cọc xong trong 7 ngày sẽ xuất hàng đúng hẹn.",
      },
    ],
    culturalTitle: "Nghi Thức Đàm Phán & Kính Ngữ Thương Mại Trung – Việt",
    culturalBody:
      "Khi làm việc với đối tác Trung Quốc trên WeChat hoặc email, luôn đặt chức danh sau họ (như 王总 Wáng zǒng, 李经理 Lǐ jīnglǐ) và xác nhận rõ báo giá là Giá xuất xưởng (EXW) hay Giá giao tới kho Quảng Châu/Bằng Tường.",
    extraVocab: [
      {
        hanzi: "交货期",
        pinyin: "jiāo huò qī",
        pos: "名 (Danh)",
        meaning: "Thời hạn giao hàng (Lead time)",
      },
      {
        hanzi: "定金",
        pinyin: "dìng jīn",
        pos: "名 (Danh)",
        meaning: "Tiền đặt cọc bảo đảm hợp đồng",
      },
      {
        hanzi: "验收",
        pinyin: "yàn shōu",
        pos: "动 (Động)",
        meaning: "Nghiệm thu, kiểm nhận lô hàng",
      },
    ],
    radicals: [
      {
        char: "货",
        radical: "Bộ Bối (贝 — vỏ sò / tiền tệ)",
        strokes: "8 nét · Hóa (化) + Bối (贝)",
        memoryTip: "Những vật phẩm có thể trao đổi thành tiền tệ (贝) chính là Hàng hóa (货).",
      },
      {
        char: "信",
        radical: "Bộ Nhân đứng (亻) + Ngôn (言)",
        strokes: "9 nét · Chữ tín thương trường",
        memoryTip: "Người (亻) giữ trọn lời nói (言) tạo nên chữ Tín (信) trong kinh doanh.",
      },
    ],
    grammar: {
      zhHeading: "商务条件复句 · “如……则……”与“一经……即……”",
      vnHeading: "Văn phong Thư tín & Điều khoản Hợp đồng Trang trọng",
      formula: "一经确认，即刻安排生产 (Ngay khi xác nhận, lập tức bố trí sản xuất)",
      usageNote:
        "Trong hợp đồng và email báo giá, người bản xứ thay khẩu ngữ “如果…就…” bằng “如…则…” hoặc “一经…即…” để câu văn ngắn gọn, đanh thép và chuyên nghiệp.",
      wrongZh: "✗ 你给我钱以后我就马上发东西给你。",
      wrongNote: "Khẩu ngữ quá suồng sã, không phù hợp dùng trong thư tín thương mại / hợp đồng.",
      rightZh: "✓ 收到贵司预付款后，我方将于三日内安排发货。",
      rightPinyin: "Shōudào guìsī yùfùkuǎn hòu, wǒfāng jiāng yú sān rì nèi ānpái fāhuò.",
      rightVn: "Sau khi nhận khoản tạm ứng của Quý công ty, phía chúng tôi sẽ thu xếp xuất hàng trong vòng 3 ngày.",
    },
    extraSentences: [
      {
        zh: "随函附上最新产品目录及报价单，敬请查收。",
        pinyin: "Suíhán fùshàng zuìxīn chǎnpǐn mùlù jí bàojiàdān, jìngqǐng cháshōu.",
        vn: "Đính kèm theo thư là danh mục sản phẩm và bảng báo giá mới nhất, kính mời Quý vị kiểm tra.",
      },
    ],
    distractors: [
      { value: "零售", pinyin: "língshòu" },
      { value: "退票", pinyin: "tuìpiào" },
    ],
  },

  literature: {
    lessonTitleZh: "经典赏析 · 汉越双语美文与文化典故",
    dialogueContext: [
      {
        speaker: "原典品读",
        zh: "读书破万卷，下笔如有神。文字里藏着千年的智慧。",
        pinyin: "Dúshū pò wàn juàn, xiàbǐ rú yǒu shén. Wénzì lǐ cángzhe qiānnián de zhìhuì.",
        vn: "Đọc sách suốt vạn quyển, hạ bút tựa có thần. Trong con chữ ẩn chứa trí tuệ ngàn năm.",
      },
      {
        speaker: "译注导读",
        zh: "对照汉越双语细读，既能品味诗词意境，又能涵养文笔。",
        pinyin: "Duìzhào Hàn-Yuè shuāngyǔ xìdú, jì néng pǐnwèi shīcí yìjìng, yòu néng hányǎng wénbǐ.",
        vn: "Đọc kỹ bản đối chiếu song ngữ Hán – Việt vừa cảm thụ trọn vẹn ý cảnh thi ca, vừa bồi đắp văn phong.",
      },
    ],
    culturalTitle: "Lời Bình Thi Pháp & Điển Cố Đông Phương",
    culturalBody:
      "Thơ văn và thành ngữ Trung Hoa chuộng nghệ thuật “Ý tại ngôn ngoại” — dùng cảnh vật thiên nhiên (trăng sáng, bến thuyền, nhành liễu, tiếng chuông chùa) để gửi gắm tâm sự con người.",
    extraVocab: [
      {
        hanzi: "典故",
        pinyin: "diǎn gù",
        pos: "名 (Danh)",
        meaning: "Điển cố, câu chuyện lịch sử ẩn sau lời văn",
      },
      {
        hanzi: "品味",
        pinyin: "pǐn wèi",
        pos: "动 (Động)",
        meaning: "Thưởng thức, chiêm nghiệm sâu sắc",
      },
      {
        hanzi: "渊源",
        pinyin: "yuān yuán",
        pos: "名 (Danh)",
        meaning: "Cội nguồn sâu xa, mạch nguồn văn hóa",
      },
    ],
    radicals: [
      {
        char: "诗",
        radical: "Bộ Ngôn (讠) + Tự (寺)",
        strokes: "8 nét · Lời ca thanh tịnh",
        memoryTip: "Lời nói (讠) ngân vang thanh thoát nơi cửa thiền (寺) kết tinh thành Thi ca (诗).",
      },
      {
        char: "典",
        radical: "Bộ Bát (八 — giá gỗ đỡ sách)",
        strokes: "8 nét · Thẻ tre đặt trên án",
        memoryTip: "Hình tượng bó thẻ sách tre quý đặt trang trọng trên giá cao thành Kinh điển (典).",
      },
    ],
    grammar: {
      zhHeading: "书面语并列句式 · “既……又……”与四字格运用",
      vnHeading: "Cấu trúc Song hành Trang nhã & Cách vận dụng Thành ngữ 4 chữ",
      formula: "Chủ ngữ + 既 (jì) + Cụm A ， 又 (yòu) + Cụm B",
      usageNote:
        "Trong văn viết, tản văn và bài luận cao cấp, việc kết hợp cấu trúc sóng đôi “既…又…” với các cụm 4 chữ cân xứng tạo nhịp điệu uyển chuyển, giàu sức thuyết phục.",
      wrongZh: "✗ 这首诗很美，还有意思很深。",
      wrongNote: "Câu văn rời rạc, khẩu ngữ chưa toát lên vẻ trang nhã của bình giảng văn học.",
      rightZh: "✓ 这首唐诗既语言凝练，又意境深远。",
      rightPinyin: "Zhè shǒu Tángshī jì yǔyán níngliàn, yòu yìjìng shēnyuǎn.",
      rightVn: "Bài thơ Đường này vừa cô đọng hàm súc về ngôn từ, vừa sâu lắng mênh mang về ý cảnh.",
    },
    extraSentences: [
      {
        zh: "温故而知新，每次重读经典都会有新的感悟。",
        pinyin: "Wēngù ér zhīxīn, měi cì chóngdú jīngdiǎn dōu huì yǒu xīn de gǎnwù.",
        vn: "Ôn cũ mà biết mới, mỗi lần đọc lại tác phẩm kinh điển đều mở ra chiêm nghiệm mới.",
      },
    ],
    distractors: [
      { value: "匆忙", pinyin: "cōngmáng" },
      { value: "平淡", pinyin: "píngdàn" },
    ],
  },
};

function extractCalligraphyChars(
  samples: VocabSampleItem[],
  chineseSubtitle: string
): string[] {
  const joined =
    samples.map((s) => s.hanzi).join("") + chineseSubtitle + "汉字书香致远";
  const matched = joined.match(/[\u4e00-\u9fa5]/g) || [];
  const unique: string[] = [];
  for (const ch of matched) {
    if (!unique.includes(ch)) {
      unique.push(ch);
    }
    if (unique.length >= 6) break;
  }
  return unique;
}

export function buildBookFiveSpreads(
  product: IProduct,
  meta: CourseArchivalMeta
): BookFiveSpreadPack {
  const catId = String(product.categoryId || "hsk");
  const domain = DOMAIN_PRESETS[catId] || DOMAIN_PRESETS.hsk;
  const totalPages = product.pages || 264;
  const editions = resolveBookEditions(product);

  const p1 = 8;
  const p2 = Math.round(totalPages * 0.18);
  const p3 = Math.round(totalPages * 0.38);
  const p4 = Math.round(totalPages * 0.62);
  const p5 = Math.round(totalPages * 0.82);
  const p6 = Math.max(p5 + 10, totalPages - 14);
  const padPage = (n: number) => String(n).padStart(3, "0");

  const feats = product.features || [];
  const cleanChapter = meta.chapterTitle.replace(/^Trích\s+[^·]+·\s*/i, "");

  const tocRows: TocChapterRow[] = [
    {
      code: "Chương 01",
      zhTitle: "导论与核心方法",
      vnTitle: cleanChapter || "Nhập môn & Phương pháp Cốt lõi",
      pageNo: padPage(p1),
    },
    {
      code: "Chương 02",
      zhTitle: "重点知识体系",
      vnTitle: feats[0] || "Hệ thống từ vựng & cấu trúc nền tảng",
      pageNo: padPage(p2),
    },
    {
      code: "Chương 03",
      zhTitle: "专题深化与实训",
      vnTitle: feats[1] || "Chuyên đề mở rộng & phân tích ngữ cảnh",
      pageNo: padPage(p3),
    },
    {
      code: "Chương 04",
      zhTitle: "应用表达与范例",
      vnTitle: feats[2] || "Mẫu câu thực tiễn & bài đọc chọn lọc",
      pageNo: padPage(p4),
    },
    {
      code: "Chương 05",
      zhTitle: "综合练习与自测",
      vnTitle: "Bài tập tổng hợp & Tự đánh giá năng lực",
      pageNo: padPage(p5),
    },
    {
      code: "Phụ lục",
      zhTitle: "参考答案与录音索引",
      vnTitle: feats[3] || "Đáp án chi tiết & Mục lục File nghe QR Audio",
      pageNo: padPage(p6),
    },
  ];

  const v0 = meta.vocabSamples[0];
  const v1 = meta.vocabSamples[1] || meta.vocabSamples[0];

  // 4-turn bilingual dialogue / passage combining book's own examples + domain context
  const dialogueTurns: DialogueTurn[] = [
    domain.dialogueContext[0],
    ...(v0
      ? [
          {
            speaker: "课文例一",
            zh: v0.exampleZh,
            pinyin: v0.examplePinyin,
            vn: v0.exampleVn,
          },
        ]
      : []),
    domain.dialogueContext[1],
    ...(v1 && v1 !== v0
      ? [
          {
            speaker: "课文例二",
            zh: v1.exampleZh,
            pinyin: v1.examplePinyin,
            vn: v1.exampleVn,
          },
        ]
      : []),
  ];

  // 5-row structured vocabulary table
  const bookVocabRows: VocabTableRow[] = meta.vocabSamples.map((s, idx) => ({
    hanzi: s.hanzi,
    pinyin: s.pinyin,
    pos: idx === 0 ? "核心 (Trọng tâm)" : "常用 (Thông dụng)",
    meaning: s.meaning,
  }));
  const vocabTable = [...bookVocabRows, ...domain.extraVocab].slice(0, 5);

  // Model sentences for Spread 4 (Page 08)
  const modelSentences = [
    ...meta.vocabSamples.map((s) => ({
      zh: s.exampleZh,
      pinyin: s.examplePinyin,
      vn: s.exampleVn,
    })),
    ...domain.extraSentences,
  ].slice(0, 3);

  // Interactive Quiz on Spread 5 (Page 09) built from v0!
  const targetWord = v0 ? v0.hanzi : "学习";
  const targetPinyin = v0 ? v0.pinyin : "xué xí";
  const rawExample = v0 ? v0.exampleZh : "我每天认真学习汉语。";
  const blankedZh = rawExample.includes(targetWord)
    ? rawExample.replace(targetWord, "（　　）")
    : `请在句中填入恰当词语：${rawExample.slice(0, -1)} — （　　）。`;

  const quiz: QuizExerciseBlock = {
    promptSentenceZh: blankedZh,
    promptPinyinHint: v0
      ? v0.examplePinyin.replace(
          new RegExp(targetPinyin.replace(/\s+/g, "\\s*"), "i"),
          "____"
        )
      : "Wǒ měitiān rènzhēn ____ Hànyǔ.",
    promptVn: v0 ? v0.exampleVn : "Tôi chăm chỉ học tiếng Trung mỗi ngày.",
    options: [
      {
        label: "A",
        value: domain.distractors[0].value,
        pinyin: domain.distractors[0].pinyin,
      },
      {
        label: "B",
        value: targetWord,
        pinyin: targetPinyin,
      },
      {
        label: "C",
        value: domain.distractors[1].value,
        pinyin: domain.distractors[1].pinyin,
      },
    ],
    correctIndex: 1,
    explanation: `Đáp án B 「${targetWord}」 (${targetPinyin} — ${
      v0 ? v0.meaning : "học tập"
    }) khớp chính xác ngữ nghĩa và cấu trúc của câu gốc: “${rawExample}”.`,
    translationChallengeVn: v1
      ? v1.exampleVn
      : domain.extraSentences[0].vn,
    translationAnswerZh: v1
      ? v1.exampleZh
      : domain.extraSentences[0].zh,
    translationAnswerPinyin: v1
      ? v1.examplePinyin
      : domain.extraSentences[0].pinyin,
  };

  return {
    spreadLabels: [
      "1. Phiêu đề & Mục lục",
      "2. Bài đọc Song ngữ",
      "3. Từ mới & Ô Mễ Tự",
      "4. Ngữ pháp Đúng/Sai",
      "5. Bài tập & Đáp án",
    ] as const,
    imprintNote: `ISBN ${editions.paperback.isbn} · Giấy kem chống mỏi mắt 100gsm · Khâu chỉ mở phẳng 180°`,
    tocRows,
    lessonTitleZh: domain.lessonTitleZh,
    lessonTitleVn: meta.chapterTitle,
    dialogueTurns,
    culturalCalloutTitle: domain.culturalTitle,
    culturalCalloutBody: domain.culturalBody,
    vocabTable,
    radicalNotes: domain.radicals,
    calligraphyGridChars: extractCalligraphyChars(
      meta.vocabSamples,
      meta.chineseSubtitle
    ),
    grammar: domain.grammar,
    modelSentences,
    quiz,
    audioCode: `HZ-${String(product.id).toUpperCase()}-AUDIO`,
  };
}
