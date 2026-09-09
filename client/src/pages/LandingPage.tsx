import React from 'react';
import { ShieldCheck, ArrowRight, QrCode, Sparkles } from 'lucide-react';
import { ActivePage, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { FeatureCards } from '../components/FeatureCards';
import { ThemeMode } from '../utils/theme';

interface LandingPageProps {
  onNavigate: (page: ActivePage) => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-[#2B1B12] text-[#F2E4C9] flex flex-col justify-between selection:bg-[#C99A3A] selection:text-[#23150D]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 w-full bg-[#23150D]/90 backdrop-blur-md border-b border-[#4A2E1F] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F2E4C9] p-1 shadow-md flex items-center justify-center overflow-hidden">
              <img
                src="/madhusatya-logo.svg"
                alt="HIVETRUST logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-widest text-[#F2E4C9] block font-display">
                HIVETRUST
              </span>
              <span className="text-[10px] text-[#C99A3A] font-semibold tracking-wide block">
                {t.tagline}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick verify button */}
            <button
              id="landing-nav-verify-btn"
              onClick={() => onNavigate('verify')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3A2415] hover:bg-[#4A2E1F] border border-[#C99A3A]/40 text-xs font-bold text-[#F2E4C9]"
            >
              <QrCode className="w-3.5 h-3.5 text-[#C99A3A]" />
              <span>{t.verifyHoney}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section: In-Hive Flight & Honeycomb Food Sharing Scene */}
      <section className="relative w-full overflow-hidden bg-[#0A140E] py-16 lg:py-24 px-6 border-b border-[#EAB308]/30">
        {/* Full-bleed high-res photo of bee hovering in flight over honeycomb frame */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/assets/bee_flight_comb.jpg')` }}
        />
        {/* Optical contrast dark gradient overlay ensuring crisp bold readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A140E]/90 via-[#0F1D15]/85 to-[#0A140E]/95" />
        {/* Hexagon pattern texture overlay */}
        <div className="absolute inset-0 bg-honeycomb-pattern opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/75 border border-[#EAB308]/60 text-xs font-black text-[#EAB308] tracking-widest uppercase shadow-2xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#EAB308]" />
            <span className="font-black">{t.designedFor}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight font-display drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            HIVETRUST
          </h1>

          <p className="text-2xl sm:text-3xl font-black text-[#EAB308] max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] tracking-tight">
            "{t.tagline}"
          </p>

          {/* High contrast container ensuring 100% bold visibility */}
          <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-black/65 border border-[#EAB308]/35 backdrop-blur-md shadow-2xl">
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed drop-shadow-md">
              {t.heroDescription}
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="landing-enter-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#EAB308] hover:bg-[#FACC15] text-[#1A0F09] font-black text-base shadow-2xl transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <span className="font-black text-base tracking-wide">{t.enterDashboard}</span>
              <ArrowRight className="w-5 h-5 text-[#1A0F09] stroke-[3]" />
            </button>

            <button
              id="landing-consumer-verify-btn"
              onClick={() => onNavigate('verify')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-black/80 hover:bg-black/95 border-2 border-[#EAB308] text-white font-black text-base shadow-2xl transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <QrCode className="w-5 h-5 text-[#EAB308] stroke-[2.5]" />
              <span className="font-black text-base tracking-wide">{t.verifyHoney}</span>
            </button>
          </div>

          {/* Quick trust metrics with bold high-contrast text */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-xl bg-black/80 border border-[#EAB308]/40 shadow-xl backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-[#EAB308]">{t.originPurity}</div>
              <div className="text-lg font-black text-white mt-1">{t.rawComb}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/80 border border-[#EAB308]/40 shadow-xl backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">{t.fairMspReference}</div>
              <div className="text-lg font-black text-[#4ADE80] mt-1">{t.mspBaseline}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/80 border border-[#EAB308]/40 shadow-xl backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-[#EAB308]">{t.consensusChain}</div>
              <div className="text-lg font-black text-white mt-1">{t.shaBlocks}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/80 border border-[#EAB308]/40 shadow-xl backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">{t.smartTelemetry}</div>
              <div className="text-lg font-black text-white mt-1">{t.liveIotSync}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apiary Focus Section: Showcasing the Honeycomb & Hovering Bee in Detail */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl overflow-hidden bg-[#14241B] border-2 border-[#EAB308]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-[420px] overflow-hidden bg-black">
            <img
              src="/assets/bee_flight_comb.jpg"
              alt="Honey bee hovering in mid-flight above a cluster of worker bees on raw honeycomb cells"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/85 border border-[#EAB308]/40 backdrop-blur-md">
              <div className="text-xs font-black text-[#EAB308] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>{t.liveObservation}</span>
              </div>
              <p className="text-xs font-bold text-white mt-1 leading-snug">
                {t.observationDescription}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-center space-y-5 bg-[#14241B]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/60 border border-[#EAB308]/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs font-black text-[#EAB308] uppercase tracking-wider">
                {t.precisionTelemetry}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight">
              {t.acousticsHeading}
            </h3>

            <p className="text-sm sm:text-base font-bold text-[#A3B8AA] leading-relaxed">
              {t.acousticsDescription}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/60 border border-[#EAB308]/30">
                <div className="text-xs font-bold text-[#EAB308] uppercase">{t.combTemperature}</div>
                <div className="text-lg font-black text-white mt-0.5">{t.optimalTemperature}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-[#EAB308]/30">
                <div className="text-xs font-bold text-[#22C55E] uppercase">{t.flightAcousticRate}</div>
                <div className="text-lg font-black text-white mt-0.5">{t.vitalFrequency}</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('ai-health')}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#EAB308] hover:bg-[#FACC15] text-[#1A0F09] font-black text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <span>{t.viewAiModel}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section (The 4 FEATURE CARDS) */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#C99A3A] tracking-wider uppercase">
            {t.coreArchitecture}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F2E4C9] font-display">
            {t.platformFeatures}
          </h2>
          <p className="text-sm text-[#C9B394] max-w-xl mx-auto">
            {t.architectureDescription}
          </p>
        </div>

        {/* Four Feature Cards */}
        <FeatureCards language={language} />

        {/* Prototype Ecosystem Note */}
        <div className="p-5 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#C99A3A]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#C99A3A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2E4C9]">
                {t.cooperativeProtection}
              </h4>
              <p className="text-xs text-[#C9B394] mt-0.5">
                {t.cooperativeDescription}
              </p>
            </div>
          </div>

          <button
            id="landing-footer-verify-btn"
            onClick={() => onNavigate('dashboard')}
            className="shrink-0 px-5 py-2.5 rounded-lg bg-[#C99A3A] hover:bg-[#DBAC48] text-[#23150D] text-xs font-bold"
          >
            {t.launchSuite}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#1A0F09] border-t border-[#4A2E1F] py-8 px-6 text-center text-xs text-[#C9B394] space-y-2">
        <div className="font-bold text-[#F2E4C9]">
          HIVETRUST • {t.tagline}
        </div>
        <div>
          {t.designedFor}. {t.prototypeFooter}
        </div>
      </footer>
    </div>
  );
};
