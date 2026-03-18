// Mock Competitive Intelligence Data
// For Phase 5: Competitive Intelligence War Room

export interface Competitor {
  id: string;
  name: string;
  url: string;
  domainRating: number;
  drChange: number;
  organicTraffic: number;
  trafficChange: number;
  keywords: number;
  keywordsChange: number;
  backlinks: number;
  backlinksChange: number;
  topKeywords: string[];
  marketShare: number;
  aiVisibilityScore: number;
}

export interface KeywordGap {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  yourPosition: number | null;
  competitors: {
    name: string;
    position: number;
  }[];
  opportunity: 'high' | 'medium' | 'low';
}

export interface ContentGap {
  topic: string;
  yourCoverage: number; // 0-100
  competitorCoverage: number; // 0-100
  estimatedTraffic: number;
  contentType: 'blog' | 'landing-page' | 'guide' | 'tool';
  priority: 'high' | 'medium' | 'low';
}

export interface BacklinkGap {
  domain: string;
  domainRating: number;
  traffic: number;
  linksToCompetitors: number;
  linksToYou: number;
  outreachPriority: 'high' | 'medium' | 'low';
  contactEmail?: string;
}

export interface SERPBattle {
  keyword: string;
  volume: number;
  yourPosition: number | null;
  yourChange: number;
  competitors: {
    name: string;
    position: number;
    change: number;
  }[];
  serpFeatures: string[];
  winner: string;
}

export interface TrafficTrend {
  month: string;
  you: number;
  [competitor: string]: number | string;
}

// Mock Competitors
export const mockCompetitors: Competitor[] = [
  {
    id: 'comp-1',
    name: 'SEO Agency Pro',
    url: 'seoagencypro.com',
    domainRating: 72,
    drChange: 2,
    organicTraffic: 125000,
    trafficChange: 15.2,
    keywords: 4500,
    keywordsChange: 8.5,
    backlinks: 12500,
    backlinksChange: 12.3,
    topKeywords: ['seo services', 'seo agency', 'digital marketing', 'seo consultant'],
    marketShare: 28,
    aiVisibilityScore: 72,
  },
  {
    id: 'comp-2',
    name: 'Digital Growth Co',
    url: 'digitalgrowth.co',
    domainRating: 68,
    drChange: 1,
    organicTraffic: 98000,
    trafficChange: 22.1,
    keywords: 3200,
    keywordsChange: 15.2,
    backlinks: 8900,
    backlinksChange: 8.7,
    topKeywords: ['growth marketing', 'seo consultant', 'content marketing', 'digital strategy'],
    marketShare: 22,
    aiVisibilityScore: 65,
  },
  {
    id: 'comp-3',
    name: 'RankBoost',
    url: 'rankboost.io',
    domainRating: 65,
    drChange: -1,
    organicTraffic: 76000,
    trafficChange: -5.3,
    keywords: 2800,
    keywordsChange: -2.1,
    backlinks: 6700,
    backlinksChange: 3.2,
    topKeywords: ['rank tracking', 'keyword research', 'backlink analysis', 'seo tools'],
    marketShare: 17,
    aiVisibilityScore: 58,
  },
  {
    id: 'comp-4',
    name: 'SearchMaster',
    url: 'searchmaster.com',
    domainRating: 78,
    drChange: 3,
    organicTraffic: 156000,
    trafficChange: 18.9,
    keywords: 5200,
    keywordsChange: 12.4,
    backlinks: 15600,
    backlinksChange: 15.8,
    topKeywords: ['seo tools', 'search optimization', 'website audit', 'technical seo'],
    marketShare: 35,
    aiVisibilityScore: 81,
  },
  {
    id: 'comp-5',
    name: 'OptimizeNow',
    url: 'optimizenow.net',
    domainRating: 58,
    drChange: 0,
    organicTraffic: 45000,
    trafficChange: 8.2,
    keywords: 1800,
    keywordsChange: 5.6,
    backlinks: 4200,
    backlinksChange: 6.1,
    topKeywords: ['website optimization', 'page speed', 'technical seo', 'core web vitals'],
    marketShare: 10,
    aiVisibilityScore: 45,
  },
];

// Your site data for comparison
export const yourSiteData = {
  name: 'Your Site',
  domainRating: 62,
  drChange: 4,
  organicTraffic: 85000,
  trafficChange: 28.5,
  keywords: 2950,
  keywordsChange: 18.2,
  backlinks: 7800,
  backlinksChange: 22.1,
  marketShare: 18,
  aiVisibilityScore: 68,
};

// Mock Keyword Gaps
export const mockKeywordGaps: KeywordGap[] = [
  {
    keyword: 'enterprise seo services',
    volume: 2400,
    difficulty: 65,
    cpc: 45.00,
    yourPosition: null,
    competitors: [
      { name: 'SEO Agency Pro', position: 3 },
      { name: 'SearchMaster', position: 5 },
      { name: 'Digital Growth Co', position: 8 },
    ],
    opportunity: 'high',
  },
  {
    keyword: 'seo audit tool free',
    volume: 8100,
    difficulty: 58,
    cpc: 12.50,
    yourPosition: null,
    competitors: [
      { name: 'RankBoost', position: 2 },
      { name: 'SearchMaster', position: 4 },
      { name: 'SEO Agency Pro', position: 7 },
    ],
    opportunity: 'high',
  },
  {
    keyword: 'local seo software',
    volume: 3600,
    difficulty: 52,
    cpc: 18.20,
    yourPosition: 45,
    competitors: [
      { name: 'Digital Growth Co', position: 1 },
      { name: 'SEO Agency Pro', position: 3 },
      { name: 'OptimizeNow', position: 6 },
    ],
    opportunity: 'high',
  },
  {
    keyword: 'seo reporting dashboard',
    volume: 1900,
    difficulty: 48,
    cpc: 22.30,
    yourPosition: null,
    competitors: [
      { name: 'SearchMaster', position: 2 },
      { name: 'RankBoost', position: 5 },
    ],
    opportunity: 'medium',
  },
  {
    keyword: 'ai seo tools',
    volume: 5400,
    difficulty: 62,
    cpc: 15.80,
    yourPosition: 28,
    competitors: [
      { name: 'SearchMaster', position: 1 },
      { name: 'SEO Agency Pro', position: 4 },
      { name: 'Digital Growth Co', position: 9 },
    ],
    opportunity: 'high',
  },
  {
    keyword: 'white label seo',
    volume: 4200,
    difficulty: 55,
    cpc: 35.00,
    yourPosition: null,
    competitors: [
      { name: 'SEO Agency Pro', position: 2 },
      { name: 'Digital Growth Co', position: 6 },
    ],
    opportunity: 'medium',
  },
  {
    keyword: 'seo competitor analysis tool',
    volume: 2800,
    difficulty: 45,
    cpc: 14.50,
    yourPosition: 32,
    competitors: [
      { name: 'RankBoost', position: 1 },
      { name: 'SearchMaster', position: 3 },
    ],
    opportunity: 'high',
  },
  {
    keyword: 'technical seo checklist',
    volume: 6200,
    difficulty: 42,
    cpc: 8.90,
    yourPosition: 15,
    competitors: [
      { name: 'SearchMaster', position: 2 },
      { name: 'OptimizeNow', position: 4 },
      { name: 'SEO Agency Pro', position: 8 },
    ],
    opportunity: 'medium',
  },
];

// Mock Content Gaps
export const mockContentGaps: ContentGap[] = [
  {
    topic: 'Complete Guide to E-E-A-T',
    yourCoverage: 20,
    competitorCoverage: 85,
    estimatedTraffic: 12500,
    contentType: 'guide',
    priority: 'high',
  },
  {
    topic: 'AI SEO Tools Comparison',
    yourCoverage: 0,
    competitorCoverage: 75,
    estimatedTraffic: 8200,
    contentType: 'blog',
    priority: 'high',
  },
  {
    topic: 'Local SEO Ranking Factors 2026',
    yourCoverage: 35,
    competitorCoverage: 90,
    estimatedTraffic: 6800,
    contentType: 'guide',
    priority: 'high',
  },
  {
    topic: 'Free SEO Audit Tool',
    yourCoverage: 0,
    competitorCoverage: 60,
    estimatedTraffic: 15000,
    contentType: 'tool',
    priority: 'high',
  },
  {
    topic: 'Core Web Vitals Optimization',
    yourCoverage: 45,
    competitorCoverage: 80,
    estimatedTraffic: 5400,
    contentType: 'guide',
    priority: 'medium',
  },
  {
    topic: 'Link Building Strategies',
    yourCoverage: 60,
    competitorCoverage: 95,
    estimatedTraffic: 9200,
    contentType: 'blog',
    priority: 'medium',
  },
  {
    topic: 'SEO Case Studies',
    yourCoverage: 25,
    competitorCoverage: 70,
    estimatedTraffic: 4500,
    contentType: 'landing-page',
    priority: 'medium',
  },
  {
    topic: 'Schema Markup Generator',
    yourCoverage: 0,
    competitorCoverage: 55,
    estimatedTraffic: 7800,
    contentType: 'tool',
    priority: 'high',
  },
];

// Mock Backlink Gaps
export const mockBacklinkGaps: BacklinkGap[] = [
  {
    domain: 'searchengineland.com',
    domainRating: 89,
    traffic: 2500000,
    linksToCompetitors: 4,
    linksToYou: 0,
    outreachPriority: 'high',
    contactEmail: 'editorial@searchengineland.com',
  },
  {
    domain: 'moz.com',
    domainRating: 91,
    traffic: 1800000,
    linksToCompetitors: 3,
    linksToYou: 1,
    outreachPriority: 'high',
  },
  {
    domain: 'ahrefs.com/blog',
    domainRating: 88,
    traffic: 1200000,
    linksToCompetitors: 5,
    linksToYou: 0,
    outreachPriority: 'high',
    contactEmail: 'blog@ahrefs.com',
  },
  {
    domain: 'semrush.com/blog',
    domainRating: 87,
    traffic: 1500000,
    linksToCompetitors: 4,
    linksToYou: 1,
    outreachPriority: 'high',
  },
  {
    domain: 'backlinko.com',
    domainRating: 82,
    traffic: 450000,
    linksToCompetitors: 2,
    linksToYou: 0,
    outreachPriority: 'medium',
    contactEmail: 'brian@backlinko.com',
  },
  {
    domain: 'neilpatel.com',
    domainRating: 85,
    traffic: 3200000,
    linksToCompetitors: 3,
    linksToYou: 0,
    outreachPriority: 'medium',
  },
  {
    domain: 'hubspot.com/blog',
    domainRating: 93,
    traffic: 8500000,
    linksToCompetitors: 2,
    linksToYou: 1,
    outreachPriority: 'high',
  },
  {
    domain: 'contentmarketinginstitute.com',
    domainRating: 78,
    traffic: 320000,
    linksToCompetitors: 3,
    linksToYou: 0,
    outreachPriority: 'medium',
    contactEmail: 'editorial@cmi.com',
  },
];

// Mock SERP Battles
export const mockSERPBattles: SERPBattle[] = [
  {
    keyword: 'seo services',
    volume: 74000,
    yourPosition: 8,
    yourChange: 3,
    competitors: [
      { name: 'SearchMaster', position: 1, change: 0 },
      { name: 'SEO Agency Pro', position: 3, change: -1 },
      { name: 'Digital Growth Co', position: 5, change: 2 },
    ],
    serpFeatures: ['Featured Snippet', 'People Also Ask', 'Local Pack'],
    winner: 'SearchMaster',
  },
  {
    keyword: 'best seo tools',
    volume: 33100,
    yourPosition: 12,
    yourChange: 5,
    competitors: [
      { name: 'RankBoost', position: 2, change: 1 },
      { name: 'SearchMaster', position: 4, change: -2 },
      { name: 'SEO Agency Pro', position: 6, change: 0 },
    ],
    serpFeatures: ['Featured Snippet', 'Video Carousel'],
    winner: 'RankBoost',
  },
  {
    keyword: 'technical seo audit',
    volume: 8100,
    yourPosition: 5,
    yourChange: 2,
    competitors: [
      { name: 'SearchMaster', position: 1, change: 0 },
      { name: 'OptimizeNow', position: 3, change: 1 },
      { name: 'SEO Agency Pro', position: 7, change: -3 },
    ],
    serpFeatures: ['People Also Ask'],
    winner: 'SearchMaster',
  },
  {
    keyword: 'local seo',
    volume: 33100,
    yourPosition: 15,
    yourChange: -2,
    competitors: [
      { name: 'Digital Growth Co', position: 2, change: 1 },
      { name: 'SEO Agency Pro', position: 4, change: 0 },
      { name: 'SearchMaster', position: 6, change: -1 },
    ],
    serpFeatures: ['Local Pack', 'People Also Ask', 'Knowledge Panel'],
    winner: 'Digital Growth Co',
  },
  {
    keyword: 'keyword research tool',
    volume: 22200,
    yourPosition: 18,
    yourChange: 4,
    competitors: [
      { name: 'RankBoost', position: 1, change: 0 },
      { name: 'SearchMaster', position: 3, change: 1 },
      { name: 'SEO Agency Pro', position: 8, change: -2 },
    ],
    serpFeatures: ['Featured Snippet', 'Video Carousel', 'People Also Ask'],
    winner: 'RankBoost',
  },
];

// Mock Traffic Trends
export const mockTrafficTrends: TrafficTrend[] = [
  { month: 'Oct 2025', you: 65000, 'SEO Agency Pro': 110000, 'SearchMaster': 140000, 'Digital Growth Co': 85000 },
  { month: 'Nov 2025', you: 70000, 'SEO Agency Pro': 115000, 'SearchMaster': 145000, 'Digital Growth Co': 88000 },
  { month: 'Dec 2025', you: 72000, 'SEO Agency Pro': 118000, 'SearchMaster': 148000, 'Digital Growth Co': 90000 },
  { month: 'Jan 2026', you: 78000, 'SEO Agency Pro': 120000, 'SearchMaster': 150000, 'Digital Growth Co': 92000 },
  { month: 'Feb 2026', you: 82000, 'SEO Agency Pro': 122000, 'SearchMaster': 153000, 'Digital Growth Co': 95000 },
  { month: 'Mar 2026', you: 85000, 'SEO Agency Pro': 125000, 'SearchMaster': 156000, 'Digital Growth Co': 98000 },
];

// Helper functions
export const getKeywordOverlap = () => {
  const yourKeywords = 2950;
  const competitorKeywords = mockCompetitors.reduce((sum, c) => sum + c.keywords, 0) / mockCompetitors.length;
  const overlap = Math.round(yourKeywords * 0.35); // 35% overlap
  return {
    yours: yourKeywords,
    competitors: Math.round(competitorKeywords),
    overlap,
    unique: yourKeywords - overlap,
    gaps: mockKeywordGaps.length,
  };
};

export const getMarketShareData = () => {
  const total = mockCompetitors.reduce((sum, c) => sum + c.marketShare, 0) + yourSiteData.marketShare;
  return [
    { name: 'Your Site', value: yourSiteData.marketShare, fill: '#FD8C73' },
    ...mockCompetitors.map((c, i) => ({
      name: c.name,
      value: c.marketShare,
      fill: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i],
    })),
  ];
};

export const getCompetitorComparison = () => {
  return {
    domainRating: {
      you: yourSiteData.domainRating,
      avg: Math.round(mockCompetitors.reduce((s, c) => s + c.domainRating, 0) / mockCompetitors.length),
      best: Math.max(...mockCompetitors.map(c => c.domainRating)),
    },
    traffic: {
      you: yourSiteData.organicTraffic,
      avg: Math.round(mockCompetitors.reduce((s, c) => s + c.organicTraffic, 0) / mockCompetitors.length),
      best: Math.max(...mockCompetitors.map(c => c.organicTraffic)),
    },
    keywords: {
      you: yourSiteData.keywords,
      avg: Math.round(mockCompetitors.reduce((s, c) => s + c.keywords, 0) / mockCompetitors.length),
      best: Math.max(...mockCompetitors.map(c => c.keywords)),
    },
    backlinks: {
      you: yourSiteData.backlinks,
      avg: Math.round(mockCompetitors.reduce((s, c) => s + c.backlinks, 0) / mockCompetitors.length),
      best: Math.max(...mockCompetitors.map(c => c.backlinks)),
    },
  };
};

export const getHighPriorityGaps = () => ({
  keywords: mockKeywordGaps.filter(k => k.opportunity === 'high').length,
  content: mockContentGaps.filter(c => c.priority === 'high').length,
  backlinks: mockBacklinkGaps.filter(b => b.outreachPriority === 'high').length,
});
