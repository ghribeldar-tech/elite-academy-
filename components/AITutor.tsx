import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '@/services/geminiService';
import { Crown, Send, Plus, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'elite_chat_vault_v3';

export const AITutor = () => {
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [{
            id: Date.now().toString(),
            name: 'محادثة تعليمية جديدة',
            messages: [{ role: 'model', text: 'مرحباً بك في أكاديمية النخبة. أنا مستر إليت، مساعدك الشخصي لإتقان اللغة الإنجليزية. كيف يمكنني خدمتك اليوم؟' }],
            timestamp: Date.now()
        }];
    });

    const [currentId, setCurrentId] = useState(sessions[0].id);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const currentSession = sessions.find(s => s.id === currentId) || sessions[0];

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [sessions]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input;
        const userMsg = { role: 'user', text: userText };
        
        // إضافة رسالة المستخدم فوراً
        setSessions(prev => prev.map(s => s.id === currentId 
            ? { ...s, messages: [...s.messages, userMsg] } 
            : s
        ));
        setInput('');
        setIsLoading(true);

        try {
            // استدعاء الخدمة وانتظار الرد الحقيقي
            const response = await chatWithTutor(currentSession.messages, userText);
            
            const modelMsg = { role: 'model', text: response || "عذراً، لم أتلقَ رداً حقيقياً." };
            
            setSessions(prev => prev.map(s => s.id === currentId 
                ? { ...s, messages: [...s.messages, modelMsg] } 
                : s
            ));
        } catch (e: any) {
            const errorMsg = { role: 'model', text: `خطأ اتصال: ${e.message}` };
            setSessions(prev => prev.map(s => s.id === currentId 
                ? { ...s, messages: [...s.messages, errorMsg] } 
                : s
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col h-[650px] shadow-2xl backdrop-blur-3xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#D4AF37] to-[#F9E498] rounded-2xl flex items-center justify-center text-black shadow-lg">
                        <Crown size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-white leading-none mb-1">Mr. Elite AI</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active System</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        const newId = Date.now().toString();
                        setSessions([{ id: newId, name: 'جلسة جديدة', messages: [{ role: 'model', text: 'بدأنا جلسة جديدة، تفضل بسؤالك.' }], timestamp: Date.now() }, ...sessions]);
                        setCurrentId(newId);
                    }}
                    className="p-3 text-[#D4AF37] bg-white/5 rounded-xl border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-8 bg-black/20 custom-scrollbar scroll-smooth">
                {currentSession.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[80%] p-5 rounded-3xl shadow-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-gradient-to-br from-[#D4AF37] to-[#B48A1B] text-black font-bold rounded-tr-none' : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center gap-3">
                            <Sparkles size={16} className="text-[#D4AF37] animate-spin" />
                            <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-grow bg-white/5 p-5 rounded-2xl outline-none text-white border border-white/10 focus:border-[#D4AF37]/50 transition-all font-medium"
                    placeholder="اسأل مستر إليت أي شيء..." 
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-gradient-to-tr from-[#D4AF37] to-[#F9E498] p-5 rounded-2xl text-black shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    <Send size={24} />
                </button>
            </div>
        </div>
    );
};
