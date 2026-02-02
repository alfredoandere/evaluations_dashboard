# Bioinformatics Evaluation Dashboard

A real-time dashboard for tracking bioinformatics engineers and their evaluation problem submissions through various pipeline stages.

## Features

- **Engineer Performance Tracking**: View all bioinformatics engineers with their problem counts, acceptance rates, and activity
- **Sortable Table**: Click any column header to sort engineers by that metric
- **Pipeline Visualization**: Funnel chart showing how problems flow through QC stages
- **Real-time Updates**: Dashboard automatically refreshes data every 10 seconds
- **Summary Statistics**: Quick overview cards showing key metrics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5176` (or another port if 5176 is in use).

### Build for Production

```bash
npm run build
```

## Customizing the Dashboard

### Adding/Modifying Pipeline Stages

Edit [src/config/pipeline.config.ts](src/config/pipeline.config.ts):

```typescript
export const pipelineStages: PipelineStage[] = [
  {
    id: 'submitted',
    name: 'Submitted',
    description: 'Problems submitted by engineers',
    color: '#3b82f6', // blue
  },
  // Add more stages here
  {
    id: 'your_stage_id',
    name: 'Your Stage Name',
    description: 'Description of what this stage means',
    color: '#ef4444', // Use any hex color
  },
];
```

The dashboard will automatically adapt to show however many stages you configure.

### Updating Mock Data

Currently uses mock data from [src/data/mockData.ts](src/data/mockData.ts). Replace with real API calls:

```typescript
// In App.tsx, replace:
const [engineers] = useState(mockEngineers);

// With API call:
const [engineers, setEngineers] = useState([]);

useEffect(() => {
  fetch('/api/engineers')
    .then(res => res.json())
    .then(data => setEngineers(data));
}, []);
```

### Adding More Engineers

Edit [src/data/mockData.ts](src/data/mockData.ts) and add to the `mockEngineers` array:

```typescript
export const mockEngineers: BioinformaticsEngineer[] = [
  // ... existing engineers
  {
    id: '21',
    name: 'Dr. New Engineer',
    problemsSolved: 25,
    problemsInProgress: 3,
    lastSubmission: '2026-01-28',
    acceptanceRate: 88
  },
];
```

## Dashboard Components

- **EngineerTable**: Sortable table showing all engineers and their metrics
- **PipelineFunnel**: Visual representation of problems moving through stages
- **Summary Cards**: Key statistics (total engineers, problems solved, in progress, avg acceptance)

## Data Structure

### BioinformaticsEngineer

```typescript
interface BioinformaticsEngineer {
  id: string;
  name: string;
  problemsSolved: number;
  problemsInProgress: number;
  lastSubmission: string;
  acceptanceRate: number; // percentage
}
```

### PipelineStats

```typescript
interface PipelineStats {
  stageId: string;  // Must match an ID from pipeline.config.ts
  count: number;    // Number of problems at this stage
}
```

## Connecting to Real Data

Replace mock data with your backend API:

1. Remove mock data imports from [src/App.tsx](src/App.tsx)
2. Add API calls using `fetch` or `axios`
3. Update state when data is received
4. Consider using React Query or SWR for better data management

Example with automatic updates:

```typescript
useEffect(() => {
  const fetchData = async () => {
    const engineersRes = await fetch('/api/engineers');
    const pipelineRes = await fetch('/api/pipeline-stats');

    setEngineers(await engineersRes.json());
    setPipelineStats(await pipelineRes.json());
  };

  fetchData();
  const interval = setInterval(fetchData, 10000); // Update every 10 seconds

  return () => clearInterval(interval);
}, []);
```

## Scaling to 40-60 Engineers

The dashboard is designed to handle growing teams:

- Table is fully scrollable
- Consider adding pagination when you reach 40+ engineers
- Search/filter functionality can be added to [src/components/EngineerTable.tsx](src/components/EngineerTable.tsx)

Example pagination:

```typescript
const [currentPage, setCurrentPage] = useState(1);
const engineersPerPage = 20;
const indexOfLastEngineer = currentPage * engineersPerPage;
const indexOfFirstEngineer = indexOfLastEngineer - engineersPerPage;
const currentEngineers = sortedEngineers.slice(indexOfFirstEngineer, indexOfLastEngineer);
```

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **No external chart libraries** - pure CSS/SVG visualizations

## Support

For issues or questions, refer to the main project documentation or contact the development team.
