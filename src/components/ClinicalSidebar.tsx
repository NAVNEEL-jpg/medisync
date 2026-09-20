'use client';

import React from 'react';
import {
  LayoutGrid,
  QrCode,
  CreditCard,
  Activity,
  Globe2,
  ShieldCheck,
  Radio,
} from 'lucide-react';

export type NavigationPage =
  | 'PATIENT_DASHBOARD'
  | 'EMERGENCY_QR_VIEW'
  | 'WALLET_CARD'
  | 'CLINICAL_TRIAGE_REGISTRY'
  | 'GLOBAL_MEDICAL_NEWS'
  | 'SECURE_AUTH';

interface ClinicalSidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export function ClinicalSidebar({ currentPage, onNavigate }: ClinicalSidebarProps) {
  const navItems = [
    {
      id: 'PATIENT_DASHBOARD' as NavigationPage,
      label: 'Patient Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'EMERGENCY_QR_VIEW' as NavigationPage,
      label: 'Emergency QR View',
      icon: QrCode,
    },
    {
      id: 'WALLET_CARD' as NavigationPage,
      label: 'Emergency Wallet Card',
      icon: CreditCard,
    },
    {
      id: 'CLINICAL_TRIAGE_REGISTRY' as NavigationPage,
      label: 'Clinical Triage Registry',
      icon: Activity,
    },
    {
      id: 'GLOBAL_MEDICAL_NEWS' as NavigationPage,
      label: 'Global Medical News',
      icon: Globe2,
    },
    {
      id: 'SECURE_AUTH' as NavigationPage,
      label: 'Secure Auth & Verification',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between py-6 pr-4 space-y-6">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 font-sans">
          Clinical Navigation
        </h4>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs transition text-left ${
                  isActive
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Triage Protocol Card */}
      <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-700">Triage Protocol</span>
          <span className="text-[10px] font-extrabold uppercase text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            ONLINE
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Rapid vitals and medical alert routing active for triage ward.
        </p>
      </div>
    </aside>
  );
}
