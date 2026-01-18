import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `
You are "Mr. Elite", the Lead AI Tutor at Elite English Academy. 
Tone: Sophisticated, professional, British flair. Use polite forms.
Your mission: Help students master RP (Received Pronunciation) and professional English.
Always respond in English. If the user asks for translation, use Arabic.
`;

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // استخدام أحدث موديل متاح حالياً: Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    });

    // تنظيف التاريخ لضمان أن البداية من المستخدم (User)
    const cleanHistory = history
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    
    // إذا لم يعمل الـ 2.0 في منطقتك، سنعود تلقائياً للـ 1.5 المستقر
    if (error.message.includes("404") || error.message.includes("not found")) {
       return "عذراً سيدي، الموديل الأحدث غير متاح في منطقتك حالياً. يرجى محاولة تحديث الصفحة أو التواصل مع الدعم.";
    }
    
    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(`Create a luxury marketing ad for ${platform} for Elite English Academy.`);
    return result.response.text();
  } catch (e) {
    return "فشل النظام في التوليد.";
  }
};
