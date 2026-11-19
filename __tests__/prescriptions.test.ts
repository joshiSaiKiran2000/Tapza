import { prescriptionService } from '../src/services/prescriptionService';
import { storageService, STORAGE_KEYS } from '../src/services/storageService';

describe('Prescriptions & Medicine Dose Tracking', () => {
  beforeEach(async () => {
    // Clear dose storage before each test
    await storageService.removeItem(STORAGE_KEYS.MEDICINE_DOSES);
  });

  it('fetches electronic prescriptions with diagnosis, doctor and clinic info', async () => {
    const prescriptions = await prescriptionService.getPrescriptions();
    expect(prescriptions.length).toBeGreaterThan(0);

    const rx = prescriptions[0];
    expect(rx.id).toBe('rx-201');
    expect(rx.doctorName).toBe('Dr. Ramesh Reddy');
    expect(rx.clinicName).toContain('Care Hospitals');
    expect(rx.medicines.length).toBeGreaterThan(0);
  });

  it('verifies morning, afternoon, and night schedules on prescribed medicines', async () => {
    const rx = await prescriptionService.getPrescriptionById('rx-201');
    expect(rx).toBeDefined();

    const telmisartan = rx?.medicines.find((m) => m.name.includes('Telmisartan'));
    expect(telmisartan).toBeDefined();
    expect(telmisartan?.schedule.morning).toBeDefined();
    expect(telmisartan?.schedule.morning?.time).toBe('08:30 AM');
    expect(telmisartan?.schedule.morning?.mealTiming).toBe('after_meal');

    const atorvastatin = rx?.medicines.find((m) => m.name.includes('Atorvastatin'));
    expect(atorvastatin).toBeDefined();
    expect(atorvastatin?.schedule.night).toBeDefined();
    expect(atorvastatin?.schedule.night?.time).toBe('09:30 PM');
  });

  it('allows users to mark individual doses as taken and persists locally', async () => {
    const rxId = 'rx-201';
    const medId = 'med-101';
    const timing = 'morning';

    // 1. Initial state: not taken
    let rx = await prescriptionService.getPrescriptionById(rxId);
    let med = rx?.medicines.find((m) => m.id === medId);
    expect(med?.schedule.morning?.completed).toBe(false);

    // 2. Mark dose as taken
    const result = await prescriptionService.toggleDoseTaken(rxId, medId, timing);
    expect(result).toBe(true);

    // 3. Fetch again and verify persistence
    rx = await prescriptionService.getPrescriptionById(rxId);
    med = rx?.medicines.find((m) => m.id === medId);
    expect(med?.schedule.morning?.completed).toBe(true);

    // 4. Verify directly in storage
    const stored = await storageService.getItem<Record<string, boolean>>(
      STORAGE_KEYS.MEDICINE_DOSES
    );
    const key = prescriptionService.getDoseKey(rxId, medId, timing);
    expect(stored?.[key]).toBe(true);
  });

  it('allows un-marking a dose if marked accidentally', async () => {
    const rxId = 'rx-201';
    const medId = 'med-101';
    const timing = 'morning';

    // Mark taken
    await prescriptionService.toggleDoseTaken(rxId, medId, timing);

    // Unmark
    const result = await prescriptionService.toggleDoseTaken(rxId, medId, timing);
    expect(result).toBe(false);

    const rx = await prescriptionService.getPrescriptionById(rxId);
    const med = rx?.medicines.find((m) => m.id === medId);
    expect(med?.schedule.morning?.completed).toBe(false);
  });

  it('calculates daily dose compliance progress accurately', async () => {
    const initialProgress = await prescriptionService.getTodayDoseProgress();
    expect(initialProgress.total).toBeGreaterThan(0);

    // Mark one dose taken
    await prescriptionService.toggleDoseTaken('rx-201', 'med-101', 'morning');

    const updatedProgress = await prescriptionService.getTodayDoseProgress();
    expect(updatedProgress.completed).toBe(initialProgress.completed + 1);
    expect(updatedProgress.percentage).toBeGreaterThanOrEqual(initialProgress.percentage);
  });
});
