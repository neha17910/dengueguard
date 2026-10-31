import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  CheckCircle2, 
  X,
  PhoneCall
} from 'lucide-react';
import { 
  SYMPTOM_PHASES, 
  FAQS_LIST, 
  EDUCATIONAL_ARTICLES, 
  EducationalArticle 
} from '../services/awarenessData';
import { Language } from '../types';

interface AwarenessCenterPageProps {
  language: Language;
}

export const AwarenessCenterPage: React.FC<AwarenessCenterPageProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'warning_signs' | 'faqs' | 'articles'>('timeline');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);

  const [checkedWarnings, setCheckedWarnings] = useState<{ [key: string]: boolean }>({
    'abdominal_pain': false,
    'persistent_vomiting': false,
    'mucosal_bleeding': false,
    'lethargy_confusion': false,
    'difficulty_breathing': false,
  });

  const warningChecklistItems = [
    { id: 'abdominal_pain', labelEn: 'Severe, continuous abdominal pain or tenderness', labelHi: 'पेट में लगातार और असहनीय दर्द या छूने पर दर्द' },
    { id: 'persistent_vomiting', labelEn: 'Persistent vomiting (inability to keep liquids down, ≥3 times/day)', labelHi: 'लगातार उल्टियां होना (पानी या दवा न पचना, दिन में 3 से अधिक बार)' },
    { id: 'mucosal_bleeding', labelEn: 'Bleeding from nose, gums, in vomit, or dark black stools', labelHi: 'नाक या मसूड़ों से खून आना, उल्टी में खून या काला मल' },
    { id: 'lethargy_confusion', labelEn: 'Extreme lethargy, restlessness, or sudden dizziness upon standing', labelHi: 'अत्यधिक सुस्ती, बेचैनी, या खड़े होने पर चक्कर आना' },
    { id: 'difficulty_breathing', labelEn: 'Difficulty breathing or rapid breathing (pleural effusion sign)', labelHi: 'सांस लेने में तकलीफ या तेज-तेज सांस चलना (फेफड़ों में पानी जमा होने का संकेत)' },
  ];

  const checkedCount = Object.values(checkedWarnings).filter(Boolean).length;

  const toggleWarning = (id: string) => {
    setCheckedWarnings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = FAQS_LIST.filter(f => 
    f.questionEn.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.answerEn.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.questionHi.includes(faqSearch)
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-neon-teal/10 text-teal-600 dark:text-neon-teal border border-teal-200 dark:border-neon-teal/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'hi' ? 'डेंगू क्लीनिकल ज्ञान एवं ट्राइएज केंद्र' : 'Clinical Staging & Triage Knowledge Hub'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Pathophysiological staging, red flag symptom triage, and medical literature
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-dark-card p-1.5 rounded-2xl overflow-x-auto text-xs shrink-0 border border-slate-200 dark:border-dark-border">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'timeline'
                ? 'bg-white dark:bg-dark-surface text-teal-800 dark:text-neon-cyan shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'लक्षण टाइमलाइन' : 'Symptom Timeline'}
          </button>
          <button
            onClick={() => setActiveTab('warning_signs')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'warning_signs'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            {language === 'hi' ? '🚨 खतरे के संकेत' : '🚨 Warning Red Flags'}
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'articles'
                ? 'bg-white dark:bg-dark-surface text-teal-800 dark:text-neon-cyan shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'चिकित्सीय आलेख' : 'Clinical Articles'}
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeTab === 'faqs'
                ? 'bg-white dark:bg-dark-surface text-teal-800 dark:text-neon-cyan shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'FAQs'}
          </button>
        </div>
      </div>

      {/* TAB 1: 3-Phase Symptom Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-dark-card border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Clinical Defervescence Rule:</strong> The highest risk window occurs during the <strong>Critical Phase (Days 4–6)</strong> immediately as body temperature normalizes, when capillary permeability and plasma leakage peak.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SYMPTOM_PHASES.map((phase, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-dark-surface rounded-3xl p-6 border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between hover:shadow-md neon-card transition-shadow relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${phase.badgeColor}`}>
                      {phase.days}
                    </span>
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500">Stage 0{idx + 1}</span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 dark:text-white mb-2">
                    {phase.phase}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    {language === 'hi' ? phase.summaryHi : phase.summaryEn}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                        Core Symptoms:
                      </h4>
                      <ul className="space-y-1">
                        {phase.symptoms.map((s, sIdx) => (
                          <li key={sIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                            <span className="text-teal-600 dark:text-neon-cyan font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-dark-border">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                        Clinical Care Protocol:
                      </h4>
                      <ul className="space-y-1">
                        {phase.careActions.map((c, cIdx) => (
                          <li key={cIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-neon-teal shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {phase.warningNote && (
                  <div className="mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-[11px] font-bold">
                    🚨 {phase.warningNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Red Flag Warning Signs Checklist */}
      {activeTab === 'warning_signs' && (
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-dark-border shadow-sm space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-black border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Dengue Triage Red Flags Checklist</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'hi'
                ? 'आपातकालीन खतरे के लक्षण चेकर'
                : 'Emergency Dengue Red Flags Self-Assessment'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Select any symptoms the patient is experiencing. Checking ANY of these indicates potential acute plasma leakage requiring emergency hospitalization.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl">
            {warningChecklistItems.map((item) => {
              const isChecked = Boolean(checkedWarnings[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleWarning(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-sm'
                      : 'bg-slate-50 dark:bg-dark-card border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isChecked ? 'bg-rose-600 border-rose-700 text-white' : 'border-slate-300 dark:border-dark-border bg-white dark:bg-dark-surface'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold ${isChecked ? 'text-rose-950 dark:text-rose-200 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                      {language === 'hi' ? item.labelHi : item.labelEn}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isChecked ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100' : 'text-slate-400'
                  }`}>
                    {isChecked ? 'FLAGGED' : 'Tap'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={`p-6 rounded-3xl border transition-all max-w-2xl ${
            checkedCount > 0
              ? 'bg-rose-600 dark:bg-rose-700 text-white border-rose-700 shadow-xl shadow-rose-600/20'
              : 'bg-teal-50 dark:bg-dark-card border-teal-200 dark:border-dark-border text-teal-900 dark:text-slate-100'
          }`}>
            <div className="flex items-start space-x-3">
              {checkedCount > 0 ? (
                <AlertTriangle className="w-8 h-8 text-amber-300 shrink-0" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-teal-600 dark:text-neon-cyan shrink-0" />
              )}
              <div className="space-y-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {checkedCount > 0
                    ? `🚨 ${checkedCount} CRITICAL RED FLAG(S) DETECTED - SEEK EMERGENCY CARE`
                    : ' No Severe Red Flags Selected'}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${checkedCount > 0 ? 'text-rose-100' : 'text-slate-600 dark:text-slate-300'}`}>
                  {checkedCount > 0
                    ? 'Do not delay. Plasma leakage or internal hemorrhage can progress to Dengue Shock Syndrome within hours. Proceed immediately to an emergency hospital with ICU facilities.'
                    : 'Maintain regular oral hydration with WHO ORS, strict bed rest, and paracetamol for fever. Re-evaluate every 12 hours.'}
                </p>

                {checkedCount > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href="tel:108"
                      className="px-4 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs shadow-md hover:bg-rose-50"
                    >
                      Call Ambulance (108 / 102)
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Clinical Articles */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EDUCATIONAL_ARTICLES.map((art) => (
            <div
              key={art.id}
              className="bg-white dark:bg-dark-surface rounded-3xl p-6 border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-md neon-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-teal-700 dark:text-neon-teal bg-teal-50 dark:bg-neon-teal/10 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-neon-teal/30">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="font-black text-base text-slate-900 dark:text-white mb-2">
                  {language === 'hi' ? art.titleHi : art.titleEn}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {language === 'hi' ? art.summaryHi : art.summaryEn}
                </p>
              </div>

              <button
                onClick={() => setSelectedArticle(art)}
                className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border text-xs font-bold text-teal-600 dark:text-neon-cyan hover:underline flex items-center justify-between"
              >
                <span>Read Full Literature</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Frequently Asked Questions */}
      {activeTab === 'faqs' && (
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-dark-border shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-base text-slate-900 dark:text-white">
                {language === 'hi' ? 'डेंगू से जुड़े आम सवाल व जवाब' : 'Frequently Asked Clinical & Vector Inquiries'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified against WHO and NCVBDC guidelines</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-50/70 dark:bg-dark-card hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3"
                  >
                    <span>{language === 'hi' ? faq.questionHi : faq.questionEn}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-teal-600 dark:text-neon-cyan shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-surface leading-relaxed border-t border-slate-100 dark:border-dark-border">
                      {language === 'hi' ? faq.answerHi : faq.answerEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-dark-border flex flex-col max-h-[85vh]">
            <div className="bg-slate-50 dark:bg-dark-card px-6 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-700 dark:text-neon-teal bg-teal-50 dark:bg-neon-teal/10 px-2 py-0.5 rounded-full border border-teal-200 dark:border-neon-teal/30">
                  {selectedArticle.category}
                </span>
                <h3 className="font-black text-slate-900 dark:text-white text-base mt-1">
                  {language === 'hi' ? selectedArticle.titleHi : selectedArticle.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {language === 'hi' ? selectedArticle.contentHi : selectedArticle.contentEn}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-dark-card border-t border-slate-200 dark:border-dark-border flex items-center justify-between text-xs text-slate-500">
              <span>Reviewed by DengueGuard Clinical Advisory Board</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:text-dark-bg text-white font-bold"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
