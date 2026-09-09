import React from 'react';
import { Palette } from 'lucide-react';
import { THEME_OPTIONS } from '../../utils/theme';

export default function PortalThemeSelect({ theme, onThemeChange, compact = false }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-amber-200/70 bg-[var(--portal-surface)] px-3 py-2 text-xs font-bold text-[var(--portal-dark)] shadow-sm">
      <Palette className="h-4 w-4 text-[var(--portal-accent)]" />
      <select
        aria-label="Switch interface theme"
        value={theme}
        onChange={(event) => onThemeChange(event.target.value)}
        className={`bg-transparent outline-none ${compact ? 'max-w-[110px]' : 'max-w-[150px]'}`}
      >
        {THEME_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </label>
  );
}
