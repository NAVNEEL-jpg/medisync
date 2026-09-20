'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ClinicalSidebar, NavigationPage } from '@/components/ClinicalSidebar';
import { PatientPortal } from '@/components/PatientPortal';
import { EmergencyPatientView } from '@/components/EmergencyPatientView';
import { EmergencyWalletCard } from '@/components/EmergencyWalletCard';
import { EmergencyLookup } from '@/components/EmergencyLookup';
import { GlobalMedicalNews } from '@/components/GlobalMedicalNews';
import { SecureGateway } from '@/components/SecureGateway';
import { INITIAL_PATIENTS } from '@/lib/mockDatabase';
import { PatientProfile } from '@/lib/types';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('GLOBAL_MEDICAL_NEWS');
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENTS[0]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a]">
      {/* Universal Top Navigation Header */}
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 flex gap-6">
        {/* Left Clinical Sidebar */}
        <ClinicalSidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        {/* Center / Main Content Body */}
        <main className="flex-1 py-6 overflow-hidden">
          {currentPage === 'GLOBAL_MEDICAL_NEWS' && <GlobalMedicalNews />}

          {currentPage === 'PATIENT_DASHBOARD' && (
            <PatientPortal patient={patient} onUpdatePatient={setPatient} />
          )}

          {currentPage === 'EMERGENCY_QR_VIEW' && (
            <EmergencyPatientView
              patient={patient}
              onBack={() => setCurrentPage('CLINICAL_TRIAGE_REGISTRY')}
            />
          )}

          {currentPage === 'WALLET_CARD' && (
            <EmergencyWalletCard patient={patient} />
          )}

          {currentPage === 'CLINICAL_TRIAGE_REGISTRY' && (
            <EmergencyLookup
              onPatientFound={(found) => {
                setPatient(found);
                setCurrentPage('EMERGENCY_QR_VIEW');
              }}
            />
          )}

          {currentPage === 'SECURE_AUTH' && <SecureGateway />}
        </main>
      </div>
    </div>
  );
}
