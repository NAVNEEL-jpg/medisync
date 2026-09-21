# 🏗️ MediSync Technical Architecture & System Specification

MediSync is architectured as an interoperable, high-availability emergency health record exchange and clinical intelligence system. This document outlines the technical design, data schemas, security mechanisms, and AI pipelines powering the platform.

---

## 1. Architectural Overview

MediSync uses a hybrid client-serverless model built upon **Next.js 16 (App Router)**, **React 19**, **Google Gemini GenAI**, and **Firebase Cloud Infrastructure**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│                                                                        │
│   ┌──────────────────┐  ┌───────────────────┐  ┌───────────────────┐   │
│   │  Citizen Vault   │  │ Hospital Terminal │  │ Emergency Triage  │   │
│   │ (ClientDashboard)│  │(HospitalDashboard)│  │    (HUD View)     │   │
│   └─────────▲────────┘  └─────────▲─────────┘  └─────────▲─────────┘   │
└─────────────┼─────────────────────┼──────────────────────┼─────────────┘
              │                     │                      │
┌─────────────▼─────────────────────▼──────────────────────▼─────────────┐
│                       APPLICATION & API LAYER                          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Next.js 16 Serverless API Routes                               │   │
│   │ • /api/gemini/chat       • /api/patients/lookup                │   │
│   │ • /api/gemini/analyze    • /api/patients/update                │   │
│   │ • /api/gemini/interactions • /api/news/live                    │   │
│   └───────────────────────┬────────────────────────────────────────┘   │
│                           │                                            │
│   ┌───────────────────────▼──────────────┐  ┌──────────────────────┐   │
│   │  Multi-Model AI Fallback Engine      │  │  Emergency Break-    │   │
│   │  (Google GenAI SDK)                  │  │  Glass Controller    │   │
│   └──────────────────────────────────────┘  └──────────────────────┘   │
└───────────────────────────┬────────────────────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────────────────┐
│                    DATA & INTEGRATION LAYER                            │
│                                                                        │
│   ┌───────────────────┐  ┌──────────────────┐  ┌───────────────────┐   │
│   │ Firebase Firestore│  │  Firebase Auth   │  │ HL7 FHIR v4.3 /   │   │
│   │  (NoSQL Encrypted)│  │ (RBAC Identities)│  │   ABDM Schema     │   │
│   └───────────────────┘  └──────────────────┘  └───────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. HL7 FHIR v4.3 & ABDM Data Model Alignment

MediSync implements strict schema typing (`src/lib/types.ts`) designed to map directly to **Fast Healthcare Interoperability Resources (FHIR v4.3)** and **Ayushman Bharat Digital Mission (ABDM)** standards:

| MediSync Interface | HL7 FHIR Resource | ABDM Equivalent Resource | Purpose |
| :--- | :--- | :--- | :--- |
| `PatientProfile` | `Patient` | `ABDM-Patient` | Core demographic and unique identifier (Aadhaar / ABHA) |
| `VitalSigns` | `Observation` (vital-signs) | `ABDM-Observation` | Real-time telemetry: BP, SpO2, Heart Rate, Glucose |
| `Allergy` | `AllergyIntolerance` | `ABDM-AllergyIntolerance` | Critical drug allergens, severity level, reaction manifestations |
| `PrescriptionDoc` | `MedicationRequest` | `ABDM-OPConsultation` | Prescribed chemical entity, dosing frequency, physician license |
| `DiagnosticRecord` | `DiagnosticReport` | `ABDM-DiagnosticReport` | Lab assay results, reference biological ranges, critical flags |
| `SurgicalRecord` | `Procedure` | `ABDM-DischargeSummary` | Surgical history, operating surgeon, implant tracking |
| `MedicalImplant` | `Device` | `ABDM-Device` | Implant manufacturer, MRI safety classification, serial number |
| `AccessAuditLog` | `AuditEvent` | `ABDM-AuditTrail` | Immutable tracking of emergency record disclosures |

---

## 3. Emergency "Break-Glass" Security Architecture

A central challenge in digital healthcare is balancing **data confidentiality** against **life preservation in trauma situations**. MediSync solves this through an emergency **Break-Glass Access Protocol**:

```
[ Unconscious Patient Arrives ]
             │
             ▼
[ Paramedic Scans QR / Taps NFC ]
             │
             ├──> [ Standard View ]: Returns minimal emergency HUD
             │     • Blood Group & Rh Factor
             │     • Critical Drug Allergies (Penicillin, NSAIDs)
             │     • Surgical Implants (Pacemaker / Stent MRI Warnings)
             │     • Organ Donor & DNR Status
             │     • Primary Emergency Contact
             │
             └──> [ Deep Clinical History ]: GATED
                   • Requires Verified Physician License (MCI/NMC)
                   • Generates Immutable Audit Log Entry
                   • Dispatches automated SMS notification to registered Nominee
```

### Break-Glass Audit Trail Schema
```typescript
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
```

---

## 4. Google Gemini Generative AI Pipeline

MediSync leverages **Google GenAI** (`@google/genai`) to power real-time clinical reasoning, automated triage parsing, and drug interaction analysis.

### Multi-Model Fallback Ladder (`src/lib/gemini.ts`)
To eliminate rate-limiting disruptions and model outages during emergency situations, MediSync employs an automated fallback pipeline:

```
  Attempt 1: gemini-3.7-flash   ──(if failed)──>
  Attempt 2: gemini-3.5-flash-lite ──(if failed)──>
  Attempt 3: gemini-3.8-flash   ──(if failed)──>
  Attempt 4: gemini-3.5-flash
```

```typescript
export const CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
];

export async function generateWithFallback(options: {
  contents: unknown;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}) {
  let lastError: unknown = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents as any,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.3,
          responseMimeType: options.responseMimeType,
        },
      });
      return { response, activeModel: model };
    } catch (err: unknown) {
      console.warn(`Model ${model} issue:`, (err as Error).message);
      lastError = err;
    }
  }
  throw lastError || new Error('All candidate Gemini models failed.');
}
```

### Clinical Prompt Engineering & Guardrails
All clinical interactions enforce a strict medical safety system instruction:
1. **Calm, Empathetic, Clinical Demeanor**: Professional clarity without alarmist language.
2. **Tri-Tier Categorization**: Delineates symptoms into Common & Mild, Less Common, and Acute Red Flags.
3. **Emergency Escalation Thresholds**: Explicit triggers specifying when a patient must present to an Emergency Department immediately.
4. **Physician Consultation Questions**: Pre-populates 3 to 5 targeted diagnostic questions for the patient's next clinical visit.
5. **Mandatory Non-Diagnostic Disclaimer**: Clarifies that AI outputs assist and educate but never replace certified physician evaluation.

---

## 5. Economic & Partner Network Architecture

To ensure sustainable adoption across both public and private healthcare facilities, MediSync couples a physical NFC card delivery mechanism with a decentralized referral engine:

```
[ Citizen Orders Smart Card (₹150) ]
                  │
                  ▼
[ Inputs Hospital Referral Code (e.g. SMS-JAIPUR-42) ]
                  │
                  ├──> [ Citizen Benefit ]: 5% Direct Discount (₹7.50 saved)
                  │
                  └──> [ Hospital Node Benefit ]: 5% Partner Commission credited
                        to accredited institution's public health welfare fund.
```

This model turns trauma hospitals from passive data viewers into active distribution nodes, establishing rapid community adoption across urban and rural demographics alike.

---

## 6. Resilience & Offline Camp Capabilities

* **Local Storage Redundancy**: For registered citizens, active health vault edits are mirrored in client-side secure browser storage (`localStorage`), ensuring offline survivability if connectivity drops.
* **ASHA Rural Kiosk Mode**: The camp interface (`AssistanceCampKiosk.tsx`) allows low-bandwidth bulk health intake with batch reconciliation when mobile telemetry is restored.
