// React Hook for LLM API calls
// Provides easy-to-use hooks for LLM completions and streaming

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import useSWR from 'swr';

// Types
interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMCompletionResponse {
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

interface LLMAvailability {
  available: boolean;
  provider: string | null;
}

type LLMProvider = 'groq' | 'openrouter' | 'openai' | 'auto';

// Check LLM availability
export function useLLMAvailability() {
  return useSWR<LLMAvailability>('/api/llm/chat', async (url: string) => {
    const response = await fetch(url);
    return response.json();
  }, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}

// Hook for LLM completions
export function useLLMCompletion() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<LLMCompletionResponse | null>(null);

  const complete = useCallback(async (
    messages: LLMMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      provider?: LLMProvider;
    }
  ): Promise<LLMCompletionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          ...options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'LLM API error');
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { complete, isLoading, error, data };
}

// Hook for streaming LLM completions
export function useLLMStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [content, setContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const stream = useCallback(async (
    messages: LLMMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      provider?: LLMProvider;
    },
    onChunk?: (chunk: string) => void
  ): Promise<string> => {
    // Abort any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsStreaming(true);
    setError(null);
    setContent('');

    let fullContent = '';

    try {
      const response = await fetch('/api/llm/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          ...options,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'LLM Stream API error');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              
              if (parsed.content) {
                fullContent += parsed.content;
                setContent(fullContent);
                onChunk?.(parsed.content);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      return fullContent;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return fullContent;
      }
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { stream, abort, isStreaming, error, content };
}

// Hook for SEO-specific LLM calls
export function useSEOAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const analyze = useCallback(async (
    action: 'analyze' | 'generateContent' | 'analyzeContent' | 'generateMeta' | 'suggestKeywords' | 'competitorAnalysis' | 'technicalAudit',
    params: Record<string, unknown>
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/llm/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, params }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'SEO LLM API error');
      }

      const data = await response.json();
      setResult(data.result);
      return data.result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyze, isLoading, error, result };
}

// Convenience hooks for specific SEO tasks
export function useContentGeneration() {
  const { analyze, isLoading, error, result } = useSEOAnalysis();

  const generateContent = useCallback(async (
    topic: string,
    keywords: string[],
    contentType: 'blog' | 'product' | 'landing' | 'meta'
  ) => {
    return analyze('generateContent', { topic, keywords, contentType });
  }, [analyze]);

  return { generateContent, isLoading, error, result };
}

export function useContentAnalysis() {
  const { analyze, isLoading, error, result } = useSEOAnalysis();

  const analyzeContent = useCallback(async (
    content: string,
    targetKeyword: string
  ) => {
    return analyze('analyzeContent', { content, targetKeyword });
  }, [analyze]);

  return { analyzeContent, isLoading, error, result };
}

export function useMetaGeneration() {
  const { analyze, isLoading, error, result } = useSEOAnalysis();

  const generateMeta = useCallback(async (
    title: string,
    content: string,
    targetKeyword: string
  ) => {
    return analyze('generateMeta', { title, content, targetKeyword });
  }, [analyze]);

  return { generateMeta, isLoading, error, result };
}

export function useKeywordSuggestions() {
  const { analyze, isLoading, error, result } = useSEOAnalysis();

  const suggestKeywords = useCallback(async (
    topic: string,
    existingKeywords?: string[]
  ) => {
    return analyze('suggestKeywords', { topic, existingKeywords });
  }, [analyze]);

  return { suggestKeywords, isLoading, error, result };
}

export function useCompetitorAnalysis() {
  const { analyze, isLoading, error, result } = useSEOAnalysis();

  const analyzeCompetitor = useCallback(async (
    competitorUrl: string,
    competitorContent: string,
    targetKeyword: string
  ) => {
    return analyze('competitorAnalysis', { competitorUrl, competitorContent, targetKeyword });
  }, [analyze]);

  return { analyzeCompetitor, isLoading, error, result };
}

export function useTechnicalAudit() {
  const { analyze, isLoading, error, result } = useSEOAnalysis();

  const auditTechnical = useCallback(async (
    issues: string[],
    url: string
  ) => {
    return analyze('technicalAudit', { issues, url });
  }, [analyze]);

  return { auditTechnical, isLoading, error, result };
}
