import { createHash } from "node:crypto";
import { id, store, type JsonRecord } from "./store";

export interface LedgerBlock extends JsonRecord {
  id: string;
  blockNumber: number;
  timestamp: string;
  previousHash: string;
  hash: string;
  nonce: number;
  batchId: string;
  data: JsonRecord;
}

const ZERO_HASH = "0".repeat(64);

function hashBlock(block: Pick<LedgerBlock, "blockNumber" | "timestamp" | "previousHash" | "nonce" | "batchId" | "data">): string {
  return createHash("sha256").update(JSON.stringify({
    blockNumber: block.blockNumber,
    timestamp: block.timestamp,
    previousHash: block.previousHash,
    nonce: block.nonce,
    batchId: block.batchId,
    data: block.data,
  })).digest("hex");
}

export async function ensureGenesis(): Promise<LedgerBlock> {
  const blocks = store.get("blocks") as LedgerBlock[];
  if (blocks.length > 0) return blocks[0];
  const genesis = createBlock({
    batchId: "GENESIS-000",
    data: { action: "GENESIS_ECOSYSTEM_INITIALIZED", scope: "Honey Chain prototype permissioned ledger" },
    blockNumber: 0,
    previousHash: ZERO_HASH,
  });
  blocks.push(genesis);
  await store.persist();
  return genesis;
}

export function createBlock(input: { batchId: string; data: JsonRecord; blockNumber: number; previousHash: string }): LedgerBlock {
  const block = {
    id: id("block"),
    blockNumber: input.blockNumber,
    timestamp: new Date().toISOString(),
    previousHash: input.previousHash,
    nonce: Math.floor(Math.random() * 1_000_000),
    batchId: input.batchId,
    data: input.data,
  };
  return { ...block, hash: hashBlock(block) };
}

export async function appendBlock(batchId: string, data: JsonRecord): Promise<LedgerBlock> {
  await ensureGenesis();
  const blocks = store.get("blocks") as LedgerBlock[];
  const previous = blocks[blocks.length - 1];
  const block = createBlock({ batchId, data, blockNumber: previous.blockNumber + 1, previousHash: previous.hash });
  blocks.push(block);
  await store.persist();
  return block;
}

export function verifyChain(): { isValid: boolean; errors: string[]; verifiedCount: number; totalBlocks: number; status: "VERIFIED" | "COMPROMISED" } {
  const blocks = [...(store.get("blocks") as LedgerBlock[])].sort((a, b) => a.blockNumber - b.blockNumber);
  const errors: string[] = [];
  let verifiedCount = 0;
  blocks.forEach((block, index) => {
    if (block.blockNumber !== index) errors.push(`Invalid block sequence at #${block.blockNumber}; expected #${index}`);
    const expectedPrevious = index === 0 ? ZERO_HASH : blocks[index - 1].hash;
    if (block.previousHash !== expectedPrevious) errors.push(`Broken previousHash at block #${block.blockNumber}`);
    const computed = hashBlock(block);
    if (computed !== block.hash) errors.push(`Invalid SHA-256 hash at block #${block.blockNumber}`);
    if (computed === block.hash && block.previousHash === expectedPrevious && block.blockNumber === index) verifiedCount += 1;
  });
  if (blocks.length === 0) errors.push("Ledger is empty");
  return { isValid: errors.length === 0, errors, verifiedCount, totalBlocks: blocks.length, status: errors.length === 0 ? "VERIFIED" : "COMPROMISED" };
}

export { ZERO_HASH };
