import { GoogleGenerativeAI } from "@google/generative-ai";

// نسخة الإصلاح النهائي - بتاريخ اليوم 19 يناير
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    // محاولة جلب المفتاح بكل الطرق الممكنة لتجنب أي تعارض
    const apiKey = import.meta.env.VITE_KEY || 
                   import.meta.env.VITE_GEMINI_API_KEY || 
                   "MISSING";
    
    if (apiKey === "MISSING") {
      return `خطأ: الموقع لا يرى المفتاح في إعدادات Vercel. تأكد من تفعيل خيار Production في الإعدادات.`;
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    return `استجابة جوجل: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  return "AI Copywriter is ready.";
};
