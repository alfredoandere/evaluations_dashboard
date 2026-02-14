import { useState, useEffect, useCallback, useRef } from 'react';
import Leaderboard from '../components/Leaderboard';
import ProblemTable from '../components/ProblemTable';

import { problems as initialProblems, engineers as initialEngineers, loadData, getStats, TOTAL_ORDERS, type Problem, type Engineer } from '../data/mockData';

// Always poll R2 for sync status - it's the source of truth (updated by GitHub Action)
const SYNC_STATUS_URL = 'https://pub-cc67e139b4bc48d08ecda05c9046c36f.r2.dev/sync-status.json';

const POLL_INTERVAL_NORMAL = 10_000;   // 10 seconds - always watching
const POLL_INTERVAL_FAST = 3_000;      // 3 seconds - after manual trigger
const FAST_POLL_DURATION = 90_000;     // 90 seconds of fast polling, then give up

function DashboardPage() {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [engineers, setEngineers] = useState<Engineer[]>(initialEngineers);
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const lastKnownSync = useRef<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fastPollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch data — only updates state if CSV content actually changed
  const fetchData = useCallback(() => {
    loadData().then(({ problems: loadedProblems, engineers: loadedEngineers, changed }) => {
      if (changed) {
        setProblems(loadedProblems);
        setEngineers(loadedEngineers);
      }
    });
  }, []);

  // Fetch sync status and detect changes
  const fetchSyncStatus = useCallback(async () => {
    try {
      const response = await fetch(`${SYNC_STATUS_URL}?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.lastSync) {
          const newSyncTime = data.lastSync;
          setLastSyncTime(new Date(newSyncTime));
          setCurrentTime(new Date());

          // Detect if sync time changed -> new data available
          if (lastKnownSync.current && lastKnownSync.current !== newSyncTime) {
            console.log(`Sync change detected: ${lastKnownSync.current} -> ${newSyncTime}`);
            setIsSyncing(false);
          }
          lastKnownSync.current = newSyncTime;
        }
      }
    } catch {
      // Ignore errors - sync status is optional
    }
  }, []);

  // Start polling at a given interval
  const startPolling = useCallback((interval: number) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = setInterval(() => {
      fetchSyncStatus();
      setCurrentTime(new Date());
    }, interval);
  }, [fetchSyncStatus]);

  // Switch to fast polling temporarily (after manual trigger)
  const startFastPolling = useCallback(() => {
    startPolling(POLL_INTERVAL_FAST);
    // Revert to normal polling after duration
    if (fastPollTimeoutRef.current) clearTimeout(fastPollTimeoutRef.current);
    fastPollTimeoutRef.current = setTimeout(() => {
      startPolling(POLL_INTERVAL_NORMAL);
      setIsSyncing(false);
    }, FAST_POLL_DURATION);
  }, [startPolling]);

  // Initialize: fetch data + sync status, start polling
  useEffect(() => {
    fetchData();
    fetchSyncStatus();
    startPolling(POLL_INTERVAL_NORMAL);

    // Poll CSV data every 30 seconds (only updates UI if content changed)
    const dataInterval = setInterval(fetchData, 30_000);

    return () => {
      clearInterval(dataInterval);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (fastPollTimeoutRef.current) clearTimeout(fastPollTimeoutRef.current);
    };
  }, [fetchData, fetchSyncStatus, startPolling]);

  // Use system preference for dark/light mode, but allow manual override
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      if (manualTheme !== null) {
        // Manual override active
        document.documentElement.classList.toggle('light', manualTheme === 'light');
      } else {
        // Use system preference
        document.documentElement.classList.toggle('light', !prefersDark.matches);
      }
    };
    
    applyTheme();
    
    // Listen for system changes (only applies if no manual override)
    const handleChange = () => {
      if (manualTheme === null) {
        applyTheme();
      }
    };
    
    prefersDark.addEventListener('change', handleChange);
    return () => prefersDark.removeEventListener('change', handleChange);
  }, [manualTheme]);

  // Toggle theme manually
  const toggleTheme = () => {
    const isCurrentlyLight = document.documentElement.classList.contains('light');
    setManualTheme(isCurrentlyLight ? 'dark' : 'light');
  };

  // Format last sync time relative to current time
  const formatSyncTime = (): string => {
    if (!lastSyncTime) return 'checking...';
    const diffMs = currentTime.getTime() - lastSyncTime.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 30) return 'just now';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  // Trigger sync: enter "watching" mode with fast polling
  // If user has token (dev), also trigger the GitHub Action via API
  // Either way, start aggressive polling to detect when R2 updates
  const triggerSync = async () => {
    setIsSyncing(true);
    startFastPolling(); // Start polling R2 every 3s to detect the change

    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) {
      // Dev mode: trigger workflow via API
      try {
        await fetch(
          'https://api.github.com/repos/alfredoandere/evaluations_dashboard/actions/workflows/sync-submissions.yml/dispatches',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify({ ref: 'main' }),
          }
        );
      } catch (error) {
        console.error('Failed to trigger sync:', error);
      }
    } else {
      // Production: open GitHub Actions page for manual trigger
      window.open('https://github.com/alfredoandere/evaluations_dashboard/actions/workflows/sync-submissions.yml', '_blank');
    }
  };

  // Filter problems by status
  const qcProblems = problems.filter(p => p.status === 'qc');
  const reviewedProblems = problems.filter(p => p.status === 'accepted' || p.status === 'rejected');

  // Calculate stats
  const stats = getStats();

  return (
    <div className="h-screen w-screen bg-background text-text-main overflow-hidden font-sans selection:bg-primary/20 flex flex-col">
      
      {/* Header Bar */}
      <div className="h-10 border-b border-border bg-surface/30 px-4 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-6">
            <h1 
              onClick={toggleTheme}
              className="text-xs font-mono font-bold tracking-[0.2em] text-text-muted hover:text-text-main cursor-pointer transition-colors select-none"
              title="Click to toggle theme"
            >
               EVALS_BIO_2.0
            </h1>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500/70'}`}></span>
               <span className="text-[9px] font-mono text-text-dim">
                  {isSyncing ? 'syncing...' : `synced ${formatSyncTime()}`}
               </span>
            </div>
            <button
               onClick={triggerSync}
               disabled={isSyncing}
               className="text-[9px] font-mono text-text-dim hover:text-text-main disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               title="Trigger manual sync"
            >
               ↻
            </button>
         </div>
      </div>

      {/* Main Content Grid: 3 Equal Columns */}
      <div className="flex-1 min-h-0 p-4 grid grid-cols-3 gap-4">
         
         {/* Column 1: Under Review (QC) */}
         <div className="flex flex-col h-full bg-surface/20 rounded-lg border border-border/30 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-border/30 bg-surfaceHighlight/30 shrink-0 h-[88px] flex flex-col justify-between">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                     UNDER REVIEW
                  </h3>
                  <span className="text-[10px] font-mono bg-surface border border-border px-1.5 rounded text-text-dim">
                     PENDING
                  </span>
               </div>
               <div className="flex items-end gap-2">
                  <span className="text-3xl font-mono font-bold text-text-main leading-none">
                     {qcProblems.length}
                  </span>
                  <span className="text-[9px] font-mono text-text-dim mb-1">PROBLEMS</span>
               </div>
            </div>
            
            {/* List */}
            <ProblemTable problems={qcProblems} />
         </div>

         {/* Column 2: Reviewed (Accepted/Rejected) */}
         <div className="flex flex-col h-full bg-surface/20 rounded-lg border border-border/30 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-border/30 bg-surfaceHighlight/30 shrink-0 h-[88px] flex flex-col justify-between">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     REVIEWED
                  </h3>
                  <span className="text-[10px] font-mono bg-surface border border-border px-1.5 rounded text-text-dim">
                     {stats.acceptanceRate}% ACCEPTED
                  </span>
               </div>
               <div className="flex items-end gap-2">
                  <span className="text-3xl font-mono font-bold text-text-main leading-none">
                     {reviewedProblems.length}
                  </span>
                  <span className="text-[9px] font-mono text-text-dim mb-1">PROBLEMS</span>
               </div>
            </div>
            
            {/* List */}
            <ProblemTable problems={reviewedProblems} showExamplesWhenEmpty={true} />
         </div>

         {/* Column 3: Leaderboard */}
         <div className="flex flex-col h-full">
            <Leaderboard 
              engineers={engineers} 
              totalOrders={TOTAL_ORDERS}
              totalAccepted={stats.acceptedCount} 
            />
         </div>

      </div>
    </div>
  );
}

export default DashboardPage;
