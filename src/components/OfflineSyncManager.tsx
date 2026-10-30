'use client';

import React, { useState, useEffect } from 'react';
import { OfflineSyncQueueItem } from '@/lib/types';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  HardDrive,
  Download,
  Trash2,
} from 'lucide-react';

interface OfflineSyncManagerProps {
  onSyncComplete?: (syncedCount: number) => void;
  className?: string;
}

const STORAGE_KEY = 'carelink_offline_sync_queue';

export function getOfflineQueue(): OfflineSyncQueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Could not read offline queue:', e);
    return [];
  }
}

export function addToOfflineQueue(item: Omit<OfflineSyncQueueItem, 'id' | 'timestamp' | 'attempts' | 'status'>): OfflineSyncQueueItem {
  const queue = getOfflineQueue();
  const newItem: OfflineSyncQueueItem = {
    ...item,
    id: `sync-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    attempts: 0,
    status: 'PENDING',
  };
  queue.push(newItem);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn('Could not save to offline queue:', e);
    }
  }
  return newItem;
}

export function clearOfflineQueue() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function OfflineSyncManager({ onSyncComplete, className = '' }: OfflineSyncManagerProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [queue, setQueue] = useState<OfflineSyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      setQueue(getOfflineQueue());

      const handleOnline = () => {
        setIsOnline(true);
        triggerAutoSync();
      };
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const triggerAutoSync = async () => {
    const pendingItems = getOfflineQueue().filter((item) => item.status !== 'SYNCED');
    if (pendingItems.length === 0) return;

    setIsSyncing(true);
    setSyncStatusMsg(`Synchronizing ${pendingItems.length} cached rural records to ABDM Vault...`);

    let successCount = 0;
    const updatedQueue = [...getOfflineQueue()];

    for (const item of updatedQueue) {
      if (item.status === 'SYNCED') continue;

      try {
        const res = await fetch(item.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });

        if (res.ok) {
          item.status = 'SYNCED';
          successCount++;
        } else {
          item.attempts += 1;
          item.status = 'FAILED';
          item.lastError = `Server responded with ${res.status}`;
        }
      } catch (err: unknown) {
        item.attempts += 1;
        item.status = 'FAILED';
        item.lastError = (err as Error).message || 'Network unreachable';
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQueue));
    }
    setQueue(updatedQueue);
    setIsSyncing(false);
    setSyncStatusMsg(`Successfully synchronized ${successCount} record(s).`);
    if (onSyncComplete) onSyncComplete(successCount);

    setTimeout(() => setSyncStatusMsg(''), 5000);
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(queue, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `carelink_offline_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const pendingCount = queue.filter((i) => i.status !== 'SYNCED').length;

  return (
    <div className={`p-4 rounded-3xl bg-slate-900/90 border border-teal-500/30 text-xs font-body ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Network & Queue Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-sm">
                Rural Health Offline Sync Queue
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isOnline
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300 animate-pulse'
                }`}
              >
                {isOnline ? 'Online · Live Sync Ready' : 'Offline Kiosk Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {pendingCount > 0
                ? `${pendingCount} record(s) queued for synchronization`
                : 'All outreach camp records are synchronized with central vault'}
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2">
          {pendingCount > 0 && isOnline && (
            <button
              onClick={triggerAutoSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}

          {queue.length > 0 && (
            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Download local JSON backup of outreach camp registrations"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>

      {syncStatusMsg && (
        <div className="mt-3 p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-300 text-[11px] font-medium flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}
    </div>
  );
}
