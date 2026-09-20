'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Phone,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Building2,
  Clock,
  ExternalLink,
} from 'lucide-react';

export function SecureGateway() {
  const [accessScope, setAccessScope] = useState<'CITIZEN' | 'HOSPITAL' | 'FIRST_RESPONDER'>('CITIZEN');
  const [healthId, setHealthId] = useState('9482 1049 4829');
  const [mobileNumber, setMobileNumber] = useState('+1 (555) •••-5821');
  const [otp, setOtp] = useState(['7', '3', '9', '0', '4', '2']);
  const [timerSeconds, setTimerSeconds] = useState(105);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `0${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Protocol Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-slate-500 font-mono">
          <span className="font-extrabold text-[#0284c7]">MEDISYNC SECURE GATEWAY</span>
          <span>/</span>
          <span>Federated Identity Node: <strong>US-ER-EAST-04</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold text-slate-700 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            HIPAA & NDHM Tier-4 Certified
          </span>
          <button
            onClick={() => alert('Code Red SOS Override protocol engaged.')}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] tracking-wider uppercase rounded-lg shadow-xs flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>CODE RED SOS OVERRIDE</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Gateway Layout */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left Column: Scope + Authentication Protocol (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Access Privilege Scope */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                ACCESS PRIVILEGE SCOPE
              </span>
              <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Patient Citizen Tier
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAccessScope('CITIZEN')}
                className={`p-3 rounded-xl border text-left transition ${
                  accessScope === 'CITIZEN'
                    ? 'border-[#0284c7] bg-sky-50/60 text-[#0284c7]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-bold block">Patient / Citizen</span>
                <span className="text-[10px] text-slate-500">Dual-Factor Citizen Auth</span>
              </button>

              <button
                type="button"
                onClick={() => setAccessScope('HOSPITAL')}
                className={`p-3 rounded-xl border text-left transition ${
                  accessScope === 'HOSPITAL'
                    ? 'border-[#0284c7] bg-sky-50/60 text-[#0284c7]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-bold block">Hospital / ER Triage</span>
                <span className="text-[10px] text-slate-500">NPI / Medical Council</span>
              </button>

              <button
                type="button"
                onClick={() => setAccessScope('FIRST_RESPONDER')}
                className={`p-3 rounded-xl border text-left transition ${
                  accessScope === 'FIRST_RESPONDER'
                    ? 'border-[#0284c7] bg-sky-50/60 text-[#0284c7]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-bold block">First Responder</span>
                <span className="text-[10px] text-slate-500">Rapid 911/108 Bypass</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Active Permissions Granted:</strong> Full Profile Editing, Prescription Sync, Emergency QR Token Generation, Consent Revocation.
              </span>
            </div>
          </div>

          {/* Authentication Protocol Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  AUTHENTICATION PROTOCOL
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  National Health ID Verification
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#0284c7]" />
                256-Bit Hardware Keystore
              </span>
            </div>

            {/* Step 1 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  Step 1: National Health ID / Aadhaar / ABHA *
                </label>
                <span className="text-[10px] text-sky-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> UIDAI / NDHM Gateway Connected
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={healthId}
                  onChange={(e) => setHealthId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-slate-50/50"
                />
                <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VALID
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Identity token will remain strictly confidential under Zero-Knowledge proof protocols.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  Step 2: Linked Mobile Contact *
                </label>
                <span className="text-[10px] text-slate-500">Primary SMS Channel</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => alert('New OTP sent to registered mobile number.')}
                  className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs rounded-xl border border-sky-300 transition"
                >
                  Send OTP
                </button>
              </div>
            </div>

            {/* Step 3: OTP 6 Digit Inputs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-800">
                  Step 3: One-Time Passcode (OTP) *
                </label>
                <span className="text-[11px] font-mono text-red-600 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatTimer(timerSeconds)} remaining
                </span>
              </div>

              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-14 text-center text-xl font-mono font-black rounded-xl border-2 border-slate-300 focus:border-[#0284c7] focus:outline-hidden bg-white text-slate-900 shadow-xs"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px]">
                <span className="text-slate-400">Didn&apos;t receive SMS?</span>
                <div className="flex gap-3">
                  <button className="text-sky-700 font-bold hover:underline">
                    Resend via WhatsApp
                  </button>
                  <button className="text-slate-500 hover:underline">
                    Resend SMS
                  </button>
                </div>
              </div>
            </div>

            {/* Authenticate Button */}
            <button
              onClick={() => alert('Session authenticated! Opening emergency medical profile.')}
              className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Authenticate & Open Emergency Profile</span>
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-1 font-medium">
              <span>🛡️ Zero-Knowledge Vault</span>
              <span>•</span>
              <span>🔒 TLS 1.3 Strict Tunnel</span>
              <span>•</span>
              <span>📋 ABHA Milestone-3</span>
            </div>

            {/* Alternative Nodes */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => alert('Redirecting to DigiLocker Aadhaar e-KYC...')}
                className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition text-xs"
              >
                <span>Verify via DigiLocker ID</span>
              </button>
              <button
                onClick={() => alert('Prompting device biometric passkey (Windows Hello / Touch ID)...')}
                className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition text-xs"
              >
                <span>Biometric Passkey / Touch ID</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Governance Matrix, Cardholder Preview, SOS Warning (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Clinical Governance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  CLINICAL GOVERNANCE
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Dual-Access Tier Matrix
                </h4>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#0284c7]" />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              MediSync employs granular cryptographic permissions to prevent unauthorized electronic health record (EHR) exposure while preserving critical life-saving accessibility.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Public QR Scan</span>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                    Zero Auth Needed
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  First-line field access: Blood Group (O+), Critical Allergies (Penicillin anaphylaxis), Emergency Contacts, Do-Not-Resuscitate (DNR) directives.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-950 text-xs">Patient Auth (Current)</span>
                  <span className="text-[10px] font-bold text-white bg-[#0284c7] px-2 py-0.5 rounded">
                    Full Control
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Full historical timelines, prescription archive downloads, physical emergency wallet card ordering, guardian proxy authorization.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Verified Hospital / ER</span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                    NPI Reg Req
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Real-time clinical telemetry streaming, lab pathology ingestion, acute trauma medication adjustments, automated hospital-to-hospital transfer records.
                </p>
              </div>
            </div>

            {/* Global Node Availability */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Global Node Availability
                </span>
                <span className="text-lg font-black text-slate-900 font-mono">99.994%</span>
                <span className="text-[10px] text-slate-500 block">Sub-40ms ER query response</span>
              </div>
              <div className="w-20 h-8">
                <svg viewBox="0 0 100 30" className="w-full h-full stroke-[#0284c7] fill-none stroke-2">
                  <path d="M0,20 L20,18 L40,25 L60,10 L80,15 L100,5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cardholder Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              CARDHOLDER PREVIEW
            </span>

            {/* Cardholder widget */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#006194] to-[#0284c7] text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-sky-200">
                    MEDISYNC EMERGENCY ID
                  </span>
                  <p className="text-[11px] text-slate-200">Universal First Responder Key</p>
                </div>
                <QrCode className="w-8 h-8 text-white" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-sky-200">PATIENT SUBJECT</span>
                <h5 className="text-base font-extrabold text-white">Eleanor Vance-Kovacs</h5>
                <p className="font-mono text-xs text-sky-100">MED-8492-0941-AB</p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-bold text-[10px]">
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <span className="text-[9px] text-sky-200 block">BLOOD</span>
                  <span>O NEG (O-)</span>
                </div>
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <span className="text-[9px] text-sky-200 block">ALLERGY</span>
                  <span>PENICILLIN</span>
                </div>
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <span className="text-[9px] text-sky-200 block">ORGAN</span>
                  <span>DONOR</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>💳 Physical Smartcard active</span>
              <button className="text-sky-700 font-bold hover:underline">
                Reissue QR Token
              </button>
            </div>
          </div>

          {/* Red Alert Support Card */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2 text-xs">
            <h5 className="font-black text-red-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Unregistered Emergency Personnel?
            </h5>
            <p className="text-red-800 text-[11px] leading-relaxed">
              Trauma centers without active MediSync federation tokens can initiate voice-verified emergency lookups via the 24/7 Red Switchboard.
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href="tel:18006332537"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
              >
                Call 1-800-MED-ALERT
              </a>
              <button
                onClick={() => alert('Opening offline triage guidelines...')}
                className="text-xs text-red-700 underline font-semibold"
              >
                View Triage Offline Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
