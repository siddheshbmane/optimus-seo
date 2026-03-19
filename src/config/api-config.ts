// API Configuration for Optimus SEO
// Centralized configuration for all external APIs

import { env } from './env';

// DataForSEO API Configuration
export const dataForSEOConfig = {
  baseUrl: env.DATAFORSEO_API_URL,
  auth: {
    login: env.DATAFORSEO_LOGIN,
    password: env.DATAFORSEO_PASSWORD,
  },
  endpoints: {
    // SERP API
    serp: {
      google: {
        organic: '/serp/google/organic/live/advanced',
        maps: '/serp/google/maps/live/advanced',
        news: '/serp/google/news/live/advanced',
        images: '/serp/google/images/live/advanced',
      },
      bing: {
        organic: '/serp/bing/organic/live/advanced',
      },
    },
    // Keywords Data API
    keywords: {
      google: {
        searchVolume: '/keywords_data/google_ads/search_volume/live',
        keywordsForSite: '/keywords_data/google_ads/keywords_for_site/live',
        keywordsForKeywords: '/keywords_data/google_ads/keywords_for_keywords/live',
      },
      bing: {
        searchVolume: '/keywords_data/bing/search_volume/live',
      },
    },
    // DataForSEO Labs API
    labs: {
      google: {
        keywordIdeas: '/dataforseo_labs/google/keyword_ideas/live',
        relatedKeywords: '/dataforseo_labs/google/related_keywords/live',
        keywordSuggestions: '/dataforseo_labs/google/keyword_suggestions/live',
        competitorsDomain: '/dataforseo_labs/google/competitors_domain/live',
        domainRankOverview: '/dataforseo_labs/google/domain_rank_overview/live',
        rankedKeywords: '/dataforseo_labs/google/ranked_keywords/live',
        serpCompetitors: '/dataforseo_labs/google/serp_competitors/live',
        topSearches: '/dataforseo_labs/google/top_searches/live',
      },
    },
    // Backlinks API
    backlinks: {
      summary: '/backlinks/summary/live',
      backlinks: '/backlinks/backlinks/live',
      anchors: '/backlinks/anchors/live',
      referringDomains: '/backlinks/referring_domains/live',
      referringNetworks: '/backlinks/referring_networks/live',
      pageIntersection: '/backlinks/page_intersection/live',
      domainIntersection: '/backlinks/domain_intersection/live',
      history: '/backlinks/history/live',
      newLostBacklinks: '/backlinks/bulk_new_lost_backlinks/live',
    },
    // OnPage API
    onpage: {
      task: '/on_page/task_post',
      summary: '/on_page/summary',
      pages: '/on_page/pages',
      resources: '/on_page/resources',
      duplicate: '/on_page/duplicate_tags',
      links: '/on_page/links',
      nonIndexable: '/on_page/non_indexable',
      waterfall: '/on_page/waterfall',
      lighthouse: '/on_page/lighthouse/live/json',
    },
    // AI Optimization API (LLM Mentions & Responses)
    aiOptimization: {
      llmMentions: {
        search: '/ai_optimization/llm_mentions/search/live',
        topPages: '/ai_optimization/llm_mentions/top_pages/live',
        topDomains: '/ai_optimization/llm_mentions/top_domains/live',
        aggregated: '/ai_optimization/llm_mentions/aggregated_metrics/live',
      },
      llmResponses: {
        live: '/ai_optimization/llm_responses/live',
        compare: '/ai_optimization/llm_responses/compare/live',
      },
    },
    // Content Analysis API
    contentAnalysis: {
      search: '/content_analysis/search/live',
      summary: '/content_analysis/summary/live',
      sentimentAnalysis: '/content_analysis/sentiment_analysis/live',
      categories: '/content_analysis/categories/live',
      rating: '/content_analysis/rating_distribution/live',
    },
    // Business Data API
    businessData: {
      google: {
        myBusinessInfo: '/business_data/google/my_business_info/live',
        myBusinessUpdates: '/business_data/google/my_business_updates/live',
        reviews: '/business_data/google/reviews/live',
        hotelSearches: '/business_data/google/hotel_searches/live',
      },
      yelp: {
        search: '/business_data/yelp/search/live',
        reviews: '/business_data/yelp/reviews/live',
      },
      tripadvisor: {
        search: '/business_data/tripadvisor/search/live',
        reviews: '/business_data/tripadvisor/reviews/live',
      },
    },
    // Domain Analytics API
    domainAnalytics: {
      technologies: '/domain_analytics/technologies/domain_technologies/live',
      whois: '/domain_analytics/whois/overview/live',
    },
  },
  // Rate limiting
  rateLimit: {
    requestsPerSecond: 2,
    maxConcurrent: 5,
  },
  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryOn: [429, 500, 502, 503, 504],
  },
} as const;

// LLM Provider Configuration
export const llmConfig = {
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    maxTokens: 4096,
  },
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'meta-llama/llama-3.3-70b-instruct',
    maxTokens: 4096,
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    maxTokens: 4096,
  },
} as const;

// Cache Configuration
export const cacheConfig = {
  enabled: env.ENABLE_CACHE,
  ttl: env.CACHE_TTL_SECONDS,
  keyPrefix: 'optimus_seo_',
  // Different TTLs for different data types
  ttlByType: {
    serp: 3600,           // 1 hour
    keywords: 86400,      // 24 hours
    backlinks: 43200,     // 12 hours
    onpage: 3600,         // 1 hour
    llmMentions: 1800,    // 30 minutes
    llmResponses: 300,    // 5 minutes (more dynamic)
    businessData: 86400,  // 24 hours
  },
} as const;

export type DataForSEOConfig = typeof dataForSEOConfig;
export type LLMConfig = typeof llmConfig;
export type CacheConfig = typeof cacheConfig;
