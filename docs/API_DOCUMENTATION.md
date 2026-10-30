# MediSync CareLink — Backend API Reference

**Protocol:** HTTPS / REST  
**Data Format:** JSON (`application/json`)  
**Base URL:** `https://medisync-carelink.vercel.app` (or `http://localhost:3000` in dev)

---

## 1. IoT Hardware Endpoints

### 1.1 Register Device
**`POST /api/devices/register`**  
Provisions a new CareLink ESP32 hardware device to a patient.

- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "deviceId": "CL-ESP32-9081",
    "patientId": "MS-IND-89421",
    "macAddress": "24:6F:28:B4:9A:12",
    "hardwareSecret": "swasthya-key-2026",
    "firmwareVersion": "v2.4.1-swasthya",
    "pairedBy": "Ananya Sharma (Caregiver)"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "CareLink device registered successfully.",
    "device": { ... },
    "token": "cl_token_cl-esp32-9081_..."
  }
  ```

---

### 1.2 Ingest Telemetry Stream
**`POST /api/devices/telemetry`**  
Receives live sensor readings from the ESP32 (pulse, SpO2, motion magnitude, battery).

- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <device_token>`
- **Request Body:**
  ```json
  {
    "deviceId": "CL-ESP32-9081",
    "patientId": "MS-IND-89421",
    "heartRate": 74,
    "spO2": 98,
    "motionMagnitude": 1.02,
    "batteryLevel": 84,
    "fallSuspected": false
  }
  ```
- **Validation Rules:**
  - `heartRate`: 25 to 240 bpm.
  - `spO2`: 50% to 100%.
  - `motionMagnitude`: $>2.4g$ automatically flags `fallSuspected: true`.
  - Rate limit: max 2 requests/sec per device.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "readingId": "tel-1730000000-482",
    "timestamp": "2026-10-31T02:00:00.000Z",
    "fallFlagged": false,
    "message": "Telemetry ingested successfully."
  }
  ```

---

### 1.3 Emergency SOS Beacon
**`POST /api/devices/sos`**  
Dispatches an emergency beacon triggered by the physical tactile switch.

- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <device_token>`
- **Request Body:**
  ```json
  {
    "deviceId": "CL-ESP32-9081",
    "patientId": "MS-IND-89421",
    "heartRate": 88,
    "spO2": 97,
    "bloodPressure": "134/86 mmHg",
    "reason": "Physical Hardware SOS Button Pressed"
  }
  ```
- **Debouncing:** Suppresses duplicate notifications within a 30-second window.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "eventId": "EVT-SOS-1730000000",
    "status": "ACTIVE",
    "notifiedCount": 2,
    "message": "Emergency SOS beacon successfully authenticated, logged, and dispatched to authorized contacts."
  }
  ```

---

### 1.4 Hardware Motion & Fall Events
**`POST /api/devices/events`**  
Ingests suspected fall events detected by the MPU6050 IMU.

- **Headers:** `Authorization: Bearer <device_token>`
- **Request Body:**
  ```json
  {
    "deviceId": "CL-ESP32-9081",
    "patientId": "MS-IND-89421",
    "eventType": "SUSPECTED_FALL",
    "motionMagnitude": 2.65,
    "heartRate": 94,
    "spO2": 96
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "eventId": "EVT-FALL-1730000000",
    "isSuspectedOnly": true,
    "message": "Hardware event logged and notification dispatched to authorized caregiver."
  }
  ```

---

### 1.5 Device Status & Heartbeat
**`GET /api/devices/status?patientId=MS-IND-89421`**  
Returns current connection status, battery percentage, and latest telemetry reading.

- **Response (200 OK):**
  ```json
  {
    "success": true,
    "device": {
      "id": "CL-ESP32-9081",
      "model": "CareLink Assist V1 (ESP32-WROOM-32)",
      "status": "ONLINE",
      "batteryPercent": 84,
      "lastHeartbeat": "2026-10-31T02:00:00.000Z"
    },
    "latestReading": { "heartRate": 74, "spO2": 98, "motionMagnitude": 1.02 }
  }
  ```

---

## 2. AI Intelligence Endpoints

### 2.1 Gemini Clinical Document Analyzer
**`POST /api/gemini/analyze`**  
Translates diagnostic lab reports and prescriptions into patient-friendly summaries.

- **Request Body:** `{ "documentText": "Complete Blood Count text..." }`
- **Output:** Structured JSON schema with `patientFriendlySummary`, `keyFindings`, and `questionsForDoctor`.

### 2.2 Gemini Symptom & Health Chat
**`POST /api/gemini/chat`**  
Answers wellness, vital sign, and emergency queries with clinical boundaries.
