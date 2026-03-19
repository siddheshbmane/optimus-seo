// Server-Sent Events (SSE) API Route
// Provides real-time updates to connected clients

import { realtimeEmitter, CHANNELS, type ChannelType } from '@/lib/realtime/event-emitter';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelsParam = searchParams.get('channels');
  
  // Parse requested channels or subscribe to all
  const channels: ChannelType[] = channelsParam 
    ? channelsParam.split(',') as ChannelType[]
    : Object.values(CHANNELS);

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  let isConnected = true;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const connectMessage = `data: ${JSON.stringify({ 
        type: 'connected', 
        channels,
        timestamp: Date.now() 
      })}\n\n`;
      controller.enqueue(encoder.encode(connectMessage));

      // Subscribe to each channel
      const subscriptionIds: { channel: string; id: string }[] = [];

      channels.forEach(channel => {
        const id = realtimeEmitter.subscribe(channel, (data) => {
          if (!isConnected) return;
          
          try {
            const message = `data: ${JSON.stringify({ 
              channel, 
              data,
              timestamp: Date.now() 
            })}\n\n`;
            controller.enqueue(encoder.encode(message));
          } catch {
            // Client disconnected
            isConnected = false;
          }
        });
        subscriptionIds.push({ channel, id });
      });

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        if (!isConnected) {
          clearInterval(heartbeatInterval);
          return;
        }
        
        try {
          const heartbeat = `data: ${JSON.stringify({ 
            type: 'heartbeat', 
            timestamp: Date.now() 
          })}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch {
          isConnected = false;
          clearInterval(heartbeatInterval);
        }
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        isConnected = false;
        clearInterval(heartbeatInterval);
        subscriptionIds.forEach(({ channel, id }) => {
          realtimeEmitter.unsubscribe(channel, id);
        });
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

// POST endpoint to emit events (for internal use)
export async function POST(request: Request) {
  try {
    const { channel, data } = await request.json();
    
    if (!channel || !data) {
      return Response.json(
        { error: 'Channel and data are required' },
        { status: 400 }
      );
    }

    realtimeEmitter.emit(channel, data);
    
    return Response.json({ 
      success: true, 
      subscribers: realtimeEmitter.getSubscriberCount(channel) 
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
