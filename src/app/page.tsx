'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { FrontAuthPage } from '@/components/FrontAuthPage';
import { LandingPage } from '@/components/LandingPage';
import { ClientDashboard } from '@/components/ClientDashboard';
import { HospitalDashboard } from '@/components/HospitalDashboard';
import { CaregiverDashboard } from '@/components/CaregiverDashboard';
import { AssistiveModeBar } from '@/components/AssistiveModeBar';
import { INITIAL_PATIENTS } from '@/lib/mockDatabase';
import { PatientProfile } from '@/lib/types';
import { MediSyncLogo } from '@/components/MediSyncLogo';
import { AiHealthBot } from '@/components/AiHealthBot';
import {
  Building2,
  User,
  HeartHandshake,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Heart,
  Globe2,
  Cpu,
  Layers,
  ChevronDown,
} from 'lucide-react';

function buildEmptyPatientProfile(currentUser: NonNullable<ReturnType<typeof useAuth>['user']>): PatientProfile {
  const name = currentUser.displayName || currentUser.email?.split('@')[0] || 'New Patient';
  const cleanUid = (currentUser.uid || 'NEW01').replace(/[^a-zA-Z0-9]/g, '');
  const idSuffix = cleanUid.length >= 6 ? cleanUid.slice(-6).toUpperCase() : cleanUid.toUpperCase().padStart(6, '0');
  return {
    id: `MS-IND-${idSuffix}`,
    fullName: name,
    aadhaarNumber: currentUser.aadhaarNumber || '',
    mobileNumber: currentUser.phoneNumber || '',
    dob: '',
    gender: 'Male',
    bloodGroup: (currentUser.bloodGroup as any) || 'O+',
    address: '',
    city: '',
    state: '',
    existingConditions: [],
    pastDiseases: [],
    surgeriesAndImplants: [],
    allergies: [],
    vitals: {
      bloodPressure: '120/80 mmHg',
      heartRate: 72,
      spO2: 98,
      bloodSugar: '110 mg/dL',
      temperature: '98.6 °F',
      lastRecorded: new Date().toISOString(),
    },
    prescriptions: [],
    emergencyContacts: currentUser.phoneNumber ? [
      {
        id: 'ec-1',
        name: `${name} (Self)`,
        relationship: 'Self / Guardian',
        phone: currentUser.phoneNumber,
        isPrimary: true,
      }
    ] : [],
    nominees: [],
    organDonor: false,
    dnrStatus: false,
    hasCompletedSetup: false,
    hasNoKnownAllergies: true,
    diagnostics: [],
    surgicalLogs: [],
    lastProfileUpdate: new Date().toISOString(),
    lastUpdatedBy: `${name} (Self)`,
    vitalsHistory: [
      {
        id: `vh-init-${Date.now()}`,
        timestamp: new Date().toISOString(),
        recordedBy: `${name} (Self / Profile Setup)`,
        heartRate: 72,
        bloodPressure: '120/80 mmHg',
        spO2: 98,
        bloodSugar: '110 mg/dL',
        notes: 'Baseline initial vitals registration.',
      },
    ],
    nextReviewDueDate: '',
    isRegisteredAtOfflineCamp: false,
    accessLogs: [],
  };
}

export default function Home() {
  const { user, logOut, quickLoginAs } = useAuth();
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENTS[0]);
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'app'>('landing');

  useEffect(() => {
    if (!user) {
      if (currentView === 'app') setCurrentView('landing');
      return;
    }
    setCurrentView('app');

    const isDemo = user.uid === 'demo-pat-01' || user.email === 'rajesh.sharma@gmail.com' || user.authProvider === 'demo';
    if (isDemo) {
      setPatient(INITIAL_PATIENTS[0]);
    } else {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(`medisync_patient_${user.uid}`) : null;
      if (saved) {
        try {
          setPatient(JSON.parse(saved));
        } catch {
          setPatient(buildEmptyPatientProfile(user));
        }
      } else {
        setPatient(buildEmptyPatientProfile(user));
      }
    }
  }, [user]);

  const handleUpdatePatient: React.Dispatch<React.SetStateAction<PatientProfile>> = (val) => {
    setPatient((prev) => {
      const next = typeof val === 'function' ? (val as any)(prev) : val;
      if (user && user.uid && user.authProvider !== 'demo') {
        try {
          localStorage.setItem(`medisync_patient_${user.uid}`, JSON.stringify(next));
          localStorage.setItem(`medisync_patient_${next.id}`, JSON.stringify(next));
        } catch (e) {
          console.warn('Could not cache patient profile:', e);
        }
      }
      return next;
    });
  };

  // 1. Show Landing Page if unauthenticated or explicitly requested
  if ((!user && currentView === 'landing') || (user && currentView === 'landing')) {
    return (
      <LandingPage
        onEnterPortal={(targetRole) => {
          if (targetRole) quickLoginAs(targetRole);
          setCurrentView('app');
        }}
        onOpenAuthModal={() => setCurrentView('auth')}
      />
    );
  }

  // 2. Show Auth Page
  if (!user || currentView === 'auth') {
    return (
      <div className="relative">
        <button
          onClick={() => setCurrentView('landing')}
          className="fixed top-4 left-4 z-50 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-teal-300 border border-teal-500/30 text-xs font-semibold backdrop-blur-md shadow-lg hover:bg-slate-800 transition-colors"
        >
          ← Back to Showcase
        </button>
        <FrontAuthPage
          onEnterDashboard={() => {
            setCurrentView('app');
          }}
        />
      </div>
    );
  }

  const isHospitalRole = user.role === 'DOCTOR' || user.role === 'CAMP_WORKER';
  const isCaregiverRole = user.role === 'CAREGIVER';
  const isPatientRole = user.role === 'PATIENT';

  return (
    <div className="min-h-screen flex flex-col font-body" style={{ background: 'var(--color-background)' }}>
      {/* ── Status micro-bar ──────────────────────────────────── */}
      <div
        style={{ background: 'var(--clr-navy)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        className="px-3 sm:px-4 py-1.5 sm:py-2"
      >
        <div
          className="max-w-[1320px] mx-auto flex items-center justify-between gap-2 text-[12px] sm:text-[13px] font-body"
          style={{ color: '#94A3B8' }}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md overflow-hidden shrink-0 border border-white/10">
              <img src="/medisync-logo.jpg" alt="MediSync CareLink" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-[12px] sm:text-[14px] text-white truncate">
              MediSync CareLink <span className="hidden xs:inline">— Accessible Healthcare Ecosystem</span>
            </span>
            <span className="hidden sm:inline" style={{ color: '#334155' }}>·</span>
            <span className="hidden sm:inline font-mono text-[12px] text-teal-400">
              FHIR R4 / ABDM Swasthya Node
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] shrink-0 font-body">
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2 cursor-pointer hidden md:inline"
            >
              Public Showcase
            </button>
            <span className="hidden sm:inline" style={{ color: '#64748B' }}>Health ID:</span>
            <span
              className="font-mono font-bold text-white px-2 py-0.5 rounded text-[11px]"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              {patient.id}
            </span>
            <div className="w-2 h-2 rounded-full animate-ping" style={{ background: 'var(--clr-emerald)' }} />
          </div>
        </div>
      </div>

      {/* ── Main App Header ───────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all shadow-xs"
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1.5px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-2">
          {/* Logo & Trust Badge */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <MediSyncLogo
              size={36}
              subtitle="Assistive Healthcare Vault"
              subtitleClass="text-[11px] sm:text-[13px] font-medium text-teal-600"
              wordmarkClass="font-hero font-bold text-[18px] sm:text-[20px] tracking-normal"
            />
            <span
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold"
              style={{ background: 'var(--clr-coral-light)', color: 'var(--clr-coral-hover)', border: '1px solid rgba(245,132,92,0.3)' }}
            >
              <ShieldCheck className="w-4 h-4" />
              Verified
            </span>
          </div>

          {/* Right controls: Role Selector + User chip + Sign Out */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            {/* Quick Role Switcher for Evaluators & Multi-Role Users */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[11px] font-mono text-slate-500 px-2 font-semibold hidden md:inline">Role:</span>
              <button
                onClick={() => quickLoginAs('PATIENT')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  isPatientRole ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Patient View"
              >
                Patient
              </button>
              <button
                onClick={() => quickLoginAs('CAREGIVER')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  isCaregiverRole ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Caregiver Hub"
              >
                Caregiver
              </button>
              <button
                onClick={() => quickLoginAs('DOCTOR')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  user.role === 'DOCTOR' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Doctor ER View"
              >
                Doctor
              </button>
              <button
                onClick={() => quickLoginAs('CAMP_WORKER')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  user.role === 'CAMP_WORKER' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Rural Camp Kiosk"
              >
                ASHA Kiosk
              </button>
            </div>

            {/* User chip */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-[14px] font-display font-bold shrink-0"
              style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', color: 'var(--color-foreground)' }}
            >
              <div
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--clr-coral-light)' }}
              >
                {isHospitalRole ? (
                  <Building2 className="w-3.5 h-3.5 text-[var(--clr-coral)]" />
                ) : isCaregiverRole ? (
                  <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[var(--clr-coral)]" />
                )}
              </div>
              <span className="max-w-[70px] xs:max-w-[100px] sm:max-w-[140px] truncate">
                {user.displayName?.split(' ')[0] || user.displayName}
              </span>
            </div>

            {/* Sign out */}
            <button
              onClick={() => {
                logOut();
                setCurrentView('landing');
              }}
              className="p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer press-scale shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────── */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 lg:pb-8 space-y-6">
        {/* Assistive Mode Bar for Patients */}
        {isPatientRole && (
          <AssistiveModeBar patientName={patient.fullName} />
        )}

        {/* Dynamic Role-Based Views */}
        {isCaregiverRole ? (
          <CaregiverDashboard />
        ) : isHospitalRole ? (
          <HospitalDashboard initialPatient={patient} />
        ) : (
          <ClientDashboard patient={patient} onUpdatePatient={handleUpdatePatient} />
        )}
      </main>

      {/* ── Floating AI Health Assistant Bot ─────────────────── */}
      <AiHealthBot patient={patient} />

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer
        style={{ borderTop: '1.5px solid var(--color-border)', background: 'var(--color-surface)' }}
        className="py-5 px-4"
      >
        <div
          className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[14px] font-body"
          style={{ color: 'var(--color-foreground-muted)' }}
        >
          <span className="flex items-center gap-2 font-medium">
            <Heart className="w-4 h-4" style={{ color: 'var(--clr-coral)' }} />
            © 2026 MediSync CareLink — Accessible Healthcare &amp; Assistive Tech
          </span>
          <span className="font-mono text-[12px] opacity-75">
            Design for Bharat Challenge · ABDM Node · HL7 FHIR v4.3
          </span>
        </div>
      </footer>
    </div>
  );
}
