import React, { useState } from 'react';
import { X, Code, Copy, Check, ShieldCheck, Terminal, Layout, Zap, PartyPopper } from 'lucide-react';

export const SourceExplorer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const stats = [
    { label: "Status", value: "Ready", color: "text-green-500" },
    { label: "Version", value: "2026.1.0", color: "text-[#D4AF37]" },
    { label: "AI Engine", value: "Gemini 1.5", color: "text-blue-400" }
  ];

  return (
    <>
      {/* زر التشغيل العائم */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 w-16 h-16 bg-[#D4AF37] text-black rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] z-[400] hover:scale-110 active:scale-90 transition-all border border-black group"
      >
        <Code size={24} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#020617] animate-pulse"></div>
      </button>

      {/* Modal النجاح والبيانات */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex flex-col animate-in" dir="rtl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-[#D4AF37]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black gold-gradient-text uppercase tracking-widest">Elite Deployment Success</h2>
                <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em]">MISSION ACCOMPLISHED • SYSTEM LIVE</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-500 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-8 p-6 bg-green-500/10 rounded-full border border-green-500/20">
              <PartyPopper size={60} className="text-green-500 animate-bounce" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4">أكاديمية النخبة أصبحت أونلاين!</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-12">تمت عملية البناء والرفع بنجاح. جميع الأنظمة البرمجية والذكاء الاصطناعي تعمل الآن بأعلى كفاءة.</p>

            <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">{s.label}</p>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-black border-t border-white/5 text-center">
            <button 
              onClick={() => window.open('https://github.com', '_blank')}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-[#D4AF37] rounded-xl text-xs font-black transition-all border border-[#D4AF37]/30"
            >
              VIEW SOURCE ON GITHUB
            </button>
          </div>
        </div>
      )}
    </>
  );
};
