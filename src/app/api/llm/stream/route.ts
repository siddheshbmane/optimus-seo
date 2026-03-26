// LLM Streaming API Route Handler
// Server-side streaming proxy for LLM API calls

import { NextRequest } from 'next/server';
import { llmClient, type LLMMessage, type LLMCompletionOptions } from '@/lib/llm/client';
import { requireAuth } from '@/lib/api/auth';

interface RequestBody {
  messages: LLMMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  provider?: 'groq' | 'openrouter' | 'openai' | 'auto';
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body: RequestBody = await request.json();
    const { messages, model, maxTokens, temperature, provider } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if LLM is available
    if (!llmClient.isAvailable()) {
      return new Response(
        JSON.stringify({ error: 'No LLM provider configured' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const options: LLMCompletionOptions = {
      messages,
      model,
      maxTokens,
      temperature,
      provider: provider || 'auto',
      stream: true,
    };

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of llmClient.stream(options)) {
            if (chunk.done) {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              return;
            }
            
            const data = JSON.stringify({ content: chunk.content });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Stream error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('LLM Stream API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
