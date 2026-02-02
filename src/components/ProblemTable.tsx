import type { Problem } from '../data/mockData';

interface ProblemTableProps {
  problems: Problem[];
  showExamplesWhenEmpty?: boolean;
}

// Format date as "01/28"
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
};

// Get square styles based on problem status
const getSquareStyles = (status: Problem['status']): string => {
  switch (status) {
    case 'qc':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
    case 'accepted':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50';
    case 'rejected':
      return 'bg-red-500/20 text-red-400 border border-red-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
  }
};

// Example problems for empty reviewed table
const exampleProblems: Problem[] = [
  {
    id: 0,
    title: 'Accepted Example',
    description: 'This is an example of an accepted problem submission',
    paperUrl: '#',
    kit: 'xenium',
    engineer: 'Example Engineer',
    status: 'accepted',
    submittedAt: new Date(),
  },
  {
    id: 0,
    title: 'Rejected Example',
    description: 'This is an example of a rejected problem submission',
    paperUrl: '#',
    kit: 'visium',
    engineer: 'Example Engineer',
    status: 'rejected',
    submittedAt: new Date(),
  },
];

export default function ProblemTable({ problems, showExamplesWhenEmpty = false }: ProblemTableProps) {
  const isEmpty = problems.length === 0;
  const displayProblems = isEmpty && showExamplesWhenEmpty ? exampleProblems : problems;
  const isShowingExamples = isEmpty && showExamplesWhenEmpty;

  return (
    <div className="overflow-auto flex-1 custom-scrollbar w-full">
      <table className="w-full text-[10px] text-left border-collapse table-fixed">
        <thead className="sticky top-0 z-10 bg-surfaceHighlight border-b border-border text-[9px] uppercase tracking-wider font-mono text-text-muted">
          <tr>
            <th className="px-1.5 py-2 font-semibold w-8 text-center">#</th>
            <th className="px-1.5 py-2 font-semibold w-16">SUBMITTED</th>
            <th className="px-1.5 py-2 font-semibold w-28">ENGINEER</th>
            <th className="px-1.5 py-2 font-semibold w-24">PROBLEM</th>
            <th className="px-1.5 py-2 font-semibold w-16">KIT</th>
            <th className="px-1.5 py-2 font-semibold">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {displayProblems.map((problem, index) => {
            const squareStyles = getSquareStyles(problem.status);

            return (
              <tr 
                key={isShowingExamples ? `example-${index}` : problem.id} 
                className="group hover:bg-surfaceHighlight/30 transition-colors duration-75"
              >
                {/* ID Number with status-based color */}
                <td className="px-1.5 py-1.5 text-center">
                  <div className={`h-5 w-5 mx-auto rounded flex items-center justify-center text-[9px] font-mono font-bold ${squareStyles}`}>
                    {isShowingExamples ? (problem.status === 'accepted' ? '✓' : '✗') : problem.id}
                  </div>
                </td>

                {/* Submitted Date */}
                <td className="px-1.5 py-1.5 whitespace-nowrap">
                  <span className="font-mono text-text-dim text-[9px]">
                    {isShowingExamples ? '—' : formatDate(problem.submittedAt)}
                  </span>
                </td>

                {/* Engineer */}
                <td className="px-1.5 py-1.5 whitespace-nowrap">
                  <span className="font-medium font-mono text-text-muted truncate block">
                     {problem.engineer}
                  </span>
                </td>

                {/* Problem - links to paper_url */}
                <td className="px-1.5 py-1.5">
                  {isShowingExamples ? (
                    <span className="font-mono text-text-dim truncate block">
                      {problem.title}
                    </span>
                  ) : (
                    <a 
                      href={problem.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-primary hover:text-primary/80 hover:underline truncate block transition-colors"
                    >
                      {problem.title}
                    </a>
                  )}
                </td>

                {/* Kit */}
                <td className="px-1.5 py-1.5 whitespace-nowrap">
                  <span className="font-mono text-text-dim text-[9px] uppercase">
                    {problem.kit}
                  </span>
                </td>

                {/* Description - truncated, no overflow */}
                <td className="px-1.5 py-1.5 overflow-hidden">
                  <span className="font-mono text-text-dim text-[9px] truncate block whitespace-nowrap">
                    {problem.description}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
