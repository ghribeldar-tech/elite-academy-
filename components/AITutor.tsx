import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '../services/geminiService';
import { Crown, Send, User } from 'lucide-react';

export const AITutor = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    const response = await chatWithTutor(messages, input);
    setMessages([...messages, { role: 'user', text: input }, { role: 'model', text: response }]);
    setInput('');
  };

  return (
    <div className="glass-card p-10 rounded-[3rem] h-[600px] flex flex-col">
       <h3 className="text-2xl font-cinzel text-white mb-6">Imperial Chat</h3>
       <div className="flex-grow overflow-y-auto mb-6">Messages here...</div>
       <div className="flex gap-4">
         <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-grow p-4 bg-white/5 rounded-xl" />
         <button onClick={handleSend} className="bg-elite-gold p-4 rounded-xl text-black"><Send /></button>
       </div>
    </div>
  );
};
