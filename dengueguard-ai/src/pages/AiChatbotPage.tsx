import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Languages, 
  ShieldCheck, 
  Download,
  Copy,
  Check,
  Calculator,
  PhoneCall
} from 'lucide-react';
import { ChatMessage, Language, ThemeMode } from '../types';
import { generateChatResponse, MEDICAL_ADVISORY_EN, MEDICAL_ADVISORY_HI } from '../services/aiChatService';
import { speechService } from '../services/speechService';

interface AiChatbotPageProps {
  language: Language;
  theme: ThemeMode;
  onNavigateTab?: (tab: string) => void;
}

export const AiChatbotPage: React.FC<AiChatbotPageProps> = ({ 
  language: defaultLang,
  theme,
  onNavigateTab 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatLang, setChatLang] = useState<Language>(defaultLang);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatLang(defaultLang);
    const welcomeEn: ChatMessage = {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello! I am the **DengueGuard Clinical Intelligence Engine**, your epidemiological and clinical support assistant.

I can assist you with:
* **Symptom Triage:** Evaluating the 3 clinical stages of dengue and identifying emergency red flags
* **Pharmacological Guidance:** Why Aspirin & NSAIDs are strictly contraindicated, and safe antipyretic dosing
* **Fluid Protocols:** Oral Rehydration Therapy (WHO ORS) guidelines and maintaining hydration
* **Diagnostic Protocols:** Interpreting CBC, Hematocrit (PCV), and NS1 Antigen ELISA testing timelines

*How may I assist your medical inquiry or vector surveillance questions today?*`,
      language: 'en',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['WHO Dengue Clinical Management Manual', 'NCVBDC Technical Specifications'],
      triageLevel: 'safe',
      suggestedPrompts: [
        'What are the 3 phases of dengue?',
        'Why are Aspirin and Brufen dangerous?',
        'What are the 5 emergency red flags?',
        'How to clean desert coolers properly?'
      ]
    };

    const welcomeHi: ChatMessage = {
      id: 'welcome-hi',
      sender: 'bot',
      text: `नमस्ते! मैं **डेंगूगार्ड क्लीनिकल इंटेलिजेंस इंजन** हूँ, आपका डेंगू प्रबंधन एवं रोकथाम सहायक।

मैं निम्नलिखित विषयों पर प्रमाणिक चिकित्सकीय जानकारी प्रदान कर सकता हूँ:
* **लक्षण और 3 चरण:** बुखार चरण, क्रिटिकल चरण (प्लाज्मा लीकेज का खतरा) और रिकवरी
* **दवाइयों से जुड़ी सावधानी:** एस्पिरिन और दर्द निवारक क्यों वर्जित हैं, और सुरक्षित बुखार प्रबंधन
* **हाइड्रेशन गाइडेंस:** ओआरएस (ORS) घोल की सही मात्रा और इलेक्ट्रोलाइट संतुलन
* **जांच (Medical Tests):** सीबीसी (CBC), प्लेटलेट और NS1 टेस्ट कब करवाएं

*आज आप डेंगू से संबंधित क्या जानकारी प्राप्त करना चाहते हैं?*`,
      language: 'hi',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['राष्ट्रीय वेक्टर जनित रोग नियंत्रण कार्यक्रम (NCVBDC)', 'WHO गाइडलाइन्स'],
      triageLevel: 'safe',
      suggestedPrompts: [
        'डेंगू के 3 चरण कौन से हैं?',
        'एस्पिरिन या ब्रूफेन क्यों नहीं लेनी चाहिए?',
        'खतरे के मुख्य 5 लक्षण क्या हैं?',
        'कूलर की सफाई का सही तरीका?'
      ]
    };

    setMessages([defaultLang === 'hi' ? welcomeHi : welcomeEn]);
  }, [defaultLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    speechService.stopSpeaking();
    setSpeakingMsgId(null);

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      language: chatLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await generateChatResponse(text, chatLang, messages);
      setMessages(prev => [...prev, botResponse]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'bot',
        text: 'An error occurred while synthesizing clinical guidelines. Please rephrase or consult an emergency healthcare provider.',
        language: chatLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.stopSpeaking();
      setSpeakingMsgId(null);

      const success = speechService.startListening(
        chatLang,
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            handleSendMessage(transcript);
          }
        },
        (error) => {
          setIsListening(false);
          console.warn('Speech recognition error:', error);
        },
        () => {
          setIsListening(false);
        }
      );

      if (success) {
        setIsListening(true);
      }
    }
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      speechService.stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      speechService.stopSpeaking();
      setSpeakingMsgId(msgId);
      speechService.speak(
        text,
        chatLang,
        () => setSpeakingMsgId(msgId),
        () => setSpeakingMsgId(null)
      );
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTranscript = () => {
    const text = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DengueGuard_Clinical_Consultation_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-dark-surface rounded-3xl border border-slate-200 dark:border-dark-border shadow-2xl overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-slate-50 dark:bg-dark-card px-6 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 dark:bg-neon-teal flex items-center justify-center text-white dark:text-dark-bg shadow-md shadow-teal-600/30 dark:shadow-neon-teal">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                DengueGuard AI Assistant
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 dark:bg-neon-teal/20 text-teal-800 dark:text-neon-teal border border-teal-200 dark:border-neon-teal/30">
                Clinical Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-Turn Triage • Pharmacological Guidance • WHO Protocols
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <button
            onClick={() => setChatLang(chatLang === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Languages className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan" />
            <span>{chatLang === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Export Transcript */}
          <button
            onClick={handleExportTranscript}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Download Consultation Transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-slate-50/50 to-white dark:from-dark-surface dark:to-dark-card">
        
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          const isSpeakingThis = speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 shadow-sm ${
                isBot
                  ? msg.isWarning
                    ? 'bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-slate-900 dark:text-slate-100'
                    : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-slate-100'
                  : 'bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg ml-auto font-medium'
              }`}>
                
                {/* Emergency Banner */}
                {isBot && msg.isWarning && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300 mb-2 pb-1.5 border-b border-rose-200 dark:border-rose-900/60">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Emergency Clinical Triage Advisory</span>
                  </div>
                )}

                {/* Text Content */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                  {msg.text}
                </div>

                {/* Bot Message Controls & Sources */}
                {isBot && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-dark-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan" />
                      <span>{msg.sources?.join(', ') || 'WHO Guidelines'}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                          isSpeakingThis
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                        title="Listen to audio"
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="w-3 h-3" /> Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" /> Read Aloud
                          </>
                        )}
                      </button>

                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  </div>
                )}

                {/* Prompt suggestion buttons */}
                {isBot && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-dark-border flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left px-2.5 py-1 rounded-xl text-xs bg-teal-50 dark:bg-dark-card text-teal-800 dark:text-neon-cyan hover:bg-teal-100 dark:hover:bg-slate-800 border border-teal-200 dark:border-dark-border transition-colors font-semibold"
                      >
                        💡 {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {!isBot && (
                  <div className="mt-1 text-right text-[10px] text-teal-100 dark:text-slate-900">
                    {msg.timestamp}
                  </div>
                )}

              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-2xl px-4 py-3 shadow-sm flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-teal-600 dark:bg-neon-teal animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-teal-600 dark:bg-neon-teal animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-teal-600 dark:bg-neon-teal animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Speech-to-Text Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-200 dark:ring-rose-900'
                : 'bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak (Voice STT)'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              isListening
                ? (chatLang === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... Speak into microphone...')
                : (chatLang === 'hi' ? 'डेंगू के लक्षण, दवाएं, रोकथाम या टेस्ट के बारे में पूछें...' : 'Ask about dengue clinical stages, warning signs, fluid protocol, or tests...')
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Responsible Medical Advisory Footer */}
        <div className="px-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan shrink-0" />
            {chatLang === 'hi' ? MEDICAL_ADVISORY_HI : MEDICAL_ADVISORY_EN}
          </span>
          <a
            href="tel:1075"
            className="text-rose-600 dark:text-rose-400 font-bold hover:underline shrink-0 ml-2"
          >
            Emergency: 1075
          </a>
        </div>
      </div>

    </div>
  );
};
