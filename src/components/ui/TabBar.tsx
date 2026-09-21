'use client';

import React, { useRef, useState, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'pill' | 'underline';
  size?: 'sm' | 'md';
  className?: string;
  fullWidth?: boolean;
}

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pill',
  size = 'md',
  className = '',
  fullWidth = false,
}: TabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const activeButton = containerRef.current.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement;
    if (!activeButton) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setIndicatorStyle({
      width: buttonRect.width,
      transform: `translateX(${buttonRect.left - containerRect.left}px)`,
    });
  }, [activeTab, tabs]);

  if (variant === 'pill') {
    return (
      <div
        ref={containerRef}
        className={`
          relative flex rounded-xl p-1
          bg-[var(--color-muted)]
          ${fullWidth ? 'w-full' : 'w-fit'}
          ${className}
        `}
      >
        {/* Sliding pill indicator */}
        <div
          className="absolute top-1 left-0 h-[calc(100%-8px)] rounded-lg bg-white shadow-sm transition-all duration-300"
          style={{
            ...indicatorStyle,
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />

        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative z-10 flex items-center justify-center gap-1.5
              ${fullWidth ? 'flex-1' : ''}
              ${size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[13px]'}
              rounded-lg font-display font-semibold
              transition-colors duration-200 cursor-pointer
              ${activeTab === tab.id
                ? 'text-[var(--color-foreground)]'
                : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
              }
            `}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--color-primary)] text-white font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  /* Underline variant */
  return (
    <div
      ref={containerRef}
      className={`relative flex border-b border-[var(--color-border)]/40 ${className}`}
    >
      {/* Sliding underline */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-primary)] rounded-full transition-all duration-300"
        style={{
          ...indicatorStyle,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center justify-center gap-1.5
            ${fullWidth ? 'flex-1' : ''}
            ${size === 'sm' ? 'px-3 py-2 text-[12px]' : 'px-4 py-2.5 text-[13px]'}
            font-display font-semibold
            transition-colors duration-200 cursor-pointer
            ${activeTab === tab.id
              ? 'text-[var(--color-primary)]'
              : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
            }
          `}
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

/* Dark variant for auth page */
interface DarkTabBarProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function DarkTabBar({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: DarkTabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const activeButton = containerRef.current.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement;
    if (!activeButton) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setIndicatorStyle({
      width: buttonRect.width,
      transform: `translateX(${buttonRect.left - containerRect.left}px)`,
    });
  }, [activeTab, tabs]);

  return (
    <div
      ref={containerRef}
      className={`relative flex rounded-xl p-1 bg-white/[0.04] border border-white/8 ${className}`}
    >
      <div
        className="absolute top-1 left-0 h-[calc(100%-8px)] rounded-lg bg-[var(--color-primary)] shadow-lg transition-all duration-300"
        style={{
          ...indicatorStyle,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative z-10 flex-1 py-2 rounded-lg text-[13px] font-display font-bold
            transition-colors duration-200 cursor-pointer
            ${activeTab === tab.id
              ? 'text-white'
              : 'text-slate-400 hover:text-white'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
