export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "خطأ: المفتاح مفقود.";

    // سنستخدم الموديل 8b لأنه الأضمن حالياً لتخطي خطأ الـ 404
    const modelName = "gemini-1.5-flash-8b";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // لو حتى الـ 8b أعطى خطأ، سنعرض رسالة جوجل الأصلية
      return `تنبيه من جوجل: [${data.error.message}]`;
    }

    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    return "وصل رد فارغ، حاول مرة أخرى.";

  } catch (error: any) {
    return `خطأ في النظام: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  return "إعلان تجريبي..";
};
