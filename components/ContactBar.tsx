import React from 'react';

export const ContactBar: React.FC = () => {
  return (
    <footer className="bg-[#010409] border-t border-white/5 pt-24 pb-12 px-6 text-center">
      <div className="container mx-auto">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-12">01018392200</h2>
        <a href="https://wa.me/201018392200" className="inline-flex items-center gap-6 glass-card p-8 rounded-[3rem] hover:bg-white/5 transition-all">
          <div className="bg-green-500 p-6 rounded-[2rem]">WhatsApp VIP</div>
          <span className="text-white font-bold text-2xl">احجز الآن</span>
        </a>
      </div>
    </footer>
  );
};