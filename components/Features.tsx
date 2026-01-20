import React from 'react';
import { Users, Zap, Gem, ShieldCheck } from 'lucide-react';

const FEATURE_LIST = [
  {
    title: "مجموعات VIP حصرياً",
    description: "نحن نؤمن بالجودة فوق الكم؛ بحد أقصى 6 طلاب فقط في كل مجموعة لضمان اهتمام كامل بكل تفاصيل نطقك وأدائك اللغوي.",
    icon: <Users size={36} />,
  },
  {
    title: "مساعدك اللغوي 24/7",
    description: "مستر إليت ليس مجرد برنامج، بل هو ذكاء اصطناعي مخصص مدرب على منهج النخبة ليكون معك في كل لحظة تحتاج فيها للممارسة.",
    icon: <Zap size={36} />,
  },
  {
    title: "اللكنة البريطانية RP",
    description: "تخصصنا هو إتقان لكنة النبلاء (Received Pronunciation) التي تمنحك الثقة والتميز في أرقى المحافل الدولية والمهنية.",
    icon: <Gem size={36} />,
  },
  {
    title: "منهج القادة والرواد",
    description: "صممنا محتوى تعليمي يحاكي المواقف الحقيقية لرجال الأعمال والدبلوماسيين، لتمكينك من القيادة باللغة الإنجليزية.",
    icon: <ShieldCheck size={36} />,
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURE_LIST.map((feature, idx) => (
            <div key={idx} className="group relative p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-white/20">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-black/40 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 font-serif italic tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed font-light text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
