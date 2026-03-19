// Report Scheduler
// Manages scheduled report generation and delivery

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ReportFormat = 'pdf' | 'csv' | 'html' | 'json';
export type ReportType = 
  | 'seo-overview'
  | 'keyword-rankings'
  | 'backlink-analysis'
  | 'competitor-comparison'
  | 'technical-audit'
  | 'ai-visibility'
  | 'content-performance';

export interface ScheduledReport {
  id: string;
  name: string;
  projectId: string;
  type: ReportType;
  frequency: ReportFrequency;
  format: ReportFormat;
  recipients: string[];
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
  customSchedule?: {
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    hour: number; // 0-23
    minute: number; // 0-59
    timezone: string;
  };
  filters?: {
    dateRange?: 'last7days' | 'last30days' | 'last90days' | 'custom';
    keywords?: string[];
    competitors?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReportExecution {
  id: string;
  reportId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  fileUrl?: string;
  fileSize?: number;
  recipientsSent?: string[];
}

// Calculate next run time based on frequency
export function calculateNextRun(
  frequency: ReportFrequency,
  customSchedule?: ScheduledReport['customSchedule']
): Date {
  const now = new Date();
  const next = new Date(now);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      next.setHours(customSchedule?.hour ?? 8, customSchedule?.minute ?? 0, 0, 0);
      break;
    case 'weekly':
      const daysUntilNext = ((customSchedule?.dayOfWeek ?? 1) - now.getDay() + 7) % 7 || 7;
      next.setDate(next.getDate() + daysUntilNext);
      next.setHours(customSchedule?.hour ?? 8, customSchedule?.minute ?? 0, 0, 0);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      next.setDate(customSchedule?.dayOfMonth ?? 1);
      next.setHours(customSchedule?.hour ?? 8, customSchedule?.minute ?? 0, 0, 0);
      break;
    case 'custom':
      if (customSchedule) {
        next.setHours(customSchedule.hour, customSchedule.minute, 0, 0);
        if (next <= now) {
          next.setDate(next.getDate() + 1);
        }
      }
      break;
  }

  return next;
}

// Format report type for display
export function formatReportType(type: ReportType): string {
  const labels: Record<ReportType, string> = {
    'seo-overview': 'SEO Overview',
    'keyword-rankings': 'Keyword Rankings',
    'backlink-analysis': 'Backlink Analysis',
    'competitor-comparison': 'Competitor Comparison',
    'technical-audit': 'Technical Audit',
    'ai-visibility': 'AI Visibility',
    'content-performance': 'Content Performance',
  };
  return labels[type];
}

// Mock scheduled reports data
export const mockScheduledReports: ScheduledReport[] = [
  {
    id: 'report-1',
    name: 'Weekly SEO Overview',
    projectId: 'acme-corp',
    type: 'seo-overview',
    frequency: 'weekly',
    format: 'pdf',
    recipients: ['team@acmecorp.com', 'ceo@acmecorp.com'],
    enabled: true,
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    nextRun: calculateNextRun('weekly').toISOString(),
    customSchedule: {
      dayOfWeek: 1,
      hour: 9,
      minute: 0,
      timezone: 'America/New_York',
    },
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-01T14:30:00Z',
  },
  {
    id: 'report-2',
    name: 'Daily Ranking Report',
    projectId: 'acme-corp',
    type: 'keyword-rankings',
    frequency: 'daily',
    format: 'csv',
    recipients: ['seo@acmecorp.com'],
    enabled: true,
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    nextRun: calculateNextRun('daily').toISOString(),
    customSchedule: {
      hour: 7,
      minute: 0,
      timezone: 'America/New_York',
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-10T09:15:00Z',
  },
  {
    id: 'report-3',
    name: 'Monthly Competitor Analysis',
    projectId: 'acme-corp',
    type: 'competitor-comparison',
    frequency: 'monthly',
    format: 'pdf',
    recipients: ['strategy@acmecorp.com', 'ceo@acmecorp.com'],
    enabled: true,
    lastRun: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextRun: calculateNextRun('monthly').toISOString(),
    customSchedule: {
      dayOfMonth: 1,
      hour: 10,
      minute: 0,
      timezone: 'America/New_York',
    },
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
];

// Mock report executions
export const mockReportExecutions: ReportExecution[] = [
  {
    id: 'exec-1',
    reportId: 'report-1',
    status: 'completed',
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45000).toISOString(),
    fileUrl: '/reports/seo-overview-2026-03-12.pdf',
    fileSize: 2456789,
    recipientsSent: ['team@acmecorp.com', 'ceo@acmecorp.com'],
  },
  {
    id: 'exec-2',
    reportId: 'report-2',
    status: 'completed',
    startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 15000).toISOString(),
    fileUrl: '/reports/rankings-2026-03-18.csv',
    fileSize: 156789,
    recipientsSent: ['seo@acmecorp.com'],
  },
];
