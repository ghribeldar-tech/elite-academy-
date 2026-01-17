import { GoogleGenerativeAI } from "@google/generative-ai";

// جلب المفتاح من إعدادات Vercel
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. تصدير وظيفة المحادثة (المستخدمة في AITutor)
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();
} catch (error: any) {
    console.error("AI Error Details:", error);
    return `عذراً، حدث خطأ: ${error.message || "لا يمكن الاتصال بجوجل"}`;
  }

// 2. تصدير وظيفة الإعلانات (المطلوبة في SocialMediaKit)
export const generateMarketingAd = async (platform: string) => {
  try {
    const prompt = `اكتب نص إعلاني جذاب وفاخر لمنصة ${platform} يروج لأكاديمية Elite English Academy، ركز على الجودة واللكنة البريطانية.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Ad Error:", error);
    return "فشل في توليد النص الإعلاني حالياً.";
  }
};
