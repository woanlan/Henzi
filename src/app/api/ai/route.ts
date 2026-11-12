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

    // 1. If Gemini Key is available, call Gemini models with timeout
    if (geminiKey && !geminiKey.includes("your-key")) {
      const candidateModels = [
        "gemini-3.5-flash",
        "gemini-flash-latest",
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
      ];

      const systemPrompt = `Bạn là "Thầy Giáo AI" - Gia sư tiếng Trung tận tâm, am hiểu sâu sắc tại nền tảng HANZI MASTER.
Trình độ người học: HSK ${hskLevel}.

NGUYÊN TẮC PHẢN HỒI THÔNG MINH:
1. NẾU NGƯỜI HỌC HỎI CÁCH VIẾT, CÁCH ĐỌC, GHI SAO, DỊCH TỪ HOẶC CÂU (ví dụ: "bố ghi sao", "chào buổi sáng nói sao", "ăn cơm dịch sao"):
   - Hãy trả lời TRỰC DIỆN, chính xác, sư phạm bằng tiếng Việt trong "content".
   - Chỉ rõ từ vựng chữ Hán, phiên âm Pinyin, âm Hán Việt, các nét viết cơ bản (nếu hỏi cách ghi/viết) và bộ thủ.
   - ĐẶC BIỆT: Trường "vietnameseTranslation" trong "breakdown" BẮT BUỘC là NGHĨA TIẾNG VIỆT CHÍNH XÁC của từ/câu tiếng Trung đó (TUYỆT ĐỐI KHÔNG lặp lại nguyên văn câu hỏi của người học).

2. NẾU NGƯỜI HỌC HỎI NGỮ PHÁP, PHƯƠNG PHÁP HỌC HOẶC ĐÀM THOẠI:
   - Trả lời ân cần, chi tiết, dễ hiểu bằng tiếng Việt trong "content".
   - Trích xuất điểm ngữ pháp và câu tiếng Trung tiêu biểu vào "breakdown".

QUY ĐỊNH ĐỊNH DẠNG JSON TRẢ VỀ:
BẮT BUỘC trả về định dạng JSON hợp lệ:
{
  "content": "Lời giải đáp chi tiết, thân thiện, sư phạm bằng tiếng Việt (chỉ dẫn cách viết, cách đọc, ví dụ)",
  "breakdown": {
    "originalZh": "Từ hoặc câu tiếng Trung trọng tâm (chữ Hán chuẩn)",
    "pinyin": "Phiên âm pinyin có dấu thanh điệu chuẩn",
    "vietnameseTranslation": "Nghĩa tiếng Việt chuẩn xác (KHÔNG lặp lại câu hỏi của học viên)",
    "direction": "vn_to_zh hoặc zh_to_vn",
    "partOfSpeech": "Từ loại (Danh từ, Động từ, Tính từ...)",
    "vocabBreakdown": [
      {"word": "chữ Hán", "pinyin": "pinyin", "meaningVn": "nghĩa tiếng Việt", "partOfSpeech": "từ loại"}
    ],
    "grammarAnalysis": [
      "Lưu ý phát âm, bộ thủ hoặc ngữ pháp cốt lõi 1",
      "Lưu ý ngữ cảnh sử dụng 2"
    ],
    "naturalUsageExamples": [
      {"zh": "Câu ví dụ tiếng Trung", "pinyin": "pinyin câu ví dụ", "vn": "dịch nghĩa tiếng Việt"}
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
                    parts: [{ text: `${systemPrompt}\n\nChế độ: ${direction}\nCâu hỏi của người học: "${message}"` }],
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
              return NextResponse.json({ ...parsed, engine: "gemini" });
            }
          }
        } catch (modelErr) {
          // Continue to next model if timed out or failed
          console.warn(`Model ${modelName} fetch skipped:`, (modelErr as Error)?.message || modelErr);
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
                content: `Bạn là Thầy Giáo AI dạy tiếng Trung tại HANZI MASTER. Trình độ: HSK ${hskLevel}. Luôn giải thích rõ ràng, sư phạm, nếu hỏi cách viết từ thì hướng dẫn các nét chữ Hán, bộ thủ và ví dụ. Trả về đúng JSON.`,
              },
              ...conversationHistory.slice(-4).map((m: { sender: string; content: string }) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.content,
              })),
              { role: "user", content: `Câu hỏi: ${message}` },
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ ...parsed, engine: "openai" });
        }
      } catch (e) {
        console.warn("OpenAI call skipped:", e);
      }
    }

    // 3. Educational Knowledge Base Engine (Instant High-Precision Pedagogy)
    const result = analyzeQuery(message, hskLevel);
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Có lỗi khi xử lý câu hỏi với Thầy Giáo AI." },
      { status: 500 }
    );
  }
}
