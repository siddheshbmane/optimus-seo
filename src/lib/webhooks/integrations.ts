// Webhook Integrations - Slack, Discord, and custom webhooks
// State persisted in OrgSetting JSON (survives serverless restarts)

import { prisma } from '@/lib/db';
import type { Prisma } from '@/generated/prisma';

export type WebhookProvider = 'slack' | 'discord' | 'custom';

export type WebhookEvent =
  | 'report.generated'
  | 'report.scheduled'
  | 'ranking.changed'
  | 'ranking.dropped'
  | 'backlink.new'
  | 'backlink.lost'
  | 'agent.completed'
  | 'agent.failed'
  | 'alert.triggered'
  | 'bulk.completed';

export interface WebhookConfig {
  id: string;
  name: string;
  provider: WebhookProvider;
  url: string;
  events: WebhookEvent[];
  enabled: boolean;
  organizationId: string;
  projectIds?: string[];
  secret?: string;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
  projectId?: string;
  organizationId: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: WebhookPayload;
  status: 'pending' | 'success' | 'failed';
  statusCode?: number;
  response?: string;
  error?: string;
  attempts: number;
  createdAt: string;
  deliveredAt?: string;
}

const ORG_WEBHOOKS_KEY = 'webhooks';

async function getWebhooksFromDB(organizationId: string): Promise<WebhookConfig[]> {
  try {
    const setting = await prisma.orgSetting.findUnique({
      where: { organizationId_key: { organizationId, key: ORG_WEBHOOKS_KEY } },
    });
    if (!setting) return [];
    const value = setting.value as unknown;
    return Array.isArray(value) ? (value as WebhookConfig[]) : [];
  } catch {
    return [];
  }
}

async function saveWebhooksToDB(organizationId: string, configs: WebhookConfig[]): Promise<void> {
  await prisma.orgSetting.upsert({
    where: { organizationId_key: { organizationId, key: ORG_WEBHOOKS_KEY } },
    create: { organizationId, key: ORG_WEBHOOKS_KEY, value: configs as unknown as Prisma.JsonArray },
    update: { value: configs as unknown as Prisma.JsonArray },
  });
}

// Create webhook
export async function createWebhook(
  config: Omit<WebhookConfig, 'id' | 'createdAt' | 'updatedAt' | 'failureCount'>
): Promise<WebhookConfig> {
  const webhook: WebhookConfig = {
    ...config,
    id: `webhook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    failureCount: 0,
  };
  const existing = await getWebhooksFromDB(config.organizationId);
  existing.push(webhook);
  await saveWebhooksToDB(config.organizationId, existing);
  return webhook;
}

// Get webhook
export async function getWebhook(organizationId: string, id: string): Promise<WebhookConfig | undefined> {
  const all = await getWebhooksFromDB(organizationId);
  return all.find(w => w.id === id);
}

// List webhooks
export async function listWebhooks(organizationId: string): Promise<WebhookConfig[]> {
  return getWebhooksFromDB(organizationId);
}

// Update webhook
export async function updateWebhook(
  organizationId: string,
  id: string,
  updates: Partial<Omit<WebhookConfig, 'id' | 'createdAt'>>
): Promise<WebhookConfig | undefined> {
  const all = await getWebhooksFromDB(organizationId);
  const idx = all.findIndex(w => w.id === id);
  if (idx === -1) return undefined;
  Object.assign(all[idx], updates, { updatedAt: new Date().toISOString() });
  await saveWebhooksToDB(organizationId, all);
  return all[idx];
}

// Delete webhook
export async function deleteWebhook(organizationId: string, id: string): Promise<boolean> {
  const all = await getWebhooksFromDB(organizationId);
  const filtered = all.filter(w => w.id !== id);
  if (filtered.length === all.length) return false;
  await saveWebhooksToDB(organizationId, filtered);
  return true;
}

// Format payload for Slack
function formatSlackPayload(payload: WebhookPayload): Record<string, unknown> {
  const eventLabels: Record<WebhookEvent, string> = {
    'report.generated': 'Report Generated',
    'report.scheduled': 'Report Scheduled',
    'ranking.changed': 'Ranking Changed',
    'ranking.dropped': 'Ranking Dropped',
    'backlink.new': 'New Backlink',
    'backlink.lost': 'Backlink Lost',
    'agent.completed': 'Agent Completed',
    'agent.failed': 'Agent Failed',
    'alert.triggered': 'Alert Triggered',
    'bulk.completed': 'Bulk Operation Completed',
  };
  const eventColors: Record<string, string> = {
    'report.generated': '#36a64f',
    'ranking.changed': '#2196F3',
    'ranking.dropped': '#f44336',
    'backlink.new': '#4CAF50',
    'backlink.lost': '#FF9800',
    'agent.completed': '#36a64f',
    'agent.failed': '#f44336',
    'alert.triggered': '#FF9800',
    'bulk.completed': '#36a64f',
  };
  return {
    attachments: [
      {
        color: eventColors[payload.event] || '#808080',
        title: eventLabels[payload.event] || payload.event,
        text: JSON.stringify(payload.data, null, 2),
        footer: 'Optimus SEO',
        ts: Math.floor(new Date(payload.timestamp).getTime() / 1000),
      },
    ],
  };
}

// Format payload for Discord
function formatDiscordPayload(payload: WebhookPayload): Record<string, unknown> {
  const eventLabels: Record<WebhookEvent, string> = {
    'report.generated': 'Report Generated',
    'report.scheduled': 'Report Scheduled',
    'ranking.changed': 'Ranking Changed',
    'ranking.dropped': 'Ranking Dropped',
    'backlink.new': 'New Backlink',
    'backlink.lost': 'Backlink Lost',
    'agent.completed': 'Agent Completed',
    'agent.failed': 'Agent Failed',
    'alert.triggered': 'Alert Triggered',
    'bulk.completed': 'Bulk Operation Completed',
  };
  const eventColors: Record<string, number> = {
    'report.generated': 0x36a64f,
    'ranking.changed': 0x2196f3,
    'ranking.dropped': 0xf44336,
    'backlink.new': 0x4caf50,
    'backlink.lost': 0xff9800,
    'agent.completed': 0x36a64f,
    'agent.failed': 0xf44336,
    'alert.triggered': 0xff9800,
    'bulk.completed': 0x36a64f,
  };
  return {
    embeds: [
      {
        title: eventLabels[payload.event] || payload.event,
        description: '```json\n' + JSON.stringify(payload.data, null, 2) + '\n```',
        color: eventColors[payload.event] || 0x808080,
        footer: { text: 'Optimus SEO' },
        timestamp: payload.timestamp,
      },
    ],
  };
}

// Send webhook
export async function sendWebhook(
  organizationId: string,
  webhookId: string,
  payload: WebhookPayload
): Promise<WebhookDelivery> {
  const all = await getWebhooksFromDB(organizationId);
  const webhook = all.find(w => w.id === webhookId);
  if (!webhook) throw new Error('Webhook not found');
  if (!webhook.enabled) throw new Error('Webhook is disabled');
  if (!webhook.events.includes(payload.event)) throw new Error('Event not subscribed');

  const delivery: WebhookDelivery = {
    id: `delivery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    webhookId,
    event: payload.event,
    payload,
    status: 'pending',
    attempts: 0,
    createdAt: new Date().toISOString(),
  };

  try {
    let formattedPayload: Record<string, unknown>;
    switch (webhook.provider) {
      case 'slack':
        formattedPayload = formatSlackPayload(payload);
        break;
      case 'discord':
        formattedPayload = formatDiscordPayload(payload);
        break;
      default:
        formattedPayload = payload as unknown as Record<string, unknown>;
    }

    delivery.attempts++;

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhook.secret && { 'X-Webhook-Secret': webhook.secret }),
      },
      body: JSON.stringify(formattedPayload),
    });

    delivery.statusCode = response.status;
    if (response.ok) {
      delivery.status = 'success';
      delivery.deliveredAt = new Date().toISOString();
      webhook.lastTriggeredAt = new Date().toISOString();
      webhook.failureCount = 0;
    } else {
      delivery.status = 'failed';
      delivery.error = `HTTP ${response.status}`;
      delivery.response = await response.text();
      webhook.failureCount++;
    }

    // Persist updated webhook stats
    const updated = all.map(w => (w.id === webhookId ? webhook : w));
    await saveWebhooksToDB(organizationId, updated);
  } catch (error) {
    delivery.status = 'failed';
    delivery.error = error instanceof Error ? error.message : 'Unknown error';
    webhook.failureCount++;
    const updated = all.map(w => (w.id === webhookId ? webhook : w));
    await saveWebhooksToDB(organizationId, updated);
  }

  return delivery;
}

// Trigger webhooks for an event
export async function triggerWebhooks(
  event: WebhookEvent,
  data: Record<string, unknown>,
  organizationId: string,
  projectId?: string
): Promise<WebhookDelivery[]> {
  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
    organizationId,
    projectId,
  };

  const all = await getWebhooksFromDB(organizationId);
  const matching = all.filter(w => {
    if (!w.enabled) return false;
    if (!w.events.includes(event)) return false;
    if (projectId && w.projectIds && !w.projectIds.includes(projectId)) return false;
    return true;
  });

  const results = await Promise.allSettled(
    matching.map(w => sendWebhook(organizationId, w.id, payload))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<WebhookDelivery> => r.status === 'fulfilled')
    .map(r => r.value);
}
