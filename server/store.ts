import fs from "node:fs/promises";
import path from "node:path";

export type JsonRecord = Record<string, unknown>;

export interface StoreData {
  blocks: JsonRecord[];
  batches: JsonRecord[];
  telemetry: JsonRecord[];
  devices: JsonRecord[];
  alerts: JsonRecord[];
  traceabilityEvents: JsonRecord[];
  entities: JsonRecord[];
}

const emptyStore: StoreData = {
  blocks: [],
  batches: [],
  telemetry: [],
  devices: [],
  alerts: [],
  traceabilityEvents: [],
  entities: [],
};

export class DomainStore {
  private readonly filePath: string;
  private data: StoreData = structuredClone(emptyStore);
  private loaded = false;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(filePath = process.env.HONEY_CHAIN_DATA_FILE ?? path.resolve("data", "honey-chain.json")) {
    this.filePath = filePath;
  }

  async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      this.data = { ...structuredClone(emptyStore), ...JSON.parse(raw) } as StoreData;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await this.persist();
    }
    this.loaded = true;
  }

  get<T extends keyof StoreData>(collection: T): StoreData[T] {
    return this.data[collection];
  }

  replace<T extends keyof StoreData>(collection: T, value: StoreData[T]): void {
    this.data[collection] = value;
  }

  async persist(): Promise<void> {
    this.writeQueue = this.writeQueue.then(async () => {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const temp = `${this.filePath}.tmp`;
      await fs.writeFile(temp, JSON.stringify(this.data, null, 2), "utf8");
      await fs.rename(temp, this.filePath);
    });
    return this.writeQueue;
  }
}

export const store = new DomainStore();

export function id(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isRecentTimestamp(value: unknown, maxFutureMs = 5 * 60 * 1000): boolean {
  const date = parseDate(value);
  return Boolean(date && date.getTime() <= Date.now() + maxFutureMs);
}
