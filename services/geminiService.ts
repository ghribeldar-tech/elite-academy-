import { GoogleGenerativeAI } from "@google/generative-ai";

// جلب المفتاح من إعدادات Vercel
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. وظيفة المحادثة (Mr. Elite)
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Chat Error:", error);
    return "عذراً سيدي، النظام قيد الصيانة حالياً.";
  }
};

// 2. وظيفة الإعلانات (SocialMediaKit)
export const generateMarketingAd = async (platform: string) => {
  try {
    const prompt = `اكتب نص إعلاني جذاب لـ ${platform} يروج لأكاديمية Elite English Academy.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Ad Error:", error);
    return "فشل في توليد النص حالياً.";
  }
};
