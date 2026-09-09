import React from 'react';
import {
  LayoutDashboard,
  Users,
  Box,
  Radio,
  Activity,
  Package,
  Layers,
  QrCode,
  Globe2,
  X,
  Compass,
  Download
} from 'lucide-react';
import { ActivePage, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { ThemeMode } from '../utils/theme';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate?: (page: ActivePage) => void;
  setActivePage?: (page: ActivePage) => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  setLanguage?: (lang: Language) => void;
  theme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  isOpen?: boolean;
  isMobileOpen?: boolean;
  onClose?: () => void;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  setActivePage,
  language,
  onLanguageChange,
  setLanguage,
  theme = 'forest',
  onThemeChange,
  isOpen,
  isMobileOpen,
  onClose,
  setIsMobileOpen
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isNavOpen = isMobileOpen ?? isOpen ?? false;

  const handleClose = () => {
    if (onClose) onClose();
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleNavClick = (page: ActivePage) => {
    if (onNavigate) onNavigate(page);
    else if (setActivePage) setActivePage(page);
    handleClose();
  };

  const handleLanguageSelect = (langKey: Language) => {
    if (onLanguageChange) onLanguageChange(langKey);
    else if (setLanguage) setLanguage(langKey);
  };

  const navItems = [
    { id: 'dashboard' as ActivePage, label: t.dashboard, icon: LayoutDashboard },
    { id: 'beekeepers' as ActivePage, label: t.beekeepers, icon: Users },
    { id: 'hives' as ActivePage, label: t.hives, icon: Box },
    { id: 'iot' as ActivePage, label: t.iotMonitoring, icon: Radio },
    { id: 'ai-health' as ActivePage, label: t.aiHealth, icon: Activity },
    { id: 'batches' as ActivePage, label: t.honeyBatches, icon: Package },
    { id: 'blockchain' as ActivePage, label: t.blockchainLedger, icon: Layers }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isNavOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={handleClose}
          className="fixed inset-0 bg-black/75 z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-[#23150D] border-r border-[#4A2E1F]/60 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header Section */}
        <div className="p-5 border-b border-[#4A2E1F]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* HIVETRUST logo mark */}
              <div className="w-9 h-9 rounded-xl bg-[#F2E4C9] p-1 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/madhusatya-logo.svg"
                  alt="HIVETRUST logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-lg font-black tracking-widest text-[#F2E4C9] block font-display">
                  HIVETRUST
                </span>
                <span className="text-[11px] text-[#C99A3A] font-medium tracking-tight block">
                  {t.sidebarTagline}
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              id="sidebar-close-btn"
              onClick={handleClose}
              className="lg:hidden p-1.5 rounded-lg text-[#C9B394] hover:text-[#F2E4C9] hover:bg-[#4A2E1F]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prototype Badge */}
          <div className="mt-3.5 inline-flex items-center px-2.5 py-1 rounded-full bg-[#3A2415] border border-[#C99A3A]/30 text-[10px] font-semibold text-[#C99A3A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#639922] mr-2 animate-pulse" />
            {t.prototypeBadge}
          </div>
        </div>

        {/* Middle Navigation Items */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-[#C9B394]/70">
            Admin Apiary System
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#C99A3A] text-[#23150D] shadow-md font-bold'
                    : 'text-[#C9B394] hover:bg-[#3A2415] hover:text-[#F2E4C9]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#23150D]' : 'text-[#C99A3A]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-[#C9B394]/70">
            Public & Consumer
          </div>

          {/* Public Consumer QR Verification View */}
          <button
            id="nav-item-verify"
            onClick={() => handleNavClick('verify')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activePage === 'verify'
                ? 'bg-[#C99A3A] text-[#23150D] shadow-md font-bold'
                : 'text-[#C9B394] hover:bg-[#3A2415] hover:text-[#F2E4C9]'
            }`}
          >
            <QrCode className={`w-4 h-4 shrink-0 ${activePage === 'verify' ? 'text-[#23150D]' : 'text-[#C99A3A]'}`} />
            <span className="truncate">{t.consumerVerify}</span>
          </button>

          {/* Landing page overview */}
          <button
            id="nav-item-landing"
            onClick={() => handleNavClick('landing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activePage === 'landing'
                ? 'bg-[#C99A3A] text-[#23150D] shadow-md font-bold'
                : 'text-[#C9B394] hover:bg-[#3A2415] hover:text-[#F2E4C9]'
            }`}
          >
            <Compass className={`w-4 h-4 shrink-0 ${activePage === 'landing' ? 'text-[#23150D]' : 'text-[#C99A3A]'}`} />
            <span className="truncate">{t.landing}</span>
          </button>

        </div>

        {/* Bottom Section: Ecosystem Note & Language Switcher */}
        <div className="p-4 border-t border-[#4A2E1F]/60 bg-[#1A0F09]/60 space-y-3">
          <div className="text-[10px] text-[#C9B394]/80 leading-tight">
            🇮🇳 {t.designedFor}
          </div>

          {/* Language Toggle */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C9B394] mb-2">
              <Globe2 className="w-3.5 h-3.5 text-[#C99A3A]" />
              <span>Language / भाषा / భాష</span>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 bg-[#2B1B12] rounded-lg border border-[#4A2E1F]">
              {(['en', 'hi', 'te'] as Language[]).map((langKey) => {
                const isCurrent = language === langKey;
                const labels: Record<Language, string> = {
                  en: 'English',
                  hi: 'हिन्दी',
                  te: 'తెలుగు'
                };
                return (
                  <button
                    key={langKey}
                    id={`lang-btn-${langKey}`}
                    onClick={() => handleLanguageSelect(langKey)}
                    className={`py-1 text-[11px] font-bold rounded transition-colors ${
                      isCurrent
                        ? 'bg-[#C99A3A] text-[#23150D]'
                        : 'text-[#C9B394] hover:text-[#F2E4C9] hover:bg-[#3A2415]'
                    }`}
                  >
                    {labels[langKey]}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
