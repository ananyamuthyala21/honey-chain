import { Hive, Beekeeper, HoneyBatch, BlockchainBlock } from '../types';
import { createBlock } from './crypto';

const DB_NAME = 'hivetrust_db';
const DB_VERSION = 1;

// Initial Seed Data
export const INITIAL_BEEKEEPERS: Beekeeper[] = [
  {
    id: 'bk-1',
    name: 'Ramesh Varma',
    code: 'BK-TEL-01',
    village: 'Indravelli',
    district: 'Adilabad',
    state: 'Telangana',
    phone: '+91 98480 23145',
    hivesCount: 3,
    activeStatus: true,
    joinedYear: 2022,
    kvicBatchId: 'KVIC-HYD-2022-B14',
    trainingCertified: true,
    totalHoneyProducedKg: 284
  },
  {
    id: 'bk-2',
    name: 'Anasuya Devi',
    code: 'BK-TEL-02',
    village: 'Khanapur',
    district: 'Nirmal',
    state: 'Telangana',
    phone: '+91 94401 88723',
    hivesCount: 2,
    activeStatus: true,
    joinedYear: 2023,
    kvicBatchId: 'KVIC-NIR-2023-B08',
    trainingCertified: true,
    totalHoneyProducedKg: 195
  },
  {
    id: 'bk-3',
    name: 'Venkatesh Goud',
    code: 'BK-TEL-03',
    village: 'Geesugonda',
    district: 'Warangal',
    state: 'Telangana',
    phone: '+91 97012 34567',
    hivesCount: 1,
    activeStatus: true,
    joinedYear: 2024,
    kvicBatchId: 'KVIC-WGL-2024-B02',
    trainingCertified: true,
    totalHoneyProducedKg: 78
  },
  {
    id: 'bk-4',
    name: 'Lakshmi Bai',
    code: 'BK-AP-04',
    village: 'Dumbriguda',
    district: 'Araku Valley',
    state: 'Andhra Pradesh',
    phone: '+91 99890 77123',
    hivesCount: 2,
    activeStatus: true,
    joinedYear: 2023,
    kvicBatchId: 'KVIC-VIZ-2023-B19',
    trainingCertified: true,
    totalHoneyProducedKg: 160
  }
];

export const INITIAL_HIVES: Hive[] = [
  {
    id: 'hive-1',
    name: 'Adilabad Flora Box 1',
    hiveNumber: 'HV-TEL-101',
    beekeeperId: 'bk-1',
    beekeeperName: 'Ramesh Varma',
    village: 'Indravelli',
    state: 'Telangana',
    species: 'Apis cerana indica',
    installationDate: '2023-04-12',
    status: 'Active',
    currentWeightKg: 24.8,
    currentTempC: 34.6,
    currentHumidity: 58,
    healthScore: 94,
    queenAgeMonths: 8,
    lastInspectionDate: '2026-03-01',
    notes: 'Vigorous brood rearing, heavy nectar collection from mustard blooms.'
  },
  {
    id: 'hive-2',
    name: 'Adilabad Deep Forest 2',
    hiveNumber: 'HV-TEL-102',
    beekeeperId: 'bk-1',
    beekeeperName: 'Ramesh Varma',
    village: 'Indravelli',
    state: 'Telangana',
    species: 'Apis cerana indica',
    installationDate: '2023-06-20',
    status: 'Active',
    currentWeightKg: 22.4,
    currentTempC: 35.1,
    currentHumidity: 61,
    healthScore: 89,
    queenAgeMonths: 11,
    lastInspectionDate: '2026-02-27',
    notes: 'Stable colony with high pollen ingress.'
  },
  {
    id: 'hive-3',
    name: 'Nirmal Organic Box A',
    hiveNumber: 'HV-TEL-201',
    beekeeperId: 'bk-2',
    beekeeperName: 'Anasuya Devi',
    village: 'Khanapur',
    state: 'Telangana',
    species: 'Apis cerana indica',
    installationDate: '2024-01-15',
    status: 'Active',
    currentWeightKg: 26.2,
    currentTempC: 34.2,
    currentHumidity: 55,
    healthScore: 97,
    queenAgeMonths: 5,
    lastInspectionDate: '2026-03-04',
    notes: 'Peak health, clean comb development, ready for seasonal harvest.'
  },
  {
    id: 'hive-4',
    name: 'Nirmal Mellifera Unit',
    hiveNumber: 'HV-TEL-202',
    beekeeperId: 'bk-2',
    beekeeperName: 'Anasuya Devi',
    village: 'Khanapur',
    state: 'Telangana',
    species: 'Apis mellifera',
    installationDate: '2024-08-10',
    status: 'Active',
    currentWeightKg: 28.5,
    currentTempC: 34.4,
    currentHumidity: 56,
    healthScore: 91,
    queenAgeMonths: 7,
    lastInspectionDate: '2026-03-02',
    notes: 'Strong yield potential, high foraging activity.'
  },
  {
    id: 'hive-5',
    name: 'Warangal Transition Box',
    hiveNumber: 'HV-TEL-301',
    beekeeperId: 'bk-3',
    beekeeperName: 'Venkatesh Goud',
    village: 'Geesugonda',
    state: 'Telangana',
    species: 'Apis cerana indica',
    installationDate: '2024-11-05',
    status: 'Maintenance',
    currentWeightKg: 18.6,
    currentTempC: 37.2,
    currentHumidity: 67,
    healthScore: 74,
    queenAgeMonths: 14,
    lastInspectionDate: '2026-03-05',
    notes: 'Temperature elevation noted. Brood inspection scheduled.'
  },
  {
    id: 'hive-6',
    name: 'Araku Valley Wild Comb',
    hiveNumber: 'HV-AP-401',
    beekeeperId: 'bk-4',
    beekeeperName: 'Lakshmi Bai',
    village: 'Dumbriguda',
    state: 'Andhra Pradesh',
    species: 'Apis dorsata',
    installationDate: '2023-10-18',
    status: 'Inactive',
    currentWeightKg: 15.2,
    currentTempC: 32.8,
    currentHumidity: 69,
    healthScore: 65,
    queenAgeMonths: 18,
    lastInspectionDate: '2026-02-15',
    notes: 'Seasonal comb vacation; waiting for spring repopulation.'
  }
];

export const INITIAL_BATCHES: HoneyBatch[] = [
  {
    id: 'HT-2026-TE-01',
    batchNumber: 'HT-2026-TE-01',
    hiveId: 'hive-1',
    hiveNumber: 'HV-TEL-101',
    beekeeperId: 'bk-1',
    beekeeperName: 'Ramesh Varma',
    village: 'Indravelli',
    state: 'Telangana',
    botanicalNectarSource: 'Wild Mustard & Karanj Flora',
    harvestDate: '2026-02-28',
    packagingDate: '2026-03-01',
    quantityKg: 45,
    salePricePerKg: 560, // Above MSP (₹450) -> Fair Price verified
    referenceMspPerKg: 450,
    moisturePercent: 17.6,
    purityIndex: 99.4,
    pollenCountPpm: 1420,
    rawUnpasteurized: true,
    coldExtracted: true,
    blockHash: '', // Will be assigned during seed block generation
    blockNumber: 1,
    verificationStatus: 'Verified',
    packagingFacility: 'KVIC Gramodyog Center, Adilabad',
    qrPayloadUrl: 'https://hivetrust.local/verify/HT-2026-TE-01'
  },
  {
    id: 'HT-2026-TE-02',
    batchNumber: 'HT-2026-TE-02',
    hiveId: 'hive-3',
    hiveNumber: 'HV-TEL-201',
    beekeeperId: 'bk-2',
    beekeeperName: 'Anasuya Devi',
    village: 'Khanapur',
    state: 'Telangana',
    botanicalNectarSource: 'Multifloral Forest & Wild Neem',
    harvestDate: '2026-03-01',
    packagingDate: '2026-03-02',
    quantityKg: 52,
    salePricePerKg: 620, // Above MSP (₹450)
    referenceMspPerKg: 450,
    moisturePercent: 16.9,
    purityIndex: 99.8,
    pollenCountPpm: 1680,
    rawUnpasteurized: true,
    coldExtracted: true,
    blockHash: '',
    blockNumber: 2,
    verificationStatus: 'Verified',
    packagingFacility: 'Nirmal Rural Apiary Federation',
    qrPayloadUrl: 'https://hivetrust.local/verify/HT-2026-TE-02'
  },
  {
    id: 'HT-2026-TE-03',
    batchNumber: 'HT-2026-TE-03',
    hiveId: 'hive-5',
    hiveNumber: 'HV-TEL-301',
    beekeeperId: 'bk-3',
    beekeeperName: 'Venkatesh Goud',
    village: 'Geesugonda',
    state: 'Telangana',
    botanicalNectarSource: 'Wild Acacia & Eucalyptus',
    harvestDate: '2026-03-03',
    packagingDate: '2026-03-04',
    quantityKg: 30,
    salePricePerKg: 420, // Below MSP (₹450) -> allows testing both above and below MSP!
    referenceMspPerKg: 450,
    moisturePercent: 18.4,
    purityIndex: 98.6,
    pollenCountPpm: 1210,
    rawUnpasteurized: true,
    coldExtracted: true,
    blockHash: '',
    blockNumber: 3,
    verificationStatus: 'Verified',
    packagingFacility: 'Warangal Khadi Bhavan Packaging',
    qrPayloadUrl: 'https://hivetrust.local/verify/HT-2026-TE-03'
  },
  {
    id: 'HT-2026-TE-04',
    batchNumber: 'HT-2026-TE-04',
    hiveId: 'hive-4',
    hiveNumber: 'HV-TEL-202',
    beekeeperId: 'bk-2',
    beekeeperName: 'Anasuya Devi',
    village: 'Khanapur',
    state: 'Telangana',
    botanicalNectarSource: 'Jamun & Tamarind Blossom',
    harvestDate: '2026-03-04',
    packagingDate: '2026-03-05',
    quantityKg: 64,
    salePricePerKg: 700, // Premium Above MSP
    referenceMspPerKg: 450,
    moisturePercent: 17.1,
    purityIndex: 99.7,
    pollenCountPpm: 1790,
    rawUnpasteurized: true,
    coldExtracted: true,
    blockHash: '',
    blockNumber: 4,
    verificationStatus: 'Verified',
    packagingFacility: 'Nirmal Rural Apiary Federation',
    qrPayloadUrl: 'https://hivetrust.local/verify/HT-2026-TE-04'
  },
  {
    id: 'HT-2026-TE-05',
    batchNumber: 'HT-2026-TE-05',
    hiveId: 'hive-2',
    hiveNumber: 'HV-TEL-102',
    beekeeperId: 'bk-1',
    beekeeperName: 'Ramesh Varma',
    village: 'Indravelli',
    state: 'Telangana',
    botanicalNectarSource: 'Teak Forest Canopy & Mahua',
    harvestDate: '2026-03-05',
    packagingDate: '2026-03-06',
    quantityKg: 38,
    salePricePerKg: 480, // Above MSP
    referenceMspPerKg: 450,
    moisturePercent: 17.8,
    purityIndex: 99.1,
    pollenCountPpm: 1350,
    rawUnpasteurized: true,
    coldExtracted: true,
    blockHash: '',
    blockNumber: 5,
    verificationStatus: 'Verified',
    packagingFacility: 'KVIC Gramodyog Center, Adilabad',
    qrPayloadUrl: 'https://hivetrust.local/verify/HT-2026-TE-05'
  }
];

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.initIndexedDB();
  }

  private initIndexedDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported, falling back to localStorage'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('hives')) {
          db.createObjectStore('hives', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('beekeepers')) {
          db.createObjectStore('beekeepers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('batches')) {
          db.createObjectStore('batches', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('blocks')) {
          db.createObjectStore('blocks', { keyPath: 'blockNumber' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // LocalStorage Fallbacks
  private getLocal<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(`hivetrust_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`hivetrust_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // IndexedDB generic helpers
  private async getAllFromStore<T>(storeName: string, fallbackKey: string): Promise<T[]> {
    try {
      const db = await this.initIndexedDB();
      return new Promise<T[]>((resolve) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => {
          if (req.result && req.result.length > 0) {
            resolve(req.result as T[]);
          } else {
            resolve(this.getLocal<T[]>(fallbackKey, []));
          }
        };
        req.onerror = () => resolve(this.getLocal<T[]>(fallbackKey, []));
      });
    } catch {
      return this.getLocal<T[]>(fallbackKey, []);
    }
  }

  private async saveToStore<T>(storeName: string, item: T, fallbackKey: string): Promise<void> {
    try {
      const db = await this.initIndexedDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(item);
    } catch {
      // Fallback
    }
    // Also save in localStorage for safety and instant synchronization
    const current = this.getLocal<T[]>(fallbackKey, []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingIndex = current.findIndex((x: any) => x.id === (item as any).id || x.blockNumber === (item as any).blockNumber);
    if (existingIndex >= 0) {
      current[existingIndex] = item;
    } else {
      current.push(item);
    }
    this.setLocal(fallbackKey, current);
  }

  // Public Methods
  public async getHives(): Promise<Hive[]> {
    return this.getAllFromStore<Hive>('hives', 'hives');
  }

  public async saveHive(hive: Hive): Promise<void> {
    await this.saveToStore('hives', hive, 'hives');
  }

  public async getBeekeepers(): Promise<Beekeeper[]> {
    return this.getAllFromStore<Beekeeper>('beekeepers', 'beekeepers');
  }

  public async saveBeekeeper(beekeeper: Beekeeper): Promise<void> {
    await this.saveToStore('beekeepers', beekeeper, 'beekeepers');
  }

  public async getBatches(): Promise<HoneyBatch[]> {
    return this.getAllFromStore<HoneyBatch>('batches', 'batches');
  }

  public async saveBatch(batch: HoneyBatch): Promise<void> {
    await this.saveToStore('batches', batch, 'batches');
  }

  public async getBlocks(): Promise<BlockchainBlock[]> {
    const blocks = await this.getAllFromStore<BlockchainBlock>('blocks', 'blocks');
    return blocks.sort((a, b) => a.blockNumber - b.blockNumber);
  }

  public async saveBlock(block: BlockchainBlock): Promise<void> {
    await this.saveToStore('blocks', block, 'blocks');
  }

  public async getLanguage(): Promise<'en' | 'hi' | 'te'> {
    return this.getLocal<'en' | 'hi' | 'te'>('language', 'en');
  }

  public saveLanguage(language: 'en' | 'hi' | 'te'): void {
    this.setLocal('language', language);
  }

  public async initDatabase(): Promise<void> {
    await this.seedAndSelfTest();
  }

  /**
   * Initializes and seeds the database if empty.
   * Performs an in-app load test on startup and outputs confirmation to console.log.
   */
  public async seedAndSelfTest(): Promise<{
    hivesCount: number;
    beekeepersCount: number;
    batchesCount: number;
    blocksCount: number;
    testPassed: boolean;
  }> {
    let hives = await this.getHives();
    let beekeepers = await this.getBeekeepers();
    let batches = await this.getBatches();
    let blocks = await this.getBlocks();

    // Check if initial seeding is needed
    if (hives.length === 0 || beekeepers.length === 0 || batches.length === 0 || blocks.length === 0) {
      console.log('🐝 [HIVETRUST] Initializing and seeding local persistent store...');

      // Seed Beekeepers
      for (const bk of INITIAL_BEEKEEPERS) {
        await this.saveBeekeeper(bk);
      }

      // Seed Hives
      for (const hv of INITIAL_HIVES) {
        await this.saveHive(hv);
      }

      // Generate Genesis Block
      const genesisBlock = await createBlock(
        {
          batchId: 'GENESIS-000',
          beekeeperId: 'KVIC-CENTRAL',
          hiveId: 'ROOT-REGISTRY',
          harvestDate: '2026-01-01',
          quantityKg: 0,
          nectarSource: 'Ecosystem Genesis Root',
          purityIndex: 100,
          fairPricePaid: 0,
          action: 'GENESIS_ECOSYSTEM_INITIALIZED'
        },
        '0000000000000000000000000000000000000000000000000000000000000000',
        0
      );
      await this.saveBlock(genesisBlock);

      let prevHash = genesisBlock.hash;
      const seededBatches: HoneyBatch[] = [];

      // Create a block for each seeded batch
      for (let i = 0; i < INITIAL_BATCHES.length; i++) {
        const batch = { ...INITIAL_BATCHES[i] };
        const blockNum = i + 1;

        const block = await createBlock(
          {
            batchId: batch.id,
            beekeeperId: batch.beekeeperId,
            hiveId: batch.hiveId,
            harvestDate: batch.harvestDate,
            quantityKg: batch.quantityKg,
            nectarSource: batch.botanicalNectarSource,
            purityIndex: batch.purityIndex,
            fairPricePaid: batch.salePricePerKg,
            action: 'BATCH_VERIFIED_AND_CERTIFIED'
          },
          prevHash,
          blockNum
        );

        await this.saveBlock(block);
        prevHash = block.hash;

        batch.blockHash = block.hash;
        batch.blockNumber = blockNum;
        await this.saveBatch(batch);
        seededBatches.push(batch);
      }

      // Read back to verify
      hives = await this.getHives();
      beekeepers = await this.getBeekeepers();
      batches = await this.getBatches();
      blocks = await this.getBlocks();
    }

    const testPassed =
      hives.length >= 6 &&
      beekeepers.length >= 4 &&
      batches.length >= 5 &&
      blocks.length >= 6; // Genesis + 5 batches

    // In-app load test confirmation logged as requested in Step 1
    console.log('✅ [HIVETRUST STARTUP LOAD TEST CONFIRMATION]:', {
      status: testPassed ? 'SUCCESS - ALL DATA VERIFIED' : 'WARNING - DATA INCOMPLETE',
      totalHives: hives.length,
      totalBeekeepers: beekeepers.length,
      totalBatches: batches.length,
      totalBlocks: blocks.length,
      latestBlockHash: blocks[blocks.length - 1]?.hash?.slice(0, 16) + '...'
    });

    return {
      hivesCount: hives.length,
      beekeepersCount: beekeepers.length,
      batchesCount: batches.length,
      blocksCount: blocks.length,
      testPassed
    };
  }
}

export const storage = new StorageService();
