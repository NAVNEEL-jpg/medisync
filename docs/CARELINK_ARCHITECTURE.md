# MediSync CareLink — System Architecture

**Project Name:** MEDISYNC CARELINK  
**Tagline:** Technology That Cares. Healthcare That Reaches Everyone.  
**Competition Track:** Design for Bharat Challenge 2026 — Category 2: Accessible Healthcare & Assistive Tech (Swasthya)

---

## 1. Executive Architectural Overview

MediSync CareLink is an assistive healthcare ecosystem engineered to bridge the clinical, physical, and communication divides affecting elderly citizens, chronic disease patients, and rural populations across India.

Unlike fragmented health apps or expensive imported wearables, CareLink integrates three complementary systems:
1. **System A: CareLink Assist Device (Hardware Pillar)** — An ultra-low-cost ESP32-based wearable or bedside hub featuring optical PPG biosensing, 6-axis IMU fall detection, an autonomous 0.96" OLED display, and a hardware-interrupt SOS switch.
2. **System B: CareLink Digital Platform (Software Pillar)** — An Ayushman Bharat Digital Mission (ABDM) aligned personal health vault offering FHIR R4 medical history, explainable Gemini AI translation, and secure revocable-token emergency QR cards.
3. **System C: CareLink Care Network (Human Pillar)** — A consent-governed communication ring coordinating family caregivers, consulting doctors, and rural ASHA facilitators with real-time push alerts.

```
+-----------------------------------------------------------------------------------+
|                            MEDISYNC CARELINK ECOSYSTEM                            |
+-----------------------------------------------------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                 |                                 |
        v                                 v                                 v
+-----------------------+     +-----------------------+     +-----------------------+
|  CARELINK ASSIST      |     |  CARELINK PLATFORM    |     |  CARELINK CARE        |
|  HARDWARE DEVICE      |     |  DIGITAL VAULT        |     |  NETWORK              |
|  (ESP32 + SENSORS)    |     |  (NEXT.JS + FIRESTORE)|     |  (PATIENT-CAREGIVER)  |
+-----------------------+     +-----------------------+     +-----------------------+
| - MAX30102 PPG        |     | - FHIR R4 Medical Rec |     | - Family Caregivers   |
| - MPU6050 Fall IMU    |     | - Revocable QR Triage |     | - Attending Doctors   |
| - 0.96" OLED Display  |     | - Gemini Clinical AI  |     | - ASHA Outreach Camps |
| - Physical SOS Button |     | - Assistive Mode UI   |     | - 108 Emergency EMTs  |
| - 85dB Siren          |     | - Offline Sync Engine |     | - Consent Management  |
+-----------------------+     +-----------------------+     +-----------------------+
```

---

## 2. Implementation Status Classification

| Component / Subsystem | Status | Description |
| :--- | :--- | :--- |
| **Public Landing Page & Showcase** | `IMPLEMENTED` | Live responsive landing page with interactive 3D device visual, problem statement, solution showcase, and Design for Bharat evaluation dossier. |
| **Assistive Mode (Accessibility)** | `IMPLEMENTED` | High-contrast WCAG AAA theme, font scaling (+25%, +50%), Web Speech Text-to-Speech (TTS), and trilingual support (English, Hindi, Bengali). |
| **Patient Profile & Health Vault** | `IMPLEMENTED` | Full clinical records, baseline vitals, diagnostics, surgical history, and allergy tracking with local fallback. |
| **Caregiver Dashboard** | `IMPLEMENTED` | Consent-governed caregiver portal with live telemetry status, suspected fall alerts, medication adherence, and emergency dial ring. |
| **Doctor / ER Trauma Terminal** | `IMPLEMENTED` | Clinical triage view with instant patient search, CareLink IoT telemetry feeds, and source-attributed AI medical summaries. |
| **Device Management Module** | `IMPLEMENTED` | Provisioning, battery monitoring, telemetry logs, fall sensitivity configuration, and hardware revocation. |
| **Device REST Ingest APIs** | `IMPLEMENTED` | `/api/devices/register`, `/api/devices/telemetry`, `/api/devices/sos`, `/api/devices/events`, `/api/devices/status`. |
| **ESP32 C++ Production Firmware** | `IMPLEMENTED` | `firmware/esp32_carelink_main.ino` supporting MAX30102, MPU6050, SSD1306 OLED, hardware interrupt SOS, and HTTPS telemetry client. |
| **Offline Rural Kiosk Sync** | `IMPLEMENTED` | ASHA kiosk registration with automatic offline queueing and exportable JSON backup. |
| **Revocable QR Emergency Access** | `IMPLEMENTED` | Zero plaintext medical data leaked in QR; protected by dynamic token rotation. |
| **Cellular NB-IoT / 4G Module** | `PROPOSED` | Replacement of Wi-Fi with SIM7000/SIM7600 NB-IoT for outdoor cellular independence. |
| **Government ABDM Gateway Live Sync** | `FUTURE SCOPE` | Formal production integration with National Health Authority (NHA) ABDM Sandbox M1/M2/M3 APIs. |

---

## 3. End-to-End Emergency SOS Workflow

```
[PATIENT OR HARDWARE TRIGGER]
  ├── A. User pushes Physical SOS button on ESP32 (GPIO 14 Interrupt)
  └── B. OR MPU6050 detects high-G impact (>2.45g) followed by immobility
          │
          v
[LOCAL HARDWARE RESPONSE]
  ├── 85dB Piezo Siren sounds (2.4kHz penetrating frequency)
  ├── 0.96" OLED displays high-contrast "EMERGENCY SOS BEACON"
  └── Blue Status LED illuminates
          │
          v
[AUTHENTICATED API DISPATCH]
  └── POST /api/devices/sos with Device Bearer Token
          │
          v
[BACKEND EVENT VALIDATION]
  ├── Validate device token against registered devices
  ├── Debounce against active events within 30-second window
  └── Store event in Firestore / MockDatabase with ACTIVE status
          │
          v
[NOTIFICATION & ACCESS DISPATCH]
  ├── Push alert sent to authorized family caregiver (Ananya Sharma)
  ├── 108 Emergency ambulance dispatch packet prepared with GPS location
  └── Caregiver Dashboard displays audio-visual alert banner
          │
          v
[HOSPITAL BREAK-GLASS TRIAGE]
  └── EMT or ER doctor scans patient's CareLink QR token to unlock allergies and implants in < 8s
```

---

## 4. Hardware Component Breakdown

| Subsystem | Component | Working Principle & Role |
| :--- | :--- | :--- |
| **Microcontroller** | Espressif ESP32-WROOM-32D | Dual-core 240MHz Xtensa processor handling sensor polling at 50Hz, Wi-Fi HTTPS communication, and offline ring-buffer caching. |
| **Optical Biosensing** | Maxim MAX30102 | Dual Red (660nm) and Infrared (880nm) optical LEDs with photodetectors for photoplethysmography (PPG) pulse rate and SpO2 estimation. |
| **Motion Tracking** | InvenSense MPU6050 | 3-axis accelerometer and 3-axis gyroscope. Algorithm monitors total vector acceleration $a = \sqrt{a_x^2 + a_y^2 + a_z^2}$. |
| **User Interface** | 0.96" SSD1306 OLED | 128x64 monochrome I2C display. Legible in direct sunlight with low power draw (<15mA). Displays vitals without smartphone dependence. |
| **Emergency Trigger** | Tactile Switch | Hardware-interrupt connected to GPIO 14 with internal pull-up. Always active even during sleep loops. |
| **Auditory Alert** | 85dB Piezo Siren | Driven by PWM on GPIO 15 at 2.4kHz to alert nearby family members or neighbors. |
| **Power Management** | 3.7V 500mAh Li-Po + TP4056 | Recharged via standard USB-C cable; battery voltage monitored via ADC pin 34. |

---

## 5. Technology Stack Summary

- **Frontend:** Next.js 16.3.5 (App Router), React 19.2.8, TypeScript 5, Tailwind CSS v4.
- **Backend:** Next.js Route Handlers (`/api/devices/*`, `/api/gemini/*`, `/api/patients/*`).
- **Database & Auth:** Firebase Web SDK v12.19.0 (Auth, Firestore) with in-memory & `localStorage` fallback layer.
- **Artificial Intelligence:** Google Gemini API via `@google/genai` (v2.23.0) with fallback chain (`gemini-3.7-flash`, `gemini-3.5-flash-lite`, `gemini-3.8-flash`, `gemini-3.5-flash`).
- **Firmware:** Arduino C++ for ESP32.
