import { storageService, STORAGE_KEYS } from './storageService';

export interface DeveloperSettings {
  activeConfigId: 'normal' | 'diwali';
  simulateLatency: boolean;
  latencyMs: number;
  simulateApiFailure: boolean;
  simulateEmptyResponses: boolean;
  simulateBookingConflict: boolean;
}

export const defaultDevSettings: DeveloperSettings = {
  activeConfigId: 'normal',
  simulateLatency: true,
  latencyMs: 600,
  simulateApiFailure: false,
  simulateEmptyResponses: false,
  simulateBookingConflict: false,
};

let currentDevSettings: DeveloperSettings = { ...defaultDevSettings };
type SettingsListener = (settings: DeveloperSettings) => void;
const listeners: Set<SettingsListener> = new Set();

export const developerSettingsService = {
  async init(): Promise<DeveloperSettings> {
    const saved = await storageService.getItem<DeveloperSettings>(STORAGE_KEYS.DEV_SETTINGS);
    const savedConfigId = await storageService.getItem<'normal' | 'diwali'>(STORAGE_KEYS.ACTIVE_CONFIG_ID);
    if (saved) {
      currentDevSettings = { ...defaultDevSettings, ...saved };
    }
    if (savedConfigId) {
      currentDevSettings.activeConfigId = savedConfigId;
    }
    return currentDevSettings;
  },

  getSettings(): DeveloperSettings {
    return currentDevSettings;
  },

  async updateSettings(partial: Partial<DeveloperSettings>): Promise<DeveloperSettings> {
    currentDevSettings = { ...currentDevSettings, ...partial };
    await storageService.setItem(STORAGE_KEYS.DEV_SETTINGS, currentDevSettings);
    if (partial.activeConfigId) {
      await storageService.setItem(STORAGE_KEYS.ACTIVE_CONFIG_ID, partial.activeConfigId);
    }
    listeners.forEach((fn) => fn(currentDevSettings));
    return currentDevSettings;
  },

  subscribe(listener: SettingsListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  async toggleActiveConfig(): Promise<'normal' | 'diwali'> {
    const next = currentDevSettings.activeConfigId === 'normal' ? 'diwali' : 'normal';
    await this.updateSettings({ activeConfigId: next });
    return next;
  },
};
