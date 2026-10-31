import { SimulationParams, SimulationResult } from '../types';

export const runMosquitoSimulation = (params: SimulationParams): SimulationResult => {
  const { ambientTemp, relativeHumidity, standingWaterLiters, rainfallFrequencyDays, controlInterventions } = params;

  // 1. Biological developmental speed (Days from egg to flying adult)
  // Optimal temperature is 28-30°C (~7 days)
  let eggToAdultDays = 7;
  if (ambientTemp < 20) {
    eggToAdultDays = Math.round(20 - (ambientTemp - 15) * 1.5);
  } else if (ambientTemp >= 20 && ambientTemp < 26) {
    eggToAdultDays = Math.round(13 - (ambientTemp - 20) * 0.8);
  } else if (ambientTemp >= 26 && ambientTemp <= 32) {
    eggToAdultDays = Math.round(8 - (ambientTemp - 26) * 0.3);
  } else if (ambientTemp > 32 && ambientTemp <= 38) {
    eggToAdultDays = 7 + Math.round((ambientTemp - 32) * 0.5);
  } else {
    eggToAdultDays = 14; // Extreme heat thermal stress slows emergence
  }

  // 2. Larval Survival Rate (%)
  let baseSurvival = 75;
  // Humidity impact
  if (relativeHumidity < 40) baseSurvival -= 25;
  else if (relativeHumidity > 70) baseSurvival += 15;

  // Temperature impact
  if (ambientTemp < 18 || ambientTemp > 38) baseSurvival -= 35;

  // Water volume impact (standing water dry-out risk vs capacity)
  if (standingWaterLiters < 5) baseSurvival -= 20; // Shallow water dries quickly unless rained on
  if (rainfallFrequencyDays >= 3) baseSurvival += 15; // replenished water pools

  // Vector control intervention impact (e.g. larvicide / cleaning)
  const interventionMultiplier = (100 - controlInterventions) / 100;
  const larvalSurvivalRate = Math.max(5, Math.min(95, Math.round(baseSurvival * interventionMultiplier)));

  // 3. Daily Bite Rate & Vector Density Score
  // Aedes aegypti biting activity correlates with temperature and humidity
  const tempFitness = Math.max(0, 1 - Math.abs(ambientTemp - 29) / 15);
  const humidityFitness = Math.min(1, relativeHumidity / 70);
  const waterFactor = Math.min(1, standingWaterLiters / 80);

  const rawDensity = (tempFitness * 0.35 + humidityFitness * 0.25 + waterFactor * 0.40) * 100 * interventionMultiplier;
  const vectorDensityScore = Math.max(2, Math.min(100, Math.round(rawDensity)));

  let relativeTransmissionRisk: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Low';
  if (vectorDensityScore >= 75) relativeTransmissionRisk = 'Extreme';
  else if (vectorDensityScore >= 50) relativeTransmissionRisk = 'High';
  else if (vectorDensityScore >= 25) relativeTransmissionRisk = 'Moderate';

  const dailyBiteRateEstimate = Math.round(vectorDensityScore * 0.45 * 10) / 10;

  // 4. 14-Day Dynamic Projection Curve
  const projection14Days: SimulationResult['projection14Days'] = [];
  const baseEggs = Math.max(20, Math.round(standingWaterLiters * 1.5 * (1 + rainfallFrequencyDays * 0.2)));

  for (let day = 1; day <= 14; day++) {
    // Larval emergence curve
    let larvae = Math.round(baseEggs * (larvalSurvivalRate / 100) * (day <= eggToAdultDays ? day / eggToAdultDays : 1.2 - (day - eggToAdultDays) * 0.05));
    // Adult emergence starts after eggToAdultDays
    let adults = 0;
    if (day >= eggToAdultDays) {
      adults = Math.round((day - eggToAdultDays + 1) * (larvae * 0.35) * interventionMultiplier);
    }
    let risk = Math.min(100, Math.round((adults * 2.2 + larvae * 0.4) * (vectorDensityScore / 50)));

    projection14Days.push({
      day,
      larvalCount: Math.max(0, larvae),
      adultMosquitoes: Math.max(0, adults),
      riskIndex: Math.max(5, Math.min(100, risk)),
    });
  }

  return {
    eggToAdultDays,
    larvalSurvivalRate,
    dailyBiteRateEstimate,
    vectorDensityScore,
    relativeTransmissionRisk,
    projection14Days,
  };
};
