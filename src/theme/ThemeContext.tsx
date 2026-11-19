import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import type { AppTheme, ThemeColors } from './types';
import { defaultLightTheme, defaultDarkTheme } from './tokens';

interface ThemeContextValue {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  updateRemoteColors: (colors: Partial<ThemeColors> | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>('system');
  const [remoteColors, setRemoteColors] = useState<Partial<ThemeColors> | null>(null);

  const effectiveMode = useMemo<'light' | 'dark'>(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  const isDark = effectiveMode === 'dark';

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      const current = prev === 'system' ? (systemColorScheme === 'dark' ? 'dark' : 'light') : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemColorScheme]);

  const setThemeMode = useCallback((mode: 'light' | 'dark' | 'system') => {
    setThemeModeState(mode);
  }, []);

  const updateRemoteColors = useCallback((colors: Partial<ThemeColors> | null) => {
    setRemoteColors(colors);
  }, []);

  const theme = useMemo<AppTheme>(() => {
    const baseTheme = isDark ? defaultDarkTheme : defaultLightTheme;
    if (!remoteColors) {
      return baseTheme;
    }
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...remoteColors,
      },
    };
  }, [isDark, remoteColors]);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setThemeMode,
      updateRemoteColors,
    }),
    [theme, isDark, toggleTheme, setThemeMode, updateRemoteColors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): AppTheme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

export const useThemeController = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeController must be used within a ThemeProvider');
  }
  return context;
};
