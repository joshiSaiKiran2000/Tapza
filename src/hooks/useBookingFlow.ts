import { useState, useEffect, useCallback, useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { doctorService } from '../services/doctorService';
import { Doctor, Slot, Booking } from '../types/booking';

export interface UseBookingFlowProps {
  doctorId: string;
}

export interface UseBookingFlowResult {
  doctor: Doctor | null;
  loadingDoctor: boolean;
  doctorError: string | null;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  slots: Slot[];
  loadingSlots: boolean;
  slotsError: string | null;
  retryFetchSlots: () => void;
  selectedSlot: Slot | null;
  setSelectedSlot: (slot: Slot | null) => void;
  isBooking: boolean;
  bookingError: string | null;
  optimisticBooking: Booking | null;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  isSlotSheetOpen: boolean;
  openSlotSheet: () => void;
  closeSlotSheet: () => void;
  confirmBooking: (
    slot: Slot,
    patientName: string
  ) => Promise<Booking | null>;
  retryLastBooking: () => Promise<Booking | null>;
}

export const useBookingFlow = ({ doctorId }: UseBookingFlowProps): UseBookingFlowResult => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState<boolean>(true);
  const [doctorError, setDoctorError] = useState<string | null>(null);

  // Default to today/first available date
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-20');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [optimisticBooking, setOptimisticBooking] = useState<Booking | null>(null);
  const [isSlotSheetOpen, setIsSlotSheetOpen] = useState<boolean>(false);

  // Store last payload for retry functionality
  const lastBookingAttempt = useRef<{ slot: Slot; patientName: string } | null>(null);

  // 1. Fetch Doctor Profile
  const fetchDoctor = useCallback(async () => {
    setLoadingDoctor(true);
    setDoctorError(null);
    try {
      const doc = await doctorService.getDoctorById(doctorId);
      setDoctor(doc);
      if (doc.availableDates?.length) {
        setSelectedDate(doc.availableDates[0]);
      }
    } catch (err: any) {
      setDoctorError(err?.message || 'Failed to load doctor profile');
    } finally {
      setLoadingDoctor(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  // 2. Fetch Slots whenever doctorId or selectedDate changes
  const fetchSlots = useCallback(async () => {
    if (!doctorId || !selectedDate) return;
    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlot(null);
    setBookingError(null);

    try {
      const data = await doctorService.getSlots(doctorId, selectedDate);
      setSlots(data);
    } catch (err: any) {
      setSlotsError(err?.message || 'Failed to load slots for this date');
    } finally {
      setLoadingSlots(false);
    }
  }, [doctorId, selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const openSlotSheet = useCallback(() => {
    setBookingError(null);
    setIsSlotSheetOpen(true);
  }, []);

  const closeSlotSheet = useCallback(() => {
    setIsSlotSheetOpen(false);
  }, []);

  // 3. Confirm Booking with Optimistic UI updates and Rollback on Conflict/Failure
  const confirmBooking = useCallback(
    async (slot: Slot, patientName: string): Promise<Booking | null> => {
      if (!doctor) return null;

      lastBookingAttempt.current = { slot, patientName };
      setIsBooking(true);
      setBookingError(null);

      // --- OPTIMISTIC UPDATE ---
      // Create a temporary optimistic booking representation
      const tempBooking: Booking = {
        id: `bk-temp-${Date.now()}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        speciality: doctor.speciality,
        clinicName: doctor.clinicName,
        clinicAddress: doctor.clinicAddress,
        appointmentDate: slot.date,
        appointmentDateRaw: slot.date,
        appointmentTime: slot.time,
        slotId: slot.id,
        consultationFee: doctor.fee,
        patientName,
        patientPhone: '+91 98765 43210',
        status: 'pending',
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      setOptimisticBooking(tempBooking);

      try {
        const confirmed = await doctorService.createBooking({
          doctorId: doctor.id,
          slotId: slot.id,
          date: slot.date,
          time: slot.time,
          patientName,
          patientPhone: '+91 98765 43210',
        });

        // Booking verified and confirmed by backend!
        setOptimisticBooking(null);
        closeSlotSheet();
        return confirmed;
      } catch (error: any) {
        // --- ROLLBACK OPTIMISTIC UPDATE ---
        // Backend rejected booking! Revert optimistic state immediately.
        setOptimisticBooking(null);

        const status = error?.response?.status;
        const serverMessage = error?.response?.data?.message;

        if (status === 409) {
          // HTTP 409 Slot Conflict
          setBookingError(
            serverMessage ||
            'Slot was just booked by another patient. Please choose an alternate slot.'
          );
          // Mark the conflicted slot as unavailable in local state
          setSlots((prev) =>
            prev.map((s) =>
              s.id === slot.id ? { ...s, isAvailable: false, isBooked: true } : s
            )
          );
          setSelectedSlot(null);
        } else {
          // General Network or 500 error
          setBookingError(
            serverMessage ||
            'Connection error during booking. Please tap retry to try again.'
          );
        }
        return null;
      } finally {
        setIsBooking(false);
      }
    },
    [doctor, closeSlotSheet]
  );

  const retryLastBooking = useCallback(async (): Promise<Booking | null> => {
    if (!lastBookingAttempt.current) return null;
    return confirmBooking(
      lastBookingAttempt.current.slot,
      lastBookingAttempt.current.patientName
    );
  }, [confirmBooking]);

  return {
    doctor,
    loadingDoctor,
    doctorError,
    selectedDate,
    setSelectedDate,
    slots,
    loadingSlots,
    slotsError,
    retryFetchSlots: fetchSlots,
    selectedSlot,
    setSelectedSlot,
    isBooking,
    bookingError,
    optimisticBooking,
    bottomSheetRef,
    isSlotSheetOpen,
    openSlotSheet,
    closeSlotSheet,
    confirmBooking,
    retryLastBooking,
  };
};
