import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return "خطأ: مفتاح الـ API غير موجود.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // غيرنا الموديل هنا لـ gemini-pro لأنه الأكثر استقراراً ويقبل v1beta
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    // لو لسه فيه مشكلة هيقولنا السبب
    return `خطأ من جوجل: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || "");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `اكتب نص إعلاني لـ ${platform} يروج لأكاديمية Elite English.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    return `خطأ في الإعلان: ${error.message}`;
  }
};
