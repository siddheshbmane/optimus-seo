// Webhook Integrations - Slack, Discord, and custom webhooks

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
  projectIds?: string[]; // Optional: limit to specific projects
  secret?: string; // For signature verification
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

// In-memory storage
const webhooks: Map<string, WebhookConfig> = new Map();
const deliveries: Map<string, WebhookDelivery> = new Map();

// Create webhook
export function createWebhook(
  config: Omit<WebhookConfig, 'id' | 'createdAt' | 'updatedAt' | 'failureCount'>
): WebhookConfig {
  const webhook: WebhookConfig = {
    ...config,
    id: `webhook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    failureCount: 0,
  };
  
  webhooks.set(webhook.id, webhook);
  return webhook;
}

// Get webhook
export function getWebhook(id: string): WebhookConfig | undefined {
  return webhooks.get(id);
}

// List webhooks
export function listWebhooks(organizationId?: string): WebhookConfig[] {
  const all = Array.from(webhooks.values());
  if (organizationId) {
    return all.filter(w => w.organizationId === organizationId);
  }
  return all;
}

// Update webhook
export function updateWebhook(
  id: string,
  updates: Partial<Omit<WebhookConfig, 'id' | 'createdAt'>>
): WebhookConfig | undefined {
  const webhook = webhooks.get(id);
  if (!webhook) return undefined;
  
  Object.assign(webhook, updates, { updatedAt: new Date().toISOString() });
  return webhook;
}

// Delete webhook
export function deleteWebhook(id: string): boolean {
  return webhooks.delete(id);
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
    'ranking.changed': 0x2196F3,
    'ranking.dropped': 0xf44336,
    'backlink.new': 0x4CAF50,
    'backlink.lost': 0xFF9800,
    'agent.completed': 0x36a64f,
    'agent.failed': 0xf44336,
    'alert.triggered': 0xFF9800,
    'bulk.completed': 0x36a64f,
  };
  
  return {
    embeds: [
      {
        title: eventLabels[payload.event] || payload.event,
        description: '```json\n' + JSON.stringify(payload.data, null, 2) + '\n```',
        color: eventColors[payload.event] || 0x808080,
        footer: {
          text: 'Optimus SEO',
        },
        timestamp: payload.timestamp,
      },
    ],
  };
}

// Send webhook
export async function sendWebhook(
  webhookId: string,
  payload: WebhookPayload
): Promise<WebhookDelivery> {
  const webhook = webhooks.get(webhookId);
  if (!webhook) {
    throw new Error('Webhook not found');
  }
  
  if (!webhook.enabled) {
    throw new Error('Webhook is disabled');
  }
  
  if (!webhook.events.includes(payload.event)) {
    throw new Error('Event not subscribed');
  }
  
  const delivery: WebhookDelivery = {
    id: `delivery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    webhookId,
    event: payload.event,
    payload,
    status: 'pending',
    attempts: 0,
    createdAt: new Date().toISOString(),
  };
  
  deliveries.set(delivery.id, delivery);
  
  try {
    // Format payload based on provider
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
  } catch (error) {
    delivery.status = 'failed';
    delivery.error = error instanceof Error ? error.message : 'Unknown error';
    webhook.failureCount++;
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
  
  // Find matching webhooks
  const matchingWebhooks = Array.from(webhooks.values()).filter(w => {
    if (w.organizationId !== organizationId) return false;
    if (!w.enabled) return false;
    if (!w.events.includes(event)) return false;
    if (projectId && w.projectIds && !w.projectIds.includes(projectId)) return false;
    return true;
  });
  
  // Send to all matching webhooks
  const results = await Promise.allSettled(
    matchingWebhooks.map(w => sendWebhook(w.id, payload))
  );
  
  return results
    .filter((r): r is PromiseFulfilledResult<WebhookDelivery> => r.status === 'fulfilled')
    .map(r => r.value);
}

// List deliveries
export function listDeliveries(webhookId?: string): WebhookDelivery[] {
  const all = Array.from(deliveries.values());
  if (webhookId) {
    return all.filter(d => d.webhookId === webhookId);
  }
  return all;
}

// Initialize demo webhooks
export function initializeDemoWebhooks(): void {
  createWebhook({
    name: 'Slack Notifications',
    provider: 'slack',
    url: 'https://hooks.slack.com/services/demo/webhook',
    events: ['report.generated', 'ranking.dropped', 'agent.failed'],
    enabled: true,
    organizationId: 'org-1',
  });
  
  createWebhook({
    name: 'Discord Alerts',
    provider: 'discord',
    url: 'https://discord.com/api/webhooks/demo/webhook',
    events: ['alert.triggered', 'backlink.lost'],
    enabled: true,
    organizationId: 'org-1',
  });
}

// Initialize demo data
initializeDemoWebhooks();
