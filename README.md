# Honey Chain

Honey Chain is a traceability and apiary operations platform for connecting **hives, beekeepers, IoT telemetry, AI-assisted risk insights, blockchain-linked records, and consumer verification** in one workflow.

The project includes a React and TypeScript web interface, an Express backend, a file-backed prototype data store, explainable anomaly scoring, simulated IoT telemetry, QR-oriented batch verification, and a permissioned SHA-256 linked ledger.

> **Prototype status:** Honey Chain is a working demonstration platform. The ledger is permissioned and prototype-oriented, the IoT readings can be simulated, and the AI outputs are explainable anomaly scores rather than scientifically validated disease diagnoses.

## Features

| Area | Included capability |
|---|---|
| Operations dashboard | Manage beekeepers, hives, batches, telemetry, alerts, and platform KPIs |
| Honey traceability | Create batches and append lifecycle events from harvest through sale |
| Consumer verification | Verify a QR-oriented token and view authenticity evidence and batch history |
| Blockchain prototype | SHA-256 linked blocks with genesis, sequence, parent-link, and tamper checks |
| IoT monitoring | Register devices, ingest telemetry, inspect hive history, and acknowledge alerts |
| Simulation mode | Generate day/night telemetry patterns with intentional anomalies for demonstrations |
| AI insights | Explainable disease-risk scoring and transparent productivity forecasting |
| KVIC-ready hierarchy | Model institutions, clusters, villages, beekeepers, hives, and honey batches |
| Local-first demo | Browser IndexedDB/localStorage fallback keeps the interface usable without a database |
| Multilingual portal | Existing portal screens support English, Hindi, and Telugu flows where implemented |

## Product Flow

```text
Institution / Cluster
        |
     Village
        |
    Beekeeper
        |
       Hive ---- IoT telemetry ----> Alerts and AI insights
        |
   Honey batch ----> Lifecycle events ----> SHA-256 linked ledger
        |
  QR verification ----> Consumer authenticity view
```

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React |
| Backend | Node.js, Express, TypeScript, esbuild |
| Persistence | File-backed JSON store by default; service boundary is replaceable |
| Verification | SHA-256 linked blocks and opaque verification identifiers |
| Testing | Vitest and TypeScript compiler checks |
| Package manager | pnpm |

## Repository Structure

```text
client/
  public/                 Static images, illustrations, and brand assets
  src/
    components/            Shared dashboard and navigation components
    pages/                 Dashboard, monitoring, ledger, and portal pages
    portal/                Portal translations and QR helpers
    utils/                 Browser storage, theme, crypto, and API helpers
    App.tsx                Application shell and page routing
server/
  ai.ts                   Explainable disease-risk and productivity services
  blockchain.ts            SHA-256 linked ledger implementation
  index.ts                Express API and production server entrypoint
  iot.ts                  Telemetry validation, simulation, and alerts
  store.ts                File-backed persistence service
shared/
  const.ts                Shared constants
  types.ts                Shared frontend domain types
docs/
  API.md                  API reference and request contracts
  ARCHITECTURE.md         System design and prototype boundaries
  DEMO.md                 Step-by-step demonstration runbook
```

## Requirements

- Node.js 18 or newer
- pnpm 10 or a compatible pnpm version

## Run Locally

Install dependencies:

```bash
pnpm install
```

Run the Vite development preview:

```bash
pnpm dev
```

The development server uses port `3000` by default. Open `http://localhost:3000` in a browser.

Build the frontend and backend:

```bash
pnpm build
```

Start the production server:

```bash
PORT=3000 pnpm start
```

The production server serves the compiled single-page application and the Express API from the same origin.

## Persistence

The backend uses a file-backed JSON store at `data/honey-chain.json` by default. Set `HONEY_CHAIN_DATA_FILE` to use a different location:

```bash
HONEY_CHAIN_DATA_FILE=/tmp/honey-chain-demo.json PORT=3000 pnpm start
```

The persistence layer is isolated behind `server/store.ts`, which makes it possible to replace the prototype store with PostgreSQL, Prisma, or another durable database without changing the API contracts.

## Validation and Tests

Run the TypeScript check:

```bash
pnpm run check
```

Run the backend service tests:

```bash
pnpm test
```

The current test suite covers cryptographic chain tamper detection, explainable high-risk disease output, and bounded productivity forecasting.

## API Overview

The backend exposes the following route groups:

| Route group | Purpose |
|---|---|
| `/api/health` | Backend readiness and prototype boundary status |
| `/api/blockchain/*` | Inspect, verify, look up, and append ledger blocks |
| `/api/iot/*` | Register devices, ingest telemetry, inspect readings, and manage alerts |
| `/api/ai/*` | Calculate explainable disease-risk and productivity predictions |
| `/api/batches/*` | Create batches and append lifecycle events |
| `/api/verify/:token` | Verify a batch token and return authenticity evidence |
| `/api/entities` | Create and list hierarchy entities |
| `/api/kvic/overview` | Return hierarchy and aggregate counts |

For the complete route list and payload contracts, see [`docs/API.md`](docs/API.md).

## Example API Requests

Register an IoT device:

```bash
curl -X POST http://localhost:3000/api/iot/devices \
  -H 'Content-Type: application/json' \
  -d '{
    "deviceId": "ESP32-HIVE-001",
    "hiveId": "HIVE-001",
    "protocol": "HTTP",
    "label": "North apiary sensor"
  }'
```

Start simulated telemetry:

```bash
curl -X POST http://localhost:3000/api/iot/simulation/start \
  -H 'Content-Type: application/json' \
  -d '{"hiveIds":["HIVE-001"]}'
```

Check blockchain integrity:

```bash
curl http://localhost:3000/api/blockchain/verify
```

Request an explainable disease-risk score:

```bash
curl -X POST http://localhost:3000/api/ai/disease-risk \
  -H 'Content-Type: application/json' \
  -d '{
    "temperature": 41,
    "humidity": 84,
    "hiveWeight": 30,
    "beeActivity": 20,
    "colonyHealth": 50
  }'
```

## Demo Runbook

1. Start the application with `pnpm build && PORT=3000 pnpm start`.
2. Open the dashboard and use the existing local demo login flow.
3. Register a device and start the IoT simulation.
4. Inspect `/api/iot/alerts` to see generated warning and critical conditions.
5. Use the AI endpoints to show risk factors, confidence, and recommended actions.
6. Create a honey batch and retain the returned verification token.
7. Append lifecycle events such as `QUALITY_TESTED`, `PROCESSED`, `PACKAGED`, `TRANSFERRED`, and `SOLD`.
8. Open `/api/verify/:token` to display authenticity status, scores, ledger integrity, and the lifecycle timeline.
9. Open `/api/kvic/overview` to inspect the scalable institution-to-honey-batch hierarchy.

The full runbook is available in [`docs/DEMO.md`](docs/DEMO.md).

## Architecture and Production Boundaries

The current ledger is a **permissioned custom prototype**, not a decentralized public blockchain. It stores block numbers, timestamps, parent hashes, block hashes, nonces, batch identifiers, and transaction payloads. Verification recomputes hashes and checks the genesis block, parent links, and sequence continuity.

The IoT boundary accepts HTTP-ready telemetry and can be connected to MQTT through an adapter. The included simulator is explicitly labelled simulation data.

The AI service uses transparent weighted anomaly scoring and a replaceable forecast formula. It does not claim clinical, scientific, or diagnostic accuracy. A trained model or separate Python service can replace the implementation without changing the REST contracts.

Production deployment should add server-side authentication and authorization, signed verification tokens, rate limiting, encrypted durable storage, audit logging, input hardening, and operational monitoring.

For more detail, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Contributing

1. Create a feature branch.
2. Install dependencies with `pnpm install`.
3. Make the smallest focused change possible.
4. Run `pnpm run check`, `pnpm test`, and `pnpm build`.
5. Update the relevant documentation when an API or workflow changes.
6. Open a pull request with a concise summary and verification notes.

## License

This repository currently declares the MIT license in `package.json`. Add the full license text to a `LICENSE` file before publishing the repository publicly if it is not already present.

## References

[1]: https://nodejs.org/ "Node.js official documentation"
[2]: https://pnpm.io/ "pnpm official documentation"
[3]: https://react.dev/ "React official documentation"
[4]: https://expressjs.com/ "Express official documentation"
[5]: https://vitest.dev/ "Vitest official documentation"
