import React from 'react';
import { LucideIcon } from 'lucide-react';

export type KpiColorTheme = 'gold' | 'green' | 'orange' | 'amber';

interface KpiCardProps {
  id: string;
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  theme?: KpiColorTheme;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  label,
  value,
  subtext,
  icon: Icon,
  theme = 'gold',
  trend
}) => {
  // Translucent 15-30% opacity tints over the warm-brown card #4A2E1F
  const themeClasses: Record<KpiColorTheme, { badgeBg: string; badgeBorder: string; iconColor: string }> = {
    gold: {
      badgeBg: 'bg-[#C99A3A]/20',
      badgeBorder: 'border-[#C99A3A]/40',
      iconColor: 'text-[#C99A3A]'
    },
    green: {
      badgeBg: 'bg-[#639922]/25',
      badgeBorder: 'border-[#639922]/40',
      iconColor: 'text-[#87D636]'
    },
    orange: {
      badgeBg: 'bg-[#D85A30]/25',
      badgeBorder: 'border-[#D85A30]/40',
      iconColor: 'text-[#F27850]'
    },
    amber: {
      badgeBg: 'bg-[#E08722]/25',
      badgeBorder: 'border-[#E08722]/40',
      iconColor: 'text-[#FFB054]'
    }
  };

  const style = themeClasses[theme];

  return (
    <div
      id={id}
      className="p-5 rounded-xl bg-[#4A2E1F] border border-[#C99A3A]/20 flex flex-col justify-between transition-all duration-200 hover:border-[#C99A3A]/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          {/* Uppercase cream label */}
          <span className="text-[11px] font-bold tracking-wider text-[#F2E4C9]/85 uppercase block">
            {label}
          </span>
          {/* Large bold cream number */}
          <div className="text-2xl sm:text-3xl font-black text-[#F2E4C9] tracking-tight">
            {value}
          </div>
        </div>

        {/* Colored translucent icon badge */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${style.badgeBg} ${style.badgeBorder}`}
        >
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
      </div>

      {/* Muted tan subtext */}
      <div className="mt-3 pt-2.5 border-t border-[#C99A3A]/15 flex items-center justify-between text-xs text-[#C9B394]">
        <span className="truncate">{subtext}</span>
        {trend && (
          <span
            className={`shrink-0 font-bold ml-2 text-[11px] px-1.5 py-0.5 rounded ${
              trend.positive ? 'bg-[#639922]/20 text-[#87D636]' : 'bg-[#D85A30]/20 text-[#F27850]'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
