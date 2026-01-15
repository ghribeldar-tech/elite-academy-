import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { AITutor } from './components/AITutor';
import { ContactBar } from './components/ContactBar';

export default function App() {
  return (
    <div className="bg-[#020617] min-h-screen text-white" dir="rtl">
      <Navbar />
      <Hero />
      <Features />
      <AITutor />
      <ContactBar />
    </div>
  );
}
