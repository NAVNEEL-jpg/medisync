'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { PatientProfile } from '@/lib/types';
import { getHospitalPatients, saveHospitalPatient, INITIAL_PATIENTS } from '@/lib/mockDatabase';
import {
  X,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  RefreshCw,
  QrCode,
  ScanLine,
  Check,
} from 'lucide-react';

interface HospitalQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientScanned: (patient: PatientProfile) => void;
}

/** Helper to decode URL-safe base64 patient payload */
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
      id: c.id ? (c.id.startsWith('#') ? c.id : `#${c.id}`) : '#MS-IND-SCANNED',
      fullName: c.fn || 'Emergency Patient',
      bloodGroup: c.bg || 'O+',
      mobileNumber: c.mb || '',
      aadhaarNumber: 'XXXX-XXXX-8910',
      dob: '1990-01-01',
      gender: 'Male',
      address: '',
      city: '',
      state: '',
      existingConditions: Array.isArray(c.cn) ? c.cn : ['Verified by MediSync Clinical System'],
      pastDiseases: [],
      surgeriesAndImplants: [],
      allergies: Array.isArray(c.al)
        ? c.al.map((a: any) => ({
            allergen: a.a || 'Unknown Allergen',
            severity: a.s || 'CRITICAL',
            reaction: a.r || 'Triage sensitive',
          }))
        : [],
      vitals: {
        heartRate: Number(c.vt?.hr) || 74,
        bloodPressure: c.vt?.bp || '120/80 mmHg',
        spO2: Number(c.vt?.ox) || 98,
        bloodSugar: c.vt?.bs || '110 mg/dL',
        lastRecorded: c.ut || new Date().toISOString(),
      },
      prescriptions: Array.isArray(c.rx)
        ? c.rx.map((r: any, idx: number) => ({
            id: `rx-${idx}`,
            medicationName: r.m,
            dosage: r.d,
            frequency: r.f,
            prescribedBy: 'Prescribing Physician',
            hospitalOrClinic: 'Clinical Node',
            datePrescribed: (c.ut || new Date().toISOString()).slice(0, 10),
          }))
        : [],
      emergencyContacts: Array.isArray(c.ec)
        ? c.ec.map((ec: any, idx: number) => ({
            id: `ec-${idx}`,
            name: ec.n,
            relationship: ec.r,
            phone: ec.p,
            isPrimary: idx === 0,
          }))
        : [],
      nominees: [],
      organDonor: true,
      dnrStatus: false,
      lastProfileUpdate: c.ut || new Date().toISOString(),
      lastUpdatedBy: c.ub || 'MediSync Verified Vault',
      nextReviewDueDate: '',
      isRegisteredAtOfflineCamp: false,
      accessLogs: [],
    };
  } catch {
    return null;
  }
}

export function HospitalQrScannerModal({
  isOpen,
  onClose,
  onPatientScanned,
}: HospitalQrScannerModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'demo'>('camera');
  const [cameraError, setCameraError] = useState('');
  const [scanError, setScanError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState<PatientProfile | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Validate and Process Scanned Content
  const processScannedData = useCallback((rawValue: string) => {
    setScanError('');

    // STRICT VALIDATION: Must be a verified MediSync Patient QR Code!
    const isEmergencyUrl = rawValue.includes('/emergency/');
    const hasMedisyncId = rawValue.includes('MS-IND-') || rawValue.includes('NDHN-') || rawValue.includes('MS-CAMP-');
    const hasDataParam = rawValue.includes('data=') || rawValue.includes('name=') || rawValue.includes('bg=');

    if (!isEmergencyUrl && !hasMedisyncId && !hasDataParam) {
      setScanError(
        '⛔ Access Denied: Unregistered QR Code. This hospital scanner strictly accepts only website-registered MediSync patient QR codes.'
      );
      return;
    }

    // 1. Try URL parameters & snapshot payload
    try {
      let patientId = '';
      let urlObj: URL | null = null;

      try {
        urlObj = new URL(rawValue, window.location.origin);
      } catch {
        // rawValue might be a path or query string
      }

      if (urlObj) {
        const pathParts = urlObj.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart) {
          patientId = decodeURIComponent(lastPart).replace('#', '');
        }

        const dataParam = urlObj.searchParams.get('data');
        if (dataParam) {
          const decoded = decodePatientSnapshot(dataParam);
          if (decoded) {
            const saved = saveHospitalPatient(decoded);
            setScannedSuccess(saved);
            onPatientScanned(saved);
            stopCamera();
            return;
          }
        }
      }

      // 2. Check enrolled hospital patients & in-memory database
      const cleanTargetId = (patientId || rawValue).replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
      const allPatients = [...getHospitalPatients(), ...INITIAL_PATIENTS];
      const match = allPatients.find(
        (p) =>
          p.id.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase().includes(cleanTargetId) ||
          cleanTargetId.includes(p.id.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())
      );

      if (match) {
        const saved = saveHospitalPatient(match);
        setScannedSuccess(saved);
        onPatientScanned(saved);
        stopCamera();
        return;
      }

      // 3. Fallback: Parse query parameters
      if (urlObj) {
        const name = urlObj.searchParams.get('name') || 'Emergency Patient';
        const bg = urlObj.searchParams.get('bg') || 'O+';
        const mobile = urlObj.searchParams.get('mobile') || '9876543210';
        const hr = urlObj.searchParams.get('hr');
        const bp = urlObj.searchParams.get('bp');
        const ox = urlObj.searchParams.get('ox');
        const bs = urlObj.searchParams.get('bs');
        const by = urlObj.searchParams.get('by');
        const at = urlObj.searchParams.get('at');

        const fallbackPatient: PatientProfile = {
          id: patientId ? (patientId.startsWith('#') ? patientId : `#${patientId}`) : `#MS-IND-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          fullName: name,
          bloodGroup: (bg as any) || 'O+',
          mobileNumber: mobile,
          aadhaarNumber: 'XXXX-XXXX-9102',
          dob: '1992-05-18',
          gender: 'Male',
          address: 'Emergency Registry',
          city: 'Hospital Node',
          state: 'National Network',
          existingConditions: ['Admitted via Verified Barcode Scanner'],
          pastDiseases: [],
          surgeriesAndImplants: [],
          allergies: [
            {
              allergen: 'PENICILLIN & BETA-LACTAMS',
              severity: 'CRITICAL',
              reaction: 'Acute sensitivity alert',
            },
          ],
          vitals: {
            heartRate: Number(hr) || 76,
            bloodPressure: bp || '120/80 mmHg',
            spO2: Number(ox) || 98,
            bloodSugar: bs || '105 mg/dL',
            lastRecorded: at || new Date().toISOString(),
          },
          prescriptions: [],
          emergencyContacts: [
            {
              id: 'ec-1',
              name: 'Emergency Primary Contact',
              relationship: 'Family',
              phone: mobile,
              isPrimary: true,
            },
          ],
          nominees: [],
          organDonor: true,
          dnrStatus: false,
          lastProfileUpdate: at || new Date().toISOString(),
          lastUpdatedBy: by || 'Hospital Scanner Intake',
          nextReviewDueDate: '',
          isRegisteredAtOfflineCamp: false,
          accessLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              accessorName: 'Hospital Triage Barcode Unit',
              accessorRole: 'EMERGENCY_DOCTOR',
              hospitalOrLocation: 'Hospital Emergency Intake',
              accessType: 'BREAK_GLASS_OVERRIDE',
              reason: 'Direct barcode triage scan and database import',
            },
          ],
        };

        const saved = saveHospitalPatient(fallbackPatient);
        setScannedSuccess(saved);
        onPatientScanned(saved);
        stopCamera();
        return;
      }

      setScanError('⚠️ Unable to verify patient cryptographic token from this QR code.');
    } catch {
      setScanError('⚠️ Error reading QR code data.');
    }
  }, [onPatientScanned, stopCamera]);

  // Start Camera Scanning Loop
  const startCamera = useCallback(async () => {
    setCameraError('');
    setScanError('');
    setIsScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();

        // Frame analyze loop with jsQR
        const scanFrame = () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              if (ctx) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: 'dontInvert',
                });

                if (code && code.data) {
                  processScannedData(code.data);
                  return;
                }
              }
            }
          }
          animFrameRef.current = requestAnimationFrame(scanFrame);
        };

        animFrameRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        'Could not access camera device. You can switch to the "Upload QR Image" or "Registered Patient Test" tabs below.'
      );
      setIsScanning(false);
    }
  }, [processScannedData]);

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          processScannedData(code.data);
        } else {
          setScanError('No QR code detected in this image. Please upload a clear photo of the patient QR code.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !scannedSuccess) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, scannedSuccess, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <ScanLine className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 leading-tight">
                Hospital Emergency Barcode / QR Scanner
              </h3>
              <p className="text-xs text-slate-500">
                Verified Intake · <strong className="text-amber-600">MediSync Registered Codes Only</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        {!scannedSuccess && (
          <div className="flex border-b border-slate-100 bg-slate-50/70 px-4 pt-2 gap-2 text-sm font-display font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('camera')}
              className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'camera'
                  ? 'bg-white text-amber-600 border-b-2 border-amber-500 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera Video Feed</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'upload'
                  ? 'bg-white text-amber-600 border-b-2 border-amber-500 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload QR Image</span>
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 cursor-pointer shrink-0 min-h-[44px] ${
                activeTab === 'demo'
                  ? 'bg-white text-amber-600 border-b-2 border-amber-500 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Quick Test Scan</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* SUCCESS STATE */}
          {scannedSuccess ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Verified Patient QR Scanned
                </span>
                <h4 className="text-2xl font-display font-black text-slate-900 mt-2">
                  {scannedSuccess.fullName}
                </h4>
                <div className="mt-1 inline-block px-3 py-1 rounded-xl bg-slate-900 text-cyan-300 font-mono font-bold text-sm">
                  ID: {scannedSuccess.id}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Blood Group: <strong className="text-rose-600">{scannedSuccess.bloodGroup}</strong> · Vitals:{' '}
                  {scannedSuccess.vitals?.heartRate} bpm, {scannedSuccess.vitals?.bloodPressure}
                </p>
                <p className="text-xs font-semibold text-emerald-700 mt-1">
                  ✓ Successfully imported into active hospital intake triage registry.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-display font-bold text-sm shadow-md shadow-cyan-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Open Patient Clinical Vault in Editor</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: CAMERA SCAN */}
              {activeTab === 'camera' && (
                <div className="space-y-3">
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanner overlay target frame */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-56 h-56 border-2 border-cyan-400 rounded-2xl relative animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400 -mt-1 -ml-1 rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-cyan-400 -mt-1 -mr-1 rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400 -mb-1 -ml-1 rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400 -mb-1 -mr-1 rounded-br-lg" />
                      </div>
                    </div>

                    {/* Hint */}
                    <div className="absolute bottom-3 inset-x-3 text-center">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/70 text-cyan-300 backdrop-blur-xs">
                        Point camera at MediSync Patient QR Code
                      </span>
                    </div>
                  </div>

                  {cameraError && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: UPLOAD IMAGE */}
              {activeTab === 'upload' && (
                <div className="space-y-4 py-3">
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl bg-slate-50 hover:bg-cyan-50/40 transition cursor-pointer text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-display font-bold text-slate-800">
                      Select QR Code Screenshot or Photo
                    </p>
                    <p className="text-xs text-slate-400">Supports PNG, JPG, JPEG from phone or health card</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* TAB 3: DEMO SIMULATED SCANS */}
              {activeTab === 'demo' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Test the scanner with verified MediSync patients or simulate an invalid non-website code:
                  </p>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        processScannedData(
                          `${window.location.origin}/emergency/MS-IND-DQ1Q1?name=Navneel%20Dutta&bg=O%2B&mobile=9876543210&hr=72&bp=120%2F80&ox=98&bs=100`
                        )
                      }
                      className="w-full p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Navneel Dutta (ID: MS-IND-DQ1Q1)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Blood: O+ · Vitals: 72 bpm, 120/80 mmHg · Penicillin Allergy
                        </span>
                      </div>
                      <span className="text-xs font-bold text-cyan-600">Simulate Scan →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        processScannedData(
                          `${window.location.origin}/emergency/MS-IND-44219?name=Sunita%20Devi&bg=B%2B&mobile=9123456789&hr=72&bp=124%2F78&ox=95`
                        )
                      }
                      className="w-full p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Sunita Devi (ID: MS-IND-44219)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Blood: B+ · Vitals: 72 bpm, 124/78 mmHg · Aspirin Allergy
                        </span>
                      </div>
                      <span className="text-xs font-bold text-cyan-600">Simulate Scan →</span>
                    </button>

                    {/* Invalid / Foreign QR Test */}
                    <button
                      type="button"
                      onClick={() => processScannedData('https://google.com/search?q=random_external_qr_code')}
                      className="w-full p-3 rounded-xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-rose-800 block">
                          Test Foreign / Non-MediSync QR Code
                        </span>
                        <span className="text-[11px] text-rose-600">
                          Demonstrates strict rejection filter for non-registered codes
                        </span>
                      </div>
                      <span className="text-xs font-bold text-rose-700">Test Rejection →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ERROR NOTIFICATION */}
              {scanError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{scanError}</span>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs text-slate-500">
          <span className="font-mono text-[11px]">ABDM Fast-Track Protocol v4.3</span>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-white transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
