import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  ACTIVE_CONFIG_ID: '@tapza/active_config_id',
  CACHED_CONFIG: '@tapza/cached_config',
  DEV_SETTINGS: '@tapza/dev_settings',
  MEDICINE_DOSES: '@tapza/medicine_doses',
  BOOKINGS: '@tapza/bookings',
  THEME_CUSTOMIZATIONS: '@tapza/theme_customizations',
} as const;

export const storageService = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[storageService] Error getting item for key ${key}:`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn(`[storageService] Error setting item for key ${key}:`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[storageService] Error removing item for key ${key}:`, error);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.warn('[storageService] Error clearing storage:', error);
      return false;
    }
  },
};
