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
    
    // استخدمنا gemini-1.5-flash النسخة المستقرة والأكثر توفراً
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // تنظيف التاريخ
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
      },
    });

    const result = await chat.sendMessage(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    // لو ظهر خطأ الزحمة تاني، هنقول للمستخدم ينتظر ثواني
    if (error.message.includes("429")) {
      return "عذراً سيدي، هناك ضغط كبير على خوادم الذكاء الاصطناعي حالياً. يرجى المحاولة بعد 30 ثانية.";
    }
    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Create a luxury marketing ad for ${platform} for Elite English Academy.`);
    return result.response.text();
  } catch (e) {
    return "فشل النظام في التوليد.";
  }
};
