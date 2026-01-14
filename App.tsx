import React, { useEffect } from 'react';
import { Hero } from './components/Hero.tsx';
import { AITutor } from './components/AITutor.tsx';
import { Features } from './components/Features.tsx';
import { CourseLevels } from './components/CourseLevels.tsx';
import { ContactBar } from './components/ContactBar.tsx';
import { AdPromotion } from './components/AdPromotion.tsx';
import { SocialMediaKit } from './components/SocialMediaKit.tsx';
import { SourceExplorer } from './components/SourceExplorer.tsx';

const App: React.FC = () => {
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
      }, 1500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#D4AF37]/30 selection:text-white" dir="rtl">
      <Hero />
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.03),transparent_50%)] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          <Features />
          <CourseLevels />
          <div id="tutor" className="py-24 text-center relative">
            <div className="mb-20">
              <span className="text-[#D4AF37] text-sm font-black tracking-[0.8em] uppercase block mb-4">Linguistic Mastery</span>
              <h2 className="text-6xl md:text-9xl font-cinzel gold-gradient-text font-black mb-4 tracking-tighter">THE AI TUTOR</h2>
              <p className="text-slate-500 text-xl font-light italic">"تعلم الإنجليزية بأسلوب الملوك والنبلاء."</p>
            </div>
            <AITutor />
          </div>
          <AdPromotion />
          <SocialMediaKit />
        </div>
      </div>
      <ContactBar />
      <div className="py-12 text-center border-t border-white/5 opacity-10">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-white">Elite Academy • Royal Standards</p>
      </div>
      <SourceExplorer />
    </div>
  );
};

export default App;