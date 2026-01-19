import React from 'react';
import { Crown, ChevronDown } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 overflow-hidden">
      {/* خلفية جمالية خفيفة */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* أيقونة التاج فوق العنوان */}
        <Crown size={48} className="text-[#D4AF37] mb-6 animate-pulse" />
        
        <h1 className="text-7xl md:text-[11rem] font-serif font-black leading-none tracking-tighter text-white drop-shadow-2xl">
          ELITE <span className="text-[#D4AF37]">ACADEMY</span>
        </h1>
        
        <p className="mt-8 text-slate-400 text-xl md:text-2xl font-light tracking-widest uppercase italic">
          The Pinnacle of English Education
        </p>

        {/* سهم للانتقال للأسفل */}
        <div className="absolute bottom-10 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
          <ChevronDown size={32} className="text-[#D4AF37]" />
        </div>
      </div>
    </section>
  );
};
