export interface WordDiscriminationPair {
  id: string;
  hskLevel: number;
  pair: [string, string];
  pairPinyin: [string, string];
  titleVn: string;
  coreDifferenceVn: string;
  words: {
    word: string;
    pinyin: string;
    partOfSpeech: string;
    definitionVn: string;
    uniqueUsage: string[];
    exampleZh: string;
    examplePinyin: string;
    exampleVn: string;
  }[];
  trapNote: string;
  quiz: {
    sentenceWithBlank: string;
    pinyinWithBlank: string;
    translationVn: string;
    options: string[];
    correctIndex: number;
    explanationVn: string;
  };
}

export const WORD_DISCRIMINATION_PAIRS: WordDiscriminationPair[] = [
  {
    id: "wd-01",
    hskLevel: 4,
    pair: ["合适", "适合"],
    pairPinyin: ["héshì", "shìhé"],
    titleVn: "Phân biệt 合适 (Héshì) và 适合 (Shìhé)",
    coreDifferenceVn: "合适 là Tính từ (không mang tân ngữ phía sau); 适合 là Động từ (bắt buộc mang tân ngữ).",
    words: [
      {
        word: "合适",
        pinyin: "héshì",
        partOfSpeech: "Tính từ",
        definitionVn: "Thích hợp, vừa vặn (dùng làm vị ngữ hoặc định ngữ)",
        uniqueUsage: [
          "Thường đứng sau phó từ chỉ mức độ: 很合适, 非常合适",
          "KHÔNG được mang tân ngữ trực tiếp phía sau (Không nói: *合适你)",
          "Thường dùng cấu trúc: 对...很合适",
        ],
        exampleZh: "这件毛衣的大小很合适。",
        examplePinyin: "Zhè jiàn máoyī de dàxiǎo hěn héshì.",
        exampleVn: "Kích cỡ chiếc áo len này rất vừa vặn.",
      },
      {
        word: "适合",
        pinyin: "shìhé",
        partOfSpeech: "Động từ",
        definitionVn: "Phù hợp với ai / cái gì",
        uniqueUsage: [
          "Phía sau LUÔN mang tân ngữ: 适合 + Người/Việc (适合你, 适合初学者)",
          "Thường dùng làm vị ngữ mang tân ngữ trong câu",
        ],
        exampleZh: "这份工作很适合刚毕业的大学生。",
        examplePinyin: "Zhè fèn gōngzuò hěn shìhé gāng bìyè de dàxuéshēng.",
        exampleVn: "Công việc này rất phù hợp với sinh viên đại học mới tốt nghiệp.",
      },
    ],
    trapNote: "Mẹo nhớ thần tốc: Chữ 合 đứng sau (合适) $\rightarrow$ Tính từ. Chữ 合 đứng trước (适合) $\rightarrow$ Động từ mang tân ngữ!",
    quiz: {
      sentenceWithBlank: "这个手机的颜色非常______女孩子使用。",
      pinyinWithBlank: "Zhège shǒujī de yánsè fēicháng ______ nǚháizi shǐyòng.",
      translationVn: "Màu sắc chiếc điện thoại này rất phù hợp với các bạn nữ sử dụng.",
      options: ["合适", "适合"],
      correctIndex: 1,
      explanationVn: "Phía sau chỗ trống có cụm tân ngữ '女孩子使用' (các bạn nữ dùng), nên bắt buộc dùng động từ 适合.",
    },
  },
  {
    id: "wd-02",
    hskLevel: 4,
    pair: ["突然", "忽然"],
    pairPinyin: ["tūrán", "hūrán"],
    titleVn: "Phân biệt 突然 (Tūrán) và 忽然 (Hūrán)",
    coreDifferenceVn: "突然 là Tính từ + Phó từ (có thể làm vị ngữ, định ngữ); 忽然 chỉ là Phó từ (chỉ đứng trước động từ).",
    words: [
      {
        word: "突然",
        pinyin: "tūrán",
        partOfSpeech: "Tính từ / Phó từ",
        definitionVn: "Đột nhiên, bất ngờ, đường đột",
        uniqueUsage: [
          "Có thể làm định ngữ: 突然的变化 (sự thay đổi đột ngột)",
          "Có thể làm vị ngữ: 事情发生得很突然 (sự việc xảy ra rất bất ngờ)",
          "Có thể đi sau 很: 很突然",
        ],
        exampleZh: "这个消息太突然了，我一时无法接受。",
        examplePinyin: "Zhège xiāoxi tài tūrán le, wǒ yìshí wúfǎ jiēshòu.",
        exampleVn: "Tin tức này quá bất ngờ, tôi nhất thời chưa thể chấp nhận được.",
      },
      {
        word: "忽然",
        pinyin: "hūrán",
        partOfSpeech: "Phó từ",
        definitionVn: "Bỗng nhiên, chợt",
        uniqueUsage: [
          "CHỈ đứng trước động từ/tính từ làm trạng ngữ biểu thị hành động xảy ra chớp nhoáng",
          "KHÔNG được đi kèm 很 (Không có *很忽然)",
          "KHÔNG được làm định ngữ hay vị ngữ (Không nói *忽然的变化)",
        ],
        exampleZh: "天忽然下起大雨来了。",
        examplePinyin: "Tiān hūrán xià qǐ dàyǔ lái le.",
        exampleVn: "Trời bỗng nhiên đổ cơn mưa lớn.",
      },
    ],
    trapNote: "Nếu thấy có 很 hoặc đứng trước 的/đứng sau 得 $\rightarrow$ chắc chắn chọn 突然!",
    quiz: {
      sentenceWithBlank: "这件事发生得太______了，大家都没准备好。",
      pinyinWithBlank: "Zhè jiàn shì fāshēng de tài ______ le, dàjiā dōu méi zhǔnbèi hǎo.",
      translationVn: "Chuyện này xảy ra quá đỗi bất ngờ, mọi người đều chưa chuẩn bị kịp.",
      options: ["忽然", "突然"],
      correctIndex: 1,
      explanationVn: "Đứng sau bổ ngữ trạng thái '发生得太...' chỉ có thể là tính từ 突然, phó từ 忽然 không thể đứng sau chữ 得.",
    },
  },
  {
    id: "wd-03",
    hskLevel: 5,
    pair: ["以为", "认为"],
    pairPinyin: ["yǐwéi", "rènwéi"],
    titleVn: "Phân biệt 以为 (Yǐwéi) và 认为 (Rènwéi)",
    coreDifferenceVn: "以为 mang nghĩa 'tưởng rằng' (thực tế KHÔNG phải vậy); 认为 mang nghĩa 'cho rằng / nhận định rằng' (quan điểm khách quan nghiêm túc).",
    words: [
      {
        word: "以为",
        pinyin: "yǐwéi",
        partOfSpeech: "Động từ",
        definitionVn: "Tưởng rằng, ngỡ là (ngụ ý phán đoán sai lệch với thực tế)",
        uniqueUsage: [
          "Dùng khi thực tế đã chứng minh điều mình nghĩ trước đó là SAI",
          "Ví dụ: 我以为今天星期天，其实是星期六 (Tôi tưởng hôm nay CN, hóa ra là thứ 7)",
        ],
        exampleZh: "我以为他已经回国了，没想到今天在图书馆碰到了他。",
        examplePinyin: "Wǒ yǐwéi tā yǐjīng huíguó le, méi xiǎngdào jīntiān zài túshūguǎn pèngdào le tā.",
        exampleVn: "Tôi cứ tưởng anh ấy đã về nước rồi, không ngờ hôm nay lại gặp ở thư viện.",
      },
      {
        word: "认为",
        pinyin: "rènwéi",
        partOfSpeech: "Động từ",
        definitionVn: "Cho rằng, nhận định rằng (đưa ra phán đoán, quan điểm nghiêm túc)",
        uniqueUsage: [
          "Thể hiện lập trường, quan điểm, đánh giá mang tính logic, không ngụ ý đúng hay sai",
          "Thường dùng trong hội nghị, bài luận, báo cáo",
        ],
        exampleZh: "我们认为这个方案是最具可行性的。",
        examplePinyin: "Wǒmen rènwéi zhège fāng'àn shì zuì jù kěxíngxìng de.",
        exampleVn: "Chúng tôi nhận định rằng phương án này có tính khả thi cao nhất.",
      },
    ],
    trapNote: "Nếu vế sau có: 其实 (thực ra), 没想到 (không ngờ), 原来 (hóa ra) $\rightarrow$ 99% chọn 以为!",
    quiz: {
      sentenceWithBlank: "我______汉语很难学，但学了之后发现很有趣。",
      pinyinWithBlank: "Wǒ ______ Hànyǔ hěn nán xué, dàn xué le zhīhòu fāxiàn hěn yǒuqù.",
      translationVn: "Tôi cứ tưởng tiếng Trung khó học lắm, nhưng học rồi mới thấy rất thú vị.",
      options: ["认为", "以为"],
      correctIndex: 1,
      explanationVn: "Người nói ban đầu nghĩ tiếng Trung rất khó, nhưng vế sau 'nhưng học rồi mới thấy...' chứng minh suy nghĩ ban đầu là nhầm, nên dùng 以为 (tưởng rằng).",
    },
  },
];
