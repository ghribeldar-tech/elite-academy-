import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return "Error: API Key is missing in Vercel settings.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("AI Error:", error);
    if (error.message.includes("404")) {
      return "Error 404: Model not found. Please ensure you pasted ONLY the key string in Vercel (starting with AIza) without spaces or '=' signs.";
    }
    return `Error: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Create a luxury ad for Elite English Academy for ${platform}`);
    const response = await result.response;
    return response.text();
  } catch (e: any) {
    return "Generation failed.";
  }
};
