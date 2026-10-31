import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, ExternalLink, X, Activity, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface DisclaimerBannerProps {
  language: Language;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ language }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-teal-900/90 via-slate-900/95 to-sky-950/90 dark:from-dark-surface dark:via-dark-card dark:to-dark-surface border-b border-teal-500/20 dark:border-neon-teal/20 px-4 py-2 text-xs text-slate-200 transition-all backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="p-1 rounded-full bg-teal-500/20 text-teal-400 dark:text-neon-teal shrink-0">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="truncate text-xs">
            <span className="font-bold text-teal-300 dark:text-neon-cyan mr-1.5">
              {language === 'hi' ? 'चिकित्सीय निगरानी अलर्ट:' : 'Active Surveillance Advisory:'}
            </span>
            <span className="text-slate-300 dark:text-slate-300">
              {language === 'hi'
                ? 'यदि तेज बुखार के साथ लगातार उल्टी या पेट दर्द हो, तो बिना समय गंवाए नजदीकी आपातकालीन अस्पताल जाएं।'
                : 'Diurnal vector activity elevated. Never take Aspirin or Ibuprofen for suspected dengue fever. Seek physician triage for persistent symptoms.'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="tel:1075"
            className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-rose-400" />
            <span>Emergency 1075</span>
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
            title="Dismiss advisory"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
