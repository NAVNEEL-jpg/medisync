'use client';

import React, { useState } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import {
  Eye,
  Type,
  Volume2,
  VolumeX,
  Languages,
  Mic,
  ShieldAlert,
  Sparkles,
  Check,
  X,
  PhoneCall,
  Activity,
  Heart,
} from 'lucide-react';

interface AssistiveModeBarProps {
  onTriggerSos?: () => void;
  patientName?: string;
  className?: string;
}

export function AssistiveModeBar({ onTriggerSos, patientName = 'Patient', className = '' }: AssistiveModeBarProps) {
  const {
    prefs,
    isAssistiveMode,
    toggleAssistiveMode,
    setHighContrast,
    setFontSizeScale,
    setLanguage,
    speak,
    stopSpeaking,
    t,
  } = useAccessibility();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const textToRead = `${t('appName')}. ${patientName}. ${t('vitalsTitle')}: ${t('pulse')} 74 bpm, ${t('bloodOxygen')} 98%. ${t('deviceStatus')}: ${t('deviceOnline')}. ${t('allClear')}.`;
    speak(textToRead);

    setTimeout(() => {
      setIsSpeaking(false);
    }, 9000);
  };

  const handleTriggerSos = () => {
    setSosSent(true);
    speak(t('sosTriggered'));
    if (onTriggerSos) onTriggerSos();
    setTimeout(() => setSosSent(false), 8000);
  };

  return (
    <div
      className={`w-full rounded-2xl sm:rounded-3xl p-3 sm:p-4 transition-all duration-300 shadow-md ${
        prefs.highContrast
          ? 'bg-black text-yellow-300 border-2 border-yellow-400'
          : isAssistiveMode
          ? 'bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white border-2 border-teal-400 shadow-teal-950/60'
          : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Assistive Mode Toggle & Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={toggleAssistiveMode}
            className={`px-3.5 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isAssistiveMode
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'bg-white/10 hover:bg-white/15 text-slate-200'
            }`}
            aria-pressed={isAssistiveMode}
            title={t('assistiveMode')}
          >
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span className="font-display">
              {isAssistiveMode ? t('exitAssistiveMode') : t('assistiveMode')}
            </span>
          </button>

          {isAssistiveMode && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Elderly &amp; Assistive Ready
            </span>
          )}
        </div>

        {/* Middle: Controls (Font Scale, Contrast, Voice, Language) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Font Size Selector */}
          <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
            <span className="text-[10px] font-mono text-slate-400 px-1.5 hidden sm:inline">Size:</span>
            <button
              onClick={() => setFontSizeScale('normal')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                prefs.fontSizeScale === 'normal' ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
              title="Normal Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeScale('large')}
              className={`px-2 py-1 rounded-lg font-bold transition-all text-sm ${
                prefs.fontSizeScale === 'large' ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
              title="Large Font Size (+25%)"
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeScale('extra-large')}
              className={`px-2 py-1 rounded-lg font-bold transition-all text-base ${
                prefs.fontSizeScale === 'extra-large' ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
              title="Extra Large Font Size (+50%)"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!prefs.highContrast)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              prefs.highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-md font-bold'
                : 'bg-black/30 text-slate-300 border-white/10 hover:text-white hover:bg-black/40'
            }`}
            title={t('highContrast')}
            aria-label={t('highContrast')}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{prefs.highContrast ? 'Contrast ON' : 'Contrast'}</span>
          </button>

          {/* Audio Read Aloud */}
          <button
            onClick={handleReadAloud}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold animate-pulse'
                : 'bg-black/30 text-slate-300 border-white/10 hover:text-white hover:bg-black/40'
            }`}
            title={t('readAloud')}
            aria-label={t('readAloud')}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : t('readAloud')}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-black/30 text-slate-300 border border-white/10 hover:text-white hover:bg-black/40 cursor-pointer"
              title={t('language')}
              aria-label={t('language')}
            >
              <Languages className="w-4 h-4 text-teal-400" />
              <span className="font-bold uppercase text-[11px]">{prefs.language}</span>
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl bg-slate-900 border border-teal-500/40 p-1.5 shadow-2xl z-50 text-xs font-medium space-y-1">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी (Hindi)' },
                  { code: 'bn', label: 'বাংলা (Bengali)' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code as any);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between cursor-pointer ${
                      prefs.language === item.code
                        ? 'bg-teal-500 text-slate-950 font-bold'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {prefs.language === item.code && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Urgent 1-Touch Emergency SOS Button */}
        <div>
          <button
            onClick={handleTriggerSos}
            className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 uppercase tracking-wider transition-all cursor-pointer ${
              sosSent
                ? 'bg-rose-600 text-white animate-pulse shadow-xl shadow-rose-600/50'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-950/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{sosSent ? 'SOS TRANSMITTED!' : t('emergencySos')}</span>
          </button>
        </div>
      </div>

      {/* Simplified Elderly Banner when Assistive Mode is active */}
      {isAssistiveMode && (
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-black/40 border border-teal-500/20">
            <span className="text-[10px] text-teal-400 font-mono uppercase">{t('pulse')}</span>
            <p className="text-base sm:text-lg font-bold text-white leading-tight">74 bpm</p>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-teal-500/20">
            <span className="text-[10px] text-teal-400 font-mono uppercase">{t('bloodOxygen')}</span>
            <p className="text-base sm:text-lg font-bold text-white leading-tight">98 %</p>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-teal-500/20">
            <span className="text-[10px] text-teal-400 font-mono uppercase">{t('bloodPressure')}</span>
            <p className="text-base sm:text-lg font-bold text-white leading-tight">120/80</p>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-teal-500/20">
            <span className="text-[10px] text-emerald-400 font-mono uppercase">{t('deviceStatus')}</span>
            <p className="text-base sm:text-lg font-bold text-emerald-300 leading-tight">ONLINE</p>
          </div>
        </div>
      )}
    </div>
  );
}
