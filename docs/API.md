# Honey Chain prototype backend

The existing React UI remains the primary interface and continues to work with its IndexedDB/localStorage fallback. The Express backend adds an authoritative, backend-oriented prototype path. Persistence is file-backed by default (`data/honey-chain.json`) so the project runs without requiring a local PostgreSQL server; the store is intentionally isolated behind a service boundary that can be replaced by Prisma/PostgreSQL.

## Run locally

```bash
pnpm install
pnpm build
PORT=3000 pnpm start
```

Set `HONEY_CHAIN_DATA_FILE` to use a different persistent store. The server exposes the built SPA and APIs from the same origin in production.

## API surface

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Backend readiness and prototype boundary status |
| GET | `/api/blockchain` | Blocks plus integrity result |
| GET | `/api/blockchain/verify` | Detects modified data, invalid hashes, broken links, and sequence errors |
| GET | `/api/blockchain/blocks/:id` | Block lookup by id or number |
| GET | `/api/blockchain/batch/:batchId` | All ledger blocks for a batch |
| POST | `/api/blockchain/blocks` | Append a SHA-256 linked transaction block |
| POST | `/api/iot/devices` | Register a device and map it to a hive |
| POST | `/api/iot/telemetry` | Validate and persist HTTP-ready telemetry |
| GET | `/api/iot/hives/:hiveId/telemetry` | Hive history |
| GET | `/api/iot/hives/:hiveId/latest` | Latest reading |
| GET | `/api/iot/alerts` | Alert feed, optionally filtered by hive |
| POST | `/api/iot/alerts/:alertId/acknowledge` | Acknowledge an alert |
| POST | `/api/iot/simulation/start` | Start realistic day/night simulation with periodic anomaly injection |
| POST | `/api/iot/simulation/stop` | Stop simulation |
| POST | `/api/ai/disease-risk` | Explainable prototype disease/anomaly risk |
| POST | `/api/ai/productivity/predict` | Transparent productivity forecast |
| POST | `/api/batches` | Create a batch, traceability event, secure verification id, and blockchain block |
| GET | `/api/batches/:batchId/events` | Lifecycle timeline |
| POST | `/api/batches/:batchId/events` | Append `COLLECTED`, `QUALITY_TESTED`, `PROCESSED`, `PACKAGED`, `TRANSFERRED`, or `SOLD` |
| GET | `/api/verify/:token` | Returns `GENUINE`, `SUSPICIOUS`, `INVALID`-compatible, or `NOT_FOUND` semantics without false verification on failure |
| POST | `/api/entities` | Create institution/cluster/village/beekeeper/hive/device/facility/lab/distributor entities |
| GET | `/api/kvic/overview` | Hierarchy and aggregate counts |

## Telemetry contract

`POST /api/iot/telemetry` accepts `hiveId`, `deviceId`, `timestamp`, `temperature`, `humidity`, `hiveWeight`, `beeActivity`, `batteryLevel`, `signalStrength`, and optional `acousticLevel`. The service validates numeric ranges, timestamps, and required identifiers before persistence. Alerts are generated for high/low temperature, excessive humidity, low activity, low battery, and high prototype disease risk.

## AI prototype boundary

The AI service is deliberately labelled **Prototype ML model**. It uses explainable weighted anomaly scoring and a transparent forecast formula, not a trained clinical or scientific disease classifier. All outputs include scores, confidence, contributing factors, and recommended action. The functions in `server/ai.ts` are replaceable with a trained model or Python service without changing the REST contracts.
