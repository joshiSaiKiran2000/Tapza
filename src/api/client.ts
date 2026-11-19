import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import normalConfig from '../config/normalConfig.json';
import diwaliConfig from '../config/diwaliConfig.json';
import { developerSettingsService } from '../services/developerSettings';
import { mockDoctors, generateSlotsForDoctor } from './mockDoctors';
import { mockPrescriptions } from './mockPrescriptions';
import { Doctor, Slot, Booking, CreateBookingPayload } from '../types/booking';

export const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.tapzacare.local/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Helper for simulating async delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory mock bookings state (seeded with 4 realistic bookings matching design: attended & confirmed)
let storedBookings: Booking[] = [
  {
    id: 'bk-101',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rakesh Kumar',
    speciality: 'Cardiologist',
    clinicName: 'Care Hospital',
    clinicAddress: 'Road No. 1, Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    appointmentDate: 'Sat, 15 Nov 2025',
    appointmentDateRaw: '2025-11-15',
    appointmentTime: '10:00 AM',
    slotId: 'slot-doc-1-2025-11-15-2',
    consultationFee: 800,
    patientName: 'Aarav Sharma',
    patientPhone: '+91 98765 43210',
    status: 'attended',
    rating: 4.7,
    reviewsCountFormatted: '8k reviews',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'bk-102',
    doctorId: 'doc-2',
    doctorName: 'Dr. Priya Sharma',
    speciality: 'General Physician',
    clinicName: 'Care Hospital',
    clinicAddress: 'Near Botanical Garden Road, Kondapur, Hyderabad',
    city: 'Hyderabad',
    appointmentDate: 'Sat, 22 Nov 2025',
    appointmentDateRaw: '2025-11-22',
    appointmentTime: '11:30 AM',
    slotId: 'slot-doc-2-2025-11-22-3',
    consultationFee: 500,
    patientName: 'Aarav Sharma',
    patientPhone: '+91 98765 43210',
    status: 'confirmed',
    rating: 4.8,
    reviewsCountFormatted: '12k reviews',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'bk-103',
    doctorId: 'doc-3',
    doctorName: 'Dr. Sneha Reddy',
    speciality: 'Pediatrician',
    clinicName: 'Apollo Clinic',
    clinicAddress: 'Jubilee Hills Check Post, Hyderabad',
    city: 'Hyderabad',
    appointmentDate: 'Mon, 10 Nov 2025',
    appointmentDateRaw: '2025-11-10',
    appointmentTime: '04:00 PM',
    slotId: 'slot-doc-3-2025-11-10-6',
    consultationFee: 600,
    patientName: 'Aarav Sharma',
    patientPhone: '+91 98765 43210',
    status: 'attended',
    rating: 4.8,
    reviewsCountFormatted: '10k reviews',
    imageUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'bk-104',
    doctorId: 'doc-4',
    doctorName: 'Dr. Arjun Mehta',
    speciality: 'Dermatologist',
    clinicName: 'Rainbow Clinic',
    clinicAddress: 'Plot 42, Financial District, Gachibowli, Hyderabad',
    city: 'Hyderabad',
    appointmentDate: 'Wed, 26 Nov 2025',
    appointmentDateRaw: '2025-11-26',
    appointmentTime: '02:15 PM',
    slotId: 'slot-doc-4-2025-11-26-5',
    consultationFee: 700,
    patientName: 'Aarav Sharma',
    patientPhone: '+91 98765 43210',
    status: 'confirmed',
    rating: 4.7,
    reviewsCountFormatted: '5k reviews',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * Custom Mock Backend Adapter for Axios
 * Simulates REST endpoints with realistic Hyderabad healthcare data,
 * network latency, API failures, and HTTP 409 slot conflicts.
 */
apiClient.defaults.adapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  const devSettings = developerSettingsService.getSettings();

  // 1. Simulate Latency
  if (devSettings.simulateLatency) {
    await delay(devSettings.latencyMs || 500);
  }

  // 2. Simulate API Failure
  if (devSettings.simulateApiFailure) {
    const error: any = new Error('Simulated Network / 500 Internal Server Failure');
    error.isAxiosError = true;
    error.response = {
      status: 500,
      statusText: 'Internal Server Error',
      data: {
        error: 'ServerError',
        message: 'Server temporarily unreachable. Please retry.',
      },
      headers: {},
      config,
    };
    throw error;
  }

  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();

  // 3. Endpoint: GET /config
  if (url.includes('/config') && method === 'GET') {
    if (devSettings.simulateEmptyResponses) {
      return {
        data: {
          version: '1.0.0',
          configId: devSettings.activeConfigId,
          configName: 'Empty Configuration',
          lastUpdated: new Date().toISOString(),
          theme: normalConfig.theme,
          navigationTabs: normalConfig.navigationTabs,
          sections: [],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    const activeConfig =
      devSettings.activeConfigId === 'diwali' ? diwaliConfig : normalConfig;

    return {
      data: activeConfig,
      status: 200,
      statusText: 'OK',
      headers: { 'cache-control': 'max-age=300' },
      config,
    };
  }

  // 4. Endpoint: GET /doctors
  if (url.includes('/doctors') && method === 'GET') {
    if (devSettings.simulateEmptyResponses) {
      return { data: [], status: 200, statusText: 'OK', headers: {}, config };
    }

    // Single doctor query: /doctors/:id
    const doctorIdMatch = url.match(/\/doctors\/([a-zA-Z0-9-]+)/);
    if (doctorIdMatch && doctorIdMatch[1]) {
      const doc = mockDoctors.find((d) => d.id === doctorIdMatch[1]);
      if (!doc) {
        const err: any = new Error('Doctor not found');
        err.isAxiosError = true;
        err.response = {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Doctor not found' },
          headers: {},
          config,
        };
        throw err;
      }
      return { data: doc, status: 200, statusText: 'OK', headers: {}, config };
    }

    return { data: mockDoctors, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 5. Endpoint: GET /slots?doctorId=&date=
  if (url.includes('/slots') && method === 'GET') {
    if (devSettings.simulateEmptyResponses) {
      return { data: [], status: 200, statusText: 'OK', headers: {}, config };
    }

    const parsedUrl = new URL(url, 'https://api.tapzacare.local');
    const doctorId = parsedUrl.searchParams.get('doctorId') || 'doc-1';
    const date = parsedUrl.searchParams.get('date') || '2026-11-20';

    const slots = generateSlotsForDoctor(doctorId, date);
    return { data: slots, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 6. Endpoint: POST /bookings (Creates a doctor appointment)
  if (url.includes('/bookings') && method === 'POST') {
    // Check for simulated HTTP 409 Conflict
    if (devSettings.simulateBookingConflict) {
      const conflictError: any = new Error(
        'HTTP 409 Conflict: This slot was just booked by another patient.'
      );
      conflictError.isAxiosError = true;
      conflictError.response = {
        status: 409,
        statusText: 'Conflict',
        data: {
          error: 'SlotAlreadyBooked',
          message:
            'This slot was just booked by another patient. Please select an alternate slot.',
        },
        headers: {},
        config,
      };
      throw conflictError;
    }

    const payload: CreateBookingPayload =
      typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

    const doctor = mockDoctors.find((d) => d.id === payload.doctorId) || mockDoctors[0];

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-5)}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      speciality: doctor.speciality,
      clinicName: doctor.clinicName,
      clinicAddress: doctor.clinicAddress,
      appointmentDate: payload.date,
      appointmentDateRaw: payload.date,
      appointmentTime: payload.time,
      slotId: payload.slotId,
      consultationFee: doctor.fee,
      patientName: payload.patientName || 'Aarav Sharma',
      patientPhone: payload.patientPhone || '+91 98765 43210',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    storedBookings.unshift(newBooking);

    return {
      data: newBooking,
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // 6b. Endpoint: POST /bookings/:id/cancel
  if (url.includes('/bookings') && url.includes('/cancel') && method === 'POST') {
    const bookingIdMatch = url.match(/\/bookings\/([a-zA-Z0-9-]+)\/cancel/);
    if (bookingIdMatch && bookingIdMatch[1]) {
      const bId = bookingIdMatch[1];
      const found = storedBookings.find((b) => b.id === bId);
      if (found) {
        found.status = 'cancelled';
        return { data: found, status: 200, statusText: 'OK', headers: {}, config };
      }
    }
  }

  // 7. Endpoint: GET /bookings
  if (url.includes('/bookings') && method === 'GET') {
    if (devSettings.simulateEmptyResponses) {
      return { data: [], status: 200, statusText: 'OK', headers: {}, config };
    }
    return { data: storedBookings, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 8. Endpoint: GET /prescriptions
  if (url.includes('/prescriptions') && method === 'GET') {
    if (devSettings.simulateEmptyResponses) {
      return { data: [], status: 200, statusText: 'OK', headers: {}, config };
    }

    // Single prescription query: /prescriptions/:id
    const prescriptionIdMatch = url.match(/\/prescriptions\/([a-zA-Z0-9-]+)/);
    if (prescriptionIdMatch && prescriptionIdMatch[1]) {
      const rx = mockPrescriptions.find((p) => p.id === prescriptionIdMatch[1]);
      if (!rx) {
        const err: any = new Error('Prescription not found');
        err.isAxiosError = true;
        err.response = {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Prescription not found' },
          headers: {},
          config,
        };
        throw err;
      }
      return { data: rx, status: 200, statusText: 'OK', headers: {}, config };
    }

    return { data: mockPrescriptions, status: 200, statusText: 'OK', headers: {}, config };
  }

  // Fallback for unmatched endpoints
  return {
    data: { message: 'Endpoint matched mock backend' },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
};
