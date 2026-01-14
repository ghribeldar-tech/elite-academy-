import React from 'react';
import { Star, ChevronDown, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#020617]"></div>
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white/[0.02] border border-white/10 mb-10 backdrop-blur-xl">
          <Award size={16} className="text-[#D4AF37]" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] font-cinzel">Est. 2026 • Royal Standard</span>
        </div>
        <h1 className="text-[12vw] md:text-[13rem] font-cinzel font-black mb-6 leading-[0.75] tracking-tighter">
          <span className="text-white">ELITE</span>
          <span className="gold-gradient-text">MASTERY</span>
        </h1>
        <p className="text-slate-400 text-2xl md:text-5xl font-light italic font-cinzel opacity-90 leading-tight mb-16">
          "Your journey to global distinction begins here."
        </p>
        <button onClick={() => document.getElementById('tutor')?.scrollIntoView({behavior:'smooth'})} className="px-16 py-8 bg-gradient-to-r from-[#D4AF37] to-[#F9E498] text-black rounded-full font-black text-2xl shadow-2xl transition-all hover:scale-110 active:scale-95">
          ابدأ رحلتك الملكية
        </button>
      </div>
      <div className="absolute bottom-10 flex flex-col items-center gap-4 opacity-20 animate-bounce">
        <ChevronDown size={24} className="text-[#D4AF37]" />
      </div>
    </section>
  );
};