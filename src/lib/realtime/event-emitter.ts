// Real-time Event Emitter
// Server-side event management for real-time updates

type EventCallback = (data: unknown) => void;

interface EventSubscription {
  id: string;
  callback: EventCallback;
}

class RealtimeEventEmitter {
  private subscribers: Map<string, EventSubscription[]> = new Map();
  private eventHistory: Map<string, unknown[]> = new Map();
  private maxHistorySize = 100;

  /**
   * Subscribe to an event channel
   */
  subscribe(channel: string, callback: EventCallback): string {
    const id = `${channel}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, []);
    }
    
    this.subscribers.get(channel)!.push({ id, callback });
    return id;
  }

  /**
   * Unsubscribe from an event channel
   */
  unsubscribe(channel: string, subscriptionId: string): void {
    const subs = this.subscribers.get(channel);
    if (subs) {
      const index = subs.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit(channel: string, data: unknown): void {
    // Store in history
    if (!this.eventHistory.has(channel)) {
      this.eventHistory.set(channel, []);
    }
    const history = this.eventHistory.get(channel)!;
    history.push({ data, timestamp: Date.now() });
    if (history.length > this.maxHistorySize) {
      history.shift();
    }

    // Notify subscribers
    const subs = this.subscribers.get(channel);
    if (subs) {
      subs.forEach(sub => {
        try {
          sub.callback(data);
        } catch (error) {
          console.error(`Error in subscriber ${sub.id}:`, error);
        }
      });
    }
  }

  /**
   * Get recent events from a channel
   */
  getHistory(channel: string, limit = 10): unknown[] {
    const history = this.eventHistory.get(channel) || [];
    return history.slice(-limit);
  }

  /**
   * Get subscriber count for a channel
   */
  getSubscriberCount(channel: string): number {
    return this.subscribers.get(channel)?.length || 0;
  }

  /**
   * Get all active channels
   */
  getActiveChannels(): string[] {
    return Array.from(this.subscribers.keys()).filter(
      channel => this.getSubscriberCount(channel) > 0
    );
  }
}

// Singleton instance
export const realtimeEmitter = new RealtimeEventEmitter();

// Event channel constants
export const CHANNELS = {
  AGENT_STATUS: 'agent:status',
  AGENT_PROGRESS: 'agent:progress',
  KEYWORD_UPDATE: 'keyword:update',
  RANKING_CHANGE: 'ranking:change',
  ALERT: 'alert',
  NOTIFICATION: 'notification',
  API_USAGE: 'api:usage',
  CRAWL_PROGRESS: 'crawl:progress',
} as const;

export type ChannelType = typeof CHANNELS[keyof typeof CHANNELS];
