import React from 'react';
import { FileCode, Folder, CheckCircle2, Layout, Bot, Trophy, Share2 } from 'lucide-react';

const FILES = [
  { name: 'index.html', size: '2.4 KB', type: 'Root File', icon: <Layout size={18} className="text-orange-400" /> },
  { name: 'App.tsx', size: '4.8 KB', type: 'Root File', icon: <FileCode size={18} className="text-blue-400" /> },
  { name: 'components/Hero.tsx', size: '3.1 KB', type: 'Component', icon: <Trophy size={18} className="text-yellow-400" /> },
  { name: 'components/AITutor.tsx', size: '5.2 KB', type: 'Component', icon: <Bot size={18} className="text-purple-400" /> },
  { name: 'services/geminiService.ts', size: '2.1 KB', type: 'Service', icon: <Share2 size={18} className="text-cyan-400" /> }
];

export const ProjectBlueprint = () => {
  return (
    <section className="py-24 bg-[#010409] border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-luxury gold-gradient-text mb-6">هيكل المنصة التعليمية</h2>
          <p className="text-slate-500 mb-12 text-sm">التزاماً بأعلى المعايير البرمجية لضمان سرعة الأداء واستقرار الخدمة عبر GitHub و Vercel.</p>
          
          <div className="bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 text-right shadow-2xl backdrop-blur-xl">
            {/* Header اللوحة */}
            <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between px-6 flex-row-reverse">
              <div className="flex items-center gap-2 flex-row-reverse">
                <Folder size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-400">elite-academy / Root Folder</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
            </div>

            {/* قائمة الملفات */}
            <div className="divide-y divide-white/5">
              {FILES.map((file, idx) => (
                <div key={idx} className="group p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors flex-row-reverse">
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                      {file.icon}
                    </div>
                    <div className="text-right">
                      <h4 className="text-sm font-bold text-white">{file.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase">{file.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-600">{file.size}</span>
                    <CheckCircle2 size={16} className="text-green-500 opacity-60" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 text-sm">
            نظام ذكاء اصطناعي موحد يربط بين المكونات لتقديم تجربة تعليمية فريدة ومستقرة.
          </div>
        </div>
      </div>
    </section>
  );
};
