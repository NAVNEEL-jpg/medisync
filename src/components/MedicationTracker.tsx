'use client';

import React, { useState, useEffect } from 'react';
import { Pill, Plus, Trash2, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime' | 'As Needed';
  instructions: string;
  takenToday: boolean;
}

const DEFAULT_MEDS: Medication[] = [
  {
    id: '1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Morning',
    instructions: 'Take with breakfast to minimize GI upset',
    takenToday: true,
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Morning',
    instructions: 'Take with or without food for blood pressure',
    takenToday: false,
  },
  {
    id: '3',
    name: 'Vitamin D3 (Cholecalciferol)',
    dosage: '2000 IU',
    frequency: 'Morning',
    instructions: 'Take with a meal containing healthy fats',
    takenToday: true,
  },
  {
    id: '4',
    name: 'Atorvastatin',
    dosage: '20 mg',
    frequency: 'Bedtime',
    instructions: 'Take in the evening for cholesterol management',
    takenToday: false,
  },
];

interface InteractionResult {
  safetyRating: 'safe' | 'caution' | 'warning' | 'danger';
  summary: string;
  interactions: Array<{
    drugsInvolved: string[];
    severity: 'mild' | 'moderate' | 'major';
    effect: string;
    management: string;
  }>;
  foodAndLifestyleWarnings: string[];
  optimalTimingAdvice: string[];
  disclaimer: string;
}

export function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>(DEFAULT_MEDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Morning' as Medication['frequency'],
    instructions: '',
  });

  const [checkingInteractions, setCheckingInteractions] = useState(false);
  const [interactionResult, setInteractionResult] = useState<InteractionResult | null>(null);
  const [interactionError, setInteractionError] = useState<string | null>(null);

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('medicync_medications');
    if (saved) {
      try {
        setMedications(JSON.parse(saved));
      } catch (e) {
        console.error('Could not load saved medications', e);
      }
    }
  }, []);

  const saveMeds = (newMeds: Medication[]) => {
    setMedications(newMeds);
    localStorage.setItem('medicync_medications', JSON.stringify(newMeds));
  };

  const handleToggleTaken = (id: string) => {
    const updated = medications.map((m) =>
      m.id === id ? { ...m, takenToday: !m.takenToday } : m
    );
    saveMeds(updated);
  };

  const handleDelete = (id: string) => {
    const updated = medications.filter((m) => m.id !== id);
    saveMeds(updated);
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name.trim()) return;

    const med: Medication = {
      id: Date.now().toString(),
      name: newMed.name.trim(),
      dosage: newMed.dosage.trim() || 'Standard Dose',
      frequency: newMed.frequency,
      instructions: newMed.instructions.trim() || 'Take as prescribed by doctor',
      takenToday: false,
    };

    saveMeds([...medications, med]);
    setNewMed({ name: '', dosage: '', frequency: 'Morning', instructions: '' });
    setShowAddModal(false);
  };

  const handleCheckInteractions = async () => {
    if (medications.length === 0) return;
    setCheckingInteractions(true);
    setInteractionError(null);

    try {
      const medStrings = medications.map((m) => `${m.name} ${m.dosage} (${m.frequency})`);
      const response = await fetch('/api/gemini/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: medStrings }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check interactions');
      }

      setInteractionResult(data.data);
    } catch (err: unknown) {
      const e = err as Error;
      setInteractionError(e.message || 'Error running interaction check.');
    } finally {
      setCheckingInteractions(false);
    }
  };

  const completedCount = medications.filter((m) => m.takenToday).length;
  const progressPercent = medications.length > 0 ? Math.round((completedCount / medications.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top statistics card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-semibold text-teal-300 tracking-wider">
            Adherence Tracker
          </span>
          <h3 className="text-xl font-bold mt-0.5">Today&apos;s Medication Regimen</h3>
          <p className="text-xs text-teal-100/80 mt-1">
            {completedCount} of {medications.length} doses logged as taken today ({progressPercent}%)
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="w-32 bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCheckInteractions}
              disabled={checkingInteractions || medications.length === 0}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-50 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{checkingInteractions ? 'Checking...' : 'AI Safety Audit'}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Med</span>
            </button>
          </div>
        </div>
      </div>

      {/* Medication list grouped or listed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Active Prescriptions & Supplements
            </h4>
          </div>
          <span className="text-xs text-slate-400">{medications.length} items</span>
        </div>

        {medications.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            No medications added yet. Click &quot;Add Med&quot; to build your daily schedule.
          </div>
        ) : (
          <div className="grid gap-3">
            {medications.map((med) => (
              <div
                key={med.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  med.takenToday
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-300/50 dark:border-emerald-900/50'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTaken(med.id)}
                    className={`mt-0.5 p-1 rounded-lg border transition ${
                      med.takenToday
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-teal-500'
                    }`}
                    title={med.takenToday ? 'Mark as not taken' : 'Mark as taken'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5
                        className={`text-sm font-bold ${
                          med.takenToday
                            ? 'text-slate-500 dark:text-slate-400 line-through'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {med.name}
                      </h5>
                      <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-medium">
                        {med.dosage}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {med.frequency}
                      </span>
                    </div>
                    {med.instructions && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {med.instructions}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                    title="Remove medication"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Drug Interaction & Safety Audit Result */}
      {interactionError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{interactionError}</span>
        </div>
      )}

      {interactionResult && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Gemini Pharmacology & Interaction Audit
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive review of {medications.length} active substances
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                interactionResult.safetyRating === 'safe'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : interactionResult.safetyRating === 'caution'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
              }`}
            >
              Status: {interactionResult.safetyRating}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Safety Assessment:
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {interactionResult.summary}
            </p>
          </div>

          {/* Interactions Breakdown */}
          {interactionResult.interactions && interactionResult.interactions.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Identified Potential Interactions ({interactionResult.interactions.length})
              </h5>
              <div className="grid gap-3">
                {interactionResult.interactions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.drugsInvolved.join(' ↔ ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          item.severity === 'major'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : item.severity === 'moderate'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {item.severity} severity
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{item.effect}</p>
                    <p className="text-teal-700 dark:text-teal-300 font-medium pt-1">
                      Guidance: {item.management}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food & Lifestyle warnings */}
          {interactionResult.foodAndLifestyleWarnings && interactionResult.foodAndLifestyleWarnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs">
              <h5 className="font-bold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Dietary & Food Warnings
              </h5>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {interactionResult.foodAndLifestyleWarnings.map((warn, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[11px] text-slate-400 italic pt-2">
            {interactionResult.disclaimer || 'Consult your prescribing doctor or pharmacist before changing dosage intervals.'}
          </p>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Add New Medication / Supplement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter name, dosage, and daily schedule
            </p>

            <form onSubmit={handleAddMedication} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omeprazole"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20 mg"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value as Medication['frequency'] })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Bedtime">Bedtime</option>
                    <option value="As Needed">As Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Instructions / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Take 30 mins before first meal"
                  value={newMed.instructions}
                  onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition shadow-xs"
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
