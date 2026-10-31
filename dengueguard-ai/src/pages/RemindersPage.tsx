import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Volume2, 
  Sparkles, 
  Check, 
  X,
  Droplets,
  Flower2,
  ShieldCheck,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReminderItem, Language } from '../types';
import { getReminders, saveReminder, toggleReminder, deleteReminder, markReminderDone } from '../services/storageService';

interface RemindersPageProps {
  language: Language;
}

export const RemindersPage: React.FC<RemindersPageProps> = ({ language }) => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testChimePlaying, setTestChimePlaying] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReminderItem['category']>('water_cooler');
  const [frequency, setFrequency] = useState<ReminderItem['frequency']>('weekly');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [dayOfWeek, setDayOfWeek] = useState(0);

  useEffect(() => {
    setReminders(getReminders());
  }, []);

  const handleToggle = (id: string) => {
    const updated = toggleReminder(id);
    setReminders(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteReminder(id);
    setReminders(updated);
  };

  const handleMarkDone = (id: string) => {
    const updated = markReminderDone(id);
    setReminders(updated);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#14b8a6', '#06b6d4', '#10b981', '#f59e0b']
    });
  };

  const playChimeSound = () => {
    try {
      setTestChimePlaying(true);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + start);
        osc.stop(audioCtx.currentTime + start + duration);
      };

      playTone(659.25, 0.0, 0.4);
      playTone(830.61, 0.2, 0.4);
      playTone(987.77, 0.4, 0.7);

      setTimeout(() => {
        setTestChimePlaying(false);
      }, 1000);
    } catch (e) {
      setTestChimePlaying(false);
    }
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updated = saveReminder({
      title: title.trim(),
      category,
      frequency,
      scheduledTime,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      enabled: true,
    });

    setReminders(updated);
    setIsModalOpen(false);
    setTitle('');
  };

  const daysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getCategoryIcon = (cat: ReminderItem['category']) => {
    switch (cat) {
      case 'water_cooler':
        return Droplets;
      case 'flower_pots':
        return Flower2;
      case 'repellent':
        return ShieldCheck;
      default:
        return Bell;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'डेंगू रोकथाम एवं सफाई रिमाइंडर अनुसूची' : 'Vector Prophylaxis & Sanitation Routine'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'कूलर, गमले और पानी के स्रोतों की नियमित साप्ताहिक सफाई के लिए समय सारणी प्रबंधित करें।'
              : 'Enforce domestic source reduction protocols, diurnal bite alerts, and weekly desiccation routines.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={playChimeSound}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              testChimePlaying
                ? 'bg-teal-600 text-white border-teal-700 dark:bg-neon-teal dark:text-dark-bg'
                : 'bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-200 dark:border-dark-border'
            }`}
            title="Test alert tone"
          >
            <Volume2 className={`w-4 h-4 ${testChimePlaying ? 'animate-bounce' : ''}`} />
            <span>Test Chime</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:hover:bg-teal-400 text-white dark:text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-teal-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया शेड्यूल जोड़ें' : 'Create Routine'}</span>
          </button>
        </div>
      </div>

      {/* Routine Quick Recommendation Card */}
      <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-dark-card border border-teal-200 dark:border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-teal-900 dark:text-neon-cyan text-sm">
              {language === 'hi' ? 'राष्ट्रीय "रविवार शुष्क दिवस" (Sunday Dry Day) नियम' : 'National "Sunday Dry Day" Vector Eradication Rule'}
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Scrub container walls with a brush to destroy desiccation-resistant Aedes eggs before refilling with fresh water.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-teal-800 dark:text-neon-teal bg-teal-100 dark:bg-neon-teal/10 px-3 py-1 rounded-full shrink-0 border border-teal-200 dark:border-neon-teal/30">
          NCVBDC Protocol
        </span>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((item) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all bg-white dark:bg-dark-surface shadow-sm neon-card flex flex-col justify-between ${
                item.enabled ? 'border-slate-200 dark:border-dark-border' : 'border-slate-200 dark:border-dark-border opacity-50 bg-slate-50 dark:bg-dark-card'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-neon-teal/10 text-teal-600 dark:text-neon-teal border border-teal-100 dark:border-neon-teal/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="capitalize">{item.frequency}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <Clock className="w-3 h-3" />
                          {item.scheduledTime}
                        </span>
                        {item.dayOfWeek !== undefined && (
                          <>
                            <span>•</span>
                            <span>{daysNames[item.dayOfWeek]}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      item.enabled ? 'bg-teal-600 dark:bg-neon-teal justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                    title={item.enabled ? 'Active - click to pause' : 'Paused - click to activate'}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {item.lastDone && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed: {item.lastDone}
                    </div>
                  )}

                  {item.completionStreak > 0 && (
                    <div className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span>{item.completionStreak} Streak</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between">
                <button
                  onClick={() => handleMarkDone(item.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-dark-card text-teal-800 dark:text-neon-cyan hover:bg-teal-100 dark:hover:bg-slate-800 border border-teal-200 dark:border-dark-border transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify Completed Today</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-dark-border">
            
            <div className="bg-slate-50 dark:bg-dark-card px-6 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-teal-100 dark:bg-neon-teal/20 text-teal-700 dark:text-neon-teal">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Schedule Prevention Action</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Routine Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect balcony flowerpot trays"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="water_cooler">Evaporative Desert Cooler</option>
                  <option value="flower_pots">Plant Saucers &amp; AC Trays</option>
                  <option value="repellent">Diurnal Repellent Application</option>
                  <option value="cleanup">Terrace &amp; Garden Container Inspection</option>
                  <option value="custom">Custom Vector Sanitation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {frequency === 'weekly' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Day of the Week
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {daysNames.map((d, idx) => (
                      <option key={idx} value={idx}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-dark-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-dark-card"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:text-slate-950 shadow-md shadow-teal-600/30"
                >
                  Save Routine
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
