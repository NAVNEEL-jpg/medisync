'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { DarkInput } from '@/components/ui/Input';
import { DarkCard } from '@/components/ui/Card';
import { DarkTabBar } from '@/components/ui/TabBar';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  Activity,
  Building2,
  User,
  Mail,
  Phone,
  Fingerprint,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { MediSyncLogo } from '@/components/MediSyncLogo';

interface FrontAuthPageProps {
  onEnterDashboard?: (targetRole?: UserRole) => void;
}

interface ParsedAuthError {
  title: string;
  message: string;
  type: 'unauthorized_domain' | 'email_in_use' | 'invalid_credential' | 'user_not_found' | 'general';
}

function parseAuthError(err: unknown): ParsedAuthError {
  const error = err as { code?: string; message?: string };
  const code = error?.code || '';
  const msg = error?.message || String(err);

  if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
    return {
      title: 'Firebase Authorized Domain Required',
      message: 'This domain (medisync-signal4.vercel.app) is not yet added in your Firebase Console. In Firebase, go to Authentication → Settings → Authorized domains and add this domain.',
      type: 'unauthorized_domain',
    };
  }
  if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
    return {
      title: 'Account Already Exists',
      message: 'An account with this email is already registered. Please switch to "Sign in" instead of registering.',
      type: 'email_in_use',
    };
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || msg.includes('invalid-credential') || msg.includes('wrong-password')) {
    return {
      title: 'Invalid Credentials',
      message: 'The email or password entered is incorrect. Please check your credentials or use Quick Demo login.',
      type: 'invalid_credential',
    };
  }
  if (code === 'auth/user-not-found' || msg.includes('user-not-found')) {
    return {
      title: 'No Account Found',
      message: 'No account exists for this email. Please switch to "Create account" to register.',
      type: 'user_not_found',
    };
  }
  return {
    title: 'Authentication Notice',
    message: msg.replace(/^Firebase:\s*/i, '').replace(/Error\s*\([^)]*\):\s*/i, ''),
    type: 'general',
  };
}

export function FrontAuthPage({ onEnterDashboard }: FrontAuthPageProps) {
  const {
    user,
    signIn,
    signUpCitizen,
    signUpOrganisation,
    quickLoginAs,
    isFirebaseActive,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authRole, setAuthRole] = useState<'citizen' | 'organisation'>('citizen');

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<ParsedAuthError | null>(null);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isOrgSubmitting, setIsOrgSubmitting] = useState(false);
  const isAnySubmitting = isEmailSubmitting || isOrgSubmitting;

  // Citizen
  const [citizenName, setCitizenName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');

  // Organisation
  const [orgName, setOrgName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [orgType, setOrgType] = useState('Hospital & Trauma Center');
  const [orgPhone, setOrgPhone] = useState('');

  // Aadhaar formatter
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarNumber(formatted);
  };

  const validateAadhaarAndPhone = () => {
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    if (!cleanAadhaar) {
      throw new Error('Aadhaar number is required. Please enter your 12-digit Aadhaar number.');
    }
    if (cleanAadhaar.length !== 12) {
      throw new Error(`Aadhaar number must be exactly 12 digits (currently ${cleanAadhaar.length}).`);
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone) {
      throw new Error('Mobile number is required. Please enter your mobile number.');
    }
    if (cleanPhone.length < 10) {
      throw new Error(`Mobile number must be at least 10 digits (currently ${cleanPhone.length}).`);
    }
    return { cleanAadhaar, cleanPhone };
  };

  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsEmailSubmitting(true);
    try {
      if (authMode === 'login') {
        await signIn(email, password);
      } else {
        validateAadhaarAndPhone();
        await signUpCitizen({ name: citizenName, aadhaarNumber, phoneNumber, email, password, bloodGroup });
      }
      onEnterDashboard?.('PATIENT');
    } catch (err: unknown) {
      setAuthError(parseAuthError(err));
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsOrgSubmitting(true);
    try {
      if (authMode === 'login') {
        await signIn(email, password);
      } else {
        await signUpOrganisation({ orgName, licenseNumber, officerName, orgType, phoneNumber: orgPhone, email, password });
      }
      onEnterDashboard?.('DOCTOR');
    } catch (err: unknown) {
      setAuthError(parseAuthError(err));
    } finally {
      setIsOrgSubmitting(false);
    }
  };

  const cleanAadhaarDigits = aadhaarNumber.replace(/\s/g, '').length;
  const isAadhaarComplete = cleanAadhaarDigits === 12;
  const isPhoneValid = phoneNumber.replace(/\D/g, '').length >= 10;

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-display">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: `url('/login-hero.jpg')`,
          filter: 'blur(3px) brightness(0.22)',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#030B1A]/85 via-[#030B1A]/90 to-[#030B1A]/98" />

      {/* ── Header ─────────────────────────────────────── */}
      <header className="relative z-10 w-full px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        <MediSyncLogo
          size={36}
          subtitle="Emergency Medical Database"
          subtitleClass="text-[10px] sm:text-[11px] text-slate-400 font-medium"
          wordmarkClass="font-bold text-white text-base sm:text-lg tracking-tight"
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="success" dot className="hidden md:inline-flex !bg-emerald-500/10 !border-emerald-500/20 !text-emerald-400">
            System active
          </Badge>
          {onEnterDashboard && (
            <Button
              variant="outline"
              size="sm"
              iconRight={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => onEnterDashboard()}
              className="!bg-transparent !text-cyan-300 !border-cyan-400/30 hover:!bg-cyan-500/10 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5"
            >
              <span className="hidden xs:inline">Explore Dashboard</span>
              <span className="xs:hidden">Dashboard</span>
            </Button>
          )}
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-8 grid lg:grid-cols-12 gap-3.5 lg:gap-10 items-center">

        {/* Desktop-Only Hero Showcase (Hidden on mobile to prioritize login on small screens) */}
        <div className="hidden lg:block lg:col-span-6 space-y-4 sm:space-y-5 animate-slideInLeft">
          <div className="flex items-center gap-2 delay-75 animate-fadeIn">
            <Badge variant="info" dot className="!bg-cyan-500/10 !border-cyan-400/25 !text-cyan-300 text-[10px] sm:text-xs">
              24/7 Emergency Access Network
            </Badge>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden sm:inline-block">
              ABDM &amp; HL7 FHIR Compliant
            </span>
          </div>

          <div className="space-y-2 animate-fadeIn delay-150">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-[1.12]">
              Critical Information.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Faster Care.
              </span>
            </h1>

            <p className="text-[14px] sm:text-[15px] text-slate-300 leading-relaxed max-w-lg font-body">
              Medical history at first responders&apos; fingertips, when every second counts. Connect ambulances, trauma centers, and citizen vaults with instant emergency triage.
            </p>
          </div>

          {/* Hero Visual Card */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 group bg-slate-900/80 animate-slideInUp delay-250">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src="/login-hero.jpg"
                alt="MediSync Emergency Field Triage"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030B1A] via-[#030B1A]/25 to-transparent" />

              {/* Floating Top Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#030B1A]/85 backdrop-blur-md border border-white/15 shadow-lg animate-fadeIn delay-500">
                <div className="w-5 h-5 rounded-md overflow-hidden shrink-0">
                  <img src="/medisync-logo.jpg" alt="MediSync" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-display font-semibold text-white tracking-wide">
                  Live ER Triage Terminal
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Floating Bottom HUD Stats */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 animate-slideInUp delay-600">
                <div className="px-3 py-1.5 rounded-xl bg-[#030B1A]/90 backdrop-blur-md border border-cyan-400/30 text-white shadow-md">
                  <p className="text-[9px] text-cyan-300 font-mono font-semibold uppercase tracking-wider">Field Response</p>
                  <p className="text-[12px] sm:text-[13px] font-display font-bold">&lt; 8.4s Average EMT Scan</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aadhaar &amp; ABDM Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
            {[
              { icon: <Shield className="w-3.5 h-3.5 text-cyan-400" />, title: 'Aadhaar Biometric', desc: 'One-scan patient ID' },
              { icon: <Activity className="w-3.5 h-3.5 text-rose-400" />, title: 'Break-Glass Audit', desc: 'Tamper-evident ER log' },
              { icon: <QrCode className="w-3.5 h-3.5 text-emerald-400" />, title: 'Zero-Battery QR', desc: 'Instant paramedic link' },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/8 backdrop-blur-xs animate-slideInUp`}
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {item.icon}
                  <h3 className="text-[11px] sm:text-[12px] font-semibold text-white truncate">{item.title}</h3>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight truncate font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Compact Hero (< lg) */}
        <div className="lg:hidden col-span-12 text-center space-y-1.5 py-1 animate-fadeIn">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>National Health Vault · ABDM Node</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Universal Emergency Medical Vault
          </h1>
          <p className="text-[12px] text-slate-300 max-w-xs mx-auto font-body">
            Instant triage &amp; secure emergency medical history.
          </p>
        </div>

        {/* Right Column — Auth Portal (Centered & compact on iPhone/mobile) */}
        <div className="col-span-12 lg:col-span-6 animate-slideInFromRight delay-100 w-full max-w-md mx-auto lg:max-w-none">
          <div className="glass rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 shadow-2xl shadow-black/50">

            {/* In-Card Brand Banner */}
            <div className="flex items-center gap-2.5 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-white/10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0 border border-cyan-400/30 shadow-md shadow-cyan-500/10">
                <img src="/medisync-logo.jpg" alt="MediSync Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-white font-display font-bold text-[14px] sm:text-[15px] leading-tight">
                  MediSync Access Portal
                </h2>
                <p className="text-slate-400 text-[10px] sm:text-[11px] font-body mt-0.5">
                  Universal Emergency Medical Vault
                </p>
              </div>
            </div>

            {/* Mode Tabs */}
            <DarkTabBar
              tabs={[
                { id: 'login', label: 'Sign in' },
                { id: 'signup', label: 'Create account' },
              ]}
              activeTab={authMode}
              onTabChange={(id) => { setAuthMode(id as 'login' | 'signup'); setAuthError(null); }}
              className="mb-3.5 sm:mb-5"
            />

            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-3.5 sm:mb-5">
              <DarkCard
                selected={authRole === 'citizen'}
                onClick={() => { setAuthRole('citizen'); setAuthError(null); }}
                className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3"
                interactive
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  authRole === 'citizen' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-400'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-semibold text-white leading-tight truncate">Citizen</p>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-400 mt-0.5 truncate">Patient profile</p>
                </div>
              </DarkCard>

              <DarkCard
                selected={authRole === 'organisation'}
                onClick={() => { setAuthRole('organisation'); setAuthError(null); }}
                className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3"
                interactive
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  authRole === 'organisation' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-400'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-semibold text-white leading-tight truncate">Organisation</p>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-400 mt-0.5 truncate">Hospital / ER Node</p>
                </div>
              </DarkCard>
            </div>

            {/* Error Display with Smart Action Buttons */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-[12px] sm:text-[13px] space-y-2 animate-fadeInUp font-body">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-red-300 leading-tight">{authError.title}</p>
                    <p className="text-red-200/90 text-[11px] sm:text-[12px] mt-1 leading-snug">{authError.message}</p>
                  </div>
                </div>

                {authError.type === 'unauthorized_domain' && (
                  <div className="pt-2 border-t border-red-500/20 space-y-1.5">
                    <p className="text-[11px] text-red-300 font-medium">
                      Immediate bypass for testing on this device:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => {
                          quickLoginAs('PATIENT');
                          onEnterDashboard?.('PATIENT');
                        }}
                        className="!bg-cyan-500 hover:!bg-cyan-600 !text-white text-xs font-semibold w-full justify-center"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        Enter Demo Citizen Vault
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          quickLoginAs('DOCTOR');
                          onEnterDashboard?.('DOCTOR');
                        }}
                        className="!bg-slate-700 hover:!bg-slate-600 !text-white text-xs font-semibold w-full justify-center"
                      >
                        <Stethoscope className="w-3.5 h-3.5 mr-1" />
                        Enter Demo Doctor View
                      </Button>
                    </div>
                  </div>
                )}

                {authError.type === 'email_in_use' && (
                  <div className="pt-1.5 border-t border-red-500/20">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError(null);
                      }}
                      className="text-[12px] text-cyan-300 hover:text-cyan-200 underline font-semibold cursor-pointer"
                    >
                      Switch to Sign in with this email →
                    </button>
                  </div>
                )}

                {authError.type === 'user_not_found' && (
                  <div className="pt-1.5 border-t border-red-500/20">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthError(null);
                      }}
                      className="text-[12px] text-cyan-300 hover:text-cyan-200 underline font-semibold cursor-pointer"
                    >
                      Create account with this email →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── CITIZEN FLOW ──────────────────── */}
            {authRole === 'citizen' && (
              <div className="space-y-4">
                {/* Mandatory notice on signup */}
                {authMode === 'signup' && (
                  <div className="p-3 rounded-xl bg-cyan-500/8 border border-cyan-400/20 text-cyan-200 text-[12px] flex items-start gap-2.5 font-body">
                    <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-cyan-300">Required for registration: </span>
                      12-digit Aadhaar number and mobile number for secure medical record indexing.
                    </div>
                  </div>
                )}

                {authMode === 'signup' ? (
                  <form onSubmit={handleCitizenSubmit} className="space-y-3.5">
                    <DarkInput
                      label="Full legal name"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      icon={<User className="w-4 h-4" />}
                      required
                    />

                    <DarkInput
                      label="Aadhaar number (12 digits)"
                      value={aadhaarNumber}
                      onChange={handleAadhaarChange}
                      icon={<Fingerprint className="w-4 h-4" />}
                      maxLength={14}
                      state={isAadhaarComplete ? 'success' : 'default'}
                      helperText={isAadhaarComplete ? '✓ Valid 12 digits' : `${cleanAadhaarDigits} / 12 digits`}
                      required
                    />

                    <div className="grid grid-cols-2 gap-2.5">
                      <DarkInput
                        label="Mobile (+91)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        icon={<Phone className="w-3.5 h-3.5" />}
                        type="tel"
                        state={isPhoneValid ? 'success' : 'default'}
                        required
                      />
                      <div className="relative">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1.5 pl-1">Blood group</label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-[13px] focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none cursor-pointer"
                        >
                          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                            <option key={bg} value={bg} className="bg-slate-900">{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <DarkInput
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail className="w-3.5 h-3.5" />}
                      required
                    />

                    <DarkInput
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock className="w-3.5 h-3.5" />}
                      rightAction={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-white cursor-pointer p-0.5"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      required
                    />

                    <Button
                      type="submit"
                      fullWidth
                      loading={isEmailSubmitting}
                      disabled={isAnySubmitting}
                      iconRight={<ArrowRight className="w-4 h-4" />}
                      className="mt-1 !bg-gradient-to-r !from-cyan-500 !to-teal-500 hover:!from-cyan-600 hover:!to-teal-600 !shadow-lg !shadow-cyan-500/20"
                    >
                      {isEmailSubmitting ? 'Registering...' : 'Complete registration'}
                    </Button>
                  </form>
                ) : (
                  /* SIGN IN */
                  <div className="space-y-4">
                    <form onSubmit={handleCitizenSubmit} className="space-y-3">
                      <DarkInput
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="w-3.5 h-3.5" />}
                        required
                      />
                      <DarkInput
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock className="w-3.5 h-3.5" />}
                        rightAction={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-white cursor-pointer p-0.5"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                        required
                      />
                      <Button
                        type="submit"
                        fullWidth
                        loading={isEmailSubmitting}
                        disabled={isAnySubmitting}
                        iconRight={<ArrowRight className="w-4 h-4" />}
                        className="!bg-gradient-to-r !from-cyan-500 !to-teal-500 hover:!from-cyan-600 hover:!to-teal-600 !shadow-lg !shadow-cyan-500/20"
                      >
                        {isEmailSubmitting ? 'Authenticating...' : 'Sign in'}
                      </Button>
                    </form>
                  </div>
                )}

                {/* Quick demo options */}
                <div className="pt-2.5 border-t border-white/10 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => { quickLoginAs('PATIENT'); onEnterDashboard?.('PATIENT'); }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-cyan-200 text-[11px] sm:text-[12px] font-semibold transition-colors cursor-pointer border border-cyan-400/30 inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Instant Demo Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => { quickLoginAs('DOCTOR'); onEnterDashboard?.('DOCTOR'); }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-[11px] sm:text-[12px] font-semibold transition-colors cursor-pointer border border-white/15 inline-flex items-center gap-1.5"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
                      Demo Doctor
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">1-click clinical test vault without password</p>
                </div>
              </div>
            )}

            {/* ── ORGANISATION FLOW ────────────── */}
            {authRole === 'organisation' && (
              <div className="space-y-4">
                <form onSubmit={handleOrgSubmit} className="space-y-3">
                  <DarkInput
                    label="Hospital / nursing home name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    icon={<Building2 className="w-4 h-4" />}
                    required
                  />
                  <DarkInput
                    label="Medical license or camp ID"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    icon={<Stethoscope className="w-4 h-4" />}
                    required
                  />

                  {authMode === 'signup' && (
                    <>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1.5 pl-1">Organisation type</label>
                          <select
                            value={orgType}
                            onChange={(e) => setOrgType(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-[13px] focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none cursor-pointer"
                          >
                            <option value="Hospital & Trauma Center" className="bg-slate-900">Hospital & Trauma Center</option>
                            <option value="Nursing Home" className="bg-slate-900">Nursing Home</option>
                            <option value="Primary Health Center" className="bg-slate-900">Primary Health Center</option>
                            <option value="Medical Camp" className="bg-slate-900">Medical Camp</option>
                          </select>
                        </div>
                        <DarkInput
                          label="Contact phone"
                          type="tel"
                          value={orgPhone}
                          onChange={(e) => setOrgPhone(e.target.value)}
                          icon={<Phone className="w-3.5 h-3.5" />}
                        />
                      </div>
                      <DarkInput
                        label="Authorized officer name"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        icon={<User className="w-4 h-4" />}
                        required
                      />
                    </>
                  )}

                  <DarkInput
                    label="Official email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-3.5 h-3.5" />}
                    required
                  />
                  <DarkInput
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-3.5 h-3.5" />}
                    rightAction={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-white cursor-pointer p-0.5"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    loading={isOrgSubmitting}
                    disabled={isAnySubmitting}
                    iconRight={<ArrowRight className="w-4 h-4" />}
                    className="mt-1 !bg-gradient-to-r !from-cyan-500 !to-teal-500 hover:!from-cyan-600 hover:!to-teal-600 !shadow-lg !shadow-cyan-500/20"
                  >
                    {isOrgSubmitting
                      ? 'Processing...'
                      : authMode === 'login' ? 'Sign in to hospital node' : 'Register organisation'
                    }
                  </Button>
                </form>

                {/* Quick demo options */}
                <div className="pt-2.5 border-t border-white/10 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => { quickLoginAs('DOCTOR'); onEnterDashboard?.('DOCTOR'); }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 text-[11px] sm:text-[12px] font-semibold transition-colors cursor-pointer border border-amber-400/30 inline-flex items-center gap-1.5"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
                      Instant Demo Hospital
                    </button>
                    <button
                      type="button"
                      onClick={() => { quickLoginAs('PATIENT'); onEnterDashboard?.('PATIENT'); }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-[11px] sm:text-[12px] font-semibold transition-colors cursor-pointer border border-white/15 inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Demo Citizen
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">1-click ER trauma node test without password</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Trust Strip (< lg) */}
        <div className="lg:hidden col-span-12 flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-400 font-body">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" /> ABDM Compliant
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-coral-400" /> Zero-Battery QR
          </span>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="relative z-10 w-full px-4 py-4 text-center">
        <p className="text-[11px] text-slate-500 font-body">
          © 2026 MediSync · National Emergency Medical Information Database · ABDM Compliant
        </p>
      </footer>
    </div>
  );
}
