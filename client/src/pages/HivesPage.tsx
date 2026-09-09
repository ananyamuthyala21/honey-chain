import React, { useState } from 'react';
import {
  Box,
  CheckCircle2,
  Wrench,
  AlertCircle,
  Plus,
  Search,
  Thermometer,
  Droplets,
  Scale,
  Activity,
  Calendar,
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Hive, Beekeeper, Language, BeeSpecies, HiveStatus } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { KpiCard } from '../components/KpiCard';
import { TRANSLATIONS } from '../utils/translations';
import { storage } from '../utils/storage';

interface HivesPageProps {
  hives: Hive[];
  beekeepers: Beekeeper[];
  language: Language;
  onHiveAdded: (newHive: Hive) => void;
}

export const HivesPage: React.FC<HivesPageProps> = ({
  hives,
  beekeepers,
  language,
  onHiveAdded
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [beekeeperFilter, setBeekeeperFilter] = useState('All');
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Hive Form State
  const [newHiveName, setNewHiveName] = useState('');
  const [newHiveNumber, setNewHiveNumber] = useState(`HV-TEL-${Math.floor(100 + Math.random() * 900)}`);
  const [newBeekeeperId, setNewBeekeeperId] = useState(beekeepers[0]?.id || 'bk-1');
  const [newSpecies, setNewSpecies] = useState<BeeSpecies>('Apis cerana indica');
  const [newStatus, setNewStatus] = useState<HiveStatus>('Active');
  const [newWeight, setNewWeight] = useState(24.0);
  const [newTemp, setNewTemp] = useState(34.8);
  const [newHumidity, setNewHumidity] = useState(58);
  const [newHealthScore, setNewHealthScore] = useState(92);
  const [newNotes, setNewNotes] = useState('Recently commissioned wooden box with healthy brood.');

  // KPI Calculations
  const totalHives = hives.length;
  const activeHives = hives.filter((h) => h.status === 'Active').length;
  const maintenanceHives = hives.filter((h) => h.status === 'Maintenance').length;
  const inactiveHives = hives.filter((h) => h.status === 'Inactive').length;

  // Filter logic
  const filteredHives = hives.filter((hive) => {
    const matchesSearch =
      hive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.hiveNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.beekeeperName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBeekeeper = beekeeperFilter === 'All' || hive.beekeeperId === beekeeperFilter;
    const matchesSpecies = speciesFilter === 'All' || hive.species === speciesFilter;
    const matchesStatus = statusFilter === 'All' || hive.status === statusFilter;

    return matchesSearch && matchesBeekeeper && matchesSpecies && matchesStatus;
  });

  const handleCreateHiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bk = beekeepers.find((b) => b.id === newBeekeeperId) || beekeepers[0];
    
    const createdHive: Hive = {
      id: `hive-${Date.now()}`,
      name: newHiveName || `New Flora Unit ${newHiveNumber}`,
      hiveNumber: newHiveNumber,
      beekeeperId: bk.id,
      beekeeperName: bk.name,
      village: bk.village,
      state: bk.state,
      species: newSpecies,
      installationDate: new Date().toISOString().split('T')[0],
      status: newStatus,
      currentWeightKg: Number(newWeight),
      currentTempC: Number(newTemp),
      currentHumidity: Number(newHumidity),
      healthScore: Number(newHealthScore),
      queenAgeMonths: 4,
      lastInspectionDate: new Date().toISOString().split('T')[0],
      notes: newNotes
    };

    await storage.saveHive(createdHive);
    onHiveAdded(createdHive);
    setIsRegisterModalOpen(false);

    // Reset form
    setNewHiveName('');
    setNewHiveNumber(`HV-TEL-${Math.floor(100 + Math.random() * 900)}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER: "Hive Management" + "+ Register New Hive" button */}
      <HeroBanner
        id="hives-hero"
        pillText="Precision Colony Registry"
        title="Hive Management"
        description="Comprehensive inventory of instrumented wooden boxes. Tracking queen genetics, thermal insulation, moisture equilibrium, and daily foraging metrics."
        backgroundImageUrl="/assets/clean_hero_apiary.jpg"
        tags={[
          { icon: Box, text: `${totalHives} Registered Units` },
          { icon: ShieldCheck, text: 'Calibrated IoT Sensors' },
          { icon: Sparkles, text: 'Bio-Acoustic Health Monitoring' }
        ]}
        actionButton={{
          id: 'hives-open-register-btn',
          text: t.registerHive,
          icon: Plus,
          onClick: () => setIsRegisterModalOpen(true)
        }}
      />

      {/* 2. KPI CARDS (Total, Active, Maintenance, Inactive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          id="kpi-hives-total"
          label={t.totalHives}
          value={totalHives}
          subtext="Total instrumented units"
          icon={Box}
          theme="gold"
        />
        <KpiCard
          id="kpi-hives-active"
          label={t.active}
          value={activeHives}
          subtext="Active brood rearing & foraging"
          icon={CheckCircle2}
          theme="green"
        />
        <KpiCard
          id="kpi-hives-maintenance"
          label={t.maintenance}
          value={maintenanceHives}
          subtext="Scheduled comb inspection"
          icon={Wrench}
          theme="orange"
        />
        <KpiCard
          id="kpi-hives-inactive"
          label={t.inactive}
          value={inactiveHives}
          subtext="Seasonal repopulation queue"
          icon={AlertCircle}
          theme="amber"
        />
      </div>

      {/* 3. FILTERS + SEARCH BAR */}
      <div className="p-4 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#C99A3A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="hive-search-input"
            type="text"
            placeholder="Search hive number, species, village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] placeholder-[#C9B394]/60 focus:outline-none focus:border-[#C99A3A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Beekeeper filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
            <span>Keeper:</span>
            <select
              id="hive-beekeeper-filter"
              value={beekeeperFilter}
              onChange={(e) => setBeekeeperFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
            >
              <option value="All">All Beekeepers</option>
              {beekeepers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Species filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
            <span>Species:</span>
            <select
              id="hive-species-filter"
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
            >
              <option value="All">All Species</option>
              <option value="Apis cerana indica">Apis cerana indica</option>
              <option value="Apis mellifera">Apis mellifera</option>
              <option value="Apis dorsata">Apis dorsata</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#C9B394]">
            <span>Status:</span>
            <select
              id="hive-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. GRID OF BROWN HIVE CARDS with small download__4_.jpg thumbnail per card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHives.map((hive) => {
          const statusBadgeColors = {
            Active: 'bg-[#639922]/20 text-[#87D636] border-[#639922]/40',
            Maintenance: 'bg-[#E08722]/20 text-[#FFB054] border-[#E08722]/40',
            Inactive: 'bg-[#D85A30]/20 text-[#F27850] border-[#D85A30]/40'
          };

          return (
            <div
              key={hive.id}
              id={`hive-card-${hive.id}`}
              className="p-5 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 flex flex-col justify-between space-y-4 hover:border-[#C99A3A]/60 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Small circular thumbnail repeated on every Hive card using download__4_.jpg */}
                  <img
                    src="/assets/download__4_.jpg"
                    alt="Bees on comb cells"
                    className="w-12 h-12 rounded-full object-cover object-center border-2 border-[#C99A3A] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-[#C99A3A] bg-[#23150D] px-2 py-0.5 rounded border border-[#C99A3A]/20">
                      {hive.hiveNumber}
                    </span>
                    <h3 className="text-base font-extrabold text-[#F2E4C9] mt-1 line-clamp-1">
                      {hive.name}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    statusBadgeColors[hive.status]
                  }`}
                >
                  {hive.status}
                </span>
              </div>

              {/* Species & Location */}
              <div className="text-xs text-[#C9B394] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#C99A3A]">Species:</span>
                  <span className="italic font-semibold text-[#F2E4C9]">{hive.species}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#C99A3A]">Apiarist:</span>
                  <span className="text-[#F2E4C9]">{hive.beekeeperName} ({hive.village})</span>
                </div>
              </div>

              {/* In-Hive Sensors Row */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#C99A3A]/15 text-center">
                <div className="p-2 rounded bg-[#2B1B12] border border-[#C99A3A]/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#C9B394]">
                    <Thermometer className="w-3 h-3 text-[#C99A3A]" />
                    <span>Temp</span>
                  </div>
                  <div className="text-xs font-bold text-[#F2E4C9] mt-0.5">
                    {hive.currentTempC}°C
                  </div>
                </div>

                <div className="p-2 rounded bg-[#2B1B12] border border-[#C99A3A]/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#C9B394]">
                    <Droplets className="w-3 h-3 text-[#C99A3A]" />
                    <span>Hum</span>
                  </div>
                  <div className="text-xs font-bold text-[#F2E4C9] mt-0.5">
                    {hive.currentHumidity}%
                  </div>
                </div>

                <div className="p-2 rounded bg-[#2B1B12] border border-[#C99A3A]/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#C9B394]">
                    <Scale className="w-3 h-3 text-[#C99A3A]" />
                    <span>Weight</span>
                  </div>
                  <div className="text-xs font-bold text-[#F2E4C9] mt-0.5">
                    {hive.currentWeightKg}kg
                  </div>
                </div>

                <div className="p-2 rounded bg-[#2B1B12] border border-[#C99A3A]/10">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#C9B394]">
                    <Activity className="w-3 h-3 text-[#639922]" />
                    <span>Score</span>
                  </div>
                  <div className="text-xs font-bold text-[#87D636] mt-0.5">
                    {hive.healthScore}/100
                  </div>
                </div>
              </div>

              {/* Notes */}
              <p className="text-xs text-[#C9B394] italic line-clamp-2">
                "{hive.notes}"
              </p>
            </div>
          );
        })}
      </div>

      {/* Register New Hive Modal */}
      {isRegisterModalOpen && (
        <div
          id="register-hive-modal-backdrop"
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div
            id="register-hive-modal"
            className="w-full max-w-lg bg-[#2B1B12] border-2 border-[#C99A3A]/50 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#4A2E1F] pb-4">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-[#C99A3A]" />
                <h3 className="text-lg font-bold text-[#F2E4C9]">
                  Register New Hive Unit
                </h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-[#C9B394] hover:text-[#F2E4C9] hover:bg-[#4A2E1F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHiveSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                    Hive Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newHiveNumber}
                    onChange={(e) => setNewHiveNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                    Hive Name / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Adilabad Mustard Box 3"
                    value={newHiveName}
                    onChange={(e) => setNewHiveName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                    Assigned Apiarist
                  </label>
                  <select
                    value={newBeekeeperId}
                    onChange={(e) => setNewBeekeeperId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
                  >
                    {beekeepers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.village})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                    Bee Species
                  </label>
                  <select
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value as BeeSpecies)}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
                  >
                    <option value="Apis cerana indica">Apis cerana indica (Indian)</option>
                    <option value="Apis mellifera">Apis mellifera (European)</option>
                    <option value="Apis dorsata">Apis dorsata (Rock Bee)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#C9B394] block mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#C9B394] block mb-1">
                    Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTemp}
                    onChange={(e) => setNewTemp(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#C9B394] block mb-1">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    value={newHumidity}
                    onChange={(e) => setNewHumidity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C9B394] block mb-1">
                  Field Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1A0F09] border border-[#4A2E1F] rounded-lg text-xs text-[#F2E4C9] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#4A2E1F]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#3A2415] hover:bg-[#4A2E1F] text-xs font-semibold text-[#F2E4C9]"
                >
                  {t.cancel}
                </button>
                <button
                  id="register-hive-submit-btn"
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C99A3A] hover:bg-[#DBAC48] text-xs font-bold text-[#23150D]"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
