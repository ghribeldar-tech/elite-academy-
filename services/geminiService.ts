export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "Error: API Key missing.";

    // سنستخدم الرابط الذي أثبت نجاحه في الاتصال سابقاً (v1beta)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }]
      })
    });

    const data = await response.json();

    // إذا نجح الرد، رجعه فوراً
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    // إذا أعطى 404 أو أي خطأ، سنقوم بمناورة أخيرة وتجربة الموديل المستقر (Pro)
    if (data.error) {
       const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
       const fallbackRes = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] })
       });
       const fallbackData = await fallbackRes.json();
       
       if (fallbackData.candidates) {
         return fallbackData.candidates[0].content.parts[0].text;
       }
       
       return `تنبيه من جوجل: ${data.error.message}`;
    }

    return "وصل رد فارغ، يرجى المحاولة مرة أخرى.";

  } catch (error: any) {
    return `خطأ في الاتصال: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
    return "AI is ready.";
};
