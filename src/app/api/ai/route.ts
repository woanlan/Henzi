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

      const systemPrompt = `Bạn là "Thầy Giáo AI" - Gia sư tiếng Trung tận tâm, thông thái và am hiểu sâu sắc tại nền tảng HANZI MASTER.
Trình độ người học hiện tại: HSK ${hskLevel}.

NGUYÊN TẮC PHẢN HỒI THÔNG MINH THEO Ý ĐỊNH NGƯỜI HỌC:
1. NẾU NGƯỜI DÙNG HỎI CÂU HỎI HỌC TẬP, PHƯƠNG PHÁP, GIAO TIẾP HOẶC THẮC MẮC NGỮ PHÁP:
   - Hãy trả lời TRỰC TIẾP, chính xác, ân cần và sư phạm bằng tiếng Việt trong trường "content".
   - Đưa ra lời khuyên thiết thực, phân tích dễ hiểu kèm ví dụ câu tiếng Trung minh họa cụ thể.
   - Nếu có ví dụ hoặc câu tiếng Trung trọng tâm trong câu trả lời, hãy điền trường "breakdown" để người học tiện xem Pinyin, âm Hán Việt và nghe đọc. Nếu không cần thiết, "breakdown" có thể để null hoặc tập trung vào ví dụ tiêu biểu.

2. NẾU NGƯỜI DÙNG YÊU CẦU DỊCH, TRA TỪ HOẶC BÓC TÁCH CÂU:
   - Cung cấp bản dịch chuẩn xác theo khẩu ngữ tự nhiên của người bản xứ trong "content".
   - Cung cấp đầy đủ cấu trúc "breakdown" chi tiết gồm: chữ Hán, Pinyin có dấu thanh điệu, nghĩa tiếng Việt, bóc tách từ vựng, điểm ngữ pháp và câu ví dụ.

QUY ĐỊNH ĐỊNH DẠNG JSON TRẢ VỀ:
BẮT BUỘC trả về đúng định dạng JSON hợp lệ duy nhất:
{
  "content": "Lời giải đáp trực diện, thân thiện, rõ ràng và đầy đủ bằng tiếng Việt của Thầy giáo AI",
  "breakdown": {
    "originalZh": "Câu hoặc từ tiếng Trung trọng tâm (chỉ chứa chữ Hán)",
    "pinyin": "Phiên âm pinyin có dấu thanh điệu chuẩn xác",
    "vietnameseTranslation": "Nghĩa tiếng Việt chuẩn xác theo ngữ cảnh",
    "direction": "vn_to_zh hoặc zh_to_vn",
    "partOfSpeech": "Từ loại (Danh từ, Động từ, Tính từ, Cụm từ...)",
    "collocations": ["Cụm từ thông dụng 1", "Cụm từ 2"],
    "vocabBreakdown": [
      {"word": "chữ Hán", "pinyin": "pinyin", "meaningVn": "nghĩa tiếng Việt", "partOfSpeech": "từ loại"}
    ],
    "grammarAnalysis": [
      "Điểm ngữ pháp cốt lõi hoặc mẹo nhớ 1",
      "Lưu ý ngữ cảnh sử dụng 2"
    ],
    "naturalUsageExamples": [
      {"zh": "Câu ví dụ tiếng Trung", "pinyin": "pinyin câu ví dụ", "vn": "dịch nghĩa tiếng Việt"}
    ]
  }
}
Nếu câu hỏi là chào hỏi xã giao hoặc không có câu tiếng Trung nào cần bóc tách, trường "breakdown" có thể chứa một câu tiếng Trung chào đón/khích lệ phù hợp với câu hỏi của người học.`;

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
                    parts: [{ text: `${systemPrompt}\n\nChế độ tra cứu: ${direction}\nNội dung câu hỏi của người học: "${message}"` }],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.5,
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
                content: `Bạn là Thầy Giáo AI dạy tiếng Trung tại HANZI MASTER. Trình độ: HSK ${hskLevel}. Luôn trả lời trực diện, nhiệt tình, sư phạm và trả về JSON định dạng breakdown.`,
              },
              ...conversationHistory.slice(-4).map((m: { sender: string; content: string }) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.content,
              })),
              { role: "user", content: `Câu hỏi/Tra cứu: ${message}` },
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

    // 3. Educational NLP Engine (Local Offline Mode)
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
