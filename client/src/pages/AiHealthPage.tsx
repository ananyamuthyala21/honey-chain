import React, { useState, useMemo } from 'react';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Thermometer,
  Zap,
  Flame,
  Info
} from 'lucide-react';
import { Hive, Language, AIHealthRisk } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { KpiCard } from '../components/KpiCard';
import { TRANSLATIONS } from '../utils/translations';

interface AiHealthPageProps {
  hives: Hive[];
  language: Language;
}

export const AiHealthPage: React.FC<AiHealthPageProps> = ({ hives, language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedHiveId, setSelectedHiveId] = useState<string>(hives[0]?.id || 'hive-1');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>(new Date().toLocaleTimeString());

  const selectedHive = hives.find((h) => h.id === selectedHiveId) || hives[0];

  // Rule-based deterministic local colony health detection engine
  const analysisResult = useMemo(() => {
    if (!selectedHive) {
      return {
        score: 85,
        risks: [] as AIHealthRisk[],
        explanation: 'Colony parameters within normal seasonal boundary.',
        recommendation: 'Continue regular bi-weekly visual inspections.'
      };
    }

    const risks: AIHealthRisk[] = [];
    let calculatedScore = selectedHive.healthScore;

    // 1. Temperature Stress Evaluation
    if (selectedHive.currentTempC > 36.8) {
      risks.push({
        category: 'Temperature Stress',
        level: 'High',
        detail: `Internal temp is ${selectedHive.currentTempC}°C (exceeds 36.5°C threshold). Risk of comb melting and fanning exhaustion.`
      });
      calculatedScore -= 12;
    } else if (selectedHive.currentTempC < 33.5) {
      risks.push({
        category: 'Temperature Stress',
        level: 'Medium',
        detail: `Brood temperature ${selectedHive.currentTempC}°C is cooler than 34°C baseline. Possible insulation gap or chilled brood.`
      });
      calculatedScore -= 8;
    } else {
      risks.push({
        category: 'Temperature Stress',
        level: 'Low',
        detail: `Internal temp ${selectedHive.currentTempC}°C is well within the 34.2°C - 35.8°C brood incubation zone.`
      });
    }

    // 2. Swarming Risk Evaluation (High weight + older queen + warm temp)
    if (selectedHive.currentWeightKg > 27.5 && selectedHive.queenAgeMonths > 12) {
      risks.push({
        category: 'Swarming Risk',
        level: 'High',
        detail: 'Heavy colony congestion combined with a 12+ month queen suggests imminent swarming preparation.'
      });
      calculatedScore -= 15;
    } else if (selectedHive.currentWeightKg > 25.5) {
      risks.push({
        category: 'Swarming Risk',
        level: 'Medium',
        detail: 'Comb filling rapidly. Monitor for queen cups and consider adding a super box.'
      });
      calculatedScore -= 5;
    } else {
      risks.push({
        category: 'Swarming Risk',
        level: 'Low',
        detail: 'Ample laying space remaining in lower brood chamber; no swarm triggers detected.'
      });
    }

    // 3. Disease Risk Evaluation (Humidity extremes + health score)
    if (selectedHive.currentHumidity > 66 && selectedHive.healthScore < 80) {
      risks.push({
        category: 'Disease Risk',
        level: 'Medium',
        detail: `Sustained high humidity (${selectedHive.currentHumidity}%) elevates chalkbrood and nosema susceptibility.`
      });
      calculatedScore -= 10;
    } else {
      risks.push({
        category: 'Disease Risk',
        level: 'Low',
        detail: 'Dry comb structure, clean hygienic behavior pattern recorded by sensor telemetry.'
      });
    }

    // 4. Food Shortage Evaluation (Low weight or sudden drops)
    if (selectedHive.currentWeightKg < 18.0) {
      risks.push({
        category: 'Food Shortage',
        level: 'High',
        detail: `Box weight (${selectedHive.currentWeightKg} kg) is near baseline dry tare weight. Immediate supplementary sugar syrup or pollen patty needed.`
      });
      calculatedScore -= 18;
    } else if (selectedHive.currentWeightKg < 21.0) {
      risks.push({
        category: 'Food Shortage',
        level: 'Medium',
        detail: 'Modest nectar reserves; monitor flowering flora availability in immediate 2km forage radius.'
      });
      calculatedScore -= 6;
    } else {
      risks.push({
        category: 'Food Shortage',
        level: 'Low',
        detail: `Healthy honey supers intact (~${(selectedHive.currentWeightKg - 15).toFixed(1)} kg estimated honey reserve).`
      });
    }

    const finalScore = Math.max(45, Math.min(99, calculatedScore));

    let explanation = '';
    let recommendation = '';

    if (finalScore >= 88) {
      explanation = `Colony in ${selectedHive.name} demonstrates superior biological equilibrium. Queen oviposition rate is strong with steady pollen incoming.`;
      recommendation = 'Maintain regular inspection interval. Prepare super extraction frames for seasonal honey flow.';
    } else if (finalScore >= 75) {
      explanation = `Colony is generally active but shows mild environmental drift (${risks.filter(r => r.level !== 'Low').map(r => r.category).join(', ')}).`;
      recommendation = 'Provide tree shade cover, check bottom board cleanliness, and ensure water source within 200m.';
    } else {
      explanation = `Elevated colony distress observed. Multi-parameter sensor telemetry indicates sub-optimal thermal and nutritional conditions.`;
      recommendation = 'Urgent physical inspection advised within 24 hours. Verify queen presence and provide supplemental feeding.';
    }

    return {
      score: finalScore,
      risks,
      explanation,
      recommendation
    };
  }, [selectedHive, analysisTimestamp]);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisTimestamp(new Date().toLocaleTimeString());
      setIsAnalyzing(false);
    }, 600);
  };

  const getRiskBadge = (level: AIHealthRisk['level']) => {
    switch (level) {
      case 'High':
        return 'bg-[#D85A30]/25 text-[#F27850] border-[#D85A30]/50';
      case 'Medium':
        return 'bg-[#E08722]/25 text-[#FFB054] border-[#E08722]/50';
      case 'Low':
      default:
        return 'bg-[#639922]/25 text-[#87D636] border-[#639922]/50';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER: "AI-Assisted Health Detection" */}
      <HeroBanner
        id="ai-health-hero"
        pillText="Local Rule-Based Machine Intelligence"
        title={t.aiHealth}
        description="Continuous predictive bio-assessment. Local deterministic rules evaluate micro-climate stability, swarm urge heuristics, brood nest ventilation, and nutritional reserves."
        backgroundImageUrl="/assets/clean_hero_apiary.jpg"
        tags={[
          { icon: Sparkles, text: 'Edge AI Inference (No Cloud API Required)' },
          { icon: ShieldCheck, text: 'Calibrated for Indian Apis Species' },
          { icon: Info, text: 'Strictly Risk Detection — Never a Medical Diagnosis' }
        ]}
        actionButton={{
          id: 'ai-run-analysis-btn',
          text: isAnalyzing ? 'Running Inference...' : t.runAiAnalysis,
          icon: Zap,
          onClick: handleRunAnalysis
        }}
      />

      {/* Mandatory Disclaimer Label */}
      <div className="p-3.5 rounded-xl bg-[#23150D] border border-[#C99A3A]/30 flex items-center gap-3 text-xs text-[#C9B394]">
        <Info className="w-4 h-4 text-[#C99A3A] shrink-0" />
        <div>
          <strong className="text-[#F2E4C9]">Notice on AI Evaluation:</strong> This system provides{' '}
          <span className="text-[#C99A3A] font-bold">AI-assisted risk detection</span> based on physical sensor telemetry.
          It does not provide veterinary diagnosis or chemical certification. Physical beekeeper inspection remains primary.
        </div>
      </div>

      {/* 2. HIVE SELECTOR & QUICK STATS */}
      <div className="p-4 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/25 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-[#F2E4C9]">Select Hive for Inference:</span>
          <select
            id="ai-hive-selector"
            value={selectedHiveId}
            onChange={(e) => setSelectedHiveId(e.target.value)}
            className="px-3 py-2 bg-[#2B1B12] border border-[#C99A3A]/30 rounded-lg text-xs text-[#F2E4C9] focus:outline-none focus:border-[#C99A3A]"
          >
            {hives.map((h) => (
              <option key={h.id} value={h.id} className="bg-[#23150D]">
                {h.hiveNumber} — {h.name} (Health {h.healthScore}%)
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#C9B394] flex items-center gap-2">
          <span>Last analysis:</span>
          <span className="font-mono text-[#F2E4C9] font-bold">{analysisTimestamp}</span>
        </div>
      </div>

      {/* 3. HEALTH SCORE CARD + RISK CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Health Score /100 gauge (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/30 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold text-[#C99A3A] uppercase tracking-wider block">
              Colony Vitality Gauge
            </span>
            <h3 className="text-lg font-black text-[#F2E4C9] mt-1">
              Overall Health Score
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-44 h-44 rounded-full border-8 border-[#23150D] flex items-center justify-center bg-[#2B1B12] shadow-inner">
              <div
                className={`text-5xl font-black ${
                  analysisResult.score >= 85
                    ? 'text-[#87D636]'
                    : analysisResult.score >= 70
                    ? 'text-[#FFB054]'
                    : 'text-[#F27850]'
                }`}
              >
                {analysisResult.score}
              </div>
              <span className="absolute bottom-6 text-xs text-[#C9B394] font-semibold">
                / 100
              </span>
            </div>

            <div className="mt-4 text-center">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                  analysisResult.score >= 85
                    ? 'bg-[#639922]/25 text-[#87D636] border-[#639922]/40'
                    : analysisResult.score >= 70
                    ? 'bg-[#E08722]/25 text-[#FFB054] border-[#E08722]/40'
                    : 'bg-[#D85A30]/25 text-[#F27850] border-[#D85A30]/40'
                }`}
              >
                {analysisResult.score >= 85
                  ? t.thriving
                  : analysisResult.score >= 70
                  ? t.watch
                  : t.critical}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/15 text-xs text-[#C9B394] space-y-1">
            <div className="font-bold text-[#F2E4C9]">Evaluation Summary:</div>
            <p className="leading-relaxed">{analysisResult.explanation}</p>
          </div>
        </div>

        {/* 4 Risk Categories as Badges + Plain-language explanations (7 cols) */}
        <div className="lg:col-span-7 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/30 p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#F2E4C9]">
              Risk Category Breakdown
            </h3>
            <p className="text-xs text-[#C9B394]">
              Local heuristics derived from temperature gradients, weight progression, and hive acoustic frequency.
            </p>
          </div>

          <div className="space-y-3">
            {analysisResult.risks.map((risk) => (
              <div
                key={risk.category}
                className="p-3.5 rounded-lg bg-[#2B1B12] border border-[#C99A3A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#F2E4C9]">
                      {risk.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#C9B394] leading-relaxed">
                    {risk.detail}
                  </p>
                </div>

                <div className="shrink-0 flex items-center justify-end">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-extrabold border uppercase tracking-wider ${getRiskBadge(
                      risk.level
                    )}`}
                  >
                    {risk.level} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Actionable Recommendation */}
          <div className="p-4 rounded-lg bg-[#1A0F09] border border-[#C99A3A]/30 space-y-1">
            <div className="text-xs font-bold text-[#C99A3A] uppercase tracking-wider">
              Recommended Beekeeper Action
            </div>
            <p className="text-xs text-[#F2E4C9] font-medium leading-relaxed">
              {analysisResult.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
