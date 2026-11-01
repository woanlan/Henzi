import { NextRequest, NextResponse } from "next/server";
import { analyzeQuery } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const { message, hskLevel = 1, conversationHistory = [], customApiKey } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Tin nhắn không được để trống" }, { status: 400 });
    }

    const geminiKey = (customApiKey && !customApiKey.startsWith("sk-")) ? customApiKey : process.env.GEMINI_API_KEY;
    const openAiKey = (customApiKey && customApiKey.startsWith("sk-")) ? customApiKey : process.env.OPENAI_API_KEY;

    // 1. If Gemini Key is available, call Gemini 3.8 Flash (Ultra-fast & High-Intelligence)
    if (geminiKey && !geminiKey.includes("your-key")) {
      try {
        const systemPrompt = `Bạn là Gia Sư AI Tiếng Trung chuyên nghiệp cho học viên Việt Nam tại nền tảng HANZI MASTER.
Trình độ HSK hiện tại của học viên: HSK ${hskLevel}.
Hãy giải thích ngắn gọn, thân thiện, mang tính sư phạm bằng tiếng Việt và chuẩn mực tiếng Trung.
KHI GIẢI THÍCH MỘT CÂU TIẾNG TRUNG HOẶC TỪ VỰNG HOẶC DỊCH CÂU, BẮT BUỘC trả về định dạng JSON hợp lệ duy nhất:
{
  "content": "Lời phản hồi chào hỏi, giải thích tổng quan ngắn gọn bằng tiếng Việt",
  "breakdown": {
    "originalZh": "Câu hoặc từ tiếng Trung chuẩn (chỉ gồm chữ Hán, KHÔNG chứa chữ tiếng Việt)",
    "pinyin": "Phiên âm pinyin có dấu thanh điệu chuẩn xác",
    "vietnameseTranslation": "Bản dịch nghĩa tiếng Việt chuẩn xác",
    "vocabBreakdown": [
      {"word": "生词", "pinyin": "shēngcí", "meaningVn": "nghĩa tiếng Việt", "partOfSpeech": "Danh từ/Động từ/Tính từ..."}
    ],
    "grammarAnalysis": [
      "Điểm ngữ pháp 1: ...",
      "Điểm ngữ pháp 2: ..."
    ],
    "naturalUsageExamples": [
      {"zh": "Mẫu câu ví dụ chữ Hán", "pinyin": "pinyin ví dụ", "vn": "dịch ví dụ tiếng Việt"}
    ]
  }
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nTin nhắn của học viên: "${message}"` }],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
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
          console.warn("Gemini API returned error status:", geminiRes.status);
        }
      } catch (err) {
        console.warn("Gemini call exception:", err);
      }
    }

    // 2. If OpenAI Key is available, call OpenAI
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
                content: `Bạn là Gia Sư AI Tiếng Trung chuyên nghiệp cho học viên Việt Nam tại nền tảng HANZI MASTER. Trình độ: HSK ${hskLevel}. Luôn trả về JSON định dạng breakdown.`,
              },
              ...conversationHistory.slice(-4).map((m: { sender: string; content: string }) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.content,
              })),
              { role: "user", content: message },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
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
      { error: "Có lỗi khi xử lý yêu cầu gia sư AI." },
      { status: 500 }
    );
  }
}
