export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "Error: No Key.";

    // سنستخدم الموديل 2.0 لأنه الوحيد الذي "رآه" حسابك سابقاً
    // وسنطلب "أصغر رد ممكن" لتوفير الحصة
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }],
        generationConfig: {
          maxOutputTokens: 20, // طلبنا 20 كلمة فقط (حصة صغيرة جداً)
          temperature: 0.1     // جعل الرد مباشراً جداً
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    if (data.error) {
       // لو أعطى 429 (زحمة) أو 404، سنجرب فوراً الموديل "8b" الخفيف جداً
       const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`;
       const res8b = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] })
       });
       const data8b = await res8b.json();
       if (data8b.candidates) return data8b.candidates[0].content.parts[0].text;
       
       return `جوجل مشغولة: ${data.error.message}`;
    }

    return "حاول مرة أخرى.";

  } catch (error: any) {
    return `خطأ: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
    return "Ready.";
};
