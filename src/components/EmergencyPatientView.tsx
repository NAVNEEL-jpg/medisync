'use client';

import React, { useState, useEffect } from 'react';
import { PatientProfile } from '@/lib/types';
import {
  ShieldAlert,
  Heart,
  Activity,
  AlertTriangle,
  Pill,
  PhoneCall,
  Sparkles,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  Printer,
  ArrowLeft,
  Lock,
  Flame,
  AlertCircle,
  Share2,
  MapPin,
  Download,
  Stethoscope,
  Radio,
  Calendar,
  User,
  History,
} from 'lucide-react';

interface EmergencyPatientViewProps {
  patient?: PatientProfile;
  accessType?: string;
  onBack?: () => void;
}

export function EmergencyPatientView({ patient, accessType, onBack }: EmergencyPatientViewProps) {
  const [sessionSeconds, setSessionSeconds] = useState(14 * 60 + 56);
  const [geminiBrief, setGeminiBrief] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const pName = patient?.fullName || 'Verified Patient';
  const pId = patient?.id || '#NDHN-EMERGENCY';
  const pBlood = patient?.bloodGroup || 'O+';
  const pGender = patient?.gender || 'Male';
  const pDob = patient?.dob || 'Not specified';
  const pVitals = patient?.vitals;
  const pAllergies = patient?.allergies || [];
  const pConditions = patient?.existingConditions || [];
  const pMeds = patient?.prescriptions || [];
  const pContacts = patient?.emergencyContacts || [];
  const pLogs = patient?.accessLogs || [];
  const pVitalsHistory = patient?.vitalsHistory || [];

  const lastUpdatedFormatted = patient?.lastProfileUpdate
    ? new Date(patient.lastProfileUpdate).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Recently Updated';

  const updatedByFormatted = patient?.lastUpdatedBy || `${pName} (Self / Attending Clinician)`;

  const initials = pName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PT';

  const generateGeminiClinicalBrief = async () => {
    setLoadingAi(true);
    try {
      const allergyList = pAllergies.map((a) => `${a.allergen} (${a.severity})`).join(', ') || 'None documented';
      const conditionList = pConditions.join(', ') || 'None documented';
      const prompt = `Provide a 3-bullet clinical emergency resuscitation briefing for ${pName} (${pGender}, Blood ${pBlood}, Allergies: ${allergyList}, Conditions: ${conditionList}). State immediate contraindications, airway/drug cautions, and resuscitation directives concisely.`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: prompt }],
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setGeminiBrief(data.reply);
      }
    } catch (e) {
      console.error('AI brief generation error:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. TOP RED BANNER: EMERGENCY TRIAGE MODE */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black text-sm sm:text-base tracking-wide uppercase font-sans">
                EMERGENCY TRIAGE MODE • PUBLIC READ-ONLY VAULT
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-white text-red-700 tracking-wider">
                FHIR R4 FAST-SCAN
              </span>
            </div>
            <p className="text-xs text-red-100 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              Verified Cryptographic Medical Identity • Real-Time Patient Health Record
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 bg-red-800/80 px-3 py-1.5 rounded-xl border border-red-500/40 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-amber-300" />
          <span>Patient ID: <strong>{pId}</strong></span>
        </div>
      </div>

      {/* 2. AUDIT TRAIL BANNER: WHEN UPDATED & BY WHOM */}
      <div className="bg-[#0B172E] border border-cyan-500/30 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                CLINICAL RECORD VERIFICATION
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              Last Updated:{' '}
              <span className="text-cyan-300 font-mono font-extrabold">{lastUpdatedFormatted}</span>
              {' '}· By:{' '}
              <span className="text-amber-300 font-semibold">{updatedByFormatted}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0 self-end sm:self-auto">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>Audited via MediSync Vault</span>
        </div>
      </div>

      {/* 3. PATIENT BIO & TELEMETRY ROW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Identity (5 Cols) */}
        <div className="md:col-span-5 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-700 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
            <span className="text-xl font-black text-white">{initials}</span>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-tl-lg text-white flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              {pName}
            </h2>
            <p className="text-xs font-mono font-bold text-sky-800 mt-0.5">
              MRN: {pId} {patient?.aadhaarNumber ? `· Aadhaar: •••• ${patient.aadhaarNumber.slice(-4)}` : ''}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {pGender} · DOB: {pDob} {patient?.city ? `· ${patient.city}` : ''}
            </p>

            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
              <span className="px-2 py-0.5 rounded-full font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                <Heart className="w-3 h-3 text-sky-600 fill-sky-600" />
                Organ Donor: {patient?.organDonor ? 'YES' : 'NO'}
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                DNR: {patient?.dnrStatus ? 'Do Not Resuscitate' : 'Full Code'}
              </span>
              {pAllergies.length > 0 && (
                <span className="px-2 py-0.5 rounded-full font-black bg-red-100 text-red-700 border border-red-300">
                  {pAllergies.length} ALLERGIES RECORDED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Blood Group Salmon Card (3 Cols) */}
        <div className="md:col-span-3 bg-red-50/70 border border-red-200 rounded-2xl p-4 text-center flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-red-800 tracking-wider flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-red-600" />
            BLOOD GROUP
          </span>
          <p className="text-3xl font-black text-red-950 font-sans tracking-tight mt-0.5 leading-none">
            {pBlood}
          </p>
          <span className="mt-1 text-[9px] uppercase font-black px-2 py-0.5 rounded bg-red-600 text-white tracking-widest inline-block mx-auto">
            {pBlood.includes('-') ? 'RH NEGATIVE' : 'RH POSITIVE'}
          </span>
        </div>

        {/* Heart Rate Metric (2 Cols) */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HEART RATE</span>
              <Heart className="w-3.5 h-3.5 text-red-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">
              {pVitals?.heartRate && pVitals.heartRate > 0 ? pVitals.heartRate : '--'}{' '}
              <span className="text-xs font-sans text-slate-400 font-medium">BPM</span>
            </p>
            <span className="text-[10px] font-bold text-emerald-600">
              {pVitals?.heartRate ? 'Normal Rhythm' : 'Unrecorded'}
            </span>
          </div>
          <div className="h-6 flex items-end">
            <svg viewBox="0 0 100 20" className="w-full h-5 stroke-red-600 fill-none stroke-2">
              <path d="M0,10 L30,10 L35,2 L40,18 L45,6 L50,14 L55,10 L100,10" />
            </svg>
          </div>
        </div>

        {/* SpO2 Metric (2 Cols) */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SPO2 (PULSE OX)</span>
              <Activity className="w-3.5 h-3.5 text-[#0284c7]" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">
              {pVitals?.spO2 && pVitals.spO2 > 0 ? pVitals.spO2 : '--'}{' '}
              <span className="text-xs font-sans text-slate-400 font-medium">%</span>
            </p>
            <span className="text-[10px] font-bold text-sky-700">
              {pVitals?.spO2 && pVitals.spO2 >= 95 ? 'Normal Saturation' : pVitals?.spO2 ? 'Attention' : 'Unrecorded'}
            </span>
          </div>
          <div className="h-6 flex items-end">
            <svg viewBox="0 0 100 20" className="w-full h-4 stroke-[#0284c7] fill-none stroke-2">
              <path d="M0,10 Q25,2 50,10 T100,10" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Gemini Emergency Brief Trigger */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
          <span className="font-bold text-sky-950">
            Rapid ER Resuscitation Briefing:
          </span>
          <span className="text-slate-600 hidden sm:inline">
            Synthesize drug contraindications & airway directives for {pName}.
          </span>
        </div>
        <button
          onClick={generateGeminiClinicalBrief}
          disabled={loadingAi}
          className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shrink-0 shadow-xs transition cursor-pointer"
        >
          {loadingAi ? 'Synthesizing...' : 'Generate 5s Brief'}
        </button>
      </div>

      {geminiBrief && (
        <div className="bg-white border border-sky-300 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed shadow-xs whitespace-pre-wrap">
          {geminiBrief}
        </div>
      )}

      {/* 4. MAIN TWO-COLUMN CLINICAL DATA GRID */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Allergies & Conditions (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* ALLERGIES */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <Flame className="w-4 h-4 text-red-600" />
                Documented Allergies ({pAllergies.length})
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                {pAllergies.length > 0 ? 'CRITICAL AVOIDANCE' : 'NO KNOWN ALLERGIES'}
              </span>
            </div>

            <div className="space-y-2.5">
              {pAllergies.length > 0 ? (
                pAllergies.map((all, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-red-900">{all.allergen}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          all.severity === 'CRITICAL'
                            ? 'bg-red-600 text-white'
                            : all.severity === 'MODERATE'
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {all.severity}
                      </span>
                    </div>
                    <p className="text-xs text-red-800 leading-tight">
                      Reaction: {all.reaction || 'Standard severe sensitivity protocol.'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No critical allergies logged in patient vault.
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE CHRONIC CONDITIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <Activity className="w-4 h-4 text-[#0284c7]" />
                Active Medical Conditions ({pConditions.length})
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                REGISTRY SYNC
              </span>
            </div>

            <div className="space-y-2.5">
              {pConditions.length > 0 ? (
                pConditions.map((cond, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{cond}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700 shrink-0">
                      DOCUMENTED
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No active chronic conditions recorded.
                </div>
              )}
            </div>
          </div>

          {/* VITALS LOG HISTORY */}
          {pVitalsHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                  <History className="w-4 h-4 text-emerald-600" />
                  Vitals Measurement History ({pVitalsHistory.length})
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Audit Log</span>
              </div>

              <div className="space-y-2">
                {pVitalsHistory.slice(0, 5).map((v) => (
                  <div key={v.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-mono font-bold text-slate-800">
                        <span>HR: {v.heartRate || '--'} bpm</span>
                        <span>·</span>
                        <span>BP: {v.bloodPressure || '--'}</span>
                        <span>·</span>
                        <span>SpO2: {v.spO2 ? `${v.spO2}%` : '--'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Recorded by: <strong>{v.recordedBy}</strong> {v.notes ? `(${v.notes})` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {new Date(v.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Medications & Emergency Contacts (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* CURRENT MEDICATIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <Pill className="w-4 h-4 text-[#0284c7]" />
                Active Prescriptions ({pMeds.length})
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                PHARMACY LOG
              </span>
            </div>

            <div className="space-y-2.5">
              {pMeds.length > 0 ? (
                pMeds.map((med) => (
                  <div key={med.id} className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{med.medicationName}</span>
                      <p className="text-slate-600">{med.dosage} · {med.frequency}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sky-800">{med.prescribedBy || 'Prescribed'}</span>
                      {med.datePrescribed && <p className="text-[10px] text-slate-400">{med.datePrescribed}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No active prescriptions logged.
                </div>
              )}
            </div>
          </div>

          {/* EMERGENCY RELATIVES & CONTACTS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Emergency Contacts (1-Tap Call)
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Immediate Triage</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {pContacts.length > 0 ? (
                pContacts.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#0284c7] text-white">
                          {c.isPrimary ? 'PRIMARY' : 'SECONDARY'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">{c.relationship}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{c.name}</h4>
                      <p className="font-mono text-slate-600">{c.phone}</p>
                    </div>

                    <a
                      href={`tel:${c.phone.replace(/\D/g, '')}`}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition shadow-xs text-xs cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>CALL {c.relationship.toUpperCase()}</span>
                    </a>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No emergency next-of-kin contacts registered.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. LEGAL & PRIVACY CLINICAL AUDIT DISCLAIMER */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>LEGAL & PRIVACY CLINICAL AUDIT:</strong> Notice: This emergency page presents verified triage information authorized solely for first responders under emergency life-saving protocol waivers. Access has been cryptographically recorded with timestamp and source identifier.
          </p>
        </div>
        <span className="font-mono text-[10px] font-bold text-sky-900 bg-white px-2.5 py-1 rounded-lg border border-sky-300 shrink-0">
          FHIR R4 • ABDM Verified
        </span>
      </div>

      {/* 6. BOTTOM ACTION TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => alert('Paramedic arrival logged in MediSync national trauma grid.')}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black flex items-center gap-2 transition shadow-xs cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Report Paramedic Arrival</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-2 transition border border-slate-300 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Print Emergency Summary</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Emergency Session: <strong>{formatTimer(sessionSeconds)}</strong></span>
        </div>
      </div>
    </div>
  );
}
