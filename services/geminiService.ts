import { GoogleGenerativeAI } from "@google/genai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    // استدعاء المفتاح من بيئة Vite
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("API Key is missing!");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // استخدام نموذج Gemini 1.5 Flash السريع والمستقر
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const result = await model.generateContent(input);
    const response = await result.response;
    const text = response.text();
    
    return text;

  } catch (error) {
    console.error("AI System Error:", error);
    // الرسالة التي ستظهر للمستخدم في حال فشل الاتصال فعلياً
    return "عذراً سيدي، واجهت مشكلة في الاتصال بمركزي العصبي. هل يمكنك المحاولة مرة أخرى؟";
  }
};
