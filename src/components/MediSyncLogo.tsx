'use client';

import React from 'react';
import Image from 'next/image';

interface MediSyncLogoProps {
  /** Size of the logo icon in px — the icon is always square */
  size?: number;
  /** Show the wordmark "MediSync" next to the icon (default: true) */
  showWordmark?: boolean;
  /** Subtitle text below the wordmark. Pass null to hide. */
  subtitle?: string | null;
  /** Override for the subtitle text colour */
  subtitleClass?: string;
  /** Wordmark colour override */
  wordmarkClass?: string;
  className?: string;
}

/**
 * Reusable MediSync logo component.
 *
 * Usage:
 *   <MediSyncLogo />                       — icon + wordmark
 *   <MediSyncLogo size={32} />             — smaller icon + wordmark
 *   <MediSyncLogo showWordmark={false} />  — icon only
 *   <MediSyncLogo subtitle="Healthcare terminal" />
 */
export function MediSyncLogo({
  size = 40,
  showWordmark = true,
  subtitle = 'Technology That Cares. Healthcare That Reaches Everyone.',
  subtitleClass = 'text-[10px] text-[var(--color-foreground-muted)] font-medium',
  wordmarkClass = 'font-display font-bold text-[16px] tracking-tight text-[var(--color-foreground)]',
  className = '',
}: MediSyncLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo icon — the uploaded MediSync logo image */}
      <div
        className="rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-sm border border-teal-500/20"
        style={{ width: size, height: size }}
      >
        <Image
          src="/medisync-logo.jpg"
          alt="MediSync CareLink Logo"
          width={size}
          height={size}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {showWordmark && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className={wordmarkClass}>MediSync</span>
            <span className="text-[12px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-teal-500/15 text-teal-600 border border-teal-500/20">
              CareLink
            </span>
          </div>
          {subtitle && (
            <p className={`${subtitleClass} block leading-none mt-1`}>{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
