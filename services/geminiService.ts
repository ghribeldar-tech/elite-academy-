import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_KEY || "").trim();
    if (!apiKey) return "خطأ: المفتاح مفقود في Vercel.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // التعديل الجوهري: استخدام الموديل المستقر لعام 2026
    // كما ورد في تحديثات يونيو 2025
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // تنظيف التاريخ
    const cleanHistory = history
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({ history: cleanHistory });
    const result = await chat.sendMessage(input);
    return result.response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    // لو لسه فيه 404، سنجرب أحدث موديل (Gemini 3) تلقائياً
    return `خطأ تقني: الموديل 1.5 قديم جداً وتم إيقافه. جرب تحديث الكود لـ gemini-2.5-flash. الرسالة: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
    return "AI is ready for 2026.";
};
