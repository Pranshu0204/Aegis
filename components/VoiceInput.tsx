import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language: Language;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, language, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      setRecognition(recog);
    } else {
      setError("Voice not supported");
    }
  }, []);

  useEffect(() => {
    if (recognition) {
      const langMap: Record<Language, string> = {
        'English': 'en-US', 'Hindi': 'hi-IN', 'Spanish': 'es-ES', 'French': 'fr-FR',
        'Arabic': 'ar-SA', 'Mandarin': 'zh-CN', 'German': 'de-DE', 'Italian': 'it-IT', 'Portuguese': 'pt-PT'
      };
      recognition.lang = langMap[language];
    }
  }, [language, recognition]);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Start failed", e);
      }
    }
  };

  useEffect(() => {
    if (!recognition) return;
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) onTranscript(finalTranscript + ' ');
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }, [recognition, onTranscript]);

  if (error) return null;

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 ease-out
        ${isListening 
          ? 'liquid-icon bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/40 scale-110' 
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      title="Voice Input"
    >
      {isListening ? (
         <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
      ) : null}
      
      <svg className={`w-5 h-5 z-10 transition-colors ${isListening ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
};