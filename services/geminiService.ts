import { GoogleGenerativeAI } from "@google/generative-ai";

// وظيفة جلب المفتاح الذكية
const getApiKey = () => {
  return (import.meta.env.VITE_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();
};

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return "خطأ: مفتاح الـ API مفقود في إعدادات Vercel. تأكد من وجود VITE_KEY.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    return `خطأ في الشات: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return "API Key missing in Vercel settings.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `اكتب إعلان احترافي لمنصة ${platform} يروج لأكاديمية Elite English Academy بأسلوب فخم وقصير.` }]
        }]
      })
    });

    const data = await response.json();
    if (data.error) return `جوجل ترفض الطلب: ${data.error.message}`;
    
    return data.candidates[0].content.parts[0].text;
  } catch (e: any) {
    return `فشل التوليد: ${e.message}`;
  }
};
