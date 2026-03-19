// Review Response Agent
// AI-powered review analysis, response generation, and sentiment tracking

// Types
export interface Review {
  id: string;
  platform: 'google' | 'trustpilot' | 'tripadvisor' | 'yelp' | 'facebook' | 'g2' | 'capterra';
  author: string;
  authorAvatar?: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  date: string;
  verified: boolean;
  helpful?: number;
  response?: ReviewResponse;
  images?: string[];
  location?: string;
}

export interface ReviewResponse {
  id: string;
  content: string;
  author: string;
  date: string;
  isAIGenerated?: boolean;
}

export interface ReviewAnalysis {
  reviewId: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  emotions: Emotion[];
  topics: Topic[];
  urgency: 'high' | 'medium' | 'low';
  requiresResponse: boolean;
  suggestedPriority: number; // 1-10
  keyPhrases: string[];
  customerIntent: CustomerIntent;
  actionItems: ActionItem[];
}

export interface Emotion {
  type: 'happy' | 'satisfied' | 'neutral' | 'frustrated' | 'angry' | 'disappointed' | 'confused';
  confidence: number;
}

export interface Topic {
  name: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  mentions: number;
}

export interface CustomerIntent {
  type: 'praise' | 'complaint' | 'question' | 'suggestion' | 'comparison' | 'warning';
  confidence: number;
  details: string;
}

export interface ActionItem {
  id: string;
  type: 'respond' | 'escalate' | 'follow-up' | 'investigate' | 'thank';
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
}

export type Tone = 'professional' | 'friendly' | 'empathetic' | 'apologetic' | 'grateful' | 'formal';

export interface GeneratedResponse {
  id: string;
  content: string;
  tone: Tone;
  wordCount: number;
  readingTime: string;
  alternatives: string[];
  suggestions: string[];
}

export interface PrioritizedReview extends Review {
  priorityScore: number;
  priorityReason: string;
  suggestedAction: string;
  estimatedResponseTime: string;
}

export interface SentimentTrend {
  period: string;
  startDate: string;
  endDate: string;
  overallSentiment: number; // -1 to 1
  sentimentByPlatform: PlatformSentiment[];
  sentimentOverTime: SentimentDataPoint[];
  topPositiveTopics: Topic[];
  topNegativeTopics: Topic[];
  volumeChange: number; // percentage
  ratingChange: number;
  responseRateChange: number;
  insights: TrendInsight[];
}

export interface PlatformSentiment {
  platform: Review['platform'];
  sentiment: number;
  reviewCount: number;
  avgRating: number;
  responseRate: number;
}

export interface SentimentDataPoint {
  date: string;
  sentiment: number;
  reviewCount: number;
  avgRating: number;
}

export interface TrendInsight {
  type: 'improvement' | 'decline' | 'opportunity' | 'alert';
  title: string;
  description: string;
  metric: string;
  change: number;
  recommendation: string;
}

export interface ReputationScore {
  overall: number; // 0-100
  breakdown: {
    reviewVolume: number;
    avgRating: number;
    sentimentScore: number;
    responseRate: number;
    responseTime: number;
    reviewRecency: number;
  };
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  trend: 'improving' | 'stable' | 'declining';
  benchmarkComparison: number; // vs industry average
}

export interface SocialMention {
  id: string;
  platform: 'reddit' | 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'quora' | 'hackernews';
  author: string;
  content: string;
  url: string;
  date: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  sentiment: 'positive' | 'neutral' | 'negative';
  reach: number;
  isInfluencer: boolean;
}

export interface Alert {
  id: string;
  type: 'negative_review' | 'viral_mention' | 'competitor_mention' | 'rating_drop' | 'response_needed';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  date: string;
  isRead: boolean;
  isResolved: boolean;
  relatedReviewId?: string;
  relatedMentionId?: string;
}

// Review Response Agent Implementation
export class ReviewResponseAgent {
  private brandName: string;
  private brandVoice: Tone;

  constructor(brandName: string = 'Our Company', brandVoice: Tone = 'professional') {
    this.brandName = brandName;
    this.brandVoice = brandVoice;
  }

  /**
   * Analyze a review for sentiment, topics, and urgency
   */
  analyzeReview(review: Review): ReviewAnalysis {
    const sentiment = this.detectSentiment(review);
    const emotions = this.detectEmotions(review);
    const topics = this.extractTopics(review);
    const urgency = this.calculateUrgency(review, sentiment);
    const customerIntent = this.detectCustomerIntent(review);

    return {
      reviewId: review.id,
      sentiment: sentiment.label,
      sentimentScore: sentiment.score,
      emotions,
      topics,
      urgency,
      requiresResponse: this.shouldRespond(review, sentiment, urgency),
      suggestedPriority: this.calculatePriority(review, sentiment, urgency),
      keyPhrases: this.extractKeyPhrases(review),
      customerIntent,
      actionItems: this.generateActionItems(review, sentiment, customerIntent),
    };
  }

  /**
   * Generate an AI-powered response to a review
   */
  generateResponse(review: Review, tone: Tone = this.brandVoice): GeneratedResponse {
    const analysis = this.analyzeReview(review);
    const response = this.craftResponse(review, analysis, tone);

    return {
      id: `response-${Date.now()}`,
      content: response,
      tone,
      wordCount: response.split(/\s+/).length,
      readingTime: `${Math.ceil(response.split(/\s+/).length / 200)} min`,
      alternatives: this.generateAlternatives(review, analysis, tone),
      suggestions: this.generateResponseSuggestions(review, analysis),
    };
  }

  /**
   * Prioritize reviews for response
   */
  prioritizeReviews(reviews: Review[]): PrioritizedReview[] {
    return reviews
      .map((review) => {
        const analysis = this.analyzeReview(review);
        const priorityScore = this.calculatePriority(review, 
          { label: analysis.sentiment, score: analysis.sentimentScore }, 
          analysis.urgency
        );

        return {
          ...review,
          priorityScore,
          priorityReason: this.getPriorityReason(review, analysis),
          suggestedAction: this.getSuggestedAction(review, analysis),
          estimatedResponseTime: this.getEstimatedResponseTime(priorityScore),
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Track sentiment trends over time
   */
  trackSentimentTrends(reviews: Review[]): SentimentTrend {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      period: '30 days',
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      overallSentiment: this.calculateOverallSentiment(reviews),
      sentimentByPlatform: this.getSentimentByPlatform(reviews),
      sentimentOverTime: this.getSentimentOverTime(reviews),
      topPositiveTopics: this.getTopTopics(reviews, 'positive'),
      topNegativeTopics: this.getTopTopics(reviews, 'negative'),
      volumeChange: 12.5,
      ratingChange: 0.2,
      responseRateChange: 8.3,
      insights: this.generateTrendInsights(reviews),
    };
  }

  /**
   * Calculate overall reputation score
   */
  calculateReputationScore(reviews: Review[], mentions: SocialMention[] = []): ReputationScore {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;
    const responseRate = reviews.filter(r => r.response).length / reviews.length * 100 || 0;
    const sentimentScore = this.calculateOverallSentiment(reviews);
    
    // Calculate component scores (0-100)
    const reviewVolumeScore = Math.min(reviews.length / 100 * 100, 100);
    const avgRatingScore = (avgRating / 5) * 100;
    const sentimentScoreNormalized = ((sentimentScore + 1) / 2) * 100;
    const responseRateScore = responseRate;
    const responseTimeScore = 75; // Mock - would calculate from actual response times
    const recencyScore = 80; // Mock - would calculate from review dates

    // Weighted overall score
    const overall = Math.round(
      reviewVolumeScore * 0.15 +
      avgRatingScore * 0.25 +
      sentimentScoreNormalized * 0.20 +
      responseRateScore * 0.20 +
      responseTimeScore * 0.10 +
      recencyScore * 0.10
    );

    return {
      overall,
      breakdown: {
        reviewVolume: Math.round(reviewVolumeScore),
        avgRating: Math.round(avgRatingScore),
        sentimentScore: Math.round(sentimentScoreNormalized),
        responseRate: Math.round(responseRateScore),
        responseTime: responseTimeScore,
        reviewRecency: recencyScore,
      },
      grade: this.getGrade(overall),
      trend: 'improving',
      benchmarkComparison: 12, // 12% above industry average
    };
  }

  /**
   * Generate alerts for reviews and mentions
   */
  generateAlerts(reviews: Review[], mentions: SocialMention[] = []): Alert[] {
    const alerts: Alert[] = [];

    // Check for negative reviews needing response
    reviews
      .filter(r => r.rating <= 2 && !r.response)
      .forEach(review => {
        alerts.push({
          id: `alert-${review.id}`,
          type: 'negative_review',
          severity: review.rating === 1 ? 'critical' : 'high',
          title: `Negative ${review.rating}-star review needs response`,
          description: `${review.author} left a ${review.rating}-star review on ${review.platform}`,
          source: review.platform,
          date: review.date,
          isRead: false,
          isResolved: false,
          relatedReviewId: review.id,
        });
      });

    // Check for viral mentions
    mentions
      .filter(m => m.engagement.likes + m.engagement.comments + m.engagement.shares > 100)
      .forEach(mention => {
        alerts.push({
          id: `alert-${mention.id}`,
          type: 'viral_mention',
          severity: mention.sentiment === 'negative' ? 'high' : 'medium',
          title: `Viral ${mention.sentiment} mention on ${mention.platform}`,
          description: `Post with ${mention.engagement.likes + mention.engagement.comments + mention.engagement.shares} engagements`,
          source: mention.platform,
          date: mention.date,
          isRead: false,
          isResolved: false,
          relatedMentionId: mention.id,
        });
      });

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // Private helper methods

  private detectSentiment(review: Review): { label: 'positive' | 'neutral' | 'negative'; score: number } {
    // Simple heuristic based on rating and keywords
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'best', 'fantastic', 'wonderful', 'perfect', 'recommend'];
    const negativeWords = ['terrible', 'awful', 'worst', 'hate', 'horrible', 'disappointing', 'poor', 'bad', 'never'];
    
    const content = review.content.toLowerCase();
    const positiveCount = positiveWords.filter(w => content.includes(w)).length;
    const negativeCount = negativeWords.filter(w => content.includes(w)).length;
    
    // Combine rating and keyword analysis
    const ratingScore = (review.rating - 3) / 2; // -1 to 1
    const keywordScore = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1);
    const score = (ratingScore * 0.7 + keywordScore * 0.3);

    if (score > 0.2) return { label: 'positive', score };
    if (score < -0.2) return { label: 'negative', score };
    return { label: 'neutral', score };
  }

  private detectEmotions(review: Review): Emotion[] {
    const emotions: Emotion[] = [];
    const content = review.content.toLowerCase();

    if (review.rating >= 4 || content.includes('happy') || content.includes('love')) {
      emotions.push({ type: 'happy', confidence: 0.8 });
    }
    if (review.rating >= 4 || content.includes('satisfied') || content.includes('pleased')) {
      emotions.push({ type: 'satisfied', confidence: 0.75 });
    }
    if (review.rating <= 2 || content.includes('frustrated') || content.includes('annoyed')) {
      emotions.push({ type: 'frustrated', confidence: 0.7 });
    }
    if (review.rating === 1 || content.includes('angry') || content.includes('furious')) {
      emotions.push({ type: 'angry', confidence: 0.85 });
    }
    if (content.includes('disappointed') || content.includes('let down')) {
      emotions.push({ type: 'disappointed', confidence: 0.8 });
    }
    if (content.includes('confused') || content.includes('unclear')) {
      emotions.push({ type: 'confused', confidence: 0.65 });
    }

    if (emotions.length === 0) {
      emotions.push({ type: 'neutral', confidence: 0.6 });
    }

    return emotions.sort((a, b) => b.confidence - a.confidence);
  }

  private extractTopics(review: Review): Topic[] {
    const topicKeywords: Record<string, string[]> = {
      'Customer Service': ['service', 'support', 'help', 'staff', 'team', 'response'],
      'Product Quality': ['quality', 'product', 'material', 'build', 'durable'],
      'Pricing': ['price', 'cost', 'expensive', 'cheap', 'value', 'worth'],
      'Delivery': ['delivery', 'shipping', 'arrived', 'fast', 'slow', 'package'],
      'User Experience': ['easy', 'simple', 'intuitive', 'confusing', 'interface', 'use'],
      'Features': ['feature', 'functionality', 'option', 'capability', 'tool'],
    };

    const content = review.content.toLowerCase();
    const topics: Topic[] = [];

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      const mentions = keywords.filter(k => content.includes(k)).length;
      if (mentions > 0) {
        const sentiment = this.detectSentiment(review);
        topics.push({
          name: topic,
          sentiment: sentiment.label,
          mentions,
        });
      }
    }

    return topics.sort((a, b) => b.mentions - a.mentions);
  }

  private calculateUrgency(review: Review, sentiment: { label: string; score: number }): 'high' | 'medium' | 'low' {
    // High urgency: 1-star reviews, very negative sentiment, or no response yet
    if (review.rating === 1 || sentiment.score < -0.7) return 'high';
    if (review.rating === 2 || sentiment.score < -0.3) return 'medium';
    return 'low';
  }

  private shouldRespond(review: Review, sentiment: { label: string; score: number }, urgency: string): boolean {
    // Always respond to negative reviews
    if (sentiment.label === 'negative') return true;
    // Respond to reviews without responses
    if (!review.response) return true;
    // Respond to high urgency
    if (urgency === 'high') return true;
    return false;
  }

  private calculatePriority(review: Review, sentiment: { label: string; score: number }, urgency: string): number {
    let priority = 5; // Base priority

    // Adjust based on rating
    priority += (5 - review.rating) * 1.5;

    // Adjust based on sentiment
    priority -= sentiment.score * 2;

    // Adjust based on urgency
    if (urgency === 'high') priority += 2;
    if (urgency === 'medium') priority += 1;

    // Adjust based on response status
    if (!review.response) priority += 1;

    // Adjust based on platform importance
    if (review.platform === 'google') priority += 0.5;

    // Clamp to 1-10
    return Math.max(1, Math.min(10, Math.round(priority)));
  }

  private extractKeyPhrases(review: Review): string[] {
    // Simple extraction - in production would use NLP
    const content = review.content;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    return sentences.slice(0, 3).map(s => s.trim());
  }

  private detectCustomerIntent(review: Review): CustomerIntent {
    const content = review.content.toLowerCase();

    if (content.includes('?') || content.includes('how') || content.includes('why')) {
      return { type: 'question', confidence: 0.8, details: 'Customer is asking a question' };
    }
    if (content.includes('should') || content.includes('could') || content.includes('suggest')) {
      return { type: 'suggestion', confidence: 0.75, details: 'Customer is making a suggestion' };
    }
    if (content.includes('warning') || content.includes('beware') || content.includes('avoid')) {
      return { type: 'warning', confidence: 0.85, details: 'Customer is warning others' };
    }
    if (content.includes('compared') || content.includes('better than') || content.includes('vs')) {
      return { type: 'comparison', confidence: 0.7, details: 'Customer is comparing to competitors' };
    }
    if (review.rating <= 2) {
      return { type: 'complaint', confidence: 0.9, details: 'Customer is expressing dissatisfaction' };
    }
    return { type: 'praise', confidence: 0.8, details: 'Customer is expressing satisfaction' };
  }

  private generateActionItems(review: Review, sentiment: { label: string; score: number }, intent: CustomerIntent): ActionItem[] {
    const items: ActionItem[] = [];

    if (!review.response) {
      items.push({
        id: `action-respond-${review.id}`,
        type: 'respond',
        description: 'Craft and send a response to this review',
        priority: sentiment.label === 'negative' ? 'high' : 'medium',
      });
    }

    if (sentiment.label === 'negative' && review.rating <= 2) {
      items.push({
        id: `action-escalate-${review.id}`,
        type: 'escalate',
        description: 'Escalate to customer success team for follow-up',
        priority: 'high',
      });
    }

    if (intent.type === 'question') {
      items.push({
        id: `action-followup-${review.id}`,
        type: 'follow-up',
        description: 'Answer the customer\'s question directly',
        priority: 'medium',
      });
    }

    if (intent.type === 'complaint') {
      items.push({
        id: `action-investigate-${review.id}`,
        type: 'investigate',
        description: 'Investigate the issue mentioned in the review',
        priority: 'high',
      });
    }

    if (sentiment.label === 'positive' && review.rating >= 4) {
      items.push({
        id: `action-thank-${review.id}`,
        type: 'thank',
        description: 'Thank the customer for their positive feedback',
        priority: 'low',
      });
    }

    return items;
  }

  private craftResponse(review: Review, analysis: ReviewAnalysis, tone: Tone): string {
    const greeting = this.getGreeting(review.author, tone);
    const acknowledgment = this.getAcknowledgment(analysis, tone);
    const body = this.getResponseBody(review, analysis, tone);
    const closing = this.getClosing(tone);

    return `${greeting}\n\n${acknowledgment}\n\n${body}\n\n${closing}`;
  }

  private getGreeting(author: string, tone: Tone): string {
    const greetings: Record<Tone, string> = {
      professional: `Dear ${author},`,
      friendly: `Hi ${author}!`,
      empathetic: `Dear ${author},`,
      apologetic: `Dear ${author},`,
      grateful: `Dear ${author},`,
      formal: `Dear ${author},`,
    };
    return greetings[tone];
  }

  private getAcknowledgment(analysis: ReviewAnalysis, tone: Tone): string {
    if (analysis.sentiment === 'positive') {
      return 'Thank you so much for taking the time to share your wonderful feedback with us!';
    }
    if (analysis.sentiment === 'negative') {
      return 'We sincerely apologize for the experience you\'ve had. Your feedback is incredibly important to us.';
    }
    return 'Thank you for sharing your thoughts with us. We appreciate your honest feedback.';
  }

  private getResponseBody(review: Review, analysis: ReviewAnalysis, tone: Tone): string {
    if (analysis.sentiment === 'positive') {
      return `We're thrilled to hear that you had a great experience with ${this.brandName}. Your kind words mean a lot to our team, and we're committed to continuing to deliver the quality service you deserve.`;
    }
    if (analysis.sentiment === 'negative') {
      const topics = analysis.topics.map(t => t.name).join(', ');
      return `We understand your concerns regarding ${topics || 'your experience'}, and we take this feedback very seriously. We would love the opportunity to make this right. Please reach out to our customer support team at support@${this.brandName.toLowerCase().replace(/\s+/g, '')}.com so we can address your concerns directly.`;
    }
    return `We value your input and are always looking for ways to improve. If there's anything specific we can do to enhance your experience, please don't hesitate to let us know.`;
  }

  private getClosing(tone: Tone): string {
    const closings: Record<Tone, string> = {
      professional: `Best regards,\nThe ${this.brandName} Team`,
      friendly: `Thanks again!\nThe ${this.brandName} Team`,
      empathetic: `With appreciation,\nThe ${this.brandName} Team`,
      apologetic: `Sincerely,\nThe ${this.brandName} Team`,
      grateful: `With gratitude,\nThe ${this.brandName} Team`,
      formal: `Respectfully,\nThe ${this.brandName} Team`,
    };
    return closings[tone];
  }

  private generateAlternatives(review: Review, analysis: ReviewAnalysis, tone: Tone): string[] {
    // Generate 2 alternative responses with different tones
    const alternativeTones: Tone[] = ['friendly', 'empathetic', 'professional'].filter(t => t !== tone) as Tone[];
    return alternativeTones.slice(0, 2).map(t => this.craftResponse(review, analysis, t));
  }

  private generateResponseSuggestions(review: Review, analysis: ReviewAnalysis): string[] {
    const suggestions: string[] = [];

    if (analysis.sentiment === 'negative') {
      suggestions.push('Consider offering a discount or compensation');
      suggestions.push('Invite the customer to discuss offline');
      suggestions.push('Mention specific steps being taken to address the issue');
    }

    if (analysis.customerIntent.type === 'question') {
      suggestions.push('Provide a direct answer to their question');
      suggestions.push('Include a link to relevant help documentation');
    }

    if (analysis.topics.some(t => t.name === 'Customer Service')) {
      suggestions.push('Highlight your commitment to customer service');
    }

    suggestions.push('Keep the response concise but thorough');
    suggestions.push('Personalize the response with specific details from the review');

    return suggestions;
  }

  private getPriorityReason(review: Review, analysis: ReviewAnalysis): string {
    if (review.rating === 1) return 'Critical: 1-star review requires immediate attention';
    if (review.rating === 2) return 'High priority: Negative review needs response';
    if (!review.response) return 'No response yet - customer waiting';
    if (analysis.customerIntent.type === 'question') return 'Customer asked a question';
    if (analysis.sentiment === 'positive' && review.rating === 5) return 'Opportunity to thank loyal customer';
    return 'Standard priority review';
  }

  private getSuggestedAction(review: Review, analysis: ReviewAnalysis): string {
    if (analysis.sentiment === 'negative') return 'Respond with empathy and offer resolution';
    if (analysis.customerIntent.type === 'question') return 'Answer the question directly';
    if (analysis.sentiment === 'positive') return 'Thank the customer and encourage referrals';
    return 'Acknowledge feedback and express appreciation';
  }

  private getEstimatedResponseTime(priorityScore: number): string {
    if (priorityScore >= 8) return '< 1 hour';
    if (priorityScore >= 6) return '< 4 hours';
    if (priorityScore >= 4) return '< 24 hours';
    return '< 48 hours';
  }

  private calculateOverallSentiment(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sentiments = reviews.map(r => this.detectSentiment(r).score);
    return sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length;
  }

  private getSentimentByPlatform(reviews: Review[]): PlatformSentiment[] {
    const platforms = [...new Set(reviews.map(r => r.platform))];
    
    return platforms.map(platform => {
      const platformReviews = reviews.filter(r => r.platform === platform);
      const avgRating = platformReviews.reduce((sum, r) => sum + r.rating, 0) / platformReviews.length;
      const responseRate = platformReviews.filter(r => r.response).length / platformReviews.length * 100;
      
      return {
        platform,
        sentiment: this.calculateOverallSentiment(platformReviews),
        reviewCount: platformReviews.length,
        avgRating: Math.round(avgRating * 10) / 10,
        responseRate: Math.round(responseRate),
      };
    });
  }

  private getSentimentOverTime(reviews: Review[]): SentimentDataPoint[] {
    // Generate mock data for last 30 days
    const data: SentimentDataPoint[] = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        sentiment: 0.3 + Math.random() * 0.4, // Random between 0.3 and 0.7
        reviewCount: Math.floor(Math.random() * 10) + 1,
        avgRating: 3.5 + Math.random() * 1.5,
      });
    }

    return data;
  }

  private getTopTopics(reviews: Review[], sentimentFilter: 'positive' | 'negative'): Topic[] {
    const allTopics: Topic[] = [];
    
    reviews.forEach(review => {
      const sentiment = this.detectSentiment(review);
      if (sentiment.label === sentimentFilter) {
        allTopics.push(...this.extractTopics(review));
      }
    });

    // Aggregate topics
    const topicMap = new Map<string, Topic>();
    allTopics.forEach(topic => {
      const existing = topicMap.get(topic.name);
      if (existing) {
        existing.mentions += topic.mentions;
      } else {
        topicMap.set(topic.name, { ...topic });
      }
    });

    return Array.from(topicMap.values())
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 5);
  }

  private generateTrendInsights(reviews: Review[]): TrendInsight[] {
    return [
      {
        type: 'improvement',
        title: 'Response Rate Improved',
        description: 'Your response rate has increased by 15% this month',
        metric: 'Response Rate',
        change: 15,
        recommendation: 'Keep up the great work! Consider setting up automated responses for common queries.',
      },
      {
        type: 'opportunity',
        title: 'Positive Sentiment Trending',
        description: 'Customer sentiment has improved by 8% over the last 30 days',
        metric: 'Sentiment Score',
        change: 8,
        recommendation: 'Leverage positive reviews in marketing materials and social proof.',
      },
      {
        type: 'alert',
        title: 'Delivery Complaints Increasing',
        description: 'Mentions of delivery issues have increased by 12%',
        metric: 'Delivery Mentions',
        change: 12,
        recommendation: 'Review shipping processes and consider proactive communication about delays.',
      },
    ];
  }

  private getGrade(score: number): ReputationScore['grade'] {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// Export singleton instance
export const reviewResponseAgent = new ReviewResponseAgent();

// Export default for convenience
export default ReviewResponseAgent;
