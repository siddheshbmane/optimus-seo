// Mock Predictive Keyword Intelligence Data
// For Phase 3: Opportunity Scoring, Clustering, Trend Prediction, Intent Classification

export interface KeywordOpportunity {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  currentPosition: number | null;
  opportunityScore: number; // 0-100
  ctrPotential: number; // 0-1
  competition: 'low' | 'medium' | 'high';
  quickWin: boolean;
  strategicTarget: boolean;
  estimatedTraffic: number;
  estimatedValue: number;
}

export interface KeywordCluster {
  id: string;
  name: string;
  parentKeyword: string;
  keywords: ClusterKeyword[];
  totalVolume: number;
  avgDifficulty: number;
  avgCpc: number;
  topicAuthority: number; // 0-100
  contentGap: boolean;
}

export interface ClusterKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  relationship: 'parent' | 'sibling' | 'child' | 'related';
  semanticScore: number; // 0-1
}

export interface TrendPrediction {
  keyword: string;
  historicalVolume: { month: string; volume: number }[];
  predictedVolume: { month: string; volume: number; confidence: number }[];
  seasonality: 'none' | 'low' | 'medium' | 'high';
  peakMonths: string[];
  trendDirection: 'rising' | 'stable' | 'declining';
  growthRate: number; // percentage
  volatility: number; // 0-1
}

export interface IntentClassification {
  keyword: string;
  primaryIntent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  intentConfidence: number; // 0-1
  secondaryIntent?: 'informational' | 'navigational' | 'transactional' | 'commercial';
  contentRecommendation: string;
  suggestedFormat: 'blog' | 'landing-page' | 'product-page' | 'comparison' | 'guide' | 'faq';
  buyerJourneyStage: 'awareness' | 'consideration' | 'decision';
}

export interface AIVolumeComparison {
  keyword: string;
  traditionalVolume: number;
  aiVolume: number;
  aiGrowthRate: number;
  aiOpportunity: 'high' | 'medium' | 'low';
  platformBreakdown: {
    chatgpt: number;
    claude: number;
    gemini: number;
    perplexity: number;
  };
}

// Calculate opportunity score
export function calculateOpportunityScore(
  volume: number,
  difficulty: number,
  cpc: number,
  currentPosition: number | null
): number {
  const volumeScore = Math.min(volume / 1000, 30); // Max 30 points
  const difficultyScore = (100 - difficulty) * 0.3; // Max 30 points
  const cpcScore = Math.min(cpc * 2, 20); // Max 20 points
  const positionBonus = currentPosition && currentPosition <= 20 ? 20 : currentPosition && currentPosition <= 50 ? 10 : 0;
  
  return Math.min(100, Math.round(volumeScore + difficultyScore + cpcScore + positionBonus));
}

// Mock Keyword Opportunities
export const mockKeywordOpportunities: KeywordOpportunity[] = [
  {
    id: 'opp-1',
    keyword: 'seo audit checklist 2026',
    volume: 8500,
    difficulty: 32,
    cpc: 12.50,
    currentPosition: 15,
    opportunityScore: 92,
    ctrPotential: 0.18,
    competition: 'low',
    quickWin: true,
    strategicTarget: false,
    estimatedTraffic: 1530,
    estimatedValue: 19125,
  },
  {
    id: 'opp-2',
    keyword: 'local seo for small business',
    volume: 12400,
    difficulty: 45,
    cpc: 18.20,
    currentPosition: 8,
    opportunityScore: 88,
    ctrPotential: 0.22,
    competition: 'medium',
    quickWin: true,
    strategicTarget: true,
    estimatedTraffic: 2728,
    estimatedValue: 49650,
  },
  {
    id: 'opp-3',
    keyword: 'ai seo optimization',
    volume: 6200,
    difficulty: 28,
    cpc: 15.80,
    currentPosition: null,
    opportunityScore: 85,
    ctrPotential: 0.15,
    competition: 'low',
    quickWin: false,
    strategicTarget: true,
    estimatedTraffic: 930,
    estimatedValue: 14694,
  },
  {
    id: 'opp-4',
    keyword: 'technical seo services',
    volume: 4800,
    difficulty: 52,
    cpc: 45.00,
    currentPosition: 12,
    opportunityScore: 82,
    ctrPotential: 0.12,
    competition: 'high',
    quickWin: false,
    strategicTarget: true,
    estimatedTraffic: 576,
    estimatedValue: 25920,
  },
  {
    id: 'opp-5',
    keyword: 'how to improve core web vitals',
    volume: 15600,
    difficulty: 38,
    cpc: 8.40,
    currentPosition: 22,
    opportunityScore: 79,
    ctrPotential: 0.08,
    competition: 'medium',
    quickWin: true,
    strategicTarget: false,
    estimatedTraffic: 1248,
    estimatedValue: 10483,
  },
  {
    id: 'opp-6',
    keyword: 'ecommerce seo strategy',
    volume: 9200,
    difficulty: 55,
    cpc: 22.30,
    currentPosition: 18,
    opportunityScore: 76,
    ctrPotential: 0.10,
    competition: 'high',
    quickWin: false,
    strategicTarget: true,
    estimatedTraffic: 920,
    estimatedValue: 20516,
  },
  {
    id: 'opp-7',
    keyword: 'google algorithm update march 2026',
    volume: 22000,
    difficulty: 25,
    cpc: 4.20,
    currentPosition: null,
    opportunityScore: 74,
    ctrPotential: 0.20,
    competition: 'low',
    quickWin: true,
    strategicTarget: false,
    estimatedTraffic: 4400,
    estimatedValue: 18480,
  },
  {
    id: 'opp-8',
    keyword: 'best seo tools for agencies',
    volume: 7800,
    difficulty: 48,
    cpc: 16.50,
    currentPosition: 25,
    opportunityScore: 71,
    ctrPotential: 0.06,
    competition: 'medium',
    quickWin: false,
    strategicTarget: false,
    estimatedTraffic: 468,
    estimatedValue: 7722,
  },
  {
    id: 'opp-9',
    keyword: 'schema markup generator',
    volume: 11200,
    difficulty: 42,
    cpc: 9.80,
    currentPosition: 35,
    opportunityScore: 68,
    ctrPotential: 0.04,
    competition: 'medium',
    quickWin: false,
    strategicTarget: false,
    estimatedTraffic: 448,
    estimatedValue: 4390,
  },
  {
    id: 'opp-10',
    keyword: 'seo consultant near me',
    volume: 5400,
    difficulty: 35,
    cpc: 55.00,
    currentPosition: 6,
    opportunityScore: 65,
    ctrPotential: 0.25,
    competition: 'high',
    quickWin: true,
    strategicTarget: true,
    estimatedTraffic: 1350,
    estimatedValue: 74250,
  },
];

// Mock Keyword Clusters
export const mockKeywordClusters: KeywordCluster[] = [
  {
    id: 'cluster-1',
    name: 'Technical SEO',
    parentKeyword: 'technical seo',
    totalVolume: 85400,
    avgDifficulty: 48,
    avgCpc: 12.50,
    topicAuthority: 72,
    contentGap: false,
    keywords: [
      { keyword: 'technical seo', volume: 18500, difficulty: 52, relationship: 'parent', semanticScore: 1.0 },
      { keyword: 'technical seo audit', volume: 8100, difficulty: 48, relationship: 'child', semanticScore: 0.92 },
      { keyword: 'technical seo checklist', volume: 6200, difficulty: 42, relationship: 'child', semanticScore: 0.88 },
      { keyword: 'technical seo services', volume: 4800, difficulty: 55, relationship: 'sibling', semanticScore: 0.85 },
      { keyword: 'technical seo tools', volume: 5600, difficulty: 45, relationship: 'child', semanticScore: 0.82 },
      { keyword: 'site speed optimization', volume: 12400, difficulty: 48, relationship: 'related', semanticScore: 0.75 },
      { keyword: 'crawl budget optimization', volume: 3200, difficulty: 38, relationship: 'child', semanticScore: 0.78 },
      { keyword: 'xml sitemap best practices', volume: 4500, difficulty: 35, relationship: 'related', semanticScore: 0.72 },
      { keyword: 'robots.txt guide', volume: 6800, difficulty: 32, relationship: 'related', semanticScore: 0.70 },
      { keyword: 'core web vitals optimization', volume: 15300, difficulty: 52, relationship: 'related', semanticScore: 0.68 },
    ],
  },
  {
    id: 'cluster-2',
    name: 'Local SEO',
    parentKeyword: 'local seo',
    totalVolume: 124600,
    avgDifficulty: 45,
    avgCpc: 18.20,
    topicAuthority: 85,
    contentGap: false,
    keywords: [
      { keyword: 'local seo', volume: 33100, difficulty: 55, relationship: 'parent', semanticScore: 1.0 },
      { keyword: 'local seo services', volume: 12400, difficulty: 52, relationship: 'sibling', semanticScore: 0.95 },
      { keyword: 'local seo for small business', volume: 8900, difficulty: 45, relationship: 'child', semanticScore: 0.90 },
      { keyword: 'google my business optimization', volume: 22100, difficulty: 42, relationship: 'related', semanticScore: 0.85 },
      { keyword: 'local citation building', volume: 4200, difficulty: 38, relationship: 'child', semanticScore: 0.82 },
      { keyword: 'local keyword research', volume: 3800, difficulty: 35, relationship: 'child', semanticScore: 0.78 },
      { keyword: 'local seo ranking factors', volume: 5600, difficulty: 40, relationship: 'child', semanticScore: 0.75 },
      { keyword: 'near me seo', volume: 6800, difficulty: 48, relationship: 'related', semanticScore: 0.72 },
      { keyword: 'local pack optimization', volume: 4500, difficulty: 42, relationship: 'child', semanticScore: 0.70 },
      { keyword: 'multi-location seo', volume: 3200, difficulty: 45, relationship: 'sibling', semanticScore: 0.68 },
    ],
  },
  {
    id: 'cluster-3',
    name: 'Content Marketing',
    parentKeyword: 'content marketing',
    totalVolume: 156800,
    avgDifficulty: 52,
    avgCpc: 8.50,
    topicAuthority: 68,
    contentGap: true,
    keywords: [
      { keyword: 'content marketing', volume: 49500, difficulty: 62, relationship: 'parent', semanticScore: 1.0 },
      { keyword: 'content marketing strategy', volume: 22100, difficulty: 55, relationship: 'child', semanticScore: 0.95 },
      { keyword: 'content marketing examples', volume: 12300, difficulty: 48, relationship: 'child', semanticScore: 0.88 },
      { keyword: 'content marketing tools', volume: 8900, difficulty: 52, relationship: 'sibling', semanticScore: 0.85 },
      { keyword: 'b2b content marketing', volume: 14800, difficulty: 55, relationship: 'sibling', semanticScore: 0.82 },
      { keyword: 'content calendar template', volume: 18500, difficulty: 42, relationship: 'related', semanticScore: 0.75 },
      { keyword: 'content optimization', volume: 9200, difficulty: 48, relationship: 'related', semanticScore: 0.72 },
      { keyword: 'content gap analysis', volume: 5600, difficulty: 45, relationship: 'child', semanticScore: 0.70 },
      { keyword: 'evergreen content', volume: 8400, difficulty: 38, relationship: 'related', semanticScore: 0.68 },
      { keyword: 'content roi', volume: 7500, difficulty: 52, relationship: 'child', semanticScore: 0.65 },
    ],
  },
  {
    id: 'cluster-4',
    name: 'Link Building',
    parentKeyword: 'link building',
    totalVolume: 98500,
    avgDifficulty: 58,
    avgCpc: 15.80,
    topicAuthority: 78,
    contentGap: false,
    keywords: [
      { keyword: 'link building', volume: 27100, difficulty: 65, relationship: 'parent', semanticScore: 1.0 },
      { keyword: 'link building strategies', volume: 12400, difficulty: 58, relationship: 'child', semanticScore: 0.95 },
      { keyword: 'link building services', volume: 8200, difficulty: 62, relationship: 'sibling', semanticScore: 0.92 },
      { keyword: 'backlink checker', volume: 18500, difficulty: 55, relationship: 'related', semanticScore: 0.85 },
      { keyword: 'guest posting', volume: 14800, difficulty: 52, relationship: 'related', semanticScore: 0.78 },
      { keyword: 'broken link building', volume: 4500, difficulty: 48, relationship: 'child', semanticScore: 0.75 },
      { keyword: 'white hat link building', volume: 3200, difficulty: 45, relationship: 'child', semanticScore: 0.72 },
      { keyword: 'link building outreach', volume: 5600, difficulty: 55, relationship: 'child', semanticScore: 0.70 },
      { keyword: 'dofollow backlinks', volume: 6800, difficulty: 58, relationship: 'related', semanticScore: 0.68 },
      { keyword: 'link building tools', volume: 4200, difficulty: 52, relationship: 'sibling', semanticScore: 0.65 },
    ],
  },
  {
    id: 'cluster-5',
    name: 'AI SEO',
    parentKeyword: 'ai seo',
    totalVolume: 45200,
    avgDifficulty: 35,
    avgCpc: 11.20,
    topicAuthority: 45,
    contentGap: true,
    keywords: [
      { keyword: 'ai seo', volume: 12100, difficulty: 38, relationship: 'parent', semanticScore: 1.0 },
      { keyword: 'ai seo tools', volume: 8500, difficulty: 35, relationship: 'child', semanticScore: 0.95 },
      { keyword: 'ai content optimization', volume: 6200, difficulty: 32, relationship: 'related', semanticScore: 0.88 },
      { keyword: 'chatgpt for seo', volume: 9800, difficulty: 28, relationship: 'related', semanticScore: 0.85 },
      { keyword: 'ai keyword research', volume: 4500, difficulty: 30, relationship: 'child', semanticScore: 0.82 },
      { keyword: 'ai visibility tracking', volume: 2100, difficulty: 25, relationship: 'child', semanticScore: 0.78 },
      { keyword: 'llm optimization', volume: 1800, difficulty: 22, relationship: 'related', semanticScore: 0.75 },
      { keyword: 'ai search optimization', volume: 3200, difficulty: 28, relationship: 'sibling', semanticScore: 0.72 },
    ],
  },
];

// Mock Trend Predictions
export const mockTrendPredictions: TrendPrediction[] = [
  {
    keyword: 'ai seo tools',
    historicalVolume: [
      { month: 'Oct 2025', volume: 4200 },
      { month: 'Nov 2025', volume: 5100 },
      { month: 'Dec 2025', volume: 5800 },
      { month: 'Jan 2026', volume: 6500 },
      { month: 'Feb 2026', volume: 7200 },
      { month: 'Mar 2026', volume: 8500 },
    ],
    predictedVolume: [
      { month: 'Apr 2026', volume: 9800, confidence: 0.92 },
      { month: 'May 2026', volume: 11200, confidence: 0.88 },
      { month: 'Jun 2026', volume: 12800, confidence: 0.82 },
    ],
    seasonality: 'none',
    peakMonths: [],
    trendDirection: 'rising',
    growthRate: 52,
    volatility: 0.15,
  },
  {
    keyword: 'seo services',
    historicalVolume: [
      { month: 'Oct 2025', volume: 74000 },
      { month: 'Nov 2025', volume: 72500 },
      { month: 'Dec 2025', volume: 68000 },
      { month: 'Jan 2026', volume: 78500 },
      { month: 'Feb 2026', volume: 76200 },
      { month: 'Mar 2026', volume: 74800 },
    ],
    predictedVolume: [
      { month: 'Apr 2026', volume: 75500, confidence: 0.95 },
      { month: 'May 2026', volume: 74200, confidence: 0.92 },
      { month: 'Jun 2026', volume: 72800, confidence: 0.88 },
    ],
    seasonality: 'low',
    peakMonths: ['January', 'September'],
    trendDirection: 'stable',
    growthRate: 1.2,
    volatility: 0.08,
  },
  {
    keyword: 'black friday seo',
    historicalVolume: [
      { month: 'Oct 2025', volume: 8500 },
      { month: 'Nov 2025', volume: 45000 },
      { month: 'Dec 2025', volume: 12000 },
      { month: 'Jan 2026', volume: 2200 },
      { month: 'Feb 2026', volume: 1800 },
      { month: 'Mar 2026', volume: 2100 },
    ],
    predictedVolume: [
      { month: 'Apr 2026', volume: 2500, confidence: 0.90 },
      { month: 'May 2026', volume: 3200, confidence: 0.85 },
      { month: 'Jun 2026', volume: 4500, confidence: 0.80 },
    ],
    seasonality: 'high',
    peakMonths: ['November'],
    trendDirection: 'stable',
    growthRate: 0,
    volatility: 0.85,
  },
  {
    keyword: 'core web vitals',
    historicalVolume: [
      { month: 'Oct 2025', volume: 22000 },
      { month: 'Nov 2025', volume: 21500 },
      { month: 'Dec 2025', volume: 20800 },
      { month: 'Jan 2026', volume: 19500 },
      { month: 'Feb 2026', volume: 18200 },
      { month: 'Mar 2026', volume: 17500 },
    ],
    predictedVolume: [
      { month: 'Apr 2026', volume: 16800, confidence: 0.88 },
      { month: 'May 2026', volume: 16200, confidence: 0.82 },
      { month: 'Jun 2026', volume: 15500, confidence: 0.75 },
    ],
    seasonality: 'none',
    peakMonths: [],
    trendDirection: 'declining',
    growthRate: -18,
    volatility: 0.12,
  },
  {
    keyword: 'local seo',
    historicalVolume: [
      { month: 'Oct 2025', volume: 31000 },
      { month: 'Nov 2025', volume: 32500 },
      { month: 'Dec 2025', volume: 30800 },
      { month: 'Jan 2026', volume: 34200 },
      { month: 'Feb 2026', volume: 33500 },
      { month: 'Mar 2026', volume: 33100 },
    ],
    predictedVolume: [
      { month: 'Apr 2026', volume: 34500, confidence: 0.90 },
      { month: 'May 2026', volume: 35200, confidence: 0.85 },
      { month: 'Jun 2026', volume: 35800, confidence: 0.80 },
    ],
    seasonality: 'low',
    peakMonths: ['January', 'April'],
    trendDirection: 'rising',
    growthRate: 8,
    volatility: 0.10,
  },
];

// Mock Intent Classifications
export const mockIntentClassifications: IntentClassification[] = [
  {
    keyword: 'what is technical seo',
    primaryIntent: 'informational',
    intentConfidence: 0.95,
    contentRecommendation: 'Create a comprehensive guide explaining technical SEO concepts, best practices, and implementation steps.',
    suggestedFormat: 'guide',
    buyerJourneyStage: 'awareness',
  },
  {
    keyword: 'best seo agency near me',
    primaryIntent: 'transactional',
    intentConfidence: 0.92,
    secondaryIntent: 'commercial',
    contentRecommendation: 'Create a location-optimized landing page with clear CTAs, testimonials, and service offerings.',
    suggestedFormat: 'landing-page',
    buyerJourneyStage: 'decision',
  },
  {
    keyword: 'semrush vs ahrefs',
    primaryIntent: 'commercial',
    intentConfidence: 0.88,
    secondaryIntent: 'informational',
    contentRecommendation: 'Create a detailed comparison article with pros/cons, pricing, and use case recommendations.',
    suggestedFormat: 'comparison',
    buyerJourneyStage: 'consideration',
  },
  {
    keyword: 'seo services pricing',
    primaryIntent: 'commercial',
    intentConfidence: 0.90,
    secondaryIntent: 'transactional',
    contentRecommendation: 'Create a transparent pricing page with package options, what\'s included, and ROI examples.',
    suggestedFormat: 'landing-page',
    buyerJourneyStage: 'consideration',
  },
  {
    keyword: 'how to do keyword research',
    primaryIntent: 'informational',
    intentConfidence: 0.94,
    contentRecommendation: 'Create a step-by-step tutorial with screenshots, tool recommendations, and practical examples.',
    suggestedFormat: 'guide',
    buyerJourneyStage: 'awareness',
  },
  {
    keyword: 'buy backlinks',
    primaryIntent: 'transactional',
    intentConfidence: 0.96,
    contentRecommendation: 'Create a service page (if offering) or educational content about link building alternatives.',
    suggestedFormat: 'product-page',
    buyerJourneyStage: 'decision',
  },
  {
    keyword: 'seo audit tool free',
    primaryIntent: 'transactional',
    intentConfidence: 0.85,
    secondaryIntent: 'informational',
    contentRecommendation: 'Create a free tool landing page or a comparison of free SEO audit tools.',
    suggestedFormat: 'landing-page',
    buyerJourneyStage: 'consideration',
  },
  {
    keyword: 'google search console',
    primaryIntent: 'navigational',
    intentConfidence: 0.92,
    contentRecommendation: 'Create a comprehensive guide on using Google Search Console effectively.',
    suggestedFormat: 'guide',
    buyerJourneyStage: 'awareness',
  },
  {
    keyword: 'seo faq',
    primaryIntent: 'informational',
    intentConfidence: 0.88,
    contentRecommendation: 'Create an FAQ page addressing common SEO questions with concise, helpful answers.',
    suggestedFormat: 'faq',
    buyerJourneyStage: 'awareness',
  },
  {
    keyword: 'hire seo expert',
    primaryIntent: 'transactional',
    intentConfidence: 0.94,
    contentRecommendation: 'Create a service page highlighting expertise, case studies, and clear hiring process.',
    suggestedFormat: 'landing-page',
    buyerJourneyStage: 'decision',
  },
];

// Mock AI Volume Comparisons
export const mockAIVolumeComparisons: AIVolumeComparison[] = [
  {
    keyword: 'ai seo tools',
    traditionalVolume: 12100,
    aiVolume: 32000,
    aiGrowthRate: 55,
    aiOpportunity: 'high',
    platformBreakdown: { chatgpt: 13000, claude: 6500, gemini: 8000, perplexity: 4500 },
  },
  {
    keyword: 'what is e-e-a-t',
    traditionalVolume: 9900,
    aiVolume: 35000,
    aiGrowthRate: 48,
    aiOpportunity: 'high',
    platformBreakdown: { chatgpt: 15000, claude: 7000, gemini: 8500, perplexity: 4500 },
  },
  {
    keyword: 'technical seo audit',
    traditionalVolume: 8100,
    aiVolume: 15000,
    aiGrowthRate: 38,
    aiOpportunity: 'high',
    platformBreakdown: { chatgpt: 6000, claude: 3500, gemini: 3500, perplexity: 2000 },
  },
  {
    keyword: 'seo for beginners',
    traditionalVolume: 27100,
    aiVolume: 42000,
    aiGrowthRate: 32,
    aiOpportunity: 'high',
    platformBreakdown: { chatgpt: 18000, claude: 8000, gemini: 10000, perplexity: 6000 },
  },
  {
    keyword: 'best seo tools',
    traditionalVolume: 74000,
    aiVolume: 45000,
    aiGrowthRate: 25,
    aiOpportunity: 'medium',
    platformBreakdown: { chatgpt: 18000, claude: 8000, gemini: 12000, perplexity: 7000 },
  },
  {
    keyword: 'keyword research tools',
    traditionalVolume: 33100,
    aiVolume: 28000,
    aiGrowthRate: 22,
    aiOpportunity: 'medium',
    platformBreakdown: { chatgpt: 11000, claude: 5000, gemini: 8000, perplexity: 4000 },
  },
  {
    keyword: 'backlink checker',
    traditionalVolume: 60500,
    aiVolume: 22000,
    aiGrowthRate: 8,
    aiOpportunity: 'low',
    platformBreakdown: { chatgpt: 9000, claude: 4000, gemini: 6000, perplexity: 3000 },
  },
  {
    keyword: 'seo agency near me',
    traditionalVolume: 40500,
    aiVolume: 8500,
    aiGrowthRate: 5,
    aiOpportunity: 'low',
    platformBreakdown: { chatgpt: 3500, claude: 1500, gemini: 2500, perplexity: 1000 },
  },
];

// Helper functions
export const getQuickWins = () => mockKeywordOpportunities.filter(k => k.quickWin);
export const getStrategicTargets = () => mockKeywordOpportunities.filter(k => k.strategicTarget);
export const getHighAIOpportunities = () => mockAIVolumeComparisons.filter(k => k.aiOpportunity === 'high');
export const getRisingTrends = () => mockTrendPredictions.filter(t => t.trendDirection === 'rising');
export const getContentGapClusters = () => mockKeywordClusters.filter(c => c.contentGap);

// Get intent distribution
export const getIntentDistribution = () => {
  const distribution = { informational: 0, navigational: 0, transactional: 0, commercial: 0 };
  mockIntentClassifications.forEach(k => {
    distribution[k.primaryIntent]++;
  });
  return distribution;
};

// Get cluster summary stats
export const getClusterStats = () => ({
  totalClusters: mockKeywordClusters.length,
  totalKeywords: mockKeywordClusters.reduce((sum, c) => sum + c.keywords.length, 0),
  totalVolume: mockKeywordClusters.reduce((sum, c) => sum + c.totalVolume, 0),
  avgAuthority: Math.round(mockKeywordClusters.reduce((sum, c) => sum + c.topicAuthority, 0) / mockKeywordClusters.length),
  contentGaps: mockKeywordClusters.filter(c => c.contentGap).length,
});
