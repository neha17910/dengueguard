import React, { useState } from 'react';
import { 
  Pill, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Droplet, 
  Sparkles,
  Info
} from 'lucide-react';
import { MEDICINE_GUIDELINES } from '../services/medicineData';
import { Language } from '../types';

interface MedicineInfoPageProps {
  language: Language;
}

export const MedicineInfoPage: React.FC<MedicineInfoPageProps> = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredMedicines = MEDICINE_GUIDELINES.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterCategory === 'forbidden') return med.safetyLevel === 'danger_bleed';
    if (filterCategory === 'safe') return med.safetyLevel === 'safe_fever';
    if (filterCategory === 'supportive') return med.safetyLevel === 'supportive';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-neon-rose/10 text-rose-600 dark:text-neon-rose border border-rose-200 dark:border-neon-rose/30">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'hi' ? 'डेंगू में दवाओं का सुरक्षा एवं फार्माकोविजिलेंस गाइड' : 'Pharmacological Safety & Fluid Replacement Protocol'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Critical guidance on safe antipyretic administration, strict NSAID contraindications, and electrolyte therapy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* High-Impact Danger Banner for NSAIDs */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-red-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-rose-600/40">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-black text-rose-100 border border-white/20">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>CRITICAL PHARMACOLOGICAL CONTRAINDICATION</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {language === 'hi'
              ? 'एस्पिरिन, आइबुप्रोफेन और कॉम्बिफ्लेम कतई न लें!'
              : 'STRICTLY FORBIDDEN: Aspirin, Ibuprofen, Diclofenac & All NSAIDs!'}
          </h2>

          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            {language === 'hi'
              ? 'डेंगू वायरस प्लेटलेट्स को नष्ट करता है। एस्पिरिन (Disprin) और आइबुप्रोफेन (Brufen/Combiflam) खून को और पतला करते हैं तथा पेट की अंदरूनी परत को नुकसान पहुंचाते हैं, जिससे जानलेवा अंदरूनी रक्तस्राव और शॉक हो सकता है। केवल डॉक्टर की सलाह से पैरासिटामोल ही लें।'
              : 'Dengue impairs bone marrow megakaryocytes, producing severe thrombocytopenia. Non-Steroidal Anti-Inflammatory Drugs (NSAIDs) irreversibly inhibit platelet aggregation through COX-1/COX-2 suppression and induce gastric mucosal erosions, dramatically multiplying fatal internal gastrointestinal hemorrhage risk.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/20">❌ Aspirin / Disprin</span>
            <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/20">❌ Ibuprofen / Brufen</span>
            <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/20">❌ Combiflam</span>
            <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/20">❌ Diclofenac / Voveran</span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/80 border border-emerald-400"> Paracetamol (Safe antipyretic)</span>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-black/20 blur-3xl pointer-events-none" />
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine (e.g. Crocin, Brufen, ORS)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              filterCategory === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Guidance
          </button>
          <button
            onClick={() => setFilterCategory('forbidden')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              filterCategory === 'forbidden'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            ❌ Strictly Forbidden (NSAIDs)
          </button>
          <button
            onClick={() => setFilterCategory('safe')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              filterCategory === 'safe'
                ? 'bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg font-bold'
                : 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-neon-teal hover:bg-teal-100'
            }`}
          >
             Safe Under Guidance
          </button>
          <button
            onClick={() => setFilterCategory('supportive')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              filterCategory === 'supportive'
                ? 'bg-sky-600 text-white font-bold'
                : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-neon-cyan hover:bg-sky-100'
            }`}
          >
            💧 Supportive Hydration
          </button>
        </div>
      </div>

      {/* Medicine Guidance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMedicines.map((med, idx) => {
          const isDanger = med.safetyLevel === 'danger_bleed';
          const isSupportive = med.safetyLevel === 'supportive';

          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-sm neon-card ${
                isDanger
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : isSupportive
                  ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/60'
                  : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{med.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Generic: {med.genericName}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${
                    isDanger
                      ? 'bg-rose-600 text-white border-rose-700'
                      : isSupportive
                      ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                      : 'bg-teal-100 dark:bg-neon-teal/20 text-teal-800 dark:text-neon-teal border-teal-300 dark:border-neon-teal/40'
                  }`}>
                    {med.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {language === 'hi' ? med.descriptionHi : med.descriptionEn}
                </p>

                <div className="mt-3.5 p-3.5 rounded-2xl bg-white/90 dark:bg-dark-card border border-slate-200 dark:border-dark-border text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {isDanger ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-neon-rose shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-neon-teal shrink-0" />
                    )}
                    <span>{isDanger ? 'Clinical Contraindication Mechanism:' : 'Therapeutic Role & Limits:'}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    {language === 'hi' ? med.whyDangerousOrHelpfulHi : med.whyDangerousOrHelpfulEn}
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-dark-border flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 italic">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{med.medicalDisclaimer}</span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Myths vs Scientific Reality Section */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-dark-border shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            {language === 'hi' ? 'घरेलू नुस्खे: वैज्ञानिक दृष्टिकोण बनाम जन-धारणाएं' : 'Home Interventions: Pharmacological Evidence vs. Public Beliefs'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-dark-card border border-amber-200 dark:border-amber-900/50 space-y-2">
            <h4 className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <span>Papaya Leaf Extract (Carica papaya)</span>
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Biomedical Evidence:</strong> Small clinical trials suggest mild membrane-stabilizing effects on platelets through enzymes (chymopapain, carpaine). However, it is <strong>NOT a clinical cure</strong> and cannot arrest capillary plasma leakage in severe dengue.
            </p>
            <p className="text-amber-900 dark:text-amber-300 font-semibold">
              ⚠️ High doses provoke severe gastritis, nausea, and vomiting in acute febrile patients.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-dark-card border border-sky-200 dark:border-sky-900/50 space-y-2">
            <h4 className="font-bold text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
              <span>Goat Milk &amp; Kiwi Fruit</span>
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Biomedical Evidence:</strong> There is <strong>no scientific validation</strong> that goat milk or kiwi fruit directly destroys the dengue virus or stimulates megakaryocytes. Kiwi supplies Vitamin C and water, while raw goat milk presents severe risk of bacterial infections (Brucellosis).
            </p>
            <p className="text-sky-900 dark:text-sky-300 font-semibold">
              💡 Proven Gold Standard: WHO-formula Oral Rehydration Solution (ORS) is the proven life-saving fluid.
            </p>
          </div>

        </div>
      </div>

      {/* How to Prepare ORS guide */}
      <div className="bg-teal-50 dark:bg-dark-card rounded-3xl p-5 border border-teal-200 dark:border-neon-teal/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-teal-900 dark:text-neon-cyan text-sm flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-teal-700 dark:text-neon-teal" />
            Standard WHO Oral Rehydration Solution (ORS) Preparation
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Dissolve one standard ORS sachet into exactly 1 Liter of clean drinking water. Sip continuously throughout the day. Do not boil after mixing; discard unused solution after 24 hours.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg font-black text-xs shrink-0 shadow-sm">
          Fluid Protocol
        </span>
      </div>

    </div>
  );
};
