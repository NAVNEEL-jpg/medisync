'use client';

import React from 'react';
import { PatientProfile } from '@/lib/types';
import { PatientQRCode } from '@/components/PatientQRCode';
import { X, Copy, Check, QrCode, Shield, Activity, Phone, FileText } from 'lucide-react';

interface PatientQrPreviewModalProps {
  patient: PatientProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientQrPreviewModal({ patient, isOpen, onClose }: PatientQrPreviewModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !patient) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(patient.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 leading-tight">
                Patient Emergency QR &amp; Vault ID
              </h3>
              <p className="text-xs text-slate-500">Official hospital-issued decentralized health token</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-center">
          {/* Patient Card Info */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md text-left space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  Verified Patient Record
                </span>
                <h4 className="text-lg font-display font-bold text-white leading-tight mt-0.5">
                  {patient.fullName}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-display bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Blood: {patient.bloodGroup}
              </span>
            </div>

            {/* Unique ID Badge */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/10 border border-white/10 mt-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono text-xs sm:text-sm font-black text-cyan-300 tracking-wider">
                  ID: {patient.id}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Aadhaar Number:</span>
                <span className="font-mono font-medium">{patient.aadhaarNumber || 'Not Linked'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ABHA Health ID:</span>
                <span className="font-mono font-medium text-emerald-300">{patient.abhaId || 'None'}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center">
            <PatientQRCode
              patient={patient}
              patientId={patient.id}
              patientName={patient.fullName}
              bloodGroup={patient.bloodGroup}
              mobileNumber={patient.mobileNumber}
              size={210}
              showActions={true}
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left flex items-start gap-2">
            <Activity className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              This QR code can be scanned by any smartphone camera or ambulance paramedic to open the patient's verified emergency health records, vitals history, and drug allergies instantly.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-display font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
