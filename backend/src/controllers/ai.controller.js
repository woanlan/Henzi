import { analyzeQuery } from "../seed/aiEngine.js";

// [YÊU CẦU CÔ - Controller Gia Sư AI (`/api/ai`): Kết hợp Google Gemini API & Từ điển nội bộ]

export const askAiTutor = async (req, res) => {
  try {
    const {
      message,
      hskLevel = 1,
      customApiKey,
      direction = "auto",
    } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Tin nhắn không được để trống" });
    }

    const geminiKey =
      customApiKey && !customApiKey.startsWith("sk-")
        ? customApiKey
        : process.env.GEMINI_API_KEY;

    if (geminiKey && !geminiKey.includes("your-key")) {
      const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash"];
      const systemPrompt = `Bạn là "Cố Vấn Sách AI & Từ Điển Hán Ngữ" tại hiệu sách HANZI (Trình độ độc giả: HSK ${hskLevel}).
Nhiệm vụ: Giải nghĩa từ vựng, bộ thủ, ngữ pháp tiếng Trung VÀ tư vấn chọn sách phù hợp trong 30 ấn phẩm của hiệu sách HANZI (Giáo trình HSK 1-6, Ngữ pháp & Đề thi HSK/HSKK, Từ điển 214 Bộ thủ, 500 Chữ tượng hình, Thư pháp, Khẩu ngữ 301 & Douyin, Thương mại Logistics XNK, Thành ngữ & 300 Bài Thơ Đường).
Trả về JSON hợp lệ theo mẫu:
{
  "content": "Giải thích chi tiết bằng tiếng Việt",
  "breakdown": {
    "originalZh": "Từ/câu chữ Hán",
    "pinyin": "Phiên âm có dấu",
    "vietnameseTranslation": "Nghĩa tiếng Việt chính xác",
    "direction": "vn_to_zh hoặc zh_to_vn",
    "partOfSpeech": "Từ loại",
    "vocabBreakdown": [{"word": "chữ Hán", "pinyin": "pinyin", "meaningVn": "nghĩa", "partOfSpeech": "từ loại"}],
    "grammarAnalysis": ["Lưu ý ngữ pháp / bộ thủ"],
    "naturalUsageExamples": [{"zh": "Ví dụ chữ Hán", "pinyin": "pinyin", "vn": "dịch nghĩa"}]
  }
}`;

      for (const modelName of candidateModels) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: `${systemPrompt}\nChế độ: ${direction}\nCâu hỏi: "${message}"`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.4,
                },
              }),
              signal: AbortSignal.timeout(4500),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const parsed = JSON.parse(rawText);
              return res.json({ ...parsed, engine: "gemini" });
            }
          }
        } catch {
          // Chuyển sang model tiếp theo hoặc từ điển nội bộ
        }
      }
    }

    const result = analyzeQuery(message, hskLevel);
    return res.json(result);
  } catch (error) {
    console.error("Lỗi AI Controller:", error);
    return res.status(500).json({ error: "Có lỗi khi xử lý câu hỏi với Thầy Giáo AI." });
  }
};
