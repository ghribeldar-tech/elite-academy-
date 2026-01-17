import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// وظيفة الشات (Mr. Elite)
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const result = await model.generateContent(input);
    return result.response.text();
  } catch (error) {
    return "عذراً، النظام قيد الصيانة.";
  }
};

// وظيفة الإعلانات (للملفات اللي بتشتكي)
export const generateMarketingAd = async (platform: string) => {
  try {
    const prompt = `اكتب نص إعلاني فاخر لأكاديمية Elite English لترويجه على ${platform}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "فشل في توليد النص حالياً.";
  }
};
