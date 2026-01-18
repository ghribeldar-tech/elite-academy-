import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return "خطأ: مفتاح الـ API غير موجود.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // سنستخدم "gemini-1.5-flash" وهو الأسرع والمجاني حالياً
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // إضافة إعدادات إضافية لضمان الاستجابة
    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    // إذا ظهر خطأ 404 مرة أخرى، سنظهر رسالة توضح أن المشكلة في المفتاح
    if (error.message.includes("404")) {
      return "خطأ 404: جوجل لا تتعرف على هذا المفتاح. يرجى إنشاء مفتاح API جديد من خيار 'Create API key in new project' في AI Studio.";
    }
    return `خطأ من جوجل: ${error.message}`;
  }
};

// وظيفة الإعلانات
export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Write a luxury ad for Elite English Academy for ${platform}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    return `خطأ: ${error.message}`;
  }
};
