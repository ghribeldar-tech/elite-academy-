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

const App = () => {
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('opacity-0');
        setTimeout(() => loader.style.display = 'none', 1000);
      }, 2000);
    }
  }, []);

  return (
    <div className="bg-[#020617] text-white min-h-screen" dir="rtl">
      <Navbar />
      <Hero />
      <Features />
      <CourseLevels />
      <div className="max-w-7xl mx-auto px-6 py-20">
        <AITutor />
      </div>
      <SocialMediaKit />
      <AdPromotion />
      <ContactBar />
      <SourceExplorer />
    </div>
  );
};
export default App;
