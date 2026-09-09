import { describe, expect, it, beforeEach } from "vitest";
import { createBlock, verifyChain, ZERO_HASH } from "./blockchain";
import { diseaseRisk, productivityPrediction } from "./ai";
import { store } from "./store";

describe("Honey Chain backend services", () => {
  beforeEach(() => {
    store.replace("blocks", []);
  });

  it("detects tampering in a cryptographically linked chain", () => {
    const genesis = createBlock({ batchId: "GENESIS-000", data: { action: "GENESIS" }, blockNumber: 0, previousHash: ZERO_HASH });
    const second = createBlock({ batchId: "HC-1", data: { action: "HARVESTED", quantityKg: 10 }, blockNumber: 1, previousHash: genesis.hash });
    store.replace("blocks", [genesis, second]);
    expect(verifyChain().isValid).toBe(true);
    second.data.quantityKg = 999;
    expect(verifyChain().status).toBe("COMPROMISED");
    expect(verifyChain().errors.some(error => error.includes("hash"))).toBe(true);
  });

  it("returns explainable high-risk disease output", () => {
    const result = diseaseRisk({ temperature: 41, humidity: 84, hiveWeight: 30, beeActivity: 20, colonyHealth: 50 });
    expect(result.diseaseRiskLevel).toBe("HIGH");
    expect(result.contributingFactors.length).toBeGreaterThan(1);
    expect(result.recommendedAction.length).toBeGreaterThan(10);
  });

  it("returns a bounded productivity range and trend", () => {
    const result = productivityPrediction({ hiveWeight: 40, beeActivity: 80, colonyHealth: 90, humidity: 58, temperature: 31, previousHarvestQuantity: 16 });
    expect(result.predictedHarvestKg).toBeGreaterThan(0);
    expect(result.predictionRange.minKg).toBeLessThanOrEqual(result.predictedHarvestKg);
    expect(["Increasing", "Stable", "Decreasing"]).toContain(result.productivityTrend);
  });
});
