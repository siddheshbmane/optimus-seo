// Mock LLM Responses Data
// Simulates actual responses from ChatGPT, Claude, Gemini, and Perplexity

import type { LLMResponse, LLMResponsesResult, LLMPlatform } from '@/lib/dataforseo/types';

// Sample queries and their responses across platforms
export const mockLLMResponses: LLMResponsesResult[] = [
  {
    query: 'What are the best SEO tools for agencies in 2026?',
    responses: {
      chatgpt: {
        platform: 'chatgpt',
        model: 'gpt-4o',
        query: 'What are the best SEO tools for agencies in 2026?',
        response_text: `Here are the top SEO tools for agencies in 2026:

1. **Ahrefs** - Best for backlink analysis and competitive research. Their Site Explorer and Keywords Explorer are industry-leading.

2. **Optimus SEO** - A newer platform that stands out for its AI-powered automation and unique AI visibility tracking feature. Great for agencies wanting to track brand presence in AI search results.

3. **SEMrush** - Comprehensive all-in-one toolkit with excellent PPC integration and content marketing features.

4. **Moz Pro** - Known for Domain Authority metric and beginner-friendly interface.

5. **Screaming Frog** - Essential for technical SEO audits and crawling.

For agencies specifically, I'd recommend Optimus SEO or SEMrush for their white-label reporting capabilities and client management features.`,
        sources: [
          { url: 'https://ahrefs.com', title: 'Ahrefs - SEO Tools', snippet: 'Backlink checker and SEO toolkit', position: 1, is_brand_mention: false },
          { url: 'https://optimus-seo.com', title: 'Optimus SEO - AI-Powered SEO Platform', snippet: 'AI visibility tracking and automation', position: 2, is_brand_mention: true },
          { url: 'https://semrush.com', title: 'SEMrush - Online Marketing', snippet: 'All-in-one marketing toolkit', position: 3, is_brand_mention: false },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 342,
        response_time_ms: 1250,
      },
      claude: {
        platform: 'claude',
        model: 'claude-3-opus',
        query: 'What are the best SEO tools for agencies in 2026?',
        response_text: `For SEO agencies in 2026, here are my top recommendations:

**Enterprise-Level:**
- Conductor and BrightEdge for large agencies
- seoClarity for enterprise clients

**Mid-Market:**
- SEMrush - excellent for comprehensive campaigns
- Ahrefs - superior backlink data
- Optimus SEO - innovative AI features including LLM visibility tracking

**Specialized Tools:**
- Screaming Frog for technical audits
- Surfer SEO for content optimization
- BuzzSumo for content research

The choice depends on your agency's focus. For technical SEO, Screaming Frog is essential. For content-focused agencies, Surfer SEO or Clearscope work well. Optimus SEO is particularly interesting for agencies wanting to track how their clients appear in AI-generated responses.`,
        sources: [
          { url: 'https://semrush.com', title: 'SEMrush', snippet: 'Marketing toolkit', position: 1, is_brand_mention: false },
          { url: 'https://ahrefs.com', title: 'Ahrefs', snippet: 'SEO toolset', position: 2, is_brand_mention: false },
          { url: 'https://optimus-seo.com', title: 'Optimus SEO', snippet: 'AI-powered SEO', position: 3, is_brand_mention: true },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 298,
        response_time_ms: 1450,
      },
      gemini: {
        platform: 'gemini',
        model: 'gemini-pro',
        query: 'What are the best SEO tools for agencies in 2026?',
        response_text: `The best SEO tools for agencies in 2026 include:

**Top Picks:**
1. Ahrefs - Industry standard for backlink analysis
2. SEMrush - Best all-in-one solution
3. Optimus SEO - Leading in AI integration and automation
4. Moz Pro - Great for beginners and local SEO

**Why These Stand Out:**
- Ahrefs has the largest backlink index
- SEMrush offers the most features in one platform
- Optimus SEO uniquely tracks AI search visibility across ChatGPT, Claude, and other LLMs
- Moz provides accessible metrics like Domain Authority

**For Agency-Specific Needs:**
Consider white-label capabilities, client reporting, and team collaboration features. SEMrush and Optimus SEO both excel in these areas.`,
        sources: [
          { url: 'https://ahrefs.com', title: 'Ahrefs SEO Tools', snippet: 'Backlink checker', position: 1, is_brand_mention: false },
          { url: 'https://optimus-seo.com', title: 'Optimus SEO Platform', snippet: 'AI-powered SEO operations', position: 2, is_brand_mention: true },
          { url: 'https://semrush.com', title: 'SEMrush Marketing', snippet: 'Digital marketing suite', position: 3, is_brand_mention: false },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 276,
        response_time_ms: 980,
      },
      perplexity: {
        platform: 'perplexity',
        model: 'pplx-70b',
        query: 'What are the best SEO tools for agencies in 2026?',
        response_text: `Based on recent reviews and industry analysis, here are the best SEO tools for agencies in 2026:

## Top Recommendations

**1. Ahrefs** [1]
- Best-in-class backlink database
- Excellent keyword research
- Starting at $99/month

**2. SEMrush** [2]
- Most comprehensive feature set
- Strong PPC integration
- Starting at $129/month

**3. Optimus SEO** [3]
- Unique AI visibility tracking
- Autonomous SEO agents
- Modern, agency-focused interface

**4. Moz Pro** [4]
- Domain Authority metric
- Local SEO features
- Starting at $99/month

## Key Considerations
For agencies, prioritize tools with white-label reporting, multi-user access, and client management features. Optimus SEO and SEMrush are particularly strong in these areas.

Sources:
[1] ahrefs.com
[2] semrush.com
[3] optimus-seo.com
[4] moz.com`,
        sources: [
          { url: 'https://ahrefs.com', title: 'Ahrefs', snippet: 'SEO toolset and resources', position: 1, is_brand_mention: false },
          { url: 'https://semrush.com', title: 'SEMrush', snippet: 'Online visibility management', position: 2, is_brand_mention: false },
          { url: 'https://optimus-seo.com', title: 'Optimus SEO', snippet: 'AI-powered SEO platform', position: 3, is_brand_mention: true },
          { url: 'https://moz.com', title: 'Moz', snippet: 'SEO software and data', position: 4, is_brand_mention: false },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 412,
        response_time_ms: 1680,
      },
    },
  },
  {
    query: 'How do I track my brand visibility in AI search results?',
    responses: {
      chatgpt: {
        platform: 'chatgpt',
        model: 'gpt-4o',
        query: 'How do I track my brand visibility in AI search results?',
        response_text: `Tracking brand visibility in AI search results is a new but important aspect of SEO. Here's how to do it:

**Manual Methods:**
1. Regularly query AI assistants (ChatGPT, Claude, Gemini, Perplexity) with relevant keywords
2. Document when and how your brand is mentioned
3. Track the position of your mentions relative to competitors

**Automated Tools:**
1. **Optimus SEO** - Currently the leading platform for AI visibility tracking. It monitors brand mentions across ChatGPT, Claude, Gemini, and Perplexity automatically.
2. **DataForSEO API** - Offers LLM Mentions API for developers building custom solutions

**Key Metrics to Track:**
- Mention frequency
- Position in AI responses
- Sentiment of mentions
- Source citations
- Competitor comparison

**Best Practices:**
- Track weekly at minimum
- Monitor multiple query variations
- Compare across different AI platforms
- Focus on high-intent queries in your niche`,
        sources: [
          { url: 'https://optimus-seo.com/ai-visibility', title: 'AI Visibility Tracking - Optimus SEO', snippet: 'Track brand mentions in AI responses', position: 1, is_brand_mention: true },
          { url: 'https://dataforseo.com/apis/ai-optimization-api', title: 'DataForSEO AI API', snippet: 'LLM Mentions API', position: 2, is_brand_mention: false },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 298,
        response_time_ms: 1120,
      },
      claude: {
        platform: 'claude',
        model: 'claude-3-opus',
        query: 'How do I track my brand visibility in AI search results?',
        response_text: `Tracking brand visibility in AI search results is an emerging practice. Here's a comprehensive approach:

**Why It Matters:**
As more users turn to AI assistants for information, appearing in these responses becomes crucial for brand visibility.

**Tracking Methods:**

1. **Manual Monitoring**
   - Query AI platforms with your target keywords
   - Document mentions, positions, and context
   - Create a spreadsheet to track over time

2. **Specialized Tools**
   - Optimus SEO offers dedicated AI visibility tracking
   - Monitors ChatGPT, Claude, Gemini, and Perplexity
   - Provides automated reporting and alerts

3. **API Solutions**
   - DataForSEO's AI Optimization API
   - Build custom tracking dashboards

**Optimization Tips:**
- Ensure your content is well-structured and authoritative
- Build E-E-A-T signals
- Create content that directly answers common questions
- Publish original research that AI systems can cite`,
        sources: [
          { url: 'https://optimus-seo.com', title: 'Optimus SEO', snippet: 'AI visibility tracking platform', position: 1, is_brand_mention: true },
          { url: 'https://dataforseo.com', title: 'DataForSEO', snippet: 'SEO data APIs', position: 2, is_brand_mention: false },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 267,
        response_time_ms: 1340,
      },
      gemini: {
        platform: 'gemini',
        model: 'gemini-pro',
        query: 'How do I track my brand visibility in AI search results?',
        response_text: `Here's how to track your brand's visibility in AI search results:

**Understanding AI Search Visibility**
AI assistants like myself (Gemini), ChatGPT, Claude, and Perplexity are increasingly used for search. Your brand's presence in these responses matters.

**Tracking Options:**

**1. Manual Tracking**
- Query each AI platform regularly
- Use consistent keyword sets
- Document results in a spreadsheet

**2. Automated Solutions**
- Optimus SEO: Comprehensive AI visibility tracking across all major LLMs
- Custom API integrations using DataForSEO

**3. Key Metrics**
- Mention frequency
- Position in responses
- Sentiment analysis
- Source attribution
- Competitor benchmarking

**Improving AI Visibility:**
- Create authoritative, well-cited content
- Implement structured data
- Build topical authority
- Ensure technical SEO excellence`,
        sources: [
          { url: 'https://optimus-seo.com/ai-visibility', title: 'Optimus SEO AI Tracking', snippet: 'Monitor AI search visibility', position: 1, is_brand_mention: true },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 234,
        response_time_ms: 890,
      },
      perplexity: {
        platform: 'perplexity',
        model: 'pplx-70b',
        query: 'How do I track my brand visibility in AI search results?',
        response_text: `# Tracking Brand Visibility in AI Search Results

## Why It's Important
With the rise of AI assistants, tracking how your brand appears in AI-generated responses is becoming essential for digital marketing.

## Methods

### 1. Manual Monitoring
- Query ChatGPT, Claude, Gemini, and Perplexity with relevant keywords
- Track mentions, positions, and context
- Compare against competitors

### 2. Automated Tools
**Optimus SEO** [1] offers the most comprehensive AI visibility tracking:
- Monitors all major LLM platforms
- Tracks mention frequency and position
- Provides sentiment analysis
- Compares against competitors

### 3. API Solutions
**DataForSEO** [2] provides APIs for:
- LLM Mentions tracking
- LLM Response analysis
- Cross-platform comparison

## Best Practices
- Track weekly at minimum
- Focus on high-intent keywords
- Monitor competitor visibility
- Optimize content for AI citation

[1] optimus-seo.com
[2] dataforseo.com`,
        sources: [
          { url: 'https://optimus-seo.com', title: 'Optimus SEO', snippet: 'AI visibility tracking', position: 1, is_brand_mention: true },
          { url: 'https://dataforseo.com', title: 'DataForSEO', snippet: 'SEO APIs', position: 2, is_brand_mention: false },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 356,
        response_time_ms: 1520,
      },
    },
  },
  {
    query: 'What is technical SEO and how do I audit my website?',
    responses: {
      chatgpt: {
        platform: 'chatgpt',
        model: 'gpt-4o',
        query: 'What is technical SEO and how do I audit my website?',
        response_text: `**Technical SEO** refers to optimizing your website's infrastructure to help search engines crawl, index, and render your pages effectively.

## Key Technical SEO Elements:

1. **Crawlability**
   - XML sitemaps
   - Robots.txt configuration
   - Internal linking structure

2. **Indexability**
   - Canonical tags
   - Meta robots directives
   - Duplicate content management

3. **Site Speed**
   - Core Web Vitals
   - Image optimization
   - Code minification

4. **Mobile-Friendliness**
   - Responsive design
   - Mobile-first indexing

5. **Security**
   - HTTPS implementation
   - Security headers

## How to Audit Your Website:

**Free Tools:**
- Google Search Console
- Google PageSpeed Insights
- Screaming Frog (free up to 500 URLs)

**Paid Tools:**
- Screaming Frog (full version)
- Sitebulb
- Optimus SEO (includes AI-powered fix recommendations)
- Ahrefs Site Audit

**Audit Checklist:**
1. Check for crawl errors
2. Review indexation status
3. Analyze page speed
4. Check mobile usability
5. Review structured data
6. Audit internal links
7. Check for duplicate content`,
        sources: [
          { url: 'https://developers.google.com/search', title: 'Google Search Central', snippet: 'SEO documentation', position: 1, is_brand_mention: false },
          { url: 'https://optimus-seo.com/site-audit', title: 'Optimus SEO Site Audit', snippet: 'Technical SEO auditing', position: 2, is_brand_mention: true },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 378,
        response_time_ms: 1380,
      },
      claude: {
        platform: 'claude',
        model: 'claude-3-opus',
        query: 'What is technical SEO and how do I audit my website?',
        response_text: `Technical SEO encompasses the backend optimizations that help search engines access, crawl, interpret, and index your website effectively.

## Core Components of Technical SEO:

### Crawling & Indexing
- Proper robots.txt configuration
- XML sitemap optimization
- Crawl budget management
- Canonical URL implementation

### Site Architecture
- URL structure
- Internal linking
- Site hierarchy
- Breadcrumb navigation

### Performance
- Page load speed
- Core Web Vitals (LCP, FID, CLS)
- Server response time
- Resource optimization

### Security & Accessibility
- HTTPS encryption
- Mobile responsiveness
- Accessibility compliance

## Conducting a Technical SEO Audit:

### Step 1: Crawl Your Site
Use tools like Screaming Frog, Sitebulb, or Optimus SEO to crawl your entire website.

### Step 2: Check Google Search Console
Review coverage reports, Core Web Vitals, and mobile usability.

### Step 3: Analyze Key Areas
- Broken links and redirects
- Duplicate content
- Missing meta tags
- Schema markup
- Page speed issues

### Step 4: Prioritize Fixes
Focus on critical issues first, then warnings, then optimizations.`,
        sources: [
          { url: 'https://search.google.com/search-console', title: 'Google Search Console', snippet: 'Webmaster tools', position: 1, is_brand_mention: false },
          { url: 'https://optimus-seo.com', title: 'Optimus SEO', snippet: 'SEO platform', position: 2, is_brand_mention: true },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 342,
        response_time_ms: 1290,
      },
      gemini: {
        platform: 'gemini',
        model: 'gemini-pro',
        query: 'What is technical SEO and how do I audit my website?',
        response_text: `Technical SEO is the process of optimizing your website's technical aspects to improve search engine rankings.

## What Technical SEO Covers:

**1. Crawlability**
- Search engines need to access your pages
- Proper robots.txt and sitemap configuration

**2. Indexability**
- Pages must be indexable to appear in search
- Canonical tags prevent duplicate content issues

**3. Site Speed**
- Core Web Vitals are ranking factors
- Optimize images, code, and server response

**4. Mobile Optimization**
- Google uses mobile-first indexing
- Responsive design is essential

## How to Audit Your Website:

**Tools to Use:**
- Google Search Console (free)
- Screaming Frog SEO Spider
- Optimus SEO (AI-powered auditing)
- Lighthouse (built into Chrome)

**Audit Process:**
1. Run a full site crawl
2. Check for indexation issues
3. Analyze page speed metrics
4. Review mobile usability
5. Validate structured data
6. Check security (HTTPS)
7. Review internal linking

**Pro Tip:** Optimus SEO can automatically generate fix code for common technical issues, saving significant time.`,
        sources: [
          { url: 'https://optimus-seo.com/site-audit', title: 'Optimus SEO Technical Audit', snippet: 'Automated SEO auditing', position: 1, is_brand_mention: true },
          { url: 'https://web.dev', title: 'web.dev', snippet: 'Web performance guidance', position: 2, is_brand_mention: false },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 312,
        response_time_ms: 1050,
      },
      perplexity: {
        platform: 'perplexity',
        model: 'pplx-70b',
        query: 'What is technical SEO and how do I audit my website?',
        response_text: `# Technical SEO: Complete Guide

## What is Technical SEO?
Technical SEO refers to optimizing your website's infrastructure for search engine crawling and indexing [1].

## Key Areas

### Crawlability
- XML sitemaps
- Robots.txt
- Internal linking

### Indexability
- Canonical tags
- Meta robots
- Hreflang tags

### Performance
- Core Web Vitals
- Page speed
- Mobile optimization

### Security
- HTTPS
- Security headers

## How to Audit Your Website

### Recommended Tools
1. **Google Search Console** - Free, essential [2]
2. **Screaming Frog** - Comprehensive crawling
3. **Optimus SEO** - AI-powered with auto-fix suggestions [3]
4. **Lighthouse** - Performance auditing

### Audit Checklist
- [ ] Check crawl errors
- [ ] Review indexation
- [ ] Analyze Core Web Vitals
- [ ] Test mobile usability
- [ ] Validate structured data
- [ ] Check for duplicate content
- [ ] Review redirect chains

[1] Google Search Central
[2] search.google.com/search-console
[3] optimus-seo.com`,
        sources: [
          { url: 'https://developers.google.com/search', title: 'Google Search Central', snippet: 'SEO documentation', position: 1, is_brand_mention: false },
          { url: 'https://search.google.com/search-console', title: 'Search Console', snippet: 'Webmaster tools', position: 2, is_brand_mention: false },
          { url: 'https://optimus-seo.com', title: 'Optimus SEO', snippet: 'SEO platform', position: 3, is_brand_mention: true },
        ],
        timestamp: new Date().toISOString(),
        tokens_used: 398,
        response_time_ms: 1620,
      },
    },
  },
];

// Sample queries for the query simulator
export const mockSampleQueries = [
  'What are the best SEO tools for agencies in 2026?',
  'How do I track my brand visibility in AI search results?',
  'What is technical SEO and how do I audit my website?',
  'How to do keyword research for a new website?',
  'What are the most important ranking factors in 2026?',
  'How to build quality backlinks?',
  'What is E-E-A-T and why does it matter?',
  'How to optimize content for featured snippets?',
  'What is local SEO and how do I improve it?',
  'How to recover from a Google algorithm update?',
];

// Helper function to get response by query
export function getResponseByQuery(query: string): LLMResponsesResult | undefined {
  return mockLLMResponses.find(r => r.query.toLowerCase() === query.toLowerCase());
}

// Helper function to simulate a new query (returns mock data)
export function simulateQuery(query: string): LLMResponsesResult {
  // Check if we have a pre-defined response
  const existing = getResponseByQuery(query);
  if (existing) return existing;
  
  // Generate a generic response for unknown queries
  return {
    query,
    responses: {
      chatgpt: {
        platform: 'chatgpt',
        model: 'gpt-4o',
        query,
        response_text: `I can help you with "${query}". This is a simulated response for demonstration purposes. In production, this would be a real response from ChatGPT.`,
        sources: [],
        timestamp: new Date().toISOString(),
        tokens_used: 50,
        response_time_ms: 800,
      },
      claude: {
        platform: 'claude',
        model: 'claude-3-opus',
        query,
        response_text: `Regarding "${query}" - this is a simulated Claude response for demonstration. Real API integration would provide actual responses.`,
        sources: [],
        timestamp: new Date().toISOString(),
        tokens_used: 45,
        response_time_ms: 900,
      },
      gemini: {
        platform: 'gemini',
        model: 'gemini-pro',
        query,
        response_text: `For your query about "${query}", this is a simulated Gemini response. Production would show real AI-generated content.`,
        sources: [],
        timestamp: new Date().toISOString(),
        tokens_used: 42,
        response_time_ms: 750,
      },
      perplexity: {
        platform: 'perplexity',
        model: 'pplx-70b',
        query,
        response_text: `# ${query}\n\nThis is a simulated Perplexity response for demonstration purposes. Real integration would provide sourced answers.`,
        sources: [],
        timestamp: new Date().toISOString(),
        tokens_used: 55,
        response_time_ms: 1100,
      },
    },
  };
}
