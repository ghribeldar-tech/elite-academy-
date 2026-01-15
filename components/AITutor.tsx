import React, { useState } from 'react';
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

  return (/* UI Logic */);
};
