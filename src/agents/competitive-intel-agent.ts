// Competitive Intelligence Agent
// AI-powered competitive analysis and strategy generation

import {
  mockCompetitors,
  mockKeywordGaps,
  mockContentGaps,
  mockBacklinkGaps,
  mockSERPBattles,
  yourSiteData,
  type Competitor,
  type KeywordGap,
  type ContentGap,
  type BacklinkGap,
  type SERPBattle,
} from '@/data/mock-competitors';

// Types
export interface Domain {
  url: string;
  domainRating: number;
  organicTraffic: number;
  keywords: number;
  backlinks: number;
}

export interface TrafficEstimate {
  monthly: number;
  trend: 'growing' | 'stable' | 'declining';
  growthRate: number;
  sources: {
    organic: number;
    paid: number;
    social: number;
    direct: number;
    referral: number;
  };
  topPages: {
    url: string;
    traffic: number;
    percentage: number;
  }[];
}

export interface CompetitiveAnalysis {
  competitors: Competitor[];
  keywordGaps: KeywordGap[];
  contentGaps: ContentGap[];
  backlinkGaps: BacklinkGap[];
  serpBattles: SERPBattle[];
  marketPosition: MarketPosition;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MarketPosition {
  rank: number;
  totalCompetitors: number;
  marketShare: number;
  trend: 'improving' | 'stable' | 'declining';
  competitiveAdvantages: string[];
  competitiveDisadvantages: string[];
}

export interface Strategy {
  summary: string;
  quickWins: StrategyAction[];
  strategicPlays: StrategyAction[];
  longTermGoals: StrategyGoal[];
  resourceAllocation: ResourceAllocation;
  timeline: StrategyTimeline[];
  kpis: KPI[];
}

export interface StrategyAction {
  id: string;
  action: string;
  description: string;
  impact: 'very-high' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  category: 'content' | 'links' | 'technical' | 'keywords';
  priority: number;
}

export interface StrategyGoal {
  id: string;
  goal: string;
  currentValue: number | string;
  targetValue: number | string;
  timeframe: string;
  milestones: { date: string; target: number | string }[];
}

export interface ResourceAllocation {
  content: number;
  linkBuilding: number;
  technical: number;
  analytics: number;
}

export interface StrategyTimeline {
  phase: string;
  duration: string;
  focus: string[];
  expectedOutcome: string;
}

export interface KPI {
  name: string;
  current: number;
  target: number;
  unit: string;
  timeframe: string;
}

// Competitive Intelligence Agent Implementation
export class CompetitiveIntelAgent {
  private domain: string;

  constructor(domain: string = 'example.com') {
    this.domain = domain;
  }

  /**
   * Identify competitors for a domain
   */
  identifyCompetitors(domain: string): Competitor[] {
    // In production, this would use DataForSEO or similar API
    // For now, return mock competitors with relevance scoring
    return mockCompetitors.map(competitor => ({
      ...competitor,
      relevanceScore: this.calculateRelevanceScore(competitor),
    })).sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
  }

  private calculateRelevanceScore(competitor: Competitor): number {
    let score = 0;
    
    // Similar domain rating = more relevant
    const drDiff = Math.abs(competitor.domainRating - yourSiteData.domainRating);
    score += Math.max(0, 100 - drDiff * 2);
    
    // Similar traffic = more relevant
    const trafficRatio = Math.min(competitor.organicTraffic, yourSiteData.organicTraffic) / 
                         Math.max(competitor.organicTraffic, yourSiteData.organicTraffic);
    score += trafficRatio * 100;
    
    // Higher market share = more important competitor
    score += competitor.marketShare * 2;
    
    return Math.round(score / 3);
  }

  /**
   * Analyze keyword gaps between you and competitors
   */
  analyzeKeywordGaps(you: Domain, competitors: Domain[]): KeywordGap[] {
    // In production, this would compare actual keyword rankings
    // For now, return mock data with opportunity scoring
    return mockKeywordGaps.map(gap => ({
      ...gap,
      opportunityScore: this.calculateKeywordOpportunity(gap),
    })).sort((a, b) => (b as any).opportunityScore - (a as any).opportunityScore);
  }

  private calculateKeywordOpportunity(gap: KeywordGap): number {
    let score = 0;
    
    // Higher volume = better opportunity
    score += Math.min(gap.volume / 100, 100);
    
    // Lower difficulty = easier to rank
    score += (100 - gap.difficulty);
    
    // Higher CPC = more valuable
    score += Math.min(gap.cpc * 2, 50);
    
    // More competitors ranking = validated keyword
    score += gap.competitors.length * 10;
    
    // If you're already ranking (just not well), easier to improve
    if (gap.yourPosition && gap.yourPosition <= 50) {
      score += 30;
    }
    
    return Math.round(score / 4);
  }

  /**
   * Analyze backlink gaps
   */
  analyzeBacklinkGaps(you: Domain, competitors: Domain[]): BacklinkGap[] {
    // In production, this would compare actual backlink profiles
    return mockBacklinkGaps.map(gap => ({
      ...gap,
      outreachScore: this.calculateOutreachScore(gap),
    })).sort((a, b) => (b as any).outreachScore - (a as any).outreachScore);
  }

  private calculateOutreachScore(gap: BacklinkGap): number {
    let score = 0;
    
    // Higher DR = more valuable link
    score += gap.domainRating;
    
    // More traffic = more valuable
    score += Math.min(gap.traffic / 10000, 50);
    
    // Links to multiple competitors = proven link opportunity
    score += gap.linksToCompetitors * 15;
    
    // Already links to you = relationship exists
    if (gap.linksToYou > 0) {
      score += 20;
    }
    
    // Has contact info = actionable
    if (gap.contactEmail) {
      score += 25;
    }
    
    return Math.round(score / 3);
  }

  /**
   * Estimate traffic for a domain
   */
  estimateTraffic(domain: string): TrafficEstimate {
    // In production, this would use traffic estimation APIs
    const competitor = mockCompetitors.find(c => c.url === domain);
    const traffic = competitor?.organicTraffic || yourSiteData.organicTraffic;
    
    return {
      monthly: traffic,
      trend: (competitor?.trafficChange ?? 0) > 5 ? 'growing' : 
             (competitor?.trafficChange ?? 0) < -5 ? 'declining' : 'stable',
      growthRate: competitor?.trafficChange ?? yourSiteData.trafficChange,
      sources: {
        organic: Math.round(traffic * 0.65),
        paid: Math.round(traffic * 0.15),
        social: Math.round(traffic * 0.08),
        direct: Math.round(traffic * 0.07),
        referral: Math.round(traffic * 0.05),
      },
      topPages: [
        { url: '/', traffic: Math.round(traffic * 0.15), percentage: 15 },
        { url: '/services', traffic: Math.round(traffic * 0.12), percentage: 12 },
        { url: '/blog', traffic: Math.round(traffic * 0.10), percentage: 10 },
        { url: '/pricing', traffic: Math.round(traffic * 0.08), percentage: 8 },
        { url: '/about', traffic: Math.round(traffic * 0.05), percentage: 5 },
      ],
    };
  }

  /**
   * Generate comprehensive competitive strategy
   */
  generateStrategy(analysis: CompetitiveAnalysis): Strategy {
    const quickWins = this.generateQuickWins(analysis);
    const strategicPlays = this.generateStrategicPlays(analysis);
    const longTermGoals = this.generateLongTermGoals(analysis);
    
    return {
      summary: this.generateStrategySummary(analysis),
      quickWins,
      strategicPlays,
      longTermGoals,
      resourceAllocation: this.calculateResourceAllocation(analysis),
      timeline: this.generateTimeline(quickWins, strategicPlays, longTermGoals),
      kpis: this.generateKPIs(analysis),
    };
  }

  private generateStrategySummary(analysis: CompetitiveAnalysis): string {
    const position = analysis.marketPosition;
    const topCompetitor = analysis.competitors[0];
    
    return `Based on comprehensive competitive analysis, you currently rank #${position.rank} ` +
           `out of ${position.totalCompetitors + 1} competitors with ${position.marketShare}% market share. ` +
           `Your primary competitor is ${topCompetitor.name} with ${topCompetitor.marketShare}% market share. ` +
           `Key opportunities include ${analysis.keywordGaps.filter(k => k.opportunity === 'high').length} ` +
           `high-priority keyword gaps and ${analysis.backlinkGaps.filter(b => b.outreachPriority === 'high').length} ` +
           `high-value backlink opportunities. Focus on content creation and link building to close the gap.`;
  }

  private generateQuickWins(analysis: CompetitiveAnalysis): StrategyAction[] {
    const actions: StrategyAction[] = [];
    
    // Keyword quick wins - low difficulty, high volume keywords where you're close to ranking
    const keywordQuickWins = analysis.keywordGaps
      .filter(k => k.difficulty < 50 && k.yourPosition && k.yourPosition <= 20)
      .slice(0, 3);
    
    keywordQuickWins.forEach((kw, i) => {
      actions.push({
        id: `qw-kw-${i}`,
        action: `Optimize for "${kw.keyword}"`,
        description: `You're at position #${kw.yourPosition}. With targeted optimization, you can reach top 5.`,
        impact: 'high',
        effort: 'low',
        timeframe: '1-2 weeks',
        category: 'keywords',
        priority: 1,
      });
    });
    
    // Content quick wins - topics with low competitor coverage
    const contentQuickWins = analysis.contentGaps
      .filter(c => c.competitorCoverage < 60 && c.estimatedTraffic > 5000)
      .slice(0, 2);
    
    contentQuickWins.forEach((content, i) => {
      actions.push({
        id: `qw-content-${i}`,
        action: `Create content for "${content.topic}"`,
        description: `Competitors have only ${content.competitorCoverage}% coverage. Est. traffic: ${content.estimatedTraffic}/mo`,
        impact: 'high',
        effort: 'medium',
        timeframe: '1-2 weeks',
        category: 'content',
        priority: 2,
      });
    });
    
    // Backlink quick wins - sites with contact info
    const backlinkQuickWins = analysis.backlinkGaps
      .filter(b => b.contactEmail && b.domainRating >= 70)
      .slice(0, 2);
    
    backlinkQuickWins.forEach((link, i) => {
      actions.push({
        id: `qw-link-${i}`,
        action: `Reach out to ${link.domain}`,
        description: `DR ${link.domainRating}, links to ${link.linksToCompetitors} competitors. Contact available.`,
        impact: 'high',
        effort: 'low',
        timeframe: '1 week',
        category: 'links',
        priority: 1,
      });
    });
    
    return actions.sort((a, b) => a.priority - b.priority);
  }

  private generateStrategicPlays(analysis: CompetitiveAnalysis): StrategyAction[] {
    const actions: StrategyAction[] = [];
    
    // High-value content creation
    const highValueContent = analysis.contentGaps
      .filter(c => c.priority === 'high' && c.estimatedTraffic > 8000)
      .slice(0, 3);
    
    highValueContent.forEach((content, i) => {
      actions.push({
        id: `sp-content-${i}`,
        action: `Build comprehensive ${content.contentType} for "${content.topic}"`,
        description: `Gap: ${content.competitorCoverage - content.yourCoverage}%. Est. traffic: ${content.estimatedTraffic}/mo`,
        impact: content.estimatedTraffic > 10000 ? 'very-high' : 'high',
        effort: content.contentType === 'tool' ? 'high' : 'medium',
        timeframe: '1-2 months',
        category: 'content',
        priority: 1,
      });
    });
    
    // Link building campaigns
    const highDRLinks = analysis.backlinkGaps
      .filter(b => b.domainRating >= 80)
      .slice(0, 3);
    
    if (highDRLinks.length > 0) {
      actions.push({
        id: 'sp-link-campaign',
        action: `Launch link building campaign targeting ${highDRLinks.length} high-DR domains`,
        description: `Target domains: ${highDRLinks.map(l => l.domain).join(', ')}`,
        impact: 'high',
        effort: 'high',
        timeframe: '2-3 months',
        category: 'links',
        priority: 2,
      });
    }
    
    // Competitive keyword targeting
    const competitiveKeywords = analysis.keywordGaps
      .filter(k => k.volume > 5000 && k.difficulty >= 50)
      .slice(0, 3);
    
    if (competitiveKeywords.length > 0) {
      actions.push({
        id: 'sp-keywords',
        action: `Target ${competitiveKeywords.length} high-volume competitive keywords`,
        description: `Keywords: ${competitiveKeywords.map(k => k.keyword).join(', ')}`,
        impact: 'very-high',
        effort: 'high',
        timeframe: '2-3 months',
        category: 'keywords',
        priority: 1,
      });
    }
    
    return actions.sort((a, b) => a.priority - b.priority);
  }

  private generateLongTermGoals(analysis: CompetitiveAnalysis): StrategyGoal[] {
    const topCompetitor = analysis.competitors[0];
    
    return [
      {
        id: 'goal-market-share',
        goal: 'Increase market share',
        currentValue: `${analysis.marketPosition.marketShare}%`,
        targetValue: `${Math.min(analysis.marketPosition.marketShare + 10, 35)}%`,
        timeframe: '6 months',
        milestones: [
          { date: '2 months', target: `${analysis.marketPosition.marketShare + 3}%` },
          { date: '4 months', target: `${analysis.marketPosition.marketShare + 6}%` },
          { date: '6 months', target: `${analysis.marketPosition.marketShare + 10}%` },
        ],
      },
      {
        id: 'goal-traffic-gap',
        goal: `Close traffic gap with ${topCompetitor.name}`,
        currentValue: yourSiteData.organicTraffic,
        targetValue: Math.round(topCompetitor.organicTraffic * 0.8),
        timeframe: '6 months',
        milestones: [
          { date: '2 months', target: Math.round(yourSiteData.organicTraffic * 1.15) },
          { date: '4 months', target: Math.round(yourSiteData.organicTraffic * 1.35) },
          { date: '6 months', target: Math.round(topCompetitor.organicTraffic * 0.8) },
        ],
      },
      {
        id: 'goal-dr',
        goal: 'Improve Domain Rating',
        currentValue: yourSiteData.domainRating,
        targetValue: Math.min(yourSiteData.domainRating + 10, 80),
        timeframe: '6 months',
        milestones: [
          { date: '2 months', target: yourSiteData.domainRating + 3 },
          { date: '4 months', target: yourSiteData.domainRating + 6 },
          { date: '6 months', target: yourSiteData.domainRating + 10 },
        ],
      },
      {
        id: 'goal-ai-visibility',
        goal: 'Improve AI Visibility Score',
        currentValue: yourSiteData.aiVisibilityScore,
        targetValue: 85,
        timeframe: '6 months',
        milestones: [
          { date: '2 months', target: yourSiteData.aiVisibilityScore + 5 },
          { date: '4 months', target: yourSiteData.aiVisibilityScore + 10 },
          { date: '6 months', target: 85 },
        ],
      },
    ];
  }

  private calculateResourceAllocation(analysis: CompetitiveAnalysis): ResourceAllocation {
    // Calculate based on gap analysis
    const contentGapScore = analysis.contentGaps.filter(c => c.priority === 'high').length;
    const backlinkGapScore = analysis.backlinkGaps.filter(b => b.outreachPriority === 'high').length;
    const keywordGapScore = analysis.keywordGaps.filter(k => k.opportunity === 'high').length;
    
    const total = contentGapScore + backlinkGapScore + keywordGapScore + 5; // +5 for technical baseline
    
    return {
      content: Math.round((contentGapScore / total) * 100) || 40,
      linkBuilding: Math.round((backlinkGapScore / total) * 100) || 35,
      technical: 20,
      analytics: 5,
    };
  }

  private generateTimeline(
    quickWins: StrategyAction[],
    strategicPlays: StrategyAction[],
    longTermGoals: StrategyGoal[]
  ): StrategyTimeline[] {
    return [
      {
        phase: 'Phase 1: Quick Wins',
        duration: 'Weeks 1-4',
        focus: quickWins.slice(0, 3).map(a => a.action),
        expectedOutcome: 'Initial traffic boost and quick ranking improvements',
      },
      {
        phase: 'Phase 2: Foundation Building',
        duration: 'Months 2-3',
        focus: strategicPlays.slice(0, 3).map(a => a.action),
        expectedOutcome: 'Establish content authority and begin link acquisition',
      },
      {
        phase: 'Phase 3: Competitive Push',
        duration: 'Months 4-5',
        focus: ['Scale successful content strategies', 'Intensify link building', 'Target competitive keywords'],
        expectedOutcome: 'Significant market share gains and traffic growth',
      },
      {
        phase: 'Phase 4: Market Leadership',
        duration: 'Month 6+',
        focus: longTermGoals.map(g => g.goal),
        expectedOutcome: 'Achieve target market position and sustainable competitive advantage',
      },
    ];
  }

  private generateKPIs(analysis: CompetitiveAnalysis): KPI[] {
    return [
      {
        name: 'Organic Traffic',
        current: yourSiteData.organicTraffic,
        target: Math.round(yourSiteData.organicTraffic * 1.5),
        unit: 'visits/month',
        timeframe: '6 months',
      },
      {
        name: 'Domain Rating',
        current: yourSiteData.domainRating,
        target: Math.min(yourSiteData.domainRating + 10, 80),
        unit: 'DR',
        timeframe: '6 months',
      },
      {
        name: 'Ranking Keywords',
        current: yourSiteData.keywords,
        target: Math.round(yourSiteData.keywords * 1.4),
        unit: 'keywords',
        timeframe: '6 months',
      },
      {
        name: 'Market Share',
        current: yourSiteData.marketShare,
        target: Math.min(yourSiteData.marketShare + 10, 35),
        unit: '%',
        timeframe: '6 months',
      },
      {
        name: 'Backlinks',
        current: yourSiteData.backlinks,
        target: Math.round(yourSiteData.backlinks * 1.3),
        unit: 'links',
        timeframe: '6 months',
      },
      {
        name: 'AI Visibility Score',
        current: yourSiteData.aiVisibilityScore,
        target: 85,
        unit: 'score',
        timeframe: '6 months',
      },
    ];
  }

  /**
   * Perform full competitive analysis
   */
  performFullAnalysis(): CompetitiveAnalysis {
    const competitors = this.identifyCompetitors(this.domain);
    const you: Domain = {
      url: this.domain,
      domainRating: yourSiteData.domainRating,
      organicTraffic: yourSiteData.organicTraffic,
      keywords: yourSiteData.keywords,
      backlinks: yourSiteData.backlinks,
    };
    
    const competitorDomains = competitors.map(c => ({
      url: c.url,
      domainRating: c.domainRating,
      organicTraffic: c.organicTraffic,
      keywords: c.keywords,
      backlinks: c.backlinks,
    }));
    
    return {
      competitors,
      keywordGaps: this.analyzeKeywordGaps(you, competitorDomains),
      contentGaps: mockContentGaps,
      backlinkGaps: this.analyzeBacklinkGaps(you, competitorDomains),
      serpBattles: mockSERPBattles,
      marketPosition: this.analyzeMarketPosition(competitors),
      ...this.performSWOTAnalysis(competitors),
    };
  }

  private analyzeMarketPosition(competitors: Competitor[]): MarketPosition {
    const sortedByShare = [...competitors, { ...yourSiteData, name: 'You' }]
      .sort((a, b) => b.marketShare - a.marketShare);
    
    const yourRank = sortedByShare.findIndex(c => c.name === 'You') + 1;
    
    return {
      rank: yourRank,
      totalCompetitors: competitors.length,
      marketShare: yourSiteData.marketShare,
      trend: yourSiteData.trafficChange > 10 ? 'improving' : 
             yourSiteData.trafficChange < -5 ? 'declining' : 'stable',
      competitiveAdvantages: [
        'Strong traffic growth (+28.5%)',
        'Improving domain rating (+4)',
        'Good AI visibility score (68)',
      ],
      competitiveDisadvantages: [
        'Lower market share than top 2 competitors',
        'Fewer backlinks than industry average',
        'Content gaps in key topics',
      ],
    };
  }

  private performSWOTAnalysis(competitors: Competitor[]): {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  } {
    return {
      strengths: [
        `Strong traffic growth (${yourSiteData.trafficChange}% vs industry avg)`,
        `Improving domain authority (+${yourSiteData.drChange} DR)`,
        `Good keyword growth (+${yourSiteData.keywordsChange}%)`,
        `Solid AI visibility score (${yourSiteData.aiVisibilityScore})`,
      ],
      weaknesses: [
        `Lower market share (${yourSiteData.marketShare}%) than top competitors`,
        `Fewer backlinks (${yourSiteData.backlinks}) than industry leaders`,
        `Content gaps in ${mockContentGaps.filter(c => c.yourCoverage < 30).length} key topics`,
        `Not ranking for ${mockKeywordGaps.filter(k => !k.yourPosition).length} valuable keywords`,
      ],
      opportunities: [
        `${mockKeywordGaps.filter(k => k.opportunity === 'high').length} high-priority keyword gaps to target`,
        `${mockBacklinkGaps.filter(b => b.outreachPriority === 'high').length} high-value link opportunities`,
        `${mockContentGaps.filter(c => c.priority === 'high').length} high-impact content topics`,
        'Growing AI search market to capitalize on',
      ],
      threats: [
        `${competitors[0].name} has ${competitors[0].marketShare}% market share`,
        `Top competitor traffic is ${Math.round(competitors[0].organicTraffic / yourSiteData.organicTraffic * 100)}% of yours`,
        'Increasing competition in AI SEO space',
        'Algorithm updates may impact rankings',
      ],
    };
  }
}

// Export singleton instance
export const competitiveIntelAgent = new CompetitiveIntelAgent();

// Export convenience functions
export const identifyCompetitors = (domain: string) => competitiveIntelAgent.identifyCompetitors(domain);
export const analyzeKeywordGaps = (you: Domain, competitors: Domain[]) => competitiveIntelAgent.analyzeKeywordGaps(you, competitors);
export const analyzeBacklinkGaps = (you: Domain, competitors: Domain[]) => competitiveIntelAgent.analyzeBacklinkGaps(you, competitors);
export const estimateTraffic = (domain: string) => competitiveIntelAgent.estimateTraffic(domain);
export const generateStrategy = (analysis: CompetitiveAnalysis) => competitiveIntelAgent.generateStrategy(analysis);
export const performFullAnalysis = () => competitiveIntelAgent.performFullAnalysis();
