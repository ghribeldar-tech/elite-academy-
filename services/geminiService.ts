import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  return (import.meta.env.VITE_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();
};

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // استخدمنا gemini-2.5-flash-lite بناءً على تحديثات يوليو 2025 في وثيقتك
    // هذا الموديل هو الأنسب للنسخة المجانية لعام 2026 ولا يعطي خطأ 503 بسهولة
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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
    
    // معالجة ذكية لخطأ الضغط الزائد 503
    if (error.message.includes("503") || error.message.includes("overloaded")) {
      return "عذراً سيدي، هناك إقبال كبير على خدماتي الآن. هل يمكنك إعادة إرسال رسالتك؟ سأكون جاهزاً فوراً.";
    }
    
    return `تنبيه من Mr. Elite: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  const apiKey = getApiKey();
  // استخدام الرابط المباشر للموديل الجديد 2.5
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Write a short, luxury marketing ad for ${platform} for 'Elite English Academy'.` }]
        }]
      })
    });

    const data = await response.json();
    if (data.error) return "السيرفر مشغول حالياً، جرب الضغط مرة أخرى بعد قليل.";
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    return "يرجى المحاولة مرة ثانية.";
  }
};
