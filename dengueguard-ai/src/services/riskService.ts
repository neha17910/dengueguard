import { RiskAnalysis, RiskLevel, WeatherData, CommunityReport } from '../types';

export const calculateDengueRisk = (
  weather: WeatherData,
  activeReports: CommunityReport[]
): RiskAnalysis => {
  const { temperature, humidity, rainfall } = weather;

  // 1. Temperature Score (Optimal vector breeding & viral replication: 26°C - 32°C)
  let tempScore = 20;
  if (temperature >= 26 && temperature <= 32) {
    tempScore = 95 - Math.abs(temperature - 29) * 5;
  } else if (temperature >= 22 && temperature < 26) {
    tempScore = 60 + (temperature - 22) * 8;
  } else if (temperature > 32 && temperature <= 38) {
    tempScore = 80 - (temperature - 32) * 10;
  } else if (temperature < 18 || temperature > 40) {
    tempScore = 15;
  }

  // 2. Humidity Score (Aedes longevity increases when relative humidity > 60%)
  let humidityScore = 20;
  if (humidity >= 75) {
    humidityScore = 95;
  } else if (humidity >= 60) {
    humidityScore = 70 + (humidity - 60) * 1.6;
  } else if (humidity >= 45) {
    humidityScore = 40 + (humidity - 45) * 2;
  } else {
    humidityScore = 15;
  }

  // 3. Rainfall Score (Creates fresh stagnant breeding pools in urban containers)
  let rainScore = 25;
  if (rainfall >= 15) {
    rainScore = 92;
  } else if (rainfall >= 5) {
    rainScore = 75;
  } else if (rainfall > 0.5) {
    rainScore = 55;
  } else {
    // Zero recent rain doesn't mean zero risk if coolers/tanks are used indoors
    rainScore = 30;
  }

  // 4. Community breeding spots in locality
  const highRiskReports = activeReports.filter(
    r => r.status !== 'resolved' && (r.severity === 'high' || r.severity === 'critical')
  ).length;
  const totalActive = activeReports.filter(r => r.status !== 'resolved').length;
  const communityScore = Math.min(100, totalActive * 12 + highRiskReports * 15 + 20);

  // Weighted composite score (0 - 100)
  // Weights: Temp 30%, Humidity 25%, Rain 25%, Community Reports 20%
  const compositeScore = Math.round(
    tempScore * 0.30 +
    humidityScore * 0.25 +
    rainScore * 0.25 +
    communityScore * 0.20
  );

  let level: RiskLevel = 'Low';
  let mosquitoActivity: 'Low' | 'Moderate' | 'High' | 'Extremely Active' = 'Low';
  let breedingSuitability: 'Unfavorable' | 'Mild' | 'Favorable' | 'Critical' = 'Unfavorable';

  if (compositeScore >= 75) {
    level = 'Severe';
    mosquitoActivity = 'Extremely Active';
    breedingSuitability = 'Critical';
  } else if (compositeScore >= 55) {
    level = 'High';
    mosquitoActivity = 'High';
    breedingSuitability = 'Favorable';
  } else if (compositeScore >= 35) {
    level = 'Moderate';
    mosquitoActivity = 'Moderate';
    breedingSuitability = 'Mild';
  } else {
    level = 'Low';
    mosquitoActivity = 'Low';
    breedingSuitability = 'Unfavorable';
  }

  const advice: string[] = [];

  if (rainScore > 60 || humidityScore > 70) {
    advice.push('Inspect and scrub domestic water coolers, flowerpot trays, and overhead water tanks to eliminate larvae.');
  }
  if (tempScore > 75) {
    advice.push('Daytime biting peak: Aedes mosquitoes bite actively early morning and 2 hours before dusk. Wear long sleeves.');
  }
  if (communityScore > 50) {
    advice.push('Multiple active mosquito breeding sites reported in your district. Notify municipal authorities or submit photos.');
  }
  advice.push('Never take Aspirin, Ibuprofen, or other NSAIDs for suspected dengue fever — use Paracetamol only under medical supervision.');

  return {
    score: compositeScore,
    level,
    mosquitoActivity,
    breedingSuitability,
    factors: {
      temperatureScore: Math.round(tempScore),
      humidityScore: Math.round(humidityScore),
      rainfallScore: Math.round(rainScore),
      communityReportsScore: Math.round(communityScore),
    },
    keyAdvice: advice,
    lastCalculated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};
