import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, MessageSquare, AlertCircle, Activity } from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { speechService } from '../services/speechService';
import { generateChatResponse } from '../services/aiChatService';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap microphone to start voice consultation');
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  useEffect(() => {
    if (!isOpen) {
      speechService.stopListening();
      speechService.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setStatusMessage('Analyzing clinical guidelines...');
    } else {
      speechService.stopSpeaking();
      setIsSpeaking(false);
      setTranscript('');
      setStatusMessage(selectedLang === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak clearly');

      const success = speechService.startListening(
        selectedLang,
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            handleProcessQuestion(text);
          }
        },
        (error) => {
          setIsListening(false);
          setStatusMessage(`Microphone: ${error}`);
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

  const handleProcessQuestion = async (queryText: string) => {
    setStatusMessage('Synthesizing evidence-based guidance...');
    const botMsg = await generateChatResponse(queryText, selectedLang);
    setAiResponse(botMsg.text);
    setStatusMessage('Clinical response synthesized');

    // Automatically speak the response
    handleSpeak(botMsg.text);
  };

  const handleSpeak = (textToSpeak: string) => {
    if (!textToSpeak) return;
    setIsSpeaking(true);
    speechService.speak(
      textToSpeak,
      selectedLang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleStopSpeaking = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  const samplePromptsEn = [
    'What are the 3 phases of dengue fever?',
    'Why is Aspirin contraindicated in dengue?',
    'What are the 5 emergency red flag signs?',
  ];

  const samplePromptsHi = [
    'डेंगू के 3 मुख्य चरण क्या हैं?',
    'डेंगू में कौन सी दर्द निवारक दवा नहीं लेनी चाहिए?',
    'कूलर को साफ करने का सही तरीका क्या है?',
  ];

  const prompts = selectedLang === 'hi' ? samplePromptsHi : samplePromptsEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-dark-border flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-sky-900 dark:from-dark-card dark:via-dark-surface dark:to-dark-card p-5 text-white flex items-center justify-between border-b border-teal-500/20 dark:border-neon-teal/20">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/10 dark:bg-neon-teal/20 backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-teal-200 dark:text-neon-cyan" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">DengueGuard Voice AI</h3>
              <p className="text-xs text-teal-100/90 dark:text-slate-300">Hands-Free Speech-to-Text &amp; Voice Synthesis</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedLang(selectedLang === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 dark:bg-dark-card hover:bg-white/30 text-white transition-colors"
            >
              {selectedLang === 'en' ? 'English' : 'हिन्दी'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {/* Big Animated Mic Circle & Neon Equalizer Wave */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative flex items-center justify-center">
              {isListening && (
                <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 dark:bg-rose-500/30 recording-pulse" />
              )}
              {isSpeaking && (
                <div className="absolute w-28 h-28 rounded-full bg-sky-500/20 dark:bg-neon-cyan/30 recording-pulse" />
              )}
              <button
                onClick={handleToggleListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform active:scale-95 ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 ring-4 ring-rose-200 dark:ring-rose-900 shadow-rose-500/50'
                    : 'bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:text-dark-bg ring-4 ring-teal-100 dark:ring-neon-teal/30 shadow-neon-teal'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to start voice input'}
              >
                {isListening ? (
                  <MicOff className="w-9 h-9 animate-pulse" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}
              </button>
            </div>

            {/* Audio Waveform Equalizer Display */}
            {(isListening || isSpeaking) && (
              <div className="flex items-center gap-1.5 h-8 mt-3">
                <span className="w-1 bg-teal-500 dark:bg-neon-cyan rounded-full wave-bar-1" />
                <span className="w-1 bg-teal-500 dark:bg-neon-teal rounded-full wave-bar-2" />
                <span className="w-1 bg-teal-500 dark:bg-neon-emerald rounded-full wave-bar-3" />
                <span className="w-1 bg-teal-500 dark:bg-neon-cyan rounded-full wave-bar-4" />
                <span className="w-1 bg-teal-500 dark:bg-neon-teal rounded-full wave-bar-5" />
              </div>
            )}

            <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {statusMessage}
            </p>
          </div>

          {/* Transcript Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan" />
                {selectedLang === 'hi' ? 'आपकी आवाज (Transcript):' : 'Speech-to-Text Transcript:'}
              </span>
              {transcript && (
                <button
                  onClick={() => handleProcessQuestion(transcript)}
                  className="text-teal-600 dark:text-neon-cyan font-bold hover:underline"
                >
                  {selectedLang === 'hi' ? 'उत्तर पूछें →' : 'Ask Question →'}
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 italic min-h-[36px]">
              {transcript || (
                <span className="text-slate-400 dark:text-slate-500">
                  {selectedLang === 'hi'
                    ? 'माइक दबाएं और बोलें, या नीचे दिए गए किसी उदाहरण पर टैप करें...'
                    : 'Tap the microphone to speak, or select a consultation prompt below...'}
                </span>
              )}
            </p>
          </div>

          {/* AI Response Display */}
          {aiResponse && (
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-dark-card border border-teal-200 dark:border-neon-teal/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-900 dark:text-neon-cyan flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-neon-teal" />
                  DengueGuard Audio Guidance
                </span>
                <button
                  onClick={isSpeaking ? handleStopSpeaking : () => handleSpeak(aiResponse)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:text-dark-bg font-bold transition-colors"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" /> Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" /> Listen Again
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto pr-1">
                {aiResponse}
              </div>
            </div>
          )}

          {/* Consultation Prompts */}
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {selectedLang === 'hi' ? 'त्वरित प्रश्न:' : 'Common Clinical Inquiries:'}
            </p>
            <div className="flex flex-col gap-1.5">
              {prompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(p);
                    handleProcessQuestion(p);
                  }}
                  className="text-left px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-dark-card hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-teal-900 dark:hover:text-neon-cyan border border-slate-200 dark:border-dark-border text-xs transition-all flex items-center justify-between"
                >
                  <span>"{p}"</span>
                  <span className="text-[10px] text-teal-600 dark:text-neon-cyan font-bold ml-2">Consult →</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-dark-card border-t border-slate-200 dark:border-dark-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
          >
            Close Voice Assistant
          </button>
        </div>

      </div>
    </div>
  );
};
