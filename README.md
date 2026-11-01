# HANZI MASTER — Master Chinese, One Step at a Time

Nền tảng học tiếng Trung toàn diện từ HSK 1 đến HSK 6 dành cho người Việt, kết hợp trải nghiệm của **Duolingo**, **Anki**, **Quizlet** và **Gia sư AI** thông minh, áp dụng tiêu chuẩn thiết kế chống rập khuôn (**Anti-Slop Design**) từ **tasteskill.dev**.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Giao Diện Chuẩn Taste Skill (Anti-Slop):**
   - Bảng màu Chu sa & Hổ phách ấm (`#F59E0B`, `#D97706`), mực xanh chàm sâu (`#172554`), nền giấy dó ấm (`#FAFAF9`).
   - Tích hợp font thư pháp chuyên biệt *Noto Serif SC* và chữ quốc ngữ chuẩn xác.
   - Thẻ đa tầng đổ bóng tự nhiên, âm thanh Web Audio API phản hồi xúc giác.

2. **Lộ Trình HSK 1 Đến HSK 6:**
   - Cấu trúc chuẩn hóa: Cấp độ HSK → Unit → Bài học → Mục tiêu học tập & thời lượng.
   - Phân biệt rõ dữ liệu giáo trình chuẩn, tài liệu nhập khẩu và bài học mẫu.

3. **Từ Vựng & Thẻ Flashcard SRS (SuperMemo SM-2):**
   - Thẻ lật 3D trực quan (Chữ Hán, Pinyin có dấu, Nghĩa tiếng Việt, Bộ thủ, Số nét, Câu ví dụ).
   - 3 nút đánh giá chuẩn SRS: *Từ Khó* (ôn ngày mai) / *Đang Học* (sau 3 ngày) / *Đã Thuộc* (sau 7 ngày).
   - 4 chế độ trắc nghiệm: Chữ Hán → Tiếng Việt, Tiếng Việt → Chữ Hán, Pinyin → Chữ Hán, Âm thanh → Chữ Hán.
   - Sổ tay từ vựng cá nhân lưu trữ tức thời.

4. **Phòng Luyện Viết Chữ Hán (Writing Lab):**
   - Viết trực tiếp trên ô Mễ Tự Cách (米字格) hỗ trợ chuột và màn hình cảm ứng.
   - Hướng dẫn thứ tự từng nét bút chuẩn thuận bút (Quy tắc ngang trước sổ sau, trên trước dưới sau...).
   - 3 chế độ: Viết theo mẫu mờ (Trace), Tự nhớ nét (Memory), Chép chính tả (Dictation).

5. **Phòng Luyện Nghe (Listening Lab):**
   - Giọng đọc phổ thông Bắc Kinh chuẩn xác với điều chỉnh tốc độ (0.75x, 1.0x, 1.25x).
   - Bật/tắt linh hoạt 3 tầng phụ đề: Chữ Hán, Pinyin, Dịch nghĩa tiếng Việt.
   - Bài tập trắc nghiệm nghe hiểu & chép chính tả âm thanh.

6. **Phòng Luyện Nói & Chấm Điểm AI (Speaking Lab):**
   - Ghi âm giọng nói qua Web Speech API / Whisper.
   - Đối chiếu văn bản nhận diện, chấm điểm thanh điệu và sự chuẩn xác theo % kèm nhận xét sư phạm bằng tiếng Việt.
   - Kịch bản hội thoại AI thực tế (Làm quen, Gọi món, Hỏi đường, Phỏng vấn xin việc).

7. **Bách Khoa Toàn Thư Ngữ Pháp HSK (Grammar Lab):**
   - Tra cứu tức thì cấu trúc ngữ pháp HSK 1–6.
   - Phân tích điều kiện sử dụng, lưu ý lỗi sai phổ biến của người Việt và so sánh cấu trúc tương đồng.
   - Bài tập trắc nghiệm củng cố kèm lời giải thích chi tiết.

8. **Trung Tâm Thi Thử HSK Bấm Giờ (Mock Exam Center):**
   - Đề thi mô phỏng chuẩn hóa (H11003, H21004, H31005) có đếm ngược thời gian thực.
   - Phân mục Nghe Hiểu (听力) và Đọc Hiểu (阅读).
   - Chấm điểm tự động, báo cáo tỷ lệ Đạt/Không đạt và phân tích chi tiết từng câu.

9. **Gia Sư AI Tiếng Trung (AI Tutor):**
   - Chat tương tác đa năng, tự động bóc tách câu theo 6 tầng:
     1. Chữ Hán chuẩn
     2. Pinyin có dấu thanh
     3. Dịch nghĩa tiếng Việt
     4. Bóc tách từ vựng cốt lõi
     5. Phân tích điểm ngữ pháp
     6. Mẫu câu mở rộng tự nhiên
   - Hỗ trợ cả OpenAI API / Gemini API hoặc bộ phân tích sư phạm offline thông minh không cần cấu hình khóa.

10. **Bảng Điều Khiển Quản Trị (Admin Center):**
    - Quản lý học viên, duyệt bài học, thêm từ vựng mới vào kho HSK, xuất file JSON.
    - Chuyển đổi vai trò linh hoạt: Học viên, Giáo viên, Quản trị viên chỉ với 1 click.

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY DỰ ÁN

### 1. Khởi chạy môi trường phát triển (Dev Server):
```bash
npm run dev
```
Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

### 2. Biên dịch Production Build:
```bash
npm run build
npm run start
```

### 3. Cấu hình cơ sở dữ liệu Supabase (Tùy chọn):
Hệ thống được thiết kế theo cơ chế **Dual-Mode**, đã tích hợp sẵn kho dữ liệu đầy đủ chạy mượt mà offline. Khi muốn kết nối dự án Supabase thật:
1. Tạo một dự án mới trên [Supabase](https://supabase.com).
2. Vào SQL Editor trên Supabase Dashboard và dán toàn bộ nội dung file:
   `supabase/migrations/20261101_initial_schema.sql`
3. Điền thông tin vào `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   OPENAI_API_KEY=sk-your-openai-api-key
   ```
