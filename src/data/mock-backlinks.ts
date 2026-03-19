// Mock Backlinks Data for DataForSEO API
// Matches the actual DataForSEO Backlinks API response structure

import type { DataForSEOResponse } from '@/lib/dataforseo/types';

export interface BacklinkItem {
  type: string;
  domain_from: string;
  url_from: string;
  url_to: string;
  tld_from: string;
  is_new: boolean;
  is_lost: boolean;
  backlink_spam_score: number;
  rank: number;
  page_from_rank: number;
  domain_from_rank: number;
  domain_from_platform_type: string[];
  domain_from_is_ip: boolean;
  domain_from_ip: string | null;
  domain_from_country: string;
  page_from_external_links: number;
  page_from_internal_links: number;
  page_from_size: number;
  page_from_encoding: string;
  page_from_language: string;
  page_from_title: string;
  page_from_status_code: number;
  first_seen: string;
  prev_seen: string;
  last_seen: string;
  item_type: string;
  attributes: string[] | null;
  dofollow: boolean;
  original: boolean;
  alt: string | null;
  anchor: string;
  text_pre: string | null;
  text_post: string | null;
  semantic_location: string;
  links_count: number;
  group_count: number;
  is_broken: boolean;
  url_to_status_code: number;
  url_to_spam_score: number;
  url_to_redirect_target: string | null;
}

export interface BacklinksSummaryResult {
  target: string;
  total_backlinks: number;
  total_referring_domains: number;
  total_referring_main_domains: number;
  total_referring_ips: number;
  total_referring_subnets: number;
  total_referring_pages: number;
  new_backlinks: number;
  lost_backlinks: number;
  new_referring_domains: number;
  lost_referring_domains: number;
  referring_domains_nofollow: number;
  backlinks_spam_score: number;
  crawled_pages: number;
  info: {
    server: string;
    cms: string | null;
    platform_type: string[];
    ip_address: string;
    country: string;
    is_ip: boolean;
    target_spam_score: number;
  };
  internal_links_count: number;
  external_links_count: number;
  broken_backlinks: number;
  broken_pages: number;
  referring_domains: number;
  referring_domains_types: {
    [key: string]: number;
  };
  referring_main_domains: number;
  referring_main_domains_nofollow: number;
  referring_ips: number;
  referring_subnets: number;
  referring_pages: number;
  referring_links_tld: {
    [key: string]: number;
  };
  referring_links_types: {
    anchor: number;
    image: number;
    redirect: number;
    canonical: number;
    alternate: number;
  };
  referring_links_attributes: {
    nofollow: number;
    noopener: number;
    noreferrer: number;
    external: number;
    ugc: number;
    sponsored: number;
  };
  referring_links_platform_types: {
    [key: string]: number;
  };
  referring_links_semantic_locations: {
    [key: string]: number;
  };
  referring_links_countries: {
    [key: string]: number;
  };
}

const mockBacklinks: BacklinkItem[] = [
  {
    type: 'backlink',
    domain_from: 'techblog.com',
    url_from: 'https://techblog.com/best-enterprise-solutions-2026',
    url_to: 'https://acmecorp.com',
    tld_from: 'com',
    is_new: true,
    is_lost: false,
    backlink_spam_score: 5,
    rank: 85,
    page_from_rank: 72,
    domain_from_rank: 78,
    domain_from_platform_type: ['cms', 'blogs'],
    domain_from_is_ip: false,
    domain_from_ip: null,
    domain_from_country: 'US',
    page_from_external_links: 15,
    page_from_internal_links: 45,
    page_from_size: 125000,
    page_from_encoding: 'utf-8',
    page_from_language: 'en',
    page_from_title: 'Best Enterprise Solutions in 2026 - Tech Blog',
    page_from_status_code: 200,
    first_seen: '2026-03-01T00:00:00Z',
    prev_seen: '2026-03-15T00:00:00Z',
    last_seen: new Date().toISOString(),
    item_type: 'anchor',
    attributes: null,
    dofollow: true,
    original: true,
    alt: null,
    anchor: 'Acme Corp',
    text_pre: 'One of the top solutions is',
    text_post: 'which offers comprehensive features.',
    semantic_location: 'article',
    links_count: 1,
    group_count: 1,
    is_broken: false,
    url_to_status_code: 200,
    url_to_spam_score: 3,
    url_to_redirect_target: null,
  },
  {
    type: 'backlink',
    domain_from: 'businessnews.com',
    url_from: 'https://businessnews.com/enterprise-software-review',
    url_to: 'https://acmecorp.com/products',
    tld_from: 'com',
    is_new: false,
    is_lost: false,
    backlink_spam_score: 8,
    rank: 92,
    page_from_rank: 85,
    domain_from_rank: 88,
    domain_from_platform_type: ['news'],
    domain_from_is_ip: false,
    domain_from_ip: null,
    domain_from_country: 'US',
    page_from_external_links: 8,
    page_from_internal_links: 32,
    page_from_size: 98000,
    page_from_encoding: 'utf-8',
    page_from_language: 'en',
    page_from_title: 'Enterprise Software Review 2026',
    page_from_status_code: 200,
    first_seen: '2026-01-15T00:00:00Z',
    prev_seen: '2026-03-10T00:00:00Z',
    last_seen: new Date().toISOString(),
    item_type: 'anchor',
    attributes: ['noopener'],
    dofollow: true,
    original: true,
    alt: null,
    anchor: 'enterprise solutions from Acme',
    text_pre: 'Check out the',
    text_post: 'for your business needs.',
    semantic_location: 'article',
    links_count: 1,
    group_count: 1,
    is_broken: false,
    url_to_status_code: 200,
    url_to_spam_score: 3,
    url_to_redirect_target: null,
  },
];

// Generate more mock backlinks
for (let i = 0; i < 50; i++) {
  mockBacklinks.push({
    type: 'backlink',
    domain_from: `site${i}.com`,
    url_from: `https://site${i}.com/article-${i}`,
    url_to: 'https://acmecorp.com',
    tld_from: 'com',
    is_new: i < 10,
    is_lost: false,
    backlink_spam_score: Math.floor(Math.random() * 30),
    rank: 50 + Math.floor(Math.random() * 40),
    page_from_rank: 40 + Math.floor(Math.random() * 50),
    domain_from_rank: 45 + Math.floor(Math.random() * 45),
    domain_from_platform_type: ['blogs'],
    domain_from_is_ip: false,
    domain_from_ip: null,
    domain_from_country: ['US', 'UK', 'CA', 'AU'][i % 4],
    page_from_external_links: 5 + Math.floor(Math.random() * 20),
    page_from_internal_links: 20 + Math.floor(Math.random() * 50),
    page_from_size: 50000 + Math.floor(Math.random() * 100000),
    page_from_encoding: 'utf-8',
    page_from_language: 'en',
    page_from_title: `Article ${i} - Site ${i}`,
    page_from_status_code: 200,
    first_seen: new Date(Date.now() - i * 86400000 * 7).toISOString(),
    prev_seen: new Date(Date.now() - i * 86400000).toISOString(),
    last_seen: new Date().toISOString(),
    item_type: 'anchor',
    attributes: i % 3 === 0 ? ['nofollow'] : null,
    dofollow: i % 3 !== 0,
    original: true,
    alt: null,
    anchor: `Acme Corp link ${i}`,
    text_pre: 'Read more about',
    text_post: 'and their solutions.',
    semantic_location: ['article', 'sidebar', 'footer'][i % 3],
    links_count: 1,
    group_count: 1,
    is_broken: false,
    url_to_status_code: 200,
    url_to_spam_score: 3,
    url_to_redirect_target: null,
  });
}

export function getMockBacklinks(requestData?: unknown[]): DataForSEOResponse<BacklinksSummaryResult | { items: BacklinkItem[] }> {
  const target = (requestData?.[0] as { target?: string })?.target || 'acmecorp.com';
  
  // Check if this is a summary request or backlinks list request
  const isSummary = !requestData || !(requestData[0] as { limit?: number })?.limit;

  if (isSummary) {
    return {
      version: '0.1.20231001',
      status_code: 20000,
      status_message: 'Ok. (Mock Data)',
      time: new Date().toISOString(),
      cost: 0,
      tasks_count: 1,
      tasks_error: 0,
      tasks: [{
        id: 'mock-backlinks-summary-' + Date.now(),
        status_code: 20000,
        status_message: 'Ok.',
        time: '0.5',
        cost: 0,
        result_count: 1,
        path: ['backlinks', 'summary', 'live'],
        data: { target },
        result: [{
          target,
          total_backlinks: 1847,
          total_referring_domains: 342,
          total_referring_main_domains: 298,
          total_referring_ips: 287,
          total_referring_subnets: 245,
          total_referring_pages: 1523,
          new_backlinks: 156,
          lost_backlinks: 23,
          new_referring_domains: 45,
          lost_referring_domains: 8,
          referring_domains_nofollow: 67,
          backlinks_spam_score: 12,
          crawled_pages: 234,
          info: {
            server: 'nginx',
            cms: 'Next.js',
            platform_type: ['cms', 'ecommerce'],
            ip_address: '104.21.45.123',
            country: 'US',
            is_ip: false,
            target_spam_score: 5,
          },
          internal_links_count: 4521,
          external_links_count: 892,
          broken_backlinks: 12,
          broken_pages: 3,
          referring_domains: 342,
          referring_domains_types: {
            'blogs': 145,
            'news': 67,
            'ecommerce': 45,
            'forums': 32,
            'other': 53,
          },
          referring_main_domains: 298,
          referring_main_domains_nofollow: 67,
          referring_ips: 287,
          referring_subnets: 245,
          referring_pages: 1523,
          referring_links_tld: {
            'com': 892,
            'org': 234,
            'net': 156,
            'io': 89,
            'co': 67,
          },
          referring_links_types: {
            anchor: 1456,
            image: 234,
            redirect: 45,
            canonical: 12,
            alternate: 8,
          },
          referring_links_attributes: {
            nofollow: 234,
            noopener: 567,
            noreferrer: 123,
            external: 892,
            ugc: 45,
            sponsored: 23,
          },
          referring_links_platform_types: {
            'blogs': 678,
            'news': 345,
            'ecommerce': 234,
            'forums': 156,
            'other': 234,
          },
          referring_links_semantic_locations: {
            'article': 892,
            'sidebar': 345,
            'footer': 234,
            'header': 123,
            'other': 153,
          },
          referring_links_countries: {
            'US': 678,
            'UK': 234,
            'CA': 156,
            'AU': 123,
            'DE': 89,
          },
        }],
      }],
    };
  }

  return {
    version: '0.1.20231001',
    status_code: 20000,
    status_message: 'Ok. (Mock Data)',
    time: new Date().toISOString(),
    cost: 0,
    tasks_count: 1,
    tasks_error: 0,
    tasks: [{
      id: 'mock-backlinks-' + Date.now(),
      status_code: 20000,
      status_message: 'Ok.',
      time: '0.5',
      cost: 0,
      result_count: mockBacklinks.length,
      path: ['backlinks', 'backlinks', 'live'],
      data: { target },
      result: [{ items: mockBacklinks }],
    }],
  };
}
