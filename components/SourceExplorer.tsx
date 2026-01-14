import React, { useState } from 'react';
import { X, Code, Copy, Check, Terminal, ShieldCheck } from 'lucide-react';

export const SourceExplorer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const projectFiles = [
    // ... (This file content)
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(projectFiles[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-10 left-10 w-24 h-24 bg-gold text-black rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl z-[500] border-8 border-black">
        <Code size={32} />
        <span className="text-[8px] font-black uppercase">Vault v2.8</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-3xl flex flex-col animate-in fade-in" dir="rtl">
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <ShieldCheck size={32} className="text-[#D4AF37]" />
              <h2 className="text-3xl font-black gold-gradient-text uppercase">Source Repository</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/40 border border-white/10 transition-all"><X size={32} /></button>
          </div>

          <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
            <div className="w-full lg:w-[380px] border-l border-white/5 p-8 overflow-y-auto space-y-4">
              {projectFiles.map((file, i) => (
                <button key={i} onClick={() => { setActiveFile(i); setCopied(false); }} className={`w-full p-6 rounded-3xl border text-right transition-all flex items-center justify-between ${activeFile === i ? 'bg-[#D4AF37] text-black shadow-xl' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
                  <div className="flex items-center gap-4">
                    {file.icon}
                    <span className="text-base font-black truncate">{file.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                <span className="text-xs font-mono text-slate-400">{projectFiles[activeFile].name}</span>
                <button onClick={handleCopy} className={`px-10 py-4 rounded-2xl font-black text-xs transition-all ${copied ? 'bg-green-600 text-white' : 'bg-[#D4AF37] text-black hover:bg-[#F9E498]'}`}>
                  {copied ? 'Copied' : 'Copy Source'}
                </button>
              </div>
              <div className="flex-grow p-10 overflow-auto font-mono text-sm bg-black/10">
                <pre className="text-slate-300 text-right leading-relaxed whitespace-pre-wrap"><code>{projectFiles[activeFile].code}</code></pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};