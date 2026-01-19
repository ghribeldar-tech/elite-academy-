export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    if (!apiKey) return "خطأ: المفتاح مفقود.";

    // المسمى "gemini-1.5-flash" هو الأضمن، وسنستخدم رابط v1beta 
    // لأنه الوحيد الذي يدعم التعليمات المتقدمة مجاناً حالياً
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          // إرسال سؤال المستخدم مباشرة كرسالة أولى لتجنب خطأ الـ Role
          { 
            role: "user", 
            parts: [{ text: `You are Mr. Elite, a British AI Tutor. Answer this: ${input}` }] 
          }
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7
        }
      })
    });

    const data = await response.json();

    // فحص الاستجابة
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    if (data.error) {
      // إذا استمر الـ 404، سنقوم بمحاولة أخيرة لموديل gemini-pro (القديم المستقر)
      if (data.error.code === 404) {
          const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
          const fallbackRes = await fetch(fallbackUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: input }] }] })
          });
          const fallbackData = await fallbackRes.json();
          if (fallbackData.candidates) return fallbackData.candidates[0].content.parts[0].text;
      }
      return `تنبيه: ${data.error.message}`;
    }

    return "وصل رد فارغ، يرجى المحاولة مرة أخرى.";

  } catch (error: any) {
    return `خطأ في النظام: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
    return "AI ready.";
};
