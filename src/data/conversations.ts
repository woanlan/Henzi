export interface DialogueLine {
  id: string;
  speaker: 'A' | 'B';
  speakerNameZh: string;
  speakerNameVn: string;
  avatarColor: string;
  sentenceZh: string;
  sentencePinyin: string;
  sentenceVn: string;
}

export interface ConversationTopic {
  id: string;
  hskLevel: number;
  titleZh: string;
  titleVn: string;
  contextVn: string;
  roleA: { nameZh: string; nameVn: string; roleDesc: string };
  roleB: { nameZh: string; nameVn: string; roleDesc: string };
  lines: DialogueLine[];
}

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  {
    id: "conv-01",
    hskLevel: 2,
    titleZh: "在餐厅点餐",
    titleVn: "Gọi Món Tại Nhà Hàng Trung Quốc",
    contextVn: "Khách hàng người nước ngoài bước vào một quán ăn tại Bắc Kinh để thưởng thức món ăn truyền thống.",
    roleA: { nameZh: "服务员", nameVn: "Nhân viên phục vụ", roleDesc: "Người phục vụ niềm nở tại quán ăn" },
    roleB: { nameZh: "大卫", nameVn: "David (Khách hàng)", roleDesc: "Du khách muốn thử ẩm thực Bắc Kinh" },
    lines: [
      {
        id: "l-01-1",
        speaker: "A",
        speakerNameZh: "服务员",
        speakerNameVn: "Phục vụ",
        avatarColor: "bg-amber-600",
        sentenceZh: "您好，欢迎光临！请问一共几位？",
        sentencePinyin: "Nín hǎo, huānyíng guānglín! Qǐngwèn yígòng jǐ wèi?",
        sentenceVn: "Xin chào quý khách, hoan nghênh ghé quán! Xin hỏi quý khách đi mấy người ạ?",
      },
      {
        id: "l-01-2",
        speaker: "B",
        speakerNameZh: "大卫",
        speakerNameVn: "David",
        avatarColor: "bg-blue-600",
        sentenceZh: "就我一位。请问靠窗户还有空位吗？",
        sentencePinyin: "Jiù wǒ yí wèi. Qǐngwèn kào chuānghu hái yǒu kòngwèi ma?",
        sentenceVn: "Chỉ có một mình tôi. Xin hỏi chỗ cạnh cửa sổ còn bàn trống không?",
      },
      {
        id: "l-01-3",
        speaker: "A",
        speakerNameZh: "服务员",
        speakerNameVn: "Phục vụ",
        avatarColor: "bg-amber-600",
        sentenceZh: "有的，请跟我来这边坐。这是菜单，您想吃点儿什么？",
        sentencePinyin: "Yǒu de, qǐng gēn wǒ lái zhèbiān zuò. Zhè shì càidān, nín xiǎng chī diǎnr shénme?",
        sentenceVn: "Dạ có, mời anh theo em qua bàn này ngồi. Đây là thực đơn, anh muốn dùng món gì ạ?",
      },
      {
        id: "l-01-4",
        speaker: "B",
        speakerNameZh: "大卫",
        speakerNameVn: "David",
        avatarColor: "bg-blue-600",
        sentenceZh: "请给我来一份宫保鸡丁和一碗米饭。鸡丁请做微辣，不要太辣。",
        sentencePinyin: "Qǐng gěi wǒ lái yí fèn Gōngbǎo Jīdīng hé yì wǎn mǐfàn. Jīdīng qǐng zuò wēi là, bú yào tài là.",
        sentenceVn: "Lấy cho tôi một suất gà Cung Bảo và một bát cơm trắng. Gà làm cay nhẹ thôi nhé, đừng cay quá.",
      },
      {
        id: "l-01-5",
        speaker: "A",
        speakerNameZh: "服务员",
        speakerNameVn: "Phục vụ",
        avatarColor: "bg-amber-600",
        sentenceZh: "好的，记下了。请问您需要喝点儿什么饮料吗？",
        sentencePinyin: "Hǎo de, jìxià le. Qǐngwèn nín xūyào hē diǎnr shénme yǐnliào ma?",
        sentenceVn: "Dạ vâng em ghi lại rồi. Xin hỏi anh có dùng đồ uống gì không ạ?",
      },
      {
        id: "l-01-6",
        speaker: "B",
        speakerNameZh: "大卫",
        speakerNameVn: "David",
        avatarColor: "bg-blue-600",
        sentenceZh: "来一杯热茉莉花茶吧，谢谢！",
        sentencePinyin: "Lái yì bēi rè mòlìhuā chá ba, xièxie!",
        sentenceVn: "Cho tôi một ly trà lài nóng nhé, cảm ơn em!",
      },
    ],
  },
  {
    id: "conv-02",
    hskLevel: 3,
    titleZh: "在商场砍价买衣服",
    titleVn: "Mặc Cả Mua Quần Áo Ở Chợ",
    contextVn: "Du khách mua sắm tại chợ bán sỉ trang phục Quảng Châu và muốn thương lượng mức giá tốt nhất.",
    roleA: { nameZh: "老板", nameVn: "Chủ sạp", roleDesc: "Tiểu thương bán hàng dày dặn kinh nghiệm" },
    roleB: { nameZh: "小兰", nameVn: "Tiểu Lan", roleDesc: "Khách mua hàng sành sỏi" },
    lines: [
      {
        id: "l-02-1",
        speaker: "A",
        speakerNameZh: "老板",
        speakerNameVn: "Chủ sạp",
        avatarColor: "bg-amber-600",
        sentenceZh: "美女，来看衣服啊！这件红色大衣是今年最新款式，质量特别好。",
        sentencePinyin: "Měinǚ, lái kàn yīfu a! Zhè jiàn hóngsè dàyī shì jīnnián zuìxīn kuǎnshì, zhìliàng tèbié hǎo.",
        sentenceVn: "Người đẹp ơi vào xem áo đi! Chiếc áo khoác đỏ này là mẫu mới nhất năm nay, chất lượng cực tốt luôn.",
      },
      {
        id: "l-02-2",
        speaker: "B",
        speakerNameZh: "小兰",
        speakerNameVn: "Tiểu Lan",
        avatarColor: "bg-emerald-600",
        sentenceZh: "老板，摸起来手感确实不错。这件多少钱？",
        sentencePinyin: "Lǎobǎn, mō qǐlai shǒugǎn quèshí búcuò. Zhè jiàn duōshao qián?",
        sentenceVn: "Chủ quán, sờ chất vải đúng là êm thật. Chiếc này bao nhiêu tiền vậy?",
      },
      {
        id: "l-02-3",
        speaker: "A",
        speakerNameZh: "老板",
        speakerNameVn: "Chủ sạp",
        avatarColor: "bg-amber-600",
        sentenceZh: "原价三百八，看你是真心想买，给你个实在价，三百块拿走！",
        sentencePinyin: "Yuánjià sānbǎi bā, kàn nǐ shì zhēnxīn xiǎng mǎi, gěi nǐ gè shízai jià, sānbǎi kuài ná zǒu!",
        sentenceVn: "Giá gốc ba trăm tám, thấy em thật lòng muốn mua, để cho em giá thật thà ba trăm tệ mang về luôn!",
      },
      {
        id: "l-02-4",
        speaker: "B",
        speakerNameZh: "小兰",
        speakerNameVn: "Tiểu Lan",
        avatarColor: "bg-emerald-600",
        sentenceZh: "太贵了吧！刚才隔壁店铺才卖两百块。一百八卖不卖？卖的话我现在就付钱。",
        sentencePinyin: "Tài guì le ba! Gāngcái gébì diànpù cái mài liǎngbǎi kuài. Yìbǎi bā mài bú mài? Mài dehuà wǒ xiànzài jiù fùqián.",
        sentenceVn: "Đắt quá anh ơi! Vừa nãy tiệm bên cạnh bán có hai trăm thôi. Một trăm tám bán không anh? Bán thì em thanh toán tiền luôn.",
      },
      {
        id: "l-02-5",
        speaker: "A",
        speakerNameZh: "老板",
        speakerNameVn: "Chủ sạp",
        avatarColor: "bg-amber-600",
        sentenceZh: "哎呀，一百八连进货成本都不够！这样吧，交个朋友，两百块最低了！",
        sentencePinyin: "Āiyā, yìbǎi bā lián jìnhuò chéngběn dōu bú gòu! Zhèyàng ba, jiāo gè péngyou, liǎngbǎi kuài zuìdī le!",
        sentenceVn: "Ái chà, một trăm tám còn chưa đủ tiền vốn nhập hàng! Thôi thế này, coi như kết bạn, hai trăm chẵn giá chót đấy!",
      },
      {
        id: "l-02-6",
        speaker: "B",
        speakerNameZh: "小兰",
        speakerNameVn: "Tiểu Lan",
        avatarColor: "bg-emerald-600",
        sentenceZh: "成交！给我包起来吧，我扫你的支付宝。",
        sentencePinyin: "Chéngjiāo! Gěi wǒ bāo qǐlai ba, wǒ sǎo nǐ de Zhīfùbǎo.",
        sentenceVn: "Chốt đơn! Gói lại giúp em nhé, em quét Alipay của anh.",
      },
    ],
  },
  {
    id: "conv-03",
    hskLevel: 4,
    titleZh: "求职面试与职业规划",
    titleVn: "Phỏng Vấn Xin Việc Tại Công Ty Trung Quốc",
    contextVn: "Ứng viên ứng tuyển vào vị trí chuyên viên đối ngoại kinh doanh tại tập đoàn thương mại quốc tế.",
    roleA: { nameZh: "面试官", nameVn: "Người phỏng vấn", roleDesc: "Giám đốc nhân sự chuyên nghiệp" },
    roleB: { nameZh: "阮文明", nameVn: "Nguyễn Văn Minh", roleDesc: "Ứng viên thông thạo song ngữ Trung-Việt" },
    lines: [
      {
        id: "l-03-1",
        speaker: "A",
        speakerNameZh: "面试官",
        speakerNameVn: "Phỏng vấn",
        avatarColor: "bg-indigo-600",
        sentenceZh: "阮先生你好，请先做一个简短的自我介绍吧。",
        sentencePinyin: "Ruǎn xiānsheng nǐ hǎo, qǐng xiān zuò yí gè jiǎnduǎn de zìwǒ jièshào ba.",
        sentenceVn: "Chào anh Nguyễn, xin mời anh giới thiệu ngắn gọn về bản thân trước nhé.",
      },
      {
        id: "l-03-2",
        speaker: "B",
        speakerNameZh: "阮文明",
        speakerNameVn: "Văn Minh",
        avatarColor: "bg-amber-600",
        sentenceZh: "各位考官好！我毕业于河内大学中文系，有三年跨国贸易从业经验，熟练掌握中越商务谈判与物流通关流程。",
        sentencePinyin: "Gèwèi kǎoguān hǎo! Wǒ bìyè yú Hénèi Dàxué Zhōngwén xì, yǒu sān nián kuàguó màoyì cóngyè jīngyàn, shúliàn zhǎngwò Zhōng-Yuè shāngwù tánpàn yǔ wùliú tōngguān liúchéng.",
        sentenceVn: "Chào các vị giám khảo! Tôi tốt nghiệp khoa tiếng Trung ĐH Hà Nội, có 3 năm kinh nghiệm trong ngành thương mại quốc tế, nắm vững quy trình đàm phán thương mại và thông quan logistics Trung - Việt.",
      },
      {
        id: "l-03-3",
        speaker: "A",
        speakerNameZh: "面试官",
        speakerNameVn: "Phỏng vấn",
        avatarColor: "bg-indigo-600",
        sentenceZh: "你的中文口语非常流利。请问面对紧急客户投诉时，你通常如何处理？",
        sentencePinyin: "Nǐ de Zhōngwén kǒuyǔ fēicháng liúlì. Qǐngwèn miànduì jǐnjí kèhù tóusù shí, nǐ tōngcháng rúhé chǔlǐ?",
        sentenceVn: "Khẩu ngữ tiếng Trung của anh rất lưu loát. Xin hỏi khi đối mặt với khiếu nại khẩn cấp của khách hàng, anh thường xử lý thế nào?",
      },
      {
        id: "l-03-4",
        speaker: "B",
        speakerNameZh: "阮文明",
        speakerNameVn: "Văn Minh",
        avatarColor: "bg-amber-600",
        sentenceZh: "首先我会安抚客户情绪，倾听核心诉求；其次迅速核实事实，给出明确补救方案；最后复盘总结，避免再次发生。",
        sentencePinyin: "Shǒuxiān wǒ huì ānfǔ kèhù qíngxù, qīngtīng héxīn sùqiú; qícì xùnsù héshí shìshí, gěichū míngquè bǔjiù fāng'àn; zuìhòu fùpán zǒngjié, bìmiǎn zàicì fāshēng.",
        sentenceVn: "Đầu tiên tôi sẽ xoa dịu tâm lý khách hàng, lắng nghe yêu cầu cốt lõi; tiếp theo nhanh chóng xác minh sự thật, đưa ra phương án khắc phục rõ ràng; cuối cùng đánh giá tổng kết để tránh tái diễn.",
      },
    ],
  },
];
