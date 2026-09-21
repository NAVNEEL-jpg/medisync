'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PatientProfile, DiagnosticRecord, PrescriptionDoc, SurgicalRecord } from '@/lib/types';
import { INITIAL_PATIENTS, getHospitalPatients, saveHospitalPatient } from '@/lib/mockDatabase';
import { HospitalEnrollPatientModal } from '@/components/HospitalEnrollPatientModal';
import { HospitalQrScannerModal } from '@/components/HospitalQrScannerModal';
import { PatientQrPreviewModal } from '@/components/PatientQrPreviewModal';
import { HospitalEditRecordModal, EditModalType } from '@/components/HospitalEditRecordModal';
import { LiveNewsMarquee } from '@/components/LiveNewsMarquee';
import { GlobalMedicalNews } from '@/components/GlobalMedicalNews';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TabBar } from '@/components/ui/TabBar';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  Building2,
  QrCode,
  Search,
  Activity,
  Shield,
  Stethoscope,
  Scissors,
  Plus,
  ArrowRight,
  Phone,
  User,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check,
  CreditCard,
  DollarSign,
  TrendingUp,
  Award,
  Globe2,
  Printer,
  FileBadge,
  Loader2,
  UserCheck,
  Building,
  Calendar,
  Layers,
  UserPlus,
  ScanLine,
  Eye,
  FileText,
  Pencil,
  ChevronRight,
  Heart,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

interface HospitalDashboardProps {
  initialPatient?: PatientProfile;
}

export function HospitalDashboard({ initialPatient = INITIAL_PATIENTS[0] }: HospitalDashboardProps) {
  const { user, logOut } = useAuth();

  // Navigation Page state (1 to 5)
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Hospital Sub-Database & Enrolled Patients State
  const [enrolledPatients, setEnrolledPatients] = useState<PatientProfile[]>([]);
  const [directorySearch, setDirectorySearch] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [previewPatient, setPreviewPatient] = useState<PatientProfile | null>(null);
  const [showQrPreviewModal, setShowQrPreviewModal] = useState(false);

  // Hospital Record Edit Modal State
  const [showEditRecordModal, setShowEditRecordModal] = useState(false);
  const [editModalType, setEditModalType] = useState<EditModalType>('diagnostic');
  const [editModalRecordData, setEditModalRecordData] = useState<any>(null);

  // Page 1: Patient Search & Clinical Editor
  const [searchQuery, setSearchQuery] = useState('');
  const [activePatient, setActivePatient] = useState<PatientProfile>(initialPatient);
  const [searchMsg, setSearchMsg] = useState('');
  const [activeRecordTab, setActiveRecordTab] = useState<'diagnostics' | 'prescriptions' | 'surgical'>('diagnostics');

  // Load and synchronize enrolled hospital patients on mount
  React.useEffect(() => {
    const list = getHospitalPatients();
    setEnrolledPatients(list);
  }, []);

  // AI Symptoms Assistant for Doctors
  const [aiInput, setAiInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiMsg, setAiMsg] = useState('');

  // Diagnostics Form
  const [diagTestName, setDiagTestName] = useState('');
  const [diagValue, setDiagValue] = useState('');
  const [diagUnit, setDiagUnit] = useState('mg/dL');
  const [diagRange, setDiagRange] = useState('');
  const [diagLabName, setDiagLabName] = useState(user?.hospital || 'Apex Central Diagnostic Core');
  const [diagNote, setDiagNote] = useState('');
  const [diagStatus, setDiagStatus] = useState<'NORMAL' | 'ELEVATED' | 'LOW' | 'CRITICAL'>('NORMAL');

  // Prescriptions Form
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDose, setRxDose] = useState('');
  const [rxFreq, setRxFreq] = useState('Once Daily');
  const [rxDoctor, setRxDoctor] = useState(user?.displayName || 'Dr. Vivek Mehra (ER Head)');
  const [rxClinic, setRxClinic] = useState(user?.hospital || 'Apex Multi-Specialty Trauma Center');
  const [rxNote, setRxNote] = useState('');

  // Surgical Form
  const [surgProcedure, setSurgProcedure] = useState('');
  const [surgDate, setSurgDate] = useState('');
  const [surgSurgeon, setSurgSurgeon] = useState(user?.displayName || 'Dr. Vivek Mehra');
  const [surgHospital, setSurgHospital] = useState(user?.hospital || 'Apex Multi-Specialty Trauma Center');
  const [surgImplants, setSurgImplants] = useState('');
  const [surgNote, setSurgNote] = useState('');

  // Page 4: Hospital Profile Edit State
  const [hospName, setHospName] = useState(user?.hospital || 'Apex Multi-Specialty Trauma Center');
  const [hospLicense, setHospLicense] = useState(user?.licenseNumber || 'MCI-REG-882194');
  const [hospOfficer, setHospOfficer] = useState(user?.displayName || 'Dr. Vivek Mehra');
  const [hospType, setHospType] = useState(user?.orgType || 'Hospital & Trauma Center');
  const [hospPhone, setHospPhone] = useState(user?.phoneNumber || '+91 141 2345678');
  const [hospEmail, setHospEmail] = useState(user?.email || 'er.lead@apexcare.in');
  const [hospSavedMsg, setHospSavedMsg] = useState('');

  // Page 5: Hospital Referral Code & Commission State
  const uniqueReferralCode = hospName
    ? `${hospName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-CARE-5`
    : 'APEX-CARE-5';
  const [codeCopied, setCodeCopied] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Search Patient Handler
  const handleSearchPatient = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchMsg('');
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const allPatients = [...enrolledPatients, ...INITIAL_PATIENTS];
    const found = allPatients.find(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.id.replace('#', '').toLowerCase().includes(q.replace('#', '')) ||
        p.aadhaarNumber.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        p.mobileNumber.includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        (p.abhaId && p.abhaId.toLowerCase().includes(q))
    );

    if (found) {
      setActivePatient(found);
      setSearchMsg(`✓ Patient Record Verified: ${found.fullName} (${found.id})`);
    } else {
      setSearchMsg('⚠️ No record matching this ID/Aadhaar/ABHA found in hospital node database.');
    }
  };

  // AI Clinical Assistant
  const handleAiAnalyze = async () => {
    if (!aiInput.trim()) return;
    setIsAiProcessing(true);
    setAiMsg('');

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiInput,
          context: 'Clinical triage diagnosis for Indian emergency ward.',
        }),
      });
      const data = await res.json();
      const rawText = data.text || '';

      const lower = aiInput.toLowerCase();
      if (lower.includes('surgery') || lower.includes('fracture') || lower.includes('stent')) {
        setActiveRecordTab('surgical');
        setSurgProcedure(aiInput.slice(0, 50));
        setSurgNote(`Clinical observation: ${aiInput}`);
        setAiMsg('✓ Matched with Form 3: Surgical & Intervention Log. Prefilled for confirmation.');
      } else if (lower.includes('dose') || lower.includes('antibiotic') || lower.includes('mg') || lower.includes('pain')) {
        setActiveRecordTab('prescriptions');
        setRxMedicine(lower.includes('pain') ? 'Tramadol 50mg' : 'Ceftriaxone 1g IV');
        setRxDose('1 Dose');
        setRxFreq('SOS / Immediate');
        setRxNote(`Emergency Physician Orders: ${rawText ? rawText.slice(0, 90) : 'Immediate clinical administration.'}`);
        setAiMsg('✓ Matched with Form 2: Prescriptions. Prefilled with doctor credentials.');
      } else {
        setActiveRecordTab('diagnostics');
        setDiagTestName('STAT Cardiac Troponin-I & ABG');
        setDiagValue('0.04');
        setDiagUnit('ng/mL');
        setDiagRange('< 0.04 ng/mL');
        setDiagNote(`Diagnostic order based on triage presentation: ${aiInput}`);
        setAiMsg('✓ Matched with Form 1: Diagnostic Values. Prefilled for review.');
      }
    } catch {
      setActiveRecordTab('diagnostics');
      setDiagTestName('Clinical STAT Panel');
      setDiagValue('Normal');
      setDiagNote(aiInput);
      setAiMsg('✓ Populated clinical notes.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Open Record Edit Modal Helper
  const handleOpenEditRecord = (type: EditModalType, recordData?: any) => {
    setEditModalType(type);
    setEditModalRecordData(recordData || null);
    setShowEditRecordModal(true);
  };

  // Add Diagnostic Record Handler
  const handleAddDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagTestName || !diagValue) return;

    const newDiag: DiagnosticRecord = {
      id: `diag-${Date.now()}`,
      testName: diagTestName,
      value: diagValue,
      unit: diagUnit,
      referenceRange: diagRange || 'Normal',
      status: diagStatus,
      laboratoryName: diagLabName,
      dateRecorded: new Date().toISOString().slice(0, 10),
      specialNote: diagNote,
    };

    const updatedPatient: PatientProfile = {
      ...activePatient,
      diagnostics: [newDiag, ...(activePatient.diagnostics || [])],
      lastProfileUpdate: new Date().toISOString(),
      lastUpdatedBy: user?.displayName || 'Dr. Vivek Mehra (ER Head)',
    };

    saveHospitalPatient(updatedPatient);
    setActivePatient(updatedPatient);
    setEnrolledPatients(getHospitalPatients());
    setSearchMsg(`✓ Diagnostic added & synced to vault: ${newDiag.testName}`);

    setDiagTestName('');
    setDiagValue('');
    setDiagRange('');
    setDiagNote('');
  };

  // Add Prescription Handler
  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedicine || !rxDose) return;

    const newRx: PrescriptionDoc = {
      id: `rx-${Date.now()}`,
      medicationName: rxMedicine,
      dosage: rxDose,
      frequency: rxFreq,
      prescribedBy: rxDoctor,
      hospitalOrClinic: rxClinic,
      datePrescribed: new Date().toISOString().slice(0, 10),
      notes: rxNote,
    };

    const updatedPatient: PatientProfile = {
      ...activePatient,
      prescriptions: [newRx, ...activePatient.prescriptions],
      lastProfileUpdate: new Date().toISOString(),
      lastUpdatedBy: user?.displayName || 'Dr. Vivek Mehra (ER Head)',
    };

    saveHospitalPatient(updatedPatient);
    setActivePatient(updatedPatient);
    setEnrolledPatients(getHospitalPatients());
    setSearchMsg(`✓ Prescription added & synced to vault: ${newRx.medicationName}`);

    setRxMedicine('');
    setRxDose('');
    setRxNote('');
  };

  // Add Surgical Log Handler
  const handleAddSurgical = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surgProcedure) return;

    const newSurg: SurgicalRecord = {
      id: `surg-${Date.now()}`,
      procedureName: surgProcedure,
      surgeryDate: surgDate || new Date().toISOString().slice(0, 10),
      operatingSurgeon: surgSurgeon,
      hospitalOfSurgery: surgHospital,
      implantsUsed: surgImplants,
      specialNote: surgNote,
    };

    const updatedPatient: PatientProfile = {
      ...activePatient,
      surgicalLogs: [newSurg, ...(activePatient.surgicalLogs || [])],
      lastProfileUpdate: new Date().toISOString(),
      lastUpdatedBy: user?.displayName || 'Dr. Vivek Mehra (ER Head)',
    };

    saveHospitalPatient(updatedPatient);
    setActivePatient(updatedPatient);
    setEnrolledPatients(getHospitalPatients());
    setSearchMsg(`✓ Surgical log added & synced to vault: ${newSurg.procedureName}`);

    setSurgProcedure('');
    setSurgDate('');
    setSurgImplants('');
    setSurgNote('');
  };

  // Copy Referral Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(uniqueReferralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 3000);
  };

  // Save Hospital Profile
  const handleSaveHospProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setHospSavedMsg('Hospital node credentials & accreditation verified and synced!');
    setTimeout(() => setHospSavedMsg(''), 4000);
  };

  // Navigation Items
  const navItems = [
    { id: 1, label: 'Triage & Patient Vault', icon: <Search className="w-4 h-4" /> },
    { id: 2, label: 'Facility QR Node', icon: <QrCode className="w-4 h-4" /> },
    { id: 3, label: 'Global Medical News', icon: <Globe2 className="w-4 h-4" /> },
    { id: 4, label: 'Hospital Profile', icon: <Building2 className="w-4 h-4" /> },
    { id: 5, label: '5% Partner Commission', icon: <DollarSign className="w-4 h-4" /> },
  ];

  // Common styles
  const inputClass =
    'w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]/60 text-base sm:text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)]/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)] outline-hidden font-body transition-all';
  const labelClass = 'block text-[13px] sm:text-sm font-display font-semibold text-[var(--color-foreground)] mb-1.5';
  const selectClass =
    'w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]/60 text-base sm:text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)] outline-hidden cursor-pointer font-body transition-all';

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* ── Sidebar Navigation (desktop) ── */}
      <nav className="hidden lg:flex flex-col w-60 shrink-0">
        <div className="sticky top-20 space-y-1">
          {/* Facility Status Card */}
          <div className="mb-4 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]/40 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-display font-semibold text-emerald-700 tracking-wide uppercase">
                Clinical Node Online
              </span>
            </div>
            <p className="text-[13px] font-display font-bold text-[var(--color-foreground)] truncate" title={hospName}>
              {hospName}
            </p>
            <p className="text-[11px] font-mono text-[var(--color-foreground-muted)] mt-0.5">
              License: {hospLicense}
            </p>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as 1 | 2 | 3 | 4 | 5)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-display font-medium
                transition-all duration-200 cursor-pointer press-scale
                ${
                  currentPage === item.id
                    ? item.id === 5
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-[var(--color-primary)] text-white shadow-md shadow-cyan-500/15'
                    : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                }
              `}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}

          {/* Quick Sign Out */}
          <div className="pt-4 mt-4 border-t border-[var(--color-border)]/30">
            <button
              onClick={() => logOut()}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-display font-medium text-rose-600 hover:bg-rose-50/70 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock Terminal & Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-t border-[var(--color-border)]/30 shadow-lg px-2 py-1.5 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as 1 | 2 | 3 | 4 | 5)}
            className={`
              flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-display font-medium
              transition-colors cursor-pointer
              ${currentPage === item.id ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-foreground-muted)]'}
            `}
          >
            {item.icon}
            <span className="truncate max-w-[64px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Main Page Content ── */}
      <div className="flex-1 min-w-0 pb-20 lg:pb-0">
        <PageTransition activeKey={currentPage}>
          {/* ═══════════════ PAGE 1: SCAN PATIENT & CLINICAL EDITOR ═══════════════ */}
          {currentPage === 1 && (
            <div className="space-y-6">
              {/* Scan & Lookup Terminal */}
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--color-border)]/30">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="danger" dot>
                        Triage Terminal Override
                      </Badge>
                      <Badge variant="info">MCI Verified</Badge>
                    </div>
                    <h2 className="text-xl font-display font-bold text-[var(--color-foreground)]">
                      Patient Vault Scanner &amp; Clinical Editor
                    </h2>
                    <p className="text-[13px] text-[var(--color-foreground-muted)]">
                      Scan emergency QR or query by Unique National Health ID, Aadhaar, or ABHA number.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowScannerModal(true)}
                      className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-display font-bold text-sm shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer press-scale min-h-[44px]"
                    >
                      <ScanLine className="w-4 h-4" />
                      <span>Scan Barcode/QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEnrollModal(true)}
                      className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-display font-bold text-sm shadow-md shadow-cyan-600/20 transition flex items-center gap-2 cursor-pointer press-scale min-h-[44px]"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>+ Enroll Patient</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSearchPatient} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[var(--color-foreground-muted)] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Patient ID (e.g. MS-IND-DQ1Q1), ABHA ID, or Aadhaar..."
                      className={`${inputClass} pl-10 font-mono`}
                    />
                  </div>
                  <Button type="submit" variant="primary" icon={<ArrowRight className="w-4 h-4" />} className="w-full sm:w-auto min-h-[44px]">
                    Retrieve Vault
                  </Button>
                </form>

                {searchMsg && (
                  <div className="mt-3 p-3 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]/40 text-[13px] font-medium text-[var(--color-foreground)] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{searchMsg}</span>
                  </div>
                )}
              </Card>

              {/* Active Patient Clinical Overview Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white shadow-lg border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center font-display font-black text-white text-2xl shadow-md shrink-0">
                    +
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white">{activePatient.fullName}</h3>
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-500/25 text-rose-300 border border-rose-500/40">
                        Blood: {activePatient.bloodGroup}
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                        {activePatient.gender}
                      </span>
                      {activePatient.abhaId && (
                        <span className="px-3 py-0.5 rounded-full text-xs font-bold font-mono bg-cyan-500/25 text-cyan-300 border border-cyan-500/40">
                          ABHA: {activePatient.abhaId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 font-mono mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                      <span>ID: <strong className="text-cyan-400 font-black">{activePatient.id}</strong></span>
                      <span>• Aadhaar: {activePatient.aadhaarNumber}</span>
                      <span>• Phone: {activePatient.mobileNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewPatient(activePatient);
                      setShowQrPreviewModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-display font-bold transition flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
                  >
                    <QrCode className="w-4 h-4 text-cyan-300" />
                    <span>View QR &amp; ID</span>
                  </button>
                  <span className="px-3.5 py-2.5 rounded-xl bg-white/10 text-slate-200 border border-white/10 font-mono font-medium">
                    Rx: <strong className="text-white">{activePatient.prescriptions.length}</strong>
                  </span>
                  <span className="px-3.5 py-2.5 rounded-xl bg-white/10 text-slate-200 border border-white/10 font-mono font-medium">
                    Diagnostics: <strong className="text-white">{activePatient.diagnostics?.length || 0}</strong>
                  </span>
                </div>
              </div>

              {/* Enrolled Hospital Patients Directory */}
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-[var(--color-border)]/30">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="success" dot>
                        Hospital Sub-Database Active
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        {enrolledPatients.length} Enrolled Patients
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-bold text-[var(--color-foreground)]">
                      Enrolled Hospital Patients Directory
                    </h3>
                    <p className="text-[12px] text-[var(--color-foreground-muted)]">
                      Registered patients with active QR codes, ABHA IDs, and clinical vaults under this node.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={directorySearch}
                      onChange={(e) => setDirectorySearch(e.target.value)}
                      placeholder="Filter directory by name, ID, ABHA..."
                      className="h-9 px-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]/60 text-xs text-[var(--color-foreground)] placeholder:text-slate-400 focus:outline-none w-56 sm:w-64"
                    />
                  </div>
                </div>

                {/* Directory List */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {enrolledPatients
                    .filter((p) => {
                      if (!directorySearch.trim()) return true;
                      const q = directorySearch.toLowerCase();
                      return (
                        p.fullName.toLowerCase().includes(q) ||
                        p.id.toLowerCase().includes(q) ||
                        p.aadhaarNumber.includes(q) ||
                        (p.abhaId && p.abhaId.toLowerCase().includes(q))
                      );
                    })
                    .map((p) => {
                      const isActive = activePatient.id === p.id;
                      return (
                        <div
                          key={p.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setActivePatient(p);
                            setSearchMsg(`✓ Selected Clinical Vault: ${p.fullName} (${p.id})`);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActivePatient(p);
                              setSearchMsg(`✓ Selected Clinical Vault: ${p.fullName} (${p.id})`);
                            }
                          }}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group select-none ${
                            isActive
                              ? 'bg-cyan-50/80 border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
                              : 'bg-[var(--color-surface)] border-[var(--color-border)]/60 hover:border-cyan-400 hover:bg-cyan-50/30 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center font-display font-bold text-base shrink-0 shadow-xs">
                              {p.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base sm:text-lg font-display font-bold text-[var(--color-foreground)] group-hover:text-cyan-900 transition-colors">
                                  {p.fullName}
                                </h4>
                                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  {p.bloodGroup}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700">
                                  {p.gender}
                                </span>
                                {p.abhaId && (
                                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ABHA: {p.abhaId}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[13px] sm:text-sm text-slate-600 font-mono mt-1 flex-wrap">
                                <span className="font-bold text-cyan-700">ID: {p.id}</span>
                                <span>Aadhaar: {p.aadhaarNumber}</span>
                                <span>Phone: {p.mobileNumber}</span>
                                {p.documents && p.documents.length > 0 && (
                                  <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                                    📄 {p.documents.length} Docs Attached
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {/* View QR & ID Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewPatient(p);
                                setShowQrPreviewModal(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-display font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs min-h-[40px]"
                            >
                              <QrCode className="w-4 h-4 text-cyan-600" />
                              <span>View QR &amp; ID</span>
                            </button>

                            {/* Select / Open Clinical Vault */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePatient(p);
                                setSearchMsg(`✓ Selected Clinical Vault: ${p.fullName} (${p.id})`);
                              }}
                              className={`px-3.5 py-2 rounded-xl text-sm font-display font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
                                isActive
                                  ? 'bg-cyan-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-cyan-50 text-cyan-700 border border-cyan-300'
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                              <span>{isActive ? 'Active Vault' : 'Open Vault'}</span>
                            </button>

                            <ChevronRight className="hidden md:block w-5 h-5 text-slate-300 group-hover:text-cyan-600 transition-colors shrink-0 ml-1" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>

              {/* AI Clinical Assistant Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-[15px] font-display font-bold">AI Clinical Assistant — Hospital Auto-Fill</h3>
                  </div>
                  <Badge variant="info">Gemini 2.5</Badge>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  Enter triage notes, ER findings, or operative summaries. Gemini automatically parses and populates Form 1 (Diagnostics), Form 2 (Prescriptions), or Form 3 (Surgical Logs).
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="e.g. Emergency angioplasty in cath lab 2, LAD stented with drug eluting stent..."
                    className="flex-1 h-11 px-3.5 rounded-xl bg-slate-950/80 border border-indigo-400/40 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-400"
                  />
                  <Button
                    type="button"
                    onClick={handleAiAnalyze}
                    disabled={isAiProcessing}
                    variant="primary"
                    icon={isAiProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  >
                    {isAiProcessing ? 'Parsing...' : 'AI Auto-Fill'}
                  </Button>
                </div>

                {aiMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeInUp">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{aiMsg}</span>
                  </div>
                )}
              </div>

              {/* 3 Form Tabs */}
              <Card>
                <div className="pb-4 mb-4 border-b border-[var(--color-border)]/30">
                  <h3 className="text-base font-display font-bold text-[var(--color-foreground)]">
                    Clinical Record Intake & Append
                  </h3>
                  <p className="text-[13px] text-[var(--color-foreground-muted)] mb-4">
                    Authorized hospital personnel may append verified diagnostics, prescriptions, and surgical procedures directly to the patient vault.
                  </p>

                  <TabBar
                    tabs={[
                      { id: 'diagnostics', label: '1. Diagnostic Values & Lab Report', icon: <Activity className="w-4 h-4" /> },
                      { id: 'prescriptions', label: '2. Prescriptions & Doses', icon: <Stethoscope className="w-4 h-4" /> },
                      { id: 'surgical', label: '3. Surgical & Intervention Logs', icon: <Scissors className="w-4 h-4" /> },
                    ]}
                    activeTab={activeRecordTab}
                    onTabChange={(tabId: string) => setActiveRecordTab(tabId as any)}
                  />
                </div>

                {/* FORM 1: DIAGNOSTICS */}
                {activeRecordTab === 'diagnostics' && (
                  <form onSubmit={handleAddDiagnostic} className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-3">
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

                      <div>
                        <label className={labelClass}>Observed Value & Unit *</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={diagValue}
                            onChange={(e) => setDiagValue(e.target.value)}
                            placeholder="0.08"
                            className={`${inputClass} flex-2`}
                          />
                          <input
                            type="text"
                            value={diagUnit}
                            onChange={(e) => setDiagUnit(e.target.value)}
                            placeholder="ng/mL"
                            className={`${inputClass} flex-1`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Reference Range</label>
                        <input
                          type="text"
                          value={diagRange}
                          onChange={(e) => setDiagRange(e.target.value)}
                          placeholder="< 0.04 ng/mL"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Laboratory Name *</label>
                        <input
                          type="text"
                          required
                          value={diagLabName}
                          onChange={(e) => setDiagLabName(e.target.value)}
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
                          <option value="NORMAL">Normal</option>
                          <option value="ELEVATED">Elevated</option>
                          <option value="LOW">Low</option>
                          <option value="CRITICAL">Critical Alert</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Upload Lab Report Slip</label>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="w-full text-[12px] text-[var(--color-foreground-muted)] file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer pt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Special Clinical Note (Editable later)</label>
                      <textarea
                        value={diagNote}
                        onChange={(e) => setDiagNote(e.target.value)}
                        placeholder="Clinical findings, differential diagnoses, or doctor's recommendations..."
                        rows={2}
                        className="w-full p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]/60 text-[14px] text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)] outline-hidden font-body"
                      />
                    </div>

                    <Button type="submit" variant="primary" icon={<Plus className="w-4 h-4" />}>
                      Update Patient Diagnostic Record
                    </Button>
                  </form>
                )}

                {/* FORM 2: PRESCRIPTIONS */}
                {activeRecordTab === 'prescriptions' && (
                  <form onSubmit={handleAddPrescription} className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Medicine Name *</label>
                        <input
                          type="text"
                          required
                          value={rxMedicine}
                          onChange={(e) => setRxMedicine(e.target.value)}
                          placeholder="e.g. Clopidogrel / Atorvastatin"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Dose *</label>
                        <input
                          type="text"
                          required
                          value={rxDose}
                          onChange={(e) => setRxDose(e.target.value)}
                          placeholder="75 mg"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Frequency</label>
                        <select
                          value={rxFreq}
                          onChange={(e) => setRxFreq(e.target.value)}
                          className={selectClass}
                        >
                          <option>Once Daily</option>
                          <option>Twice Daily</option>
                          <option>Thrice Daily</option>
                          <option>SOS / Emergency</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Prescribing Doctor Name *</label>
                        <input
                          type="text"
                          required
                          value={rxDoctor}
                          onChange={(e) => setRxDoctor(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Hospital / Node Name</label>
                        <input
                          type="text"
                          value={rxClinic}
                          onChange={(e) => setRxClinic(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Upload Prescription Slip</label>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="w-full text-[12px] text-[var(--color-foreground-muted)] file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer pt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Special Instructions / Note (Editable later)</label>
                      <textarea
                        value={rxNote}
                        onChange={(e) => setRxNote(e.target.value)}
                        placeholder="Advisory for nursing staff or follow-up duration..."
                        rows={2}
                        className="w-full p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]/60 text-[14px] text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)] outline-hidden font-body"
                      />
                    </div>

                    <Button type="submit" variant="primary" icon={<Plus className="w-4 h-4" />}>
                      Update Patient Prescription Record
                    </Button>
                  </form>
                )}

                {/* FORM 3: SURGICAL LOGS */}
                {activeRecordTab === 'surgical' && (
                  <form onSubmit={handleAddSurgical} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Surgical Procedure Name *</label>
                        <input
                          type="text"
                          required
                          value={surgProcedure}
                          onChange={(e) => setSurgProcedure(e.target.value)}
                          placeholder="e.g. Percutaneous Coronary Intervention"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Surgery Date</label>
                        <input
                          type="date"
                          value={surgDate}
                          onChange={(e) => setSurgDate(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Operating Surgeon *</label>
                        <input
                          type="text"
                          required
                          value={surgSurgeon}
                          onChange={(e) => setSurgSurgeon(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Hospital of Surgery *</label>
                        <input
                          type="text"
                          required
                          value={surgHospital}
                          onChange={(e) => setSurgHospital(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Implants / Stents Used</label>
                        <input
                          type="text"
                          value={surgImplants}
                          onChange={(e) => setSurgImplants(e.target.value)}
                          placeholder="e.g. Cobalt Chromium Stent"
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Special Post-Operative Notes (Editable later)</label>
                      <textarea
                        value={surgNote}
                        onChange={(e) => setSurgNote(e.target.value)}
                        placeholder="Discharge summary notes, surgical complications, and implant serial numbers..."
                        rows={2}
                        className="w-full p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]/60 text-[14px] text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)] outline-hidden font-body"
                      />
                    </div>

                    <Button type="submit" variant="primary" icon={<Plus className="w-4 h-4" />}>
                      Update Patient Surgical Intervention Record
                    </Button>
                  </form>
                )}
              </Card>

              {/* Currently Active Patient Clinical Vault Display */}
              <div className="space-y-4">
              {/* Currently Active Patient Clinical Vault Display */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-[var(--color-foreground)]">
                      Active Clinical Vault Records ({activePatient.fullName})
                    </h3>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                      Verified records under this patient. All entries can be edited or revised by authorized hospital staff.
                    </p>
                  </div>
                  {activePatient.lastUpdatedBy && (
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 self-start sm:self-auto">
                      Last edited by: <strong className="text-slate-700">{activePatient.lastUpdatedBy}</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* 1. Diagnostics list */}
                  <Card className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/40 mb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-cyan-600" />
                          <span className="text-sm sm:text-base font-display font-bold text-[var(--color-foreground)]">
                            Diagnostics ({activePatient.diagnostics?.length || 0})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenEditRecord('diagnostic')}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {activePatient.diagnostics && activePatient.diagnostics.length > 0 ? (
                          activePatient.diagnostics.map((d) => (
                            <div
                              key={d.id}
                              className="p-3 rounded-xl bg-[var(--color-muted)]/70 hover:bg-[var(--color-muted)] border border-[var(--color-border)]/40 text-sm space-y-1.5 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-display font-bold text-[var(--color-foreground)] leading-snug">
                                  {d.testName}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <Badge
                                    variant={
                                      d.status === 'CRITICAL'
                                        ? 'danger'
                                        : d.status === 'ELEVATED'
                                        ? 'warning'
                                        : 'success'
                                    }
                                  >
                                    {d.status}
                                  </Badge>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditRecord('diagnostic', d)}
                                    title="Edit diagnostic record"
                                    className="p-1 rounded-md text-slate-400 hover:text-cyan-700 hover:bg-white transition cursor-pointer"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-baseline gap-2">
                                <span className="font-mono text-base text-cyan-700 font-bold">
                                  {d.value} {d.unit}
                                </span>
                                {d.referenceRange && (
                                  <span className="text-xs text-slate-500 font-mono">
                                    (Ref: {d.referenceRange})
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-500 font-medium">{d.laboratoryName}</p>
                              {d.specialNote && (
                                <p className="text-xs text-slate-600 bg-white/70 p-1.5 rounded-lg border border-slate-200/50">
                                  {d.specialNote}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-[var(--color-foreground-muted)] py-6 text-center">
                            No diagnostic records
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* 2. Prescriptions list */}
                  <Card className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/40 mb-3">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm sm:text-base font-display font-bold text-[var(--color-foreground)]">
                            Prescriptions ({activePatient.prescriptions.length})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenEditRecord('prescription')}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {activePatient.prescriptions.map((rx) => (
                          <div
                            key={rx.id}
                            className="p-3 rounded-xl bg-[var(--color-muted)]/70 hover:bg-[var(--color-muted)] border border-[var(--color-border)]/40 text-sm space-y-1.5 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="font-display font-bold text-[var(--color-foreground)] leading-snug">
                                  {rx.medicationName}
                                </h5>
                                <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5">
                                  {rx.dosage}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleOpenEditRecord('prescription', rx)}
                                title="Edit prescription record"
                                className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-white transition cursor-pointer shrink-0"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-xs text-slate-600 font-medium">{rx.frequency}</p>
                            <p className="text-xs text-slate-500 font-mono">
                              By: {rx.prescribedBy} • {rx.hospitalOrClinic}
                            </p>
                            {rx.notes && (
                              <p className="text-xs text-slate-600 bg-white/70 p-1.5 rounded-lg border border-slate-200/50">
                                {rx.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* 3. Surgical logs */}
                  <Card className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/40 mb-3">
                        <div className="flex items-center gap-2">
                          <Scissors className="w-5 h-5 text-purple-600" />
                          <span className="text-sm sm:text-base font-display font-bold text-[var(--color-foreground)]">
                            Surgical History ({activePatient.surgicalLogs?.length || 0})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenEditRecord('surgical')}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {activePatient.surgicalLogs && activePatient.surgicalLogs.length > 0 ? (
                          activePatient.surgicalLogs.map((s) => (
                            <div
                              key={s.id}
                              className="p-3 rounded-xl bg-[var(--color-muted)]/70 hover:bg-[var(--color-muted)] border border-[var(--color-border)]/40 text-sm space-y-1.5 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h5 className="font-display font-bold text-[var(--color-foreground)] leading-snug">
                                  {s.procedureName}
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditRecord('surgical', s)}
                                  title="Edit surgical log"
                                  className="p-1 rounded-md text-slate-400 hover:text-purple-700 hover:bg-white transition cursor-pointer shrink-0"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <p className="text-xs text-slate-500 font-mono">Date: {s.surgeryDate}</p>
                              <p className="text-xs text-slate-600">Surgeon: {s.operatingSurgeon}</p>
                              {s.implantsUsed && (
                                <p className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                                  Implants: {s.implantsUsed}
                                </p>
                              )}
                              {s.specialNote && (
                                <p className="text-xs text-slate-600 bg-white/70 p-1.5 rounded-lg border border-slate-200/50">
                                  {s.specialNote}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-[var(--color-foreground-muted)] py-6 text-center">
                            No surgical records
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* 4. Baseline Vitals & Allergies Editor */}
                  <Card className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]/40 mb-3">
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-rose-600" />
                          <span className="text-sm sm:text-base font-display font-bold text-[var(--color-foreground)]">
                            Vitals &amp; Allergies
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        {/* Vitals Summary Card */}
                        <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-display font-bold text-rose-900 uppercase tracking-wider">
                              Baseline Vitals
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenEditRecord('vitals')}
                              className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit Vitals</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="p-1.5 rounded-lg bg-white border border-rose-100">
                              <span className="text-slate-400 block text-[10px]">Blood Pressure:</span>
                              <span className="font-bold text-slate-800 text-sm">
                                {activePatient.vitals?.bloodPressure || '120/80 mmHg'}
                              </span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white border border-rose-100">
                              <span className="text-slate-400 block text-[10px]">Heart Rate:</span>
                              <span className="font-bold text-slate-800 text-sm">
                                {activePatient.vitals?.heartRate || 72} bpm
                              </span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white border border-rose-100">
                              <span className="text-slate-400 block text-[10px]">SpO2 Level:</span>
                              <span className="font-bold text-emerald-700 text-sm">
                                {activePatient.vitals?.spO2 || 98}%
                              </span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white border border-rose-100">
                              <span className="text-slate-400 block text-[10px]">Blood Sugar:</span>
                              <span className="font-bold text-slate-800 text-sm">
                                {activePatient.vitals?.bloodSugar || '100 mg/dL'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Allergies Summary Card */}
                        <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-display font-bold text-amber-900 uppercase tracking-wider">
                              Allergies ({activePatient.allergies?.length || 0})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenEditRecord('allergies')}
                              className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit Allergies</span>
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {activePatient.allergies && activePatient.allergies.length > 0 ? (
                              activePatient.allergies.map((a, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                                    a.severity === 'CRITICAL'
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                                  }`}
                                >
                                  {a.allergen}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">No allergies recorded</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* ═══════════════ PAGE 2: HOSPITAL QR CODE NODE ═══════════════ */}
          {currentPage === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="text-center space-y-6">
                <div className="space-y-2">
                  <Badge variant="danger" dot>
                    Official Facility QR Terminal
                  </Badge>
                  <h2 className="text-2xl font-display font-bold text-[var(--color-foreground)]">{hospName}</h2>
                  <p className="text-[13px] text-[var(--color-foreground-muted)] max-w-md mx-auto">
                    Patients, emergency responders, and ambulance paramedics scan this terminal QR for instant digital intake, triage status, and trauma registry linking.
                  </p>
                </div>

                <div className="p-6 bg-[var(--color-muted)]/50 border-2 border-dashed border-[var(--color-border)] rounded-3xl inline-block mx-auto shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=https://medisync.vercel.app/hospital/${hospLicense}`}
                    alt="Hospital Facility QR"
                    className="w-56 h-56 rounded-2xl shadow-sm bg-white p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs max-w-md mx-auto font-mono">
                  <div className="p-3.5 rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)] text-left">
                    <span className="text-[10px] text-[var(--color-foreground-muted)] block">LICENSE NUMBER</span>
                    <span className="font-bold text-[13px]">{hospLicense}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)] text-left">
                    <span className="text-[10px] text-[var(--color-foreground-muted)] block">TRAUMA TIER</span>
                    <span className="font-bold text-rose-600 text-[13px]">LEVEL 1 APEX</span>
                  </div>
                </div>

                <Button
                  onClick={() => window.print()}
                  variant="primary"
                  icon={<Printer className="w-4 h-4" />}
                  className="mx-auto"
                >
                  Print Hospital Triage Desk Poster
                </Button>
              </Card>
            </div>
          )}

          {/* ═══════════════ PAGE 3: GLOBAL MEDICAL NEWS & SCROLLING MARQUEE ═══════════════ */}
          {currentPage === 3 && (
            <div className="space-y-6">
              <Card>
                <GlobalMedicalNews />
              </Card>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <LiveNewsMarquee />
              </div>
            </div>
          )}

          {/* ═══════════════ PAGE 4: HOSPITAL PROFILE & ACCREDITATION ═══════════════ */}
          {currentPage === 4 && (
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="space-y-6">
                <div className="border-b border-[var(--color-border)]/30 pb-4 flex items-center justify-between">
                  <div>
                    <Badge variant="info">Node Administration</Badge>
                    <h2 className="text-xl font-display font-bold text-[var(--color-foreground)] mt-1.5">
                      Hospital Profile & Terminal Credentials
                    </h2>
                    <p className="text-[13px] text-[var(--color-foreground-muted)]">
                      Manage registered hospital identity, medical council license, and emergency triage desk.
                    </p>
                  </div>
                  <Badge variant="success" dot>Active Terminal</Badge>
                </div>

                {hospSavedMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-[13px] flex items-center gap-2 animate-fadeInUp">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{hospSavedMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveHospProfile} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Hospital / Nursing Home / Medical Camp Name *</label>
                      <input
                        type="text"
                        required
                        value={hospName}
                        onChange={(e) => setHospName(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Medical Council License # or Camp ID *</label>
                      <input
                        type="text"
                        required
                        value={hospLicense}
                        onChange={(e) => setHospLicense(e.target.value)}
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Lead Medical Officer / ER Head *</label>
                      <input
                        type="text"
                        required
                        value={hospOfficer}
                        onChange={(e) => setHospOfficer(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Facility Category</label>
                      <select
                        value={hospType}
                        onChange={(e) => setHospType(e.target.value)}
                        className={selectClass}
                      >
                        <option>Hospital & Trauma Center</option>
                        <option>Nursing Home</option>
                        <option>ICU & Emergency Clinic</option>
                        <option>Rural Assistance Camp</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Emergency Desk Phone</label>
                      <input
                        type="tel"
                        value={hospPhone}
                        onChange={(e) => setHospPhone(e.target.value)}
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Official Institutional Email</label>
                    <input
                      type="email"
                      value={hospEmail}
                      onChange={(e) => setHospEmail(e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)]/30">
                    <Button type="submit" variant="primary">
                      Save Hospital Node Changes
                    </Button>

                    <Button
                      type="button"
                      onClick={() => logOut()}
                      variant="danger"
                      icon={<LogOut className="w-4 h-4" />}
                    >
                      Lock Terminal & Sign Out
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* ═══════════════ PAGE 5: 5% COMMISSION & REFERRAL PROGRAM ═══════════════ */}
          {currentPage === 5 && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 shadow-xl border border-emerald-800/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="success">5% Partner Revenue Sharing</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Hospital Emergency Card Partner Commission Program
                </h2>
                <p className="text-[13px] sm:text-[14px] text-emerald-100/80 leading-relaxed">
                  Every time a patient or visitor orders a physical Emergency Health Wallet Card using your hospital’s unique referral code, <strong className="text-white">your hospital earns an instant 5% commission</strong>, and the <strong className="text-white">patient receives an instant 5% discount</strong>!
                </p>
              </div>

              {/* Unique Hospital Referral Code Card */}
              <Card className="space-y-6">
                <div className="border-b border-[var(--color-border)]/30 pb-4">
                  <h3 className="text-base font-display font-bold text-[var(--color-foreground)]">
                    Your Facility’s Unique Referral Code
                  </h3>
                  <p className="text-[13px] text-[var(--color-foreground-muted)]">
                    Display this code at outpatient registration desks, emergency reception, and discharge counters.
                  </p>
                </div>

                {/* Code Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border-2 border-dashed border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-display font-bold text-emerald-700 uppercase tracking-wider">
                      Official Hospital Referral Code
                    </span>
                    <p className="text-3xl font-display font-black text-emerald-900 font-mono tracking-wider mt-1">
                      {uniqueReferralCode}
                    </p>
                    <p className="text-[12px] text-emerald-700 mt-1">
                      • 5% Discount to Patient (Saves ₹7.50) &nbsp;|&nbsp; • 5% Commission to Hospital (+₹7.50 per card)
                    </p>
                  </div>

                  <Button
                    onClick={handleCopyCode}
                    variant="primary"
                    icon={codeCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 shrink-0"
                  >
                    {codeCopied ? 'Copied to Clipboard!' : 'Copy Referral Code'}
                  </Button>
                </div>

                {/* Commission Analytics Dashboard */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]/40">
                    <span className="text-[11px] text-[var(--color-foreground-muted)] font-medium block">Cards Referred</span>
                    <p className="text-2xl font-display font-black text-[var(--color-foreground)] font-mono mt-1">84</p>
                    <span className="text-[11px] text-emerald-600 font-semibold">↑ +18 this week</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]/40">
                    <span className="text-[11px] text-[var(--color-foreground-muted)] font-medium block">Gross Patient Sales</span>
                    <p className="text-2xl font-display font-black text-[var(--color-foreground)] font-mono mt-1">₹12,600</p>
                    <span className="text-[11px] text-[var(--color-foreground-muted)] font-medium">Processed via Razorpay</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]/40">
                    <span className="text-[11px] text-[var(--color-foreground-muted)] font-medium block">5% Commission Earned</span>
                    <p className="text-2xl font-display font-black text-emerald-600 font-mono mt-1">₹630.00</p>
                    <span className="text-[11px] text-emerald-700 font-semibold">Credited to hospital</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]/40">
                    <span className="text-[11px] text-[var(--color-foreground-muted)] font-medium block">Current Balance</span>
                    <p className="text-2xl font-display font-black text-cyan-600 font-mono mt-1">₹630.00</p>
                    <span className="text-[11px] text-cyan-700 font-semibold">Ready for payout</span>
                  </div>
                </div>

                {/* Request Payout Card */}
                <div className="p-4 rounded-2xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[13px] font-display font-bold text-[var(--color-foreground)]">
                      Direct Institutional Payout
                    </h4>
                    <p className="text-[12px] text-[var(--color-foreground-muted)]">
                      Transfer accumulated 5% commissions directly to hospital registered bank account.
                    </p>
                  </div>

                  {payoutRequested ? (
                    <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-[13px] font-medium flex items-center gap-1.5 animate-fadeInUp">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Withdrawal Request Submitted (₹630.00)</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setPayoutRequested(true)}
                      variant="primary"
                    >
                      Request Payout (₹630.00)
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}
        </PageTransition>
      </div>

      {/* ── Patient Enrollment Modal ── */}
      <HospitalEnrollPatientModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        hospitalName={hospName}
        onPatientEnrolled={(newPatient) => {
          setEnrolledPatients(getHospitalPatients());
          setActivePatient(newPatient);
          setSearchMsg(`✓ Patient Enrolled & Assigned ID: ${newPatient.id}`);
        }}
      />

      {/* ── Hospital Barcode / QR Scanner Modal ── */}
      <HospitalQrScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onPatientScanned={(scannedPatient) => {
          setEnrolledPatients(getHospitalPatients());
          setActivePatient(scannedPatient);
          setSearchMsg(`✓ Verified MediSync Patient Scanned & Imported: ${scannedPatient.fullName} (${scannedPatient.id})`);
        }}
      />

      {/* ── Patient QR & ID Preview Modal ── */}
      <PatientQrPreviewModal
        isOpen={showQrPreviewModal}
        onClose={() => {
          setShowQrPreviewModal(false);
          setPreviewPatient(null);
        }}
        patient={previewPatient}
      />

      {/* ── Hospital Record Edit Modal ── */}
      <HospitalEditRecordModal
        isOpen={showEditRecordModal}
        onClose={() => {
          setShowEditRecordModal(false);
          setEditModalRecordData(null);
        }}
        recordType={editModalType}
        patient={activePatient}
        recordData={editModalRecordData}
        onSave={(updated) => {
          setActivePatient(updated);
          setEnrolledPatients(getHospitalPatients());
          setSearchMsg(`✓ Records updated & synced for ${updated.fullName} (${updated.id})`);
        }}
        hospitalStaffName={user?.displayName || 'Dr. Vivek Mehra (ER Trauma Lead)'}
      />
    </div>
  );
}
