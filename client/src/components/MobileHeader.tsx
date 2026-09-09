import React from 'react';
import { Menu, Globe2, LogOut } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { ThemeMode } from '../utils/theme';
import { ThemeToggle } from './ThemeToggle';

interface MobileHeaderProps {
  onMenuClick?: () => void;
  onToggleNav?: () => void;
  language: Language;
  setLanguage?: (lang: Language) => void;
  onLanguageChange?: (lang: Language) => void;
  theme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  onLogout?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuClick,
  onToggleNav,
  language,
  setLanguage,
  onLanguageChange,
  theme = 'forest',
  onThemeChange,
  onLogout
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const nextLanguage = () => {
    const nextLang: Language = language === 'en' ? 'hi' : language === 'hi' ? 'te' : 'en';
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    } else if (setLanguage) {
      setLanguage(nextLang);
    }
  };

  const handleMenuClick = () => {
    if (onToggleNav) {
      onToggleNav();
    } else if (onMenuClick) {
      onMenuClick();
    }
  };

  const langLabel = language === 'en' ? 'EN' : language === 'hi' ? 'हिन्दी' : 'తెలుగు';

  return (
    <header
      id="mobile-top-header"
      className="sticky top-0 z-30 w-full bg-[#23150D] border-b border-[#4A2E1F] px-4 py-3 flex items-center justify-between shadow-md"
    >
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-trigger"
          onClick={handleMenuClick}
          className="lg:hidden p-2 rounded-lg bg-[#3A2415] text-[#F2E4C9] hover:bg-[#4A2E1F] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-[#C99A3A]" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#F2E4C9] p-0.5 flex items-center justify-center overflow-hidden">
            <img
              src="/madhusatya-logo.svg"
              alt="HIVETRUST logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-sm font-extrabold text-[#F2E4C9] tracking-wider block font-display leading-none">
              HIVETRUST
            </span>
            <span className="text-[10px] text-[#C99A3A] block leading-tight">
              {t.sidebarTagline}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onThemeChange && (
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} compact={true} />
        )}

        <button
          id="mobile-lang-cycle-btn"
          onClick={nextLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#3A2415] border border-[#C99A3A]/40 text-xs font-semibold text-[#F2E4C9] hover:bg-[#4A2E1F]"
        >
          <Globe2 className="w-3.5 h-3.5 text-[#C99A3A]" />
          <span>{langLabel}</span>
        </button>

        <button
          id="beekeeper-top-logout-btn"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#3A2415] border border-[#C99A3A]/40 text-xs font-semibold text-[#F2E4C9] hover:bg-[#C99A3A] hover:text-[#23150D]"
          title="Log out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};
