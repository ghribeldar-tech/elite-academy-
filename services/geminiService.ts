import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    // جلب المفتاح - سنقوم بتنظيفه من أي مسافات مخفية قد تكون موجودة
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawKey.trim();
    
    if (!apiKey) return "Error: API Key is missing. Please check Vercel Settings.";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // سنستخدم gemini-1.5-flash لأنه الأسرع والأكثر توفراً حالياً
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    
    // إذا ظهر خطأ 404، سنعطيك تعليمات دقيقة للحل
    if (error.message.includes("404")) {
      return "خطأ 404: جوجل لا تجد هذا النموذج لهذا المفتاح. الحل: اذهب لـ AI Studio، أنشئ مفتاح جديد بالضغط على 'Create API key in NEW project'، واستخدمه في Vercel.";
    }
    
    return `حدث خطأ: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Create a luxury ad for Elite Academy for ${platform}`);
    return result.response.text();
  } catch (e) {
    return "Generation failed.";
  }
};
