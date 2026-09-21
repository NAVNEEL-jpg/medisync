'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'google' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
  secondary:
    'bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
  ghost:
    'bg-transparent text-[var(--color-foreground-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]',
  danger:
    'bg-[var(--color-destructive)] text-white hover:bg-[var(--color-destructive-hover)] shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--color-ring-destructive)]',
  google:
    'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md',
  outline:
    'bg-transparent text-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[13px] gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-[14px] gap-2 rounded-xl',
  lg: 'px-6 py-3 text-[15px] gap-2.5 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-display font-semibold
        cursor-pointer select-none
        transition-all duration-[var(--duration-fast)]
        press-scale
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed !transform-none' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
