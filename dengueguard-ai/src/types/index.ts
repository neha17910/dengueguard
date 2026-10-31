export type Language = 'en' | 'hi';
export type ThemeMode = 'dark' | 'light';

export interface WeatherData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number; // Celsius
  humidity: number; // %
  rainfall: number; // mm
  windSpeed: number; // km/h
  precipitationProbability: number; // %
  uvIndex: number;
  dewPoint: number;
  weatherCondition: string;
  weatherCode: number;
  lastUpdated: string;
  isRealApi: boolean;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface RiskAnalysis {
  score: number; // 0 - 100
  level: RiskLevel;
  mosquitoActivity: 'Low' | 'Moderate' | 'High' | 'Extremely Active';
  breedingSuitability: 'Unfavorable' | 'Mild' | 'Favorable' | 'Critical';
  factors: {
    temperatureScore: number; // optimal for Aedes is 26-32°C
    humidityScore: number; // optimal is > 60%
    rainfallScore: number; // standing water potential
    communityReportsScore: number; // active local reports
  };
  keyAdvice: string[];
  lastCalculated: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  language: Language;
  timestamp: string;
  sources?: string[];
  isWarning?: boolean;
  suggestedPrompts?: string[];
  triageLevel?: 'safe' | 'observation' | 'urgent' | 'emergency';
}

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'pending' | 'investigating' | 'verified' | 'resolved';

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  locationName: string;
  latitude: number;
  longitude: number;
  severity: ReportSeverity;
  status: ReportStatus;
  imageUrl?: string;
  reporterName: string;
  createdAt: string;
  upvotes: number;
  adminNotes?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: 'water_cooler' | 'flower_pots' | 'repellent' | 'water_storage' | 'cleanup' | 'custom';
  frequency: 'daily' | 'weekly' | 'biweekly';
  scheduledTime: string; // HH:mm
  dayOfWeek?: number; // 0 for Sunday, 6 for Saturday
  enabled: boolean;
  lastDone?: string;
  completionStreak: number;
}

export interface MedicineGuidance {
  name: string;
  genericName: string;
  category: 'Recommended Antipyretic' | 'STRICTLY CONTRAINDICATED (DANGEROUS)' | 'Supportive Hydration';
  safetyLevel: 'safe_fever' | 'danger_bleed' | 'supportive';
  descriptionEn: string;
  descriptionHi: string;
  whyDangerousOrHelpfulEn: string;
  whyDangerousOrHelpfulHi: string;
  mechanismEn: string;
  medicalDisclaimer: string;
}

export interface SimulationParams {
  ambientTemp: number; // 15 to 42 °C
  relativeHumidity: number; // 20 to 100 %
  standingWaterLiters: number; // 0 to 500 liters
  rainfallFrequencyDays: number; // 0 to 7 days/week
  controlInterventions: number; // 0% (none) to 100% (heavy larvicide/fogging)
}

export interface SimulationResult {
  eggToAdultDays: number;
  larvalSurvivalRate: number; // %
  dailyBiteRateEstimate: number;
  vectorDensityScore: number; // 0 to 100
  relativeTransmissionRisk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  projection14Days: {
    day: number;
    larvalCount: number;
    adultMosquitoes: number;
    riskIndex: number;
  }[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'health_officer' | 'admin';
  badgeNumber?: string;
  department?: string;
  savedCity: string;
  preferredLanguage: Language;
  theme: ThemeMode;
  upvotedReportIds: string[];
}

export interface HydrationCalculation {
  weightKg: number;
  phase: 'febrile' | 'critical' | 'recovery';
  totalDailyMl: number;
  ratePerHourMl: number;
  orsPacketsPerDay: number;
  warningSigns: string[];
}

export interface PlateletHematocritAnalysis {
  plateletCount: number;
  hematocritPct: number;
  baselineHematocritPct: number;
  hemoconcentrationPct: number;
  riskCategory: 'normal' | 'mild_thrombocytopenia' | 'moderate_risk' | 'high_plasma_leakage' | 'critical_emergency';
  clinicalAdvice: string;
}
