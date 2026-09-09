import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appendBlock, ensureGenesis, verifyChain, type LedgerBlock } from "./blockchain";
import { diseaseRisk, productivityPrediction } from "./ai";
import { ingestTelemetry, latestTelemetry, startSimulation, stopSimulation, validateTelemetry } from "./iot";
import { id, store, type JsonRecord } from "./store";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json({ limit: "1mb" }));
const jsonError = (res: express.Response, status: number, message: string) => res.status(status).json({ error: message });

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "Honey Chain prototype backend", prototypeBoundaries: ["permissioned custom ledger", "file-backed persistence", "anomaly-based AI", "simulated IoT"] }));
app.get("/api/blockchain", (_req, res) => res.json({ blocks: store.get("blocks"), integrity: verifyChain(), architecture: "Prototype permissioned ledger; Hyperledger-ready service boundary" }));
app.get("/api/blockchain/verify", (_req, res) => res.json(verifyChain()));
app.get("/api/blockchain/blocks/:id", (req, res) => {
  const block = (store.get("blocks") as LedgerBlock[]).find(item => item.id === req.params.id || String(item.blockNumber) === req.params.id);
  return block ? res.json(block) : jsonError(res, 404, "Block not found");
});
app.get("/api/blockchain/batch/:batchId", (req, res) => res.json((store.get("blocks") as LedgerBlock[]).filter(block => block.batchId === req.params.batchId)));
app.post("/api/blockchain/blocks", async (req, res) => {
  const { batchId, data } = req.body ?? {};
  if (!batchId || !data || typeof data !== "object") return jsonError(res, 400, "batchId and object data are required");
  const block = await appendBlock(String(batchId), data as JsonRecord);
  return res.status(201).json({ block, integrity: verifyChain() });
});

app.post("/api/iot/devices", async (req, res) => {
  const { deviceId, hiveId, protocol = "HTTP", label = deviceId } = req.body ?? {};
  if (!deviceId || !hiveId) return jsonError(res, 400, "deviceId and hiveId are required");
  const devices = store.get("devices") as JsonRecord[];
  if (devices.some(device => device.deviceId === deviceId)) return jsonError(res, 409, "deviceId already registered");
  const device = { id: id("device"), deviceId, hiveId, label, protocol, status: "REGISTERED", registeredAt: new Date().toISOString() };
  devices.push(device); await store.persist(); return res.status(201).json(device);
});
app.get("/api/iot/devices", (_req, res) => res.json(store.get("devices")));
app.post("/api/iot/telemetry", async (req, res) => {
  const errors = validateTelemetry(req.body ?? {});
  if (errors.length) return jsonError(res, 400, errors.join("; "));
  try { return res.status(201).json(await ingestTelemetry(req.body)); } catch (error) { return jsonError(res, 400, (error as Error).message); }
});
app.get("/api/iot/hives/:hiveId/telemetry", (req, res) => res.json((store.get("telemetry") as JsonRecord[]).filter(item => item.hiveId === req.params.hiveId).slice(-200)));
app.get("/api/iot/hives/:hiveId/latest", (req, res) => res.json(latestTelemetry(req.params.hiveId)));
app.get("/api/iot/alerts", (req, res) => {
  const alerts = store.get("alerts") as JsonRecord[];
  res.json(req.query.hiveId ? alerts.filter(alert => alert.hiveId === req.query.hiveId) : alerts);
});
app.post("/api/iot/alerts/:alertId/acknowledge", async (req, res) => {
  const alert = (store.get("alerts") as JsonRecord[]).find(item => item.alertId === req.params.alertId);
  if (!alert) return jsonError(res, 404, "Alert not found");
  alert.acknowledged = true; alert.acknowledgedAt = new Date().toISOString(); await store.persist(); return res.json(alert);
});
app.post("/api/iot/simulation/start", async (req, res) => res.json(await startSimulation(req.body?.hiveIds)));
app.post("/api/iot/simulation/stop", (_req, res) => res.json(stopSimulation()));

app.post("/api/ai/disease-risk", (req, res) => res.json(diseaseRisk(req.body ?? {})));
app.post("/api/ai/productivity/predict", (req, res) => res.json(productivityPrediction(req.body ?? {})));

app.post("/api/batches", async (req, res) => {
  const batch = req.body ?? {};
  if (!batch.batchId || !batch.hiveId || !batch.beekeeperId) return jsonError(res, 400, "batchId, hiveId and beekeeperId are required");
  const batches = store.get("batches") as JsonRecord[];
  if (batches.some(item => item.batchId === batch.batchId)) return jsonError(res, 409, "batchId already exists");
  const savedBatch = { ...batch, id: id("batch"), qrVerificationId: id("qr"), createdAt: new Date().toISOString(), verificationStatus: "PENDING" };
  const block = await appendBlock(String(batch.batchId), { action: "HARVESTED", ...batch });
  savedBatch.blockNumber = block.blockNumber; savedBatch.blockHash = block.hash; batches.push(savedBatch);
  (store.get("traceabilityEvents") as JsonRecord[]).push({ eventId: id("event"), batchId: batch.batchId, eventType: "HARVESTED", timestamp: new Date().toISOString(), actor: batch.beekeeperId, location: batch.village ?? "unspecified", metadata: {}, blockReference: block.id });
  await store.persist(); return res.status(201).json({ batch: savedBatch, block, verificationUrl: `/verify/${savedBatch.qrVerificationId}` });
});
app.get("/api/batches/:batchId/events", (req, res) => res.json((store.get("traceabilityEvents") as JsonRecord[]).filter(event => event.batchId === req.params.batchId)));
app.post("/api/batches/:batchId/events", async (req, res) => {
  const batch = (store.get("batches") as JsonRecord[]).find(item => item.batchId === req.params.batchId);
  if (!batch) return jsonError(res, 404, "Batch not found");
  const allowed = ["COLLECTED", "QUALITY_TESTED", "PROCESSED", "PACKAGED", "TRANSFERRED", "SOLD"];
  if (!allowed.includes(req.body?.eventType)) return jsonError(res, 400, "Unsupported lifecycle event");
  const block = await appendBlock(req.params.batchId, { action: req.body.eventType, metadata: req.body.metadata ?? {} });
  const event = { eventId: id("event"), batchId: req.params.batchId, eventType: req.body.eventType, timestamp: new Date().toISOString(), actor: req.body.actor ?? "system", location: req.body.location ?? "unspecified", metadata: req.body.metadata ?? {}, blockReference: block.id };
  (store.get("traceabilityEvents") as JsonRecord[]).push(event); await store.persist(); return res.status(201).json({ event, block });
});
app.get("/api/verify/:token", (req, res) => {
  const batch = (store.get("batches") as JsonRecord[]).find(item => item.qrVerificationId === req.params.token);
  if (!batch) return res.json({ authenticity: "NOT_FOUND", blockchainVerified: false, databaseVerified: false, offlineDemoVerification: false });
  const integrity = verifyChain(); const events = (store.get("traceabilityEvents") as JsonRecord[]).filter(event => event.batchId === batch.batchId);
  const blockchainVerified = integrity.isValid && events.every(event => Boolean(event.blockReference));
  return res.json({ authenticity: blockchainVerified ? "GENUINE" : "SUSPICIOUS", authenticityScore: blockchainVerified ? 96 : 38, blockchainVerified, databaseVerified: true, offlineDemoVerification: false, batch, events, integrity });
});

app.post("/api/entities", async (req, res) => {
  const { entityType, name, parentId, role } = req.body ?? {};
  if (!entityType || !name) return jsonError(res, 400, "entityType and name are required");
  const entity = { id: id(entityType.toLowerCase()), entityType, name, parentId: parentId ?? null, role: role ?? null, createdAt: new Date().toISOString() };
  (store.get("entities") as JsonRecord[]).push(entity); await store.persist(); return res.status(201).json(entity);
});
app.get("/api/entities", (_req, res) => res.json(store.get("entities")));
app.get("/api/kvic/overview", (_req, res) => res.json({ hierarchy: ["INSTITUTION", "REGIONAL_CLUSTER", "DISTRICT_CLUSTER", "VILLAGE", "BEEKEEPER", "HIVE", "HONEY_BATCH"], entities: store.get("entities"), totals: { entities: store.get("entities").length, batches: store.get("batches").length, telemetryReadings: store.get("telemetry").length } }));

const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
app.use(express.static(staticPath));
app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));

async function startServer() {
  await store.load(); await ensureGenesis();
  createServer(app).listen(Number(process.env.PORT ?? 3000), () => console.log(`Honey Chain backend running on http://localhost:${process.env.PORT ?? 3000}/`));
}
startServer().catch(error => { console.error(error); process.exitCode = 1; });
