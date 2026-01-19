import React, { useState, useEffect } from 'react';
import { Github, CheckCircle2, ArrowUpCircle, Cloud, Terminal, X } from 'lucide-react';

export const GitPushModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  const pushSteps = [
    { id: 1, text: "Committing changes to local branch...", delay: 800 },
    { id: 2, text: "Establishing secure connection to GitHub...", delay: 1200 },
    { id: 3, text: "Pushing assets to production branch...", delay: 1500 },
    { id: 4, text: "Vercel Build Initialized...", delay: 1000 }
  ];

  useEffect(() => {
    if (isVisible && step < pushSteps.length) {
      const timer = setTimeout(() => setStep(s => s + 1), pushSteps[step].delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, step]);

  return (
    <>
      {/* زر التشغيل (يظهر في أسفل اليمين) */}
      <button 
        onClick={() => { setIsVisible(true); setStep(0); }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all z-[400] group"
      >
        <Github size={24} className="group-hover:scale-110 transition-transform" />
      </button>

      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsVisible(false)}></div>
          
          <div className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Github size={20} className="text-[#D4AF37]" />
                <span className="text-xs font-black text-white uppercase tracking-widest">Git Push Sync</span>
              </div>
              <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            {/* Body */}
            <div className="p-8">
              <div className="space-y-6">
                {pushSteps.map((s, i) => (
                  <div key={s.id} className={`flex items-center gap-4 transition-all duration-500 ${step >= i ? 'opacity-100 translate-x-0' : 'opacity-20 -translate-x-4'}`}>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      {step > i ? <CheckCircle2 size={16} className="text-green-500" /> : <ArrowUpCircle size={16} className={step === i ? "text-[#D4AF37] animate-bounce" : "text-slate-600"} />}
                    </div>
                    <span className="text-xs font-medium text-slate-300">{s.text}</span>
                  </div>
                ))}
              </div>

              {/* Status Bar */}
              <div className="mt-10 p-4 bg-black rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud size={14} className={step === 4 ? "text-green-500" : "text-slate-600"} />
                  <span className="text-[10px] font-mono text-slate-500">Target: Vercel Production</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${step === 4 ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`}></div>
                  <span className="text-[10px] font-bold text-white uppercase">{step === 4 ? "Synced" : "In Progress"}</span>
                </div>
              </div>

              {step === 4 && (
                <button 
                  onClick={() => setIsVisible(false)}
                  className="w-full mt-8 py-4 bg-[#D4AF37] text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Return to Dashboard
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center flex items-center justify-center gap-2">
              <Terminal size={12} className="text-slate-600" />
              <span className="text-[9px] text-slate-600 font-mono tracking-tighter">ELITE_OS v2.6 // DEPLOYMENT_SUCCESS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
