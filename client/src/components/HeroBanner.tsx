import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeroTag {
  icon: LucideIcon;
  text: string;
}

interface HeroBannerProps {
  id: string;
  pillText: string;
  title: string;
  description: string;
  tags?: HeroTag[];
  actionButton?: {
    id: string;
    text: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
  // Honeycomb photo behind: download__3_.jpg or download__4_.jpg
  backgroundImageUrl?: string;
  sideImageUrl?: string;
  sideImageAlt?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  id,
  pillText,
  title,
  description,
  tags = [],
  actionButton,
  backgroundImageUrl = '/assets/bee_flight_comb.jpg',
  sideImageUrl,
  sideImageAlt
}) => {
  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A0F09] via-[#2B1B12] to-[#3A2415] border border-[#C99A3A]/30 p-6 md:p-8 shadow-xl"
    >
      {/* Real honeycomb photo behind at low opacity (~20%) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-overlay"
        style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
      />

      {/* Honeycomb vector pattern secondary accent layer */}
      <div className="absolute inset-0 bg-honeycomb-pattern opacity-40 pointer-events-none" />

      {/* Dark overlay to ensure maximum contrast and readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F09]/90 via-[#23150D]/80 to-[#1A0F09]/90 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-4 sm:gap-5">
            {sideImageUrl && (
              <div className="shrink-0 relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-[#C99A3A]/70 shadow-xl shadow-black/60 bg-[#1A0F09] ring-2 ring-[#C99A3A]/20 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={sideImageUrl}
                    alt={sideImageAlt || 'Pure Honey Pot with Dipper'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#87D636] border-2 border-[#23150D]" title="Active Harvest" />
              </div>
            )}
            <div className="space-y-1 sm:space-y-1.5">
              {/* Small gold pill label */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A2415]/90 border border-[#C99A3A]/40 text-xs font-black text-[#C99A3A] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3A]" />
                {pillText}
              </div>

              {/* Bold cream H1 title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F2E4C9] tracking-tight leading-tight font-display drop-shadow-md">
                {title}
              </h1>
            </div>
          </div>

          {/* Bold high-contrast description */}
          <p className="text-sm md:text-base font-bold text-[#EAF2EC] leading-relaxed drop-shadow-xs">
            {description}
          </p>

          {/* 3-4 small icon+label tags along the bottom */}
          {tags.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {tags.map((tag, idx) => {
                const IconComponent = tag.icon;
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2B1B12]/80 border border-[#4A2E1F] text-xs font-medium text-[#F2E4C9]"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-[#C99A3A]" />
                    <span>{tag.text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Primary gold action button on the right */}
        {actionButton && (
          <div className="shrink-0 flex items-center">
            <button
              id={actionButton.id}
              onClick={actionButton.onClick}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C99A3A] hover:bg-[#DBAC48] text-[#23150D] font-extrabold text-sm tracking-wide shadow-lg transition-transform duration-150 active:scale-95"
            >
              {actionButton.icon && (
                <actionButton.icon className="w-4 h-4 text-[#23150D] stroke-[2.5]" />
              )}
              <span>{actionButton.text}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
