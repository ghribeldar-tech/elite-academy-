import React from 'react';
import { ShieldCheck, Users, Zap, Gem } from 'lucide-react';

const FEATURE_LIST = [
  { title: "مجموعات VIP حصرياً", description: "6 طلاب فقط لضمان الجودة الفائقة.", icon: <Users size={36} /> },
  { title: "مساعدك اللغوي 24/7", description: "ذكاء اصطناعي مدرب على منهج النخبة.", icon: <Zap size={36} /> },
  { title: "اللكنة البريطانية RP", description: "إتقان نطق النبلاء والطبقات الراقية.", icon: <Gem size={36} /> },
  { title: "منهج القادة", description: "محتوى يحاكي مواقف رجال الأعمال.", icon: <ShieldCheck size={36} /> }
];

export const Features: React.FC = () => {
  return (
    <section className="py-40 grid grid-cols-1 md:grid-cols-4 gap-10">
      {FEATURE_LIST.map((f, i) => (
        <div key={i} className="p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] group hover:bg-white/[0.04] transition-all">
          <div className="w-24 h-24 bg-black/40 rounded-[2.5rem] flex items-center justify-center text-[#D4AF37] mb-10 border border-white/5 group-hover:scale-110">
            {f.icon}
          </div>
          <h3 className="text-3xl font-black text-white mb-6 font-serif tracking-tight">{f.title}</h3>
          <p className="text-slate-400 text-lg leading-relaxed font-light">{f.description}</p>
        </div>
      ))}
    </section>
  );
};