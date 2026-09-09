export type ThemeMode = 'forest' | 'amber' | 'golden-light' | 'agri-fintech' | 'smoked-cedar';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  description: string;
  badge: string;
  primaryColor: string;
  bgColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'forest',
    name: 'Forest Canopy',
    description: 'Wild botanical pine moss, vibrant emerald & pollen gold',
    badge: 'Eco Wild',
    primaryColor: '#EAB308',
    bgColor: '#0F1D15'
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    description: 'Classic roasted espresso, dark mahogany & rich wildflower honey',
    badge: 'Classic',
    primaryColor: '#C99A3A',
    bgColor: '#2B1B12'
  },
  {
    id: 'golden-light',
    name: 'Golden Light',
    description: 'Warm gourmet parchment, clean sunlit surfaces & raw amber',
    badge: 'Daylight Clean',
    primaryColor: '#D97706',
    bgColor: '#FAF6F0'
  },
  {
    id: 'agri-fintech',
    name: 'Agri-Fintech',
    description: 'Crisp precision analytics slate, deep trust navy & saffron accents',
    badge: 'Lab SaaS',
    primaryColor: '#0284C7',
    bgColor: '#0B111E'
  },
  {
    id: 'smoked-cedar',
    name: 'Smoked Cedar',
    description: 'Weathered timber hive boxes, raw propolis & antique brass',
    badge: 'Artisanal',
    primaryColor: '#D4A359',
    bgColor: '#1A1412'
  }
];

export const themeStorage = {
  getTheme: (): ThemeMode => {
    try {
      const saved = localStorage.getItem('hivetrust_theme') as ThemeMode;
      if (['forest', 'amber', 'golden-light', 'agri-fintech', 'smoked-cedar'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'forest';
  },
  setTheme: (theme: ThemeMode): void => {
    try {
      localStorage.setItem('hivetrust_theme', theme);
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        // remove all existing theme classes
        root.classList.remove(
          'theme-forest',
          'theme-amber',
          'theme-golden-light',
          'theme-agri-fintech',
          'theme-smoked-cedar'
        );
        root.classList.add(`theme-${theme}`);
      }
    } catch {
      // ignore
    }
  }
};
