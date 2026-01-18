export const chatWithTutor = async (history: any[], input: string) => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) return "خطأ: المفتاح مفقود في إعدادات Vercel.";

  // سنحاول استخدام الموديل الأكثر ضماناً برابط مباشر
  const modelName = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }]
      })
    });

    const data = await response.json();

    // هنا سنعرف الحقيقة: لو فيه خطأ، الموقع سيعرضه لك بالتفصيل
    if (data.error) {
      return `تقرير جوجل للخطأ: [${data.error.status}] ${data.error.message}`;
    }

    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    return "وصل رد فارغ من جوجل.";

  } catch (err: any) {
    return `فشل الاتصال تماماً: ${err.message}`;
  }
};

// وظيفة الإعلانات
export const generateMarketingAd = async (platform: string) => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Luxury ad for ${platform}` }] }] })
    });
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e) { return "فشل التوليد."; }
};
