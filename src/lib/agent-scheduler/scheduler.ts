// AI Agent Scheduler - Cron-based agent execution

export type AgentType = 
  | 'keyword_research'
  | 'rank_tracker'
  | 'backlink_monitor'
  | 'site_auditor'
  | 'competitor_analyzer'
  | 'content_optimizer'
  | 'report_generator';

export type ScheduleFrequency = 
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'custom';

export interface AgentSchedule {
  id: string;
  name: string;
  agentType: AgentType;
  frequency: ScheduleFrequency;
  cronExpression?: string; // For custom frequency
  timezone: string;
  enabled: boolean;
  config: Record<string, unknown>; // Agent-specific configuration
  projectId: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  nextRunAt?: string;
  runCount: number;
  failureCount: number;
}

export interface AgentRun {
  id: string;
  scheduleId: string;
  agentType: AgentType;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number; // milliseconds
  result?: Record<string, unknown>;
  error?: string;
  logs: string[];
}

// In-memory storage
const schedules: Map<string, AgentSchedule> = new Map();
const runs: Map<string, AgentRun> = new Map();

// Cron expression helpers
const frequencyToCron: Record<ScheduleFrequency, string> = {
  hourly: '0 * * * *',
  daily: '0 9 * * *',
  weekly: '0 9 * * 1',
  monthly: '0 9 1 * *',
  custom: '',
};

// Calculate next run time (simplified)
function calculateNextRun(schedule: AgentSchedule): string {
  const now = new Date();
  let next: Date;
  
  switch (schedule.frequency) {
    case 'hourly':
      next = new Date(now.getTime() + 60 * 60 * 1000);
      next.setMinutes(0, 0, 0);
      break;
    case 'daily':
      next = new Date(now);
      next.setDate(next.getDate() + 1);
      next.setHours(9, 0, 0, 0);
      break;
    case 'weekly':
      next = new Date(now);
      next.setDate(next.getDate() + (7 - next.getDay() + 1) % 7 || 7);
      next.setHours(9, 0, 0, 0);
      break;
    case 'monthly':
      next = new Date(now);
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);
      next.setHours(9, 0, 0, 0);
      break;
    default:
      next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
  
  return next.toISOString();
}

// Create schedule
export function createSchedule(
  config: Omit<AgentSchedule, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'failureCount' | 'nextRunAt'>
): AgentSchedule {
  const schedule: AgentSchedule = {
    ...config,
    id: `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    cronExpression: config.cronExpression || frequencyToCron[config.frequency],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    runCount: 0,
    failureCount: 0,
  };
  
  schedule.nextRunAt = calculateNextRun(schedule);
  
  schedules.set(schedule.id, schedule);
  return schedule;
}

// Get schedule
export function getSchedule(id: string): AgentSchedule | undefined {
  return schedules.get(id);
}

// List schedules
export function listSchedules(organizationId?: string, projectId?: string): AgentSchedule[] {
  let all = Array.from(schedules.values());
  
  if (organizationId) {
    all = all.filter(s => s.organizationId === organizationId);
  }
  
  if (projectId) {
    all = all.filter(s => s.projectId === projectId);
  }
  
  return all;
}

// Update schedule
export function updateSchedule(
  id: string,
  updates: Partial<Omit<AgentSchedule, 'id' | 'createdAt'>>
): AgentSchedule | undefined {
  const schedule = schedules.get(id);
  if (!schedule) return undefined;
  
  Object.assign(schedule, updates, { updatedAt: new Date().toISOString() });
  
  // Recalculate next run if frequency changed
  if (updates.frequency || updates.cronExpression) {
    schedule.nextRunAt = calculateNextRun(schedule);
  }
  
  return schedule;
}

// Delete schedule
export function deleteSchedule(id: string): boolean {
  return schedules.delete(id);
}

// Toggle schedule
export function toggleSchedule(id: string): AgentSchedule | undefined {
  const schedule = schedules.get(id);
  if (!schedule) return undefined;
  
  schedule.enabled = !schedule.enabled;
  schedule.updatedAt = new Date().toISOString();
  
  if (schedule.enabled) {
    schedule.nextRunAt = calculateNextRun(schedule);
  }
  
  return schedule;
}

// Create agent run
export function createRun(scheduleId: string): AgentRun | undefined {
  const schedule = schedules.get(scheduleId);
  if (!schedule) return undefined;
  
  const run: AgentRun = {
    id: `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    scheduleId,
    agentType: schedule.agentType,
    status: 'pending',
    startedAt: new Date().toISOString(),
    logs: [],
  };
  
  runs.set(run.id, run);
  return run;
}

// Update run
export function updateRun(
  id: string,
  updates: Partial<Omit<AgentRun, 'id' | 'scheduleId' | 'agentType' | 'startedAt'>>
): AgentRun | undefined {
  const run = runs.get(id);
  if (!run) return undefined;
  
  Object.assign(run, updates);
  
  // Calculate duration if completed
  if (updates.completedAt && !run.duration) {
    run.duration = new Date(updates.completedAt).getTime() - new Date(run.startedAt).getTime();
  }
  
  return run;
}

// Get run
export function getRun(id: string): AgentRun | undefined {
  return runs.get(id);
}

// List runs
export function listRuns(scheduleId?: string): AgentRun[] {
  const all = Array.from(runs.values());
  if (scheduleId) {
    return all.filter(r => r.scheduleId === scheduleId);
  }
  return all;
}

// Execute agent (simulated)
export async function executeAgent(scheduleId: string): Promise<AgentRun> {
  const schedule = schedules.get(scheduleId);
  if (!schedule) {
    throw new Error('Schedule not found');
  }
  
  const run = createRun(scheduleId);
  if (!run) {
    throw new Error('Failed to create run');
  }
  
  // Update run status
  updateRun(run.id, { status: 'running' });
  run.logs.push(`[${new Date().toISOString()}] Starting ${schedule.agentType} agent`);
  
  try {
    // Simulate agent execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    run.logs.push(`[${new Date().toISOString()}] Processing data...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    run.logs.push(`[${new Date().toISOString()}] Generating results...`);
    
    // Simulate results based on agent type
    const result: Record<string, unknown> = {
      agentType: schedule.agentType,
      itemsProcessed: Math.floor(Math.random() * 100) + 10,
      insights: Math.floor(Math.random() * 20) + 1,
      timestamp: new Date().toISOString(),
    };
    
    updateRun(run.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      result,
    });
    
    run.logs.push(`[${new Date().toISOString()}] Completed successfully`);
    
    // Update schedule
    schedule.lastRunAt = new Date().toISOString();
    schedule.nextRunAt = calculateNextRun(schedule);
    schedule.runCount++;
    
  } catch (error) {
    updateRun(run.id, {
      status: 'failed',
      completedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    run.logs.push(`[${new Date().toISOString()}] Failed: ${error}`);
    schedule.failureCount++;
  }
  
  return run;
}

// Get due schedules
export function getDueSchedules(): AgentSchedule[] {
  const now = new Date();
  return Array.from(schedules.values()).filter(s => {
    if (!s.enabled || !s.nextRunAt) return false;
    return new Date(s.nextRunAt) <= now;
  });
}

// Agent type metadata
export const agentTypeMetadata: Record<AgentType, { name: string; description: string; icon: string }> = {
  keyword_research: {
    name: 'Keyword Research',
    description: 'Discover new keyword opportunities',
    icon: 'Search',
  },
  rank_tracker: {
    name: 'Rank Tracker',
    description: 'Monitor keyword rankings',
    icon: 'TrendingUp',
  },
  backlink_monitor: {
    name: 'Backlink Monitor',
    description: 'Track backlink changes',
    icon: 'Link',
  },
  site_auditor: {
    name: 'Site Auditor',
    description: 'Run technical SEO audits',
    icon: 'FileSearch',
  },
  competitor_analyzer: {
    name: 'Competitor Analyzer',
    description: 'Analyze competitor strategies',
    icon: 'Users',
  },
  content_optimizer: {
    name: 'Content Optimizer',
    description: 'Optimize content for SEO',
    icon: 'FileText',
  },
  report_generator: {
    name: 'Report Generator',
    description: 'Generate automated reports',
    icon: 'FileBarChart',
  },
};

// Initialize demo schedules
export function initializeDemoSchedules(): void {
  createSchedule({
    name: 'Daily Rank Check',
    agentType: 'rank_tracker',
    frequency: 'daily',
    timezone: 'America/New_York',
    enabled: true,
    config: { keywords: ['seo tools', 'keyword research'] },
    projectId: 'project-1',
    organizationId: 'org-1',
    createdBy: 'user-1',
  });
  
  createSchedule({
    name: 'Weekly Backlink Monitor',
    agentType: 'backlink_monitor',
    frequency: 'weekly',
    timezone: 'America/New_York',
    enabled: true,
    config: { domain: 'example.com' },
    projectId: 'project-1',
    organizationId: 'org-1',
    createdBy: 'user-1',
  });
  
  createSchedule({
    name: 'Monthly Site Audit',
    agentType: 'site_auditor',
    frequency: 'monthly',
    timezone: 'America/New_York',
    enabled: false,
    config: { depth: 100 },
    projectId: 'project-1',
    organizationId: 'org-1',
    createdBy: 'user-1',
  });
}

// Initialize demo data
initializeDemoSchedules();
