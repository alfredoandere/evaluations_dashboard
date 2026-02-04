import { useState, useEffect, useCallback } from 'react';
import Leaderboard from './components/Leaderboard';
import ProblemTable from './components/ProblemTable';
import PasswordModal from './components/PasswordModal';
import { problems as initialProblems, engineers as initialEngineers, loadData, getStats, TOTAL_ORDERS, type Problem, type Engineer } from './data/mockData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage immediately to avoid flash
    return localStorage.getItem('eval_dashboard_auth') === 'authenticated';
  });
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [engineers, setEngineers] = useState<Engineer[]>(initialEngineers);
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [, setTick] = useState(0); // Force re-render for time updates

  const handleAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

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

  // Load data from CSV on mount and refresh every 30 minutes
  useEffect(() => {
    const fetchData = () => {
      loadData().then(({ problems: loadedProblems, engineers: loadedEngineers }) => {
        setProblems(loadedProblems);
        setEngineers(loadedEngineers);
        setLastSyncTime(new Date());
      });
    };
    
    // Initial load
    fetchData();
    
    // Refresh every 30 minutes (30 * 60 * 1000 = 1,800,000 ms)
    const intervalId = setInterval(fetchData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Update time display every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick(t => t + 1);
    }, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  // Format last sync time
  const formatSyncTime = (date: Date | null): string => {
    if (!date) return 'syncing...';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  // Filter problems by status
  const qcProblems = problems.filter(p => p.status === 'qc');
  const reviewedProblems = problems.filter(p => p.status === 'accepted' || p.status === 'rejected');

  // Calculate stats
  const stats = getStats();

  // Show password modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-background">
        <PasswordModal onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

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
         
         <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70"></span>
            <span className="text-[9px] font-mono text-text-dim">synced {formatSyncTime(lastSyncTime)}</span>
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

export default App;
