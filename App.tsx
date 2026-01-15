import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AITutor } from './components/AITutor';
import { Features } from './components/Features';
import { CourseLevels } from './components/CourseLevels';
import { ContactBar } from './components/ContactBar';
import { AdPromotion } from './components/AdPromotion';
import { SourceExplorer } from './components/SourceExplorer';

const App = () => {
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    setTimeout(() => { if(loader) loader.style.display = 'none'; }, 2000);
  }, []);

  return (
    <div className="bg-[#020617] text-white" dir="rtl">
      <Navbar />
      <Hero />
      <Features />
      <CourseLevels />
      <AITutor />
      <AdPromotion />
      <ContactBar />
      <SourceExplorer />
    </div>
  );
};
export default App;
