import { pinyin } from "pinyin-pro";
import { WritingExercise, HSKLevelNumber } from "@/types";
import { WRITING_EXERCISES } from "./writing";
import { INITIAL_VOCABULARY } from "./vocabulary";
import { COMMON_RADICALS } from "./radicals-data";

export interface CustomDictEntry {
  character: string;
  pinyin: string;
  sinoVietnamese: string;
  meaningVn: string;
  hskLevel?: HSKLevelNumber;
  radical?: string;
  structure?: string;
  strokeCount?: number;
  tags?: string[];
}

// Curated dictionary of popular Chinese characters & words for handwriting practice
export const POPULAR_HANZI_DICT: CustomDictEntry[] = [
  // Tình cảm, Đạo đức, Triết lý
  { character: "爱", pinyin: "ài", sinoVietnamese: "Ái", meaningVn: "Yêu thương, tình yêu, ái mộ", hskLevel: 1, radical: "爫 (Trảo)", structure: "Kết cấu Trên - Giữa - Dưới", strokeCount: 10, tags: ["tình yêu", "yeu", "ai"] },
  { character: "福", pinyin: "fú", sinoVietnamese: "Phúc", meaningVn: "Hạnh phúc, phước lành, may mắn, tốt lành", hskLevel: 3, radical: "礻 (Kỳ/Thị)", structure: "Kết cấu Trái - Phải", strokeCount: 13, tags: ["phuc", "may man", "tet"] },
  { character: "德", pinyin: "dé", sinoVietnamese: "Đức", meaningVn: "Đạo đức, phẩm hạnh, ơn nghĩa cao đẹp", hskLevel: 4, radical: "彳 (Xích - bước ngắn)", structure: "Kết cấu Trái - Phải", strokeCount: 15, tags: ["duc", "dao duc"] },
  { character: "心", pinyin: "xīn", sinoVietnamese: "Tâm", meaningVn: "Trái tim, lòng dạ, tâm hồn, ý nghĩ", hskLevel: 2, radical: "心 (Tâm)", structure: "Kết cấu Đơn thể", strokeCount: 4, tags: ["tam", "tim", "long"] },
  { character: "美", pinyin: "měi", sinoVietnamese: "Mỹ", meaningVn: "Xinh đẹp, hoàn mỹ, tốt đẹp, mỹ lệ", hskLevel: 3, radical: "羊 (Dương - dê)", structure: "Kết cấu Trên - Dưới (Dương + Đại)", strokeCount: 9, tags: ["my", "dep", "xinh"] },
  { character: "善", pinyin: "shàn", sinoVietnamese: "Thiện", meaningVn: "Lương thiện, tốt bụng, hoàn hảo", hskLevel: 4, radical: "口 (Khẩu)", structure: "Kết cấu Trên - Dưới", strokeCount: 12, tags: ["thien", "tot"] },
  { character: "信", pinyin: "xìn", sinoVietnamese: "Tín", meaningVn: "Uy tín, niềm tin, tin tưởng, bức thư", hskLevel: 3, radical: "亻 (Nhân đứng)", structure: "Kết cấu Trái - Phải (Nhân + Ngôn)", strokeCount: 9, tags: ["tin", "uy tin", "thu"] },
  { character: "礼", pinyin: "lǐ", sinoVietnamese: "Lễ", meaningVn: "Lễ nghĩa, lịch sự, quà tặng, lễ nghi", hskLevel: 3, radical: "礻 (Kỳ/Thị)", structure: "Kết cấu Trái - Phải", strokeCount: 5, tags: ["le", "le nghi", "qua"] },
  { character: "智", pinyin: "zhì", sinoVietnamese: "Trí", meaningVn: "Trí tuệ, thông minh, mưu lược", hskLevel: 4, radical: "日 (Nhật - mặt trời)", structure: "Kết cấu Trên - Dưới", strokeCount: 12, tags: ["tri", "tri tue", "thong minh"] },
  { character: "勇", pinyin: "yǒng", sinoVietnamese: "Dũng", meaningVn: "Dũng cảm, quả cảm, can trường", hskLevel: 4, radical: "力 (Lực - sức mạnh)", structure: "Kết cấu Trên - Dưới", strokeCount: 9, tags: ["dung", "dung cam"] },
  { character: "安", pinyin: "ān", sinoVietnamese: "An", meaningVn: "Bình an, yên ổn, an toàn (người phụ nữ dưới mái nhà)", hskLevel: 2, radical: "宀 (Miên - mái nhà)", structure: "Kết cấu Trên - Dưới (Miên + Nữ)", strokeCount: 6, tags: ["an", "binh an", "yen"] },
  { character: "和", pinyin: "hé", sinoVietnamese: "Hòa", meaningVn: "Hòa bình, êm ấm, ôn hòa, cùng với", hskLevel: 1, radical: "口 (Khẩu)", structure: "Kết cấu Trái - Phải (Hòa + Khẩu)", strokeCount: 8, tags: ["hoa", "hoa binh", "va"] },
  { character: "静", pinyin: "jìng", sinoVietnamese: "Tĩnh", meaningVn: "Yên tĩnh, thanh tịnh, điềm đạm", hskLevel: 3, radical: "青 (Thanh - màu xanh)", structure: "Kết cấu Trái - Phải", strokeCount: 14, tags: ["tinh", "yen tinh", "thanh tinh"] },
  { character: "喜", pinyin: "xǐ", sinoVietnamese: "Hỷ", meaningVn: "Vui mừng, hoan hỷ, niềm vui lớn, yêu thích", hskLevel: 2, radical: "口 (Khẩu)", structure: "Kết cấu Trên - Dưới", strokeCount: 12, tags: ["hy", "vui", "mung"] },
  { character: "乐", pinyin: "lè", sinoVietnamese: "Lạc/Nhạc", meaningVn: "Vui vẻ, hạnh phúc, âm nhạc (khoái lạc)", hskLevel: 1, radical: "丿 (Phiệt/Phẩy)", structure: "Kết cấu Đơn thể", strokeCount: 5, tags: ["lac", "nhac", "vui ve"] },
  { character: "寿", pinyin: "shòu", sinoVietnamese: "Thọ", meaningVn: "Trường thọ, sống lâu, tuổi thọ", hskLevel: 4, radical: "寸 (Thốn - tấc)", structure: "Kết cấu Đơn thể", strokeCount: 7, tags: ["tho", "song lau"] },
  { character: "康", pinyin: "kāng", sinoVietnamese: "Khang", meaningVn: "Khỏe mạnh, an khang, sung túc", hskLevel: 3, radical: "广 (Quảng - mái che)", structure: "Kết cấu Nửa bao bọc", strokeCount: 11, tags: ["khang", "khoe manh", "an khang"] },
  { character: "梦", pinyin: "mèng", sinoVietnamese: "Mộng", meaningVn: "Giấc mơ, ước mơ, mộng tưởng", hskLevel: 3, radical: "木 (Mộc)", structure: "Kết cấu Trên - Dưới", strokeCount: 11, tags: ["mong", "uoc mo", "giac mo"] },

  // Linh vật & Động vật
  { character: "龙", pinyin: "lóng", sinoVietnamese: "Long", meaningVn: "Con rồng (biểu tượng quyền uy, sức mạnh)", hskLevel: 3, radical: "龙 (Long)", structure: "Kết cấu Đơn thể", strokeCount: 5, tags: ["long", "rong", "linh vat"] },
  { character: "猫", pinyin: "māo", sinoVietnamese: "Miêu", meaningVn: "Con mèo (bộ Khuyển + chữ Miêu)", hskLevel: 1, radical: "犭 (Khuyển - chó/thú)", structure: "Kết cấu Trái - Phải", strokeCount: 11, tags: ["mieu", "meo", "con meo"] },
  { character: "狗", pinyin: "gǒu", sinoVietnamese: "Cẩu", meaningVn: "Con chó (loài vật trung thành)", hskLevel: 1, radical: "犭 (Khuyển)", structure: "Kết cấu Trái - Phải", strokeCount: 8, tags: ["cau", "cho", "con cho"] },
  { character: "马", pinyin: "mǎ", sinoVietnamese: "Mã", meaningVn: "Con ngựa (nhanh nhẹn, mã đáo thành công)", hskLevel: 2, radical: "马 (Mã)", structure: "Kết cấu Đơn thể", strokeCount: 3, tags: ["ma", "ngua", "con ngua"] },
  { character: "鸟", pinyin: "niǎo", sinoVietnamese: "Điểu", meaningVn: "Con chim, loài chim muông", hskLevel: 2, radical: "鸟 (Điểu)", structure: "Kết cấu Đơn thể", strokeCount: 5, tags: ["dieu", "chim"] },
  { character: "鱼", pinyin: "yú", sinoVietnamese: "Ngư", meaningVn: "Con cá, loài cá (đồng âm với Dư - dư dả)", hskLevel: 2, radical: "鱼 (Ngư)", structure: "Kết cấu Đơn thể", strokeCount: 8, tags: ["ngu", "ca", "con ca"] },

  // Thiên nhiên & Bốn mùa
  { character: "春", pinyin: "chūn", sinoVietnamese: "Xuân", meaningVn: "Mùa xuân, sự tươi trẻ, khởi đầu mới", hskLevel: 2, radical: "日 (Nhật)", structure: "Kết cấu Trên - Dưới", strokeCount: 9, tags: ["xuan", "mua xuan", "tet"] },
  { character: "夏", pinyin: "xià", sinoVietnamese: "Hạ", meaningVn: "Mùa hạ, mùa hè, rực rỡ", hskLevel: 3, radical: "夂 (Truy)", structure: "Kết cấu Trên - Dưới", strokeCount: 10, tags: ["ha", "mua he"] },
  { character: "秋", pinyin: "qiū", sinoVietnamese: "Thu", meaningVn: "Mùa thu, mát mẻ, lãng mạn, vụ mùa gặt", hskLevel: 3, radical: "禾 (Hòa - lúa)", structure: "Kết cấu Trái - Phải", strokeCount: 9, tags: ["thu", "mua thu"] },
  { character: "冬", pinyin: "dōng", sinoVietnamese: "Đông", meaningVn: "Mùa đông, lạnh giá, yên bình", hskLevel: 3, radical: "夂 (Truy)", structure: "Kết cấu Trên - Dưới", strokeCount: 5, tags: ["dong", "mua dong"] },
  { character: "山", pinyin: "shān", sinoVietnamese: "Sơn", meaningVn: "Núi non hùng vĩ", hskLevel: 2, radical: "山 (Sơn)", structure: "Kết cấu Đơn thể", strokeCount: 3, tags: ["son", "nui"] },
  { character: "水", pinyin: "shuǐ", sinoVietnamese: "Thủy", meaningVn: "Nước uống, dòng sông, chất lỏng", hskLevel: 1, radical: "水 (Thủy)", structure: "Kết cấu Đơn thể", strokeCount: 4, tags: ["thuy", "nuoc"] },
  { character: "火", pinyin: "huǒ", sinoVietnamese: "Hỏa", meaningVn: "Ngọn lửa, sức sống, nhiệt huyết", hskLevel: 2, radical: "火 (Hỏa)", structure: "Kết cấu Đơn thể", strokeCount: 4, tags: ["hoa", "lua"] },
  { character: "日", pinyin: "rì", sinoVietnamese: "Nhật", meaningVn: "Mặt trời, ban ngày, ngày tháng", hskLevel: 1, radical: "日 (Nhật)", structure: "Kết cấu Đơn thể", strokeCount: 4, tags: ["nhat", "mat troi", "ngay"] },
  { character: "月", pinyin: "yuè", sinoVietnamese: "Nguyệt", meaningVn: "Mặt trăng, tháng, ban đêm", hskLevel: 1, radical: "月 (Nguyệt)", structure: "Kết cấu Đơn thể", strokeCount: 4, tags: ["nguyet", "mat trang", "thang"] },
  { character: "风", pinyin: "fēng", sinoVietnamese: "Phong", meaningVn: "Gió, làn gió, phong cách", hskLevel: 3, radical: "风 (Phong)", structure: "Kết cấu Nửa bao bọc", strokeCount: 4, tags: ["phong", "gio"] },
  { character: "花", pinyin: "huā", sinoVietnamese: "Hoa", meaningVn: "Bông hoa, hoa nở, tiêu xài", hskLevel: 2, radical: "艹 (Thảo)", structure: "Kết cấu Trên - Dưới", strokeCount: 7, tags: ["hoa", "bong hoa"] },
  { character: "天", pinyin: "tiān", sinoVietnamese: "Thiên", meaningVn: "Bầu trời, thượng đế, thời tiết, ngày", hskLevel: 1, radical: "大 (Đại)", structure: "Kết cấu Đơn thể", strokeCount: 4, tags: ["thien", "troi"] },
  { character: "地", pinyin: "dì", sinoVietnamese: "Địa", meaningVn: "Mặt đất, địa cầu, nơi chốn", hskLevel: 2, radical: "土 (Thổ)", structure: "Kết cấu Trái - Phải", strokeCount: 6, tags: ["dia", "dat"] },

  // Văn hóa & Đời sống
  { character: "茶", pinyin: "chá", sinoVietnamese: "Trà", meaningVn: "Lá trà, tách trà, văn hóa thưởng trà", hskLevel: 1, radical: "艹 (Thảo mộc)", structure: "Kết cấu Trên - Dưới", strokeCount: 9, tags: ["tra", "che", "uong tra"] },
  { character: "书", pinyin: "shū", sinoVietnamese: "Thư", meaningVn: "Quyển sách, viết văn, thư tịch", hskLevel: 1, radical: "乛 (Ngang móc)", structure: "Kết cấu Đơn thể", strokeCount: 4, tags: ["thu", "sach", "doc"] },
  { character: "钱", pinyin: "qián", sinoVietnamese: "Tiền", meaningVn: "Tiền bạc, tài sản, ngân lượng", hskLevel: 1, radical: "钅 (Kim)", structure: "Kết cấu Trái - Phải", strokeCount: 10, tags: ["tien", "tien bac"] },
  { character: "车", pinyin: "chē", sinoVietnamese: "Xa", meaningVn: "Chiếc xe, xe cộ, phương tiện", hskLevel: 2, radical: "车 (Xa)", structure: "Kết cấu Đơn thể", strokeCount: 4, tags: ["xa", "xe"] },
  { character: "门", pinyin: "mén", sinoVietnamese: "Môn", meaningVn: "Cánh cửa, cổng nhà, môn học", hskLevel: 2, radical: "门 (Môn)", structure: "Kết cấu Đơn thể", strokeCount: 3, tags: ["mon", "cua", "cong"] },
  { character: "酒", pinyin: "jiǔ", sinoVietnamese: "Tửu", meaningVn: "Rượu, men say, tiệc rượu", hskLevel: 3, radical: "氵 (Thủy)", structure: "Kết cấu Trái - Phải (Thủy + Dậu)", strokeCount: 10, tags: ["tuu", "ruou"] },
  { character: "友", pinyin: "yǒu", sinoVietnamese: "Hữu", meaningVn: "Bạn bè, bằng hữu, thân thiện", hskLevel: 1, radical: "又 (Hựu)", structure: "Kết cấu Nửa bao bọc", strokeCount: 4, tags: ["huu", "ban be"] },
  { character: "师", pinyin: "shī", sinoVietnamese: "Sư", meaningVn: "Thầy giáo, sư phụ, người dạy bảo", hskLevel: 1, radical: "巾 (Cân)", structure: "Kết cấu Trái - Phải", strokeCount: 6, tags: ["su", "thay", "giao vien"] },
  { character: "生", pinyin: "shēng", sinoVietnamese: "Sinh", meaningVn: "Học sinh, sự sống, sinh sôi, sinh ra", hskLevel: 1, radical: "生 (Sinh)", structure: "Kết cấu Đơn thể", strokeCount: 5, tags: ["sinh", "song", "hoc sinh"] },
];

/**
 * Searches the dictionary and vocabulary database by query (Hanzi, Pinyin, or Vietnamese meaning).
 */
export function searchCharacters(query: string): CustomDictEntry[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  // Check if query contains literal Hanzi
  const hanziMatches = query.match(/[\u4e00-\u9fa5]/g);
  if (hanziMatches && hanziMatches.length > 0) {
    const results: CustomDictEntry[] = [];
    const seen = new Set<string>();

    for (const char of hanziMatches) {
      if (seen.has(char)) continue;
      seen.add(char);

      const found = POPULAR_HANZI_DICT.find((item) => item.character === char);
      if (found) {
        results.push(found);
      } else {
        // Find in WRITING_EXERCISES
        const wrEx = WRITING_EXERCISES.find((ex) => ex.character === char);
        if (wrEx) {
          results.push({
            character: wrEx.character,
            pinyin: wrEx.pinyin,
            sinoVietnamese: wrEx.radical.split(" ")[0] || "Hán tự",
            meaningVn: wrEx.meaningVn,
            hskLevel: wrEx.hskLevel,
            radical: wrEx.radical,
            structure: wrEx.structure,
            strokeCount: wrEx.strokeCount,
          });
          continue;
        }

        // Find in INITIAL_VOCABULARY
        const vocab = INITIAL_VOCABULARY.find((v) => v.simplified.includes(char));
        if (vocab) {
          results.push({
            character: char,
            pinyin: pinyin(char, { toneType: "symbol" }),
            sinoVietnamese: "Hán tự",
            meaningVn: `${vocab.meaningVn} (trong từ "${vocab.simplified}")`,
            hskLevel: vocab.hskLevel,
            radical: vocab.radical,
            strokeCount: 6,
          });
          continue;
        }

        // Fallback for any other valid Hanzi
        results.push({
          character: char,
          pinyin: pinyin(char, { toneType: "symbol" }),
          sinoVietnamese: "Chữ Hán tùy chọn",
          meaningVn: `Chữ "${char}" (${pinyin(char, { toneType: "symbol" })})`,
          hskLevel: 1,
          radical: "Bộ thủ",
          structure: "Kết cấu chuẩn chữ Hán",
          strokeCount: 6,
        });
      }
    }

    return results;
  }

  // Non-Hanzi text: search by Pinyin or Vietnamese tags/meanings
  const matches = POPULAR_HANZI_DICT.filter((item) => {
    const pinyinLower = item.pinyin.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanNoTone = clean.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const meaningLower = item.meaningVn.toLowerCase();
    const sinoLower = item.sinoVietnamese.toLowerCase();
    const tags = item.tags || [];

    return (
      pinyinLower.includes(cleanNoTone) ||
      meaningLower.includes(clean) ||
      sinoLower.includes(clean) ||
      tags.some((t) => t.toLowerCase().includes(cleanNoTone) || cleanNoTone.includes(t.toLowerCase()))
    );
  });

  return matches.slice(0, 8);
}

/**
 * Builds a comprehensive WritingExercise object for any given single Chinese character.
 */
export function buildExerciseForChar(char: string): WritingExercise {
  // 1. Check existing preset writing exercises
  const existingWr = WRITING_EXERCISES.find((ex) => ex.character === char);
  if (existingWr) {
    return existingWr;
  }

  // 2. Check popular dictionary
  const dictEntry = POPULAR_HANZI_DICT.find((item) => item.character === char);
  const calculatedPinyin = dictEntry?.pinyin || pinyin(char, { toneType: "symbol" }) || "";

  // 3. Check vocabulary list
  const vocabEntry = INITIAL_VOCABULARY.find((v) => v.simplified.includes(char));

  // 4. Check radical dictionary
  const radEntry = COMMON_RADICALS.find((r) => r.radical === char || r.examples?.some((e) => e.zh === char));

  const meaningVn =
    dictEntry?.meaningVn ||
    (vocabEntry ? `${vocabEntry.meaningVn} (từ vựng "${vocabEntry.simplified}")` : "") ||
    (radEntry ? `Bộ ${radEntry.sinoVietnamese}: ${radEntry.meaningVn}` : "") ||
    `Chữ Hán "${char}" [${calculatedPinyin}]`;

  const radical =
    dictEntry?.radical ||
    (vocabEntry ? vocabEntry.radical : "") ||
    (radEntry ? `${radEntry.radical} (${radEntry.sinoVietnamese})` : "Chữ Hán chuẩn");

  const structure = dictEntry?.structure || "Kết cấu chữ Hán thuận bút";
  const strokeCount: number =
    dictEntry?.strokeCount ??
    (vocabEntry && vocabEntry.simplified === char && typeof vocabEntry.strokeCount === "number"
      ? vocabEntry.strokeCount
      : 6);

  // Generate generic stroke sequence labels until HanziWriter SVG data dynamically refines it
  const strokeTypes: string[] = Array.from({ length: strokeCount }, (_, i: number) => `Nét thứ ${i + 1}`);

  return {
    id: `custom-${char}-${Date.now()}`,
    hskLevel: (dictEntry?.hskLevel || vocabEntry?.hskLevel || 1) as HSKLevelNumber,
    character: char,
    pinyin: calculatedPinyin,
    meaningVn,
    strokeCount,
    radical,
    structure,
    strokeTypes,
  };
}
