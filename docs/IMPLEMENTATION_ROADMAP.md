# MediSync CareLink — Implementation Roadmap

**Competition Track:** Design for Bharat Challenge 2026  
**Category 2:** Accessible Healthcare & Assistive Tech (Swasthya)

---

## 1. Roadmap Milestones & Readiness Matrix

```
[2026 Q1-Q2: CORE SYSTEM] ─────────► [2026 Q3: PILOT TRIAL] ─────────► [2026 Q4-2027 Q1: SCALE]
- Next.js Web Ecosystem             - 100 ESP32 Field Units            - NB-IoT/4G Hardware
- Assistive Mode (En/Hi/Bn)         - CHC/PHC Pilot in Rajasthan        - Full ABDM M1/M2/M3
- Caregiver & Doctor Hubs           - Elderly Daycare Cohort           - VLE/CSC Decentralization
- ESP32 C++ Production Firmware     - Clinical Usability Study         - Device Certification
```

---

## 2. Phase Breakdown

### Phase 1: Prototype & Platform Core (`IMPLEMENTED`)
- Complete Next.js 16 web application with accessible UI system.
- Assistive Mode with WCAG AAA High Contrast, text scaling up to 150%, Text-to-Speech audio readout, and Hindi/Bengali vernacular localization.
- Patient Health Vault with vitals, prescriptions, surgeries, diagnostics, and allergies.
- Caregiver Dashboard with consent permissions, live telemetry, and suspected fall alerts.
- Doctor / ER Trauma Terminal with instant triage search and source-attributed AI summaries.
- Production-ready ESP32 Arduino C++ firmware with MAX30102 PPG and MPU6050 fall detection.
- Complete set of 5 secure IoT REST endpoints (`/api/devices/*`).
- Offline-first ASHA kiosk sync queue with IndexedDB persistence.

### Phase 2: Controlled Field Pilot (`IN DEVELOPMENT` — Q3 2026)
- Fabrication of 100 injection-molded CareLink Assist units.
- Pilot deployment with Rural Outreach Health Camps in peri-urban Jaipur and Alwar, Rajasthan.
- User acceptance testing (UAT) with 50 geriatric patients living alone.
- Iteration on MPU6050 fall sensitivity parameters based on real-world movement logs.
- Clinical review of Gemini AI health summaries with consulting hospital physicians.

### Phase 3: Hardware Refinement & Connectivity Expansion (`PROPOSED` — Q4 2026)
- Integration of SIM7000 / SIM7600 NB-IoT & 4G LTE-M modems for cellular independence without home Wi-Fi.
- Custom PCB design replacing breadboard prototyping modules to reduce enclosure dimensions by 45%.
- Qi Wireless Charging dock for simplified bedside charging by tremor-impaired elderly users.
- IP67 water-resistant enclosure for shower/bathroom fall protection.

### Phase 4: Pan-India Scalability & Certification (`FUTURE SCOPE` — 2027)
- Formal production integration with National Health Authority (NHA) ABDM Sandbox for ABHA M1/M2/M3 certification.
- Decentralized assembly through state polytechnics, maker spaces, and Village Level Entrepreneurs (VLEs) under CSC e-Governance.
- Application for CDSCO Class A/B medical assistive device safety clearance.
- Integration with state emergency 108 ambulance computer-aided dispatch (CAD) software.
