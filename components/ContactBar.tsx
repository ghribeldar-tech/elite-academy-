import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const ContactBar = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* شعار الأكاديمية الصغير */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-widest text-xs uppercase">Elite Academy</span>
            <span className="text-slate-500 text-[10px] uppercase tracking-tighter">High-End Education</span>
          </div>
        </div>

        {/* معلومات التواصل */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* رقم الهاتف */}
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <Phone size={16} className="text-[#D4AF37]" />
            </div>
            <span className="font-mono text-lg tracking-wider">01018392200</span>
          </div>

          {/* زر واتساب السريع */}
          <a
            href="https://wa.me/201018392200"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-3 bg-green-600/10 border border-green-600/20 text-green-500 rounded-2xl hover:bg-green-600/20 transition-all duration-300"
          >
            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">تواصل VIP عبر واتساب</span>
          </a>
          
        </div>
      </div>
      
      {/* حقوق الملكية */}
      <div className="mt-12 text-center">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em]">
          © 2026 Elite English Academy. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
