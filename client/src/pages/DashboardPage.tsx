import React, { useState, useEffect } from 'react';
import {
  Box,
  HeartPulse,
  AlertTriangle,
  Package,
  TrendingUp,
  Sparkles,
  Users,
  Radio,
  Thermometer,
  Droplets,
  Scale,
  Activity,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Hive, Beekeeper, HoneyBatch, Language, ActivePage } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { KpiCard } from '../components/KpiCard';
import { FeatureCards } from '../components/FeatureCards';
import { TRANSLATIONS } from '../utils/translations';

interface DashboardPageProps {
  hives: Hive[];
  beekeepers: Beekeeper[];
  batches: HoneyBatch[];
  language: Language;
  onNavigate: (page: ActivePage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  hives,
  beekeepers,
  batches,
  language,
  onNavigate
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Live "Hive Pulse" simulated widget updating every 3.5 seconds
  const [pulseHive, setPulseHive] = useState({
    temp: 34.8,
    humidity: 58,
    weight: 24.6,
    activity: 342,
    soundHz: 218,
    lastUpdate: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseHive((prev) => {
        // Realistic biological jitter
        const tempDelta = (Math.random() - 0.5) * 0.2;
        const humDelta = (Math.random() - 0.5) * 0.8;
        const weightDelta = (Math.random() - 0.45) * 0.05; // slight daytime gain
        const actDelta = Math.floor((Math.random() - 0.5) * 16);

        return {
          temp: Number(Math.max(32, Math.min(37.5, prev.temp + tempDelta)).toFixed(1)),
          humidity: Math.round(Math.max(45, Math.min(75, prev.humidity + humDelta))),
          weight: Number(Math.max(18, Math.min(32, prev.weight + weightDelta)).toFixed(2)),
          activity: Math.max(120, Math.min(520, prev.activity + actDelta)),
          soundHz: Math.round(210 + Math.random() * 20),
          lastUpdate: new Date().toLocaleTimeString()
        };
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  // Compute metrics
  const totalHives = hives.length;
  const healthyHives = hives.filter((h) => h.healthScore >= 80).length;
  const needsAttentionHives = hives.filter((h) => h.healthScore < 80 || h.status === 'Maintenance').length;
  const totalHoneyStockKg = batches.reduce((acc, b) => acc + b.quantityKg, 0);

  // Expected Harvest (computed locally from hive weight trend + activity + health score)
  const averageWeight = hives.length > 0
    ? hives.reduce((acc, h) => acc + h.currentWeightKg, 0) / hives.length
    : 22;
  const avgHealth = hives.length > 0
    ? hives.reduce((acc, h) => acc + h.healthScore, 0) / hives.length
    : 85;
  // Local prediction formula: (Total Active Hives) * (Average Weight excess over base 15kg brood box) * (Health/100) * 1.8
  const activeHivesCount = hives.filter(h => h.status === 'Active').length;
  const expectedHarvestKg = Math.round(
    Math.max(40, activeHivesCount * Math.max(2, averageWeight - 15) * (avgHealth / 100) * 2.1)
  );

  // Trend chart data (6-month harvest trend for cooperative)
  const harvestTrendData = [
    { month: 'Oct', harvest: 140, purity: 98.8, mspDiff: 70 },
    { month: 'Nov', harvest: 185, purity: 99.1, mspDiff: 90 },
    { month: 'Dec', harvest: 220, purity: 99.4, mspDiff: 110 },
    { month: 'Jan', harvest: 290, purity: 99.2, mspDiff: 140 },
    { month: 'Feb', harvest: 340, purity: 99.6, mspDiff: 170 },
    { month: 'Mar', harvest: expectedHarvestKg, purity: 99.5, mspDiff: 190 }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER: "Good morning, Beekeeper" with Honey Pot & Dipper image beside title */}
      <HeroBanner
        id="dashboard-hero"
        pillText="Apiary Operations Center"
        title="Good morning, Beekeeper"
        description="Live monitoring of Telangana & Andhra Pradesh forest apiaries. Telemetry, fair price verification, and blockchain consensus running normally."
        backgroundImageUrl="/assets/clean_hero_apiary.jpg"
        sideImageUrl="/assets/download-5.jpg"
        sideImageAlt="Pure Raw Honey Pot with Wooden Dipper"
        tags={[
          { icon: Radio, text: `${hives.length} Hives Online` },
          { icon: ShieldCheck, text: 'KVIC Honey Mission Ecosystem' },
          { icon: Sparkles, text: 'Consensus Block Synchronized' }
        ]}
        actionButton={{
          id: 'dashboard-create-batch-btn',
          text: t.createBatch,
          icon: Package,
          onClick: () => onNavigate('batches')
        }}
      />

      {/* 2. KPI CARDS ROW (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          id="kpi-total-hives"
          label={t.totalHives}
          value={totalHives}
          subtext="Distributed across 4 apiaries"
          icon={Box}
          theme="gold"
        />
        <KpiCard
          id="kpi-healthy-hives"
          label={t.healthy}
          value={healthyHives}
          subtext={`${Math.round((healthyHives / (totalHives || 1)) * 100)}% colony vitality rate`}
          icon={HeartPulse}
          theme="green"
        />
        <KpiCard
          id="kpi-attention-hives"
          label={t.needsAttention}
          value={needsAttentionHives}
          subtext="Requires brood & temp inspection"
          icon={AlertTriangle}
          theme="orange"
        />
        <KpiCard
          id="kpi-honey-stock"
          label={t.honeyStock}
          value={`${totalHoneyStockKg} kg`}
          subtext="Certified sealed & packaged"
          icon={Package}
          theme="gold"
        />
        <KpiCard
          id="kpi-expected-harvest"
          label={t.expectedHarvest}
          value={`~${expectedHarvestKg} kg`}
          subtext="* Prototype prediction model"
          icon={TrendingUp}
          theme="amber"
          trend={{ value: '+18% vs last cycle', positive: true }}
        />
      </div>

      {/* 3. MAIN CONTENT ROW: Live "Hive Pulse" Widget + Recharts Trend Chart + Beekeeper Preview (with Beehive.jpg background) */}
      <div className="relative overflow-hidden rounded-2xl border border-[#C99A3A]/40 p-5 md:p-6 bg-[#23150D] shadow-2xl">
        {/* Real Beehive & Honeycomb photo in background */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('/assets/Beehive.jpg')` }}
        />
        {/* Honeycomb vector pattern accent */}
        <div className="absolute inset-0 bg-honeycomb-pattern opacity-30 pointer-events-none" />
        {/* Soft dark gradient overlay for optimal chart legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0F09]/95 via-[#23150D]/85 to-[#1A0F09]/95 pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C99A3A]/20 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C99A3A] animate-pulse" />
              <h2 className="text-lg md:text-xl font-bold text-[#F2E4C9] tracking-tight font-display">
                Apiary Telemetry & Verified Yield Dynamics
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#C9B394]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A2415]/80 border border-[#C99A3A]/30 text-[#C99A3A] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#C99A3A]" />
                Live Sensor Feed & Harvest Trend
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live "Hive Pulse" Widget (4 cols) */}
            <div
              id="hive-pulse-widget"
              className="relative overflow-hidden lg:col-span-4 rounded-xl bg-[#3A2415]/90 border border-[#C99A3A]/30 p-6 flex flex-col justify-between shadow-lg"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
                style={{ backgroundImage: `url('/assets/Beehive.jpg')` }}
              />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#87D636] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#639922]"></span>
                    </span>
                    <h3 className="text-base font-extrabold text-[#F2E4C9] tracking-tight">
                      Live Hive Pulse
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#C99A3A] bg-[#23150D] px-2 py-1 rounded border border-[#C99A3A]/20">
                    Adilabad HV-101
                  </span>
                </div>

                <p className="text-xs text-[#C9B394]">
                  Real-time telemetry stream from in-hive multi-sensor array. Refreshes live.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/20">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
                      <Thermometer className="w-3.5 h-3.5 text-[#C99A3A]" />
                      <span>Temp</span>
                    </div>
                    <div className="text-xl font-black text-[#F2E4C9] mt-1">
                      {pulseHive.temp}°C
                    </div>
                    <span className="text-[10px] text-[#87D636]">Optimal 34-36°C</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/20">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
                      <Droplets className="w-3.5 h-3.5 text-[#C99A3A]" />
                      <span>Humidity</span>
                    </div>
                    <div className="text-xl font-black text-[#F2E4C9] mt-1">
                      {pulseHive.humidity}%
                    </div>
                    <span className="text-[10px] text-[#87D636]">Good &lt;65%</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/20">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
                      <Scale className="w-3.5 h-3.5 text-[#C99A3A]" />
                      <span>Weight</span>
                    </div>
                    <div className="text-xl font-black text-[#F2E4C9] mt-1">
                      {pulseHive.weight} kg
                    </div>
                    <span className="text-[10px] text-[#87D636]">+0.24 kg / 24h</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/20">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
                      <Activity className="w-3.5 h-3.5 text-[#C99A3A]" />
                      <span>Activity</span>
                    </div>
                    <div className="text-xl font-black text-[#F2E4C9] mt-1">
                      {pulseHive.activity}/h
                    </div>
                    <span className="text-[10px] text-[#87D636]">High Foraging</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-[#C99A3A]/20 flex items-center justify-between text-xs">
                <span className="text-[#C9B394] text-[11px]">
                  Last ping: <span className="font-mono text-[#F2E4C9]">{pulseHive.lastUpdate}</span>
                </span>
                <button
                  id="pulse-full-telemetry-btn"
                  onClick={() => onNavigate('iot')}
                  className="inline-flex items-center gap-1 text-[#C99A3A] hover:underline font-bold text-xs"
                >
                  <span>Full IoT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cooperative Trend Chart (5 cols) */}
            <div
              id="harvest-trend-panel"
              className="relative overflow-hidden lg:col-span-5 rounded-xl bg-[#3A2415]/90 border border-[#C99A3A]/30 p-6 flex flex-col justify-between shadow-lg"
            >
              {/* Honeycomb background specifically behind the harvest graph */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
                style={{ backgroundImage: `url('/assets/Beehive.jpg')` }}
              />
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#F2E4C9] tracking-tight">
                    Cooperative Yield & Purity Index
                  </h3>
                  <span className="text-[10px] font-bold text-[#87D636] bg-[#639922]/20 px-2 py-0.5 rounded border border-[#639922]/30">
                    99.4% Avg Purity
                  </span>
                </div>
                <p className="text-xs text-[#C9B394]">
                  Monthly verified harvest yield (kg) and certified laboratory moisture index.
                </p>
              </div>

              <div className="relative z-10 h-56 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={harvestTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C99A3A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#C99A3A" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#3A2415" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#C9B394" fontSize={11} tickLine={false} />
                    <YAxis stroke="#C9B394" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#23150D',
                        borderColor: '#C99A3A',
                        borderRadius: '8px',
                        color: '#F2E4C9',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }}
                      itemStyle={{ color: '#C99A3A' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="harvest"
                      name="Harvest (kg)"
                      stroke="#C99A3A"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#goldGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="relative z-10 pt-2 flex items-center justify-between text-xs text-[#C9B394] border-t border-[#C99A3A]/15">
                <span>Baseline MSP: ₹450/kg</span>
                <span className="text-[#87D636] font-semibold">Consistently +₹110 above MSP</span>
              </div>
            </div>

            {/* Beekeeper Directory Preview Panel (3 cols) */}
            <div
              id="beekeepers-preview-panel"
              className="relative overflow-hidden lg:col-span-3 rounded-xl bg-[#3A2415]/90 border border-[#C99A3A]/30 p-6 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#F2E4C9] tracking-tight">
                    Beekeepers
                  </h3>
                  <button
                    id="view-all-beekeepers-btn"
                    onClick={() => onNavigate('beekeepers')}
                    className="text-[11px] font-bold text-[#C99A3A] hover:underline"
                  >
                    View All
                  </button>
                </div>
                <p className="text-xs text-[#C9B394]">
                  Lead cooperative apiarists
                </p>

                <div className="space-y-3 pt-2">
                  {beekeepers.slice(0, 3).map((bk) => (
                    <div
                      key={bk.id}
                      className="p-3 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/20 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* Small circular thumbnail using download__4_.jpg per mapping */}
                        <img
                          src="/assets/download__4_.jpg"
                          alt={bk.name}
                          className="w-10 h-10 rounded-full object-cover object-center border border-[#C99A3A]/50 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#F2E4C9] truncate">
                            {bk.name}
                          </div>
                          <div className="text-[10px] text-[#C9B394] truncate">
                            {bk.village}, {bk.district}
                          </div>
                          <div className="text-[10px] text-[#C99A3A]">
                            {bk.hivesCount} Hives • {bk.totalHoneyProducedKg}kg total
                          </div>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#639922]/20 text-[#87D636] border border-[#639922]/30">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                id="manage-coop-beekeepers-btn"
                onClick={() => onNavigate('beekeepers')}
                className="w-full mt-4 py-2 rounded-lg bg-[#2B1B12] hover:bg-[#1A0F09] border border-[#C99A3A]/30 text-xs font-bold text-[#F2E4C9] text-center"
              >
                Manage Cooperative Roster
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PLATFORM FEATURES SECTION (Below the main content row) */}
      <div id="dashboard-platform-features" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#F2E4C9] tracking-tight font-display">
              {t.platformFeatures}
            </h2>
            <p className="text-xs text-[#C9B394]">
              Cryptographic integrity, automated IoT sensing, and fair pricing assurance.
            </p>
          </div>
          <span className="text-xs font-mono text-[#C99A3A] bg-[#23150D] px-2.5 py-1 rounded border border-[#C99A3A]/20">
            SHA-256 Enabled
          </span>
        </div>

        {/* The exact 4 FEATURE CARDS */}
        <FeatureCards language={language} />
      </div>
    </div>
  );
};
