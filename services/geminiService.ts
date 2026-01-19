export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "Error: API Key missing.";

    // سنستخدم الرابط المستقر v1 مع المسمى الكامل للموديل
    // هذا الرابط هو الأضمن لتجنب خطأ 404 في مصر
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
      // لو لسه فيه مشكلة، الكود هيقولنا السبب الحقيقي من جوجل
      return `استجابة جوجل: [${data.error.message}]`;
    }

    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    return "لم يتلقَ النظام رداً، حاول مرة أخرى.";

  } catch (error: any) {
    return `خطأ في الاتصال: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  return "إعلان تجريبي..";
};
