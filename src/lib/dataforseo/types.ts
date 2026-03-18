// DataForSEO API Types
// These types match the actual DataForSEO API response structure
// for seamless integration when switching from mock to real API

// ============================================
// COMMON TYPES
// ============================================

export interface DataForSEOResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: DataForSEOTask<T>[];
}

export interface DataForSEOTask<T> {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  path: string[];
  data: Record<string, unknown>;
  result: T[];
}

// ============================================
// AI OPTIMIZATION API TYPES
// ============================================

// LLM Mentions Types
export type LLMPlatform = 'chatgpt' | 'claude' | 'gemini' | 'perplexity';
export type MentionType = 'brand_mention' | 'product_mention' | 'competitor_mention' | 'citation';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface LLMMention {
  platform: LLMPlatform;
  query: string;
  mention_type: MentionType;
  position: number;
  snippet: string;
  sentiment: Sentiment;
  source_url?: string;
  source_title?: string;
  date: string;
  language: string;
  location_code: number;
}

export interface LLMMentionsSearchResult {
  keyword: string;
  location_code: number;
  language_code: string;
  total_count: number;
  items_count: number;
  items: LLMMention[];
}

export interface LLMMentionsTopPagesResult {
  keyword: string;
  items: {
    page_url: string;
    page_title: string;
    mention_count: number;
    platforms: LLMPlatform[];
    avg_position: number;
  }[];
}

export interface LLMMentionsTopDomainsResult {
  keyword: string;
  items: {
    domain: string;
    mention_count: number;
    platforms: LLMPlatform[];
    avg_position: number;
    sentiment_distribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
  }[];
}

export interface LLMMentionsAggregatedMetrics {
  keyword: string;
  total_mentions: number;
  platforms_breakdown: {
    platform: LLMPlatform;
    mention_count: number;
    avg_position: number;
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
  }[];
  trend: {
    date: string;
    mentions: number;
  }[];
}

export interface LLMMentionsCrossAggregated {
  keywords: string[];
  platforms_comparison: {
    platform: LLMPlatform;
    visibility_score: number;
    total_mentions: number;
    avg_position: number;
    top_keywords: string[];
  }[];
}

// LLM Responses Types
export interface LLMResponse {
  platform: LLMPlatform;
  model: string;
  query: string;
  response_text: string;
  sources: LLMSource[];
  timestamp: string;
  tokens_used: number;
  response_time_ms: number;
}

export interface LLMSource {
  url: string;
  title: string;
  snippet: string;
  position: number;
  is_brand_mention: boolean;
}

export interface LLMResponsesResult {
  query: string;
  responses: {
    chatgpt?: LLMResponse;
    claude?: LLMResponse;
    gemini?: LLMResponse;
    perplexity?: LLMResponse;
  };
}

// AI Keyword Data Types
export interface AIKeywordData {
  keyword: string;
  ai_search_volume: number;
  traditional_search_volume: number;
  ai_volume_trend: 'rising' | 'stable' | 'declining';
  ai_competition: 'low' | 'medium' | 'high';
  ai_cpc?: number;
  platforms_data: {
    platform: LLMPlatform;
    estimated_queries: number;
    trend: number; // percentage change
  }[];
}

// LLM Scraper Types (ChatGPT/Gemini Search Results)
export interface LLMScraperResult {
  platform: 'chatgpt' | 'gemini';
  query: string;
  search_results: {
    position: number;
    url: string;
    title: string;
    snippet: string;
    domain: string;
  }[];
  ai_summary?: string;
  timestamp: string;
}

// ============================================
// SERP API TYPES
// ============================================

export interface SERPResult {
  keyword: string;
  location_code: number;
  language_code: string;
  check_url: string;
  datetime: string;
  spell?: {
    keyword: string;
    type: string;
  };
  item_types: string[];
  se_results_count: number;
  items_count: number;
  items: SERPItem[];
}

export interface SERPItem {
  type: string;
  rank_group: number;
  rank_absolute: number;
  position: string;
  xpath: string;
  domain: string;
  title: string;
  url: string;
  breadcrumb?: string;
  website_name?: string;
  is_image: boolean;
  is_video: boolean;
  is_featured_snippet: boolean;
  is_malicious: boolean;
  description?: string;
  pre_snippet?: string;
  extended_snippet?: string;
  amp_version: boolean;
  rating?: {
    rating_type: string;
    value: number;
    votes_count: number;
    rating_max?: number;
  };
  highlighted?: string[];
  links?: {
    type: string;
    title: string;
    url: string;
    description?: string;
  }[];
  about_this_result?: {
    source: string;
    source_url: string;
    language: string;
    location: string;
    search_terms: string[];
    related_terms: string[];
  };
}

// Google AI Mode SERP Types
export interface GoogleAIModeResult {
  keyword: string;
  location_code: number;
  language_code: string;
  ai_overview?: {
    text: string;
    sources: {
      url: string;
      title: string;
      domain: string;
    }[];
  };
  organic_results: SERPItem[];
  related_searches: string[];
}

// ============================================
// KEYWORDS DATA API TYPES
// ============================================

export interface KeywordData {
  keyword: string;
  location_code: number;
  language_code: string;
  search_volume: number;
  cpc: number;
  competition: number;
  competition_level: 'LOW' | 'MEDIUM' | 'HIGH';
  monthly_searches: {
    year: number;
    month: number;
    search_volume: number;
  }[];
  keyword_annotations?: {
    concepts: {
      name: string;
      concept_group: string;
    }[];
  };
}

export interface KeywordIdea {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: number;
  competition_level: 'LOW' | 'MEDIUM' | 'HIGH';
  keyword_difficulty: number;
  search_intent: SearchIntent;
}

export type SearchIntent = 'informational' | 'navigational' | 'commercial' | 'transactional';

export interface SearchIntentResult {
  keyword: string;
  primary_intent: SearchIntent;
  secondary_intent?: SearchIntent;
  intent_probability: {
    informational: number;
    navigational: number;
    commercial: number;
    transactional: number;
  };
}

// ============================================
// DATAFORSEO LABS API TYPES
// ============================================

export interface DomainRankOverview {
  domain: string;
  organic_traffic: number;
  organic_keywords: number;
  organic_cost: number;
  paid_traffic: number;
  paid_keywords: number;
  paid_cost: number;
  domain_rank: number;
  backlinks: number;
  referring_domains: number;
}

export interface RankedKeyword {
  keyword: string;
  position: number;
  previous_position?: number;
  url: string;
  search_volume: number;
  cpc: number;
  competition: number;
  traffic: number;
  traffic_cost: number;
  serp_features: string[];
}

export interface CompetitorDomain {
  domain: string;
  avg_position: number;
  sum_position: number;
  intersections: number;
  full_domain_metrics: DomainRankOverview;
}

export interface KeywordGap {
  keyword: string;
  your_position?: number;
  competitor_positions: {
    domain: string;
    position: number;
  }[];
  search_volume: number;
  keyword_difficulty: number;
  opportunity_score: number;
}

export interface TrafficEstimation {
  domain: string;
  organic_traffic: number;
  paid_traffic: number;
  organic_keywords: number;
  paid_keywords: number;
  traffic_trend: {
    date: string;
    organic_traffic: number;
    paid_traffic: number;
  }[];
}

// ============================================
// BACKLINKS API TYPES
// ============================================

export interface BacklinksSummary {
  target: string;
  total_backlinks: number;
  total_referring_domains: number;
  total_referring_main_domains: number;
  total_referring_ips: number;
  total_referring_subnets: number;
  new_backlinks: number;
  lost_backlinks: number;
  new_referring_domains: number;
  lost_referring_domains: number;
  backlinks_spam_score: number;
  domain_rank: number;
}

export interface Backlink {
  type: string;
  domain_from: string;
  url_from: string;
  url_to: string;
  anchor: string;
  text_pre?: string;
  text_post?: string;
  is_new: boolean;
  is_lost: boolean;
  is_broken: boolean;
  first_seen: string;
  last_seen: string;
  rank: number;
  page_from_rank: number;
  domain_from_rank: number;
  dofollow: boolean;
  page_from_external_links: number;
  page_from_internal_links: number;
  attributes?: string[];
}

export interface BacklinkGap {
  domain: string;
  referring_domains_you_dont_have: number;
  common_referring_domains: number;
  domains: {
    domain: string;
    links_to_competitor: number;
    links_to_you: number;
    domain_rank: number;
  }[];
}

// ============================================
// ONPAGE API TYPES
// ============================================

export interface OnPageSummary {
  crawl_progress: string;
  crawl_status: {
    pages_crawled: number;
    pages_in_queue: number;
    max_crawl_pages: number;
  };
  domain_info: {
    name: string;
    cms?: string;
    ip: string;
    server: string;
    ssl_info?: {
      valid_certificate: boolean;
      certificate_issuer: string;
      certificate_expiration_date: string;
    };
  };
  page_metrics: {
    pages_count: number;
    pages_with_issues: number;
    duplicate_title: number;
    duplicate_description: number;
    duplicate_content: number;
    broken_links: number;
    broken_resources: number;
    redirect_chains: number;
    non_indexable: number;
  };
  onpage_score: number;
}

export interface OnPageIssue {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  count: number;
  pages: {
    url: string;
    issue_details: string;
    fix_suggestion?: string;
  }[];
}

export interface PageAnalysis {
  url: string;
  status_code: number;
  meta: {
    title: string;
    description: string;
    canonical?: string;
    robots?: string;
  };
  content: {
    word_count: number;
    plain_text_word_count: number;
    automated_readability_index: number;
    content_encoding: string;
  };
  checks: {
    no_title: boolean;
    no_description: boolean;
    title_too_long: boolean;
    title_too_short: boolean;
    description_too_long: boolean;
    description_too_short: boolean;
    no_h1_tag: boolean;
    multiple_h1_tags: boolean;
    no_image_alt: boolean;
    no_content_encoding: boolean;
    high_loading_time: boolean;
    is_redirect: boolean;
    is_broken: boolean;
    is_www: boolean;
    is_https: boolean;
    low_content_rate: boolean;
    high_content_rate: boolean;
    low_character_count: boolean;
    high_character_count: boolean;
    small_page_size: boolean;
    large_page_size: boolean;
    low_readability_rate: boolean;
    irrelevant_description: boolean;
    irrelevant_title: boolean;
    irrelevant_meta_keywords: boolean;
    has_microdata: boolean;
    has_render_blocking_resources: boolean;
    redirect_chain: boolean;
    canonical_to_broken: boolean;
    canonical_to_redirect: boolean;
    has_links_to_redirects: boolean;
    has_meta_refresh_redirect: boolean;
    has_deprecated_html_tags: boolean;
    duplicate_meta_tags: boolean;
    duplicate_title_tag: boolean;
    no_favicon: boolean;
    seo_friendly_url: boolean;
    flash: boolean;
    frame: boolean;
    lorem_ipsum: boolean;
  };
  page_timing: {
    time_to_interactive: number;
    dom_complete: number;
    largest_contentful_paint: number;
    first_input_delay: number;
    connection_time: number;
    time_to_secure_connection: number;
    request_sent_time: number;
    waiting_time: number;
    download_time: number;
    duration_time: number;
    fetch_start: number;
    fetch_end: number;
  };
}

export interface LighthouseResult {
  url: string;
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    best_practices: { score: number };
    seo: { score: number };
  };
  audits: {
    [key: string]: {
      id: string;
      title: string;
      description: string;
      score: number | null;
      display_value?: string;
      details?: unknown;
    };
  };
}

// ============================================
// CONTENT ANALYSIS API TYPES
// ============================================

export interface ContentAnalysisResult {
  keyword: string;
  total_count: number;
  sentiment_connotations: {
    positive: number;
    negative: number;
    neutral: number;
  };
  connotation_types: {
    anger: number;
    happiness: number;
    love: number;
    sadness: number;
    fear: number;
    surprise: number;
    fun: number;
  };
  items: {
    url: string;
    title: string;
    main_domain: string;
    content_type: string;
    date_published: string;
    sentiment: Sentiment;
    connotation_types: string[];
    text_category: string[];
    page_category: string[];
    rating?: {
      rating_type: string;
      value: number;
      votes_count: number;
    };
  }[];
}

export interface PhraseTrend {
  phrase: string;
  date: string;
  count: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

// ============================================
// BUSINESS DATA API TYPES
// ============================================

export interface GMBInfo {
  title: string;
  description?: string;
  category: string;
  additional_categories?: string[];
  address: string;
  address_info: {
    city: string;
    region: string;
    country_code: string;
    zip: string;
  };
  phone?: string;
  url?: string;
  domain?: string;
  rating?: {
    rating_type: string;
    value: number;
    votes_count: number;
  };
  is_claimed: boolean;
  attributes?: {
    name: string;
    value: string;
  }[];
  work_hours?: {
    [day: string]: {
      open: string;
      close: string;
    }[];
  };
  popular_times?: {
    [day: string]: {
      hour: number;
      popularity: number;
    }[];
  };
}

export interface GoogleReview {
  review_id: string;
  rating: number;
  review_text?: string;
  review_url: string;
  time_ago: string;
  timestamp: string;
  review_likes?: number;
  owner_answer?: string;
  owner_timestamp?: string;
  profile_name: string;
  profile_url?: string;
  profile_image_url?: string;
  review_images?: string[];
}

// ============================================
// DOMAIN ANALYTICS API TYPES
// ============================================

export interface DomainTechnologies {
  domain: string;
  technologies: {
    category: string;
    name: string;
    version?: string;
  }[];
  meta_keywords?: string[];
  phone_numbers?: string[];
  emails?: string[];
  social_graph_urls?: string[];
}

export interface WhoisData {
  domain: string;
  created_datetime: string;
  updated_datetime: string;
  expiration_datetime: string;
  registrar: string;
  registrant?: {
    name?: string;
    organization?: string;
    email?: string;
    country?: string;
  };
}

// ============================================
// TREND DATA TYPES
// ============================================

export interface TrendData {
  keyword: string;
  date_from: string;
  date_to: string;
  data: {
    date: string;
    value: number;
  }[];
  rising_queries?: {
    query: string;
    value: number;
  }[];
  top_queries?: {
    query: string;
    value: number;
  }[];
}

export interface TrendDemography {
  keyword: string;
  age_distribution: {
    age_range: string;
    percentage: number;
  }[];
  gender_distribution: {
    gender: string;
    percentage: number;
  }[];
}

// ============================================
// AGGREGATED TYPES FOR UI
// ============================================

export interface AIVisibilityScore {
  overall_score: number;
  platform_scores: {
    platform: LLMPlatform;
    score: number;
    change: number;
    mentions: number;
    sentiment: Sentiment;
  }[];
  trend: {
    date: string;
    score: number;
  }[];
  recommendations: AIVisibilityRecommendation[];
}

export interface AIVisibilityRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: 'content' | 'technical' | 'authority' | 'engagement';
  priority: number;
}

export interface CompetitorAIVisibility {
  domain: string;
  visibility_score: number;
  platform_breakdown: {
    platform: LLMPlatform;
    score: number;
    mentions: number;
  }[];
  top_keywords: string[];
  share_of_voice: number;
}
