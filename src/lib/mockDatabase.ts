import { PatientProfile } from './types';

export const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'MS-IND-89421',
    fullName: 'Rajesh Kumar Sharma',
    aadhaarNumber: '234567890123',
    mobileNumber: '9876543210',
    dob: '1971-08-14',
    gender: 'Male',
    bloodGroup: 'O-',
    address: 'Flat 402, Shanti Vihar, Sector 15',
    city: 'Jaipur',
    state: 'Rajasthan',
    existingConditions: [
      'Type 2 Diabetes Mellitus (HbA1c: 7.8%)',
      'Primary Essential Hypertension',
      'Coronary Artery Disease (Post-PCI)',
    ],
    pastDiseases: [
      'Mild Ischemic Attack (TIA) - June 2023',
      'COVID-19 with Moderate Pulmonary Involvement - 2021',
    ],
    surgeriesAndImplants: [
      'Drug-Eluting Stent in LAD Artery (May 2022, AIIMS New Delhi)',
      'Laparoscopic Cholecystectomy (2018)',
    ],
    allergies: [
      {
        allergen: 'PENICILLIN & BETA-LACTAMS',
        severity: 'CRITICAL',
        reaction: 'Severe Anaphylactic shock, bronchospasm, facial angioedema',
      },
      {
        allergen: 'NSAIDs (Ibuprofen / Diclofenac)',
        severity: 'MODERATE',
        reaction: 'Severe gastric bleeding, hives, and acute bronchospasm',
      },
      {
        allergen: 'Radiocontrast Dye',
        severity: 'MODERATE',
        reaction: 'Hypotension, skin flushing, renal stress',
      },
    ],
    vitals: {
      bloodPressure: '138/86 mmHg',
      heartRate: 78,
      spO2: 97,
      bloodSugar: '142 mg/dL (Random)',
      temperature: '98.4 °F',
      lastRecorded: '2026-09-18T10:30:00Z',
    },
    prescriptions: [
      {
        id: 'rx-101',
        medicationName: 'Clopidogrel (Antiplatelet)',
        dosage: '75 mg',
        frequency: 'Once Daily at Bedtime',
        prescribedBy: 'Dr. Vivek Mehra (Cardiologist)',
        hospitalOrClinic: 'SMS Medical College Hospital',
        datePrescribed: '2026-08-10',
        notes: 'Critical post-stent therapy. DO NOT DISCONTINUE without cardiology consult.',
      },
      {
        id: 'rx-102',
        medicationName: 'Metformin HCl',
        dosage: '1000 mg Extended Release',
        frequency: 'Twice Daily with Meals',
        prescribedBy: 'Dr. Neha Kapoor (Endocrinologist)',
        hospitalOrClinic: 'Apex Heart & Diabetes Institute',
        datePrescribed: '2026-07-22',
        notes: 'Monitor renal function annually.',
      },
      {
        id: 'rx-103',
        medicationName: 'Telmisartan',
        dosage: '40 mg',
        frequency: 'Once Daily in the Morning',
        prescribedBy: 'Dr. Vivek Mehra',
        hospitalOrClinic: 'SMS Medical College Hospital',
        datePrescribed: '2026-08-10',
        notes: 'Target BP < 130/80 mmHg.',
      },
      {
        id: 'rx-104',
        medicationName: 'Rosuvastatin',
        dosage: '20 mg',
        frequency: 'Once Daily at Night',
        prescribedBy: 'Dr. Vivek Mehra',
        hospitalOrClinic: 'SMS Medical College Hospital',
        datePrescribed: '2026-08-10',
        notes: 'Lipid profile reassessment scheduled.',
      },
    ],
    diagnostics: [
      {
        id: 'diag-1',
        testName: 'HbA1c (Glycated Hemoglobin)',
        value: '6.8',
        unit: '%',
        referenceRange: '4.0 - 5.6%',
        status: 'ELEVATED',
        laboratoryName: 'Dr. Lal PathLabs, Central Branch',
        dateRecorded: '2026-09-12',
        specialNote: 'Follow low carbohydrate diet; retest after 90 days.',
      },
      {
        id: 'diag-2',
        testName: 'Serum Creatinine',
        value: '1.1',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3 mg/dL',
        status: 'NORMAL',
        laboratoryName: 'Apollo Diagnostics Laboratory',
        dateRecorded: '2026-09-10',
        specialNote: 'Renal profile within safe baseline.',
      },
      {
        id: 'diag-3',
        testName: 'Troponin-I (High Sensitivity)',
        value: '0.012',
        unit: 'ng/mL',
        referenceRange: '< 0.04 ng/mL',
        status: 'NORMAL',
        laboratoryName: 'AIIMS Emergency Bio-Core',
        dateRecorded: '2026-08-28',
        specialNote: 'Cardiac biomarker negative for acute necrosis.',
      },
    ],
    surgicalLogs: [
      {
        id: 'surg-1',
        procedureName: 'Coronary Angioplasty with Drug-Eluting Stent in LAD',
        surgeryDate: '2022-05-14',
        operatingSurgeon: 'Dr. Vivek Mehra (Cardiologist, MD DM)',
        hospitalOfSurgery: 'AIIMS New Delhi Trauma Center',
        implantsUsed: 'Xience Sierra 3.0x28mm Everolimus-Eluting Coronary Stent',
        specialNote: 'Dual antiplatelet therapy mandatory. No contrast angiography without hydration.',
      },
      {
        id: 'surg-2',
        procedureName: 'Laparoscopic Cholecystectomy',
        surgeryDate: '2018-11-20',
        operatingSurgeon: 'Dr. Sanjay Kaul (MS General Surgery)',
        hospitalOfSurgery: 'SMS Medical College Hospital, Jaipur',
        implantsUsed: 'Titanium ligating surgical clips (MRI Safe)',
        specialNote: 'Uneventful recovery. Gallbladder histology benign.',
      },
    ],
    emergencyContacts: [
      {
        id: 'ec-1',
        name: 'Pooja Sharma',
        relationship: 'Spouse',
        phone: '+91 98765 43211',
        isPrimary: true,
      },
      {
        id: 'ec-2',
        name: 'Aman Sharma',
        relationship: 'Son',
        phone: '+91 98765 99887',
        isPrimary: false,
      },
    ],
    nominees: [
      {
        id: 'nom-1',
        name: 'Pooja Sharma',
        relationship: 'Spouse',
        phone: '+91 98765 43211',
        aadhaarNumberMasked: 'XXXX-XXXX-8812',
        authorizedActions: ['UPDATE_PRESCRIPTIONS', 'VIEW_RECORDS', 'APPROVE_EMERGENCY_DATA'],
      },
    ],
    organDonor: true,
    dnrStatus: false,
    lastProfileUpdate: '2026-08-10T14:20:00Z',
    lastUpdatedBy: 'Dr. Vivek Mehra (SMS Medical College Hospital)',
    vitalsHistory: [
      {
        id: 'vh-1',
        timestamp: '2026-08-10T14:20:00Z',
        recordedBy: 'Dr. Vivek Mehra (SMS Hospital)',
        heartRate: 78,
        bloodPressure: '138/86 mmHg',
        spO2: 97,
        bloodSugar: '142 mg/dL',
        notes: 'Post-PCI routine checkup. Vitals stable.',
      },
      {
        id: 'vh-0',
        timestamp: '2026-05-14T09:15:00Z',
        recordedBy: 'AIIMS New Delhi Trauma ICU',
        heartRate: 84,
        bloodPressure: '144/90 mmHg',
        spO2: 96,
        bloodSugar: '158 mg/dL',
        notes: 'Pre-discharge clinical assessment.',
      },
    ],
    nextReviewDueDate: '2026-12-10T00:00:00Z', // 4 months from Aug 10
    hasCompletedSetup: true,
    isRegisteredAtOfflineCamp: false,
    accessLogs: [
      {
        id: 'log-1',
        timestamp: '2026-09-02T18:14:00Z',
        accessorName: 'Dr. Anand Verma',
        accessorRole: 'EMERGENCY_DOCTOR',
        hospitalOrLocation: 'Emergency Care Unit, Fortis Hospital',
        licenseNumber: 'MCI-REG-44819',
        accessType: 'BREAK_GLASS_OVERRIDE',
        reason: 'Acute chest tightness during road transit, severe penicillin allergy alert needed',
      },
    ],
  },
  {
    id: 'MS-IND-44219',
    fullName: 'Sunita Devi',
    aadhaarNumber: '456789012345',
    mobileNumber: '9123456789',
    dob: '1957-03-25',
    gender: 'Female',
    bloodGroup: 'B+',
    address: 'Village Ramgarh, Post Khurd',
    city: 'Alwar',
    state: 'Rajasthan',
    existingConditions: [
      'Chronic Bronchial Asthma',
      'Osteoarthritis (Bilateral Knees)',
      'Mild Senile Cataract',
    ],
    pastDiseases: ['Tuberculosis - Completed DOTS Course 2014'],
    surgeriesAndImplants: ['None recorded'],
    allergies: [
      {
        allergen: 'ASPIRIN / SALICYLATES',
        severity: 'CRITICAL',
        reaction: 'Asthma exacerbation, respiratory distress (Aspirin-Exacerbated Respiratory Disease)',
      },
      {
        allergen: 'SULFA DRUGS',
        severity: 'MODERATE',
        reaction: 'Severe skin rash and blistering',
      },
    ],
    vitals: {
      bloodPressure: '124/78 mmHg',
      heartRate: 72,
      spO2: 95,
      temperature: '98.2 °F',
      lastRecorded: '2026-09-12T11:15:00Z',
    },
    prescriptions: [
      {
        id: 'rx-201',
        medicationName: 'Budesonide + Formoterol Inhaler (200/6 mcg)',
        dosage: '2 Puffs',
        frequency: 'Twice Daily with Spacer',
        prescribedBy: 'Dr. K. L. Meena',
        hospitalOrClinic: 'Community Health Centre (CHC), Ramgarh',
        datePrescribed: '2026-09-12',
        notes: 'Rinse mouth with water after each inhalation.',
      },
      {
        id: 'rx-202',
        medicationName: 'Levocetirizine',
        dosage: '5 mg',
        frequency: 'As Needed at Night',
        prescribedBy: 'Dr. K. L. Meena',
        hospitalOrClinic: 'CHC Ramgarh',
        datePrescribed: '2026-09-12',
      },
    ],
    emergencyContacts: [
      {
        id: 'ec-3',
        name: 'Ramesh Yadav',
        relationship: 'Son (Village Sarpanch contact)',
        phone: '+91 91234 56780',
        isPrimary: true,
      },
    ],
    nominees: [
      {
        id: 'nom-2',
        name: 'Ramesh Yadav',
        relationship: 'Son',
        phone: '+91 91234 56780',
        aadhaarNumberMasked: 'XXXX-XXXX-4421',
        authorizedActions: ['UPDATE_PRESCRIPTIONS', 'VIEW_RECORDS'],
      },
    ],
    organDonor: false,
    dnrStatus: false,
    lastProfileUpdate: '2026-09-12T11:15:00Z',
    nextReviewDueDate: '2027-01-12T00:00:00Z',
    isRegisteredAtOfflineCamp: true,
    registeredCampLocation: 'Alwar Rural Camp #4',
    hasCompletedSetup: true,
    accessLogs: [],
  },
];

// Helper to sanitize Aadhaar & Mobile search queries
export function normalizeQuery(query: string): string {
  return query.replace(/[\s-]/g, '').trim();
}

// In-memory / storage functions
let currentPatients: PatientProfile[] = [...INITIAL_PATIENTS];

export function getPatients(): PatientProfile[] {
  return currentPatients;
}

export function findPatientByAadhaarOrMobile(query: string): PatientProfile | undefined {
  const clean = normalizeQuery(query);
  return currentPatients.find(
    (p) =>
      normalizeQuery(p.aadhaarNumber) === clean ||
      normalizeQuery(p.mobileNumber) === clean ||
      p.id.toLowerCase() === query.trim().toLowerCase()
  );
}

export function logPatientAccess(patientId: string, logEntry: Omit<import('./types').AccessAuditLog, 'id' | 'timestamp'>) {
  const patient = currentPatients.find((p) => p.id === patientId);
  if (patient) {
    const newLog: import('./types').AccessAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...logEntry,
    };
    patient.accessLogs.unshift(newLog);
    return newLog;
  }
  return null;
}

export function updatePatientProfile(updated: PatientProfile): boolean {
  const idx = currentPatients.findIndex((p) => p.id === updated.id);
  if (idx !== -1) {
    currentPatients[idx] = {
      ...updated,
      lastProfileUpdate: new Date().toISOString(),
    };
    return true;
  }
  return false;
}

export function registerCampPatient(profileData: Omit<PatientProfile, 'id' | 'lastProfileUpdate' | 'nextReviewDueDate' | 'accessLogs'>): PatientProfile {
  const newId = `MS-CAMP-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setMonth(nextReview.getMonth() + 4);

  const newPatient: PatientProfile = {
    ...profileData,
    id: newId,
    lastProfileUpdate: now.toISOString(),
    nextReviewDueDate: nextReview.toISOString(),
    isRegisteredAtOfflineCamp: true,
    accessLogs: [
      {
        id: `log-reg-${Date.now()}`,
        timestamp: now.toISOString(),
        accessorName: 'Camp Field Worker / ASHA Operator',
        accessorRole: 'CAMP_VOLUNTEER',
        hospitalOrLocation: profileData.registeredCampLocation || 'MediSync Offline Camp',
        accessType: 'CAMP_REGISTRATION',
        reason: 'Initial camp registration for digital inclusivity',
      },
    ],
  };

  currentPatients.unshift(newPatient);
  return newPatient;
}

/**
 * Generate unique individual patient ID matching format e.g. MS-IND-DQ1Q1
 */
export function generateHospitalPatientId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MS-IND-${suffix}`;
}

/**
 * Retrieve all hospital enrolled patients from localStorage and in-memory DB
 */
export function getHospitalPatients(): PatientProfile[] {
  if (typeof window === 'undefined') {
    return currentPatients;
  }
  try {
    const raw = localStorage.getItem('medisync_hospital_patients');
    if (raw) {
      const parsed: PatientProfile[] = JSON.parse(raw);
      const mergedMap = new Map<string, PatientProfile>();
      currentPatients.forEach((p) => mergedMap.set(p.id, p));
      parsed.forEach((p) => mergedMap.set(p.id, p));
      return Array.from(mergedMap.values());
    }
  } catch (e) {
    console.warn('Could not load hospital patients from storage:', e);
  }
  return currentPatients;
}

/**
 * Save / enroll a patient into the hospital sub-database
 */
export function saveHospitalPatient(newPatient: PatientProfile): PatientProfile {
  const existingIdx = currentPatients.findIndex((p) => p.id === newPatient.id);
  if (existingIdx !== -1) {
    currentPatients[existingIdx] = newPatient;
  } else {
    currentPatients.unshift(newPatient);
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = getHospitalPatients();
      const updated = [newPatient, ...existing.filter((p) => p.id !== newPatient.id)];
      localStorage.setItem('medisync_hospital_patients', JSON.stringify(updated));
      localStorage.setItem(`medisync_patient_${newPatient.id}`, JSON.stringify(newPatient));
      localStorage.setItem(`medisync_patient_${newPatient.id.replace('#', '')}`, JSON.stringify(newPatient));
    } catch (e) {
      console.warn('Could not persist hospital patient:', e);
    }
  }
  return newPatient;
}
