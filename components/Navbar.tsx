import React from 'react';
import { Crown } from 'lucide-react';

export const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 p-6 bg-black/20 backdrop-blur-xl border-b border-white/5">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Crown className="text-[#D4AF37]" />
        <span className="font-bold tracking-widest uppercase">Elite Academy</span>
      </div>
    </div>
  </nav>
);
