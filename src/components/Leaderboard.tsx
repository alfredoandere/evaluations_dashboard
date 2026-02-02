import { useState, useMemo } from 'react';
import type { Engineer } from '../data/mockData';

type SortField = 'name' | 'problemsAccepted' | 'lastSubmitted';
type SortDirection = 'asc' | 'desc';

interface LeaderboardProps {
  engineers: Engineer[];
  acceptanceRate: number;
  totalAccepted: number;
}

// Format date as "01/28"
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
};

export default function Leaderboard({ engineers, acceptanceRate, totalAccepted }: LeaderboardProps) {
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

  // Top 3 based on accepted problems
  const top3Names = useMemo(() => {
     const ranked = [...engineers].sort((a, b) => b.problemsAccepted - a.problemsAccepted);
     return ranked.slice(0, 3).map(e => e.name);
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
               <span className="text-yellow-500">★</span> LEADERBOARD
            </h3>
            <span className="text-[10px] font-mono bg-surface border border-border px-1.5 rounded text-text-dim">
               {acceptanceRate}% RATE
            </span>
         </div>
         <div className="flex items-end gap-2">
            <span className="text-3xl font-mono font-bold text-text-main leading-none">
               {totalAccepted}
            </span>
            <span className="text-[9px] font-mono text-text-dim mb-1">COMPLETED</span>
         </div>
      </div>
      
      <div className="overflow-auto flex-1 custom-scrollbar w-full">
        {/* Header Row */}
        <div className="sticky top-0 z-10 bg-surfaceHighlight border-b border-border text-[9px] uppercase tracking-wider font-mono text-text-muted flex px-2 py-2 gap-2">
          <div className="w-6 text-center shrink-0">#</div>
          <div 
            className="w-28 cursor-pointer hover:bg-white/5 select-none group flex items-center shrink-0"
            onClick={() => handleSort('name')}
          >
            ENGINEER <SortIcon field="name" />
          </div>
          <div 
            className="w-14 cursor-pointer hover:bg-white/5 select-none group flex items-center shrink-0"
            onClick={() => handleSort('problemsAccepted')}
          >
            ACCEPTED <SortIcon field="problemsAccepted" />
          </div>
          <div 
            className="flex-1 cursor-pointer hover:bg-white/5 select-none group flex items-center"
            onClick={() => handleSort('lastSubmitted')}
          >
            LAST SUB <SortIcon field="lastSubmitted" />
          </div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-border/30">
          {sortedEngineers.map((engineer, index) => {
            const isTop3 = top3Names.includes(engineer.name);
            
            return (
              <div 
                key={engineer.name} 
                className="flex items-center px-2 py-1.5 hover:bg-surfaceHighlight/30 transition-colors duration-75 gap-2"
              >
                {/* Rank # */}
                <div className="w-6 shrink-0 flex justify-center">
                  <div className={`h-5 w-5 rounded flex items-center justify-center text-[9px] font-mono font-bold transition-colors ${
                     isTop3 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-surfaceHighlight border border-border text-text-muted'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* Engineer Name */}
                <div className="w-28 shrink-0 whitespace-nowrap overflow-hidden">
                  <span className={`font-medium font-mono text-[10px] truncate block ${isTop3 ? 'text-text-main' : 'text-text-muted'}`}>
                     {engineer.name}
                     {isTop3 && <span className="ml-1 text-[8px] text-yellow-500">★</span>}
                  </span>
                </div>

                {/* Accepted Count */}
                <div className="w-14 shrink-0">
                  <span className="font-mono font-bold text-[10px] text-text-main">{engineer.problemsAccepted}</span>
                </div>

                {/* Last Submitted */}
                <div className="flex-1">
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
