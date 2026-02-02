# Bioinformatics Engineering Evaluation Dashboard

## Overview

A high-performance, dark-mode dashboard for tracking the productivity and quality of bioinformatics engineering evaluations. This tool is designed to monitor the creation, quality control, and finalization of evaluation problems ("evals") created by a team of bioinformatics engineers.

## Design Philosophy

The design is inspired by high-density "benchmark" dashboards and tools like Linear/Superhuman/Retool. Key features:
- **Dark Mode Aesthetic**: Deep backgrounds (`#09090b`) with high-contrast text.
- **Data Density**: Compact tables and visualizations to fit maximum information on a single screen.
- **Monospace Typography**: JetBrains Mono / System Mono for all data points to emphasize precision.
- **Status Visibility**: Clear indicators for "Submitted", "QC", and "Finished" states.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (custom config for colors and fonts)
- **Language**: TypeScript

## Key Components

### 1. Engineer Performance Table
Located in `src/components/EngineerTable.tsx`.
- Lists all active engineers.
- Columns: Name, Problems Solved, WIP (Work In Progress), Acceptance Rate (with visual bar), Last Active Date.
- Sortable columns.

### 2. Pipeline Visualization
Located in `src/components/PipelineFunnel.tsx`.
- Visualizes the flow of problems through the system stages (Submitted -> QC Review -> QC Approved -> Finished).
- Uses a vertical bar chart style to compare volume at each stage.

## Configuration

- **Pipeline Stages**: Edit `src/config/pipeline.config.ts` to add or modify workflow stages.
- **Colors & Theme**: Edit `tailwind.config.js` to adjust the color palette.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```

## Note on Data

Currently uses mock data in `src/data/mockData.ts`. The application includes a simulation loop in `App.tsx` that updates these stats every 10 seconds to demonstrate real-time capabilities.
