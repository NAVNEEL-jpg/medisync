'use client';

import React, { useState } from 'react';
import { PatientProfile, Allergy, VitalSigns } from '@/lib/types';
import { generateHospitalPatientId, saveHospitalPatient } from '@/lib/mockDatabase';
import { PatientQRCode } from '@/components/PatientQRCode';
import {
  X,
  UserPlus,
  Shield,
  Heart,
  Activity,
  AlertTriangle,
  Upload,
  FileText,
  Check,
  QrCode,
  Sparkles,
  Trash2,
  Calendar,
  Building,
  ArrowRight,
} from 'lucide-react';

interface HospitalEnrollPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalName: string;
  onPatientEnrolled: (patient: PatientProfile) => void;
}

export function HospitalEnrollPatientModal({
  isOpen,
  onClose,
  hospitalName,
  onPatientEnrolled,
}: HospitalEnrollPatientModalProps) {
  // Step state: 'form' | 'success'
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [enrolledPatient, setEnrolledPatient] = useState<PatientProfile | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [dob, setDob] = useState('1990-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [address, setAddress] = useState('');

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Spouse / Family');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Baseline Vitals
  const [heartRate, setHeartRate] = useState('72');
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [spo2, setSpo2] = useState('98');
  const [bloodSugar, setBloodSugar] = useState('100');

  // Allergies & Conditions
  const [allergyInput, setAllergyInput] = useState('');
  const [allergiesList, setAllergiesList] = useState<Allergy[]>([
    { allergen: 'PENICILLIN & BETA-LACTAMS', severity: 'CRITICAL', reaction: 'Severe respiratory distress' },
  ]);
  const [conditionsInput, setConditionsInput] = useState('');
  const [conditionsList, setConditionsList] = useState<string[]>(['None (Healthy)']);

  // Document attachments
  const [documents, setDocuments] = useState<
    { id: string; name: string; type: string; date: string; size?: string }[]
  >([]);
  const [docNameInput, setDocNameInput] = useState('');
  const [docTypeInput, setDocTypeInput] = useState('Lab Report');

  if (!isOpen) return null;

  const handleAddAllergy = () => {
    if (!allergyInput.trim()) return;
    setAllergiesList((prev) => [
      ...prev,
      {
        allergen: allergyInput.trim().toUpperCase(),
        severity: 'CRITICAL',
        reaction: 'Severe reaction / triage alert',
      },
    ]);
    setAllergyInput('');
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergiesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCondition = () => {
    if (!conditionsInput.trim()) return;
    setConditionsList((prev) => [
      ...prev.filter((c) => c !== 'None (Healthy)'),
      conditionsInput.trim(),
    ]);
    setConditionsInput('');
  };

  const handleAddDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: docNameInput.trim() || file.name,
      type: docTypeInput,
      date: new Date().toISOString().slice(0, 10),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    };
    setDocuments((prev) => [...prev, newDoc]);
    setDocNameInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !aadhaar.trim()) return;

    // Generate individual unique ID: e.g. MS-IND-DQ1Q1
    const generatedId = generateHospitalPatientId();
    const now = new Date().toISOString();

    const newPatient: PatientProfile = {
      id: generatedId,
      fullName: fullName.trim(),
      aadhaarNumber: aadhaar.trim(),
      mobileNumber: phone.trim(),
      email: email.trim() || undefined,
      abhaId: abhaId.trim() || undefined,
      dob: dob || '1990-01-01',
      gender,
      bloodGroup,
      address: address.trim() || 'Address on record',
      city: 'Metro Ward',
      state: 'National Capital',
      existingConditions: conditionsList.filter((c) => c !== 'None (Healthy)'),
      pastDiseases: [],
      surgeriesAndImplants: [],
      allergies: allergiesList,
      vitals: {
        heartRate: Number(heartRate) || 72,
        bloodPressure: bloodPressure.includes('mmHg') ? bloodPressure : `${bloodPressure} mmHg`,
        spO2: Number(spo2) || 98,
        bloodSugar: bloodSugar ? `${bloodSugar} mg/dL` : undefined,
        lastRecorded: now,
      },
      prescriptions: [],
      emergencyContacts: emergencyPhone.trim()
        ? [
            {
              id: 'ec-1',
              name: emergencyName.trim() || 'Primary Contact',
              relationship: emergencyRel,
              phone: emergencyPhone.trim(),
              isPrimary: true,
            },
          ]
        : [
            {
              id: 'ec-1',
              name: `${fullName} (Self)`,
              relationship: 'Self',
              phone: phone.trim(),
              isPrimary: true,
            },
          ],
      nominees: [],
      organDonor: true,
      dnrStatus: false,
      documents,
      enrolledByHospital: hospitalName,
      enrolledAt: now,
      lastProfileUpdate: now,
      lastUpdatedBy: `${hospitalName} (Hospital Registration Desk)`,
      vitalsHistory: [
        {
          id: `vh-${Date.now()}`,
          timestamp: now,
          recordedBy: `${hospitalName} Intake Triage`,
          heartRate: Number(heartRate) || 72,
          bloodPressure: bloodPressure.includes('mmHg') ? bloodPressure : `${bloodPressure} mmHg`,
          spO2: Number(spo2) || 98,
          bloodSugar: bloodSugar ? `${bloodSugar} mg/dL` : undefined,
          notes: 'Baseline measurements recorded during hospital intake admission.',
        },
      ],
      nextReviewDueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      isRegisteredAtOfflineCamp: false,
      accessLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: now,
          accessorName: `${hospitalName} Registration Node`,
          accessorRole: 'EMERGENCY_DOCTOR',
          hospitalOrLocation: hospitalName,
          accessType: 'BREAK_GLASS_OVERRIDE',
          reason: 'Manual patient admission and emergency vault enrollment',
        },
      ],
    };

    // Save to hospital persistent sub-database
    saveHospitalPatient(newPatient);
    setEnrolledPatient(newPatient);
    onPatientEnrolled(newPatient);
    setStep('success');
  };

  const inputClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-800 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/15 outline-none font-body transition-all shadow-xs';
  const labelClass = 'block text-[13px] sm:text-sm font-display font-semibold text-slate-700 mb-1';
  const selectClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-800 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/15 outline-none cursor-pointer font-body transition-all shadow-xs';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[94vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="p-4 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900 leading-tight">
                Hospital Patient Admission &amp; Vault Enrollment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enrolling into node: <span className="font-semibold text-slate-700">{hospitalName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Section 1: Demographics & Identity */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>1. Patient Identification &amp; Demographics</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Full Legal Name *</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Navneel Dutta / Priya Sharma"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Blood Group *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className={selectClass}
                  >
                    <option value="O+">O+ (Universal RBC)</option>
                    <option value="O-">O- (Emergency Universal)</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className={labelClass}>Phone Number (+91) *</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. patient@gmail.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className={selectClass}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className={labelClass}>12-Digit Aadhaar Number *</label>
                  <input
                    required
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="e.g. 5821 4910 2948"
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div>
                  <label className={labelClass}>ABHA ID (Optional / ABDM)</label>
                  <input
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    placeholder="e.g. 91-8821-3940-1928"
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Residential Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Sector 62, Noida, Uttar Pradesh"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Section 2: Baseline Vitals */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                <span>2. Baseline Triage Vitals</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="72"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Blood Pressure</label>
                  <input
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="120/80"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Oxygen SpO2 (%)</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    placeholder="98"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Blood Sugar (mg/dL)</label>
                  <input
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    placeholder="100"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Critical Allergies & Conditions */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>3. Critical Drug &amp; Food Allergies</span>
              </h4>

              <div className="flex gap-2">
                <input
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAllergy(); } }}
                  placeholder="e.g. Penicillin, Sulfa, Aspirin, Latex..."
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {allergiesList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {allergiesList.map((a, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs font-bold font-mono bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-1.5"
                    >
                      {a.allergen}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(idx)}
                        className="hover:text-rose-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: Document Attachments */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>4. Attach Patient Medical Documents &amp; Identity Proofs</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <input
                    value={docNameInput}
                    onChange={(e) => setDocNameInput(e.target.value)}
                    placeholder="Document Label (e.g. Lab Report)"
                    className={`${inputClass} text-xs`}
                  />
                </div>
                <div>
                  <select
                    value={docTypeInput}
                    onChange={(e) => setDocTypeInput(e.target.value)}
                    className={`${selectClass} text-xs`}
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Aadhaar Card Copy">Aadhaar Card Copy</option>
                    <option value="Insurance Policy">Insurance Policy</option>
                    <option value="Prescription Slip">Prescription Slip</option>
                  </select>
                </div>
                <label className="h-11 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold font-display flex items-center justify-center gap-2 cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>Choose File (PDF/IMG)</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleAddDocument}
                    className="hidden"
                  />
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {documents.map((d, idx) => (
                    <div
                      key={d.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="font-bold text-slate-800">{d.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-mono">
                          {d.type}
                        </span>
                        {d.size && <span className="text-[11px] text-slate-400">({d.size})</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDocuments((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-display font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-sm font-display font-bold shadow-md shadow-cyan-600/20 transition cursor-pointer flex items-center gap-2 press-scale"
              >
                <Check className="w-4 h-4" />
                <span>Enroll Patient into Hospital Vault</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ENROLLMENT SUCCESS & QR REVEAL */}
        {step === 'success' && enrolledPatient && (
          <div className="p-6 sm:p-8 space-y-6 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-scaleUp">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Hospital Enrollment Complete
              </span>
              <h3 className="text-2xl font-display font-black text-slate-900 mt-2">
                {enrolledPatient.fullName}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Assigned National Decentralized Medical ID:
              </p>
              <div className="inline-block mt-2 px-4 py-1.5 rounded-xl bg-slate-900 text-cyan-300 font-mono font-black text-lg shadow-sm border border-slate-700">
                ID: {enrolledPatient.id}
              </div>
            </div>

            {/* Generated QR code preview */}
            <div className="flex flex-col items-center justify-center">
              <PatientQRCode
                patient={enrolledPatient}
                patientId={enrolledPatient.id}
                patientName={enrolledPatient.fullName}
                bloodGroup={enrolledPatient.bloodGroup}
                mobileNumber={enrolledPatient.mobileNumber}
                size={210}
                showActions={true}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setAadhaar('');
                  setAbhaId('');
                  setDocuments([]);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-display font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                + Enroll Another Patient
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-display font-bold shadow-md shadow-cyan-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Done &amp; Return to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
