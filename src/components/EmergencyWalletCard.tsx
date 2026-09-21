'use client';

import React, { useState } from 'react';
import { PatientProfile } from '@/lib/types';
import {
  ShieldAlert,
  Activity,
  Phone,
  Printer,
  Download,
  CheckCircle2,
  Lock,
  Radio,
  Star,
  Check,
  Package,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface EmergencyWalletCardProps {
  patient?: PatientProfile;
}

export function EmergencyWalletCard({ patient }: EmergencyWalletCardProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<'PVC' | 'TITANIUM' | 'BUNDLE'>('PVC');
  const [cardSide, setCardSide] = useState<'FRONT' | 'BACK'>('FRONT');
  const [ordered, setOrdered] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. HERO GUARANTEE BANNER */}
      <div className="bg-gradient-to-r from-[#006194] via-[#0284c7] to-[#0ea5e9] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
            <span>🛡️ ZERO-BATTERY LIFE-SAVING GUARANTEE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Carry Life-Saving Protection Everywhere: The MediSync Physical Emergency Wallet Card
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            Designed specifically for first responders when phones are shattered, locked, or depleted of battery. Integrates contactless emergency NFC data relay + indelible high-contrast QR matrix linked directly to your live Hospital Node.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 relative z-10">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-sky-200 block">EMT RESPONSE TIME</span>
            <span className="text-xl font-black">Under 8.4s</span>
          </div>

          <button
            onClick={() => window.print()}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#0284c7] font-extrabold text-xs shadow-md transition"
          >
            Configure Your Shield
          </button>
        </div>
      </div>

      {/* 2. CARD ENGRAVING PREVIEW & ORDER CUSTOMIZER ROW */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Live Card Engraving Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <CreditCardIcon className="w-4 h-4 text-[#0284c7]" />
              Live Card Engraving Preview
            </h3>
            <div className="flex gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setCardSide('FRONT')}
                className={`px-3 py-1 rounded-lg transition ${
                  cardSide === 'FRONT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Front Profile
              </button>
              <button
                onClick={() => setCardSide('BACK')}
                className={`px-3 py-1 rounded-lg transition ${
                  cardSide === 'BACK' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Back Matrix
              </button>
            </div>
          </div>

          {/* PHYSICAL CARD VISUAL */}
          {cardSide === 'FRONT' ? (
            <div className="bg-[#0f172a] text-white rounded-3xl p-6 shadow-2xl border-2 border-slate-700 min-h-[360px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <img src="/medisync-logo.jpg" alt="MediSync" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-black text-sm tracking-tight text-white block leading-none">
                      MediSync Trauma Card
                    </span>
                    <span className="text-[9px] uppercase font-bold text-sky-400">
                      GLOBAL CLINICAL REGISTRY • T-1 EMT READY
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-sky-950 text-sky-300 border border-sky-800">
                    NFC ARMORED
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-950 text-red-300 border border-red-800">
                    DONOR YES
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="my-4 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xl text-slate-300">
                    MV
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">PATIENT NAME</span>
                    <h4 className="text-xl font-black text-white font-sans">Marcus S. Vance</h4>
                    <p className="text-[10px] text-slate-400">DOB: 14-OCT-1988 (35y)</p>
                  </div>

                  <div className="flex gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px]">
                      BLOOD: O-NEG
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold text-[10px]">
                      PENICILLIN - SEVERE PEANUT
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-2xl text-slate-900 flex flex-col items-center shadow-lg border-2 border-sky-400 shrink-0">
                  <QRCodeSVG
                    value={`https://medisync.vercel.app/emergency/${(patient?.id || 'MED-8849-0091-TX').replace('#', '')}`}
                    size={96}
                    level="M"
                    marginSize={1}
                  />
                  <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">
                    EMT SCAN DIRECT
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>MED-8849-0091-TX</span>
                <span>PRIMARY ICE: +1 (555) 942-3810 (Elena - Wife)</span>
                <span className="text-emerald-400 font-bold">ACTIVE NODE 04</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-slate-300 min-h-[360px] flex flex-col justify-between text-xs text-slate-800">
              <div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                    Comprehensive Clinical Matrix
                  </span>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                    NEMID Certified
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  <p><strong>Diagnosed:</strong> Type 1 Diabetes Mellitus, Essential Hypertension, Asthma</p>
                  <p><strong>Implants:</strong> Cardiac Pacemaker Dual Chamber (MRI Conditional Only)</p>
                  <p><strong>Emergency Meds:</strong> Insulin Glargine, Lisinopril, Ventolin Inhaler</p>
                </div>
              </div>

              <div className="pt-2 border-t text-[10px] text-slate-500 flex justify-between">
                <span>EMT Directive: In event of unresponsive trauma, dial 112 / 911</span>
                <span>ISO 7810 ID-1 Standard</span>
              </div>
            </div>
          )}

          {/* Dynamic Sync Active Notice */}
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Radio className="w-3.5 h-3.5 text-[#0284c7] animate-pulse" />
              Dynamic sync active: Updates to your online dashboard update this physical QR scans automatically.
            </span>
            <span className="font-bold text-sky-800 shrink-0">100% Synced</span>
          </div>

          {/* Material Select Cards */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Select Production Material & Form Factor
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMaterial('PVC')}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  selectedMaterial === 'PVC'
                    ? 'border-[#0284c7] bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-black text-slate-900">$14.99</span>
                  {selectedMaterial === 'PVC' && <Check className="w-4 h-4 text-[#0284c7]" />}
                </div>
                <h5 className="font-bold text-xs text-slate-900">Medical-Grade Matte PVC</h5>
                <p className="text-[10px] text-slate-500 mt-1">Waterproof, non-scratch polymer.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMaterial('TITANIUM')}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  selectedMaterial === 'TITANIUM'
                    ? 'border-[#0284c7] bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-black text-slate-900">$29.99</span>
                  <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-black">
                    PRO
                  </span>
                </div>
                <h5 className="font-bold text-xs text-slate-900">Titanium Anodized</h5>
                <p className="text-[10px] text-slate-500 mt-1">Indestructible aerospace titanium.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMaterial('BUNDLE')}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  selectedMaterial === 'BUNDLE'
                    ? 'border-[#0284c7] bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-black text-slate-900">$39.99</span>
                  <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black">
                    POPULAR
                  </span>
                </div>
                <h5 className="font-bold text-xs text-slate-900">Tag & Wristband Bundle</h5>
                <p className="text-[10px] text-slate-500 mt-1">Card + silicone sport wristband.</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Order Customization Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-slate-900 text-sm">Order Customization</h4>
            <p className="text-[11px] text-slate-400">Configure details engraved directly onto the card face</p>
          </div>

          {/* Step 1: Target Profile */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">1. Select Target Profile</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl border-2 border-[#0284c7] bg-sky-50 text-slate-900 font-bold">
                Marcus Vance (Self)
                <span className="text-[10px] text-slate-500 block font-normal">O- Neg • ID: #8849</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                Elena Vance (Spouse)
                <span className="text-[10px] text-slate-400 block">A+ Pos • ID: #8850</span>
              </div>
            </div>
          </div>

          {/* Step 2: Visible Badges */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">2. Visible Emergency Badges (On Physical Face)</label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#0284c7]" />
              <div>
                <span className="font-bold text-slate-800 block">Show Blood Group (O- Negative)</span>
                <span className="text-[10px] text-slate-400">Critically informs emergency un-crossmatched transfusions</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#0284c7]" />
              <div>
                <span className="font-bold text-slate-800 block">Print Severe Allergies</span>
                <span className="text-[10px] text-slate-400">Highlights Penicillin & Peanut anaphylaxis warnings</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#0284c7]" />
              <div>
                <span className="font-bold text-slate-800 block">Engrave Primary Emergency Contact 1</span>
                <span className="text-[10px] text-slate-400">+1 (555) 942-3810 (Elena Vance)</span>
              </div>
            </label>
          </div>

          {/* Step 3: Shipping */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">3. Discreet Medical Shipping Address</span>
              <button className="text-[#0284c7] font-bold text-[11px]">Edit</button>
            </div>
            <p className="text-slate-600 text-[11px]">
              Marcus Vance • Home<br />
              742 Evergreen Terrace, Suite 4B, Springfield, OR 97477
            </p>
            <span className="text-[10px] text-emerald-700 font-bold block pt-1">
              ✓ Dispatched within 24h • Stealth tamper-evident seal
            </span>
          </div>

          {/* Pricing & Checkout */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Total Investment</span>
              <span className="text-2xl font-black text-slate-900">
                {selectedMaterial === 'PVC' ? '$14.99' : selectedMaterial === 'TITANIUM' ? '$29.99' : '$39.99'}
              </span>
            </div>

            <button
              onClick={() => {
                setOrdered(true);
                alert('Order Placed! Your MediSync Emergency Physical Card will be manufactured and shipped within 24 hours.');
              }}
              className="px-6 py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>{ordered ? 'Order Placed ✓' : 'Order MediSync Shield'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
