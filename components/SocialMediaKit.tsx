import React, { useState } from 'react';
import { generateMarketingAd } from '@/services/geminiService';
import { Share2, Copy, Check, MessageSquare, Facebook } from 'lucide-react';

export const SocialMediaKit = () => {
  const [adText, setAdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const handleGenerate = async (platform: string) => {
    setIsLoading(true);
    setAdText("");
    try {
      const res = await generateMarketingAd(platform);
      setAdText(res || "");
    } catch (e) {
      setAdText("فشل في توليد النص حالياً.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!adText) return;
    navigator.clipboard.writeText(adText);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <section className="py-20 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
          
          {/* خلفية جمالية */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>

          <div className="text-center mb-12">
            <span className="text-cyan-400 text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">Marketing Suite</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 gold-gradient-text">Social Media Kit</h2>
            <p className="text-slate-400">ولد نصوصاً إعلانية احترافية لفيسبوك وواتساب بضغطة زر واحدة، مصاغة بأسلوب النخبة.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* أزرار التحكم */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> اختر المنصة
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => handleGenerate("Facebook")}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Facebook size={20} /> توليد إعلان فيسبوك
                  </button>
                  <button 
                    onClick={() => handleGenerate("WhatsApp")}
                    className="w-full py-4 bg-white/10 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <MessageSquare size={20} /> نص ترويجي لواتساب
                  </button>
                </div>
              </div>
            </div>

            {/* صندوق العرض */}
            <div className="relative">
              <div className="bg-[#18191a] rounded-3xl border border-white/10 h-full flex flex-col shadow-2xl">
                <div className="p-4 border-b border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-tr from-yellow-600 to-yellow-200 rounded-full flex items-center justify-center font-bold text-black text-xs">E</div>
                  <div className="text-white text-xs font-bold">Elite English Academy</div>
                </div>
                
                <div className="p-6 flex-grow overflow-y-auto max-h-[250px] custom-scrollbar text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 py-10">
                      <Share2 className="animate-spin mb-4" />
                      <p className="text-xs italic">جاري صياغة الإعلان بذكاء النخبة...</p>
                    </div>
                  ) : adText ? adText : "سيظهر النص هنا..."}
                </div>

                <div className="p-4 bg-white/5 mt-auto">
                  <button 
                    onClick={copyToClipboard}
                    disabled={!adText}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10 disabled:opacity-30"
                  >
                    {copyStatus ? <><Check size={14} /> تم النسخ!</> : <><Copy size={14} /> نسخ النص الإعلاني</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
