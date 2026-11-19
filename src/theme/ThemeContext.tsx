import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import type { AppTheme, ThemeColors, ThemeTypography } from './types';
import { defaultLightTheme, defaultDarkTheme, typography } from './tokens';
import { storageService, STORAGE_KEYS } from '../services/storageService';

export type FontScale = 'small' | 'normal' | 'large' | 'xl';

export interface ThemeCustomizations {
  customBgColor: string | null;
  customTextColor: string | null;
  fontScale: FontScale;
}

interface ThemeContextValue {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  updateRemoteColors: (colors: Partial<ThemeColors> | null) => void;
  customBgColor: string | null;
  customTextColor: string | null;
  fontScale: FontScale;
  setCustomBackgroundColor: (color: string | null) => void;
  setCustomTextColor: (color: string | null) => void;
  setFontScale: (scale: FontScale) => void;
  resetCustomStyles: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>('system');
  const [remoteColors, setRemoteColors] = useState<Partial<ThemeColors> | null>(null);
  const [customBgColor, setCustomBgColor] = useState<string | null>(null);
  const [customTextColor, setCustomTextColorState] = useState<string | null>(null);
  const [fontScale, setFontScaleState] = useState<FontScale>('normal');

  // Load persisted theme customizations on initial mount
  useEffect(() => {
    const loadSaved = async () => {
      const saved = await storageService.getItem<ThemeCustomizations>(
        STORAGE_KEYS.THEME_CUSTOMIZATIONS
      );
      if (saved) {
        if (saved.customBgColor !== undefined) setCustomBgColor(saved.customBgColor);
        if (saved.customTextColor !== undefined) setCustomTextColor(saved.customTextColor);
        if (saved.fontScale !== undefined) setFontScaleState(saved.fontScale);
      }
    };
    loadSaved();
  }, []);

  const saveCustomizations = useCallback(
    async (bg: string | null, text: string | null, scale: FontScale) => {
      await storageService.setItem<ThemeCustomizations>(STORAGE_KEYS.THEME_CUSTOMIZATIONS, {
        customBgColor: bg,
        customTextColor: text,
        fontScale: scale,
      });
    },
    []
  );

  const setCustomBackgroundColor = useCallback(
    (color: string | null) => {
      setCustomBgColor(color);
      saveCustomizations(color, customTextColor, fontScale);
    },
    [customTextColor, fontScale, saveCustomizations]
  );

  const setCustomTextColor = useCallback(
    (color: string | null) => {
      setCustomTextColorState(color);
      saveCustomizations(customBgColor, color, fontScale);
    },
    [customBgColor, fontScale, saveCustomizations]
  );

  const setFontScale = useCallback(
    (scale: FontScale) => {
      setFontScaleState(scale);
      saveCustomizations(customBgColor, customTextColor, scale);
    },
    [customBgColor, customTextColor, saveCustomizations]
  );

  const resetCustomStyles = useCallback(() => {
    setCustomBgColor(null);
    setCustomTextColor(null);
    setFontScaleState('normal');
    saveCustomizations(null, null, 'normal');
  }, [saveCustomizations]);

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

  // Compute scaled typography based on selected fontScale
  const scaledTypography = useMemo<ThemeTypography>(() => {
    const multiplier =
      fontScale === 'small'
        ? 0.88
        : fontScale === 'large'
          ? 1.16
          : fontScale === 'xl'
            ? 1.32
            : 1.0;

    if (multiplier === 1.0) {
      return typography;
    }

    return {
      fontSize: {
        xs: Math.round(typography.fontSize.xs * multiplier),
        sm: Math.round(typography.fontSize.sm * multiplier),
        md: Math.round(typography.fontSize.md * multiplier),
        lg: Math.round(typography.fontSize.lg * multiplier),
        xl: Math.round(typography.fontSize.xl * multiplier),
        xxl: Math.round(typography.fontSize.xxl * multiplier),
        hero: Math.round(typography.fontSize.hero * multiplier),
      },
      lineHeight: {
        xs: Math.round(typography.lineHeight.xs * multiplier),
        sm: Math.round(typography.lineHeight.sm * multiplier),
        md: Math.round(typography.lineHeight.md * multiplier),
        lg: Math.round(typography.lineHeight.lg * multiplier),
        xl: Math.round(typography.lineHeight.xl * multiplier),
        xxl: Math.round(typography.lineHeight.xxl * multiplier),
        hero: Math.round(typography.lineHeight.hero * multiplier),
      },
      fontWeight: typography.fontWeight,
    };
  }, [fontScale]);

  const theme = useMemo<AppTheme>(() => {
    const baseTheme = isDark ? defaultDarkTheme : defaultLightTheme;
      let colors = { ...baseTheme.colors };
      if (remoteColors) {
        colors = {
          ...colors,
          ...remoteColors,
        };
      }
      if (customBgColor) {
        colors.background = customBgColor;
      }
      if (customTextColor) {
        colors.text = customTextColor;
      }

      return {
        ...baseTheme,
        colors,
        typography: scaledTypography,
      };
}, [isDark, remoteColors, customBgColor, customTextColor, scaledTypography]);

const value = useMemo(
  () => ({
    theme,
    isDark,
    toggleTheme,
    setThemeMode,
    updateRemoteColors,
    customBgColor,
    customTextColor,
    fontScale,
    setCustomBackgroundColor,
    setCustomTextColor,
    setFontScale,
    resetCustomStyles,
  }),
  [
  theme,
  isDark,
  toggleTheme,
  setThemeMode,
  updateRemoteColors,
  customBgColor,
  customTextColor,
  fontScale,
  setCustomBackgroundColor,
  setCustomTextColor,
  setFontScale,
  resetCustomStyles,
    ]
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
