import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `
You are "Mr. Elite", the Lead AI Tutor at Elite English Academy. 
Tone: Sophisticated, professional, British flair. Use polite forms.
Your mission: Help students master RP (Received Pronunciation) and professional English.
Respond in Arabic ONLY if the user asks for translation, otherwise speak English.
`;

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION, 
    });

    // التعديل السحري هنا:
    // نقوم بتصفية التاريخ لضمان أن أول رسالة تذهب لجوجل هي من الـ user
    const cleanHistory = history
      .filter((msg, index) => {
        // نتجاهل أول رسالة إذا كانت من الـ model (رسالة الترحيب)
        if (index === 0 && msg.role === 'model') return false;
        return true;
      })
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Write a luxury ad for ${platform} for Elite English Academy.`);
    return result.response.text();
  } catch (e) {
    return "فشل التوليد.";
  }
};
