import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '../services/geminiService';
import { Crown, Send, RefreshCw, Sparkles, User } from 'lucide-react';

export const AITutor = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'model', text: 'أهلاً بك يا سيدي...' }]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input; setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    try {
      const response = await chatWithTutor(messages, userText);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'خطأ في البروتوكول الملكي.' }]);
    } finally { setIsLoading(false); }
  };

  return (/* High-End JSX UI Code */);
};
