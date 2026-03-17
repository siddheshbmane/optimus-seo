# SCOPE.md — Optimus SEO

> **Version:** 1.0 | **Date:** 2026-03-13
> **Status:** Draft — Awaiting Approval
> **Author:** AI Agent (per heart.md blueprint)

---

## 1. PROJECT OVERVIEW

### 1.1 Product Name
**Optimus SEO**

### 1.2 One-Liner
An AI-agent-powered SEO operations platform that automates 85-90% of executive SEO work — from sales pitch to delivery — letting strategists and sales people run an entire SEO department.

### 1.3 Elevator Pitch
SEO agencies and businesses spend 80% of their time on execution — keyword research, backlink prospecting, content writing, submissions, audits, reporting. Optimus SEO replaces that execution layer with a team of specialized AI agents powered by real SEO data (DataForSEO). Strategists decide what to do. Agents do the work. Humans approve 10-15% of critical actions. The result: an agency that delivers 10x more with the same team.

### 1.4 Problem Statement
- **SEO execution is labor-intensive**: A single client project requires keyword research, competitor analysis, content creation, backlink building, technical audits, and monthly reporting — each taking hours of manual work.
- **Existing tools are analysis-only**: Ahrefs, SEMrush, and Moz tell you WHAT to do but don't DO it. They're dashboards, not execution engines.
- **Scaling requires hiring**: To take on more clients, agencies must hire more SEO executives. This is expensive, slow, and creates quality inconsistency.
- **Reporting is manual**: Monthly client reports take hours to compile from multiple data sources.
- **AI search is a blind spot**: Most agencies have no visibility into how their clients appear in ChatGPT, Claude, Gemini, or Perplexity responses.

### 1.5 Target Audience
- **Primary**: SEO agencies (B2B) — managing SEO for multiple clients
- **Secondary**: Businesses with in-house SEO teams — doing their own SEO
- **Initial user**: Ourselves — dogfooding the product on our own clients before opening as SaaS

### 1.6 Industry / Domain
MarTech / SEO / Digital Marketing Automation

### 1.7 Success Metrics

| Metric | Target (Wave 1 — Internal) | Target (Wave 3 — SaaS) |
|--------|---------------------------|------------------------|
| Time saved per project/month | 60+ hours | — |
| Agent autonomy rate | 85% tasks without human intervention | 85% |
| Content quality pass rate (first attempt) | 70%+ | 80%+ |
| Backlink approval rate | 40%+ | 50%+ |
| Rank tracking accuracy | 99% (DataForSEO) | 99% |
| Registered users | Internal team (5-10) | 200 at launch, 2000 in 12mo |
| MRR | — | $20K in 6 months post-launch |
| Client report generation time | < 5 minutes (automated) | < 5 minutes |

---

## 2. USER PERSONAS

### 2.1 Persona: Rahul — Agency Owner / Strategist

| Attribute | Detail |
|-----------|--------|
| **Role** | SEO Agency Owner / Head Strategist |
| **Goals** | Scale the agency without proportionally scaling headcount. Deliver better results faster. Win more clients with impressive pitches. |
| **Frustrations** | Spends too much time on execution instead of strategy. Reporting takes forever. Hard to maintain quality across multiple clients. Can't track AI search visibility. |
| **Tech Savviness** | High — comfortable with SEO tools, dashboards, data |
| **Uses** | Sales audit, pitch deck generation, strategy approval, client reporting, team oversight, configurator settings |

### 2.2 Persona: Priya — Sales / Business Development

| Attribute | Detail |
|-----------|--------|
| **Role** | Sales Manager at SEO Agency |
| **Goals** | Close more deals with data-driven pitches. Quickly generate audit reports for prospects. Show clear ROI projections. |
| **Frustrations** | Takes days to prepare a proper SEO audit for a prospect. Relies on SEO team for data. Can't independently generate pitches. |
| **Tech Savviness** | Medium — comfortable with presentations and CRM, not deep SEO tools |
| **Uses** | Sales audit agent, pitch deck generator, proposal generation, prospect analysis |

### 2.3 Persona: Amit — SEO Executive / Specialist

| Attribute | Detail |
|-----------|--------|
| **Role** | SEO Executive handling day-to-day execution |
| **Goals** | Execute keyword research, content creation, and link building efficiently. Reduce repetitive manual work. Focus on creative and strategic tasks. |
| **Frustrations** | Spends hours on repetitive tasks (directory submissions, content formatting, report compilation). Quality review bottleneck slows everything down. |
| **Tech Savviness** | High — deep SEO knowledge, comfortable with technical tools |
| **Uses** | Keyword research, content creation oversight, submission monitoring, AI reviewer configuration, rank tracking |

### 2.4 Persona: Sarah — Client (Read-Only Portal)

| Attribute | Detail |
|-----------|--------|
| **Role** | Business owner / Marketing manager at client company |
| **Goals** | See progress on SEO campaign. Understand ROI. Access reports without waiting for agency. |
| **Frustrations** | Doesn't understand SEO jargon. Wants simple dashboards. Hates waiting for monthly reports. |
| **Tech Savviness** | Low to Medium |
| **Uses** | Client portal (read-only), reports, rank tracking dashboard, traffic analytics |

### 2.5 Persona: Admin — Super Admin (SaaS Phase)

| Attribute | Detail |
|-----------|--------|
| **Role** | Platform administrator (us, initially) |
| **Goals** | Manage tenants, monitor system health, manage billing, feature flags |
| **Frustrations** | Need visibility into all tenants, API usage, costs |
| **Tech Savviness** | Very High |
| **Uses** | Super admin panel, tenant management, billing management, system analytics, feature flags |

### 2.6 Persona-to-Feature Map

| Feature | Rahul (Strategist) | Priya (Sales) | Amit (Executive) | Sarah (Client) | Admin |
|---------|:------------------:|:--------------:|:-----------------:|:--------------:|:-----:|
| Sales Audit | Review | Create + Use | — | — | — |
| Pitch Deck Generator | Review | Create + Use | — | — | — |
| Keyword Research (Overview) | Review | View | — | — | — |
| Keyword Research (Extensive) | Approve | — | Execute + Configure | — | — |
| Competitor Analysis | Approve | View overview | Execute | — | — |
| Website Structure Analysis | Approve | — | Execute | — | — |
| Content Briefs | Approve | — | Execute + Configure | — | — |
| Content Creation Agent | Monitor | — | Configure + Monitor | — | — |
| AI Reviewer Agent | Configure criteria | — | Configure + Monitor | — | — |
| Backlink Prospecting | Approve strategy | — | Monitor | — | — |
| Backlink Submission | Monitor | — | Monitor + Override | — | — |
| Rank Tracking | View + Configure | View | Configure | View | — |
| Traffic Analytics | View | View | View | View | — |
| AI Visibility | View | View in pitch | View | View | — |
| GMB Agent | Approve | — | Configure + Monitor | — | — |
| Client Reports | Review + Send | Share with prospects | Generate | Receive + View | — |
| Configurator | Full access | Limited | Per-agent access | — | — |
| Client Portal | — | — | — | Full read access | — |
| Admin Panel | — | — | — | — | Full access |

---

## 3. FEATURE SPECIFICATION

### 3.1 SALES PHASE FEATURES

---

#### F-S01: Project Creation & Location Selector

**Description**: Create a new client project with location-aware data. Location is selected from a searchable dropdown powered by DataForSEO Locations API — not a free-text input.

**User Stories**:
- As a **Sales person**, I want to create a new project by entering a client URL and selecting target locations from a dropdown, so that all subsequent data is location-specific.
- As a **Strategist**, I want to see all active projects with their locations and status at a glance.

**Acceptance Criteria**:
- Given a user is on the "New Project" page, when they start typing a location, then a searchable dropdown shows matching countries, states, cities, and DMAs from DataForSEO Locations API.
- Given a user selects a location, when they proceed, then the `location_code` is stored and used for all subsequent API calls.
- Given a user enters a client URL, when they submit, then the system validates the URL is reachable.
- Given a project is created, when the user views the dashboard, then the project appears with status "Created" and location badge.

**Priority**: P0 (Must-have)
**Complexity**: Medium
**Dependencies**: DataForSEO Locations API integration

**DataForSEO APIs**: 
- `GET /v3/keywords_data/google_ads/locations` — populate location dropdown

---

#### F-S02: Site Audit Agent

**Description**: Automated technical SEO audit of the client's website using DataForSEO OnPage API. Crawls the site, analyzes 60+ metrics, generates a health score and prioritized fix list.

**User Stories**:
- As a **Sales person**, I want to run an instant SEO audit on a prospect's website so that I can identify issues and opportunities for my pitch.
- As a **Strategist**, I want to see Core Web Vitals, mobile performance, and technical health scores so that I can prioritize fixes.

**Acceptance Criteria**:
- Given a project URL, when the audit agent is triggered, then it crawls up to 500 pages (configurable) using DataForSEO OnPage API.
- Given the crawl completes, then the system displays: HTTP status distribution, meta tag analysis, broken links, redirect chains, duplicate content, page speed insights, Core Web Vitals, Lighthouse scores (Performance, Accessibility, SEO, Best Practices), mobile vs desktop split.
- Given the audit data, then the LLM generates: an overall health score (0-100), top 10 critical issues with fix priority, and a summary narrative.
- Given the audit, then toxic backlinks are detected via Backlinks API spam score.
- Given the audit, then schema markup presence is checked per page type.
- Given the audit completes, then results are stored and available for pitch deck generation.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: DataForSEO OnPage API, Backlinks API, LLM integration

**DataForSEO APIs**:
- `POST /v3/on_page/task_post` — initiate crawl
- `GET /v3/on_page/pages` — get crawled pages data
- `GET /v3/on_page/summary` — get crawl summary
- `POST /v3/on_page/lighthouse/live/json` — Lighthouse scores
- `POST /v3/backlinks/summary/live` — backlink profile + spam score

---

#### F-S03: Keyword Research — Overview Level (Sales)

**Description**: Location-specific keyword analysis showing the client's current keyword landscape. Pulls current rankings (top 30 only), classifies by type and intent, shows search volume and estimated traffic. LLM selects ~100 most valuable keywords.

**User Stories**:
- As a **Sales person**, I want to see what keywords a prospect currently ranks for (top 30) with search volumes and traffic, so that I can demonstrate knowledge of their SEO position.
- As a **Strategist**, I want keywords classified by intent (commercial, informational, navigational, transactional) and type (short-tail, long-tail, generic, branded) so that I can quickly assess the keyword strategy.

**Acceptance Criteria**:
- Given a client URL and location, when the keyword overview agent runs, then it pulls all ranked keywords via DataForSEO Labs Ranked Keywords API.
- Given ranked keywords, then results are filtered to top 30 SERP positions only.
- Given filtered keywords, then LLM selects ~100 most valuable keywords based on: search volume, business relevance (from client's products/services), ranking position, traffic potential.
- Given selected keywords, then each keyword shows: current SERP position, search volume (monthly), estimated traffic, CPC, keyword difficulty.
- Given selected keywords, then LLM classifies each by: type (short-tail / long-tail / generic / branded) and intent (commercial / informational / navigational / transactional).
- Given the keyword data, then Featured Snippet opportunities are flagged (keywords where snippets exist in SERP).
- Given the keyword data, then People Also Ask (PAA) questions are extracted from SERP data.
- Given all data, then a summary table and visual distribution chart data is generated.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: DataForSEO Labs API, SERP API, Keyword Data API, LLM

**DataForSEO APIs**:
- `POST /v3/dataforseo_labs/google/ranked_keywords/live` — current rankings
- `POST /v3/keywords_data/google_ads/search_volume/live` — search volumes + CPC
- `POST /v3/serp/google/organic/live/regular` — SERP features (snippets, PAA)

---

#### F-S04: Competitor Analysis — Overview Level (Sales)

**Description**: Location-specific competitor landscape showing who ranks for the client's keywords, backlink profile comparisons, organic traffic estimates, and content gaps at a high level.

**User Stories**:
- As a **Sales person**, I want to show a prospect how they compare to their top 3-5 competitors in terms of rankings, backlinks, and traffic, so that I can create urgency.
- As a **Strategist**, I want to see link gaps and content gaps at a glance so that I can estimate the effort needed.

**Acceptance Criteria**:
- Given a client URL and location, when the competitor overview agent runs, then it identifies top 5 competitors via DataForSEO Labs Competitors Domain API (or user-provided URLs).
- Given competitors, then for each: Domain Authority/Rating, total backlinks, referring domains, organic keywords count, estimated organic traffic, traffic cost estimation.
- Given client + competitors, then a comparison table is generated.
- Given backlink data, then link gap analysis shows: domains linking to competitors but NOT to client (top 20).
- Given keyword data, then content gap shows: keywords competitors rank for in top 30 that client doesn't (top 20).
- Given SERP data, then Share of Voice is calculated: % of target keywords where client ranks in top 10 vs competitors.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: DataForSEO Labs API, Backlinks API, SERP API

**DataForSEO APIs**:
- `POST /v3/dataforseo_labs/google/competitors_domain/live` — find competitors
- `POST /v3/backlinks/summary/live` — backlink profiles
- `POST /v3/backlinks/domain_intersection/live` — link gap
- `POST /v3/dataforseo_labs/google/domain_intersection/live` — content gap

---

#### F-S05: Performance Marketing Intelligence (PPC Data)

**Description**: PPC/advertising data for the client's keyword landscape — CPC, ad competition, trends, competitor ad activity, and estimated ad spend.

**User Stories**:
- As a **Sales person**, I want to show a prospect what their competitors are spending on ads for the same keywords, so that I can position SEO as a cost-effective alternative.
- As a **Strategist**, I want to see CPC trends and ad competition to identify high-value keywords where organic ranking would save significant ad spend.

**Acceptance Criteria**:
- Given target keywords and location, when PPC agent runs, then for each keyword: CPC (Google Ads), CPC (Bing Ads), competition level (low/medium/high), monthly search volume trends (12-month history), ad traffic estimates (impressions, clicks, cost).
- Given target keywords, then SERP paid results show: which competitors are advertising, their ad copy/descriptions, ad positions.
- Given keyword data, then Google Ads Ad Traffic Estimation shows: estimated cost to run ads for these keywords.
- Given all PPC data, then a summary shows: total estimated monthly ad spend for the keyword set, top advertisers, highest CPC keywords.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: DataForSEO Keyword Data API, SERP API

**DataForSEO APIs**:
- `POST /v3/keywords_data/google_ads/search_volume/live` — CPC + competition
- `POST /v3/keywords_data/google_ads/ad_traffic_by_keywords/live` — ad traffic estimates
- `POST /v3/keywords_data/bing/search_volume/live` — Bing CPC
- `POST /v3/serp/google/organic/live/regular` — paid results in SERP
- `POST /v3/keywords_data/google_trends/explore/live` — trend data

**Note**: Meta Ads data requires separate Meta Ad Library API integration (Phase 2).

---

#### F-S06: AI Visibility Check

**Description**: Check how the client's brand, URL, and keywords appear in AI/LLM responses (ChatGPT, Claude, Gemini, Perplexity). This is a cutting-edge differentiator — most agencies don't track this.

**User Stories**:
- As a **Sales person**, I want to show a prospect whether their brand is being mentioned by AI assistants, so that I can pitch AI optimization as a new service.
- As a **Strategist**, I want to see which competitors are winning in AI search so that I can plan an AI optimization strategy.

**Acceptance Criteria**:
- Given a client brand/URL and target keywords, when the AI visibility agent runs, then it checks LLM Mentions API for: brand mention count across ChatGPT, Claude, Gemini, Perplexity; AI search volume for target keywords; impressions count; top domains mentioned for client's keywords; top pages cited by LLMs.
- Given AI visibility data, then LLM generates: an AI visibility score (0-100), comparison with competitors, and recommendations for improving AI presence.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: DataForSEO AI Optimization API

**DataForSEO APIs**:
- `POST /v3/ai_optimization/llm_mentions/search/live` — brand/URL mentions
- `POST /v3/ai_optimization/llm_mentions/aggregated_metrics/live` — consolidated metrics
- `POST /v3/ai_optimization/llm_mentions/top_domains/live` — competitor domains in AI
- `POST /v3/ai_optimization/ai_keyword_data/live` — AI search volumes

---

#### F-S07: Google My Business Analysis

**Description**: Location-critical GMB analysis — business listing data, reviews, ratings, competitor GMB comparison, local pack presence.

**User Stories**:
- As a **Sales person**, I want to show a prospect their GMB health vs competitors so that I can pitch local SEO services.
- As a **Strategist**, I want to see review sentiment and local pack rankings to plan local SEO strategy.

**Acceptance Criteria**:
- Given a client business name and location, when GMB agent runs, then it pulls: business listing data (NAP — Name, Address, Phone), Google Reviews (rating, count, recent reviews), review sentiment analysis, business categories, working hours, photos count, competitor GMB comparison (same location + category).
- Given local SERP data, then local pack presence is checked: does client appear in Google Local 3-pack for target keywords?
- Given all GMB data, then a local SEO health score is generated.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: DataForSEO Business Data API

**DataForSEO APIs**:
- `POST /v3/business_data/business_listings/search/live` — business listings
- `POST /v3/business_data/google/reviews/task_post` — Google reviews
- `POST /v3/serp/google/local_pack/live/regular` — local pack results

---

#### F-S08: Pitch Deck Generation

**Description**: Automated generation of a client-ready pitch deck (PPT + PDF) compiling all Sales Phase findings into a professional presentation.

**User Stories**:
- As a **Sales person**, I want to generate a complete pitch deck in under 5 minutes from audit data, so that I can respond to prospects quickly.
- As a **Strategist**, I want the pitch deck to include data-driven opportunity sizing so that pricing is justified.

**Acceptance Criteria**:
- Given all Sales Phase data (audit, keywords, competitors, PPC, AI visibility, GMB), when pitch deck agent is triggered, then it generates a presentation with sections: Executive Summary (health score, key findings), Technical Audit Highlights (top 10 critical issues), Keyword Landscape (current rankings, opportunities), Competitor Benchmarking (visual comparisons), PPC Intelligence (ad spend opportunity), AI Visibility Status, GMB/Local SEO Status, Opportunity Sizing (projected traffic/revenue gain), Proposed Strategy + Pricing.
- Given the presentation, then output is available in PPT (python-pptx) and PDF (reportlab) formats.
- Given the presentation, then it uses configurable branding (logo, colors, fonts) for white-label.
- Given the presentation, then a Sales person can review and edit before sending.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: All Sales Phase features, LLM, python-pptx, reportlab

---

#### F-S09: Proposal Generation

**Description**: Automated generation of a scope-of-work proposal based on audit findings, including recommended plan, timeline, and pricing.

**User Stories**:
- As a **Sales person**, I want to generate a proposal document that outlines the recommended SEO strategy, timeline, and pricing based on the audit findings.

**Acceptance Criteria**:
- Given Sales Phase data, when proposal agent is triggered, then it generates: scope of work (based on gap analysis), recommended plan tier, timeline estimation, pricing (based on configurable rate cards in settings).
- Given the proposal, then it's available in PDF format with branding.
- Given the proposal, then a Sales person reviews and approves before sending.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: F-S08 (Pitch Deck), Configurator (rate cards)

---

### 3.2 STRATEGY PHASE FEATURES

---

#### F-ST01: Extensive Keyword Research

**Description**: Deep-dive keyword research expanding from the ~100 overview keywords to the full keyword universe. Includes clustering, topical authority mapping, cannibalization detection, and content decay detection.

**User Stories**:
- As a **Strategist**, I want to see the complete keyword universe for a client, clustered by topic, intent, and funnel stage, so that I can build a comprehensive content strategy.
- As an **Executive**, I want keyword clusters with priority scores so that I know what to work on first.

**Acceptance Criteria**:
- Given a project, when extensive keyword research agent runs, then it expands keywords using: DataForSEO keyword suggestions, related keywords, question keywords, long-tail variations.
- Given expanded keywords, then each has: search volume, difficulty, CPC, monthly trend data (12 months), location-specific volumes.
- Given all keywords, then LLM clusters by: topic clusters (pillar + supporting), intent (commercial, informational, navigational, transactional), funnel stage (awareness, consideration, decision).
- Given clusters, then priority scoring is calculated: volume x (1/difficulty) x business relevance.
- Given client's existing content, then topical authority mapping shows: which topic clusters are covered, which are missing, which need more depth.
- Given historical ranking data, then cannibalization detection flags: multiple client pages targeting the same keyword.
- Given historical ranking data, then content decay detection flags: pages that were ranking but are losing positions.
- Given all analysis, then strategist can approve/modify keyword targets before execution.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: DataForSEO Labs API, Keyword Data API, LLM

**DataForSEO APIs**:
- `POST /v3/dataforseo_labs/google/keyword_suggestions/live`
- `POST /v3/dataforseo_labs/google/related_keywords/live`
- `POST /v3/dataforseo_labs/google/keyword_ideas/live`
- `POST /v3/keywords_data/google_ads/search_volume/live`
- `POST /v3/keywords_data/google_trends/explore/live`

---

#### F-ST02: Extensive Competitor Analysis

**Description**: Deep competitor analysis including full backlink profiles, content strategy reverse-engineering, technical comparison, sponsored results analysis, and link building strategy reverse-engineering.

**User Stories**:
- As a **Strategist**, I want to understand exactly how competitors are building links, what content they're publishing, and what ads they're running, so that I can build a superior strategy.

**Acceptance Criteria**:
- Given competitors, when extensive analysis runs, then for each competitor: full backlink profile (not just summary), content strategy analysis (topics covered, formats, publishing frequency, top pages by traffic), technical SEO comparison, sponsored results (keywords bid on, ad copy, estimated spend), link building reverse-engineering (link sources by type, link velocity, anchor text distribution).
- Given SERP data, then SERP feature ownership is mapped: who owns featured snippets, PAA, knowledge panels for target keywords.
- Given all data, then opportunities to steal SERP features are identified.
- Given all data, then strategist reviews competitive landscape before proceeding.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: DataForSEO SERP API, Backlinks API, Labs API

**DataForSEO APIs**:
- `POST /v3/backlinks/backlinks/live` — full backlink data
- `POST /v3/backlinks/anchors/live` — anchor text distribution
- `POST /v3/backlinks/referring_domains/live` — referring domains detail
- `POST /v3/dataforseo_labs/google/domain_intersection/live` — content overlap
- `POST /v3/serp/google/organic/live/advanced` — SERP features

---

#### F-ST03: Website Structure & Architecture Analysis

**Description**: Gap analysis between client's website structure and competitors. Includes sitemap analysis, missing pages identification, ideal sitemap suggestion, and structural recommendations.

**User Stories**:
- As a **Strategist**, I want to see what pages competitors have that my client doesn't, so that I can recommend new pages to create.
- As an **Executive**, I want an ideal sitemap with URL structure recommendations so that I can implement structural changes.

**Acceptance Criteria**:
- Given client URL, when structure agent runs, then it: crawls existing sitemap (DataForSEO OnPage API), maps current page hierarchy, identifies orphan pages (no internal links), identifies thin content pages (low word count).
- Given competitor URLs, then it: crawls competitor sitemaps, maps their page hierarchies, identifies structural patterns that work.
- Given client vs competitor structures, then GAP ANALYSIS shows: missing page types (competitor has, client doesn't), missing topic coverage, missing service/product pages, missing location pages (if local SEO), missing resource pages (guides, tools, calculators).
- Given gap analysis, then LLM generates IDEAL SITEMAP: recommended new pages to create, pages to merge/consolidate, pages to remove/redirect, ideal URL structure, navigation hierarchy, internal linking architecture, hub-and-spoke content model.
- Given SERP data, then sponsored results are noted: which page types competitors are also advertising.
- Given sitemap, then schema markup strategy is recommended: schema types per page type (Article, FAQ, HowTo, Product, LocalBusiness, etc.), JSON-LD templates.
- Given all recommendations, then strategist approves before execution.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: DataForSEO OnPage API, Labs API, LLM

---

#### F-ST04: Page Structure & Content Flow

**Description**: For each page suggested in F-ST03, generate a detailed content brief with SEO-optimized structure, heading hierarchy, content sections, and competitor-informed recommendations.

**User Stories**:
- As a **Strategist**, I want detailed content briefs for every new page so that content creation agents produce exactly what's needed.
- As an **Executive**, I want content briefs that include competitor analysis so that our content is more comprehensive than what currently ranks.

**Acceptance Criteria**:
- Given each suggested page from F-ST03, when content brief agent runs, then it generates: target keyword(s) (primary + secondary), search intent alignment, recommended title tag + meta description, H1/H2/H3 heading structure, content sections with descriptions, word count target (based on top 5 ranking pages average), internal links to include (to/from other pages), external reference links, image/media suggestions, CTA placement recommendations, FAQ section (from PAA data), schema markup to implement.
- Given target keywords, then competitor content analysis shows: what top 5 ranking pages cover, average word count, common headings/sections, content gaps (what they miss).
- Given content brief, then SEO scoring criteria are defined: keyword density targets, readability score target, NLP entity coverage, E-E-A-T signals to include.
- Given all briefs, then a content calendar is generated: publishing schedule based on priority, seasonal timing, content type mix.
- Given all briefs, then strategist approves before content creation begins.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: F-ST03 (Website Structure), DataForSEO SERP API, LLM

---

#### F-ST05: Link Building Strategy

**Description**: Based on competitor link analysis, define target link types, quantities, priority domains, and outreach approach.

**User Stories**:
- As a **Strategist**, I want a link building plan that specifies how many links of each type to build per month, based on what's working for competitors.

**Acceptance Criteria**:
- Given competitor link analysis from F-ST02, then link building strategy includes: target link types + quantities per month, priority domains to target (from link gap), outreach templates per link type, link velocity targets (safe pace).
- Given strategy, then strategist approves before execution.

**Priority**: P0 (Must-have)
**Complexity**: Medium
**Dependencies**: F-ST02 (Competitor Analysis)

---

#### F-ST06: AI Optimization Strategy

**Description**: Strategy for improving client's visibility in AI/LLM responses based on current AI visibility data.

**User Stories**:
- As a **Strategist**, I want to know how to make my client's content more likely to be cited by ChatGPT, Claude, and Gemini.

**Acceptance Criteria**:
- Given AI visibility data from F-S06, then strategy includes: current AI visibility baseline, competitor AI visibility comparison, keywords where AI mentions are growing, content formatting recommendations for LLM citation, authority signals that LLMs value, FAQ/structured content recommendations.
- Given strategy, then strategist approves.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: F-S06 (AI Visibility Check), DataForSEO AI Optimization API

---

#### F-ST07: GMB / Local SEO Strategy

**Description**: Local SEO strategy including GMB optimization, review generation, local citation building, and GMB content calendar.

**User Stories**:
- As a **Strategist**, I want a complete local SEO plan including GMB optimization and review strategy.

**Acceptance Criteria**:
- Given GMB data from F-S07, then strategy includes: GMB profile completeness checklist, category optimization, review generation strategy, GMB post content calendar, photo/video optimization, local citation building plan.
- Given strategy, then strategist approves.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: F-S07 (GMB Analysis)

---

### 3.3 EXECUTION PHASE FEATURES

---

#### F-E01: Content Creation Agent

**Description**: AI agent that creates SEO-optimized content based on approved content briefs from Strategy Phase. Uses LLM via LiteLLM (any provider).

**User Stories**:
- As an **Executive**, I want the content agent to produce articles that exactly follow the approved content brief — correct headings, keywords, word count, and internal links.

**Acceptance Criteria**:
- Given an approved content brief, when content creation agent runs, then it produces content that: follows the page structure/content flow exactly, adheres to keyword targets and heading structure, includes specified internal links and CTAs, matches the specified tone/style, generates meta title + description, includes schema markup, meets word count target.
- Given content is created, then it is automatically passed to the AI Reviewer Agent (F-E02).
- Given content creation, then the agent logs: LLM provider used, model, tokens consumed, generation time.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: F-ST04 (Content Briefs), LiteLLM integration

---

#### F-E02: AI Reviewer Agent

**Description**: Configurable AI quality review system that scores content against defined criteria. Content must achieve 100% quality score before proceeding to submission. Autonomous feedback loop with Content Creation Agent.

**User Stories**:
- As a **Strategist**, I want to configure review criteria specific to my agency's quality standards so that all content meets our bar without manual review.
- As an **Executive**, I want the AI reviewer to automatically send substandard content back for rewriting so that I don't have to review hundreds of pieces manually.

**Acceptance Criteria**:
- Given content from F-E01, when AI Reviewer runs, then it scores against configurable criteria.
- **Universal Default Criteria** (ships with system): keyword density (primary 1-2%, secondary 0.5-1%), readability score (Flesch-Kincaid target), heading structure compliance (H1→H2→H3), meta title length (50-60 chars), meta description length (150-160 chars), internal link count (min per 1000 words), image alt text presence, schema markup presence, E-E-A-T signals, plagiarism/originality, grammar + spelling, content brief adherence, CTA presence.
- **Custom Criteria** (user configures): add/remove/modify any criteria, set weight per criteria, set threshold per criteria, brand voice guidelines, forbidden words/phrases, required disclaimers, industry-specific requirements.
- Given scoring, then each criteria is scored 0-100, weighted aggregate = final quality score.
- Given score < 100%, then: AI Reviewer generates specific feedback per failed criteria, sends back to Content Creation Agent, Content Agent rewrites addressing ONLY failed criteria, re-submits to AI Reviewer, loop continues until 100% (max iterations configurable, default: 5).
- Given score = 100%, then content auto-passes to Submission Agent.
- Given max iterations reached without 100%, then content is flagged for human review with all iteration history visible.
- Given all scoring, then quality score breakdown is visible in dashboard per content piece.

**Priority**: P0 (Must-have)
**Complexity**: Very High
**Dependencies**: F-E01 (Content Creation), Configurator system

---

#### F-E03: Backlink Prospecting Agent

**Description**: Automated discovery of backlink submission opportunities using DataForSEO data and web scraping.

**User Stories**:
- As an **Executive**, I want the agent to find relevant, high-DA submission opportunities categorized by type so that I can focus on strategy instead of manual prospecting.

**Acceptance Criteria**:
- Given a project and approved link building strategy, when prospecting agent runs, then it: finds opportunities via DataForSEO Backlinks API (link gap domains, competitor referring domains), categorizes by type (directory, profile, guest post, forum, comment, resource page), scores by DA, relevance, spam score, submission difficulty.
- Given web scraping logic (to be defined), then it identifies submission pages/forms on discovered opportunities.
- Given opportunities, then they are added to the approved opportunities list for submission.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: DataForSEO Backlinks API, Web scraping (TBD)

---

#### F-E04: Backlink Submission Agent

**Description**: Autonomous backlink submission agent that submits 100%-quality-scored content to approved opportunities. Operates within configurable time limits and pacing.

**User Stories**:
- As a **Strategist**, I want submissions to happen automatically once content passes quality review, with configurable pacing to avoid spam flags.
- As an **Executive**, I want to set submission frequency and time windows so that link building looks natural.

**Acceptance Criteria**:
- Given 100%-scored content + approved opportunities, then submission is autonomous (no human review needed — quality gate already passed).
- Given configurator settings, then submission respects: max submissions per hour, max per day, max per week, time windows (e.g., 9am-6pm), randomized delays between submissions (anti-detection).
- Given each submission, then tracking records: status (queued → submitting → submitted → pending_approval → approved → rejected), screenshot proof, timestamp, follow-up schedule.
- Given submission errors, then retry logic with configurable max retries.
- Given link velocity, then alert if building too fast (Google penalty risk).

**Priority**: P0 (Must-have)
**Complexity**: Very High
**Dependencies**: F-E02 (AI Reviewer), F-E03 (Prospecting), Web scraping, Configurator

---

#### F-E05: On-Page Optimization Agent

**Description**: Implements technical SEO fixes from audit, generates optimized meta tags, schema markup, and internal linking suggestions.

**User Stories**:
- As an **Executive**, I want the agent to generate all technical SEO fixes (meta tags, schema, internal links) so that I can implement them quickly.

**Acceptance Criteria**:
- Given audit findings from F-S02, then agent generates: optimized meta tags for all pages, JSON-LD schema markup per page type, internal linking suggestions between new + existing content, image alt text suggestions.
- Given fixes, then implementation status is tracked per item.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: F-S02 (Site Audit)

---

#### F-E06: GMB Content Agent

**Description**: Creates and submits Google My Business posts based on the GMB content calendar from Strategy Phase.

**User Stories**:
- As a **Strategist**, I want GMB posts created and submitted on schedule with configurable frequency.

**Acceptance Criteria**:
- Given GMB content calendar from F-ST07, then agent creates posts: types (Update, Offer, Event, Product), includes images, CTAs, links, follows brand voice guidelines.
- Given posts, then human review by default (low volume — daily 1 or user-configured frequency).
- Given approved posts, then submission via Google Business Profile API.
- Given configurator, then user sets: posts per day/week, post types rotation, auto-generate or manual trigger.
- **Review Response Agent** (suggested): drafts responses to Google Reviews (positive: thank + reinforce, negative: empathize + resolve), human approves before posting.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: Google Business Profile API, Configurator

---

#### F-E07: AI Optimization Execution

**Description**: Implement AI-friendly content formatting and structured data to improve visibility in LLM responses.

**User Stories**:
- As a **Strategist**, I want content optimized for AI search so that our clients appear in ChatGPT and Gemini responses.

**Acceptance Criteria**:
- Given AI optimization strategy from F-ST06, then agent: formats content for LLM citation (clear structure, authoritative tone), adds structured data that LLMs prefer, creates FAQ content targeting AI search queries, monitors AI mentions after changes.

**Priority**: P2 (Nice-to-have for MVP)
**Complexity**: Medium
**Dependencies**: F-ST06 (AI Strategy)

---

### 3.4 REPORTING PHASE FEATURES

---

#### F-R01: Rank Tracking (Extensive Configurator)

**Description**: Scheduled rank tracking with comprehensive configurator allowing users to define all parameters.

**User Stories**:
- As a **Strategist**, I want to configure rank tracking frequency, keyword count, SERP depth, devices, and locations per project.
- As a **Client**, I want to see my keyword rankings over time in a simple dashboard.

**Acceptance Criteria**:
- Given configurator, then user defines: frequency (daily / every 3 days / weekly / bi-weekly / monthly), number of keywords to track (50 / 100 / 500 / 1000 / custom), SERP depth per keyword (top 10 / 30 / 50 / 100), search engines (Google / Bing / Yahoo / YouTube — multi-select), devices (Desktop / Mobile / Both), locations (multiple per project), languages (per location), SERP features to track (Featured Snippets, PAA, Local Pack, Knowledge Panel, Image Pack, Video, Shopping, AI Overview).
- Given configuration, then DataForSEO SERP API runs on schedule.
- Given rank data, then competitor rank tracking runs for same keywords (configurable).
- Given rank changes, then alerts fire: entered top 10/3/1, dropped out of top 10/30, significant movement (±5 positions).
- Given alerts, then configurable channels: email, in-app, Slack webhook.
- Given historical data, then SERP volatility detection flags potential algorithm updates.
- Given all data, then historical trends are stored and visualized.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: DataForSEO SERP API, Configurator, Scheduler (Celery Beat)

---

#### F-R02: Traffic Analytics (Location + City Level)

**Description**: Traffic analytics combining Google Search Console real data with DataForSEO estimates, broken down by location and city.

**User Stories**:
- As a **Strategist**, I want to see actual click and impression data from GSC alongside estimated traffic from DataForSEO, broken down by location.
- As a **Client**, I want to see how much traffic my website gets from organic search.

**Acceptance Criteria**:
- Given Google Search Console API integration, then data includes: clicks, impressions, CTR, average position — by query, page, country, device, date, search appearance (rich results, AMP), index coverage status.
- Given DataForSEO Labs, then estimated traffic by location, traffic value, traffic by keyword.
- Given location data, then breakdown by: country → state → city (where available).
- Given optional GA4 integration, then: actual user behavior, conversion tracking, landing page performance, user flow.

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: Google Search Console API, DataForSEO Labs, optional GA4

---

#### F-R03: Link Acquisition Reports

**Description**: Track and report on backlink building progress — submissions, approvals, link quality, and link health.

**User Stories**:
- As a **Strategist**, I want to see how many links were built, their quality, and whether they're still live.

**Acceptance Criteria**:
- Given internal tracking data, then reports show: submissions made / approved / rejected / pending, DA/DR of acquired links, link types distribution, link velocity graph, quality score distribution of submitted content.
- Given DataForSEO Backlinks API, then live link verification: are approved links still live? Are they indexed? Link attribute (dofollow/nofollow/ugc/sponsored).

**Priority**: P0 (Must-have)
**Complexity**: Medium
**Dependencies**: Internal tracking, DataForSEO Backlinks API

---

#### F-R04: AI Visibility Reports

**Description**: Track brand/URL visibility in AI/LLM responses over time.

**User Stories**:
- As a **Strategist**, I want to see how our AI visibility is trending compared to competitors.

**Acceptance Criteria**:
- Given DataForSEO AI Optimization API, then reports show: brand mention trends over time (ChatGPT, Claude, Gemini, Perplexity), AI search volume trends, competitor AI visibility comparison, top pages cited by LLMs, AI visibility score trend.
- Given trends, then LLM generates recommendations for improving AI visibility.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: DataForSEO AI Optimization API

---

#### F-R05: GMB / Local SEO Reports

**Description**: Track GMB performance, review trends, and local pack rankings.

**User Stories**:
- As a **Strategist**, I want to see review trends, local pack rankings, and GMB post performance.

**Acceptance Criteria**:
- Given DataForSEO Business Data API, then reports show: review count + rating trend, review sentiment analysis, local pack ranking trend, competitor GMB comparison.
- Given Google Business Profile API, then GMB post performance data.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: DataForSEO Business Data API, Google Business Profile API

---

#### F-R06: Automated Client Reports

**Description**: Automated generation of comprehensive client reports in PDF/PPT/HTML with configurable frequency and sections.

**User Stories**:
- As a **Strategist**, I want monthly client reports generated automatically with all key metrics, wins, and recommendations.
- As a **Client**, I want to receive a clear, jargon-free report showing my SEO progress.

**Acceptance Criteria**:
- Given all reporting data, then LLM compiles into executive report.
- Given configurator, then: frequency (weekly / bi-weekly / monthly), format (PDF / PPT / HTML for client portal), sections to include/exclude, branding (logo, colors for white-label), auto-send to client email.
- Given report, then sections include: Executive Summary, Rank Tracking Summary, Traffic Performance, Link Building Progress, Content Production, AI Visibility Update, GMB/Local SEO Update, Technical Health Status, Competitor Movement Summary, Next Month Plan + Recommendations.
- Given report, then ROI dashboard shows: investment vs organic traffic growth, keyword value gained (traffic x CPC), lead/revenue attribution (if GA4 connected).

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: All reporting features, LLM, python-pptx, reportlab

---

#### F-R07: Share of Voice Tracking

**Description**: Track what percentage of target SERP real estate the client owns vs competitors.

**User Stories**:
- As a **Strategist**, I want to see our Share of Voice trending upward over time as proof of SEO success.

**Acceptance Criteria**:
- Given DataForSEO SERP API data, then: % of target keywords where client ranks in top 10, % of SERP features owned (snippets, PAA, local pack), client vs competitor share over time.

**Priority**: P1 (Should-have)
**Complexity**: Medium
**Dependencies**: F-R01 (Rank Tracking)

---

### 3.5 CROSS-CUTTING FEATURES

---

#### F-C01: Configurator System

**Description**: Centralized configuration system allowing users to customize all agent behaviors, tracking parameters, and workflow settings.

**User Stories**:
- As a **Strategist**, I want to configure every aspect of how agents work — from content quality criteria to submission pacing to report frequency — without touching code.

**Acceptance Criteria**:
- Given settings page, then user can configure: project-level settings (locations, competitors, budget caps), agent-level settings (per agent type — see Configurator Architecture in brainstorm), tracking settings (rank tracking, AI visibility, link monitoring), reporting settings (frequency, format, sections, branding), notification settings (channels, alert types, thresholds).
- Given configuration changes, then they take effect immediately for future agent runs.
- Given configuration, then defaults are sensible (universal defaults ship with system).

**Priority**: P0 (Must-have)
**Complexity**: High
**Dependencies**: All agent features

---

#### F-C02: Approval Workflow System

**Description**: Queue-based approval system where agent outputs requiring human review are queued for the appropriate role.

**User Stories**:
- As a **Strategist**, I want a single queue showing all items awaiting my approval — strategy documents, content flagged by AI reviewer, pitch decks.

**Acceptance Criteria**:
- Given agent outputs, then items requiring approval are queued with: item type, agent that produced it, quality score (if applicable), priority, timestamp.
- Given queue, then appropriate role sees their items (strategist sees strategy approvals, sales sees pitch decks).
- Given an item, then user can: approve, reject with feedback, request revision.
- Given approval, then the next agent in the pipeline is triggered automatically.

**Priority**: P0 (Must-have)
**Complexity**: Medium
**Dependencies**: Role system, Agent pipeline

---

#### F-C03: Agent Activity Dashboard

**Description**: Real-time dashboard showing all agent activity — what's running, what's completed, what's failed, token usage, API costs.

**User Stories**:
- As a **Strategist**, I want to see what all agents are doing across all projects in real-time.

**Acceptance Criteria**:
- Given active agents, then dashboard shows: agent name, project, current task, progress %, start time, estimated completion.
- Given completed tasks, then history shows: agent, task, duration, tokens used, API cost, quality score (if applicable), status (success/failed/human-review).
- Given costs, then per-project API cost tracking with budget alerts.

**Priority**: P0 (Must-have)
**Complexity**: Medium
**Dependencies**: Agent system, DataForSEO cost tracking

---

## 4. INFORMATION ARCHITECTURE

### 4.1 Sitemap

```
/                                    — Marketing landing page
├── /login                           — Magic link login
├── /register                        — Registration
│
├── /dashboard                       — Main dashboard (project overview, agent activity)
│
├── /projects                        — All projects list
│   └── /projects/[id]               — Single project overview
│       ├── /projects/[id]/sales     — Sales phase
│       │   ├── /audit               — Site audit results
│       │   ├── /keywords            — Keyword overview (top 100)
│       │   ├── /competitors         — Competitor overview
│       │   ├── /ppc                 — PPC intelligence
│       │   ├── /ai-visibility       — AI/LLM visibility
│       │   ├── /gmb                 — GMB analysis
│       │   ├── /pitch-deck          — Pitch deck generator
│       │   └── /proposal            — Proposal generator
│       │
│       ├── /projects/[id]/strategy  — Strategy phase
│       │   ├── /keywords            — Extensive keyword research
│       │   ├── /competitors         — Extensive competitor analysis
│       │   ├── /structure           — Website structure & architecture
│       │   ├── /content-briefs      — Page structure & content flow
│       │   ├── /link-building       — Link building strategy
│       │   ├── /ai-optimization     — AI optimization strategy
│       │   └── /local-seo           — GMB / Local SEO strategy
│       │
│       ├── /projects/[id]/execution — Execution phase
│       │   ├── /content             — Content creation + AI review pipeline
│       │   ├── /backlinks           — Prospecting + submission tracking
│       │   ├── /on-page             — On-page optimization tasks
│       │   ├── /gmb-posts           — GMB post creation + submission
│       │   └── /ai-optimization     — AI optimization execution
│       │
│       ├── /projects/[id]/reports   — Reporting phase
│       │   ├── /rankings            — Rank tracking
│       │   ├── /traffic             — Traffic analytics
│       │   ├── /links               — Link acquisition reports
│       │   ├── /ai-visibility       — AI visibility reports
│       │   ├── /local-seo           — GMB / Local SEO reports
│       │   ├── /share-of-voice      — Share of Voice
│       │   └── /client-report       — Generate client report
│       │
│       └── /projects/[id]/settings  — Project settings / configurator
│
├── /approvals                       — Approval queue (cross-project)
├── /agents                          — Agent activity dashboard
│
├── /settings                        — Global settings
│   ├── /settings/profile            — User profile
│   ├── /settings/team               — Team management
│   ├── /settings/billing            — Subscription & billing
│   ├── /settings/api-keys           — BYOK API key management
│   ├── /settings/integrations       — GSC, GA4, GMB connections
│   ├── /settings/branding           — White-label branding
│   └── /settings/notifications      — Notification preferences
│
├── /client-portal/[token]           — Client read-only portal (separate layout)
│
└── /admin                           — Super admin panel (SaaS phase)
    ├── /admin/tenants               — Tenant management
    ├── /admin/users                 — User management
    ├── /admin/billing               — Billing management
    ├── /admin/analytics             — System analytics
    └── /admin/feature-flags         — Feature flags
```

### 4.2 Navigation Structure

**Primary Navigation (Sidebar)**:
- Dashboard
- Projects (with project switcher)
- Approvals (with badge count)
- Agents (activity monitor)
- Settings

**Project Sub-Navigation (Tabs within project)**:
- Sales | Strategy | Execution | Reports | Settings

**Each tab has its own sub-navigation** as defined in the sitemap above.

### 4.3 Key User Flows

#### Flow 1: New Client Onboarding (Sales → Strategy → Execution)
```
Sales person creates project
  → Enters client URL + selects location(s)
  → Triggers Sales Phase agents (audit, keywords, competitors, PPC, AI, GMB)
  → Agents run in parallel (~5-10 minutes)
  → Sales person reviews results
  → Generates pitch deck
  → Sends to prospect
  → Prospect becomes client
  → Strategist reviews Sales data
  → Triggers Strategy Phase (extensive research, structure analysis, content briefs)
  → Strategist approves strategy
  → Execution Phase begins (content creation → AI review → submission)
  → Reporting Phase runs on schedule
```

#### Flow 2: Content Creation Pipeline
```
Content brief approved (Strategy)
  → Content Creation Agent writes content
  → AI Reviewer Agent scores content
  → If < 100%: feedback → rewrite → re-score (loop, max 5x)
  → If 100%: auto-pass to Submission Agent
  → If max iterations without 100%: flag for human review
  → Human reviews → approves or provides feedback
  → Submission Agent submits to approved opportunities
  → Submission tracked (queued → submitted → approved/rejected)
```

#### Flow 3: Rank Tracking Cycle
```
Scheduler triggers rank check (per configurator frequency)
  → DataForSEO SERP API checks all tracked keywords
  → Results stored with timestamp
  → Comparison with previous check
  → Alerts generated for significant movements
  → Dashboard updated
  → Data available for client reports
```

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Performance Targets

| Metric | Target |
|--------|--------|
| Page load time (dashboard) | < 2 seconds |
| API response time (internal) | < 500ms (p95) |
| Agent task initiation | < 3 seconds |
| Site audit completion (500 pages) | < 10 minutes |
| Keyword research (overview, 100 keywords) | < 3 minutes |
| Pitch deck generation | < 5 minutes |
| Content generation (single article) | < 2 minutes |
| AI review cycle (single piece) | < 30 seconds |
| Rank tracking (100 keywords) | < 5 minutes |
| Client report generation | < 5 minutes |

### 5.2 Security Requirements

- All DataForSEO API keys encrypted at rest (AES-256)
- BYOK LLM keys encrypted at rest
- HTTPS everywhere (TLS 1.3)
- Rate limiting on all API endpoints
- OWASP Top 10 compliance
- Input validation on all user inputs (Zod/Pydantic)
- RBAC enforced at API level
- Audit logging for all mutations
- GDPR-compliant data handling
- Session management with secure cookies

### 5.3 Accessibility Standards

- WCAG 2.2 AA compliance
- Keyboard navigation for all interactive elements
- Screen reader support
- Minimum 4.5:1 contrast ratio
- Focus indicators on all interactive elements

### 5.4 Browser / Device Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Mobile Safari (iOS) | Last 2 versions |
| Chrome (Android) | Last 2 versions |

### 5.5 Uptime SLA Target

- 99.9% uptime for web application
- 99.5% uptime for agent execution (dependent on DataForSEO + LLM provider uptime)

---

## 6. OUT OF SCOPE (for Wave 1 — Internal Tool)

The following are explicitly NOT being built in Wave 1:

- Multi-tenancy / SaaS features (Wave 3)
- Stripe / Razorpay billing integration (Wave 3)
- White-label branding customization (Wave 3)
- Public API (Wave 3)
- Mobile application (Phase 4 per blueprint)
- Meta Ads integration (Wave 2)
- Google Analytics 4 integration (Wave 2)
- Client self-serve portal with login (Wave 2 — Wave 1 uses token-based read-only links)
- Internationalization / i18n (future)
- Real-time collaboration (future)
- Custom web scraping logic for submission agent (to be defined separately)

---

## 7. RISKS & ASSUMPTIONS

### 7.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| DataForSEO API rate limits or downtime | Agent execution blocked | Implement retry logic, queue system, fallback to cached data |
| DataForSEO pricing increases | Increased operational cost | Budget caps per project, cost tracking, alert system |
| LLM quality inconsistency | Content quality varies | AI Reviewer Agent with strict scoring, multi-iteration loop |
| Web scraping for submissions may break | Submission agent fails | Modular scraping adapters, human fallback queue |
| Google algorithm changes | Ranking strategies become outdated | Agent strategies are LLM-driven and can adapt; human strategist oversight |
| Google penalizes AI content | Content gets deindexed | Humanization scoring, human review for high-value content, E-E-A-T focus |

### 7.2 Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| SEO agencies resist automation | Low adoption | Position as "augmentation, not replacement" — strategists still decide |
| Well-funded competitors build similar | Market share loss | Speed to market, dogfooding advantage, agency workflow focus as moat |
| AI search reduces organic SEO value | Product relevance decreases | AI Optimization features (LLM Mentions tracking) keep product relevant |

### 7.3 Assumptions

- DataForSEO API will remain available and reasonably priced
- LLM providers (Anthropic, OpenAI, etc.) will maintain current API availability
- Google Search Console API will remain free and accessible
- Google Business Profile API will remain available for posting
- Users have basic SEO knowledge (strategist/executive level)
- Initial deployment is for internal use (our own agency) before SaaS
- PostgreSQL + Redis on Railway will handle the expected load (200 users, 2000 in 12mo)

---

## PHASE 0 GATE: SCOPE.md

```
[x] Project overview defined
[x] User personas created
[x] All features specified with user stories and acceptance criteria
[x] Features prioritized (P0/P1/P2)
[x] Information architecture (sitemap, navigation, user flows) defined
[x] Non-functional requirements specified
[x] Out of scope explicitly listed
[x] Risks and assumptions documented
[ ] USER APPROVAL — Awaiting
```

---

> **Next**: SCHEMA.md (Database design) → API.md → WIREFRAMES.md → ADR.md
