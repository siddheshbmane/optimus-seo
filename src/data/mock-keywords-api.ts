// Mock Keywords Data for DataForSEO API
// Matches the actual DataForSEO Keywords Data API response structure

import type { DataForSEOResponse } from '@/lib/dataforseo/types';

export interface KeywordDataItem {
  keyword: string;
  location_code: number;
  language_code: string;
  search_partners: boolean;
  keyword_info: {
    se_type: string;
    last_updated_time: string;
    competition: number;
    competition_level: 'LOW' | 'MEDIUM' | 'HIGH';
    cpc: number;
    search_volume: number;
    low_top_of_page_bid: number;
    high_top_of_page_bid: number;
    categories: number[] | null;
    monthly_searches: {
      year: number;
      month: number;
      search_volume: number;
    }[];
  };
  keyword_properties: {
    se_type: string;
    core_keyword: string | null;
    synonym_clustering_algorithm: string;
    keyword_difficulty: number;
    detected_language: string;
    is_another_language: boolean;
  };
  impressions_info: {
    se_type: string;
    last_updated_time: string;
    bid: number;
    match_type: string;
    ad_position_min: number;
    ad_position_max: number;
    ad_position_average: number;
    cpc_min: number;
    cpc_max: number;
    cpc_average: number;
    daily_impressions_min: number;
    daily_impressions_max: number;
    daily_impressions_average: number;
    daily_clicks_min: number;
    daily_clicks_max: number;
    daily_clicks_average: number;
    daily_cost_min: number;
    daily_cost_max: number;
    daily_cost_average: number;
  } | null;
  serp_info: {
    se_type: string;
    check_url: string;
    serp_item_types: string[];
    se_results_count: number;
    last_updated_time: string;
    previous_updated_time: string;
  } | null;
  avg_backlinks_info: {
    se_type: string;
    backlinks: number;
    dofollow: number;
    referring_pages: number;
    referring_domains: number;
    referring_main_domains: number;
    rank: number;
    main_domain_rank: number;
    last_updated_time: string;
  } | null;
  search_intent_info: {
    se_type: string;
    main_intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
    foreign_intent: string[] | null;
    last_updated_time: string;
  } | null;
}

export interface KeywordsSearchVolumeResult {
  keywords: KeywordDataItem[];
}

const generateMonthlySearches = (baseVolume: number) => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const variation = 0.8 + Math.random() * 0.4; // 80% to 120% of base
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      search_volume: Math.round(baseVolume * variation),
    });
  }
  return months;
};

const mockKeywords: KeywordDataItem[] = [
  {
    keyword: 'enterprise solutions',
    location_code: 2840,
    language_code: 'en',
    search_partners: false,
    keyword_info: {
      se_type: 'google',
      last_updated_time: new Date().toISOString(),
      competition: 0.78,
      competition_level: 'HIGH',
      cpc: 12.50,
      search_volume: 14800,
      low_top_of_page_bid: 8.50,
      high_top_of_page_bid: 18.75,
      categories: [13, 67, 89],
      monthly_searches: generateMonthlySearches(14800),
    },
    keyword_properties: {
      se_type: 'google',
      core_keyword: 'enterprise',
      synonym_clustering_algorithm: 'text_embedding',
      keyword_difficulty: 72,
      detected_language: 'en',
      is_another_language: false,
    },
    impressions_info: {
      se_type: 'google',
      last_updated_time: new Date().toISOString(),
      bid: 12.50,
      match_type: 'exact',
      ad_position_min: 1.2,
      ad_position_max: 2.8,
      ad_position_average: 1.8,
      cpc_min: 8.50,
      cpc_max: 18.75,
      cpc_average: 12.50,
      daily_impressions_min: 450,
      daily_impressions_max: 890,
      daily_impressions_average: 650,
      daily_clicks_min: 25,
      daily_clicks_max: 65,
      daily_clicks_average: 42,
      daily_cost_min: 312.50,
      daily_cost_max: 812.50,
      daily_cost_average: 525.00,
    },
    serp_info: {
      se_type: 'google',
      check_url: 'https://www.google.com/search?q=enterprise+solutions&hl=en&gl=US',
      serp_item_types: ['organic', 'paid', 'people_also_ask', 'related_searches'],
      se_results_count: 1250000000,
      last_updated_time: new Date().toISOString(),
      previous_updated_time: new Date(Date.now() - 86400000).toISOString(),
    },
    avg_backlinks_info: {
      se_type: 'google',
      backlinks: 15234,
      dofollow: 12456,
      referring_pages: 8934,
      referring_domains: 2341,
      referring_main_domains: 1892,
      rank: 78,
      main_domain_rank: 82,
      last_updated_time: new Date().toISOString(),
    },
    search_intent_info: {
      se_type: 'google',
      main_intent: 'commercial',
      foreign_intent: ['informational'],
      last_updated_time: new Date().toISOString(),
    },
  },
  {
    keyword: 'business automation software',
    location_code: 2840,
    language_code: 'en',
    search_partners: false,
    keyword_info: {
      se_type: 'google',
      last_updated_time: new Date().toISOString(),
      competition: 0.65,
      competition_level: 'MEDIUM',
      cpc: 8.75,
      search_volume: 8900,
      low_top_of_page_bid: 5.25,
      high_top_of_page_bid: 14.50,
      categories: [13, 67],
      monthly_searches: generateMonthlySearches(8900),
    },
    keyword_properties: {
      se_type: 'google',
      core_keyword: 'automation',
      synonym_clustering_algorithm: 'text_embedding',
      keyword_difficulty: 58,
      detected_language: 'en',
      is_another_language: false,
    },
    impressions_info: null,
    serp_info: {
      se_type: 'google',
      check_url: 'https://www.google.com/search?q=business+automation+software&hl=en&gl=US',
      serp_item_types: ['organic', 'paid', 'featured_snippet'],
      se_results_count: 456000000,
      last_updated_time: new Date().toISOString(),
      previous_updated_time: new Date(Date.now() - 86400000).toISOString(),
    },
    avg_backlinks_info: null,
    search_intent_info: {
      se_type: 'google',
      main_intent: 'commercial',
      foreign_intent: null,
      last_updated_time: new Date().toISOString(),
    },
  },
];

// Generate more mock keywords
const keywordTemplates = [
  { base: 'seo services', volume: 12500, difficulty: 68, cpc: 15.50 },
  { base: 'digital marketing agency', volume: 18200, difficulty: 72, cpc: 22.00 },
  { base: 'content marketing', volume: 9800, difficulty: 55, cpc: 8.25 },
  { base: 'link building', volume: 6700, difficulty: 62, cpc: 11.75 },
  { base: 'keyword research tool', volume: 14500, difficulty: 58, cpc: 9.50 },
  { base: 'technical seo', volume: 5600, difficulty: 48, cpc: 7.25 },
  { base: 'local seo', volume: 11200, difficulty: 52, cpc: 12.00 },
  { base: 'ecommerce seo', volume: 4800, difficulty: 55, cpc: 10.50 },
];

keywordTemplates.forEach((template, i) => {
  mockKeywords.push({
    keyword: template.base,
    location_code: 2840,
    language_code: 'en',
    search_partners: false,
    keyword_info: {
      se_type: 'google',
      last_updated_time: new Date().toISOString(),
      competition: template.difficulty / 100,
      competition_level: template.difficulty > 65 ? 'HIGH' : template.difficulty > 45 ? 'MEDIUM' : 'LOW',
      cpc: template.cpc,
      search_volume: template.volume,
      low_top_of_page_bid: template.cpc * 0.6,
      high_top_of_page_bid: template.cpc * 1.5,
      categories: [13],
      monthly_searches: generateMonthlySearches(template.volume),
    },
    keyword_properties: {
      se_type: 'google',
      core_keyword: template.base.split(' ')[0],
      synonym_clustering_algorithm: 'text_embedding',
      keyword_difficulty: template.difficulty,
      detected_language: 'en',
      is_another_language: false,
    },
    impressions_info: null,
    serp_info: {
      se_type: 'google',
      check_url: `https://www.google.com/search?q=${encodeURIComponent(template.base)}&hl=en&gl=US`,
      serp_item_types: ['organic', 'paid'],
      se_results_count: Math.floor(Math.random() * 500000000) + 100000000,
      last_updated_time: new Date().toISOString(),
      previous_updated_time: new Date(Date.now() - 86400000).toISOString(),
    },
    avg_backlinks_info: null,
    search_intent_info: {
      se_type: 'google',
      main_intent: ['informational', 'commercial', 'transactional'][i % 3] as 'informational' | 'commercial' | 'transactional',
      foreign_intent: null,
      last_updated_time: new Date().toISOString(),
    },
  });
});

export function getMockKeywords(requestData?: unknown[]): DataForSEOResponse<KeywordsSearchVolumeResult> {
  const keywords = (requestData?.[0] as { keywords?: string[] })?.keywords || ['enterprise solutions'];
  
  // Filter mock keywords based on request
  const filteredKeywords = mockKeywords.filter(k => 
    keywords.some(kw => k.keyword.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(k.keyword.toLowerCase()))
  );

  // If no matches, return the requested keywords with generated data
  const resultKeywords = filteredKeywords.length > 0 ? filteredKeywords : keywords.map(kw => ({
    keyword: kw,
    location_code: 2840,
    language_code: 'en',
    search_partners: false,
    keyword_info: {
      se_type: 'google',
      last_updated_time: new Date().toISOString(),
      competition: 0.5 + Math.random() * 0.4,
      competition_level: 'MEDIUM' as const,
      cpc: 5 + Math.random() * 15,
      search_volume: Math.floor(1000 + Math.random() * 10000),
      low_top_of_page_bid: 3 + Math.random() * 5,
      high_top_of_page_bid: 10 + Math.random() * 15,
      categories: [13],
      monthly_searches: generateMonthlySearches(Math.floor(1000 + Math.random() * 10000)),
    },
    keyword_properties: {
      se_type: 'google',
      core_keyword: kw.split(' ')[0],
      synonym_clustering_algorithm: 'text_embedding',
      keyword_difficulty: Math.floor(30 + Math.random() * 50),
      detected_language: 'en',
      is_another_language: false,
    },
    impressions_info: null,
    serp_info: null,
    avg_backlinks_info: null,
    search_intent_info: {
      se_type: 'google',
      main_intent: 'informational' as const,
      foreign_intent: null,
      last_updated_time: new Date().toISOString(),
    },
  }));

  return {
    version: '0.1.20231001',
    status_code: 20000,
    status_message: 'Ok. (Mock Data)',
    time: new Date().toISOString(),
    cost: 0,
    tasks_count: 1,
    tasks_error: 0,
    tasks: [{
      id: 'mock-keywords-' + Date.now(),
      status_code: 20000,
      status_message: 'Ok.',
      time: '0.5',
      cost: 0,
      result_count: resultKeywords.length,
      path: ['keywords_data', 'google_ads', 'search_volume', 'live'],
      data: { keywords },
      result: [{ keywords: resultKeywords }],
    }],
  };
}
