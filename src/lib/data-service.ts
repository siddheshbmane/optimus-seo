// Unified Data Service
// Provides data from real APIs when available, falls back to mock data

import { features } from '@/config/features';

// Types
export interface DataServiceOptions {
  forceMock?: boolean;
  forceReal?: boolean;
}

// Check if we should use real API
export function shouldUseRealAPI(): boolean {
  return !features.mockMode && features.dataForSEO.enabled;
}

// Check if LLM is available
export function isLLMAvailable(): boolean {
  return features.llm.enabled;
}

// Generic fetcher for API calls
async function apiFetch<T>(
  endpoint: string,
  method: string,
  params: Record<string, unknown>
): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, params }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// Keywords Data Service
// ============================================

export async function getKeywordsSearchVolume(
  keywords: string[],
  locationCode = 2840,
  languageCode = 'en',
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    // Return mock data
    const { getMockKeywords } = await import('@/data/mock-keywords-api');
    return getMockKeywords([{ keywords, location_code: locationCode, language_code: languageCode }]);
  }

  return apiFetch('/api/dataforseo', 'keywordsSearchVolume', {
    keywords,
    locationCode,
    languageCode,
  });
}

export async function getKeywordIdeas(
  keyword: string,
  locationCode = 2840,
  languageCode = 'en',
  limit = 100,
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    const { getMockKeywords } = await import('@/data/mock-keywords-api');
    return getMockKeywords([{ keyword, location_code: locationCode, language_code: languageCode }]);
  }

  return apiFetch('/api/dataforseo', 'keywordIdeas', {
    keyword,
    locationCode,
    languageCode,
    limit,
  });
}

// ============================================
// SERP Data Service
// ============================================

export async function getSerpResults(
  keywords: string[],
  locationCode = 2840,
  languageCode = 'en',
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    const { getMockSERPData } = await import('@/data/mock-serp');
    return getMockSERPData([{ keywords, location_code: locationCode, language_code: languageCode }]);
  }

  return apiFetch('/api/dataforseo', 'serpGoogleOrganic', {
    keywords,
    locationCode,
    languageCode,
  });
}

// ============================================
// Backlinks Data Service
// ============================================

export async function getBacklinksSummary(
  domain: string,
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    const { getMockBacklinks } = await import('@/data/mock-backlinks');
    return getMockBacklinks([{ target: domain }]);
  }

  return apiFetch('/api/dataforseo', 'backlinksSummary', { domain });
}

export async function getBacklinksData(
  domain: string,
  limit = 100,
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    const { getMockBacklinks } = await import('@/data/mock-backlinks');
    return getMockBacklinks([{ target: domain, limit }]);
  }

  return apiFetch('/api/dataforseo', 'backlinksBacklinks', { domain, limit });
}

// ============================================
// LLM Mentions Data Service
// ============================================

export async function getLLMMentions(
  keyword: string,
  platforms?: string[],
  locationCode = 2840,
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    const { getMockLLMMentions } = await import('@/data/mock-llm');
    return getMockLLMMentions([{ keyword, platforms, location_code: locationCode }]);
  }

  return apiFetch('/api/dataforseo', 'llmMentionsSearch', {
    keyword,
    platforms,
    locationCode,
  });
}

export async function getLLMResponses(
  query: string,
  platforms?: string[],
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    const { getMockLLMResponses } = await import('@/data/mock-llm');
    return getMockLLMResponses([{ query, platforms }]);
  }

  return apiFetch('/api/dataforseo', 'llmResponsesLive', {
    query,
    platforms,
  });
}

// ============================================
// Competitor Data Service
// ============================================

export async function getCompetitorsDomain(
  domain: string,
  locationCode = 2840,
  languageCode = 'en',
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    // Return mock competitor data
    const { mockCompetitors } = await import('@/data/mock-competitors');
    return { tasks: [{ result: [{ items: mockCompetitors }] }] };
  }

  return apiFetch('/api/dataforseo', 'competitorsDomain', {
    domain,
    locationCode,
    languageCode,
  });
}

export async function getRankedKeywords(
  domain: string,
  locationCode = 2840,
  languageCode = 'en',
  limit = 100,
  options: DataServiceOptions = {}
) {
  if (options.forceMock || (!options.forceReal && !shouldUseRealAPI())) {
    const { getMockKeywords } = await import('@/data/mock-keywords-api');
    return getMockKeywords([{ target: domain, location_code: locationCode, language_code: languageCode }]);
  }

  return apiFetch('/api/dataforseo', 'rankedKeywords', {
    domain,
    locationCode,
    languageCode,
    limit,
  });
}

// ============================================
// LLM Completion Service
// ============================================

export async function generateSEOAnalysis(
  prompt: string,
  context?: string
): Promise<string> {
  if (!isLLMAvailable()) {
    return 'LLM not configured. Please add GROQ_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY to enable AI features.';
  }

  const response = await fetch('/api/llm/seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'analyze',
      params: { prompt, context },
    }),
  });

  if (!response.ok) {
    throw new Error('LLM API error');
  }

  const data = await response.json();
  return data.result;
}

export async function generateContent(
  topic: string,
  keywords: string[],
  contentType: 'blog' | 'product' | 'landing' | 'meta'
): Promise<string> {
  if (!isLLMAvailable()) {
    return 'LLM not configured. Please add API keys to enable content generation.';
  }

  const response = await fetch('/api/llm/seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'generateContent',
      params: { topic, keywords, contentType },
    }),
  });

  if (!response.ok) {
    throw new Error('LLM API error');
  }

  const data = await response.json();
  return data.result;
}

export async function analyzeContent(
  content: string,
  targetKeyword: string
): Promise<string> {
  if (!isLLMAvailable()) {
    return 'LLM not configured. Please add API keys to enable content analysis.';
  }

  const response = await fetch('/api/llm/seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'analyzeContent',
      params: { content, targetKeyword },
    }),
  });

  if (!response.ok) {
    throw new Error('LLM API error');
  }

  const data = await response.json();
  return data.result;
}

// ============================================
// Status Check
// ============================================

export async function getAPIStatus() {
  const response = await fetch('/api/status');
  return response.json();
}
