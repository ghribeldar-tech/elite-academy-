// كود مولد البوسترات الإعلانية الذكي
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const AdPromotion: React.FC = () => {
  const [generatedAd, setGeneratedAd] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAd = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: "Luxury 3D Golden Logo for Elite English Academy, 4k, cinematic lighting" }] },
        config: { imageConfig: { aspectRatio: "9:16" } }
      });
      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      if (part) setGeneratedAd(`data:image/png;base64,${part.inlineData.data}`);
    } catch (e) { alert("Error generating ad"); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="py-20 bg-black/40 border-y border-white/5 text-center">
      <h2 className="text-3xl font-luxury gold-gradient mb-8">AI Poster Generator</h2>
      <div className="max-w-sm mx-auto bg-white/5 p-8 rounded-[3rem] border border-white/10">
        {generatedAd && <img src={generatedAd} className="w-full rounded-2xl mb-6 shadow-2xl" />}
        <button 
          onClick={generateAd}
          disabled={isGenerating}
          className="w-full py-4 bg-[#D4AF37] text-black rounded-2xl font-black"
        >
          {isGenerating ? "Designing..." : "Generate Elite Poster"}
        </button>
      </div>
    </div>
  );
};