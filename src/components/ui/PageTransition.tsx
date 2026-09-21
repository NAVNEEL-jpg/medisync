'use client';

import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  activeKey: string | number;
  className?: string;
}

export function PageTransition({
  children,
  activeKey,
  className = '',
}: PageTransitionProps) {
  return (
    <div
      key={activeKey}
      className={`animate-fadeInUp ${className}`}
    >
      {children}
    </div>
  );
}
