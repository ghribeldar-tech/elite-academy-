import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return "خطأ تقني: مفتاح الـ API غير موجود في إعدادات Vercel.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error Details:", error);
    // سنعيد الخطأ الحقيقي لنراه في الموقع
    return `خطأ من جوجل: ${error.message || "فشل الاتصال بالخادم"}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `اكتب نص إعلاني لـ ${platform} يروج لأكاديمية Elite English.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    return `خطأ في الإعلان: ${error.message}`;
  }
};
