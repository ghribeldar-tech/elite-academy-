import React, { useState, useEffect, useRef } from 'react';

// تعريف واجهات البيانات (TypeScript Interfaces)
interface Scenario {
  id: string;
  title: string;
  description: string;
  firstMessage: string;
  prompt: string;
}

interface Message {
  sender: 'customer' | 'agent' | 'system';
  text: string;
}

interface Scorecard {
  score: number;
  greeting: number;
  empathy: number;
  verification: number;
  solution: number;
  closing: number;
  grammarFeedback: string;
  generalFeedback: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'angry_shipping',
    title: 'Customer - Delayed Shipping (Angry)',
    description: 'A customer named Mark who is frustrated because his package is 3 days late.',
    firstMessage: "Hello? Yes, I'm calling because I have a big problem with my delivery. It's late!",
    prompt: `You are Mark, an American customer. You are angry and impatient. Your package (Order ID: #98321) is 3 days late. You need it for a birthday tomorrow.
    Rules:
    - Speak in short, conversational sentences.
    - If the agent is polite and apologizes sincerely, calm down slowly.
    - If they ignore your frustration or sound robotic, get angrier.
    - Ask them "Where is my package and what are you going to do about it?".`
  },
  {
    id: 'refund_inquiry',
    title: 'Customer - Refund without Receipt (Hesitant)',
    description: 'Sarah wants to return a dress but lost her receipt. She is polite but insistent.',
    firstMessage: "Hi, I bought a dress last week and I need to return it, but I lost my receipt. Can you help me?",
    prompt: `You are Sarah, a polite but insistent customer. You want to refund a dress that cost $80. You lost the receipt.
    Rules:
    - You are soft-spoken but you really need the money back.
    - If the agent explains the policy politely and offers store credit, accept it.
    - If they are rude, ask to speak to a manager.`
  },
  {
    id: 'tech_support',
    title: 'Customer - Internet Offline (Impatient)',
    description: 'David is working from home and his internet went down during an important meeting.',
    firstMessage: "Hi, my internet just cut out in the middle of my work meeting! I need this fixed immediately!",
    prompt: `You are David, a busy professional working from home. Your internet connection just dropped. You are highly stressed and impatient because you are missing an important work meeting.
    Rules:
    - You want quick solutions. Ask for step-by-step guidance.
    - Speak fast and sound stressed.
    - If the agent is calm and guides you through troubleshooting (like restarting the router), cooperate.`
  }
];

const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Recommended)' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Latest)' },
  { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite (Fastest)' }
];

export default function CallCenterSimulator() {
  const [apiKey, setApiKey] = useState<string>('AIzaSyA7zdJexwQWNFsIL_70Z7bGpCElDyytueE');
  const [selectedModel, setSelectedModel] = useState<string>(GEMINI_MODELS[0].id);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Idle'); // Idle, Speaking, Listening, Thinking
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [supportSpeech, setSupportSpeech] = useState<boolean>(true);

  // إعداد ميزات المؤقت والتعليمات والتقييم الجانبي
  const [timer, setTimer] = useState<number>(0);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [isGettingHint, setIsGettingHint] = useState<boolean>(false);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // تحديث المؤقت الزمني أثناء المكالمة
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalling && status !== 'Idle') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isCalling, status]);

  // إعداد الـ Speech Recognition لمتصفح الطالب
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.lang = 'en-US';
        rec.interimResults = false;

        rec.onresult = async (event: any) => {
          const speechToText = event.results[0][0].transcript;
          if (speechToText.trim()) {
            setChatHistory(prev => [...prev, { sender: 'agent', text: speechToText }]);
            await handleAgentResponse(speechToText);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition Error: ", e);
          if (isCalling) setStatus('Listening (User)');
        };

        rec.onend = () => {
          if (isCalling && status === 'Listening (User)') {
            try { rec.start(); } catch (err) {}
          }
        };

        setRecognition(rec);
      } else {
        setSupportSpeech(false);
      }
    }
  }, [isCalling, status]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string, callback?: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        if (callback) callback();
      };
      utterance.onerror = () => {
        if (callback) callback();
      };

      setStatus('Speaking (AI)');
      window.speechSynthesis.speak(utterance);
    } else {
      if (callback) callback();
    }
  };

  const startCall = () => {
    if (!apiKey) {
      alert("Please enter your Gemini API Key in the settings panel first!");
      return;
    }
    setScorecard(null);
    setHintText(null);
    setIsCalling(true);
    setChatHistory([{ sender: 'customer', text: selectedScenario.firstMessage }]);
    
    speak(selectedScenario.firstMessage, () => {
      startListening();
    });
  };

  const endCall = async () => {
    if (chatHistory.length > 1) {
      await generateScorecard();
    }
    resetCallState();
  };

  const resetCallState = () => {
    setIsCalling(false);
    setStatus('Idle');
    setChatHistory([]);
    if (recognition) recognition.stop();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const startListening = () => {
    if (recognition) {
      setStatus('Listening (User)');
      try {
        recognition.start();
      } catch (e) {}
    }
  };

  // معالجة رد العميل
  const handleAgentResponse = async (agentText: string) => {
    setStatus('Thinking');
    setHintText(null);
    if (recognition) recognition.stop();

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
      
      const contents: any[] = [
        {
          role: "user",
          parts: [{ text: `SYSTEM INSTRUCTIONS: ${selectedScenario.prompt}\n\nStart of the roleplay simulation.` }]
        }
      ];

      chatHistory.forEach(msg => {
        contents.push({
          role: msg.sender === 'customer' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      });

      contents.push({
        role: "user",
        parts: [{ text: agentText }]
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      const data = await res.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't catch that. Can you repeat?";

      setChatHistory(prev => [...prev, { sender: 'customer', text: aiReply }]);
      speak(aiReply, () => {
        startListening();
      });

    } catch (error) {
      console.error("API Error: ", error);
      alert("Error communicating with Gemini.");
      resetCallState();
    }
  };

  // ميزة طلب تلميح ذكي أثناء المكالمة
  const getHint = async () => {
    if (!isCalling || status === 'Thinking' || status === 'Speaking (AI)') return;
    setIsGettingHint(true);
    setHintText(null);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
      
      const conversationText = chatHistory.map(msg => `${msg.sender === 'customer' ? 'Customer' : 'Agent'}: ${msg.text}`).join('\n');
      
      const prompt = `Based on the following call center conversation history between a customer and an agent, suggest ONE brief, professional, and empathetic response the agent should say next. Keep the suggestion under 20 words.
      
      Conversation History:
      ${conversationText}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      });

      const data = await res.json();
      const hint = data.candidates?.[0]?.content?.parts?.[0]?.text || "Try apologizing and asking for details.";
      setHintText(hint);

    } catch (e) {
      setHintText("Error getting hint. Try apologizing or active listening.");
    } finally {
      setIsGettingHint(false);
    }
  };

  // معالجة التقييم النهائي بعد إنهاء المكالمة
  const generateScorecard = async () => {
    setIsEvaluating(true);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
      const conversationText = chatHistory.map(msg => `${msg.sender === 'customer' ? 'Customer' : 'Agent'}: ${msg.text}`).join('\n');

      const prompt = `Evaluate the following call center roleplay conversation between a customer and an agent.
      Format your response strictly as a JSON object, with no markdown formatting, no conversational text, and no backticks.
      
      The JSON must contain these exact keys:
      {
        "score": (0-100 total sum of below metrics),
        "greeting": (0-10 based on greeting professionalism),
        "empathy": (0-25 based on showing apology/understanding),
        "verification": (0-15 based on asking for order/account details politely),
        "solution": (0-30 based on providing clear resolution/alternatives),
        "closing": (0-20 based on closing professionally),
        "grammarFeedback": "Detailed string listing grammar/pronunciation corrections for the agent",
        "generalFeedback": "A summary of performance and how to improve"
      }

      Conversation:
      ${conversationText}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      });

      const data = await res.json();
      let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      
      // تنظيف النص في حال قيام الموديل بإرجاع كود ماركداون
      responseText = responseText.replace(/```json|```/g, '').trim();
      const card: Scorecard = JSON.parse(responseText);
      setScorecard(card);

    } catch (e) {
      console.error(e);
      alert("Error generating scorecard. You did great in your call though!");
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-white font-sans p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* اللوحة الجانبية: الإعدادات والتحكم */}
        <div className="lg:col-span-1 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-blue-400 flex items-center">
              ⚙️ Simulator Control
            </h2>
            
            {/* إدخال مفتاح الـ API */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Google Gemini API Key:</label>
              <input
                type="password"
                placeholder="Enter your API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isCalling}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-white"
              />
            </div>

            {/* اختيار الموديل */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Select AI Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isCalling}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-xs text-white"
              >
                {GEMINI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            {/* اختيار السيناريو */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Select Customer Scenario:</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc)}
                    disabled={isCalling}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition ${
                      selectedScenario.id === sc.id
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-semibold'
                        : 'border-slate-700 bg-slate-950/20 text-slate-300 hover:bg-slate-700'
                    } disabled:opacity-50`}
                  >
                    <p className="font-bold">{sc.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{sc.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* تفعيل نافذة التعليمات المساعدة */}
          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="w-full py-2.5 bg-slate-700 hover:bg-slate-650 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5"
          >
            <span>{showCheatSheet ? '❌ Hide Cheat Sheet' : '📖 Open Cheat Sheet'}</span>
          </button>
        </div>

        {/* لوحة المحاكاة الصوتية الرئيسية */}
        <div className="lg:col-span-3 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col h-[650px] justify-between relative overflow-hidden">
          
          {/* رأس الشاشة والمؤقت */}
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h1 className="text-xl font-black text-white">Call Simulator Dashboard</h1>
              <p className="text-xs text-slate-400">Practice live client negotiation with AI.</p>
            </div>
            
            {/* مؤقت المكالمة والمؤشر الفوري */}
            <div className="flex items-center space-x-4">
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-sm text-yellow-400">
                ⏱️ AHT: {formatTime(timer)}
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  status === 'Listening (User)' ? 'bg-green-500 animate-pulse' :
                  status === 'Speaking (AI)' ? 'bg-red-500 animate-pulse' :
                  status === 'Thinking' ? 'bg-yellow-500 animate-bounce' : 'bg-slate-500'
                }`} />
                <span className="text-[10px] font-mono text-slate-300 uppercase">{status}</span>
              </div>
            </div>
          </div>

          {/* شاشة السجل وعرض المحادثة والـ Cheat Sheet بشكل متزامن */}
          <div className="flex-1 flex gap-4 my-3 overflow-hidden relative">
            
            {/* السجل */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950/50 rounded-xl space-y-3.5 border border-slate-900">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <span className="text-4xl">📞</span>
                  <p className="text-xs">Select your configuration and start the call simulation.</p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'customer' ? 'items-start' : 'items-end'}`}
                  >
                    <span className="text-[9px] text-slate-500 mb-0.5 uppercase font-semibold">
                      {msg.sender === 'customer' ? '🚨 Customer (AI)' : '🗣️ Agent (You)'}
                    </span>
                    <div className={`max-w-md px-3.5 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'customer'
                        ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                        : 'bg-blue-600 text-white rounded-tr-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* لوحة العبارات المساعدة المنسدلة والمنسقة (Cheat Sheet Drawer) */}
            {showCheatSheet && (
              <div className="w-72 bg-slate-950 border border-slate-800 p-4 rounded-xl overflow-y-auto text-xs space-y-3 animate-slide-in">
                <h3 className="font-bold text-blue-400 border-b border-slate-800 pb-1.5 flex items-center gap-1">
                  💡 Empathy Cheat Sheet
                </h3>
                
                <div>
                  <h4 className="font-semibold text-slate-300 mb-1">📞 Opening:</h4>
                  <p className="text-slate-400 bg-slate-900 p-1.5 rounded text-[10px]">
                    "Thank you for calling [Elite], this is [Name]. How can I help you today?"
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-red-400 mb-1">❤️ Empathy & Apology:</h4>
                  <p className="text-slate-400 bg-slate-900 p-1.5 rounded text-[10px] mb-1">
                    "I understand your frustration. Let me fix this for you."
                  </p>
                  <p className="text-slate-400 bg-slate-900 p-1.5 rounded text-[10px]">
                    "I apologize for this inconvenience. I will resolve it."
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">🔒 Verification:</h4>
                  <p className="text-slate-400 bg-slate-900 p-1.5 rounded text-[10px]">
                    "May I have your full name and order ID politely, please?"
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-400 mb-1">🛑 Hold Process:</h4>
                  <p className="text-slate-400 bg-slate-900 p-1.5 rounded text-[10px]">
                    "May I place you on a brief hold for one minute to check?"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* لوحة التحكم الصوتية والتلميحات */}
          <div className="space-y-2">
            
            {/* عرض التلميح الذكي في حال تفعيله */}
            {hintText && (
              <div className="bg-blue-950/40 border border-blue-900 p-2.5 rounded-lg text-xs text-blue-300 animate-fade-in flex justify-between items-center">
                <p>💡 <strong>Suggested Reply:</strong> "{hintText}"</p>
                <button onClick={() => setHintText(null)} className="text-blue-500 hover:text-white font-bold ml-2">×</button>
              </div>
            )}

            <div className="flex gap-3">
              {/* زر طلب التلميح */}
              {isCalling && (
                <button
                  onClick={getHint}
                  disabled={isGettingHint || status === 'Thinking' || status === 'Speaking (AI)'}
                  className="px-4 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {isGettingHint ? '🌀 Loading...' : '💡 Get Hint'}
                </button>
              )}

              {/* أزرار الاتصال الأساسية */}
              {!isCalling ? (
                <button
                  onClick={startCall}
                  disabled={!supportSpeech}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-950/50"
                >
                  Start Call Simulation 📞
                </button>
              ) : (
                <button
                  onClick={endCall}
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-red-950/50"
                >
                  End Call & Get Scorecard 🛑
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* لوحة التقييم التفصيلي النهائي (Scorecard Modal Overlay) */}
      {(isEvaluating || scorecard) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl p-6 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            
            {/* شاشة التحميل */}
            {isEvaluating ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <h2 className="text-lg font-bold text-blue-400 animate-pulse">AI Agent is Evaluating Your Call...</h2>
                <p className="text-xs text-slate-400">Analyzing metrics, empathy, structure and grammar.</p>
              </div>
            ) : (
              // عرض التقييم
              scorecard && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h2 className="text-xl font-black text-blue-400">📊 QA Evaluation Scorecard</h2>
                    <span className="bg-blue-950 border border-blue-800 text-blue-300 font-mono text-xs px-2.5 py-1 rounded-lg">AHT Duration: {formatTime(timer)}</span>
                  </div>

                  {/* دائرة النتيجة الإجمالية */}
                  <div className="flex flex-col md:flex-row items-center justify-around gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-900">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white">{scorecard.score}</span>
                        <span className="text-[10px] uppercase text-slate-400 font-bold">out of 100</span>
                      </div>
                      <h3 className="font-bold text-slate-200 mt-2">Overall Score</h3>
                    </div>

                    {/* تفصيل النقاط حسب المعايير المعيارية */}
                    <div className="flex-1 space-y-2 text-xs w-full max-w-sm">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Greeting Professionalism:</span>
                          <span className="font-bold">{scorecard.greeting} / 10</span>
                        </div>
                        <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full" style={{ width: `${(scorecard.greeting / 10) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Empathy & De-escalation:</span>
                          <span className="font-bold">{scorecard.empathy} / 25</span>
                        </div>
                        <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${(scorecard.empathy / 25) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Identity Verification:</span>
                          <span className="font-bold">{scorecard.verification} / 15</span>
                        </div>
                        <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-yellow-500 h-full" style={{ width: `${(scorecard.verification / 15) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Problem Solving & Solution:</span>
                          <span className="font-bold">{scorecard.solution} / 30</span>
                        </div>
                        <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: `${(scorecard.solution / 30) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Professional Closing:</span>
                          <span className="font-bold">{scorecard.closing} / 20</span>
                        </div>
                        <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${(scorecard.closing / 20) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* تفاصيل الملاحظات اللغوية والتقييم العام */}
                  <div className="space-y-3.5 text-xs">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <h4 className="font-bold text-blue-400 mb-1 flex items-center gap-1">📝 Language & Grammar Corrections:</h4>
                      <p className="text-slate-300 leading-relaxed font-mono text-[11px]">{scorecard.grammarFeedback}</p>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <h4 className="font-bold text-green-400 mb-1 flex items-center gap-1">🌟 General Tutor Feedback:</h4>
                      <p className="text-slate-300 leading-relaxed font-mono text-[11px]">{scorecard.generalFeedback}</p>
                    </div>
                  </div>

                  {/* إغلاق التقييم */}
                  <button
                    onClick={() => setScorecard(null)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition"
                  >
                    Close Scorecard & Continue
                  </button>
                </div>
              )
            )}

          </div>
        </div>
      )}
    </div>
  );
    }
