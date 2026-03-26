import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import {
  createWebhook,
  listWebhooks,
  triggerWebhooks,
  type WebhookProvider,
  type WebhookEvent,
} from '@/lib/webhooks/integrations';

// GET - List webhooks
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || undefined;
    
    const webhooks = listWebhooks(organizationId);
    
    // Hide secrets in response
    const safeWebhooks = webhooks.map(w => ({
      ...w,
      secret: w.secret ? '••••••••' : undefined,
    }));
    
    return NextResponse.json({
      success: true,
      data: safeWebhooks,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error listing webhooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list webhooks' },
      { status: 500 }
    );
  }
}

// POST - Create webhook or trigger event
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { action } = body;
    
    if (action === 'trigger') {
      // Trigger webhooks for an event
      const { event, data, organizationId, projectId } = body;
      
      if (!event || !organizationId) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields: event, organizationId' },
          { status: 400 }
        );
      }
      
      const deliveries = await triggerWebhooks(
        event as WebhookEvent,
        data || {},
        organizationId,
        projectId
      );
      
      return NextResponse.json({
        success: true,
        data: {
          triggered: deliveries.length,
          deliveries,
        },
      });
    }
    
    // Create new webhook
    const { name, provider, url, events, organizationId, projectIds, secret } = body;
    
    if (!name || !provider || !url || !events || !organizationId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate provider
    const validProviders: WebhookProvider[] = ['slack', 'discord', 'custom'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { success: false, error: 'Invalid provider' },
        { status: 400 }
      );
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL' },
        { status: 400 }
      );
    }
    
    const webhook = createWebhook({
      name,
      provider,
      url,
      events,
      enabled: true,
      organizationId,
      projectIds,
      secret,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...webhook,
        secret: webhook.secret ? '••••••••' : undefined,
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error in webhooks API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
