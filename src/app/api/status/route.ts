// API Status Route Handler
// Returns the current status of all API integrations

import { NextResponse } from 'next/server';
import { getAPIStatus, features } from '@/config/features';

export async function GET() {
  const status = getAPIStatus();
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apis: status,
    features: {
      mockMode: features.mockMode,
      dataForSEO: features.dataForSEO.enabled,
      llm: features.llm.enabled,
      aiAgents: features.beta.aiAgents,
    },
    modules: features.modules,
  });
}
