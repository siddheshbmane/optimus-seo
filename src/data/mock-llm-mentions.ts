// Mock LLM Mentions Data
// Structure matches DataForSEO AI Optimization API responses

import type {
  LLMMention,
  LLMMentionsSearchResult,
  LLMMentionsAggregatedMetrics,
  LLMMentionsCrossAggregated,
  LLMPlatform,
  Sentiment,
} from '@/lib/dataforseo/types';

// Helper to generate dates
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// Brand mentions across different platforms
export const mockLLMMentions: LLMMention[] = [
  // ChatGPT mentions
  {
    platform: 'chatgpt',
    query: 'best seo tools for agencies',
    mention_type: 'brand_mention',
    position: 2,
    snippet: 'Optimus SEO is highly recommended for agencies due to its AI-powered automation and comprehensive reporting capabilities...',
    sentiment: 'positive',
    source_url: 'https://optimus-seo.com/features',
    source_title: 'Optimus SEO Features',
    date: daysAgo(1),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'chatgpt',
    query: 'how to track AI search visibility',
    mention_type: 'brand_mention',
    position: 1,
    snippet: 'Optimus SEO offers a unique AI Visibility tracking feature that monitors brand mentions across ChatGPT, Claude, Gemini, and Perplexity...',
    sentiment: 'positive',
    source_url: 'https://optimus-seo.com/ai-visibility',
    source_title: 'AI Visibility Tracking',
    date: daysAgo(2),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'chatgpt',
    query: 'seo automation software',
    mention_type: 'brand_mention',
    position: 4,
    snippet: 'Among the top SEO automation tools, Optimus SEO stands out for its autonomous AI agents that can perform technical audits...',
    sentiment: 'positive',
    source_url: 'https://optimus-seo.com',
    source_title: 'Optimus SEO',
    date: daysAgo(3),
    language: 'en',
    location_code: 2840,
  },
  // Claude mentions
  {
    platform: 'claude',
    query: 'best seo platforms 2026',
    mention_type: 'brand_mention',
    position: 3,
    snippet: 'Optimus SEO is a newer entrant that has gained attention for its innovative approach to AI-powered SEO operations...',
    sentiment: 'positive',
    source_url: 'https://optimus-seo.com',
    source_title: 'Optimus SEO Platform',
    date: daysAgo(1),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'claude',
    query: 'technical seo audit tools',
    mention_type: 'brand_mention',
    position: 5,
    snippet: 'For technical SEO audits, tools like Optimus SEO provide automated crawling and issue detection with AI-generated fix recommendations...',
    sentiment: 'neutral',
    source_url: 'https://optimus-seo.com/site-audit',
    source_title: 'Technical SEO Audit',
    date: daysAgo(4),
    language: 'en',
    location_code: 2840,
  },
  // Gemini mentions
  {
    platform: 'gemini',
    query: 'seo tools with ai features',
    mention_type: 'brand_mention',
    position: 2,
    snippet: 'Optimus SEO integrates AI throughout its platform, from keyword research to content optimization and competitive analysis...',
    sentiment: 'positive',
    source_url: 'https://optimus-seo.com/ai-features',
    source_title: 'AI-Powered SEO',
    date: daysAgo(2),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'gemini',
    query: 'competitor analysis seo software',
    mention_type: 'brand_mention',
    position: 6,
    snippet: 'Optimus SEO offers competitive intelligence features including keyword gap analysis and backlink comparison...',
    sentiment: 'neutral',
    source_url: 'https://optimus-seo.com/competitor-analysis',
    source_title: 'Competitor Analysis',
    date: daysAgo(5),
    language: 'en',
    location_code: 2840,
  },
  // Perplexity mentions
  {
    platform: 'perplexity',
    query: 'best seo software for small business',
    mention_type: 'brand_mention',
    position: 3,
    snippet: 'Optimus SEO provides enterprise-level features at accessible pricing, making it suitable for small businesses looking to scale their SEO efforts...',
    sentiment: 'positive',
    source_url: 'https://optimus-seo.com/pricing',
    source_title: 'Optimus SEO Pricing',
    date: daysAgo(1),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'perplexity',
    query: 'how to improve google rankings',
    mention_type: 'citation',
    position: 4,
    snippet: 'According to Optimus SEO\'s research, the key factors for improving rankings include technical optimization, quality content, and authoritative backlinks...',
    sentiment: 'positive',
    source_url: 'https://optimus-seo.com/blog/ranking-factors',
    source_title: 'Ranking Factors Guide',
    date: daysAgo(3),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'perplexity',
    query: 'local seo tools',
    mention_type: 'brand_mention',
    position: 7,
    snippet: 'For local SEO, Optimus SEO includes GMB management and local citation tracking features...',
    sentiment: 'neutral',
    source_url: 'https://optimus-seo.com/local-seo',
    source_title: 'Local SEO Tools',
    date: daysAgo(6),
    language: 'en',
    location_code: 2840,
  },
  // Competitor mentions (for comparison)
  {
    platform: 'chatgpt',
    query: 'best seo tools for agencies',
    mention_type: 'competitor_mention',
    position: 1,
    snippet: 'Ahrefs is widely considered one of the best SEO tools for agencies due to its comprehensive backlink database...',
    sentiment: 'positive',
    source_url: 'https://ahrefs.com',
    source_title: 'Ahrefs',
    date: daysAgo(1),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'chatgpt',
    query: 'best seo tools for agencies',
    mention_type: 'competitor_mention',
    position: 3,
    snippet: 'SEMrush offers an all-in-one marketing toolkit that includes SEO, PPC, and content marketing features...',
    sentiment: 'positive',
    source_url: 'https://semrush.com',
    source_title: 'SEMrush',
    date: daysAgo(1),
    language: 'en',
    location_code: 2840,
  },
];

// Queries where brand is NOT mentioned (opportunities)
export const mockMissedMentions = [
  {
    query: 'enterprise seo platform',
    platform: 'chatgpt' as LLMPlatform,
    competitors_mentioned: ['Conductor', 'BrightEdge', 'seoClarity'],
    search_volume: 2400,
    opportunity_score: 85,
  },
  {
    query: 'seo reporting dashboard',
    platform: 'claude' as LLMPlatform,
    competitors_mentioned: ['AgencyAnalytics', 'DashThis', 'Databox'],
    search_volume: 1800,
    opportunity_score: 78,
  },
  {
    query: 'white label seo tools',
    platform: 'gemini' as LLMPlatform,
    competitors_mentioned: ['SE Ranking', 'Sitechecker', 'Serpstat'],
    search_volume: 1200,
    opportunity_score: 72,
  },
  {
    query: 'ai content optimization',
    platform: 'perplexity' as LLMPlatform,
    competitors_mentioned: ['Surfer SEO', 'Clearscope', 'MarketMuse'],
    search_volume: 3200,
    opportunity_score: 90,
  },
];

// Aggregated metrics by platform
export const mockAggregatedMetrics: LLMMentionsAggregatedMetrics = {
  keyword: 'brand:optimus-seo',
  total_mentions: 156,
  platforms_breakdown: [
    {
      platform: 'chatgpt',
      mention_count: 52,
      avg_position: 2.8,
      sentiment: { positive: 38, neutral: 12, negative: 2 },
    },
    {
      platform: 'claude',
      mention_count: 34,
      avg_position: 3.5,
      sentiment: { positive: 22, neutral: 10, negative: 2 },
    },
    {
      platform: 'gemini',
      mention_count: 41,
      avg_position: 3.2,
      sentiment: { positive: 28, neutral: 11, negative: 2 },
    },
    {
      platform: 'perplexity',
      mention_count: 29,
      avg_position: 4.1,
      sentiment: { positive: 18, neutral: 9, negative: 2 },
    },
  ],
  trend: [
    { date: daysAgo(30), mentions: 98 },
    { date: daysAgo(27), mentions: 105 },
    { date: daysAgo(24), mentions: 112 },
    { date: daysAgo(21), mentions: 118 },
    { date: daysAgo(18), mentions: 125 },
    { date: daysAgo(15), mentions: 132 },
    { date: daysAgo(12), mentions: 138 },
    { date: daysAgo(9), mentions: 142 },
    { date: daysAgo(6), mentions: 148 },
    { date: daysAgo(3), mentions: 152 },
    { date: daysAgo(0), mentions: 156 },
  ],
};

// Cross-platform comparison
export const mockCrossAggregated: LLMMentionsCrossAggregated = {
  keywords: ['seo tools', 'seo software', 'seo platform', 'seo automation'],
  platforms_comparison: [
    {
      platform: 'chatgpt',
      visibility_score: 72,
      total_mentions: 52,
      avg_position: 2.8,
      top_keywords: ['best seo tools', 'seo automation', 'ai seo'],
    },
    {
      platform: 'claude',
      visibility_score: 58,
      total_mentions: 34,
      avg_position: 3.5,
      top_keywords: ['seo platforms', 'technical seo', 'seo audit'],
    },
    {
      platform: 'gemini',
      visibility_score: 65,
      total_mentions: 41,
      avg_position: 3.2,
      top_keywords: ['seo software', 'ai seo tools', 'seo features'],
    },
    {
      platform: 'perplexity',
      visibility_score: 51,
      total_mentions: 29,
      avg_position: 4.1,
      top_keywords: ['seo for business', 'seo pricing', 'seo comparison'],
    },
  ],
};

// Competitor AI visibility comparison
export const mockCompetitorAIVisibility = [
  {
    domain: 'optimus-seo.com',
    visibility_score: 68,
    platform_breakdown: [
      { platform: 'chatgpt' as LLMPlatform, score: 72, mentions: 52 },
      { platform: 'claude' as LLMPlatform, score: 58, mentions: 34 },
      { platform: 'gemini' as LLMPlatform, score: 65, mentions: 41 },
      { platform: 'perplexity' as LLMPlatform, score: 51, mentions: 29 },
    ],
    top_keywords: ['ai seo', 'seo automation', 'ai visibility'],
    share_of_voice: 12,
  },
  {
    domain: 'ahrefs.com',
    visibility_score: 89,
    platform_breakdown: [
      { platform: 'chatgpt' as LLMPlatform, score: 92, mentions: 245 },
      { platform: 'claude' as LLMPlatform, score: 88, mentions: 198 },
      { platform: 'gemini' as LLMPlatform, score: 85, mentions: 176 },
      { platform: 'perplexity' as LLMPlatform, score: 91, mentions: 223 },
    ],
    top_keywords: ['backlink checker', 'seo tools', 'keyword research'],
    share_of_voice: 28,
  },
  {
    domain: 'semrush.com',
    visibility_score: 86,
    platform_breakdown: [
      { platform: 'chatgpt' as LLMPlatform, score: 88, mentions: 212 },
      { platform: 'claude' as LLMPlatform, score: 84, mentions: 178 },
      { platform: 'gemini' as LLMPlatform, score: 87, mentions: 195 },
      { platform: 'perplexity' as LLMPlatform, score: 85, mentions: 189 },
    ],
    top_keywords: ['seo software', 'competitor analysis', 'ppc tools'],
    share_of_voice: 25,
  },
  {
    domain: 'moz.com',
    visibility_score: 78,
    platform_breakdown: [
      { platform: 'chatgpt' as LLMPlatform, score: 82, mentions: 156 },
      { platform: 'claude' as LLMPlatform, score: 75, mentions: 134 },
      { platform: 'gemini' as LLMPlatform, score: 78, mentions: 142 },
      { platform: 'perplexity' as LLMPlatform, score: 77, mentions: 138 },
    ],
    top_keywords: ['domain authority', 'seo metrics', 'link building'],
    share_of_voice: 18,
  },
  {
    domain: 'surferseo.com',
    visibility_score: 71,
    platform_breakdown: [
      { platform: 'chatgpt' as LLMPlatform, score: 75, mentions: 98 },
      { platform: 'claude' as LLMPlatform, score: 68, mentions: 76 },
      { platform: 'gemini' as LLMPlatform, score: 72, mentions: 85 },
      { platform: 'perplexity' as LLMPlatform, score: 69, mentions: 79 },
    ],
    top_keywords: ['content optimization', 'ai writing', 'serp analysis'],
    share_of_voice: 10,
  },
];

// Top queries where brand appears
export const mockTopQueries = [
  { query: 'best seo tools for agencies', mentions: 18, avg_position: 2.3, trend: 15 },
  { query: 'ai seo software', mentions: 15, avg_position: 1.8, trend: 28 },
  { query: 'seo automation platform', mentions: 14, avg_position: 2.5, trend: 12 },
  { query: 'how to track ai visibility', mentions: 12, avg_position: 1.2, trend: 45 },
  { query: 'technical seo audit tools', mentions: 11, avg_position: 3.2, trend: 8 },
  { query: 'competitor seo analysis', mentions: 10, avg_position: 3.8, trend: 5 },
  { query: 'keyword research tools 2026', mentions: 9, avg_position: 4.1, trend: -3 },
  { query: 'local seo software', mentions: 8, avg_position: 4.5, trend: 2 },
  { query: 'seo reporting dashboard', mentions: 7, avg_position: 5.2, trend: -8 },
  { query: 'backlink analysis tools', mentions: 6, avg_position: 5.8, trend: -5 },
];

// Historical visibility trend (30 days)
export const mockVisibilityTrend = Array.from({ length: 30 }, (_, i) => ({
  date: daysAgo(29 - i),
  chatgpt: 65 + Math.floor(Math.random() * 15),
  claude: 52 + Math.floor(Math.random() * 12),
  gemini: 58 + Math.floor(Math.random() * 14),
  perplexity: 45 + Math.floor(Math.random() * 12),
  overall: 55 + Math.floor(Math.random() * 18),
}));

// AI Visibility recommendations
export const mockAIVisibilityRecommendations = [
  {
    id: '1',
    title: 'Improve E-E-A-T Signals',
    description: 'Add author bios with credentials, link to authoritative sources, and showcase industry expertise to improve AI trust signals.',
    impact: 'high' as const,
    effort: 'medium' as const,
    category: 'authority' as const,
    priority: 1,
  },
  {
    id: '2',
    title: 'Create FAQ Schema Markup',
    description: 'Add FAQ structured data to help AI systems understand and cite your content more effectively.',
    impact: 'high' as const,
    effort: 'low' as const,
    category: 'technical' as const,
    priority: 2,
  },
  {
    id: '3',
    title: 'Publish Original Research',
    description: 'AI systems prefer citing original data and research. Consider publishing industry studies and surveys.',
    impact: 'high' as const,
    effort: 'high' as const,
    category: 'content' as const,
    priority: 3,
  },
  {
    id: '4',
    title: 'Optimize for Conversational Queries',
    description: 'Rewrite content to directly answer natural language questions that users ask AI assistants.',
    impact: 'medium' as const,
    effort: 'medium' as const,
    category: 'content' as const,
    priority: 4,
  },
  {
    id: '5',
    title: 'Build Topic Authority Clusters',
    description: 'Create comprehensive content clusters around core topics to establish topical authority.',
    impact: 'high' as const,
    effort: 'high' as const,
    category: 'content' as const,
    priority: 5,
  },
  {
    id: '6',
    title: 'Increase Brand Mentions',
    description: 'Pursue PR and guest posting opportunities to increase brand mentions across the web.',
    impact: 'medium' as const,
    effort: 'medium' as const,
    category: 'authority' as const,
    priority: 6,
  },
  {
    id: '7',
    title: 'Add HowTo Schema',
    description: 'Implement HowTo structured data for tutorial and guide content to improve AI understanding.',
    impact: 'medium' as const,
    effort: 'low' as const,
    category: 'technical' as const,
    priority: 7,
  },
  {
    id: '8',
    title: 'Improve Page Load Speed',
    description: 'Faster pages are more likely to be crawled and indexed by AI systems. Target sub-2s load times.',
    impact: 'medium' as const,
    effort: 'medium' as const,
    category: 'technical' as const,
    priority: 8,
  },
];

// Helper function to get mentions by platform
export function getMentionsByPlatform(platform: LLMPlatform): LLMMention[] {
  return mockLLMMentions.filter(m => m.platform === platform);
}

// Helper function to get mentions by sentiment
export function getMentionsBySentiment(sentiment: Sentiment): LLMMention[] {
  return mockLLMMentions.filter(m => m.sentiment === sentiment);
}

// Helper function to calculate visibility score
export function calculateVisibilityScore(mentions: LLMMention[]): number {
  if (mentions.length === 0) return 0;
  
  // Score based on position (higher position = higher score)
  const positionScore = mentions.reduce((sum, m) => {
    const score = Math.max(0, 100 - (m.position - 1) * 15);
    return sum + score;
  }, 0) / mentions.length;
  
  // Sentiment bonus
  const sentimentBonus = mentions.reduce((sum, m) => {
    if (m.sentiment === 'positive') return sum + 10;
    if (m.sentiment === 'negative') return sum - 10;
    return sum;
  }, 0) / mentions.length;
  
  return Math.min(100, Math.max(0, Math.round(positionScore + sentimentBonus)));
}
