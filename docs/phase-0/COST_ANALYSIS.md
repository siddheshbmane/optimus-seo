# COST_ANALYSIS.md — Optimus SEO

> **Version:** 1.0 | **Date:** 2026-03-18
> **Status:** Draft — Awaiting Approval
> **Author:** AI Agent (per heart.md blueprint)

---

## Executive Summary

This document provides a comprehensive cost analysis for Optimus SEO's operational expenses, focusing on:
1. **DataForSEO API costs** — Primary SEO data provider
2. **LLM API costs** — AI content generation and analysis
3. **Infrastructure costs** — Hosting, databases, services
4. **Per-feature cost breakdown** — What each feature costs to operate
5. **Pricing model recommendations** — How to price the SaaS product

**Key Finding:** At scale (100 active projects), estimated monthly operational cost is **$2,500-$5,000**, enabling healthy margins with proper pricing.

---

## 1. DataForSEO API Pricing

### 1.1 Pricing Model

DataForSEO uses **pay-as-you-go pricing** with a **$50 minimum deposit**. No monthly subscriptions required for most APIs.

**Important Notes:**
- Backlinks API and AI/LLM Mentions API have **$100/month minimum spend** requirements
- Prices are per API call, not per keyword or domain
- Standard queue (async) is 60-70% cheaper than live (sync) requests

### 1.2 API Pricing Table

| API Category | Endpoint | Live Price | Standard Price | Notes |
|--------------|----------|------------|----------------|-------|
| **SERP API** | Google Organic | $0.0020/page | $0.0006/page | 100 results per page |
| | Google Local Pack | $0.0020/page | $0.0006/page | |
| | Bing Organic | $0.0015/page | $0.0005/page | |
| | YouTube Search | $0.0020/page | $0.0006/page | |
| **Keywords Data API** | Google Ads Search Volume | $0.05/task | — | Up to 1,000 keywords per task |
| | Google Ads Keywords for Site | $0.05/task | — | |
| | Google Trends | $0.01/task | — | |
| | Bing Search Volume | $0.05/task | — | |
| **DataForSEO Labs** | Ranked Keywords | $0.0006/row | — | Max 1,000 rows per request |
| | Keyword Suggestions | $0.0003/row | — | |
| | Related Keywords | $0.0003/row | — | |
| | Competitors Domain | $0.0003/row | — | |
| | Domain Intersection | $0.0003/row | — | |
| **Backlinks API** | Summary | $0.02/request | — | **$100/month minimum** |
| | Backlinks List | $0.02 + $0.00003/row | — | Max 1,000 rows |
| | Referring Domains | $0.02 + $0.00003/row | — | |
| | Anchors | $0.02 + $0.00003/row | — | |
| | Domain Intersection | $0.04 + $0.00003/row | — | |
| **OnPage API** | Task Post (Crawl) | $0.000125/page | — | Basic crawl |
| | Lighthouse | $0.00425/page | — | Full Lighthouse audit |
| | Pages | $0.000125/page | — | |
| | Summary | Free | — | After crawl |
| **Business Data API** | Google Reviews | $0.004/task | — | |
| | Business Listings | $0.002/task | — | |
| **AI Optimization API** | LLM Mentions | $0.10 + $0.001/row | — | **$100/month minimum** |
| | AI Keyword Data | $0.05/task | — | |
| | Top Domains | $0.10 + $0.001/row | — | |

### 1.3 Cost Estimation by Feature

#### F-S02: Site Audit Agent
```
Crawl 500 pages (basic):     500 × $0.000125 = $0.0625
Lighthouse (50 key pages):    50 × $0.00425  = $0.2125
Backlinks Summary:             1 × $0.02     = $0.02
─────────────────────────────────────────────────────
Total per audit:                              $0.30
```

#### F-S03: Keyword Research (Overview — 100 keywords)
```
Ranked Keywords (1000 rows):  1000 × $0.0006 = $0.60
Search Volume (1 task):          1 × $0.05   = $0.05
SERP Check (10 keywords):       10 × $0.002  = $0.02
─────────────────────────────────────────────────────
Total per overview:                           $0.67
```

#### F-S04: Competitor Analysis (Overview — 5 competitors)
```
Competitors Domain:              1 × $0.0003 × 100 = $0.03
Backlinks Summary (×5):          5 × $0.02         = $0.10
Domain Intersection:             1 × $0.04         = $0.04
─────────────────────────────────────────────────────────────
Total per competitor analysis:                      $0.17
```

#### F-S06: AI Visibility Check
```
LLM Mentions (brand):            1 × $0.10 + (50 × $0.001) = $0.15
AI Keyword Data (10 keywords):  10 × $0.05                 = $0.50
Top Domains:                     1 × $0.10 + (20 × $0.001) = $0.12
─────────────────────────────────────────────────────────────────────
Total per AI visibility check:                              $0.77
```
**Note:** Requires $100/month minimum spend on AI Optimization API.

#### F-R01: Rank Tracking (100 keywords, daily)
```
Daily SERP checks:             100 × $0.0006 = $0.06/day
Monthly (30 days):              30 × $0.06   = $1.80/month
```

#### F-ST01: Extensive Keyword Research (1000 keywords)
```
Keyword Suggestions:          1000 × $0.0003 = $0.30
Related Keywords:             1000 × $0.0003 = $0.30
Search Volume (1 task):          1 × $0.05   = $0.05
Trends (10 clusters):           10 × $0.01   = $0.10
─────────────────────────────────────────────────────
Total per extensive research:                 $0.75
```

#### F-E03: Backlink Prospecting
```
Backlinks List (1000 rows):      1 × $0.02 + (1000 × $0.00003) = $0.05
Referring Domains (1000 rows):   1 × $0.02 + (1000 × $0.00003) = $0.05
Domain Intersection:             1 × $0.04 + (500 × $0.00003)  = $0.055
─────────────────────────────────────────────────────────────────────────
Total per prospecting run:                                      $0.155
```

### 1.4 Monthly Cost Projections by Scale

| Scale | Projects | Monthly DataForSEO Cost | Notes |
|-------|----------|------------------------|-------|
| **Dogfooding** | 5 | $150-250 | Includes $100 Backlinks minimum |
| **Early SaaS** | 20 | $300-500 | |
| **Growth** | 50 | $600-1,000 | |
| **Scale** | 100 | $1,200-2,000 | |
| **Enterprise** | 500 | $5,000-10,000 | Volume discounts may apply |

**Assumptions:**
- Each project runs: 1 audit/month, daily rank tracking (100 kw), 2 competitor analyses, 1 AI visibility check
- Backlinks API $100/month minimum is included
- AI Optimization API $100/month minimum is included (if using AI visibility features)

---

## 2. LLM API Pricing

### 2.1 Provider Comparison (per 1M tokens)

| Provider | Model | Input | Output | Best For |
|----------|-------|-------|--------|----------|
| **Anthropic** | Claude Sonnet 4 | $3.00 | $15.00 | Complex analysis, content review |
| | Claude Haiku | $1.00 | $5.00 | Simple classification, extraction |
| **OpenAI** | GPT-4o | $2.50 | $10.00 | General purpose, good balance |
| | GPT-4o mini | $0.15 | $0.60 | High volume, simple tasks |
| | GPT-4.1 | $2.00 | $8.00 | Latest model, improved reasoning |
| **Google** | Gemini 2.0 Flash | $0.10 | $0.40 | Fastest, cheapest for simple tasks |
| | Gemini 2.0 Pro | $1.25 | $5.00 | Complex reasoning |
| **Mistral** | Mistral Large | $2.00 | $6.00 | European data residency |
| | Mistral Small | $0.20 | $0.60 | Cost-effective alternative |
| **DeepSeek** | DeepSeek V3 | $0.14 | $0.28 | Extremely cost-effective |

### 2.2 Token Usage by Feature

#### F-E01: Content Creation Agent (1 article)
```
Input (brief + context):      ~2,000 tokens
Output (2000-word article):   ~3,000 tokens

Using GPT-4o:
  Input:  2,000 × $2.50/1M = $0.005
  Output: 3,000 × $10.00/1M = $0.03
  Total: $0.035/article

Using GPT-4o mini:
  Input:  2,000 × $0.15/1M = $0.0003
  Output: 3,000 × $0.60/1M = $0.0018
  Total: $0.002/article
```

#### F-E02: AI Reviewer Agent (1 review cycle)
```
Input (content + criteria):   ~4,000 tokens
Output (feedback):            ~500 tokens

Using Claude Sonnet:
  Input:  4,000 × $3.00/1M = $0.012
  Output: 500 × $15.00/1M = $0.0075
  Total: $0.02/review

Average 2.5 cycles per article: $0.05/article
```

#### F-S08: Pitch Deck Generation
```
Input (all audit data):       ~10,000 tokens
Output (narrative + slides):  ~5,000 tokens

Using GPT-4o:
  Input:  10,000 × $2.50/1M = $0.025
  Output: 5,000 × $10.00/1M = $0.05
  Total: $0.075/pitch deck
```

#### F-ST04: Content Brief Generation (1 brief)
```
Input (keyword data + SERP):  ~3,000 tokens
Output (detailed brief):      ~2,000 tokens

Using GPT-4o:
  Input:  3,000 × $2.50/1M = $0.0075
  Output: 2,000 × $10.00/1M = $0.02
  Total: $0.03/brief
```

#### F-R06: Automated Client Report
```
Input (all metrics):          ~15,000 tokens
Output (report narrative):    ~8,000 tokens

Using GPT-4o:
  Input:  15,000 × $2.50/1M = $0.0375
  Output: 8,000 × $10.00/1M = $0.08
  Total: $0.12/report
```

### 2.3 Recommended Model Strategy

| Task Type | Recommended Model | Fallback | Rationale |
|-----------|------------------|----------|-----------|
| Content Creation | GPT-4o | Claude Sonnet | Best quality/cost balance |
| Content Review | Claude Sonnet | GPT-4o | Superior at following criteria |
| Classification | GPT-4o mini | Gemini Flash | High volume, simple task |
| Keyword Clustering | GPT-4o mini | Mistral Small | Pattern recognition |
| Report Narrative | GPT-4o | Claude Sonnet | Clear, professional writing |
| Pitch Deck Copy | Claude Sonnet | GPT-4o | Persuasive writing |

### 2.4 Monthly LLM Cost Projections

| Scale | Projects | Content/mo | LLM Cost | Notes |
|-------|----------|------------|----------|-------|
| **Dogfooding** | 5 | 50 articles | $50-100 | Mixed model usage |
| **Early SaaS** | 20 | 200 articles | $200-400 | |
| **Growth** | 50 | 500 articles | $500-1,000 | |
| **Scale** | 100 | 1,000 articles | $1,000-2,000 | |
| **Enterprise** | 500 | 5,000 articles | $5,000-10,000 | Volume discounts |

**Cost Optimization Strategies:**
1. Use GPT-4o mini for first draft, GPT-4o for final polish
2. Cache common prompts and responses
3. Batch similar requests
4. Use smaller models for classification/extraction
5. Implement token budgets per project

---

## 3. Infrastructure Costs

### 3.1 Vercel (Next.js Frontend)

| Plan | Price | Included | Our Usage |
|------|-------|----------|-----------|
| **Pro** | $20/user/mo | 1TB bandwidth, 1000 builds | Recommended |
| **Team** | $20/user/mo | Same + team features | For 3+ developers |

**Estimated Cost:** $20-60/month (1-3 developers)

### 3.2 Railway (FastAPI + PostgreSQL + Redis)

| Resource | Estimated Usage | Cost |
|----------|-----------------|------|
| **FastAPI Service** | 1 vCPU, 1GB RAM | ~$10/month |
| **Celery Workers (×2)** | 2 vCPU, 2GB RAM | ~$20/month |
| **PostgreSQL** | 1GB storage, growing | ~$5-20/month |
| **Redis** | 256MB | ~$5/month |

**Estimated Cost:** $40-60/month (early stage)

### 3.3 Other Services

| Service | Purpose | Cost |
|---------|---------|------|
| **Resend** | Transactional email | $0 (free tier: 3,000/mo) → $20/mo |
| **PostHog** | Analytics + Feature flags | $0 (free tier: 1M events) → $450/mo |
| **Sentry** | Error tracking | $0 (free tier) → $26/mo |
| **GitHub** | Repository | $0 (free for private repos) |
| **Domain** | optimus-seo.com | ~$15/year |

**Estimated Cost:** $0-50/month (early stage)

### 3.4 Total Infrastructure Cost

| Stage | Monthly Cost | Notes |
|-------|--------------|-------|
| **Development** | $20-40 | Minimal usage |
| **Dogfooding** | $60-100 | 5 projects |
| **Early SaaS** | $100-200 | 20 projects |
| **Growth** | $200-400 | 50 projects |
| **Scale** | $400-800 | 100 projects |

---

## 4. Total Cost of Ownership

### 4.1 Per-Project Monthly Cost

| Cost Category | Low Estimate | High Estimate | Notes |
|---------------|--------------|---------------|-------|
| **DataForSEO** | $10 | $25 | Depends on feature usage |
| **LLM** | $5 | $20 | Depends on content volume |
| **Infrastructure** | $1 | $3 | Amortized across projects |
| **Total** | **$16** | **$48** | Per active project |

### 4.2 Monthly Operating Cost by Scale

| Scale | Projects | DataForSEO | LLM | Infra | Total |
|-------|----------|------------|-----|-------|-------|
| **Dogfooding** | 5 | $200 | $75 | $80 | **$355** |
| **Early SaaS** | 20 | $400 | $300 | $150 | **$850** |
| **Growth** | 50 | $800 | $750 | $300 | **$1,850** |
| **Scale** | 100 | $1,500 | $1,500 | $500 | **$3,500** |
| **Enterprise** | 500 | $7,500 | $7,500 | $2,000 | **$17,000** |

### 4.3 Cost Per Feature (Full Workflow)

| Feature | DataForSEO | LLM | Total | Frequency |
|---------|------------|-----|-------|-----------|
| **Sales Audit** | $0.30 | $0.10 | $0.40 | 1×/project |
| **Keyword Overview** | $0.67 | $0.05 | $0.72 | 1×/project |
| **Competitor Overview** | $0.17 | $0.05 | $0.22 | 1×/project |
| **AI Visibility** | $0.77 | $0.03 | $0.80 | 1×/month |
| **Pitch Deck** | $0.00 | $0.08 | $0.08 | 1×/project |
| **Extensive Keywords** | $0.75 | $0.10 | $0.85 | 1×/project |
| **Content Brief** | $0.05 | $0.03 | $0.08 | Per page |
| **Content Creation** | $0.00 | $0.04 | $0.04 | Per article |
| **Content Review** | $0.00 | $0.05 | $0.05 | Per article |
| **Rank Tracking** | $1.80 | $0.00 | $1.80 | Monthly (100 kw) |
| **Client Report** | $0.00 | $0.12 | $0.12 | Monthly |
| **Backlink Prospecting** | $0.16 | $0.02 | $0.18 | Weekly |

---

## 5. Pricing Model Recommendations

### 5.1 Recommended Pricing Tiers

Based on cost analysis, here are recommended SaaS pricing tiers:

| Tier | Price/mo | Projects | Keywords | Content | Margin |
|------|----------|----------|----------|---------|--------|
| **Starter** | $99 | 3 | 100/project | 10/mo | 65% |
| **Professional** | $299 | 10 | 500/project | 50/mo | 70% |
| **Agency** | $599 | 25 | 1000/project | 150/mo | 72% |
| **Enterprise** | $1,499 | Unlimited | Unlimited | Unlimited | 75% |

### 5.2 Cost Breakdown by Tier

#### Starter ($99/mo)
```
DataForSEO (3 projects):     $30-50
LLM (10 articles):           $5-10
Infrastructure (amortized):  $5
─────────────────────────────────────
Total Cost:                  $40-65
Margin:                      $34-59 (34-60%)
```

#### Professional ($299/mo)
```
DataForSEO (10 projects):    $100-150
LLM (50 articles):           $25-50
Infrastructure (amortized):  $15
─────────────────────────────────────
Total Cost:                  $140-215
Margin:                      $84-159 (28-53%)
```

#### Agency ($599/mo)
```
DataForSEO (25 projects):    $200-350
LLM (150 articles):          $75-150
Infrastructure (amortized):  $30
─────────────────────────────────────
Total Cost:                  $305-530
Margin:                      $69-294 (12-49%)
```

### 5.3 BYOK (Bring Your Own Key) Model

For users who want to use their own API keys:

| Tier | Price/mo | Discount | User Provides |
|------|----------|----------|---------------|
| **Starter BYOK** | $49 | 50% off | DataForSEO + LLM keys |
| **Professional BYOK** | $149 | 50% off | DataForSEO + LLM keys |
| **Agency BYOK** | $299 | 50% off | DataForSEO + LLM keys |

**Benefits:**
- Users control their own API costs
- No usage limits (within their API budgets)
- Higher margins for us (infrastructure only)
- Appeals to agencies with existing API accounts

### 5.4 Usage-Based Add-ons

| Add-on | Price | Notes |
|--------|-------|-------|
| Additional project | $20/mo | Beyond tier limit |
| Additional 100 keywords | $10/mo | For rank tracking |
| Additional 10 articles | $15/mo | Content creation |
| AI Visibility module | $50/mo | Requires $100 DataForSEO minimum |
| White-label branding | $100/mo | Custom domain + branding |
| Priority support | $50/mo | 4-hour response SLA |

---

## 6. Cost Optimization Strategies

### 6.1 DataForSEO Optimizations

1. **Use Standard Queue** — 60-70% cheaper than live requests for non-urgent tasks
2. **Batch Requests** — Combine multiple keywords into single API calls
3. **Cache Results** — Store SERP/keyword data for 24-48 hours
4. **Smart Scheduling** — Run rank tracking at off-peak hours
5. **Incremental Crawls** — Only re-crawl changed pages for audits

### 6.2 LLM Optimizations

1. **Model Tiering** — Use cheaper models for simple tasks
2. **Prompt Caching** — Cache common prompt templates
3. **Response Caching** — Cache identical requests
4. **Token Budgets** — Set max tokens per request type
5. **Batch Processing** — Process multiple items in single requests
6. **Fine-tuning** — Consider fine-tuned models for repetitive tasks

### 6.3 Infrastructure Optimizations

1. **Auto-scaling** — Scale Celery workers based on queue depth
2. **Spot Instances** — Use Railway's spot pricing when available
3. **Database Optimization** — Proper indexing, query optimization
4. **CDN Caching** — Cache static assets and API responses
5. **Connection Pooling** — Efficient database connections

---

## 7. Risk Factors

### 7.1 Price Increase Risks

| Provider | Risk Level | Mitigation |
|----------|------------|------------|
| DataForSEO | Low | Long-term contracts, alternative providers |
| OpenAI | Medium | LiteLLM allows easy provider switching |
| Anthropic | Medium | LiteLLM allows easy provider switching |
| Vercel | Low | Can migrate to self-hosted Next.js |
| Railway | Low | Can migrate to any Docker host |

### 7.2 Usage Spike Risks

| Scenario | Impact | Mitigation |
|----------|--------|------------|
| Viral growth | 10× API costs | Usage caps, rate limiting, BYOK |
| Abuse/scraping | Unexpected costs | Rate limiting, fraud detection |
| Bug causing loops | Runaway costs | Circuit breakers, cost alerts |

### 7.3 Minimum Spend Requirements

| API | Minimum | Impact |
|-----|---------|--------|
| DataForSEO Backlinks | $100/mo | Must be factored into base cost |
| DataForSEO AI Optimization | $100/mo | Only if using AI visibility features |

---

## 8. Appendix: API Endpoint Reference

### 8.1 DataForSEO Endpoints Used

```
# SERP API
POST /v3/serp/google/organic/live/regular
POST /v3/serp/google/organic/task_post (standard queue)
POST /v3/serp/google/local_pack/live/regular

# Keywords Data API
POST /v3/keywords_data/google_ads/search_volume/live
POST /v3/keywords_data/google_ads/keywords_for_site/live
POST /v3/keywords_data/google_trends/explore/live

# DataForSEO Labs
POST /v3/dataforseo_labs/google/ranked_keywords/live
POST /v3/dataforseo_labs/google/keyword_suggestions/live
POST /v3/dataforseo_labs/google/related_keywords/live
POST /v3/dataforseo_labs/google/competitors_domain/live
POST /v3/dataforseo_labs/google/domain_intersection/live

# Backlinks API
POST /v3/backlinks/summary/live
POST /v3/backlinks/backlinks/live
POST /v3/backlinks/referring_domains/live
POST /v3/backlinks/anchors/live
POST /v3/backlinks/domain_intersection/live

# OnPage API
POST /v3/on_page/task_post
GET /v3/on_page/pages
GET /v3/on_page/summary
POST /v3/on_page/lighthouse/live/json

# Business Data API
POST /v3/business_data/google/reviews/task_post
POST /v3/business_data/business_listings/search/live

# AI Optimization API
POST /v3/ai_optimization/llm_mentions/search/live
POST /v3/ai_optimization/ai_keyword_data/live
POST /v3/ai_optimization/llm_mentions/top_domains/live
```

### 8.2 LLM Endpoints (via LiteLLM)

```python
# LiteLLM unified interface
from litellm import completion

# OpenAI
response = completion(model="gpt-4o", messages=[...])
response = completion(model="gpt-4o-mini", messages=[...])

# Anthropic
response = completion(model="claude-sonnet-4-20250514", messages=[...])
response = completion(model="claude-3-haiku-20240307", messages=[...])

# Google
response = completion(model="gemini/gemini-2.0-flash", messages=[...])
response = completion(model="gemini/gemini-2.0-pro", messages=[...])

# Mistral
response = completion(model="mistral/mistral-large-latest", messages=[...])
```

---

## PHASE 0 GATE: COST_ANALYSIS.md

```
[x] DataForSEO pricing documented
[x] LLM pricing documented
[x] Infrastructure costs estimated
[x] Per-feature costs calculated
[x] Monthly projections by scale
[x] Pricing model recommendations
[x] Cost optimization strategies
[x] Risk factors identified
[ ] USER APPROVAL — Awaiting
```

---

> **Next**: User approval → Backend implementation (PostgreSQL, Prisma, Auth)
