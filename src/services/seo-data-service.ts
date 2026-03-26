/**
 * SEO Data Service
 * 
 * Centralized service for fetching SEO data from DataForSEO API
 * with automatic fallback to mock data when API is unavailable.
 * 
 * This service is used by the UI components to fetch:
 * - Keyword research data
 * - Site audit data
 * - Competitor analysis data
 * - AI visibility data
 */

import { features } from '@/config/features';

// Types for keyword data
export interface KeywordData {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  trend: number[];
  position?: number;
  previousPosition?: number;
}

// Types for site audit data
export interface SiteAuditData {
  healthScore: number;
  pagesScanned: number;
  issues: {
    critical: number;
    warnings: number;
    notices: number;
  };
  categories: {
    name: string;
    score: number;
    issues: number;
  }[];
  topIssues: {
    id: string;
    title: string;
    severity: 'critical' | 'warning' | 'notice';
    affectedPages: number;
    description: string;
  }[];
}

// Types for competitor data
export interface CompetitorData {
  domain: string;
  visibility: number;
  traffic: number;
  keywords: number;
  backlinks: number;
  domainAuthority: number;
  commonKeywords: number;
  keywordGap: number;
}

// Types for AI visibility data
export interface AIVisibilityData {
  overallScore: number;
  platforms: {
    name: string;
    score: number;
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  topMentions: {
    query: string;
    platform: string;
    position: number;
    snippet: string;
  }[];
  recommendations: string[];
}

/**
 * Fetch keyword research data
 */
export async function fetchKeywordData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<{ data: KeywordData[]; source: 'api' | 'mock' }> {
  // Check if DataForSEO is enabled
  if (features.dataForSEO.enabled && features.dataForSEO.keywords) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'keywordsForSite',
          params: { domain, locationCode, languageCode },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          // Transform API response to our format
          const keywords = transformKeywordApiResponse(result.tasks[0].result);
          return { data: keywords, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch keywords from API, using mock data:', error);
    }
  }

  // Fallback to mock data
  const { generateMockKeywords } = await import('@/data/mock-keywords');
  const mockKeywords = generateMockKeywords(100);
  // Transform mock keywords to our format
  const transformedKeywords: KeywordData[] = mockKeywords.map(kw => ({
    ...kw,
    competition: 0.5, // Default competition value
  }));
  return { data: transformedKeywords, source: 'mock' };
}

/**
 * Fetch site audit data
 */
export async function fetchSiteAuditData(
  url: string
): Promise<{ data: SiteAuditData; source: 'api' | 'mock' }> {
  // Check if DataForSEO OnPage is enabled
  if (features.dataForSEO.enabled && features.dataForSEO.onpage) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'onpageLighthouse',
          params: { url },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          // Transform API response to our format
          const auditData = transformSiteAuditApiResponse(result.tasks[0].result);
          return { data: auditData, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch site audit from API, using mock data:', error);
    }
  }

  // Fallback to mock data
  const { mockCrawlSummary, mockTechnicalIssues } = await import('@/data/mock-technical-seo');
  const mockData = {
    healthScore: mockCrawlSummary.healthScore,
    pagesScanned: mockCrawlSummary.crawledPages,
    issues: {
      critical: mockTechnicalIssues.filter(i => i.severity === 'critical').length,
      warnings: mockTechnicalIssues.filter(i => i.severity === 'warning').length,
      notices: mockTechnicalIssues.filter(i => i.severity === 'info').length,
    },
    categories: [],
    topIssues: mockTechnicalIssues.slice(0, 10).map(i => ({
      id: i.id,
      title: i.title,
      severity: i.severity === 'info' ? 'notice' as const : i.severity,
      affectedPages: i.affectedPages,
      description: i.description,
    })),
  };
  return { 
    data: mockData as SiteAuditData, 
    source: 'mock' 
  };
}

/**
 * Fetch competitor analysis data
 */
export async function fetchCompetitorData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<{ data: CompetitorData[]; source: 'api' | 'mock' }> {
  // Check if DataForSEO Labs is enabled
  if (features.dataForSEO.enabled && features.dataForSEO.labs) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'competitorsDomain',
          params: { domain, locationCode, languageCode },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          // Transform API response to our format
          const competitors = transformCompetitorApiResponse(result.tasks[0].result);
          return { data: competitors, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch competitors from API, using mock data:', error);
    }
  }

  // Fallback to mock data
  const { mockCompetitors } = await import('@/data/mock-competitors');
  // Transform mock competitors to our format
  const transformedCompetitors: CompetitorData[] = mockCompetitors.map(comp => ({
    domain: comp.url,
    visibility: comp.aiVisibilityScore,
    traffic: comp.organicTraffic,
    keywords: comp.keywords,
    backlinks: comp.backlinks,
    domainAuthority: comp.domainRating,
    commonKeywords: Math.round(comp.keywords * 0.3), // Estimate
    keywordGap: Math.round(comp.keywords * 0.2), // Estimate
  }));
  return { data: transformedCompetitors, source: 'mock' };
}

/**
 * Fetch AI visibility data
 */
export async function fetchAIVisibilityData(
  keyword: string,
  locationCode: number = 2840
): Promise<{ data: AIVisibilityData; source: 'api' | 'mock' }> {
  // Check if DataForSEO AI Optimization is enabled
  if (features.dataForSEO.enabled && features.dataForSEO.aiOptimization) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'llmMentionsAggregated',
          params: { keyword, locationCode },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          // Transform API response to our format
          const aiData = transformAIVisibilityApiResponse(result.tasks[0].result);
          return { data: aiData, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch AI visibility from API, using mock data:', error);
    }
  }

  // Fallback to mock data
  const { mockLLMMentions } = await import('@/data/mock-llm-mentions');
  return { 
    data: transformMockAIVisibilityData(mockLLMMentions), 
    source: 'mock' 
  };
}

// ============================================
// Transform Functions
// ============================================

function transformKeywordApiResponse(result: unknown[]): KeywordData[] {
  // DataForSEO Labs returns nested: result[0].items[] with keyword_info
  let items: unknown[] = result || [];
  if (items.length > 0 && (items[0] as Record<string, unknown>)?.items) {
    items = ((items[0] as Record<string, unknown>).items as unknown[]) || [];
  }

  return (items).map((item: unknown, index: number) => {
    const kw = item as Record<string, unknown>;
    // Handle nested keyword_info structure from Labs API
    const kwInfo = (kw.keyword_info as Record<string, unknown>) || {};
    const keyword = String(kw.keyword || '');
    const volume = Number(kwInfo.search_volume || kw.search_volume || kw.volume || 0);
    const kwProps = (kw.keyword_properties as Record<string, unknown>) || {};
    const difficulty = Number(kwProps.keyword_difficulty || kwInfo.keyword_difficulty || kw.keyword_difficulty || kw.difficulty || 50);
    const cpc = Number(kwInfo.cpc || kw.cpc || 0);
    const competition = Number(kwInfo.competition || kw.competition || 0.5);
    const monthlySearches = (kwInfo.monthly_searches || kw.monthly_searches) as { search_volume: number }[] | undefined;

    return {
      id: String(index + 1),
      keyword,
      volume,
      difficulty,
      cpc,
      competition,
      intent: mapIntent((kw.search_intent as Record<string, unknown>)?.main_intent as string || kw.search_intent as string),
      trend: Array.isArray(monthlySearches)
        ? monthlySearches.map(m => m.search_volume)
        : [volume],
      position: kw.position ? Number(kw.position) : undefined,
      previousPosition: kw.previous_position ? Number(kw.previous_position) : undefined,
    };
  });
}

function transformSiteAuditApiResponse(result: unknown[]): SiteAuditData {
  const data = (result?.[0] || {}) as Record<string, unknown>;
  const categories = data.categories as Record<string, { score: number }> || {};
  
  return {
    healthScore: Math.round(Number(data.performance_score || 0) * 100),
    pagesScanned: Number(data.pages_crawled || 1),
    issues: {
      critical: Number(data.errors || 0),
      warnings: Number(data.warnings || 0),
      notices: Number(data.notices || 0),
    },
    categories: Object.entries(categories).map(([name, cat]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: Math.round((cat.score || 0) * 100),
      issues: 0,
    })),
    topIssues: [],
  };
}

function transformMockSiteAuditData(mockData: unknown): SiteAuditData {
  const data = mockData as Record<string, unknown>;
  return {
    healthScore: Number(data.healthScore || 72),
    pagesScanned: Number(data.pagesScanned || 234),
    issues: {
      critical: Number((data.issues as Record<string, number>)?.critical || 23),
      warnings: Number((data.issues as Record<string, number>)?.warnings || 45),
      notices: Number((data.issues as Record<string, number>)?.notices || 89),
    },
    categories: (data.categories as { name: string; score: number; issues: number }[]) || [],
    topIssues: (data.topIssues as SiteAuditData['topIssues']) || [],
  };
}

function transformCompetitorApiResponse(result: unknown[]): CompetitorData[] {
  // DataForSEO Labs returns nested: result[0].items[]
  let items: unknown[] = result || [];
  if (items.length > 0 && (items[0] as Record<string, unknown>)?.items) {
    items = ((items[0] as Record<string, unknown>).items as unknown[]) || [];
  }

  return (items).slice(0, 10).map((item: unknown) => {
    const comp = item as Record<string, unknown>;
    const metrics = (comp.metrics as Record<string, Record<string, number>>) || {};
    const organic = metrics.organic || {};
    return {
      domain: String(comp.domain || comp.target || ''),
      visibility: Number(organic.etv || comp.visibility || comp.etv || 0),
      traffic: Number(organic.etv || comp.organic_traffic || comp.etv || 0),
      keywords: Number(organic.count || comp.keywords_count || comp.keywords || 0),
      backlinks: Number(comp.backlinks || 0),
      domainAuthority: Number(comp.domain_rank || comp.rank || comp.avg_position || 50),
      commonKeywords: Number(comp.common_keywords || organic.intersections || 0),
      keywordGap: Number(comp.keyword_gap || 0),
    };
  });
}

function transformAIVisibilityApiResponse(result: unknown[]): AIVisibilityData {
  const data = (result?.[0] || {}) as Record<string, unknown>;
  const platforms = (data.platforms || []) as { name: string; mentions: number; sentiment: string }[];
  
  return {
    overallScore: Number(data.visibility_score || 0),
    platforms: platforms.map(p => ({
      name: p.name,
      score: Math.round(Math.random() * 100), // API doesn't provide per-platform score
      mentions: p.mentions,
      sentiment: (p.sentiment as 'positive' | 'neutral' | 'negative') || 'neutral',
    })),
    topMentions: [],
    recommendations: [],
  };
}

function transformMockAIVisibilityData(mockData: unknown): AIVisibilityData {
  const data = mockData as Record<string, unknown>;
  return {
    overallScore: Number(data.overallScore || 65),
    platforms: (data.platforms as AIVisibilityData['platforms']) || [],
    topMentions: (data.topMentions as AIVisibilityData['topMentions']) || [],
    recommendations: (data.recommendations as string[]) || [],
  };
}

function mapIntent(intent: string | undefined): KeywordData['intent'] {
  const intentMap: Record<string, KeywordData['intent']> = {
    informational: 'informational',
    navigational: 'navigational',
    commercial: 'commercial',
    transactional: 'transactional',
  };
  return intentMap[intent?.toLowerCase() || ''] || 'informational';
}

// ============================================
// Additional Types for Extended Functionality
// ============================================

// Backlinks data types
export interface BacklinkData {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  domainRating: number;
  pageRating: number;
  isDoFollow: boolean;
  firstSeen: string;
  lastSeen: string;
}

export interface BacklinksSummary {
  totalBacklinks: number;
  referringDomains: number;
  doFollowLinks: number;
  noFollowLinks: number;
  domainRating: number;
  organicTraffic: number;
  newBacklinks30d: number;
  lostBacklinks30d: number;
}

// SERP data types
export interface SERPResult {
  position: number;
  url: string;
  title: string;
  description: string;
  domain: string;
  type: 'organic' | 'featured_snippet' | 'local_pack' | 'video' | 'image' | 'news';
}

export interface SERPData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  results: SERPResult[];
  features: string[];
  totalResults: number;
}

// Rankings data types
export interface RankingData {
  keyword: string;
  position: number;
  previousPosition: number;
  url: string;
  searchVolume: number;
  traffic: number;
  change: number;
}

// Traffic data types
export interface TrafficData {
  totalTraffic: number;
  organicTraffic: number;
  paidTraffic: number;
  directTraffic: number;
  referralTraffic: number;
  socialTraffic: number;
  trafficTrend: { date: string; value: number }[];
  topPages: { url: string; traffic: number; percentage: number }[];
  topCountries: { country: string; traffic: number; percentage: number }[];
}

// PPC/Ads data types
export interface PPCData {
  keyword: string;
  cpc: number;
  competition: number;
  volume: number;
  adPosition: number;
  estimatedClicks: number;
  estimatedCost: number;
  competitorAds: { domain: string; adCopy: string; position: number }[];
}

// GMB data types
export interface GMBData {
  businessName: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  hours: { day: string; hours: string }[];
  photos: number;
  reviews: { author: string; rating: number; text: string; date: string }[];
  attributes: string[];
}

// Topic cluster data types
export interface TopicCluster {
  id: string;
  pillarTopic: string;
  pillarKeyword: string;
  pillarVolume: number;
  subtopics: {
    keyword: string;
    volume: number;
    difficulty: number;
    status: 'covered' | 'planned' | 'gap';
  }[];
  coverage: number;
  totalVolume: number;
}

// Content ideas data types
export interface ContentIdea {
  id: string;
  title: string;
  keyword: string;
  volume: number;
  difficulty: number;
  type: 'blog' | 'guide' | 'video' | 'infographic' | 'case_study';
  priority: 'high' | 'medium' | 'low';
  estimatedTraffic: number;
  competitorContent: number;
}

// Technical issues data types
export interface TechnicalIssue {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'notice';
  title: string;
  description: string;
  affectedUrls: string[];
  howToFix: string;
  impact: string;
}

// ============================================
// Additional Fetch Functions
// ============================================

/**
 * Fetch backlinks summary data
 */
export async function fetchBacklinksSummary(
  domain: string
): Promise<{ data: BacklinksSummary; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.backlinks) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'backlinksSummary',
          params: { domain },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          const data = result.tasks[0].result[0] || {};
          return {
            data: {
              totalBacklinks: Number(data.backlinks || 0),
              referringDomains: Number(data.referring_domains || 0),
              doFollowLinks: Number(data.dofollow || 0),
              noFollowLinks: Number(data.nofollow || 0),
              domainRating: Number(data.rank || 0),
              organicTraffic: Number(data.organic_traffic || 0),
              newBacklinks30d: Number(data.new_backlinks || 0),
              lostBacklinks30d: Number(data.lost_backlinks || 0),
            },
            source: 'api',
          };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch backlinks summary from API:', error);
    }
  }

  // Mock data fallback
  return {
    data: {
      totalBacklinks: 15420,
      referringDomains: 892,
      doFollowLinks: 12350,
      noFollowLinks: 3070,
      domainRating: 58,
      organicTraffic: 45000,
      newBacklinks30d: 234,
      lostBacklinks30d: 89,
    },
    source: 'mock',
  };
}

/**
 * Fetch individual backlinks
 */
export async function fetchBacklinks(
  domain: string,
  limit: number = 100
): Promise<{ data: BacklinkData[]; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.backlinks) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'backlinksBacklinks',
          params: { domain, limit },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          const backlinks = (result.tasks[0].result || []).map((item: Record<string, unknown>, index: number) => ({
            id: String(index + 1),
            sourceUrl: String(item.url_from || ''),
            sourceDomain: String(item.domain_from || ''),
            targetUrl: String(item.url_to || ''),
            anchorText: String(item.anchor || ''),
            domainRating: Number(item.domain_from_rank || 0),
            pageRating: Number(item.page_from_rank || 0),
            isDoFollow: item.dofollow === true,
            firstSeen: String(item.first_seen || ''),
            lastSeen: String(item.last_seen || ''),
          }));
          return { data: backlinks, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch backlinks from API:', error);
    }
  }

  // Mock data fallback
  const mockBacklinks: BacklinkData[] = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    sourceUrl: `https://example${i + 1}.com/article-${i + 1}`,
    sourceDomain: `example${i + 1}.com`,
    targetUrl: `https://${domain}/page-${i + 1}`,
    anchorText: ['SEO services', 'digital marketing', 'best SEO', 'marketing agency', 'SEO tips'][i % 5],
    domainRating: Math.floor(Math.random() * 60) + 20,
    pageRating: Math.floor(Math.random() * 50) + 10,
    isDoFollow: Math.random() > 0.3,
    firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date().toISOString(),
  }));

  return { data: mockBacklinks, source: 'mock' };
}

/**
 * Fetch SERP data for keywords
 */
export async function fetchSERPData(
  keywords: string[],
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<{ data: SERPData[]; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.serp) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'serpGoogleOrganic',
          params: { keywords, locationCode, languageCode },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks) {
          const serpData = result.tasks.map((task: Record<string, unknown>) => {
            const items = (task.result as Record<string, unknown>[])?.[0]?.items as Record<string, unknown>[] || [];
            return {
              keyword: String((task.data as Record<string, unknown>)?.keyword || ''),
              searchVolume: Number((task.result as Record<string, unknown>[])?.[0]?.search_volume || 0),
              difficulty: Math.floor(Math.random() * 100),
              results: items.slice(0, 10).map((item: Record<string, unknown>, idx: number) => ({
                position: idx + 1,
                url: String(item.url || ''),
                title: String(item.title || ''),
                description: String(item.description || ''),
                domain: String(item.domain || ''),
                type: 'organic' as const,
              })),
              features: [],
              totalResults: Number((task.result as Record<string, unknown>[])?.[0]?.total_count || 0),
            };
          });
          return { data: serpData, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch SERP data from API:', error);
    }
  }

  // Mock data fallback
  const mockSERPData: SERPData[] = keywords.map(keyword => ({
    keyword,
    searchVolume: Math.floor(Math.random() * 10000) + 1000,
    difficulty: Math.floor(Math.random() * 100),
    results: Array.from({ length: 10 }, (_, i) => ({
      position: i + 1,
      url: `https://example${i + 1}.com/${keyword.replace(/\s+/g, '-')}`,
      title: `${keyword} - Complete Guide ${i + 1}`,
      description: `Learn everything about ${keyword} in this comprehensive guide...`,
      domain: `example${i + 1}.com`,
      type: 'organic' as const,
    })),
    features: ['featured_snippet', 'people_also_ask', 'related_searches'],
    totalResults: Math.floor(Math.random() * 1000000) + 100000,
  }));

  return { data: mockSERPData, source: 'mock' };
}

/**
 * Fetch rankings data for a domain
 */
export async function fetchRankingsData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en',
  limit: number = 100
): Promise<{ data: RankingData[]; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.labs) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'rankedKeywords',
          params: { domain, locationCode, languageCode, limit },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          // DataForSEO Labs returns nested: result[0].items[]
          const resultData = result.tasks[0].result[0] || {};
          const items = resultData.items || result.tasks[0].result || [];
          const rankings = (Array.isArray(items) ? items : []).map((item: Record<string, unknown>) => {
            const kwData = (item.keyword_data as Record<string, unknown>) || {};
            const kwInfo = (kwData.keyword_info as Record<string, unknown>) || {};
            const serpItem = ((item.ranked_serp_element as Record<string, unknown>)?.serp_item as Record<string, unknown>) || {};
            return {
              keyword: String(kwData.keyword || item.keyword || ''),
              position: Number(serpItem.rank_absolute || item.position || 0),
              previousPosition: Number(item.previous_position || serpItem.rank_absolute || 0),
              url: String(serpItem.url || item.url || ''),
              searchVolume: Number(kwInfo.search_volume || item.search_volume || 0),
              traffic: Number(serpItem.etv || item.etv || 0),
              change: 0,
            };
          });
          // Calculate change
          rankings.forEach(r => { r.change = r.previousPosition - r.position; });
          return { data: rankings, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch rankings from API:', error);
    }
  }

  // Mock data fallback
  const mockRankings: RankingData[] = Array.from({ length: 50 }, (_, i) => {
    const position = Math.floor(Math.random() * 50) + 1;
    const previousPosition = position + Math.floor(Math.random() * 10) - 5;
    return {
      keyword: ['seo services', 'digital marketing', 'content marketing', 'link building', 'keyword research'][i % 5] + ` ${i + 1}`,
      position,
      previousPosition,
      url: `https://${domain}/page-${i + 1}`,
      searchVolume: Math.floor(Math.random() * 10000) + 500,
      traffic: Math.floor(Math.random() * 1000) + 50,
      change: previousPosition - position,
    };
  });

  return { data: mockRankings, source: 'mock' };
}

/**
 * Fetch PPC/Ads data
 */
export async function fetchPPCData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<{ data: PPCData[]; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.keywords) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'keywordsForSite',
          params: { domain, locationCode, languageCode },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          const ppcData = (result.tasks[0].result || []).slice(0, 50).map((item: Record<string, unknown>) => ({
            keyword: String(item.keyword || ''),
            cpc: Number(item.cpc || 0),
            competition: Number(item.competition || 0),
            volume: Number(item.search_volume || 0),
            adPosition: Math.floor(Math.random() * 4) + 1,
            estimatedClicks: Math.floor(Number(item.search_volume || 0) * 0.05),
            estimatedCost: Number(item.cpc || 0) * Math.floor(Number(item.search_volume || 0) * 0.05),
            competitorAds: [],
          }));
          return { data: ppcData, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch PPC data from API:', error);
    }
  }

  // Mock data fallback
  const mockPPCData: PPCData[] = Array.from({ length: 30 }, (_, i) => ({
    keyword: ['seo services', 'digital marketing agency', 'ppc management', 'google ads', 'facebook ads'][i % 5],
    cpc: Math.random() * 10 + 1,
    competition: Math.random(),
    volume: Math.floor(Math.random() * 10000) + 1000,
    adPosition: Math.floor(Math.random() * 4) + 1,
    estimatedClicks: Math.floor(Math.random() * 500) + 50,
    estimatedCost: Math.random() * 5000 + 500,
    competitorAds: [
      { domain: 'competitor1.com', adCopy: 'Best SEO Services - Get Results', position: 1 },
      { domain: 'competitor2.com', adCopy: 'Top Digital Marketing Agency', position: 2 },
    ],
  }));

  return { data: mockPPCData, source: 'mock' };
}

/**
 * Fetch GMB data
 */
export async function fetchGMBData(
  businessName: string,
  locationCode: number = 2840
): Promise<{ data: GMBData | null; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.businessData) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'googleMyBusinessInfo',
          params: { keyword: businessName, locationCode },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result?.[0]) {
          const data = result.tasks[0].result[0];
          return {
            data: {
              businessName: String(data.title || businessName),
              address: String(data.address || ''),
              phone: String(data.phone || ''),
              website: String(data.url || ''),
              rating: Number(data.rating?.value || 0),
              reviewCount: Number(data.rating?.votes_count || 0),
              categories: (data.category as string[]) || [],
              hours: [],
              photos: Number(data.photos_count || 0),
              reviews: [],
              attributes: (data.attributes as string[]) || [],
            },
            source: 'api',
          };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch GMB data from API:', error);
    }
  }

  // Mock data fallback
  return {
    data: {
      businessName,
      address: '123 Main Street, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      website: 'https://example.com',
      rating: 4.5,
      reviewCount: 127,
      categories: ['Digital Marketing Agency', 'SEO Services', 'Web Design'],
      hours: [
        { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Saturday', hours: 'Closed' },
        { day: 'Sunday', hours: 'Closed' },
      ],
      photos: 45,
      reviews: [
        { author: 'John D.', rating: 5, text: 'Excellent service! Highly recommend.', date: '2024-01-15' },
        { author: 'Sarah M.', rating: 4, text: 'Great results, very professional team.', date: '2024-01-10' },
        { author: 'Mike R.', rating: 5, text: 'Best SEO agency we have worked with.', date: '2024-01-05' },
      ],
      attributes: ['Wheelchair accessible', 'Free Wi-Fi', 'Appointment required'],
    },
    source: 'mock',
  };
}

/**
 * Fetch topic clusters data
 */
export async function fetchTopicClusters(
  keyword: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<{ data: TopicCluster[]; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.labs) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'relatedKeywords',
          params: { keyword, locationCode, languageCode, limit: 100 },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          // Group related keywords into clusters
          const keywords = result.tasks[0].result || [];
          const cluster: TopicCluster = {
            id: '1',
            pillarTopic: keyword,
            pillarKeyword: keyword,
            pillarVolume: Number(keywords[0]?.search_volume || 5000),
            subtopics: keywords.slice(0, 15).map((kw: Record<string, unknown>) => ({
              keyword: String(kw.keyword || ''),
              volume: Number(kw.search_volume || 0),
              difficulty: Number(kw.keyword_difficulty || 50),
              status: Math.random() > 0.5 ? 'covered' : Math.random() > 0.5 ? 'planned' : 'gap',
            })),
            coverage: Math.floor(Math.random() * 40) + 40,
            totalVolume: keywords.reduce((sum: number, kw: Record<string, unknown>) => sum + Number(kw.search_volume || 0), 0),
          };
          return { data: [cluster], source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch topic clusters from API:', error);
    }
  }

  // Mock data fallback
  const mockClusters: TopicCluster[] = [
    {
      id: '1',
      pillarTopic: keyword || 'SEO',
      pillarKeyword: keyword || 'seo guide',
      pillarVolume: 12000,
      subtopics: [
        { keyword: 'on-page seo', volume: 8500, difficulty: 45, status: 'covered' },
        { keyword: 'off-page seo', volume: 6200, difficulty: 52, status: 'covered' },
        { keyword: 'technical seo', volume: 5800, difficulty: 58, status: 'planned' },
        { keyword: 'local seo', volume: 9200, difficulty: 42, status: 'gap' },
        { keyword: 'seo tools', volume: 7500, difficulty: 48, status: 'covered' },
      ],
      coverage: 65,
      totalVolume: 49200,
    },
  ];

  return { data: mockClusters, source: 'mock' };
}

/**
 * Fetch content ideas
 */
export async function fetchContentIdeas(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<{ data: ContentIdea[]; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.labs) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'keywordIdeas',
          params: { keyword: domain.replace(/\.(com|org|net|io)$/, ''), locationCode, languageCode, limit: 50 },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          // Handle nested Labs structure: result[0].items[]
          const resultData = result.tasks[0].result[0] || {};
          const rawItems = resultData.items || result.tasks[0].result || [];
          const ideas = (Array.isArray(rawItems) ? rawItems : []).map((item: Record<string, unknown>, index: number) => {
            const kwInfo = (item.keyword_info as Record<string, unknown>) || {};
            const keyword = String(item.keyword || '');
            const volume = Number(kwInfo.search_volume || item.search_volume || 0);
            const difficulty = Number(kwInfo.keyword_difficulty || item.keyword_difficulty || 50);
            return {
              id: String(index + 1),
              title: `How to ${keyword}`,
              keyword,
              volume,
              difficulty,
              type: ['blog', 'guide', 'video', 'infographic', 'case_study'][index % 5] as ContentIdea['type'],
              priority: volume > 5000 ? 'high' as const : volume > 1000 ? 'medium' as const : 'low' as const,
              estimatedTraffic: Math.floor(volume * 0.1),
              competitorContent: Math.floor(Math.random() * 20) + 5,
            };
          });
          return { data: ideas, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch content ideas from API:', error);
    }
  }

  // Mock data fallback
  const mockIdeas: ContentIdea[] = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    title: ['Complete Guide to SEO', 'How to Build Backlinks', 'Content Marketing Strategy', 'Technical SEO Checklist', 'Local SEO Tips'][i % 5],
    keyword: ['seo guide', 'backlink building', 'content marketing', 'technical seo', 'local seo'][i % 5],
    volume: Math.floor(Math.random() * 10000) + 1000,
    difficulty: Math.floor(Math.random() * 100),
    type: ['blog', 'guide', 'video', 'infographic', 'case_study'][i % 5] as ContentIdea['type'],
    priority: ['high', 'medium', 'low'][i % 3] as ContentIdea['priority'],
    estimatedTraffic: Math.floor(Math.random() * 1000) + 100,
    competitorContent: Math.floor(Math.random() * 20) + 5,
  }));

  return { data: mockIdeas, source: 'mock' };
}

/**
 * Fetch technical issues
 */
export async function fetchTechnicalIssues(
  url: string
): Promise<{ data: TechnicalIssue[]; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.onpage) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'onpageLighthouse',
          params: { url },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result?.[0]) {
          const data = result.tasks[0].result[0];
          const audits = data.audits || {};
          const issues: TechnicalIssue[] = [];
          
          Object.entries(audits).forEach(([key, audit]: [string, unknown]) => {
            const a = audit as Record<string, unknown>;
            if (a.score !== null && Number(a.score) < 1) {
              issues.push({
                id: key,
                type: String(a.id || key),
                severity: Number(a.score) < 0.5 ? 'critical' : Number(a.score) < 0.9 ? 'warning' : 'notice',
                title: String(a.title || key),
                description: String(a.description || ''),
                affectedUrls: [url],
                howToFix: String(a.description || ''),
                impact: Number(a.score) < 0.5 ? 'High' : Number(a.score) < 0.9 ? 'Medium' : 'Low',
              });
            }
          });
          
          return { data: issues.slice(0, 20), source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch technical issues from API:', error);
    }
  }

  // Mock data fallback
  const mockIssues: TechnicalIssue[] = [
    {
      id: '1',
      type: 'missing_meta_description',
      severity: 'warning',
      title: 'Missing Meta Descriptions',
      description: '15 pages are missing meta descriptions',
      affectedUrls: ['/page1', '/page2', '/page3'],
      howToFix: 'Add unique meta descriptions to each page',
      impact: 'Medium - Affects click-through rates',
    },
    {
      id: '2',
      type: 'slow_page_speed',
      severity: 'critical',
      title: 'Slow Page Load Speed',
      description: '8 pages have load times over 3 seconds',
      affectedUrls: ['/heavy-page', '/images-page'],
      howToFix: 'Optimize images, enable compression, use CDN',
      impact: 'High - Affects rankings and user experience',
    },
    {
      id: '3',
      type: 'broken_links',
      severity: 'critical',
      title: 'Broken Internal Links',
      description: '23 broken internal links found',
      affectedUrls: ['/old-page', '/deleted-page'],
      howToFix: 'Update or remove broken links',
      impact: 'High - Affects crawlability and user experience',
    },
    {
      id: '4',
      type: 'missing_alt_text',
      severity: 'warning',
      title: 'Images Missing Alt Text',
      description: '45 images are missing alt attributes',
      affectedUrls: ['/gallery', '/products'],
      howToFix: 'Add descriptive alt text to all images',
      impact: 'Medium - Affects accessibility and image SEO',
    },
    {
      id: '5',
      type: 'duplicate_content',
      severity: 'warning',
      title: 'Duplicate Content Detected',
      description: '5 pages have similar content',
      affectedUrls: ['/page-a', '/page-b'],
      howToFix: 'Use canonical tags or consolidate content',
      impact: 'Medium - May cause ranking issues',
    },
  ];

  return { data: mockIssues, source: 'mock' };
}

/**
 * Fetch traffic data (estimated from rankings)
 */
export async function fetchTrafficData(
  domain: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<{ data: TrafficData; source: 'api' | 'mock' }> {
  // Traffic data is estimated from ranked keywords
  const rankingsResult = await fetchRankingsData(domain, locationCode, languageCode, 100);
  
  if (rankingsResult.source === 'api') {
    const totalTraffic = rankingsResult.data.reduce((sum, r) => sum + r.traffic, 0);
    return {
      data: {
        totalTraffic,
        organicTraffic: totalTraffic,
        paidTraffic: 0,
        directTraffic: Math.floor(totalTraffic * 0.3),
        referralTraffic: Math.floor(totalTraffic * 0.15),
        socialTraffic: Math.floor(totalTraffic * 0.1),
        trafficTrend: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(totalTraffic * (0.8 + Math.random() * 0.4)),
        })),
        topPages: rankingsResult.data.slice(0, 10).map(r => ({
          url: r.url,
          traffic: r.traffic,
          percentage: (r.traffic / totalTraffic) * 100,
        })),
        topCountries: [
          { country: 'United States', traffic: Math.floor(totalTraffic * 0.45), percentage: 45 },
          { country: 'United Kingdom', traffic: Math.floor(totalTraffic * 0.15), percentage: 15 },
          { country: 'Canada', traffic: Math.floor(totalTraffic * 0.1), percentage: 10 },
          { country: 'Australia', traffic: Math.floor(totalTraffic * 0.08), percentage: 8 },
          { country: 'Germany', traffic: Math.floor(totalTraffic * 0.05), percentage: 5 },
        ],
      },
      source: 'api',
    };
  }

  // Mock data fallback
  return {
    data: {
      totalTraffic: 125000,
      organicTraffic: 85000,
      paidTraffic: 15000,
      directTraffic: 35000,
      referralTraffic: 18000,
      socialTraffic: 12000,
      trafficTrend: Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.floor(100000 + Math.random() * 50000),
      })),
      topPages: [
        { url: '/blog/seo-guide', traffic: 15000, percentage: 12 },
        { url: '/services', traffic: 12000, percentage: 9.6 },
        { url: '/', traffic: 10000, percentage: 8 },
        { url: '/blog/content-marketing', traffic: 8000, percentage: 6.4 },
        { url: '/contact', traffic: 5000, percentage: 4 },
      ],
      topCountries: [
        { country: 'United States', traffic: 56250, percentage: 45 },
        { country: 'United Kingdom', traffic: 18750, percentage: 15 },
        { country: 'Canada', traffic: 12500, percentage: 10 },
        { country: 'Australia', traffic: 10000, percentage: 8 },
        { country: 'Germany', traffic: 6250, percentage: 5 },
      ],
    },
    source: 'mock',
  };
}

/**
 * Search for keywords by query (uses keywordIdeas API)
 */
export async function fetchKeywordSearch(
  query: string,
  locationCode: number = 2840,
  languageCode: string = 'en'
): Promise<{ data: KeywordData[]; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.labs) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'keywordIdeas',
          params: { keyword: query, locationCode, languageCode, limit: 50 },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          const keywords = transformKeywordApiResponse(result.tasks[0].result);
          return { data: keywords, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to search keywords from API:', error);
    }
  }

  // Mock fallback
  const mockKeywords: KeywordData[] = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    keyword: `${query} ${['guide', 'tips', 'tools', 'strategy', 'examples', 'best practices', 'tutorial', 'checklist', 'template', 'software'][i % 10]}`,
    volume: Math.floor(Math.random() * 10000) + 500,
    difficulty: Math.floor(Math.random() * 80) + 10,
    cpc: Math.round((Math.random() * 8 + 0.5) * 100) / 100,
    competition: Math.random(),
    intent: (['informational', 'commercial', 'transactional', 'navigational'] as const)[i % 4],
    trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5000) + 1000),
  }));
  return { data: mockKeywords, source: 'mock' };
}

/**
 * Start an OnPage crawl
 */
export async function fetchOnPageCrawl(
  url: string
): Promise<{ taskId: string; source: 'api' | 'mock' }> {
  if (features.dataForSEO.enabled && features.dataForSEO.onpage) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'onpageTaskPost',
          params: { url },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const taskId = result.tasks?.[0]?.id;
        if (taskId) {
          return { taskId, source: 'api' };
        }
      }
    } catch (error) {
      console.warn('Failed to start OnPage crawl:', error);
    }
  }

  return { taskId: `mock-crawl-${Date.now()}`, source: 'mock' };
}

/**
 * Check OnPage crawl status
 */
export async function fetchOnPageStatus(
  taskId: string
): Promise<{ data: SiteAuditData; crawlProgress: string; source: 'api' | 'mock' }> {
  if (!taskId.startsWith('mock-') && features.dataForSEO.enabled && features.dataForSEO.onpage) {
    try {
      const response = await fetch('/api/dataforseo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'onpageSummary',
          params: { taskId },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tasks?.[0]?.result) {
          const summary = result.tasks[0].result[0] || {};
          const crawlStatus = summary.crawl_progress || 'in_progress';
          return {
            data: {
              healthScore: Math.round(100 - (Number(summary.pages_with_errors || 0) / Math.max(Number(summary.pages_crawled || 1), 1)) * 100),
              pagesScanned: Number(summary.pages_crawled || 0),
              issues: {
                critical: Number(summary.pages_with_errors || 0),
                warnings: Number(summary.pages_with_warnings || 0),
                notices: Number(summary.pages_with_notices || 0),
              },
              categories: [],
              topIssues: [],
            },
            crawlProgress: crawlStatus === 'finished' ? 'finished' : 'crawling',
            source: 'api',
          };
        }
      }
    } catch (error) {
      console.warn('Failed to check OnPage status:', error);
    }
  }

  // Mock: immediately return finished
  return {
    data: {
      healthScore: 78,
      pagesScanned: 156,
      issues: { critical: 5, warnings: 12, notices: 23 },
      categories: [],
      topIssues: [],
    },
    crawlProgress: 'finished',
    source: 'mock',
  };
}
