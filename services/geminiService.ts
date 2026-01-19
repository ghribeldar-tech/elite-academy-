export const chatWithTutor = async (history: any[], input: string) => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) return "خطأ: المفتاح مفقود في Vercel.";

  // سنستخدم الموديل 1.5 Flash مع "رابط خاص" يتجاوز معظم مشاكل الـ 404
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input }] }] // إرسال السؤال مباشرة بدون تعقيدات
      })
    });

    const data = await response.json();

    // إذا نجح الرد
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    // إذا أرجع جوجل خطأ صريحاً، سنعرضه لك كما هو لنعرف السبب
    if (data.error) {
      return `جوجل تقول: [${data.error.message}]`;
    }

    return "وصل رد غريب من السيرفر، يرجى المحاولة مرة أخرى.";

  } catch (err: any) {
    return `فشل الاتصال بالإنترنت: ${err.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  return "إعلان تجريبي..";
};
