import React from 'react';
import { Navbar, Hero, Features, AITutor, SourceExplorer } from './components';

const App = () => (
  <div className="bg-[#020617] text-white min-h-screen" dir="rtl">
    <Navbar />
    <Hero />
    <div className="max-w-7xl mx-auto px-6 py-20" id="tutor">
      <AITutor />
    </div>
    <SourceExplorer />
  </div>
);
export default App;
