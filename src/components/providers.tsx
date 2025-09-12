'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { AppProvider } from '@/contexts/app-context';

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>{children}</AppProvider>
    </NextThemesProvider>
  );
}
