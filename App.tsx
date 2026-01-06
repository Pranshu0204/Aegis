import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppState, ModuleId, Role, FileAttachment, Language, Theme, ChatMessage } from './types';
import { ModuleCard } from './components/ModuleCard';
import { FileUploader } from './components/FileUploader';
import { VoiceInput } from './components/VoiceInput';
import { generateGeminiResponse, SYSTEM_PROMPTS, createChatSession, LiveClient } from './services/geminiService';
import { marked } from 'marked';
import { TRANSLATIONS } from './utils/translations';
import { Chat, GenerateContentResponse } from "@google/genai";

// Icons
const Icons = {
  Triage: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Discharge: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Intake: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Caregiver: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Chat: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Live: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  Sun: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
};

// Professional AEGIS Logo Component
const AegisLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="aegis-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#007AFF" />
        <stop offset="100%" stopColor="#30B0C7" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Shield Shape */}
    <path d="M20 3L6 9V19C6 27.5 12.8 35.2 20 39C27.2 35.2 34 27.5 34 19V9L20 3Z" fill="url(#aegis-grad)" />
    {/* Inner White Cross / Pulse Area */}
    <path d="M20 12V26M13 19H27" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))" />
    {/* Glossy Reflection */}
    <path d="M20 3L6 9V19C6 27.5 12.8 35.2 20 39C27.2 35.2 34 27.5 34 19V9L20 3Z" fill="white" fillOpacity="0.1" style={{mixBlendMode: 'overlay'}} />
  </svg>
);

const MarkdownRenderer = ({ text, inline = false }: { text: string, inline?: boolean }) => {
  const html = useMemo(() => inline ? marked.parseInline(text) : marked.parse(text), [text, inline]);
  
  if (inline) {
    return (
      <span 
        dangerouslySetInnerHTML={{ __html: html as string }} 
        className="prose prose-slate prose-sm dark:prose-invert max-w-none inline [&>strong]:text-slate-900 [&>strong]:dark:text-white [&>strong]:font-bold" 
      />
    );
  }
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: html as string }} 
      className="prose prose-slate prose-sm dark:prose-invert max-w-none leading-relaxed [&>h1]:text-lg [&>h2]:text-base [&>h3]:text-sm [&>strong]:text-slate-900 [&>strong]:dark:text-white [&>strong]:font-bold [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5" 
    />
  );
};

const ResultView = React.memo(({ result, module }: { result: string | null, module: ModuleId }) => {
  if (!result) return null;

  const getSeverityColor = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('emergency') || l.includes('high') || l.includes('critical')) return 'border-ios-red bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-300';
    if (l.includes('urgent') || l.includes('same-day')) return 'border-ios-orange bg-orange-50/50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-300';
    if (l.includes('routine') || l.includes('self-care')) return 'border-ios-teal bg-teal-50/50 dark:bg-teal-900/10 text-teal-700 dark:text-teal-300';
    return 'border-ios-blue bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300';
  };

  if (module === ModuleId.TRIAGE) {
    try {
      const json = JSON.parse(result);
      const urgency = json.urgency_level || 'Routine';
      const colorClass = getSeverityColor(urgency);

      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border-l-[6px] ${colorClass} glass-card flex justify-between items-center animate-slide-up shadow-sm`}>
            <div className="w-full">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Assessment Level</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight">{urgency}</h3>
            </div>
          </div>

          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {Object.entries(json).map(([key, value], idx) => {
              if (key === 'urgency_level' || key === 'urgency_confidence') return null;
              
              if (key === 'red_flags' && Array.isArray(value) && value.length > 0) {
                return (
                  <div key={key} className="border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-900/10 p-5 rounded-2xl animate-scale-in backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3 text-red-700 dark:text-red-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <span className="text-sm uppercase tracking-wide font-bold">Red Flags Identified</span>
                    </div>
                    <ul className="space-y-2">
                      {value.map((v: string, i: number) => (
                        <li key={i} className="text-red-800 dark:text-red-200 text-sm font-semibold flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 shadow-sm shadow-red-500/50"></span> 
                          <MarkdownRenderer text={v} inline={true} />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return (
                <div key={key} className="glass-card rounded-2xl p-5 hover:border-ios-blue/30 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-500/5">
                  <span className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block mb-2 group-hover:text-ios-blue transition-colors">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    {Array.isArray(value) ? (
                      <div className="flex flex-wrap gap-2">
                        {value.map((v: string, i: number) => (
                          <span key={i} className="bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs border border-slate-200 dark:border-slate-700 font-medium shadow-sm">
                            <MarkdownRenderer text={v} inline={true} />
                          </span>
                        ))}
                      </div>
                    ) : (
                      typeof value === 'object' ? JSON.stringify(value, null, 2) : <MarkdownRenderer text={String(value)} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } catch (e) {
      return <MarkdownRenderer text={result} />;
    }
  }

  return <MarkdownRenderer text={result} />;
});

// Creative "Liquid Orb" Thinking Animation
const GeminiLoader = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-8 animate-fade-in w-full h-full min-h-[300px]">
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-ios-blue via-ios-purple to-ios-pink opacity-20 blur-3xl animate-pulse-glow"></div>
      
      {/* Morphing Fluid Orb */}
      <div className="w-20 h-20 liquid-orb animate-morph"></div>
      
      {/* Secondary Orb orbiting */}
      <div className="absolute w-full h-full animate-spin [animation-duration:8s]">
        <div className="w-4 h-4 rounded-full bg-ios-teal blur-sm absolute top-0 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
    
    <div className="flex flex-col items-center space-y-2">
        <span className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-ios-blue via-ios-purple to-ios-pink animate-shimmer bg-[length:200%_auto]">
        Gemini is thinking...
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide">
            Analyzing clinical context
        </span>
    </div>
  </div>
);

const ChatInterface = ({ role, language, onClose }: { role: Role, language: Language, onClose?: () => void }) => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instruction = `${SYSTEM_PROMPTS.CHATBOT}\nContext: Role=${role}, Language=${language}`;
    chatSession.current = createChatSession(instruction);
    setHistory([]);
  }, [role, language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response: GenerateContentResponse = await chatSession.current.sendMessage({ message: userMsg.text });
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date()
      };
      setHistory(prev => [...prev, modelMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "Error connecting to Gemini. Please try again.",
          timestamp: new Date()
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/95 overflow-hidden relative font-sans backdrop-blur-xl">
      <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center shrink-0 z-10">
        <h3 className="font-bold flex items-center gap-3 text-lg tracking-tight text-slate-900 dark:text-white">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ios-indigo to-ios-blue flex items-center justify-center text-white shadow-lg shadow-ios-blue/30">
             <Icons.Chat />
           </div>
           Gemini Chat
        </h3>
        {onClose && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors">
                <Icons.Close />
            </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6 animate-fade-in">
            <div className="w-20 h-20 liquid-orb animate-morph bg-gradient-to-tr from-slate-200 to-white opacity-50 dark:from-slate-800 dark:to-slate-700"></div>
            <p className="text-sm text-center px-8 text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                I am <strong>Gemini 3.0 Pro</strong>. I can answer complex medical questions or summarize the case.
            </p>
          </div>
        )}
        {history.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in origin-bottom`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-ios-blue to-ios-indigo text-white rounded-tr-sm shadow-ios-blue/30' 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700'
            }`}>
              <MarkdownRenderer text={msg.text} />
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start animate-fade-in">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
               <span className="w-2 h-2 bg-ios-blue rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-ios-purple rounded-full animate-bounce delay-75"></span>
               <span className="w-2 h-2 bg-ios-pink rounded-full animate-bounce delay-150"></span>
             </div>
           </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 shrink-0 z-10">
        <div className="flex gap-2 relative bg-slate-100 dark:bg-slate-800 rounded-[20px] p-1 pr-1.5 focus-within:ring-2 ring-ios-blue/50 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 p-3 bg-transparent border-none text-sm outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="self-center p-2 bg-ios-blue rounded-full text-white shadow-md shadow-ios-blue/30 hover:scale-105 active:scale-90 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const LiveInterface = ({ role, language, t }: { role: Role, language: Language, t: any }) => {
  const [status, setStatus] = useState('disconnected');
  const clientRef = useRef<LiveClient | null>(null);

  useEffect(() => {
    clientRef.current = new LiveClient((s) => setStatus(s));
    return () => {
      clientRef.current?.disconnect();
    };
  }, []);

  const toggleConnection = async () => {
    if (!clientRef.current) return;
    if (status === 'connected') {
      await clientRef.current.disconnect();
    } else {
      const instruction = `${SYSTEM_PROMPTS.LIVE}\nContext: Role=${role}, Language=${language}`;
      await clientRef.current.connect(instruction);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12 animate-fade-in relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-ios-blue/10 via-ios-purple/10 to-ios-pink/10 rounded-full blur-3xl -z-10 animate-pulse-glow"></div>

      <div className={`relative w-56 h-56 flex items-center justify-center transition-all duration-700`}>
        {status === 'connected' && (
           <>
             <div className="absolute inset-0 rounded-full border border-ios-red/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
             <div className="absolute inset-8 rounded-full border border-ios-red/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
           </>
        )}
        <div className={`
            w-32 h-32 rounded-[30px] flex items-center justify-center transition-all duration-700 liquid-icon
            ${status === 'connected' 
                ? 'bg-gradient-to-br from-ios-red to-ios-orange shadow-2xl shadow-ios-red/50 scale-125' 
                : 'bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 shadow-xl'
            }
        `}>
             <div className={`transition-all duration-500 ${status === 'connected' ? 'text-white' : 'text-slate-400'}`}>
                <Icons.Live />
             </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {status === 'connected' ? t.live.listening : t.live.start}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            {status === 'connected' ? "Gemini is listening..." : "Tap to start a voice conversation"}
        </p>
      </div>

      <button
        onClick={toggleConnection}
        className={`px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl backdrop-blur-md ${
            status === 'connected' 
            ? 'bg-white/90 text-ios-red border border-ios-red/20 hover:bg-red-50' 
            : 'bg-gradient-to-r from-ios-blue to-ios-teal text-white shadow-ios-blue/40'
        }`}
      >
        {status === 'connected' ? t.live.stop : t.live.start}
      </button>
    </div>
  );
};


export default function App() {
  const savedTheme = localStorage.getItem('theme') as Theme || 'light';
  
  const [state, setState] = useState<AppState>({
    currentModule: ModuleId.TRIAGE,
    userRole: Role.CLINICIAN,
    language: 'English',
    theme: savedTheme,
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useMemo(() => TRANSLATIONS[state.language] || TRANSLATIONS['English'], [state.language]);

  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const resetModule = (id: ModuleId) => {
    if (state.currentModule !== id) {
      setState(prev => ({ ...prev, currentModule: id }));
      setInput('');
      setAttachments([]);
      setResult(null);
      setIsMobileMenuOpen(false); 
    }
  };

  const handleSubmit = async () => {
    if (!input && attachments.length === 0) return;
    setLoading(true);
    setResult(null);

    let systemInstruction = '';
    const currentPrompt = input;

    switch (state.currentModule) {
      case ModuleId.TRIAGE: systemInstruction = SYSTEM_PROMPTS.TRIAGE; break;
      case ModuleId.DISCHARGE: systemInstruction = SYSTEM_PROMPTS.DISCHARGE; break;
      case ModuleId.INTAKE: systemInstruction = SYSTEM_PROMPTS.INTAKE; break;
      case ModuleId.CAREGIVER: systemInstruction = SYSTEM_PROMPTS.CAREGIVER; break;
    }

    systemInstruction += `\n\nCONTEXTUAL INSTRUCTIONS:
    1. Current User Role: ${state.userRole}. Adjust tone and vocabulary complexity accordingly.
    2. Output Language: ${state.language}. Translate strictly, ensuring medical accuracy.
    3. Output Format: If JSON is requested, ensure keys remain in English but values are localized to ${state.language}.`;

    try {
      const response = await generateGeminiResponse({
        systemInstruction,
        prompt: currentPrompt || "Please analyze the attached documents/images according to the instructions.",
        attachments,
        responseMimeType: (state.currentModule === ModuleId.TRIAGE) ? 'application/json' : 'text/plain'
      });
      setResult(response);
    } catch (err) {
      console.error(err);
      setResult("Error generating response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F2F6FA] dark:bg-[#050912] transition-colors duration-700 relative overflow-hidden">
      
      {/* Organic Background Blobs */}
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-b from-ios-blue/10 to-ios-teal/10 rounded-full blur-[120px] pointer-events-none animate-float-slow"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-t from-ios-purple/10 to-ios-pink/10 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-md transition-opacity duration-500"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Frosted Glass */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-white/70 dark:bg-[#0F111A]/70 backdrop-blur-2xl border-r border-white/50 dark:border-white/5
          flex flex-col h-full shrink-0 transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) shadow-[0_0_40px_rgba(0,0,0,0.05)] md:shadow-none
          md:relative md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-1.5">
              {/* Professional Logo Component */}
              <AegisLogo className="w-10 h-10 shadow-xl shadow-ios-blue/20 rounded-xl" />
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-ios-blue to-ios-teal font-sans">AEGIS</h1>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase leading-none">Medical Intelligence</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:scale-110 transition-all active:scale-95">
                {state.theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 hover:text-red-500 transition-colors">
                <Icons.Close />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          
          <div className="mb-8 space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">{t.role}</label>
              <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm">
                {[Role.CLINICIAN, Role.PATIENT, Role.CAREGIVER].map((r) => (
                  <button
                    key={r}
                    onClick={() => setState(prev => ({ ...prev, userRole: r }))}
                    className={`flex-1 py-2 text-[10px] md:text-xs font-semibold rounded-xl transition-all duration-300 ${
                      state.userRole === r 
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-ios-blue dark:text-white scale-[1.02]' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {t.roles[r] || r}
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
               <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">{t.language}</label>
               <div className="relative group">
                 <select 
                  value={state.language}
                  onChange={(e) => setState(prev => ({ ...prev, language: e.target.value as Language }))}
                  className="w-full appearance-none bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm py-3 px-4 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-ios-blue focus:border-transparent outline-none transition-all cursor-pointer font-medium shadow-sm group-hover:shadow-md"
                 >
                   {['English', 'Hindi', 'Spanish', 'French', 'Arabic', 'Mandarin', 'German', 'Italian', 'Portuguese'].map(l => (
                     <option key={l} value={l}>{l}</option>
                   ))}
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>
               </div>
            </div>
          </div>

          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1 animate-slide-up" style={{ animationDelay: '0.15s' }}>{t.modulesHeader}</label>
          <div className="animate-slide-up space-y-2" style={{ animationDelay: '0.2s' }}>
            <ModuleCard 
              id={ModuleId.TRIAGE} title={t.modules[ModuleId.TRIAGE].title}
              description={t.modules[ModuleId.TRIAGE].desc} 
              icon={<Icons.Triage />} active={state.currentModule === ModuleId.TRIAGE} onClick={resetModule} 
            />
            <ModuleCard 
              id={ModuleId.DISCHARGE} title={t.modules[ModuleId.DISCHARGE].title}
              description={t.modules[ModuleId.DISCHARGE].desc}
              icon={<Icons.Discharge />} active={state.currentModule === ModuleId.DISCHARGE} onClick={resetModule} 
            />
            <ModuleCard 
              id={ModuleId.INTAKE} title={t.modules[ModuleId.INTAKE].title}
              description={t.modules[ModuleId.INTAKE].desc}
              icon={<Icons.Intake />} active={state.currentModule === ModuleId.INTAKE} onClick={resetModule} 
            />
            <ModuleCard 
              id={ModuleId.CAREGIVER} title={t.modules[ModuleId.CAREGIVER].title}
              description={t.modules[ModuleId.CAREGIVER].desc}
              icon={<Icons.Caregiver />} active={state.currentModule === ModuleId.CAREGIVER} onClick={resetModule} 
            />
            <ModuleCard 
              id={ModuleId.LIVE} title={t.modules[ModuleId.LIVE].title}
              description={t.modules[ModuleId.LIVE].desc}
              icon={<Icons.Live />} active={state.currentModule === ModuleId.LIVE} onClick={resetModule} 
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative overflow-hidden backdrop-blur-sm">
        
        {/* Header - Glassmorphism */}
        <header className="sticky top-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-white/5 p-4 md:px-8 md:py-5 flex justify-between items-center shrink-0 z-20">
          <div className="flex items-center gap-4 animate-fade-in">
            <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="md:hidden p-2.5 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
                <Icons.Menu />
            </button>
            <div key={state.currentModule}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors leading-tight tracking-tight">{t.modules[state.currentModule].title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-white/5 rounded-full border border-white/20 dark:border-white/5 shadow-sm backdrop-blur-md">
                 <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.context}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                 <span className="text-xs font-bold text-ios-blue dark:text-ios-teal">{t.roles[state.userRole]}</span>
             </div>
          </div>
        </header>

        {/* Scrollable Work Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          
           {state.currentModule === ModuleId.LIVE ? (
             <div className="max-w-4xl mx-auto h-full min-h-[400px] md:min-h-[500px]">
                <LiveInterface role={state.userRole} language={state.language} t={t} />
             </div>
          ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-12">
              
              {/* Input Column */}
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="glass-card p-8 rounded-[24px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] dark:shadow-none transition-all">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.dataInput}</h3>
                    <VoiceInput 
                      onTranscript={(text) => setInput(prev => prev + text)} 
                      language={state.language}
                    />
                  </div>
                  
                  <FileUploader 
                    onFilesSelected={(files) => setAttachments(prev => [...prev, ...files])} 
                    attachments={attachments}
                    onRemove={(idx) => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    labels={{title: t.uploadTitle, subtitle: t.uploadSubtitle, support: t.uploadSupport}}
                  />

                  <div className="group relative">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 pl-1">
                      {t.placeholders[state.currentModule] || "Details..."}
                    </label>
                    <textarea
                      className="w-full h-48 p-5 bg-slate-50/50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-2xl text-[15px] text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-ios-blue/50 focus:border-ios-blue/50 transition-all resize-none placeholder-slate-400 dark:placeholder-slate-600 shadow-inner"
                      placeholder="Type clinical notes here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || (!input && attachments.length === 0)}
                      className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-ios-blue to-ios-teal hover:brightness-110 disabled:grayscale disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-ios-blue/30 hover:shadow-ios-blue/50 hover:-translate-y-1 active:translate-y-0 active:scale-95 w-full md:w-auto overflow-hidden group"
                    >
                       {/* Shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <span className="relative flex items-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t.processing}
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          {t.runAnalysis}
                        </>
                      )}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl flex gap-4 items-start hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                   <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-ios-blue">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <div>
                      <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-1">Clinical Tip</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.tips[state.currentModule]}
                      </p>
                   </div>
                </div>
              </div>

              {/* Output Column */}
              <div className="flex flex-col gap-6">
                <div className="glass-card rounded-[24px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col min-h-[600px] transition-colors relative overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-white/40 dark:bg-white/5">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {t.aiOutput}
                    </h3>
                    {result && (
                      <button onClick={() => navigator.clipboard.writeText(typeof result === 'string' ? result : JSON.stringify(result))} className="text-xs font-bold text-ios-blue hover:text-ios-teal flex items-center gap-1.5 transition-colors uppercase tracking-wider">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        {t.copy}
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1">
                    {!result && !loading && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <p className="font-medium text-slate-400 dark:text-slate-500">{t.waiting}</p>
                      </div>
                    )}
                    
                    {loading && <GeminiLoader />}

                    {result && (
                      <div className="animate-fade-in">
                        <ResultView result={result} module={state.currentModule} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl text-slate-400 dark:text-slate-500 text-[10px] md:text-[11px] py-4 px-6 border-t border-slate-200/50 dark:border-white/5 text-center z-20 shrink-0 font-medium tracking-wide">
          {t.disclaimer}
        </div>
      </main>

      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end space-y-6">
        <div 
            className={`transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) origin-bottom-right ${
                isChatOpen 
                ? 'scale-100 opacity-100 translate-y-0' 
                : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
            }`}
        >
            <div className="w-[calc(100vw-3rem)] sm:w-[420px] h-[65vh] sm:h-[650px] rounded-[32px] shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden flex flex-col ring-1 ring-black/5 dark:ring-white/5">
                <ChatInterface role={state.userRole} language={state.language} onClose={() => setIsChatOpen(false)} />
            </div>
        </div>

        <button
            onClick={() => setIsChatOpen(prev => !prev)}
            className={`
                group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 z-50 flex items-center justify-center overflow-hidden
                ${isChatOpen ? 'bg-slate-800 dark:bg-white rotate-90' : 'liquid-icon bg-gradient-to-br from-ios-blue to-ios-purple'}
            `}
            title={t.modules[ModuleId.CHATBOT].title}
        >
             {/* Gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none"></div>
            
            <div className={`relative z-10 transition-colors ${isChatOpen ? 'text-white dark:text-slate-900' : 'text-white'}`}>
                {isChatOpen ? <Icons.Close /> : <Icons.Chat />}
            </div>
        </button>
      </div>

    </div>
  );
}