import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("API Key is missing!");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // استخدام نموذج Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("AI Error:", error);
    return "عذراً سيدي، واجهت مشكلة في الاتصال بمركزي العصبي. هل يمكنك المحاولة مرة أخرى؟";
  }
};
