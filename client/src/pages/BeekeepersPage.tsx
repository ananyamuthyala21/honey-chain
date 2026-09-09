import React, { useState } from 'react';
import {
  Users,
  Box,
  CheckCircle2,
  Search,
  Phone,
  MapPin,
  Award,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Beekeeper, Hive, Language } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { KpiCard } from '../components/KpiCard';
import { TRANSLATIONS } from '../utils/translations';

interface BeekeepersPageProps {
  beekeepers: Beekeeper[];
  hives: Hive[];
  language: Language;
}

export const BeekeepersPage: React.FC<BeekeepersPageProps> = ({
  beekeepers,
  hives,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');

  const totalBeekeepers = beekeepers.length;
  const totalRegisteredHives = hives.length;
  const activeBeekeepers = beekeepers.filter((b) => b.activeStatus).length;
  const activeRate = Math.round((activeBeekeepers / (totalBeekeepers || 1)) * 100);

  const districts = ['All', ...Array.from(new Set(beekeepers.map((b) => b.district)))];

  const filteredBeekeepers = beekeepers.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter === 'All' || b.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER */}
      <HeroBanner
        id="beekeepers-hero"
        pillText="Cooperative Community Registry"
        title={t.beekeepers}
        description="Empowering tribal and rural apiarists across Telangana and Andhra Pradesh with fair compensation, IoT telemetry gear, and transparent blockchain receipts."
        backgroundImageUrl="/assets/clean_hero_apiary.jpg"
        tags={[
          { icon: Users, text: `${totalBeekeepers} Registered Apiarists` },
          { icon: ShieldCheck, text: 'KVIC Honey Mission Certified' },
          { icon: Sparkles, text: 'Direct Bank Settlement (DBT)' }
        ]}
      />

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KpiCard
          id="kpi-total-beekeepers"
          label={t.totalBeekeepers}
          value={totalBeekeepers}
          subtext="Certified rural honey producers"
          icon={Users}
          theme="gold"
        />
        <KpiCard
          id="kpi-registered-hives"
          label={t.registeredHives}
          value={totalRegisteredHives}
          subtext="Sensor-instrumented wooden boxes"
          icon={Box}
          theme="amber"
        />
        <KpiCard
          id="kpi-active-rate"
          label={t.activeRate}
          value={`${activeRate}%`}
          subtext="Consistently harvesting & logging"
          icon={CheckCircle2}
          theme="green"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#C99A3A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="beekeeper-search-input"
            type="text"
            placeholder="Search by name, code, village, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] placeholder-[#C9B394]/60 focus:outline-none focus:border-[#C99A3A]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-[#C9B394] shrink-0">Region:</span>
          <select
            id="beekeeper-region-filter"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
          >
            {districts.map((d) => (
              <option key={d} value={d} className="bg-[#23150D]">
                {d === 'All' ? 'All Districts' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Beekeepers Grid (Searchable directory of beekeeper cards with download__4_.jpg thumbnail) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBeekeepers.map((beekeeper) => {
          const beekeeperHives = hives.filter((h) => h.beekeeperId === beekeeper.id);

          return (
            <div
              key={beekeeper.id}
              id={`beekeeper-card-${beekeeper.id}`}
              className="p-6 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 flex flex-col justify-between space-y-4 hover:border-[#C99A3A]/60 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Small circular thumbnail repeated on every Beekeeper card using download__4_.jpg */}
                <div className="relative shrink-0">
                  <img
                    src="/assets/download__4_.jpg"
                    alt={`Bees tending honeycomb — ${beekeeper.name}`}
                    className="w-16 h-16 rounded-full object-cover object-center border-2 border-[#C99A3A] shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#639922] border-2 border-[#4A2E1F]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-[#F2E4C9] truncate">
                      {beekeeper.name}
                    </h3>
                    <span className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#639922]/20 text-[#87D636] border border-[#639922]/30">
                      {t.active}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-[#C99A3A] bg-[#23150D] px-2 py-0.5 rounded border border-[#C99A3A]/20">
                      {beekeeper.code}
                    </span>
                    <span className="text-[11px] text-[#C9B394]">
                      Batch {beekeeper.kvicBatchId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#C9B394] mt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C99A3A] shrink-0" />
                    <span>{beekeeper.village}, {beekeeper.district}, {beekeeper.state}</span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-[#C99A3A]/20 text-center">
                <div className="p-2 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/15">
                  <div className="text-[10px] text-[#C9B394]">Hives Owned</div>
                  <div className="text-sm font-black text-[#F2E4C9] mt-0.5">
                    {beekeeper.hivesCount}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/15">
                  <div className="text-[10px] text-[#C9B394]">Total Honey</div>
                  <div className="text-sm font-black text-[#87D636] mt-0.5">
                    {beekeeper.totalHoneyProducedKg} kg
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/15">
                  <div className="text-[10px] text-[#C9B394]">Certified Since</div>
                  <div className="text-sm font-black text-[#C99A3A] mt-0.5">
                    {beekeeper.joinedYear}
                  </div>
                </div>
              </div>

              {/* Contact & Hives tags */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#C9B394]">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Phone className="w-3 h-3 text-[#C99A3A]" />
                  <span>{beekeeper.phone}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#87D636]" />
                  <span className="text-[11px] text-[#87D636] font-semibold">
                    KVIC Certified Trainer
                  </span>
                </div>
              </div>

              {/* Connected Hives summary */}
              <div className="pt-2 border-t border-[#C99A3A]/10 text-xs text-[#C9B394] flex items-center justify-between">
                <span>Managed boxes:</span>
                <div className="flex items-center gap-1.5">
                  {beekeeperHives.map((h) => (
                    <span
                      key={h.id}
                      className="px-2 py-0.5 rounded bg-[#23150D] text-[10px] font-mono text-[#F2E4C9] border border-[#C99A3A]/20"
                    >
                      {h.hiveNumber}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
