'use client';

import React, { useState } from 'react';
import { ShieldAlert, Search, Key, QrCode, Phone, CheckCircle, AlertTriangle, Building, Lock } from 'lucide-react';
import { PatientProfile } from '@/lib/types';

interface EmergencyLookupProps {
  onPatientFound: (patient: PatientProfile, accessType: string) => void;
  initialQuery?: string;
}

export function EmergencyLookup({ onPatientFound, initialQuery = '' }: EmergencyLookupProps) {
  const [searchType, setSearchType] = useState<'AADHAAR' | 'MOBILE' | 'QR'>('AADHAAR');
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Break Glass Modal State
  const [showBreakGlassModal, setShowBreakGlassModal] = useState(false);
  const [pendingPatient, setPendingPatient] = useState<PatientProfile | null>(null);
  const [doctorCreds, setDoctorCreds] = useState({
    name: 'Dr. Vivek Mehra, MD',
    licenseNumber: 'MCI-REG-882194',
    hospital: 'SMS Medical College & Emergency Hospital',
    emergencyReason: 'Patient unresponsive / critical acute trauma evaluation',
  });

  // Standard OTP State
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  const formatAadhaar = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleSearch = async (overrideQuery?: string, directMode: 'SEARCH' | 'BREAK_GLASS' = 'SEARCH') => {
    const q = (overrideQuery || query).trim();
    if (!q) {
      setError('Please enter an Aadhaar Number, Mobile Number, or scan QR ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First find if patient exists
      const res = await fetch('/api/patients/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          accessMode: directMode === 'BREAK_GLASS' ? 'BREAK_GLASS' : 'PATIENT_DIRECT',
          doctorCredentials: directMode === 'BREAK_GLASS' ? doctorCreds : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Patient record not found.');
      }

      if (directMode === 'BREAK_GLASS') {
        setShowBreakGlassModal(false);
        onPatientFound(data.patient, 'BREAK_GLASS_OVERRIDE');
      } else {
        setPendingPatient(data.patient);
        // Show choice: Break-Glass or Send OTP
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!pendingPatient || !otp) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/patients/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: pendingPatient.id,
          accessMode: 'OTP',
          otp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');

      onPatientFound(data.patient, 'VERIFIED_OTP');
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Emergency Hero Alert Header */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 rounded-2xl border-2 border-red-600/60 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Emergency Department & Paramedic Terminal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Instant Patient Triage Lookup
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Access life-saving medical history, severe allergies, active medications, and blood group in under 5 seconds.
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-200 max-w-xs">
            <p className="font-bold flex items-center gap-1 text-red-300">
              <Lock className="w-3.5 h-3.5" />
              Audit-Logged Protocol
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              All accesses are logged in accordance with National Digital Health data protection laws.
            </p>
          </div>
        </div>
      </div>

      {/* Main Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        {/* Method Switcher Tabs */}
        <div className="flex border-b border-slate-200 pb-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchType('AADHAAR');
              setQuery('2345 6789 0123');
              setError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              searchType === 'AADHAAR'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Aadhaar Number (12-Digit)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchType('MOBILE');
              setQuery('9876543210');
              setError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              searchType === 'MOBILE'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Registered Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchType('QR');
              setQuery('MS-IND-89421');
              setError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              searchType === 'QR'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Emergency QR / MediSync ID</span>
          </button>
        </div>

        {/* Input Bar */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            {searchType === 'AADHAAR' && 'Enter 12-Digit Patient Aadhaar Number'}
            {searchType === 'MOBILE' && 'Enter 10-Digit Registered Mobile Number'}
            {searchType === 'QR' && 'Scan or Type MediSync Emergency ID / Token'}
          </label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  if (searchType === 'AADHAAR') {
                    setQuery(formatAadhaar(e.target.value));
                  } else {
                    setQuery(e.target.value);
                  }
                }}
                placeholder={
                  searchType === 'AADHAAR'
                    ? '2345 6789 0123'
                    : searchType === 'MOBILE'
                    ? '98765 43210'
                    : 'MS-IND-89421'
                }
                className="w-full text-base sm:text-lg font-mono tracking-wider px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] font-semibold text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm flex items-center gap-2 transition disabled:opacity-50 shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Locate Profile'}</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Patients Fillers */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Quick Demo Cases:</span>
          <button
            onClick={() => {
              setSearchType('AADHAAR');
              setQuery('2345 6789 0123');
              handleSearch('2345 6789 0123');
            }}
            className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold border border-red-200 transition flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3 text-red-600" />
            Rajesh Sharma (Critical Penicillin Allergy, Heart Stent)
          </button>
          <button
            onClick={() => {
              setSearchType('AADHAAR');
              setQuery('4567 8901 2345');
              handleSearch('4567 8901 2345');
            }}
            className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200 transition"
          >
            Sunita Devi (Rural Camp Patient, Asthma, Aspirin Allergy)
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Patient Matched Verification Prompt */}
        {pendingPatient && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-lg">
                  {pendingPatient.bloodGroup}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {pendingPatient.fullName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Aadhaar: XXXX-XXXX-{pendingPatient.aadhaarNumber.slice(-4)} | Mobile: +91 {pendingPatient.mobileNumber}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Verified MediSync Record
              </span>
            </div>

            <div className="text-xs text-slate-600">
              Choose your authorization protocol to view the clinical profile:
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Option 1: Emergency Break-Glass */}
              <button
                onClick={() => setShowBreakGlassModal(true)}
                className="p-4 rounded-xl border-2 border-red-500 bg-red-50 hover:bg-red-100 text-left transition group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    EMERGENCY BREAK-GLASS
                  </span>
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-red-600 text-white">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-red-800 mt-1">
                  For doctors & paramedics in life-threatening emergencies. Bypasses OTP and immediately opens profile. Logs physician credentials in audit ledger.
                </p>
              </button>

              {/* Option 2: Standard OTP */}
              <div className="p-4 rounded-xl border border-slate-300 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#0284c7]" />
                    Standard Patient OTP
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Consent-Based
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Sends 6-digit one-time password to patient&apos;s registered mobile number for routine consultations.
                </p>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 123456)"
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#0284c7]"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={!otp || loading}
                    className="px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg disabled:opacity-50"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Break-Glass Doctor Modal */}
      {showBreakGlassModal && pendingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-red-600 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">
                  Emergency Break-Glass Override
                </h3>
                <p className="text-xs text-red-600 font-semibold">
                  Section 43A IT Act & Clinical Emergency Triage Protocol
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-700">
              <p className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-800">
                You are accessing the emergency medical record of <strong>{pendingPatient.fullName}</strong> without patient OTP. This action will be permanently recorded in the National Health Audit Ledger and an emergency notification will be dispatched to next-of-kin.
              </p>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Attending Physician Name *
                </label>
                <input
                  type="text"
                  value={doctorCreds.name}
                  onChange={(e) => setDoctorCreds({ ...doctorCreds, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    MCI / State Medical License # *
                  </label>
                  <input
                    type="text"
                    value={doctorCreds.licenseNumber}
                    onChange={(e) => setDoctorCreds({ ...doctorCreds, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Hospital / Trauma Center *
                  </label>
                  <input
                    type="text"
                    value={doctorCreds.hospital}
                    onChange={(e) => setDoctorCreds({ ...doctorCreds, hospital: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Clinical Emergency Reason *
                </label>
                <input
                  type="text"
                  value={doctorCreds.emergencyReason}
                  onChange={(e) => setDoctorCreds({ ...doctorCreds, emergencyReason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBreakGlassModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSearch(pendingPatient.id, 'BREAK_GLASS')}
                className="px-5 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <ShieldAlert className="w-4 h-4" />
                Authorize & Open Emergency Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
