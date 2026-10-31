import React, { useState } from 'react';
import { 
  Calculator, 
  Droplets, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Language } from '../types';
import { calculateHydrationPlan, evaluatePlateletHematocrit } from '../services/clinicalToolsService';

interface ClinicalToolsPageProps {
  language: Language;
}

export const ClinicalToolsPage: React.FC<ClinicalToolsPageProps> = ({ language }) => {
  // Hydration Calculator State
  const [weightKg, setWeightKg] = useState<number>(65);
  const [phase, setPhase] = useState<'febrile' | 'critical' | 'recovery'>('febrile');

  // Platelet & Hematocrit Analyzer State
  const [plateletCount, setPlateletCount] = useState<number>(85000);
  const [currentHct, setCurrentHct] = useState<number>(44);
  const [baselineHct, setBaselineHct] = useState<number>(38);

  const hydration = calculateHydrationPlan(weightKg, phase);
  const labAnalysis = evaluatePlateletHematocrit(plateletCount, currentHct, baselineHct);

  const getTriageBadge = (category: string) => {
    switch (category) {
      case 'critical_emergency':
        return 'bg-rose-500 text-white dark:bg-rose-600 shadow-rose-500/20';
      case 'high_plasma_leakage':
        return 'bg-amber-500 text-white dark:bg-amber-600 shadow-amber-500/20';
      case 'moderate_risk':
        return 'bg-sky-500 text-white dark:bg-sky-600 shadow-sky-500/20';
      case 'mild_thrombocytopenia':
        return 'bg-teal-500 text-white dark:bg-teal-600 shadow-teal-500/20';
      default:
        return 'bg-emerald-500 text-white dark:bg-emerald-600 shadow-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-neon-teal/10 text-teal-600 dark:text-neon-teal border border-teal-200 dark:border-neon-teal/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'hi' ? 'क्लीनिकल ट्राइएज एवं हाइड्रेशन कैलकुलेटर' : 'Clinical Triage & Physiological Calculators'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Scientific algorithms adhering to WHO Dengue Guidelines and Holliday-Segar fluid management protocols
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-neon-teal/10 text-teal-700 dark:text-neon-teal border border-teal-200 dark:border-neon-teal/30">
            WHO Guidelines Compliant
          </span>
        </div>
      </div>

      {/* Grid: 2 Clinical Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TOOL 1: Hydration Calculator */}
        <div className="bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-neon-cyan/10 text-sky-600 dark:text-neon-cyan">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'hi' ? 'दैनिक तरल पदार्थ (ORS) कैलकुलेटर' : '24-Hour Maintenance Fluid Calculator'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Calculates oral fluid replacement target to prevent hemoconcentration
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Weight Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Patient Weight (kg):</span>
                <span className="text-teal-600 dark:text-neon-cyan font-bold text-sm">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-teal-600 dark:accent-neon-cyan cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10 kg (Pediatric)</span>
                <span>60 kg (Adult Average)</span>
                <span>120 kg</span>
              </div>
            </div>

            {/* Clinical Phase Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Current Dengue Phase
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPhase('febrile')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    phase === 'febrile'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-border'
                  }`}
                >
                  <div>Febrile Phase</div>
                  <div className="text-[10px] font-normal opacity-90">Days 1–3</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPhase('critical')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    phase === 'critical'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-border'
                  }`}
                >
                  <div>Critical Phase</div>
                  <div className="text-[10px] font-normal opacity-90">Days 4–6</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPhase('recovery')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    phase === 'recovery'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-border'
                  }`}
                >
                  <div>Recovery</div>
                  <div className="text-[10px] font-normal opacity-90">Day 7+</div>
                </button>
              </div>
            </div>

            {/* Output Calculation Cards */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">24h Target</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">{hydration.totalDailyMl}</span>
                <span className="text-[10px] text-slate-500 block">mL / day</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-neon-teal/10 border border-teal-200 dark:border-neon-teal/30 text-center">
                <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-neon-teal block mb-0.5">Hourly Rate</span>
                <span className="text-xl font-black text-teal-900 dark:text-neon-cyan">{hydration.ratePerHourMl}</span>
                <span className="text-[10px] text-teal-700 dark:text-neon-teal block">mL / hour</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-neon-cyan/10 border border-sky-200 dark:border-neon-cyan/30 text-center">
                <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-neon-cyan block mb-0.5">WHO ORS</span>
                <span className="text-xl font-black text-sky-900 dark:text-white">{hydration.orsPacketsPerDay}</span>
                <span className="text-[10px] text-sky-700 dark:text-neon-cyan block">1L Sachets</span>
              </div>
            </div>
          </div>

          {/* Guidelines Callout */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan" />
              <span>Fluid Administration Rules:</span>
            </div>
            {hydration.warningSigns.map((w, idx) => (
              <p key={idx} className="text-[11px] leading-relaxed flex items-start gap-1">
                <span className="text-teal-600 dark:text-neon-teal">•</span>
                <span>{w}</span>
              </p>
            ))}
          </div>
        </div>

        {/* TOOL 2: Platelet & Hematocrit Analyzer */}
        <div className="bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-neon-rose/10 text-rose-600 dark:text-neon-rose">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'hi' ? 'प्लेटलेट एवं हेमाटोक्रिट (प्लाज्मा लीकेज) विश्लेषक' : 'Platelet & Hematocrit Leakage Analyzer'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Evaluates hemoconcentration and severe dengue thrombocytopenia
                  </p>
                </div>
              </div>
            </div>

            {/* Input Row: Platelets, Hct, Baseline Hct */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Platelets (/μL)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="5000"
                  max="500000"
                  value={plateletCount}
                  onChange={(e) => setPlateletCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
                <span className="text-[10px] text-slate-400">Normal: 150k-450k</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current HCT (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="20"
                  max="65"
                  value={currentHct}
                  onChange={(e) => setCurrentHct(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
                <span className="text-[10px] text-slate-400">Hematocrit value</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Baseline HCT (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="20"
                  max="55"
                  value={baselineHct}
                  onChange={(e) => setBaselineHct(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
                <span className="text-[10px] text-slate-400">Prior or expected</span>
              </div>

            </div>

            {/* Hemoconcentration calculation card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Hemoconcentration Index</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {labAnalysis.hemoconcentrationPct > 0 ? `+${labAnalysis.hemoconcentrationPct}%` : `${labAnalysis.hemoconcentrationPct}%`}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  (Rise above baseline: $\ge 20\%$ marks plasma leakage)
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Triage Severity</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getTriageBadge(labAnalysis.riskCategory)}`}>
                  {labAnalysis.riskCategory.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

          </div>

          {/* Clinical Advice Box */}
          <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-dark-card border border-teal-200 dark:border-dark-border space-y-2">
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-neon-cyan" />
              <span>Recommended Medical Protocol:</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {labAnalysis.clinicalAdvice}
            </p>

            {labAnalysis.riskCategory === 'critical_emergency' && (
              <div className="pt-2 flex gap-2">
                <a
                  href="tel:108"
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-rose-700 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Emergency Ambulance (108)</span>
                </a>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
