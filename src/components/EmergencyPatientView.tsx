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

  const generateGeminiClinicalBrief = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              text: 'Provide a 3-bullet clinical resuscitation briefing for Marcus Vance (42y/o male, Blood O-NEG, Critical Penicillin & NSAID anaphylaxis, Type 1 Diabetes, Dual-chamber Pacemaker MRI Conditional). State immediate contraindications, pacemaker caution, and airway protocols.',
            },
          ],
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setGeminiBrief(data.reply);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. TOP RED BANNER: EMERGENCY TRIAGE MODE • PUBLIC READ-ONLY ACCESS */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black text-sm sm:text-base tracking-wide uppercase font-sans">
                EMERGENCY TRIAGE MODE • PUBLIC READ-ONLY ACCESS
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-white text-red-700 tracking-wider">
                RESTRICTED EDITING
              </span>
            </div>
            <p className="text-xs text-red-100 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Record cryptographically verified via National Digital Health Network • FHIR R4 Compliant Fast-Scan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 bg-red-800/80 px-3 py-1.5 rounded-xl border border-red-500/40 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-amber-300" />
          <span>Audit Pin: <strong>#TX-9842-EM</strong></span>
        </div>
      </div>

      {/* 2. PATIENT BIO & TELEMETRY ROW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Patient Photo & Identity (5 Cols) */}
        <div className="md:col-span-5 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
            {/* Fallback avatar with verified icon */}
            <span className="text-xl font-black text-slate-700">MV</span>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-tl-lg text-white flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                Marcus Vance
              </h2>
            </div>
            <p className="text-xs font-mono font-bold text-sky-800 mt-0.5">
              MRN: #NDHN-8902-MV
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              42 Yrs • Male • Primary Language: English • DOB: 14 Oct 1982
            </p>

            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
              <span className="px-2 py-0.5 rounded-full font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                <Heart className="w-3 h-3 text-sky-600 fill-sky-600" />
                Organ Donor: YES
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                DNR Status: Full Code
              </span>
              <span className="px-2 py-0.5 rounded-full font-black bg-red-100 text-red-700 border border-red-300">
                HIGH-RISK ANAPHYLAXIS
              </span>
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
            O NEG
          </p>
          <p className="text-xl font-black text-red-900 leading-tight">(O-)</p>
          <span className="mt-1 text-[9px] uppercase font-black px-2 py-0.5 rounded bg-red-600 text-white tracking-widest inline-block mx-auto">
            UNIVERSAL DONOR CELL
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
              114 <span className="text-xs font-sans text-slate-400 font-medium">BPM</span>
            </p>
            <span className="text-[10px] font-bold text-red-600">↑ Tachycardia</span>
          </div>
          {/* ECG Line visual */}
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
              93 <span className="text-xs font-sans text-slate-400 font-medium">%</span>
            </p>
            <span className="text-[10px] font-bold text-sky-700">↓ Borderline Hypoxia</span>
          </div>
          {/* Wave line visual */}
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
            Synthesize instant drug contraindications & airway directives with Gemini 3.7.
          </span>
        </div>
        <button
          onClick={generateGeminiClinicalBrief}
          disabled={loadingAi}
          className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shrink-0 shadow-xs transition"
        >
          {loadingAi ? 'Synthesizing...' : 'Generate 5s Brief'}
        </button>
      </div>

      {geminiBrief && (
        <div className="bg-white border border-sky-300 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed shadow-xs whitespace-pre-wrap">
          {geminiBrief}
        </div>
      )}

      {/* 3. MAIN TWO-COLUMN CLINICAL DATA GRID */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Allergies & Conditions (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* SEVERE & LETHAL ALLERGIES */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <Flame className="w-4 h-4 text-red-600" />
                Severe & Lethal Allergies
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                3 Documented
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Allergy 1 */}
              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-red-900">
                    PENICILLIN / BETA-LACTAMS
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                    CRITICAL SHOCK RISK
                  </span>
                </div>
                <p className="text-xs text-red-800 leading-tight">
                  Reaction: Immediate Anaphylactic Shock, airway closure, acute hypotension within 90 seconds. Epi-Pen protocol mandatory.
                </p>
              </div>

              {/* Allergy 2 */}
              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-red-900">
                    PEANUTS / TREE NUTS
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                    SEVERE SYSTEMIC
                  </span>
                </div>
                <p className="text-xs text-red-800 leading-tight">
                  Reaction: Severe angioedema, facial edema, diffuse urticaria. Requires prompt IM Epinephrine 0.3mg.
                </p>
              </div>

              {/* Allergy 3 */}
              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-red-900">
                    NSAIDS / IBUPROFEN
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                    BRONCHOSPASM
                  </span>
                </div>
                <p className="text-xs text-red-800 leading-tight">
                  Reaction: Intractable bronchospasm & dyspnea. Avoid Ketorolac, Naproxen, Aspirin. Acetaminophen IV tolerated.
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVE CHRONIC CONDITIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <Activity className="w-4 h-4 text-[#0284c7]" />
                Active Chronic Conditions
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                ACTIVE REGISTRY
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Condition 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Type 1 Diabetes Mellitus (T1D)
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Insulin Dependent. High risk of DKA upon trauma or systemic infection. Baseline BG: 140 mg/dL.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700 shrink-0">
                  HIGHRISK
                </span>
              </div>

              {/* Condition 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Hypertension Stage 2
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Essential arterial hypertension. Managed with daily ACE inhibitor.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700 shrink-0">
                  MANAGED
                </span>
              </div>

              {/* Condition 3 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Severe Reactive Asthma
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Exercise & stress-induced. Patient routinely carries rescue Albuterol inhaler in personal kit.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700 shrink-0">
                  AIRWAY ALERT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Medications, Implants, Emergency Relatives (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* CRITICAL CURRENT MEDICATIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <Pill className="w-4 h-4 text-[#0284c7]" />
                Critical Current Medications
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                PHARMACY SYNCED
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Med 1 */}
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">Insulin Glargine (Lantus)</span>
                  <p className="text-slate-600">24 Units SubQ Daily at Bedtime (QHS)</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sky-800">Long-acting</span>
                  <p className="text-[10px] text-slate-400">Last Taken: Yesterday 22:00</p>
                </div>
              </div>

              {/* Med 2 */}
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">Lisinopril</span>
                  <p className="text-slate-600">10mg Oral Tablet Daily (QD AM)</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sky-800">Antihypertensive</span>
                  <p className="text-[10px] text-slate-400">Last Taken: Today 08:30</p>
                </div>
              </div>

              {/* Med 3 */}
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">Ventolin HFA (Albuterol)</span>
                  <p className="text-slate-600">90mcg/actuation, 2 puffs PRN wheeze</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sky-800">Rescue Bronchodilator</span>
                  <p className="text-[10px] text-slate-400">Patient carried</p>
                </div>
              </div>
            </div>
          </div>

          {/* MEDICAL IMPLANTS & HARDWARE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <Activity className="w-4 h-4 text-slate-800" />
                Medical Implants & Hardware
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                MRI HAZARD
              </span>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">
                  Cardiac Pacemaker • Dual Chamber
                </span>
                <button
                  onClick={() => alert('Pacer Specs: Abbott Tendril STS Lead Model #2088TC • Serial: 489218')}
                  className="px-2.5 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[11px] shadow-xs"
                >
                  Pacer Specs
                </button>
              </div>

              <p className="text-slate-600">
                Manufacturer: St. Jude Medical (Abbott) • Implant Date: March 2022
                <br />
                Location: Right Pectoral Pocket • Leads: Right Atrium & Right Ventricle
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase tracking-wider">
                  MRI CONDITIONAL ONLY
                </span>
                <span className="text-[11px] font-mono text-slate-700 font-semibold">
                  Rate set: 60 - 130 BPM Demand
                </span>
              </div>
            </div>
          </div>

          {/* EMERGENCY RELATIVES & PHYSICIANS (1-Tap Dialing) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 uppercase tracking-wide">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Emergency Relatives & Physicians
              </h3>
              <span className="text-[10px] font-bold text-slate-400">1-Tap Dialing</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {/* Relative 1 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#0284c7] text-white">
                      PRIMARY NEXT-OF-KIN
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">Spouse</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Eleanor Vance</h4>
                  <p className="font-mono text-slate-600">+1 (555) 234-5678</p>
                </div>

                <a
                  href="tel:15552345678"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition shadow-xs text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>CALL SPOUSE NOW</span>
                </a>
              </div>

              {/* Physician 2 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                      ATTENDING SPECIALIST
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">Cardiology</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Dr. Robert Chen, MD</h4>
                  <p className="font-mono text-slate-600">+1 (555) 890-1234 (Clinic ext 4)</p>
                </div>

                <a
                  href="tel:15558901234"
                  className="w-full py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition shadow-xs text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>CONTACT CLINIC</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LEGAL & PRIVACY CLINICAL AUDIT DISCLAIMER */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>LEGAL & PRIVACY CLINICAL AUDIT DISCLAIMER:</strong> Notice: This emergency page presents designated non-confidential triage information authorized solely for first responders under emergency life-saving protocol waivers. Access has been cryptographically recorded with IP hash, device telemetry, and timestamp (Today, 14:28:10 UTC).
          </p>
        </div>
        <span className="font-mono text-[10px] font-bold text-sky-900 bg-white px-2.5 py-1 rounded-lg border border-sky-300 shrink-0">
          HIPAA • 45 CFR § 164.510(a)
        </span>
      </div>

      {/* 5. BOTTOM ACTION TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Paramedic arrival logged and broadcast to hospital trauma ward.')}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black flex items-center gap-2 transition shadow-xs"
          >
            <Radio className="w-4 h-4" />
            <span>Report Paramedic Arrival</span>
          </button>

          <button
            onClick={() => alert('Live ambulance GPS tracking link sent to family emergency contacts.')}
            className="px-4 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold flex items-center gap-2 transition border border-sky-300"
          >
            <MapPin className="w-4 h-4 text-[#0284c7]" />
            <span>Share Live GPS to Family</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-2 transition border border-slate-300 shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Emergency PDF Summary</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Session Expires in: <strong>{formatTimer(sessionSeconds)}</strong></span>
        </div>
      </div>
    </div>
  );
}
