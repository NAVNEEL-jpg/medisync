'use client';

import React, { useState } from 'react';
import { PatientProfile } from '@/lib/types';
import {
  HeartHandshake,
  UserPlus,
  Printer,
  CheckCircle,
  AlertCircle,
  Building,
  QrCode,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AssistanceCampKioskProps {
  onPatientEnrolled: (patient: PatientProfile) => void;
}

export function AssistanceCampKiosk({ onPatientEnrolled }: AssistanceCampKioskProps) {
  const [campLocation, setCampLocation] = useState('Outreach Health Camp #14 — CHC Rural Center');
  const [operatorName, setOperatorName] = useState('Sunita Sharma (ASHA Facilitator)');
  const [registeredList, setRegisteredList] = useState<PatientProfile[]>([]);
  const [successPatient, setSuccessPatient] = useState<PatientProfile | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    aadhaarNumber: '',
    mobileNumber: '',
    dob: '',
    gender: 'Female' as PatientProfile['gender'],
    bloodGroup: 'B+' as PatientProfile['bloodGroup'],
    address: '',
    city: '',
    state: 'Rajasthan',
    existingConditions: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyRelationship: 'Son',
    bloodPressure: '120/80 mmHg',
    heartRate: '72',
  });

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.aadhaarNumber) return;

    const campData = {
      fullName: formData.fullName.trim(),
      aadhaarNumber: formData.aadhaarNumber.replace(/\D/g, ''),
      mobileNumber: formData.mobileNumber.replace(/\D/g, '') || '0000000000',
      dob: formData.dob || '1965-01-01',
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      address: formData.address || 'Local Village',
      city: formData.city || 'District Block',
      state: formData.state,
      existingConditions: formData.existingConditions
        ? formData.existingConditions.split(',').map((s) => s.trim())
        : ['General Elderly Care'],
      pastDiseases: [],
      surgeriesAndImplants: [],
      allergies: formData.allergies
        ? formData.allergies.split(',').map((a) => ({
            allergen: a.trim(),
            severity: 'CRITICAL' as const,
            reaction: 'Severe allergic reaction',
          }))
        : [],
      vitals: {
        bloodPressure: formData.bloodPressure,
        heartRate: parseInt(formData.heartRate) || 72,
        spO2: 98,
        lastRecorded: new Date().toISOString(),
      },
      prescriptions: [],
      emergencyContacts: [
        {
          id: `ec-camp-${Date.now()}`,
          name: formData.emergencyContactName || 'Family Contact',
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyContactPhone || '108',
          isPrimary: true,
        },
      ],
      nominees: [],
      organDonor: false,
      dnrStatus: false,
      isRegisteredAtOfflineCamp: true,
      registeredCampLocation: campLocation,
    };

    try {
      const res = await fetch('/api/patients/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REGISTER_CAMP_PATIENT',
          campData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.patient) {
        setSuccessPatient(data.patient);
        setRegisteredList((prev) => [data.patient, ...prev]);
        onPatientEnrolled(data.patient);

        // Reset form
        setFormData({
          fullName: '',
          aadhaarNumber: '',
          mobileNumber: '',
          dob: '',
          gender: 'Female',
          bloodGroup: 'B+',
          address: '',
          city: '',
          state: 'Rajasthan',
          existingConditions: '',
          allergies: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyRelationship: 'Son',
          bloodPressure: '120/80 mmHg',
          heartRate: '72',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Camp Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-2xl border-2 border-emerald-600 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              Offline Assistance Camp & Digital Inclusivity Unit
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Community Health Worker & ASHA Kiosk
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Ensuring citizens without smartphones or digital literacy receive full MediSync emergency database protection and physical QR emergency cards.
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200">
            <p className="font-bold">Active Camp Unit:</p>
            <p className="text-[11px] text-slate-300 font-mono mt-0.5">{campLocation}</p>
            <p className="text-[10px] text-emerald-400 mt-1">Worker: {operatorName}</p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successPatient && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 shadow-sm space-y-3 animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Enrollment Complete! Emergency Profile Generated for {successPatient.fullName}</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
              ID: {successPatient.id}
            </span>
          </div>

          <p className="text-xs text-emerald-800">
            Aadhaar: XXXX-XXXX-{successPatient.aadhaarNumber.slice(-4)} | Blood: <strong>{successPatient.bloodGroup}</strong> | Next 4-Month Review: <strong>{new Date(successPatient.nextReviewDueDate).toLocaleDateString()}</strong>
          </p>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Physical QR Card for Citizen</span>
            </button>
            <button
              onClick={() => setSuccessPatient(null)}
              className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-xl"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Enrollment Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Register New Non-Smartphone Citizen
            </h3>
          </div>
          <span className="text-xs text-slate-400">Assisted Field Intake Form</span>
        </div>

        <form onSubmit={handleEnroll} className="space-y-4 text-xs">
          {/* Row 1: Name, Aadhaar, Mobile */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Citizen Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 rounded-lg border font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">12-Digit Aadhaar Number *</label>
              <input
                type="text"
                required
                maxLength={12}
                placeholder="e.g. 567812349012"
                value={formData.aadhaarNumber}
                onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                className="w-full p-2.5 rounded-lg border font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Family Mobile Number</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full p-2.5 rounded-lg border font-mono font-medium"
              />
            </div>
          </div>

          {/* Row 2: DOB, Gender, Blood Group */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full p-2 rounded-lg border"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as PatientProfile['gender'] })}
                className="w-full p-2 rounded-lg border"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Blood Group *</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as PatientProfile['bloodGroup'] })}
                className="w-full p-2 rounded-lg border font-bold"
              >
                <option value="O+">O-Positive (O+)</option>
                <option value="O-">O-Negative (O-)</option>
                <option value="A+">A-Positive (A+)</option>
                <option value="A-">A-Negative (A-)</option>
                <option value="B+">B-Positive (B+)</option>
                <option value="B-">B-Negative (B-)</option>
                <option value="AB+">AB-Positive (AB+)</option>
                <option value="AB-">AB-Negative (AB-)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Medical Conditions & Known Allergies */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Known Conditions (e.g. Asthma, High BP, Diabetes)
              </label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Chronic Asthma"
                value={formData.existingConditions}
                onChange={(e) => setFormData({ ...formData, existingConditions: e.target.value })}
                className="w-full p-2.5 rounded-lg border"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Drug / Food Allergies (e.g. Penicillin, Aspirin)
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full p-2.5 rounded-lg border text-red-700 font-bold"
              />
            </div>
          </div>

          {/* Row 4: Camp Baseline Vitals */}
          <div className="grid sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Camp BP Reading</label>
              <input
                type="text"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                className="w-full p-2 rounded-lg border font-mono font-bold bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Camp Pulse (bpm)</label>
              <input
                type="text"
                value={formData.heartRate}
                onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                className="w-full p-2 rounded-lg border font-mono font-bold bg-white"
              />
            </div>
          </div>

          {/* Row 5: Emergency Next of Kin Contact */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Emergency Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Son / Sarpanch Name"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="w-full p-2.5 rounded-lg border"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Relationship</label>
              <input
                type="text"
                placeholder="e.g. Son / Daughter"
                value={formData.emergencyRelationship}
                onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                className="w-full p-2.5 rounded-lg border"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Emergency Phone *</label>
              <input
                type="text"
                placeholder="e.g. 9123456780"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                className="w-full p-2.5 rounded-lg border font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Citizen & Generate Physical QR Card</span>
            </button>
          </div>
        </form>
      </div>

      {/* Camp Registered Citizens List */}
      {registeredList.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Enrolled Today at this Camp ({registeredList.length})
          </h4>
          <div className="grid gap-2 text-xs">
            {registeredList.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{p.fullName}</span>
                  <span className="text-slate-500 ml-2">Aadhaar: XXXX-XXXX-{p.aadhaarNumber.slice(-4)}</span>
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {p.bloodGroup}
                  </span>
                </div>
                <span className="text-slate-400 font-mono">{p.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
