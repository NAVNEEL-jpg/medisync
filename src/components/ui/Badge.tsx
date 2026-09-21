'use client';

import React from 'react';

type BadgeVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  info: {
    bg: 'bg-cyan-50 border-cyan-200',
    text: 'text-cyan-700',
    dot: 'bg-cyan-500',
  },
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  danger: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  neutral: {
    bg: 'bg-slate-100 border-slate-200',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
  },
  primary: {
    bg: 'bg-cyan-50 border-[var(--color-primary)]/20',
    text: 'text-[var(--color-primary)]',
    dot: 'bg-[var(--color-primary)]',
  },
};

export function Badge({
  children,
  variant = 'neutral',
  dot = false,
  size = 'sm',
  className = '',
}: BadgeProps) {
  const styles = variantStyles[variant];
  const sizeClass = size === 'sm'
    ? 'px-2 py-0.5 text-[11px]'
    : 'px-2.5 py-1 text-[12px]';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        font-display font-medium leading-none
        ${styles.bg} ${styles.text}
        ${sizeClass}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} shrink-0`} />
      )}
      {children}
    </span>
  );
}
