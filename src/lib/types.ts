export interface VitalSigns {
  bloodPressure: string; // e.g. 128/82 mmHg
  heartRate: number; // e.g. 74 bpm
  spO2: number; // e.g. 98%
  bloodSugar?: string; // e.g. 110 mg/dL (Fasting)
  temperature?: string; // e.g. 98.6 °F
  lastRecorded: string;
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
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  photoUrl?: string;
  address: string;
  city: string;
  state: string;

  // Medical Profile
  existingConditions: string[];
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

  lastProfileUpdate: string;
  nextReviewDueDate: string;
  isRegisteredAtOfflineCamp: boolean;
  registeredCampLocation?: string;
  accessLogs: AccessAuditLog[];
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
