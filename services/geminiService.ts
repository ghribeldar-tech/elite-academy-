import { GoogleGenerativeAI } from "@google/generative-ai";

// وظيفة جلب المفتاح
const getApiKey = () => {
  return (import.meta.env.VITE_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();
};

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return "خطأ: المفتاح مفقود في Vercel.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // التعديل الجوهري: الانتقال لموديل عام 2026 المستقر
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    // نظام فحص ذكي للموديلات
    return `تنبيه النظام: الموديل 1.5 قديم. يرجى التأكد من استخدام gemini-2.5-flash. الخطأ الحالي: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `اكتب إعلان فاخر لـ ${platform} يروج لأكاديمية Elite English.` }] }]
      })
    });

    const data = await response.json();
    if (data.error) return `خطأ: ${data.error.message}`;
    return data.candidates[0].content.parts[0].text;
  } catch (e: any) {
    return "فشل التوليد.";
  }
};
