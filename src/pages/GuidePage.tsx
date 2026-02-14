import { useState, useEffect, useRef } from 'react';

// Latch logo SVG component (official logo from Latch Team Library)
const LatchLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 294 397" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M89.4374 51.463L235.988 197.673L87.6103 345.537L51.4482 309.47L163.629 197.638L53.2407 87.5238L89.4374 51.463ZM200.421 51.463L236.624 87.5238L200.387 123.66L164.225 87.593L200.421 51.463ZM200.387 343.715L164.225 307.649L200.421 271.588L236.555 307.649L200.387 343.715ZM126.236 197.64L90.0686 161.579L89.473 162.173L53.9065 197.675L89.4383 233.113L90.0686 233.741L126.236 197.64Z"
      fill="currentColor"
    />
  </svg>
);

// Table of contents data
const tocSections = [
  { id: 'overview', label: 'Overview', page: 1 },
  { id: 'getting-started', label: 'Getting Started', page: 2, children: [
    { id: 'running-harness', label: 'Running Your Problems on the Harness', page: 2 },
    { id: 'data-access', label: 'Data Access', page: 2 },
  ]},
  { id: 'deliverable-breakdown', label: 'Deliverable Breakdown', page: 3, children: [
    { id: 'problems', label: 'Problems', page: 3 },
    { id: 'diagnostics', label: 'Diagnostics', page: 4 },
    { id: 'difficulty', label: 'Difficulty and Time Horizon Expectations', page: 4 },
  ]},
  { id: 'how-we-make-problems', label: 'How We Make Problems', page: 5, children: [
    { id: 'who-makes-them', label: 'Who Makes Them', page: 5 },
    { id: 'how-they-make-them', label: 'How They Make Them', page: 5 },
    { id: 'quality-control', label: 'How We Quality Control Them', page: 6 },
  ]},
  { id: 'problem-documentation', label: 'Problem Documentation', page: 7, children: [
    { id: 'problem-vs-eval', label: '"Problem" vs. "Eval"', page: 7 },
    { id: 'eval-types', label: 'Eval Types', page: 7 },
    { id: 'eval-design-principles', label: 'Eval Design Principles', page: 9 },
    { id: 'design-violations', label: 'Examples of Design Principle Violations', page: 10 },
  ]},
  { id: 'further-reading', label: 'Further Reading', page: 12 },
  { id: 'adapting', label: 'Adapting New Problems to Your Models', page: 12 },
  { id: 'support', label: 'Support', page: 12 },
];

function GuidePage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track active section on scroll
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sections = container.querySelectorAll('[data-section]');
      let current = 'overview';
      
      for (const section of sections) {
        const el = section as HTMLElement;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = el.getAttribute('data-section') || current;
        }
      }
      setActiveSection(current);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      const top = el.offsetTop - 80;
      contentRef.current.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const isActive = (id: string) => activeSection === id;

  return (
    <div className="h-screen w-screen bg-white flex overflow-hidden font-sans">
      {/* Sidebar - Table of Contents */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} shrink-0 border-r border-gray-200 bg-gray-50/50 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <LatchLogo className="w-7 h-7 text-[#1d4ed8]" />
            <div>
              <div className="text-sm font-semibold text-gray-900 tracking-tight">Latch Research</div>
              <div className="text-xs text-gray-500">Spatial Biology Problems</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-4">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3 px-2">Contents</div>
          {tocSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                  isActive(section.id)
                    ? 'text-[#1d4ed8] font-medium bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
              {section.children && (
                <div className="ml-3 border-l border-gray-200 pl-2 my-0.5">
                  {section.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => scrollToSection(child.id)}
                      className={`w-full text-left px-2 py-1 rounded-md text-[13px] transition-colors ${
                        isActive(child.id)
                          ? 'text-[#1d4ed8] font-medium bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-400 font-mono">latch.bio</div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-mono">v1</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-[#1d4ed8] font-medium">10 Problems (Pilot)</span>
          </div>
        </header>

        {/* Scrollable content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            
            {/* ===== HERO / COVER ===== */}
            <div className="mb-20">
              <LatchLogo className="w-10 h-10 text-[#1d4ed8] mb-16" />
              <h1 className="text-5xl font-bold text-[#1d4ed8] leading-[1.15] tracking-tight mb-3">
                Spatial Biology<br />Problems
              </h1>
              <p className="text-xl text-gray-400 font-light">Latch Research</p>
              
              <div className="mt-16 pt-8 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400 w-32 shrink-0">Prepared For</span>
                  <span className="flex-1 border-b border-dotted border-gray-300"></span>
                  <span className="text-sm font-medium text-gray-900">OpenAI</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400 w-32 shrink-0">Version</span>
                  <span className="flex-1 border-b border-dotted border-gray-300"></span>
                  <span className="text-sm font-medium text-gray-900">v1</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400 w-32 shrink-0">Quantity</span>
                  <span className="flex-1 border-b border-dotted border-gray-300"></span>
                  <span className="text-sm font-medium text-gray-900">10 Problems (Pilot)</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 my-16" />

            {/* ===== OVERVIEW ===== */}
            <section id="overview" data-section="overview" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
              
              {/* Stats callout */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                <ul className="space-y-2 text-[15px] text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    10 problems and 514 evals, with 40.6% overall pass rate.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    Diagnostics show 24–54% by task category and 32–49% by kit type.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    Run via latch-eval-tools v0.1.18; data is shared in "OpenAI RL" workspace (id: 39960)
                  </li>
                </ul>
              </div>

              {/* Charts placeholder - two bar charts side by side */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="text-xs font-medium text-gray-500 mb-4 text-center">Accuracy by task (95% CI)</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'spatial_analysis', value: 52.0 },
                      { label: 'normalization', value: 54.0 },
                      { label: 'clustering', value: 52.1 },
                      { label: 'qc', value: 46.0 },
                      { label: 'dim_reduction', value: 40.0 },
                      { label: 'cell_typing', value: 32.9 },
                      { label: 'diff_expression', value: 24.7 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 w-28 text-right font-mono truncate">{item.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full bg-[#1d4ed8] rounded-full transition-all duration-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-gray-600 w-10 text-right">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="text-xs font-medium text-gray-500 mb-4 text-center">Accuracy by kit (95% CI)</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'merfish', value: 49.1 },
                      { label: 'xenium', value: 41.3 },
                      { label: 'seeker', value: 32.1 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 w-28 text-right font-mono truncate">{item.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full bg-[#1d4ed8] rounded-full transition-all duration-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-gray-600 w-10 text-right">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[15px] text-gray-700 leading-relaxed mb-6">
                This is a holistic research package to help your models understand biological data. We wish to
                go beyond delivering problems and align ourselves with end model performance by:
              </p>
              <ul className="space-y-2 text-[15px] text-gray-700 ml-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  Opening communication channels with biology engineers who created specific evals
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  Transparently documenting our methods so you understand every step of the process
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  Providing material to aid scientific interpretation of results
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  Adjusting successive problem deliveries based on weak areas task/kit categories
                </li>
              </ul>
            </section>

            <hr className="border-gray-200 my-12" />

            {/* ===== GETTING STARTED ===== */}
            <section id="getting-started" data-section="getting-started" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Getting Started</h2>

              <div id="running-harness" data-section="running-harness" className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Running Your Problems on the Harness</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  The{' '}
                  <a href="https://github.com/latchbio/latch-eval-tools" className="text-[#1d4ed8] underline decoration-[#1d4ed8]/30 hover:decoration-[#1d4ed8] transition-colors">
                    latch-eval-tools
                  </a>{' '}
                  repository contains public tools to both run and grade evals. The{' '}
                  <a href="https://github.com/latchbio/latch-eval-tools#readme" className="text-[#1d4ed8] underline decoration-[#1d4ed8]/30 hover:decoration-[#1d4ed8] transition-colors">
                    README
                  </a>{' '}
                  contains examples and descriptions of the functionality. Tests for this deliverable were
                  performed with version 0.1.18.
                </p>
              </div>

              <div id="data-access" data-section="data-access">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Data Access</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  The files referenced by evals are shared with the "OpenAI RL" Latch workspace (id: 39960). This
                  is the workspace OpenAI has been using so far. When running eval harnesses via latch-eval-tools
                  or to download data using the Latch CLI{' '}
                  <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">cp</code>{' '}
                  command, the Latch CLI should be authenticated with an account which has access to this workspace.
                  This can be achieved by either running "latch login" on a computer with a browser, or by navigating
                  to the{' '}
                  <a href="https://latch.bio" className="text-[#1d4ed8] underline decoration-[#1d4ed8]/30 hover:decoration-[#1d4ed8] transition-colors">
                    latch developer settings
                  </a>{' '}
                  and copying the Workspace API Token for the "OpenAI RL" Latch workspace, or the User API Token
                  for a user account, to{' '}
                  <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">~/.latch/token</code>.
                  The latter method is useful on a machine without a browser.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  If you would like us to share the data with another workspace, let us know and we will provide access.
                </p>
              </div>
            </section>

            <hr className="border-gray-200 my-12" />

            {/* ===== DELIVERABLE BREAKDOWN ===== */}
            <section id="deliverable-breakdown" data-section="deliverable-breakdown" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Deliverable Breakdown</h2>

              <div id="problems" data-section="problems" className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Problems</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  The following eval counts are for "short" time horizon evals. We included one "long" time horizon
                  per problem not included in this count (see "Difficulty and Time Horizon Expectations"):
                </p>
                <ul className="space-y-3 text-[15px] text-gray-700">
                  {[
                    { id: 'GSE210077.1', count: 54, desc: 'Human liver MERFISH data studying hepatic lobule organization, cell typing, and spatial analysis across healthy and diseased conditions' },
                    { id: 'GSE210077.2', count: 53, desc: 'Human liver MERFISH data focused on fibrotic hepatocyte subtypes, label transfer methods, and cross-condition comparisons in diseased tissue' },
                    { id: 'GSE286085.1', count: 61, desc: 'Mouse lung Xenium data covering rare cell detection, BALT identification, spatial statistics, and airway cell type contamination analysis' },
                    { id: 'GSE289054.1', count: 43, desc: 'Human iPSC-CM xenograft Seeker data assessing sarcomere maturation, species mixing, batch effects, and graft-host interface characterization' },
                    { id: 'GSE289054.2', count: 44, desc: 'Human iPSC-CM xenograft Xenium data evaluating cell type annotation, species purity, cardiomyocyte maturation gradients, and treatment effects' },
                    { id: 'GSE294965.1', count: 55, desc: 'Human kidney biopsy Xenium data testing clustering, QC filtering, PCA variance, and glomerular spatial domain identification across disease conditions' },
                    { id: 'GSE294965.2', count: 62, desc: 'Human kidney biopsy Xenium data focused on cell type proportion assessment, podocyte loss, immune infiltration, and spatial niche analysis in ANCA/SLE disease' },
                    { id: 'GSE308969.1', count: 41, desc: 'Mouse liver Xenium multi-sample data testing batch correction, cross-sample clustering, liver zonation annotation, and spatial biliary architecture' },
                    { id: 'GSE308969.2', count: 43, desc: 'Mouse liver Xenium data evaluating clustering optimization, Kupffer cell annotation, hepatic zonation coordinates, and within-zone differential expression' },
                    { id: 'GSE315435.1', count: 52, desc: 'Mouse kidney Xenium nephrogenic niche data testing QC filtering, dimensionality reduction, clustering proportions, and differential expression' },
                  ].map((problem) => (
                    <li key={problem.id} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                      <span>
                        <strong className="font-semibold text-gray-900">{problem.id} ({problem.count}):</strong>{' '}
                        {problem.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="diagnostics" data-section="diagnostics" className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Diagnostics</h3>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-4">
                  <ul className="space-y-2 text-[15px] text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                      GPT-5.2 achieves an overall accuracy of 40.6% (95% CI: 36.4–44.9) across 512 evals
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                      Best-performing tasks: normalization (54.0%), clustering (52.1%), spatial analysis (52.0%)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                      Worst-performing tasks: differential expression (24.7%), cell typing (32.9%)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                      Performance varies by platform: MERFISH (49.1%) &gt; Xenium (41.3%) &gt; Seeker (32.1%)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                      Total cost: $54.13 across all evals (~$0.11/eval), averaging 5.7 steps and ~2 min per eval
                    </li>
                  </ul>
                </div>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  Confidence intervals are computed using the same procedure described in SpatialBench/scBench
                  adapting these recommendations.
                </p>
              </div>

              <div id="difficulty" data-section="difficulty">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Difficulty and Time Horizon Expectations</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  We curated evals with time horizons and difficulty levels we hypothesize would have the largest
                  impact on training based on our benchmarks of GPT-5.2. These include "small" time horizon
                  evals that tile the true end-to-end workflows, like normalization and QC, using snapshotted data
                  to recreate the intermediate steps that build up towards true biological goals.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  These "small" time horizon evals have dense and specific information at the exact points where
                  current models are weak. Some are easier to learn than others, but task difficulty is not a great
                  predictor of its utility in practice, eg. improving on some QC tasks amounts to just learning
                  thresholds for a specific context but failing to do so will invalidate all downstream steps.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  We don't yet believe your models are ready for the "long" time horizon evals alone: the signal at
                  the end of a multi-step workflow is too sparse when the answer lies at the end of multiple
                  chained steps, allowing errors to compound with little feedback. We have included examples of
                  these "long" time horizon problems in each problem to give you a sample of what is to come,
                  and allow you to convince yourself empirically this is the case. Our goal is to ramp your models
                  to the point where "long" time horizon problems are standard.
                </p>
              </div>
            </section>

            <hr className="border-gray-200 my-12" />

            {/* ===== HOW WE MAKE PROBLEMS ===== */}
            <section id="how-we-make-problems" data-section="how-we-make-problems" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How We Make Problems</h2>

              <div id="who-makes-them" data-section="who-makes-them" className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Who Makes Them</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  Scientists with 5+ years (mean ~10) of hands-on experience with spatial data (1+ of Xenium,
                  Visium, MERFISH, DBiT-seq, Slide-seq, CosMx, Stereo-seq, CODEX, Molecular Cartography)
                  selected through a rigorous hiring process with ~5% pass rate.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  We train these scientists with a month-long curriculum that includes exposure to good/bad
                  examples across major task categories, intimate working sessions with engineers and tools
                  training. Productivity is slowly ramped with careful review to a reliable steady state at which
                  point the scientist becomes a "biology engineer" at Latch. Unlike other human data teams, our
                  engineers are given equity and integrated into the team to compound their abilities for future
                  projects. Excitingly, this means they will be around to answer questions about the problems they
                  make (eg. clarify scientific motivation) and you can spin up Slack threads for exactly this (see
                  "Support").
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  Scientific correctness and depth - described to them as "how faithfully can you capture exactly
                  what you think about when you work with this data into a machine readable problem" - is the
                  priority throughout the process. This is deeply embedded into the culture of the team and
                  emphasized repeatedly throughout the ramp process.
                </p>
              </div>

              <div id="how-they-make-them" data-section="how-they-make-them" className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How They Make Them</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">Each engineer:</p>
                <ul className="space-y-3 text-[15px] text-gray-700 ml-1">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    Receives problem assignment, matched with disease/tissue/kit expertise when possible
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    <span>
                      Decomposes analysis workflow into task chunks.
                      Uses Latch Agent to improve analysis speed and accuracy, eg. translating specific tasks
                      to code/plots (but never to guide scientific direction)
                    </span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0"></span>
                    Latch Agent has access to curriculum, grader documentation and banks of existing
                    problems to help eg. suggest design patterns and format problems accurately
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    Iterates with QC tools (described below) and Latch data infrastructure until problems reach
                    satisfactory quality
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    Submits to a human reviewer. Iterate on comments over GitHub and 1:1 sessions until quality appropriate
                  </li>
                </ul>
              </div>

              <div id="quality-control" data-section="quality-control">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How We Quality Control Them</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  Problems go through three forms of QC:
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-1">Static Analysis</h4>
                    <p className="text-[15px] text-gray-700 leading-relaxed">
                      Linters ensure consistent JSON structure and terms adhere to controlled vocabularies.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-1">LLM Judge</h4>
                    <p className="text-[15px] text-gray-700 leading-relaxed">
                      Problems are run to completion on harnesses to produce trajectories and
                      produce statistics (pass rate, cost, time). Judge models, iteratively improved with human
                      labels on eg. false positives, grade problems on the design principles outlined below. Judges
                      use a combination of problem structure and empirical agent behavior on trajectories to
                      identify issues impossible to catch with static analysis. Judges also use identical portions of
                      the curriculum used to train scientists in their system prompts.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-1">Human Review</h4>
                    <p className="text-[15px] text-gray-700 leading-relaxed">
                      Managers inspect evals, trajectories and judge reports manually.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-200 my-12" />

            {/* ===== PROBLEM DOCUMENTATION ===== */}
            <section id="problem-documentation" data-section="problem-documentation" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Problem Documentation</h2>

              <div id="problem-vs-eval" data-section="problem-vs-eval" className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">"Problem" vs. "Eval"</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  A problem is a set of evals that share a starting dataset and common biological objective. You
                  will find 50 evals per problem on average.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  You might find several problems that all use the same dataset (always with distinct eval sets).
                  We encourage our engineers to continue making problem packs for the same dataset if they
                  want to go deeper and make more difficult evals.
                </p>
              </div>

              <div id="eval-types" data-section="eval-types" className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Eval Types</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  We've identified three 'classes' of behavior scientists use in real data analysis and constructed
                  different eval types to represent them.
                </p>
                
                {/* Three eval type cards */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                    <span className="text-sm font-semibold text-[#1d4ed8]">Scientific</span>
                    <p className="text-[14px] text-gray-700 mt-1">
                      Student must both choose a procedure and reason scientifically to accomplish a task. Procedure unspecified.
                    </p>
                  </div>
                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                    <span className="text-sm font-semibold text-[#1d4ed8]">Procedural</span>
                    <p className="text-[14px] text-gray-700 mt-1">
                      Student must use a known procedure correctly to accomplish a task.
                    </p>
                  </div>
                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                    <span className="text-sm font-semibold text-[#1d4ed8]">Observational</span>
                    <p className="text-[14px] text-gray-700 mt-1">
                      Student exposed to an observation (ideally general method for generating observations) useful for future decisions. Reduced durability and anti-shortcut requirements.
                    </p>
                  </div>
                </div>

                <p className="text-[15px] text-gray-700 leading-relaxed mb-4 italic bg-gray-50 rounded-lg p-4 border-l-4 border-[#1d4ed8]/30">
                  "A scientist often makes several observations <span className="font-medium">(observational)</span> about their data, before
                  correctly using different methods in eg. statistics or high dimensional data analysis <span className="font-medium">(procedural)</span>{' '}
                  to finally answer a biological question <span className="font-medium">(scientific)</span>."
                </p>

                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  Scientific evals are the most realistic category of task: "can a student draw a scientific
                  conclusion using all possible tools and knowledge available". However, just as scientists must
                  build mechanical skill with different methods and acquire a 'bank' of useful observations to
                  become an expert, we believe models must do the same.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  We balance the difficult, but somewhat sparse, scientific evals with plenty of observational and
                  procedural ones. Over time, we intend to increase the proportion of scientific evals as your
                  models learn the important constituent skills.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-8">
                  Eval type also allows us to be more precise with problem properties, especially 'durability'
                  (covered in the next section). A challenging design problem for evals in this domain is
                  constructing problems that are both verifiable while also flexible enough to capture multiple
                  correct scientific approaches. We relax 'durability' with scientific evals and restrict it with
                  procedural evals, reflecting the student's ability to choose multiple valid methods or stick to a
                  single one.
                </p>

                {/* Examples */}
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  Often easiest to understand with some examples:
                </p>

                <div className="mb-6">
                  <h4 className="text-base font-bold text-gray-900 mb-2">Scientific Eval Example</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                    The following eval tests a common scientific goal with xenograft (mixed species models, often
                    mouse/rat implanted with human tissue) data. Can the student compute graft quality statistics
                    without being told how to do so?
                  </p>
                  <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm text-gray-700 leading-relaxed border border-gray-200">
                    <p className="mb-3">
                      Assess graft integration quality by calculating the average fraction of Human
                      neighbors for Rat beads. Use spatial neighbor graph (typically 6 to 10 nearest
                      neighbors).
                    </p>
                    <p className="mb-3">
                      Low fraction indicates grafts form localized patches rather than dispersing throughout
                      host tissue.
                    </p>
                    <p className="mb-1">Return EXACTLY:</p>
                    <p className="text-gray-500">&lt;EVAL_ANSWER&gt;</p>
                    <p>{`{"rat_human_neighbor_fraction": <value>}`}</p>
                    <p className="text-gray-500">&lt;/EVAL_ANSWER&gt;</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-base font-bold text-gray-900 mb-2">Procedural Eval Example</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                    The following eval instructs the student how to do cell-typing and restricts grading tolerance to
                    the smaller set of analysis paths.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm text-gray-700 leading-relaxed border border-gray-200">
                    <p className="mb-3">
                      Using the QC-filtered Xenium kidney biopsy dataset, compute the percentage of
                      podocytes among all cells within the glomerular spatial domain in control (healthy)
                      samples.
                    </p>
                    <p className="mb-3">
                      Load the AnnData object, subset to control samples and glomerular cells, then compute
                      the proportion of cells annotated as POD.
                    </p>
                    <p className="mb-1">Return EXACTLY:</p>
                    <p className="text-gray-500">&lt;EVAL_ANSWER&gt;</p>
                    <p>{`{"podocyte_pct_control": <value>}`}</p>
                    <p className="text-gray-500">&lt;/EVAL_ANSWER&gt;</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-base font-bold text-gray-900 mb-2">Observational Eval Example</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                    The following teaches the student to look for a Xenium specific QC pattern experts often use.
                    Notice the expert does not need to act on this observation, but knowing about it informs
                    downstream decisions.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-5 font-mono text-sm text-gray-700 leading-relaxed border border-gray-200">
                    <p className="mb-3">
                      Analyze the spatial pattern of negative control probe signal across FOVs to identify
                      potential quality issues.
                    </p>
                    <p className="mb-3">
                      Compute per-FOV negative control probe metrics (e.g., mean/median negative probe
                      fraction per cell within each FOV) and assess the spatial pattern.
                    </p>
                    <p className="mb-3">Which statement BEST describes the pattern?</p>
                    <p>A) Uniform across all FOVs - indicates good, consistent background</p>
                    <p>B) Clustered in specific FOVs - suggests localized technical issues</p>
                    <p>C) Random high-variance pattern - indicates unstable measurements</p>
                    <p className="mb-3">D) Correlates with cell density - suggests counting artifacts</p>
                    <p className="mb-1">Return EXACTLY:</p>
                    <p className="text-gray-500">&lt;EVAL_ANSWER&gt;</p>
                    <p>{`{"answer": "<letter>"}`}</p>
                    <p className="text-gray-500">&lt;/EVAL_ANSWER&gt;</p>
                  </div>
                </div>
              </div>

              <div id="eval-design-principles" data-section="eval-design-principles" className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Eval Design Principles</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  We've identified eval properties unique to this domain that tease out useful model behavior
                </p>
                <ul className="space-y-2 text-[15px] text-gray-700 ml-1">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    <span><strong className="font-semibold text-gray-900">Verifiability.</strong> The answer must be gradable with a deterministic Python function</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    <span><strong className="font-semibold text-gray-900">Durability.</strong> Our grader tolerances must be robust to the set of valid scientific approaches to this task.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                    <span><strong className="font-semibold text-gray-900">Anti-shortcut.</strong> The task must be impossible to answer with existing "textbook" knowledge and requires interaction with the dataset.</span>
                  </li>
                </ul>
              </div>

              <div id="design-violations" data-section="design-violations">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Examples of Design Principle Violations</h3>

                <div className="mb-6">
                  <h4 className="text-base font-bold text-gray-900 mb-2">Anti-Shortcut Violation</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                    The following task uses canonical marker genes that a model can accurately guess using the
                    pretrained knowledge. In practice, a LLM Judge will easily catch by inspecting a trajectory (low
                    N turns with no/little code) or just grading the eval against our rubric:
                  </p>
                  <div className="bg-red-50 rounded-lg p-5 font-mono text-sm text-gray-700 leading-relaxed border border-red-200">
                    <p className="mb-3">What are canonical marker genes for proximal tubule cells in the kidney?</p>
                    <p>A) Slc34a1, Lrp2, Aqp1</p>
                    <p>B) Umod, Slc12a1, Aqp2</p>
                    <p>C) Nphs2, Wt1, Podxl</p>
                    <p className="mb-3">D) Pecam1, Cdh5, Kdr</p>
                    <p>{`Return JSON: {"answer": "<letter>"}`}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-base font-bold text-gray-900 mb-2">Durability Violation</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                    Durability violations are generally the most difficult to recognize and fix. Solutions require
                    answers that are invariant across sets of answers and often involve reframing the solution in
                    terms of some biological structure rather than a numerical answer.
                  </p>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                    Grading tasks on the distance between UMAP coordinates is a good example. The following
                    task is brittle to alternative embedding structures:
                  </p>
                  <div className="bg-red-50 rounded-lg p-5 font-mono text-sm text-gray-700 leading-relaxed border border-red-200">
                    <p className="mb-3">
                      Using the cell type annotations and UMAP embedding, compute the Euclidean distance in
                      UMAP space between the centroid of all Hepatocyte_Zone3 cells and the centroid of all
                      Biliary cells. Report the distance.
                    </p>
                    <p className="mb-1">Return EXACTLY:</p>
                    <p className="text-gray-500">&lt;EVAL_ANSWER&gt;</p>
                    <p>{`{"centroid_distance": <float rounded to 2 decimal places>}`}</p>
                    <p className="text-gray-500">&lt;/EVAL_ANSWER&gt;</p>
                  </div>
                  <p className="text-[15px] text-gray-700 leading-relaxed mt-3">
                    A "good" eval would grade the task on relative structure, like the ratio of cell counts of specific
                    cell types between clusters.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-base font-bold text-gray-900 mb-2">Verifiability Violation</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                    The following asks for a subjective answer and is a clear verifiability violation.
                  </p>
                  <div className="bg-red-50 rounded-lg p-5 font-mono text-sm text-gray-700 leading-relaxed border border-red-200 mb-3">
                    <p>
                      Explore the Xenium kidney dataset and identify interesting genes that show spatial
                      patterns. Report your most significant findings.
                    </p>
                  </div>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
                    The next example is a bit more interesting. Asking for a naive percentage is a common failure
                    mode because the return format is ambiguous (e.g. is the answer a float or integer, how many
                    sig figs):
                  </p>
                  <div className="bg-red-50 rounded-lg p-5 font-mono text-sm text-gray-700 leading-relaxed border border-red-200">
                    <p className="mb-3">
                      The data includes cells from multiple conditions. Assign each cell a cell type by
                      computing a score for each major liver cell type using appropriate marker gene sets,
                      then assigning each cell to the type with the highest mean expression score.
                    </p>
                    <p className="mb-3">
                      Filter to healthy cells only. What proportion of healthy cells are hepatocytes? Report
                      the result as a percentage.
                    </p>
                    <p className="mb-1">Return EXACTLY:</p>
                    <p className="text-gray-500">&lt;EVAL_ANSWER&gt;</p>
                    <p>{`{"hep_pct": <float>}`}</p>
                    <p className="text-gray-500">&lt;/EVAL_ANSWER&gt;</p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-200 my-12" />

            {/* ===== FURTHER READING ===== */}
            <section id="further-reading" data-section="further-reading" className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Further Reading</h2>
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Our public benchmarks, SpatialBench and scBench, contain more development of problem
                construction and design principles (especially in the methods and supplements). Result section
                2.6 "Agent Trajectories Reveal Distinct Behavioral Patterns" contains useful behavior and failure
                modes to look for in your trajectories.
              </p>
            </section>

            {/* ===== ADAPTING ===== */}
            <section id="adapting" data-section="adapting" className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Adapting New Problems to Your Models</h2>
              <p className="text-[15px] text-gray-700 leading-relaxed">
                Your next problems will be curated from performance on previous problems. We balance new
                submissions across the task types - eg. kit type, task type, tissue/disease areas - that need
                greater attention. We will work with you on the best way to share the information we need for
                this, depending on interest.
              </p>
            </section>

            {/* ===== SUPPORT ===== */}
            <section id="support" data-section="support" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Support</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">I have a question about an eval/problem</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    Ping <strong>@Kenny Workman</strong> or <strong>@Hannah Le</strong> in Slack with the full eval id
                    (the <code className="text-sm bg-white px-1.5 py-0.5 rounded font-mono text-gray-800 border border-gray-200">id</code> field in the JSON).
                    We will loop in the biology engineer who produced the problem to answer eg. conceptual
                    questions or clarify potential issues.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">I have a question about tools (grader, harness)</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    Ping <strong>@Aidan Abdulali</strong> in Slack.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">General issues</h4>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    Send a message anytime in the main channel. We have on-call engineers <strong>@dev-on-call</strong> 24-7.
                    Most of us are generally online otherwise and will get back to you rapidly. We prioritize and take
                    pride in our customer support.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 pt-8 pb-16 flex items-center justify-between">
              <LatchLogo className="w-6 h-6 text-[#1d4ed8]" />
              <span className="text-sm text-[#1d4ed8] font-medium">latch.bio</span>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidePage;
