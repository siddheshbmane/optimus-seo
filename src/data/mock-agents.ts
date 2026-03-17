export type AgentStatus = "idle" | "running" | "completed" | "failed" | "blocked";

export interface Agent {
  id: string;
  name: string;
  description: string;
  phase: "sales" | "strategy" | "execution" | "reports";
  status: AgentStatus;
  progress?: number;
  eta?: string;
  lastRun?: string;
  result?: {
    summary: string;
    metrics?: Record<string, number | string>;
  };
  dependencies?: string[];
  estimatedTime: string;
  estimatedCost: string;
}

export interface AgentActivity {
  id: string;
  agentId: string;
  agentName: string;
  projectId: string;
  projectName: string;
  status: AgentStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  message: string;
}

export const mockAgents: Agent[] = [
  // Sales Phase
  {
    id: "site-audit",
    name: "Site Audit",
    description: "Crawl and analyze website for technical SEO issues",
    phase: "sales",
    status: "completed",
    lastRun: "2026-03-15T10:30:00Z",
    result: {
      summary: "Found 23 critical issues, 45 warnings",
      metrics: {
        healthScore: 72,
        pagesScanned: 234,
        criticalIssues: 23,
        warnings: 45,
      },
    },
    estimatedTime: "5-10 min",
    estimatedCost: "$0.50",
  },
  {
    id: "keyword-overview",
    name: "Keyword Research (Overview)",
    description: "Analyze current keyword rankings and opportunities",
    phase: "sales",
    status: "completed",
    lastRun: "2026-03-15T10:45:00Z",
    result: {
      summary: "847 keywords analyzed, 12 clusters identified",
      metrics: {
        totalKeywords: 847,
        top10: 45,
        top30: 156,
        opportunities: 89,
      },
    },
    estimatedTime: "3-5 min",
    estimatedCost: "$0.30",
  },
  {
    id: "competitor-overview",
    name: "Competitor Analysis (Overview)",
    description: "Compare with top 5 competitors",
    phase: "sales",
    status: "running",
    progress: 65,
    eta: "2 min",
    estimatedTime: "5-8 min",
    estimatedCost: "$0.45",
  },
  {
    id: "ppc-intelligence",
    name: "PPC Intelligence",
    description: "Analyze paid search landscape and opportunities",
    phase: "sales",
    status: "idle",
    estimatedTime: "3-5 min",
    estimatedCost: "$0.25",
  },
  {
    id: "ai-visibility",
    name: "AI Visibility Check",
    description: "Check brand presence in AI/LLM responses",
    phase: "sales",
    status: "idle",
    estimatedTime: "2-3 min",
    estimatedCost: "$0.20",
  },
  {
    id: "pitch-deck",
    name: "Pitch Deck Generator",
    description: "Generate client-ready pitch deck from audit data",
    phase: "sales",
    status: "blocked",
    dependencies: ["site-audit", "keyword-overview", "competitor-overview"],
    estimatedTime: "1-2 min",
    estimatedCost: "$0.15",
  },

  // Strategy Phase
  {
    id: "keyword-extensive",
    name: "Extensive Keyword Research",
    description: "Deep-dive keyword analysis with clustering",
    phase: "strategy",
    status: "idle",
    dependencies: ["keyword-overview"],
    estimatedTime: "10-15 min",
    estimatedCost: "$1.20",
  },
  {
    id: "site-structure",
    name: "Site Structure Analysis",
    description: "Analyze and recommend site architecture",
    phase: "strategy",
    status: "idle",
    dependencies: ["site-audit"],
    estimatedTime: "8-12 min",
    estimatedCost: "$0.80",
  },
  {
    id: "content-briefs",
    name: "Content Brief Generator",
    description: "Generate SEO-optimized content briefs",
    phase: "strategy",
    status: "idle",
    dependencies: ["keyword-extensive", "site-structure"],
    estimatedTime: "5-8 min per brief",
    estimatedCost: "$0.40 per brief",
  },
  {
    id: "link-strategy",
    name: "Link Building Strategy",
    description: "Define link building targets and approach",
    phase: "strategy",
    status: "idle",
    dependencies: ["competitor-overview"],
    estimatedTime: "5-8 min",
    estimatedCost: "$0.50",
  },

  // Execution Phase
  {
    id: "content-creation",
    name: "Content Creation Agent",
    description: "Generate SEO-optimized content from briefs",
    phase: "execution",
    status: "idle",
    dependencies: ["content-briefs"],
    estimatedTime: "10-20 min per article",
    estimatedCost: "$0.80 per article",
  },
  {
    id: "backlink-prospecting",
    name: "Backlink Prospecting",
    description: "Find and qualify link building opportunities",
    phase: "execution",
    status: "idle",
    dependencies: ["link-strategy"],
    estimatedTime: "15-20 min",
    estimatedCost: "$0.60",
  },
  {
    id: "backlink-submission",
    name: "Backlink Submission",
    description: "Submit to directories and link targets",
    phase: "execution",
    status: "idle",
    dependencies: ["backlink-prospecting"],
    estimatedTime: "Ongoing",
    estimatedCost: "$0.05 per submission",
  },

  // Reports Phase
  {
    id: "rank-tracking",
    name: "Rank Tracking",
    description: "Track keyword rankings over time",
    phase: "reports",
    status: "completed",
    lastRun: "2026-03-15T06:00:00Z",
    result: {
      summary: "Daily tracking active for 847 keywords",
      metrics: {
        improved: 45,
        declined: 12,
        unchanged: 790,
      },
    },
    estimatedTime: "Auto (daily)",
    estimatedCost: "$0.10/day",
  },
  {
    id: "client-report",
    name: "Client Report Generator",
    description: "Generate monthly client reports",
    phase: "reports",
    status: "idle",
    estimatedTime: "2-3 min",
    estimatedCost: "$0.20",
  },
];

export const mockAgentActivity: AgentActivity[] = [
  {
    id: "act-1",
    agentId: "competitor-overview",
    agentName: "Competitor Analysis",
    projectId: "acme-corp",
    projectName: "Acme Corp",
    status: "running",
    progress: 65,
    startedAt: "2026-03-15T14:28:00Z",
    message: "Analyzing backlink profiles for competitor 3 of 5...",
  },
  {
    id: "act-2",
    agentId: "content-creation",
    agentName: "Content Creation",
    projectId: "techstart-inc",
    projectName: "TechStart Inc",
    status: "running",
    progress: 40,
    startedAt: "2026-03-15T14:15:00Z",
    message: "Writing article: 'Complete Guide to SaaS Marketing'",
  },
  {
    id: "act-3",
    agentId: "site-audit",
    agentName: "Site Audit",
    projectId: "acme-corp",
    projectName: "Acme Corp",
    status: "completed",
    progress: 100,
    startedAt: "2026-03-15T10:25:00Z",
    completedAt: "2026-03-15T10:32:00Z",
    message: "Completed: 234 pages scanned, 72/100 health score",
  },
  {
    id: "act-4",
    agentId: "keyword-overview",
    agentName: "Keyword Research",
    projectId: "acme-corp",
    projectName: "Acme Corp",
    status: "completed",
    progress: 100,
    startedAt: "2026-03-15T10:40:00Z",
    completedAt: "2026-03-15T10:45:00Z",
    message: "Completed: 847 keywords analyzed, 12 clusters identified",
  },
  {
    id: "act-5",
    agentId: "backlink-submission",
    agentName: "Backlink Submission",
    projectId: "fitness-pro",
    projectName: "FitnessPro Academy",
    status: "running",
    progress: 78,
    startedAt: "2026-03-15T12:00:00Z",
    message: "Submitted 39 of 50 directory listings",
  },
];

export function getAgentsByPhase(phase: Agent["phase"]): Agent[] {
  return mockAgents.filter((a) => a.phase === phase);
}

export function getAgentById(id: string): Agent | undefined {
  return mockAgents.find((a) => a.id === id);
}
