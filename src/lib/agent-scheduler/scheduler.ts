// AI Agent Scheduler - Database-backed agent execution
// Schedules stored in OrgSetting JSON, runs stored in AgentTask model

import { prisma } from '@/lib/db';
import type { Prisma, AgentStatus } from '@/generated/prisma';

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
  cronExpression?: string;
  timezone: string;
  enabled: boolean;
  config: Record<string, unknown>;
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
  duration?: number;
  result?: Record<string, unknown>;
  error?: string;
  logs: string[];
}

const ORG_SCHEDULES_KEY = 'agent_schedules';

const frequencyToCron: Record<ScheduleFrequency, string> = {
  hourly: '0 * * * *',
  daily: '0 9 * * *',
  weekly: '0 9 * * 1',
  monthly: '0 9 1 * *',
  custom: '',
};

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

async function getSchedulesFromDB(organizationId: string): Promise<AgentSchedule[]> {
  try {
    const setting = await prisma.orgSetting.findUnique({
      where: { organizationId_key: { organizationId, key: ORG_SCHEDULES_KEY } },
    });
    if (!setting) return [];
    const value = setting.value as unknown;
    if (Array.isArray(value)) return value as AgentSchedule[];
    return [];
  } catch {
    return [];
  }
}

async function saveSchedulesToDB(organizationId: string, schedules: AgentSchedule[]): Promise<void> {
  await prisma.orgSetting.upsert({
    where: { organizationId_key: { organizationId, key: ORG_SCHEDULES_KEY } },
    create: { organizationId, key: ORG_SCHEDULES_KEY, value: schedules as unknown as Prisma.JsonArray },
    update: { value: schedules as unknown as Prisma.JsonArray },
  });
}

// Create schedule
export async function createSchedule(
  config: Omit<AgentSchedule, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'failureCount' | 'nextRunAt'>
): Promise<AgentSchedule> {
  const schedule: AgentSchedule = {
    ...config,
    id: `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    cronExpression: config.cronExpression || frequencyToCron[config.frequency],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    runCount: 0,
    failureCount: 0,
    nextRunAt: undefined,
  };
  schedule.nextRunAt = calculateNextRun(schedule);

  const existing = await getSchedulesFromDB(config.organizationId);
  existing.push(schedule);
  await saveSchedulesToDB(config.organizationId, existing);
  return schedule;
}

// Get schedule
export async function getSchedule(id: string, organizationId: string): Promise<AgentSchedule | undefined> {
  const all = await getSchedulesFromDB(organizationId);
  return all.find(s => s.id === id);
}

// List schedules
export async function listSchedules(organizationId?: string, projectId?: string): Promise<AgentSchedule[]> {
  if (!organizationId) return [];
  let all = await getSchedulesFromDB(organizationId);
  if (projectId) {
    all = all.filter(s => s.projectId === projectId);
  }
  return all;
}

// Update schedule
export async function updateSchedule(
  id: string,
  organizationId: string,
  updates: Partial<Omit<AgentSchedule, 'id' | 'createdAt'>>
): Promise<AgentSchedule | undefined> {
  const all = await getSchedulesFromDB(organizationId);
  const idx = all.findIndex(s => s.id === id);
  if (idx === -1) return undefined;

  Object.assign(all[idx], updates, { updatedAt: new Date().toISOString() });
  if (updates.frequency || updates.cronExpression) {
    all[idx].nextRunAt = calculateNextRun(all[idx]);
  }
  await saveSchedulesToDB(organizationId, all);
  return all[idx];
}

// Delete schedule
export async function deleteSchedule(id: string, organizationId: string): Promise<boolean> {
  const all = await getSchedulesFromDB(organizationId);
  const filtered = all.filter(s => s.id !== id);
  if (filtered.length === all.length) return false;
  await saveSchedulesToDB(organizationId, filtered);
  return true;
}

// Toggle schedule
export async function toggleSchedule(id: string, organizationId: string): Promise<AgentSchedule | undefined> {
  const all = await getSchedulesFromDB(organizationId);
  const idx = all.findIndex(s => s.id === id);
  if (idx === -1) return undefined;

  all[idx].enabled = !all[idx].enabled;
  all[idx].updatedAt = new Date().toISOString();
  if (all[idx].enabled) {
    all[idx].nextRunAt = calculateNextRun(all[idx]);
  }
  await saveSchedulesToDB(organizationId, all);
  return all[idx];
}

// Create agent run (stored in AgentTask)
export async function createRun(scheduleId: string, organizationId: string, schedule: AgentSchedule): Promise<AgentRun> {
  const task = await prisma.agentTask.create({
    data: {
      organizationId,
      projectId: schedule.projectId || undefined,
      agentName: schedule.agentType,
      action: scheduleId,
      status: 'queued',
      input: { scheduleId, agentType: schedule.agentType, config: schedule.config } as Prisma.JsonObject,
      output: {},
      startedAt: new Date(),
    },
  });

  return {
    id: task.id,
    scheduleId,
    agentType: schedule.agentType as AgentType,
    status: 'pending',
    startedAt: task.startedAt?.toISOString() ?? new Date().toISOString(),
    logs: [],
  };
}

// Update run
export async function updateRun(
  id: string,
  updates: Partial<Omit<AgentRun, 'id' | 'scheduleId' | 'agentType' | 'startedAt'>>
): Promise<void> {
  const statusMap: Record<string, string> = {
    pending: 'queued', running: 'running', completed: 'completed', failed: 'failed', cancelled: 'cancelled',
  };
  await prisma.agentTask.update({
    where: { id },
    data: {
      status: updates.status ? (statusMap[updates.status] as AgentStatus) : undefined,
      output: updates.result as Prisma.JsonObject | undefined,
      errorMessage: updates.error,
      completedAt: updates.completedAt ? new Date(updates.completedAt) : undefined,
      durationMs: updates.duration,
    },
  });
}

// List runs for a schedule
export async function listRuns(scheduleId?: string, organizationId?: string): Promise<AgentRun[]> {
  if (!organizationId) return [];
  const tasks = await prisma.agentTask.findMany({
    where: {
      organizationId,
      ...(scheduleId ? { action: scheduleId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { logs: { orderBy: { createdAt: 'asc' }, take: 20 } },
  });

  return tasks.map(t => {
    const input = t.input as Record<string, unknown>;
    return {
      id: t.id,
      scheduleId: (t.action as string) ?? '',
      agentType: (t.agentName as AgentType) ?? 'site_auditor',
      status: t.status === 'queued' ? 'pending' : t.status === 'running' ? 'running' :
              t.status === 'completed' ? 'completed' : t.status === 'failed' ? 'failed' : 'cancelled',
      startedAt: t.startedAt?.toISOString() ?? t.createdAt.toISOString(),
      completedAt: t.completedAt?.toISOString(),
      duration: t.durationMs ?? undefined,
      result: t.output as Record<string, unknown>,
      error: t.errorMessage ?? undefined,
      logs: t.logs.map(l => `[${l.createdAt.toISOString()}] ${l.message}`),
    } as AgentRun;
  });
}

// Map agent types to LLM SEO actions
const agentTypeToLLMAction: Record<AgentType, { action: string; defaultParams: Record<string, unknown> }> = {
  site_auditor: { action: 'technicalAudit', defaultParams: { issues: ['Missing meta descriptions', 'Slow page load times', 'Broken internal links', 'Missing alt tags', 'Redirect chains'], url: 'https://example.com' } },
  content_optimizer: { action: 'analyzeContent', defaultParams: { content: 'Analyze this website content for SEO optimization opportunities.', targetKeyword: 'SEO optimization' } },
  keyword_research: { action: 'suggestKeywords', defaultParams: { topic: 'SEO tools and strategies', existingKeywords: ['seo tools', 'keyword research', 'backlink analysis'] } },
  competitor_analyzer: { action: 'competitorAnalysis', defaultParams: { competitorUrl: 'https://competitor.com', competitorContent: 'Competitor website content for analysis.', targetKeyword: 'SEO platform' } },
  report_generator: { action: 'analyze', defaultParams: { prompt: 'Generate a comprehensive SEO performance summary covering keyword rankings, traffic trends, backlink health, and technical issues.', context: 'Monthly SEO performance report' } },
  rank_tracker: { action: 'suggestKeywords', defaultParams: { topic: 'keyword ranking monitoring and tracking', existingKeywords: ['rank tracking', 'serp monitoring', 'keyword positions'] } },
  backlink_monitor: { action: 'analyze', defaultParams: { prompt: 'Analyze backlink profile health, identify toxic links, find new linking opportunities.', context: 'Backlink monitoring report' } },
};

// Execute agent with real LLM call
export async function executeAgent(scheduleId: string, organizationId: string): Promise<AgentRun> {
  const schedule = await getSchedule(scheduleId, organizationId);
  if (!schedule) throw new Error('Schedule not found');

  const run = await createRun(scheduleId, organizationId, schedule);
  await updateRun(run.id, { status: 'running' });
  run.logs.push(`[${new Date().toISOString()}] Starting ${schedule.agentType} agent`);

  try {
    const llmMapping = agentTypeToLLMAction[schedule.agentType];
    if (!llmMapping) throw new Error(`No LLM action mapping for agent type: ${schedule.agentType}`);

    const params = { ...llmMapping.defaultParams, ...schedule.config };
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${appUrl}/api/llm/seo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: llmMapping.action, params }),
    });

    let llmResult: string | null = null;
    let llmError: string | null = null;
    if (response.ok) {
      const data = await response.json();
      llmResult = data.result;
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      llmError = errorData.error || `HTTP ${response.status}`;
    }

    const result: Record<string, unknown> = {
      agentType: schedule.agentType,
      action: llmMapping.action,
      timestamp: new Date().toISOString(),
      llmAnalysis: llmResult,
      llmError,
      usedLLM: !!llmResult,
    };

    await updateRun(run.id, { status: 'completed', completedAt: new Date().toISOString(), result });

    // Update schedule stats
    await updateSchedule(scheduleId, organizationId, {
      lastRunAt: new Date().toISOString(),
      nextRunAt: calculateNextRun(schedule),
      runCount: schedule.runCount + 1,
    });

    run.status = 'completed';
    run.result = result;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    await updateRun(run.id, { status: 'failed', completedAt: new Date().toISOString(), error: errMsg });
    await updateSchedule(scheduleId, organizationId, { failureCount: schedule.failureCount + 1 });
    run.status = 'failed';
    run.error = errMsg;
  }

  return run;
}

// Get due schedules for an org
export async function getDueSchedules(organizationId: string): Promise<AgentSchedule[]> {
  const all = await getSchedulesFromDB(organizationId);
  const now = new Date();
  return all.filter(s => s.enabled && s.nextRunAt && new Date(s.nextRunAt) <= now);
}

// Initialize demo schedules into DB for a given org (idempotent)
// Seeds 3 default agent schedules for the first project found in the org
export async function initializeDemoSchedules(organizationId?: string): Promise<void> {
  try {
    // If no org provided, try the seeded dev org first
    const orgId = organizationId || '00000000-0000-0000-0000-000000000001';

    const existing = await getSchedulesFromDB(orgId);
    if (existing.length > 0) return; // Already seeded

    // Find the first project in this org to use as the target
    const firstProject = await prisma.project.findFirst({
      where: { organizationId: orgId, deletedAt: null },
      select: { id: true, createdById: true },
      orderBy: { createdAt: 'asc' },
    });
    if (!firstProject) return; // No projects yet

    // Find org owner/admin for createdBy
    const orgUser = await prisma.user.findFirst({
      where: { organizationId: orgId },
      select: { id: true },
    });
    if (!orgUser) return;

    const createdBy = firstProject.createdById || orgUser.id;
    const projectId = firstProject.id;

    await createSchedule({ name: 'Daily Rank Check', agentType: 'rank_tracker', frequency: 'daily', timezone: 'UTC', enabled: true, config: { keywords: ['seo tools', 'keyword research'] }, projectId, organizationId: orgId, createdBy });
    await createSchedule({ name: 'Weekly Backlink Monitor', agentType: 'backlink_monitor', frequency: 'weekly', timezone: 'UTC', enabled: true, config: { domain: 'example.com' }, projectId, organizationId: orgId, createdBy });
    await createSchedule({ name: 'Monthly Site Audit', agentType: 'site_auditor', frequency: 'monthly', timezone: 'UTC', enabled: false, config: { depth: 100 }, projectId, organizationId: orgId, createdBy });
  } catch {
    // Silently fail - DB might not be available
  }
}

// Agent type metadata
export const agentTypeMetadata: Record<AgentType, { name: string; description: string; icon: string }> = {
  keyword_research: { name: 'Keyword Research', description: 'Discover new keyword opportunities', icon: 'Search' },
  rank_tracker: { name: 'Rank Tracker', description: 'Monitor keyword rankings', icon: 'TrendingUp' },
  backlink_monitor: { name: 'Backlink Monitor', description: 'Track backlink changes', icon: 'Link' },
  site_auditor: { name: 'Site Auditor', description: 'Run technical SEO audits', icon: 'FileSearch' },
  competitor_analyzer: { name: 'Competitor Analyzer', description: 'Analyze competitor strategies', icon: 'Users' },
  content_optimizer: { name: 'Content Optimizer', description: 'Optimize content for SEO', icon: 'FileText' },
  report_generator: { name: 'Report Generator', description: 'Generate automated reports', icon: 'FileBarChart' },
};
