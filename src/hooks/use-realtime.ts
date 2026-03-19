// React Hook for Real-time Updates
// Connects to SSE endpoint and provides real-time data

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CHANNELS, type ChannelType } from '@/lib/realtime/event-emitter';

interface RealtimeEvent {
  channel: ChannelType;
  data: unknown;
  timestamp: number;
}

interface UseRealtimeOptions {
  channels?: ChannelType[];
  onEvent?: (event: RealtimeEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoReconnect?: boolean;
  reconnectDelay?: number;
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const {
    channels = Object.values(CHANNELS),
    onEvent,
    onConnect,
    onDisconnect,
    autoReconnect = true,
    reconnectDelay = 3000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const channelsParam = channels.join(',');
    const url = `/api/realtime/events?channels=${encodeURIComponent(channelsParam)}`;
    
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      onConnect?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected' || data.type === 'heartbeat') {
          return;
        }

        const realtimeEvent: RealtimeEvent = {
          channel: data.channel,
          data: data.data,
          timestamp: data.timestamp,
        };

        setLastEvent(realtimeEvent);
        setEvents(prev => [...prev.slice(-99), realtimeEvent]);
        onEvent?.(realtimeEvent);
      } catch {
        // Ignore parse errors
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      onDisconnect?.();
      eventSource.close();

      if (autoReconnect) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectDelay);
      }
    };
  }, [channels, onEvent, onConnect, onDisconnect, autoReconnect, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setLastEvent(null);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    lastEvent,
    events,
    connect,
    disconnect,
    clearEvents,
  };
}

// Specialized hooks for specific channels
export function useAgentStatus() {
  const [agentStatuses, setAgentStatuses] = useState<Record<string, unknown>>({});

  const { isConnected, lastEvent } = useRealtime({
    channels: [CHANNELS.AGENT_STATUS],
    onEvent: (event) => {
      if (event.channel === CHANNELS.AGENT_STATUS) {
        const data = event.data as { agentId: string; status: unknown };
        setAgentStatuses(prev => ({
          ...prev,
          [data.agentId]: data.status,
        }));
      }
    },
  });

  return { isConnected, agentStatuses };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number;
  }>>([]);

  const { isConnected } = useRealtime({
    channels: [CHANNELS.NOTIFICATION],
    onEvent: (event) => {
      if (event.channel === CHANNELS.NOTIFICATION) {
        const data = event.data as {
          id: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
        };
        setNotifications(prev => [
          ...prev,
          { ...data, timestamp: event.timestamp },
        ].slice(-50));
      }
    },
  });

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return { isConnected, notifications, clearNotification, clearAll };
}

export function useRankingChanges() {
  const [changes, setChanges] = useState<Array<{
    keyword: string;
    oldPosition: number;
    newPosition: number;
    change: number;
    timestamp: number;
  }>>([]);

  const { isConnected } = useRealtime({
    channels: [CHANNELS.RANKING_CHANGE],
    onEvent: (event) => {
      if (event.channel === CHANNELS.RANKING_CHANGE) {
        const data = event.data as {
          keyword: string;
          oldPosition: number;
          newPosition: number;
        };
        setChanges(prev => [
          ...prev,
          {
            ...data,
            change: data.oldPosition - data.newPosition,
            timestamp: event.timestamp,
          },
        ].slice(-100));
      }
    },
  });

  return { isConnected, changes };
}

export function useAPIUsage() {
  const [usage, setUsage] = useState<{
    dataForSEO: { used: number; limit: number; cost: number };
    llm: { used: number; limit: number };
  }>({
    dataForSEO: { used: 0, limit: 10000, cost: 0 },
    llm: { used: 0, limit: 30000 },
  });

  const { isConnected } = useRealtime({
    channels: [CHANNELS.API_USAGE],
    onEvent: (event) => {
      if (event.channel === CHANNELS.API_USAGE) {
        setUsage(event.data as typeof usage);
      }
    },
  });

  return { isConnected, usage };
}

// Export channels for convenience
export { CHANNELS };
