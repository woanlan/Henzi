export interface ReadingGlossaryItem {
  word: string;
  pinyin: string;
  hanViet: string;
  meaningVn: string;
}

export interface ReadingQuestion {
  id: string;
  questionZh: string;
  questionVn: string;
  options: string[];
  correctIndex: number;
  explanationVn: string;
}

export interface ReadingArticle {
  id: string;
  hskLevel: number;
  titleZh: string;
  titlePinyin: string;
  titleVn: string;
  topic: string;
  wordCount: number;
  audioText: string;
  contentZh: string[];
  contentPinyin: string[];
  translationVn: string[];
  glossary: ReadingGlossaryItem[];
  questions: ReadingQuestion[];
}

export const READING_ARTICLES: ReadingArticle[] = [
  // --- HSK 1-2 ---
  {
    id: "read-01",
    hskLevel: 2,
    titleZh: "我的北京朋友李明",
    titlePinyin: "Wǒ de Běijīng péngyou Lǐ Míng",
    titleVn: "Người Bạn Bắc Kinh Lý Minh Của Tôi",
    topic: "Đời sống & Bạn bè",
    wordCount: 140,
    audioText: "我有一个中国朋友，他的名字叫李明。李明住在北京，他是一名汉语老师。李明非常喜欢喝中国茶，每天早上都会泡一杯龙井茶。去年秋天，我第一次去北京旅游，李明带我去了故宫和长城。在北京的一个星期里，我们吃了很多好吃的中国菜，比如北京烤鸭和水饺。李明还帮我练习汉语口语，我觉得我的汉语越来越好了。今年夏天，李明计划来越南旅游，我准备带他去河内和下龙湾玩。",
    contentZh: [
      "我有一个中国朋友，他的名字叫李明。李明住在北京，他是一名汉语老师。",
      "李明非常喜欢喝中国茶，每天早上都会泡一杯龙井茶。去年秋天，我第一次去北京旅游，李明带我去了故宫和长城。",
      "在北京的一个星期里，我们吃了很多好吃的中国菜，比如北京烤鸭和水饺。李明还帮我练习汉语口语，我觉得我的汉语越来越好了。",
      "今年夏天，李明计划来越南旅游，我准备带他去河内和下龙湾玩。",
    ],
    contentPinyin: [
      "Wǒ yǒu yí gè Zhōngguó péngyou, tā de míngzi jiào Lǐ Míng. Lǐ Míng zhù zài Běijīng, tā shì yì míng Hànyǔ lǎoshī.",
      "Lǐ Míng fēicháng xǐhuan hē Zhōngguó chá, měitiān zǎoshang dōuhuì pào yì bēi Lóngjǐng chá. Qùnián qiūtiān, wǒ dì-yī cì qù Běijīng lǚyóu, Lǐ Míng dài wǒ qù le Gùgōng hé Chángchéng.",
      "Zài Běijīng de yí gè xīngqī lǐ, wǒmen chī le hěn duō hǎochī de Zhōngguó cài, bǐrú Běijīng kǎoyā hé shuǐjiǎo. Lǐ Míng hái bāng wǒ liànxí Hànyǔ kǒuyǔ, wǒ juéde wǒ de Hànyǔ yuèláiyuè hǎo le.",
      "Jīnnián xiàtiān, Lǐ Míng jìhuà lái Yuènán lǚyóu, wǒ zhǔnbèi dài tā qù Hénèi hé Xiàlóng Wān wán.",
    ],
    translationVn: [
      "Tôi có một người bạn Trung Quốc tên là Lý Minh. Lý Minh sống ở Bắc Kinh, anh ấy là một giáo viên dạy tiếng Trung.",
      "Lý Minh rất thích uống trà Trung Quốc, mỗi buổi sáng anh ấy đều pha một tách trà Long Tỉnh. Mùa thu năm ngoái, lần đầu tiên tôi đi Bắc Kinh du lịch, Lý Minh đã dẫn tôi đi thăm Cố Cung và Vạn Lý Trường Thành.",
      "Trong một tuần ở Bắc Kinh, chúng tôi đã ăn rất nhiều món ngon Trung Quốc như vịt quay Bắc Kinh và sủi cảo. Lý Minh còn giúp tôi luyện khẩu ngữ tiếng Trung, tôi cảm thấy tiếng Trung của mình ngày càng tiến bộ.",
      "Mùa hè năm nay, Lý Minh có kế hoạch sang Việt Nam du lịch, tôi chuẩn bị đưa anh ấy đi chơi ở Hà Nội và Vịnh Hạ Long.",
    ],
    glossary: [
      { word: "泡茶", pinyin: "pào chá", hanViet: "Phao trà", meaningVn: "Pha trà" },
      { word: "故宫", pinyin: "Gùgōng", hanViet: "Cố Cung", meaningVn: "Tử Cấm Thành Bắc Kinh" },
      { word: "长城", pinyin: "Chángchéng", hanViet: "Trường Thành", meaningVn: "Vạn Lý Trường Thành" },
      { word: "烤鸭", pinyin: "kǎoyā", hanViet: "Khảo áp", meaningVn: "Vịt quay" },
      { word: "水饺", pinyin: "shuǐjiǎo", hanViet: "Thủy giác", meaningVn: "Bánh sủi cảo" },
      { word: "口语", pinyin: "kǒuyǔ", hanViet: "Khẩu ngữ", meaningVn: "Văn nói, kỹ năng nói" },
      { word: "计划", pinyin: "jìhuà", hanViet: "Kế hoạch", meaningVn: "Dự định, lên kế hoạch" },
    ],
    questions: [
      {
        id: "q-r01-1",
        questionZh: "李明的职业是什么？",
        questionVn: "Nghề nghiệp của Lý Minh là gì?",
        options: ["导游 (Hướng dẫn viên)", "汉语老师 (Giáo viên tiếng Trung)", "厨师 (Đầu bếp)", "医生 (Bác sĩ)"],
        correctIndex: 1,
        explanationVn: "Trong đoạn 1 có viết rõ: '李明住在北京，他是一名汉语老师' (Lý Minh sống ở Bắc Kinh, anh ấy là một giáo viên dạy tiếng Trung).",
      },
      {
        id: "q-r01-2",
        questionZh: "作者第一次去北京是什么时候？",
        questionVn: "Tác giả đi Bắc Kinh lần đầu tiên vào khi nào?",
        options: ["去年秋天 (Mùa thu năm ngoái)", "今年夏天 (Mùa hè năm nay)", "去年春天 (Mùa xuân năm ngoái)", "今年冬天 (Mùa đông năm nay)"],
        correctIndex: 0,
        explanationVn: "Đoạn 2 ghi: '去年秋天，我第一次去北京旅游' (Mùa thu năm ngoái, lần đầu tiên tôi đi Bắc Kinh du lịch).",
      },
      {
        id: "q-r01-3",
        questionZh: "今年夏天，李明打算去哪里？",
        questionVn: "Mùa hè năm nay Lý Minh dự định đi đâu?",
        options: ["去上海 (Đi Thượng Hải)", "去广州 (Đi Quảng Châu)", "去越南 (Sang Việt Nam)", "去日本 (Đi Nhật Bản)"],
        correctIndex: 2,
        explanationVn: "Đoạn 4 ghi: '今年夏天，李明计划来越南旅游' (Mùa hè năm nay, Lý Minh kế hoạch sang Việt Nam du lịch).",
      },
    ],
  },

  // --- HSK 3-4 ---
  {
    id: "read-02",
    hskLevel: 3,
    titleZh: "智能手机与现代生活",
    titlePinyin: "Zhìnéng shǒujī yǔ xiàndài shēnghuó",
    titleVn: "Điện Thoại Thông Minh Và Cuộc Sống Hiện Đại",
    topic: "Công nghệ & Xã hội",
    wordCount: 185,
    audioText: "在当今社会，智能手机已经成为人们日常生活中不可缺少的一部分。无论是早起查看天气预报，还是出门乘坐地铁、叫出租车，手机都为我们提供了极大的便利。在中国，移动支付非常普及。无论是在大型商场购物，还是在街头小吃摊买煎饼，人们只需要用手机扫一扫二维码，就可以在几秒钟之内完成付款，几乎没有人带现金出门。然而，手机也带来了一些负面影响。许多年轻人沉迷于刷短视频和打网络游戏，每天盯着屏幕的时间超过六个小时。这不仅损害了视力，还减少了与家人面对面交流的时间。专家建议，我们应当合理使用手机，做手机的主人，而不是手机的奴隶。",
    contentZh: [
      "在当今社会，智能手机已经成为人们日常生活中不可缺少的一部分。无论是早起查看天气预报，还是出门乘坐地铁、叫出租车，手机都为我们提供了极大的便利。",
      "在中国，移动支付非常普及。无论是在大型商场购物，还是在街头小吃摊买煎饼，人们只需要用手机扫一扫二维码，就可以在几秒钟之内完成付款，几乎没有人带现金出门。",
      "然而，手机也带来了一些负面影响。许多年轻人沉迷于刷短视频和打网络游戏，每天盯着屏幕的时间超过六个小时。这不仅损害了视力，还减少了与家人面对面交流的时间。",
      "专家建议，我们应当合理使用手机，做手机的主人，而不是手机的奴隶。",
    ],
    contentPinyin: [
      "Zài dāngjīn shèhuì, zhìnéng shǒujī yǐjīng chéngwéi rénmen rìcháng shēnghuó zhōng bùkě quēshǎo de yí bùfen. Wúlùn shì zǎoqǐ chákàn tiānqì yùbào, háishì chūmén chéngzuò dìtiě, jiào chūzūchē, shǒujī dōu wèi wǒmen tígōng le jí dà de biànlì.",
      "Zài Zhōngguó, yídòng zhīfù fēicháng pǔjí. Wúlùn shì zài dàxíng shāngchǎng gòuwù, háishì zài jiētóu xiǎochītān mǎi jiānbǐng, rénmen zhǐ xūyào yòng shǒujī sǎo yì sǎo èrwéimǎ, jiù kěyǐ zài jǐ miǎozhōng zhīnèi wánchéng fùkuǎn, jīhū méiyǒu rén dài xiànjīn chūmén.",
      "Rán'ér, shǒujī yě dàilái le yìxiē fùmiàn yǐngxiǎng. Xǔduō niánqīngrén chénmí yú shuā duǎn shìpín hé dǎ wǎngluò yóuxì, měitiān dīngzhe píngmù de shíjiān chàoguò liù gè xiǎoshí. Zhè bùjǐn sǔnhài le shìlì, hái jiǎnshǎo le yǔ jiārén miànduìmiàn jiāoliú de shíjiān.",
      "Zhuānjiā jiànyì, wǒmen yīngdāng hélǐ shǐyòng shǒujī, zuò shǒujī de zhǔrén, ér bú shì shǒujī de núlì.",
    ],
    translationVn: [
      "Trong xã hội ngày nay, điện thoại thông minh đã trở thành một phần không thể thiếu trong cuộc sống hàng ngày. Dù là sáng dậy xem dự báo thời tiết hay ra đường đi tàu điện ngầm, gọi taxi, điện thoại đều mang lại sự thuận tiện vô cùng to lớn cho chúng ta.",
      "Tại Trung Quốc, thanh toán di động vô cùng phổ biến. Cho dù là mua sắm ở các trung tâm thương mại lớn hay mua bánh kếp ở quầy ăn vặt ven đường, mọi người chỉ cần dùng điện thoại quét mã QR là có thể hoàn tất thanh toán trong vài giây, hầu như không ai mang theo tiền mặt ra đường.",
      "Tuy nhiên, điện thoại cũng mang lại một số ảnh hưởng tiêu cực. Nhiều bạn trẻ mải mê lướt video ngắn và chơi game online, mỗi ngày dán mắt vào màn hình hơn 6 tiếng đồng hồ. Điều này không chỉ gây hại cho thị lực mà còn làm giảm thời gian giao tiếp mặt đối mặt với người thân trong gia đình.",
      "Các chuyên gia khuyên rằng, chúng ta nên sử dụng điện thoại một cách hợp lý, làm chủ nhân của điện thoại chứ đừng trở thành nô lệ của nó.",
    ],
    glossary: [
      { word: "普及", pinyin: "pǔjí", hanViet: "Phổ cập", meaningVn: "Phổ biến rộng rãi" },
      { word: "二维码", pinyin: "èrwéimǎ", hanViet: "Nhị duy mã", meaningVn: "Mã QR Code" },
      { word: "沉迷", pinyin: "chénmí", hanViet: "Trầm mê", meaningVn: "Chìm đắm, nghiện" },
      { word: "视力", pinyin: "shìlì", hanViet: "Thị lực", meaningVn: "Sức nhìn của mắt" },
      { word: "面对面", pinyin: "miànduìmiàn", hanViet: "Diện đối diện", meaningVn: "Trực tiếp, mặt đối mặt" },
    ],
    questions: [
      {
        id: "q-r02-1",
        questionZh: "在中国，人们出门买东西主要使用什么方式付款？",
        questionVn: "Tại Trung Quốc, mọi người ra đường mua đồ chủ yếu thanh toán bằng cách nào?",
        options: ["使用现金 (Dùng tiền mặt)", "手机扫二维码支付 (Quét mã QR qua điện thoại)", "使用支票 (Dùng séc)", "只能刷信用卡 (Chỉ quẹt thẻ tín dụng)"],
        correctIndex: 1,
        explanationVn: "Bài viết nêu rõ: '人们只需要用手机扫一扫二维码，就可以在几秒钟之内完成付款' (Mọi người chỉ cần dùng điện thoại quét mã QR là hoàn tất thanh toán).",
      },
      {
        id: "q-r02-2",
        questionZh: "过度使用手机对年轻人有什么不良后果？",
        questionVn: "Sử dụng điện thoại quá độ gây hậu quả xấu gì cho giới trẻ?",
        options: ["损害视力并减少面对面交流 (Hại thị lực & giảm giao tiếp trực tiếp)", "浪费金钱 (Lãng phí tiền bạc)", "找不到工作 (Không tìm được việc)", "身体长胖 (Tăng cân)"],
        correctIndex: 0,
        explanationVn: "Đoạn 3 ghi rõ: '这不仅损害了视力，还减少了与家人面对面交流的时间' (Điều này không chỉ làm hại thị lực mà còn giảm thời gian giao tiếp mặt đối mặt với người thân).",
      },
    ],
  },

  // --- HSK 5-6 ---
  {
    id: "read-03",
    hskLevel: 5,
    titleZh: "中国茶文化与处世哲学",
    titlePinyin: "Zhōngguó chá wénhuà yǔ chǔshì zhéxué",
    titleVn: "Văn Hóa Trà Trung Quốc Và Triết Lý Xử Thế",
    topic: "Văn hóa & Triết lý",
    wordCount: 220,
    audioText: "茶，源于中国，流行于世界。中国人饮茶已有数千年的悠久历史。古人云：“茶者，南方之嘉木也。”在中国传统文化中，茶不仅仅是一种解渴的饮品，更是一种修身养性、陶冶情操的生活艺术与哲学载体。品茶讲究“和、敬、清、寂”。所谓“和”，就是人与自然、人与人之间的和谐相处；“敬”，即互相尊敬，以茶待客之道；“清”，指心境淡泊，远离浮躁与功利；“寂”，则是在宁静安详的氛围中反思自我，领悟人生的真谛。一杯茶，初尝略带苦涩，细品之后方觉回味甘甜。古人常以茶喻人生：青年时期如初泡之茶，青涩而富有锐气；中年时期如二泡之茶，醇厚而内涵丰富；晚年时期如三泡之茶，淡雅而宁静致远。懂得品茶的人，往往更懂得在快节奏的纷繁世事中保持内心的从容与平静。",
    contentZh: [
      "茶，源于中国，流行于世界。中国人饮茶已有数千年的悠久历史。古人云：“茶者，南方之嘉木也。”在中国传统文化中，茶不仅仅是一种解渴的饮品，更是一种修身养性、陶冶情操的生活艺术与哲学载体。",
      "品茶讲究“和、敬、清、寂”。所谓“和”，就是人与自然、人与人之间的和谐相处；“敬”，即互相尊敬，以茶待客之道；“清”，指心境淡泊，远离浮躁与功利；“寂”，则是在宁静安详的氛围中反思自我，领悟人生的真谛。",
      "一杯茶，初尝略带苦涩，细品之后方觉回味甘甜。古人常以茶喻人生：青年时期如初泡之茶，青涩而富有锐气；中年时期如二泡之茶，醇厚而内涵丰富；晚年时期如三泡之茶，淡雅而宁静致远。",
      "懂得品茶的人，往往更懂得在快节奏的纷繁世事中保持内心的从容与平静。",
    ],
    contentPinyin: [
      "Chá, yuányú Zhōngguó, liúxíng yú shìjiè. Zhōngguó rén yǐnchá yǐ yǒu shù qiān nián de yōujiǔ lìshǐ. Gǔrén yún: “Chá zhě, nánfāng zhī jiāmù yě.” Zài Zhōngguó chuántǒng wénhuà zhōng, chá bù jǐnjǐn shì yì zhǒng jiěkě de yǐnpǐn, gèng shì yì zhǒng xiūshēn-yǎngxìng, táoyě-qíngcāo de shēnghuó yìshù yǔ zhéxué zàitǐ.",
      "Pǐnchá jiǎngjiu “hé, jìng, qīng, jì”. Suǒwèi “hé”, jiù shì rén yǔ zìrán, rén yǔ rén zhījiān de héxié xiāngchǔ; “jìng”, jí hùxiāng zūnjìng, yǐ chá dài kè zhī dào; “qīng”, zhǐ xīnjìng dànbó, yuǎnlí fúzào yǔ gōnglì; “jì”, zé shì zài níngjìng ānxiáng de fēnwéi zhōng fǎnsī zìwǒ, lǐngwù rénshēng de zhēndì.",
      "Yì bēi chá, chū cháng lüè dài kǔsè, xì pǐn zhī hòu fāng jué huíwèi gāntián. Gǔrén cháng yǐ chá yù rénshēng: qīngnián shíqī rú chū pào zhī chá, qīngsè ér fùyǒu ruìqì; zhōngnián shíqī rú èr pào zhī chá, chúnhòu ér nèihán fēngfù; wǎnnián shíqī rú sān pào zhī chá, dànyǎ ér níngjìng zhìyuǎn.",
      "Dǒngde pǐnchá de rén, wǎngwǎng gèng dǒngde zài kuài jiézòu de fēnfán shìshì zhōng bǎochí nèixīn de cóngróng yǔ píngjìng.",
    ],
    translationVn: [
      "Trà bắt nguồn từ Trung Quốc và lưu truyền khắp thế giới. Người Trung Quốc uống trà đã có bề dày lịch sử hàng nghìn năm. Người xưa có câu: 'Trà là giống cây quý ở phương Nam'. Trong văn hóa truyền thống, trà không đơn thuần là thức uống giải khát mà còn là một nghệ thuật sống và phương tiện triết học để tu dưỡng tâm tính, thanh lọc tâm hồn.",
      "Nghệ thuật thưởng trà chú trọng bốn chữ: 'Hòa, Kính, Thanh, Tịch'. 'Hòa' là sự hòa hợp giữa con người với thiên nhiên và con người với nhau; 'Kính' là sự tôn trọng lẫn nhau trong đạo đãi khách bằng trà; 'Thanh' là tâm thế thanh đạm, tránh xa sự nóng vội và vụ lợi; 'Tịch' là sự tĩnh lặng an nhiên để tự nhìn lại bản thân, thấu hiểu chân lý cuộc đời.",
      "Một chén trà, ban đầu nhấp môi có vị hơi đắng chát, nhưng nhâm nhi kỹ mới cảm nhận được hậu vị ngọt ngào lưu luyến. Người xưa thường mượn trà để ví von đời người: Tuổi trẻ như chén trà đầu tiên, hơi chát nhưng tràn đầy nhiệt huyết; tuổi trung niên như nước trà thứ hai, đậm đà sâu lắng và dồi dào nội hàm; tuổi già như tuần trà thứ ba, thanh tao, tĩnh lặng và an yên.",
      "Người biết thưởng trà thường là người biết cách giữ cho nội tâm luôn bình thản và an nhiên giữa dòng đời hối hả nhiều biến động.",
    ],
    glossary: [
      { word: "修身养性", pinyin: "xiūshēn yǎngxìng", hanViet: "Tu thân dưỡng tính", meaningVn: "Tu dưỡng nhân cách và tâm hồn" },
      { word: "甘甜", pinyin: "gāntián", hanViet: "Cam điềm", meaningVn: "Ngọt ngào thanh khiết" },
      { word: "醇厚", pinyin: "chúnhòu", hanViet: "Thuần hậu", meaningVn: "Đậm đà, sâu sắc" },
      { word: "从容", pinyin: "cóngróng", hanViet: "Thong dong", meaningVn: "Bình tĩnh, ung dung, tự tại" },
    ],
    questions: [
      {
        id: "q-r03-1",
        questionZh: "品茶讲究的四个核心准则是什么？",
        questionVn: "Bốn tôn chỉ cốt lõi của nghệ thuật thưởng trà là gì?",
        options: ["真、善、美、和", "和、敬、清、寂", "清、雅、苦、甜", "礼、智、仁、义"],
        correctIndex: 1,
        explanationVn: "Đoạn 2 nêu rõ: '品茶讲究“和、敬、清、寂”' (Thưởng trà chú trọng Hòa, Kính, Thanh, Tịch).",
      },
      {
        id: "q-r03-2",
        questionZh: "古人将人生的中年时期比喻为怎样的茶？",
        questionVn: "Người xưa ví von thời kỳ trung niên của đời người giống như tuần trà nào?",
        options: ["如初泡之茶 (Tuần trà đầu tiên)", "如二泡之茶，醇厚而内涵丰富 (Tuần trà thứ hai, đậm đà sâu lắng)", "如三泡之茶，淡雅宁静 (Tuần trà thứ ba)", "如隔夜之茶 (Trà để qua đêm)"],
        correctIndex: 1,
        explanationVn: "Đoạn 3 có viết: '中年时期如二泡之茶，醇厚而内涵丰富' (Thời kỳ trung niên như tuần trà thứ hai, đậm đà và dồi dào nội hàm).",
      },
    ],
  },
];
