'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PatientProfile, DiagnosticRecord, PrescriptionDoc, SurgicalRecord, VitalLogEntry, Allergy } from '@/lib/types';
import { LiveNewsMarquee } from '@/components/LiveNewsMarquee';
import { GlobalMedicalNews } from '@/components/GlobalMedicalNews';
import { PatientQRCode } from '@/components/PatientQRCode';
import {
  Activity,
  Shield,
  CreditCard,
  QrCode,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Phone,
  User,
  LogOut,
  Stethoscope,
  Scissors,
  Plus,
  Upload,
  Calendar,
  Building2,
  Edit3,
  Check,
  X,
  ExternalLink,
  ShoppingBag,
  Tag,
  Share2,
  Lock,
  Globe2,
  Heart,
  FileCheck,
  ChevronRight,
  Printer,
  Copy,
  AlertTriangle,
  Flame,
  ShieldAlert,
  History,
  Clock,
  Trash2,
} from 'lucide-react';

interface ClientDashboardProps {
  patient: PatientProfile;
  onUpdatePatient: React.Dispatch<React.SetStateAction<PatientProfile>>;
}

export function ClientDashboard({ patient, onUpdatePatient }: ClientDashboardProps) {
  const { user, logOut, updateCitizenAadhaarAndPhone } = useAuth();

  // Page 1 to 5 state
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Popup Modal for Physical Card Ad on Login
  const [showAdPopup, setShowAdPopup] = useState(false);

  // Page 1: Record form tab selector ('diagnostics' | 'prescriptions' | 'surgical' | 'allergies')
  const [activeRecordTab, setActiveRecordTab] = useState<'diagnostics' | 'prescriptions' | 'surgical' | 'allergies'>('diagnostics');

  // Vitals Update & History Modal state
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [vitalsModalTab, setVitalsModalTab] = useState<'edit' | 'history'>('edit');
  const [editHeartRate, setEditHeartRate] = useState<number | ''>(patient.vitals?.heartRate || 72);
  const [editBp, setEditBp] = useState<string>(patient.vitals?.bloodPressure || '120/80 mmHg');
  const [editSpo2, setEditSpo2] = useState<number | ''>(patient.vitals?.spO2 || 98);
  const [editBloodSugar, setEditBloodSugar] = useState<string>(patient.vitals?.bloodSugar || '110 mg/dL');
  const [editVitalsNote, setEditVitalsNote] = useState<string>('');
  const [editVitalsRecordedBy, setEditVitalsRecordedBy] = useState<string>('');

  // Allergy Form fields
  const [allergyName, setAllergyName] = useState('');
  const [allergySeverity, setAllergySeverity] = useState<'CRITICAL' | 'MODERATE' | 'MILD'>('MODERATE');
  const [allergyReaction, setAllergyReaction] = useState('');
  const [allergyNotes, setAllergyNotes] = useState('');

  // AI Symptoms Assistant state
  const [aiSymptomsInput, setAiSymptomsInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  // Diagnostics Form fields
  const [diagTestName, setDiagTestName] = useState('');
  const [diagValue, setDiagValue] = useState('');
  const [diagUnit, setDiagUnit] = useState('mg/dL');
  const [diagRange, setDiagRange] = useState('');
  const [diagLabName, setDiagLabName] = useState('');
  const [diagNote, setDiagNote] = useState('');
  const [diagStatus, setDiagStatus] = useState<'NORMAL' | 'ELEVATED' | 'LOW' | 'CRITICAL'>('NORMAL');

  // Prescriptions Form fields
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDose, setRxDose] = useState('');
  const [rxFreq, setRxFreq] = useState('Once Daily');
  const [rxDoctor, setRxDoctor] = useState('');
  const [rxClinic, setRxClinic] = useState('');
  const [rxNote, setRxNote] = useState('');

  // Surgical Form fields
  const [surgProcedure, setSurgProcedure] = useState('');
  const [surgDate, setSurgDate] = useState('');
  const [surgSurgeon, setSurgSurgeon] = useState('');
  const [surgHospital, setSurgHospital] = useState('');
  const [surgImplants, setSurgImplants] = useState('');
  const [surgNote, setSurgNote] = useState('');

  // Editing note modal/state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  // Setup Modal for New Users
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Page 4: Profile editing state
  const [profileName, setProfileName] = useState(patient.fullName || '');
  const [profilePhone, setProfilePhone] = useState(patient.mobileNumber || user?.phoneNumber || '');
  const [profileAadhaar, setProfileAadhaar] = useState(patient.aadhaarNumber || user?.aadhaarNumber || '');
  const [profileBlood, setProfileBlood] = useState(patient.bloodGroup || 'O+');
  const [profileAddress, setProfileAddress] = useState(patient.address || '');
  const [profileDob, setProfileDob] = useState(patient.dob || '');
  const [profileGender, setProfileGender] = useState(patient.gender || 'Male');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Synchronize profile state when patient changes
  React.useEffect(() => {
    setProfileName(patient.fullName || '');
    setProfilePhone(patient.mobileNumber || user?.phoneNumber || '');
    setProfileAadhaar(patient.aadhaarNumber || user?.aadhaarNumber || '');
    setProfileBlood(patient.bloodGroup || 'O+');
    setProfileAddress(patient.address || '');
    setProfileDob(patient.dob || '');
    setProfileGender(patient.gender || 'Male');
  }, [patient, user]);

  // Determine if this is a demo user vs new patient with incomplete info
  const isDemoUser = user?.uid === 'demo-pat-01' || user?.email === 'rajesh.sharma@gmail.com' || user?.authProvider === 'demo';
  const hasVitals = !!patient.vitals?.bloodPressure && patient.vitals.bloodPressure !== '--/--' && patient.vitals.bloodPressure !== '' && patient.vitals.bloodPressure !== '--';
  const hasEmergencyContact = !!(patient.emergencyContacts && patient.emergencyContacts.length > 0 && patient.emergencyContacts[0]?.phone);
  const isProfileIncomplete = !isDemoUser && !patient.hasCompletedSetup && (!hasVitals || !hasEmergencyContact || !patient.aadhaarNumber);

  // Setup modal state for new user onboarding
  const [setupName, setSetupName] = useState(patient.fullName || '');
  const [setupAadhaar, setSetupAadhaar] = useState(patient.aadhaarNumber || '');
  const [setupDob, setSetupDob] = useState(patient.dob || '');
  const [setupGender, setSetupGender] = useState<'Male' | 'Female' | 'Other'>(patient.gender || 'Male');
  const [setupBlood, setSetupBlood] = useState(patient.bloodGroup || 'O+');
  const [setupContactName, setSetupContactName] = useState(patient.emergencyContacts?.[0]?.name || '');
  const [setupContactRel, setSetupContactRel] = useState(patient.emergencyContacts?.[0]?.relationship || 'Parent');
  const [setupContactPhone, setSetupContactPhone] = useState(patient.emergencyContacts?.[0]?.phone || patient.mobileNumber || '');
  const [setupAllergies, setSetupAllergies] = useState<string[]>(() =>
    patient.allergies && patient.allergies.length > 0
      ? patient.allergies.map(a => a.allergen)
      : ['No Known Allergies']
  );
  const [setupConditions, setSetupConditions] = useState<string[]>(() =>
    patient.existingConditions && patient.existingConditions.length > 0
      ? patient.existingConditions
      : ['None (Healthy)']
  );
  const [setupBp, setSetupBp] = useState(patient.vitals?.bloodPressure && patient.vitals.bloodPressure !== '--/--' ? patient.vitals.bloodPressure : '');
  const [setupHeartRate, setSetupHeartRate] = useState<number>(patient.vitals?.heartRate || 0);
  const [setupSpo2, setSetupSpo2] = useState<number>(patient.vitals?.spO2 || 0);
  const [setupAddress, setSetupAddress] = useState(patient.address || '');
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [customConditionInput, setCustomConditionInput] = useState('');

  // Auto-prompt setup modal if profile is incomplete on initial mount for new users
  React.useEffect(() => {
    if (isProfileIncomplete) {
      const timer = setTimeout(() => {
        setShowSetupModal(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isProfileIncomplete]);

  React.useEffect(() => {
    setSetupName(patient.fullName || '');
    setSetupAadhaar(patient.aadhaarNumber || '');
    setSetupDob(patient.dob || '');
    setSetupGender(patient.gender || 'Male');
    setSetupBlood(patient.bloodGroup || 'O+');
    setSetupContactName(patient.emergencyContacts?.[0]?.name || '');
    setSetupContactRel(patient.emergencyContacts?.[0]?.relationship || 'Parent');
    setSetupContactPhone(patient.emergencyContacts?.[0]?.phone || patient.mobileNumber || '');
    setSetupAllergies(
      patient.allergies && patient.allergies.length > 0
        ? patient.allergies.map(a => a.allergen)
        : ['No Known Allergies']
    );
    setSetupConditions(
      patient.existingConditions && patient.existingConditions.length > 0
        ? patient.existingConditions
        : ['None (Healthy)']
    );
    setSetupBp(patient.vitals?.bloodPressure && patient.vitals.bloodPressure !== '--/--' ? patient.vitals.bloodPressure : '');
    setSetupHeartRate(patient.vitals?.heartRate || 0);
    setSetupSpo2(patient.vitals?.spO2 || 0);
    setSetupAddress(patient.address || '');
  }, [patient]);

  const toggleAllergy = (allergen: string) => {
    if (allergen === 'No Known Allergies') {
      setSetupAllergies(['No Known Allergies']);
      return;
    }
    setSetupAllergies(prev => {
      const filtered = prev.filter(a => a !== 'No Known Allergies');
      if (filtered.includes(allergen)) {
        const next = filtered.filter(a => a !== allergen);
        return next.length === 0 ? ['No Known Allergies'] : next;
      } else {
        return [...filtered, allergen];
      }
    });
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergyInput.trim();
    if (!trimmed) return;
    setSetupAllergies(prev => {
      const filtered = prev.filter(a => a !== 'No Known Allergies');
      if (filtered.includes(trimmed)) return filtered;
      return [...filtered, trimmed];
    });
    setCustomAllergyInput('');
  };

  const toggleCondition = (condition: string) => {
    if (condition === 'None (Healthy)') {
      setSetupConditions(['None (Healthy)']);
      return;
    }
    setSetupConditions(prev => {
      const filtered = prev.filter(c => c !== 'None (Healthy)');
      if (filtered.includes(condition)) {
        const next = filtered.filter(c => c !== condition);
        return next.length === 0 ? ['None (Healthy)'] : next;
      } else {
        return [...filtered, condition];
      }
    });
  };

  const addCustomCondition = () => {
    const trimmed = customConditionInput.trim();
    if (!trimmed) return;
    setSetupConditions(prev => {
      const filtered = prev.filter(c => c !== 'None (Healthy)');
      if (filtered.includes(trimmed)) return filtered;
      return [...filtered, trimmed];
    });
    setCustomConditionInput('');
  };

  const handleSetupModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isNoKnownAllergies = setupAllergies.includes('No Known Allergies') || setupAllergies.length === 0;
    const updatedAllergies = isNoKnownAllergies
      ? []
      : setupAllergies
          .filter(a => a !== 'No Known Allergies')
          .map(allergen => ({
            allergen,
            severity: 'CRITICAL' as const,
            reaction: 'Severe reaction — notify triage and consult physician',
          }));

    const updatedContacts = setupContactPhone ? [
      {
        id: 'ec-1',
        name: setupContactName || 'Primary Emergency Contact',
        relationship: setupContactRel || 'Next of Kin',
        phone: setupContactPhone,
        isPrimary: true,
      }
    ] : (patient.emergencyContacts || []);

    const updatedPatient: PatientProfile = {
      ...patient,
      hasCompletedSetup: true,
      hasNoKnownAllergies: isNoKnownAllergies,
      fullName: setupName || patient.fullName,
      aadhaarNumber: setupAadhaar || patient.aadhaarNumber,
      dob: setupDob || patient.dob,
      gender: setupGender,
      bloodGroup: setupBlood as any,
      address: setupAddress || patient.address,
      allergies: updatedAllergies,
      existingConditions: setupConditions.filter(c => c !== 'None (Healthy)'),
      emergencyContacts: updatedContacts,
      vitals: {
        ...patient.vitals,
        bloodPressure: setupBp ? (setupBp.includes('mmHg') ? setupBp : `${setupBp} mmHg`) : (patient.vitals?.bloodPressure || '120/80 mmHg'),
        heartRate: Number(setupHeartRate) > 0 ? Number(setupHeartRate) : (patient.vitals?.heartRate || 72),
        spO2: Number(setupSpo2) > 0 ? Number(setupSpo2) : (patient.vitals?.spO2 || 98),
        lastRecorded: new Date().toISOString(),
      },
      lastProfileUpdate: new Date().toISOString().slice(0, 10),
    };

    onUpdatePatient(updatedPatient);
    setShowSetupModal(false);
  };

  // Page 5: Referral Code & Razorpay Checkout State
  const [referralCode, setReferralCode] = useState('');
  const [appliedReferral, setAppliedReferral] = useState<string | null>(null);
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Submit Handler for Form 1: Diagnostics
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
      laboratoryName: diagLabName || 'Standard Laboratory',
      dateRecorded: new Date().toISOString().slice(0, 10),
      specialNote: diagNote,
    };

    onUpdatePatient({
      ...patient,
      diagnostics: [newDiag, ...(patient.diagnostics || [])],
    });

    setDiagTestName('');
    setDiagValue('');
    setDiagRange('');
    setDiagLabName('');
    setDiagNote('');
  };

  // Submit Handler for Form 2: Prescriptions
  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedicine || !rxDose) return;

    const newRx: PrescriptionDoc = {
      id: `rx-${Date.now()}`,
      medicationName: rxMedicine,
      dosage: rxDose,
      frequency: rxFreq,
      prescribedBy: rxDoctor || 'Consulting Physician',
      hospitalOrClinic: rxClinic || 'Medical Center',
      datePrescribed: new Date().toISOString().slice(0, 10),
      notes: rxNote,
    };

    onUpdatePatient({
      ...patient,
      prescriptions: [newRx, ...patient.prescriptions],
    });

    setRxMedicine('');
    setRxDose('');
    setRxDoctor('');
    setRxClinic('');
    setRxNote('');
  };

  // Submit Handler for Form 3: Surgical
  const handleAddSurgical = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surgProcedure) return;

    const newSurg: SurgicalRecord = {
      id: `surg-${Date.now()}`,
      procedureName: surgProcedure,
      surgeryDate: surgDate || new Date().toISOString().slice(0, 10),
      operatingSurgeon: surgSurgeon || 'Lead Surgeon',
      hospitalOfSurgery: surgHospital || 'Speciality Hospital',
      implantsUsed: surgImplants,
      specialNote: surgNote,
    };

    onUpdatePatient({
      ...patient,
      surgicalLogs: [newSurg, ...(patient.surgicalLogs || [])],
    });

    setSurgProcedure('');
    setSurgDate('');
    setSurgSurgeon('');
    setSurgHospital('');
    setSurgImplants('');
    setSurgNote('');
  };

  // Submit Handler for Vitals Update & History Log
  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const hr = Number(editHeartRate) > 0 ? Number(editHeartRate) : 0;
    const bp = editBp.trim() ? (editBp.includes('mmHg') ? editBp.trim() : `${editBp.trim()} mmHg`) : '--/--';
    const spo2 = Number(editSpo2) > 0 ? Number(editSpo2) : 0;
    const bs = editBloodSugar.trim() ? (editBloodSugar.includes('mg/dL') ? editBloodSugar.trim() : `${editBloodSugar.trim()} mg/dL`) : '--';
    const recorder = editVitalsRecordedBy.trim() || user?.displayName || 'Patient (Self)';
    const now = new Date().toISOString();

    const newHistoryEntry: VitalLogEntry = {
      id: `vh-${Date.now()}`,
      timestamp: now,
      recordedBy: recorder,
      heartRate: hr,
      bloodPressure: bp,
      spO2: spo2,
      bloodSugar: bs,
      notes: editVitalsNote.trim() || undefined,
    };

    onUpdatePatient((prev) => {
      const updatedHistory = [newHistoryEntry, ...(prev.vitalsHistory || [])];
      return {
        ...prev,
        vitals: {
          ...prev.vitals,
          heartRate: hr,
          bloodPressure: bp,
          spO2: spo2,
          bloodSugar: bs,
          lastRecorded: now,
        },
        vitalsHistory: updatedHistory,
        lastProfileUpdate: now,
        lastUpdatedBy: recorder,
      };
    });

    setProfileSavedMsg('Vitals & measurement history updated successfully.');
    setShowVitalsModal(false);
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  // Submit Handler for Form 4: Allergies
  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergyName.trim()) return;

    const newAllergy: Allergy = {
      allergen: allergyName.trim().toUpperCase(),
      severity: allergySeverity,
      reaction: allergyReaction.trim() || 'Sensitivity reaction',
      subCategory: allergyNotes.trim() || undefined,
    };

    const now = new Date().toISOString();
    const recorder = user?.displayName || 'Patient (Self)';

    onUpdatePatient((prev) => {
      const existing = prev.allergies || [];
      return {
        ...prev,
        allergies: [...existing, newAllergy],
        lastProfileUpdate: now,
        lastUpdatedBy: recorder,
      };
    });

    setAllergyName('');
    setAllergyReaction('');
    setAllergyNotes('');
    setProfileSavedMsg(`Allergy "${newAllergy.allergen}" recorded into clinical vault.`);
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  // Delete Handler for Allergy
  const handleDeleteAllergy = (index: number) => {
    onUpdatePatient((prev) => {
      const updated = [...(prev.allergies || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        allergies: updated,
        lastProfileUpdate: new Date().toISOString(),
        lastUpdatedBy: user?.displayName || 'Patient (Self)',
      };
    });
  };

  // AI Symptoms Assistant Analyzer
  const handleAiSymptomAnalyze = async (sampleText?: string) => {
    const textToAnalyze = sampleText || aiSymptomsInput;
    if (!textToAnalyze.trim()) return;

    setIsAiProcessing(true);
    setAiSuccessMsg('');

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToAnalyze,
          context: 'Extract clinical diagnostic markers, prescribed medications with doses, or surgery logs for Indian medical records.',
        }),
      });

      const data = await res.json();
      const rawText = data.text || '';
      const lower = textToAnalyze.toLowerCase();

      if (lower.includes('surgery') || lower.includes('operation') || lower.includes('graft') || lower.includes('stent') || lower.includes('angioplasty')) {
        setActiveRecordTab('surgical');
        setSurgProcedure(textToAnalyze.slice(0, 45));
        setSurgHospital('AIIMS Trauma Center');
        setSurgSurgeon('Dr. Vivek Mehra (Lead Surgeon)');
        setSurgNote(`Auto-extracted from symptoms: ${textToAnalyze}`);
        setAiSuccessMsg('AI matched your entry with Surgical & Intervention Logs. Form 3 prefilled!');
      } else if (lower.includes('pain') || lower.includes('fever') || lower.includes('pressure') || lower.includes('cough') || lower.includes('metformin')) {
        setActiveRecordTab('prescriptions');
        setRxMedicine(lower.includes('fever') ? 'Paracetamol 650mg' : 'Metformin 500mg');
        setRxDose('1 Tablet');
        setRxFreq('Twice Daily after meals');
        setRxDoctor('Dr. Sharma (Consulting Physician)');
        setRxClinic('National Tele-Health Relay');
        setRxNote(`AI Clinical Triage Assessment: ${rawText ? rawText.slice(0, 90) : 'Symptomatic management recommended.'}`);
        setAiSuccessMsg('AI matched your symptoms with Prescriptions. Form 2 prefilled for review!');
      } else {
        setActiveRecordTab('diagnostics');
        setDiagTestName(lower.includes('sugar') ? 'Fasting Blood Glucose' : 'Routine Complete Blood Count (CBC)');
        setDiagValue(lower.includes('sugar') ? '135' : '11.8');
        setDiagUnit(lower.includes('sugar') ? 'mg/dL' : 'g/dL');
        setDiagRange('Normal reference range');
        setDiagLabName('Metropolis Clinical Bio-Labs');
        setDiagNote(`AI Recommended investigation based on symptoms: "${textToAnalyze}"`);
        setAiSuccessMsg('AI populated Form 1: Medical Diagnostic Values. Review and save!');
      }
    } catch {
      setActiveRecordTab('diagnostics');
      setDiagTestName('Baseline Emergency Screen');
      setDiagValue('78');
      setDiagUnit('bpm');
      setDiagLabName('National Health Diagnostic Core');
      setDiagNote(`Auto-logged symptom: ${textToAnalyze}`);
      setAiSuccessMsg('AI generated record entry based on reported symptoms.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Apply Hospital Referral Code on Page 5
  const handleApplyReferral = () => {
    if (!referralCode.trim()) return;
    const clean = referralCode.trim().toUpperCase();
    setAppliedReferral(clean);
    setReferralDiscount(7.5); // 5% of 150 = 7.50
  };

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePatient({
      ...patient,
      fullName: profileName,
      mobileNumber: profilePhone,
      aadhaarNumber: profileAadhaar,
      bloodGroup: profileBlood as any,
      address: profileAddress,
    });
    try {
      await updateCitizenAadhaarAndPhone(profileAadhaar, profilePhone, profileBlood);
    } catch (err) {
      console.warn(err);
    }
    setProfileSavedMsg('Profile details saved and synced to National Health Database!');
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  const copyPatientId = () => {
    navigator.clipboard.writeText(patient.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // Helper for status badge
  const renderStatusPill = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return <span className="status-badge badge-critical">Critical</span>;
      case 'ELEVATED':
      case 'HIGH':
        return <span className="status-badge badge-elevated">Elevated</span>;
      case 'LOW':
        return <span className="status-badge badge-low">Low</span>;
      default:
        return <span className="status-badge badge-normal">Normal</span>;
    }
  };

  const navItems = [
    { id: 1, label: 'My Health Records', icon: <Activity className="w-5 h-5" /> },
    { id: 2, label: 'Emergency Card', icon: <QrCode className="w-5 h-5" /> },
    { id: 3, label: 'Health News', icon: <Globe2 className="w-5 h-5" /> },
    { id: 4, label: 'My Profile', icon: <User className="w-5 h-5" /> },
    { id: 5, label: 'Get Physical Card', icon: <CreditCard className="w-5 h-5" />, isPromo: true },
  ];

  const inputClass = "ms-input";
  const labelClass = "ms-label";
  const selectClass = "ms-select";

  return (
    <div className="w-full space-y-7 font-body">

      {/* ── NAVIGATION STRIP ───────────────────────────────────────────── */}
      <nav className="w-full rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3.5"
           style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar shrink-0">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as 1 | 2 | 3 | 4 | 5)}
                className={`ms-nav-btn press-scale shrink-0 ${
                  isActive ? 'active' : item.isPromo ? 'promo' : 'inactive'
                }`}
              >
                {item.icon}
                <span className="text-[13.5px] sm:text-[15.5px] font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Patient ID chip */}
        <button
          onClick={copyPatientId}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer shrink-0 press-scale"
          style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border)', color: 'var(--color-foreground)' }}
          title="Click to copy your Health ID"
        >
          <span>Health ID: {patient.id}</span>
          {copiedId
            ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--clr-mint)' }} />
            : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />}
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1: DIAGNOSTICS & PATIENT HEALTH CHART
         ═══════════════════════════════════════════════════════════════ */}
      {currentPage === 1 && (
        <div className="space-y-6 animate-pageFadeSlide">

          {/* ── ONBOARDING BANNER FOR INCOMPLETE PROFILE ── */}
          {isProfileIncomplete && (
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white relative overflow-hidden shadow-lg border border-amber-400/30 animate-fadeInUp"
                 style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)' }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-400 text-slate-950">Vault Setup Required</span>
                      <span className="text-xs text-indigo-200">Welcome, {patient.fullName || 'Citizen'}!</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-display font-extrabold text-white">
                      Your Medical Vault Profile Is Empty
                    </h2>
                    <p className="text-xs sm:text-sm text-indigo-100/90 font-body max-w-2xl">
                      To safeguard your life during hospital emergencies and activate your instant QR Trauma card, please fill in your blood group, critical drug allergies, baseline vitals, and emergency contact.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSetupModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl sm:rounded-2xl font-display font-bold text-sm bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-md flex items-center justify-center gap-2 transition cursor-pointer press-scale shrink-0"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Fill Up Health Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* ── VITALS CARD (dark navy — the memorable element) ─────────── */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-9 space-y-5 sm:space-y-7"
               style={{ background: 'var(--clr-navy)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'var(--shadow-xl)' }}>

            {/* Card header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                 style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '18px' }}>
              <div className="space-y-1">
                <div className="flex items-center justify-between sm:justify-start gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="status-dot-green" />
                    <span className="text-xs sm:text-sm font-body font-medium" style={{ color: 'var(--clr-mint)' }}>
                      Live updates
                    </span>
                  </div>
                  {/* Blood Group for mobile - inline badge */}
                  <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">
                    <span className="text-[11px] text-slate-300 font-medium">Blood Group:</span>
                    <span className="text-sm font-black text-[var(--clr-coral)]">{patient.bloodGroup || 'Not Set'}</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white"
                    style={{ fontFamily: 'var(--font-hero)' }}>
                  My Health Records
                </h1>
                <p className="text-sm sm:text-base md:text-lg font-body" style={{ color: '#94A3B8' }}>
                  Test results, medicines, and procedure history in one place.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {isProfileIncomplete && (
                  <button
                    onClick={() => setShowSetupModal(true)}
                    className="hidden sm:flex px-4 py-2 rounded-xl text-xs font-bold font-display bg-white/10 hover:bg-white/15 text-white border border-white/20 transition cursor-pointer items-center gap-1.5 press-scale"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Fill Health Details</span>
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVitalsModalTab('edit');
                      setShowVitalsModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold font-display bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 transition cursor-pointer flex items-center gap-1.5 press-scale"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Update Vitals</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVitalsModalTab('history');
                      setShowVitalsModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold font-display bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 transition cursor-pointer flex items-center gap-1.5 press-scale"
                  >
                    <History className="w-3.5 h-3.5 text-amber-300" />
                    <span>History ({patient.vitalsHistory?.length || 0})</span>
                  </button>
                </div>
                <div className="hidden sm:block text-right pl-3 border-l border-white/10">
                  <p className="text-xs font-body font-medium mb-1" style={{ color: '#94A3B8' }}>Blood Group</p>
                  <span className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--clr-coral)', fontFamily: 'var(--font-hero)' }}>
                    {patient.bloodGroup || '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Vitals Cards Grid — on dark background (Clickable & Editable) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {/* Heart Rate */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setVitalsModalTab('edit');
                  setShowVitalsModal(true);
                }}
                className="rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2 sm:space-y-3 card-hover cursor-pointer animate-countUp delay-100 group relative transition-all hover:border-rose-400/40"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-base font-display font-bold truncate group-hover:text-white" style={{ color: '#CBD5E1' }}>
                    Heart Rate
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                       style={{ background: 'rgba(244,63,94,0.15)' }}>
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-heartbeat" style={{ color: '#F43F5E' }} />
                  </div>
                </div>
                <div>
                  <span className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tnum text-white">
                    {patient.vitals?.heartRate && patient.vitals.heartRate > 0 ? patient.vitals.heartRate : '--'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold ml-1.5" style={{ color: '#94A3B8' }}>bpm</span>
                </div>
                <div className="flex items-center justify-between">
                  {patient.vitals?.heartRate && patient.vitals.heartRate > 0 ? (
                    <span className="status-badge badge-normal">Normal</span>
                  ) : (
                    <span className="status-badge badge-low">Unrecorded</span>
                  )}
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-rose-300" /> Edit
                  </span>
                </div>
              </div>

              {/* Blood Pressure */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setVitalsModalTab('edit');
                  setShowVitalsModal(true);
                }}
                className="rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2 sm:space-y-3 card-hover cursor-pointer animate-countUp delay-200 group relative transition-all hover:border-amber-400/40"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-base font-display font-bold truncate group-hover:text-white" style={{ color: '#CBD5E1' }}>
                    Blood Pressure
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                       style={{ background: 'rgba(245,158,11,0.15)' }}>
                    <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#F59E0B' }} />
                  </div>
                </div>
                <div>
                  <span className="text-xl sm:text-3xl lg:text-4xl font-display font-black tnum text-white truncate block">
                    {patient.vitals?.bloodPressure && patient.vitals.bloodPressure !== '--/--' && patient.vitals.bloodPressure !== '--'
                      ? patient.vitals.bloodPressure.replace(/\s*mmHg/i, '').trim()
                      : '--'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold" style={{ color: '#94A3B8' }}>mmHg</span>
                </div>
                <div className="flex items-center justify-between">
                  {patient.vitals?.bloodPressure && patient.vitals.bloodPressure !== '--/--' && patient.vitals.bloodPressure !== '--' ? (
                    <span className="status-badge badge-elevated">Recorded</span>
                  ) : (
                    <span className="status-badge badge-low">Unrecorded</span>
                  )}
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-amber-300" /> Edit
                  </span>
                </div>
              </div>

              {/* Oxygen Saturation */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setVitalsModalTab('edit');
                  setShowVitalsModal(true);
                }}
                className="rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2 sm:space-y-3 card-hover cursor-pointer animate-countUp delay-300 group relative transition-all hover:border-sky-400/40"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-base font-display font-bold truncate group-hover:text-white" style={{ color: '#CBD5E1' }}>
                    Oxygen Level
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                       style={{ background: 'rgba(56,189,248,0.15)' }}>
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#38BDF8' }} />
                  </div>
                </div>
                <div>
                  <span className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tnum text-white">
                    {patient.vitals?.spO2 && patient.vitals.spO2 > 0 ? (
                      <>{patient.vitals.spO2}<span className="text-base sm:text-2xl">%</span></>
                    ) : (
                      '--'
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {patient.vitals?.spO2 && patient.vitals.spO2 > 0 ? (
                    <span className="status-badge badge-normal">Good</span>
                  ) : (
                    <span className="status-badge badge-low">Unrecorded</span>
                  )}
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-sky-300" /> Edit
                  </span>
                </div>
              </div>

              {/* Blood Glucose */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setVitalsModalTab('edit');
                  setShowVitalsModal(true);
                }}
                className="rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2 sm:space-y-3 card-hover cursor-pointer animate-countUp delay-400 group relative transition-all hover:border-orange-400/40"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-base font-display font-bold truncate group-hover:text-white" style={{ color: '#CBD5E1' }}>
                    Blood Sugar
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                       style={{ background: 'rgba(245,132,92,0.15)' }}>
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--clr-coral)' }} />
                  </div>
                </div>
                <div>
                  <span className="text-xl sm:text-3xl lg:text-4xl font-display font-black tnum text-white truncate block">
                    {patient.vitals?.bloodSugar && patient.vitals.bloodSugar !== '--'
                      ? patient.vitals.bloodSugar.replace(/\s*mg\/dL/i, '').replace(/\(Random\)/i, '').trim()
                      : '--'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold" style={{ color: '#94A3B8' }}>mg/dL</span>
                </div>
                <div className="flex items-center justify-between">
                  {patient.vitals?.bloodSugar && patient.vitals.bloodSugar !== '--' ? (
                    <span className="status-badge badge-elevated">Recorded</span>
                  ) : (
                    <span className="status-badge badge-low">Unrecorded</span>
                  )}
                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-orange-300" /> Edit
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Summary Columns Grid: Test Results, Medicines, Procedures, Allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-5"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '6px' }}>

              {/* Column 1: Test Results */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                       style={{ background: 'rgba(56,189,248,0.15)' }}>
                    <Activity className="w-4 h-4" style={{ color: '#38BDF8' }} />
                  </div>
                  <span className="text-base font-display font-bold" style={{ color: '#F1F5F9' }}>
                    Test Results ({patient.diagnostics?.length || 0})
                  </span>
                </div>

                <div className="space-y-2.5">
                  {patient.diagnostics && patient.diagnostics.length > 0 ? (
                    patient.diagnostics.map((d: any) => (
                      <div key={d.id} className="p-3.5 rounded-2xl space-y-2"
                           style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display font-bold text-sm sm:text-base leading-tight" style={{ color: '#F8FAFC' }}>{d.testName}</span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono shrink-0"
                                style={{ background: 'rgba(245,158,11,0.15)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.25)' }}>
                            {d.value} {d.unit}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium" style={{ color: '#94A3B8' }}>{d.laboratoryName} — {d.dateRecorded}</p>
                        {d.specialNote && (
                          <p className="text-xs sm:text-sm italic p-2.5 rounded-xl leading-relaxed" style={{ background: 'rgba(255,255,255,0.04)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {d.specialNote}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-2xl text-center space-y-2"
                         style={{ background: 'rgba(255,255,200,0.02)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                      <Activity className="w-6 h-6 mx-auto text-slate-400" />
                      <p className="text-sm font-semibold text-slate-200">No Lab Tests Recorded Yet</p>
                      <p className="text-xs text-slate-400">Add lab or pathology reports using the form below.</p>
                      <button
                        onClick={() => { setActiveRecordTab('diagnostics'); document.getElementById('record-form-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="mt-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        + Add Test Result
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Medications */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                       style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <Stethoscope className="w-4 h-4" style={{ color: 'var(--clr-mint)' }} />
                  </div>
                  <span className="text-base font-display font-bold" style={{ color: '#F1F5F9' }}>
                    Medicines ({patient.prescriptions?.length || 0})
                  </span>
                </div>

                <div className="space-y-2.5">
                  {patient.prescriptions && patient.prescriptions.length > 0 ? (
                    patient.prescriptions.map((p: any) => (
                      <div key={p.id} className="p-3.5 rounded-2xl space-y-2"
                           style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display font-bold text-sm sm:text-base" style={{ color: '#F8FAFC' }}>{p.medicationName}</span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono shrink-0"
                                style={{ background: 'rgba(16,185,129,0.15)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.25)' }}>
                            {p.dosage}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium" style={{ color: '#94A3B8' }}>{p.prescribedBy} — {p.frequency}</p>
                        {p.notes && (
                          <p className="text-xs sm:text-sm italic p-2.5 rounded-xl leading-relaxed" style={{ background: 'rgba(255,255,255,0.04)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {p.notes}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-2xl text-center space-y-2"
                         style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                      <Stethoscope className="w-6 h-6 mx-auto text-slate-400" />
                      <p className="text-sm font-semibold text-slate-200">No Prescriptions Logged</p>
                      <p className="text-xs text-slate-400">Keep track of your active daily medications.</p>
                      <button
                        onClick={() => { setActiveRecordTab('prescriptions'); document.getElementById('record-form-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="mt-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                      >
                        + Add Medication
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 3: Procedures */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                       style={{ background: 'rgba(245,132,92,0.15)' }}>
                    <Scissors className="w-4 h-4" style={{ color: 'var(--clr-coral)' }} />
                  </div>
                  <span className="text-base font-display font-bold" style={{ color: '#F1F5F9' }}>
                    Procedures ({patient.surgicalLogs?.length || 0})
                  </span>
                </div>

                <div className="space-y-2.5">
                  {patient.surgicalLogs && patient.surgicalLogs.length > 0 ? (
                    patient.surgicalLogs.map((s: any) => (
                      <div key={s.id} className="p-3.5 rounded-2xl space-y-2"
                           style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-display font-bold text-sm sm:text-base leading-tight" style={{ color: '#F8FAFC' }}>{s.procedureName}</span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0"
                                style={{ background: 'rgba(245,132,92,0.15)', color: 'var(--clr-coral)', border: '1px solid rgba(245,132,92,0.25)' }}>
                            {s.surgeryDate}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium" style={{ color: '#94A3B8' }}>{s.operatingSurgeon} · {s.hospitalOfSurgery}</p>
                        {s.implantsUsed && (
                          <p className="text-xs font-mono p-2 rounded-lg" style={{ background: 'rgba(245,132,92,0.08)', color: 'var(--clr-coral)', border: '1px solid rgba(245,132,92,0.18)' }}>
                            Implant: {s.implantsUsed}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-2xl text-center space-y-2"
                         style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                      <Scissors className="w-6 h-6 mx-auto text-slate-400" />
                      <p className="text-sm font-semibold text-slate-200">No Surgical History</p>
                      <p className="text-xs text-slate-400">No past surgeries or implants recorded.</p>
                      <button
                        onClick={() => { setActiveRecordTab('surgical'); document.getElementById('record-form-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="mt-1 text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        + Add Procedure Log
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 4: Allergies */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                         style={{ background: 'rgba(239,68,68,0.15)' }}>
                      <ShieldAlert className="w-4 h-4" style={{ color: '#F87171' }} />
                    </div>
                    <span className="text-base font-display font-bold" style={{ color: '#F1F5F9' }}>
                      Allergies ({patient.allergies?.length || 0})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRecordTab('allergies');
                      document.getElementById('record-form-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2.5">
                  {patient.allergies && patient.allergies.length > 0 ? (
                    patient.allergies.map((a: any, idx: number) => {
                      const isCritical = a.severity === 'CRITICAL';
                      const isModerate = a.severity === 'MODERATE';
                      return (
                        <div key={idx} className="p-3.5 rounded-2xl space-y-2 relative group"
                             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-display font-bold text-sm sm:text-base leading-tight" style={{ color: '#F8FAFC' }}>
                              {a.allergen}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold font-mono uppercase"
                                    style={{
                                      background: isCritical ? 'rgba(239,68,68,0.2)' : isModerate ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
                                      color: isCritical ? '#FCA5A5' : isModerate ? '#FCD34D' : '#93C5FD',
                                      border: `1px solid ${isCritical ? 'rgba(239,68,68,0.35)' : isModerate ? 'rgba(245,158,11,0.35)' : 'rgba(59,130,246,0.35)'}`
                                    }}>
                                {a.severity || 'RECORDED'}
                              </span>
                              <button
                                type="button"
                                title={`Remove ${a.allergen}`}
                                onClick={() => handleDeleteAllergy(a.allergen)}
                                className="opacity-70 hover:opacity-100 hover:bg-white/10 p-1 rounded transition cursor-pointer text-slate-400 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          {a.reaction && (
                            <p className="text-xs sm:text-sm font-medium" style={{ color: '#CBD5E1' }}>
                              Reaction: {a.reaction}
                            </p>
                          )}
                          {a.subCategory && (
                            <p className="text-xs italic p-2 rounded-lg leading-relaxed" style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.06)' }}>
                              Note: {a.subCategory}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : patient.hasNoKnownAllergies || patient.hasCompletedSetup ? (
                    <div className="p-5 rounded-2xl text-center space-y-2"
                         style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-emerald-300">No Known Allergies (NKA) Documented</p>
                      <p className="text-xs text-slate-300">Patient profile recorded as having no active drug, chemical, or food allergies.</p>
                      <button
                        onClick={() => { setActiveRecordTab('allergies'); document.getElementById('record-form-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="mt-1 text-xs font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer inline-block"
                      >
                        + Report New Allergy
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl text-center space-y-2"
                         style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                      <ShieldAlert className="w-6 h-6 mx-auto text-slate-400" />
                      <p className="text-sm font-semibold text-slate-200">No Documented Allergies</p>
                      <p className="text-xs text-slate-400">Add drug, food, or chemical sensitivities to protect against adverse events.</p>
                      <button
                        onClick={() => { setActiveRecordTab('allergies'); document.getElementById('record-form-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="mt-1 text-xs font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        + Add Allergy
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* AI SYMPTOM ASSISTANT */}
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white overflow-hidden space-y-4 sm:space-y-5"
               style={{ background: 'linear-gradient(135deg, var(--clr-navy) 0%, #1A2F5A 50%, #162244 100%)', border: '1px solid rgba(245,132,92,0.25)', boxShadow: 'var(--shadow-lg)' }}>
            {/* Coral glow accent top-right */}
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, var(--clr-coral) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
                     style={{ background: 'rgba(245,132,92,0.15)', border: '1px solid rgba(245,132,92,0.25)' }}>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--clr-coral)' }} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
                    AI Health Symptom Assistant
                  </h2>
                  <p className="text-xs sm:text-base" style={{ color: '#CBD5E1' }}>Describe symptoms — AI fills your health forms for you</p>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <input
                value={aiSymptomsInput}
                onChange={(e) => setAiSymptomsInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAiSymptomAnalyze(); }}
                placeholder="e.g. High blood sugar 145 mg/dL, fever, prescribed Metformin..."
                className="flex-1 h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-body outline-none transition text-white placeholder:text-slate-400"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)' }}
              />

              <button
                onClick={() => handleAiSymptomAnalyze()}
                disabled={isAiProcessing || !aiSymptomsInput.trim()}
                className="h-12 sm:h-14 px-5 sm:px-7 rounded-xl sm:rounded-2xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer press-scale shrink-0"
                style={{
                  background: 'var(--clr-coral)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(245,132,92,0.35)',
                  opacity: (isAiProcessing || !aiSymptomsInput.trim()) ? 0.5 : 1,
                }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{isAiProcessing ? 'Analysing...' : 'Fill my records'}</span>
              </button>
            </div>

            {/* Quick examples */}
            <div className="relative z-10 flex flex-wrap items-center gap-2.5 text-sm">
              <span className="font-bold text-slate-300">Try asking:</span>
              {[
                'High fasting blood sugar 145 mg/dL',
                'Fever — prescribed Paracetamol 650mg',
                'Coronary stent implant at AIIMS',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setAiSymptomsInput(chip); handleAiSymptomAnalyze(chip); }}
                  className="px-3.5 py-1.5 rounded-xl transition cursor-pointer font-medium hover:bg-white/15"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: '#E2E8F0' }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {aiSuccessMsg && (
              <div className="relative z-10 flex items-center gap-3 p-4 rounded-2xl font-semibold text-sm animate-fadeInUp"
                   style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.30)', color: '#6EE7B7' }}>
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--clr-mint)' }} />
                <span>{aiSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* ADD / UPDATE HEALTH RECORD */}
          <div id="record-form-section" className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-7"
               style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="pb-3.5 sm:pb-4" style={{ borderBottom: '1.5px solid var(--color-border)' }}>
              <h2 className="text-xl sm:text-3xl font-display font-extrabold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                Add to my health records
              </h2>
              <p className="text-xs sm:text-base font-body mt-1" style={{ color: 'var(--color-foreground-muted)' }}>
                Choose a category below to add a new test result, medicine, or procedure.
              </p>
            </div>

            {/* Sub-Form Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {[
                { id: 'diagnostics', label: 'Test results & lab reports', shortLabel: 'Test Results', icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" /> },
                { id: 'prescriptions', label: 'Medicines & prescriptions', shortLabel: 'Medicines', icon: <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" /> },
                { id: 'surgical', label: 'Surgeries & procedures', shortLabel: 'Surgeries', icon: <Scissors className="w-4 h-4 sm:w-5 sm:h-5" /> },
                { id: 'allergies', label: 'Allergies & reactions', shortLabel: 'Allergies', icon: <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" /> },
              ].map((tab) => {
                const isActive = activeRecordTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRecordTab(tab.id as typeof activeRecordTab)}
                    className="flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-[15.5px] font-display font-bold transition cursor-pointer press-scale"
                    style={{
                      background: isActive ? 'var(--clr-coral)' : 'var(--color-background)',
                      color: isActive ? 'white' : 'var(--color-foreground)',
                      border: `1.5px solid ${isActive ? 'var(--clr-coral)' : 'var(--color-border)'}`,
                      boxShadow: isActive ? '0 4px 16px rgba(245,132,92,0.30)' : 'none',
                    }}
                  >
                    {tab.icon}
                    <span className="inline sm:hidden">{tab.shortLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* FORM 1: DIAGNOSTICS */}
            {activeRecordTab === 'diagnostics' && (
              <form onSubmit={handleAddDiagnostic} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className={labelClass}>Diagnostic Test Name *</label>
                    <input
                      value={diagTestName}
                      onChange={(e) => setDiagTestName(e.target.value)}
                      placeholder="e.g. Serum Creatinine / HbA1c"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className={labelClass}>Observed Value &amp; Unit *</label>
                    <div className="flex gap-2">
                      <input
                        value={diagValue}
                        onChange={(e) => setDiagValue(e.target.value)}
                        placeholder="1.1"
                        className={`${inputClass} flex-1`}
                        required
                      />
                      <input
                        value={diagUnit}
                        onChange={(e) => setDiagUnit(e.target.value)}
                        placeholder="mg/dL"
                        className="w-24 h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label className={labelClass}>Reference Range</label>
                    <input
                      value={diagRange}
                      onChange={(e) => setDiagRange(e.target.value)}
                      placeholder="0.7 - 1.3 mg/dL"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Laboratory Name *</label>
                    <input
                      value={diagLabName}
                      onChange={(e) => setDiagLabName(e.target.value)}
                      placeholder="e.g. Dr. Lal PathLabs / SRL Diagnostics"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Upload Report Picture</label>
                    <div className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-500 shadow-xs">
                      <span className="truncate">Choose lab report (PDF/IMG)</span>
                      <Upload className="w-4 h-4 text-sky-600" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Result Status</label>
                    <select
                      value={diagStatus}
                      onChange={(e) => setDiagStatus(e.target.value as any)}
                      className={selectClass}
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="ELEVATED">Elevated / High</option>
                      <option value="LOW">Low</option>
                      <option value="CRITICAL">Critical / Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Special Note (Editable later anytime)</label>
                  <textarea
                    rows={2}
                    value={diagNote}
                    onChange={(e) => setDiagNote(e.target.value)}
                    placeholder="Add special instructions or clinical notes regarding this diagnostic test..."
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 outline-none font-body shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!diagTestName || !diagValue}
                  className="px-6 py-3 rounded-xl text-white font-display font-semibold text-sm shadow-md flex items-center gap-2 cursor-pointer transition disabled:opacity-50 press-scale"
                  style={{ background: 'var(--clr-coral)', boxShadow: '0 3px 12px rgba(245,132,92,0.30)' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Diagnostic Record to Health Vault</span>
                </button>
              </form>
            )}

            {/* FORM 2: PRESCRIPTIONS */}
            {activeRecordTab === 'prescriptions' && (
              <form onSubmit={handleAddPrescription} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Medicine Name *</label>
                    <input
                      value={rxMedicine}
                      onChange={(e) => setRxMedicine(e.target.value)}
                      placeholder="e.g. Amlodipine 5mg"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Dosage *</label>
                    <input
                      value={rxDose}
                      onChange={(e) => setRxDose(e.target.value)}
                      placeholder="e.g. 1 Tablet"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Frequency</label>
                    <select
                      value={rxFreq}
                      onChange={(e) => setRxFreq(e.target.value)}
                      className={selectClass}
                    >
                      <option>Once Daily in the Morning</option>
                      <option>Once Daily at Night</option>
                      <option>Twice Daily after meals</option>
                      <option>Thrice Daily</option>
                      <option>As needed (SOS)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Doctor Name</label>
                    <input
                      value={rxDoctor}
                      onChange={(e) => setRxDoctor(e.target.value)}
                      placeholder="e.g. Dr. Vivek Mehra (Cardiologist)"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Hospital or Clinic</label>
                    <input
                      value={rxClinic}
                      onChange={(e) => setRxClinic(e.target.value)}
                      placeholder="e.g. AIIMS Delhi"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Special Instructions / Note</label>
                  <textarea
                    rows={2}
                    value={rxNote}
                    onChange={(e) => setRxNote(e.target.value)}
                    placeholder="e.g. Target BP < 130/80 mmHg. Take with full glass of water."
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 outline-none font-body shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!rxMedicine || !rxDose}
                  className="px-6 py-3 rounded-xl text-white font-display font-semibold text-sm shadow-md flex items-center gap-2 cursor-pointer transition disabled:opacity-50 press-scale"
                  style={{ background: 'var(--clr-mint)', boxShadow: '0 3px 12px rgba(16,185,129,0.25)' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Prescription to Health Vault</span>
                </button>
              </form>
            )}

            {/* FORM 3: SURGICAL */}
            {activeRecordTab === 'surgical' && (
              <form onSubmit={handleAddSurgical} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Procedure / Surgery Name *</label>
                    <input
                      value={surgProcedure}
                      onChange={(e) => setSurgProcedure(e.target.value)}
                      placeholder="e.g. Coronary Angioplasty with Drug-Eluting Stent"
                      className={inputClass}
                      required
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Operating Surgeon</label>
                    <input
                      value={surgSurgeon}
                      onChange={(e) => setSurgSurgeon(e.target.value)}
                      placeholder="e.g. Dr. Vivek Mehra (MD DM)"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Hospital of Surgery</label>
                    <input
                      value={surgHospital}
                      onChange={(e) => setSurgHospital(e.target.value)}
                      placeholder="e.g. AIIMS New Delhi Trauma Center"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Implants / Prosthetics Used</label>
                  <input
                    value={surgImplants}
                    onChange={(e) => setSurgImplants(e.target.value)}
                    placeholder="e.g. Xience Sierra 3.0x28mm Everolimus-Eluting Stent"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Special Clinical Directive / Post-Op Notes</label>
                  <textarea
                    rows={2}
                    value={surgNote}
                    onChange={(e) => setSurgNote(e.target.value)}
                    placeholder="e.g. Dual antiplatelet therapy mandatory. No contrast angiography without hydration."
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 outline-none font-body shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!surgProcedure}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-semibold text-sm shadow-md shadow-purple-600/20 flex items-center gap-2 cursor-pointer transition disabled:opacity-50 press-scale"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Surgical Log to Health Vault</span>
                </button>
              </form>
            )}

            {/* FORM 4: ALLERGIES */}
            {activeRecordTab === 'allergies' && (
              <form onSubmit={handleAddAllergy} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Allergen / Substance *</label>
                    <input
                      value={allergyName}
                      onChange={(e) => setAllergyName(e.target.value)}
                      placeholder="e.g. Penicillin, Peanuts, Sulfa Drugs, Latex, Shellfish"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Severity Rating *</label>
                    <select
                      value={allergySeverity}
                      onChange={(e) => setAllergySeverity(e.target.value as any)}
                      className={selectClass}
                    >
                      <option value="CRITICAL">Critical (Life-threatening / Anaphylaxis)</option>
                      <option value="MODERATE">Moderate (Breathing distress / Swelling)</option>
                      <option value="MILD">Mild (Rash, itching, nausea)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Observed Reaction / Symptoms *</label>
                    <input
                      value={allergyReaction}
                      onChange={(e) => setAllergyReaction(e.target.value)}
                      placeholder="e.g. Bronchospasm, facial edema, urticaria"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Clinical Notes / Context</label>
                    <input
                      value={allergyNotes}
                      onChange={(e) => setAllergyNotes(e.target.value)}
                      placeholder="e.g. Discovered during 2021 hospital admission; avoid cephalosporins"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!allergyName.trim()}
                  className="px-6 py-3 rounded-xl text-white font-display font-semibold text-sm shadow-md flex items-center gap-2 cursor-pointer transition disabled:opacity-50 press-scale"
                  style={{ background: '#E11D48', boxShadow: '0 3px 12px rgba(225,29,72,0.30)' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Allergy Record to Health Vault</span>
                </button>
              </form>
            )}

          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2: EMERGENCY QR CODE & E-CARD
         ═══════════════════════════════════════════════════════════════ */}
      {currentPage === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start animate-pageFadeSlide">

          {/* LEFT: CRITICAL EMERGENCY QR CARD */}
          <div className="lg:col-span-6 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6 text-center flex flex-col items-center"
               style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-sm font-display font-semibold text-rose-600">For medical emergencies</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                Patient Emergency QR Code
              </h2>
              <p className="text-xs sm:text-base font-body max-w-md" style={{ color: 'var(--color-foreground-muted)' }}>
                Paramedics scan this QR for instant access to allergies, blood group, and emergency contacts during trauma.
              </p>
            </div>

            {/* Vector SVG Patient QR Code Component with Center Logo */}
            <div className="w-full flex justify-center py-2 sm:py-3">
              <PatientQRCode
                patient={patient}
                patientId={patient.id}
                patientName={patient.fullName}
                bloodGroup={patient.bloodGroup}
                mobileNumber={patient.emergencyContacts?.[0]?.phone || '9876543210'}
                size={220}
              />
            </div>

            {/* Security Verification Bar */}
            <div className="w-full pt-3.5 sm:pt-4 border-t border-[var(--color-border)] flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-center"
                 style={{ color: 'var(--color-foreground-muted)' }}>
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Encrypted with ABDM 256-bit Token</span>
            </div>
          </div>

          {/* RIGHT: DIGITAL E-WALLET CARD & PHYSICAL ORDER PROMO */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">

            {/* Digital Health Card */}
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6"
                 style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-3xl font-display font-extrabold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                    Digital E-Wallet Health Card
                  </h2>
                  <p className="text-xs sm:text-base font-body mt-1" style={{ color: 'var(--color-foreground-muted)' }}>
                    Download and save in your phone wallet or print
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-bold text-white transition cursor-pointer shadow-md press-scale shrink-0"
                  style={{ background: 'var(--clr-coral)', boxShadow: '0 4px 14px rgba(245, 132, 92, 0.35)' }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download E-Card (PDF)</span>
                </button>
              </div>

              {/* Physical/Digital Card Preview */}
              <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#0B1528] via-[#112240] to-[#0A2540] text-white shadow-xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-white/20">
                      <img src="/medisync-logo.jpg" alt="MediSync" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm tracking-tight text-white block leading-none">
                        MediSync Emergency Card
                      </span>
                      <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-wider">
                        National Health Registry
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    BLOOD: {patient.bloodGroup}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-mono block">Patient Name</span>
                    <p className="text-base font-display font-bold text-white">{patient.fullName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-slate-400 font-mono block">Unique Health ID</span>
                    <p className="text-xs font-mono font-bold text-cyan-300">{patient.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-mono block">Critical Allergies</span>
                    <p className="text-rose-300 font-semibold truncate">
                      {patient.allergies && patient.allergies.length > 0 ? patient.allergies.map((a) => a.allergen).join(', ') : 'None Recorded'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-slate-400 font-mono block">Emergency Contact</span>
                    <p className="text-slate-200 font-mono">{patient.emergencyContacts?.[0]?.phone || patient.mobileNumber || 'Not recorded'}</p>
                  </div>
                </div>
              </div>

              {/* Physical Card Promo Section */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-600 text-white">
                      Official Physical Copy
                    </span>
                    <span className="text-xs font-bold text-slate-800">Only ₹150 (Free Delivery)</span>
                  </div>
                  <p className="text-xs text-slate-600 font-body">
                    Get an indestructible waterproof PVC card delivered to your home. Works when your phone battery is dead!
                  </p>
                </div>

                <button
                  onClick={() => setCurrentPage(5)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-display font-bold shrink-0 flex items-center gap-1.5 shadow-sm transition cursor-pointer press-scale"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shop Now &rarr;</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 3: MEDICAL NEWS & HELPLINES
         ═══════════════════════════════════════════════════════════════ */}
      {currentPage === 3 && (
        <div className="space-y-6 animate-pageFadeSlide">

          {/* ── FAST SCROLLING HEADLINES TICKER ────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--clr-navy)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center">
              <div className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 border-r border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-display font-bold text-red-400 whitespace-nowrap">LIVE</span>
              </div>
              <div className="overflow-hidden flex-1 [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]">
                <div className="inline-flex gap-10 whitespace-nowrap py-2.5 px-2" style={{ animation: 'marquee 20s linear infinite' }}>
                  {[
                    { tag: 'DRUG ALERT', text: 'CDSCO issues Class-II recall on Metformin 850mg batch MF-0921 for dissolution failure', c: 0 },
                    { tag: 'OUTBREAK', text: 'Dengue cases surge 38% in South India ahead of monsoon — ICMR urges vector surveillance', c: 1 },
                    { tag: 'POLICY', text: 'Ayushman Bharat PM-JAY expands to cover 22 new tertiary oncology procedures from Oct 2026', c: 2 },
                    { tag: 'RESEARCH', text: 'AIIMS Delhi links air-quality index below 50 to 31% reduction in acute cardiac events', c: 3 },
                    { tag: 'ADVISORY', text: 'NMC mandates digital prescription with QR code for Schedule H and H1 drugs by Dec 2026', c: 4 },
                    { tag: 'TRIAL', text: 'Phase III universal flu mRNA vaccine shows 94% cross-clade protection — Lancet 2026', c: 5 },
                    { tag: 'DRUG ALERT', text: 'CDSCO issues Class-II recall on Metformin 850mg batch MF-0921 for dissolution failure', c: 0 },
                    { tag: 'OUTBREAK', text: 'Dengue cases surge 38% in South India ahead of monsoon — ICMR urges vector surveillance', c: 1 },
                    { tag: 'POLICY', text: 'Ayushman Bharat PM-JAY expands to cover 22 new tertiary oncology procedures from Oct 2026', c: 2 },
                    { tag: 'RESEARCH', text: 'AIIMS Delhi links air-quality index below 50 to 31% reduction in acute cardiac events', c: 3 },
                  ].map((item, i) => {
                    const colors = [
                      { bg: 'rgba(239,68,68,0.25)', fg: '#FCA5A5' },
                      { bg: 'rgba(245,158,11,0.25)', fg: '#FCD34D' },
                      { bg: 'rgba(16,185,129,0.20)', fg: '#6EE7B7' },
                      { bg: 'rgba(56,189,248,0.20)', fg: '#7DD3FC' },
                      { bg: 'rgba(245,132,92,0.25)', fg: '#FDBA74' },
                      { bg: 'rgba(139,92,246,0.20)', fg: '#C4B5FD' },
                    ];
                    const col = colors[item.c % colors.length];
                    return (
                      <span key={i} className="inline-flex items-center gap-2 text-[12px]">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono shrink-0"
                              style={{ background: col.bg, color: col.fg }}>{item.tag}</span>
                        <span className="text-slate-200 font-body">{item.text}</span>
                        <span className="text-slate-600 mx-2">·</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 24/7 RAPID DISPATCH DIRECTORY */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6"
               style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-3.5 sm:pb-4 gap-2">
              <div className="space-y-0.5">
                <h2 className="text-xl sm:text-3xl font-display font-extrabold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                  National Emergency Contacts
                </h2>
                <p className="text-sm font-body" style={{ color: 'var(--color-foreground-muted)' }}>Toll-free, available 24 hours a day across India</p>
              </div>
              <span className="hidden sm:block text-xs font-display font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">Pan-India Toll-Free</span>
            </div>

            {/* 4 Dispatch Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {/* 112 */}
              <a
                href="tel:112"
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all space-y-3 block group cursor-pointer press-scale animate-slideInUp delay-100"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-semibold text-slate-300">National Emergency</span>
                  <Phone className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight">112</p>
                <p className="text-xs text-slate-400 font-body">Police, Fire &amp; Trauma</p>
              </a>

              {/* 102 / 108 */}
              <a
                href="tel:108"
                className="p-4 sm:p-5 rounded-2xl bg-sky-950 hover:bg-sky-900 border border-sky-800 transition-all space-y-3 block group cursor-pointer press-scale animate-slideInUp delay-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-semibold text-sky-300">Ambulance Grid</span>
                  <Phone className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">102 / 108</p>
                <p className="text-xs text-sky-300/70 font-body">Emergency Patient Transport</p>
              </a>

              {/* 104 */}
              <a
                href="tel:104"
                className="p-4 sm:p-5 rounded-2xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 transition-all space-y-3 block group cursor-pointer press-scale animate-slideInUp delay-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-semibold text-emerald-300">Blood Bank Helpline</span>
                  <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight">104</p>
                <p className="text-xs text-emerald-300/70 font-body">Blood Availability &amp; Donors</p>
              </a>

              {/* 1800-116-117 */}
              <a
                href="tel:1800116117"
                className="p-4 sm:p-5 rounded-2xl bg-violet-950 hover:bg-violet-900 border border-violet-800 transition-all space-y-3 block group cursor-pointer press-scale animate-slideInUp delay-400"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-semibold text-violet-300">Poison Control</span>
                  <Phone className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight pt-1">1800-116-117</p>
                <p className="text-xs text-violet-300/70 font-body">Toxicology &amp; Antidotes</p>
              </a>
            </div>

            {/* Epidemic Watch Alert Banner */}
            <div className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
                 style={{ background: 'rgba(220, 38, 38, 0.06)', borderColor: 'rgba(220, 38, 38, 0.25)' }}>
              <div className="flex items-center gap-3 font-medium" style={{ color: '#7F1D1D' }}>
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>
                  <strong>Global Epidemic Watch Level 2:</strong> Avian Influenza A(H5N1) Clade 2.3.4.4b Spillover Monitoring — WHO/CDC Advisory #094-Rev4
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-display font-bold text-xs">
                  High vigilance
                </span>
              </div>
            </div>
          </div>

          {/* LIVE MEDICAL WIRE */}
          <div className="rounded-3xl p-5 sm:p-8 shadow-sm space-y-5"
               style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                  Health Wire
                </h3>
                <span className="text-xs font-display font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Live feed</span>
              </div>
              <span className="text-xs font-mono text-slate-400 font-medium hidden sm:block">Encrypted FHIR v4.3</span>
            </div>

            <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <LiveNewsMarquee />
            </div>

            <GlobalMedicalNews />
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 4: PROFILE & AUTHENTICATION
         ═══════════════════════════════════════════════════════════════ */}
      {currentPage === 4 && (
        <div className="max-w-4xl mx-auto space-y-6 animate-pageFadeSlide">

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm space-y-5 sm:space-y-7"
               style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-3.5 sm:pb-4 gap-3">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-3xl font-display font-extrabold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                  Your profile &amp; account settings
                </h2>
                <p className="text-xs sm:text-base font-body" style={{ color: 'var(--color-foreground-muted)' }}>
                  Manage your verified legal identity, Aadhaar number, and emergency contact details.
                </p>
              </div>

              <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-display font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Vault active
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Legal Name</label>
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Registered Email Address</label>
                  <input
                    value={user?.email || 'citizen@medisync.gov.in'}
                    disabled
                    className={`${inputClass} bg-slate-50 text-slate-500 cursor-not-allowed`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>12-Digit Aadhaar Number *</label>
                  <input
                    value={profileAadhaar}
                    onChange={(e) => setProfileAadhaar(e.target.value)}
                    placeholder="234567890123"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Mobile Number (+91) *</label>
                  <input
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="9876543210"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Blood Group</label>
                  <select
                    value={profileBlood}
                    onChange={(e) => setProfileBlood(e.target.value as any)}
                    className={selectClass}
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Residential Address</label>
                <input
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-white font-display font-semibold text-sm shadow-md flex items-center gap-2 cursor-pointer transition press-scale"
                  style={{ background: 'var(--clr-coral)', boxShadow: '0 3px 12px rgba(245,132,92,0.30)' }}
                >
                  <Check className="w-4 h-4" />
                  <span>Save changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => { logOut(); }}
                  className="px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-display font-semibold transition cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out of Account</span>
                </button>
              </div>

              {profileSavedMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSavedMsg}</span>
                </div>
              )}
            </form>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 5: ORDER PHYSICAL CARD (₹150)
         ═══════════════════════════════════════════════════════════════ */}
      {currentPage === 5 && (
        <div className="max-w-4xl mx-auto space-y-6 animate-pageFadeSlide">

          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm space-y-5 sm:space-y-7"
               style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
            <div className="border-b border-[var(--color-border)] pb-3.5 sm:pb-4 space-y-1.5">
              <h2 className="text-xl sm:text-3xl font-display font-extrabold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
                Order your emergency wallet card
              </h2>
              <p className="text-xs sm:text-base font-body" style={{ color: 'var(--color-foreground-muted)' }}>
                Indestructible, waterproof PVC card with contactless NFC chip and indelibly laser-etched trauma QR. Works when phones are dead, locked, or broken.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full text-xs font-display font-bold bg-rose-50 text-rose-700 border border-rose-200">₹150</span>
                <span className="text-xs font-body text-slate-500">Free delivery pan-India · Ships in 5–7 days</span>
              </div>
            </div>

            {/* Front & Back Card Visual */}
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-br from-[#0B1528] via-[#112240] to-[#0A2540] text-white shadow-2xl border border-white/10 space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-white/20">
                    <img src="/medisync-logo.jpg" alt="MediSync" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-base tracking-tight text-white block leading-none">
                      MediSync National Trauma Card
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 uppercase">
                      Contactless NFC + Indelible Vector QR
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    NFC ARMORED
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    DONOR YES
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-mono block">Patient Legal Identity</span>
                    <h3 className="text-2xl font-display font-black text-white">{patient.fullName}</h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {patient.id} • DOB: {patient.dob}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono font-bold text-xs">
                      BLOOD: {patient.bloodGroup}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 text-rose-300 border border-white/10 font-mono text-xs truncate max-w-[200px]">
                      {patient.allergies && patient.allergies.length > 0 ? patient.allergies.map(a => a.allergen).join(', ') : 'None Recorded'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                  <div className="p-3 bg-white rounded-2xl shadow-lg inline-block">
                    <PatientQRCode
                      patient={patient}
                      patientId={patient.id}
                      patientName={patient.fullName}
                      bloodGroup={patient.bloodGroup}
                      mobileNumber={patient.emergencyContacts?.[0]?.phone || patient.mobileNumber || ''}
                      size={130}
                      showActions={false}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>EMT DIRECT SCAN</span>
                <span className="text-emerald-400 font-bold">24/7 ACTIVE HOSPITAL RELAY</span>
              </div>
            </div>

            {/* Hospital Referral Code */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <label className={labelClass}>Hospital Referral Code (Optional — 5% discount for you &amp; hospital commission)</label>
              <div className="flex gap-2">
                <input
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. AIIMS-5 / APEX-TRAUMA-5"
                  className={`${inputClass} uppercase flex-1`}
                  disabled={!!appliedReferral}
                />
                <button
                  type="button"
                  onClick={handleApplyReferral}
                  disabled={!!appliedReferral || !referralCode.trim()}
                  className="px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-display font-semibold transition disabled:opacity-50 cursor-pointer"
                >
                  {appliedReferral ? 'Applied' : 'Apply Code'}
                </button>
              </div>

              {appliedReferral && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-fadeInUp">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Referral {appliedReferral} applied! You received ₹{referralDiscount.toFixed(2)} off (5% discount).</span>
                </p>
              )}
            </div>

            {/* Order Price & Checkout Button */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-base text-slate-900">Physical NFC Trauma Card</p>
                <p className="text-xs text-slate-500 font-body">Complimentary pan-India door delivery within 5-7 business days</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  {appliedReferral && <span className="text-xs text-slate-400 line-through mr-2">₹150.00</span>}
                  <span className="text-2xl font-display font-black text-slate-900">
                    ₹{(150 - referralDiscount).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsRazorpayModalOpen(true);
                    setTimeout(() => {
                      setPaymentSuccess(true);
                      setIsRazorpayModalOpen(false);
                    }, 2500);
                  }}
                  disabled={paymentSuccess}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-display font-bold text-sm shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer transition press-scale disabled:opacity-60"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{paymentSuccess ? 'Order Placed!' : 'Pay with Razorpay / UPI'}</span>
                </button>
              </div>
            </div>

            {paymentSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fadeInUp">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Payment of ₹{(150 - referralDiscount).toFixed(2)} Successful!</p>
                  <p className="text-slate-600 font-normal mt-0.5">
                    Your physical NFC card has entered automated printing at the MediSync Trauma Node. Tracking link sent to your registered mobile.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* RAZORPAY CHECKOUT MODAL MOCK */}
      {isRazorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center animate-fadeInUp">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Razorpay Secure Checkout</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">Order #MED-WALLET-CARD</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-left">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Card Price</span>
                <span>₹150.00</span>
              </div>
              {appliedReferral && (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>Referral Discount (5%)</span>
                  <span>-₹7.50</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Amount</span>
                <span>₹{(150 - referralDiscount).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-semibold py-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Simulating UPI / Card Gateway Authorization...</span>
            </div>
          </div>
        </div>
      )}

      {/* AD POPUP MODAL (on first entrance) */}
      {showAdPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center animate-fadeInUp relative">
            <button
              onClick={() => setShowAdPopup(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-rose-500/25">
              <CreditCard className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-rose-50 text-rose-700 border border-rose-200">
                Life-Saving Emergency Shield
              </span>
              <h3 className="text-xl font-display font-bold text-slate-900">
                Get Your Physical Emergency Wallet Card
              </h3>
              <p className="text-xs text-slate-500 font-body">
                Dead phones can't display QR codes in road accidents. Carry your indestructible, waterproof NFC trauma card anywhere.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAdPopup(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-display font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowAdPopup(false);
                  setCurrentPage(5);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-display font-bold shadow-md shadow-rose-600/20 hover:from-rose-700 hover:to-red-700 transition cursor-pointer"
              >
                Order Now — ₹150
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEALTH PROFILE SETUP MODAL FOR NEW USERS ── */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl space-y-6 text-left my-auto animate-fadeInUp relative border border-slate-200">
            {/* Close Button */}
            <button
              onClick={() => setShowSetupModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                    Emergency Vault Setup
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                  Complete Your Health Vault
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-body">
                  Fill in your medical details so emergency doctors and EMTs have life-saving information when seconds count.
                </p>
              </div>
            </div>

            <form onSubmit={handleSetupModalSave} className="space-y-6">
              {/* Section 1: Basic Identity */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  <span>1. Legal Identity &amp; Blood Group</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelClass}>Full Legal Name *</label>
                    <input
                      value={setupName}
                      onChange={(e) => setSetupName(e.target.value)}
                      placeholder="e.g. Navneel Sharma"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>12-Digit Aadhaar Number</label>
                    <input
                      value={setupAadhaar}
                      onChange={(e) => setSetupAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      placeholder="XXXX-XXXX-XXXX"
                      maxLength={12}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input
                      type="date"
                      value={setupDob}
                      onChange={(e) => setSetupDob(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select
                      value={setupGender}
                      onChange={(e) => setSetupGender(e.target.value as any)}
                      className={selectClass}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Blood Group *</label>
                    <select
                      value={setupBlood}
                      onChange={(e) => setSetupBlood(e.target.value as any)}
                      className={selectClass}
                      required
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Emergency Contact */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>2. Primary Emergency Contact (108 Direct Relay)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className={labelClass}>Contact Person Name *</label>
                    <input
                      value={setupContactName}
                      onChange={(e) => setSetupContactName(e.target.value)}
                      placeholder="e.g. Suman Sharma"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Relationship</label>
                    <select
                      value={setupContactRel}
                      onChange={(e) => setSetupContactRel(e.target.value)}
                      className={selectClass}
                    >
                      {['Parent', 'Spouse', 'Sibling', 'Child', 'Guardian', 'Friend'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Emergency Phone (+91) *</label>
                    <input
                      type="tel"
                      value={setupContactPhone}
                      onChange={(e) => setSetupContactPhone(e.target.value)}
                      placeholder="9876543210"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Critical Allergies */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>3. Critical Drug &amp; Food Allergies</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Tap to toggle</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'No Known Allergies',
                    'Penicillin & Beta-Lactams',
                    'Sulfa Drugs',
                    'Aspirin / NSAIDs',
                    'Peanuts / Tree Nuts',
                    'Dust / Pollen',
                    'Latex',
                  ].map(allergen => {
                    const isSelected = setupAllergies.includes(allergen);
                    return (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => toggleAllergy(allergen)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? allergen === 'No Known Allergies'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{allergen}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Custom allergy add */}
                <div className="flex gap-2 pt-1">
                  <input
                    value={customAllergyInput}
                    onChange={(e) => setCustomAllergyInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomAllergy(); } }}
                    placeholder="Other allergy (e.g. Ciprofloxacin, Iodine)..."
                    className={`${inputClass} text-xs py-2`}
                  />
                  <button
                    type="button"
                    onClick={addCustomAllergy}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shrink-0 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Section 4: Existing Chronic Conditions */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-500" />
                    <span>4. Existing Medical Conditions</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Tap to toggle</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'None (Healthy)',
                    'Hypertension (High BP)',
                    'Type 2 Diabetes',
                    'Asthma / Bronchial',
                    'Coronary Artery Disease',
                    'Thyroid Disorder',
                  ].map(cond => {
                    const isSelected = setupConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? cond === 'None (Healthy)'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{cond}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Custom condition add */}
                <div className="flex gap-2 pt-1">
                  <input
                    value={customConditionInput}
                    onChange={(e) => setCustomConditionInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomCondition(); } }}
                    placeholder="Other condition (e.g. Epilepsy, Migraine)..."
                    className={`${inputClass} text-xs py-2`}
                  />
                  <button
                    type="button"
                    onClick={addCustomCondition}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shrink-0 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Section 5: Baseline Vitals */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>5. Baseline Vitals (Optional)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className={labelClass}>Blood Pressure (mmHg)</label>
                    <input
                      value={setupBp}
                      onChange={(e) => setSetupBp(e.target.value)}
                      placeholder="e.g. 120/80"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Resting Pulse (bpm)</label>
                    <input
                      type="number"
                      value={setupHeartRate > 0 ? setupHeartRate : ''}
                      onChange={(e) => setSetupHeartRate(Number(e.target.value) || 0)}
                      placeholder="e.g. 72"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Oxygen SpO2 (%)</label>
                    <input
                      type="number"
                      value={setupSpo2 > 0 ? setupSpo2 : ''}
                      onChange={(e) => setSetupSpo2(Number(e.target.value) || 0)}
                      placeholder="e.g. 98"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Address */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className={labelClass}>Residential Address</label>
                  <input
                    value={setupAddress}
                    onChange={(e) => setSetupAddress(e.target.value)}
                    placeholder="e.g. Sector 18, Indirapuram, Ghaziabad, UP"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-display font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  I'll Fill It Later
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white text-sm font-display font-bold shadow-md shadow-rose-500/20 transition cursor-pointer flex items-center justify-center gap-2 press-scale"
                >
                  <Check className="w-4 h-4" />
                  <span>Save &amp; Activate Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Vitals & Measurement History Modal ── */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background: 'rgba(245,132,92,0.15)', border: '1px solid rgba(245,132,92,0.30)' }}>
                  <Activity className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 leading-tight">
                    Vitals &amp; Biometric Records
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update current measurements or review chronological history logs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVitalsModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-4 sm:px-6 pt-3 flex gap-2 border-b border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setVitalsModalTab('edit')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-display font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
                  vitalsModalTab === 'edit'
                    ? 'border-rose-500 text-rose-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Update Measurements</span>
              </button>
              <button
                type="button"
                onClick={() => setVitalsModalTab('history')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-display font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
                  vitalsModalTab === 'history'
                    ? 'border-rose-500 text-rose-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-4 h-4 text-amber-500" />
                <span>Measurement History ({patient.vitalsHistory?.length || 0})</span>
              </button>
            </div>

            {/* Tab 1: Edit & Log Vitals Form */}
            {vitalsModalTab === 'edit' && (
              <form onSubmit={handleSaveVitals} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Saving new values will update your active vital indicators and add a verified timestamped record to your permanent medical log history.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Heart Rate */}
                  <div>
                    <label className={labelClass}>Heart Rate (bpm)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={editHeartRate}
                        onChange={(e) => setEditHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 72"
                        className={`${inputClass} pr-12`}
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">bpm</span>
                    </div>
                  </div>

                  {/* Blood Pressure */}
                  <div>
                    <label className={labelClass}>Blood Pressure (Systolic/Diastolic)</label>
                    <div className="relative">
                      <input
                        value={editBp}
                        onChange={(e) => setEditBp(e.target.value)}
                        placeholder="e.g. 120/80"
                        className={`${inputClass} pr-16`}
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">mmHg</span>
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div>
                    <label className={labelClass}>Oxygen Saturation (SpO2 %)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={50}
                        max={100}
                        value={editSpo2}
                        onChange={(e) => setEditSpo2(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 98"
                        className={`${inputClass} pr-10`}
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  {/* Blood Sugar */}
                  <div>
                    <label className={labelClass}>Blood Sugar / Glucose</label>
                    <div className="relative">
                      <input
                        value={editBloodSugar}
                        onChange={(e) => setEditBloodSugar(e.target.value)}
                        placeholder="e.g. 95 (Fasting) or 140"
                        className={`${inputClass} pr-16`}
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">mg/dL</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Recorded By (Doctor, Hospital or Self)</label>
                    <input
                      value={editVitalsRecordedBy}
                      onChange={(e) => setEditVitalsRecordedBy(e.target.value)}
                      placeholder="e.g. Dr. Ramesh Gupta / Self (Patient) / Max Hospital Triage"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Clinical Notes / Observations (Optional)</label>
                  <textarea
                    rows={2}
                    value={editVitalsNote}
                    onChange={(e) => setEditVitalsNote(e.target.value)}
                    placeholder="e.g. Post-prandial reading after 30 min brisk walk. Normal sinus rhythm."
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 outline-none font-body shadow-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowVitalsModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-display font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs sm:text-sm font-display font-bold shadow-md shadow-rose-500/20 transition cursor-pointer flex items-center gap-2 press-scale"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save &amp; Log Vitals</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Measurement History List */}
            {vitalsModalTab === 'history' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {patient.vitalsHistory && patient.vitalsHistory.length > 0 ? (
                  patient.vitalsHistory.map((log: VitalLogEntry, index: number) => {
                    const formattedDate = new Date(log.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    });
                    return (
                      <div
                        key={log.id || index}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              {formattedDate}
                            </span>
                            {index === 0 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300">
                                Latest Reading
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-500">
                            Logged by: <strong className="text-slate-800">{log.recordedBy || 'Self'}</strong>
                          </span>
                        </div>

                        {/* Metric Chips */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</p>
                            <p className="text-sm font-black text-rose-600 font-mono">
                              {log.heartRate && log.heartRate > 0 ? `${log.heartRate} bpm` : '--'}
                            </p>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">BP</p>
                            <p className="text-sm font-black text-amber-600 font-mono">
                              {log.bloodPressure || '--'}
                            </p>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">SpO2</p>
                            <p className="text-sm font-black text-sky-600 font-mono">
                              {log.spO2 && log.spO2 > 0 ? `${log.spO2}%` : '--'}
                            </p>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Sugar</p>
                            <p className="text-sm font-black text-orange-600 font-mono truncate">
                              {log.bloodSugar || '--'}
                            </p>
                          </div>
                        </div>

                        {log.notes && (
                          <p className="text-xs italic text-slate-600 p-2 rounded-lg bg-white/80 border border-slate-200/60">
                            Note: {log.notes}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <History className="w-8 h-8 mx-auto text-slate-300" />
                    <h4 className="text-sm font-bold text-slate-700">No Past History Logs Found</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Any new vitals you record will be archived here automatically with timestamps and recorder details.
                    </p>
                    <button
                      type="button"
                      onClick={() => setVitalsModalTab('edit')}
                      className="mt-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition cursor-pointer"
                    >
                      + Record First Entry
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-xl bottom-nav-safe px-1.5 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id as 1 | 2 | 3 | 4 | 5);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-[56px] min-h-[44px] cursor-pointer press-scale ${
                isActive
                  ? 'text-[var(--clr-coral)] font-bold'
                  : item.isPromo
                  ? 'text-rose-600'
                  : 'text-[var(--color-foreground-muted)]'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[var(--clr-coral-light)]' : ''}`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
              </div>
              <span className="text-[10px] font-display font-semibold leading-tight text-center truncate max-w-[62px]">
                {item.id === 1 ? 'Records' : item.id === 2 ? 'Emergency' : item.id === 3 ? 'News' : item.id === 4 ? 'Profile' : 'Card'}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
