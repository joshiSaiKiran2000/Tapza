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

// In-memory mock bookings state (seeded with 2 realistic bookings)
let storedBookings: Booking[] = [
  {
    id: 'bk-101',
    doctorId: 'doc-1',
    doctorName: 'Dr. Ramesh Reddy',
    speciality: 'Cardiologist (DM AIIMS)',
    clinicName: 'Care Hospitals Banjara Hills',
    clinicAddress: 'Road No. 1, Banjara Hills, Hyderabad',
    appointmentDate: 'Tomorrow, 20 Nov 2026',
    appointmentDateRaw: '2026-11-20',
    appointmentTime: '10:30 AM',
    slotId: 'slot-doc-1-2026-11-20-4',
    consultationFee: 800,
    patientName: 'Aarav Sharma',
    patientPhone: '+91 98765 43210',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'bk-102',
    doctorId: 'doc-2',
    doctorName: 'Dr. Priya Sharma',
    speciality: 'Pediatrician (MD, DCH)',
    clinicName: 'Rainbow Children’s Clinic',
    clinicAddress: 'Near Botanical Garden Road, Kondapur, Hyderabad',
    appointmentDate: 'Sat, 22 Nov 2026',
    appointmentDateRaw: '2026-11-22',
    appointmentTime: '04:15 PM',
    slotId: 'slot-doc-2-2026-11-22-8',
    consultationFee: 650,
    patientName: 'Aarav Sharma',
    patientPhone: '+91 98765 43210',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
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
