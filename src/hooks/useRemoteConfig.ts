import { useState, useEffect, useCallback } from 'react';
import { configService, ConfigFetchResult } from '../services/configService';
import { AppRemoteConfig } from '../config/types';
import { useThemeController } from '../theme';

export interface UseRemoteConfigResult {
  config: AppRemoteConfig | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isFromCache: boolean;
  activeConfigId: 'normal' | 'diwali';
  refresh: () => Promise<void>;
  switchTheme: (configId: 'normal' | 'diwali') => Promise<void>;
}

export const useRemoteConfig = (): UseRemoteConfigResult => {
  const { updateRemoteColors, isDark } = useThemeController();
  const [config, setConfig] = useState<AppRemoteConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  const applyThemeColors = useCallback(
    (cfg: AppRemoteConfig) => {
      const colors = isDark && cfg.theme.darkColors ? cfg.theme.darkColors : cfg.theme.colors;
      updateRemoteColors(colors as any);
    },
    [updateRemoteColors, isDark]
  );

  const loadConfig = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result: ConfigFetchResult = await configService.fetchConfig();
        setConfig(result.config);
        setIsFromCache(result.fromCache);
        if (result.error) {
          setError(result.error);
        }
        applyThemeColors(result.config);
      } catch (err: any) {
        setError(err?.message || 'Failed to load configuration');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [applyThemeColors]
  );

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const refresh = useCallback(async () => {
    await loadConfig(true);
  }, [loadConfig]);

  const switchTheme = useCallback(
    async (targetConfigId: 'normal' | 'diwali') => {
      setLoading(true);
      try {
        const updatedConfig = await configService.setConfigTheme(targetConfigId);
        setConfig(updatedConfig);
        setIsFromCache(false);
        setError(null);
        applyThemeColors(updatedConfig);
      } catch (err: any) {
        setError(err?.message || 'Failed to switch theme');
      } finally {
        setLoading(false);
      }
    },
    [applyThemeColors]
  );

  return {
    config,
    loading,
    refreshing,
    error,
    isFromCache,
    activeConfigId: config?.configId || 'normal',
    refresh,
    switchTheme,
  };
};
