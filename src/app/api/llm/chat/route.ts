// LLM Chat API Route Handler
// Server-side proxy for LLM API calls to protect API keys

import { NextRequest, NextResponse } from 'next/server';
import { llmClient, type LLMMessage, type LLMCompletionOptions } from '@/lib/llm/client';

interface RequestBody {
  messages: LLMMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  provider?: 'groq' | 'openrouter' | 'openai' | 'auto';
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { messages, model, maxTokens, temperature, provider } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Check if LLM is available
    if (!llmClient.isAvailable()) {
      return NextResponse.json(
        { error: 'No LLM provider configured. Please set GROQ_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY.' },
        { status: 503 }
      );
    }

    const options: LLMCompletionOptions = {
      messages,
      model,
      maxTokens,
      temperature,
      provider: provider || 'auto',
    };

    const result = await llmClient.complete(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('LLM API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check LLM availability
export async function GET() {
  return NextResponse.json({
    available: llmClient.isAvailable(),
    provider: llmClient.getDefaultProvider(),
  });
}
