'use client';

import React, { useState } from 'react';
import {
  X,
  Award,
  Layers,
  Cpu,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  Globe2,
  Users,
  Compass,
} from 'lucide-react';

interface DesignForBharatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesignForBharatModal({ isOpen, onClose }: DesignForBharatModalProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'problem' | 'hardware' | 'platform' | 'caregiver' | 'affordability' | 'scalability' | 'roadmap'
  >('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#091322] border border-teal-500/40 shadow-2xl shadow-teal-950/80 overflow-hidden text-slate-100 font-body">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-bold text-white">
                  Design for Bharat Challenge 2026
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Category 2: Swasthya
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluation Dossier: MediSync CareLink Assistive Ecosystem
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-white/10 bg-slate-900/40 overflow-x-auto no-scrollbar shrink-0 text-xs font-medium">
          {[
            { id: 'overview', label: '1. Executive Summary', icon: <Compass className="w-3.5 h-3.5" /> },
            { id: 'problem', label: '2. Problem & Beneficiaries', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'hardware', label: '3. Physical Device', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'platform', label: '4. Digital Platform', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'caregiver', label: '5. Care Network', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
            { id: 'affordability', label: '6. Affordability & BOM', icon: <DollarSign className="w-3.5 h-3.5" /> },
            { id: 'scalability', label: '7. Pan-India Scale', icon: <Globe2 className="w-3.5 h-3.5" /> },
            { id: 'roadmap', label: '8. Roadmap', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-slate-300">
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30">
                <h3 className="text-white font-display font-bold text-base mb-1">
                  Project Identity & Mission
                </h3>
                <p className="text-teal-200/90 text-sm">
                  <strong className="text-white">MediSync CareLink:</strong> "Technology That Cares. Healthcare That Reaches Everyone."
                </p>
                <p className="mt-2 text-slate-300 text-xs leading-normal">
                  MediSync CareLink transforms passive digital records into an active assistive healthcare safety net for India. By uniting a custom sub-₹1,800 ESP32 wearable, an ABDM-aligned personal health vault, and an authorized caregiver communication ring, CareLink addresses the acute care gap for elderly citizens and rural communities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="text-[11px] font-mono text-teal-400 font-semibold uppercase">Hardware Pillar</p>
                  <p className="text-white font-bold text-sm mt-0.5">CareLink Assist Device</p>
                  <p className="text-xs text-slate-400 mt-1">
                    ESP32 + MAX30102 + MPU6050 fall sensor + tactile SOS with 0.96" OLED.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">Platform Pillar</p>
                  <p className="text-white font-bold text-sm mt-0.5">Digital Health Vault</p>
                  <p className="text-xs text-slate-400 mt-1">
                    FHIR R4 medical history, AI summary explanations, secure revocable QR.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="text-[11px] font-mono text-amber-400 font-semibold uppercase">Network Pillar</p>
                  <p className="text-white font-bold text-sm mt-0.5">Care Network</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Consent-based caregiver portal, live telemetry feeds, real-time fall alerts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROBLEM & BENEFICIARIES */}
          {activeTab === 'problem' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-white font-display font-bold text-base">
                1. What problem are we solving?
              </h3>
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                  The Golden Hour Crisis (150,000+ Preventable Deaths Annually)
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  In emergency trauma medicine, the first 60 minutes determine patient survival. Unconscious victims arriving at Indian emergency rooms face <strong>3 fatal trauma blind spots</strong>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/20">
                    <p className="text-rose-300 font-bold text-[11px]">⚠ 1. Lethal Drug Allergies</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">Penicillin / NSAIDs administered to unconscious victims causing fatal anaphylaxis.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20">
                    <p className="text-amber-300 font-bold text-[11px]">⚠ 2. Hidden Implants</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">Non-conditional pacemakers & aneurysm clips causing fatal trauma under emergency MRI.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20">
                    <p className="text-cyan-300 font-bold text-[11px]">⚠ 3. Fragmented Silos</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">Records locked in distant clinic papers or behind locked smartphone passcodes.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                  <h4 className="text-rose-300 font-bold text-xs uppercase tracking-wider font-mono">The Elderly Care Crisis</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Over 138 million elderly Indians live without round-the-clock medical supervision. Accidental falls and silent cardiovascular distress go unnoticed for hours because imported smartwatches cost over ₹25,000 and require complex smartphone pairing.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                  <h4 className="text-amber-300 font-bold text-xs uppercase tracking-wider font-mono">The Rural Doctor Deficit</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    In primary health centers (PHCs), doctor-to-patient ratios often exceed 1:11,000. Paramedics and ASHA workers lack portable diagnostic records when an unconscious patient arrives at emergency triage.
                  </p>
                </div>
              </div>

              <h3 className="text-white font-display font-bold text-base pt-2">
                2. Who benefits from the project?
              </h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Elderly & Chronic Patients:</strong> Gain one-touch emergency dispatch, standalone OLED pulse/SpO2 readings, and multilingual accessibility without smartphone complexity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Family Caregivers:</strong> Immediate push alerts for suspected falls or critical vitals with strict patient consent controls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Rural Healthcare Workers (ASHAs):</strong> Offline kiosk mode to enroll village citizens and queue immunization/vitals records during power or network outages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Emergency First Responders (108 EMTs):</strong> Instant access to allergies, blood group, and implants via secure QR scan in under 8 seconds.</span>
                </li>
              </ul>
            </div>
          )}

          {/* TAB 3: PHYSICAL HARDWARE */}
          {activeTab === 'hardware' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-white font-display font-bold text-base">
                4. How does the physical CareLink device work?
              </h3>
              <p className="text-xs text-slate-300">
                The CareLink Assist Device is built on an ultra-low-cost, widely accessible open-hardware architecture designed to be assembled and serviced locally in Indian maker labs and ITIs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="font-mono text-teal-400 font-bold uppercase text-[11px]">Processing & Comms</p>
                  <p className="text-white font-semibold mt-1">ESP32-WROOM-32D (Espressif)</p>
                  <p className="text-slate-400 mt-1">
                    Dual-core Xtensa 32-bit LX6 MCU with built-in 802.11b/g/n Wi-Fi and Bluetooth Low Energy. Executes real-time sensor polling and fallback offline telemetry caching.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="font-mono text-rose-400 font-bold uppercase text-[11px]">Optical Biosensing</p>
                  <p className="text-white font-semibold mt-1">Maxim MAX30102 PPG Sensor</p>
                  <p className="text-slate-400 mt-1">
                    Dual Red (660nm) and Infrared (880nm) optical LEDs with ambient light cancellation for continuous pulse rate and blood oxygen (SpO2) estimation.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="font-mono text-amber-400 font-bold uppercase text-[11px]">Fall Detection IMU</p>
                  <p className="text-white font-semibold mt-1">InvenSense MPU6050 6-Axis IMU</p>
                  <p className="text-slate-400 mt-1">
                    Tri-axial accelerometer and gyroscope sampled at 50Hz. Algorithms detect high-G impact spikes followed by prolonged lack of movement to flag suspected falls.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="font-mono text-cyan-400 font-bold uppercase text-[11px]">User Interface & Alerting</p>
                  <p className="text-white font-semibold mt-1">0.96" OLED + SOS Switch + 85dB Siren</p>
                  <p className="text-slate-400 mt-1">
                    High-contrast monochrome display readable in bright sunlight, hardware interrupt physical SOS button, and local auditory alert buzzer for nearby assistance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIGITAL PLATFORM */}
          {activeTab === 'platform' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-white font-display font-bold text-base">
                5. How does the digital platform work?
              </h3>
              <p className="text-xs text-slate-300">
                The MediSync digital platform acts as an ABDM-compliant national health record vault, linking physical devices, patient management, and AI assistance:
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-teal-500/30">
                  <strong className="text-teal-300">Secure Revocable QR Emergency Cards:</strong> Instead of embedding raw medical records in the QR code (a severe privacy hazard), the CareLink QR contains a signed, revocable token. First responders scan the token to access emergency vitals under a break-glass audit trail.
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-teal-500/30">
                  <strong className="text-teal-300">Explainable AI with Google Gemini:</strong> Gemini translates dense lab reports, prescription dosages, and symptom concerns into plain Hindi, Bengali, or English with strict clinical boundaries (no unsupervised medical diagnosing or prescribing).
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-teal-500/30">
                  <strong className="text-teal-300">Universal Accessibility Engine:</strong> Full high-contrast mode, text scaling up to 150%, Text-to-Speech audio readouts, and Web Speech voice navigation designed for elderly users who cannot type.
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CAREGIVER NETWORK */}
          {activeTab === 'caregiver' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-white font-display font-bold text-base">
                6. How do patients and caregivers interact?
              </h3>
              <p className="text-xs text-slate-300">
                CareLink treats patient autonomy and dignity as paramount. A caregiver never receives indiscriminate access to a patient’s entire confidential history without explicit consent.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="text-teal-400 font-bold mb-1">Granular Consent Matrix</p>
                  <p className="text-slate-400">
                    Patients choose what their caregiver sees: Emergency SOS only, Live Vitals only, Medication Reminders, or Full Clinical Summary.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <p className="text-teal-400 font-bold mb-1">Real-Time Event Dispatch</p>
                  <p className="text-slate-400">
                    When an SOS or suspected fall occurs, the backend validates the device HMAC token and sends instant alerts with the patient's last recorded location and vitals snapshot.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AFFORDABILITY */}
          {activeTab === 'affordability' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-white font-display font-bold text-base">
                7. Why is the solution affordable?
              </h3>
              <p className="text-xs text-slate-300">
                Target Bill of Materials (BOM) per CareLink unit at scale:
              </p>

              <div className="rounded-2xl border border-white/10 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] border-b border-white/10">
                    <tr>
                      <th className="p-2.5">Component</th>
                      <th className="p-2.5">Specification</th>
                      <th className="p-2.5 text-right">Target Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-2.5 text-white font-medium">ESP32-WROOM-32D MCU</td>
                      <td className="p-2.5 text-slate-400">Espressif Dual-Core SoC</td>
                      <td className="p-2.5 text-right font-mono text-teal-400 font-bold">₹280</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-white font-medium">Maxim MAX30102 Sensor</td>
                      <td className="p-2.5 text-slate-400">Pulse Oximeter Optical PPG</td>
                      <td className="p-2.5 text-right font-mono text-teal-400 font-bold">₹210</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-white font-medium">InvenSense MPU6050</td>
                      <td className="p-2.5 text-slate-400">6-Axis Accelerometer & Gyro</td>
                      <td className="p-2.5 text-right font-mono text-teal-400 font-bold">₹110</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-white font-medium">0.96" SSD1306 OLED</td>
                      <td className="p-2.5 text-slate-400">128x64 Monochrome I2C Screen</td>
                      <td className="p-2.5 text-right font-mono text-teal-400 font-bold">₹160</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-white font-medium">Tactile SOS & Piezo Siren</td>
                      <td className="p-2.5 text-slate-400">Emergency Switch + 85dB Buzzer</td>
                      <td className="p-2.5 text-right font-mono text-teal-400 font-bold">₹45</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-white font-medium">Rechargeable Li-Po & TP4056</td>
                      <td className="p-2.5 text-slate-400">500mAh Battery + USB-C Charger</td>
                      <td className="p-2.5 text-right font-mono text-teal-400 font-bold">₹190</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-white font-medium">Enclosure & Assembly</td>
                      <td className="p-2.5 text-slate-400">Injection-molded ABS housing</td>
                      <td className="p-2.5 text-right font-mono text-teal-400 font-bold">₹180</td>
                    </tr>
                    <tr className="bg-teal-950/40 font-bold">
                      <td className="p-2.5 text-teal-300">Total Projected Hardware BOM</td>
                      <td className="p-2.5 text-slate-400">Sub-₹1,800 production cost</td>
                      <td className="p-2.5 text-right font-mono text-teal-300 text-sm">₹1,175 / unit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                *Compared to proprietary medical monitoring watches ranging from ₹22,000 to ₹45,000, CareLink is over 15x more affordable and operates without recurring monthly subscriptions.
              </p>
            </div>
          )}

          {/* TAB 7: SCALABILITY */}
          {activeTab === 'scalability' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-white font-display font-bold text-base">
                8. How can it scale across India?
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <h4 className="text-teal-400 font-bold text-sm mb-1">ABDM / ABHA National Federation</h4>
                  <p className="text-slate-300">
                    Built upon the Ayushman Bharat Digital Mission (ABDM) guidelines. Profiles map to 14-digit ABHA numbers, ensuring interoperability across AIIMS, state civil hospitals, and rural primary health centers without vendor lock-in.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <h4 className="text-teal-400 font-bold text-sm mb-1">Offline-First Rural Resilience</h4>
                  <p className="text-slate-300">
                    Rural sub-centers and mobile health camps frequently suffer from intermittent connectivity. The CareLink Kiosk stores records locally in encrypted IndexedDB caches and automatically pushes queued batches as soon as cellular or broadband connectivity resumes.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                  <h4 className="text-teal-400 font-bold text-sm mb-1">Indigenous Local Manufacturing</h4>
                  <p className="text-slate-300">
                    By leveraging open firmware and modular parts, device assembly can be decentralized across state electronics incubators, polytechnics, and village level entrepreneur (VLE) Common Service Centers (CSCs).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-white font-display font-bold text-base">
                Implementation Roadmap
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/40">
                  <span className="text-teal-300 font-bold">[PHASE 1: PROTOTYPE & PLATFORM — CURRENT]</span>
                  <p className="text-slate-300 font-body text-xs mt-1">
                    Functional ESP32 firmware, real-time telemetry API, accessible web vault, caregiver dashboard, and Gemini AI summaries.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                  <span className="text-cyan-300 font-bold">[PHASE 2: PILOT FIELD TESTING — Q3 2026]</span>
                  <p className="text-slate-300 font-body text-xs mt-1">
                    100-device pilot trial with rural outreach camps in Rajasthan and geriatric care centers in peri-urban Jaipur.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                  <span className="text-amber-300 font-bold">[PHASE 3: CELLULAR NB-IoT/4G EXTENSION — Q1 2027]</span>
                  <p className="text-slate-300 font-body text-xs mt-1">
                    Integrate SIM7000/SIM7600 NB-IoT modules for cellular independence outside home Wi-Fi boundaries.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/80 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>Design for Bharat Challenge 2026 · Category 2 (Swasthya)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition-colors cursor-pointer"
          >
            Close Presentation
          </button>
        </div>
      </div>
    </div>
  );
}
