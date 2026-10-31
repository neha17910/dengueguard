import { HydrationCalculation, PlateletHematocritAnalysis } from '../types';

export const calculateHydrationPlan = (
  weightKg: number,
  phase: 'febrile' | 'critical' | 'recovery'
): HydrationCalculation => {
  const w = Math.max(5, Math.min(150, weightKg));

  // Holliday-Segar Maintenance Fluid Formula
  let baselineDailyMl = 0;
  if (w <= 10) {
    baselineDailyMl = w * 100;
  } else if (w <= 20) {
    baselineDailyMl = 1000 + (w - 10) * 50;
  } else {
    baselineDailyMl = 1500 + (w - 20) * 20;
  }

  // Adjust for phase
  let multiplier = 1.0;
  const warningSigns: string[] = [];

  if (phase === 'febrile') {
    // Replace insensible losses from high fever
    multiplier = 1.25;
    warningSigns.push('Sip fluids continuously in small volumes (every 15–20 minutes) to avoid triggering nausea.');
    warningSigns.push('Ensure urine output is at least 0.5–1.0 mL/kg/hour (pale straw-colored urine).');
  } else if (phase === 'critical') {
    // Plasma leakage window - requires careful replacement without fluid overload
    multiplier = 1.4;
    warningSigns.push('CRITICAL PHASE: Closely monitor for signs of fluid overload (puffy eyelids, rapid breathing, tight chest).');
    warningSigns.push('If oral fluids cannot be retained due to vomiting, immediate hospital IV crystalloid therapy is vital.');
  } else {
    // Recovery phase - fluid reabsorption starts, reduce excess intake
    multiplier = 1.0;
    warningSigns.push('Fluid reabsorption begins. Avoid excessive fluids to prevent pulmonary edema.');
  }

  const totalDailyMl = Math.round(baselineDailyMl * multiplier);
  const ratePerHourMl = Math.round(totalDailyMl / 24);
  const orsPacketsPerDay = Math.max(1, Math.round((totalDailyMl * 0.6) / 1000 * 10) / 10);

  return {
    weightKg: w,
    phase,
    totalDailyMl,
    ratePerHourMl,
    orsPacketsPerDay,
    warningSigns,
  };
};

export const evaluatePlateletHematocrit = (
  plateletCount: number,
  hematocritPct: number,
  baselineHematocritPct: number = 38
): PlateletHematocritAnalysis => {
  const hct = Number(hematocritPct) || 38;
  const base = Number(baselineHematocritPct) || 38;
  const plt = Number(plateletCount) || 150000;

  // Calculate Hemoconcentration percentage: ((HCT - Baseline) / Baseline) * 100
  const hemoconcentrationPct = Math.round(((hct - base) / base) * 100 * 10) / 10;

  let riskCategory: PlateletHematocritAnalysis['riskCategory'] = 'normal';
  let advice = '';

  if (plt < 20000 || hemoconcentrationPct >= 20) {
    riskCategory = 'critical_emergency';
    advice = 'EMERGENCY: Significant plasma leakage (≥20% rise in Hematocrit) or profound thrombocytopenia (<20,000/μL). Immediate tertiary hospital emergency triage and continuous IV fluid stabilization required.';
  } else if (plt < 50000 || hemoconcentrationPct >= 15) {
    riskCategory = 'high_plasma_leakage';
    advice = 'HIGH RISK: Impending plasma leakage. Strict bed rest, hospital day-care or inpatient monitoring with CBC every 6–8 hours recommended.';
  } else if (plt < 100000 || hemoconcentrationPct >= 10) {
    riskCategory = 'moderate_risk';
    advice = 'MODERATE ALERT: Moderate thrombocytopenia and mild hemoconcentration. Maintain oral hydration with WHO ORS and re-check CBC in 12–24 hours.';
  } else if (plt < 150000) {
    riskCategory = 'mild_thrombocytopenia';
    advice = 'MILD CONCERN: Platelets below normal baseline (150,000/μL). Continue monitoring temperature and maintain oral fluids.';
  } else {
    riskCategory = 'normal';
    advice = 'NORMAL RANGE: Platelet count and Hematocrit are within expected reference limits. Continue standard fever management.';
  }

  return {
    plateletCount: plt,
    hematocritPct: hct,
    baselineHematocritPct: base,
    hemoconcentrationPct,
    riskCategory,
    clinicalAdvice: advice,
  };
};
