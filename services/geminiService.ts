import { GoogleGenerativeAI } from "@google/generative-ai";

// وظيفة المدرس الذكي (Mr. Elite)
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_KEY || "").trim();
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
    return `Error: ${error.message}`;
  }
};

// وظيفة توليد الإعلانات الحقيقية (المطلوبة الآن)
export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_KEY || "").trim();
    if (!apiKey) return "API Key missing.";

    // استخدام رابط الاستدعاء المباشر لضمان السرعة وتجنب الـ 404
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `اكتب إعلان تسويقي فاخر واحترافي لمنصة ${platform} يروج لأكاديمية Elite English Academy لتعلم الإنجليزية بلكنة بريطانية راقية. اجعل النص جذاباً، قصيراً، ويتضمن لمسة من الفخامة.` }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }
    return "عذراً، لم أستطع توليد النص، حاول مرة أخرى.";
  } catch (e) {
    return "فشل الاتصال بخدمة الإعلانات.";
  }
};
