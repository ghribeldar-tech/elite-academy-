import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "Error: API Key is missing in Vercel.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // استخدمنا هذا المسمى الدقيق gemini-1.5-flash
    // وهو الموديل الذي يمتلك أعلى حصة مجانية (Free Tier) حالياً
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // إرسال سؤال المستخدم مباشرة مع تعليمات الشخصية
    const prompt = `You are Mr. Elite, a sophisticated British AI Tutor. Respond to this: ${input}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    
    // إذا ظهر خطأ الـ 429 (الزحمة) مرة أخرى، سنطلب من المستخدم الصبر ثوانٍ
    if (error.message.includes("429")) {
      return "عذراً سيدي، هناك ضغط مؤقت على النظام. سأرد عليك خلال 30 ثانية، يرجى إعادة إرسال رسالتك.";
    }
    
    // إذا ظهر الـ 404، سنقوم بإرشادك للخطوة الأخيرة في الإعدادات
    if (error.message.includes("404")) {
      return "خطأ 404: جوجل لا تجد الموديل. يرجى التأكد من تفعيل 'Generative Language API' في Google Cloud Console للمشروع المرتبط بهذا المفتاح.";
    }

    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Create a luxury ad for ${platform}`);
    return result.response.text();
  } catch (e) {
    return "فشل التوليد.";
  }
};
