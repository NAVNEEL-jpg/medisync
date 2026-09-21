'use client';

import React, { useState } from 'react';
import { PatientProfile } from '@/lib/types';
import {
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pill,
  Users,
  Plus,
  Trash2,
  Sparkles,
  FileText,
  Upload,
  Save,
  ShieldCheck,
  QrCode,
  Lock,
  Download,
  Eye,
  Activity,
  ExternalLink,
} from 'lucide-react';

interface PatientPortalProps {
  patient?: PatientProfile;
  onUpdatePatient?: (updated: PatientProfile) => void;
}

export function PatientPortal({ patient, onUpdatePatient }: PatientPortalProps) {
  const [daysSinceAudit, setDaysSinceAudit] = useState(118);
  const [auditConfirmed, setAuditConfirmed] = useState(false);
  const [showAddDrug, setShowAddDrug] = useState(false);
  const [showAiChatModal, setShowAiChatModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleRecertify = () => {
    setAuditConfirmed(true);
    setDaysSinceAudit(0);
    alert('Mandatory 4-Month Health Audit successfully re-certified! High-priority QR validation extended for 120 days on the National Trauma Grid.');
  };

  const askAiTriage = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: `Patient health consultation: ${aiQuery}` }],
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setAiAnswer(data.reply);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. MANDATORY 4-MONTH EMERGENCY DATA AUDIT BANNER */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-bold text-sm shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                Action Required: Mandatory 4-Month Emergency Data Audit
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#0284c7] text-white tracking-wider">
                {auditConfirmed ? 'AUDIT VERIFIED TODAY' : `${daysSinceAudit} DAYS SINCE AUDIT`}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Your last verified health record review was {daysSinceAudit} days ago. Please re-confirm your critical allergies, current prescriptions, and emergency contacts to maintain high-priority QR validation on the national trauma grid.
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Last verified by Dr. Sarah Jenkins (Trauma Node 04) • Nov 12, 2024
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={handleRecertify}
            disabled={auditConfirmed}
            className="px-4 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{auditConfirmed ? 'Audit Complete' : 'Review & Re-certify Data (Takes 2 mins)'}</span>
          </button>
          <button
            onClick={() => alert('Audit Policy: MediSync National Trauma Grid requires 120-day periodic verification to ensure emergency personnel do not act on outdated medications.')}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 transition"
          >
            Audit Policy
          </button>
        </div>
      </div>

      {/* 2. PATIENT BIO & LIVE EMERGENCY QR ROW */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left: Patient Identity Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                <span className="text-xl font-black text-slate-700">MV</span>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-tl-lg text-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                  Marcus Vance
                </h3>
                <p className="text-xs font-mono font-bold text-sky-800 mt-0.5">
                  #MED-8492-US
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  38 Yrs • Male • Dob: Oct 14, 1986 • Primary Trauma Center: St. Jude Trauma 1
                </p>
              </div>
            </div>

            <button
              onClick={() => alert('Editing profile: Update your emergency contacts and allergies.')}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
            >
              <Lock className="w-3.5 h-3.5 text-[#0284c7]" />
              <div className="text-left">
                <span>Update Emergency Profile</span>
                <span className="block text-[9px] font-normal text-slate-500">
                  Patient & Certified Hospital Staff Only
                </span>
              </div>
            </button>
          </div>

          {/* 4 Micro-Status Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">QR Link</span>
              <span className="font-bold text-slate-900">QR Sync Active</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">National ID</span>
              <span className="font-bold text-slate-900">ABHA Linked</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">Emergency Relay</span>
              <span className="font-bold text-slate-900">3 Contacts Active</span>
            </div>

            <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-200 text-red-900">
              <span className="text-[10px] text-red-600 block font-semibold">Blood Matrix</span>
              <span className="font-black text-red-950">Blood Group O+</span>
            </div>
          </div>
        </div>

        {/* Right: Live Emergency QR Badge (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#0284c7]" />
              Live Emergency QR
            </h4>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              Dynamic HL7
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-300 shrink-0">
              <QrCode className="w-20 h-20 text-slate-900" />
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 block">Encrypted Trauma Token</span>
              <p className="text-slate-500 text-[11px] leading-tight">
                Direct EMT scan bypasses PIN for vitals and lethal drug allergies.
              </p>
              <p className="text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1 pt-1">
                <Clock className="w-3 h-3" /> Expires: 48d 14h
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => alert('Saved Emergency QR to Phone Lock Screen Wallpaper.')}
              className="flex-1 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200 transition"
            >
              Lock Screen
            </button>
            <button
              onClick={() => alert('Navigating to physical card customizer...')}
              className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              Order Card
            </button>
          </div>
        </div>
      </div>

      {/* 3. DIAGNOSTICS & ACTIVE PRESCRIPTIONS ROW */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left: Active Diagnostics & Conditions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Active Diagnostics & Conditions
              </h4>
              <p className="text-[11px] text-slate-400">
                Continuous monitoring with clinical severity telemetry
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              3 Active
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Condition 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Type 1 Diabetes Mellitus
                  </span>
                  <p className="text-[11px] text-slate-500">Endocrine Node • Onset: 2012</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                  Controlled
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600">HbA1c Target Level</span>
                <span className="font-mono font-bold text-slate-900">6.8 %</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-[#0284c7] h-full rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Safe Range: 6.0 - 7.0%</span>
                <span className="text-emerald-700 font-bold">Optimal Range</span>
              </div>
            </div>

            {/* Condition 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Essential Hypertension
                  </span>
                  <p className="text-[11px] text-slate-500">Cardiovascular • Stage 1 Controlled</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Managed
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600">Mean Blood Pressure Telemetry</span>
                <span className="font-mono font-bold text-slate-900">128/82 mmHg</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '55%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Target: &lt; 130/80</span>
                <span className="text-emerald-700 font-bold">Stable Waveform</span>
              </div>
            </div>

            {/* Condition 3 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">
                    Mild Intermittent Asthma
                  </span>
                  <p className="text-[11px] text-slate-500">Pulmonary • Exercise & Seasonal Triggered</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                  Low Risk
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600">Peak Expiratory Flow (PEF)</span>
                <span className="font-mono font-bold text-slate-900">510 L/min</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-[#0284c7] h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Current Active Prescriptions (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Current Active Prescriptions
                </h4>
                <p className="text-[11px] text-slate-400">Validated pharmacology with dosing schedules</p>
              </div>
              <button
                onClick={() => setShowAddDrug(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Drug</span>
              </button>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              {/* Rx 1 */}
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    Lantus SoloStar <span className="font-normal text-slate-500 text-xs">100u/mL SubQ</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-sky-800 bg-sky-100">
                    Auto-Refill Active
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Prescriber: Dr. Chen (Endo Grid Node 1)
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#0284c7]" /> Nightly 22 units at 21:00
                  </span>
                  <span className="text-slate-400">Next: Feb 28, 2025</span>
                </div>
              </div>

              {/* Rx 2 */}
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    Lisinopril <span className="font-normal text-slate-500 text-xs">10mg Oral Tablet</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-800 bg-amber-100">
                    Refill in 14 Days
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Prescriber: Dr. Sarah Jenkins (Cardiology)
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#0284c7]" /> 1 tablet each morning
                  </span>
                  <button className="text-sky-700 font-bold hover:underline">
                    Request Script
                  </button>
                </div>
              </div>

              {/* Rx 3 */}
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    Ventolin HFA Inhaler <span className="font-normal text-slate-500 text-xs">90mcg / Actuation</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 bg-slate-200">
                    Emergency Only
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Prescriber: Dr. Roberts (Pulmonology)
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
                  <span className="text-sky-700 font-semibold">PRN: 2 puffs q4h as needed</span>
                  <span className="text-slate-400">Canister: 140/200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SURGICAL LOG & DIAGNOSTIC VAULT LABS */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left: Surgical & Intervention Log (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Surgical & Intervention Log
              </h4>
              <p className="text-[11px] text-slate-400">Trauma-relevant procedural past history</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              Verified Records
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0284c7] mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Right Knee Arthroscopy</span>
                  <span className="font-mono text-slate-500 font-semibold">2021</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Partial medial meniscectomy. Performed at Stanford Orthopedic Pavilion. Full recovery, no metallic implants.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Emergency Laparoscopic Appendectomy</span>
                  <span className="font-mono text-slate-500 font-semibold">2018</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Uncomplicated appendiceal resection. Normal anatomical healing. General anesthesia tolerated without malignant hyperthermia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Diagnostic Vault & Labs (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Diagnostic Vault & Labs
              </h4>
              <p className="text-[11px] text-slate-400">HL7-compliant documents with tamper-proof seal</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              3 Files
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* File 1 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-red-500" />
                <div>
                  <span className="font-bold text-slate-900">Recent Blood Lipid & HbA1c Panel.pdf</span>
                  <p className="text-[10px] text-slate-400">Jan 18, 2025 • 2.4 MB • Quest Diagnostics</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => alert('Downloading Lab Report PDF...')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert('Viewing Recent Blood Lipid & HbA1c Panel')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* File 2 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-red-500" />
                <div>
                  <span className="font-bold text-slate-900">Cardiology Stress ECG Report.pdf</span>
                  <p className="text-[10px] text-slate-400">Dec 04, 2024 • 4.8 MB • St. Jude Lab</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => alert('Downloading ECG Report PDF...')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert('Viewing Cardiology Stress ECG Report')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* File 3 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
                <div>
                  <span className="font-bold text-slate-900">COVID-19 Vaccination Certificate.pdf</span>
                  <p className="text-[10px] text-slate-400">Oct 12, 2023 • 410 KB • CDC Record Grid</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => alert('Downloading Vaccine Certificate...')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert('Viewing Vaccination Certificate')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Upload Box */}
            <div className="p-4 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 text-center text-xs space-y-1 hover:bg-sky-50 transition cursor-pointer">
              <Upload className="w-5 h-5 text-[#0284c7] mx-auto" />
              <p className="font-bold text-slate-800">Upload Lab Report / Scan</p>
              <p className="text-[11px] text-slate-500">
                Drop DICOM, PDF, or JPG scans here or <span className="text-[#0284c7] underline font-bold">browse local files</span>. Max file size: 25MB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom-Right MediSync Clinical AI Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAiChatModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center gap-2 shadow-xl border border-sky-300 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <div className="text-left">
            <span className="block leading-none font-extrabold">MediSync Clinical AI</span>
            <span className="text-[9px] text-sky-200 leading-none">24/7 AI Triage & Hospitals</span>
          </div>
        </button>
      </div>

      {/* Clinical AI Modal */}
      {showAiChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0284c7]" />
                <h4 className="font-black text-sm text-slate-900">MediSync Clinical AI Assistant</h4>
              </div>
              <button
                onClick={() => setShowAiChatModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600">
              Ask questions about your lab results, medication interactions, or emergency care instructions:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g. Can I take Lisinopril with Ibuprofen?"
                className="flex-1 p-2.5 rounded-xl border border-slate-300 font-medium"
              />
              <button
                onClick={askAiTriage}
                disabled={aiLoading}
                className="px-4 py-2.5 rounded-xl bg-[#0284c7] text-white font-bold disabled:opacity-50"
              >
                {aiLoading ? 'Thinking...' : 'Ask AI'}
              </button>
            </div>

            {aiAnswer && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 whitespace-pre-wrap leading-relaxed">
                {aiAnswer}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
