import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `
You are "Mr. Elite", the Lead AI Tutor at Elite English Academy. 
Tone: Sophisticated, professional, British flair. Use polite forms.
Your mission: Help students master RP (Received Pronunciation) and professional English.
Respond in English always.
`;

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawKey.trim();
    
    if (!apiKey) return "خطأ: المفتاح مفقود في إعدادات Vercel.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // سنحاول استخدام 1.5 Flash لأنه الأفضل، وإذا أعطى 404 سنجرب الموديلات الأخرى
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // تنظيف التاريخ لضمان أن أول رسالة هي من المستخدم (User)
    const cleanHistory = history
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    
    // إذا ظهر خطأ 404، سنعطي المستخدم حلاً فورياً
    if (error.message.includes("404")) {
      return "عذراً سيدي، جوجل لا تجد هذا الموديل في منطقتك حالياً. يرجى محاولة كتابة رسالة أخرى أو تحديث الصفحة بعد دقائق.";
    }
    
    // إذا ظهر خطأ 429 (الزحمة)، سنطلب منه الانتظار
    if (error.message.includes("429")) {
      return "عذراً سيدي، هناك ضغط كبير على السيرفر حالياً. سأكون جاهزاً للرد عليك خلال 30 ثانية.";
    }
    
    return `حدث خطأ تقني: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Luxury ad for ${platform}`);
    return result.response.text();
  } catch (e) {
    return "فشل التوليد.";
  }
};
