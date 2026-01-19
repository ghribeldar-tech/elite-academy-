import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '@/services/geminiService';
import { Crown, Send, Plus, Sparkles } from 'lucide-react';
import { Message } from '@/types';

const STORAGE_KEY = 'elite_chat_vault_2026';

export const AITutor = () => {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [{
      id: Date.now().toString(),
      messages: [{ role: 'model', text: 'مرحباً بك في أكاديمية النخبة. أنا مستر إليت، مساعدك الشخصي لإتقان اللغة الإنجليزية. كيف يمكنني خدمتك اليوم؟' }]
    }];
  });

  const [currentId, setCurrentId] = useState(sessions[0].id);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s: any) => s.id === currentId) || sessions[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    const history = currentSession.messages;

    // إضافة رسالة المستخدم فوراً للواجهة
    setSessions((prev: any) => prev.map((s: any) => 
      s.id === currentId ? { ...s, messages: [...s.messages, userMsg] } : s
    ));
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithTutor(history, input);
      const modelMsg: Message = { role: 'model', text: response };

      setSessions((prev: any) => prev.map((s: any) => 
        s.id === currentId ? { ...s, messages: [...s.messages, modelMsg] } : s
      ));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden flex flex-col h-[700px] shadow-2xl backdrop-blur-3xl border-elite-gold/20">
        
        {/* Header الشخصية */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#D4AF37] to-[#F9E498] rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Crown size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white leading-none mb-1 uppercase tracking-tighter">Mr. Elite AI</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master AI System Active</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              const newId = Date.now().toString();
              setSessions([{ id: newId, messages: [{ role: 'model', text: 'جلسة جديدة بدأت. تفضل بسؤالك سيدي.' }] }, ...sessions]);
              setCurrentId(newId);
            }}
            className="p-4 text-[#D4AF37] bg-white/5 rounded-2xl border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all duration-500"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* منطقة الرسائل */}
        <div ref={scrollRef} className="flex-grow p-10 overflow-y-auto space-y-8 bg-black/40 custom-scrollbar scroll-smooth">
          {currentSession.messages.map((m: Message, i: number) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-6 rounded-[2rem] shadow-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                ? 'bg-gradient-to-br from-[#D4AF37] to-[#B48A1B] text-black font-bold rounded-tr-none' 
                : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10 flex items-center gap-4">
                <Sparkles size={18} className="text-[#D4AF37] animate-spin" />
                <span className="text-xs text-[#D4AF37] font-black uppercase tracking-widest">Mr. Elite is Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-8 bg-black/60 border-t border-white/5 flex gap-5">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow bg-white/5 p-6 rounded-2xl outline-none text-white border border-white/10 focus:border-[#D4AF37]/50 transition-all font-medium text-base"
            placeholder="تحدث مع مستر إليت الآن..." 
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-gradient-to-tr from-[#D4AF37] to-[#F9E498] p-6 rounded-2xl text-black shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};
