export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawKey.trim();
    
    // سطر تشخيصي: سنعرض لك آخر 4 حروف من المفتاح للتأكد
    const keyHint = apiKey ? apiKey.slice(-4) : "لا يوجد مفتاح";

    if (!apiKey) return "خطأ: الموقع لا يرى أي مفتاح في Vercel.";

    // سنستخدم الرابط المستقر v1 (وليس v1beta) لتجنب الـ 404 في مصر
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
      return `جوجل ترفض المفتاح الذي ينتهي بـ (${keyHint}). الخطأ: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error: any) {
    return `فشل الاتصال: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
    // كود بسيط لضمان الرفع
    return "سيتم تفعيله فور نجاح الشات.";
};
