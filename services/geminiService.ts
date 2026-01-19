export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "خطأ: المفتاح مفقود.";

    // سنحاول استخدام Gemini 2.0 Flash لأنه الموديل الوحيد الذي استجاب لحسابك بـ 429
    // وسنستخدم الرابط المستقر v1 لضمان توفر الحصة
    const modelName = "gemini-2.0-flash-exp"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }],
        generationConfig: {
            maxOutputTokens: 500 // تقليل الاستهلاك لتجنب الـ 429
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      // إذا أعطى 429 (زحمة) أو 404، سنقوم بمناورة أخيرة وتجربة الموديل المستقر
      if (data.error.code === 429 || data.error.code === 404) {
          const fallbackUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
          const fallbackRes = await fetch(fallbackUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] })
          });
          const fallbackData = await fallbackRes.json();
          if (fallbackData.candidates) return fallbackData.candidates[0].content.parts[0].text;
          return `تنبيه: ${data.error.message}`;
      }
      return `جوجل تقول: ${data.error.message}`;
    }

    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    return "رد فارغ، حاول ثانية.";

  } catch (error: any) {
    return `خطأ: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
    return "AI ready.";
};
