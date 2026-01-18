export const chatWithTutor = async (history: any[], input: string) => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) return "خطأ: المفتاح مفقود في إعدادات Vercel.";

  // قائمة الموديلات التي سنحاول تشغيلها بالترتيب
  const modelsToTry = [
    "gemini-1.5-flash-latest", 
    "gemini-1.5-flash",
    "gemini-pro"
  ];

  const systemInstruction = "You are Mr. Elite, a sophisticated British AI Tutor at Elite English Academy. Speak English primarily. Be elegant and helpful.";

  // دالة المحاولة
  for (const modelName of modelsToTry) {
    try {
      // سنستخدم v1beta لأنه الأكثر توافقاً مع هذه الموديلات
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemInstruction }] },
            { role: "model", parts: [{ text: "I am ready, sirs. How may I assist you today?" }] },
            ...history.filter((_, i) => i !== 0).map(msg => ({
              role: msg.role === "model" ? "model" : "user",
              parts: [{ text: msg.text }]
            })),
            { role: "user", parts: [{ text: input }] }
          ]
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      
      // إذا أعطى السيرفر خطأ زحمة (429)، ننتظر ونخبر المستخدم
      if (data.error?.status === "RESOURCE_EXHAUSTED") {
        return "عذراً سيدي، السيرفر مزدحم حالياً. يرجى المحاولة بعد 30 ثانية.";
      }

      console.warn(`Model ${modelName} failed, trying next...`);
      continue; // جرب الموديل اللي بعده

    } catch (err) {
      console.error(`Error with ${modelName}:`, err);
      continue;
    }
  }

  return "عذراً سيدي، يبدو أن جميع مسارات الاتصال بجوجل معطلة في منطقتك حالياً. يرجى التأكد من تفعيل الـ API من Google Cloud.";
};

export const generateMarketingAd = async (platform: string) => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a luxury ad for ${platform} for Elite English Academy` }] }]
      })
    });
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    return "فشل التوليد.";
  }
};
