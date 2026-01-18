import { GoogleGenerativeAI } from "@google/generative-ai";

// وظيفة المدرس (Mr. Elite)
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawKey.trim();
    
    // Hint للتأكد من المفتاح في الموقع
    const keyHint = apiKey ? apiKey.slice(-4) : "NONE";

    if (!apiKey) return "خطأ: المفتاح مفقود في إعدادات Vercel.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // تنظيف التاريخ لضمان البداية من user
    const cleanHistory = history
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({ history: cleanHistory });
    const result = await chat.sendMessage(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error(error);
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const keyHint = apiKey ? apiKey.slice(-4) : "NONE";
    return `خطأ جوجل [المفتاح الحالي: ${keyHint}]: ${error.message}`;
  }
};

// وظيفة الإعلانات (لحل مشكلة SocialMediaKit)
export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`اكتب إعلان جذاب لـ ${platform} يروج لأكاديمية Elite English Academy`);
    const response = await result.response;
    return response.text();
  } catch (e: any) {
    return "فشل توليد الإعلان.";
  }
};
