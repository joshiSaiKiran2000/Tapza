import { useState, useEffect, useCallback } from 'react';
import { prescriptionService } from '../services/prescriptionService';
import { Prescription, DoseTiming } from '../types/prescription';

export interface UsePrescriptionDetailsResult {
  prescription: Prescription | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleDose: (medicineId: string, timing: DoseTiming) => Promise<void>;
}

export const usePrescriptionDetails = (
  prescriptionId: string
): UsePrescriptionDetailsResult => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrescription = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rx = await prescriptionService.getPrescriptionById(prescriptionId);
      setPrescription(rx);
    } catch (err: any) {
      setError(err?.message || 'Failed to load prescription');
    } finally {
      setLoading(false);
    }
  }, [prescriptionId]);

  useEffect(() => {
    loadPrescription();
  }, [loadPrescription]);

  const toggleDose = useCallback(
    async (medicineId: string, timing: DoseTiming) => {
      if (!prescription) return;

      // 1. Optimistic update
      setPrescription((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          medicines: prev.medicines.map((med) => {
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
      });

      // 2. Persist locally to AsyncStorage
      await prescriptionService.toggleDoseTaken(prescription.id, medicineId, timing);
    },
    [prescription]
  );

  return {
    prescription,
    loading,
    error,
    refresh: loadPrescription,
    toggleDose,
  };
};
