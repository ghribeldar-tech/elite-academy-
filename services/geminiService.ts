import { GoogleGenerativeAI } from "@google/generative-ai";

// استدعاء المفتاح من إعدادات Vercel
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. وظيفة الشات (الخاصة بـ Mr. Elite)
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const result = await model.generateContent(input);
    return result.response.text();
  } catch (error) {
    console.error("Chat Error:", error);
    return "عذراً سيدي، النظام قيد الصيانة حالياً.";
  }
};

// 2. وظيفة توليد الإعلانات (التي يطلبها ملف SocialMediaKit)
export const generateMarketingAd = async (platform: string) => {
  try {
    const prompt = `اكتب نص إعلاني فاخر وجذاب لأكاديمية Elite English لترويجه على منصة ${platform}. ركز على الرقي والاحترافية واللكنة البريطانية.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Marketing Ad Error:", error);
    return "عذراً، لم أستطع توليد النص الإعلاني في الوقت الحالي.";
  }
};
