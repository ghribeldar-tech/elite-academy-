import React from 'react';
// استدعاء المكونات بشكل مباشر لضمان نجاح الرفع على Vercel
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CourseLevels } from './components/CourseLevels';
import { AITutor } from './components/AITutor';
import { SocialMediaKit } from './components/SocialMediaKit';
import { AdPromotion } from './components/AdPromotion';
import { ContactBar } from './components/ContactBar';
import { SourceExplorer } from './components/SourceExplorer';

const App = () => {
  return (
    <div className="bg-[#020617] text-white min-h-screen" dir="rtl">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CourseLevels />
        {/* قسم المدرس الذكي */}
        <div id="tutor">
          <AITutor />
        </div>
        <SocialMediaKit />
        <AdPromotion />
      </main>
      <ContactBar />
      <SourceExplorer />
    </div>
  );
};

export default App;
