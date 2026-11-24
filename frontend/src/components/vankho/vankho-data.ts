import { ICategory } from "@/interfaces/category";
import {
  BookEditionFormat,
  IBookEdition,
  IProduct,
} from "@/interfaces/product";

export interface CoverFlowCardStyle {
  translateX: number;
  translateZ: number;
  rotateY: number;
  scale: number;
  opacity: number;
  blur: number;
  zIndex: number;
  isVisible: boolean;
}

export interface VocabSampleItem {
  hanzi: string;
  pinyin: string;
  meaning: string;
  exampleZh: string;
  examplePinyin: string;
  exampleVn: string;
}

export interface CourseArchivalMeta {
  volumeCode: string;
  sealChar: string;
  chineseSubtitle: string;
  shortTimelineTag: string;
  chapterTitle: string;
  tagline: string;
  accentHex: string;
  spineColor: string;
  bookCoverImage: string;
  isDedicatedBookCover: boolean;
  vocabSamples: VocabSampleItem[];
}

export interface EditorialCourseCollection {
  id: string;
  indexLabel: string;
  seasonTag: string;
  title: string;
  subtitle: string;
  editorialNote: string;
  coverImage: string;
  accentColor: string;
  products: IProduct[];
}

export const FREE_SHIPPING_THRESHOLD = 300000;
export const STANDARD_SHIPPING_FEE = 25000;

export const BOXSET_BOOK_MAP: Record<
  string,
  Array<{ bookId: string; edition: BookEditionFormat }>
> = {
  "boxset-starter": [
    { bookId: "hsk-1", edition: "paperback" },
    { bookId: "pinyin-master", edition: "paperback" },
    { bookId: "pictograph-500", edition: "paperback" },
    { bookId: "calligraphy-workbook", edition: "paperback" },
  ],
  "boxset-hsk-1-6": [
    { bookId: "hsk-1", edition: "paperback" },
    { bookId: "hsk-2", edition: "paperback" },
    { bookId: "hsk-3", edition: "paperback" },
    { bookId: "hsk-4", edition: "paperback" },
    { bookId: "hsk-5", edition: "paperback" },
    { bookId: "hsk-6", edition: "paperback" },
  ],
  "boxset-exam-pro": [
    { bookId: "grammar-all", edition: "paperback" },
    { bookId: "vocab-5000-srs", edition: "paperback" },
    { bookId: "hsk-mock-456", edition: "paperback" },
    { bookId: "hskk-speaking", edition: "paperback" },
  ],
  "boxset-comm-life": [
    { bookId: "comm-301", edition: "paperback" },
    { bookId: "comm-travel", edition: "paperback" },
    { bookId: "slang-youth", edition: "paperback" },
    { bookId: "campus-scholarship", edition: "paperback" },
  ],
  "boxset-business-vip": [
    { bookId: "biz-taobao", edition: "paperback" },
    { bookId: "biz-office", edition: "paperback" },
    { bookId: "biz-logistics", edition: "paperback" },
    { bookId: "biz-livestream", edition: "paperback" },
    { bookId: "biz-factory-qc", edition: "paperback" },
  ],
  "boxset-collector-heritage": [
    { bookId: "radicals-214", edition: "hardcover" },
    { bookId: "idioms-chengyu", edition: "hardcover" },
    { bookId: "tang-poetry-300", edition: "hardcover" },
    { bookId: "chinese-culture-history", edition: "hardcover" },
    { bookId: "culinary-tea", edition: "hardcover" },
  ],
};

export function normalizeVietnamese(input: string): string {
  return (input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

export function parseVndPrice(priceStr?: string): number {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

export function formatVnd(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  return `${safe.toLocaleString("vi-VN")}₫`;
}

export function resolveBookEditions(product: IProduct): {
  paperback: IBookEdition;
  hardcover: IBookEdition;
} {
  const fallbackBase = parseVndPrice(product.price) || 159000;
  const fallbackHard = Math.round((fallbackBase * 1.48) / 1000) * 1000;

  const baseIsbn =
    product.isbn || `978-7-5619-${String(product.id).slice(0, 4)}-1`;
  const hardIsbn = product.isbn
    ? `${product.isbn.slice(0, -1)}8`
    : `978-7-5619-${String(product.id).slice(0, 4)}-8`;

  return {
    paperback: {
      label: product.editions?.paperback?.label || "Bìa mềm tiêu chuẩn",
      price: product.editions?.paperback?.price ?? fallbackBase,
      stock: product.editions?.paperback?.stock ?? 22,
      isbn: product.editions?.paperback?.isbn || baseIsbn,
      dimensions:
        product.editions?.paperback?.dimensions ||
        "18.5 × 26 cm · Giấy kem chống lóa",
    },
    hardcover: {
      label: product.editions?.hardcover?.label || "Bìa cứng vải bố dập nhũ",
      price: product.editions?.hardcover?.price ?? fallbackHard,
      stock: product.editions?.hardcover?.stock ?? 8,
      isbn: product.editions?.hardcover?.isbn || hardIsbn,
      dimensions:
        product.editions?.hardcover?.dimensions ||
        "19 × 26.5 cm · Khâu chỉ mở phẳng 180°",
    },
  };
}

export function clampProgress(
  progress: number,
  count: number,
  allowOverscroll = false
): number {
  if (!Number.isFinite(progress) || count <= 1) {
    return 0;
  }
  const maxIndex = count - 1;
  if (!allowOverscroll) {
    return Math.max(0, Math.min(maxIndex, progress));
  }
  const maxOverscroll = 0.35;
  if (progress < 0) {
    return -Math.min(maxOverscroll, Math.abs(progress) * 0.35);
  }
  if (progress > maxIndex) {
    return maxIndex + Math.min(maxOverscroll, (progress - maxIndex) * 0.35);
  }
  return progress;
}

export function snapProgress(progress: number, count: number, velocity = 0): number {
  if (!Number.isFinite(progress) || count <= 1) {
    return 0;
  }
  const velocityBias = Number.isFinite(velocity)
    ? Math.max(-0.45, Math.min(0.45, velocity * 0.25))
    : 0;
  const target = Math.round(progress + velocityBias);
  return Math.max(0, Math.min(count - 1, target));
}

export function computeCoverFlowStyle(
  index: number,
  activeProgress: number,
  isCompactViewport = false,
  reducedMotion = false
): CoverFlowCardStyle {
  const safeProgress = Number.isFinite(activeProgress) ? activeProgress : 0;
  const offset = index - safeProgress;
  const absOffset = Math.abs(offset);
  const direction = offset === 0 ? 0 : Math.sign(offset);

  const visibleRadius = isCompactViewport ? 2.6 : 4.2;
  const isVisible = absOffset <= visibleRadius;

  if (!isVisible) {
    return {
      translateX: direction * (isCompactViewport ? 420 : 760),
      translateZ: -420,
      rotateY: -direction * 42,
      scale: 0.62,
      opacity: 0,
      blur: 2,
      zIndex: 1,
      isVisible: false,
    };
  }

  const baseStep = isCompactViewport ? 148 : 210;
  const outerStep = isCompactViewport ? 92 : 122;
  const primaryDist = Math.min(absOffset, 1) * baseStep;
  const secondaryDist = Math.max(0, absOffset - 1) * outerStep;
  const translateX = direction * (primaryDist + secondaryDist);

  const translateZ = reducedMotion
    ? 0
    : -Math.min(340, absOffset * 92 + Math.max(0, absOffset - 1) * 28);
  const rotateY = reducedMotion
    ? 0
    : -direction * Math.min(44, Math.min(absOffset, 1) * 28 + Math.max(0, absOffset - 1) * 7);

  const scale = Math.max(
    0.64,
    1 - Math.min(absOffset, 1) * 0.16 - Math.max(0, absOffset - 1) * 0.065
  );
  const opacity = Math.max(
    0,
    1 - Math.max(0, absOffset - 0.15) * (isCompactViewport ? 0.42 : 0.22)
  );
  const blur = reducedMotion ? 0 : Math.max(0, (absOffset - 1.35) * 0.65);
  const zIndex = Math.max(1, Math.round(50 - absOffset * 10));

  const round1 = (n: number) => {
    const r = Math.round(n * 10) / 10;
    return r === 0 ? 0 : r;
  };
  const round2 = (n: number) => {
    const r = Math.round(n * 100) / 100;
    return r === 0 ? 0 : r;
  };
  const round3 = (n: number) => {
    const r = Math.round(n * 1000) / 1000;
    return r === 0 ? 0 : r;
  };

  return {
    translateX: round1(translateX),
    translateZ: round1(translateZ),
    rotateY: round1(rotateY),
    scale: round3(scale),
    opacity: round3(opacity),
    blur: round2(blur),
    zIndex,
    isVisible: true,
  };
}

const ARCHIVAL_COURSE_MAP: Record<
  string,
  Omit<CourseArchivalMeta, "volumeCode" | "isDedicatedBookCover">
> = {
  "hsk-1": {
    sealChar: "壹",
    chineseSubtitle: "汉语水平考试 · 一级标准教程",
    shortTimelineTag: "HSK 1",
    chapterTitle: "Trích trang 14 · Chào hỏi & Biến điệu chuẩn Bắc Kinh",
    tagline: "Ấn bản nhập môn 240 trang in 2 màu trên giấy kem 100gsm, kèm sổ bài tập & QR Audio.",
    accentHex: "#D97706",
    spineColor: "#1f3a2e",
    bookCoverImage: "/images/book-covers/hsk-1.jpg",
    vocabSamples: [
      {
        hanzi: "你好",
        pinyin: "nǐ hǎo",
        meaning: "Xin chào (lời chào trang nhã thường nhật)",
        exampleZh: "你好，很高兴认识你！",
        examplePinyin: "Nǐ hǎo, hěn gāoxìng rènshi nǐ!",
        exampleVn: "Xin chào, rất vui được làm quen với bạn!",
      },
      {
        hanzi: "学习",
        pinyin: "xué xí",
        meaning: "Học tập, nghiền ngẫm",
        exampleZh: "我每天看书学习汉语。",
        examplePinyin: "Wǒ měitiān kànshū xuéxí Hànyǔ.",
        exampleVn: "Tôi đọc sách học tiếng Trung mỗi ngày.",
      },
      {
        hanzi: "谢谢",
        pinyin: "xiè xie",
        meaning: "Cảm ơn",
        exampleZh: "谢谢送我这本好书。",
        examplePinyin: "Xièxie sòng wǒ zhè běn hǎo shū.",
        exampleVn: "Cảm ơn đã tặng tôi cuốn sách hay này.",
      },
    ],
  },
  "hsk-2": {
    sealChar: "贰",
    chineseSubtitle: "汉语水平考试 · 二级标准教程",
    shortTimelineTag: "HSK 2",
    chapterTitle: "Trích trang 48 · Thời gian, Lịch trình & Đời sống",
    tagline: "Mở rộng 300 mục từ sơ trung cấp, hệ thống bảng ngữ pháp so sánh trực quan dễ tra cứu.",
    accentHex: "#B45309",
    spineColor: "#1b2c42",
    bookCoverImage: "/images/book-covers/hsk-2.jpg",
    vocabSamples: [
      {
        hanzi: "准备",
        pinyin: "zhǔn bèi",
        meaning: "Chuẩn bị, sẵn sàng",
        exampleZh: "我已经准备好考试了。",
        examplePinyin: "Wǒ yǐjīng zhǔnbèi hǎo kǎoshì le.",
        exampleVn: "Tôi đã chuẩn bị sẵn sàng cho kỳ thi rồi.",
      },
      {
        hanzi: "觉得",
        pinyin: "jué de",
        meaning: "Cảm thấy, cho rằng",
        exampleZh: "我觉得汉字很有意思。",
        examplePinyin: "Wǒ juéde Hànzì hěn yǒuyìsi.",
        exampleVn: "Tôi cảm thấy chữ Hán rất thú vị.",
      },
      {
        hanzi: "便宜",
        pinyin: "pián yi",
        meaning: "Phải chăng, tiết kiệm",
        exampleZh: "这套书打折后很便宜。",
        examplePinyin: "Zhè tào shū dǎzhé hòu hěn piányi.",
        exampleVn: "Bộ sách này sau khi ưu đãi giá rất phải chăng.",
      },
    ],
  },
  "hsk-3": {
    sealChar: "叁",
    chineseSubtitle: "汉语水平考试 · 三级中级教程",
    shortTimelineTag: "HSK 3",
    chapterTitle: "Trích trang 96 · Văn bản thuần chữ Hán & Câu chữ 把",
    tagline: "Bước chuyển sang đọc văn bản không phụ thuộc Pinyin với 600 từ vựng và bài đọc chuyên sâu.",
    accentHex: "#C2410C",
    spineColor: "#5c2318",
    bookCoverImage: "/images/book-covers/hsk-3.jpg",
    vocabSamples: [
      {
        hanzi: "机会",
        pinyin: "jī huì",
        meaning: "Cơ hội, dịp may",
        exampleZh: "这是一个去中国留学的好机会。",
        examplePinyin: "Zhè shì yí gè qù Zhōngguó liúxué de hǎo jīhuì.",
        exampleVn: "Đây là cơ hội tốt để đi du học Trung Quốc.",
      },
      {
        hanzi: "认真",
        pinyin: "rèn zhēn",
        meaning: "Chăm chú, nghiêm túc",
        exampleZh: "他在图书馆非常认真地看书。",
        examplePinyin: "Tā zài túshūguǎn fēicháng rènzhēn de kànshū.",
        exampleVn: "Anh ấy đọc sách vô cùng chăm chú trong thư viện.",
      },
      {
        hanzi: "习惯",
        pinyin: "xí guàn",
        meaning: "Thói quen, quen với",
        exampleZh: "我已经习惯早起读书了。",
        examplePinyin: "Wǒ yǐjīng xíguàn zǎoqǐ dúshū le.",
        exampleVn: "Tôi đã quen với việc dậy sớm đọc sách rồi.",
      },
    ],
  },
  "hsk-4": {
    sealChar: "肆",
    chineseSubtitle: "汉语水平考试 · 四级高阶精编",
    shortTimelineTag: "HSK 4",
    chapterTitle: "Trích trang 142 · Nghị luận Học thuật & Tứ tự Thành ngữ",
    tagline: "Tuyển tập 1.200 mục từ trung cao cấp và kỹ thuật viết đoạn văn nghị luận 80–120 chữ.",
    accentHex: "#9F1239",
    spineColor: "#4a1c28",
    bookCoverImage: "/images/book-covers/hsk-4.jpg",
    vocabSamples: [
      {
        hanzi: "积累",
        pinyin: "jī lěi",
        meaning: "Tích lũy (kiến thức, kinh nghiệm)",
        exampleZh: "阅读是积累词汇最好的方法。",
        examplePinyin: "Yuèdú shì jīlěi cíhuì zuì hǎo de fāngfǎ.",
        exampleVn: "Đọc sách là phương pháp tốt nhất để tích lũy từ vựng.",
      },
      {
        hanzi: "丰富",
        pinyin: "fēng fù",
        meaning: "Phong phú, dồi dào",
        exampleZh: "这本书的内容非常丰富。",
        examplePinyin: "Zhè běn shū de nèiróng fēicháng fēngfù.",
        exampleVn: "Nội dung của cuốn sách này vô cùng phong phú.",
      },
      {
        hanzi: "坚持不懈",
        pinyin: "jiān chí bú xiè",
        meaning: "Kiên trì bền bỉ không ngừng nghỉ",
        exampleZh: "只要坚持不懈，一定能成功。",
        examplePinyin: "Zhǐyào jiānchí búxiè, yídìng néng chénggōng.",
        exampleVn: "Chỉ cần kiên trì không ngừng, nhất định sẽ thành công.",
      },
    ],
  },
  "comm-travel": {
    sealChar: "旅",
    chineseSubtitle: "实用旅游与生活口语手册",
    shortTimelineTag: "Du lịch",
    chapterTitle: "Trích trang 52 · Ga tàu cao tốc, Khách sạn & Ẩm thực",
    tagline: "Sổ tay bỏ túi giấy chống thấm nhẹ với 100+ mẫu đối thoại thực tế tại Bắc Kinh – Hàng Châu.",
    accentHex: "#A16207",
    spineColor: "#1c3844",
    bookCoverImage: "/images/book-covers/comm-travel.jpg",
    vocabSamples: [
      {
        hanzi: "地铁站",
        pinyin: "dì tiě zhàn",
        meaning: "Ga tàu điện ngầm",
        exampleZh: "请问，最近的地铁站在哪儿？",
        examplePinyin: "Qǐngwèn, zuìjìn de dìtiězhàn zài nǎr?",
        exampleVn: "Xin hỏi, ga tàu điện ngầm gần nhất ở đâu ạ?",
      },
      {
        hanzi: "买单",
        pinyin: "mǎi dān",
        meaning: "Thanh toán hóa đơn",
        exampleZh: "服务员，请帮我买单。",
        examplePinyin: "Fúwùyuán, qǐng bāng wǒ mǎidān.",
        exampleVn: "Bạn phục vụ ơi, vui lòng thanh toán giúp tôi.",
      },
      {
        hanzi: "打折",
        pinyin: "dǎ zhé",
        meaning: "Chiết khấu, giảm giá",
        exampleZh: "买两本可以打折吗？",
        examplePinyin: "Mǎi liǎng běn kěyǐ dǎzhé ma?",
        exampleVn: "Mua hai quyển có được giảm giá không?",
      },
    ],
  },
  "biz-taobao": {
    sealChar: "商",
    chineseSubtitle: "淘宝 · 1688 跨境电商谈判实务",
    shortTimelineTag: "Thương mại",
    chapterTitle: "Trích trang 88 · Đàm phán giá sỉ & Hợp đồng xưởng",
    tagline: "Cẩm nang thực chiến 500+ thuật ngữ logistics, kiểm định mẫu và kịch bản chat AliWangWang.",
    accentHex: "#92400E",
    spineColor: "#261e1b",
    bookCoverImage: "/images/book-covers/biz-taobao.jpg",
    vocabSamples: [
      {
        hanzi: "批发价",
        pinyin: "pī fā jià",
        meaning: "Giá bán sỉ tận xưởng",
        exampleZh: "如果我订五百件，批发价是多少？",
        examplePinyin: "Rúguǒ wǒ dìng wǔbǎi jiàn, pīfājià shì duōshao?",
        exampleVn: "Nếu tôi đặt 500 sản phẩm thì giá sỉ là bao nhiêu?",
      },
      {
        hanzi: "包邮",
        pinyin: "bāo yóu",
        meaning: "Miễn phí vận chuyển nội địa",
        exampleZh: "发到广州仓库包邮吗？",
        examplePinyin: "Fā dào Guǎngzhōu cāngkù bāoyóu ma?",
        exampleVn: "Gửi tới kho Quảng Châu có được bao phí ship không?",
      },
      {
        hanzi: "现货",
        pinyin: "xiàn huò",
        meaning: "Hàng có sẵn trong kho",
        exampleZh: "这款有现货吗？今天能发货吗？",
        examplePinyin: "Zhè kuǎn yǒu xiànhuò ma? Jīntiān néng fāhuò ma?",
        exampleVn: "Mẫu này có sẵn hàng không? Hôm nay xuất kho luôn được không?",
      },
    ],
  },
  "pinyin-master": {
    sealChar: "音",
    chineseSubtitle: "现代汉语拼音与汉字笔顺精讲",
    shortTimelineTag: "Pinyin",
    chapterTitle: "Trích trang 22 · Tứ thanh Bắc Kinh & Vĩnh Tự Bát Pháp",
    tagline: "Ấn phẩm khâu chỉ cổ điển minh họa khẩu hình thanh mẫu, vận mẫu và 8 quy tắc thuận bút.",
    accentHex: "#B45309",
    spineColor: "#786244",
    bookCoverImage: "/images/book-covers/pinyin-master.jpg",
    vocabSamples: [
      {
        hanzi: "汉字",
        pinyin: "Hàn zì",
        meaning: "Chữ Hán (văn tự biểu ý)",
        exampleZh: "写汉字要先横后竖。",
        examplePinyin: "Xiě Hànzì yào xiān héng hòu shù.",
        exampleVn: "Viết chữ Hán cần viết nét ngang trước, nét sổ sau.",
      },
      {
        hanzi: "声调",
        pinyin: "shēng diào",
        meaning: "Thanh điệu (4 thanh chính + khinh thanh)",
        exampleZh: "普通话有四个基本声调。",
        examplePinyin: "Pǔtōnghuà yǒu sì gè jīběn shēngdiào.",
        exampleVn: "Tiếng Phổ thông có 4 thanh điệu cơ bản.",
      },
      {
        hanzi: "发音",
        pinyin: "fā yīn",
        meaning: "Phát âm chuẩn xác",
        exampleZh: "你的中文发音非常标准。",
        examplePinyin: "Nǐ de Zhōngwén fāyīn fēicháng biāozhǔn.",
        exampleVn: "Phát âm tiếng Trung của bạn vô cùng chuẩn xác.",
      },
    ],
  },
  "radicals-214": {
    sealChar: "部",
    chineseSubtitle: "康熙字典 · 二百一十四部首字源",
    shortTimelineTag: "214 Bộ thủ",
    chapterTitle: "Trích trang 64 · Từ Giáp Cốt Văn đến Khải Thư Hiện Đại",
    tagline: "Từ điển 416 trang truy nguyên hình vẽ Giáp cốt – Kim văn – Tiểu triện của trọn bộ 214 bộ thủ.",
    accentHex: "#B91C1C",
    spineColor: "#6e261a",
    bookCoverImage: "/images/book-covers/radicals-214.jpg",
    vocabSamples: [
      {
        hanzi: "部首",
        pinyin: "bù shǒu",
        meaning: "Bộ thủ (gốc cấu tạo chữ Hán)",
        exampleZh: "认识部首能帮你快速记住汉字。",
        examplePinyin: "Rènshi bùshǒu néng bāng nǐ kuàisù jìzhù Hànzì.",
        exampleVn: "Nhận biết bộ thủ giúp bạn ghi nhớ chữ Hán cực nhanh.",
      },
      {
        hanzi: "象形",
        pinyin: "xiàng xíng",
        meaning: "Chữ tượng hình (mô phỏng sự vật)",
        exampleZh: "“日”和“月”都是典型的象形字。",
        examplePinyin: "“Rì” hé “Yuè” dōu shì diǎnxíng de xiàngxíngzì.",
        exampleVn: "Chữ Nhật (mặt trời) và Nguyệt (mặt trăng) đều là chữ tượng hình điển hình.",
      },
      {
        hanzi: "山水",
        pinyin: "shān shuǐ",
        meaning: "Sơn thủy — núi non và sông nước",
        exampleZh: "桂林山水甲天下。",
        examplePinyin: "Guìlín shānshuǐ jiǎ tiānxià.",
        exampleVn: "Phong cảnh sơn thủy Quế Lâm đẹp nhất thiên hạ.",
      },
    ],
  },
  "calligraphy-workbook": {
    sealChar: "書",
    chineseSubtitle: "米字格硬笔书法 · 汉字字帖",
    shortTimelineTag: "Thư pháp",
    chapterTitle: "Trích trang 18 · Luyện chữ Khải thư trên ô Mễ Tự (米字格)",
    tagline: "Vở luyện viết định lượng dày 120gsm không thấm mực với chữ mẫu in mờ 500 chữ Hán cốt lõi.",
    accentHex: "#475569",
    spineColor: "#222933",
    bookCoverImage: "/images/book-covers/calligraphy-workbook.jpg",
    vocabSamples: [
      {
        hanzi: "书香",
        pinyin: "shū xiāng",
        meaning: "Hương sách, truyền thống hiếu học",
        exampleZh: "书香致远，墨韵留芳。",
        examplePinyin: "Shūxiāng zhìyuǎn, mòyùn liúfāng.",
        exampleVn: "Hương sách vươn xa, nét mực lưu truyền vẻ đẹp.",
      },
      {
        hanzi: "笔顺",
        pinyin: "bǐ shùn",
        meaning: "Bút thuận (thứ tự các nét viết)",
        exampleZh: "写字要注意正确的笔顺。",
        examplePinyin: "Xiězì yào zhùyì zhèngquè de bǐshùn.",
        exampleVn: "Khi luyện chữ cần chú ý đúng thứ tự nét bút.",
      },
      {
        hanzi: "楷书",
        pinyin: "kǎi shū",
        meaning: "Khải thư (chữ viết chân phương chuẩn mực)",
        exampleZh: "初学者应该先练好楷书。",
        examplePinyin: "Chūxuézhě yīnggāi xiān liànhǎo kǎishū.",
        exampleVn: "Người mới bắt đầu nên luyện vững chữ Khải thư trước.",
      },
    ],
  },
  "hsk-5": {
    sealChar: "伍",
    chineseSubtitle: "汉语水平考试 · 五级标准教程",
    shortTimelineTag: "HSK 5",
    chapterTitle: "Trích trang 76 · Tản văn Đương đại & Sắc thái Từ đồng nghĩa",
    tagline: "2.500 mục từ cao cấp, 36 bài đọc báo chí – văn học và phương pháp viết đoạn nghị luận 80 chữ.",
    accentHex: "#0E7490",
    spineColor: "#123A4A",
    bookCoverImage: "/images/book-covers/hsk-5.jpg",
    vocabSamples: [
      {
        hanzi: "视野",
        pinyin: "shì yě",
        meaning: "Tầm nhìn, nhãn quan rộng mở",
        exampleZh: "阅读经典能开拓我们的视野。",
        examplePinyin: "Yuèdú jīngdiǎn néng kāituò wǒmen de shìyě.",
        exampleVn: "Đọc tác phẩm kinh điển giúp mở rộng tầm nhìn của chúng ta.",
      },
      {
        hanzi: "独立",
        pinyin: "dú lì",
        meaning: "Độc lập, tự chủ",
        exampleZh: "培养独立思考的能力非常重要。",
        examplePinyin: "Péiyǎng dúlì sīkǎo de nénglì fēicháng zhòngyào.",
        exampleVn: "Bồi dưỡng năng lực tư duy độc lập vô cùng quan trọng.",
      },
    ],
  },
  "hsk-6": {
    sealChar: "陆",
    chineseSubtitle: "汉语水平考试 · 六级学术精修",
    shortTimelineTag: "HSK 6",
    chapterTitle: "Trích trang 184 · Giải phẫu Bệnh câu (病句) & Tóm tắt 400 chữ",
    tagline: "Ấn phẩm đỉnh cao 448 trang bao quát 5.000+ mục từ học thuật, thành ngữ cao cấp và dịch thuật.",
    accentHex: "#B45309",
    spineColor: "#18181B",
    bookCoverImage: "/images/book-covers/hsk-6.jpg",
    vocabSamples: [
      {
        hanzi: "潜移默化",
        pinyin: "qián yí mò huà",
        meaning: "Mưa dầm thấm lâu, chuyển biến âm thầm",
        exampleZh: "好书对人的影响是潜移默化的。",
        examplePinyin: "Hǎo shū duì rén de yǐngxiǎng shì qiányímòhuà de.",
        exampleVn: "Ảnh hưởng của sách hay đối với con người là mưa dầm thấm lâu.",
      },
      {
        hanzi: "严谨",
        pinyin: "yán jǐn",
        meaning: "Chặt chẽ, nghiêm cẩn (học thuật)",
        exampleZh: "这位学者的治学态度十分严谨。",
        examplePinyin: "Zhè wèi xuézhě de zhìxué tàidù shífēn yánjǐn.",
        exampleVn: "Thái độ nghiên cứu của vị học giả này vô cùng nghiêm cẩn.",
      },
    ],
  },
  "grammar-all": {
    sealChar: "法",
    chineseSubtitle: "现代汉语实用语法大全",
    shortTimelineTag: "Ngữ pháp",
    chapterTitle: "Trích trang 62 · Bổ ngữ Xu hướng & Hư từ Đối chiếu",
    tagline: "280 cấu trúc ngữ pháp sơ – trung – cao cấp hệ thống bằng sơ đồ bảng biểu dễ tra cứu.",
    accentHex: "#9A3412",
    spineColor: "#5C2D16",
    bookCoverImage: "/images/book-covers/grammar-all.jpg",
    vocabSamples: [
      {
        hanzi: "既然…就…",
        pinyin: "jì rán … jiù …",
        meaning: "Đã… thì… (liên từ suy luận nhân quả)",
        exampleZh: "既然选择了远方，就只顾风雨兼程。",
        examplePinyin: "Jìrán xuǎnzé le yuǎnfāng, jiù zhǐgù fēngyǔ jiānchéng.",
        exampleVn: "Đã chọn phương xa thì cứ vững bước vượt qua nắng mưa.",
      },
      {
        hanzi: "把字句",
        pinyin: "bǎ zì jù",
        meaning: "Câu chữ 把 (nhấn mạnh sự tác động lên tân ngữ)",
        exampleZh: "请把那本词典递给我。",
        examplePinyin: "Qǐng bǎ nà běn cídiǎn dì gěi wǒ.",
        exampleVn: "Vui lòng đưa cuốn từ điển kia cho tôi.",
      },
    ],
  },
  "hsk-mock-123": {
    sealChar: "试",
    chineseSubtitle: "新汉语水平考试 · 初中级真题集",
    shortTimelineTag: "Đề HSK 1–3",
    chapterTitle: "Trích Đề số 05 · Phân tích Từ khóa Bẫy Nghe Hiểu",
    tagline: "20 bộ đề sát hạch chuẩn phòng thi máy tính kèm đáp án giải thích chi tiết và QR Audio.",
    accentHex: "#15803D",
    spineColor: "#2E4F3E",
    bookCoverImage: "/images/book-covers/hsk-mock-123.jpg",
    vocabSamples: [
      {
        hanzi: "复习",
        pinyin: "fù xí",
        meaning: "Ôn tập củng cố bài vở",
        exampleZh: "考前要认真复习生词和语法。",
        examplePinyin: "Kǎo qián yào rènzhēn fùxí shēngcí hé yǔfǎ.",
        exampleVn: "Trước kỳ thi cần chăm chỉ ôn tập từ mới và ngữ pháp.",
      },
      {
        hanzi: "满分",
        pinyin: "mǎn fēn",
        meaning: "Điểm tối đa, điểm tuyệt đối",
        exampleZh: "这次听力考试她拿了满分。",
        examplePinyin: "Zhè cì tīnglì kǎoshì tā ná le mǎnfēn.",
        exampleVn: "Bài thi nghe lần này cô ấy đạt điểm tuyệt đối.",
      },
    ],
  },
  "hsk-mock-456": {
    sealChar: "考",
    chineseSubtitle: "新汉语水平考试 · 高分实战模拟卷",
    shortTimelineTag: "Đề HSK 4–6",
    chapterTitle: "Trích Đề số 09 · Chiến thuật Đọc lướt 40 giây & Luận mẫu",
    tagline: "15 bộ đề phân hóa điểm cao 260+ kèm 30 bài luận mẫu chấm chữa chi tiết.",
    accentHex: "#991B1B",
    spineColor: "#6B1D24",
    bookCoverImage: "/images/book-covers/hsk-mock-456.jpg",
    vocabSamples: [
      {
        hanzi: "关键",
        pinyin: "guān jiàn",
        meaning: "Mấu chốt, then chốt quyết định",
        exampleZh: "抓准关键词是快速阅读的秘诀。",
        examplePinyin: "Zhuāzhǔn guānjiàncí shì kuàisù yuèdú de mìjué.",
        exampleVn: "Bắt đúng từ khóa là bí quyết của kỹ năng đọc nhanh.",
      },
      {
        hanzi: "逻辑",
        pinyin: "luó ji",
        meaning: "Mạch logic, lập luận chặt chẽ",
        exampleZh: "写议论文要注意上下文的逻辑。",
        examplePinyin: "Xiě yìlùnwén yào zhùyì shàngxiàwén de luóji.",
        exampleVn: "Khi viết văn nghị luận cần chú ý mạch logic của ngữ cảnh.",
      },
    ],
  },
  "hskk-speaking": {
    sealChar: "语",
    chineseSubtitle: "汉语水平口语考试 · 应试宝典",
    shortTimelineTag: "Thi HSKK",
    chapterTitle: "Trích trang 44 · Tốc ký Nghe nhắc lại & Khung lập luận 2 phút",
    tagline: "Bao trọn 3 cấp HSKK Sơ – Trung – Cao cấp phục vụ hồ sơ xét học bổng Trung Quốc.",
    accentHex: "#B45309",
    spineColor: "#7C4D1E",
    bookCoverImage: "/images/book-covers/hskk-speaking.jpg",
    vocabSamples: [
      {
        hanzi: "流利",
        pinyin: "liú lì",
        meaning: "Lưu loát, trôi chảy tự nhiên",
        exampleZh: "她说得一口流利的普通话。",
        examplePinyin: "Tā shuō de yì kǒu liúlì de Pǔtōnghuà.",
        exampleVn: "Cô ấy nói tiếng Phổ thông vô cùng lưu loát.",
      },
      {
        hanzi: "表达",
        pinyin: "biǎo dá",
        meaning: "Diễn đạt, bày tỏ quan điểm",
        exampleZh: "请用两分钟清楚地表达你的看法。",
        examplePinyin: "Qǐng yòng liǎng fēnzhōng qīngchu de biǎodá nǐ de kànfǎ.",
        exampleVn: "Hãy dùng 2 phút diễn đạt rõ ràng quan điểm của bạn.",
      },
    ],
  },
  "vocab-5000-srs": {
    sealChar: "词",
    chineseSubtitle: "新标准五千词 · 词根思维导图",
    shortTimelineTag: "5000 Từ",
    chapterTitle: "Trích Sơ đồ #18 · Họ chữ Tâm (心) & Lịch ôn ngắt quãng SRS",
    tagline: "120 sơ đồ tư duy gốc chữ Hán giúp học 1 chữ gốc suy ra cả chùm 20 từ ghép HSK 3.0.",
    accentHex: "#1D4ED8",
    spineColor: "#1E2942",
    bookCoverImage: "/images/book-covers/vocab-5000-srs.jpg",
    vocabSamples: [
      {
        hanzi: "联想",
        pinyin: "lián xiǎng",
        meaning: "Liên tưởng, kết nối mạng lưới ý nghĩa",
        exampleZh: "词根联想能帮我们记住更多生词。",
        examplePinyin: "Cígēn liánxiǎng néng bāng wǒmen jìzhù gèng duō shēngcí.",
        exampleVn: "Liên tưởng theo gốc chữ giúp chúng ta nhớ được nhiều từ mới hơn.",
      },
      {
        hanzi: "记忆",
        pinyin: "jì yì",
        meaning: "Trí nhớ, ghi nhớ bền lâu",
        exampleZh: "间隔重复是最科学的记忆方法。",
        examplePinyin: "Jiàngé chóngfù shì zuì kēxué de jìyì fāngfǎ.",
        exampleVn: "Lặp lại ngắt quãng là phương pháp ghi nhớ khoa học nhất.",
      },
    ],
  },
  "pictograph-500": {
    sealChar: "象",
    chineseSubtitle: "汉字图解五百字 · 字源插画本",
    shortTimelineTag: "Tượng hình",
    chapterTitle: "Trích trang 36 · Nhật Nguyệt Sơn Xuyên & Tranh Khắc Gỗ Cổ",
    tagline: "500 chữ Hán nền tảng minh họa bằng tranh khắc mộc bản 2 màu son – vàng dễ nhớ ngay lập tức.",
    accentHex: "#B45309",
    spineColor: "#8B6E4E",
    bookCoverImage: "/images/book-covers/pictograph-500.jpg",
    vocabSamples: [
      {
        hanzi: "明",
        pinyin: "míng",
        meaning: "Sáng tỏ (Mặt trời 日 + Mặt trăng 月 cùng chiếu sáng)",
        exampleZh: "窗前明月光。",
        examplePinyin: "Chuāng qián míngyuè guāng.",
        exampleVn: "Trước đầu giường ánh trăng sáng chiếu rọi.",
      },
      {
        hanzi: "休",
        pinyin: "xiū",
        meaning: "Nghỉ ngơi (Người 亻 tựa lưng vào gốc cây 木)",
        exampleZh: "累了就在树下休息一会儿。",
        examplePinyin: "Lèi le jiù zài shù xià xiūxi yíhuìr.",
        exampleVn: "Mệt rồi thì nghỉ ngơi một lát dưới tán cây.",
      },
    ],
  },
  "running-script-copybook": {
    sealChar: "帖",
    chineseSubtitle: "唐诗经典 · 行楷钢笔字帖",
    shortTimelineTag: "Hành Khải",
    chapterTitle: "Trích trang 28 · Kỹ pháp Liên bút & Thơ Vương Duy",
    tagline: "Tập chép chữ Hành Khải thanh thoát qua 60 bài thơ Đường đóng chỉ cổ điển kèm 40 tờ giấy can.",
    accentHex: "#4D7C0F",
    spineColor: "#3F4E38",
    bookCoverImage: "/images/book-covers/running-script-copybook.jpg",
    vocabSamples: [
      {
        hanzi: "行楷",
        pinyin: "xíng kǎi",
        meaning: "Hành khải (lối viết tay thanh thoát, tốc độ nhanh)",
        exampleZh: "日常书写用行楷既快又美观。",
        examplePinyin: "Rìcháng shūxiě yòng xíngkǎi jì kuài yòu měiguān.",
        exampleVn: "Viết hằng ngày bằng chữ Hành Khải vừa nhanh vừa đẹp mắt.",
      },
      {
        hanzi: "清风",
        pinyin: "qīng fēng",
        meaning: "Làn gió thanh mát",
        exampleZh: "明月松间照，清泉石上流。",
        examplePinyin: "Míngyuè sōng jiān zhào, qīngquán shí shàng liú.",
        exampleVn: "Trăng sáng soi qua kẽ thông, suối trong chảy trên ghềnh đá.",
      },
    ],
  },
  "comm-301": {
    sealChar: "话",
    chineseSubtitle: "汉语会话三百零一句 · 典藏修订版",
    shortTimelineTag: "301 Câu",
    chapterTitle: "Trích Bài 12 · Gặp gỡ, Hỏi thăm & Đời sống Thường nhật",
    tagline: "Giáo trình đàm thoại kinh điển giúp hàng triệu người Việt bật phản xạ nghe nói trong 8 tuần.",
    accentHex: "#9F1239",
    spineColor: "#581C2C",
    bookCoverImage: "/images/book-covers/comm-301.jpg",
    vocabSamples: [
      {
        hanzi: "认识",
        pinyin: "rèn shi",
        meaning: "Quen biết, làm quen",
        exampleZh: "认识你我真高兴！",
        examplePinyin: "Rènshi nǐ wǒ zhēn gāoxìng!",
        exampleVn: "Được làm quen với bạn tôi thực sự rất vui!",
      },
      {
        hanzi: "顺便",
        pinyin: "shùn biàn",
        meaning: "Nhân tiện, tiện thể",
        exampleZh: "你去书店的时候，顺便帮我买一本。",
        examplePinyin: "Nǐ qù shūdiàn de shíhou, shùnbiàn bāng wǒ mǎi yì běn.",
        exampleVn: "Lúc bạn ghé hiệu sách, tiện thể mua giúp tôi một quyển nhé.",
      },
    ],
  },
  "slang-youth": {
    sealChar: "潮",
    chineseSubtitle: "当代潮流口语 · 社交网络热词",
    shortTimelineTag: "Từ lóng",
    chapterTitle: "Trích trang 70 · Ngôn ngữ Douyin, Xiaohongshu & GenZ",
    tagline: "Giải mã 400 cụm từ thịnh hành nhất mạng xã hội Trung Quốc để trò chuyện tự nhiên như bạn bản xứ.",
    accentHex: "#0F766E",
    spineColor: "#134E4A",
    bookCoverImage: "/images/book-covers/slang-youth.jpg",
    vocabSamples: [
      {
        hanzi: "种草",
        pinyin: "zhòng cǎo",
        meaning: "Gieo tương tư món đồ hay (review khiến người khác muốn mua)",
        exampleZh: "看她的读书笔记，我被种草了好几本书。",
        examplePinyin: "Kàn tā de dúshū bǐjì, wǒ bèi zhòngcǎo le hǎo jǐ běn shū.",
        exampleVn: "Xem ghi chép đọc sách của cô ấy, tôi mê luôn mấy đầu sách.",
      },
      {
        hanzi: "打卡",
        pinyin: "dǎ kǎ",
        meaning: "Check-in địa điểm hoặc duy trì thói quen mỗi ngày",
        exampleZh: "今天是我背单词打卡的第三十天。",
        examplePinyin: "Jīntiān shì wǒ bèi dāncí dǎkǎ de dì sānshí tiān.",
        exampleVn: "Hôm nay là ngày thứ 30 tôi check-in học từ vựng đều đặn.",
      },
    ],
  },
  "campus-scholarship": {
    sealChar: "学",
    chineseSubtitle: "中国留学口语 · 奖学金面试指南",
    shortTimelineTag: "Du học CSC",
    chapterTitle: "Trích trang 92 · Phỏng vấn Hội đồng Giáo sư & Kế hoạch Học tập",
    tagline: "120 câu hỏi phỏng vấn học bổng CSC/CIS, mẫu Study Plan song ngữ và giao tiếp giảng đường.",
    accentHex: "#1D4ED8",
    spineColor: "#1E3A5F",
    bookCoverImage: "/images/book-covers/campus-scholarship.jpg",
    vocabSamples: [
      {
        hanzi: "奖学金",
        pinyin: "jiǎng xué jīn",
        meaning: "Học bổng",
        exampleZh: "他成功申请到了中国政府奖学金。",
        examplePinyin: "Tā chénggōng shēnqǐng dào le Zhōngguó Zhèngfǔ Jiǎngxuéjīn.",
        exampleVn: "Anh ấy đã nộp thành công học bổng Chính phủ Trung Quốc.",
      },
      {
        hanzi: "导师",
        pinyin: "dǎo shī",
        meaning: "Giáo sư hướng dẫn luận văn",
        exampleZh: "我下午要去办公室见我的导师。",
        examplePinyin: "Wǒ xiàwǔ yào qù bàngōngshì jiàn wǒ de dǎoshī.",
        exampleVn: "Chiều nay tôi cần lên văn phòng gặp giáo sư hướng dẫn.",
      },
    ],
  },
  "culinary-tea": {
    sealChar: "茶",
    chineseSubtitle: "中华八大菜系与茶道文化辞典",
    shortTimelineTag: "Trà & Vị",
    chapterTitle: "Trích trang 108 · Lục Đại Trà Loại & Văn hóa Bàn tiệc",
    tagline: "Hơn 800 từ vựng tinh tế về 8 trường phái ẩm thực Trung Hoa, ấm Tử Sa và nghệ thuật thưởng trà.",
    accentHex: "#B45309",
    spineColor: "#8C3B2B",
    bookCoverImage: "/images/book-covers/culinary-tea.jpg",
    vocabSamples: [
      {
        hanzi: "品茶",
        pinyin: "pǐn chá",
        meaning: "Thưởng trà, nhâm nhi hương vị trà",
        exampleZh: "周末和老朋友一起品茶聊天。",
        examplePinyin: "Zhōumò hé lǎo péngyou yìqǐ pǐnchá liáotiān.",
        exampleVn: "Cuối tuần cùng bạn hiền thưởng trà trò chuyện.",
      },
      {
        hanzi: "色香味",
        pinyin: "sè xiāng wèi",
        meaning: "Sắc – Hương – Vị vẹn toàn",
        exampleZh: "这道菜真是色香味俱全。",
        examplePinyin: "Zhè dào cài zhēn shì sèxiāngwèi jùquán.",
        exampleVn: "Món ăn này quả thực hội tụ đủ cả sắc, hương lẫn vị.",
      },
    ],
  },
  "biz-office": {
    sealChar: "务",
    chineseSubtitle: "商务办公汉语 · 邮件会议与合同",
    shortTimelineTag: "Công sở",
    chapterTitle: "Trích trang 58 · Kính ngữ Email Thương mại & Họp Báo cáo Quý",
    tagline: "90 mẫu email công sở, thuyết trình KPI và 15 mẫu hợp đồng lao động – thương mại song ngữ.",
    accentHex: "#334155",
    spineColor: "#1E293B",
    bookCoverImage: "/images/book-covers/biz-office.jpg",
    vocabSamples: [
      {
        hanzi: "附件",
        pinyin: "fù jiàn",
        meaning: "Tệp đính kèm (trong email công việc)",
        exampleZh: "报价单已放在邮件附件里，请查收。",
        examplePinyin: "Bàojiàdān yǐ fàng zài yóujiàn fùjiàn lǐ, qǐng cháshōu.",
        exampleVn: "Bảng báo giá đã đính kèm trong email, kính mong anh/chị kiểm tra.",
      },
      {
        hanzi: "合作愉快",
        pinyin: "hé zuò yú kuài",
        meaning: "Hợp tác vui vẻ, thuận lợi",
        exampleZh: "希望我们这次项目合作愉快！",
        examplePinyin: "Xīwàng wǒmen zhè cì xiàngmù hézuò yúkuài!",
        exampleVn: "Hy vọng dự án lần này của chúng ta hợp tác tốt đẹp!",
      },
    ],
  },
  "biz-logistics": {
    sealChar: "运",
    chineseSubtitle: "中越跨境贸易 · 报关与国际物流",
    shortTimelineTag: "Logistics",
    chapterTitle: "Trích trang 116 · Bộ chứng từ C/O Form E & Thông quan Chính ngạch",
    tagline: "Từ điển 1.800 thuật ngữ xuất nhập khẩu, vận tải biển – bộ và quy trình khai báo hải quan.",
    accentHex: "#0369A1",
    spineColor: "#163B50",
    bookCoverImage: "/images/book-covers/biz-logistics.jpg",
    vocabSamples: [
      {
        hanzi: "报关单",
        pinyin: "bào guān dān",
        meaning: "Tờ khai hải quan xuất nhập khẩu",
        exampleZh: "请核对一下报关单上的货物数量。",
        examplePinyin: "Qǐng héduì yíxià bàoguāndān shàng de huòwù shùliàng.",
        exampleVn: "Vui lòng đối chiếu lại số lượng hàng hóa trên tờ khai hải quan.",
      },
      {
        hanzi: "提单",
        pinyin: "tí dān",
        meaning: "Vận đơn đường biển (Bill of Lading)",
        exampleZh: "正本提单已经寄给客户了。",
        examplePinyin: "Zhèngběn tídān yǐjīng jì gěi kèhù le.",
        exampleVn: "Vận đơn gốc đã được chuyển phát cho khách hàng rồi.",
      },
    ],
  },
  "biz-livestream": {
    sealChar: "播",
    chineseSubtitle: "直播带货话术 · 杭州电商实战录",
    shortTimelineTag: "Livestream",
    chapterTitle: "Trích trang 40 · Kịch bản Giữ chân 3 giây đầu & Thuật ngữ GMV",
    tagline: "300 câu chốt đơn chuẩn streamer Hàng Châu và từ vựng làm việc với chuỗi cung ứng MCN.",
    accentHex: "#9333EA",
    spineColor: "#3B1938",
    bookCoverImage: "/images/book-covers/biz-livestream.jpg",
    vocabSamples: [
      {
        hanzi: "上链接",
        pinyin: "shàng liàn jiē",
        meaning: "Ghim giỏ hàng / lên link sản phẩm ngay",
        exampleZh: "倒数三秒，马上给大家上链接！",
        examplePinyin: "Dàoshǔ sān miǎo, mǎshàng gěi dàjiā shàng liànjiē!",
        exampleVn: "Đếm ngược 3 giây, lên link sản phẩm ngay cho mọi người đây!",
      },
      {
        hanzi: "供应链",
        pinyin: "gōng yìng liàn",
        meaning: "Chuỗi cung ứng hàng hóa",
        exampleZh: "稳定的供应链是直播间的核心优势。",
        examplePinyin: "Wěndìng de gōngyìngliàn shì zhíbōjiān de héxīn yōushì.",
        exampleVn: "Chuỗi cung ứng ổn định là lợi thế cốt lõi của phòng livestream.",
      },
    ],
  },
  "biz-factory-qc": {
    sealChar: "质",
    chineseSubtitle: "工厂生产管理 · 品质检验实用汉语",
    shortTimelineTag: "Nhà máy QC",
    chapterTitle: "Trích trang 134 · Họp giao ban đầu ca, Tiêu chuẩn 5S & Báo cáo AQL",
    tagline: "2.000 thuật ngữ kỹ thuật 6 ngành sản xuất dành cho phiên dịch hiện trường, kỹ sư và QC/QA.",
    accentHex: "#B45309",
    spineColor: "#33241B",
    bookCoverImage: "/images/book-covers/biz-factory-qc.jpg",
    vocabSamples: [
      {
        hanzi: "合格率",
        pinyin: "hé gé lǜ",
        meaning: "Tỷ lệ hàng đạt chuẩn chất lượng",
        exampleZh: "本月的生产合格率达到了百分之九十九。",
        examplePinyin: "Běn yuè de shēngchǎn hégélǜ dádào le bǎifēnzhī jiǔshíjiǔ.",
        exampleVn: "Tỷ lệ sản phẩm đạt chuẩn tháng này đã chạm mốc 99%.",
      },
      {
        hanzi: "抽检",
        pinyin: "chōu jiǎn",
        meaning: "Kiểm tra xác suất lấy mẫu lô hàng",
        exampleZh: "出货前品保部门必须进行严格抽检。",
        examplePinyin: "Chūhuò qián pǐnbǎo bùmén bìxū jìnxíng yángé chōujiǎn.",
        exampleVn: "Trước khi xuất hàng bộ phận QA bắt buộc kiểm mẫu nghiêm ngặt.",
      },
    ],
  },
  "idioms-chengyu": {
    sealChar: "典",
    chineseSubtitle: "中华成语故事一百篇 · 汉越双语注",
    shortTimelineTag: "Thành ngữ",
    chapterTitle: "Trích Điển tích #24 · Họa Long Điểm Tình & Cách dùng Hiện đại",
    tagline: "100 câu chuyện lịch sử đằng sau các thành ngữ bốn chữ kinh điển trình bày song ngữ Trung – Việt.",
    accentHex: "#B45309",
    spineColor: "#6E471F",
    bookCoverImage: "/images/book-covers/idioms-chengyu.jpg",
    vocabSamples: [
      {
        hanzi: "画龙点睛",
        pinyin: "huà lóng diǎn jīng",
        meaning: "Vẽ rồng điểm mắt (thêm chi tiết đắt giá làm bừng sáng tác phẩm)",
        exampleZh: "最后这一句总结起到了画龙点睛的作用。",
        examplePinyin: "Zuìhòu zhè yí jù zǒngjié qǐdào le huàlóngdiǎnjīng de zuòyòng.",
        exampleVn: "Câu tổng kết cuối cùng này đóng vai trò điểm nhãn đắt giá.",
      },
      {
        hanzi: "学无止境",
        pinyin: "xué wú zhǐ jìng",
        meaning: "Biển học mênh mông không có bến bờ dừng lại",
        exampleZh: "知识如大海，学无止境。",
        examplePinyin: "Zhīshi rú dàhǎi, xuéwúzhǐjìng.",
        exampleVn: "Tri thức tựa biển lớn, sự học không có điểm dừng.",
      },
    ],
  },
  "bilingual-short-stories": {
    sealChar: "文",
    chineseSubtitle: "当代汉越双语短篇小说精选",
    shortTimelineTag: "Truyện ngắn",
    chapterTitle: "Trích Truyện #06 · Mưa Đêm Giang Nam (Dàn trang đối chiếu song ngữ)",
    tagline: "18 truyện ngắn ấm áp trình bày trang trái chữ Hán – trang phải dịch Việt kèm chú thích chân trang.",
    accentHex: "#4338CA",
    spineColor: "#2E3552",
    bookCoverImage: "/images/book-covers/bilingual-short-stories.jpg",
    vocabSamples: [
      {
        hanzi: "温暖",
        pinyin: "wēn nuǎn",
        meaning: "Ấm áp, dịu dàng",
        exampleZh: "这篇小故事让人心里觉得很温暖。",
        examplePinyin: "Zhè piān xiǎo gùshi ràng rén xīnlǐ juéde hěn wēnnuǎn.",
        exampleVn: "Câu chuyện nhỏ này khiến lòng người cảm thấy thật ấm áp.",
      },
      {
        hanzi: "回忆",
        pinyin: "huí yì",
        meaning: "Hồi ức, kỷ niệm đẹp",
        exampleZh: "童年的时光是最珍贵的回忆。",
        examplePinyin: "Tóngnián de shíguāng shì zuì zhēnguì de huíyì.",
        exampleVn: "Năm tháng tuổi thơ là hồi ức trân quý nhất.",
      },
    ],
  },
  "tang-poetry-300": {
    sealChar: "诗",
    chineseSubtitle: "唐诗三百首 · 拼音汉越诗译珍藏本",
    shortTimelineTag: "Thơ Đường",
    chapterTitle: "Trích Quyển Thượng · Lý Bạch, Đỗ Phủ, Vương Duy & Thi pháp Đường luật",
    tagline: "Tuyệt tác sưu tầm hội tụ 5 tầng: Nguyên tác – Pinyin – Hán Việt – Dịch nghĩa – Bản dịch thơ danh tiếng.",
    accentHex: "#15803D",
    spineColor: "#52685B",
    bookCoverImage: "/images/book-covers/tang-poetry-300.jpg",
    vocabSamples: [
      {
        hanzi: "知音",
        pinyin: "zhī yīn",
        meaning: "Tri âm, người bạn thấu hiểu tấm lòng",
        exampleZh: "海内存知己，天涯若比邻。",
        examplePinyin: "Hǎinèi cún zhījǐ, tiānyá ruò bǐlín.",
        exampleVn: "Bốn bể còn tri kỷ, chân trời cũng tựa láng giềng gần.",
      },
      {
        hanzi: "意境",
        pinyin: "yì jìng",
        meaning: "Ý cảnh nghệ thuật sâu lắng trong thơ họa",
        exampleZh: "王维的山水诗意境非常优美。",
        examplePinyin: "Wáng Wéi de shānshuǐshī yìjìng fēicháng yōuměi.",
        exampleVn: "Ý cảnh trong thơ sơn thủy của Vương Duy vô cùng tuyệt mỹ.",
      },
    ],
  },
  "chinese-culture-history": {
    sealChar: "礼",
    chineseSubtitle: "中国传统文化 · 节俗与历史概览",
    shortTimelineTag: "Văn hóa",
    chapterTitle: "Trích Chuyên đề 08 · Kiến trúc Cổ, Ngọc Bích & Lễ Tết Bốn Mùa",
    tagline: "16 chuyên đề khảo cứu văn minh Hoa Hạ, phong tục lễ Tết và nghệ thuật giao tế Á Đông.",
    accentHex: "#9F1239",
    spineColor: "#4F1524",
    bookCoverImage: "/images/book-covers/chinese-culture-history.jpg",
    vocabSamples: [
      {
        hanzi: "传统",
        pinyin: "chuán tǒng",
        meaning: "Truyền thống văn hóa lâu đời",
        exampleZh: "中秋节赏月是古老的传统习俗。",
        examplePinyin: "Zhōngqiūjié shǎngyuè shì gǔlǎo de chuántǒng xísú.",
        exampleVn: "Ngắm trăng dịp Tết Trung Thu là phong tục truyền thống lâu đời.",
      },
      {
        hanzi: "礼仪",
        pinyin: "lǐ yí",
        meaning: "Lễ nghi, phép tắc ứng xử lịch thiệp",
        exampleZh: "了解文化礼仪有助于跨文化交流。",
        examplePinyin: "Liǎojiě wénhuà lǐyí yǒuzhùyú kuàwénhuà jiāoliú.",
        exampleVn: "Am hiểu lễ nghi văn hóa giúp ích lớn cho giao lưu liên văn hóa.",
      },
    ],
  },
};

export function getCourseArchivalMeta(
  product: IProduct,
  index: number
): CourseArchivalMeta {
  const idStr = String(product.id);
  const volumeCode = String(index + 1).padStart(2, "0");
  const preset = ARCHIVAL_COURSE_MAP[idStr];

  if (preset) {
    return {
      volumeCode,
      isDedicatedBookCover: true,
      ...preset,
    };
  }

  const hasDedicatedCover = Boolean(product.image?.includes("/book-covers/"));

  return {
    volumeCode,
    sealChar: "書",
    chineseSubtitle: "汉学文库 · 精选汉语藏书",
    shortTimelineTag: product.level ? product.level.slice(0, 12) : `Tập ${volumeCode}`,
    chapterTitle: "Trích trang 08 · Mục từ & Cốt lõi Hán ngữ",
    tagline: product.desc,
    accentHex: product.color || "#D97706",
    spineColor: product.color || "#4a2518",
    bookCoverImage: product.image || "/images/book-covers/hsk-1.jpg",
    isDedicatedBookCover: hasDedicatedCover,
    vocabSamples: [
      {
        hanzi: "开卷有益",
        pinyin: "kāi juàn yǒu yì",
        meaning: "Mở trang sách ra ắt có điều bổ ích",
        exampleZh: "古人常说：开卷有益。",
        examplePinyin: "Gǔrén cháng shuō: Kāijuàn yǒuyì.",
        exampleVn: "Người xưa thường nói: Mở sách ra là có ích.",
      },
      {
        hanzi: "读书",
        pinyin: "dú shū",
        meaning: "Đọc sách, học tập",
        exampleZh: "我喜欢在安静的下午读书。",
        examplePinyin: "Wǒ xǐhuan zài ānjìng de xiàwǔ dúshū.",
        exampleVn: "Tôi thích đọc sách vào những buổi chiều tĩnh lặng.",
      },
    ],
  };
}

const EDITORIAL_SEASON_TAGS: Record<string, string> = {
  hsk: "Tủ Sách Học Thuật · Chuẩn HSK 1–6",
  exam: "Tủ Luyện Đề Sát Hạch & Ngữ Pháp Toàn Tập",
  starter: "Từ Điển Bộ Thủ · Ngữ Âm & Thư Pháp",
  communication: "Sổ Tay Khẩu Ngữ · Du Học & Trà Đạo",
  business: "Tủ Sách Ngoại Thương · Công Sở & Nhà Máy",
  literature: "Tàng Thư Văn Học Song Ngữ & Văn Hóa Cổ",
};

const EDITORIAL_FALLBACK_PLATES: Record<string, string> = {
  hsk: "/images/courses/hsk-1.jpg",
  exam: "/images/courses/hsk-2.jpg",
  starter: "/images/courses/pinyin-master.jpg",
  communication: "/images/courses/comm-travel.jpg",
  business: "/images/courses/biz-taobao.jpg",
  literature: "/images/courses/hsk-3.jpg",
};

export function buildEditorialCollections(
  categories: ICategory[],
  products: IProduct[]
): EditorialCourseCollection[] {
  const collections: EditorialCourseCollection[] = categories
    .map((cat, idx) => {
      const catId = String(cat.id);
      const catProducts = products.filter(
        (p) => String(p.categoryId) === catId
      );
      const leadImage =
        catProducts[0]?.lookbookImage ||
        EDITORIAL_FALLBACK_PLATES[catId] ||
        "/images/courses/hsk-1.jpg";

      return {
        id: catId,
        indexLabel: String(idx + 1).padStart(2, "0"),
        seasonTag:
          EDITORIAL_SEASON_TAGS[catId] ||
          cat.badge ||
          "Tủ Sách Chuyên Đề",
        title: cat.name,
        subtitle: cat.description,
        editorialNote:
          catProducts.length > 0
            ? `Bộ tuyển tập gồm ${catProducts.length} ấn phẩm in trên giấy kem chống mỏi mắt, có đủ 2 phiên bản Bìa mềm tiêu chuẩn & Bìa cứng vải bố khâu chỉ dập nhũ vàng sưu tầm.`
            : "Tủ sách chuyên đề đang được biên tập thêm ấn phẩm mới.",
        coverImage: leadImage,
        accentColor: cat.color || "#B45309",
        products: catProducts,
      };
    })
    .filter((col) => col.products.length > 0);

  if (collections.length > 0) {
    return collections;
  }

  return [
    {
      id: "all-archive",
      indexLabel: "01",
      seasonTag: "Tàng Thư Hán Ngữ · Ấn Phẩm Chọn Lọc",
      title: "Tuyển Tập Sách & Học Liệu Hán Ngữ Trọng Điểm",
      subtitle: "Từ giáo trình HSK chuẩn Bắc Kinh đến từ điển 214 bộ thủ và vở luyện thư pháp.",
      editorialNote:
        "Tất cả ấn phẩm đều được đóng gói chống sốc 3 lớp, tặng kèm bookmark lụa đỏ và mã QR nghe file Audio chuẩn bản xứ.",
      coverImage: "/images/courses/hsk-1.jpg",
      accentColor: "#B45309",
      products,
    },
  ];
}
