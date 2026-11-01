import { NextRequest, NextResponse } from "next/server";
import { analyzeQuery } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const { message, hskLevel = 1, conversationHistory = [], customApiKey, direction = "auto" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Tin nhắn không được để trống" }, { status: 400 });
    }

    const geminiKey = (customApiKey && !customApiKey.startsWith("sk-")) ? customApiKey : process.env.GEMINI_API_KEY;
    const openAiKey = (customApiKey && customApiKey.startsWith("sk-")) ? customApiKey : process.env.OPENAI_API_KEY;

    // 1. If Gemini Key is available, call Gemini models with fallback
    if (geminiKey && !geminiKey.includes("your-key")) {
      const candidateModels = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-flash-lite-latest",
        "gemini-3.8-flash",
      ];

      const systemPrompt = `Bạn là Từ Điển Song Hướng Hán-Việt & Việt-Hán chuyên nghiệp chuẩn Cambridge Dictionary kiêm Gia Sư AI tại nền tảng HANZI MASTER.
Trình độ mục tiêu: HSK ${hskLevel}.

QUY TẮC TRA CỨU SONG HƯỚNG THEO CHUẨN TỪ ĐIỂN CAMBRIDGE:
1. NẾU NGƯỜI DÙNG NHẬP TIẾNG VIỆT (hoặc chế độ Việt -> Hán):
   - Chuyển ngữ/dịch chuẩn xác sang Chữ Hán (giản thể) tương ứng nhất.
   - Cung cấp phiên âm Pinyin đầy đủ dấu thanh điệu.
   - Nêu rõ Từ loại (Danh từ, Động từ, Tính từ, Lượng từ...) và lượng từ đi kèm (nếu là danh từ).
   - Đưa ra định nghĩa tiếng Việt chi tiết, sắc thái biểu đạt.
   - Bóc tách các từ cấu thành (vocabBreakdown).
   - Nêu các cụm từ hay đi kèm (collocations) và từ đồng nghĩa/trái nghĩa.
   - Cung cấp ít nhất 2 câu ví dụ song ngữ Hán - Việt thực tế.

2. NẾU NGƯỜI DÙNG NHẬP TIẾNG TRUNG (hoặc chế độ Hán -> Việt):
   - Giải thích nghĩa tiếng Việt chuẩn xác, pinyin có dấu thanh điệu.
   - Bóc tách từ vựng, từ loại, phân tích ngữ pháp sâu sắc và câu ví dụ song ngữ.

BẮT BUỘC TRẢ VỀ ĐỊNH DẠNG JSON HỢP LỆ DUY NHẤT:
{
  "content": "Lời giải thích mở đầu ngắn gọn, chuẩn mực sư phạm từ điển Cambridge",
  "breakdown": {
    "originalZh": "Từ hoặc câu tiếng Trung chuẩn (chỉ gồm chữ Hán, KHÔNG chứa chữ tiếng Việt)",
    "pinyin": "Phiên âm pinyin có dấu thanh điệu chuẩn xác",
    "vietnameseTranslation": "Nghĩa tiếng Việt chuẩn xác theo ngữ cảnh từ điển",
    "direction": "vn_to_zh hoặc zh_to_vn",
    "partOfSpeech": "Danh từ / Động từ / Tính từ / Lượng từ...",
    "collocations": ["Cụm từ hay đi kèm 1", "Cụm từ 2"],
    "synonyms": ["Từ đồng nghĩa 1", "Từ đồng nghĩa 2"],
    "antonyms": ["Từ trái nghĩa 1"],
    "vocabBreakdown": [
      {"word": "chữ Hán", "pinyin": "pinyin", "meaningVn": "nghĩa tiếng Việt", "partOfSpeech": "từ loại"}
    ],
    "grammarAnalysis": [
      "Điểm ngữ pháp / Lưu ý cách dùng 1",
      "Lượng từ đi kèm / Lưu ý 2"
    ],
    "naturalUsageExamples": [
      {"zh": "Câu ví dụ tiếng Trung", "pinyin": "pinyin ví dụ", "vn": "dịch nghĩa tiếng Việt ví dụ"}
    ]
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
                    parts: [{ text: `${systemPrompt}\n\nChế độ yêu cầu: ${direction}\nNội dung người dùng tra cứu: "${message}"` }],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.4,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const parsed = JSON.parse(rawText);
              return NextResponse.json(parsed);
            }
          } else {
            const errBody = await geminiRes.text();
            console.warn(`Model ${modelName} returned ${geminiRes.status}:`, errBody.slice(0, 150));
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} call exception:`, modelErr);
        }
      }
    }

    // 2. If OpenAI Key is available
    if (openAiKey && !openAiKey.includes("your-key") && openAiKey.startsWith("sk-")) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Bạn là Từ Điển Song Hướng Hán-Việt & Việt-Hán chuẩn Cambridge Dictionary tại HANZI MASTER. Trình độ: HSK ${hskLevel}. Luôn trả về JSON định dạng breakdown.`,
              },
              ...conversationHistory.slice(-4).map((m: { sender: string; content: string }) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.content,
              })),
              { role: "user", content: `Tra cứu (${direction}): ${message}` },
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json(parsed);
        }
      } catch (e) {
        console.warn("OpenAI call failed:", e);
      }
    }

    // 3. High-precision Educational NLP Engine (Local Offline Mode)
    const result = analyzeQuery(message, hskLevel);
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Có lỗi khi xử lý tra cứu từ điển." },
      { status: 500 }
    );
  }
}
