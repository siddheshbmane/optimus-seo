// Real-time Connection Status Component
// Shows connection status and live updates indicator

'use client';

import { useRealtime, CHANNELS } from '@/hooks/use-realtime';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

export function RealtimeStatus() {
  const { isConnected, events } = useRealtime({
    channels: [CHANNELS.NOTIFICATION, CHANNELS.AGENT_STATUS],
  });

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <Badge variant="success" className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          <span>Live</span>
        </Badge>
      ) : (
        <Badge variant="warning" className="flex items-center gap-1">
          <WifiOff className="h-3 w-3" />
          <span>Connecting...</span>
        </Badge>
      )}
      {events.length > 0 && (
        <span className="text-xs text-muted-foreground">
          {events.length} updates
        </span>
      )}
    </div>
  );
}

// Compact version for header
export function RealtimeIndicator() {
  const { isConnected } = useRealtime({
    channels: [CHANNELS.NOTIFICATION],
  });

  return (
    <div 
      className={`h-2 w-2 rounded-full ${
        isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
      }`}
      title={isConnected ? 'Connected to live updates' : 'Connecting...'}
    />
  );
}
