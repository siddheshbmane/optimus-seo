// Mock AI Keyword Data
// Compares AI search volume vs traditional Google search volume

import type { AIKeywordData, LLMPlatform } from '@/lib/dataforseo/types';

export const mockAIKeywords: AIKeywordData[] = [
  {
    keyword: 'best seo tools',
    ai_search_volume: 45000,
    traditional_search_volume: 74000,
    ai_volume_trend: 'rising',
    ai_competition: 'high',
    ai_cpc: 8.50,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 18000, trend: 25 },
      { platform: 'claude', estimated_queries: 8000, trend: 35 },
      { platform: 'gemini', estimated_queries: 12000, trend: 20 },
      { platform: 'perplexity', estimated_queries: 7000, trend: 45 },
    ],
  },
  {
    keyword: 'how to improve seo',
    ai_search_volume: 38000,
    traditional_search_volume: 49500,
    ai_volume_trend: 'rising',
    ai_competition: 'medium',
    ai_cpc: 5.20,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 15000, trend: 18 },
      { platform: 'claude', estimated_queries: 7500, trend: 28 },
      { platform: 'gemini', estimated_queries: 10000, trend: 15 },
      { platform: 'perplexity', estimated_queries: 5500, trend: 32 },
    ],
  },
  {
    keyword: 'keyword research tools',
    ai_search_volume: 28000,
    traditional_search_volume: 33100,
    ai_volume_trend: 'rising',
    ai_competition: 'high',
    ai_cpc: 12.30,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 11000, trend: 22 },
      { platform: 'claude', estimated_queries: 5000, trend: 30 },
      { platform: 'gemini', estimated_queries: 8000, trend: 18 },
      { platform: 'perplexity', estimated_queries: 4000, trend: 40 },
    ],
  },
  {
    keyword: 'technical seo audit',
    ai_search_volume: 15000,
    traditional_search_volume: 8100,
    ai_volume_trend: 'rising',
    ai_competition: 'medium',
    ai_cpc: 15.80,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 6000, trend: 35 },
      { platform: 'claude', estimated_queries: 3500, trend: 42 },
      { platform: 'gemini', estimated_queries: 3500, trend: 28 },
      { platform: 'perplexity', estimated_queries: 2000, trend: 50 },
    ],
  },
  {
    keyword: 'backlink checker',
    ai_search_volume: 22000,
    traditional_search_volume: 60500,
    ai_volume_trend: 'stable',
    ai_competition: 'high',
    ai_cpc: 9.40,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 9000, trend: 8 },
      { platform: 'claude', estimated_queries: 4000, trend: 12 },
      { platform: 'gemini', estimated_queries: 6000, trend: 5 },
      { platform: 'perplexity', estimated_queries: 3000, trend: 15 },
    ],
  },
  {
    keyword: 'ai seo tools',
    ai_search_volume: 32000,
    traditional_search_volume: 12100,
    ai_volume_trend: 'rising',
    ai_competition: 'medium',
    ai_cpc: 11.20,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 13000, trend: 55 },
      { platform: 'claude', estimated_queries: 6500, trend: 62 },
      { platform: 'gemini', estimated_queries: 8000, trend: 48 },
      { platform: 'perplexity', estimated_queries: 4500, trend: 70 },
    ],
  },
  {
    keyword: 'seo for beginners',
    ai_search_volume: 42000,
    traditional_search_volume: 27100,
    ai_volume_trend: 'rising',
    ai_competition: 'low',
    ai_cpc: 3.80,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 18000, trend: 30 },
      { platform: 'claude', estimated_queries: 8000, trend: 38 },
      { platform: 'gemini', estimated_queries: 10000, trend: 25 },
      { platform: 'perplexity', estimated_queries: 6000, trend: 42 },
    ],
  },
  {
    keyword: 'local seo services',
    ai_search_volume: 18000,
    traditional_search_volume: 22200,
    ai_volume_trend: 'stable',
    ai_competition: 'high',
    ai_cpc: 25.60,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 7500, trend: 10 },
      { platform: 'claude', estimated_queries: 3500, trend: 15 },
      { platform: 'gemini', estimated_queries: 4500, trend: 8 },
      { platform: 'perplexity', estimated_queries: 2500, trend: 18 },
    ],
  },
  {
    keyword: 'content optimization',
    ai_search_volume: 25000,
    traditional_search_volume: 14800,
    ai_volume_trend: 'rising',
    ai_competition: 'medium',
    ai_cpc: 7.90,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 10000, trend: 28 },
      { platform: 'claude', estimated_queries: 5500, trend: 35 },
      { platform: 'gemini', estimated_queries: 6000, trend: 22 },
      { platform: 'perplexity', estimated_queries: 3500, trend: 40 },
    ],
  },
  {
    keyword: 'rank tracking software',
    ai_search_volume: 12000,
    traditional_search_volume: 18100,
    ai_volume_trend: 'declining',
    ai_competition: 'high',
    ai_cpc: 18.40,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 5000, trend: -5 },
      { platform: 'claude', estimated_queries: 2500, trend: -8 },
      { platform: 'gemini', estimated_queries: 3000, trend: -3 },
      { platform: 'perplexity', estimated_queries: 1500, trend: -10 },
    ],
  },
  {
    keyword: 'seo agency near me',
    ai_search_volume: 8500,
    traditional_search_volume: 40500,
    ai_volume_trend: 'stable',
    ai_competition: 'high',
    ai_cpc: 45.20,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 3500, trend: 5 },
      { platform: 'claude', estimated_queries: 1500, trend: 8 },
      { platform: 'gemini', estimated_queries: 2500, trend: 3 },
      { platform: 'perplexity', estimated_queries: 1000, trend: 12 },
    ],
  },
  {
    keyword: 'what is e-e-a-t',
    ai_search_volume: 35000,
    traditional_search_volume: 9900,
    ai_volume_trend: 'rising',
    ai_competition: 'low',
    ai_cpc: 2.10,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 15000, trend: 45 },
      { platform: 'claude', estimated_queries: 7000, trend: 52 },
      { platform: 'gemini', estimated_queries: 8500, trend: 38 },
      { platform: 'perplexity', estimated_queries: 4500, trend: 58 },
    ],
  },
  {
    keyword: 'google algorithm update',
    ai_search_volume: 28000,
    traditional_search_volume: 18100,
    ai_volume_trend: 'rising',
    ai_competition: 'low',
    ai_cpc: 4.50,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 12000, trend: 32 },
      { platform: 'claude', estimated_queries: 5500, trend: 40 },
      { platform: 'gemini', estimated_queries: 7000, trend: 28 },
      { platform: 'perplexity', estimated_queries: 3500, trend: 48 },
    ],
  },
  {
    keyword: 'how to get featured snippets',
    ai_search_volume: 22000,
    traditional_search_volume: 6600,
    ai_volume_trend: 'rising',
    ai_competition: 'medium',
    ai_cpc: 6.80,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 9500, trend: 38 },
      { platform: 'claude', estimated_queries: 4500, trend: 45 },
      { platform: 'gemini', estimated_queries: 5500, trend: 32 },
      { platform: 'perplexity', estimated_queries: 2500, trend: 52 },
    ],
  },
  {
    keyword: 'ai visibility tracking',
    ai_search_volume: 8500,
    traditional_search_volume: 720,
    ai_volume_trend: 'rising',
    ai_competition: 'low',
    ai_cpc: 15.00,
    platforms_data: [
      { platform: 'chatgpt', estimated_queries: 3500, trend: 85 },
      { platform: 'claude', estimated_queries: 1800, trend: 92 },
      { platform: 'gemini', estimated_queries: 2200, trend: 78 },
      { platform: 'perplexity', estimated_queries: 1000, trend: 95 },
    ],
  },
];

// Keywords with high AI volume but low traditional volume (opportunities)
export const mockAIFirstKeywords = mockAIKeywords
  .filter(k => k.ai_search_volume > k.traditional_search_volume)
  .sort((a, b) => (b.ai_search_volume / b.traditional_search_volume) - (a.ai_search_volume / a.traditional_search_volume));

// Keywords with rising AI trends
export const mockRisingAIKeywords = mockAIKeywords
  .filter(k => k.ai_volume_trend === 'rising')
  .sort((a, b) => {
    const aAvgTrend = a.platforms_data.reduce((sum, p) => sum + p.trend, 0) / a.platforms_data.length;
    const bAvgTrend = b.platforms_data.reduce((sum, p) => sum + p.trend, 0) / b.platforms_data.length;
    return bAvgTrend - aAvgTrend;
  });

// Platform-specific volume leaders
export const mockPlatformLeaders: Record<LLMPlatform, AIKeywordData[]> = {
  chatgpt: [...mockAIKeywords].sort((a, b) => {
    const aVol = a.platforms_data.find(p => p.platform === 'chatgpt')?.estimated_queries || 0;
    const bVol = b.platforms_data.find(p => p.platform === 'chatgpt')?.estimated_queries || 0;
    return bVol - aVol;
  }).slice(0, 5),
  claude: [...mockAIKeywords].sort((a, b) => {
    const aVol = a.platforms_data.find(p => p.platform === 'claude')?.estimated_queries || 0;
    const bVol = b.platforms_data.find(p => p.platform === 'claude')?.estimated_queries || 0;
    return bVol - aVol;
  }).slice(0, 5),
  gemini: [...mockAIKeywords].sort((a, b) => {
    const aVol = a.platforms_data.find(p => p.platform === 'gemini')?.estimated_queries || 0;
    const bVol = b.platforms_data.find(p => p.platform === 'gemini')?.estimated_queries || 0;
    return bVol - aVol;
  }).slice(0, 5),
  perplexity: [...mockAIKeywords].sort((a, b) => {
    const aVol = a.platforms_data.find(p => p.platform === 'perplexity')?.estimated_queries || 0;
    const bVol = b.platforms_data.find(p => p.platform === 'perplexity')?.estimated_queries || 0;
    return bVol - aVol;
  }).slice(0, 5),
};

// Helper to calculate AI opportunity score
export function calculateAIOpportunityScore(keyword: AIKeywordData): number {
  const volumeRatio = keyword.ai_search_volume / Math.max(keyword.traditional_search_volume, 1);
  const trendBonus = keyword.ai_volume_trend === 'rising' ? 20 : keyword.ai_volume_trend === 'stable' ? 0 : -10;
  const competitionBonus = keyword.ai_competition === 'low' ? 15 : keyword.ai_competition === 'medium' ? 5 : 0;
  
  const avgTrend = keyword.platforms_data.reduce((sum, p) => sum + p.trend, 0) / keyword.platforms_data.length;
  const trendScore = Math.min(avgTrend, 50);
  
  return Math.min(100, Math.round((volumeRatio * 30) + trendBonus + competitionBonus + trendScore));
}

// Get keywords sorted by opportunity
export const mockAIKeywordsByOpportunity = [...mockAIKeywords]
  .map(k => ({ ...k, opportunity_score: calculateAIOpportunityScore(k) }))
  .sort((a, b) => b.opportunity_score - a.opportunity_score);
