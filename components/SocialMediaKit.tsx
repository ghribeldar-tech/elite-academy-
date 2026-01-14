// كود مولد نصوص السوشيال ميديا
import React, { useState } from 'react';
import { generateMarketingAd } from '../services/geminiService';

export const SocialMediaKit: React.FC = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    setLoading(true);
    const res = await generateMarketingAd("Facebook");
    setText(res || "");
    setLoading(false);
  };

  return (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
        <h3 className="text-2xl font-luxury gold-gradient mb-4 text-center">AI Copywriter</h3>
        <textarea 
          className="w-full h-40 bg-black/40 rounded-2xl p-6 text-white text-sm border border-white/5 mb-6"
          value={text} readOnly placeholder="سيظهر النص الإعلاني هنا..."
        />
        <button onClick={handleGen} className="w-full py-4 border border-[#D4AF37] text-[#D4AF37] rounded-2xl font-bold">
          {loading ? "Writing..." : "Generate Ad Text"}
        </button>
      </div>
    </div>
  );
};