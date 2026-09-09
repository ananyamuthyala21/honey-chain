import { diseaseRisk } from "./ai";
import { id, isRecentTimestamp, parseDate, store, type JsonRecord } from "./store";

export interface TelemetryInput extends JsonRecord {
  hiveId: string;
  deviceId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  hiveWeight: number;
  beeActivity: number;
  batteryLevel: number;
  signalStrength: number;
  acousticLevel?: number;
}

export function validateTelemetry(input: Partial<TelemetryInput>): string[] {
  const errors: string[] = [];
  for (const field of ["hiveId", "deviceId", "timestamp"]) if (!input[field as keyof TelemetryInput]) errors.push(`${field} is required`);
  for (const field of ["temperature", "humidity", "hiveWeight", "beeActivity", "batteryLevel", "signalStrength"]) {
    const value = input[field as keyof TelemetryInput];
    if (typeof value !== "number" || !Number.isFinite(value)) errors.push(`${field} must be numeric`);
  }
  if (!isRecentTimestamp(input.timestamp)) errors.push("timestamp is invalid or too far in the future");
  if (typeof input.humidity === "number" && (input.humidity < 0 || input.humidity > 100)) errors.push("humidity must be between 0 and 100");
  if (typeof input.batteryLevel === "number" && (input.batteryLevel < 0 || input.batteryLevel > 100)) errors.push("batteryLevel must be between 0 and 100");
  return errors;
}

export function alertsForTelemetry(t: TelemetryInput) {
  const alerts: JsonRecord[] = [];
  const add = (type: string, severity: string, message: string, recommendedAction: string) => alerts.push({ alertId: id("alert"), hiveId: t.hiveId, severity, type, timestamp: t.timestamp, message, recommendedAction, acknowledged: false });
  if (t.temperature > 39) add("HIGH_TEMPERATURE", "CRITICAL", `Hive temperature is ${t.temperature.toFixed(1)}°C`, "Provide shade/ventilation and inspect the colony.");
  if (t.temperature < 15) add("LOW_TEMPERATURE", "WARNING", `Hive temperature is ${t.temperature.toFixed(1)}°C`, "Check insulation and colony warmth.");
  if (t.humidity > 80) add("EXCESSIVE_HUMIDITY", "WARNING", `Humidity is ${t.humidity.toFixed(1)}%`, "Improve airflow and check for moisture buildup.");
  if (t.beeActivity < 30) add("LOW_BEE_ACTIVITY", "WARNING", `Bee activity has dropped to ${t.beeActivity.toFixed(0)}%`, "Inspect colony health and food stores.");
  if (t.batteryLevel < 20) add("LOW_DEVICE_BATTERY", "WARNING", `Device battery is ${t.batteryLevel.toFixed(0)}%`, "Recharge or replace the sensor battery.");
  const risk = diseaseRisk({ temperature: t.temperature, humidity: t.humidity, hiveWeight: t.hiveWeight, beeActivity: t.beeActivity, acousticLevel: t.acousticLevel });
  if (risk.diseaseRiskLevel === "HIGH") add("SUSPECTED_DISEASE", "CRITICAL", `Prototype AI disease risk is ${risk.diseaseRiskScore}/100`, risk.recommendedAction);
  return alerts;
}

export async function ingestTelemetry(input: TelemetryInput) {
  const errors = validateTelemetry(input);
  if (errors.length) throw new Error(errors.join("; "));
  const record = { ...input, telemetryId: id("telemetry"), receivedAt: new Date().toISOString() };
  (store.get("telemetry") as JsonRecord[]).push(record);
  const alerts = alertsForTelemetry(input);
  (store.get("alerts") as JsonRecord[]).push(...alerts);
  await store.persist();
  return { telemetry: record, alerts };
}

let simulation: NodeJS.Timeout | undefined;
let simulationState = { running: false, anomalyEvery: 7, tick: 0 };

export async function startSimulation(hiveIds: string[] = ["hive-1", "hive-2", "hive-3"]) {
  if (simulation) return { ...simulationState, mode: "Simulation" };
  simulationState = { running: true, anomalyEvery: 7, tick: 0 };
  simulation = setInterval(() => {
    simulationState.tick += 1;
    hiveIds.forEach(async (hiveId, index) => {
      const hour = new Date().getHours();
      const daylight = hour >= 6 && hour <= 18;
      const anomaly = simulationState.tick % simulationState.anomalyEvery === 0 && index === 0;
      try {
        await ingestTelemetry({
          hiveId, deviceId: `sim-${hiveId}`, timestamp: new Date().toISOString(),
          temperature: (daylight ? 31 : 25) + Math.sin(simulationState.tick / 4) * 2 + (anomaly ? 10 : 0),
          humidity: 58 + Math.sin(simulationState.tick / 5) * 8 + (anomaly ? 25 : 0),
          hiveWeight: 38 + Math.sin(simulationState.tick / 20) * 1.5 - (anomaly ? 3 : 0),
          beeActivity: (daylight ? 75 : 35) + Math.sin(simulationState.tick / 3) * 8 - (anomaly ? 48 : 0),
          batteryLevel: Math.max(8, 96 - simulationState.tick * 0.02), signalStrength: 84 + Math.sin(simulationState.tick) * 5,
          acousticLevel: 55 + Math.sin(simulationState.tick / 2) * 8,
        });
      } catch { /* simulator is best-effort */ }
    });
  }, 15_000);
  return { ...simulationState, mode: "Simulation" };
}

export function stopSimulation() {
  if (simulation) clearInterval(simulation);
  simulation = undefined;
  simulationState.running = false;
  return { ...simulationState, mode: "Simulation" };
}

export function latestTelemetry(hiveId: string) {
  return [...(store.get("telemetry") as TelemetryInput[])].filter(t => t.hiveId === hiveId).sort((a, b) => (parseDate(b.timestamp)?.getTime() ?? 0) - (parseDate(a.timestamp)?.getTime() ?? 0))[0] ?? null;
}
