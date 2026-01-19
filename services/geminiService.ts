import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "Error: API Key missing.";

    // التعليمات البرمجية لجعل الشخصية بريطانية فخمة
    const systemPrompt = "You are Mr. Elite, a sophisticated British AI Tutor at Elite English Academy. Speak elegant English.";

    // الاتصال المباشر عبر رابط جوجل المستقر (v1) لتجنب خطأ 404
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Understood. I am ready." }] },
          // إضافة الرسائل السابقة (اختياري، سنرسل رسالة المستخدم الحالية فقط لضمان السرعة الآن)
          { role: "user", parts: [{ text: input }] }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return `خطأ من جوجل: ${data.error.message}`;
    }

    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    return "وصل رد فارغ، يرجى المحاولة مرة أخرى.";

  } catch (error: any) {
    return `فشل الاتصال: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Create a luxury ad for ${platform}` }] }]
      })
    });
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    return "فشل التوليد.";
  }
};
