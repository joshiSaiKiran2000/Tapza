export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  specialityHindi?: string;
  degrees: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  fee: number;
  clinicName: string;
  clinicAddress: string;
  city: string;
  languages: string[];
  about: string;
  aboutHindi?: string;
  availableDates: string[];
  imageUrl?: string;
}

export type SlotPeriod = 'morning' | 'afternoon' | 'evening';

export interface Slot {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  period: SlotPeriod;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  speciality: string;
  clinicName: string;
  clinicAddress: string;
  appointmentDate: string; // Formatted display date, e.g. "Fri, 20 Nov 2026"
  appointmentDateRaw: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "10:30 AM"
  slotId: string;
  consultationFee: number;
  patientName: string;
  patientPhone: string;
  status: 'confirmed' | 'pending' | 'failed' | 'cancelled' | 'attended';
  createdAt: string;
  isOptimistic?: boolean;
  rating?: number;
  reviewsCountFormatted?: string;
  imageUrl?: string;
  city?: string;
}

export interface CreateBookingPayload {
  doctorId: string;
  slotId: string;
  date: string; // YYYY-MM-DD
  time: string;
  patientName: string;
  patientPhone: string;
}
