import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '../services/geminiService.ts';
import { Crown, Send, User, Bot, ShieldCheck } from 'lucide-react';
import { Message, Session } from '../types.ts';

export const AITutor: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([{
    id: Date.now().toString(), name: 'Elite Session', messages: [{ role: 'model', text: 'Splendid to see you. How shall we refine your English today?' }], timestamp: Date.now()
  }]);
  const [currentId, setCurrentId] = useState(sessions[0].id);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentSession = sessions.find(s => s.id === currentId) || sessions[0];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', text: input };
    const updatedMessages = [...currentSession.messages, userMsg];
    setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: updatedMessages } : s));
    setInput('');
    setIsLoading(true);
    const response = await chatWithTutor(currentSession.messages, input);
    const modelMsg: Message = { role: 'model', text: response };
    setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...updatedMessages, modelMsg] } : s));
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto bg-[#030712] rounded-[4rem] border border-white/5 overflow-hidden flex flex-col h-[800px] shadow-2xl relative">
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F9E498] rounded-2xl flex items-center justify-center text-black">
            <Crown size={32} />
          </div>
          <div className="text-right">
            <h3 className="font-cinzel font-black text-2xl gold-gradient-text">Mr. Elite AI</h3>
          </div>
        </div>
      </div>
      <div className="flex-grow p-8 overflow-y-auto space-y-8 bg-black/20">
        {currentSession.messages.map((m, i) => (
          <div key={i} className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${m.role === 'user' ? 'bg-[#D4AF37]' : 'bg-white/5'}`}>
              {m.role === 'user' ? <User className="text-black" /> : <Bot className="text-[#D4AF37]" />}
            </div>
            <div className={`max-w-[80%] p-8 rounded-[2.5rem] ${m.role === 'user' ? 'bg-white/5 text-white' : 'bg-white/[0.03] text-slate-200'}`}>
              <p className="text-lg leading-relaxed text-right">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-grow bg-white/5 px-8 py-6 rounded-3xl outline-none text-white border border-white/10" placeholder="تحدث مع مستر إليت..." />
        <button onClick={handleSend} disabled={isLoading} className="bg-[#D4AF37] px-10 rounded-3xl text-black font-black hover:bg-[#F9E498] transition-all"><Send size={24} /></button>
      </div>
    </div>
  );
};