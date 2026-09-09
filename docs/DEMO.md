# Honey Chain demo runbook

1. Start the app with `pnpm build && PORT=3000 pnpm start` and open `http://localhost:3000`.
2. Use the existing demo login and dashboard pages. Existing seeded demo records remain available offline in the browser.
3. Register a device with `POST /api/iot/devices`, then start simulation with `POST /api/iot/simulation/start`.
4. Open `/api/iot/alerts` to show critical and warning alerts. The simulator intentionally creates an anomaly for demonstration.
5. Send a feature payload to `/api/ai/disease-risk` and show the score, level, reasons, and recommended action. Use `/api/ai/productivity/predict` for harvest range and trend.
6. Create a batch with `POST /api/batches`; the response includes a QR verification URL, a `HARVESTED` traceability event, and its ledger block.
7. Append lifecycle events through `/api/batches/:batchId/events` for quality testing, processing, packaging, transfer, and sale.
8. Open the returned `/api/verify/:token` response to show `GENUINE`, the authenticity score, blockchain/database status, and complete timeline.
9. Open `/api/blockchain/verify` to show `VERIFIED` integrity. The existing blockchain explorer remains available in the UI for the browser-seeded demo chain.
10. Open `/api/kvic/overview` to show the scalable institution/cluster/village hierarchy contract.

All generated telemetry is explicitly simulation data and all AI outputs are explicitly prototype/anomaly-based. No real sensor, decentralized public chain, or scientifically validated disease diagnosis is claimed.
