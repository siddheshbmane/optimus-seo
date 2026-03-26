# Optimus SEO - Full API Integration Plan

## Available DataForSEO API Endpoints

### 1. SERP API
- `serpGoogleOrganic` - Google organic search results

### 2. Keywords Data API
- `keywordsSearchVolume` - Search volume for keywords
- `keywordsForSite` - Keywords a domain ranks for

### 3. DataForSEO Labs API
- `keywordIdeas` - Keyword suggestions
- `relatedKeywords` - Related keywords
- `competitorsDomain` - Domain competitors
- `rankedKeywords` - Keywords domain ranks for

### 4. Backlinks API
- `backlinksSummary` - Backlink profile summary
- `backlinksBacklinks` - Individual backlinks
- `backlinksReferringDomains` - Referring domains

### 5. AI Optimization API (LLM Mentions)
- `llmMentionsSearch` - Search LLM mentions
- `llmMentionsTopPages` - Top pages mentioned
- `llmMentionsTopDomains` - Top domains mentioned
- `llmMentionsAggregated` - Aggregated mentions data
- `llmResponsesLive` - Live LLM responses
- `llmResponsesCompare` - Compare LLM responses

### 6. OnPage API
- `onpageTaskPost` - Start site crawl
- `onpageSummary` - Crawl summary
- `onpageLighthouse` - Lighthouse audit

### 7. Content Analysis API
- `contentAnalysisSearch` - Content search
- `contentAnalysisSentiment` - Sentiment analysis

### 8. Business Data API
- `googleMyBusinessInfo` - GMB info
- `googleReviews` - Google reviews

---

## Page-to-API Mapping

### SALES SECTION (12 pages)

| Page | API Endpoints | Status |
|------|--------------|--------|
| Site Audit | `onpageLighthouse` | ✅ Connected |
| Keyword Research | `keywordsForSite`, `keywordsSearchVolume` | ✅ Connected |
| Competitor Analysis | `competitorsDomain`, `rankedKeywords` | ❌ Needs hook |
| AI Visibility | `llmMentionsAggregated`, `llmMentionsSearch` | ❌ Needs hook |
| PPC Intelligence | `keywordsSearchVolume` (CPC data) | ❌ Needs hook |
| GMB Analysis | `googleMyBusinessInfo`, `googleReviews` | ❌ Needs hook |
| Proposal Generator | Aggregates from other APIs + LLM | ❌ Needs hook |
| YouTube SEO | `serpGoogleOrganic` (video results) | ❌ Needs hook |
| E-commerce SEO | `keywordsForSite`, `onpageLighthouse` | ❌ Needs hook |
| Social Intelligence | `contentAnalysisSentiment` | ❌ Needs hook |
| Multi-Search Tracking | `serpGoogleOrganic` (multiple engines) | ❌ Needs hook |
| Pitch Deck | Aggregates from other APIs | ❌ Needs hook |

### STRATEGY SECTION (8 pages)

| Page | API Endpoints | Status |
|------|--------------|--------|
| Keyword Strategy | `keywordsForSite`, `keywordIdeas` | ❌ Needs hook |
| Content Calendar | Database + LLM suggestions | ❌ Needs hook |
| Content Briefs | LLM API for generation | ❌ Needs hook |
| Topic Clusters | `relatedKeywords`, `keywordIdeas` | ❌ Needs hook |
| Competitor Gaps | `competitorsDomain`, `rankedKeywords` | ❌ Needs hook |
| Content Ideas | `keywordIdeas`, LLM API | ❌ Needs hook |
| SERP Analysis | `serpGoogleOrganic` | ❌ Needs hook |
| Content Optimization | `onpageLighthouse`, LLM API | ❌ Needs hook |

### EXECUTION SECTION (5 pages)

| Page | API Endpoints | Status |
|------|--------------|--------|
| AI Content Writer | LLM API for content generation | ❌ Needs hook |
| Link Builder | `backlinksBacklinks`, `backlinksReferringDomains` | ❌ Needs hook |
| Technical Fixes | `onpageTaskPost`, `onpageSummary` | ❌ Needs hook |
| Content Optimizer | `onpageLighthouse`, LLM API | ❌ Needs hook |
| Quick Wins | Aggregates issues from other APIs | ❌ Needs hook |

### REPORTS SECTION (6 pages)

| Page | API Endpoints | Status |
|------|--------------|--------|
| Rankings | `rankedKeywords`, `serpGoogleOrganic` | ❌ Needs hook |
| Traffic | `rankedKeywords` (estimated traffic) | ❌ Needs hook |
| Backlinks | `backlinksSummary`, `backlinksBacklinks` | ❌ Needs hook |
| Content | `onpageSummary`, content metrics | ❌ Needs hook |
| Competitor | `competitorsDomain` | ❌ Needs hook |
| Visibility | `llmMentionsAggregated` | ❌ Needs hook |

---

## Implementation Priority

### Phase 1: Core Sales Pages (High Priority)
1. Competitor Analysis - Use existing `useCompetitorData` hook
2. AI Visibility - Use existing `useAIVisibilityData` hook
3. PPC Intelligence - Create `usePPCData` hook
4. GMB Analysis - Create `useGMBData` hook

### Phase 2: Strategy Pages
5. Keyword Strategy - Create `useKeywordStrategy` hook
6. SERP Analysis - Create `useSERPData` hook
7. Topic Clusters - Create `useTopicClusters` hook
8. Content Ideas - Create `useContentIdeas` hook

### Phase 3: Reports Pages
9. Rankings Report - Create `useRankingsData` hook
10. Backlinks Report - Create `useBacklinksData` hook
11. Traffic Report - Create `useTrafficData` hook
12. Visibility Report - Reuse `useAIVisibilityData`

### Phase 4: Execution Pages
13. Technical Fixes - Create `useTechnicalIssues` hook
14. Link Builder - Create `useLinkOpportunities` hook
15. Content Writer - Integrate LLM API
16. Content Optimizer - Create `useContentOptimization` hook

### Phase 5: Remaining Pages
17. Proposal Generator - Aggregate data
18. Pitch Deck - Aggregate data
19. YouTube SEO - Video SERP data
20. E-commerce SEO - Product-focused data
21. Social Intelligence - Sentiment data
22. Multi-Search Tracking - Multi-engine SERP

---

## New Hooks to Create

```typescript
// src/hooks/use-seo-data.ts - Add these hooks:

1. usePPCData(domain) - PPC/CPC keyword data
2. useGMBData(businessName, location) - Google My Business data
3. useSERPData(keywords) - SERP results
4. useBacklinksData(domain) - Backlink profile
5. useRankingsData(domain) - Ranking positions
6. useTrafficData(domain) - Traffic estimates
7. useTopicClusters(keyword) - Topic cluster data
8. useContentIdeas(domain) - Content suggestions
9. useTechnicalIssues(url) - Technical SEO issues
10. useLinkOpportunities(domain) - Link building opportunities
```

---

## Database Schema Updates Needed

1. Store API results for caching
2. Track historical data for trends
3. Store user preferences per project
4. Task queue for async operations

---

## Execution Order

1. ✅ Map all endpoints (this document)
2. Create all missing hooks in use-seo-data.ts
3. Update each page to use hooks
4. Add loading states and error handling
5. Add export functionality to all pages
6. Test each page with real API calls
7. Run pnpm build to verify no errors
