import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Bot, 
  MapPin, 
  Bell, 
  Pill, 
  BookOpen, 
  Cpu, 
  Calculator,
  User, 
  Languages, 
  PhoneCall, 
  Menu, 
  X,
  Volume2,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { Language, ThemeMode, UserSession } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onOpenVoice: () => void;
  userSession: UserSession;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  onOpenAuth,
  onOpenVoice,
  userSession,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOfficerOrAdmin = userSession.role === 'health_officer' || userSession.role === 'admin';

  const navItems = [
    { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: Activity },
    { id: 'chatbot', labelEn: 'AI Assistant', labelHi: 'एआई सहायक', icon: Bot },
    { id: 'clinical_tools', labelEn: 'Clinical Tools', labelHi: 'क्लीनिकल टूल्स', icon: Calculator },
    { id: 'reports', labelEn: 'Surveillance', labelHi: 'निगरानी रिपोर्ट', icon: MapPin },
    { id: 'reminders', labelEn: 'Prevention', labelHi: 'रोकथाम', icon: Bell },
    { id: 'medicines', labelEn: 'Drug Safety', labelHi: 'दवा सुरक्षा', icon: Pill },
    { id: 'awareness', labelEn: 'Clinical Hub', labelHi: 'ज्ञान केंद्र', icon: BookOpen },
    { id: 'simulator', labelEn: 'Simulator', labelHi: 'सिम्युलेटर', icon: Cpu },
    { id: 'admin', labelEn: 'Admin Portal', labelHi: 'एडमिन', icon: ShieldAlert, badge: isOfficerOrAdmin ? 'Officer' : undefined },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-slate-200 dark:border-dark-border shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-teal-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-500/25 dark:shadow-neon-cyan/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black bg-gradient-to-r from-teal-600 via-sky-600 to-teal-500 dark:from-neon-teal dark:via-neon-cyan dark:to-neon-emerald bg-clip-text text-transparent tracking-tight">
                  DengueGuard AI
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 dark:bg-neon-teal/10 text-teal-700 dark:text-neon-teal border border-teal-200 dark:border-neon-teal/30">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden md:block font-medium">
                Vector Surveillance &amp; Clinical Decision Support
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg shadow-sm dark:shadow-neon-teal font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-neon-cyan hover:bg-slate-100 dark:hover:bg-dark-card'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-amber-400 dark:bg-neon-amber text-slate-950 font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center space-x-2">
            
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark Neon'} mode`}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card border border-slate-200 dark:border-dark-border transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Voice AI Pill */}
            <button
              onClick={onOpenVoice}
              title="Open Voice AI Assistant"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-neon-cyan/10 text-sky-700 dark:text-neon-cyan hover:bg-sky-100 dark:hover:bg-neon-cyan/20 border border-sky-200 dark:border-neon-cyan/30 transition-colors shadow-2xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-neon-cyan" />
              <span>Voice AI</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={onToggleLanguage}
              title="Toggle English / हिन्दी"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-border border border-slate-200 dark:border-dark-border transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Emergency Hotline Button */}
            <a
              href="tel:1075"
              title="National Health Helpline"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800/60 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>1075</span>
            </a>

            {/* User Profile & Role Modal */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isOfficerOrAdmin
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-200 dark:hover:bg-dark-border'
              }`}
              title="Security Credentials & Identity"
            >
              <User className="w-3.5 h-3.5" />
              <span className="capitalize">{userSession.role.replace('_', ' ')}</span>
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex xl:hidden items-center space-x-1.5">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenVoice}
              className="p-2 rounded-lg bg-sky-50 dark:bg-neon-cyan/10 text-sky-700 dark:text-neon-cyan border border-sky-200 dark:border-neon-cyan/30"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleLanguage}
              className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-slate-950 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between">
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-teal-600 dark:text-neon-cyan flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Identity &amp; Role Access ({userSession.role})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
