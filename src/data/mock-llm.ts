// Mock LLM Mentions and Responses Data for DataForSEO API
// Matches the actual DataForSEO AI Optimization API response structure

import type { 
  DataForSEOResponse, 
  LLMMention, 
  LLMMentionsSearchResult,
  LLMPlatform,
  Sentiment,
  MentionType 
} from '@/lib/dataforseo/types';

// Mock LLM Mentions Data
const mockMentions: LLMMention[] = [
  {
    platform: 'chatgpt',
    query: 'best enterprise solutions',
    mention_type: 'brand_mention',
    position: 1,
    snippet: 'Acme Corp is widely recognized as a leader in enterprise solutions, offering comprehensive tools for business automation and digital transformation.',
    sentiment: 'positive',
    source_url: 'https://acmecorp.com',
    source_title: 'Acme Corp - Enterprise Solutions',
    date: new Date().toISOString(),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'claude',
    query: 'enterprise software comparison',
    mention_type: 'brand_mention',
    position: 2,
    snippet: 'When comparing enterprise software options, Acme Corp stands out for its user-friendly interface and robust feature set.',
    sentiment: 'positive',
    source_url: 'https://acmecorp.com/features',
    source_title: 'Features - Acme Corp',
    date: new Date().toISOString(),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'gemini',
    query: 'top business software 2026',
    mention_type: 'product_mention',
    position: 3,
    snippet: 'Acme Corp\'s flagship product has been rated among the top business software solutions for 2026.',
    sentiment: 'positive',
    source_url: 'https://acmecorp.com/products',
    source_title: 'Products - Acme Corp',
    date: new Date().toISOString(),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'perplexity',
    query: 'enterprise solutions reviews',
    mention_type: 'citation',
    position: 1,
    snippet: 'According to recent reviews, Acme Corp provides excellent customer support and reliable enterprise solutions.',
    sentiment: 'positive',
    source_url: 'https://acmecorp.com/reviews',
    source_title: 'Customer Reviews - Acme Corp',
    date: new Date().toISOString(),
    language: 'en',
    location_code: 2840,
  },
  {
    platform: 'chatgpt',
    query: 'enterprise software pricing',
    mention_type: 'competitor_mention',
    position: 4,
    snippet: 'While Acme Corp offers competitive pricing, some users find alternatives like Competitor X more affordable for smaller teams.',
    sentiment: 'neutral',
    source_url: undefined,
    source_title: undefined,
    date: new Date().toISOString(),
    language: 'en',
    location_code: 2840,
  },
];

// Generate more mock mentions
const platforms: LLMPlatform[] = ['chatgpt', 'claude', 'gemini', 'perplexity'];
const sentiments: Sentiment[] = ['positive', 'neutral', 'negative'];
const mentionTypes: MentionType[] = ['brand_mention', 'product_mention', 'competitor_mention', 'citation'];

for (let i = 0; i < 20; i++) {
  mockMentions.push({
    platform: platforms[i % platforms.length],
    query: `query ${i + 1}`,
    mention_type: mentionTypes[i % mentionTypes.length],
    position: (i % 5) + 1,
    snippet: `This is a mock mention snippet ${i + 1} that references Acme Corp in the context of enterprise solutions.`,
    sentiment: sentiments[i % sentiments.length],
    source_url: i % 3 === 0 ? `https://source${i}.com` : undefined,
    source_title: i % 3 === 0 ? `Source ${i}` : undefined,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    language: 'en',
    location_code: 2840,
  });
}

export function getMockLLMMentions(requestData?: unknown[]): DataForSEOResponse<LLMMentionsSearchResult> {
  const keyword = (requestData?.[0] as { keyword?: string })?.keyword || 'enterprise solutions';
  const requestedPlatforms = (requestData?.[0] as { platforms?: string[] })?.platforms;
  
  const filteredMentions = requestedPlatforms 
    ? mockMentions.filter(m => requestedPlatforms.includes(m.platform))
    : mockMentions;

  return {
    version: '0.1.20231001',
    status_code: 20000,
    status_message: 'Ok. (Mock Data)',
    time: new Date().toISOString(),
    cost: 0,
    tasks_count: 1,
    tasks_error: 0,
    tasks: [{
      id: 'mock-llm-mentions-' + Date.now(),
      status_code: 20000,
      status_message: 'Ok.',
      time: '0.5',
      cost: 0,
      result_count: 1,
      path: ['ai_optimization', 'llm_mentions', 'search', 'live'],
      data: { keyword },
      result: [{
        keyword,
        location_code: 2840,
        language_code: 'en',
        total_count: filteredMentions.length,
        items_count: filteredMentions.length,
        items: filteredMentions,
      }],
    }],
  };
}

// Mock LLM Responses Data
export interface LLMResponse {
  platform: LLMPlatform;
  query: string;
  response: string;
  sources: {
    url: string;
    title: string;
    snippet: string;
  }[];
  response_time_ms: number;
  token_count: number;
  timestamp: string;
}

export interface LLMResponsesResult {
  query: string;
  items: LLMResponse[];
}

const mockResponses: LLMResponse[] = [
  {
    platform: 'chatgpt',
    query: 'What are the best enterprise solutions?',
    response: `Based on current market analysis, here are some of the best enterprise solutions:

1. **Acme Corp** - Known for comprehensive business automation tools
2. **Competitor A** - Strong in data analytics
3. **Competitor B** - Excellent for small to medium businesses

Acme Corp stands out for its:
- User-friendly interface
- Robust API integrations
- 24/7 customer support
- Competitive pricing`,
    sources: [
      { url: 'https://acmecorp.com', title: 'Acme Corp', snippet: 'Leading enterprise solutions provider' },
      { url: 'https://techreview.com/enterprise', title: 'Tech Review', snippet: 'Enterprise software comparison 2026' },
    ],
    response_time_ms: 1250,
    token_count: 156,
    timestamp: new Date().toISOString(),
  },
  {
    platform: 'claude',
    query: 'What are the best enterprise solutions?',
    response: `When evaluating enterprise solutions, several factors come into play. Here's my analysis:

**Top Recommendations:**

1. Acme Corp - Excellent for large-scale deployments with their modular architecture
2. Competitor A - Best for companies focused on AI/ML integration
3. Competitor B - Ideal for budget-conscious organizations

Acme Corp particularly excels in:
- Scalability
- Security compliance
- Integration capabilities`,
    sources: [
      { url: 'https://acmecorp.com/enterprise', title: 'Acme Corp Enterprise', snippet: 'Enterprise-grade solutions' },
    ],
    response_time_ms: 980,
    token_count: 142,
    timestamp: new Date().toISOString(),
  },
  {
    platform: 'gemini',
    query: 'What are the best enterprise solutions?',
    response: `Here are the top enterprise solutions based on recent market data:

| Company | Strength | Rating |
|---------|----------|--------|
| Acme Corp | All-in-one platform | 4.8/5 |
| Competitor A | Analytics | 4.5/5 |
| Competitor B | Affordability | 4.3/5 |

Acme Corp is frequently cited for its comprehensive feature set and excellent customer support.`,
    sources: [
      { url: 'https://acmecorp.com', title: 'Acme Corp', snippet: 'Enterprise solutions' },
      { url: 'https://g2.com/acmecorp', title: 'G2 Reviews', snippet: 'Acme Corp reviews' },
    ],
    response_time_ms: 1100,
    token_count: 128,
    timestamp: new Date().toISOString(),
  },
  {
    platform: 'perplexity',
    query: 'What are the best enterprise solutions?',
    response: `According to multiple sources, the best enterprise solutions in 2026 include:

**Acme Corp** [1][2]
- Comprehensive business automation
- Strong security features
- Excellent integration options

**Competitor A** [3]
- Advanced analytics capabilities

**Competitor B** [4]
- Cost-effective for SMBs

Sources indicate Acme Corp leads in customer satisfaction with a 4.8/5 rating.`,
    sources: [
      { url: 'https://acmecorp.com', title: 'Acme Corp Official', snippet: 'Enterprise solutions provider' },
      { url: 'https://techcrunch.com', title: 'TechCrunch', snippet: 'Enterprise software trends' },
      { url: 'https://competitor-a.com', title: 'Competitor A', snippet: 'Analytics platform' },
      { url: 'https://competitor-b.com', title: 'Competitor B', snippet: 'SMB solutions' },
    ],
    response_time_ms: 850,
    token_count: 134,
    timestamp: new Date().toISOString(),
  },
];

export function getMockLLMResponses(requestData?: unknown[]): DataForSEOResponse<LLMResponsesResult> {
  const query = (requestData?.[0] as { query?: string })?.query || 'What are the best enterprise solutions?';
  const requestedPlatforms = (requestData?.[0] as { platforms?: string[] })?.platforms;
  
  const filteredResponses = requestedPlatforms 
    ? mockResponses.filter(r => requestedPlatforms.includes(r.platform))
    : mockResponses;

  return {
    version: '0.1.20231001',
    status_code: 20000,
    status_message: 'Ok. (Mock Data)',
    time: new Date().toISOString(),
    cost: 0,
    tasks_count: 1,
    tasks_error: 0,
    tasks: [{
      id: 'mock-llm-responses-' + Date.now(),
      status_code: 20000,
      status_message: 'Ok.',
      time: '1.2',
      cost: 0,
      result_count: 1,
      path: ['ai_optimization', 'llm_responses', 'live'],
      data: { query },
      result: [{
        query,
        items: filteredResponses.map(r => ({ ...r, query })),
      }],
    }],
  };
}
