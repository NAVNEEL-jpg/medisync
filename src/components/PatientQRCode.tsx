'use client';

import React, { useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Printer, ExternalLink } from 'lucide-react';

import { PatientProfile } from '@/lib/types';

interface PatientQRCodeProps {
  /** Optional full patient profile to encode rich emergency snapshot */
  patient?: PatientProfile;
  /** Unique patient health ID e.g. #NDHN-8902-MV */
  patientId: string;
  /** Full name of the patient */
  patientName: string;
  /** Blood group for quick-access emergency display */
  bloodGroup: string;
  /** Aadhaar-linked mobile for triage callback */
  mobileNumber: string;
  /** QR module (cell) size in px — controls overall image resolution */
  size?: number;
  /** Foreground color of QR modules */
  fgColor?: string;
  /** Background color of QR canvas */
  bgColor?: string;
  /** Error correction level — use H for better logo/print compatibility */
  level?: 'L' | 'M' | 'Q' | 'H';
  /** Show Download / Share / Print action buttons below QR */
  showActions?: boolean;
  className?: string;
}

/** Helper to encode object into URL-safe base64 */
function toUrlSafeBase64(obj: any): string {
  try {
    const jsonStr = JSON.stringify(obj);
    if (typeof btoa === 'function') {
      return btoa(unescape(encodeURIComponent(jsonStr)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Patient-specific QR code component.
 *
 * Encodes the dynamic emergency triage URL with a self-contained
 * emergency clinical snapshot so scanners get the medical profile
 * instantly on ANY phone or device with 0 network delay.
 */
export function PatientQRCode({
  patient,
  patientId,
  patientName,
  bloodGroup,
  mobileNumber,
  size = 220,
  fgColor = '#0B1929',
  bgColor = '#FFFFFF',
  level = 'M',
  showActions = true,
  className = '',
}: PatientQRCodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [origin, setOrigin] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setOrigin(window.location.origin);
    }
  }, []);

  /**
   * QR data payload — encodes both a compact base64 clinical snapshot
   * and flat query parameters for 100% offline & cross-device scanner reliability.
   */
  const cleanId = patientId.replace('#', '').trim();
  const baseUrl = origin || 'https://medisync-signal4.vercel.app';

  const effName = patient?.fullName || patientName;
  const effBg = patient?.bloodGroup || bloodGroup;
  const effMob = patient?.mobileNumber || patient?.emergencyContacts?.[0]?.phone || mobileNumber;
  const effHr = patient?.vitals?.heartRate;
  const effBp = patient?.vitals?.bloodPressure;
  const effOx = patient?.vitals?.spO2;
  const effBs = patient?.vitals?.bloodSugar;
  const effUpBy = patient?.lastUpdatedBy || 'Verified Medical Officer';
  const effUpAt = patient?.lastProfileUpdate || new Date().toISOString();

  // Create compact snapshot object
  const compactPayload = {
    id: cleanId,
    fn: effName,
    bg: effBg,
    mb: effMob,
    ub: effUpBy,
    ut: effUpAt,
    vt: {
      hr: effHr,
      bp: effBp,
      ox: effOx,
      bs: effBs,
    },
    al: (patient?.allergies || []).map((a) => ({ a: a.allergen, s: a.severity, r: a.reaction })),
    cn: (patient?.existingConditions || []).slice(0, 5),
    ec: (patient?.emergencyContacts || []).map((c) => ({ n: c.name, r: c.relationship, p: c.phone })),
    rx: (patient?.prescriptions || []).slice(0, 5).map((pr) => ({ m: pr.medicationName, d: pr.dosage, f: pr.frequency })),
  };

  const b64Data = toUrlSafeBase64(compactPayload);

  // Build robust query string
  const queryParams = new URLSearchParams();
  queryParams.set('name', effName);
  queryParams.set('bg', effBg);
  if (effMob) queryParams.set('mobile', effMob);
  if (effHr) queryParams.set('hr', String(effHr));
  if (effBp) queryParams.set('bp', effBp);
  if (effOx) queryParams.set('ox', String(effOx));
  if (effBs) queryParams.set('bs', effBs);
  queryParams.set('by', effUpBy);
  queryParams.set('at', effUpAt);
  if (b64Data) queryParams.set('data', b64Data);

  const qrData = `${baseUrl}/emergency/${encodeURIComponent(cleanId)}?${queryParams.toString()}`;

  /** Download QR as PNG via canvas */
  const handleDownload = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const canvas = document.createElement('canvas');
    canvas.width = size * 2; // 2× for retina
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const img = new window.Image();
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = `MediSync-QR-${patientId.replace('#', '')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  }, [patientId, size]);

  /** Print QR on its own */
  const handlePrint = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>MediSync Emergency QR — ${patientName}</title>
      <style>body{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif}
      h2{margin:0 0 8px;font-size:18px}p{margin:2px 0;font-size:13px;color:#666}svg{margin:12px 0}</style></head>
      <body>
        <h2>${patientName}</h2>
        <p>ID: ${patientId} &nbsp;|&nbsp; Blood: ${bloodGroup}</p>
        ${svgStr}
        <p style="font-size:11px;color:#aaa">MediSync Emergency Health System — medisync.vercel.app</p>
      </body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }, [patientId, patientName, bloodGroup]);

  /** Web Share API */
  const handleShare = useCallback(async () => {
    if (!navigator.share) {
      await navigator.clipboard.writeText(qrData);
      alert('Emergency URL copied to clipboard!');
      return;
    }
    try {
      await navigator.share({
        title: `MediSync Emergency Profile — ${patientName}`,
        text: `Scan to access ${patientName}'s emergency medical vault. Blood Group: ${bloodGroup}`,
        url: qrData,
      });
    } catch {
      // User cancelled share
    }
  }, [patientName, bloodGroup, qrData]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* QR Canvas */}
      <div className="p-4 rounded-2xl bg-white shadow-md border border-[var(--color-border)]/30 inline-block">
        <QRCodeSVG
          ref={svgRef}
          value={qrData}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          level={level}
          marginSize={2}
          imageSettings={{
            src: '/medisync-logo.jpg',
            x: undefined,
            y: undefined,
            height: Math.round(size * 0.18),
            width: Math.round(size * 0.18),
            opacity: 0.85,
            excavate: true,
          }}
        />
      </div>

      {/* Patient ID chip */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] font-mono font-bold text-[var(--color-foreground)] tracking-widest">
          {patientId}
        </span>
        <span className="text-[10px] text-[var(--color-foreground-muted)]">
          Scan for instant emergency access
        </span>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-primary)] text-white text-[12px] font-display font-semibold shadow-sm hover:bg-cyan-700 transition-colors cursor-pointer press-scale"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)] text-[12px] font-display font-semibold hover:bg-[var(--color-border)] transition-colors cursor-pointer press-scale border border-[var(--color-border)]/40"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)] text-[12px] font-display font-semibold hover:bg-[var(--color-border)] transition-colors cursor-pointer press-scale border border-[var(--color-border)]/40"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <a
            href={qrData}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 text-[12px] font-display font-semibold transition-colors cursor-pointer press-scale border border-cyan-500/30"
            title="Preview what someone scanning your QR code will see"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Scan</span>
          </a>
        </div>
      )}
    </div>
  );
}
