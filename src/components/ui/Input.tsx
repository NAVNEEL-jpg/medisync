'use client';

import React, { useState, useId } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type InputState = 'default' | 'success' | 'error';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  helperText?: string;
  errorText?: string;
  state?: InputState;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const stateStyles: Record<InputState, { border: string; ring: string }> = {
  default: {
    border: 'border-[var(--color-border)] focus-within:border-[var(--color-border-focus)]',
    ring: 'focus-within:ring-2 focus-within:ring-[var(--color-ring)]',
  },
  success: {
    border: 'border-emerald-400 focus-within:border-emerald-500',
    ring: 'focus-within:ring-2 focus-within:ring-emerald-500/25',
  },
  error: {
    border: 'border-red-400 focus-within:border-red-500',
    ring: 'focus-within:ring-2 focus-within:ring-red-500/25',
  },
};

export function Input({
  label,
  helperText,
  errorText,
  state = 'default',
  icon,
  rightAction,
  inputSize = 'md',
  className = '',
  value,
  id: externalId,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';
  const isFloating = isFocused || hasValue;
  const currentState = errorText ? 'error' : state;

  const heightClass = inputSize === 'sm' ? 'h-10' : inputSize === 'lg' ? 'h-14' : 'h-12';

  return (
    <div className={`relative ${className}`}>
      {/* Input container */}
      <div
        className={`
          relative ${heightClass} rounded-xl
          bg-[var(--color-surface)] border
          transition-all duration-[var(--duration-fast)]
          ${stateStyles[currentState].border}
          ${stateStyles[currentState].ring}
        `}
      >
        {/* Left icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] z-10 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Floating label */}
        <label
          htmlFor={inputId}
          className={`
            absolute left-${icon ? '10' : '3.5'} pointer-events-none
            font-display text-[var(--color-foreground-muted)]
            transition-all duration-200 ease-out origin-left
            ${isFloating
              ? 'top-1.5 text-[10px] font-medium text-[var(--color-primary)]'
              : 'top-1/2 -translate-y-1/2 text-[14px]'
            }
          `}
        >
          {label}
        </label>

        {/* Input element */}
        <input
          id={inputId}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full h-full bg-transparent
            ${icon ? 'pl-10' : 'pl-3.5'}
            ${rightAction ? 'pr-10' : 'pr-3.5'}
            ${isFloating ? 'pt-4 pb-1' : 'pt-0 pb-0'}
            text-[14px] font-body text-[var(--color-foreground)]
            placeholder-transparent
            outline-none border-none
            transition-[padding] duration-200
          `}
          {...props}
        />

        {/* Right action / state icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {currentState === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          {currentState === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          {rightAction}
        </div>
      </div>

      {/* Helper / Error text */}
      {(errorText || helperText) && (
        <p
          className={`mt-1.5 text-[12px] leading-tight ${
            errorText ? 'text-red-500' : 'text-[var(--color-foreground-muted)]'
          }`}
          role={errorText ? 'alert' : undefined}
        >
          {errorText || helperText}
        </p>
      )}
    </div>
  );
}

/* Dark variant for auth page */
interface DarkInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  helperText?: string;
  errorText?: string;
  state?: InputState;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function DarkInput({
  label,
  helperText,
  errorText,
  state = 'default',
  icon,
  rightAction,
  className = '',
  value,
  id: externalId,
  ...props
}: DarkInputProps) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';
  const isFloating = isFocused || hasValue;
  const currentState = errorText ? 'error' : state;

  const borderColor =
    currentState === 'error'
      ? 'border-red-500/60'
      : currentState === 'success'
      ? 'border-emerald-500/60'
      : isFocused
      ? 'border-cyan-400/60'
      : 'border-white/10';

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative h-12 rounded-xl
          bg-white/[0.04]
          border ${borderColor}
          transition-all duration-[var(--duration-fast)]
          ${isFocused ? 'ring-2 ring-cyan-400/20' : ''}
        `}
      >
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
            {icon}
          </div>
        )}

        <label
          htmlFor={inputId}
          className={`
            absolute ${icon ? 'left-10' : 'left-3.5'} pointer-events-none
            font-display
            transition-all duration-200 ease-out origin-left
            ${isFloating
              ? 'top-1.5 text-[10px] font-medium text-cyan-400'
              : 'top-1/2 -translate-y-1/2 text-[14px] text-slate-400'
            }
          `}
        >
          {label}
        </label>

        <input
          id={inputId}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full h-full bg-transparent
            ${icon ? 'pl-10' : 'pl-3.5'}
            ${rightAction ? 'pr-10' : 'pr-3.5'}
            ${isFloating ? 'pt-4 pb-1' : 'pt-0 pb-0'}
            text-[14px] text-white
            placeholder-transparent
            outline-none border-none
            transition-[padding] duration-200
          `}
          {...props}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {currentState === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          {currentState === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          {rightAction}
        </div>
      </div>

      {(errorText || helperText) && (
        <p
          className={`mt-1.5 text-[12px] leading-tight ${
            errorText ? 'text-red-400' : 'text-slate-500'
          }`}
          role={errorText ? 'alert' : undefined}
        >
          {errorText || helperText}
        </p>
      )}
    </div>
  );
}
