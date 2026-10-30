# MediSync CareLink — Firebase Database Architecture & Schema

**Database Engine:** Google Cloud Firestore  
**Security Model:** Role-Based Access Control (RBAC) + Scoped Delegation Tokens

---

## 1. Logical Collections

```
Firestore Root
├── users/                     (Auth profiles, roles, and credentials)
├── patients/                  (ABDM FHIR R4 Patient Health Vaults)
├── devices/                   (Registered CareLink Assist hardware records)
├── deviceReadings/            (Telemetry stream readings: HR, SpO2, IMU)
├── emergencyEvents/           (SOS beacons, suspected fall incidents)
├── caregivers/                (Family caregiver profiles)
├── caregiverRelationships/    (Consent-governed delegation links)
├── accessibilityPreferences/  (Vernacular, contrast, and font scale prefs)
├── medicationSchedules/       (Daily prescription schedules & adherence)
└── auditLogs/                 (Immutable break-glass access logs)
```

---

## 2. Collection Schemas

### `patients/{patientId}`
```typescript
interface PatientDocument {
  id: string;                      // e.g. "MS-IND-89421"
  fullName: string;                // "Rajesh Kumar Sharma"
  aadhaarNumber: string;           // "234567890123" (Encrypted)
  mobileNumber: string;            // "9876543210"
  dob: string;                     // "1971-08-14"
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  city: string;
  state: string;
  existingConditions: string[];
  pastDiseases: string[];
  surgeriesAndImplants: string[];
  allergies: Array<{
    allergen: string;
    severity: 'CRITICAL' | 'MODERATE' | 'MILD';
    reaction: string;
  }>;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    spO2: number;
    bloodSugar?: string;
    lastRecorded: string;
  };
  prescriptions: Array<{
    id: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
  }>;
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
  }>;
  activeDeviceId?: string;         // e.g. "CL-ESP32-9081"
  lastProfileUpdate: string;
  accessLogs: Array<{
    id: string;
    timestamp: string;
    accessorName: string;
    accessorRole: string;
    accessType: string;
    reason: string;
  }>;
}
```

### `devices/{deviceId}`
```typescript
interface DeviceDocument {
  id: string;                      // "CL-ESP32-9081"
  patientId: string;               // "MS-IND-89421"
  deviceModel: string;             // "CareLink Assist V1 (ESP32-WROOM-32)"
  macAddress: string;              // "24:6F:28:B4:9A:12"
  firmwareVersion: string;         // "v2.4.1-swasthya"
  batteryLevel: number;            // 0 - 100
  isCharging: boolean;
  status: 'ONLINE' | 'OFFLINE' | 'EMERGENCY_SOS' | 'SUSPECTED_FALL';
  lastHeartbeat: string;           // ISO timestamp
  registeredAt: string;
  pairedBy: string;
}
```

### `deviceReadings/{readingId}`
```typescript
interface ReadingDocument {
  id: string;
  deviceId: string;
  patientId: string;
  timestamp: string;
  heartRate: number;               // 25 - 240 bpm
  spO2: number;                    // 50 - 100%
  motionMagnitude: number;         // g-force vector
  fallSuspected: boolean;
  batteryLevel: number;
  status: string;
}
```

### `emergencyEvents/{eventId}`
```typescript
interface EmergencyEventDocument {
  id: string;                      // "EVT-SOS-2026-904"
  patientId: string;
  patientName: string;
  deviceId?: string;
  eventType: 'MANUAL_SOS' | 'SUSPECTED_FALL' | 'CRITICAL_VITALS' | 'DEVICE_DISCONNECT';
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
  notifiedContacts: Array<{
    name: string;
    phone: string;
    role: string;
    delivered: boolean;
  }>;
  acknowledgedBy?: string;
  resolvedAt?: string;
  notes?: string;
}
```

### `caregiverRelationships/{relationshipId}`
```typescript
interface RelationshipDocument {
  id: string;
  patientId: string;               // "MS-IND-89421"
  caregiverId: string;             // "CG-8821"
  caregiverName: string;           // "Ananya Sharma"
  relationship: string;            // "Daughter / Family Caregiver"
  permissions: Array<'VIEW_VITALS' | 'RECEIVE_SOS' | 'VIEW_MEDICATIONS' | 'FULL_RECORDS'>;
  status: 'ACTIVE' | 'PENDING' | 'REVOKED';
  grantedAt: string;
}
```

---

## 3. Firestore Security Rules Summary

1. **Role-Based Protection:** Authenticated patients only mutate their own vault; clinicians have read access for active triage sessions.
2. **Revocable Delegations:** Caregivers only receive access to specific fields matching active `permissions` granted by the patient.
3. **Immutable Audit Trails:** The `auditLogs` collection enforces append-only permissions (`allow create: if true; allow update, delete: if false;`).
4. **Offline Resilience:** If Cloud Firestore is inaccessible, the frontend gracefully falls back to cached local storage without crashing.
