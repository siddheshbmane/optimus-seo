// DataForSEO API Client
// Main client for interacting with DataForSEO APIs with mock mode support

import { dataForSEOConfig } from '@/config/api-config';
import { cache } from './cache';
import { mockMode } from './mock-mode';
import type { DataForSEOResponse } from './types';

// Import mock data providers
import { getMockSERPData } from '@/data/mock-serp';
import { getMockLLMMentions, getMockLLMResponses } from '@/data/mock-llm';
import { getMockBacklinks } from '@/data/mock-backlinks';
import { getMockKeywords } from '@/data/mock-keywords-api';

type CacheType = 'serp' | 'keywords' | 'backlinks' | 'onpage' | 'llmMentions' | 'llmResponses' | 'businessData';

interface RequestOptions {
  useCache?: boolean;
  cacheType?: CacheType;
  timeout?: number;
}

class DataForSEOClient {
  private baseUrl: string;
  private authHeader: string;
  private requestQueue: Promise<unknown>[];
  private lastRequestTime: number;

  constructor() {
    this.baseUrl = dataForSEOConfig.baseUrl;
    this.authHeader = this.createAuthHeader();
    this.requestQueue = [];
    this.lastRequestTime = 0;
  }

  /**
   * Create Basic Auth header
   */
  private createAuthHeader(): string {
    const { login, password } = dataForSEOConfig.auth;
    if (!login || !password) return '';
    const credentials = Buffer.from(`${login}:${password}`).toString('base64');
    return `Basic ${credentials}`;
  }

  /**
   * Rate limiting - ensure we don't exceed requests per second
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const minInterval = 1000 / dataForSEOConfig.rateLimit.requestsPerSecond;
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Make an API request with retry logic
   */
  private async request<T>(
    endpoint: string,
    data?: unknown[],
    options: RequestOptions = {}
  ): Promise<DataForSEOResponse<T>> {
    const { useCache = true, cacheType, timeout = 30000 } = options;

    // Convert data to cache key format
    const cacheKey = data ? (data[0] as Record<string, unknown>) : {};

    // Check cache first
    if (useCache) {
      const cached = cache.get<DataForSEOResponse<T>>(endpoint, cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Check if we should use mock data
    if (mockMode.isEnabled()) {
      return this.getMockResponse<T>(endpoint, data);
    }

    // Rate limiting
    await this.rateLimit();

    // Make the actual request
    const url = `${this.baseUrl}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= dataForSEOConfig.retry.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': this.authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // On 401 Unauthorized, credentials are invalid - fall back to mock data
          if (response.status === 401) {
            console.warn('[DataForSEO] Credentials unauthorized (401) - falling back to mock data');
            return this.getMockResponse<T>(endpoint, data);
          }
          const retryStatuses = dataForSEOConfig.retry.retryOn as readonly number[];
          if (retryStatuses.includes(response.status) && attempt < dataForSEOConfig.retry.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, dataForSEOConfig.retry.retryDelay * (attempt + 1)));
            continue;
          }
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const result: DataForSEOResponse<T> = await response.json();

        // Cache successful response
        if (useCache && result.status_code === 20000) {
          cache.set(endpoint, result, cacheKey, cacheType);
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        if (attempt < dataForSEOConfig.retry.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, dataForSEOConfig.retry.retryDelay * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Get mock response for an endpoint
   */
  private async getMockResponse<T>(endpoint: string, data?: unknown[]): Promise<DataForSEOResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    // Route to appropriate mock data provider
    if (endpoint.includes('/serp/')) {
      return getMockSERPData(data) as DataForSEOResponse<T>;
    }
    if (endpoint.includes('/llm_mentions/')) {
      return getMockLLMMentions(data) as DataForSEOResponse<T>;
    }
    if (endpoint.includes('/llm_responses/')) {
      return getMockLLMResponses(data) as DataForSEOResponse<T>;
    }
    if (endpoint.includes('/backlinks/')) {
      return getMockBacklinks(data) as DataForSEOResponse<T>;
    }
    if (endpoint.includes('/keywords')) {
      return getMockKeywords(data) as DataForSEOResponse<T>;
    }

    // Default mock response
    return {
      version: '0.1.20231001',
      status_code: 20000,
      status_message: 'Ok. (Mock Data)',
      time: new Date().toISOString(),
      cost: 0,
      tasks_count: 1,
      tasks_error: 0,
      tasks: [{
        id: 'mock-task-' + Date.now(),
        status_code: 20000,
        status_message: 'Ok.',
        time: '0.5',
        cost: 0,
        result_count: 0,
        path: [endpoint],
        data: {},
        result: [],
      }],
    } as DataForSEOResponse<T>;
  }

  // ============================================
  // SERP API Methods
  // ============================================

  async serpGoogleOrganic(keywords: string[], locationCode = 2840, languageCode = 'en') {
    const data = keywords.map(keyword => ({
      keyword,
      location_code: locationCode,
      language_code: languageCode,
    }));
    return this.request(dataForSEOConfig.endpoints.serp.google.organic, data, { cacheType: 'serp' });
  }

  // ============================================
  // Keywords Data API Methods
  // ============================================

  async keywordsSearchVolume(keywords: string[], locationCode = 2840, languageCode = 'en') {
    const data = [{
      keywords,
      location_code: locationCode,
      language_code: languageCode,
    }];
    return this.request(dataForSEOConfig.endpoints.keywords.google.searchVolume, data, { cacheType: 'keywords' });
  }

  async keywordsForSite(domain: string, locationCode = 2840, languageCode = 'en') {
    const data = [{
      target: domain,
      location_code: locationCode,
      language_code: languageCode,
    }];
    return this.request(dataForSEOConfig.endpoints.keywords.google.keywordsForSite, data, { cacheType: 'keywords' });
  }

  // ============================================
  // DataForSEO Labs API Methods
  // ============================================

  async keywordIdeas(keyword: string, locationCode = 2840, languageCode = 'en', limit = 100) {
    const data = [{
      keywords: [keyword],
      location_code: locationCode,
      language_code: languageCode,
      limit,
    }];
    return this.request(dataForSEOConfig.endpoints.labs.google.keywordIdeas, data, { cacheType: 'keywords' });
  }

  async relatedKeywords(keyword: string, locationCode = 2840, languageCode = 'en', limit = 100) {
    const data = [{
      keywords: [keyword],
      location_code: locationCode,
      language_code: languageCode,
      limit,
    }];
    return this.request(dataForSEOConfig.endpoints.labs.google.relatedKeywords, data, { cacheType: 'keywords' });
  }

  async competitorsDomain(domain: string, locationCode = 2840, languageCode = 'en') {
    const data = [{
      target: domain,
      location_code: locationCode,
      language_code: languageCode,
    }];
    return this.request(dataForSEOConfig.endpoints.labs.google.competitorsDomain, data, { cacheType: 'keywords' });
  }

  async rankedKeywords(domain: string, locationCode = 2840, languageCode = 'en', limit = 100) {
    const data = [{
      target: domain,
      location_code: locationCode,
      language_code: languageCode,
      limit,
    }];
    return this.request(dataForSEOConfig.endpoints.labs.google.rankedKeywords, data, { cacheType: 'keywords' });
  }

  // ============================================
  // Backlinks API Methods
  // ============================================

  async backlinksSummary(domain: string) {
    const data = [{ target: domain }];
    return this.request(dataForSEOConfig.endpoints.backlinks.summary, data, { cacheType: 'backlinks' });
  }

  async backlinksBacklinks(domain: string, limit = 100) {
    const data = [{ target: domain, limit }];
    return this.request(dataForSEOConfig.endpoints.backlinks.backlinks, data, { cacheType: 'backlinks' });
  }

  async backlinksReferringDomains(domain: string, limit = 100) {
    const data = [{ target: domain, limit }];
    return this.request(dataForSEOConfig.endpoints.backlinks.referringDomains, data, { cacheType: 'backlinks' });
  }

  // ============================================
  // AI Optimization API Methods (LLM Mentions)
  // ============================================

  async llmMentionsSearch(keyword: string, platforms?: string[], locationCode = 2840) {
    const data = [{
      keyword,
      platforms: platforms || ['chatgpt', 'claude', 'gemini', 'perplexity'],
      location_code: locationCode,
    }];
    return this.request(dataForSEOConfig.endpoints.aiOptimization.llmMentions.search, data, { cacheType: 'llmMentions' });
  }

  async llmMentionsTopPages(keyword: string, locationCode = 2840) {
    const data = [{
      keyword,
      location_code: locationCode,
    }];
    return this.request(dataForSEOConfig.endpoints.aiOptimization.llmMentions.topPages, data, { cacheType: 'llmMentions' });
  }

  async llmMentionsTopDomains(keyword: string, locationCode = 2840) {
    const data = [{
      keyword,
      location_code: locationCode,
    }];
    return this.request(dataForSEOConfig.endpoints.aiOptimization.llmMentions.topDomains, data, { cacheType: 'llmMentions' });
  }

  async llmMentionsAggregated(keyword: string, locationCode = 2840) {
    const data = [{
      keyword,
      location_code: locationCode,
    }];
    return this.request(dataForSEOConfig.endpoints.aiOptimization.llmMentions.aggregated, data, { cacheType: 'llmMentions' });
  }

  async llmResponsesLive(query: string, platforms?: string[]) {
    const data = [{
      query,
      platforms: platforms || ['chatgpt', 'claude', 'gemini', 'perplexity'],
    }];
    return this.request(dataForSEOConfig.endpoints.aiOptimization.llmResponses.live, data, { 
      cacheType: 'llmResponses',
      useCache: false, // Don't cache live responses
    });
  }

  async llmResponsesCompare(query: string) {
    const data = [{ query }];
    return this.request(dataForSEOConfig.endpoints.aiOptimization.llmResponses.compare, data, { 
      cacheType: 'llmResponses',
      useCache: false,
    });
  }

  // ============================================
  // OnPage API Methods
  // ============================================

  async onpageTaskPost(url: string) {
    const data = [{
      target: url,
      max_crawl_pages: 100,
      load_resources: true,
      enable_javascript: true,
    }];
    return this.request(dataForSEOConfig.endpoints.onpage.task, data, { cacheType: 'onpage' });
  }

  async onpageSummary(taskId: string) {
    return this.request(`${dataForSEOConfig.endpoints.onpage.summary}/${taskId}`, undefined, { cacheType: 'onpage' });
  }

  async onpageLighthouse(url: string) {
    const data = [{ url }];
    return this.request(dataForSEOConfig.endpoints.onpage.lighthouse, data, { cacheType: 'onpage' });
  }

  // ============================================
  // Content Analysis API Methods
  // ============================================

  async contentAnalysisSearch(keyword: string, locationCode = 2840) {
    const data = [{
      keyword,
      location_code: locationCode,
    }];
    return this.request(dataForSEOConfig.endpoints.contentAnalysis.search, data);
  }

  async contentAnalysisSentiment(texts: string[]) {
    const data = texts.map(text => ({ text }));
    return this.request(dataForSEOConfig.endpoints.contentAnalysis.sentimentAnalysis, data);
  }

  // ============================================
  // Business Data API Methods
  // ============================================

  async googleMyBusinessInfo(keyword: string, locationCode = 2840) {
    const data = [{
      keyword,
      location_code: locationCode,
    }];
    return this.request(dataForSEOConfig.endpoints.businessData.google.myBusinessInfo, data, { cacheType: 'businessData' });
  }

  async googleReviews(placeId: string) {
    const data = [{ place_id: placeId }];
    return this.request(dataForSEOConfig.endpoints.businessData.google.reviews, data, { cacheType: 'businessData' });
  }
}

// Export singleton instance
export const dataForSEOClient = new DataForSEOClient();

// Export class for testing
export { DataForSEOClient };
