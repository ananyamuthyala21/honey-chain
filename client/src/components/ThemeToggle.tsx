import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { ThemeMode, THEME_OPTIONS } from '../utils/theme';

interface ThemeToggleProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onThemeChange,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (themeId: ThemeMode) => {
    onThemeChange(themeId);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left" id="theme-menu-container">
      <button
        type="button"
        id="theme-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#23150D] border border-[#C99A3A]/35 text-xs font-semibold text-[#F2E4C9] hover:border-[#C99A3A] transition-all shadow-sm"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Switch Interface Theme"
      >
        <span
          className="w-3 h-3 rounded-full border border-white/30 shrink-0 shadow-xs"
          style={{ backgroundColor: currentTheme.primaryColor }}
        />
        <Palette className="w-3.5 h-3.5 text-[#C99A3A] shrink-0" />
        {!compact && (
          <span className="font-bold tracking-tight text-xs truncate max-w-[110px]">
            {currentTheme.name}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-[#C9B394] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="theme-dropdown-popover"
          className="absolute right-0 mt-2 w-64 rounded-xl bg-[#1A0F09] border border-[#C99A3A]/40 shadow-2xl p-2 z-50 divide-y divide-[#C99A3A]/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C9B394]/70 flex items-center justify-between">
            <span>Color Aesthetics</span>
            <span className="text-[#C99A3A]">5 Themes</span>
          </div>

          <div className="py-1 space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  id={`theme-option-${opt.id}`}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-[#3A2415] border border-[#C99A3A]/50'
                      : 'hover:bg-[#23150D] text-[#C9B394] hover:text-[#F2E4C9]'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-white/20 shadow-xs"
                      style={{ backgroundColor: opt.primaryColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#F2E4C9]' : 'text-[#EAF2EC]'}`}>
                        {opt.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#0F1D15] border border-[#C99A3A]/20 text-[#C99A3A]">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#C9B394]/80 leading-tight mt-0.5 line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#C99A3A] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
