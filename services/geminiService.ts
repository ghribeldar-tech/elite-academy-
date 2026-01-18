export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "خطأ: المفتاح مفقود في إعدادات Vercel.";

    // التعليمات البرمجية لـ Mr. Elite
    const systemInstruction = "You are Mr. Elite, a sophisticated British AI Tutor. Speak English primarily.";

    // الاتصال المباشر برابط جوجل المستقر (v1) لتجنب خطأ 404
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemInstruction }] },
          { role: "model", parts: [{ text: "Understood. I am ready to assist as Mr. Elite." }] },
          ...history.map(msg => ({
            role: msg.role === "model" ? "model" : "user",
            parts: [{ text: msg.text }]
          })),
          { role: "user", parts: [{ text: input }] }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      if (data.error.status === "RESOURCE_EXHAUSTED") return "عذراً سيدي، السيرفر مزدحم حالياً. حاول ثانية بعد دقيقة.";
      return `خطأ من جوجل: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error: any) {
    return `عذراً سيدي، واجهت مشكلة تقنية: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  // نفس المنطق للإعلانات
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Create a luxury ad for ${platform} for Elite English Academy` }] }]
      })
    });
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    return "فشل التوليد.";
  }
};
