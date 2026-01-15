import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AITutor } from './components/AITutor';
import { Features } from './components/Features';

export default function App() {
  return (
    <div className="bg-[#020617] min-h-screen text-white">
      <Navbar />
      <Hero />
      <Features />
      <AITutor />
    </div>
  );
}
