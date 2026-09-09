# Honey Chain architecture

Honey Chain is an existing React/TypeScript traceability UI extended with a backend-first prototype service layer. Existing pages, QR screens, charts, fair-price presentation, and local persistence remain intact; backend synchronization can be introduced incrementally because the API contracts are independent of the storage implementation.

```text
React pages
   |
REST API (Express)
   |-- Blockchain service -> persistent ledger store -> SHA-256 linked blocks
   |-- IoT ingestion -> telemetry store -> alert engine
   |-- AI service -> explainable disease risk + productivity forecast
   |-- Traceability service -> immutable lifecycle events + QR verification
   `-- Entity service -> KVIC / cluster hierarchy
```

## Ledger

The current service is a permissioned prototype ledger, not a decentralized public blockchain. Each block stores `blockNumber`, `timestamp`, `previousHash`, `hash`, `nonce`, `batchId`, and a transaction payload. Verification recomputes SHA-256, checks the parent link, checks genesis, and checks contiguous sequence numbers. The service boundary is intentionally narrow so a Hyperledger Fabric adapter can replace `server/blockchain.ts` later.

## IoT

The ingestion contract is HTTP-ready and MQTT-compatible at the boundary. ESP32 devices can POST the same telemetry shape or be connected through an MQTT bridge without changing the dashboard contract. The built-in simulator uses daylight-dependent activity, slowly varying weight, environmental patterns, battery drain, and intentional anomalies. Simulator output is labelled simulation data.

## AI

No training dataset is included in the existing project. The implementation therefore uses a transparent anomaly/risk model and a replaceable forecast function. It must not be described as scientific diagnostic accuracy. Historical measurements are accepted in the request shape so a future training pipeline can be added without changing consumers.

## Rural and KVIC scalability

The entity API supports the hierarchy:

`Institution -> Regional/State Cluster -> District Cluster -> Village/Beekeeping Cluster -> Beekeeper -> Hive -> Honey Batch`.

Roles represented by the domain contract are `ADMIN`, `KVIC_OFFICER`, `CLUSTER_MANAGER`, `BEEKEEPER`, `PROCESSOR`, `LAB_TECHNICIAN`, `DISTRIBUTOR`, and `CONSUMER`. The current demo client retains its existing local session UX; production authorization should be enforced at the API gateway with institution/parent scopes and server-side identity claims.

## Security and authenticity

QR values are opaque verification identifiers, not internal database details. Verification returns `NOT_FOUND` when the backend cannot find a token and never upgrades an API failure to verified. Batch IDs, device IDs, and events are checked for uniqueness/immutability at the service boundary. Production deployment should add signed tokens, rate limits, authentication, encrypted database storage, and audit logging.
