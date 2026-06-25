import React, { useState, useEffect, useRef } from 'react';

// تعريف أنواع البيانات لتجنب أخطاء TypeScript
interface Scenario {
  id: string;
  title: string;
  description: string;
  firstMessage: string;
  prompt: string;
}

interface Message {
  sender: 'customer' | 'agent';
  text: string;
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
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>(GEMINI_MODELS[0].id);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Idle'); // Idle, Speaking (AI), Listening (User), Thinking
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [supportSpeech, setSupportSpeech] = useState<boolean>(true);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

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
    setIsCalling(true);
    setChatHistory([{ sender: 'customer', text: selectedScenario.firstMessage }]);
    
    speak(selectedScenario.firstMessage, () => {
      startListening();
    });
  };

  const endCall = () => {
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
      } catch (e) {
        // Prevent crashes if recognition is already running
      }
    }
  };

  const handleAgentResponse = async (agentText: string) => {
    setStatus('Thinking');
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
      alert("Error communicating with Gemini. Please check your API key.");
      endCall();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Settings Panel */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-400">⚡ Simulator Settings</h2>
            
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Google Gemini API Key:</label>
              <input
                type="password"
                placeholder="Enter your API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isCalling}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50 text-white"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Select AI Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isCalling}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50 text-white text-sm"
              >
                {GEMINI_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-slate-300">Select Customer Scenario:</label>
              <div className="space-y-2">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc)}
                    disabled={isCalling}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition ${
                      selectedScenario.id === sc.id
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-semibold'
                        : 'border-slate-700 bg-slate-950/20 text-slate-300 hover:bg-slate-700'
                    } disabled:opacity-50`}
                  >
                    <p className="font-bold">{sc.title}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sc.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!supportSpeech && (
            <div className="bg-red-950/50 border border-red-800 text-red-200 p-3 rounded-lg text-xs">
              ⚠️ Your browser does not support Speech Recognition. Please use Google Chrome or Safari.
            </div>
          )}
        </div>

        {/* Main Simulator Panel */}
        <div className="md:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col h-[650px] justify-between">
          
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <h1 className="text-2xl font-black text-white">Call Center AI Agent</h1>
              <p className="text-sm text-slate-400">Practice your speaking, active listening, and empathy skills.</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                status === 'Listening (User)' ? 'bg-green-500 animate-pulse' :
                status === 'Speaking (AI)' ? 'bg-red-500 animate-pulse' :
                status === 'Thinking' ? 'bg-yellow-500 animate-bounce' : 'bg-slate-500'
              }`} />
              <span className="text-xs font-mono text-slate-300 uppercase">{status}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto my-4 p-4 bg-slate-950/50 rounded-xl space-y-4 border border-slate-900">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Click "Start Call Simulation" to begin training.</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'customer' ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] text-slate-500 mb-1 uppercase font-semibold">
                    {msg.sender === 'customer' ? '🚨 Customer (AI)' : '🗣️ Agent (You)'}
                  </span>
                  <div className={`max-w-lg px-4 py-2.5 rounded-2xl text-sm ${
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

          <div className="flex items-center space-x-4">
            {!isCalling ? (
              <button
                onClick={startCall}
                disabled={!supportSpeech}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-blue-950/50 hover:shadow-blue-900/40"
              >
                Start Call Simulation 📞
              </button>
            ) : (
              <button
                onClick={endCall}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-red-950/50 hover:shadow-red-900/40"
              >
                End Call 🛑
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
