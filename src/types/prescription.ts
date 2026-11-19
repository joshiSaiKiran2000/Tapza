export type DoseTiming = 'morning' | 'afternoon' | 'night';
export type MealTiming = 'before_meal' | 'after_meal' | 'with_meal';

export interface DoseScheduleItem {
  time: string; // e.g. "08:30 AM", "01:30 PM", "09:00 PM"
  dosage: string; // e.g. "1 Tablet", "5 ml"
  mealTiming: MealTiming;
  completed: boolean;
}

export interface MedicineDoseSchedule {
  morning: DoseScheduleItem | null;
  afternoon: DoseScheduleItem | null;
  night: DoseScheduleItem | null;
}

export interface Medicine {
  id: string;
  name: string;
  nameHindi?: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'drops';
  strength: string; // e.g. "40mg"
  frequency: string; // e.g. "Once Daily", "Twice Daily", "Thrice Daily"
  durationDays: number;
  instructions: string;
  instructionsHindi?: string;
  schedule: MedicineDoseSchedule;
}

export interface Prescription {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  doctorDegrees: string;
  clinicName: string;
  clinicAddress: string;
  prescribedDate: string; // Formatted date e.g. "18 Nov 2026"
  prescribedDateRaw: string; // YYYY-MM-DD
  diagnosis: string;
  diagnosisHindi?: string;
  status: 'active' | 'completed';
  medicines: Medicine[];
  dietaryAdvice?: string;
  dietaryAdviceHindi?: string;
  nextFollowUpDate?: string;
}

export type DoseCompletionStorage = Record<string, boolean>;
