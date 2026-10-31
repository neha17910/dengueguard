import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { UserAuthModal } from './components/UserAuthModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';

import { DashboardPage } from './pages/DashboardPage';
import { AiChatbotPage } from './pages/AiChatbotPage';
import { ClinicalToolsPage } from './pages/ClinicalToolsPage';
import { CommunityReportsPage } from './pages/CommunityReportsPage';
import { RemindersPage } from './pages/RemindersPage';
import { MedicineInfoPage } from './pages/MedicineInfoPage';
import { AwarenessCenterPage } from './pages/AwarenessCenterPage';
import { AiSimulatorPage } from './pages/AiSimulatorPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { Language, ThemeMode, UserSession } from './types';
import { getUserSession, saveUserSession, getStoredTheme, setStoredTheme } from './services/storageService';
import { Mic, ShieldCheck, PhoneCall, ExternalLink, Activity } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [userSession, setUserSession] = useState<UserSession>(getUserSession());

  useEffect(() => {
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    setStoredTheme(savedTheme);

    const session = getUserSession();
    setUserSession(session);
    if (session.preferredLanguage) {
      setLanguage(session.preferredLanguage);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setStoredTheme(nextTheme);
    const session = getUserSession();
    saveUserSession({ ...session, theme: nextTheme });
  };

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    const session = getUserSession();
    saveUserSession({ ...session, preferredLanguage: nextLang });
  };

  const handleUpdateSession = (updated: UserSession) => {
    setUserSession(updated);
    saveUserSession(updated);
    if (updated.role === 'health_officer' || updated.role === 'admin') {
      setCurrentTab('admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white transition-colors duration-200">
      
      {/* Top Advisory Ticker */}
      <DisclaimerBanner language={language} />

      {/* Main Responsive Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        userSession={userSession}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardPage
            language={language}
            theme={theme}
            onNavigateTab={setCurrentTab}
            onOpenVoice={() => setIsVoiceOpen(true)}
          />
        )}

        {currentTab === 'chatbot' && (
          <AiChatbotPage 
            language={language} 
            theme={theme}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'clinical_tools' && (
          <ClinicalToolsPage 
            language={language}
          />
        )}

        {currentTab === 'reports' && (
          <CommunityReportsPage 
            language={language}
            userSession={userSession}
          />
        )}

        {currentTab === 'reminders' && (
          <RemindersPage 
            language={language} 
          />
        )}

        {currentTab === 'medicines' && (
          <MedicineInfoPage 
            language={language} 
          />
        )}

        {currentTab === 'awareness' && (
          <AwarenessCenterPage 
            language={language} 
          />
        )}

        {currentTab === 'simulator' && (
          <AiSimulatorPage 
            language={language} 
            theme={theme}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage 
            language={language} 
            theme={theme}
            userSession={userSession}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Floating Action Button: Voice Assistant */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-teal-600 to-sky-600 dark:from-neon-teal dark:to-neon-cyan text-white dark:text-dark-bg font-extrabold shadow-xl shadow-teal-600/30 dark:shadow-neon-teal/40 hover:scale-105 active:scale-95 transition-all"
          title="Open Voice AI Assistant (Speech-to-Text & Text-to-Speech)"
        >
          <Mic className="w-5 h-5 animate-pulse" />
          <span className="text-xs sm:text-sm">Voice AI Assistant</span>
        </button>
      </div>

      {/* Enterprise Platform Footer */}
      <footer className="bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border mt-14 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white dark:text-dark-bg font-black text-xs shadow-sm">
                DG
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">DengueGuard AI</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-teal-700 dark:text-neon-cyan font-bold">Vector Surveillance &amp; Clinical Decision Intelligence</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <a
                href="https://nvbdcp.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-600 dark:hover:text-neon-cyan flex items-center gap-1 transition-colors"
              >
                <span>NCVBDC Guidelines</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue"
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-600 dark:hover:text-neon-cyan flex items-center gap-1 transition-colors"
              >
                <span>WHO Clinical Protocols</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="tel:1075"
                className="text-rose-600 dark:text-rose-400 font-extrabold hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>National Helpline: 1075</span>
              </a>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <p>
              Integrated epidemiological surveillance platform. Designed for clinical triage, vector monitoring, and public health intelligence.
            </p>
            <p className="flex items-center gap-1">
              Engineered with React 18, TypeScript, Tailwind CSS, Node.js &amp; Open-Meteo
            </p>
          </div>
        </div>
      </footer>

      {/* User Security & RBAC Access Modal */}
      <UserAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userSession={userSession}
        onUpdateSession={handleUpdateSession}
      />

      {/* Voice Assistant Floating Dialog */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
      />

    </div>
  );
};

export default App;
