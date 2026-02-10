// Data Source: Latch Internal Evals Submissions CSV
// Fetched at runtime from GitHub: https://github.com/latchbio/latch-internal-evals/blob/main/submissions.csv
// ============================================================================

// Use GitHub API for private repo access in dev mode
const GITHUB_API_URL = 'https://api.github.com/repos/latchbio/latch-internal-evals/contents/submissions.csv?ref=main';

// GitHub token for private repo access - set via VITE_GITHUB_TOKEN env variable
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const IS_DEV = import.meta.env.DEV;

// Cloudflare R2 public URL for production runtime fetching
const R2_BASE_URL = 'https://pub-cc67e139b4bc48d08ecda05c9046c36f.r2.dev';

// Total orders from sales team (update manually)
export const TOTAL_ORDERS = 20;

export type ProblemStatus = 'qc' | 'accepted' | 'rejected';

// Normalize status values from CSV to app status
function normalizeStatus(raw: string): ProblemStatus {
  const s = raw.trim().toLowerCase();
  if (s === 'accepted' || s === 'complete' || s === 'completed' || s === 'done') return 'accepted';
  if (s === 'rejected' || s === 'failed') return 'rejected';
  return 'qc'; // default: qc, pending, in_review, etc.
}

export interface Problem {
  id: number;              // CSV id column
  title: string;           // data_accession (e.g., GSE315435)
  description: string;     // CSV title column (paper title)
  paperUrl: string;        // paper_url for linking
  kit: string;             // kit column
  engineer: string;        // engineer column
  status: ProblemStatus;   // qc, accepted, or rejected
  submittedAt: Date;       // submitted_at column
}

export interface Engineer {
  name: string;
  problemsAccepted: number;
  lastSubmitted: Date;
}

// CSV row interface
interface CSVRow {
  id: string;
  title: string;
  paper_url: string;
  data_url: string;
  data_accession: string;
  kit: string;
  engineer: string;
  reviewer: string;
  status: string;
  count: string;
  notes: string;
  created_at: string;
  submitted_at: string;
  done_at: string;
}

// Parse CSV string to array of objects
function parseCSV(csvText: string): CSVRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',');
  const rows: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    
    rows.push(row as unknown as CSVRow);
  }
  
  return rows;
}

// Parse date from "YYYY-MM-DD" format
function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Transform CSV rows to Problem objects
function transformToProblems(rows: CSVRow[]): Problem[] {
  return rows
    .filter(row => row.id) // Filter out rows without id
    .map(row => ({
      id: parseInt(row.id, 10),
      title: row.data_accession || `#${row.id}`,
      description: row.title || '',
      paperUrl: row.paper_url,
      kit: row.kit,
      engineer: row.engineer,
      status: normalizeStatus(row.status),
      submittedAt: parseDate(row.submitted_at),
    }));
}

// Build engineer list from problems
function buildEngineers(problems: Problem[]): Engineer[] {
  const engineerMap = new Map<string, Engineer>();
  
  problems.forEach(problem => {
    const name = problem.engineer;
    if (!name) return;
    
    if (!engineerMap.has(name)) {
      engineerMap.set(name, {
        name,
        problemsAccepted: 0,
        lastSubmitted: new Date(0),
      });
    }
    
    const eng = engineerMap.get(name)!;
    
    if (problem.status === 'accepted') {
      eng.problemsAccepted++;
    }
    
    if (problem.submittedAt > eng.lastSubmitted) {
      eng.lastSubmitted = problem.submittedAt;
    }
  });
  
  return Array.from(engineerMap.values());
}

// ============================================================================
// Initial data (hardcoded from CSV for immediate rendering)
// This will be replaced by fetched data once loadData() is called
// ============================================================================

const initialCSVData = `id,title,paper_url,data_url,data_accession,kit,engineer,reviewer,status,count,notes,created_at,submitted_at,done_at
1,Fibroblast orchestration of inflammaging via NF-kB activation,https://pmc.ncbi.nlm.nih.gov/articles/PMC12622043/,https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE286085,GSE286085,xenium,Alex Urrutia,Kenny Workman,qc,,,2026-01-07,2026-01-17,
2,Nephron progenitors rhythmically alternate between renewal and differentiation phases that synchronize with kidney branching morphogenesis,https://pmc.ncbi.nlm.nih.gov/articles/PMC10690271/,https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE315435,GSE315435,xenium,Henk Shang,Kenny Workman,qc,,,2026-01-07,2026-01-17,
3,Flexible nanoelectronics reveal arrhythmogenesis in transplanted human cardiomyocytes,https://www.science.org/doi/10.1126/science.adw4612,https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE289054,GSE289054,curio,Alex Urrutia,Kenny Workman,qc,,first batch,2026-01-14,2026-01-24,
4,Flexible nanoelectronics reveal arrhythmogenesis in transplanted human cardiomyocytes,https://www.science.org/doi/10.1126/science.adw4612,https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE289054,GSE289054,curio,Alex Urrutia,Kenny Workman,qc,,second batch; difficult problems,2026-01-26,2026-01-30,
5,High resolution mapping of the tumor microenvironment using integrated single-cell spatial and in situ analysis,https://pubmed.ncbi.nlm.nih.gov/38114474/,https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE243280,GSE243280,xenium,Zachary Hemminger,Kenny Workman,qc,,,2026-01-26,2026-01-30,
6,The spatial transcriptomic landscape of the healing mouse intestine following damage,https://pubmed.ncbi.nlm.nih.gov/35149721/,https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE169749,GSE169749,visium,Nasim Rahmatpour,Kenny Workman,qc,,,2026-01-26,2026-01-30,
7,High-definition spatial transcriptomic profiling of immune cell populations in colorectal cancer,https://pmc.ncbi.nlm.nih.gov/articles/PMC12165841/,https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE280318,GSE280318,visium,Irene Li,Kenny Workman,qc,,,2026-01-26,2026-01-30,
8,Mapping spatial organization and genetic cell-state regulators to target immune evasion in ovarian cancer,https://www.nature.com/articles/s41590-024-01943-5,https://zenodo.org/records/12613839,12613839,merfish,Soo Hee Lee,Kenny Workman,qc,,,2026-01-26,2026-01-30,
9,High-definition spatial transcriptomic profiling of immune cell populations in colorectal cancer,https://www.nature.com/articles/s41588-025-02193-3,https://www.10xgenomics.com/datasets/ffpe-human-colorectal-cancer-data-with-human-immuno-oncology-profiling-panel-and-custom-add-on-1-standard,,xenium,Reema Baskar,Kenny Workman,qc,,,2026-01-26,2026-01-30,`;

const initialRows = parseCSV(initialCSVData);
const initialProblems = transformToProblems(initialRows);
const initialEngineers = buildEngineers(initialProblems);

// Exported data (will be updated by loadData)
export let problems: Problem[] = initialProblems;
export let engineers: Engineer[] = initialEngineers;

// Calculated stats
export function getStats() {
  const qcProblems = problems.filter(p => p.status === 'qc');
  const acceptedProblems = problems.filter(p => p.status === 'accepted');
  const rejectedProblems = problems.filter(p => p.status === 'rejected');
  const reviewedProblems = [...acceptedProblems, ...rejectedProblems];
  
  const totalReviewed = reviewedProblems.length;
  const acceptanceRate = totalReviewed > 0 
    ? Math.round((acceptedProblems.length / totalReviewed) * 100) 
    : 0;
  
  return {
    qcCount: qcProblems.length,
    acceptedCount: acceptedProblems.length,
    rejectedCount: rejectedProblems.length,
    reviewedCount: totalReviewed,
    acceptanceRate,
    totalContributors: engineers.length,
  };
}

// Async function to fetch and reload data from GitHub CSV
export async function loadData(): Promise<{ problems: Problem[]; engineers: Engineer[] }> {
  try {
    let csvText: string;
    
    // In dev mode with token: fetch directly from GitHub API
    // In production: fetch from Cloudflare R2 (always up to date)
    if (IS_DEV && GITHUB_TOKEN) {
      const fetchOptions: RequestInit = {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.raw+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      };
      
      const response = await fetch(GITHUB_API_URL, fetchOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV from GitHub API: ${response.status}`);
      }
      csvText = await response.text();
      console.log('Loaded data from GitHub (dev mode, authenticated)');
    } else {
      // Production: fetch from Cloudflare R2 (updated by GitHub Action)
      const response = await fetch(`${R2_BASE_URL}/submissions.csv?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV from R2: ${response.status}`);
      }
      csvText = await response.text();
      console.log('Loaded data from Cloudflare R2');
    }
    
    const rows = parseCSV(csvText);
    problems = transformToProblems(rows);
    engineers = buildEngineers(problems);
    
    console.log(`Loaded ${problems.length} problems`);
    return { problems, engineers };
  } catch (error) {
    console.error('Failed to load CSV data:', error);
    // Fall back to hardcoded initial data
    return { problems: initialProblems, engineers: initialEngineers };
  }
}
