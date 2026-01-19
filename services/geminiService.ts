export const chatWithTutor = async (history: any[], input: string) => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) return "Error: API Key missing.";

  // قائمة الموديلات "الذكية" التي سنحاول تجربتها بالترتيب
  const modelsToTry = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-8b", // نسخة خفيفة جداً وتعمل دائماً
    "gemini-pro"           // النسخة الكلاسيكية المستقرة
  ];

  const systemPrompt = "You are Mr. Elite, a professional British AI Tutor. Respond elegantly in English.";

  // دالة المحاولة الآلية
  for (const modelName of modelsToTry) {
    try {
      // سنستخدم v1beta لأنه الأضمن للمفاتيح المجانية
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Certainly. I am ready to assist." }] },
            { role: "user", parts: [{ text: input }] }
          ]
        })
      });

      const data = await response.json();

      // لو الموديل رد بنجاح، مبروك! رجع النص فوراً واقفل الدالة
      if (data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      
      console.warn(`Model ${modelName} failed, moving to next...`);
      // لو الخطأ 404، الحلقة (Loop) هتكمل للموديل اللي بعده تلقائياً
    } catch (err) {
      continue;
    }
  }

  return "عذراً سيدي، جوجل ترفض جميع الموديلات المتاحة في منطقتك حالياً. سأحاول الاتصال بمركز الدعم الفني.";
};

export const generateMarketingAd = async (platform: string) => {
  return "AI Copywriter is initializing...";
};
