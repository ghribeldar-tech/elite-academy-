export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "Error: API Key missing.";

    // سنستخدم المسمى "latest" وهو المسمى السحري الذي يحل مشاكل الـ 404 في مصر
    const modelName = "gemini-1.5-flash-latest"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }],
        generationConfig: {
          maxOutputTokens: 100, // حصة صغيرة لضمان القبول
          temperature: 0.7
        }
      })
    });

    const data = await response.json();

    // إذا نجح الرد، مبروك!
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    // إذا ظهر خطأ الزحمة (429) أو غيره، سنظهره لك بوضوح
    if (data.error) {
      return `تنبيه من جوجل: ${data.error.message}`;
    }

    return "وصل رد فارغ، يرجى المحاولة مرة أخرى.";

  } catch (error: any) {
    return `خطأ في النظام: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
    return "AI is ready.";
};
