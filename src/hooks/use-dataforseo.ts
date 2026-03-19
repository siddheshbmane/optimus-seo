// React Hook for DataForSEO API calls
// Provides easy-to-use hooks for all DataForSEO endpoints

'use client';

import { useState, useCallback } from 'react';
import useSWR, { type SWRConfiguration } from 'swr';

// Types
interface DataForSEOResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: Record<string, unknown>;
    result: T[];
  }>;
}

interface UseDataForSEOOptions extends SWRConfiguration {
  enabled?: boolean;
}

// Fetcher function
async function dataForSEOFetcher<T>(
  method: string,
  params: Record<string, unknown>
): Promise<DataForSEOResponse<T>> {
  const response = await fetch('/api/dataforseo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'DataForSEO API error');
  }

  return response.json();
}

// Generic hook for DataForSEO calls
export function useDataForSEO<T>(
  method: string | null,
  params: Record<string, unknown>,
  options: UseDataForSEOOptions = {}
) {
  const { enabled = true, ...swrOptions } = options;

  const key = enabled && method ? [method, JSON.stringify(params)] : null;

  return useSWR<DataForSEOResponse<T>>(
    key,
    () => dataForSEOFetcher<T>(method!, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...swrOptions,
    }
  );
}

// Mutation hook for one-off calls
export function useDataForSEOMutation<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DataForSEOResponse<T> | null>(null);

  const mutate = useCallback(async (
    method: string,
    params: Record<string, unknown>
  ): Promise<DataForSEOResponse<T>> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dataForSEOFetcher<T>(method, params);
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

  return { mutate, isLoading, error, data };
}

// ============================================
// Specialized Hooks
// ============================================

// SERP Hooks
export function useSerpGoogleOrganic(
  keywords: string[],
  locationCode = 2840,
  languageCode = 'en',
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keywords.length > 0 ? 'serpGoogleOrganic' : null,
    { keywords, locationCode, languageCode },
    options
  );
}

// Keywords Hooks
export function useKeywordsSearchVolume(
  keywords: string[],
  locationCode = 2840,
  languageCode = 'en',
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keywords.length > 0 ? 'keywordsSearchVolume' : null,
    { keywords, locationCode, languageCode },
    options
  );
}

export function useKeywordsForSite(
  domain: string,
  locationCode = 2840,
  languageCode = 'en',
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    domain ? 'keywordsForSite' : null,
    { domain, locationCode, languageCode },
    options
  );
}

export function useKeywordIdeas(
  keyword: string,
  locationCode = 2840,
  languageCode = 'en',
  limit = 100,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keyword ? 'keywordIdeas' : null,
    { keyword, locationCode, languageCode, limit },
    options
  );
}

export function useRelatedKeywords(
  keyword: string,
  locationCode = 2840,
  languageCode = 'en',
  limit = 100,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keyword ? 'relatedKeywords' : null,
    { keyword, locationCode, languageCode, limit },
    options
  );
}

// Competitor Hooks
export function useCompetitorsDomain(
  domain: string,
  locationCode = 2840,
  languageCode = 'en',
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    domain ? 'competitorsDomain' : null,
    { domain, locationCode, languageCode },
    options
  );
}

export function useRankedKeywords(
  domain: string,
  locationCode = 2840,
  languageCode = 'en',
  limit = 100,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    domain ? 'rankedKeywords' : null,
    { domain, locationCode, languageCode, limit },
    options
  );
}

// Backlinks Hooks
export function useBacklinksSummary(
  domain: string,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    domain ? 'backlinksSummary' : null,
    { domain },
    options
  );
}

export function useBacklinksBacklinks(
  domain: string,
  limit = 100,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    domain ? 'backlinksBacklinks' : null,
    { domain, limit },
    options
  );
}

export function useBacklinksReferringDomains(
  domain: string,
  limit = 100,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    domain ? 'backlinksReferringDomains' : null,
    { domain, limit },
    options
  );
}

// AI Optimization Hooks (LLM Mentions)
export function useLLMMentionsSearch(
  keyword: string,
  platforms?: string[],
  locationCode = 2840,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keyword ? 'llmMentionsSearch' : null,
    { keyword, platforms, locationCode },
    options
  );
}

export function useLLMMentionsTopPages(
  keyword: string,
  locationCode = 2840,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keyword ? 'llmMentionsTopPages' : null,
    { keyword, locationCode },
    options
  );
}

export function useLLMMentionsTopDomains(
  keyword: string,
  locationCode = 2840,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keyword ? 'llmMentionsTopDomains' : null,
    { keyword, locationCode },
    options
  );
}

export function useLLMMentionsAggregated(
  keyword: string,
  locationCode = 2840,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keyword ? 'llmMentionsAggregated' : null,
    { keyword, locationCode },
    options
  );
}

// OnPage Hooks
export function useOnpageLighthouse(
  url: string,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    url ? 'onpageLighthouse' : null,
    { url },
    options
  );
}

// Content Analysis Hooks
export function useContentAnalysisSearch(
  keyword: string,
  locationCode = 2840,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keyword ? 'contentAnalysisSearch' : null,
    { keyword, locationCode },
    options
  );
}

// Business Data Hooks
export function useGoogleMyBusinessInfo(
  keyword: string,
  locationCode = 2840,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    keyword ? 'googleMyBusinessInfo' : null,
    { keyword, locationCode },
    options
  );
}

export function useGoogleReviews(
  placeId: string,
  options?: UseDataForSEOOptions
) {
  return useDataForSEO(
    placeId ? 'googleReviews' : null,
    { placeId },
    options
  );
}
