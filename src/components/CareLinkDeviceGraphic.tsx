'use client';

import React, { useState } from 'react';
import { Activity, ShieldAlert, Cpu, Radio, Battery, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface CareLinkDeviceGraphicProps {
  interactive?: boolean;
  activeMode?: 'normal' | 'sos' | 'fall';
  className?: string;
}

export function CareLinkDeviceGraphic({
  interactive = true,
  activeMode: initialMode = 'normal',
  className = '',
}: CareLinkDeviceGraphicProps) {
  const [deviceMode, setDeviceMode] = useState<'normal' | 'sos' | 'fall'>(initialMode);
  const [activeCallout, setActiveCallout] = useState<string | null>('oled');

  const isSos = deviceMode === 'sos';
  const isFall = deviceMode === 'fall';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Simulation Controls when interactive */}
      {interactive && (
        <div className="flex items-center gap-2 mb-4 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-teal-500/30 text-xs shadow-lg">
          <span className="text-[11px] font-mono text-slate-400 px-2 uppercase tracking-wider font-semibold">Simulate Mode:</span>
          <button
            onClick={() => setDeviceMode('normal')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              deviceMode === 'normal'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Normal Active
          </button>
          <button
            onClick={() => setDeviceMode('sos')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              deviceMode === 'sos'
                ? 'bg-rose-500 text-white font-bold shadow-md animate-pulse'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            SOS Trigger
          </button>
          <button
            onClick={() => setDeviceMode('fall')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              deviceMode === 'fall'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Suspected Fall
          </button>
        </div>
      )}

      {/* Main 3D Device Container */}
      <div className="relative group perspective-[1000px]">
        {/* Ambient Halo Glow */}
        <div
          className={`absolute -inset-6 rounded-3xl blur-2xl opacity-60 transition-all duration-700 pointer-events-none ${
            isSos
              ? 'bg-gradient-to-r from-rose-600/50 via-red-500/40 to-rose-700/50 animate-pulse'
              : isFall
              ? 'bg-gradient-to-r from-amber-500/50 via-yellow-400/30 to-orange-500/50'
              : 'bg-gradient-to-r from-teal-500/30 via-cyan-500/25 to-blue-600/30'
          }`}
        />

        {/* Physical Enclosure */}
        <div
          className={`relative w-[280px] sm:w-[320px] rounded-[38px] p-5 transition-all duration-500 shadow-2xl border ${
            isSos
              ? 'bg-gradient-to-b from-[#1C0D12] via-[#12060A] to-[#0A0205] border-rose-500/60 shadow-rose-950/70'
              : isFall
              ? 'bg-gradient-to-b from-[#1C150A] via-[#120E05] to-[#0A0702] border-amber-500/60 shadow-amber-950/70'
              : 'bg-gradient-to-b from-[#0F1D2F] via-[#091320] to-[#040810] border-teal-500/40 shadow-teal-950/70'
          }`}
          style={{
            boxShadow: isSos
              ? '0 25px 60px -15px rgba(244, 63, 94, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.25)'
              : '0 25px 60px -15px rgba(20, 184, 166, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Lanyard/Strap Top Notch */}
          <div className="w-16 h-2 mx-auto mb-3 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center">
            <div className="w-6 h-1 rounded-full bg-slate-600" />
          </div>

          {/* Device Header Bar */}
          <div className="flex items-center justify-between px-1 mb-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isSos ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="font-bold tracking-wider uppercase text-[10px] text-teal-300">CL-ESP32</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="flex items-center gap-0.5 text-[10px]">
                <Radio className="w-3 h-3 text-cyan-400" /> Wi-Fi
              </span>
              <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-semibold">
                <Battery className="w-3.5 h-3.5" /> 84%
              </span>
            </div>
          </div>

          {/* 0.96" SSD1306 OLED Display Screen */}
          <div
            onClick={() => setActiveCallout('oled')}
            className={`relative rounded-2xl p-3 cursor-pointer transition-all border ${
              activeCallout === 'oled' ? 'ring-2 ring-teal-400/80' : ''
            } bg-black/95 border-teal-500/40 shadow-inner`}
            style={{
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.9)',
            }}
          >
            {/* Subtle CRT Pixel Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none rounded-2xl opacity-40" />

            {/* OLED Content */}
            <div className="relative font-mono text-cyan-300 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1">
                <span className="text-[10px] tracking-wider uppercase text-cyan-400 font-bold">
                  {isSos ? '!! EMERGENCY SOS !!' : isFall ? '!! FALL SUSPECTED !!' : 'MEDISYNC CARELINK'}
                </span>
                <span className="text-[9px] text-slate-400">08:42 AM</span>
              </div>

              {isSos ? (
                <div className="py-2 text-center text-rose-400 animate-pulse">
                  <p className="text-sm font-extrabold tracking-wide">SOS BEACON ACTIVE</p>
                  <p className="text-[10px] text-white/90 mt-0.5">Notifying Caregiver & EMT</p>
                  <p className="text-[9px] text-slate-400 mt-1">HR: 94 bpm · SpO2: 96%</p>
                </div>
              ) : isFall ? (
                <div className="py-2 text-center text-amber-400">
                  <p className="text-sm font-extrabold tracking-wide">SUSPECTED FALL</p>
                  <p className="text-[10px] text-white/90 mt-0.5">Impact: 2.65g · Checking...</p>
                  <p className="text-[9px] text-slate-400 mt-1">Press SOS if uninjured</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div className="bg-cyan-950/40 p-1.5 rounded-lg border border-cyan-500/20">
                    <p className="text-[9px] text-cyan-400/80">PULSE (MAX30102)</p>
                    <p className="text-lg font-bold text-white leading-tight flex items-baseline gap-1">
                      74 <span className="text-[10px] font-normal text-cyan-400">bpm</span>
                    </p>
                  </div>
                  <div className="bg-cyan-950/40 p-1.5 rounded-lg border border-cyan-500/20">
                    <p className="text-[9px] text-cyan-400/80">BLOOD OXYGEN</p>
                    <p className="text-lg font-bold text-white leading-tight flex items-baseline gap-1">
                      98 <span className="text-[10px] font-normal text-cyan-400">%</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5 border-t border-cyan-500/20">
                <span>IMU: 0.98g OK</span>
                <span className="text-teal-400 font-semibold">SWASTHYA LINK</span>
              </div>
            </div>
          </div>

          {/* Hardware Sensor Row: MAX30102 PPG Window & MPU6050 Accelerometer */}
          <div className="grid grid-cols-2 gap-3 my-4">
            {/* MAX30102 Pulse Oximeter Optical Window */}
            <div
              onClick={() => setActiveCallout('max30102')}
              className={`p-2.5 rounded-2xl bg-slate-900/80 border cursor-pointer transition-all text-center ${
                activeCallout === 'max30102'
                  ? 'border-teal-400 bg-teal-950/40 ring-1 ring-teal-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-7 h-7 mx-auto rounded-full bg-black/90 border border-rose-500/40 flex items-center justify-center relative mb-1.5 shadow-inner">
                {/* Simulated Optical LED pulse */}
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping opacity-80" />
                <div className="absolute w-2 h-2 rounded-full bg-rose-600" />
              </div>
              <p className="text-[10px] font-mono font-bold text-white leading-tight">MAX30102</p>
              <p className="text-[8.5px] text-slate-400 leading-none mt-0.5">Pulse + SpO2</p>
            </div>

            {/* MPU6050 Motion & Fall Detection */}
            <div
              onClick={() => setActiveCallout('mpu6050')}
              className={`p-2.5 rounded-2xl bg-slate-900/80 border cursor-pointer transition-all text-center ${
                activeCallout === 'mpu6050'
                  ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-7 h-7 mx-auto rounded-full bg-black/90 border border-amber-500/40 flex items-center justify-center mb-1.5 shadow-inner">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] font-mono font-bold text-white leading-tight">MPU6050</p>
              <p className="text-[8.5px] text-slate-400 leading-none mt-0.5">6-Axis Fall IMU</p>
            </div>
          </div>

          {/* Physical SOS Button (Large Tactile Switch with LED Ring) */}
          <div
            onClick={() => {
              setActiveCallout('sos');
              setDeviceMode(isSos ? 'normal' : 'sos');
            }}
            className={`relative group/btn rounded-2xl p-3.5 cursor-pointer transition-all text-center border ${
              isSos
                ? 'bg-gradient-to-r from-rose-600 to-red-600 border-white/40 shadow-lg shadow-rose-600/50 scale-[1.02]'
                : 'bg-gradient-to-r from-rose-950/80 via-red-950/60 to-rose-950/80 border-rose-500/50 hover:border-rose-400 shadow-md'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-full ${isSos ? 'bg-white animate-ping' : 'bg-rose-500'}`} />
              <span className="font-display font-extrabold text-[15px] tracking-wider text-white uppercase">
                {isSos ? 'SOS ACTIVATED' : 'PHYSICAL SOS BUTTON'}
              </span>
            </div>
            <p className="text-[9.5px] text-rose-200/90 font-mono mt-0.5">
              {isSos ? 'Click again to reset simulator' : 'Tactile Instant Trigger · Always Available'}
            </p>
          </div>

          {/* Buzzer Speaker Grill & ESP32 Microcontroller Label */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[9.5px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-slate-400" /> 85dB Piezo Siren
            </span>
            <span>ESP32-WROOM-32D</span>
          </div>
        </div>
      </div>

      {/* Interactive Detail Drawer Below Device */}
      {interactive && activeCallout && (
        <div className="mt-4 max-w-sm w-full bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-700/60 text-xs shadow-xl animate-fadeIn">
          {activeCallout === 'oled' && (
            <div>
              <div className="flex items-center gap-1.5 text-teal-400 font-bold font-display mb-1">
                <Sparkles className="w-3.5 h-3.5" /> 0.96" I2C OLED Display
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                High-contrast low-power screen designed for elderly legibility. Displays heart rate, SpO2, connection status, and emergency reassurance without needing a paired smartphone.
              </p>
            </div>
          )}
          {activeCallout === 'max30102' && (
            <div>
              <div className="flex items-center gap-1.5 text-rose-400 font-bold font-display mb-1">
                <Activity className="w-3.5 h-3.5" /> Maxim MAX30102 Pulse Oximeter
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Dual-wavelength optical biosensor (660nm Red / 880nm IR) for non-invasive pulse rate & blood oxygen estimation with ambient light cancellation.
              </p>
            </div>
          )}
          {activeCallout === 'mpu6050' && (
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold font-display mb-1">
                <ShieldAlert className="w-3.5 h-3.5" /> MPU6050 6-Axis Motion & Fall Detection
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Samples 3-axis accelerometer and gyroscope data at 50Hz. Triggers suspected fall events upon sudden acceleration vector spikes (&gt;2.4g) followed by prolonged immobility.
              </p>
            </div>
          )}
          {activeCallout === 'sos' && (
            <div>
              <div className="flex items-center gap-1.5 text-rose-400 font-bold font-display mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hardware Interrupt SOS Switch
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Hardwired GPIO interrupt button that activates the 85dB local piezo siren and dispatches priority emergency payloads over Wi-Fi/GSM to authorized caregivers and hospital trauma desks.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
