'use client';

import React, { useEffect, useState } from 'react';
import { Radio, AlertTriangle } from 'lucide-react';

interface MarqueeItem {
  headline: string;
  category: string;
  source: string;
}

const DEFAULT_MARQUEE_HEADLINES: MarqueeItem[] = [
  {
    category: 'CRITICAL OUTBREAK',
    headline: 'WHO & CDC Expand Global Surveillance for H5N1 Avian Influenza Across 18 Regions',
    source: 'World Health Organization',
  },
  {
    category: 'CLASS I RECALL',
    headline: 'FDA Issues Urgent Advisory on Automated External Defibrillator Battery Firmware 4.2',
    source: 'FDA MedWatch',
  },
  {
    category: 'CLINICAL TRIAL',
    headline: 'Phase III mRNA Universal Vaccine Demonstrates 94.2% Cross-Clade Protection in Lancet',
    source: 'Lancet Medical',
  },
  {
    category: 'EMERGENCY ADVISORY',
    headline: 'National Trauma Grid: Paramedic Break-Glass Protocols Enabled for Heatstroke Surges',
    source: 'National Emergency Relays',
  },
  {
    category: 'PHARMACOLOGY',
    headline: 'ICMR Releases Revised Antimicrobial Stewardship Guidelines for Sepsis Management',
    source: 'ICMR Health Bulletin',
  },
];

export function LiveNewsMarquee() {
  const [headlines, setHeadlines] = useState<MarqueeItem[]>(DEFAULT_MARQUEE_HEADLINES);

  useEffect(() => {
    // Attempt to fetch fresh dispatches from live news endpoint
    fetch('/api/news/live')
      .then((res) => res.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          const formatted: MarqueeItem[] = data.articles.slice(0, 8).map((art: any) => ({
            headline: art.title,
            category: art.category || 'CLINICAL ALERT',
            source: art.source?.name || 'Medical Wire',
          }));
          setHeadlines(formatted);
        }
      })
      .catch(() => {
        // Fallback to default dispatches gracefully
      });
  }, []);

  return (
    <div
      role="region"
      aria-label="Live Medical Wire"
      aria-live="off"
      className="w-full bg-slate-950/95 border-y border-red-500/25 text-white overflow-hidden py-2 px-3 flex items-center shadow-lg relative z-20"
    >
      {/* Badge Indicator */}
      <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-lg text-[11px] font-display font-bold uppercase tracking-wider shrink-0 mr-3 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <Radio className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">LIVE MEDICAL WIRE</span>
        <span className="sm:hidden">WIRE</span>
      </div>

      {/* Scrolling Text Container */}
      <div className="overflow-hidden whitespace-nowrap flex-1 relative [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]">
        <div className="inline-flex gap-8 animate-marquee font-mono text-xs cursor-pointer">
          {headlines.concat(headlines).map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 text-slate-200">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-cyan-400 border border-white/10">
                {item.category}
              </span>
              <span className="font-medium text-slate-100">{item.headline}</span>
              <span className="text-[10px] text-slate-400 font-sans">({item.source})</span>
              <span className="text-red-500 mx-2 font-black">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
