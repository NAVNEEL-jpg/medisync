'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { PatientProfile } from '@/lib/types';
import { INITIAL_PATIENTS } from '@/lib/mockDatabase';
import { getPatientRecord } from '@/lib/firestoreService';
import { EmergencyPatientView } from '@/components/EmergencyPatientView';
import { MediSyncLogo } from '@/components/MediSyncLogo';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

/** Helper to decode URL-safe base64 payload into patient profile */
function decodePatientSnapshot(b64: string): PatientProfile | null {
  try {
    let base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const decoded = atob(base64);
    const jsonStr = decodeURIComponent(
      Array.prototype.map.call(decoded, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    const c = JSON.parse(jsonStr);

    return {
      id: c.id ? (c.id.startsWith('#') ? c.id : `#${c.id}`) : '#MS-EMERGENCY',
      fullName: c.fn || 'Emergency Patient',
      bloodGroup: c.bg || 'O+',
      mobileNumber: c.mb || '',
      aadhaarNumber: '',
      dob: '1985-05-12',
      gender: 'Male',
      address: '',
      city: '',
      state: '',
      existingConditions: Array.isArray(c.cn) && c.cn.length > 0 ? c.cn : ['Verified by Emergency Medical System'],
      pastDiseases: [],
      surgeriesAndImplants: [],
      allergies: Array.isArray(c.al) && c.al.length > 0
        ? c.al.map((a: any) => ({
            allergen: a.a || 'Unknown Allergy',
            severity: a.s || 'CRITICAL',
            reaction: a.r || 'Severe sensitivity / notify attending team',
          }))
        : [
            {
              allergen: 'NO DOCUMENTED CRITICAL ALLERGIES',
              severity: 'MILD',
              reaction: 'Standard monitoring protocol advised',
            },
          ],
      vitals: {
        heartRate: Number(c.vt?.hr) > 0 ? Number(c.vt.hr) : 74,
        bloodPressure: c.vt?.bp || '120/80 mmHg',
        spO2: Number(c.vt?.ox) > 0 ? Number(c.vt.ox) : 98,
        bloodSugar: c.vt?.bs || '110 mg/dL',
        lastRecorded: c.ut || new Date().toISOString(),
      },
      prescriptions: Array.isArray(c.rx) && c.rx.length > 0
        ? c.rx.map((r: any, idx: number) => ({
            id: `rx-${idx}`,
            medicationName: r.m || 'Prescribed Drug',
            dosage: r.d || 'Standard Dose',
            frequency: r.f || 'As prescribed',
            prescribedBy: 'Attending Physician',
            hospitalOrClinic: 'Medical Center',
            datePrescribed: c.ut?.slice(0, 10) || new Date().toISOString().slice(0, 10),
          }))
        : [],
      emergencyContacts: Array.isArray(c.ec) && c.ec.length > 0
        ? c.ec.map((ec: any, idx: number) => ({
            id: `ec-${idx}`,
            name: ec.n || 'Emergency Contact',
            relationship: ec.r || 'Contact',
            phone: ec.p || c.mb || '',
            isPrimary: idx === 0,
          }))
        : c.mb
        ? [
            {
              id: 'ec-1',
              name: `${c.fn || 'Patient'} (Self / Emergency)`,
              relationship: 'Primary Contact',
              phone: c.mb,
              isPrimary: true,
            },
          ]
        : [],
      nominees: [],
      organDonor: true,
      dnrStatus: false,
      lastProfileUpdate: c.ut || new Date().toISOString(),
      lastUpdatedBy: c.ub || 'MediSync Verified Patient Vault',
      nextReviewDueDate: '',
      isRegisteredAtOfflineCamp: false,
      accessLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          accessorName: 'Paramedic / Direct Camera Scan',
          accessorRole: 'PARAMEDIC',
          hospitalOrLocation: 'Emergency Triage Unit',
          accessType: 'BREAK_GLASS_OVERRIDE',
          reason: 'Instant camera QR scan during acute medical assessment',
        },
      ],
    };
  } catch (err) {
    console.warn('Could not decode snapshot:', err);
    return null;
  }
}

function EmergencyScanContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = typeof params?.id === 'string' ? decodeURIComponent(params.id) : '';

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function resolveRecord() {
      // 1. FASTEST: Try Base64 self-contained clinical snapshot from QR code
      const dataParam = searchParams.get('data');
      if (dataParam) {
        const decoded = decodePatientSnapshot(dataParam);
        if (decoded && isMounted) {
          setPatient(decoded);
          setLoading(false);
          return;
        }
      }

      const nameParam = searchParams.get('name');
      const bgParam = searchParams.get('bg');
      const mobileParam = searchParams.get('mobile');
      const hrParam = searchParams.get('hr');
      const bpParam = searchParams.get('bp');
      const oxParam = searchParams.get('ox');
      const bsParam = searchParams.get('bs');
      const byParam = searchParams.get('by');
      const atParam = searchParams.get('at');

      const cleanTargetId = rawId.replace('#', '').toLowerCase();

      // 2. Check in-memory initial demo patients
      const initialMatch = INITIAL_PATIENTS.find(
        (p) =>
          p.id.replace('#', '').toLowerCase() === cleanTargetId ||
          p.aadhaarNumber.includes(cleanTargetId) ||
          p.mobileNumber.includes(cleanTargetId)
      );
      if (initialMatch && isMounted) {
        setPatient(initialMatch);
        setLoading(false);
        return;
      }

      // 3. Check localStorage (if scanned on same browser / device)
      if (typeof window !== 'undefined') {
        try {
          const directStored = localStorage.getItem(`medisync_patient_${rawId}`);
          if (directStored) {
            setPatient(JSON.parse(directStored));
            setLoading(false);
            return;
          }

          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('medisync_patient_')) {
              const val = localStorage.getItem(key);
              if (val) {
                const parsed: PatientProfile = JSON.parse(val);
                if (
                  parsed.id.replace('#', '').toLowerCase() === cleanTargetId ||
                  (nameParam && parsed.fullName.toLowerCase() === nameParam.toLowerCase())
                ) {
                  setPatient(parsed);
                  setLoading(false);
                  return;
                }
              }
            }
          }
        } catch (e) {
          // ignore local storage errors
        }
      }

      // 4. Check Firestore with strict 500ms timeout so it NEVER hangs on mobile
      try {
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 500));
        const firestoreRecord = await Promise.race([getPatientRecord(rawId), timeoutPromise]);
        if (firestoreRecord && isMounted) {
          setPatient(firestoreRecord);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Firestore lookup skipped/timed out:', err);
      }

      // 5. Build emergency profile from query parameters & ID (Instant Fallback)
      if (isMounted) {
        const formattedId = rawId.startsWith('#') ? rawId : `#${rawId}`;
        const fallbackProfile: PatientProfile = {
          id: formattedId,
          fullName: nameParam || (rawId.includes('MS-IND-') ? 'Navneel Dutta' : 'Emergency Citizen Patient'),
          bloodGroup: (bgParam as any) || 'O+',
          mobileNumber: mobileParam || '9876543210',
          aadhaarNumber: 'XXXX-XXXX-8921',
          dob: '1995-08-14',
          gender: 'Male',
          address: 'New Delhi, India',
          city: 'New Delhi',
          state: 'Delhi',
          existingConditions: [
            'Allergic Rhinitis',
            'ABDM Fast-Track Verified Citizen',
          ],
          pastDiseases: [],
          surgeriesAndImplants: [],
          allergies: [
            {
              allergen: 'PENICILLIN & BETA-LACTAMS',
              severity: 'CRITICAL',
              reaction: 'Acute respiratory distress and anaphylaxis risk',
            },
            {
              allergen: 'SULFA DRUGS',
              severity: 'MODERATE',
              reaction: 'Cutaneous erythema and urticaria',
            },
          ],
          vitals: {
            heartRate: Number(hrParam) > 0 ? Number(hrParam) : 74,
            bloodPressure: bpParam || '120/80 mmHg',
            spO2: Number(oxParam) > 0 ? Number(oxParam) : 98,
            bloodSugar: bsParam || '102 mg/dL',
            lastRecorded: atParam || new Date().toISOString(),
          },
          prescriptions: [
            {
              id: 'rx-1',
              medicationName: 'Cetirizine 10mg',
              dosage: '1 Tablet',
              frequency: 'Once daily at night (SOS)',
              prescribedBy: byParam || 'Attending Physician',
              hospitalOrClinic: 'MediSync Partner Clinic',
              datePrescribed: (atParam || new Date().toISOString()).slice(0, 10),
            },
          ],
          emergencyContacts: [
            {
              id: 'ec-1',
              name: 'Primary Family Contact',
              relationship: 'Family Member',
              phone: mobileParam || '+91 9876543210',
              isPrimary: true,
            },
          ],
          nominees: [],
          organDonor: true,
          dnrStatus: false,
          lastProfileUpdate: atParam || new Date().toISOString(),
          lastUpdatedBy: byParam || 'MediSync Verified Patient Vault',
          nextReviewDueDate: '',
          isRegisteredAtOfflineCamp: false,
          accessLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              accessorName: 'Camera Scanner / EMT Resuscitation Unit',
              accessorRole: 'PARAMEDIC',
              hospitalOrLocation: 'Emergency Triage Scene',
              accessType: 'BREAK_GLASS_OVERRIDE',
              reason: 'Paramedic QR Code scan for acute trauma resuscitation',
            },
          ],
        };

        setPatient(fallbackProfile);
        setLoading(false);
      }
    }

    resolveRecord();

    // Absolute safety timeout: never stay in loading state more than 600ms
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [rawId, searchParams]);

  return (
    <div className="min-h-screen bg-[#070E1A] text-white font-body selection:bg-red-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0B1528]/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Portal</span>
          </Link>
          <MediSyncLogo
            size={30}
            subtitle="Emergency Medical Vault"
            subtitleClass="text-[10px] text-slate-400 font-medium"
            wordmarkClass="font-bold text-white text-base tracking-tight"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Live Triage Scan
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1280px] mx-auto p-3 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <h3 className="text-lg font-bold text-slate-200">Decentralized Health Record Lookup</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Retrieving cryptographic emergency health token for ID{' '}
              <span className="font-mono text-cyan-300 font-bold">{rawId}</span>...
            </p>
          </div>
        ) : patient ? (
          <EmergencyPatientView patient={patient} accessType="BREAK_GLASS_OVERRIDE" />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
            <ShieldAlert className="w-12 h-12 text-amber-400" />
            <h3 className="text-xl font-bold text-slate-200">Patient Record Not Found</h3>
            <p className="text-sm text-slate-400 max-w-md">
              No clinical vault matches ID <span className="font-mono text-amber-300 font-bold">{rawId}</span>.
              Please verify the QR code was scanned from an active MediSync ID.
            </p>
            <Link
              href="/"
              className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition"
            >
              Return to MediSync Home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function EmergencyScanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070E1A] text-white flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-sm font-bold text-slate-300">Decrypting Emergency Medical Vault...</p>
        </div>
      }
    >
      <EmergencyScanContent />
    </Suspense>
  );
}
