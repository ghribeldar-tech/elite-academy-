import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    // جلب المفتاح وتنظيفه من أي مسافات أو علامات إضافية
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawKey.includes('=') ? rawKey.split('=')[1].trim() : rawKey.trim();
    
    if (!apiKey) return "خطأ: مفتاح الـ API مفقود في إعدادات Vercel.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // استخدام النموذج المستقر والسريع
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI System Error:", error);
    // رسالة ذكية إذا استمر الخطأ
    if (error.message.includes("404")) {
      return "خطأ 404: جوجل لا تجد النموذج. تأكد أنك أنشأت المفتاح داخل 'My First Project' المفعّل فيه الـ API.";
    }
    return `عذراً، حدث خطأ: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawKey.includes('=') ? rawKey.split('=')[1].trim() : rawKey.trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Create a luxury ad for ${platform}`);
    return result.response.text();
  } catch (e) {
    return "فشل التوليد حالياً.";
  }
};
