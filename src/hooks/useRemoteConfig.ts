import { useState, useEffect, useCallback } from 'react';
import { configService, ConfigFetchResult } from '../services/configService';
import { developerSettingsService } from '../services/developerSettings';
import { AppRemoteConfig } from '../config/types';
import normalConfig from '../config/normalConfig.json';
import diwaliConfig from '../config/diwaliConfig.json';

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
  const [config, setConfig] = useState<AppRemoteConfig | null>(() => {
    const active = developerSettingsService.getSettings().activeConfigId;
    return (active === 'diwali' ? diwaliConfig : normalConfig) as AppRemoteConfig;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  const loadConfig = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }
    setError(null);

          try {
            const result: ConfigFetchResult = await configService.fetchConfig();
            setConfig(result.config);
            setIsFromCache(result.fromCache);
            if (result.error) {
              setError(result.error);
            }
          } catch (err: any) {
            setError(err?.message || 'Failed to load configuration');
          } finally {
            setLoading(false);
            setRefreshing(false);
          }
        }, []);

  useEffect(() => {
    let isMounted = true;

    // Initial background revalidation
    loadConfig();

    const unsubscribe = developerSettingsService.subscribe((settings) => {
      if (!isMounted) return;
      const targetConfig = (settings.activeConfigId === 'diwali' ? diwaliConfig : normalConfig) as AppRemoteConfig;
      // Pure synchronous state update without calling any external parent setStates
      setConfig(targetConfig);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
}, [loadConfig]);

const refresh = useCallback(async () => {
  await loadConfig(true);
}, [loadConfig]);

    const switchTheme = useCallback(async (targetConfigId: 'normal' | 'diwali') => {
      // 1. Immediately apply target bundled config locally
      const immediateConfig = (targetConfigId === 'diwali' ? diwaliConfig : normalConfig) as AppRemoteConfig;
      setConfig(immediateConfig);
      setIsFromCache(false);
      setError(null);

      // 2. Persist setting & sync in background (developerSettingsService will notify ThemeProvider directly)
      try {
        const updatedConfig = await configService.setConfigTheme(targetConfigId);
        setConfig(updatedConfig);
      } catch (err: any) {
        console.warn('[useRemoteConfig] Background theme fetch error:', err);
      }
  }, []);

const activeId =
  developerSettingsService.getSettings().activeConfigId ||
  (config?.configId as 'normal' | 'diwali') ||
  'normal';

  return {
    config,
    loading,
    refreshing,
    error,
    isFromCache,
    activeConfigId: activeId,
    refresh,
    switchTheme,
  };
};
