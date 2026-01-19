export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "خطأ: المفتاح مفقود.";

    // سنستخدم الرابط المستقر v1 لأنه الأضمن للحصة المجانية (Free Tier)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // لو لسه فيه ضغط (429)، هنطلب من المستخدم يهدأ ثواني
      if (data.error.code === 429) {
        return "عذراً سيدي، هناك ضغط كبير على خوادم جوجل حالياً. من فضلك انتظر 10 ثواني واضغط إرسال مرة أخرى، وسأرد عليك فوراً.";
      }
      return `تنبيه من جوجل: ${data.error.message}`;
    }

    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    return "وصل رد فارغ، جرب مرة ثانية.";

  } catch (error: any) {
    return `خطأ اتصال: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
    return "AI ready.";
};
