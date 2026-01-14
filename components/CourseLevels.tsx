import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

const LEVELS = [
  { id: 'A1-A2', title: 'أساسيات الفخامة', desc: 'بناء الثقة التامة في القواعد الأساسية.' },
  { id: 'B1-B2', title: 'الطلاقة الدبلوماسية', desc: 'التمكن من الحديث بلكنة واثقة وجذابة.' },
  { id: 'C1-C2', title: 'سيادة اللغة', desc: 'الوصول لمرحلة المتحدث الأصلي بلكنة RP.' }
];

export const CourseLevels: React.FC = () => {
  return (
    <section className="py-40">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {LEVELS.map((lvl, i) => (
          <div key={i} className="relative p-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] hover:border-[#D4AF37]/40 transition-all">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F9E498] rounded-3xl flex items-center justify-center text-black font-black text-2xl">{lvl.id}</div>
            <h3 className="text-3xl font-black text-white mb-6 font-serif">{lvl.title}</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">{lvl.desc}</p>
            <div className="flex items-center gap-3 text-[#D4AF37] text-xs font-black"><CheckCircle2 size={18} /> Excellence</div>
          </div>
        ))}
      </div>
    </section>
  );
};