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
  subtitle = null,
  subtitleClass = 'text-[10px] text-[var(--color-foreground-muted)] font-medium',
  wordmarkClass = 'font-display font-bold text-[16px] tracking-tight text-[var(--color-foreground)]',
  className = '',
}: MediSyncLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo icon — the uploaded MediSync logo image */}
      <div
        className="rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-sm"
        style={{ width: size, height: size }}
      >
        <Image
          src="/medisync-logo.jpg"
          alt="MediSync Logo"
          width={size}
          height={size}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {showWordmark && (
        <div>
          <span className={wordmarkClass}>MediSync</span>
          {subtitle && (
            <p className={`${subtitleClass} block leading-none mt-0.5`}>{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
