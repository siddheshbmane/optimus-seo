// API Usage Tracker
// Monitors and tracks API usage for rate limiting

export interface APIUsageRecord {
  id: string;
  provider: 'dataforseo' | 'groq' | 'openrouter' | 'openai';
  endpoint: string;
  method: string;
  timestamp: string;
  cost: number;
  tokens?: number;
  responseTime: number;
  status: 'success' | 'error' | 'rate_limited';
  projectId?: string;
  userId?: string;
}

export interface APIUsageSummary {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  rateLimitedRequests: number;
  totalCost: number;
  totalTokens: number;
  avgResponseTime: number;
  period: 'hour' | 'day' | 'week' | 'month';
}

export interface RateLimitConfig {
  provider: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  requestsPerMonth: number;
  currentUsage: {
    minute: number;
    hour: number;
    day: number;
    month: number;
  };
}

// In-memory usage tracking
const usageRecords: APIUsageRecord[] = [];
const rateLimits: Map<string, RateLimitConfig> = new Map([
  ['dataforseo', {
    provider: 'dataforseo',
    requestsPerMinute: 10,
    requestsPerHour: 500,
    requestsPerDay: 5000,
    requestsPerMonth: 100000,
    currentUsage: { minute: 0, hour: 0, day: 0, month: 0 },
  }],
  ['groq', {
    provider: 'groq',
    requestsPerMinute: 30,
    requestsPerHour: 1000,
    requestsPerDay: 14400,
    requestsPerMonth: 30000,
    currentUsage: { minute: 0, hour: 0, day: 0, month: 0 },
  }],
]);

// Track API usage
export function trackAPIUsage(record: Omit<APIUsageRecord, 'id'>): APIUsageRecord {
  const fullRecord: APIUsageRecord = {
    ...record,
    id: `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  
  usageRecords.push(fullRecord);
  
  // Update rate limit counters
  const limit = rateLimits.get(record.provider);
  if (limit) {
    limit.currentUsage.minute++;
    limit.currentUsage.hour++;
    limit.currentUsage.day++;
    limit.currentUsage.month++;
  }
  
  // Keep only last 10000 records
  if (usageRecords.length > 10000) {
    usageRecords.shift();
  }
  
  return fullRecord;
}

// Get usage summary
export function getUsageSummary(
  provider?: string,
  period: 'hour' | 'day' | 'week' | 'month' = 'day'
): APIUsageSummary[] {
  const now = Date.now();
  const periodMs = {
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  };
  
  const cutoff = now - periodMs[period];
  const filtered = usageRecords.filter(r => {
    const recordTime = new Date(r.timestamp).getTime();
    return recordTime >= cutoff && (!provider || r.provider === provider);
  });
  
  // Group by provider
  const grouped = filtered.reduce((acc, record) => {
    if (!acc[record.provider]) {
      acc[record.provider] = [];
    }
    acc[record.provider].push(record);
    return acc;
  }, {} as Record<string, APIUsageRecord[]>);
  
  return Object.entries(grouped).map(([prov, records]) => ({
    provider: prov,
    totalRequests: records.length,
    successfulRequests: records.filter(r => r.status === 'success').length,
    failedRequests: records.filter(r => r.status === 'error').length,
    rateLimitedRequests: records.filter(r => r.status === 'rate_limited').length,
    totalCost: records.reduce((sum, r) => sum + r.cost, 0),
    totalTokens: records.reduce((sum, r) => sum + (r.tokens || 0), 0),
    avgResponseTime: records.reduce((sum, r) => sum + r.responseTime, 0) / records.length,
    period,
  }));
}

// Check rate limit
export function checkRateLimit(provider: string): { allowed: boolean; retryAfter?: number } {
  const limit = rateLimits.get(provider);
  if (!limit) return { allowed: true };
  
  if (limit.currentUsage.minute >= limit.requestsPerMinute) {
    return { allowed: false, retryAfter: 60 };
  }
  if (limit.currentUsage.hour >= limit.requestsPerHour) {
    return { allowed: false, retryAfter: 3600 };
  }
  if (limit.currentUsage.day >= limit.requestsPerDay) {
    return { allowed: false, retryAfter: 86400 };
  }
  if (limit.currentUsage.month >= limit.requestsPerMonth) {
    return { allowed: false, retryAfter: 2592000 };
  }
  
  return { allowed: true };
}

// Get rate limit status
export function getRateLimitStatus(): RateLimitConfig[] {
  return Array.from(rateLimits.values());
}

// Reset rate limit counters (called by cron)
export function resetRateLimitCounters(period: 'minute' | 'hour' | 'day' | 'month'): void {
  rateLimits.forEach(limit => {
    limit.currentUsage[period] = 0;
  });
}

// Mock usage data for demo
export function generateMockUsageData(): void {
  const providers = ['dataforseo', 'groq'] as const;
  const endpoints = [
    '/keywords/search_volume',
    '/serp/google/organic',
    '/backlinks/summary',
    '/chat/completions',
  ];
  
  for (let i = 0; i < 100; i++) {
    const provider = providers[Math.floor(Math.random() * providers.length)];
    trackAPIUsage({
      provider,
      endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
      method: 'POST',
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      cost: Math.random() * 0.1,
      tokens: provider === 'groq' ? Math.floor(Math.random() * 1000) : undefined,
      responseTime: Math.floor(Math.random() * 2000) + 100,
      status: Math.random() > 0.05 ? 'success' : 'error',
    });
  }
}

// Initialize mock data
generateMockUsageData();
