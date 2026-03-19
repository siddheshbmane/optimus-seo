// Mock SERP Data for DataForSEO API
// Matches the actual DataForSEO SERP API response structure

import type { DataForSEOResponse } from '@/lib/dataforseo/types';

export interface SERPOrganicItem {
  type: 'organic';
  rank_group: number;
  rank_absolute: number;
  position: string;
  xpath: string;
  domain: string;
  title: string;
  url: string;
  breadcrumb: string;
  website_name: string;
  is_image: boolean;
  is_video: boolean;
  is_featured_snippet: boolean;
  is_malicious: boolean;
  description: string;
  pre_snippet: string | null;
  extended_snippet: string | null;
  amp_version: boolean;
  rating: {
    rating_type: string;
    value: number;
    votes_count: number;
    rating_max: number;
  } | null;
  highlighted: string[];
  links: {
    type: string;
    title: string;
    url: string;
    description: string;
  }[] | null;
  about_this_result: {
    source: string;
    source_url: string;
    language: string;
  } | null;
  timestamp: string;
  rectangle: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export interface SERPResult {
  keyword: string;
  type: string;
  se_domain: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  spell: null | { type: string; keyword: string };
  refinement_chips: null | { type: string; title: string; url: string }[];
  item_types: string[];
  se_results_count: number;
  items_count: number;
  items: SERPOrganicItem[];
}

const mockSERPItems: SERPOrganicItem[] = [
  {
    type: 'organic',
    rank_group: 1,
    rank_absolute: 1,
    position: 'left',
    xpath: '/html/body/div[1]/div[3]/div/div[1]/div/div/div/div[1]',
    domain: 'acmecorp.com',
    title: 'Acme Corp - Leading Enterprise Solutions',
    url: 'https://acmecorp.com/',
    breadcrumb: 'https://acmecorp.com',
    website_name: 'Acme Corp',
    is_image: false,
    is_video: false,
    is_featured_snippet: false,
    is_malicious: false,
    description: 'Acme Corp provides cutting-edge enterprise solutions for businesses of all sizes. Discover our innovative products and services.',
    pre_snippet: null,
    extended_snippet: null,
    amp_version: false,
    rating: null,
    highlighted: ['enterprise solutions', 'innovative'],
    links: [
      { type: 'sitelink', title: 'Products', url: 'https://acmecorp.com/products', description: 'Explore our product lineup' },
      { type: 'sitelink', title: 'Services', url: 'https://acmecorp.com/services', description: 'Professional services' },
    ],
    about_this_result: { source: 'acmecorp.com', source_url: 'https://acmecorp.com', language: 'English' },
    timestamp: new Date().toISOString(),
    rectangle: null,
  },
  {
    type: 'organic',
    rank_group: 2,
    rank_absolute: 2,
    position: 'left',
    xpath: '/html/body/div[1]/div[3]/div/div[1]/div/div/div/div[2]',
    domain: 'competitor1.com',
    title: 'Competitor 1 - Enterprise Software Solutions',
    url: 'https://competitor1.com/',
    breadcrumb: 'https://competitor1.com',
    website_name: 'Competitor 1',
    is_image: false,
    is_video: false,
    is_featured_snippet: false,
    is_malicious: false,
    description: 'Leading provider of enterprise software solutions. Trusted by Fortune 500 companies worldwide.',
    pre_snippet: null,
    extended_snippet: null,
    amp_version: false,
    rating: { rating_type: 'AggregateRating', value: 4.5, votes_count: 1250, rating_max: 5 },
    highlighted: ['enterprise software'],
    links: null,
    about_this_result: null,
    timestamp: new Date().toISOString(),
    rectangle: null,
  },
  {
    type: 'organic',
    rank_group: 3,
    rank_absolute: 3,
    position: 'left',
    xpath: '/html/body/div[1]/div[3]/div/div[1]/div/div/div/div[3]',
    domain: 'techblog.com',
    title: 'Top 10 Enterprise Solutions in 2026 - Tech Blog',
    url: 'https://techblog.com/enterprise-solutions-2026',
    breadcrumb: 'https://techblog.com › enterprise',
    website_name: 'Tech Blog',
    is_image: false,
    is_video: false,
    is_featured_snippet: false,
    is_malicious: false,
    description: 'Our comprehensive guide to the best enterprise solutions in 2026. Compare features, pricing, and reviews.',
    pre_snippet: null,
    extended_snippet: null,
    amp_version: true,
    rating: null,
    highlighted: ['enterprise solutions', '2026'],
    links: null,
    about_this_result: null,
    timestamp: new Date().toISOString(),
    rectangle: null,
  },
];

// Generate more mock items
for (let i = 4; i <= 10; i++) {
  mockSERPItems.push({
    type: 'organic',
    rank_group: i,
    rank_absolute: i,
    position: 'left',
    xpath: `/html/body/div[1]/div[3]/div/div[1]/div/div/div/div[${i}]`,
    domain: `example${i}.com`,
    title: `Example ${i} - Related Content`,
    url: `https://example${i}.com/page`,
    breadcrumb: `https://example${i}.com`,
    website_name: `Example ${i}`,
    is_image: false,
    is_video: false,
    is_featured_snippet: false,
    is_malicious: false,
    description: `This is example result ${i} with relevant content about the search query.`,
    pre_snippet: null,
    extended_snippet: null,
    amp_version: false,
    rating: null,
    highlighted: [],
    links: null,
    about_this_result: null,
    timestamp: new Date().toISOString(),
    rectangle: null,
  });
}

export function getMockSERPData(requestData?: unknown[]): DataForSEOResponse<SERPResult> {
  const keyword = (requestData?.[0] as { keyword?: string })?.keyword || 'enterprise solutions';
  
  return {
    version: '0.1.20231001',
    status_code: 20000,
    status_message: 'Ok. (Mock Data)',
    time: new Date().toISOString(),
    cost: 0,
    tasks_count: 1,
    tasks_error: 0,
    tasks: [{
      id: 'mock-serp-' + Date.now(),
      status_code: 20000,
      status_message: 'Ok.',
      time: '0.5',
      cost: 0,
      result_count: 1,
      path: ['serp', 'google', 'organic', 'live', 'advanced'],
      data: { keyword },
      result: [{
        keyword,
        type: 'organic',
        se_domain: 'google.com',
        location_code: 2840,
        language_code: 'en',
        check_url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}&hl=en&gl=US`,
        datetime: new Date().toISOString(),
        spell: null,
        refinement_chips: null,
        item_types: ['organic', 'people_also_ask', 'related_searches'],
        se_results_count: 1250000,
        items_count: mockSERPItems.length,
        items: mockSERPItems,
      }],
    }],
  };
}
