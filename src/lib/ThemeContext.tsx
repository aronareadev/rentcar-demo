'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { RentCarTheme } from '@/types/theme';
import { rentCarTheme } from '@/data/theme';

interface ThemeContextType {
  theme: RentCarTheme;
  colors: RentCarTheme['theme']['colors'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<RentCarTheme>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  customTheme 
}) => {
  const theme = customTheme ? { ...rentCarTheme, ...customTheme } : rentCarTheme;
  
  // CSS 변수로 색상 주입
  React.useEffect(() => {
    const root = document.documentElement;
    const colors = theme.theme.colors;
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-dark', colors.dark);
    root.style.setProperty('--color-light', colors.light);
    root.style.setProperty('--color-accent', colors.accent);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors: theme.theme.colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 유틸리티 훅들
export const useColors = () => {
  const { colors } = useTheme();
  return colors;
};

export const useSiteInfo = () => {
  const { theme } = useTheme();
  return {
    siteName: theme.siteName,
    tagline: theme.tagline,
    phoneNumber: theme.phoneNumber,
  };
}; 