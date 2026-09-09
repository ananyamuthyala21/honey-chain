import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  Plus,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  DollarSign,
  Droplets,
  Calendar,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import QRCode from 'qrcode';
import { HoneyBatch, Hive, Beekeeper, Language, BlockchainBlock } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { KpiCard } from '../components/KpiCard';
import { TRANSLATIONS } from '../utils/translations';
import { storage } from '../utils/storage';
import { createBlock } from '../utils/crypto';

interface BatchesPageProps {
  batches: HoneyBatch[];
  hives: Hive[];
  beekeepers: Beekeeper[];
  blocks: BlockchainBlock[];
  language: Language;
  onBatchCreated: (newBatch: HoneyBatch, newBlock: BlockchainBlock) => void;
  onNavigateToVerify: (batchId: string) => void;
}

export const BatchesPage: React.FC<BatchesPageProps> = ({
  batches,
  hives,
  beekeepers,
  blocks,
  language,
  onBatchCreated,
  onNavigateToVerify
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBatchForQr, setSelectedBatchForQr] = useState<HoneyBatch | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [createdSuccessBatch, setCreatedSuccessBatch] = useState<HoneyBatch | null>(null);

  // New Batch Form State
  const [selectedHiveId, setSelectedHiveId] = useState(hives[0]?.id || 'hive-1');
  const [nectarSource, setNectarSource] = useState('Wild Mustard & Karanj Flora');
  const [quantityKg, setQuantityKg] = useState(40);
  const [salePrice, setSalePrice] = useState(550);
  const [referenceMsp, setReferenceMsp] = useState(450);
  const [moisture, setMoisture] = useState(17.4);
  const [facility, setFacility] = useState('KVIC Apiary Processing Unit, Telangana');

  const totalBatches = batches.length;
  const verifiedBatches = batches.filter((b) => b.verificationStatus === 'Verified').length;
  const pendingBatches = batches.filter((b) => b.verificationStatus === 'Pending').length;

  // Open QR modal and generate QR data URL
  const handleShowQr = async (batch: HoneyBatch) => {
    setSelectedBatchForQr(batch);
    try {
      const url = await QRCode.toDataURL(batch.qrPayloadUrl || `https://hivetrust.local/verify/${batch.id}`, {
        width: 280,
        margin: 2,
        color: {
          dark: '#23150D',
          light: '#F2E4C9'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  // Submit New Batch
  const handleCreateBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hive = hives.find((h) => h.id === selectedHiveId) || hives[0];
    const beekeeper = beekeepers.find((b) => b.id === hive.beekeeperId) || beekeepers[0];

    const newBatchId = `HT-2026-TE-${String(batches.length + 1).padStart(2, '0')}`;
    const harvestDate = new Date().toISOString().split('T')[0];
    const packagingDate = harvestDate;
    const blockNumber = blocks.length;
    const previousHash = blocks.length > 0 ? blocks[blocks.length - 1].hash : '0'.repeat(64);

    // 1. Create real cryptographic block for this batch
    const newBlock = await createBlock(
      {
        batchId: newBatchId,
        beekeeperId: beekeeper.id,
        hiveId: hive.id,
        harvestDate,
        quantityKg: Number(quantityKg),
        nectarSource,
        purityIndex: 99.5,
        fairPricePaid: Number(salePrice),
        action: 'BATCH_VERIFIED_AND_CERTIFIED'
      },
      previousHash,
      blockNumber
    );

    // Save block to storage
    await storage.saveBlock(newBlock);

    // 2. Create and save Batch
    const newBatch: HoneyBatch = {
      id: newBatchId,
      batchNumber: newBatchId,
      hiveId: hive.id,
      hiveNumber: hive.hiveNumber,
      beekeeperId: beekeeper.id,
      beekeeperName: beekeeper.name,
      village: beekeeper.village,
      state: beekeeper.state,
      botanicalNectarSource: nectarSource,
      harvestDate,
      packagingDate,
      quantityKg: Number(quantityKg),
      salePricePerKg: Number(salePrice),
      referenceMspPerKg: Number(referenceMsp),
      moisturePercent: Number(moisture),
      purityIndex: 99.5,
      pollenCountPpm: 1550,
      rawUnpasteurized: true,
      coldExtracted: true,
      blockHash: newBlock.hash,
      blockNumber,
      verificationStatus: 'Verified',
      packagingFacility: facility,
      qrPayloadUrl: `https://hivetrust.local/verify/${newBatchId}`
    };

    await storage.saveBatch(newBatch);
    onBatchCreated(newBatch, newBlock);

    setIsCreateModalOpen(false);
    setCreatedSuccessBatch(newBatch);
  };

  const handleShareWhatsApp = (batch: HoneyBatch) => {
    const text = `🍯 HIVETRUST Honey Verification: Batch #${batch.id}
Harvested by ${batch.beekeeperName} at ${batch.village}, ${batch.state}.
Pure raw unpasteurized honey certified with cryptographic blockchain proof!
Fair Price: ₹${batch.salePricePerKg}/kg (MSP: ₹${batch.referenceMspPerKg}/kg).
Verify full jar provenance: ${batch.qrPayloadUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER: "Honey Batches" + "+ Create New Batch" button */}
      <HeroBanner
        id="batches-hero"
        pillText="Certified Production Lots"
        title={t.honeyBatches}
        description="Immutable registry of packaged raw honey lots. Each lot is cryptographically linked to its origin hive and certified with fair MSP pricing."
        backgroundImageUrl="/assets/clean_hero_apiary.jpg"
        tags={[
          { icon: Package, text: `${totalBatches} Sealed Batches` },
          { icon: ShieldCheck, text: 'SHA-256 Block Chained' },
          { icon: DollarSign, text: 'Fair MSP Verified' }
        ]}
        actionButton={{
          id: 'batches-open-create-btn',
          text: t.createBatch,
          icon: Plus,
          onClick: () => setIsCreateModalOpen(true)
        }}
      />

      {/* 2. KPI CARDS (Total Batches, Verified, Pending) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KpiCard
          id="kpi-total-batches"
          label={t.totalBatches}
          value={totalBatches}
          subtext="Certified harvest lots"
          icon={Package}
          theme="gold"
        />
        <KpiCard
          id="kpi-verified-batches"
          label={t.verified}
          value={verifiedBatches}
          subtext="Block confirmed in ledger"
          icon={CheckCircle2}
          theme="green"
        />
        <KpiCard
          id="kpi-pending-batches"
          label={t.pending}
          value={pendingBatches}
          subtext="Awaiting lab moisture sign-off"
          icon={Clock}
          theme="amber"
        />
      </div>

      {/* Success banner if a batch was just created */}
      {createdSuccessBatch && (
        <div
          id="batch-created-success-banner"
          className="p-4 rounded-xl bg-[#23150D] border-2 border-[#639922] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#639922]/30 flex items-center justify-center shrink-0">
              <Check className="w-6 h-6 text-[#87D636]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#F2E4C9]">
                Batch #{createdSuccessBatch.id} Created & Chained to Block #{createdSuccessBatch.blockNumber}!
              </div>
              <p className="text-xs text-[#C9B394]">
                Hash: <span className="font-mono text-[#C99A3A]">{createdSuccessBatch.blockHash.slice(0, 20)}...</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleShowQr(createdSuccessBatch)}
              className="px-3 py-1.5 rounded-lg bg-[#3A2415] hover:bg-[#4A2E1F] text-xs font-bold text-[#F2E4C9] flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-[#C99A3A]" />
              <span>View QR Code</span>
            </button>
            <button
              onClick={() => onNavigateToVerify(createdSuccessBatch.id)}
              className="px-3.5 py-1.5 rounded-lg bg-[#C99A3A] hover:bg-[#DBAC48] text-xs font-bold text-[#23150D]"
            >
              Verify Jar Now
            </button>
            <button
              onClick={() => setCreatedSuccessBatch(null)}
              className="text-[#C9B394] hover:text-[#F2E4C9]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. BATCHES CARDS LIST with FAIR PRICE INDICATOR & WHATSAPP SHARE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F2E4C9]">
            Certified Honey Batches
          </h2>
          <span className="text-xs text-[#C9B394]">
            Reference MSP: <strong className="text-[#F2E4C9]">₹450 / kg</strong> (Demo reference standard)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {batches.map((batch) => {
            const isFairPrice = batch.salePricePerKg >= batch.referenceMspPerKg;
            const priceDiff = batch.salePricePerKg - batch.referenceMspPerKg;

            return (
              <div
                key={batch.id}
                id={`batch-card-${batch.id}`}
                className="p-6 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 flex flex-col justify-between space-y-4 hover:border-[#C99A3A]/60 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-black text-[#C99A3A] bg-[#23150D] px-2.5 py-1 rounded border border-[#C99A3A]/30">
                          {batch.id}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#639922]/20 text-[#87D636] border border-[#639922]/30">
                          {t.verified}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[#F2E4C9] mt-2">
                        {batch.botanicalNectarSource}
                      </h3>
                    </div>

                    <button
                      id={`batch-qr-btn-${batch.id}`}
                      onClick={() => handleShowQr(batch)}
                      className="p-2 rounded-lg bg-[#2B1B12] hover:bg-[#3A2415] border border-[#C99A3A]/30 text-[#C99A3A] flex items-center justify-center shrink-0"
                      title="Generate and view consumer QR code"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-xs text-[#C9B394] space-y-1 mt-3">
                    <div className="flex items-center justify-between">
                      <span>Harvested by:</span>
                      <strong className="text-[#F2E4C9]">{batch.beekeeperName} ({batch.village})</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Hive Unit:</span>
                      <span className="font-mono text-[#F2E4C9]">{batch.hiveNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Harvest Date:</span>
                      <span className="text-[#F2E4C9]">{batch.harvestDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Packaging Lot Size:</span>
                      <strong className="text-[#F2E4C9]">{batch.quantityKg} kg (Lab Purity {batch.purityIndex}%)</strong>
                    </div>
                  </div>
                </div>

                {/* FAIR PRICE INDICATOR (sale price vs reference MSP) */}
                <div
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                    isFairPrice
                      ? 'bg-[#23150D] border-[#639922]/40 text-[#87D636]'
                      : 'bg-[#23150D] border-[#D85A30]/40 text-[#F27850]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isFairPrice ? (
                      <CheckCircle2 className="w-5 h-5 text-[#87D636] shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-[#F27850] shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {isFairPrice
                          ? `Fair Price Verified: ₹${batch.salePricePerKg}/kg (+₹${priceDiff} above MSP)`
                          : `Below Reference MSP: ₹${batch.salePricePerKg}/kg (-₹${Math.abs(priceDiff)})`}
                      </div>
                      <span className="text-[10px] text-[#C9B394]">
                        Reference price for demo purposes (Base MSP ₹{batch.referenceMspPerKg}/kg)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Info & Action Buttons */}
                <div className="pt-2 border-t border-[#C99A3A]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-[#C9B394] font-mono truncate max-w-[200px]">
                    Block #{batch.blockNumber}: {batch.blockHash ? `${batch.blockHash.slice(0, 12)}...` : 'Pending'}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* WhatsApp Share Button */}
                    <button
                      id={`batch-share-btn-${batch.id}`}
                      onClick={() => handleShareWhatsApp(batch)}
                      className="px-3 py-1.5 rounded-lg bg-[#2B1B12] hover:bg-[#3A2415] border border-[#639922]/50 text-xs font-bold text-[#87D636] flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Direct link to consumer verification */}
                    <button
                      id={`batch-verify-direct-btn-${batch.id}`}
                      onClick={() => onNavigateToVerify(batch.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#C99A3A] hover:bg-[#DBAC48] text-xs font-bold text-[#23150D] flex items-center gap-1.5"
                    >
                      <span>Verify Jar</span>
                      <ExternalLink className="w-3 h-3 text-[#23150D]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create New Batch Modal */}
      {isCreateModalOpen && (
        <div
          id="create-batch-modal-backdrop"
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div
            id="create-batch-modal"
            className="w-full max-w-lg bg-[#2B1B12] border-2 border-[#C99A3A]/50 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#4A2E1F] pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#C99A3A]" />
                <h3 className="text-lg font-bold text-[#F2E4C9]">
                  {t.createBatch}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#C9B394] hover:text-[#F2E4C9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatchSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                  Source Hive Unit
                </label>
                <select
                  value={selectedHiveId}
                  onChange={(e) => setSelectedHiveId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
                >
                  {hives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hiveNumber} — {h.name} (Keeper: {h.beekeeperName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                  Botanical Nectar Flora
                </label>
                <input
                  type="text"
                  required
                  value={nectarSource}
                  onChange={(e) => setNectarSource(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                    Lot Quantity (kg)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(parseFloat(e.target.value) || 17.5)}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                  />
                </div>
              </div>

              {/* Fair Price Inputs */}
              <div className="p-3.5 rounded-xl bg-[#1A0F09] border border-[#C99A3A]/20 space-y-3">
                <div className="text-xs font-bold text-[#C99A3A]">
                  Fair Price & MSP Reference Comparison
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#C9B394] block mb-1">
                      Sale Price (₹/kg)
                    </label>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-[#2B1B12] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#C9B394] block mb-1">
                      Reference MSP (₹/kg)
                    </label>
                    <input
                      type="number"
                      value={referenceMsp}
                      onChange={(e) => setReferenceMsp(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-[#2B1B12] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-[11px]">
                  {salePrice >= referenceMsp ? (
                    <span className="text-[#87D636] font-bold">
                      ✓ Passes Fair Price Test: +₹{salePrice - referenceMsp} above reference MSP.
                    </span>
                  ) : (
                    <span className="text-[#F27850] font-bold">
                      ⚠️ Note: This batch is ₹{referenceMsp - salePrice} below reference MSP.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                  Packaging Facility
                </label>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#4A2E1F]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#3A2415] hover:bg-[#4A2E1F] text-xs font-semibold text-[#F2E4C9]"
                >
                  {t.cancel}
                </button>
                <button
                  id="create-batch-submit-btn"
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C99A3A] hover:bg-[#DBAC48] text-xs font-black text-[#23150D]"
                >
                  Mint Block & Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal Display */}
      {selectedBatchForQr && (
        <div
          id="batch-qr-modal-backdrop"
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div
            id="batch-qr-modal"
            className="w-full max-w-sm bg-[#2B1B12] border-2 border-[#C99A3A] rounded-2xl p-6 shadow-2xl text-center space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#4A2E1F] pb-3">
              <span className="text-xs font-mono font-bold text-[#C99A3A]">
                {selectedBatchForQr.id}
              </span>
              <button
                onClick={() => setSelectedBatchForQr(null)}
                className="p-1 rounded-lg text-[#C9B394] hover:text-[#F2E4C9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#F2E4C9]">
                Consumer QR Label
              </h3>
              <p className="text-xs text-[#C9B394]">
                Print and apply to honey jar lid or label
              </p>
            </div>

            {/* Rendered QR image */}
            <div className="p-4 bg-[#F2E4C9] rounded-xl flex items-center justify-center mx-auto shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${selectedBatchForQr.id}`}
                  className="w-56 h-56"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-[#23150D] text-xs">
                  Generating QR Code...
                </div>
              )}
            </div>

            <div className="text-[11px] text-[#C9B394] font-mono break-all bg-[#1A0F09] p-2 rounded border border-[#4A2E1F]">
              {selectedBatchForQr.qrPayloadUrl}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => handleShareWhatsApp(selectedBatchForQr)}
                className="w-full py-2.5 rounded-lg bg-[#3A2415] hover:bg-[#4A2E1F] border border-[#639922]/40 text-xs font-bold text-[#87D636] flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
