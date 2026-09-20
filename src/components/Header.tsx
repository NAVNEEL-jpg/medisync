'use client';

import React, { useState } from 'react';
import { Activity, ShieldAlert, User, Sparkles, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export interface UserProfile {
  age: string;
  gender: string;
  allergies: string;
  conditions: string;
}

interface HeaderProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export function Header({ profile, onUpdateProfile }: HeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(tempProfile);
    setShowProfileModal(false);
  };

  return (
    <>
      {/* Top emergency warning bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-medium">
            Medical Disclaimer: MediSync is an educational AI companion powered by Gemini. In an emergency, dial 911 or visit the nearest ER immediately.
          </span>
          <button
            onClick={() => setShowEmergency(!showEmergency)}
            className="ml-auto underline font-semibold hover:text-amber-900 dark:hover:text-amber-200 shrink-0"
          >
            {showEmergency ? 'Hide Emergency Info' : 'Emergency Hotlines'}
          </button>
        </div>
      </div>

      {showEmergency && (
        <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/50 p-4 transition-all">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <p className="font-bold text-red-900 dark:text-red-200">Critical Red Flag Warning</p>
                <p className="text-red-700 dark:text-red-300 text-xs">
                  Seek emergency care immediately for chest pain, shortness of breath, sudden numbness, slurred speech, or severe head injury.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:911"
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
              >
                Call 911 (US/CA)
              </a>
              <a
                href="tel:112"
                className="px-3 py-1.5 bg-red-800 text-white rounded-lg text-xs font-semibold hover:bg-red-900 transition"
              >
                Call 112 (EU/Global)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main navigation header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 text-white">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  MediSync
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300/50 dark:border-teal-700/50">
                  AI Health Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Clinical-Grade Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Gemini Live Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>Gemini 3.6 Connected</span>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => {
                setTempProfile(profile);
                setShowProfileModal(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition shadow-xs"
              title="Configure Personal Patient Context"
            >
              <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="hidden md:inline">
                {profile.age ? `Patient (${profile.age}y)` : 'Patient Context'}
              </span>
              {showProfileModal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </header>

      {/* Patient Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Patient Profile & Context</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Personalizes AI answers and safety checks</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={tempProfile.age}
                    onChange={(e) => setTempProfile({ ...tempProfile, age: e.target.value })}
                    placeholder="e.g. 34"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={tempProfile.gender}
                    onChange={(e) => setTempProfile({ ...tempProfile, gender: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other / Non-binary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Known Allergies
                </label>
                <input
                  type="text"
                  value={tempProfile.allergies}
                  onChange={(e) => setTempProfile({ ...tempProfile, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Peanuts, Sulfa"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chronic Conditions
                </label>
                <input
                  type="text"
                  value={tempProfile.conditions}
                  onChange={(e) => setTempProfile({ ...tempProfile, conditions: e.target.value })}
                  placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save Context
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
