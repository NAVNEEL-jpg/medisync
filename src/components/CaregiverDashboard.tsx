'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  CareLinkDevice,
  DeviceTelemetry,
  EmergencyEvent,
  PatientProfile,
  CaregiverRelationship,
} from '@/lib/types';
import {
  INITIAL_PATIENTS,
  getCareLinkDeviceForPatient,
  getDeviceTelemetry,
  getEmergencyEvents,
  acknowledgeEmergencyEvent,
} from '@/lib/mockDatabase';
import {
  HeartHandshake,
  ShieldAlert,
  Activity,
  Heart,
  Battery,
  Radio,
  PhoneCall,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  User,
  Calendar,
  Pill,
  Bell,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export function CaregiverDashboard() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile>(INITIAL_PATIENTS[0]);
  const [device, setDevice] = useState<CareLinkDevice | undefined>(undefined);
  const [telemetry, setTelemetry] = useState<DeviceTelemetry[]>([]);
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);

  // Active permissions granted by patient to caregiver
  const [permissions, setPermissions] = useState<Array<'VIEW_VITALS' | 'RECEIVE_SOS' | 'VIEW_MEDICATIONS' | 'FULL_RECORDS'>>([
    'VIEW_VITALS',
    'RECEIVE_SOS',
    'VIEW_MEDICATIONS',
  ]);

  const refreshData = () => {
    setIsRefreshing(true);
    const d = getCareLinkDeviceForPatient(selectedPatient.id);
    setDevice(d);
    setTelemetry(getDeviceTelemetry(d?.id));
    setEmergencyEvents(getEmergencyEvents(selectedPatient.id));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  useEffect(() => {
    refreshData();
  }, [selectedPatient]);

  const handleAcknowledgeAlert = (eventId: string) => {
    acknowledgeEmergencyEvent(eventId, `${user?.displayName || 'Ananya Sharma'} (Caregiver)`, 'Checked on patient. False alarm/slip resolved, patient uninjured.');
    refreshData();
  };

  const hasPermission = (p: 'VIEW_VITALS' | 'RECEIVE_SOS' | 'VIEW_MEDICATIONS' | 'FULL_RECORDS') => {
    return permissions.includes(p);
  };

  const latestTelemetry = telemetry[0] || {
    heartRate: 74,
    spO2: 98,
    motionMagnitude: 1.02,
    batteryLevel: 84,
    status: 'ONLINE',
  };

  return (
    <div className="w-full space-y-6 font-body text-slate-100">
      {/* ── TOP CAREGIVER WELCOME BANNER ──────────────────────── */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-teal-950/70 via-slate-900 to-cyan-950/60 border border-teal-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                Caregiver Monitoring Hub
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                CareLink Network
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Authorized Caregiver: <strong>{user?.displayName || 'Ananya Sharma'}</strong> · Linked to father <strong>{selectedPatient.fullName}</strong>
            </p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConsentModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 hover:border-teal-400 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Consent &amp; Permissions</span>
          </button>
          <button
            onClick={refreshData}
            className={`p-2 rounded-xl bg-slate-800/80 border border-white/10 hover:border-teal-400 text-slate-200 transition-colors cursor-pointer ${
              isRefreshing ? 'animate-spin text-teal-400' : ''
            }`}
            title="Refresh Live Feeds"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CONSENT & PERMISSION BADGE NOTIFICATION ──────────── */}
      <div className="rounded-2xl p-3 bg-slate-900/60 border border-teal-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-teal-300">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Patient-Authorized Consent Matrix:</span>
          <div className="flex flex-wrap gap-1.5">
            {permissions.map((p) => (
              <span key={p} className="px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 font-mono text-[10px] font-bold">
                ✓ {p.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
        <span className="text-[11px] text-slate-400 italic">
          *Access strictly scoped by patient under ABDM consent protocol
        </span>
      </div>

      {/* ── CRITICAL EMERGENCY & FALL ALERTS (IF ANY) ─────────── */}
      {hasPermission('RECEIVE_SOS') && emergencyEvents.some((e) => e.status === 'ACTIVE' || e.status === 'ACKNOWLEDGED') && (
        <div className="space-y-3">
          {emergencyEvents
            .filter((e) => e.status === 'ACTIVE' || e.status === 'ACKNOWLEDGED')
            .map((event) => (
              <div
                key={event.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  event.status === 'ACTIVE'
                    ? 'bg-rose-950/70 border-rose-500 shadow-xl shadow-rose-950/60 animate-pulse'
                    : 'bg-amber-950/50 border-amber-500/60 shadow-lg'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
                          {event.eventType === 'SUSPECTED_FALL' ? 'Suspected Fall Detected' : 'Emergency SOS Triggered'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          event.status === 'ACTIVE' ? 'bg-rose-500 text-white animate-bounce' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm font-display font-bold text-white mt-0.5">
                        {event.patientName} · {event.location?.label || 'Home Location'}
                      </p>
                      <p className="text-xs text-slate-300 mt-1">{event.notes}</p>
                      {event.vitalsSnapshot && (
                        <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                          <span>HR: <strong>{event.vitalsSnapshot.heartRate} bpm</strong></span>
                          <span>SpO2: <strong>{event.vitalsSnapshot.spO2}%</strong></span>
                          <span>BP: <strong>{event.vitalsSnapshot.bloodPressure}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <a
                      href={`tel:${selectedPatient.mobileNumber}`}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-400"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Father
                    </a>
                    {event.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleAcknowledgeAlert(event.id)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs border border-white/20 hover:bg-slate-700"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ── 3-COLUMN DASHBOARD GRID ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Telemetry & Device Status (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* CareLink Connected Device Card */}
          <div className="rounded-3xl p-5 bg-slate-900/80 border border-teal-500/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm">
                    CareLink Assist Device
                  </h3>
                  <p className="text-[11px] font-mono text-teal-400">
                    {device?.id || 'CL-ESP32-9081'}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            {hasPermission('VIEW_VITALS') ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-black/40 border border-teal-500/20 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Current Pulse (MAX30102)</span>
                  <p className="text-2xl font-display font-extrabold text-white mt-0.5">
                    {latestTelemetry.heartRate} <span className="text-xs font-normal text-teal-400">bpm</span>
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold">Normal Baseline</span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-teal-500/20 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Blood Oxygen (SpO2)</span>
                  <p className="text-2xl font-display font-extrabold text-white mt-0.5">
                    {latestTelemetry.spO2} <span className="text-xs font-normal text-teal-400">%</span>
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold">Optimal &gt; 95%</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-center text-xs text-slate-400">
                <Lock className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                Live Vitals permission has not been granted by the patient.
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <Battery className="w-3.5 h-3.5" /> Battery: {latestTelemetry.batteryLevel}%
              </span>
              <span>Motion IMU: {latestTelemetry.motionMagnitude}g</span>
            </div>
          </div>

          {/* Quick Emergency Dial Ring */}
          <div className="rounded-3xl p-5 bg-slate-900/80 border border-white/10 space-y-3">
            <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-teal-400" />
              Emergency Response Circle
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Rajesh Sharma (Father)</p>
                  <p className="text-slate-400 text-[11px]">+91 98765 43210</p>
                </div>
                <a href="tel:9876543210" className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs">
                  Call
                </a>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Dr. Vivek Mehra (ER Trauma Lead)</p>
                  <p className="text-slate-400 text-[11px]">SMS Medical College Hospital</p>
                </div>
                <a href="tel:9829012345" className="px-3 py-1.5 rounded-lg bg-slate-800 text-teal-300 font-bold text-xs border border-teal-500/30">
                  Call Clinic
                </a>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <p className="font-bold text-rose-300">108 Ambulance Network</p>
                  <p className="text-slate-400 text-[11px]">National Emergency Dispatch</p>
                </div>
                <a href="tel:108" className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">
                  Dial 108
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Medications, Activity Timeline & History (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Medication Adherence Section */}
          <div className="rounded-3xl p-5 bg-slate-900/80 border border-teal-500/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-400" />
                <h3 className="font-display font-bold text-white text-sm">
                  Today's Medication Schedule &amp; Adherence
                </h3>
              </div>
              <span className="text-[11px] font-mono text-teal-400 font-bold">2/3 Taken Today</span>
            </div>

            {hasPermission('VIEW_MEDICATIONS') ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Metformin 500mg</p>
                      <p className="text-slate-400 text-[11px]">Morning with Breakfast · Taken at 08:15 AM</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Confirmed
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Telmisartan 40mg (BP)</p>
                      <p className="text-slate-400 text-[11px]">Afternoon Post-Lunch · Taken at 01:30 PM</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Confirmed
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Atorvastatin 10mg (Lipid)</p>
                      <p className="text-slate-400 text-[11px]">Bedtime · Scheduled for 09:30 PM</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Pending
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-center text-xs text-slate-400">
                <Lock className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                Medication Schedule permission has not been granted by the patient.
              </div>
            )}
          </div>

          {/* Patient Activity Timeline & Device Events */}
          <div className="rounded-3xl p-5 bg-slate-900/80 border border-white/10 space-y-3">
            <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              Patient Activity &amp; Check-In Timeline
            </h3>

            <div className="space-y-3 text-xs pl-2 border-l-2 border-teal-500/30">
              <div className="relative pl-4 space-y-0.5">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-slate-400">08:15 AM · CareLink Hub</span>
                <p className="text-white font-medium">Morning vitals synced (Pulse: 74 bpm, SpO2: 98%).</p>
              </div>

              <div className="relative pl-4 space-y-0.5">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span className="text-[10px] font-mono text-slate-400">07:30 AM · Motion Sensor</span>
                <p className="text-white font-medium">Morning walk detected (35 minutes gentle activity, 1.1g vector).</p>
              </div>

              <div className="relative pl-4 space-y-0.5">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span className="text-[10px] font-mono text-slate-400">Yesterday 09:30 PM · Medication Log</span>
                <p className="text-white font-medium">Night medication confirmed taken by patient.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONSENT & PERMISSION CONTROLS MODAL ────────────────── */}
      {consentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-teal-500/40 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-400 font-bold font-display">
                <Lock className="w-5 h-5" />
                <span>Patient Consent &amp; Permissions</span>
              </div>
              <button
                onClick={() => setConsentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              In accordance with ABDM guidelines, patients explicitly choose what data family caregivers can view. Toggle permissions below to simulate patient consent settings:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { id: 'RECEIVE_SOS', label: 'Receive Emergency SOS & Fall Alerts', desc: 'Critical alerts, location, and emergency callback' },
                { id: 'VIEW_VITALS', label: 'View Live Vitals & Telemetry', desc: 'Continuous heart rate, SpO2, and device battery' },
                { id: 'VIEW_MEDICATIONS', label: 'View Medication Adherence', desc: 'Prescription schedule and daily dose check-ins' },
                { id: 'FULL_RECORDS', label: 'Access Full Diagnostic Lab Reports', desc: 'Historical PDFs, hospital discharge summaries' },
              ].map((item) => {
                const active = permissions.includes(item.id as any);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (active) {
                        setPermissions(permissions.filter((p) => p !== item.id));
                      } else {
                        setPermissions([...permissions, item.id as any]);
                      }
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      active
                        ? 'bg-teal-950/40 border-teal-500/50 text-white'
                        : 'bg-black/40 border-white/10 text-slate-400'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-white">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      active ? 'bg-teal-500 border-teal-400 text-slate-950 font-bold' : 'border-white/20'
                    }`}>
                      {active ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setConsentModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400"
            >
              Apply Consent Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
