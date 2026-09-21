'use client';

import React, { useState, useEffect } from 'react';
import {
  PatientProfile,
  DiagnosticRecord,
  PrescriptionDoc,
  SurgicalRecord,
  Allergy,
  VitalSigns,
  VitalLogEntry,
} from '@/lib/types';
import { saveHospitalPatient } from '@/lib/mockDatabase';
import {
  X,
  Edit3,
  Trash2,
  Save,
  Activity,
  Stethoscope,
  Scissors,
  Heart,
  AlertTriangle,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export type EditModalType = 'diagnostic' | 'prescription' | 'surgical' | 'vitals' | 'allergies';

interface HospitalEditRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordType: EditModalType;
  patient: PatientProfile;
  recordData?: any; // DiagnosticRecord | PrescriptionDoc | SurgicalRecord
  onSave: (updatedPatient: PatientProfile) => void;
  hospitalStaffName?: string;
}

export function HospitalEditRecordModal({
  isOpen,
  onClose,
  recordType,
  patient,
  recordData,
  onSave,
  hospitalStaffName = 'Dr. Vivek Mehra (ER Trauma Lead)',
}: HospitalEditRecordModalProps) {
  // Diagnostic State
  const [diagTestName, setDiagTestName] = useState('');
  const [diagValue, setDiagValue] = useState('');
  const [diagUnit, setDiagUnit] = useState('');
  const [diagRange, setDiagRange] = useState('');
  const [diagStatus, setDiagStatus] = useState<'NORMAL' | 'ELEVATED' | 'LOW' | 'CRITICAL'>('NORMAL');
  const [diagLabName, setDiagLabName] = useState('');
  const [diagNote, setDiagNote] = useState('');

  // Prescription State
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDose, setRxDose] = useState('');
  const [rxFreq, setRxFreq] = useState('');
  const [rxDoctor, setRxDoctor] = useState('');
  const [rxClinic, setRxClinic] = useState('');
  const [rxNote, setRxNote] = useState('');

  // Surgical State
  const [surgProcedure, setSurgProcedure] = useState('');
  const [surgDate, setSurgDate] = useState('');
  const [surgSurgeon, setSurgSurgeon] = useState('');
  const [surgHospital, setSurgHospital] = useState('');
  const [surgImplants, setSurgImplants] = useState('');
  const [surgNote, setSurgNote] = useState('');

  // Vitals State
  const [vitalsHr, setVitalsHr] = useState<number | string>(72);
  const [vitalsBp, setVitalsBp] = useState('120/80 mmHg');
  const [vitalsSpo2, setVitalsSpo2] = useState<number | string>(98);
  const [vitalsBloodSugar, setVitalsBloodSugar] = useState('100 mg/dL');
  const [vitalsTemp, setVitalsTemp] = useState('98.6 °F');
  const [vitalsNote, setVitalsNote] = useState('');

  // Allergies State
  const [allergiesList, setAllergiesList] = useState<Allergy[]>([]);
  const [newAllergen, setNewAllergen] = useState('');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'MODERATE' | 'MILD'>('MODERATE');
  const [newReaction, setNewReaction] = useState('');

  const [statusMsg, setStatusMsg] = useState('');

  // Prepopulate state whenever modal opens or props change
  useEffect(() => {
    if (!isOpen) return;
    setStatusMsg('');

    if (recordType === 'diagnostic' && recordData) {
      setDiagTestName(recordData.testName || '');
      setDiagValue(recordData.value || '');
      setDiagUnit(recordData.unit || '');
      setDiagRange(recordData.referenceRange || '');
      setDiagStatus(recordData.status || 'NORMAL');
      setDiagLabName(recordData.laboratoryName || '');
      setDiagNote(recordData.specialNote || '');
    } else if (recordType === 'prescription' && recordData) {
      setRxMedicine(recordData.medicationName || '');
      setRxDose(recordData.dosage || '');
      setRxFreq(recordData.frequency || '');
      setRxDoctor(recordData.prescribedBy || hospitalStaffName);
      setRxClinic(recordData.hospitalOrClinic || 'SMS Medical College Hospital');
      setRxNote(recordData.notes || '');
    } else if (recordType === 'surgical' && recordData) {
      setSurgProcedure(recordData.procedureName || '');
      setSurgDate(recordData.surgeryDate || '');
      setSurgSurgeon(recordData.operatingSurgeon || hospitalStaffName);
      setSurgHospital(recordData.hospitalOfSurgery || 'SMS Medical College Hospital');
      setSurgImplants(recordData.implantsUsed || '');
      setSurgNote(recordData.specialNote || '');
    } else if (recordType === 'vitals') {
      setVitalsHr(patient.vitals?.heartRate || 72);
      setVitalsBp(patient.vitals?.bloodPressure || '120/80 mmHg');
      setVitalsSpo2(patient.vitals?.spO2 || 98);
      setVitalsBloodSugar(patient.vitals?.bloodSugar || '100 mg/dL');
      setVitalsTemp(patient.vitals?.temperature || '98.6 °F');
      setVitalsNote('');
    } else if (recordType === 'allergies') {
      setAllergiesList(patient.allergies ? [...patient.allergies] : []);
      setNewAllergen('');
      setNewReaction('');
    }
  }, [isOpen, recordType, recordData, patient, hospitalStaffName]);

  if (!isOpen) return null;

  const now = new Date().toISOString();

  // Save Diagnostics Update
  const handleSaveDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagTestName.trim() || !diagValue.trim()) return;

    let updatedDiagnostics = [...(patient.diagnostics || [])];
    if (recordData?.id) {
      // Edit existing
      updatedDiagnostics = updatedDiagnostics.map((d) =>
        d.id === recordData.id
          ? {
              ...d,
              testName: diagTestName.trim(),
              value: diagValue.trim(),
              unit: diagUnit.trim(),
              referenceRange: diagRange.trim() || 'Normal',
              status: diagStatus,
              laboratoryName: diagLabName.trim() || 'Hospital Central Lab',
              specialNote: diagNote.trim(),
            }
          : d
      );
    } else {
      // Add new
      const newD: DiagnosticRecord = {
        id: `diag-${Date.now()}`,
        testName: diagTestName.trim(),
        value: diagValue.trim(),
        unit: diagUnit.trim(),
        referenceRange: diagRange.trim() || 'Normal',
        status: diagStatus,
        laboratoryName: diagLabName.trim() || 'Hospital Central Lab',
        dateRecorded: now.slice(0, 10),
        specialNote: diagNote.trim(),
      };
      updatedDiagnostics.unshift(newD);
    }

    const updatedPatient: PatientProfile = {
      ...patient,
      diagnostics: updatedDiagnostics,
      lastProfileUpdate: now,
      lastUpdatedBy: hospitalStaffName,
    };

    saveHospitalPatient(updatedPatient);
    onSave(updatedPatient);
    setStatusMsg('✓ Diagnostic record updated & synced with hospital sub-database');
    setTimeout(() => onClose(), 800);
  };

  // Delete Diagnostic Record
  const handleDeleteDiagnostic = () => {
    if (!recordData?.id) return;
    const updatedPatient: PatientProfile = {
      ...patient,
      diagnostics: (patient.diagnostics || []).filter((d) => d.id !== recordData.id),
      lastProfileUpdate: now,
      lastUpdatedBy: hospitalStaffName,
    };
    saveHospitalPatient(updatedPatient);
    onSave(updatedPatient);
    onClose();
  };

  // Save Prescription Update
  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedicine.trim() || !rxDose.trim()) return;

    let updatedPrescriptions = [...patient.prescriptions];
    if (recordData?.id) {
      // Edit existing
      updatedPrescriptions = updatedPrescriptions.map((rx) =>
        rx.id === recordData.id
          ? {
              ...rx,
              medicationName: rxMedicine.trim(),
              dosage: rxDose.trim(),
              frequency: rxFreq.trim() || 'Once Daily',
              prescribedBy: rxDoctor.trim() || hospitalStaffName,
              hospitalOrClinic: rxClinic.trim() || 'SMS Medical College Hospital',
              notes: rxNote.trim(),
            }
          : rx
      );
    } else {
      // Add new
      const newRx: PrescriptionDoc = {
        id: `rx-${Date.now()}`,
        medicationName: rxMedicine.trim(),
        dosage: rxDose.trim(),
        frequency: rxFreq.trim() || 'Once Daily',
        prescribedBy: rxDoctor.trim() || hospitalStaffName,
        hospitalOrClinic: rxClinic.trim() || 'SMS Medical College Hospital',
        datePrescribed: now.slice(0, 10),
        notes: rxNote.trim(),
      };
      updatedPrescriptions.unshift(newRx);
    }

    const updatedPatient: PatientProfile = {
      ...patient,
      prescriptions: updatedPrescriptions,
      lastProfileUpdate: now,
      lastUpdatedBy: hospitalStaffName,
    };

    saveHospitalPatient(updatedPatient);
    onSave(updatedPatient);
    setStatusMsg('✓ Prescription updated & synced with hospital sub-database');
    setTimeout(() => onClose(), 800);
  };

  // Delete Prescription
  const handleDeletePrescription = () => {
    if (!recordData?.id) return;
    const updatedPatient: PatientProfile = {
      ...patient,
      prescriptions: patient.prescriptions.filter((rx) => rx.id !== recordData.id),
      lastProfileUpdate: now,
      lastUpdatedBy: hospitalStaffName,
    };
    saveHospitalPatient(updatedPatient);
    onSave(updatedPatient);
    onClose();
  };

  // Save Surgical Update
  const handleSaveSurgical = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surgProcedure.trim()) return;

    let updatedSurgical = [...(patient.surgicalLogs || [])];
    if (recordData?.id) {
      // Edit existing
      updatedSurgical = updatedSurgical.map((s) =>
        s.id === recordData.id
          ? {
              ...s,
              procedureName: surgProcedure.trim(),
              surgeryDate: surgDate || s.surgeryDate,
              operatingSurgeon: surgSurgeon.trim() || hospitalStaffName,
              hospitalOfSurgery: surgHospital.trim() || 'SMS Medical College Hospital',
              implantsUsed: surgImplants.trim() || undefined,
              specialNote: surgNote.trim(),
            }
          : s
      );
    } else {
      // Add new
      const newS: SurgicalRecord = {
        id: `surg-${Date.now()}`,
        procedureName: surgProcedure.trim(),
        surgeryDate: surgDate || now.slice(0, 10),
        operatingSurgeon: surgSurgeon.trim() || hospitalStaffName,
        hospitalOfSurgery: surgHospital.trim() || 'SMS Medical College Hospital',
        implantsUsed: surgImplants.trim() || undefined,
        specialNote: surgNote.trim(),
      };
      updatedSurgical.unshift(newS);
    }

    const updatedPatient: PatientProfile = {
      ...patient,
      surgicalLogs: updatedSurgical,
      lastProfileUpdate: now,
      lastUpdatedBy: hospitalStaffName,
    };

    saveHospitalPatient(updatedPatient);
    onSave(updatedPatient);
    setStatusMsg('✓ Surgical procedure log updated & synced');
    setTimeout(() => onClose(), 800);
  };

  // Delete Surgical Log
  const handleDeleteSurgical = () => {
    if (!recordData?.id) return;
    const updatedPatient: PatientProfile = {
      ...patient,
      surgicalLogs: (patient.surgicalLogs || []).filter((s) => s.id !== recordData.id),
      lastProfileUpdate: now,
      lastUpdatedBy: hospitalStaffName,
    };
    saveHospitalPatient(updatedPatient);
    onSave(updatedPatient);
    onClose();
  };

  // Save Vitals Update
  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedBp = vitalsBp.includes('mmHg') ? vitalsBp : `${vitalsBp} mmHg`;

    const newLog: VitalLogEntry = {
      id: `vh-${Date.now()}`,
      timestamp: now,
      recordedBy: hospitalStaffName,
      heartRate: Number(vitalsHr) || 72,
      bloodPressure: formattedBp,
      spO2: Number(vitalsSpo2) || 98,
      bloodSugar: vitalsBloodSugar ? (vitalsBloodSugar.includes('mg/dL') ? vitalsBloodSugar : `${vitalsBloodSugar} mg/dL`) : undefined,
      temperature: vitalsTemp,
      notes: vitalsNote.trim() || 'Hospital clinical monitoring evaluation.',
    };

    const updatedPatient: PatientProfile = {
      ...patient,
      vitals: {
        bloodPressure: formattedBp,
        heartRate: Number(vitalsHr) || 72,
        spO2: Number(vitalsSpo2) || 98,
        bloodSugar: vitalsBloodSugar ? (vitalsBloodSugar.includes('mg/dL') ? vitalsBloodSugar : `${vitalsBloodSugar} mg/dL`) : undefined,
        temperature: vitalsTemp,
        lastRecorded: now,
      },
      vitalsHistory: [newLog, ...(patient.vitalsHistory || [])],
      lastProfileUpdate: now,
      lastUpdatedBy: hospitalStaffName,
    };

    saveHospitalPatient(updatedPatient);
    onSave(updatedPatient);
    setStatusMsg('✓ Baseline vitals updated & logged to chronological history');
    setTimeout(() => onClose(), 800);
  };

  // Save Allergies Update
  const handleSaveAllergies = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPatient: PatientProfile = {
      ...patient,
      allergies: allergiesList,
      lastProfileUpdate: now,
      lastUpdatedBy: hospitalStaffName,
    };

    saveHospitalPatient(updatedPatient);
    onSave(updatedPatient);
    setStatusMsg('✓ Allergies list updated & emergency badges synced');
    setTimeout(() => onClose(), 800);
  };

  const handleAddAllergy = () => {
    if (!newAllergen.trim()) return;
    setAllergiesList((prev) => [
      ...prev,
      {
        allergen: newAllergen.trim().toUpperCase(),
        severity: newSeverity,
        reaction: newReaction.trim() || 'Severe allergic reaction',
      },
    ]);
    setNewAllergen('');
    setNewReaction('');
  };

  const handleRemoveAllergy = (idx: number) => {
    setAllergiesList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Input & Label classes with mobile-safe text sizes
  const inputClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/15 outline-none font-body transition-all shadow-xs';
  const labelClass = 'block text-[13px] sm:text-sm font-display font-semibold text-slate-700 mb-1.5';
  const selectClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-800 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/15 outline-none cursor-pointer font-body transition-all shadow-xs';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
              {recordType === 'diagnostic' && <Activity className="w-5 h-5" />}
              {recordType === 'prescription' && <Stethoscope className="w-5 h-5" />}
              {recordType === 'surgical' && <Scissors className="w-5 h-5" />}
              {recordType === 'vitals' && <Heart className="w-5 h-5" />}
              {recordType === 'allergies' && <AlertTriangle className="w-5 h-5 text-amber-300" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 leading-tight">
                {recordType === 'diagnostic' && (recordData ? 'Edit Diagnostic Report' : 'Add Diagnostic Report')}
                {recordType === 'prescription' && (recordData ? 'Edit Prescription Record' : 'Add Prescription')}
                {recordType === 'surgical' && (recordData ? 'Edit Surgical Procedure' : 'Add Surgical Log')}
                {recordType === 'vitals' && 'Edit Baseline Vitals & Log History'}
                {recordType === 'allergies' && 'Edit Patient Allergies'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Patient: <span className="font-bold text-cyan-700">{patient.fullName}</span> ({patient.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* ── 1. DIAGNOSTICS FORM ── */}
          {recordType === 'diagnostic' && (
            <form onSubmit={handleSaveDiagnostic} className="space-y-4">
              <div>
                <label className={labelClass}>Diagnostic Test Name *</label>
                <input
                  type="text"
                  required
                  value={diagTestName}
                  onChange={(e) => setDiagTestName(e.target.value)}
                  placeholder="e.g. Troponin-I / Serum Creatinine"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Observed Value *</label>
                  <input
                    type="text"
                    required
                    value={diagValue}
                    onChange={(e) => setDiagValue(e.target.value)}
                    placeholder="e.g. 0.08"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Unit of Measurement</label>
                  <input
                    type="text"
                    value={diagUnit}
                    onChange={(e) => setDiagUnit(e.target.value)}
                    placeholder="e.g. ng/mL"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Reference Normal Range</label>
                  <input
                    type="text"
                    value={diagRange}
                    onChange={(e) => setDiagRange(e.target.value)}
                    placeholder="e.g. < 0.04 ng/mL"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Severity Classification</label>
                  <select
                    value={diagStatus}
                    onChange={(e) => setDiagStatus(e.target.value as any)}
                    className={selectClass}
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="ELEVATED">ELEVATED</option>
                    <option value="LOW">LOW</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Laboratory Name</label>
                <input
                  type="text"
                  value={diagLabName}
                  onChange={(e) => setDiagLabName(e.target.value)}
                  placeholder="e.g. SMS Hospital Biochemistry Central Lab"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Clinical Notes / Interpretation</label>
                <textarea
                  value={diagNote}
                  onChange={(e) => setDiagNote(e.target.value)}
                  rows={2}
                  placeholder="Pathology remarks, serial testing recommendations..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-800 outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {recordData?.id ? (
                  <button
                    type="button"
                    onClick={handleDeleteDiagnostic}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Record</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold shadow-md shadow-cyan-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── 2. PRESCRIPTIONS FORM ── */}
          {recordType === 'prescription' && (
            <form onSubmit={handleSavePrescription} className="space-y-4">
              <div>
                <label className={labelClass}>Medication Name *</label>
                <input
                  type="text"
                  required
                  value={rxMedicine}
                  onChange={(e) => setRxMedicine(e.target.value)}
                  placeholder="e.g. Clopidogrel 75mg"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Dosage *</label>
                  <input
                    type="text"
                    required
                    value={rxDose}
                    onChange={(e) => setRxDose(e.target.value)}
                    placeholder="e.g. 1 Tablet"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Frequency / Timing</label>
                  <input
                    type="text"
                    value={rxFreq}
                    onChange={(e) => setRxFreq(e.target.value)}
                    placeholder="e.g. Once Daily After Dinner"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Prescribing Physician</label>
                  <input
                    type="text"
                    value={rxDoctor}
                    onChange={(e) => setRxDoctor(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hospital or Clinic</label>
                  <input
                    type="text"
                    value={rxClinic}
                    onChange={(e) => setRxClinic(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Special Instructions / Warnings</label>
                <textarea
                  value={rxNote}
                  onChange={(e) => setRxNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Take with plenty of water. Report any unusual bleeding immediately."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-800 outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {recordData?.id ? (
                  <button
                    type="button"
                    onClick={handleDeletePrescription}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Record</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold shadow-md shadow-cyan-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── 3. SURGICAL LOGS FORM ── */}
          {recordType === 'surgical' && (
            <form onSubmit={handleSaveSurgical} className="space-y-4">
              <div>
                <label className={labelClass}>Procedure Name *</label>
                <input
                  type="text"
                  required
                  value={surgProcedure}
                  onChange={(e) => setSurgProcedure(e.target.value)}
                  placeholder="e.g. Percutaneous Coronary Intervention (PCI)"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Surgery Date</label>
                  <input
                    type="date"
                    value={surgDate}
                    onChange={(e) => setSurgDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Implants / Stents Used</label>
                  <input
                    type="text"
                    value={surgImplants}
                    onChange={(e) => setSurgImplants(e.target.value)}
                    placeholder="e.g. Drug-Eluting Stent (LAD)"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Operating Surgeon</label>
                  <input
                    type="text"
                    value={surgSurgeon}
                    onChange={(e) => setSurgSurgeon(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hospital of Surgery</label>
                  <input
                    type="text"
                    value={surgHospital}
                    onChange={(e) => setSurgHospital(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Operative Notes / Complications</label>
                <textarea
                  value={surgNote}
                  onChange={(e) => setSurgNote(e.target.value)}
                  rows={2}
                  placeholder="Post-operative course, implant serial numbers, recovery notes..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-800 outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {recordData?.id ? (
                  <button
                    type="button"
                    onClick={handleDeleteSurgical}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Record</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold shadow-md shadow-cyan-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── 4. VITALS FORM ── */}
          {recordType === 'vitals' && (
            <form onSubmit={handleSaveVitals} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Heart Rate (bpm) *</label>
                  <input
                    type="number"
                    required
                    value={vitalsHr}
                    onChange={(e) => setVitalsHr(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Blood Pressure *</label>
                  <input
                    type="text"
                    required
                    value={vitalsBp}
                    onChange={(e) => setVitalsBp(e.target.value)}
                    placeholder="e.g. 120/80 mmHg"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>SpO2 Oxygen (%) *</label>
                  <input
                    type="number"
                    required
                    value={vitalsSpo2}
                    onChange={(e) => setVitalsSpo2(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Blood Sugar</label>
                  <input
                    type="text"
                    value={vitalsBloodSugar}
                    onChange={(e) => setVitalsBloodSugar(e.target.value)}
                    placeholder="e.g. 110 mg/dL"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Temperature</label>
                  <input
                    type="text"
                    value={vitalsTemp}
                    onChange={(e) => setVitalsTemp(e.target.value)}
                    placeholder="e.g. 98.6 °F"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Triage Notes for Vitals Update</label>
                <textarea
                  value={vitalsNote}
                  onChange={(e) => setVitalsNote(e.target.value)}
                  rows={2}
                  placeholder="Reason for vital signs adjustment, current patient posture..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-800 outline-none focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold shadow-md shadow-cyan-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Vitals</span>
                </button>
              </div>
            </form>
          )}

          {/* ── 5. ALLERGIES FORM ── */}
          {recordType === 'allergies' && (
            <form onSubmit={handleSaveAllergies} className="space-y-4">
              {/* Existing Allergies List */}
              <div>
                <label className={labelClass}>Current Recorded Allergies ({allergiesList.length})</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {allergiesList.length > 0 ? (
                    allergiesList.map((a, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-display font-bold text-slate-900">{a.allergen}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                                a.severity === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : a.severity === 'MODERATE'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {a.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{a.reaction}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAllergy(i)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 py-3 text-center">No recorded allergies</p>
                  )}
                </div>
              </div>

              {/* Add New Allergy Sub-section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-display font-bold text-slate-700 uppercase tracking-wider block">
                  + Add New Allergy
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    placeholder="Allergen (e.g. SULFA DRUGS)"
                    className={inputClass}
                  />
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className={selectClass}
                  >
                    <option value="CRITICAL">CRITICAL (Life-Threatening)</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="MILD">MILD</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReaction}
                    onChange={(e) => setNewReaction(e.target.value)}
                    placeholder="Reaction (e.g. Anaphylaxis, bronchospasm)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={handleAddAllergy}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shrink-0 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold shadow-md shadow-cyan-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Allergies</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
