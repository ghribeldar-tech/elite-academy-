import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. إعداد التعليمات البرمجية لـ "Mr. Elite" (لجعل الشخصية احترافية)
const SYSTEM_INSTRUCTION = `
You are "Mr. Elite", the Lead AI Tutor at Elite English Academy. 
Tone: Sophisticated, professional, British flair. Use polite forms.
Your mission: Help students master RP (Received Pronunciation) and professional English.
Always respond in a helpful way. If the user speaks Arabic, guide them towards English.
`;

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawKey.trim();
    
    if (!apiKey || apiKey.length < 10) {
      return "خطأ: مفتاح الـ API غير صالح أو غير موجود في إعدادات Vercel.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. استخدام أحدث إصدار مستقر (Gemini 1.5 Flash)
    // هذا الموديل هو الأسرع والأكثر ذكاءً حالياً
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION, 
    });

    // 3. بدء المحادثة مع إرسال التاريخ (History) ليتذكر الـ AI كلامك
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI System Error:", error);
    
    // فحص ذكي لنوع الخطأ
    if (error.message.includes("404")) {
      return "جوجل لا تجد الموديل. تأكد أنك تستخدم مفتاح API جديد من 'Google AI Studio' وقم بوضعه في Vercel ثم اعمل Redeploy.";
    }
    if (error.message.includes("API key not valid")) {
      return "المفتاح الذي وضعته في Vercel غير صحيح. يرجى التأكد من نسخه بدقة.";
    }
    
    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

// وظيفة الإعلانات المحدثة
export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Write a premium marketing ad for Elite English Academy for ${platform}. Focus on British English and Luxury.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return "فشل النظام في توليد الإعلان.";
  }
};
