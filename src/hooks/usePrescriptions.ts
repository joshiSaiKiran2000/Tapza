import { useState, useEffect, useCallback } from 'react';
import { prescriptionService } from '../services/prescriptionService';
import { Prescription } from '../types/prescription';

export interface UsePrescriptionsResult {
  prescriptions: Prescription[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  doseProgress: { total: number; completed: number; percentage: number };
  refresh: () => Promise<void>;
  toggleDose: (
    prescriptionId: string,
    medicineId: string,
    timing: 'morning' | 'afternoon' | 'night'
  ) => Promise<void>;
}

export const usePrescriptions = (): UsePrescriptionsResult => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [doseProgress, setDoseProgress] = useState({ total: 0, completed: 0, percentage: 0 });

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [rxs, progress] = await Promise.all([
        prescriptionService.getPrescriptions(),
        prescriptionService.getTodayDoseProgress(),
      ]);
      setPrescriptions(rxs);
      setDoseProgress(progress);
    } catch (err: any) {
      setError(err?.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  const toggleDose = useCallback(
    async (
      prescriptionId: string,
      medicineId: string,
      timing: 'morning' | 'afternoon' | 'night'
    ) => {
      // Optimistic update in local state
      setPrescriptions((prev) =>
        prev.map((rx) => {
          if (rx.id !== prescriptionId) return rx;
          return {
            ...rx,
            medicines: rx.medicines.map((med) => {
              if (med.id !== medicineId) return med;
              const sched = med.schedule[timing];
              if (!sched) return med;
              return {
                ...med,
                schedule: {
                  ...med.schedule,
                  [timing]: {
                    ...sched,
                    completed: !sched.completed,
                  },
                },
              };
            }),
          };
        })
      );

      // Persist in background
      await prescriptionService.toggleDoseTaken(prescriptionId, medicineId, timing);

      // Recalculate progress
      const progress = await prescriptionService.getTodayDoseProgress();
      setDoseProgress(progress);
    },
    []
  );

  return {
    prescriptions,
    loading,
    refreshing,
    error,
    doseProgress,
    refresh,
    toggleDose,
  };
};
