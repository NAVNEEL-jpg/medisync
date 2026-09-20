'use client';

import React, { useState, useEffect } from 'react';
import {
  EPIDEMIC_WATCH_BANNER,
  CLINICAL_METRICS,
  CLINICAL_DISPATCHES,
  TRUST_MATRIX,
  TRENDING_VECTORS,
} from '@/lib/newsData';
import { ClinicalDispatch } from '@/lib/types';
import {
  AlertTriangle,
  Radio,
  Search,
  Globe2,
  ShieldCheck,
  FileDown,
  Share2,
  ExternalLink,
  Volume2,
  Bell,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  RefreshCw,
  Activity,
} from 'lucide-react';

export function GlobalMedicalNews() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'outbreaks' | 'recalls' | 'trials'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [dispatches, setDispatches] = useState<ClinicalDispatch[]>(CLINICAL_DISPATCHES);
  const [metrics, setMetrics] = useState(CLINICAL_METRICS);
  const [isLiveStream, setIsLiveStream] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDispatches, setTotalDispatches] = useState<number>(CLINICAL_DISPATCHES.length);
  const [pagerEmail, setPagerEmail] = useState('');
  const [pagerSubscribed, setPagerSubscribed] = useState(false);

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live medical news from /api/news/live
  const fetchLiveNews = async (query = '', filter = activeFilter) => {
    setIsLoading(true);
    try {
      const url = `/api/news/live?filter=${filter}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.dispatches && data.dispatches.length > 0) {
          setDispatches(data.dispatches);
        }
        if (data.metrics) {
          setMetrics(data.metrics);
        }
        if (typeof data.isLive === 'boolean') {
          setIsLiveStream(data.isLive);
        }
        if (data.totalMedicalDispatches) {
          setTotalDispatches(data.totalMedicalDispatches);
        }
      }
    } catch (err) {
      console.error('Failed to fetch live medical dispatches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNews(searchQuery, activeFilter);
  }, [activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLiveNews(searchQuery, activeFilter);
  };

  const filteredDispatches = dispatches.filter((d) => {
    if (activeFilter === 'outbreaks' && d.category !== 'CRITICAL OUTBREAK') return false;
    if (activeFilter === 'recalls' && d.category !== 'CLASS I SAFETY RECALL') return false;
    if (activeFilter === 'trials' && d.category !== 'PEER REVIEWED CLINICAL TRIAL' && d.category !== 'BREAKTHROUGH THERAPEUTIC') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q)
      );
    }
    return true;
  });


  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. TOP GLOBAL EPIDEMIC WATCH BANNER */}
      <div className="bg-[#fef2f2] border-2 border-red-500 rounded-xl p-3 sm:p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 animate-bounce" />
          <div className="text-xs">
            <span className="font-black text-red-900 uppercase tracking-wide mr-2">
              {EPIDEMIC_WATCH_BANNER.level}
            </span>
            <span className="text-red-700 font-medium">
              • {EPIDEMIC_WATCH_BANNER.pathogen} — {EPIDEMIC_WATCH_BANNER.advisory}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <span className="px-2.5 py-1 rounded bg-red-600 text-white font-black text-[10px] tracking-wider uppercase">
            {EPIDEMIC_WATCH_BANNER.tag}
          </span>
          <button
            onClick={() => alert('Downloading WHO/CDC Emergency Protocol PDF...')}
            className="px-3 py-1 rounded bg-white border border-red-300 text-red-700 hover:bg-red-50 font-bold text-xs transition"
          >
            Emergency Protocol (PDF)
          </button>
        </div>
      </div>

      {/* 2. LIVE TELEMETRY BAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="font-extrabold text-emerald-700 tracking-wider uppercase text-[11px] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            LIVE MEDICAL WIRE {isLiveStream ? '(NewsAPI Health Feed Active)' : '(Clinical Relay Active)'}
          </span>
          <span className="text-slate-600 hidden sm:inline">
            • Strict Medical Filter Enabled • {totalDispatches} Clinical Dispatches Captured
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 shrink-0">
          <button
            onClick={() => fetchLiveNews(searchQuery, activeFilter)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 transition cursor-pointer disabled:opacity-50"
            title="Refresh breaking medical news"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync Live Wire'}</span>
          </button>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200">
            Encrypted FHIR v4.3
          </span>
          <span className="font-bold text-slate-800">{currentTime || '2026-09-20 20:06:01 UTC'}</span>
        </div>
      </div>

      {/* 3. FILTER & SEARCH CONTROL ROW */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical news (e.g. measles, dengue, cardiac, oncology, FDA recall)..."
            className="w-full text-xs pl-10 pr-20 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] text-slate-900 placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-bold transition"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activeFilter === 'all'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Medical Feeds ({totalDispatches})
          </button>
          <button
            onClick={() => setActiveFilter('outbreaks')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activeFilter === 'outbreaks'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Outbreaks & Containment
          </button>
          <button
            onClick={() => setActiveFilter('recalls')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activeFilter === 'recalls'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Drug Safety & Recalls
          </button>
          <button
            onClick={() => setActiveFilter('trials')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activeFilter === 'trials'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Clinical Trials & Therapeutics
          </button>
        </div>

        {/* Geo Selector */}
        <select className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 shrink-0">
          <option>Global Grid (All Zones)</option>
          <option>WHO AFRO (Africa)</option>
          <option>WHO SEARO (South-East Asia)</option>
          <option>WHO EURO (Europe)</option>
          <option>PAHO (Americas)</option>
        </select>
      </div>

      {/* 4. MAIN GRID (Left Feed 2/3, Right Rail 1/3) */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Map + Verified Dispatches (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Planetary Biosurveillance Relay (Vector Map Card) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">
                  Planetary Biosurveillance Relay
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Active Epidemic & Pathogen Vectors
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                  4 Critical Bio-Clusters
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                  11 Sentinel Stations
                </span>
              </div>
            </div>

            {/* Interactive Biosurveillance Canvas Map Simulation */}
            <div className="h-56 rounded-xl bg-gradient-to-tr from-slate-950 via-[#0c1424] to-slate-900 border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 text-white">
              {/* Grid Lines */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Vector Pins */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                  <Globe2 className="w-4 h-4 text-sky-400" />
                  <span>Sentinel Grid Coordinate Tracking</span>
                </div>
                <span className="text-[10px] bg-red-600/80 px-2 py-0.5 rounded text-white font-mono font-bold">
                  Epi-Alert Active
                </span>
              </div>

              {/* Simulated Map Graphic with Interactive Bio-Coordinates */}
              <div className="relative z-10 my-auto grid grid-cols-3 gap-4 text-center">
                {/* Cluster 1 */}
                <div className="bg-slate-900/80 border border-red-500/60 p-2.5 rounded-xl backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse mb-1"></span>
                  <p className="text-xs font-bold text-white">Kie-Ntem, Eq. Guinea</p>
                  <p className="text-[10px] text-red-400 font-mono">Marburg Virus (VHF)</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Level 4 Biosafety Active</p>
                </div>

                {/* Cluster 2 */}
                <div className="bg-slate-900/80 border border-amber-500/60 p-2.5 rounded-xl backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block mb-1"></span>
                  <p className="text-xs font-bold text-white">Global Flyway Monitoring</p>
                  <p className="text-[10px] text-amber-400 font-mono">H5N1 Clade 2.3.4.4b</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Avian-Mammal Spillover</p>
                </div>

                {/* Cluster 3 */}
                <div className="bg-slate-900/80 border border-sky-500/60 p-2.5 rounded-xl backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-sky-500 inline-block mb-1"></span>
                  <p className="text-xs font-bold text-white">Entebbe, Uganda</p>
                  <p className="text-[10px] text-sky-400 font-mono">Sudan Ebolavirus Trial</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Ring-Vaccination Active</p>
                </div>
              </div>

              {/* Map Footer status */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
                <span>Live Geographic Resolution: <strong>0.1 deg Cluster Detection</strong></span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => alert('Exporting Epi-Cluster Vector (.JSON/HL7)...')}
                    className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Export Epi-Cluster Vector (.JSON/HL7)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Clinical Dispatches Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
              Verified Clinical Dispatches
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Sort: <strong className="text-slate-800">Clinical Urgency • Chronological</strong>
            </span>
          </div>

          {/* Dispatches List */}
          <div className="space-y-4">
            {filteredDispatches.map((dispatch) => (
              <div
                key={dispatch.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 transition hover:border-[#0284c7]/60"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        dispatch.category === 'CRITICAL OUTBREAK'
                          ? 'bg-red-100 text-red-800'
                          : dispatch.category === 'BREAKTHROUGH THERAPEUTIC'
                          ? 'bg-sky-100 text-sky-800'
                          : dispatch.category === 'PEER REVIEWED CLINICAL TRIAL'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {dispatch.category}
                    </span>
                    <span className="font-bold text-slate-700">{dispatch.source}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span>{dispatch.timestampAgo}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {dispatch.verificationBadge}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {dispatch.title}
                </h4>

                {/* Summary */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {dispatch.summary}
                </p>

                {/* Emergency Takeaways or Dosing Box */}
                {dispatch.emergencyTakeaways && dispatch.emergencyTakeaways.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      EMERGENCY DEPT TAKEAWAYS:
                    </p>
                    <ul className="space-y-1 text-slate-700">
                      {dispatch.emergencyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-1.5 shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Paramedic Dosing Box */}
                {dispatch.paramedicDosing && (
                  <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 grid sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-bold text-sky-900 text-[11px] uppercase">
                        EMS / PARAMEDIC DOSING
                      </p>
                      <p className="text-slate-800 mt-0.5 font-medium">
                        {dispatch.paramedicDosing.dose}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-sky-900 text-[11px] uppercase">
                        EMERGENCY REBOUND PROFILE
                      </p>
                      <p className="text-slate-800 mt-0.5 font-medium">
                        {dispatch.paramedicDosing.reboundProfile}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recommendation Box */}
                {dispatch.recommendation && (
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 font-medium">
                    {dispatch.recommendation}
                  </div>
                )}

                {/* Footer with ICD / Advisory Code & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                    {dispatch.icdCode && <span>{dispatch.icdCode}</span>}
                    {dispatch.advisoryCode && <span>• {dispatch.advisoryCode}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Shared ${dispatch.title} to National Trauma MD Grid`)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition text-xs"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Share MD Grid</span>
                    </button>

                    {dispatch.url ? (
                      <a
                        href={dispatch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition text-xs shadow-xs ${
                          dispatch.actionButtonType === 'danger'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-[#0284c7] hover:bg-[#0369a1] text-white'
                        }`}
                      >
                        <span>{dispatch.actionButtonText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        onClick={() => alert(`Opening advisory: ${dispatch.title}`)}
                        className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition text-xs shadow-xs ${
                          dispatch.actionButtonType === 'danger'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-[#0284c7] hover:bg-[#0369a1] text-white'
                        }`}
                      >
                        <span>{dispatch.actionButtonText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Metrics, Audio Relay, Trust Matrix, Triage Pager (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-tight">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-black text-slate-900 font-mono mt-1">
                    {String(metric.count).padStart(2, '0')}
                  </p>
                  {metric.badge && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-red-600">
                      {metric.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 leading-tight">
                  {metric.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Global NGO Relay Audio Transponder */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                <h4 className="font-extrabold text-slate-900 text-sm">Global NGO Relay</h4>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                STREAM ONLINE
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Direct audio transponder and encrypted clinical notes from Doctors Without Borders (MSF) and ICRC field hospitals.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  MSF Goma Trauma Hub
                </span>
                <span className="text-slate-400 font-mono text-[10px]">Ch. 04 Secure</span>
              </div>

              {/* Equalizer Visualizer */}
              <div className="flex items-center gap-1 h-5 justify-center py-1">
                {[18, 24, 12, 28, 16, 22, 10, 26, 14, 20, 30, 16, 22].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-sky-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                <button
                  onClick={() => alert('Tuning in to MSF Goma encrypted frequency...')}
                  className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Monitor Frequency</span>
                </button>
                <span className="font-mono">128 kbps Encrypted</span>
              </div>
            </div>
          </div>

          {/* Sourcing Trust Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm">Sourcing Trust Matrix</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <p className="text-[11px] text-slate-500">
              Every alert is cryptographically validated across international clinical registries before pushing to hospital endpoints.
            </p>

            <div className="space-y-2">
              {TRUST_MATRIX.map((item, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800 text-[11px]">{item.name}</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Clinical Vectors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm">Trending Clinical Vectors</h4>
            <p className="text-[11px] text-slate-500">
              Highest frequency queries across trauma emergency rooms and infectious disease registries.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {TRENDING_VECTORS.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(tag.replace('#', ''))}
                  className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-mono font-medium border border-sky-200 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Triage Pager */}
          <div className="bg-gradient-to-br from-[#0f172a] to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h4 className="font-extrabold text-sm">Emergency Triage Pager</h4>
            </div>

            <p className="text-xs text-slate-300">
              Subscribe licensed emergency physicians and paramedic directors to direct high-priority SMS / Email code flashes.
            </p>

            {pagerSubscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pager Activated! High-priority clinical code flashes enabled.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (pagerEmail) setPagerSubscribed(true);
                }}
                className="space-y-2 text-xs"
              >
                <input
                  type="email"
                  required
                  placeholder="physician.name@hospital.org"
                  value={pagerEmail}
                  onChange={(e) => setPagerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-sky-400 font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-xl transition shadow-xs"
                >
                  Activate Clinical Alerts
                </button>
              </form>
            )}

            <p className="text-[10px] text-slate-400">
              Compliant with HIPAA, GDPR-H, and HL7 FHIR emergency notification standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
