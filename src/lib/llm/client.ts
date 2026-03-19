// LLM Client Library
// Unified client for Groq, OpenRouter, and OpenAI with fallback support

import { llmConfig } from '@/config/api-config';
import { env, getAvailableLLMProvider } from '@/config/env';

// Types
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMCompletionOptions {
  messages: LLMMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  provider?: 'groq' | 'openrouter' | 'openai' | 'auto';
}

export interface LLMCompletionResponse {
  content: string;
  model: string;
  provider: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}

export interface LLMStreamChunk {
  content: string;
  done: boolean;
}

// Provider configurations
const providers = {
  groq: {
    baseUrl: llmConfig.groq.baseUrl,
    model: llmConfig.groq.model,
    getApiKey: () => env.GROQ_API_KEY,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
  },
  openrouter: {
    baseUrl: llmConfig.openrouter.baseUrl,
    model: llmConfig.openrouter.model,
    getApiKey: () => env.OPENROUTER_API_KEY,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': env.APP_URL,
      'X-Title': 'Optimus SEO',
    }),
  },
  openai: {
    baseUrl: llmConfig.openai.baseUrl,
    model: llmConfig.openai.model,
    getApiKey: () => env.OPENAI_API_KEY,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
  },
} as const;

type ProviderName = keyof typeof providers;

// Fallback order for providers
const fallbackOrder: ProviderName[] = ['groq', 'openrouter', 'openai'];

/**
 * Get the next available provider
 */
function getNextProvider(currentProvider?: ProviderName): ProviderName | null {
  const startIndex = currentProvider ? fallbackOrder.indexOf(currentProvider) + 1 : 0;
  
  for (let i = startIndex; i < fallbackOrder.length; i++) {
    const provider = fallbackOrder[i];
    const apiKey = providers[provider].getApiKey();
    if (apiKey) {
      return provider;
    }
  }
  
  return null;
}

/**
 * Make a completion request to a specific provider
 */
async function makeCompletionRequest(
  providerName: ProviderName,
  options: LLMCompletionOptions
): Promise<LLMCompletionResponse> {
  const provider = providers[providerName];
  const apiKey = provider.getApiKey();
  
  if (!apiKey) {
    throw new Error(`No API key configured for ${providerName}`);
  }

  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: provider.headers(apiKey),
    body: JSON.stringify({
      model: options.model || provider.model,
      messages: options.messages,
      max_tokens: options.maxTokens || llmConfig[providerName].maxTokens,
      temperature: options.temperature ?? 0.7,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${providerName} API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0]?.message?.content || '',
    model: data.model,
    provider: providerName,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    finishReason: data.choices[0]?.finish_reason || 'stop',
  };
}

/**
 * Make a streaming completion request
 */
async function* makeStreamingRequest(
  providerName: ProviderName,
  options: LLMCompletionOptions
): AsyncGenerator<LLMStreamChunk> {
  const provider = providers[providerName];
  const apiKey = provider.getApiKey();
  
  if (!apiKey) {
    throw new Error(`No API key configured for ${providerName}`);
  }

  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: provider.headers(apiKey),
    body: JSON.stringify({
      model: options.model || provider.model,
      messages: options.messages,
      max_tokens: options.maxTokens || llmConfig[providerName].maxTokens,
      temperature: options.temperature ?? 0.7,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${providerName} API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      yield { content: '', done: true };
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          yield { content: '', done: true };
          return;
        }
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            yield { content, done: false };
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}

/**
 * LLM Client class with fallback support
 */
class LLMClient {
  private defaultProvider: ProviderName | null;

  constructor() {
    this.defaultProvider = getAvailableLLMProvider() as ProviderName | null;
  }

  /**
   * Check if any LLM provider is available
   */
  isAvailable(): boolean {
    return this.defaultProvider !== null;
  }

  /**
   * Get the current default provider
   */
  getDefaultProvider(): ProviderName | null {
    return this.defaultProvider;
  }

  /**
   * Make a completion request with automatic fallback
   */
  async complete(options: LLMCompletionOptions): Promise<LLMCompletionResponse> {
    let provider: ProviderName | null = null;

    // Determine starting provider
    if (options.provider && options.provider !== 'auto') {
      provider = options.provider;
    } else {
      provider = getNextProvider();
    }

    if (!provider) {
      throw new Error('No LLM provider available. Please configure GROQ_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY.');
    }

    // Try providers with fallback
    let lastError: Error | null = null;
    let currentProvider: ProviderName | null = provider;

    while (currentProvider) {
      try {
        return await makeCompletionRequest(currentProvider, options);
      } catch (error) {
        lastError = error as Error;
        console.warn(`LLM provider ${currentProvider} failed:`, error);
        
        // Try next provider if auto mode
        if (options.provider === 'auto' || !options.provider) {
          currentProvider = getNextProvider(currentProvider);
        } else {
          break;
        }
      }
    }

    throw lastError || new Error('All LLM providers failed');
  }

  /**
   * Make a streaming completion request
   */
  async *stream(options: LLMCompletionOptions): AsyncGenerator<LLMStreamChunk> {
    let provider: ProviderName | null = null;

    if (options.provider && options.provider !== 'auto') {
      provider = options.provider;
    } else {
      provider = getNextProvider();
    }

    if (!provider) {
      throw new Error('No LLM provider available');
    }

    yield* makeStreamingRequest(provider, { ...options, stream: true });
  }

  /**
   * Simple text completion helper
   */
  async generateText(
    prompt: string,
    systemPrompt?: string,
    options?: Partial<LLMCompletionOptions>
  ): Promise<string> {
    const messages: LLMMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    const response = await this.complete({
      messages,
      ...options,
    });

    return response.content;
  }

  /**
   * SEO-specific completion with optimized system prompt
   */
  async seoAnalysis(
    prompt: string,
    context?: string,
    options?: Partial<LLMCompletionOptions>
  ): Promise<string> {
    const systemPrompt = `You are an expert SEO analyst with deep knowledge of:
- Search engine algorithms and ranking factors
- Technical SEO best practices
- Content optimization strategies
- AI/LLM visibility optimization
- Competitive analysis
- Keyword research and intent mapping

Provide actionable, data-driven insights. Be specific and practical.
${context ? `\nContext: ${context}` : ''}`;

    return this.generateText(prompt, systemPrompt, options);
  }

  /**
   * Content generation with SEO optimization
   */
  async generateContent(
    topic: string,
    keywords: string[],
    contentType: 'blog' | 'product' | 'landing' | 'meta',
    options?: Partial<LLMCompletionOptions>
  ): Promise<string> {
    const systemPrompt = `You are an expert SEO content writer. Generate high-quality, 
SEO-optimized content that naturally incorporates target keywords while maintaining 
readability and user engagement.

Target keywords: ${keywords.join(', ')}
Content type: ${contentType}

Guidelines:
- Use keywords naturally, avoid keyword stuffing
- Write for humans first, search engines second
- Include relevant semantic variations
- Structure content with clear headings
- Optimize for featured snippets where applicable`;

    return this.generateText(
      `Create ${contentType} content about: ${topic}`,
      systemPrompt,
      options
    );
  }

  /**
   * Analyze content for SEO improvements
   */
  async analyzeContent(
    content: string,
    targetKeyword: string,
    options?: Partial<LLMCompletionOptions>
  ): Promise<string> {
    const systemPrompt = `You are an SEO content analyst. Analyze the provided content 
and give specific, actionable recommendations for improvement.

Target keyword: ${targetKeyword}

Analyze:
1. Keyword usage and placement
2. Content structure and headings
3. Readability and engagement
4. Missing topics or semantic gaps
5. Meta optimization suggestions
6. Internal linking opportunities`;

    return this.generateText(
      `Analyze this content:\n\n${content}`,
      systemPrompt,
      options
    );
  }
}

// Export singleton instance
export const llmClient = new LLMClient();

// Export class for testing
export { LLMClient };

// Export types
export type { ProviderName };
