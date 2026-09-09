export type Language = 'en' | 'hi' | 'te';

export type HiveStatus = 'Active' | 'Maintenance' | 'Inactive';
export type BeeSpecies = 'Apis cerana indica' | 'Apis mellifera' | 'Apis dorsata';

export interface Hive {
  id: string;
  name: string;
  hiveNumber: string;
  beekeeperId: string;
  beekeeperName: string;
  village: string;
  state: string;
  species: BeeSpecies;
  installationDate: string;
  status: HiveStatus;
  currentWeightKg: number;
  currentTempC: number;
  currentHumidity: number;
  healthScore: number;
  queenAgeMonths: number;
  lastInspectionDate: string;
  notes: string;
}

export interface Beekeeper {
  id: string;
  name: string;
  code: string;
  village: string;
  district: string;
  state: string;
  phone: string;
  hivesCount: number;
  activeStatus: boolean;
  joinedYear: number;
  kvicBatchId: string;
  trainingCertified: boolean;
  totalHoneyProducedKg: number;
}

export interface HoneyBatch {
  id: string; // e.g. HT-2026-TE-01
  batchNumber: string;
  hiveId: string;
  hiveNumber: string;
  beekeeperId: string;
  beekeeperName: string;
  village: string;
  state: string;
  botanicalNectarSource: string;
  harvestDate: string;
  packagingDate: string;
  quantityKg: number;
  salePricePerKg: number; // Sale price in INR
  referenceMspPerKg: number; // Reference Minimum Support Price in INR (demo reference)
  moisturePercent: number; // e.g. 17.8% (standard < 20%)
  purityIndex: number; // e.g. 99.4%
  pollenCountPpm: number;
  rawUnpasteurized: boolean;
  coldExtracted: boolean;
  blockHash: string;
  blockNumber: number;
  verificationStatus: 'Verified' | 'Pending';
  packagingFacility: string;
  qrPayloadUrl: string;
}

export interface BlockchainBlock {
  blockNumber: number;
  timestamp: string;
  data: {
    batchId: string;
    beekeeperId: string;
    hiveId: string;
    harvestDate: string;
    quantityKg: number;
    nectarSource: string;
    purityIndex: number;
    fairPricePaid: number;
    action: string;
  };
  previousHash: string;
  hash: string;
  nonce: number;
  verified: boolean;
}

export interface IoTTelemetry {
  timestamp: string;
  temperatureC: number;
  humidityPercent: number;
  weightKg: number;
  activityCountPerHour: number;
}

export interface AIHealthRisk {
  category: 'Temperature Stress' | 'Swarming Risk' | 'Disease Risk' | 'Food Shortage';
  level: 'Low' | 'Medium' | 'High';
  detail: string;
}

export interface AIHealthAnalysis {
  hiveId: string;
  overallScore: number; // 0-100
  status: 'Thriving' | 'Watch' | 'Critical';
  risks: AIHealthRisk[];
  recommendation: string;
  confidence: number;
  lastAnalyzedAt: string;
}

export type ActivePage =
  | 'landing'
  | 'dashboard'
  | 'beekeepers'
  | 'hives'
  | 'iot'
  | 'ai-health'
  | 'batches'
  | 'blockchain'
  | 'verify';
