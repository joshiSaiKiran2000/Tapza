import { Doctor, Slot, SlotPeriod } from '../types/booking';

export const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ramesh Reddy',
    speciality: 'Cardiologist',
    specialityHindi: 'हृदय रोग विशेषज्ञ',
    degrees: 'MBBS, MD (Medicine), DM (Cardiology - AIIMS Delhi)',
    experienceYears: 16,
    rating: 4.9,
    reviewsCount: 348,
    fee: 800,
    clinicName: 'Care Hospitals Banjara Hills',
    clinicAddress: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034',
    city: 'Hyderabad',
    languages: ['English', 'हिन्दी', 'తెలుగు'],
    about:
      'Senior Interventional Cardiologist specializing in adult cardiac care, hypertension control, angioplasty, and preventative cardiology. Over 16 years of clinical excellence in Hyderabad.',
    aboutHindi:
      'वरिष्ठ हृदय रोग विशेषज्ञ - उच्च रक्तचाप, एंजियोप्लास्टी और प्रिवेंटिव कार्डियोलॉजी में 16+ वर्षों का अनुभव।',
    availableDates: ['2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22', '2026-11-23'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Sharma',
    speciality: 'Pediatrician',
    specialityHindi: 'बाल रोग विशेषज्ञ',
    degrees: 'MBBS, MD (Pediatrics), DCH',
    experienceYears: 12,
    rating: 4.8,
    reviewsCount: 215,
    fee: 650,
    clinicName: 'Rainbow Children’s Clinic',
    clinicAddress: 'Near Botanical Garden Road, Kondapur, Hyderabad, Telangana 500084',
    city: 'Hyderabad',
    languages: ['English', 'हिन्दी', 'తెలుగు'],
    about:
      'Consultant Pediatrician dedicated to child health, newborn care, developmental assessment, and routine childhood immunizations in Cyberabad.',
    aboutHindi: 'शिशु एवं बाल रोग विशेषज्ञ - नवजात शिशु देखभाल और टीकाकरण विशेषज्ञ।',
    availableDates: ['2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22', '2026-11-24'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Ananya Sen',
    speciality: 'Dermatologist',
    specialityHindi: 'त्वचा एवं सौंदर्य विशेषज्ञ',
    degrees: 'MBBS, MD (Dermatology & Venereology)',
    experienceYears: 9,
    rating: 4.9,
    reviewsCount: 189,
    fee: 700,
    clinicName: 'Apollo Clinics Jubilee Hills',
    clinicAddress: 'Plot 48, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
    city: 'Hyderabad',
    languages: ['English', 'हिन्दी', 'বাংলা'],
    about:
      'Expert in clinical dermatology, acne treatments, hair restoration, and seasonal allergy skin reactions.',
    aboutHindi: 'त्वचा विशेषज्ञ - मुँहासे, बालों की समस्या और मौसमी त्वचा एलर्जी का उपचार।',
    availableDates: ['2026-11-20', '2026-11-21', '2026-11-22', '2026-11-23'],
  },
  {
    id: 'doc-4',
    name: 'Dr. Vikram Rao',
    speciality: 'General Physician',
    specialityHindi: 'सामान्य चिकित्सक',
    degrees: 'MBBS, DNB (Family Medicine)',
    experienceYears: 14,
    rating: 4.7,
    reviewsCount: 412,
    fee: 500,
    clinicName: 'AIG Hospitals OPD Wing',
    clinicAddress: '1-66/AIG, Mindspace Road, Gachibowli, Hyderabad, Telangana 500032',
    city: 'Hyderabad',
    languages: ['English', 'हिन्दी', 'తెలుగు'],
    about:
      'Family Physician with deep expertise in managing diabetes, seasonal viral fevers, chronic lifestyle disorders, and comprehensive health checkups.',
    aboutHindi: 'पारिवारिक चिकित्सक - मधुमेह, मौसमी बुखार और जीवनशैली से जुड़ी बीमारियों के विशेषज्ञ।',
    availableDates: ['2026-11-19', '2026-11-20', '2026-11-21', '2026-11-23', '2026-11-25'],
  },
  {
    id: 'doc-5',
    name: 'Dr. Suresh Varma',
    speciality: 'Orthopedic Surgeon',
    specialityHindi: 'हड्डी रोग विशेषज्ञ',
    degrees: 'MBBS, MS (Orthopedics), M.Ch (Joint Replacement)',
    experienceYears: 18,
    rating: 4.8,
    reviewsCount: 295,
    fee: 900,
    clinicName: 'Yashoda Hospitals Somajiguda',
    clinicAddress: 'Raj Bhavan Road, Somajiguda, Hyderabad, Telangana 500082',
    city: 'Hyderabad',
    languages: ['English', 'हिन्दी', 'తెలుగు'],
    about:
      'Senior Orthopedic and Joint Replacement Specialist focusing on knee arthritis, sports injuries, fracture management, and spine health.',
    aboutHindi: 'वरिष्ठ हड्डी रोग विशेषज्ञ - जोड़ों का दर्द, आर्थराइटिस और स्पोर्ट्स इंजरी उपचार।',
    availableDates: ['2026-11-19', '2026-11-20', '2026-11-22', '2026-11-24'],
  },
];

/**
 * Generates realistic appointment time slots for a given doctor and date
 */
export const generateSlotsForDoctor = (doctorId: string, date: string): Slot[] => {
  // Pre-configured slots per time of day
  const rawSlots: Array<{ time: string; period: SlotPeriod }> = [
    { time: '09:00 AM', period: 'morning' },
    { time: '09:30 AM', period: 'morning' },
    { time: '10:00 AM', period: 'morning' },
    { time: '10:30 AM', period: 'morning' },
    { time: '11:15 AM', period: 'morning' },
    { time: '11:45 AM', period: 'morning' },
    { time: '02:00 PM', period: 'afternoon' },
    { time: '02:30 PM', period: 'afternoon' },
    { time: '03:15 PM', period: 'afternoon' },
    { time: '03:45 PM', period: 'afternoon' },
    { time: '05:00 PM', period: 'evening' },
    { time: '05:30 PM', period: 'evening' },
    { time: '06:15 PM', period: 'evening' },
    { time: '07:00 PM', period: 'evening' },
  ];

  return rawSlots.map((item, index) => {
    // Generate predictable availability: e.g. slot 2 and slot 8 are pre-booked
    const isBooked = index === 1 || index === 7;
    return {
      id: `slot-${doctorId}-${date}-${index + 1}`,
      doctorId,
      date,
      time: item.time,
      period: item.period,
      isAvailable: !isBooked,
      isBooked,
    };
  });
};
