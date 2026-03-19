// API Usage Route
// Returns API usage statistics and rate limit status

import { NextRequest, NextResponse } from 'next/server';
import { 
  getUsageSummary, 
  getRateLimitStatus,
  trackAPIUsage,
  checkRateLimit,
} from '@/lib/api-usage/tracker';

// GET - Get usage statistics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider') || undefined;
  const period = (searchParams.get('period') || 'day') as 'hour' | 'day' | 'week' | 'month';

  const summary = getUsageSummary(provider, period);
  const rateLimits = getRateLimitStatus();

  return NextResponse.json({
    summary,
    rateLimits,
    timestamp: new Date().toISOString(),
  });
}

// POST - Track new API usage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check rate limit first
    const rateCheck = checkRateLimit(body.provider);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    const record = trackAPIUsage({
      provider: body.provider,
      endpoint: body.endpoint,
      method: body.method || 'POST',
      timestamp: new Date().toISOString(),
      cost: body.cost || 0,
      tokens: body.tokens,
      responseTime: body.responseTime || 0,
      status: body.status || 'success',
      projectId: body.projectId,
      userId: body.userId,
    });

    return NextResponse.json({ record });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to track usage' },
      { status: 400 }
    );
  }
}
