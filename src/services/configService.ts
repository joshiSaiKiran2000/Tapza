import { apiClient } from '../api/client';
import { appRemoteConfigSchema, AppRemoteConfig } from '../config/schema';
import { storageService, STORAGE_KEYS } from './storageService';
import { developerSettingsService } from './developerSettings';
import normalConfig from '../config/normalConfig.json';
import diwaliConfig from '../config/diwaliConfig.json';

export interface ConfigFetchResult {
  config: AppRemoteConfig;
  fromCache: boolean;
  error?: string;
}

export const configService = {
  /**
   * Fetches the remote configuration from GET /config, validates with Zod,
   * caches the successful result, and falls back to cache/bundled on error.
   */
  async fetchConfig(): Promise<ConfigFetchResult> {
    try {
      const response = await apiClient.get<AppRemoteConfig>('/config');
      
      // Validate response against strict Zod schema
      const validatedConfig = appRemoteConfigSchema.parse(response.data);

      // Cache the last successful configuration
      await storageService.setItem(STORAGE_KEYS.CACHED_CONFIG, validatedConfig);

      return {
        config: validatedConfig,
        fromCache: false,
      };
    } catch (error: any) {
      console.warn('[configService] Failed to fetch remote config:', error?.message || error);

      // 1. Try to load previously cached configuration
      const cached = await storageService.getItem<AppRemoteConfig>(STORAGE_KEYS.CACHED_CONFIG);
      if (cached) {
        try {
          const validatedCache = appRemoteConfigSchema.parse(cached);
          return {
            config: validatedCache,
            fromCache: true,
            error: 'Loaded from local offline cache due to network error.',
          };
        } catch {
          // If cache was corrupted, continue to bundled fallback
        }
      }

      // 2. Fall back to bundled fallback config
      const activeId = developerSettingsService.getSettings().activeConfigId;
      const fallbackRaw = activeId === 'diwali' ? diwaliConfig : normalConfig;
      const validatedFallback = appRemoteConfigSchema.parse(fallbackRaw);

      return {
        config: validatedFallback,
        fromCache: true,
        error: 'Loaded bundled fallback configuration.',
      };
    }
  },

  /**
   * Switches the active configuration between normal and diwali at runtime
   */
  async setConfigTheme(configId: 'normal' | 'diwali'): Promise<AppRemoteConfig> {
    await developerSettingsService.updateSettings({ activeConfigId: configId });
    const result = await this.fetchConfig();
    return result.config;
  },

  /**
   * Clears cached configuration
   */
  async clearConfigCache(): Promise<void> {
    await storageService.removeItem(STORAGE_KEYS.CACHED_CONFIG);
  },
};
