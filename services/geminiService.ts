import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "خطأ: المفتاح غير موجود في إعدادات Vercel.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // سنستخدم الموديل 1.5-flash-8b وهو نسخة خفيفة جداً ومستقرة جداً 
    // وغالباً لا تعطي خطأ 404 في مصر
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    // تنظيف التاريخ لضمان أن أول رسالة من المستخدم
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
    console.error("AI Error:", error);
    
    // إذا ظهر خطأ 404، فهذا يعني أن المفتاح يحتاج لـ "مشروع جديد" من AI Studio
    if (error.message.includes("404")) {
      return "خطأ 404: جوجل لا تجد الموديل. الحل الأكيد: اذهب لـ AI Studio، اضغط Get API Key ثم الزر الأزرق 'Create API key in NEW project' واستخدمه في Vercel.";
    }
    
    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const result = await model.generateContent(`Luxury ad for ${platform}`);
    return result.response.text();
  } catch (e) { return "فشل التوليد."; }
};
