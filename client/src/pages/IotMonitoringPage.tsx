import React, { useState, useMemo } from 'react';
import {
  Radio,
  Thermometer,
  Droplets,
  Scale,
  Activity,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Hive, Language } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { KpiCard } from '../components/KpiCard';
import { TRANSLATIONS } from '../utils/translations';

interface IotMonitoringPageProps {
  hives: Hive[];
  language: Language;
}

type TimeRange = '1H' | '6H' | '24H' | '7D';

export const IotMonitoringPage: React.FC<IotMonitoringPageProps> = ({
  hives,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedHiveId, setSelectedHiveId] = useState<string>(hives[0]?.id || 'hive-1');
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');
  const [simulationTick, setSimulationTick] = useState(0);

  const selectedHive = hives.find((h) => h.id === selectedHiveId) || hives[0];

  // Generate synthetic telemetry data tailored to selected hive & time range
  const telemetryData = useMemo(() => {
    const pointsCount = timeRange === '1H' ? 12 : timeRange === '6H' ? 18 : timeRange === '24H' ? 24 : 14;
    const baseTemp = selectedHive ? selectedHive.currentTempC : 34.8;
    const baseHumidity = selectedHive ? selectedHive.currentHumidity : 58;
    const baseWeight = selectedHive ? selectedHive.currentWeightKg : 24.5;
    const baseActivity = 280;

    const data = [];
    for (let i = pointsCount - 1; i >= 0; i--) {
      let label = '';
      if (timeRange === '1H') label = `-${i * 5}m`;
      else if (timeRange === '6H') label = `-${i * 20}m`;
      else if (timeRange === '24H') label = `${(24 - i) % 24}:00`;
      else label = `Day -${i}`;

      const diurnalEffect = Math.sin((i / pointsCount) * Math.PI * 2);
      const randomNoise = (Math.random() - 0.5) * 0.4;

      const temp = Number((baseTemp + diurnalEffect * 1.2 + randomNoise).toFixed(1));
      const humidity = Math.round(baseHumidity - diurnalEffect * 5 + (Math.random() - 0.5) * 2);
      const weight = Number((baseWeight - (i * 0.04) + Math.abs(randomNoise) * 0.1).toFixed(2));
      const activity = Math.max(50, Math.round(baseActivity + diurnalEffect * 140 + (Math.random() - 0.5) * 30));

      data.push({
        time: label,
        temperature: temp,
        humidity,
        weight,
        activity
      });
    }
    return data;
  }, [selectedHive, timeRange, simulationTick]);

  // KPIs
  const totalHives = hives.length;
  const monitoredCount = hives.filter((h) => h.status !== 'Inactive').length;
  const warningsCount = hives.filter((h) => h.currentTempC > 36.5 || h.healthScore < 80).length;
  const avgTemp = (hives.reduce((acc, h) => acc + h.currentTempC, 0) / (hives.length || 1)).toFixed(1);
  const avgHumidity = Math.round(hives.reduce((acc, h) => acc + h.currentHumidity, 0) / (hives.length || 1));

  const handleSimulateReading = () => {
    setSimulationTick((prev) => prev + 1);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER: "Smart Hive Monitoring" */}
      <HeroBanner
        id="iot-hero"
        pillText="Edge Telemetry & Remote Sensing"
        title={t.iotMonitoring}
        description="Non-invasive bio-telemetry deployed on rural apiary boxes. Continual evaluation of brood nest temperature, relative humidity, colony weight, and forager cadence."
        backgroundImageUrl="/assets/download__4_.jpg"
        tags={[
          { icon: Radio, text: `${monitoredCount} Active Micro-Sensors` },
          { icon: ShieldCheck, text: 'Solar-Powered ESP32 Node' },
          { icon: Sparkles, text: 'Sub-Ghz LoRaWAN Uplink' }
        ]}
        actionButton={{
          id: 'iot-simulate-reading-btn',
          text: t.simulateReading,
          icon: RefreshCw,
          onClick: handleSimulateReading
        }}
      />

      {/* 2. KPI CARDS (Total Hives, Monitored, Warnings, Avg Temp, Avg Humidity) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          id="kpi-iot-total"
          label={t.totalHives}
          value={totalHives}
          subtext="Configured apiary boxes"
          icon={Radio}
          theme="gold"
        />
        <KpiCard
          id="kpi-iot-monitored"
          label={t.monitoredHives}
          value={monitoredCount}
          subtext="Transmitting telemetry"
          icon={CheckCircle2}
          theme="green"
        />
        <KpiCard
          id="kpi-iot-warnings"
          label={t.warnings}
          value={warningsCount}
          subtext="Out of nominal thresholds"
          icon={AlertTriangle}
          theme={warningsCount > 0 ? 'orange' : 'green'}
        />
        <KpiCard
          id="kpi-iot-avg-temp"
          label={t.avgTemp}
          value={`${avgTemp}°C`}
          subtext="Target: 34.5 - 35.5°C"
          icon={Thermometer}
          theme="gold"
        />
        <KpiCard
          id="kpi-iot-avg-humidity"
          label={t.avgHumidity}
          value={`${avgHumidity}%`}
          subtext="Target: 50 - 65%"
          icon={Droplets}
          theme="amber"
        />
      </div>

      {/* 3. CONTROL PANEL: Hive Selector + Time Range Selector */}
      <div className="p-4 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-[#F2E4C9]">Select Target Hive:</span>
          <select
            id="iot-hive-selector"
            value={selectedHiveId}
            onChange={(e) => setSelectedHiveId(e.target.value)}
            className="px-3 py-2 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
          >
            {hives.map((h) => (
              <option key={h.id} value={h.id} className="bg-[#23150D]">
                {h.hiveNumber} — {h.name} ({h.village})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Clock className="w-3.5 h-3.5 text-[#C99A3A]" />
          <span className="text-xs text-[#C9B394]">Timeframe:</span>
          <div className="flex bg-[#2B1B12] rounded-lg p-1 border border-[#C99A3A]/20">
            {(['1H', '6H', '24H', '7D'] as TimeRange[]).map((r) => (
              <button
                key={r}
                id={`iot-range-${r}`}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  timeRange === r
                    ? 'bg-[#C99A3A] text-[#23150D]'
                    : 'text-[#C9B394] hover:text-[#F2E4C9]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOUR CHARTS GRID (Temperature, Humidity, Weight, Activity with Beehive background) */}
      <div className="relative overflow-hidden rounded-2xl border border-[#C99A3A]/30 p-5 md:p-6 bg-[#23150D] shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('/assets/Beehive.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0F09]/95 via-[#23150D]/85 to-[#1A0F09]/95 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <div className="p-5 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#C99A3A]" />
              <h3 className="text-sm font-bold text-[#F2E4C9]">
                Brood Temperature (°C)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#87D636]">
              Current: {selectedHive?.currentTempC}°C
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid stroke="#3A2415" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#C9B394" fontSize={10} />
                <YAxis domain={[30, 39]} stroke="#C9B394" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#23150D',
                    borderColor: '#C99A3A',
                    borderRadius: '8px',
                    color: '#F2E4C9',
                    fontSize: '11px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temp (°C)"
                  stroke="#C99A3A"
                  strokeWidth={2.5}
                  dot={{ fill: '#C99A3A', r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#C9B394] flex items-center justify-between border-t border-[#C99A3A]/15 pt-2">
            <span>Brood core equilibrium: 34.5°C to 35.5°C</span>
            <span className="text-[#87D636]">Thermal stability normal</span>
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="p-5 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#87D636]" />
              <h3 className="text-sm font-bold text-[#F2E4C9]">
                Relative Humidity (%)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#87D636]">
              Current: {selectedHive?.currentHumidity}%
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#639922" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#639922" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#3A2415" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#C9B394" fontSize={10} />
                <YAxis domain={[40, 80]} stroke="#C9B394" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#23150D',
                    borderColor: '#639922',
                    borderRadius: '8px',
                    color: '#F2E4C9',
                    fontSize: '11px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#639922"
                  strokeWidth={2}
                  fill="url(#humGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#C9B394] flex items-center justify-between border-t border-[#C99A3A]/15 pt-2">
            <span>Moisture threshold for honey ripening: &lt; 65%</span>
            <span className="text-[#87D636]">No mold danger</span>
          </div>
        </div>

        {/* Total Weight Chart */}
        <div className="p-5 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#FFB054]" />
              <h3 className="text-sm font-bold text-[#F2E4C9]">
                Total Hive Weight (kg)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#FFB054]">
              Current: {selectedHive?.currentWeightKg} kg
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid stroke="#3A2415" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#C9B394" fontSize={10} />
                <YAxis domain={['auto', 'auto']} stroke="#C9B394" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#23150D',
                    borderColor: '#E08722',
                    borderRadius: '8px',
                    color: '#F2E4C9',
                    fontSize: '11px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#E08722"
                  strokeWidth={2.5}
                  dot={{ fill: '#E08722', r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#C9B394] flex items-center justify-between border-t border-[#C99A3A]/15 pt-2">
            <span>Daily honey accrual: +0.28 kg/day</span>
            <span className="text-[#87D636]">Steady nectar intake</span>
          </div>
        </div>

        {/* Foraging Activity Chart */}
        <div className="p-5 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C99A3A]" />
              <h3 className="text-sm font-bold text-[#F2E4C9]">
                Bee Flight Count (passages/hour)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#87D636]">
              Peak: 380/hr
            </span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="actGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C99A3A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C99A3A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#3A2415" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#C9B394" fontSize={10} />
                <YAxis stroke="#C9B394" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#23150D',
                    borderColor: '#C99A3A',
                    borderRadius: '8px',
                    color: '#F2E4C9',
                    fontSize: '11px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="activity"
                  name="Flight count"
                  stroke="#C99A3A"
                  strokeWidth={2}
                  fill="url(#actGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#C9B394] flex items-center justify-between border-t border-[#C99A3A]/15 pt-2">
            <span>Optical IR sensor at landing board</span>
            <span className="text-[#87D636]">Strong colony flight vigour</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
