'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Lock, Mail, User, ShieldAlert, Key, Stethoscope, HeartHandshake, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, quickLoginAs, isFirebaseActive } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [hospital, setHospital] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const extra: Record<string, string> = {};
        if (role === 'DOCTOR') {
          extra.licenseNumber = licenseNumber;
          extra.hospital = hospital;
        } else if (role === 'PATIENT') {
          extra.aadhaarNumber = aadhaarNumber;
        }

        await signUp(email, password, name || email.split('@')[0], role, extra);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (targetRole: UserRole) => {
    quickLoginAs(targetRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0284c7] flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">MediSync Secure Portal</h3>
              <p className="text-[11px] text-slate-400">
                {isFirebaseActive ? 'Firebase Auth Connected' : 'Local Auth & Credential Store'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="flex border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-3 font-bold text-center border-b-2 transition ${
              !isRegister
                ? 'border-[#0284c7] text-[#0284c7] bg-sky-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-3 font-bold text-center border-b-2 transition ${
              isRegister
                ? 'border-[#0284c7] text-[#0284c7] bg-sky-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Quick Demo Logins Bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
              ⚡ Instant 1-Click Demo Logins:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('DOCTOR')}
                className="px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-200 transition flex items-center justify-center gap-1 text-[11px]"
              >
                <Stethoscope className="w-3 h-3 text-red-600" />
                ER Doctor
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('PATIENT')}
                className="px-2 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold border border-sky-200 transition flex items-center justify-center gap-1 text-[11px]"
              >
                <User className="w-3 h-3 text-[#0284c7]" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('CAMP_WORKER')}
                className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition flex items-center justify-center gap-1 text-[11px]"
              >
                <HeartHandshake className="w-3 h-3 text-emerald-600" />
                Camp Worker
              </button>
            </div>
          </div>

          {/* Role Selection when Registering */}
          {isRegister && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Account Type *</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setRole('PATIENT')}
                  className={`p-2 rounded-lg border font-bold text-center transition ${
                    role === 'PATIENT'
                      ? 'bg-[#0284c7] text-white border-[#0284c7]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setRole('DOCTOR')}
                  className={`p-2 rounded-lg border font-bold text-center transition ${
                    role === 'DOCTOR'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Doctor / ER
                </button>
                <button
                  type="button"
                  onClick={() => setRole('CAMP_WORKER')}
                  className={`p-2 rounded-lg border font-bold text-center transition ${
                    role === 'CAMP_WORKER'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  ASHA / Camp
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#0284c7]"
                />
              </div>
            )}

            {isRegister && role === 'DOCTOR' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medical License # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MCI-99412"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hospital *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AIIMS Delhi"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full p-2 rounded-lg border"
                  />
                </div>
              </div>
            )}

            {isRegister && role === 'PATIENT' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">12-Digit Aadhaar Number</label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="e.g. 234567890123"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border font-mono"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#0284c7]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#0284c7]"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-xs transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : isRegister ? 'Register & Store Credentials' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
