/**
 * SEO Data Hooks
 * 
 * React hooks for fetching SEO data with automatic caching and loading states.
 * Uses the SEO Data Service which handles API calls with mock fallback.
 */

'use client';

import * as React from 'react';
import {
  fetchKeywordData,
  fetchSiteAuditData,
  fetchCompetitorData,
  fetchAIVisibilityData,
  fetchBacklinksSummary,
  fetchBacklinks,
  fetchSERPData,
  fetchRankingsData,
  fetchPPCData,
  fetchGMBData,
  fetchTopicClusters,
  fetchContentIdeas,
  fetchTechnicalIssues,
  fetchTrafficData,
  fetchKeywordSearch,
  fetchOnPageCrawl,
  fetchOnPageStatus,
  type KeywordData,
  type SiteAuditData,
  type CompetitorData,
  type AIVisibilityData,
  type BacklinksSummary,
  type BacklinkData,
  type SERPData,
  type RankingData,
  type PPCData,
  type GMBData,
  type TopicCluster,
  type ContentIdea,
  type TechnicalIssue,
  type TrafficData,
} from '@/services/seo-data-service';

// Re-export types
export type { 
  KeywordData, 
  SiteAuditData, 
  CompetitorData, 
  AIVisibilityData,
  BacklinksSummary,
  BacklinkData,
  SERPData,
  RankingData,
  PPCData,
  GMBData,
  TopicCluster,
  ContentIdea,
  TechnicalIssue,
  TrafficData,
};

interface UseDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  source: 'api' | 'mock' | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching keyword research data
 */
export function useKeywordData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): UseDataResult<KeywordData[]> {
  const [data, setData] = React.useState<KeywordData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!domain) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchKeywordData(domain, locationCode, languageCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch keyword data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain, locationCode, languageCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching site audit data
 */
export function useSiteAuditData(url: string): UseDataResult<SiteAuditData> {
  const [data, setData] = React.useState<SiteAuditData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!url) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchSiteAuditData(url);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch site audit data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching competitor analysis data
 */
export function useCompetitorData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): UseDataResult<CompetitorData[]> {
  const [data, setData] = React.useState<CompetitorData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!domain) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchCompetitorData(domain, locationCode, languageCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch competitor data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain, locationCode, languageCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching AI visibility data
 */
export function useAIVisibilityData(
  keyword: string,
  locationCode: number = 2840
): UseDataResult<AIVisibilityData> {
  const [data, setData] = React.useState<AIVisibilityData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!keyword) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAIVisibilityData(keyword, locationCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI visibility data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, locationCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching backlinks summary
 */
export function useBacklinksSummary(domain: string): UseDataResult<BacklinksSummary> {
  const [data, setData] = React.useState<BacklinksSummary | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!domain) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchBacklinksSummary(domain);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backlinks summary');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching individual backlinks
 */
export function useBacklinks(
  domain: string,
  limit: number = 100
): UseDataResult<BacklinkData[]> {
  const [data, setData] = React.useState<BacklinkData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!domain) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchBacklinks(domain, limit);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backlinks');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain, limit]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching SERP data
 */
export function useSERPData(
  keywords: string[],
  locationCode: number = 2840,
  languageCode: string = 'en'
): UseDataResult<SERPData[]> {
  const [data, setData] = React.useState<SERPData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const keywordsKey = keywords.join(',');

  const fetchData = React.useCallback(async () => {
    if (!keywords.length) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchSERPData(keywords, locationCode, languageCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch SERP data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [keywordsKey, locationCode, languageCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching rankings data
 */
export function useRankingsData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en',
  limit: number = 100
): UseDataResult<RankingData[]> {
  const [data, setData] = React.useState<RankingData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!domain) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchRankingsData(domain, locationCode, languageCode, limit);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rankings data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain, locationCode, languageCode, limit]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching PPC data
 */
export function usePPCData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): UseDataResult<PPCData[]> {
  const [data, setData] = React.useState<PPCData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!domain) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchPPCData(domain, locationCode, languageCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch PPC data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain, locationCode, languageCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching GMB data
 */
export function useGMBData(
  businessName: string,
  locationCode: number = 2840
): UseDataResult<GMBData | null> {
  const [data, setData] = React.useState<GMBData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!businessName) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchGMBData(businessName, locationCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GMB data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [businessName, locationCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching topic clusters
 */
export function useTopicClusters(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): UseDataResult<TopicCluster[]> {
  const [data, setData] = React.useState<TopicCluster[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!keyword) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchTopicClusters(keyword, locationCode, languageCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topic clusters');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, locationCode, languageCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching content ideas
 */
export function useContentIdeas(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): UseDataResult<ContentIdea[]> {
  const [data, setData] = React.useState<ContentIdea[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!domain) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchContentIdeas(domain, locationCode, languageCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content ideas');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain, locationCode, languageCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching technical issues
 */
export function useTechnicalIssues(url: string): UseDataResult<TechnicalIssue[]> {
  const [data, setData] = React.useState<TechnicalIssue[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!url) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchTechnicalIssues(url);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch technical issues');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for fetching traffic data
 */
export function useTrafficData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): UseDataResult<TrafficData> {
  const [data, setData] = React.useState<TrafficData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!domain) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchTrafficData(domain, locationCode, languageCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch traffic data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain, locationCode, languageCode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, source, refetch: fetchData };
}

/**
 * Hook for keyword search (manual trigger, not auto-fetch)
 */
export function useKeywordSearch(
  locationCode: number = 2840,
  languageCode: string = 'en'
): UseDataResult<KeywordData[]> & { search: (query: string) => Promise<void> } {
  const [data, setData] = React.useState<KeywordData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<'api' | 'mock' | null>(null);

  const search = React.useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchKeywordSearch(query, locationCode, languageCode);
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search keywords');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [locationCode, languageCode]);

  const refetch = React.useCallback(async () => {}, []);

  return { data, isLoading, error, source, refetch, search };
}

/**
 * Hook for OnPage crawl (start and poll)
 */
export function useOnPageCrawl() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [progress, setProgress] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const startCrawl = React.useCallback(async (url: string): Promise<string> => {
    setIsRunning(true);
    setProgress('Starting crawl...');
    setError(null);

    try {
      const result = await fetchOnPageCrawl(url);
      setProgress('Crawl started, waiting for results...');
      return result.taskId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start crawl');
      setIsRunning(false);
      throw err;
    }
  }, []);

  const checkStatus = React.useCallback(async (taskId: string): Promise<SiteAuditData> => {
    try {
      const result = await fetchOnPageStatus(taskId);
      setProgress(result.crawlProgress === 'finished' ? 'Crawl complete!' : `Crawling... ${result.data.pagesScanned} pages scanned`);

      if (result.crawlProgress === 'finished') {
        setIsRunning(false);
      }

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check crawl status');
      setIsRunning(false);
      throw err;
    }
  }, []);

  return { isRunning, progress, error, startCrawl, checkStatus };
}
