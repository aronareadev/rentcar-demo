'use client';

import { ThemeProvider } from '@/lib/ThemeContext';
import { ThemeHeader } from './ThemeHeader';
import { ThemeFooter } from './ThemeFooter';
import { RentCarTheme } from '@/types/theme';

interface ThemeLayoutProps {
  children: React.ReactNode;
  customTheme?: Partial<RentCarTheme>;
}

export const ThemeLayout = ({ children, customTheme }: ThemeLayoutProps) => {
  return (
    <ThemeProvider customTheme={customTheme}>
      <div className="min-h-screen flex flex-col">
        <ThemeHeader />
        <main className="flex-1">
          {children}
        </main>
        <ThemeFooter />
      </div>
    </ThemeProvider>
  );
}; 