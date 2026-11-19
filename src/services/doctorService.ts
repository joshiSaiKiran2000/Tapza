import { apiClient } from '../api/client';
import { Doctor, Slot, Booking, CreateBookingPayload } from '../types/booking';
import { storageService, STORAGE_KEYS } from './storageService';

export const doctorService = {
  /**
   * Fetches list of all doctors from GET /doctors
   */
  async getDoctors(): Promise<Doctor[]> {
    const response = await apiClient.get<Doctor[]>('/doctors');
    return response.data;
  },

  /**
   * Fetches a specific doctor profile by ID
   */
  async getDoctorById(doctorId: string): Promise<Doctor> {
    const response = await apiClient.get<Doctor>(`/doctors/${doctorId}`);
    return response.data;
  },

  /**
   * Fetches slots for a specific doctor and date from GET /slots?doctorId=&date=
   */
  async getSlots(doctorId: string, date: string): Promise<Slot[]> {
    const response = await apiClient.get<Slot[]>('/slots', {
      params: { doctorId, date },
    });
    return response.data;
  },

  /**
   * Dispatches appointment booking request to POST /bookings
   * Throws HTTP 409 or 500 error if backend rejects or simulates conflict
   */
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const response = await apiClient.post<Booking>('/bookings', payload);
    const confirmedBooking = response.data;

    // Cache locally in AsyncStorage for offline access
    const existing = (await storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS)) || [];
    const updated = [confirmedBooking, ...existing.filter((b) => b.id !== confirmedBooking.id)];
    await storageService.setItem(STORAGE_KEYS.BOOKINGS, updated);

    return confirmedBooking;
  },

  /**
   * Fetches current patient's appointments from GET /bookings
   */
  async getBookings(): Promise<Booking[]> {
    try {
      const response = await apiClient.get<Booking[]>('/bookings');
      await storageService.setItem(STORAGE_KEYS.BOOKINGS, response.data);
      return response.data;
    } catch (error) {
      // Offline fallback: load from AsyncStorage cache
      const cached = await storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS);
      if (cached) return cached;
      throw error;
    }
  },
};
