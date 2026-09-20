'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, AlertCircle, CheckCircle, HelpCircle, ArrowRight, Upload, AlertTriangle } from 'lucide-react';

const SAMPLES = [
  {
    title: 'Comprehensive Metabolic Panel (CMP)',
    description: 'Elevated fasting glucose & AST/ALT values',
    text: `PATIENT LAB REPORT: Comprehensive Metabolic Panel (CMP)
Fasting Blood Glucose: 138 mg/dL [Ref: 70 - 99 mg/dL] - HIGH
Blood Urea Nitrogen (BUN): 18 mg/dL [Ref: 7 - 20 mg/dL] - NORMAL
Creatinine: 0.9 mg/dL [Ref: 0.6 - 1.2 mg/dL] - NORMAL
Sodium: 139 mEq/L [Ref: 135 - 145 mEq/L] - NORMAL
Potassium: 4.2 mEq/L [Ref: 3.5 - 5.0 mEq/L] - NORMAL
Chloride: 102 mEq/L [Ref: 98 - 107 mEq/L] - NORMAL
Carbon Dioxide: 25 mEq/L [Ref: 22 - 29 mEq/L] - NORMAL
Calcium: 9.4 mg/dL [Ref: 8.5 - 10.2 mg/dL] - NORMAL
Total Bilirubin: 0.7 mg/dL [Ref: 0.2 - 1.2 mg/dL] - NORMAL
Aspartate Aminotransferase (AST): 48 U/L [Ref: 10 - 40 U/L] - HIGH
Alanine Aminotransferase (ALT): 58 U/L [Ref: 7 - 56 U/L] - HIGH
Alkaline Phosphatase: 72 U/L [Ref: 44 - 147 U/L] - NORMAL`,
  },
  {
    title: 'Complete Blood Count (CBC)',
    description: 'Mild microcytic anemia pattern',
    text: `PATIENT LAB REPORT: Complete Blood Count (CBC)
White Blood Cells (WBC): 6.8 x10^3/uL [Ref: 4.5 - 11.0] - NORMAL
Red Blood Cells (RBC): 3.9 x10^6/uL [Ref: 4.2 - 5.4] - LOW
Hemoglobin (Hgb): 10.8 g/dL [Ref: 12.0 - 15.5] - LOW
Hematocrit (Hct): 33.2% [Ref: 37.0 - 48.0] - LOW
Mean Corpuscular Volume (MCV): 76 fL [Ref: 80 - 100] - LOW
Platelets: 245 x10^3/uL [Ref: 150 - 450] - NORMAL
Neutrophils: 60% [Ref: 40 - 70] - NORMAL
Lymphocytes: 31% [Ref: 20 - 45] - NORMAL`,
  },
  {
    title: 'Prescription & Dosage Slip',
    description: 'Amoxicillin-Clavulanate oral antibiotic regimen',
    text: `Rx: Augmentin (Amoxicillin 875mg / Clavulanic Acid 125mg)
Directions: Take 1 tablet by mouth every 12 hours with meals for 10 consecutive days.
Quantity: 20 tablets. Refills: 0.
Indication: Acute bacterial rhinosinusitis.
Warnings: Finish full course even if symptoms improve. Take with a light snack or meal to reduce GI discomfort.`,
  },
];

interface AnalysisResult {
  documentType: string;
  patientFriendlySummary: string;
  overallRiskLevel: 'low' | 'moderate' | 'high' | 'needs_attention';
  keyFindings: Array<{
    testName: string;
    resultValue: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low' | 'abnormal';
    meaning: string;
  }>;
  actionableAdvice: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export function ReportAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (textToUse?: string) => {
    const text = (textToUse || inputText).trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze report');
      }

      setResult(data.analysis);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'An error occurred while analyzing the report.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">High</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">Low</span>;
      case 'normal':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Normal</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{status || 'Info'}</span>;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">Priority Follow-up Required</span>;
      case 'moderate':
      case 'needs_attention':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">Attention Recommended</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">Standard / Stable</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Lab & Prescription Document Decoder
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste blood tests, urinalysis, biopsy summaries, or doctor prescription instructions
              </p>
            </div>
          </div>
        </div>

        {/* Preset Sample Cards */}
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Or load a clinical test sample:
          </p>
          <div className="grid sm:grid-cols-3 gap-2.5">
            {SAMPLES.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputText(sample.text);
                  handleAnalyze(sample.text);
                }}
                className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition group"
              >
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 flex items-center justify-between">
                  {sample.title}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your medical report text here (e.g. Total Cholesterol: 240 mg/dL, HDL: 38 mg/dL, LDL: 160 mg/dL)..."
            className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500 leading-relaxed"
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {inputText.length > 0 ? `${inputText.length} characters entered` : 'Supports text extracts from EHR/portal summaries'}
          </span>
          <div className="flex gap-2">
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={loading || !inputText.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Analyzing with Gemini 3.6...' : 'Decode Report'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
          {/* Header & Risk Level */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
                {result.documentType || 'Clinical Document'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Executive Health Assessment
              </h3>
            </div>
            <div>{getRiskBadge(result.overallRiskLevel)}</div>
          </div>

          {/* Plain English Summary */}
          <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/50">
            <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Patient-Friendly Summary
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {result.patientFriendlySummary}
            </p>
          </div>

          {/* Findings Table */}
          {result.keyFindings && result.keyFindings.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Key Diagnostic Biomarkers & Parameters
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Test / Biomarker</th>
                      <th className="p-3">Your Result</th>
                      <th className="p-3">Reference Range</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Clinical Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {result.keyFindings.map((finding, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {finding.testName}
                        </td>
                        <td className="p-3 font-mono font-medium">{finding.resultValue}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400 font-mono">
                          {finding.referenceRange}
                        </td>
                        <td className="p-3">{getStatusBadge(finding.status)}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 max-w-sm">
                          {finding.meaning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actionable Advice & Doctor Questions grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Advice */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Actionable Patient Next Steps
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {result.actionableAdvice?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions to Ask Doctor */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Questions to Ask Your Doctor
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {result.questionsForDoctor?.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{result.disclaimer || 'This analysis is generated by AI to help you understand your laboratory findings. It does not replace a clinical examination by your healthcare provider.'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
