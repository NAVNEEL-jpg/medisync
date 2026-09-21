'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  staggerIndex?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  children,
  className = '',
  hover = true,
  interactive = false,
  staggerIndex,
  padding = 'md',
  onClick,
}: CardProps) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={`
        bg-[var(--color-card)] rounded-2xl
        border border-[var(--color-border)]/40
        shadow-[var(--shadow-sm)]
        ${paddingStyles[padding]}
        ${hover ? 'card-hover' : ''}
        ${interactive || onClick ? 'press-scale cursor-pointer' : ''}
        ${staggerIndex !== undefined ? 'stagger-child' : ''}
        ${className}
      `.trim()}
      style={staggerIndex !== undefined ? { '--stagger-index': staggerIndex } as React.CSSProperties : undefined}
    >
      {children}
    </Tag>
  );
}

/* Dark card variant for auth page */
interface DarkCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function DarkCard({
  children,
  className = '',
  hover = false,
  interactive = false,
  selected = false,
  onClick,
}: DarkCardProps) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={`
        rounded-2xl border
        transition-all duration-[var(--duration-fast)]
        ${selected
          ? 'bg-cyan-500/10 border-cyan-400/40 ring-1 ring-cyan-400/20'
          : 'bg-white/[0.03] border-white/8 hover:border-white/15'
        }
        ${hover ? 'card-hover' : ''}
        ${interactive || onClick ? 'press-scale cursor-pointer' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </Tag>
  );
}
