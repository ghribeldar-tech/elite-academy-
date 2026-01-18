import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "خطأ: المفتاح مفقود.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // استخدمنا gemini-pro لأنه الأكثر استقراراً وقبولاً في جميع المناطق
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // وضع التعليمات داخل الرسالة مباشرة لضمان التوافق (بدون systemInstruction)
    const prompt = `You are Mr. Elite, a British AI Tutor. Respond to this: ${input}`;

    // إرسال الطلب بشكل مبسط جداً بدون تاريخ معقد حالياً للتأكد من التشغيل
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    
    // إذا ظهر خطأ الزحمة (429) سنطلب منه الانتظار فقط
    if (error.message.includes("429")) {
      return "عذراً سيدي، هناك ضغط مؤقت. سأرد عليك خلال ثوانٍ قليلة، يرجى إعادة المحاولة.";
    }
    
    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`Luxury ad for ${platform}`);
    return result.response.text();
  } catch (e) {
    return "فشل التوليد.";
  }
};
