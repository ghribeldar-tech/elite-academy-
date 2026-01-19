import React, { useState, useEffect } from 'react';
import { Menu, X, Crown } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // تأثير لتغيير شكل الشريط عند التمرير للأسفل
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '#' },
    { name: 'المزايا', href: '#features' },
    { name: 'المستويات', href: '#levels' },
    { name: 'المدرس الذكي', href: '#tutor' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${
      isScrolled ? 'py-4 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* الشعار - Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <Crown className="text-[#D4AF37] group-hover:rotate-12 transition-transform" size={28} />
          <span className="text-xl font-serif font-black tracking-tighter text-white">
            ELITE <span className="text-[#D4AF37]">ACADEMY</span>
          </span>
        </div>

        {/* روابط الكمبيوتر - Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-slate-400 hover:text-[#D4AF37] transition-colors tracking-wide"
            >
              {link.name}
            </a>
          ))}
          <button className="px-6 py-2.5 bg-[#D4AF37] text-black rounded-xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            دخول الأعضاء
          </button>
        </div>

        {/* زر الموبايل - Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* قائمة الموبايل - Mobile Menu */}
      <div className={`fixed inset-0 top-[72px] bg-[#020617] z-[450] md:hidden transition-all duration-500 ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-10'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-black text-white hover:text-[#D4AF37] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button className="w-full py-5 bg-[#D4AF37] text-black rounded-2xl font-black text-lg shadow-xl">
            دخول الأعضاء
          </button>
        </div>
      </div>
    </nav>
  );
};
