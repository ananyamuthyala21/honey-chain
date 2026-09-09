import React from 'react';
import { Link2, QrCode, Radio, Activity } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface FeatureCardsProps {
  language: Language;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ language }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const features = [
    {
      id: 'traceability',
      title: t.feature1Title,
      description: t.feature1Desc,
      icon: Link2,
      // mapping: download__4_.jpg → Blockchain traceability
      photo: '/assets/download__4_.jpg',
      alt: 'Macro top-down bees resting on golden honeycomb comb cells'
    },
    {
      id: 'qr-verification',
      title: t.feature2Title,
      description: t.feature2Desc,
      icon: QrCode,
      // mapping: download__3_.jpg → QR verification
      photo: '/assets/download__3_.jpg',
      alt: 'Honeybees tending hanging natural comb with dripping golden honey'
    },
    {
      id: 'smart-iot',
      title: t.feature3Title,
      description: t.feature3Desc,
      icon: Radio,
      // mapping: download__4_.jpg → Smart hive monitoring
      photo: '/assets/download__4_.jpg',
      alt: 'Bees on golden comb cells with sensors tracking hive vital signs'
    },
    {
      id: 'ai-insights',
      title: t.feature4Title,
      description: t.feature4Desc,
      icon: Activity,
      // mapping: In-hive bee flight and acoustics → AI-assisted insights
      photo: '/assets/bee_flight_comb.jpg',
      alt: 'Honey bees clustered on comb with bee hovering in flight analyzed for acoustics and health'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {features.map((feature) => {
        const IconComponent = feature.icon;
        return (
          <div
            key={feature.id}
            id={`feature-card-${feature.id}`}
            className="rounded-xl overflow-hidden bg-[#1B2E24] border border-[#EAB308]/30 flex flex-col transition-transform duration-200 hover:-translate-y-1 shadow-lg"
          >
            {/* Photo strip on top with dark bottom-fade overlay */}
            <div className="relative h-[110px] w-full overflow-hidden bg-black">
              <img
                src={feature.photo}
                alt={feature.alt}
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              {/* Bottom-fade dark overlay so it is readable and not overpowering */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#1B2E24]" />
              
              {/* Overlapping small gold square icon badge on bottom-left */}
              <div className="absolute -bottom-3 left-4 w-8 h-8 rounded-md bg-[#EAB308] text-[#1A0F09] flex items-center justify-center shadow-lg z-10">
                <IconComponent className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Card body below with high-contrast bold typography */}
            <div className="p-4 pt-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-white tracking-tight leading-snug">
                  {feature.title}
                </h3>
                <p className="text-xs font-bold text-[#A3B8AA] mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[#EAB308]/20 flex items-center justify-between text-[11px] text-[#EAB308]">
                <span className="font-black tracking-wider uppercase text-[10px]">Verified Tech</span>
                <span className="font-bold opacity-90">SHA-256</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
