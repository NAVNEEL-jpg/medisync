'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  PhoneCall,
  User,
  LogOut,
  LogIn,
  CheckCircle,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';
import { NavigationPage } from './ClinicalSidebar';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, logOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navLinks = [
    { id: 'PATIENT_DASHBOARD' as NavigationPage, label: 'Patient Dashboard' },
    { id: 'EMERGENCY_QR_VIEW' as NavigationPage, label: 'Emergency QR View' },
    { id: 'WALLET_CARD' as NavigationPage, label: 'Emergency Wallet Card' },
    { id: 'CLINICAL_TRIAGE_REGISTRY' as NavigationPage, label: 'Clinical Triage Registry' },
    { id: 'GLOBAL_MEDICAL_NEWS' as NavigationPage, label: 'Global Medical News' },
    { id: 'SECURE_AUTH' as NavigationPage, label: 'Secure Auth & Verification' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
        {/* Topmost Clinical Trauma Grid Bar */}
        <div className="bg-[#0284c7] px-4 py-1 text-xs text-white flex items-center justify-between font-sans">
          <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="font-bold tracking-tight text-[11px]">
                Emergency Medical Registry Active • National Trauma Grid Synchronized (Hospital Node 04)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 opacity-90">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                Latency: 14ms
              </span>
              <span className="opacity-60">|</span>
              <span className="opacity-90 font-mono">Encrypted HL7 / FHIR Relay</span>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo & Direct Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('PATIENT_DASHBOARD')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-bold shadow-xs">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#0f172a] font-sans">
                MediSync
              </span>
            </button>

            {/* Direct Triage Pulse Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span>TRIAGE LEVEL 1 DIRECT</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-700">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-2 rounded-xl transition ${
                    isActive
                      ? 'bg-[#0284c7] text-white shadow-xs'
                      : 'hover:text-[#0284c7] hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Provider Status & SOS Hotline */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Doctor Verification Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-left">
              <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
              <div>
                <p className="font-extrabold text-slate-900 leading-tight text-[11px]">
                  {user ? user.displayName : 'Dr. Sarah RN'}
                </p>
                <p className="text-[10px] text-sky-800 leading-tight">
                  Hospital Node 04 • Trauma Level 1
                </p>
              </div>
            </div>

            {/* SOS Emergency Hotline Button */}
            <a
              href="tel:112"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition shadow-sm"
            >
              <div className="text-left leading-none">
                <span className="text-[8px] tracking-widest uppercase block text-red-200">SOS</span>
                <span className="text-sm font-black tracking-tight">HOTLINE</span>
              </div>
              <span className="text-xs font-mono font-bold pl-1 border-l border-red-500">
                112 / 911
              </span>
            </a>

            {/* Auth / Avatar */}
            {user ? (
              <button
                onClick={() => logOut()}
                className="w-9 h-9 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs hover:bg-red-600 transition"
                title="Sign Out"
              >
                {user.displayName.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition"
                title="Sign In"
              >
                <User className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav row */}
        <div className="xl:hidden flex overflow-x-auto gap-1 p-2 bg-slate-50 border-t border-slate-200 text-xs">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap ${
                currentPage === link.id
                  ? 'bg-[#0284c7] text-white'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
