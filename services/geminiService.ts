import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  return (import.meta.env.VITE_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();
};

// وظيفة المدرس (شغالة حالياً - حافظنا عليها كما هي)
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
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
    return `تنبيه: ${error.message}`;
  }
};

// وظيفة الإعلانات المحدثة (مع معالجة الضغط الزائد)
export const generateMarketingAd = async (platform: string) => {
  const apiKey = getApiKey();
  // سنستخدم الرابط المستقر v1 لتقليل احتمالية الـ Overload
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Write a premium, short, and luxury marketing ad for ${platform} promoting 'Elite English Academy'. Focus on British RP accent and high-end education. Response should be professional and catchy.` }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      if (data.error.status === "UNAVAILABLE" || data.error.message.includes("overloaded")) {
        return "عذراً سيدي، السيرفر مزدحم حالياً. من فضلك انتظر 5 ثواني واضغط على الزر مرة أخرى، وسأصيغ لك أفضل إعلان.";
      }
      return `خطأ: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (e: any) {
    return "فشل الاتصال بخدمة الإعلانات، يرجى المحاولة بعد قليل.";
  }
};
