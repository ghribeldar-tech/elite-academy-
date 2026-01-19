import { GoogleGenAI } from "@google/genai";

export const chatWithTutor = async (history, userInput) => {
  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: userInput }] }
    ]
  });
  return response.text;
};
