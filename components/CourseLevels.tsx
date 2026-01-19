import React from 'react';
import { GraduationCap, Award, CheckCircle2 } from 'lucide-react';

const LEVELS = [
  { 
    id: 'A1-A2', 
    title: 'أساسيات الفخامة', 
    status: 'Beginner', 
    desc: 'بناء القواعد اللغوية والتمكن من الحوارات اليومية البسيطة مع التركيز المبكر على اللكنة البريطانية الصافية.' 
  },
  { 
    id: 'B1-B2', 
    title: 'الطلاقة الدبلوماسية', 
    status: 'Intermediate', 
    desc: 'التمكن من الحديث في مواضيع معقدة وإدارة النقاشات المهنية بلكنة واثقة وجذابة في مختلف المواقف.' 
  },
  { 
    id: 'C1-C2', 
    title: 'سيادة اللغة', 
    status: 'Mastery', 
    desc: 'الوصول لمرحلة المتحدث الأصلي (Native Speaker) وإتقان لكنة RP الملكية التي تمنحك هيبة الحضور.' 
  }
];

export const CourseLevels = () => {
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header القسم */}
        <div className="text-center mb-24">
          <div className="flex justify-center mb-8 text-[#D4AF37]">
            <GraduationCap size={60} className="animate-pulse" />
          </div>
          <h2 className="text-5xl md:text-8xl font-serif font-black mb-8 tracking-tighter uppercase">
            <span className="text-white">Academic</span> <span className="text-[#D4AF37]">Journey</span>
          </h2>
          <p className="text-slate-500 text-xl font-medium tracking-wide">
            مسار أكاديمي مصمم بعناية وفق الإطار الأوروبي المشترك للغات CEFR.
          </p>
        </div>

        {/* شبكة المستويات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {LEVELS.map((lvl, i) => (
            <div key={i} className="group relative p-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] transition-all duration-500 hover:border-[#D4AF37]/40 hover:bg-white/[0.04] shadow-2xl">
              
              {/* شارة المستوى */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F9E498] rounded-3xl flex items-center justify-center text-black font-black text-2xl shadow-2xl group-hover:scale-110 transition-transform">
                {lvl.id}
              </div>

              <div className="mb-10 text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">
                <Award size={40} />
              </div>

              <h3 className="text-3xl font-black text-white mb-6 font-serif italic">
                {lvl.title}
              </h3>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light">
                {lvl.desc}
              </p>

              <div className="flex items-center gap-3 text-[#D4AF37] text-xs font-black uppercase tracking-widest">
                <CheckCircle2 size={18} />
                <span>{lvl.status} Excellence</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
