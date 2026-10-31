import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  ShieldCheck, 
  TrendingUp, 
  RotateCcw, 
  Info, 
  Sparkles,
  Bug,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { SimulationParams, Language, ThemeMode } from '../types';
import { runMosquitoSimulation } from '../services/simulationService';

interface AiSimulatorPageProps {
  language: Language;
  theme: ThemeMode;
}

const DEFAULT_PARAMS: SimulationParams = {
  ambientTemp: 29,
  relativeHumidity: 75,
  standingWaterLiters: 80,
  rainfallFrequencyDays: 3,
  controlInterventions: 20,
};

export const AiSimulatorPage: React.FC<AiSimulatorPageProps> = ({ language, theme }) => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);

  const simulation = useMemo(() => {
    return runMosquitoSimulation(params);
  }, [params]);

  const handlePreset = (presetName: string) => {
    switch (presetName) {
      case 'monsoon':
        setParams({
          ambientTemp: 29,
          relativeHumidity: 88,
          standingWaterLiters: 180,
          rainfallFrequencyDays: 5,
          controlInterventions: 10,
        });
        break;
      case 'community_action':
        setParams({
          ambientTemp: 29,
          relativeHumidity: 65,
          standingWaterLiters: 15,
          rainfallFrequencyDays: 1,
          controlInterventions: 85,
        });
        break;
      case 'winter':
        setParams({
          ambientTemp: 16,
          relativeHumidity: 40,
          standingWaterLiters: 25,
          rainfallFrequencyDays: 0,
          controlInterventions: 30,
        });
        break;
      case 'heatwave':
        setParams({
          ambientTemp: 41,
          relativeHumidity: 28,
          standingWaterLiters: 40,
          rainfallFrequencyDays: 0,
          controlInterventions: 15,
        });
        break;
      default:
        setParams(DEFAULT_PARAMS);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Extreme':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
      case 'High':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      case 'Moderate':
        return 'text-sky-600 dark:text-neon-cyan bg-sky-50 dark:bg-neon-cyan/10 border-sky-200 dark:border-neon-cyan/30';
      default:
        return 'text-emerald-600 dark:text-neon-emerald bg-emerald-50 dark:bg-neon-emerald/10 border-emerald-200 dark:border-neon-emerald/30';
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-neon-teal/10 text-teal-600 dark:text-neon-teal border border-teal-200 dark:border-neon-teal/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'hi' ? 'एआई मच्छर ब्रीडिंग एवं रिस्क सिम्युलेटर' : 'AI Mosquito Population & Transmission Kinetics Simulator'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Biological model exploring the mathematical impact of temperature, precipitation, and vector control
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => handlePreset('default')}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 self-start md:self-auto border border-slate-200 dark:border-dark-border"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Simulator Guidance Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-dark-card border border-amber-200 dark:border-dark-border text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            ENTOMOLOGICAL KINETICS MODEL — SCIENTIFIC CAUSE-AND-EFFECT SIMULATION
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            This simulator models development rates of <em>Aedes aegypti</em> from egg to flying adult under microclimate variables. It demonstrates why source reduction (emptying standing water before Day 7) terminates vector generation.
          </p>
        </div>
      </div>

      {/* Preset Scenarios Buttons */}
      <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan" />
          Preset Scenarios:
        </span>
        <button
          onClick={() => handlePreset('monsoon')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-card hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-dark-border transition-colors"
        >
          🌧️ Monsoon Urban Puddles (High Rain, Stagnant)
        </button>
        <button
          onClick={() => handlePreset('community_action')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-card hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-dark-border transition-colors"
        >
          🛡️ Sunday Dry Day (Scrubbed Coolers + Larvicide)
        </button>
        <button
          onClick={() => handlePreset('winter')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-card hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-dark-border transition-colors"
        >
          ❄️ Cold Winter Dormancy (&lt;18°C)
        </button>
        <button
          onClick={() => handlePreset('heatwave')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-card hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-dark-border transition-colors"
        >
          ☀️ Extreme Summer Heatwave (&gt;40°C)
        </button>
      </div>

      {/* Sliders and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-surface p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm space-y-5">
          <h3 className="font-black text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-dark-border pb-3">
            Environmental &amp; Intervention Variables
          </h3>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-500" />
                Ambient Temperature
              </span>
              <span className="text-teal-600 dark:text-neon-cyan font-bold text-sm">{params.ambientTemp}°C</span>
            </div>
            <input
              type="range"
              min="15"
              max="42"
              step="1"
              value={params.ambientTemp}
              onChange={(e) => setParams({ ...params, ambientTemp: Number(e.target.value) })}
              className="w-full accent-teal-600 dark:accent-neon-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>15°C (Dormant)</span>
              <span>28–31°C (Optimal)</span>
              <span>42°C (Thermal Stress)</span>
            </div>
          </div>

          {/* Humidity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-500" />
                Relative Humidity
              </span>
              <span className="text-teal-600 dark:text-neon-cyan font-bold text-sm">{params.relativeHumidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={params.relativeHumidity}
              onChange={(e) => setParams({ ...params, relativeHumidity: Number(e.target.value) })}
              className="w-full accent-teal-600 dark:accent-neon-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>20% (Dry/Short Lifespan)</span>
              <span>&gt;70% (Extended Longevity)</span>
            </div>
          </div>

          {/* Standing Water Volume */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-teal-600 dark:text-neon-teal" />
                Standing Water Volume (Liters)
              </span>
              <span className="text-teal-600 dark:text-neon-cyan font-bold text-sm">{params.standingWaterLiters} L</span>
            </div>
            <input
              type="range"
              min="2"
              max="400"
              step="5"
              value={params.standingWaterLiters}
              onChange={(e) => setParams({ ...params, standingWaterLiters: Number(e.target.value) })}
              className="w-full accent-teal-600 dark:accent-neon-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2 L (Dries fast)</span>
              <span>150 L (Desert cooler)</span>
              <span>400 L (Tank)</span>
            </div>
          </div>

          {/* Rainfall Frequency */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-500" />
                Rainfall Frequency (Days / Week)
              </span>
              <span className="text-teal-600 dark:text-neon-cyan font-bold text-sm">{params.rainfallFrequencyDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={params.rainfallFrequencyDays}
              onChange={(e) => setParams({ ...params, rainfallFrequencyDays: Number(e.target.value) })}
              className="w-full accent-teal-600 dark:accent-neon-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 Days (Dry)</span>
              <span>3-4 Days (Replenishing)</span>
              <span>7 Days (Heavy Wet)</span>
            </div>
          </div>

          {/* Control Interventions Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-dark-border">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-neon-emerald" />
                Source Reduction &amp; Larvicide Control
              </span>
              <span className="text-emerald-600 dark:text-neon-emerald font-bold text-sm">{params.controlInterventions}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.controlInterventions}
              onChange={(e) => setParams({ ...params, controlInterventions: Number(e.target.value) })}
              className="w-full accent-emerald-600 dark:accent-neon-emerald cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (No control)</span>
              <span>50% (Partial)</span>
              <span>100% (Dry + Temephos)</span>
            </div>
          </div>

        </div>

        {/* Real-time Biological Metrics & Projection Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Egg-to-Adult Speed</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{simulation.eggToAdultDays}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Days</span>
            </div>

            <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Larval Survival</span>
              <span className="text-2xl font-black text-teal-600 dark:text-neon-cyan">{simulation.larvalSurvivalRate}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Viability</span>
            </div>

            <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Vector Density</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{simulation.vectorDensityScore}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">/ 100 Index</span>
            </div>

            <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Transmission Potential</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border inline-block mt-1 ${getRiskColor(simulation.relativeTransmissionRisk)}`}>
                {simulation.relativeTransmissionRisk}
              </span>
            </div>

          </div>

          {/* 14-Day Simulation Dynamic Projection Chart */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="w-5 h-5 text-teal-600 dark:text-neon-teal" />
                  14-Day Vector Population &amp; Transmission Curve
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dynamics of larval concentration, flying adult emergence, and transmission risk
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulation.projection14Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(d) => `Day ${d}`} />
                  <YAxis tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                      borderRadius: '16px', 
                      border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                      color: isDark ? '#ffffff' : '#0f172a'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="larvalCount" stroke="#06b6d4" strokeWidth={2} name="Larval Population" dot={false} />
                  <Line type="monotone" dataKey="adultMosquitoes" stroke="#f43f5e" strokeWidth={2.5} name="Flying Adult Vectors" dot={false} />
                  <Line type="monotone" dataKey="riskIndex" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" name="Risk Index (0-100)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p>
                <strong>Scientific takeaway:</strong> Notice how adult mosquitoes emerge sharply after Day {simulation.eggToAdultDays}. Emptying or scrubbing water containers before Day 7 completely prevents adult emergence and breaks the viral transmission cycle!
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
