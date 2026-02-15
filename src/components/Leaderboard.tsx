import { useState, useMemo, useRef } from 'react';
import type { Engineer } from '../data/mockData';

type SortField = 'name' | 'problemsAccepted' | 'lastSubmitted';
type SortDirection = 'asc' | 'desc';

interface LeaderboardProps {
  engineers: Engineer[];
  totalOrders: number;
  totalAccepted: number;
  fullAccess?: boolean;
  onToggleFullAccess?: () => void;
  revenueProblemsCount?: number;
  revenueLabel?: string;
  weekRevenue?: string;
  yearlyRunRate?: string;
}

// Format date as "01/28"
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
};

export default function Leaderboard({ engineers, totalOrders: _totalOrders, totalAccepted, fullAccess, onToggleFullAccess, revenueProblemsCount, revenueLabel, weekRevenue, yearlyRunRate }: LeaderboardProps) {
  void _totalOrders;
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContributorsClick = () => {
    if (fullAccess) {
      // Already active: 1 click to deactivate
      onToggleFullAccess?.();
      clickCountRef.current = 0;
      return;
    }
    clickCountRef.current++;
    if (clickCountRef.current >= 3) {
      onToggleFullAccess?.();
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      return;
    }
    // Reset count after 1 second of no clicks
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 1000);
  };
  const [sortField, setSortField] = useState<SortField>('problemsAccepted');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedEngineers = useMemo(() => {
    return [...engineers].sort((a, b) => {
      let aValue: string | number | Date = a[sortField];
      let bValue: string | number | Date = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [engineers, sortField, sortDirection]);

  // Engineers with at least 1 accepted problem get gold treatment
  const activatedNames = useMemo(() => {
     return new Set(engineers.filter(e => e.problemsAccepted > 0).map(e => e.name));
  }, [engineers]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="opacity-0 group-hover:opacity-30 ml-0.5 transition-opacity">⇅</span>;
    return <span className="text-primary ml-0.5">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="h-full flex flex-col bg-surface/20 w-full rounded-lg border border-border/30 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border/30 bg-surfaceHighlight/30 shrink-0 h-[88px] flex flex-col justify-between">
         <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
               <span className="text-yellow-500">★</span> CONTRIBUTIONS
            </h3>
            <span
               onClick={handleContributorsClick}
               className="text-[10px] font-mono bg-surface border border-border px-1.5 rounded text-text-dim select-none"
            >
               {engineers.filter(e => e.problemsAccepted > 0).length} CONTRIBUTORS
            </span>
         </div>
         <div className="flex items-end justify-between">
            <div className="flex items-end gap-2">
               <span className="text-3xl font-mono font-bold text-text-main leading-none">
                  {totalAccepted}
               </span>
               <span className="text-[9px] font-mono text-text-dim mb-1">COMPLETED</span>
            </div>
            {fullAccess && (
              <>
                <div className="flex items-end gap-1.5">
                   <span className="text-lg font-mono font-bold text-text-muted leading-none">
                      {revenueProblemsCount}
                   </span>
                   <span className="text-[8px] font-mono text-text-dim mb-0.5 uppercase">{revenueLabel}</span>
                </div>
                <div className="flex items-end gap-1.5">
                   <span className="text-lg font-mono font-bold text-text-muted leading-none">
                      {weekRevenue}
                   </span>
                   <span className="text-[8px] font-mono text-text-dim mb-0.5">REVENUE</span>
                </div>
                <div className="flex items-end gap-1.5">
                   <span className="text-lg font-mono font-bold text-text-muted leading-none">
                      {yearlyRunRate}
                   </span>
                   <span className="text-[8px] font-mono text-text-dim mb-0.5">RUN RATE</span>
                </div>
              </>
            )}
         </div>
      </div>
      
      <div className="overflow-auto flex-1 custom-scrollbar w-full">
        {/* Header Row */}
        <div className="sticky top-0 z-10 bg-surfaceHighlight border-b border-border text-[9px] uppercase tracking-wider font-mono text-text-muted flex px-2 py-2">
          <div className="w-6 text-center shrink-0">#</div>
          <div 
            className="w-28 cursor-pointer hover:bg-white/5 select-none group flex items-center shrink-0 ml-3 mr-4"
            onClick={() => handleSort('name')}
          >
            ENGINEER <SortIcon field="name" />
          </div>
          <div 
            className="w-16 cursor-pointer hover:bg-white/5 select-none group flex items-center shrink-0"
            onClick={() => handleSort('problemsAccepted')}
          >
            ACCEPTED <SortIcon field="problemsAccepted" />
          </div>
          <div 
            className="flex-1 cursor-pointer hover:bg-white/5 select-none group flex items-center justify-end text-right"
            onClick={() => handleSort('lastSubmitted')}
          >
            LAST SUB <SortIcon field="lastSubmitted" />
          </div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-border/30">
          {sortedEngineers.map((engineer, index) => {
            const isActivated = activatedNames.has(engineer.name);
            
            return (
              <div 
                key={engineer.name} 
                className="flex items-center px-2 py-1.5 hover:bg-surfaceHighlight/30 transition-colors duration-75"
              >
                {/* Rank # */}
                <div className="w-6 shrink-0 flex justify-center">
                  <div className={`h-5 w-5 rounded flex items-center justify-center text-[9px] font-mono font-bold transition-colors ${
                     isActivated ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-surfaceHighlight border border-border text-text-muted'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* Engineer Name */}
                <div className="w-28 shrink-0 whitespace-nowrap overflow-hidden ml-3 mr-4">
                  <span className="font-medium font-mono text-[10px] truncate block text-text-muted">
                     {engineer.name}
                  </span>
                </div>

                {/* Accepted Count */}
                <div className="w-16 shrink-0">
                  <span className="font-mono font-bold text-[10px] text-text-main">{engineer.problemsAccepted}</span>
                </div>

                {/* Last Submitted */}
                <div className="flex-1 text-right">
                  <span className="font-mono text-text-dim text-[9px]">
                    {formatDate(engineer.lastSubmitted)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
