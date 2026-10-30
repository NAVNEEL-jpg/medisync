# MediSync CareLink — Security Model & Privacy Architecture

**Compliance Standards:** HL7 FHIR R4, ABDM (Ayushman Bharat Digital Mission), ISO/IEC 27001 Data Principles, DISHA (Digital Information Security in Healthcare Act).

---

## 1. Core Security Principles

1. **Patient Data Sovereignty:** The patient retains exclusive ownership over their clinical profile. Data is never shared with third parties or advertisers.
2. **Zero Plaintext Leak in QR Codes:** Traditional emergency QR cards often store unencrypted patient names, conditions, or Aadhaar numbers directly in the QR string. MediSync CareLink encodes **only a signed, revocable token**.
3. **Hardware Token Authentication:** IoT telemetry ingest endpoints reject unauthenticated packets. Every ESP32 hardware device is provisioned with a cryptographic secret that cannot be queried from frontend client code.
4. **Append-Only Tamper-Evident Audit Logging:** Whenever an emergency responder, doctor, or caregiver accesses an emergency profile via break-glass override, an immutable audit log is committed with accessor name, role, timestamp, and clinical justification.
5. **Role-Based & Scoped Consent Delegations:** Caregivers do not automatically receive access to every diagnostic report or psychiatric note. Access is scoped into explicit permission flags (`RECEIVE_SOS`, `VIEW_VITALS`, `VIEW_MEDICATIONS`, `FULL_RECORDS`).

---

## 2. Emergency QR Revocable Token Architecture

```
[PATIENT CARD GENERATION]
  ├── Patient Generates Emergency QR Card in Portal
  ├── System assigns dynamic token: CL-REV-{PatientID}-{Nonce}
  └── QR Code encodes URL: https://medisync-carelink.org/emergency/{PatientID}?token={Token}
      (ZERO plaintext medical data stored in the QR image)

[TRIAGE SCAN LIFECYCLE]
  ├── 1. Paramedic scans physical card with any smartphone camera
  ├── 2. Scanned URL resolves /emergency/[id]?token=...
  ├── 3. Backend validates that token is ACTIVE and NOT REVOKED
  ├── 4. Break-Glass Audit Log is immutably recorded in Firestore
  └── 5. Critical triage information (Blood Group, Allergies, Implants) is displayed

[PATIENT TOKEN REVOCATION]
  ├── Patient clicks "Rotate & Revoke QR Access Token" in Profile
  ├── Old Token is permanently marked REVOKED in database
  └── Any subsequent scan of the old physical QR displays "Access Token Revoked"
```

---

## 3. IoT Hardware Device Security

- **Transport Layer Security:** All communications between ESP32 and Next.js backend utilize HTTPS (TLS 1.3).
- **Rate Limiting & Anti-DDoS:** Telemetry endpoints reject requests exceeding 2 calls/second per device ID (HTTP 429).
- **Range & Plausibility Validation:** Telemetry readings outside physiological feasibility (e.g. heart rate > 240 bpm or SpO2 < 50%) are rejected (HTTP 422) to prevent counterfeit sensor injections.
- **Hardware SOS Debounce:** Physical switch presses are debounced both in firmware (500ms ISR timer) and on the backend (30-second deduplication window) to eliminate accidental false alarm storms.

---

## 4. Artificial Intelligence Clinical Boundaries

Google Gemini is integrated as an assistive health educator and translator. To protect patient safety, strict system instructions enforce that AI:
- **CANNOT** independently diagnose diseases or declare a patient medically clear.
- **CANNOT** prescribe medications or alter clinical dosages.
- **MUST** provide clear "When to seek urgent or emergency care" guidance.
- **MUST** include transparent disclaimers that AI output does not replace a licensed medical practitioner.
- All AI-generated summaries are visually distinguished from verified hospital records with a dedicated disclaimer banner.
