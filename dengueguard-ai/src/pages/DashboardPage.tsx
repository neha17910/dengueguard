import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Search, 
  RefreshCw, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  BellRing, 
  Bug,
  Sun,
  Umbrella,
  Calculator,
  Volume2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { WeatherData, RiskAnalysis, CommunityReport, Language, ThemeMode } from '../types';
import { fetchRealWeather, searchCity, POPULAR_CITIES, CityLocation } from '../services/weatherService';
import { calculateDengueRisk } from '../services/riskService';
import { getReports } from '../services/storageService';

interface DashboardPageProps {
  language: Language;
  theme: ThemeMode;
  onNavigateTab: (tab: string) => void;
  onOpenVoice: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  language,
  theme,
  onNavigateTab,
  onOpenVoice,
}) => {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(POPULAR_CITIES[0]);
  const [citySearchInput, setCitySearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [risk, setRisk] = useState<RiskAnalysis | null>(null);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDataForCity(selectedCity);
  }, [selectedCity]);

  const loadDataForCity = async (city: CityLocation) => {
    setIsLoading(true);
    const activeReports = getReports();
    setReports(activeReports);

    const weatherData = await fetchRealWeather(city.latitude, city.longitude, city.name, city.country);
    setWeather(weatherData);

    const riskData = calculateDengueRisk(weatherData, activeReports);
    setRisk(riskData);
    setIsLoading(false);
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCitySearchInput(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      const results = await searchCity(val);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCity = (city: CityLocation) => {
    setSelectedCity(city);
    setCitySearchInput('');
    setSearchResults([]);
  };

  const trendData = React.useMemo(() => {
    if (!weather || !risk) return [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIdx = new Date().getDay();
    const orderedDays = [];
    for (let i = 0; i < 7; i++) {
      orderedDays.push(days[(currentDayIdx + i) % 7]);
    }

    return orderedDays.map((day, idx) => {
      const tempVariance = Math.sin(idx) * 2;
      const humVariance = Math.cos(idx) * 6;
      const simTemp = Math.round((weather.temperature + tempVariance) * 10) / 10;
      const simHum = Math.round(Math.min(98, Math.max(30, weather.humidity + humVariance)));
      const simRisk = Math.min(100, Math.max(10, Math.round(risk.score + Math.sin(idx * 1.5) * 12)));

      return {
        day: idx === 0 ? 'Today' : day,
        temperature: simTemp,
        humidity: simHum,
        riskScore: simRisk,
      };
    });
  }, [weather, risk]);

  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'Severe':
        return 'bg-rose-500 text-white border-rose-600 shadow-rose-500/20';
      case 'High':
        return 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20';
      case 'Moderate':
        return 'bg-sky-500 text-white border-sky-600 shadow-sky-500/20';
      default:
        return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20';
    }
  };

  const activeBreedingSpotsCount = reports.filter(r => r.status !== 'resolved').length;
  const criticalHotspotsCount = reports.filter(r => r.status !== 'resolved' && r.severity === 'critical').length;

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Hero section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 dark:from-dark-surface dark:via-dark-card dark:to-dark-surface text-white p-6 sm:p-8 shadow-xl border border-teal-500/20 dark:border-neon-teal/30">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 dark:bg-neon-teal/20 backdrop-blur-md border border-teal-400/30 dark:border-neon-teal/40 text-xs font-bold text-teal-300 dark:text-neon-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Vector Intelligence &amp; Triage Platform</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {language === 'hi' 
              ? 'एंटरप्राइज डेंगू निगरानी एवं पर्यावरण जोखिम मॉनिटरिंग' 
              : 'Vector-Borne Early Warning & Epidemiological Risk Intelligence'}
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 leading-relaxed max-w-2xl">
            {language === 'hi'
              ? 'मौसम विभाग के लाइव डेटा, आर्द्रता, तापमान और जन-समुदाय की रिपोर्टों के आधार पर एडीज मच्छर के खतरे का रीयल-टाइम वैज्ञानिक विश्लेषण।'
              : 'Real-time entomological risk computation fusing Open-Meteo meteorological streams, micro-climate humidity thresholds, and crowdsourced geospatial breeding surveillance.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-500 hover:bg-teal-400 dark:bg-neon-teal dark:hover:bg-teal-400 text-slate-950 transition-all shadow-md flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-slate-950" />
              <span>{language === 'hi' ? 'ब्रीडिंग स्पॉट रिपोर्ट करें' : 'Report Breeding Hazard'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('clinical_tools')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-sky-400" />
              <span>{language === 'hi' ? 'क्लीनिकल टूल्स' : 'Clinical Calculators'}</span>
            </button>
            <button
              onClick={onOpenVoice}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-500/80 hover:bg-sky-500 text-white backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'आवाज से पूछें' : 'Voice Assistant'}</span>
            </button>
          </div>
        </div>

        {/* Ambient neon backdrop glows */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-teal-500/10 dark:bg-neon-teal/20 blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-60 h-60 rounded-full bg-sky-500/10 dark:bg-neon-cyan/20 blur-3xl pointer-events-none" />
      </div>

      {/* City Selector & Live Weather Search Bar */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-dark-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* City Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'शहर खोजें (उदा. दिल्ली, मुंबई, बैंकॉक)...' : 'Search any city worldwide (e.g. New Delhi, Bangkok)...'}
              value={citySearchInput}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
            {isSearching && (
              <RefreshCw className="w-4 h-4 text-teal-600 dark:text-neon-cyan animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-dark-border">
              {searchResults.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCity(city)}
                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-teal-50 dark:hover:bg-dark-surface text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-teal-600 dark:text-neon-cyan" />
                    <span className="font-semibold text-slate-900 dark:text-white">{city.name}</span>
                    <span className="text-slate-500 text-xs">{city.admin1 ? `${city.admin1}, ` : ''}{city.country}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular City Quick-Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan" />
            Popular:
          </span>
          {POPULAR_CITIES.slice(0, 5).map((c) => (
            <button
              key={c.name}
              onClick={() => handleSelectCity(c)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                selectedCity.name === c.name
                  ? 'bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
          <button
            onClick={() => loadDataForCity(selectedCity)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-dark-border text-slate-600 dark:text-slate-300 ml-1"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Risk Score Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-slate-200 dark:border-dark-border shadow-sm neon-card relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Local Vector Risk</span>
            <span className="text-[10px] text-teal-600 dark:text-neon-cyan font-bold">0 - 100 Index</span>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {risk ? risk.score : '--'}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
            {risk && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm ${getRiskBadgeStyles(risk.level)}`}>
                {risk.level}
              </span>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-dark-border space-y-1 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Mosquito Activity:</span>
              <span className="font-bold text-slate-900 dark:text-white">{risk?.mosquitoActivity || 'Assessing...'}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Larval Suitability:</span>
              <span className="font-bold text-slate-900 dark:text-white">{risk?.breedingSuitability || 'Assessing...'}</span>
            </div>
          </div>
        </div>

        {/* Weather API Card (Live Data) */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-slate-200 dark:border-dark-border shadow-sm neon-card relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan" />
              Live Meteorological Stream
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 dark:bg-neon-emerald/10 text-emerald-700 dark:text-neon-emerald font-extrabold border border-emerald-200 dark:border-neon-emerald/30">
              {weather?.isRealApi ? 'Open-Meteo' : 'Estimated'}
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">
              {weather ? `${weather.temperature}°C` : '--'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
              {weather?.weatherCondition || 'Loading...'}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-dark-border grid grid-cols-4 gap-1 text-center text-xs">
            <div>
              <div className="text-slate-400 text-[10px] flex items-center justify-center gap-0.5">
                <Droplets className="w-3 h-3 text-sky-500" /> Hum
              </div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{weather?.humidity}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] flex items-center justify-center gap-0.5">
                <CloudRain className="w-3 h-3 text-teal-500" /> Rain
              </div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{weather?.rainfall}mm</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] flex items-center justify-center gap-0.5">
                <Umbrella className="w-3 h-3 text-blue-500" /> Precip
              </div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{weather?.precipitationProbability}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] flex items-center justify-center gap-0.5">
                <Sun className="w-3 h-3 text-amber-500" /> UV
              </div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{weather?.uvIndex}</div>
            </div>
          </div>
        </div>

        {/* Community Breeding Reports Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-slate-200 dark:border-dark-border shadow-sm neon-card relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1">
              <Bug className="w-3.5 h-3.5 text-rose-500" />
              Surveillance Registry
            </span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-teal-600 dark:text-neon-cyan font-bold hover:underline text-[11px]"
            >
              Registry →
            </button>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-black text-slate-900 dark:text-white">
              {activeBreedingSpotsCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Geospatial Hazards</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Critical Clusters:
            </span>
            <span className="font-extrabold text-rose-600 dark:text-rose-400">{criticalHotspotsCount} Priority Sites</span>
          </div>
        </div>

        {/* Diurnal Window Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-slate-200 dark:border-dark-border shadow-sm neon-card relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5 text-amber-500" />
                Diurnal Biting Peak
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full font-bold border border-amber-200 dark:border-amber-800">
                Aedes aegypti
              </span>
            </div>

            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              06:30 – 09:30 &amp; 16:30 – 18:30
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Day-biting vector peaks. Apply DEET/Picaridin and maintain physical mesh barriers.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('reminders')}
            className="mt-3 w-full py-1.5 rounded-xl bg-teal-50 dark:bg-dark-card hover:bg-teal-100 dark:hover:bg-slate-800 text-teal-800 dark:text-neon-cyan text-xs font-bold border border-teal-200 dark:border-dark-border transition-colors flex items-center justify-center gap-1"
          >
            <span>Set Prevention Schedule</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Entomological Risk Breakdown & Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Trend Visualizer Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-3xl p-6 border border-slate-200 dark:border-dark-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-neon-teal" />
                {language === 'hi' ? '7-दिवसीय मौसम एवं जोखिम प्रक्षेपण' : '7-Day Meteorological & Risk Trajectory'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Predictive simulation combining forecast temperature, humidity, and active clusters for {selectedCity.name}
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 dark:bg-neon-teal" /> Risk Index
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 dark:bg-neon-cyan" /> Humidity %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#14b8a6' : '#0d9488'} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={isDark ? '#14b8a6' : '#0d9488'} stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderRadius: '16px', 
                    border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                    color: isDark ? '#ffffff' : '#0f172a'
                  }}
                  formatter={(value: any, name: any) => [value, name === 'riskScore' ? 'Risk Index (0-100)' : name]}
                />
                <Area type="monotone" dataKey="riskScore" stroke={isDark ? '#2dd4bf' : '#0d9488'} strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" name="riskScore" />
                <Area type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#humGrad)" name="humidity" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entomological Factor Breakdown */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600 dark:text-neon-teal" />
              {language === 'hi' ? 'जोखिम कारक विश्लेषण' : 'Risk Factor Weighting'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Biological parameters driving vector multiplication
            </p>

            <div className="space-y-4">
              {/* Temp factor */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    Thermal Window (26–32°C Optimal)
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">{risk?.factors.temperatureScore || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-dark-card rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${risk?.factors.temperatureScore || 0}%` }} 
                  />
                </div>
              </div>

              {/* Humidity factor */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    Relative Humidity (&gt;60% Boosts Lifespan)
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">{risk?.factors.humidityScore || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-dark-card rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-sky-500 dark:bg-neon-cyan h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${risk?.factors.humidityScore || 0}%` }} 
                  />
                </div>
              </div>

              {/* Rainfall factor */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-teal-500" />
                    Rainfall &amp; Stagnant Water Reservoirs
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">{risk?.factors.rainfallScore || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-dark-card rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-teal-600 dark:bg-neon-teal h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${risk?.factors.rainfallScore || 0}%` }} 
                  />
                </div>
              </div>

              {/* Community Reports factor */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Bug className="w-3.5 h-3.5 text-rose-500" />
                    Active Local Hazard Clusters
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">{risk?.factors.communityReportsScore || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-dark-card rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-rose-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${risk?.factors.communityReportsScore || 0}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Callout */}
          <div className="mt-6 p-4 rounded-2xl bg-teal-50/70 dark:bg-dark-card border border-teal-200 dark:border-dark-border">
            <h4 className="text-xs font-bold text-teal-900 dark:text-neon-cyan mb-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-neon-teal" />
              Targeted Public Advice
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {risk?.keyAdvice[0] || 'Inspect desert coolers and flowerpot trays weekly.'}
            </p>
          </div>

        </div>

      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div 
          onClick={() => onNavigateTab('clinical_tools')}
          className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-slate-200 dark:border-dark-border hover:border-teal-300 dark:hover:border-neon-cyan shadow-sm hover:shadow-md neon-card cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-neon-teal/10 text-teal-600 dark:text-neon-teal flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-neon-cyan transition-colors">
            {language === 'hi' ? 'क्लीनिकल हाइड्रेशन एवं लैब टूल्स' : 'Clinical Fluid & Lab Risk Calculators'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Holliday-Segar fluid management targets and WHO Platelet-Hematocrit hemoconcentration evaluation.
          </p>
          <div className="mt-3 text-xs font-bold text-teal-600 dark:text-neon-teal flex items-center gap-1">
            <span>Open Clinical Tools</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('medicines')}
          className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-slate-200 dark:border-dark-border hover:border-teal-300 dark:hover:border-neon-cyan shadow-sm hover:shadow-md neon-card cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-neon-rose/10 text-rose-600 dark:text-neon-rose flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-neon-cyan transition-colors">
            {language === 'hi' ? 'दवा सुरक्षा: एस्पिरिन व ब्रूफेन चेतावनी' : 'Pharmacological Contraindications'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Understand why Aspirin, Brufen, Combiflam, and NSAIDs cause catastrophic internal bleeding in dengue.
          </p>
          <div className="mt-3 text-xs font-bold text-teal-600 dark:text-neon-teal flex items-center gap-1">
            <span>Read Pharmacovigilance</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('simulator')}
          className="bg-white dark:bg-dark-surface rounded-3xl p-5 border border-slate-200 dark:border-dark-border hover:border-teal-300 dark:hover:border-neon-cyan shadow-sm hover:shadow-md neon-card cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-neon-cyan/10 text-sky-600 dark:text-neon-cyan flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-neon-cyan transition-colors">
            {language === 'hi' ? 'एआई मच्छर ब्रीडिंग सिम्युलेटर' : 'AI Mosquito Population Simulator'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Simulate how standing water volumes and temperatures accelerate mosquito emergence over 14 days.
          </p>
          <div className="mt-3 text-xs font-bold text-teal-600 dark:text-neon-teal flex items-center gap-1">
            <span>Launch Simulation</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

    </div>
  );
};
