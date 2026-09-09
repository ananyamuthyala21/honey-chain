export interface TelemetryFeatures {
  temperature?: number;
  humidity?: number;
  hiveWeight?: number;
  beeActivity?: number;
  acousticLevel?: number;
  historical?: TelemetryFeatures[];
  colonyHealth?: number;
}

export function diseaseRisk(features: TelemetryFeatures) {
  const reasons: string[] = [];
  let score = 12;
  const humidity = features.humidity ?? 55;
  const temperature = features.temperature ?? 33;
  const activity = features.beeActivity ?? 70;
  const health = features.colonyHealth ?? 82;
  const history = features.historical ?? [];
  const weights = history.map(item => item.hiveWeight).filter((value): value is number => typeof value === "number");
  const weightDrop = weights.length > 1 ? weights[weights.length - 1] - weights[0] : 0;
  if (humidity > 75) { score += 27; reasons.push(`Humidity is elevated at ${humidity.toFixed(1)}%`); }
  if (temperature > 39 || temperature < 15) { score += 20; reasons.push(`Temperature stress detected at ${temperature.toFixed(1)}°C`); }
  if (activity < 35) { score += 24; reasons.push(`Bee activity is unusually low at ${activity.toFixed(0)}% of normal`); }
  if (weightDrop < -2) { score += 22; reasons.push(`Hive weight declined by ${Math.abs(weightDrop).toFixed(1)} kg across the available history`); }
  if (health < 60) { score += 18; reasons.push(`Colony health score is ${health}/100`); }
  if (features.acousticLevel !== undefined && features.acousticLevel > 85) { score += 10; reasons.push("Acoustic activity is outside the normal prototype range"); }
  score = Math.min(100, score);
  const level = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";
  const suspectedCondition = humidity > 75 ? "Moisture stress / brood disease risk" : activity < 35 ? "Colony stress or swarming risk" : weightDrop < -2 ? "Food shortage or queen/colony stress" : "No dominant condition detected";
  return {
    modelLabel: "Prototype ML model (synthetic/anomaly-based; not a scientific diagnosis)",
    diseaseRiskScore: score,
    diseaseRiskLevel: level,
    suspectedCondition,
    confidence: Math.min(92, 55 + reasons.length * 7),
    contributingFactors: reasons.length ? reasons : ["Telemetry remains within the configured prototype baseline"],
    recommendedAction: level === "HIGH" ? "Inspect the hive within 24 hours and confirm findings with a trained beekeeper." : level === "MEDIUM" ? "Increase inspection frequency and review the next 24 hours of telemetry." : "Continue routine monitoring and record the next inspection.",
  };
}

export function productivityPrediction(input: TelemetryFeatures & { season?: string; nectarAvailability?: number; previousHarvestQuantity?: number; activeColonies?: number }) {
  const weight = input.hiveWeight ?? 35;
  const activity = input.beeActivity ?? 70;
  const health = input.colonyHealth ?? 82;
  const nectar = input.nectarAvailability ?? 70;
  const previous = input.previousHarvestQuantity ?? 15;
  const temperatureFit = (input.temperature ?? 31) >= 22 && (input.temperature ?? 31) <= 36 ? 1 : 0.82;
  const humidityFit = (input.humidity ?? 58) <= 75 ? 1 : 0.86;
  const predicted = Math.max(0.5, Number(((weight * 0.25 + activity * 0.08 + health * 0.05 + nectar * 0.07 + previous * 0.32) * temperatureFit * humidityFit / 2.8).toFixed(1)));
  const spread = Number((predicted * (0.12 + (100 - health) / 1000)).toFixed(1));
  const factors: string[] = [];
  if (health >= 80) factors.push("Healthy colony score");
  if (activity >= 70) factors.push("Strong bee activity");
  if (weight >= 35) factors.push("Adequate hive weight");
  if (nectar < 50) factors.push("Limited nectar availability");
  if (humidityFit < 1) factors.push("Moderate humidity stress");
  const trend = predicted > previous * 1.08 ? "Increasing" : predicted < previous * 0.92 ? "Decreasing" : "Stable";
  return {
    modelLabel: "Transparent prototype forecast (replaceable with trained historical model)",
    predictedHarvestKg: predicted,
    predictionRange: { minKg: Math.max(0, Number((predicted - spread).toFixed(1))), maxKg: Number((predicted + spread).toFixed(1)) },
    confidenceScore: Math.round(Math.min(90, 58 + health * 0.2 + (input.historical?.length ?? 0) * 2)),
    productivityTrend: trend,
    majorFactors: factors.length ? factors : ["Baseline seasonal estimate"],
    recommendations: trend === "Decreasing" ? ["Inspect food stores and colony health.", "Review nectar availability and consider supplemental forage planning."] : ["Maintain current hive care routine.", "Record the next harvest to improve future forecasts."],
  };
}
