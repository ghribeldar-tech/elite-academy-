import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, Mic, MicOff, Plus, X, Image as ImageIcon, Volume2, StopCircle } from 'lucide-react';
import { chatWithTutor } from '../services/geminiService';

interface Message {
  id: string; // أضفنا معرف لكل رسالة للتحكم في الصوت
  role: 'user' | 'model';
  text: string;
  hasAttachment?: boolean;
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: "Hello! I am Mr. Elite. Upload a text or image, listen to my pronunciation, then try to repeat it!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // متغيرات الصوت (Text-to-Speech)
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  
  // متغيرات الملفات
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // إيقاف الصوت عند الخروج أو تغيير الصفحة
    return () => window.speechSynthesis.cancel();
  }, [messages, previewUrl]);

  // 🔊 وظيفة نطق النص (British Accent)
  const speakText = (text: string, msgId: string) => {
    // لو فيه صوت شغال، نوقفه
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel(); // إيقاف أي صوت سابق
    const utterance = new SpeechSynthesisUtterance(text);
    
    // محاولة ضبط اللكنة البريطانية
    utterance.lang = 'en-GB'; 
    const voices = window.speechSynthesis.getVoices();
    // البحث عن صوت بريطاني (Google UK English Female/Male أو غيره)
    const britishVoice = voices.find(voice => voice.lang.includes('GB') || voice.name.includes('UK'));
    if (britishVoice) utterance.voice = britishVoice;

    // سرعة ونبرة الصوت
    utterance.rate = 0.9; // أبطأ قليلاً ليكون تعليمياً
    utterance.pitch = 1;

    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("الملف كبير جداً. الحد الأقصى 5 ميجا.");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearAttachment = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const msgId = Date.now().toString();
    const userMessageText = selectedFile ? `${input} (📷 Image Attached)` : input;
    
    const userMessage: Message = { 
      id: msgId,
      role: 'user', 
      text: userMessageText,
      hasAttachment: !!selectedFile 
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const fileToSend = selectedFile;
    const inputToSend = input;
    
    setInput('');
    clearAttachment();
    setIsLoading(true);

    try {
      const responseText = await chatWithTutor(messages, inputToSend, fileToSend || undefined);
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseText 
      };
      setMessages(prev => [...prev, botMessage]);
      
      // ✨ ميزة إضافية: قراءة الرد تلقائياً (اختياري، يمكنك إلغاؤه لو مزعج)
      // speakText(responseText, botMessage.id);
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("المتصفح لا يدعم تحويل الصوت لنص.");
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-[#1a237e] p-4 flex items-center gap-3 shadow-md">
        <div className="p-2 bg-white/10 rounded-full">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Mr. Elite AI Tutor</h3>
          <p className="text-blue-200 text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Listen, Speak & Learn
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-[#1a237e]' : 'bg-emerald-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>

              {/* Message Bubble */}
              <div className={`group relative p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#1a237e] text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}>
                {msg.hasAttachment && (
                  <div className="mb-2 pb-2 border-b border-white/20 flex items-center gap-2 text-xs text-blue-200">
                    <ImageIcon className="w-4 h-4" />
                    <span>Attached File</span>
                  </div>
                )}
                {msg.text}

                {/* 🔊 زر تشغيل الصوت يظهر فقط في رسائل الموديل */}
                {msg.role === 'model' && (
                  <button
                    onClick={() => speakText(msg.text, msg.id)}
                    className={`absolute -bottom-3 -right-2 p-1.5 rounded-full shadow-md transition-all ${
                      speakingMsgId === msg.id 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 opacity-0 group-hover:opacity-100'
                    }`}
                    title="Read Aloud"
                  >
                    {speakingMsgId === msg.id ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-xs text-gray-500 font-medium">Analyzing & Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preview Area */}
      {previewUrl && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
          <div className="relative">
            <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-300" />
            <button onClick={clearAttachment} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Ready to upload</span>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
          
          <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200">
            <Plus className="w-5 h-5" />
          </button>

          <button onClick={startListening} className={`p-3 rounded-xl ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedFile ? "What should I do with this file?" : "Type or Speak..."}
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20"
            disabled={isLoading}
          />
          
          <button onClick={handleSend} disabled={isLoading || (!input.trim() && !selectedFile)} className="bg-[#1a237e] text-white p-3 rounded-xl hover:bg-[#283593] disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
    }
