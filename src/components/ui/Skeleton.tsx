'use client';

import React from 'react';

type SkeletonVariant = 'text' | 'circle' | 'card' | 'input' | 'rect';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
}: SkeletonProps) {
  if (variant === 'circle') {
    return (
      <div
        className={`skeleton rounded-full shrink-0 ${className}`}
        style={{
          width: width || 40,
          height: height || width || 40,
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`skeleton rounded-2xl ${className}`}
        style={{
          width: width || '100%',
          height: height || 120,
        }}
      />
    );
  }

  if (variant === 'input') {
    return (
      <div
        className={`skeleton rounded-xl ${className}`}
        style={{
          width: width || '100%',
          height: height || 48,
        }}
      />
    );
  }

  if (variant === 'rect') {
    return (
      <div
        className={`skeleton rounded-lg ${className}`}
        style={{ width: width || '100%', height: height || 24 }}
      />
    );
  }

  // Text lines
  return (
    <div className={`space-y-2 ${className}`} style={{ width: width || '100%' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton rounded"
          style={{
            height: height || 14,
            width: i === lines - 1 && lines > 1 ? '75%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

/* Skeleton card with header structure */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[var(--color-border)]/30 p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={36} />
        <div className="flex-1 space-y-2">
          <Skeleton height={12} width="60%" />
          <Skeleton height={10} width="40%" />
        </div>
      </div>
      <Skeleton lines={3} />
    </div>
  );
}
