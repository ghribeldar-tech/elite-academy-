import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. إعداد تعليمات الشخصية (Mr. Elite)
const SYSTEM_PROMPT = "You are Mr. Elite, a sophisticated British AI Tutor at Elite English Academy. Speak elegant English and be very professional.";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    // جلب المفتاح باستخدام الاسم المختصر الجديد
    const apiKey = (import.meta.env.VITE_KEY || "").trim();
    
    if (!apiKey) {
      return "خطأ تقني: لم يتم العثور على VITE_KEY في إعدادات Vercel.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // تنظيف التاريخ لضمان أن البداية من المستخدم (User) لتجنب أخطاء جوجل
    const cleanHistory = history
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(`${SYSTEM_PROMPT}\n\nUser says: ${input}`);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    
    // إظهار سبب الخطأ بوضوح للمساعدة في الحل
    if (error.message.includes("404")) {
      return "خطأ 404: الموديل غير موجود. تأكد من تفعيل Generative Language API في Google Cloud.";
    }
    if (error.message.includes("429")) {
      return "عذراً سيدي، النظام مزدحم حالياً. يرجى إعادة المحاولة بعد دقيقة.";
    }
    
    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

// وظيفة الإعلانات (لضمان عمل قسم SocialMediaKit)
export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Write a luxury marketing ad for ${platform} promoting Elite English Academy. Focus on British elegance.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return "فشل النظام في توليد الإعلان حالياً.";
  }
};
