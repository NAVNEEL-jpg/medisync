'use client';

import React from 'react';
import {
  LayoutGrid,
  QrCode,
  CreditCard,
  Activity,
  Globe2,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export type NavigationPage =
  | 'FRONT_LOGIN'
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
      id: 'FRONT_LOGIN' as NavigationPage,
      label: 'Login & Security',
      sublabel: 'Sign in / Sign up',
      icon: ShieldCheck,
    },
    {
      id: 'PATIENT_DASHBOARD' as NavigationPage,
      label: 'My Health Records',
      sublabel: 'Tests, prescriptions & history',
      icon: LayoutGrid,
    },
    {
      id: 'EMERGENCY_QR_VIEW' as NavigationPage,
      label: 'Emergency QR Card',
      sublabel: 'For doctors in emergencies',
      icon: QrCode,
    },
    {
      id: 'WALLET_CARD' as NavigationPage,
      label: 'Emergency Wallet Card',
      sublabel: 'Print & carry your details',
      icon: CreditCard,
    },
    {
      id: 'CLINICAL_TRIAGE_REGISTRY' as NavigationPage,
      label: 'Clinical Triage',
      sublabel: 'Hospital registry view',
      icon: Activity,
    },
    {
      id: 'GLOBAL_MEDICAL_NEWS' as NavigationPage,
      label: 'Health News',
      sublabel: 'Latest medical updates',
      icon: Globe2,
    },
    {
      id: 'SECURE_AUTH' as NavigationPage,
      label: 'Health ID (NDHM)',
      sublabel: 'National Health identity',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between py-6 pr-4 space-y-6">
      <div className="space-y-5">
        <p className="text-[11px] font-semibold px-3 font-display" style={{ color: 'var(--color-foreground-muted)' }}>
          Navigation
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`sidebar-nav-btn press-scale ${isActive ? 'active' : 'inactive'}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: isActive ? 'var(--clr-coral)' : 'var(--color-muted)',
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? 'white' : 'var(--color-foreground-muted)' }}
                  />
                </div>
                <div className="text-left min-w-0">
                  <span className="block truncate text-[13px]"
                        style={{ color: isActive ? 'var(--clr-coral-hover)' : 'var(--color-foreground)', fontWeight: 600 }}>
                    {item.label}
                  </span>
                  {item.sublabel && (
                    <span className="block truncate text-[11px] font-normal" style={{ color: 'var(--color-foreground-muted)' }}>
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom health status card */}
      <div className="rounded-2xl p-4 space-y-3"
           style={{ background: 'var(--clr-navy)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4" style={{ color: 'var(--clr-coral)' }} />
            <span className="text-[12px] font-semibold font-display" style={{ color: '#E2E8F0' }}>
              Health System
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold font-display"
                style={{ color: 'var(--clr-mint)' }}>
            <span className="status-dot-green" />
            Online
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>
          Your records are encrypted and safe. Accessible to you and authorised doctors only.
        </p>
      </div>
    </aside>
  );
}
