'use client';

import React, { useState } from 'react';
import { CareLinkDevice, DeviceTelemetry, EmergencyEvent } from '@/lib/types';
import {
  INITIAL_CARELINK_DEVICES,
  INITIAL_DEVICE_TELEMETRY,
  saveCareLinkDevice,
  recordEmergencyEvent,
} from '@/lib/mockDatabase';
import {
  Cpu,
  Radio,
  Battery,
  ShieldAlert,
  Activity,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Lock,
  Key,
  AlertTriangle,
  Smartphone,
  Sliders,
} from 'lucide-react';

interface DeviceManagementProps {
  patientId: string;
  patientName: string;
  onDeviceUpdated?: (device: CareLinkDevice) => void;
}

export function DeviceManagement({ patientId, patientName, onDeviceUpdated }: DeviceManagementProps) {
  const [device, setDevice] = useState<CareLinkDevice | null>(() => {
    return INITIAL_CARELINK_DEVICES[0]; // Active default paired device
  });

  const [telemetry, setTelemetry] = useState<DeviceTelemetry[]>(INITIAL_DEVICE_TELEMETRY);
  const [showPairModal, setShowPairModal] = useState(false);
  const [pairDeviceId, setPairDeviceId] = useState('');
  const [pairSecretKey, setPairSecretKey] = useState('');
  const [pairError, setPairError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Fall threshold configuration
  const [fallSensitivity, setFallSensitivity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [buzzerVolume, setBuzzerVolume] = useState<'85dB (Max)' | '70dB (Moderate)' | 'Mute'>('85dB (Max)');

  const handlePairDevice = (e: React.FormEvent) => {
    e.preventDefault();
    setPairError('');

    if (!pairDeviceId.trim() || !pairSecretKey.trim()) {
      setPairError('Please enter both Device ID and the 16-character Hardware Provisioning Secret.');
      return;
    }

    if (pairSecretKey.length < 8) {
      setPairError('Invalid provisioning key. Device secret must be at least 8 characters.');
      return;
    }

    const newDevice: CareLinkDevice = {
      id: pairDeviceId.trim().toUpperCase(),
      patientId: patientId,
      deviceModel: 'CareLink Assist V1 (ESP32-WROOM-32)',
      macAddress: '24:6F:28:B4:9A:12',
      firmwareVersion: 'v2.4.1-swasthya',
      batteryLevel: 94,
      isCharging: false,
      status: 'ONLINE',
      lastHeartbeat: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
      pairedBy: `${patientName} (Owner / Patient)`,
      hardwareSpecs: {
        mcu: 'Espressif ESP32 dual-core 240MHz',
        pulseOximeter: 'Maxim MAX30102 PPG',
        motionSensor: 'InvenSense MPU6050 6-Axis IMU',
        display: '0.96" SSD1306 OLED',
        hasPhysicalSos: true,
        hasBuzzer: true,
      },
    };

    saveCareLinkDevice(newDevice);
    setDevice(newDevice);
    setShowPairModal(false);
    if (onDeviceUpdated) onDeviceUpdated(newDevice);
  };

  const handleRevokeDevice = () => {
    if (confirm('Are you sure you want to disconnect and revoke this CareLink device? Emergency alerts from this hardware unit will be paused.')) {
      setDevice(null);
    }
  };

  const handleSimulateSos = () => {
    if (!device) return;
    const testSos: EmergencyEvent = {
      id: `EVT-TEST-${Date.now()}`,
      patientId: patientId,
      patientName: patientName,
      deviceId: device.id,
      eventType: 'MANUAL_SOS',
      severity: 'CRITICAL',
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      vitalsSnapshot: {
        heartRate: 82,
        spO2: 97,
        bloodPressure: '124/82 mmHg',
      },
      location: {
        label: 'Home Test Simulation',
      },
      notifiedContacts: [
        { name: 'Ananya Sharma (Caregiver)', phone: '+91 98765 11223', role: 'PRIMARY_CAREGIVER', delivered: true },
      ],
      notes: 'Test SOS trigger initiated from Device Management console.',
    };
    recordEmergencyEvent(testSos);
    alert('Simulated SOS beacon sent! Event logged and sent to Caregiver Dashboard.');
  };

  return (
    <div className="w-full space-y-6 font-body text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            CareLink Assistive Hardware Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your ESP32 CareLink Assist wearable or bedside monitoring hub.
          </p>
        </div>

        {device ? (
          <button
            onClick={handleRevokeDevice}
            className="px-3.5 py-2 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Revoke Device</span>
          </button>
        ) : (
          <button
            onClick={() => setShowPairModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Pair CareLink Device</span>
          </button>
        )}
      </div>

      {device ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Device Specs & Telemetry status */}
          <div className="lg:col-span-7 space-y-5">
            {/* Active Device Card */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-teal-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base">
                      {device.deviceModel}
                    </h3>
                    <p className="font-mono text-xs text-teal-400">
                      ID: {device.id} · MAC: {device.macAddress}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  CONNECTED
                </span>
              </div>

              {/* Hardware Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[10px] font-mono text-slate-400">MICROCONTROLLER</p>
                  <p className="font-bold text-white mt-0.5">ESP32 240MHz</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[10px] font-mono text-slate-400">PULSE OXIMETER</p>
                  <p className="font-bold text-rose-300 mt-0.5">MAX30102 PPG</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[10px] font-mono text-slate-400">FALL IMU SENSOR</p>
                  <p className="font-bold text-amber-300 mt-0.5">MPU6050 6-Axis</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[10px] font-mono text-slate-400">OLED SCREEN</p>
                  <p className="font-bold text-cyan-300 mt-0.5">0.96" SSD1306</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[10px] font-mono text-slate-400">BATTERY HEALTH</p>
                  <p className="font-bold text-emerald-300 mt-0.5">{device.batteryLevel}% (Li-Po)</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-[10px] font-mono text-slate-400">FIRMWARE</p>
                  <p className="font-bold text-slate-300 mt-0.5">{device.firmwareVersion}</p>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 text-xs">
                <span className="text-slate-400">
                  Last heartbeat: <strong>{new Date(device.lastHeartbeat).toLocaleTimeString()}</strong>
                </span>
                <button
                  onClick={handleSimulateSos}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Test Device SOS Signal</span>
                </button>
              </div>
            </div>

            {/* Live Telemetry Log Table */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  Recent Telemetry Ingest Stream
                </h3>
                <span className="text-[10px] font-mono text-slate-400">HTTPS / REST 50Hz</span>
              </div>

              <div className="rounded-2xl border border-white/10 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-white/10">
                    <tr>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Heart Rate</th>
                      <th className="p-2.5">SpO2</th>
                      <th className="p-2.5">IMU Motion</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {telemetry.slice(0, 5).map((t) => (
                      <tr key={t.id} className="hover:bg-white/5">
                        <td className="p-2.5 text-slate-400">{new Date(t.timestamp).toLocaleTimeString()}</td>
                        <td className="p-2.5 text-white font-bold">{t.heartRate} bpm</td>
                        <td className="p-2.5 text-cyan-300 font-bold">{t.spO2}%</td>
                        <td className="p-2.5 text-slate-300">{t.motionMagnitude}g</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            NORMAL
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Hardware Settings & Calibration (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                Device Configuration &amp; Sensitivity
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Suspected Fall Detection Sensitivity (MPU6050)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFallSensitivity(lvl)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          fallSensitivity === lvl
                            ? 'bg-teal-500 text-slate-950 shadow-md'
                            : 'bg-black/40 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {fallSensitivity === 'MEDIUM' && 'Balanced: Flags impacts > 2.4g followed by 30s lack of motion.'}
                    {fallSensitivity === 'HIGH' && 'High: Flags impacts > 1.8g (Recommended for high-risk elderly patients).'}
                    {fallSensitivity === 'LOW' && 'Low: Flags severe impacts > 3.0g to reduce false alarms.'}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Emergency Siren Loudness (Piezo Buzzer)
                  </label>
                  <select
                    value={buzzerVolume}
                    onChange={(e) => setBuzzerVolume(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  >
                    <option value="85dB (Max)">85dB (Maximum Audibility for Neighbors)</option>
                    <option value="70dB (Moderate)">70dB (Moderate Indoor Volume)</option>
                    <option value="Mute">Mute Local Siren (Silent Dispatch Only)</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-teal-950/30 border border-teal-500/20 text-teal-300 text-[11px] leading-relaxed">
                  <strong>Hardware Safety Note:</strong> The physical SOS switch remains a direct GPIO interrupt and cannot be disabled through software.
                </div>
              </div>
            </div>

            {/* Firmware & ESP32 Code Link */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-400" />
                Firmware &amp; End-to-End Encryption
              </h4>
              <p className="text-slate-400 leading-relaxed">
                CareLink firmware signs all telemetry packets with HMAC-SHA256 device credentials. Telemetry is verified before ingestion to prevent counterfeit sensor injections.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: Device not yet paired */
        <div className="p-10 rounded-3xl bg-slate-900/40 border border-dashed border-white/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">No CareLink Hardware Paired</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Pair your ESP32-based CareLink assistive device to activate continuous pulse/SpO2 readings, fall detection, and physical SOS alert dispatch.
            </p>
          </div>
          <button
            onClick={() => setShowPairModal(true)}
            className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors cursor-pointer"
          >
            Pair New Device
          </button>
        </div>
      )}

      {/* ── PAIR DEVICE MODAL ─────────────────────────────────── */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-teal-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-teal-400" /> Pair CareLink Assist Device
              </h3>
              <button onClick={() => setShowPairModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Enter the Device ID and Hardware Secret printed on the bottom of the ESP32 enclosure or provided during clinic provisioning:
            </p>

            {pairError && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-300 text-xs">
                {pairError}
              </div>
            )}

            <form onSubmit={handlePairDevice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Device ID</label>
                <input
                  type="text"
                  placeholder="e.g. CL-ESP32-9081"
                  value={pairDeviceId}
                  onChange={(e) => setPairDeviceId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/20 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">16-Character Hardware Secret</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={pairSecretKey}
                  onChange={(e) => setPairSecretKey(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/20 text-white font-mono"
                  required
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-[11px] text-slate-400">
                Tip: Enter any test ID like <strong>CL-ESP32-9081</strong> and key <strong>swasthya-key-2026</strong> for instant pairing demonstration.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPairModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400"
                >
                  Authorize &amp; Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
