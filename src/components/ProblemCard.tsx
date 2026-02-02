import type { Problem } from '../data/mockData';
import { mockEngineers } from '../data/mockData';

interface ProblemCardProps {
  problem: Problem;
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  const isHard = problem.difficulty === 'Hard';
  const isEasy = problem.difficulty === 'Easy';
  
  // Find engineer name
  const engineer = mockEngineers.find(e => e.id === problem.authorId);
  const engineerName = engineer ? engineer.name : 'Unknown';
  const engineerInitials = engineerName.split(' ')[1]?.[0] || engineerName[0];

  return (
    <div className="bg-surface border border-border/50 rounded p-3 hover:border-border transition-colors group cursor-default">
      {/* Header: Tag */}
      <div className="mb-2">
        <span className={`
          text-[9px] font-mono font-bold uppercase tracking-wider px-1 py-0.5 rounded
          ${isHard ? 'bg-red-500/10 text-red-500' : isEasy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}
        `}>
          {problem.difficulty} Eval
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xs font-bold text-text-main mb-1 leading-tight group-hover:text-primary transition-colors">
        {problem.title}
      </h3>

      {/* Description */}
      <p className="text-[10px] text-text-dim leading-snug mb-3 line-clamp-3">
        {problem.description}
      </p>

      {/* Footer Metrics */}
      <div className="border-t border-border/50 pt-2 flex items-center justify-between text-[9px] font-mono text-text-muted mb-2">
        <div>
           <span className="opacity-50 mr-1">SUCCESS:</span>
           <span className={problem.successRate > 80 ? 'text-text-main' : 'text-secondary'}>{problem.successRate}%</span>
        </div>
        <div>
           <span className="opacity-50 mr-1">TIME:</span>
           <span className="text-text-main">{problem.timeMetric}</span>
        </div>
      </div>
      
      {/* Footer: Engineer & Platform */}
      <div className="flex items-center justify-between border-t border-border/50 pt-2">
         {/* Engineer */}
         <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-surfaceHighlight flex items-center justify-center text-[8px] font-mono text-text-muted border border-border">
               {engineerInitials}
            </div>
            <span className="text-[9px] text-text-muted truncate max-w-[80px]">
               {engineerName}
            </span>
         </div>

         {/* Platform */}
         <span className="text-[8px] font-mono uppercase tracking-widest text-text-dim opacity-50">
            {problem.platform}
         </span>
      </div>
    </div>
  );
}

