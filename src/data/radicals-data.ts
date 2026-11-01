export interface RadicalItem {
  id: string;
  radical: string;
  variants?: string[];
  pinyin: string;
  strokeCount: number;
  sinoVietnamese: string;
  meaningVn: string;
  description: string;
  examples: {
    zh: string;
    pinyin: string;
    vn: string;
    story: string;
  }[];
}

export const COMMON_RADICALS: RadicalItem[] = [
  {
    id: "rad-01",
    radical: "亻",
    variants: ["人"],
    pinyin: "rén",
    strokeCount: 2,
    sinoVietnamese: "Nhân (Nhân đứng)",
    meaningVn: "Người, con người, hành vi của con người",
    description: "Bộ Nhân đứng là biến thể của chữ '人' khi đứng bên trái chữ Hán. Hầu hết các chữ liên quan đến con người, thân phận, hành động đều chứa bộ này.",
    examples: [
      {
        zh: "休",
        pinyin: "xiū",
        vn: "Nghỉ ngơi",
        story: "Ghép từ bộ Nhân '亻' (người) đứng tựa lưng vào bộ Mộc '木' (cây). Hình ảnh người đi làm mệt đứng dựa vào bóng cây để nghỉ ngơi.",
      },
      {
        zh: "你",
        pinyin: "nǐ",
        vn: "Bạn, cậu",
        story: "Ghép từ bộ Nhân '亻' (người) và chữ Nhĩ '尔' (ngươi/mày), chỉ đối tượng đang giao tiếp cùng.",
      },
      {
        zh: "他",
        pinyin: "tā",
        vn: "Anh ấy, cậu ấy",
        story: "Ghép từ bộ Nhân '亻' (người) và chữ Dã '也' (cũng), chỉ một người khác ở ngôi thứ ba.",
      },
    ],
  },
  {
    id: "rad-02",
    radical: "氵",
    variants: ["水"],
    pinyin: "shuǐ",
    strokeCount: 3,
    sinoVietnamese: "Thủy (Ba chấm thủy)",
    meaningVn: "Nước, sông hồ, chất lỏng",
    description: "Ba giọt nước bắn ra. Hầu hết các chữ liên quan đến sông ngòi, biển cả, nước uống, bơi lội, rửa ráy đều mang bộ này.",
    examples: [
      {
        zh: "河",
        pinyin: "hé",
        vn: "Sông ngòi",
        story: "Ghép từ bộ Thủy '氵' (nước) và chữ Khả '可' (cho phép/uốn lượn), chỉ dòng nước tự do uốn lượn chảy qua các vùng đất.",
      },
      {
        zh: "海",
        pinyin: "hǎi",
        vn: "Biển cả",
        story: "Ghép từ bộ Thủy '氵' (nước) và chữ Mỗi '每' (người mẹ bao la), biển cả là nguồn nước vô tận nuôi dưỡng muôn loài.",
      },
      {
        zh: "洗",
        pinyin: "xǐ",
        vn: "Rửa, giặt",
        story: "Ghép từ bộ Thủy '氵' (nước) và chữ Tiên '先' (trước tiên), trước khi làm gì cũng cần dùng nước để tẩy rửa sạch sẽ.",
      },
    ],
  },
  {
    id: "rad-03",
    radical: "木",
    pinyin: "mù",
    strokeCount: 4,
    sinoVietnamese: "Mộc",
    meaningVn: "Cây cối, gỗ, đồ vật làm từ gỗ",
    description: "Vẽ hình cái cây với cành xòe bên trên và rễ bám sâu xuống đất. Các chữ chỉ thực vật, rừng cây, bàn ghế đồ gỗ đều có bộ Mộc.",
    examples: [
      {
        zh: "林",
        pinyin: "lín",
        vn: "Rừng nhỏ",
        story: "Hai chữ Mộc '木 + 木' đứng cạnh nhau tạo thành cánh rừng nhỏ (Lâm).",
      },
      {
        zh: "森",
        pinyin: "sēn",
        vn: "Rừng rậm rạp",
        story: "Ba chữ Mộc '木 + 木 + 木' xếp chồng lên nhau tạo thành khu rừng nguyên sinh bạt ngàn, rậm rạp (Sâm).",
      },
      {
        zh: "本",
        pinyin: "běn",
        vn: "Gốc rễ, cội nguồn (Quyển sách)",
        story: "Chữ Mộc '木' thêm một nét gạch ngang ở phần gốc rễ chỉ nơi bắt đầu của cây (Căn bản, cội nguồn).",
      },
    ],
  },
  {
    id: "rad-04",
    radical: "宀",
    pinyin: "mián",
    strokeCount: 3,
    sinoVietnamese: "Miên",
    meaningVn: "Mái nhà, nơi cư trú",
    description: "Hình ảnh mái nhà che mưa che nắng có chóp nóc và hai bờ tường bao quanh.",
    examples: [
      {
        zh: "安",
        pinyin: "ān",
        vn: "Bình an, yên ổn",
        story: "Dưới mái nhà '宀' có người phụ nữ '女' ngồi sum vầy thì gia đình luôn ấm êm, thái bình, an yên.",
      },
      {
        zh: "家",
        pinyin: "jiā",
        vn: "Gia đình, nhà",
        story: "Dưới mái nhà '宀' có nuôi con heo '豕' (thời xưa nuôi heo chứng tỏ gia đình no ấm, có của ăn của để).",
      },
      {
        zh: "字",
        pinyin: "zì",
        vn: "Chữ viết, chữ Hán",
        story: "Dưới mái nhà '宀' nuôi dưỡng người con '子' học hành thi cử (học chữ, trau dồi tri thức).",
      },
    ],
  },
  {
    id: "rad-05",
    radical: "女",
    pinyin: "nǚ",
    strokeCount: 3,
    sinoVietnamese: "Nữ",
    meaningVn: "Phụ nữ, giống cái, mẹ, con gái",
    description: "Hình ảnh người phụ nữ đoan trang, dịu dàng quỳ gối chắp tay theo phong tục cổ đại.",
    examples: [
      {
        zh: "好",
        pinyin: "hǎo",
        vn: "Tốt đẹp, hay",
        story: "Người mẹ '女' ôm người con '子' trong lòng, có đủ cả nếp lẫn tẻ là điều tuyệt vời, tốt lành nhất đời.",
      },
      {
        zh: "妈",
        pinyin: "mā",
        vn: "Mẹ",
        story: "Ghép từ bộ Nữ '女' chỉ người mẹ và chữ Mã '马' (ngựa) mượn âm đọc 'ma'. Người phụ nữ hy sinh làm lụng vất vả như con ngựa vì gia đình.",
      },
    ],
  },
  {
    id: "rad-06",
    radical: "日",
    pinyin: "rì",
    strokeCount: 4,
    sinoVietnamese: "Nhật",
    meaningVn: "Mặt trời, ban ngày, thời gian",
    description: "Vẽ hình vầng thái dương tròn trịa tỏa ánh sáng chói lọi, biểu thị ánh sáng và ngày tháng.",
    examples: [
      {
        zh: "明",
        pinyin: "míng",
        vn: "Sáng sủa, thông minh",
        story: "Mặt trời '日' kết hợp cùng Mặt trăng '月', hai nguồn sáng rực rỡ nhất vũ trụ tạo nên sự sáng tỏ (Minh).",
      },
      {
        zh: "晶",
        pinyin: "jīng",
        vn: "Lấp lánh, pha lê",
        story: "Ba mặt trời '日 + 日 + 日' cùng soi rọi tạo nên ánh hào quang lấp lánh như pha lê.",
      },
    ],
  },
  {
    id: "rad-07",
    radical: "忄",
    variants: ["心"],
    pinyin: "xīn",
    strokeCount: 3,
    sinoVietnamese: "Tâm (Tâm đứng)",
    meaningVn: "Trái tim, tâm tư, cảm xúc",
    description: "Biến thể của bộ Tâm '心' khi đứng bên trái. Mọi chữ liên quan đến tâm trạng, suy nghĩ, sợ hãi, nhớ nhung đều có bộ này.",
    examples: [
      {
        zh: "怕",
        pinyin: "pà",
        vn: "Sợ hãi",
        story: "Trái tim '忄' chuyển sang màu trắng bệch '白' vì sợ hãi hoảng hốt.",
      },
      {
        zh: "忙",
        pinyin: "máng",
        vn: "Bận rộn",
        story: "Trái tim '忄' bị mất mát, lãng quên '亡' vì công việc quá bận rộn, không còn tâm trí cho bản thân.",
      },
    ],
  },
  {
    id: "rad-08",
    radical: "口",
    pinyin: "kǒu",
    strokeCount: 3,
    sinoVietnamese: "Khẩu",
    meaningVn: "Cái miệng, ăn uống, lời nói",
    description: "Hình cái miệng há mở ra. Chữ chỉ ăn, uống, gọi, hát, khóc đều có bộ Khẩu.",
    examples: [
      {
        zh: "喝",
        pinyin: "hē",
        vn: "Uống nước",
        story: "Dùng cái miệng '口' uống nước giải tỏa cái nóng bức ban ngày '曷'.",
      },
      {
        zh: "吃",
        pinyin: "chī",
        vn: "Ăn cơm",
        story: "Dùng miệng '口' đưa thức ăn vào '乞'.",
      },
    ],
  },
];
