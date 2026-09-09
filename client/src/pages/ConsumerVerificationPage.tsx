import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  Award,
  Sparkles,
  Droplets,
  Scale,
  Flame,
  Search,
  ExternalLink,
  DollarSign,
  Share2,
  Layers,
  ArrowRight,
  Info,
  QrCode
} from 'lucide-react';
import QRCode from 'qrcode';
import { HoneyBatch, Beekeeper, Hive, Language, ActivePage } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { TRANSLATIONS } from '../utils/translations';

interface ConsumerVerificationPageProps {
  batches: HoneyBatch[];
  beekeepers: Beekeeper[];
  hives: Hive[];
  initialBatchId?: string;
  language: Language;
  onNavigate: (page: ActivePage) => void;
}

export const ConsumerVerificationPage: React.FC<ConsumerVerificationPageProps> = ({
  batches,
  beekeepers,
  hives,
  initialBatchId,
  language,
  onNavigate
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Batch selector state
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    initialBatchId || batches[0]?.id || 'HT-2026-TE-01'
  );
  const [customInputId, setCustomInputId] = useState('');

  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const currentBeekeeper = beekeepers.find((b) => b.id === currentBatch?.beekeeperId) || beekeepers[0];
  const currentHive = hives.find((h) => h.id === currentBatch?.hiveId) || hives[0];
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!currentBatch) return;
    QRCode.toDataURL(currentBatch.qrPayloadUrl || `${window.location.origin}/verify/${currentBatch.id}`, {
      width: 240,
      margin: 2,
      color: { dark: '#23150D', light: '#FFFDF7' }
    }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
  }, [currentBatch]);

  const handleLookupBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customInputId.trim().toUpperCase();
    const match = batches.find((b) => b.id.toUpperCase() === query || b.batchNumber.toUpperCase() === query);
    if (match) {
      setSelectedBatchId(match.id);
    }
  };

  const handleShareJarVerification = () => {
    if (!currentBatch) return;
    const text = `🍯 Verified Pure Honey Bottle #${currentBatch.id}
Harvested by ${currentBatch.beekeeperName} at ${currentBatch.village}, ${currentBatch.state}.
Cryptographically verified on HIVETRUST (KVIC Honey Mission Ecosystem).
Purity: ${currentBatch.purityIndex}% | Moisture: ${currentBatch.moisturePercent}%
Check proof: ${currentBatch.qrPayloadUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER: "From Hive to Home, Every Drop Verified" */}
      <HeroBanner
        id="verification-hero"
        pillText="Consumer Transparency Portal"
        title="From Hive to Home, Every Drop Verified"
        description="Public authenticity verification for single-origin Indian forest honey. Trace this exact jar back to the wild foraging apiary, rural beekeeper, and immutable blockchain ledger."
        backgroundImageUrl="/assets/clean_hero_apiary.jpg"
        tags={[
          { icon: ShieldCheck, text: 'Cryptographically Verified Lot' },
          { icon: Award, text: 'Designed for KVIC Honey Mission Ecosystem' },
          { icon: Sparkles, text: '100% Raw & Cold Extracted' }
        ]}
        actionButton={{
          id: 'verification-share-btn',
          text: 'Share Jar Story',
          icon: Share2,
          onClick: handleShareJarVerification
        }}
      />

      {/* 2. BATCH LOOKUP / SELECTOR BAR */}
      <div className="p-4 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-[#F2E4C9]">Select Batch on Jar:</span>
          <select
            id="verify-batch-selector"
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="px-3 py-2 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs font-mono font-bold text-[#C99A3A] focus:outline-none focus:border-[#C99A3A]"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id} className="bg-[#23150D]">
                {b.id} — {b.botanicalNectarSource} ({b.beekeeperName})
              </option>
            ))}
          </select>
        </div>

        {/* Custom batch search */}
        <form onSubmit={handleLookupBatch} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Or enter Jar Batch ID (e.g. HT-2026-TE-01)..."
            value={customInputId}
            onChange={(e) => setCustomInputId(e.target.value)}
            className="px-3 py-2 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] placeholder-[#C9B394]/60 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#C99A3A] hover:bg-[#DBAC48] text-xs font-bold text-[#23150D] shrink-0"
          >
            Verify
          </button>
        </form>
      </div>

      {currentBatch && (
        <div id="beekeeper-qr-workspace" className="p-6 rounded-2xl bg-[#F2E4C9] border-2 border-[#C99A3A] text-[#23150D] shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#8C6219]">
              <QrCode className="w-6 h-6" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">Beekeeper QR verification</p>
            </div>
            <h2 className="mt-2 text-2xl font-black">Generate a QR for this honey batch</h2>
            <p className="mt-2 text-sm text-[#5A3A26]">Print or share this code so customers can verify the exact hive-to-home record stored in the beekeeper portal.</p>
            <p className="mt-4 break-all rounded-lg bg-white/70 px-3 py-2 text-xs font-mono">{currentBatch.qrPayloadUrl || `${window.location.origin}/verify/${currentBatch.id}`}</p>
          </div>
          <div className="flex h-52 w-52 shrink-0 items-center justify-center rounded-xl bg-white p-3 shadow-lg">
            {qrDataUrl ? <img src={qrDataUrl} alt={`QR code for ${currentBatch.id}`} className="h-full w-full" /> : <QrCode className="h-16 w-16 text-[#8C6219]" />}
          </div>
        </div>
      )}

      {currentBatch && (
        <div className="space-y-8">
          {/* Main Authenticity Certificate Card */}
          <div
            id="authenticity-certificate"
            className="p-6 md:p-8 rounded-2xl bg-[#4A2E1F] border-2 border-[#C99A3A] shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C99A3A]/30 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#C99A3A] bg-[#23150D] px-3 py-1 rounded-md border border-[#C99A3A]/30">
                    BATCH #{currentBatch.id}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#639922]/20 text-[#87D636] border border-[#639922]/40 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Certified Genuine</span>
                  </span>
                </div>
                <h2 className="text-2xl font-black text-[#F2E4C9] mt-3">
                  {currentBatch.botanicalNectarSource}
                </h2>
                <p className="text-xs text-[#C9B394] mt-1">
                  Bottled at {currentBatch.packagingFacility} • Harvest date: {currentBatch.harvestDate}
                </p>
              </div>

              {/* Blockchain Badge with Block Hash */}
              <div
                id="blockchain-verification-badge"
                className="p-4 rounded-xl bg-[#23150D] border border-[#C99A3A]/40 flex flex-col justify-between space-y-2 shrink-0 md:max-w-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#C99A3A] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Blockchain Block #{currentBatch.blockNumber}</span>
                  </span>
                  <span className="text-[10px] text-[#87D636] font-mono font-bold">
                    ✓ Verified
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#C9B394] break-all">
                  Hash: {currentBatch.blockHash}
                </div>
                <button
                  id="view-full-ledger-link"
                  onClick={() => onNavigate('blockchain')}
                  className="inline-flex items-center gap-1 text-[11px] text-[#C99A3A] hover:underline font-bold pt-1"
                >
                  <span>Inspect in Public Ledger</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 3. 5-STEP TIMELINE (Hive Origin, Apiary Care, Harvesting & Extraction, Quality Testing & Sealing, Blockchain Verification) */}
            <div className="py-8 border-b border-[#C99A3A]/30">
              <h3 className="text-sm font-extrabold text-[#C99A3A] uppercase tracking-wider mb-6">
                5-Step Provenance Journey
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-[#2B1B12] border border-[#C99A3A]/25 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#639922]/20 border border-[#639922] flex items-center justify-center text-xs font-black text-[#87D636]">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-[#F2E4C9]">1. Hive Origin</div>
                  <p className="text-[11px] text-[#C9B394]">
                    Box {currentBatch.hiveNumber} installed in {currentBatch.village}, {currentBatch.state}. Wild flora nectar.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-[#2B1B12] border border-[#C99A3A]/25 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#639922]/20 border border-[#639922] flex items-center justify-center text-xs font-black text-[#87D636]">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-[#F2E4C9]">2. Apiary Care</div>
                  <p className="text-[11px] text-[#C9B394]">
                    Tended by {currentBatch.beekeeperName}. Continuous IoT thermal and weight telemetry monitoring.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-[#2B1B12] border border-[#C99A3A]/25 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#639922]/20 border border-[#639922] flex items-center justify-center text-xs font-black text-[#87D636]">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-[#F2E4C9]">3. Harvesting & Extraction</div>
                  <p className="text-[11px] text-[#C9B394]">
                    Cold centrifugally extracted on {currentBatch.harvestDate}. Sealed unheated to preserve live enzymes.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl bg-[#2B1B12] border border-[#C99A3A]/25 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#639922]/20 border border-[#639922] flex items-center justify-center text-xs font-black text-[#87D636]">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-[#F2E4C9]">4. Quality Testing & Sealing</div>
                  <p className="text-[11px] text-[#C9B394]">
                    Moisture {currentBatch.moisturePercent}% (&lt; 20% limit). Pollen index {currentBatch.pollenCountPpm} ppm. Batch sealed.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-xl bg-[#2B1B12] border border-[#C99A3A]/25 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#639922]/20 border border-[#639922] flex items-center justify-center text-xs font-black text-[#87D636]">
                    ✓
                  </div>
                  <div className="text-xs font-bold text-[#F2E4C9]">5. Blockchain Verification</div>
                  <p className="text-[11px] text-[#C9B394]">
                    Immutably minted on Block #{currentBatch.blockNumber} with SHA-256 cryptographic linkage.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. DETAILS ROW: Beekeeper Profile Card + Honey Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-8">
              {/* Beekeeper Profile Card (5 cols) */}
              <div
                id="beekeeper-provenance-card"
                className="lg:col-span-5 p-6 rounded-xl bg-[#2B1B12] border border-[#C99A3A]/30 space-y-4"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail with download__4_.jpg */}
                  <img
                    src="/assets/download__4_.jpg"
                    alt={`Bees tending golden honeycomb — ${currentBeekeeper.name}`}
                    className="w-16 h-16 rounded-full object-cover object-center border-2 border-[#C99A3A] shadow-md shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#87D636] uppercase tracking-wider block">
                      Origin Apiarist
                    </span>
                    <h4 className="text-base font-extrabold text-[#F2E4C9]">
                      {currentBeekeeper.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B394] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C99A3A]" />
                      <span>{currentBeekeeper.village}, {currentBeekeeper.district}, {currentBeekeeper.state}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#C9B394] leading-relaxed">
                  A certified rural apiarist under the Khadi and Village Industries Commission (KVIC) Honey Mission ecosystem, cultivating indigenous colonies since {currentBeekeeper.joinedYear}.
                </p>

                {/* Fair Price Note */}
                <div className="p-3.5 rounded-lg bg-[#23150D] border border-[#639922]/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#87D636] flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Fair Beekeeper Compensation</span>
                    </span>
                    <span className="font-black text-[#F2E4C9]">
                      ₹{currentBatch.salePricePerKg}/kg
                    </span>
                  </div>
                  <p className="text-[11px] text-[#C9B394]">
                    The beekeeper received ₹{currentBatch.salePricePerKg}/kg, safely exceeding the reference MSP of ₹{currentBatch.referenceMspPerKg}/kg. (Reference price for demo purposes).
                  </p>
                </div>
              </div>

              {/* Honey Profile Details (7 cols) */}
              <div
                id="honey-profile-details"
                className="lg:col-span-7 p-6 rounded-xl bg-[#2B1B12] border border-[#C99A3A]/30 flex flex-col justify-between space-y-4"
              >
                <div>
                  <h4 className="text-sm font-extrabold text-[#C99A3A] uppercase tracking-wider">
                    Physical & Chemical Honey Profile
                  </h4>
                  <p className="text-xs text-[#C9B394] mt-0.5">
                    Laboratory verified benchmarks for raw, unadulterated forest honey.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-[#1A0F09] border border-[#C99A3A]/15">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
                      <Droplets className="w-3.5 h-3.5 text-[#C99A3A]" />
                      <span>Moisture</span>
                    </div>
                    <div className="text-lg font-black text-[#F2E4C9] mt-1">
                      {currentBatch.moisturePercent}%
                    </div>
                    <span className="text-[10px] text-[#87D636]">Passed (&lt; 20% limit)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1A0F09] border border-[#C99A3A]/15">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
                      <Sparkles className="w-3.5 h-3.5 text-[#C99A3A]" />
                      <span>Purity Index</span>
                    </div>
                    <div className="text-lg font-black text-[#87D636] mt-1">
                      {currentBatch.purityIndex}%
                    </div>
                    <span className="text-[10px] text-[#87D636]">C-4 Sugar Free</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1A0F09] border border-[#C99A3A]/15">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
                      <Award className="w-3.5 h-3.5 text-[#C99A3A]" />
                      <span>Pollen Density</span>
                    </div>
                    <div className="text-lg font-black text-[#F2E4C9] mt-1">
                      {currentBatch.pollenCountPpm} ppm
                    </div>
                    <span className="text-[10px] text-[#87D636]">Microscopic Count</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-[#1A0F09] border border-[#639922]/30 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#87D636] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#F2E4C9]">Raw & Unpasteurized</div>
                      <span className="text-[10px] text-[#C9B394]">Natural diastase enzymes intact</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1A0F09] border border-[#639922]/30 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#87D636] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#F2E4C9]">Cold Extracted</div>
                      <span className="text-[10px] text-[#C9B394]">No artificial thermal processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
