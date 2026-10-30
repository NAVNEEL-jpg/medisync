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
  activeDeviceId?: string;
  linkedCaregivers?: CaregiverRelationship[];
  accessibilityPrefs?: AccessibilityPreferences;
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

// ==================================================
// MEDISYNC CARELINK EXTENSIONS
// ==================================================

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'EMERGENCY_SOS' | 'SUSPECTED_FALL';

export interface CareLinkDevice {
  id: string; // e.g. 'CL-ESP32-9081'
  patientId: string;
  deviceModel: string; // 'CareLink Assist V1 (ESP32-WROOM-32)'
  macAddress: string;
  firmwareVersion: string;
  batteryLevel: number; // 0-100%
  isCharging?: boolean;
  status: DeviceStatus;
  lastHeartbeat: string;
  registeredAt: string;
  pairedBy: string;
  hardwareSpecs: {
    mcu: string;
    pulseOximeter: string;
    motionSensor: string;
    display: string;
    hasPhysicalSos: boolean;
    hasBuzzer: boolean;
  };
}

export interface DeviceTelemetry {
  id: string;
  deviceId: string;
  patientId: string;
  timestamp: string;
  heartRate: number; // bpm (MAX30102)
  spO2: number; // % (MAX30102)
  motionMagnitude: number; // g-force vector from MPU6050
  fallSuspected: boolean; // Flagged when motion vector exceeds fall threshold
  batteryLevel: number;
  status: DeviceStatus;
}

export type EmergencyEventType = 'MANUAL_SOS' | 'SUSPECTED_FALL' | 'CRITICAL_VITALS' | 'DEVICE_DISCONNECT' | 'MISSED_CHECK_IN';

export interface EmergencyEvent {
  id: string;
  patientId: string;
  patientName: string;
  deviceId?: string;
  eventType: EmergencyEventType;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  timestamp: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  vitalsSnapshot?: {
    heartRate?: number;
    spO2?: number;
    bloodPressure?: string;
  };
  location?: {
    label: string;
    lat?: number;
    lng?: number;
  };
  notifiedContacts: {
    name: string;
    phone: string;
    role: string;
    delivered: boolean;
  }[];
  acknowledgedBy?: string;
  resolvedAt?: string;
  notes?: string;
}

export interface CaregiverProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  relationship: string;
  linkedPatientIds: string[];
  createdAt: string;
}

export interface CaregiverRelationship {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverPhone: string;
  relationship: string;
  permissions: Array<'VIEW_VITALS' | 'RECEIVE_SOS' | 'VIEW_MEDICATIONS' | 'FULL_RECORDS'>;
  status: 'ACTIVE' | 'PENDING' | 'REVOKED';
  grantedAt: string;
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  fontSizeScale: 'normal' | 'large' | 'extra-large';
  ttsEnabled: boolean;
  voiceNavEnabled: boolean;
  language: 'en' | 'hi' | 'bn';
}

export interface OfflineSyncQueueItem {
  id: string;
  action: 'ENROLL_PATIENT' | 'RECORD_VITALS' | 'SOS_TRIGGER' | 'CAMP_REGISTRATION';
  endpoint: string;
  payload: Record<string, unknown>;
  timestamp: string;
  attempts: number;
  status: 'PENDING' | 'FAILED' | 'SYNCED';
  lastError?: string;
}

