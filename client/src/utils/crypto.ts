import { BlockchainBlock } from '../types';

/**
 * Computes SHA-256 hash using the native browser Web Crypto API.
 */
export async function createHash(data: unknown): Promise<string> {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback bit-shift simple hash representation if WebCrypto is unavailable in non-secure context
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Creates a new block with computed hash from contents
 */
export async function createBlock(
  data: BlockchainBlock['data'],
  previousHash: string,
  blockNumber: number
): Promise<BlockchainBlock> {
  const timestamp = new Date().toISOString();
  const nonce = Math.floor(Math.random() * 1000000);
  
  const payloadToHash = {
    blockNumber,
    timestamp,
    data,
    previousHash,
    nonce
  };

  const hash = await createHash(payloadToHash);

  return {
    blockNumber,
    timestamp,
    data,
    previousHash,
    hash,
    nonce,
    verified: true
  };
}

/**
 * Verifies the entire blockchain integrity by recomputing every single SHA-256 block hash
 * and validating the cryptographic chain link (previousHash matches previous block's hash).
 */
export async function verifyChain(blocks: BlockchainBlock[]): Promise<{
  isValid: boolean;
  errors: string[];
  verifiedCount: number;
  totalBlocks: number;
  auditDetails: Array<{
    blockNumber: number;
    expectedHash: string;
    computedHash: string;
    prevHashMatch: boolean;
    valid: boolean;
  }>;
}> {
  const errors: string[] = [];
  const auditDetails: Array<{
    blockNumber: number;
    expectedHash: string;
    computedHash: string;
    prevHashMatch: boolean;
    valid: boolean;
  }> = [];

  if (!blocks || blocks.length === 0) {
    return { isValid: false, errors: ['Chain is empty'], verifiedCount: 0, totalBlocks: 0, auditDetails };
  }

  // Genesis block check
  const genesis = blocks[0];
  const genesisPayload = {
    blockNumber: genesis.blockNumber,
    timestamp: genesis.timestamp,
    data: genesis.data,
    previousHash: genesis.previousHash,
    nonce: genesis.nonce
  };
  const computedGenesisHash = await createHash(genesisPayload);
  const genesisValid = computedGenesisHash === genesis.hash;
  
  auditDetails.push({
    blockNumber: genesis.blockNumber,
    expectedHash: genesis.hash,
    computedHash: computedGenesisHash,
    prevHashMatch: genesis.previousHash === '0000000000000000000000000000000000000000000000000000000000000000',
    valid: genesisValid
  });

  if (!genesisValid) {
    errors.push(`Genesis Block #0 has been tampered with or corrupted`);
  }

  // Subsequent blocks check
  for (let i = 1; i < blocks.length; i++) {
    const current = blocks[i];
    const previous = blocks[i - 1];

    const payload = {
      blockNumber: current.blockNumber,
      timestamp: current.timestamp,
      data: current.data,
      previousHash: current.previousHash,
      nonce: current.nonce
    };

    const recomputedHash = await createHash(payload);
    const hashMatches = recomputedHash === current.hash;
    const prevLinkMatches = current.previousHash === previous.hash;

    const blockValid = hashMatches && prevLinkMatches;

    auditDetails.push({
      blockNumber: current.blockNumber,
      expectedHash: current.hash,
      computedHash: recomputedHash,
      prevHashMatch: prevLinkMatches,
      valid: blockValid
    });

    if (!hashMatches) {
      errors.push(`Block #${current.blockNumber} hash mismatch: computed ${recomputedHash.slice(0, 10)}... vs stored ${current.hash.slice(0, 10)}...`);
    }
    if (!prevLinkMatches) {
      errors.push(`Block #${current.blockNumber} broken parent link: previousHash does not match Block #${previous.blockNumber}'s hash`);
    }
  }

  const isValid = errors.length === 0;
  const verifiedCount = auditDetails.filter(d => d.valid).length;

  return {
    isValid,
    errors,
    verifiedCount,
    totalBlocks: blocks.length,
    auditDetails
  };
}
