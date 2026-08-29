'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeSettings {
  id: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  buttonStyle: string;
  borderRadius: string;
  festiveMode: string; // 'NONE', 'DIWALI', 'CHRISTMAS', 'NEW_YEAR', 'HOLI', 'CUSTOM'
  festiveBadgeText: string | null;
  festiveLogoEmoji: string | null;
  festiveLogoUrl: string | null;
  festiveBannerActive: boolean;
  festiveRibbonBg: string;
}

interface ThemeContextType {
  theme: ThemeSettings;
  refreshTheme: () => Promise<void>;
  loading: boolean;
}

const defaultTheme: ThemeSettings = {
  id: 'global',
  fontFamily: 'Plus Jakarta Sans',
  primaryColor: '#FF7844',
  secondaryColor: '#2EC4B6',
  buttonStyle: 'bouncy-3d',
  borderRadius: 'rounded-3xl',
  festiveMode: 'NONE',
  festiveBadgeText: 'Festive Mega Toy Sale • Up to 50% OFF',
  festiveLogoEmoji: '🪔',
  festiveLogoUrl: null,
  festiveBannerActive: true,
  festiveRibbonBg: 'from-amber-600 via-rose-600 to-purple-600',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  refreshTheme: async () => {},
  loading: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);

  const fetchTheme = async () => {
    try {
      const res = await fetch('/api/theme');
      if (res.ok) {
        const data: ThemeSettings = await res.json();
        setTheme(data);
      }
    } catch (e) {
      console.error('Failed to load store theme', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, refreshTheme: fetchTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
