export interface VitalSigns {
  bloodPressure: string; // e.g. 128/82 mmHg
  heartRate: number; // e.g. 74 bpm
  spO2: number; // e.g. 98%
  bloodSugar?: string; // e.g. 110 mg/dL (Fasting)
  temperature?: string; // e.g. 98.6 °F
  lastRecorded: string;
}

export interface VitalLogEntry {
  id: string;
  timestamp: string;
  recordedBy: string;
  heartRate?: number;
  bloodPressure?: string;
  spO2?: number;
  bloodSugar?: string;
  temperature?: string;
  notes?: string;
}

export interface Allergy {
  allergen: string;
  severity: 'CRITICAL' | 'MODERATE' | 'MILD';
  reaction: string;
  subCategory?: string;
}

export interface PrescriptionDoc {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  hospitalOrClinic: string;
  datePrescribed: string;
  documentUrl?: string;
  notes?: string;
  category?: string;
  lastTaken?: string;
}

export interface MedicalImplant {
  name: string;
  manufacturer: string;
  implantDate: string;
  location: string;
  mriSafety: 'MRI CONDITIONAL ONLY' | 'MRI UNSAFE' | 'MRI SAFE';
  specs?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  type?: 'RELATIVE' | 'ATTENDING_SPECIALIST';
  specialty?: string;
}

export interface Nominee {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  aadhaarNumberMasked: string;
  authorizedActions: string[];
}

export interface AccessAuditLog {
  id: string;
  timestamp: string;
  accessorName: string;
  accessorRole: 'EMERGENCY_DOCTOR' | 'PARAMEDIC' | 'PATIENT' | 'NOMINEE' | 'CAMP_VOLUNTEER';
  hospitalOrLocation: string;
  licenseNumber?: string;
  accessType: 'VERIFIED_OTP' | 'BREAK_GLASS_OVERRIDE' | 'PATIENT_LOGIN' | 'CAMP_REGISTRATION';
  reason?: string;
}

export interface ConditionItem {
  name: string;
  description?: string;
  severity?: 'HIGHRISK' | 'MANAGED' | 'AIRWAY ALERT' | 'STABLE';
  baseline?: string;
}

export interface PatientProfile {
  id: string; // e.g. #NDHN-8902-MV
  fullName: string;
  aadhaarNumber: string;
  mobileNumber: string;
  dob: string;
  age?: number | string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  photoUrl?: string;
  address: string;
  city: string;
  state: string;

  // Medical Profile
  existingConditions: string[];
  chronicConditions?: string[];
  pastDiseases: string[];
  surgeriesAndImplants: string[];
  implantsDetailed?: MedicalImplant[];
  allergies: Allergy[];
  vitals: VitalSigns;
  prescriptions: PrescriptionDoc[];
  emergencyContacts: EmergencyContact[];
  nominees: Nominee[];

  organDonor: boolean;
  dnrStatus: boolean;

  // New Record Collections
  diagnostics?: DiagnosticRecord[];
  surgicalLogs?: SurgicalRecord[];

  email?: string;
  abhaId?: string; // e.g. 91-8821-3940-1928 or patient@abdm
  documents?: {
    id: string;
    name: string;
    type: string; // e.g. 'Lab Report', 'Aadhaar Card', 'Discharge Summary'
    date: string;
    url?: string;
    size?: string;
  }[];
  enrolledByHospital?: string;
  enrolledAt?: string;

  lastProfileUpdate: string;
  lastUpdatedBy?: string;
  hasCompletedSetup?: boolean;
  hasNoKnownAllergies?: boolean;
  vitalsHistory?: VitalLogEntry[];
  nextReviewDueDate: string;
  isRegisteredAtOfflineCamp: boolean;
  registeredCampLocation?: string;
  accessLogs: AccessAuditLog[];
}

export interface DiagnosticRecord {
  id: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'ELEVATED' | 'LOW' | 'CRITICAL';
  laboratoryName: string;
  reportPicUrl?: string;
  specialNote?: string;
  dateRecorded: string;
}

export interface SurgicalRecord {
  id: string;
  procedureName: string;
  surgeryDate: string;
  operatingSurgeon: string;
  hospitalOfSurgery: string;
  implantsUsed?: string;
  dischargeSummaryUrl?: string;
  specialNote?: string;
}


// Global Medical News Types
export interface ClinicalDispatch {
  id: string;
  category: 'CRITICAL OUTBREAK' | 'BREAKTHROUGH THERAPEUTIC' | 'PEER REVIEWED CLINICAL TRIAL' | 'CLASS I SAFETY RECALL';
  source: string;
  timestampAgo: string;
  verificationBadge: string;
  title: string;
  summary: string;
  emergencyTakeaways?: string[];
  paramedicDosing?: {
    dose: string;
    reboundProfile: string;
  };
  recommendation?: string;
  icdCode?: string;
  advisoryCode?: string;
  actionButtonText: string;
  actionButtonType: 'primary' | 'danger' | 'outline';
  url?: string;
  imageUrl?: string;
}

export interface OutbreakMetric {
  title: string;
  count: number;
  badge?: string;
  badgeType?: 'danger' | 'warning' | 'info';
  subtitle: string;
}
