import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '@/services/geminiService';
import { Crown, Send } from 'lucide-react';
import { Message } from '../types';

export const AITutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'أهلاً بك يا سيدي في الأكاديمية.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput('');
    const userMsg: Message = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const response = await chatWithTutor(messages, userText);
      setMessages(prev => [...prev, { role: 'model', text: response || '' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'عذراً سيدي، النظام قيد الصيانة.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-10 rounded-[3rem] h-[800px] flex flex-col shadow-2xl relative">
       <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-black/40 backdrop-blur-3xl">
         <Crown size={36} className="text-elite-gold" />
         <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">Mr. Elite AI</h3>
       </div>
       <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-6 custom-scrollbar bg-black/20">
          {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-6 rounded-3xl ${m.role === 'user' ? 'bg-elite-gold/10 border border-elite-gold/20 text-white' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                   {m.text}
                </div>
             </div>
          ))}
       </div>
       <div className="p-10 flex gap-4 bg-black/40 backdrop-blur-3xl border-t border-white/5">
         <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-grow p-6 bg-white/5 rounded-2xl text-white outline-none border border-white/10 text-right" placeholder="Ask Mr. Elite..." />
         <button onClick={handleSend} className="bg-elite-gold px-10 rounded-2xl text-black font-black flex items-center gap-2 hover:scale-105 transition-all"><Send size={24} /> Send</button>
       </div>
    </div>
  );
};
