import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AITutor } from './components/AITutor';
import { Features } from './components/Features';
import { CourseLevels } from './components/CourseLevels';
import { ContactBar } from './components/ContactBar';
import { AdPromotion } from './components/AdPromotion';
import { SocialMediaKit } from './components/SocialMediaKit';
import { SourceExplorer } from './components/SourceExplorer';

const App: React.FC = () => {
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 1000);
      }, 1500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-elite-gold/30 overflow-x-hidden" dir="rtl">
      <Navbar />
      <main className="relative">
        <Hero />
        <div className="max-w-7xl mx-auto px-6 space-y-48 pb-40">
          <section id="features"><Features /></section>
          <section id="levels"><CourseLevels /></section>
          <section id="tutor"><AITutor /></section>
          <AdPromotion />
          <SocialMediaKit />
        </div>
      </main>
      <ContactBar />
      <SourceExplorer />
    </div>
  );
};
export default App;
