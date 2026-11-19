import { apiClient } from '../api/client';
import {
  Prescription,
  Medicine,
  DoseTiming,
  DoseCompletionStorage,
} from '../types/prescription';
import { storageService, STORAGE_KEYS } from './storageService';

const getTodayKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const prescriptionService = {
  /**
   * Generates unique key for persisting dose completion
   */
  getDoseKey(
    prescriptionId: string,
    medicineId: string,
    timing: DoseTiming,
    dateStr?: string
  ): string {
    const date = dateStr || getTodayKey();
    return `${date}_${prescriptionId}_${medicineId}_${timing}`;
  },

  /**
   * Retrieves all persisted dose completion states
   */
  async getStoredDoses(): Promise<DoseCompletionStorage> {
    const stored = await storageService.getItem<DoseCompletionStorage>(
      STORAGE_KEYS.MEDICINE_DOSES
    );
    return stored || {};
  },

  /**
   * Merges local dose completion status into prescriptions
   */
  mergeDosesIntoPrescription(
    prescription: Prescription,
    storedDoses: DoseCompletionStorage,
    dateStr?: string
  ): Prescription {
    const targetDate = dateStr || getTodayKey();

    const updatedMedicines: Medicine[] = prescription.medicines.map((med) => {
      const morningKey = this.getDoseKey(prescription.id, med.id, 'morning', targetDate);
      const afternoonKey = this.getDoseKey(prescription.id, med.id, 'afternoon', targetDate);
      const nightKey = this.getDoseKey(prescription.id, med.id, 'night', targetDate);

      return {
        ...med,
        schedule: {
          morning: med.schedule.morning
            ? {
                ...med.schedule.morning,
                completed:
                  storedDoses[morningKey] !== undefined
                    ? storedDoses[morningKey]
                    : med.schedule.morning.completed,
              }
            : null,
          afternoon: med.schedule.afternoon
            ? {
                ...med.schedule.afternoon,
                completed:
                  storedDoses[afternoonKey] !== undefined
                    ? storedDoses[afternoonKey]
                    : med.schedule.afternoon.completed,
              }
            : null,
          night: med.schedule.night
            ? {
                ...med.schedule.night,
                completed:
                  storedDoses[nightKey] !== undefined
                    ? storedDoses[nightKey]
                    : med.schedule.night.completed,
              }
            : null,
        },
      };
    });

    return {
      ...prescription,
      medicines: updatedMedicines,
    };
  },

  /**
   * Fetches all prescriptions with dose completion merged
   */
  async getPrescriptions(): Promise<Prescription[]> {
    try {
      const response = await apiClient.get<Prescription[]>('/prescriptions');
      const storedDoses = await this.getStoredDoses();

      const merged = response.data.map((rx) =>
        this.mergeDosesIntoPrescription(rx, storedDoses)
      );

      return merged;
    } catch (error) {
      // Offline fallback: load from mock directly
      const { mockPrescriptions } = await import('../api/mockPrescriptions');
      const storedDoses = await this.getStoredDoses();
      return mockPrescriptions.map((rx) =>
        this.mergeDosesIntoPrescription(rx, storedDoses)
      );
    }
  },

  /**
   * Fetches a single prescription by ID with doses merged
   */
  async getPrescriptionById(id: string): Promise<Prescription | null> {
    try {
      const response = await apiClient.get<Prescription>(`/prescriptions/${id}`);
      const storedDoses = await this.getStoredDoses();
      return this.mergeDosesIntoPrescription(response.data, storedDoses);
    } catch {
      const { mockPrescriptions } = await import('../api/mockPrescriptions');
      const found = mockPrescriptions.find((p) => p.id === id);
      if (!found) return null;
      const storedDoses = await this.getStoredDoses();
      return this.mergeDosesIntoPrescription(found, storedDoses);
    }
  },

  /**
   * Toggles completion for a specific dose and persists to AsyncStorage
   */
  async toggleDoseTaken(
    prescriptionId: string,
    medicineId: string,
    timing: DoseTiming,
    dateStr?: string
  ): Promise<boolean> {
    const key = this.getDoseKey(prescriptionId, medicineId, timing, dateStr);
    const storedDoses = await this.getStoredDoses();
    const current = !!storedDoses[key];
    const next = !current;

    storedDoses[key] = next;
    await storageService.setItem(STORAGE_KEYS.MEDICINE_DOSES, storedDoses);

    return next;
  },

  /**
   * Calculates overall dose compliance progress for today
   */
  async getTodayDoseProgress(): Promise<{
    total: number;
    completed: number;
    percentage: number;
  }> {
    const prescriptions = await this.getPrescriptions();
    const activeRxs = prescriptions.filter((p) => p.status === 'active');

    let total = 0;
    let completed = 0;

    activeRxs.forEach((rx) => {
      rx.medicines.forEach((med) => {
        if (med.schedule.morning) {
          total += 1;
          if (med.schedule.morning.completed) completed += 1;
        }
        if (med.schedule.afternoon) {
          total += 1;
          if (med.schedule.afternoon.completed) completed += 1;
        }
        if (med.schedule.night) {
          total += 1;
          if (med.schedule.night.completed) completed += 1;
        }
      });
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  },
};
