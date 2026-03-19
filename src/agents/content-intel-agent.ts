// Content Intelligence Agent
// AI-powered content analysis, brief generation, and optimization

// Types
export interface Page {
  url: string;
  title: string;
  content: string;
  wordCount: number;
  publishedDate: string;
  lastUpdated: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export interface ContentAudit {
  totalPages: number;
  averageWordCount: number;
  averageContentScore: number;
  contentByStatus: {
    excellent: number;
    good: number;
    needsImprovement: number;
    poor: number;
  };
  contentByAge: {
    fresh: number; // < 3 months
    recent: number; // 3-6 months
    aging: number; // 6-12 months
    stale: number; // > 12 months
  };
  topPerformers: ContentPerformance[];
  underperformers: ContentPerformance[];
  recommendations: ContentRecommendation[];
}

export interface ContentPerformance {
  url: string;
  title: string;
  contentScore: number;
  traffic: number;
  conversions: number;
  bounceRate: number;
  avgTimeOnPage: number;
  backlinks: number;
  socialShares: number;
  lastUpdated: string;
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
}

export interface ContentRecommendation {
  id: string;
  type: 'update' | 'consolidate' | 'delete' | 'expand' | 'optimize';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedPages: string[];
  estimatedImpact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface ContentBrief {
  id: string;
  targetKeyword: string;
  title: string;
  metaDescription: string;
  recommendedWordCount: { min: number; max: number; optimal: number };
  outline: ContentOutline;
  semanticKeywords: SemanticKeyword[];
  questionsToAnswer: string[];
  competitorInsights: CompetitorContent[];
  internalLinkSuggestions: InternalLink[];
  externalSourceSuggestions: ExternalSource[];
  contentGuidelines: ContentGuideline[];
  seoChecklist: SEOChecklistItem[];
}

export interface ContentOutline {
  introduction: string;
  sections: OutlineSection[];
  conclusion: string;
}

export interface OutlineSection {
  heading: string;
  level: 'h2' | 'h3' | 'h4';
  keyPoints: string[];
  suggestedWordCount: number;
  semanticKeywords: string[];
}

export interface SemanticKeyword {
  keyword: string;
  relevance: number; // 0-100
  searchVolume: number;
  difficulty: number;
  suggestedUsage: number; // How many times to use
  context: string; // Where to use it
}

export interface CompetitorContent {
  url: string;
  title: string;
  wordCount: number;
  contentScore: number;
  headings: string[];
  uniqueTopics: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface InternalLink {
  targetUrl: string;
  targetTitle: string;
  anchorText: string;
  relevance: number;
  context: string;
}

export interface ExternalSource {
  url: string;
  title: string;
  authority: number;
  type: 'study' | 'statistic' | 'expert' | 'tool' | 'reference';
  suggestedUsage: string;
}

export interface ContentGuideline {
  category: string;
  guidelines: string[];
}

export interface SEOChecklistItem {
  id: string;
  category: string;
  item: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  completed: boolean;
}

export interface SERPContentAnalysis {
  keyword: string;
  searchIntent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  serpFeatures: SERPFeature[];
  topResults: SERPResult[];
  contentPatterns: ContentPattern[];
  recommendations: string[];
  avgWordCount: number;
  avgHeadings: number;
  avgImages: number;
  avgVideos: number;
  commonTopics: string[];
  contentGaps: string[];
}

export interface SERPFeature {
  type: 'featured-snippet' | 'people-also-ask' | 'video' | 'image' | 'local-pack' | 'knowledge-panel' | 'shopping';
  present: boolean;
  opportunity: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface SERPResult {
  position: number;
  url: string;
  title: string;
  description: string;
  wordCount: number;
  headings: number;
  images: number;
  videos: number;
  contentScore: number;
  domainAuthority: number;
}

export interface ContentPattern {
  pattern: string;
  frequency: number; // How many top results use this
  importance: 'high' | 'medium' | 'low';
  example: string;
}

export interface OptimizationSuggestions {
  overallScore: number;
  readabilityScore: number;
  seoScore: number;
  engagementScore: number;
  suggestions: OptimizationSuggestion[];
  keywordAnalysis: KeywordAnalysis;
  readabilityAnalysis: ReadabilityAnalysis;
  structureAnalysis: StructureAnalysis;
  internalLinkingAnalysis: InternalLinkingAnalysis;
}

export interface OptimizationSuggestion {
  id: string;
  category: 'seo' | 'readability' | 'engagement' | 'structure' | 'keywords';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentValue?: string;
  suggestedValue?: string;
  impact: string;
}

export interface KeywordAnalysis {
  targetKeyword: string;
  density: number;
  occurrences: number;
  inTitle: boolean;
  inH1: boolean;
  inFirstParagraph: boolean;
  inMetaDescription: boolean;
  inUrl: boolean;
  semanticKeywordsUsed: number;
  semanticKeywordsMissing: string[];
}

export interface ReadabilityAnalysis {
  fleschScore: number;
  gradeLevel: number;
  avgSentenceLength: number;
  avgWordLength: number;
  passiveVoicePercentage: number;
  complexWordPercentage: number;
  suggestions: string[];
}

export interface StructureAnalysis {
  hasH1: boolean;
  h2Count: number;
  h3Count: number;
  paragraphCount: number;
  avgParagraphLength: number;
  hasImages: boolean;
  imageCount: number;
  hasVideos: boolean;
  hasBulletPoints: boolean;
  hasNumberedLists: boolean;
  hasTables: boolean;
  suggestions: string[];
}

export interface InternalLinkingAnalysis {
  internalLinkCount: number;
  externalLinkCount: number;
  brokenLinks: string[];
  orphanedContent: boolean;
  suggestedInternalLinks: InternalLink[];
}

export interface PerformancePrediction {
  estimatedTraffic: { min: number; max: number; expected: number };
  estimatedRanking: { min: number; max: number; expected: number };
  timeToRank: string;
  confidenceScore: number;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface TopicCluster {
  id: string;
  pillarTopic: string;
  pillarUrl?: string;
  subtopics: Subtopic[];
  totalSearchVolume: number;
  avgDifficulty: number;
  coverage: number; // Percentage of subtopics covered
  authority: number;
}

export interface Subtopic {
  topic: string;
  searchVolume: number;
  difficulty: number;
  status: 'covered' | 'partial' | 'missing';
  url?: string;
  contentScore?: number;
}

// Content Intelligence Agent Implementation
export class ContentIntelAgent {
  private domain: string;

  constructor(domain: string = 'example.com') {
    this.domain = domain;
  }

  /**
   * Audit all content on the site
   */
  auditContent(pages: Page[]): ContentAudit {
    // Calculate metrics
    const totalPages = pages.length || 156;
    const avgWordCount = pages.length > 0 
      ? Math.round(pages.reduce((sum, p) => sum + p.wordCount, 0) / pages.length)
      : 1847;

    // Generate mock audit data
    return {
      totalPages,
      averageWordCount: avgWordCount,
      averageContentScore: 72,
      contentByStatus: {
        excellent: Math.round(totalPages * 0.15),
        good: Math.round(totalPages * 0.35),
        needsImprovement: Math.round(totalPages * 0.35),
        poor: Math.round(totalPages * 0.15),
      },
      contentByAge: {
        fresh: Math.round(totalPages * 0.20),
        recent: Math.round(totalPages * 0.25),
        aging: Math.round(totalPages * 0.30),
        stale: Math.round(totalPages * 0.25),
      },
      topPerformers: this.generateTopPerformers(),
      underperformers: this.generateUnderperformers(),
      recommendations: this.generateAuditRecommendations(),
    };
  }

  /**
   * Generate an AI-powered content brief
   */
  generateBrief(keyword: string, competitors: CompetitorContent[] = []): ContentBrief {
    const competitorData = competitors.length > 0 ? competitors : this.analyzeCompetitorContent(keyword);
    const avgWordCount = competitorData.reduce((sum, c) => sum + c.wordCount, 0) / competitorData.length || 2500;

    return {
      id: `brief-${Date.now()}`,
      targetKeyword: keyword,
      title: this.generateTitle(keyword),
      metaDescription: this.generateMetaDescription(keyword),
      recommendedWordCount: {
        min: Math.round(avgWordCount * 0.8),
        max: Math.round(avgWordCount * 1.3),
        optimal: Math.round(avgWordCount * 1.1),
      },
      outline: this.generateOutline(keyword, competitorData),
      semanticKeywords: this.generateSemanticKeywords(keyword),
      questionsToAnswer: this.generateQuestionsToAnswer(keyword),
      competitorInsights: competitorData,
      internalLinkSuggestions: this.generateInternalLinkSuggestions(keyword),
      externalSourceSuggestions: this.generateExternalSources(keyword),
      contentGuidelines: this.generateContentGuidelines(keyword),
      seoChecklist: this.generateSEOChecklist(),
    };
  }

  /**
   * Analyze SERP content for a keyword
   */
  analyzeSERP(keyword: string): SERPContentAnalysis {
    return {
      keyword,
      searchIntent: this.detectSearchIntent(keyword),
      serpFeatures: this.analyzeSERPFeatures(keyword),
      topResults: this.analyzeTopResults(keyword),
      contentPatterns: this.identifyContentPatterns(keyword),
      recommendations: this.generateSERPRecommendations(keyword),
      avgWordCount: 2847,
      avgHeadings: 12,
      avgImages: 8,
      avgVideos: 2,
      commonTopics: this.extractCommonTopics(keyword),
      contentGaps: this.identifyContentGaps(keyword),
    };
  }

  /**
   * Optimize existing content
   */
  optimizeContent(content: string, keyword: string): OptimizationSuggestions {
    const wordCount = content.split(/\s+/).length;
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const density = (keywordCount / wordCount) * 100;

    return {
      overallScore: 68,
      readabilityScore: 72,
      seoScore: 65,
      engagementScore: 70,
      suggestions: this.generateOptimizationSuggestions(content, keyword),
      keywordAnalysis: {
        targetKeyword: keyword,
        density: Math.round(density * 100) / 100,
        occurrences: keywordCount,
        inTitle: true,
        inH1: true,
        inFirstParagraph: content.toLowerCase().slice(0, 500).includes(keyword.toLowerCase()),
        inMetaDescription: true,
        inUrl: true,
        semanticKeywordsUsed: 12,
        semanticKeywordsMissing: ['best practices', 'guide', 'tips', 'examples', 'how to'],
      },
      readabilityAnalysis: this.analyzeReadability(content),
      structureAnalysis: this.analyzeStructure(content),
      internalLinkingAnalysis: this.analyzeInternalLinking(content),
    };
  }

  /**
   * Predict content performance
   */
  predictPerformance(brief: ContentBrief): PerformancePrediction {
    const baseTraffic = 1500;
    const confidenceScore = 0.72;

    return {
      estimatedTraffic: {
        min: Math.round(baseTraffic * 0.6),
        max: Math.round(baseTraffic * 1.8),
        expected: baseTraffic,
      },
      estimatedRanking: {
        min: 3,
        max: 15,
        expected: 7,
      },
      timeToRank: '3-6 months',
      confidenceScore,
      factors: this.analyzePredictionFactors(brief),
    };
  }

  /**
   * Generate topic clusters
   */
  generateTopicClusters(domain: string): TopicCluster[] {
    return [
      {
        id: 'cluster-1',
        pillarTopic: 'SEO Strategy',
        pillarUrl: '/guides/seo-strategy',
        subtopics: [
          { topic: 'Keyword Research', searchVolume: 12000, difficulty: 45, status: 'covered', url: '/guides/keyword-research', contentScore: 85 },
          { topic: 'On-Page SEO', searchVolume: 8500, difficulty: 42, status: 'covered', url: '/guides/on-page-seo', contentScore: 78 },
          { topic: 'Technical SEO', searchVolume: 6200, difficulty: 55, status: 'partial', url: '/guides/technical-seo', contentScore: 62 },
          { topic: 'Link Building', searchVolume: 9800, difficulty: 68, status: 'covered', url: '/guides/link-building', contentScore: 72 },
          { topic: 'Local SEO', searchVolume: 5400, difficulty: 38, status: 'missing' },
          { topic: 'E-commerce SEO', searchVolume: 4200, difficulty: 52, status: 'missing' },
        ],
        totalSearchVolume: 46100,
        avgDifficulty: 50,
        coverage: 67,
        authority: 72,
      },
      {
        id: 'cluster-2',
        pillarTopic: 'Content Marketing',
        pillarUrl: '/guides/content-marketing',
        subtopics: [
          { topic: 'Content Strategy', searchVolume: 7500, difficulty: 48, status: 'covered', url: '/guides/content-strategy', contentScore: 80 },
          { topic: 'Blog Writing', searchVolume: 5200, difficulty: 35, status: 'covered', url: '/guides/blog-writing', contentScore: 75 },
          { topic: 'Content Distribution', searchVolume: 3800, difficulty: 42, status: 'partial', url: '/guides/content-distribution', contentScore: 58 },
          { topic: 'Content Calendar', searchVolume: 4100, difficulty: 28, status: 'missing' },
          { topic: 'Content Repurposing', searchVolume: 2900, difficulty: 32, status: 'missing' },
        ],
        totalSearchVolume: 23500,
        avgDifficulty: 37,
        coverage: 60,
        authority: 68,
      },
      {
        id: 'cluster-3',
        pillarTopic: 'Digital Analytics',
        pillarUrl: '/guides/digital-analytics',
        subtopics: [
          { topic: 'Google Analytics', searchVolume: 18000, difficulty: 52, status: 'covered', url: '/guides/google-analytics', contentScore: 82 },
          { topic: 'Conversion Tracking', searchVolume: 6500, difficulty: 45, status: 'partial', url: '/guides/conversion-tracking', contentScore: 65 },
          { topic: 'A/B Testing', searchVolume: 8200, difficulty: 48, status: 'missing' },
          { topic: 'Attribution Modeling', searchVolume: 3200, difficulty: 62, status: 'missing' },
          { topic: 'Dashboard Reporting', searchVolume: 4800, difficulty: 38, status: 'missing' },
        ],
        totalSearchVolume: 40700,
        avgDifficulty: 49,
        coverage: 40,
        authority: 58,
      },
    ];
  }

  // Private helper methods

  private generateTopPerformers(): ContentPerformance[] {
    return [
      {
        url: '/blog/complete-seo-guide-2024',
        title: 'The Complete SEO Guide for 2024',
        contentScore: 92,
        traffic: 15420,
        conversions: 234,
        bounceRate: 32,
        avgTimeOnPage: 485,
        backlinks: 156,
        socialShares: 2340,
        lastUpdated: '2024-01-15',
        status: 'excellent',
      },
      {
        url: '/blog/keyword-research-strategies',
        title: 'Advanced Keyword Research Strategies',
        contentScore: 88,
        traffic: 12350,
        conversions: 189,
        bounceRate: 35,
        avgTimeOnPage: 420,
        backlinks: 98,
        socialShares: 1890,
        lastUpdated: '2024-02-20',
        status: 'excellent',
      },
      {
        url: '/guides/technical-seo-checklist',
        title: 'Technical SEO Checklist: 50+ Items',
        contentScore: 85,
        traffic: 9870,
        conversions: 145,
        bounceRate: 38,
        avgTimeOnPage: 380,
        backlinks: 72,
        socialShares: 1450,
        lastUpdated: '2024-01-28',
        status: 'excellent',
      },
    ];
  }

  private generateUnderperformers(): ContentPerformance[] {
    return [
      {
        url: '/blog/seo-tips-beginners',
        title: 'SEO Tips for Beginners',
        contentScore: 42,
        traffic: 234,
        conversions: 3,
        bounceRate: 78,
        avgTimeOnPage: 45,
        backlinks: 2,
        socialShares: 12,
        lastUpdated: '2022-06-15',
        status: 'poor',
      },
      {
        url: '/blog/link-building-basics',
        title: 'Link Building Basics',
        contentScore: 48,
        traffic: 456,
        conversions: 5,
        bounceRate: 72,
        avgTimeOnPage: 68,
        backlinks: 5,
        socialShares: 28,
        lastUpdated: '2022-09-20',
        status: 'poor',
      },
      {
        url: '/blog/meta-tags-explained',
        title: 'Meta Tags Explained',
        contentScore: 52,
        traffic: 678,
        conversions: 8,
        bounceRate: 68,
        avgTimeOnPage: 92,
        backlinks: 8,
        socialShares: 45,
        lastUpdated: '2023-01-10',
        status: 'needs-improvement',
      },
    ];
  }

  private generateAuditRecommendations(): ContentRecommendation[] {
    return [
      {
        id: 'rec-1',
        type: 'update',
        priority: 'high',
        title: 'Update Stale Content',
        description: '39 pages haven\'t been updated in over 12 months. Refreshing these could recover lost rankings.',
        affectedPages: ['/blog/seo-tips-beginners', '/blog/link-building-basics', '/blog/meta-tags-explained'],
        estimatedImpact: '+25% organic traffic to affected pages',
        effort: 'medium',
      },
      {
        id: 'rec-2',
        type: 'consolidate',
        priority: 'high',
        title: 'Consolidate Thin Content',
        description: '12 pages have fewer than 500 words and cover similar topics. Consolidating could improve authority.',
        affectedPages: ['/blog/seo-tip-1', '/blog/seo-tip-2', '/blog/seo-tip-3'],
        estimatedImpact: '+15% rankings for consolidated content',
        effort: 'medium',
      },
      {
        id: 'rec-3',
        type: 'expand',
        priority: 'medium',
        title: 'Expand High-Potential Content',
        description: '8 pages rank on page 2 and could reach page 1 with expanded content and optimization.',
        affectedPages: ['/guides/local-seo', '/guides/mobile-seo'],
        estimatedImpact: '+40% traffic if reaching page 1',
        effort: 'high',
      },
      {
        id: 'rec-4',
        type: 'optimize',
        priority: 'medium',
        title: 'Optimize Internal Linking',
        description: '23 pages have fewer than 3 internal links. Adding relevant links could improve crawlability.',
        affectedPages: ['/blog/various-pages'],
        estimatedImpact: '+10% overall site authority',
        effort: 'low',
      },
      {
        id: 'rec-5',
        type: 'delete',
        priority: 'low',
        title: 'Remove Low-Value Pages',
        description: '5 pages have zero traffic and no backlinks. Consider removing or noindexing.',
        affectedPages: ['/blog/outdated-post-1', '/blog/outdated-post-2'],
        estimatedImpact: 'Improved crawl budget efficiency',
        effort: 'low',
      },
    ];
  }

  private generateTitle(keyword: string): string {
    const templates = [
      `The Complete Guide to ${keyword} in 2024`,
      `${keyword}: Everything You Need to Know`,
      `How to Master ${keyword}: A Step-by-Step Guide`,
      `${keyword} Best Practices: Expert Tips & Strategies`,
      `The Ultimate ${keyword} Guide for Beginners & Experts`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateMetaDescription(keyword: string): string {
    return `Learn everything about ${keyword} with our comprehensive guide. Discover proven strategies, best practices, and expert tips to improve your results. Updated for 2024.`;
  }

  private generateOutline(keyword: string, competitors: CompetitorContent[]): ContentOutline {
    return {
      introduction: `Start with a compelling hook about ${keyword}. Establish credibility and preview what readers will learn.`,
      sections: [
        {
          heading: `What is ${keyword}?`,
          level: 'h2',
          keyPoints: [
            'Clear definition and explanation',
            'Why it matters for your business',
            'Key concepts to understand',
          ],
          suggestedWordCount: 300,
          semanticKeywords: ['definition', 'meaning', 'importance'],
        },
        {
          heading: `Benefits of ${keyword}`,
          level: 'h2',
          keyPoints: [
            'Primary benefits with examples',
            'ROI and business impact',
            'Case studies or statistics',
          ],
          suggestedWordCount: 400,
          semanticKeywords: ['benefits', 'advantages', 'results'],
        },
        {
          heading: `How to Implement ${keyword}`,
          level: 'h2',
          keyPoints: [
            'Step-by-step process',
            'Tools and resources needed',
            'Common pitfalls to avoid',
          ],
          suggestedWordCount: 600,
          semanticKeywords: ['how to', 'steps', 'guide', 'tutorial'],
        },
        {
          heading: `${keyword} Best Practices`,
          level: 'h2',
          keyPoints: [
            'Industry best practices',
            'Expert recommendations',
            'Dos and don\'ts',
          ],
          suggestedWordCount: 500,
          semanticKeywords: ['best practices', 'tips', 'strategies'],
        },
        {
          heading: `Common ${keyword} Mistakes`,
          level: 'h2',
          keyPoints: [
            'Frequent errors to avoid',
            'How to identify issues',
            'Solutions and fixes',
          ],
          suggestedWordCount: 400,
          semanticKeywords: ['mistakes', 'errors', 'problems', 'solutions'],
        },
        {
          heading: `${keyword} Tools and Resources`,
          level: 'h2',
          keyPoints: [
            'Recommended tools',
            'Free vs paid options',
            'How to choose the right tool',
          ],
          suggestedWordCount: 350,
          semanticKeywords: ['tools', 'software', 'resources'],
        },
      ],
      conclusion: `Summarize key takeaways about ${keyword}. Include a clear call-to-action and next steps for readers.`,
    };
  }

  private generateSemanticKeywords(keyword: string): SemanticKeyword[] {
    return [
      { keyword: `${keyword} guide`, relevance: 95, searchVolume: 2400, difficulty: 42, suggestedUsage: 3, context: 'Title, H2, body' },
      { keyword: `${keyword} tips`, relevance: 90, searchVolume: 1800, difficulty: 38, suggestedUsage: 2, context: 'H2, body' },
      { keyword: `${keyword} best practices`, relevance: 88, searchVolume: 1200, difficulty: 45, suggestedUsage: 2, context: 'H2, body' },
      { keyword: `how to ${keyword}`, relevance: 92, searchVolume: 3200, difficulty: 48, suggestedUsage: 2, context: 'H2, introduction' },
      { keyword: `${keyword} examples`, relevance: 85, searchVolume: 980, difficulty: 35, suggestedUsage: 2, context: 'H3, body' },
      { keyword: `${keyword} strategy`, relevance: 82, searchVolume: 1500, difficulty: 52, suggestedUsage: 2, context: 'H2, body' },
      { keyword: `${keyword} tools`, relevance: 78, searchVolume: 890, difficulty: 40, suggestedUsage: 1, context: 'H2, body' },
      { keyword: `${keyword} for beginners`, relevance: 75, searchVolume: 720, difficulty: 32, suggestedUsage: 1, context: 'Introduction, H3' },
    ];
  }

  private generateQuestionsToAnswer(keyword: string): string[] {
    return [
      `What is ${keyword} and why does it matter?`,
      `How do I get started with ${keyword}?`,
      `What are the best ${keyword} strategies for 2024?`,
      `How long does it take to see results from ${keyword}?`,
      `What tools do I need for ${keyword}?`,
      `What are common ${keyword} mistakes to avoid?`,
      `How do I measure ${keyword} success?`,
      `Is ${keyword} worth the investment?`,
    ];
  }

  private analyzeCompetitorContent(keyword: string): CompetitorContent[] {
    return [
      {
        url: 'https://competitor1.com/guide',
        title: `Complete ${keyword} Guide`,
        wordCount: 3200,
        contentScore: 85,
        headings: ['Introduction', 'What is it', 'Benefits', 'How to', 'Tools', 'Conclusion'],
        uniqueTopics: ['Advanced strategies', 'Case studies'],
        strengths: ['Comprehensive coverage', 'Good visuals', 'Expert quotes'],
        weaknesses: ['Outdated statistics', 'No video content'],
      },
      {
        url: 'https://competitor2.com/article',
        title: `${keyword} Best Practices`,
        wordCount: 2800,
        contentScore: 78,
        headings: ['Overview', 'Best Practices', 'Examples', 'FAQ'],
        uniqueTopics: ['Industry benchmarks', 'Templates'],
        strengths: ['Actionable tips', 'Downloadable resources'],
        weaknesses: ['Thin sections', 'Poor mobile experience'],
      },
      {
        url: 'https://competitor3.com/tutorial',
        title: `How to Master ${keyword}`,
        wordCount: 2400,
        contentScore: 72,
        headings: ['Getting Started', 'Step by Step', 'Advanced Tips'],
        uniqueTopics: ['Video tutorials', 'Interactive examples'],
        strengths: ['Step-by-step format', 'Beginner-friendly'],
        weaknesses: ['Lacks depth', 'Few external sources'],
      },
    ];
  }

  private generateInternalLinkSuggestions(keyword: string): InternalLink[] {
    return [
      { targetUrl: '/guides/seo-basics', targetTitle: 'SEO Basics Guide', anchorText: 'SEO fundamentals', relevance: 92, context: 'Introduction section' },
      { targetUrl: '/tools/keyword-research', targetTitle: 'Keyword Research Tool', anchorText: 'keyword research tool', relevance: 88, context: 'Tools section' },
      { targetUrl: '/blog/content-strategy', targetTitle: 'Content Strategy Guide', anchorText: 'content strategy', relevance: 85, context: 'Strategy section' },
      { targetUrl: '/case-studies', targetTitle: 'Case Studies', anchorText: 'see our case studies', relevance: 80, context: 'Results section' },
    ];
  }

  private generateExternalSources(keyword: string): ExternalSource[] {
    return [
      { url: 'https://backlinko.com/study', title: 'Industry Study 2024', authority: 92, type: 'study', suggestedUsage: 'Cite statistics in benefits section' },
      { url: 'https://moz.com/research', title: 'Moz Research Report', authority: 90, type: 'statistic', suggestedUsage: 'Reference data in introduction' },
      { url: 'https://searchengineland.com', title: 'Search Engine Land', authority: 88, type: 'reference', suggestedUsage: 'Link for further reading' },
      { url: 'https://ahrefs.com/blog', title: 'Ahrefs Blog', authority: 91, type: 'expert', suggestedUsage: 'Quote expert opinions' },
    ];
  }

  private generateContentGuidelines(keyword: string): ContentGuideline[] {
    return [
      {
        category: 'Tone & Voice',
        guidelines: [
          'Use a professional but approachable tone',
          'Write in second person (you/your)',
          'Avoid jargon unless explained',
          'Be confident but not arrogant',
        ],
      },
      {
        category: 'Structure',
        guidelines: [
          'Use short paragraphs (2-3 sentences)',
          'Include bullet points for lists',
          'Add images every 300-400 words',
          'Use descriptive subheadings',
        ],
      },
      {
        category: 'SEO',
        guidelines: [
          `Include "${keyword}" in title, H1, and first paragraph`,
          'Use semantic keywords naturally throughout',
          'Add internal links to relevant content',
          'Optimize images with alt text',
        ],
      },
      {
        category: 'Engagement',
        guidelines: [
          'Start with a compelling hook',
          'Include real examples and case studies',
          'Add actionable takeaways',
          'End with a clear call-to-action',
        ],
      },
    ];
  }

  private generateSEOChecklist(): SEOChecklistItem[] {
    return [
      { id: 'seo-1', category: 'Title', item: 'Include target keyword in title', importance: 'critical', completed: false },
      { id: 'seo-2', category: 'Title', item: 'Keep title under 60 characters', importance: 'important', completed: false },
      { id: 'seo-3', category: 'Meta', item: 'Write compelling meta description', importance: 'critical', completed: false },
      { id: 'seo-4', category: 'Meta', item: 'Include keyword in meta description', importance: 'important', completed: false },
      { id: 'seo-5', category: 'Content', item: 'Use keyword in first 100 words', importance: 'critical', completed: false },
      { id: 'seo-6', category: 'Content', item: 'Include semantic keywords', importance: 'important', completed: false },
      { id: 'seo-7', category: 'Structure', item: 'Use only one H1 tag', importance: 'critical', completed: false },
      { id: 'seo-8', category: 'Structure', item: 'Include keyword in at least one H2', importance: 'important', completed: false },
      { id: 'seo-9', category: 'Links', item: 'Add 3-5 internal links', importance: 'important', completed: false },
      { id: 'seo-10', category: 'Links', item: 'Include 2-3 authoritative external links', importance: 'nice-to-have', completed: false },
      { id: 'seo-11', category: 'Images', item: 'Add relevant images with alt text', importance: 'important', completed: false },
      { id: 'seo-12', category: 'URL', item: 'Use keyword in URL slug', importance: 'important', completed: false },
    ];
  }

  private detectSearchIntent(keyword: string): 'informational' | 'navigational' | 'transactional' | 'commercial' {
    const transactionalWords = ['buy', 'price', 'cost', 'cheap', 'deal', 'discount', 'order'];
    const commercialWords = ['best', 'top', 'review', 'compare', 'vs', 'alternative'];
    const navigationalWords = ['login', 'sign in', 'website', 'official'];
    
    const lowerKeyword = keyword.toLowerCase();
    
    if (transactionalWords.some(w => lowerKeyword.includes(w))) return 'transactional';
    if (commercialWords.some(w => lowerKeyword.includes(w))) return 'commercial';
    if (navigationalWords.some(w => lowerKeyword.includes(w))) return 'navigational';
    return 'informational';
  }

  private analyzeSERPFeatures(keyword: string): SERPFeature[] {
    return [
      { type: 'featured-snippet', present: true, opportunity: 'high', recommendation: 'Structure content with clear definitions and lists to capture featured snippet' },
      { type: 'people-also-ask', present: true, opportunity: 'high', recommendation: 'Answer common questions directly with H2/H3 headings' },
      { type: 'video', present: true, opportunity: 'medium', recommendation: 'Consider creating a video version of this content' },
      { type: 'image', present: true, opportunity: 'medium', recommendation: 'Include original, optimized images' },
      { type: 'local-pack', present: false, opportunity: 'low', recommendation: 'Not applicable for this keyword' },
      { type: 'knowledge-panel', present: false, opportunity: 'low', recommendation: 'Build entity authority over time' },
    ];
  }

  private analyzeTopResults(keyword: string): SERPResult[] {
    return [
      { position: 1, url: 'https://example1.com/guide', title: `Complete ${keyword} Guide`, description: 'Comprehensive guide...', wordCount: 3500, headings: 15, images: 12, videos: 2, contentScore: 92, domainAuthority: 85 },
      { position: 2, url: 'https://example2.com/article', title: `${keyword} Best Practices`, description: 'Learn the best...', wordCount: 2800, headings: 12, images: 8, videos: 1, contentScore: 88, domainAuthority: 78 },
      { position: 3, url: 'https://example3.com/tutorial', title: `How to ${keyword}`, description: 'Step by step...', wordCount: 2400, headings: 10, images: 6, videos: 0, contentScore: 82, domainAuthority: 72 },
      { position: 4, url: 'https://example4.com/tips', title: `${keyword} Tips`, description: 'Expert tips...', wordCount: 1800, headings: 8, images: 5, videos: 0, contentScore: 75, domainAuthority: 68 },
      { position: 5, url: 'https://example5.com/basics', title: `${keyword} Basics`, description: 'Everything you need...', wordCount: 2100, headings: 9, images: 7, videos: 1, contentScore: 78, domainAuthority: 65 },
    ];
  }

  private identifyContentPatterns(keyword: string): ContentPattern[] {
    return [
      { pattern: 'Comprehensive guides (2500+ words)', frequency: 4, importance: 'high', example: 'Top results average 2800 words' },
      { pattern: 'Step-by-step format', frequency: 3, importance: 'high', example: 'Numbered steps with clear instructions' },
      { pattern: 'Visual content (images/infographics)', frequency: 5, importance: 'high', example: 'Average 8 images per article' },
      { pattern: 'FAQ section', frequency: 3, importance: 'medium', example: 'Dedicated FAQ addressing common questions' },
      { pattern: 'Expert quotes/citations', frequency: 2, importance: 'medium', example: 'Industry expert opinions included' },
      { pattern: 'Video content', frequency: 2, importance: 'medium', example: 'Embedded tutorial videos' },
    ];
  }

  private generateSERPRecommendations(keyword: string): string[] {
    return [
      'Create comprehensive content (2500-3500 words) to compete with top results',
      'Use a step-by-step format with clear, actionable instructions',
      'Include 8-12 relevant images with optimized alt text',
      'Add a FAQ section targeting "People Also Ask" queries',
      'Structure content with clear H2/H3 headings for featured snippet opportunity',
      'Consider adding video content to increase engagement',
      'Include expert quotes and cite authoritative sources',
    ];
  }

  private extractCommonTopics(keyword: string): string[] {
    return [
      'Definition and basics',
      'Benefits and advantages',
      'Step-by-step implementation',
      'Best practices and tips',
      'Common mistakes to avoid',
      'Tools and resources',
      'Case studies and examples',
      'Future trends',
    ];
  }

  private identifyContentGaps(keyword: string): string[] {
    return [
      'Interactive calculators or tools',
      'Downloadable templates or checklists',
      'Industry-specific examples',
      'Comparison tables',
      'Expert interviews',
      'Updated 2024 statistics',
    ];
  }

  private generateOptimizationSuggestions(content: string, keyword: string): OptimizationSuggestion[] {
    return [
      {
        id: 'opt-1',
        category: 'seo',
        priority: 'high',
        title: 'Add more semantic keywords',
        description: 'Include related terms to improve topical relevance',
        currentValue: '12 semantic keywords used',
        suggestedValue: '20+ semantic keywords',
        impact: '+15% ranking potential',
      },
      {
        id: 'opt-2',
        category: 'readability',
        priority: 'medium',
        title: 'Shorten paragraphs',
        description: 'Break up long paragraphs for better readability',
        currentValue: 'Avg 5 sentences per paragraph',
        suggestedValue: '2-3 sentences per paragraph',
        impact: '+10% time on page',
      },
      {
        id: 'opt-3',
        category: 'structure',
        priority: 'high',
        title: 'Add more subheadings',
        description: 'Improve scannability with additional H2/H3 tags',
        currentValue: '6 subheadings',
        suggestedValue: '10-12 subheadings',
        impact: '+20% featured snippet chance',
      },
      {
        id: 'opt-4',
        category: 'engagement',
        priority: 'medium',
        title: 'Add visual content',
        description: 'Include more images, charts, or infographics',
        currentValue: '3 images',
        suggestedValue: '8-10 images',
        impact: '+25% engagement',
      },
      {
        id: 'opt-5',
        category: 'keywords',
        priority: 'low',
        title: 'Optimize keyword density',
        description: 'Slightly increase target keyword usage',
        currentValue: '0.8% density',
        suggestedValue: '1.0-1.5% density',
        impact: '+5% relevance signal',
      },
    ];
  }

  private analyzeReadability(content: string): ReadabilityAnalysis {
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    
    return {
      fleschScore: 62,
      gradeLevel: 8,
      avgSentenceLength: Math.round(words.length / sentences.length) || 15,
      avgWordLength: 5.2,
      passiveVoicePercentage: 12,
      complexWordPercentage: 18,
      suggestions: [
        'Reduce average sentence length to 15-20 words',
        'Replace complex words with simpler alternatives',
        'Reduce passive voice usage to under 10%',
        'Add more transition words for flow',
      ],
    };
  }

  private analyzeStructure(content: string): StructureAnalysis {
    return {
      hasH1: true,
      h2Count: 6,
      h3Count: 8,
      paragraphCount: 24,
      avgParagraphLength: 85,
      hasImages: true,
      imageCount: 5,
      hasVideos: false,
      hasBulletPoints: true,
      hasNumberedLists: true,
      hasTables: false,
      suggestions: [
        'Add 2-3 more H2 sections for comprehensive coverage',
        'Include a comparison table for better visualization',
        'Consider adding video content for engagement',
        'Add more images (aim for 1 per 300 words)',
      ],
    };
  }

  private analyzeInternalLinking(content: string): InternalLinkingAnalysis {
    return {
      internalLinkCount: 4,
      externalLinkCount: 2,
      brokenLinks: [],
      orphanedContent: false,
      suggestedInternalLinks: [
        { targetUrl: '/guides/related-topic', targetTitle: 'Related Topic Guide', anchorText: 'related topic', relevance: 88, context: 'Add in section 2' },
        { targetUrl: '/tools/analyzer', targetTitle: 'Free Analyzer Tool', anchorText: 'try our free tool', relevance: 85, context: 'Add in tools section' },
        { targetUrl: '/case-studies/success', targetTitle: 'Success Case Study', anchorText: 'see how Company X achieved', relevance: 82, context: 'Add in results section' },
      ],
    };
  }

  private analyzePredictionFactors(brief: ContentBrief): PredictionFactor[] {
    return [
      { factor: 'Keyword Difficulty', impact: 'negative', weight: 0.25, description: 'Moderate competition for target keyword' },
      { factor: 'Content Comprehensiveness', impact: 'positive', weight: 0.30, description: 'Brief covers all major topics' },
      { factor: 'Domain Authority', impact: 'positive', weight: 0.20, description: 'Established domain with good authority' },
      { factor: 'Content Freshness', impact: 'positive', weight: 0.15, description: 'New content with updated information' },
      { factor: 'Backlink Potential', impact: 'neutral', weight: 0.10, description: 'Average linkability for this topic' },
    ];
  }
}

// Export singleton instance
export const contentIntelAgent = new ContentIntelAgent();

// Export default for convenience
export default ContentIntelAgent;
