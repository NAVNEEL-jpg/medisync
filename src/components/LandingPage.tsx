'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { MediSyncLogo } from '@/components/MediSyncLogo';
import { CareLinkDeviceGraphic } from '@/components/CareLinkDeviceGraphic';
import { DesignForBharatModal } from '@/components/DesignForBharatModal';
import { GlobalMedicalNews } from '@/components/GlobalMedicalNews';
import {
  Shield,
  Activity,
  Heart,
  QrCode,
  Users,
  Building2,
  Award,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Radio,
  FileText,
  Volume2,
  Globe2,
  Sparkles,
  PhoneCall,
  Lock,
  Compass,
  ArrowUpRight,
  AlertTriangle,
  Zap,
  X,
  Radar,
  Flame,
} from 'lucide-react';

interface LandingPageProps {
  onEnterPortal: (role?: UserRole) => void;
  onOpenAuthModal: () => void;
}

export function LandingPage({ onEnterPortal, onOpenAuthModal }: LandingPageProps) {
  const { user, quickLoginAs } = useAuth();
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [showBiosurveillanceModal, setShowBiosurveillanceModal] = useState(false);

  const handleLaunchRole = (role: UserRole) => {
    quickLoginAs(role);
    onEnterPortal(role);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050D1A] text-slate-100 font-body selection:bg-teal-500 selection:text-slate-950 overflow-x-hidden">
      {/* ── TOP COMPETITION BANNER ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-teal-950 via-[#0B2538] to-slate-900 border-b border-teal-500/30 px-3 py-2 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-slate-200">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 text-[11px]">
            <Award className="w-3.5 h-3.5 text-teal-400" /> Design for Bharat Challenge 2026
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="text-[12px] text-slate-300">
            Category 2: <strong>Accessible Healthcare &amp; Assistive Tech (Swasthya)</strong>
          </span>
          <button
            onClick={() => setShowJudgeModal(true)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-400 hover:text-teal-300 underline underline-offset-4 ml-1 cursor-pointer"
          >
            Open Evaluation Dossier <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── STICKY NAVIGATION BAR ──────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-[#050D1A]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MediSyncLogo
              size={38}
              subtitle="Assistive Healthcare Ecosystem"
              wordmarkClass="font-display font-bold text-[18px] tracking-tight text-white"
              subtitleClass="text-[11px] text-teal-400 font-mono tracking-wide"
            />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <a href="#solution" className="hover:text-teal-300 transition-colors">Solution</a>
            <a href="#device" className="hover:text-teal-300 transition-colors">Assist Device</a>
            <a href="#how-it-works" className="hover:text-teal-300 transition-colors">How It Works</a>
            <a href="#accessibility" className="hover:text-teal-300 transition-colors">Accessibility</a>
            <a href="#architecture" className="hover:text-teal-300 transition-colors">Architecture</a>
            <a href="#impact" className="hover:text-teal-300 transition-colors">Bharat Impact</a>
          </div>

          {/* CTA Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowJudgeModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-950/60 text-teal-300 border border-teal-500/40 hover:bg-teal-900/40 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Judge Deck</span>
            </button>

            {user ? (
              <button
                onClick={() => onEnterPortal(user.role)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all shadow-md shadow-teal-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all shadow-md shadow-teal-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <span>Sign In / Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ───────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-8 border-b border-white/5 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Mission & Problem Hook */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Technology That Cares. Healthcare That Reaches Everyone.</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
              Assistive Healthcare for Every Indian Home.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              <strong>MediSync CareLink</strong> unites a low-cost ESP32 assistive wearable, an ABDM-compliant health vault, and a tri-directional care network. Continuous vitals monitoring, suspected fall detection, and 1-touch emergency SOS — built for our elders, caregivers, and rural frontline workers.
            </p>

            {/* Role Demo Launcher Box */}
            <div className="pt-2">
              <p className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold mb-2.5">
                Instant Interactive Evaluation Demos:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto lg:mx-0">
                <button
                  onClick={() => handleLaunchRole('PATIENT')}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-teal-500/40 hover:border-teal-400 hover:bg-slate-800/80 transition-all text-left group cursor-pointer shadow-md"
                >
                  <p className="text-[11px] font-mono text-teal-400 font-bold">1. Patient View</p>
                  <p className="text-xs text-white font-semibold mt-0.5 truncate">Rajesh Sharma</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Vitals &amp; QR Vault</p>
                </button>

                <button
                  onClick={() => handleLaunchRole('CAREGIVER')}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 hover:bg-slate-800/80 transition-all text-left group cursor-pointer shadow-md"
                >
                  <p className="text-[11px] font-mono text-cyan-400 font-bold">2. Caregiver</p>
                  <p className="text-xs text-white font-semibold mt-0.5 truncate">Ananya Sharma</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Fall alerts &amp; status</p>
                </button>

                <button
                  onClick={() => handleLaunchRole('DOCTOR')}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 hover:bg-slate-800/80 transition-all text-left group cursor-pointer shadow-md"
                >
                  <p className="text-[11px] font-mono text-purple-400 font-bold">3. Doctor / ER</p>
                  <p className="text-xs text-white font-semibold mt-0.5 truncate">Dr. Vivek Mehra</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Triage &amp; Telemetry</p>
                </button>

                <button
                  onClick={() => handleLaunchRole('CAMP_WORKER')}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 hover:bg-slate-800/80 transition-all text-left group cursor-pointer shadow-md"
                >
                  <p className="text-[11px] font-mono text-amber-400 font-bold">4. Rural Kiosk</p>
                  <p className="text-xs text-white font-semibold mt-0.5 truncate">Sunita (ASHA)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Offline Camp Sync</p>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> Sub-₹1,800 BOM Target
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> &lt; 8s EMT QR Triage
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> 100% Offline Resilience
              </span>
            </div>
          </div>

          {/* Right Column: 3D Hardware Device Graphic & Live Simulated Telemetry */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full flex flex-col items-center">
              {/* Product Badge */}
              <div className="mb-2 text-center">
                <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase font-bold">
                  PROPOSED ASSISTIVE HARDWARE ARCHITECTURE
                </span>
                <p className="text-sm font-display font-bold text-white">
                  CareLink Assist V1 (ESP32-WROOM-32)
                </p>
              </div>

              {/* 3D-styled interactive device */}
              <CareLinkDeviceGraphic interactive={true} activeMode="normal" />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM STATEMENT ──────────────────────────────── */}
      <section id="problem" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#030914] border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
              The Reality of Indian Emergency Healthcare
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              The "Golden Hour" Crisis: 150,000+ Preventable Deaths Annually
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              In the critical first 60 minutes after severe trauma, cardiac arrest, or accidental falls, emergency responders treat unconscious patients with <strong>zero access to medical history</strong>, creating lethal blind spots.
            </p>
          </div>

          {/* Golden Hour Trauma Blind Spots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-rose-500/30 space-y-3 hover:border-rose-400 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider">Blind Spot 1</span>
              <h3 className="text-lg font-display font-bold text-white">Lethal Drug Allergies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unconscious patients administered Penicillin or NSAIDs by first responders suffer catastrophic anaphylactic shock or gastric hemorrhage due to zero EHR visibility during trauma intake.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-rose-300">
                Risk: Catastrophic Anaphylaxis
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-amber-500/30 space-y-3 hover:border-amber-400 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">Blind Spot 2</span>
              <h3 className="text-lg font-display font-bold text-white">Hidden Surgical Implants</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency MRI scans performed without awareness of non-conditional pacemakers, aneurysm clips, or metallic hardware cause lethal internal burns and tissue displacement.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-amber-300">
                Risk: MRI High-Field Injury
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-cyan-500/30 space-y-3 hover:border-cyan-400 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Blind Spot 3</span>
              <h3 className="text-lg font-display font-bold text-white">Fragmented Silos &amp; Biometrics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Health data in India remains trapped in disparate private clinic files, paper prescriptions, or inaccessible behind locked smartphone biometrics of an unconscious victim.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-cyan-300">
                Risk: Zero-Information Triage
              </div>
            </div>
          </div>

          {/* Grassroots & Elderly Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Elderly Care &amp; Silent Falls</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Over 138 million elderly Indians live without round-the-clock medical oversight. Commercial smartwatches cost ₹25,000+ and require complex smartphone pairing that seniors struggle to operate.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-1">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Rural Doctor Deficit (1:11,000)</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Primary Health Centers face severe shortages. Frontline ASHA workers lack portable diagnostic records, and village camps battle frequent blackouts and zero cellular reception.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR THREE-PILLAR SOLUTION ──────────────────────────── */}
      <section id="solution" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
              Comprehensive Swasthya Ecosystem
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Three Interconnected Systems. One Unified Safety Net.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              MediSync CareLink does not rely on a standalone app or an isolated gadget. It integrates hardware, software, and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* System A */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-teal-500/40 space-y-4 hover:border-teal-400 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-teal-400 font-bold uppercase">System A</span>
              <h3 className="text-xl font-display font-bold text-white">CareLink Assist Device</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Affordable ESP32-based wearable or bedside hub. Collects pulse rate &amp; SpO2 via Maxim MAX30102, analyzes 6-axis motion via MPU6050 for suspected falls, provides a hardware SOS button, and displays vitals directly on a low-power 0.96" OLED screen.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Standalone screen (No phone required)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Hardware GPIO SOS button
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Sub-₹1,800 production BOM target
                </li>
              </ul>
            </div>

            {/* System B */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/40 space-y-4 hover:border-cyan-400 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">System B</span>
              <h3 className="text-xl font-display font-bold text-white">CareLink Digital Platform</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                FHIR R4 / ABDM-compliant personal health vault. Manages patient history, diagnostic reports, surgeries, and encrypted revocable QR triage tokens. Uses Google Gemini AI with clinical boundaries to translate medical terms into plain vernacular languages.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Revocable Token Emergency QR
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Explainable Gemini Medical AI
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> ABDM / ABHA 14-Digit Node
                </li>
              </ul>
            </div>

            {/* System C */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/40 space-y-4 hover:border-purple-400 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-purple-400 font-bold uppercase">System C</span>
              <h3 className="text-xl font-display font-bold text-white">CareLink Care Network</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consent-controlled coordination ring connecting patients, family caregivers, consulting doctors, and ASHA facilitators. Dispatches instant notifications on suspected falls or missed medications without compromising patient data sovereignty.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Granular Consent Controls
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Suspected Fall Alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Medication Adherence Timeline
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS WORKFLOW ──────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#030914] border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
              Emergency Response Lifecycle
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              From Detection to Triage in Seconds
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              How MediSync CareLink ensures zero-delay emergency escalation without requiring phone dexterity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Continuous Monitoring',
                desc: 'CareLink device passively reads heart rate, SpO2, and 6-axis acceleration vectors at 50Hz.',
                tag: 'ESP32 + MAX30102',
              },
              {
                step: '02',
                title: 'Event Detection',
                desc: 'A physical SOS push or a sudden high-G impact spike triggers local buzzer and backend validation.',
                tag: 'MPU6050 + GPIO',
              },
              {
                step: '03',
                title: 'Caregiver Dispatch',
                desc: 'Backend validates device token, logs event, and dispatches push alerts to authorized family.',
                tag: 'CareLink API + SMS',
              },
              {
                step: '04',
                title: 'Hospital Break-Glass',
                desc: 'Paramedic scans patient QR token to unlock allergies, blood group, and history with audit logging.',
                tag: 'ABDM QR + FHIR R4',
              },
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3 relative group">
                <span className="text-2xl font-display font-extrabold text-teal-400/80">{s.step}</span>
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">{s.tag}</p>
                <h3 className="text-base font-display font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCESSIBILITY & ASSISTIVE TECH (SWASTHYA) ─────────── */}
      <section id="accessibility" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
              Category 2 Focus: Assistive Tech
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Designed for Non-Tech Literate &amp; Elderly Users
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              True accessibility is built directly into every screen, not hidden inside a forgotten settings menu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-teal-500/30 space-y-2.5">
              <span className="text-xl">🔤</span>
              <h3 className="text-base font-display font-bold text-white">Large Button &amp; Font Scaling</h3>
              <p className="text-xs text-slate-400">
                125% and 150% typography multipliers with 56px minimum touch targets for tremor or arthritis accessibility.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-teal-500/30 space-y-2.5">
              <span className="text-xl">👁️</span>
              <h3 className="text-base font-display font-bold text-white">High-Contrast Mode</h3>
              <p className="text-xs text-slate-400">
                WCAG AAA compliant black/yellow and deep navy palettes ensuring readability for cataracts and visual impairments.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-teal-500/30 space-y-2.5">
              <span className="text-xl">🗣️</span>
              <h3 className="text-base font-display font-bold text-white">Voice &amp; Audio Readout (TTS)</h3>
              <p className="text-xs text-slate-400">
                Integrated speech synthesis reads aloud vitals and prescriptions; speech-to-command allows hands-free navigation.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-teal-500/30 space-y-2.5">
              <span className="text-xl">🇮🇳</span>
              <h3 className="text-base font-display font-bold text-white">Trilingual Vernacular</h3>
              <p className="text-xs text-slate-400">
                Full interface and AI translation available in English, Hindi (हिंदी), and Bengali (বাংলা) for genuine grassroots reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLINICAL AI & BIOSURVEILLANCE RADAR ────────────────── */}
      <section id="biosurveillance" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#020815] border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Clinical AI &amp; Biosurveillance Radar
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Predictive Intelligence &amp; Syndromic Disease Watch
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              MediSync CareLink combines Google Gemini AI clinical summarization with a real-time syndromic surveillance radar that tracks outbreaks and emergency surges across Indian districts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-cyan-500/30 space-y-3 hover:border-cyan-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">Gemini Multi-Model AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-downtime medical report explanations, automatic prescription extraction, and trilingual vernacular translations with strict clinical boundaries and zero hallucinations guardrails.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-cyan-300">
                Source-Attributed Clinical Summaries
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-teal-500/30 space-y-3 hover:border-teal-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">Planetary Biosurveillance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live syndromic disease surveillance radar monitoring heatwave alerts, vector-borne surges (Dengue, Malaria), and WHO/CDC bulletins directly connected to hospital triage portals.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-teal-300">
                Sub-Second District Telemetry Feeds
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">Break-Glass Audit &amp; NMC Trail</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sub-180ms emergency record decryption for licensed trauma doctors during trauma triage. Every override triggers an immutable, tamper-evident audit record compliant with NMC regulations.
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-purple-300">
                100% Tamper-Evident Access Log
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setShowBiosurveillanceModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-display font-bold text-sm shadow-xl shadow-cyan-600/20 cursor-pointer transition-all"
            >
              <Globe2 className="w-4 h-4" />
              <span>Launch Live Biosurveillance Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── BHARAT SOCIAL IMPACT & AFFORDABILITY ───────────────── */}
      <section id="impact" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#030914] border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
              Social Impact &amp; Scalability
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Built for Scale Across All 28 States
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Sustainable technology architecture designed to work in district hospitals, rural sub-centers, and urban homes alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
              <p className="text-4xl font-display font-extrabold text-teal-400">&lt; ₹1,800</p>
              <p className="text-sm font-bold text-white">Hardware Production BOM Target</p>
              <p className="text-xs text-slate-400">
                15x cheaper than imported proprietary wearables, with zero subscription fees for core emergency capabilities.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
              <p className="text-4xl font-display font-extrabold text-cyan-400">100%</p>
              <p className="text-sm font-bold text-white">Offline Resilience for ASHAs</p>
              <p className="text-xs text-slate-400">
                Caches patient enrollments and vitals in local IndexedDB; pushes updates when cellular or broadband returns.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
              <p className="text-4xl font-display font-extrabold text-purple-400">ABDM</p>
              <p className="text-sm font-bold text-white">HL7 FHIR R4 Ready</p>
              <p className="text-xs text-slate-400">
                Complies with national digital health standards for seamless integration with Ayushman Bharat health accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-8 bg-[#02060D] border-t border-white/10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <MediSyncLogo
              size={32}
              subtitle="Design for Bharat Challenge 2026"
              wordmarkClass="font-display font-bold text-sm text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button
              onClick={() => setShowJudgeModal(true)}
              className="text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
            >
              Evaluation Dossier
            </button>
            <button
              onClick={() => setShowBiosurveillanceModal(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              Biosurveillance Radar
            </button>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#device" className="hover:text-white transition-colors">Hardware Architecture</a>
            <a href="#accessibility" className="hover:text-white transition-colors">Assistive Tech</a>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            © 2026 MediSync CareLink · Open Source Healthcare Architecture
          </div>
        </div>
      </footer>

      {/* Evaluation Dossier Modal for Judges */}
      <DesignForBharatModal
        isOpen={showJudgeModal}
        onClose={() => setShowJudgeModal(false)}
      />

      {/* Planetary Biosurveillance Radar Modal */}
      {showBiosurveillanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-[#091322] border border-cyan-500/40 shadow-2xl overflow-hidden text-slate-100 font-body">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-white">
                    Planetary Biosurveillance &amp; Epidemic Radar
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live syndromic surveillance, outbreak intelligence, and multi-source clinical feeds
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBiosurveillanceModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <GlobalMedicalNews />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
