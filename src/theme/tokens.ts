import type {
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeBorderRadius,
  ThemeShadows,
  AppTheme,
} from './types';

export const lightColors: ThemeColors = {
  // Trustworthy clinical teal/emerald primary
  primary: '#0D7A73',
  primaryLight: '#E6F4F2',
  primaryDark: '#07504C',
  // Saffron / warm gold secondary for Indian cultural touch
  secondary: '#E65100',
  secondaryLight: '#FFF3E0',
  accent: '#2A72E5',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  divider: '#F1F5F9',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#0D7A73',
  tabBarInactive: '#94A3B8',
};

export const darkColors: ThemeColors = {
  primary: '#2DD4BF',
  primaryLight: '#134E48',
  primaryDark: '#0D7A73',
  secondary: '#FB923C',
  secondaryLight: '#431407',
  accent: '#60A5FA',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceVariant: '#334155',
  card: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  border: '#334155',
  divider: '#1E293B',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#451A03',
  error: '#F87171',
  errorLight: '#450A0A',
  info: '#60A5FA',
  infoLight: '#1E3A8A',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  tabBarBackground: '#1E293B',
  tabBarActive: '#2DD4BF',
  tabBarInactive: '#64748B',
};

export const typography: ThemeTypography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    hero: 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 28,
    xxl: 32,
    hero: 38,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius: ThemeBorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows: ThemeShadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const defaultLightTheme: AppTheme = {
  mode: 'light',
  isDark: false,
  colors: lightColors,
  spacing,
  typography,
  borderRadius,
  shadows,
};

export const defaultDarkTheme: AppTheme = {
  mode: 'dark',
  isDark: true,
  colors: darkColors,
  spacing,
  typography,
  borderRadius,
  shadows,
};
