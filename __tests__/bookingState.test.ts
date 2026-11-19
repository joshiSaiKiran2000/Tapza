import { doctorService } from '../src/services/doctorService';
import { developerSettingsService } from '../src/services/developerSettings';

describe('Booking State Management & Conflict Handling', () => {
  beforeEach(async () => {
    // Reset dev settings before each test
    await developerSettingsService.updateSettings({
      simulateLatency: false,
      simulateApiFailure: false,
      simulateBookingConflict: false,
      simulateEmptyResponses: false,
    });
  });

  it('fetches doctors with realistic Hyderabad clinic data', async () => {
    const doctors = await doctorService.getDoctors();
    expect(doctors.length).toBeGreaterThan(0);
    const ramesh = doctors.find((d) => d.id === 'doc-1');
    expect(ramesh).toBeDefined();
    expect(ramesh?.name).toBe('Dr. Ramesh Reddy');
    expect(ramesh?.fee).toBe(800);
    expect(ramesh?.clinicName).toContain('Care Hospitals');
    expect(ramesh?.languages).toContain('हिन्दी');
  });

  it('fetches slots for a doctor on a specific date with morning, afternoon and evening slots', async () => {
    const slots = await doctorService.getSlots('doc-1', '2026-11-20');
    expect(slots.length).toBeGreaterThan(0);

    const morning = slots.filter((s) => s.period === 'morning');
    const afternoon = slots.filter((s) => s.period === 'afternoon');
    const evening = slots.filter((s) => s.period === 'evening');

    expect(morning.length).toBeGreaterThan(0);
    expect(afternoon.length).toBeGreaterThan(0);
    expect(evening.length).toBeGreaterThan(0);
  });

  it('successfully creates an appointment booking', async () => {
    const booking = await doctorService.createBooking({
      doctorId: 'doc-1',
      slotId: 'slot-doc-1-2026-11-20-4',
      date: '2026-11-20',
      time: '10:30 AM',
      patientName: 'Aarav Sharma',
      patientPhone: '+91 98765 43210',
    });

    expect(booking.id).toBeDefined();
    expect(booking.status).toBe('confirmed');
    expect(booking.doctorName).toBe('Dr. Ramesh Reddy');
    expect(booking.consultationFee).toBe(800);
    expect(booking.appointmentTime).toBe('10:30 AM');
  });

  it('handles HTTP 409 slot conflict properly and rejects booking', async () => {
    // Enable booking conflict simulation
    await developerSettingsService.updateSettings({
      simulateBookingConflict: true,
    });

    let conflictCaught = false;
    try {
      await doctorService.createBooking({
        doctorId: 'doc-1',
        slotId: 'slot-doc-1-2026-11-20-5',
        date: '2026-11-20',
        time: '11:15 AM',
        patientName: 'Aarav Sharma',
        patientPhone: '+91 98765 43210',
      });
    } catch (error: any) {
      conflictCaught = true;
      expect(error.response.status).toBe(409);
      expect(error.response.data.error).toBe('SlotAlreadyBooked');
      expect(error.response.data.message).toContain('booked by another patient');
    }

    expect(conflictCaught).toBe(true);
  });

  it('handles simulated 500 network server failure and rejects booking', async () => {
    await developerSettingsService.updateSettings({
      simulateApiFailure: true,
    });

    let failureCaught = false;
    try {
      await doctorService.createBooking({
        doctorId: 'doc-1',
        slotId: 'slot-doc-1-2026-11-20-6',
        date: '2026-11-20',
        time: '11:45 AM',
        patientName: 'Aarav Sharma',
        patientPhone: '+91 98765 43210',
      });
    } catch (error: any) {
      failureCaught = true;
      expect(error.response.status).toBe(500);
      expect(error.response.data.message).toContain('Server temporarily unreachable');
    }

    expect(failureCaught).toBe(true);
  });

  it('fetches existing bookings from storage or API', async () => {
    const bookings = await doctorService.getBookings();
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
  });
});
