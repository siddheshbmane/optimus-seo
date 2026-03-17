# API.md — Optimus SEO

> **Version:** 1.0 | **Date:** 2026-03-13
> **Status:** Draft — Awaiting Approval
> **Author:** AI Agent (per heart.md blueprint, Section 3.3)

---

## 1. API OVERVIEW

### 1.1 Architecture

Optimus SEO uses a **hybrid architecture** with two API layers:

```
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS FRONTEND                         │
│                   (Vercel — app router)                       │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│   NEXT.JS API ROUTES     │  │   FASTAPI BACKEND            │
│   (BFF — Backend for     │  │   (Railway — Python)         │
│    Frontend)             │  │                              │
│                          │  │   • AI Agent orchestration   │
│   • Auth (Better Auth)   │  │   • DataForSEO API calls     │
│   • CRUD operations      │  │   • LLM calls (LiteLLM)     │
│   • Prisma DB queries    │  │   • Deck generation (pptx)   │
│   • Stripe/Razorpay      │  │   • Celery task queue        │
│   • File uploads         │  │   • WebSocket events         │
│   • SSR data fetching    │  │   • Report generation        │
│                          │  │                              │
│   Base: /api/v1/         │  │   Base: /api/v1/             │
│   Port: Vercel Edge      │  │   Port: Railway (8000)       │
└──────────────┬───────────┘  └──────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    POSTGRESQL (Railway)                        │
│                    REDIS (Railway)                             │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Base URLs

| Environment | Next.js API | FastAPI |
|------------|-------------|---------|
| Development | `http://localhost:3000/api/v1` | `http://localhost:8000/api/v1` |
| Staging | `https://staging.optimusseo.com/api/v1` | `https://api-staging.optimusseo.com/api/v1` |
| Production | `https://app.optimusseo.com/api/v1` | `https://api.optimusseo.com/api/v1` |

### 1.3 API Versioning

- **Strategy:** URL path versioning (`/api/v1/`, `/api/v2/`)
- **Current version:** v1
- **Deprecation policy:** v(N-1) supported for 6 months after v(N) release
- **Breaking changes:** Only in new major versions

### 1.4 Authentication

| Method | Used For | Details |
|--------|----------|---------|
| **Session Cookie** | Browser requests to Next.js API | Better Auth session, HttpOnly, Secure, SameSite=Lax |
| **Bearer Token (JWT)** | FastAPI requests | Short-lived access token (15min) + refresh token (7d) |
| **API Key** | External API access (Wave 3) | `X-API-Key` header, scoped per organization |
| **Magic Link** | Passwordless login | Email-based via Resend, 15-minute expiry |

**Auth flow:**
```
1. User requests magic link → POST /api/v1/auth/magic-link
2. Email sent via Resend with token
3. User clicks link → GET /api/v1/auth/verify?token=xxx
4. Better Auth creates session + issues JWT
5. Session cookie set for Next.js API routes
6. JWT stored in memory for FastAPI calls
7. JWT refresh via POST /api/v1/auth/refresh
```

### 1.5 Rate Limiting

| Tier | Limit | Window | Applies To |
|------|-------|--------|-----------|
| **Auth endpoints** | 10 requests | 1 minute | Per IP |
| **Standard API** | 100 requests | 1 minute | Per user |
| **Agent triggers** | 20 requests | 1 minute | Per user |
| **DataForSEO proxy** | 50 requests | 1 minute | Per organization |
| **Report generation** | 5 requests | 5 minutes | Per user |
| **File upload** | 10 requests | 1 minute | Per user |

Rate limit headers returned on every response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1710345600
```

### 1.6 Request/Response Conventions

**Content-Type:** `application/json` (unless file upload: `multipart/form-data`)

**Request headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt_token>  (for FastAPI)
Cookie: session=<session_id>       (for Next.js API — automatic)
X-Organization-Id: <org_id>       (multi-tenancy — auto-injected from session)
```

---

## 2. STANDARD RESPONSE FORMAT

### 2.1 Success Response

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: Pagination;
    timestamp: string;
    requestId: string;
  };
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

**Example:**
```json
{
  "success": true,
  "data": {
    "id": "proj_abc123",
    "name": "Client Website",
    "url": "https://example.com",
    "status": "active"
  },
  "meta": {
    "timestamp": "2026-03-13T10:30:00Z",
    "requestId": "req_xyz789"
  }
}
```

### 2.2 Error Response

```typescript
interface ApiError {
  success: false;
  error: {
    code: string;          // Machine-readable error code
    message: string;       // Human-readable message
    details?: ErrorDetail[];
    requestId: string;
  };
}

interface ErrorDetail {
  field?: string;
  message: string;
  code: string;
}
```

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "url", "message": "Must be a valid URL", "code": "INVALID_URL" },
      { "field": "name", "message": "Required", "code": "REQUIRED" }
    ],
    "requestId": "req_xyz789"
  }
}
```

### 2.3 Error Codes

| HTTP Status | Code | Description |
|------------|------|-------------|
| 400 | `VALIDATION_ERROR` | Request body/params failed validation |
| 400 | `BAD_REQUEST` | Malformed request |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 401 | `TOKEN_EXPIRED` | JWT has expired |
| 403 | `FORBIDDEN` | Authenticated but insufficient permissions |
| 403 | `ORGANIZATION_MISMATCH` | Trying to access another org's data |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Resource already exists or state conflict |
| 422 | `UNPROCESSABLE_ENTITY` | Valid JSON but semantically invalid |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server error |
| 502 | `UPSTREAM_ERROR` | DataForSEO or LLM provider error |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

### 2.4 Pagination Format

All list endpoints support cursor-based or offset pagination:

```
GET /api/v1/projects?page=1&pageSize=20&sort=createdAt&order=desc
```

**Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number (1-indexed) |
| `pageSize` | number | 20 | Items per page (max: 100) |
| `sort` | string | `createdAt` | Sort field |
| `order` | string | `desc` | Sort order: `asc` or `desc` |
| `search` | string | — | Full-text search query |
| `filter` | object | — | Field-specific filters (JSON) |

---

## 3. AUTHENTICATION ENDPOINTS (Next.js API)

### 3.1 Magic Link Request

```
POST /api/v1/auth/magic-link
```

**Request:**
```typescript
{
  email: string;  // User's email address
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Magic link sent to your email",
    "expiresIn": 900
  }
}
```

**Errors:** `VALIDATION_ERROR` (invalid email), `RATE_LIMITED` (too many attempts)

---

### 3.2 Verify Magic Link

```
GET /api/v1/auth/verify?token=<magic_link_token>
```

**Response (200):** Sets session cookie + returns user data
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@agency.com",
      "name": "Rahul Sharma",
      "role": "OWNER",
      "organizationId": "org_xyz789"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresAt": "2026-03-13T10:45:00Z"
  }
}
```

**Errors:** `UNAUTHORIZED` (invalid/expired token)

---

### 3.3 Register (First-time User)

```
POST /api/v1/auth/register
```

**Request:**
```typescript
{
  email: string;
  name: string;
  organizationName: string;  // Creates new org
}
```

**Response (201):** Creates user + organization, sends magic link
```json
{
  "success": true,
  "data": {
    "message": "Account created. Check your email for the magic link.",
    "userId": "usr_abc123",
    "organizationId": "org_xyz789"
  }
}
```

**Errors:** `CONFLICT` (email already registered), `VALIDATION_ERROR`

---

### 3.4 Refresh Token

```
POST /api/v1/auth/refresh
```

**Request:**
```typescript
{
  refreshToken: string;
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresAt": "2026-03-13T11:00:00Z"
  }
}
```

**Errors:** `UNAUTHORIZED` (invalid/expired refresh token)

---

### 3.5 Logout

```
POST /api/v1/auth/logout
```

**Response (200):** Clears session cookie + invalidates refresh token
```json
{
  "success": true,
  "data": { "message": "Logged out" }
}
```

---

### 3.6 Get Current User

```
GET /api/v1/auth/me
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "email": "user@agency.com",
    "name": "Rahul Sharma",
    "role": "OWNER",
    "avatarUrl": null,
    "organization": {
      "id": "org_xyz789",
      "name": "SEO Agency Pro",
      "plan": "PROFESSIONAL",
      "trialEndsAt": "2026-03-27T00:00:00Z"
    },
    "createdAt": "2026-03-13T10:00:00Z"
  }
}
```

---

### 3.7 Invite Team Member

```
POST /api/v1/auth/invite
```

**Required role:** `OWNER` or `ADMIN`

**Request:**
```typescript
{
  email: string;
  role: "ADMIN" | "STRATEGIST" | "EXECUTIVE" | "VIEWER";
  name?: string;
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "inviteId": "inv_abc123",
    "email": "priya@agency.com",
    "role": "STRATEGIST",
    "expiresAt": "2026-03-20T10:00:00Z"
  }
}
```

---

## 4. PROJECT ENDPOINTS (Next.js API)

### 4.1 List Projects

```
GET /api/v1/projects
```

**Query params:** `page`, `pageSize`, `sort`, `order`, `search`, `status` (filter)

**Response (200):**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    name: string;
    url: string;
    status: "CREATED" | "SALES" | "STRATEGY" | "EXECUTION" | "REPORTING" | "PAUSED" | "ARCHIVED";
    locations: Array<{ code: number; name: string; country: string }>;
    lastActivityAt: string;
    agentStatus: { running: number; completed: number; failed: number };
    createdAt: string;
  }>;
  meta: { pagination: Pagination };
}
```

---

### 4.2 Create Project

```
POST /api/v1/projects
```

**Request:**
```typescript
{
  name: string;                    // Client/project name
  url: string;                     // Target website URL
  locationCodes: number[];         // DataForSEO location codes
  competitors?: string[];          // Optional competitor URLs (max 10)
  notes?: string;                  // Optional notes
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "proj_abc123",
    "name": "Acme Corp SEO",
    "url": "https://acme.com",
    "status": "CREATED",
    "locations": [
      { "code": 2840, "name": "United States", "country": "US" }
    ],
    "competitors": ["https://competitor1.com"],
    "createdAt": "2026-03-13T10:00:00Z"
  }
}
```

---

### 4.3 Get Project

```
GET /api/v1/projects/:projectId
```

**Response (200):** Full project details including phase summaries, agent activity, and configuration.

---

### 4.4 Update Project

```
PATCH /api/v1/projects/:projectId
```

**Request:** Partial update — any subset of project fields.

---

### 4.5 Delete Project (Soft Delete)

```
DELETE /api/v1/projects/:projectId
```

**Response (200):** Sets `status: "ARCHIVED"`, retains data for 30 days.

---

### 4.6 Location Search (DataForSEO Locations)

```
GET /api/v1/locations?q=<search_term>
```

**Response (200):**
```typescript
{
  success: true;
  data: Array<{
    code: number;           // DataForSEO location_code
    name: string;           // "New York, New York, United States"
    type: "COUNTRY" | "STATE" | "CITY" | "DMA";
    country: string;        // Country name
    countryCode: string;    // ISO 3166-1 alpha-2
  }>;
}
```

**Note:** Locations are cached locally (refreshed weekly). Search is performed against the local cache for instant results.

---

## 5. SALES PHASE ENDPOINTS (FastAPI)

All Sales Phase endpoints trigger AI agents via Celery tasks. They return immediately with a task ID, and results are delivered via WebSocket or polling.

### 5.1 Trigger Site Audit

```
POST /api/v1/projects/:projectId/sales/audit
```

**Request:**
```typescript
{
  maxPages?: number;        // Max pages to crawl (default: 500)
  includeLighthouse?: boolean;  // Run Lighthouse (default: true)
  includeBacklinks?: boolean;   // Check backlink profile (default: true)
}
```

**Response (202 — Accepted):**
```json
{
  "success": true,
  "data": {
    "taskId": "task_audit_abc123",
    "status": "QUEUED",
    "estimatedDuration": 600,
    "message": "Site audit queued. Results will be available via WebSocket or polling."
  }
}
```

---

### 5.2 Get Audit Results

```
GET /api/v1/projects/:projectId/sales/audit
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    status: "RUNNING" | "COMPLETED" | "FAILED";
    healthScore: number;          // 0-100
    summary: {
      pagesScanned: number;
      criticalIssues: number;
      warnings: number;
      passed: number;
    };
    lighthouse: {
      performance: number;
      accessibility: number;
      seo: number;
      bestPractices: number;
      coreWebVitals: {
        lcp: number;
        fid: number;
        cls: number;
      };
    };
    issues: Array<{
      severity: "CRITICAL" | "WARNING" | "INFO";
      category: string;
      title: string;
      description: string;
      affectedPages: number;
      fixPriority: number;
    }>;
    backlinks: {
      totalBacklinks: number;
      referringDomains: number;
      domainAuthority: number;
      spamScore: number;
      toxicLinks: number;
    };
    narrative: string;            // LLM-generated summary
    completedAt: string;
    apiCost: number;              // DataForSEO cost in USD
  };
}
```

---

### 5.3 Trigger Keyword Research (Overview)

```
POST /api/v1/projects/:projectId/sales/keywords
```

**Request:**
```typescript
{
  maxKeywords?: number;     // Target keyword count (default: 100)
  serpDepth?: number;       // Max SERP position (default: 30)
}
```

**Response (202):** Returns `taskId` (same pattern as audit).

---

### 5.4 Get Keyword Research Results (Overview)

```
GET /api/v1/projects/:projectId/sales/keywords
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    status: "RUNNING" | "COMPLETED" | "FAILED";
    totalKeywords: number;
    keywords: Array<{
      keyword: string;
      position: number;
      searchVolume: number;
      estimatedTraffic: number;
      cpc: number;
      difficulty: number;
      type: "SHORT_TAIL" | "LONG_TAIL" | "GENERIC" | "BRANDED";
      intent: "COMMERCIAL" | "INFORMATIONAL" | "NAVIGATIONAL" | "TRANSACTIONAL";
      serpFeatures: string[];     // ["featured_snippet", "paa", "local_pack"]
      paaQuestions?: string[];
    }>;
    distribution: {
      byType: Record<string, number>;
      byIntent: Record<string, number>;
      byPosition: Record<string, number>;  // "1-3", "4-10", "11-20", "21-30"
    };
    summary: string;              // LLM-generated narrative
    completedAt: string;
    apiCost: number;
  };
}
```

---

### 5.5 Trigger Competitor Analysis (Overview)

```
POST /api/v1/projects/:projectId/sales/competitors
```

**Request:**
```typescript
{
  competitorUrls?: string[];   // Override auto-detected competitors
  maxCompetitors?: number;     // Default: 5
}
```

**Response (202):** Returns `taskId`.

---

### 5.6 Get Competitor Analysis Results

```
GET /api/v1/projects/:projectId/sales/competitors
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    status: "RUNNING" | "COMPLETED" | "FAILED";
    client: DomainMetrics;
    competitors: Array<DomainMetrics & { url: string; name: string }>;
    linkGap: Array<{ domain: string; da: number; linksToCompetitors: number }>;
    contentGap: Array<{ keyword: string; volume: number; competitorPositions: Record<string, number> }>;
    shareOfVoice: Record<string, number>;  // domain → percentage
    summary: string;
    completedAt: string;
    apiCost: number;
  };
}

interface DomainMetrics {
  domainAuthority: number;
  totalBacklinks: number;
  referringDomains: number;
  organicKeywords: number;
  estimatedTraffic: number;
  trafficCost: number;
}
```

---

### 5.7 Trigger PPC Intelligence

```
POST /api/v1/projects/:projectId/sales/ppc
```

**Response (202):** Returns `taskId`.

---

### 5.8 Get PPC Intelligence Results

```
GET /api/v1/projects/:projectId/sales/ppc
```

---

### 5.9 Trigger AI Visibility Check

```
POST /api/v1/projects/:projectId/sales/ai-visibility
```

**Request:**
```typescript
{
  brandName: string;
  targetKeywords?: string[];   // Override — uses project keywords if empty
}
```

**Response (202):** Returns `taskId`.

---

### 5.10 Get AI Visibility Results

```
GET /api/v1/projects/:projectId/sales/ai-visibility
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    status: "RUNNING" | "COMPLETED" | "FAILED";
    aiVisibilityScore: number;    // 0-100
    mentions: {
      chatgpt: number;
      claude: number;
      gemini: number;
      perplexity: number;
      total: number;
    };
    aiSearchVolume: Array<{
      keyword: string;
      aiVolume: number;
      impressions: number;
    }>;
    topDomainsMentioned: Array<{ domain: string; mentions: number }>;
    topPagesCited: Array<{ url: string; mentions: number }>;
    competitorComparison: Array<{
      domain: string;
      aiVisibilityScore: number;
      totalMentions: number;
    }>;
    recommendations: string[];
    summary: string;
    completedAt: string;
    apiCost: number;
  };
}
```

---

### 5.11 Trigger GMB Analysis

```
POST /api/v1/projects/:projectId/sales/gmb
```

**Request:**
```typescript
{
  businessName: string;
  category?: string;
}
```

**Response (202):** Returns `taskId`.

---

### 5.12 Get GMB Analysis Results

```
GET /api/v1/projects/:projectId/sales/gmb
```

---

### 5.13 Trigger All Sales Phase Agents

```
POST /api/v1/projects/:projectId/sales/run-all
```

Triggers audit, keywords, competitors, PPC, AI visibility, and GMB in parallel.

**Response (202):**
```json
{
  "success": true,
  "data": {
    "tasks": {
      "audit": "task_audit_abc123",
      "keywords": "task_kw_abc123",
      "competitors": "task_comp_abc123",
      "ppc": "task_ppc_abc123",
      "aiVisibility": "task_ai_abc123",
      "gmb": "task_gmb_abc123"
    },
    "estimatedDuration": 600,
    "message": "All Sales Phase agents queued."
  }
}
```

---

### 5.14 Generate Pitch Deck

```
POST /api/v1/projects/:projectId/sales/pitch-deck
```

**Request:**
```typescript
{
  format: "PPTX" | "PDF" | "BOTH";
  sections?: string[];           // Override default sections
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    companyName?: string;
  };
}
```

**Response (202):** Returns `taskId`. When complete, file URL is available.

---

### 5.15 Get Pitch Deck

```
GET /api/v1/projects/:projectId/sales/pitch-deck
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    status: "GENERATING" | "COMPLETED" | "FAILED";
    files: {
      pptx?: string;    // Download URL
      pdf?: string;      // Download URL
    };
    slideCount: number;
    generatedAt: string;
  };
}
```

---

### 5.16 Generate Proposal

```
POST /api/v1/projects/:projectId/sales/proposal
```

**Response (202):** Returns `taskId`.

---

## 6. STRATEGY PHASE ENDPOINTS (FastAPI)

### 6.1 Trigger Extensive Keyword Research

```
POST /api/v1/projects/:projectId/strategy/keywords
```

**Request:**
```typescript
{
  seedKeywords?: string[];     // Additional seed keywords
  maxKeywords?: number;        // Default: unlimited (all found)
  includeQuestions?: boolean;   // Include PAA/question keywords
  includeLongTail?: boolean;   // Include long-tail variations
}
```

**Response (202):** Returns `taskId`.

---

### 6.2 Get Extensive Keyword Research Results

```
GET /api/v1/projects/:projectId/strategy/keywords
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    status: "RUNNING" | "COMPLETED" | "FAILED";
    totalKeywords: number;
    clusters: Array<{
      id: string;
      name: string;                // Cluster/topic name
      pillarKeyword: string;
      keywords: Array<KeywordData>;
      intent: string;
      funnelStage: "AWARENESS" | "CONSIDERATION" | "DECISION";
      priorityScore: number;
      topicalAuthority: "STRONG" | "MODERATE" | "WEAK" | "MISSING";
    }>;
    cannibalization: Array<{
      keyword: string;
      pages: Array<{ url: string; position: number }>;
      recommendation: string;
    }>;
    contentDecay: Array<{
      url: string;
      keyword: string;
      previousPosition: number;
      currentPosition: number;
      declineRate: number;
    }>;
    approvalStatus: "PENDING" | "APPROVED" | "REVISION_REQUESTED";
    completedAt: string;
    apiCost: number;
  };
}
```

---

### 6.3 Approve/Reject Strategy Item

```
POST /api/v1/projects/:projectId/strategy/:itemType/approve
```

**`itemType`:** `keywords` | `competitors` | `structure` | `content-briefs` | `link-building` | `ai-optimization` | `local-seo`

**Request:**
```typescript
{
  action: "APPROVE" | "REJECT" | "REQUEST_REVISION";
  feedback?: string;
  modifications?: Record<string, any>;  // Specific changes
}
```

---

### 6.4 Trigger Extensive Competitor Analysis

```
POST /api/v1/projects/:projectId/strategy/competitors
```

**Response (202):** Returns `taskId`.

---

### 6.5 Get Extensive Competitor Analysis Results

```
GET /api/v1/projects/:projectId/strategy/competitors
```

---

### 6.6 Trigger Website Structure Analysis

```
POST /api/v1/projects/:projectId/strategy/structure
```

**Response (202):** Returns `taskId`.

---

### 6.7 Get Website Structure Analysis Results

```
GET /api/v1/projects/:projectId/strategy/structure
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    status: "RUNNING" | "COMPLETED" | "FAILED";
    currentSitemap: {
      totalPages: number;
      hierarchy: SitemapNode[];
      orphanPages: string[];
      thinContentPages: Array<{ url: string; wordCount: number }>;
    };
    competitorSitemaps: Array<{
      domain: string;
      totalPages: number;
      hierarchy: SitemapNode[];
    }>;
    gapAnalysis: {
      missingPageTypes: Array<{ type: string; examples: string[]; priority: string }>;
      missingTopics: string[];
      missingServicePages: string[];
      missingLocationPages: string[];
    };
    idealSitemap: {
      newPages: Array<{ url: string; title: string; type: string; priority: string }>;
      pagesToMerge: Array<{ pages: string[]; mergeInto: string; reason: string }>;
      pagesToRedirect: Array<{ from: string; to: string; reason: string }>;
      urlStructure: string;
      navigationHierarchy: SitemapNode[];
      internalLinkingPlan: string;
    };
    schemaMarkupStrategy: Array<{
      pageType: string;
      schemaTypes: string[];
      jsonLdTemplate: object;
    }>;
    approvalStatus: "PENDING" | "APPROVED" | "REVISION_REQUESTED";
    completedAt: string;
    apiCost: number;
  };
}
```

---

### 6.8 Trigger Content Briefs Generation

```
POST /api/v1/projects/:projectId/strategy/content-briefs
```

**Request:**
```typescript
{
  pageIds?: string[];    // Generate briefs for specific pages (from structure analysis)
  all?: boolean;         // Generate for all suggested pages
}
```

**Response (202):** Returns `taskId`.

---

### 6.9 Get Content Briefs

```
GET /api/v1/projects/:projectId/strategy/content-briefs
```

**Query params:** `page`, `pageSize`, `status` (filter by approval status)

**Response (200):**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    pageUrl: string;
    title: string;
    status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REVISION_REQUESTED";
    brief: {
      primaryKeyword: string;
      secondaryKeywords: string[];
      searchIntent: string;
      metaTitle: string;
      metaDescription: string;
      h1: string;
      headingStructure: Array<{ level: number; text: string; notes: string }>;
      contentSections: Array<{ heading: string; description: string; wordCount: number }>;
      totalWordCount: number;
      internalLinks: Array<{ anchorText: string; targetUrl: string }>;
      externalReferences: string[];
      imagesSuggested: number;
      ctaPlacement: string[];
      faqQuestions: string[];
      schemaMarkup: string;
      competitorAnalysis: {
        topPages: Array<{ url: string; wordCount: number; headings: string[] }>;
        averageWordCount: number;
        contentGaps: string[];
      };
      seoScoringCriteria: Record<string, { target: number; weight: number }>;
    };
    createdAt: string;
  }>;
  meta: { pagination: Pagination };
}
```

---

### 6.10 Get Single Content Brief

```
GET /api/v1/projects/:projectId/strategy/content-briefs/:briefId
```

---

### 6.11 Trigger Link Building Strategy

```
POST /api/v1/projects/:projectId/strategy/link-building
```

**Response (202):** Returns `taskId`.

---

### 6.12 Trigger AI Optimization Strategy

```
POST /api/v1/projects/:projectId/strategy/ai-optimization
```

**Response (202):** Returns `taskId`.

---

### 6.13 Trigger Local SEO Strategy

```
POST /api/v1/projects/:projectId/strategy/local-seo
```

**Response (202):** Returns `taskId`.

---

## 7. EXECUTION PHASE ENDPOINTS (FastAPI)

### 7.1 Trigger Content Creation

```
POST /api/v1/projects/:projectId/execution/content/generate
```

**Request:**
```typescript
{
  briefIds: string[];           // Content brief IDs to generate for
  llmProvider?: string;         // Override default LLM (e.g., "anthropic/claude-sonnet-4-20250514")
  tone?: string;                // Override default tone
}
```

**Response (202):** Returns `taskId` per brief.

---

### 7.2 List Content Items

```
GET /api/v1/projects/:projectId/execution/content
```

**Query params:** `page`, `pageSize`, `status`, `briefId`

**Response (200):**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    briefId: string;
    title: string;
    status: "GENERATING" | "IN_REVIEW" | "REVISION" | "PASSED" | "HUMAN_REVIEW" | "SUBMITTED";
    qualityScore: number | null;
    reviewIterations: number;
    maxIterations: number;
    wordCount: number;
    llmProvider: string;
    tokensUsed: number;
    generationCost: number;
    createdAt: string;
    lastReviewedAt: string | null;
  }>;
  meta: { pagination: Pagination };
}
```

---

### 7.3 Get Content Item (Full)

```
GET /api/v1/projects/:projectId/execution/content/:contentId
```

**Response (200):** Full content with HTML body, review history, quality scores per criteria.

```typescript
{
  success: true;
  data: {
    id: string;
    briefId: string;
    title: string;
    status: string;
    content: {
      html: string;
      markdown: string;
      metaTitle: string;
      metaDescription: string;
      schemaMarkup: object;
    };
    qualityScore: number | null;
    reviewHistory: Array<{
      iteration: number;
      score: number;
      criteriaScores: Record<string, { score: number; weight: number; feedback: string }>;
      overallFeedback: string;
      timestamp: string;
    }>;
    wordCount: number;
    llmProvider: string;
    tokensUsed: number;
  };
}
```

---

### 7.4 Trigger AI Review (Manual)

```
POST /api/v1/projects/:projectId/execution/content/:contentId/review
```

Manually triggers AI review (normally automatic after generation).

---

### 7.5 Human Review Action

```
POST /api/v1/projects/:projectId/execution/content/:contentId/human-review
```

**Request:**
```typescript
{
  action: "APPROVE" | "REJECT" | "REQUEST_REVISION";
  feedback?: string;
}
```

---

### 7.6 List Backlink Opportunities

```
GET /api/v1/projects/:projectId/execution/backlinks/opportunities
```

**Query params:** `page`, `pageSize`, `type`, `status`, `minDa`, `sort`

---

### 7.7 Trigger Backlink Prospecting

```
POST /api/v1/projects/:projectId/execution/backlinks/prospect
```

**Response (202):** Returns `taskId`.

---

### 7.8 List Backlink Submissions

```
GET /api/v1/projects/:projectId/execution/backlinks/submissions
```

**Query params:** `page`, `pageSize`, `status`, `dateFrom`, `dateTo`

**Response (200):**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    opportunityId: string;
    contentId: string;
    status: "QUEUED" | "SUBMITTING" | "SUBMITTED" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "FAILED";
    targetUrl: string;
    targetDa: number;
    linkType: string;
    submittedAt: string | null;
    screenshotUrl: string | null;
    retryCount: number;
    nextRetryAt: string | null;
  }>;
  meta: { pagination: Pagination };
}
```

---

### 7.9 Trigger Backlink Submission Run

```
POST /api/v1/projects/:projectId/execution/backlinks/submit
```

**Request:**
```typescript
{
  opportunityIds?: string[];    // Specific opportunities (or all queued)
  maxSubmissions?: number;      // Override configurator limit
}
```

**Response (202):** Returns `taskId`.

---

### 7.10 On-Page Optimization — Get Recommendations

```
GET /api/v1/projects/:projectId/execution/on-page
```

---

### 7.11 Trigger On-Page Optimization

```
POST /api/v1/projects/:projectId/execution/on-page/generate
```

**Response (202):** Returns `taskId`.

---

### 7.12 GMB Posts — List

```
GET /api/v1/projects/:projectId/execution/gmb-posts
```

---

### 7.13 GMB Posts — Create

```
POST /api/v1/projects/:projectId/execution/gmb-posts/generate
```

---

### 7.14 GMB Posts — Approve & Submit

```
POST /api/v1/projects/:projectId/execution/gmb-posts/:postId/submit
```

---

## 8. REPORTING PHASE ENDPOINTS (FastAPI + Next.js)

### 8.1 Rank Tracking — Get Rankings

```
GET /api/v1/projects/:projectId/reports/rankings
```

**Query params:** `dateFrom`, `dateTo`, `keyword`, `device`, `searchEngine`, `location`

**Response (200):**
```typescript
{
  success: true;
  data: {
    summary: {
      totalTracked: number;
      inTop3: number;
      inTop10: number;
      inTop30: number;
      averagePosition: number;
      positionChange: number;       // vs previous period
    };
    keywords: Array<{
      keyword: string;
      currentPosition: number;
      previousPosition: number;
      change: number;
      searchVolume: number;
      url: string;
      serpFeatures: string[];
      device: string;
      history: Array<{ date: string; position: number }>;
    }>;
    competitors: Array<{
      domain: string;
      averagePosition: number;
      inTop10: number;
      change: number;
    }>;
    alerts: Array<{
      type: string;
      keyword: string;
      message: string;
      timestamp: string;
    }>;
  };
  meta: { pagination: Pagination };
}
```

---

### 8.2 Rank Tracking — Trigger Manual Check

```
POST /api/v1/projects/:projectId/reports/rankings/check
```

**Response (202):** Returns `taskId`.

---

### 8.3 Traffic Analytics

```
GET /api/v1/projects/:projectId/reports/traffic
```

**Query params:** `dateFrom`, `dateTo`, `source` (`gsc` | `dataforseo` | `ga4`), `location`, `device`

---

### 8.4 Link Acquisition Report

```
GET /api/v1/projects/:projectId/reports/links
```

**Query params:** `dateFrom`, `dateTo`, `status`, `linkType`

---

### 8.5 AI Visibility Report

```
GET /api/v1/projects/:projectId/reports/ai-visibility
```

**Query params:** `dateFrom`, `dateTo`

---

### 8.6 GMB / Local SEO Report

```
GET /api/v1/projects/:projectId/reports/local-seo
```

---

### 8.7 Share of Voice

```
GET /api/v1/projects/:projectId/reports/share-of-voice
```

**Query params:** `dateFrom`, `dateTo`

---

### 8.8 Generate Client Report

```
POST /api/v1/projects/:projectId/reports/client-report
```

**Request:**
```typescript
{
  format: "PDF" | "PPTX" | "HTML";
  dateFrom: string;
  dateTo: string;
  sections?: string[];           // Override default sections
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    companyName?: string;
    clientName?: string;
  };
  autoSend?: boolean;            // Email to client
  clientEmail?: string;
}
```

**Response (202):** Returns `taskId`.

---

### 8.9 Get Client Report

```
GET /api/v1/projects/:projectId/reports/client-report/:reportId
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    status: "GENERATING" | "COMPLETED" | "FAILED";
    format: string;
    fileUrl: string;
    sections: string[];
    dateRange: { from: string; to: string };
    sentTo: string | null;
    sentAt: string | null;
    generatedAt: string;
  };
}
```

---

### 8.10 List Client Reports

```
GET /api/v1/projects/:projectId/reports/client-reports
```

---

## 9. CROSS-CUTTING ENDPOINTS

### 9.1 Approval Queue

```
GET /api/v1/approvals
```

**Query params:** `page`, `pageSize`, `type`, `status`, `projectId`

**Response (200):**
```typescript
{
  success: true;
  data: Array<{
    id: string;
    type: "STRATEGY" | "CONTENT" | "PITCH_DECK" | "PROPOSAL" | "GMB_POST";
    projectId: string;
    projectName: string;
    title: string;
    description: string;
    agentName: string;
    qualityScore: number | null;
    priority: "HIGH" | "MEDIUM" | "LOW";
    assignedTo: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED" | "REVISION_REQUESTED";
    createdAt: string;
  }>;
  meta: { pagination: Pagination };
}
```

---

### 9.2 Approve/Reject Item

```
POST /api/v1/approvals/:approvalId
```

**Request:**
```typescript
{
  action: "APPROVE" | "REJECT" | "REQUEST_REVISION";
  feedback?: string;
}
```

---

### 9.3 Agent Activity Dashboard

```
GET /api/v1/agents/activity
```

**Query params:** `projectId`, `status`, `agentType`

**Response (200):**
```typescript
{
  success: true;
  data: {
    running: Array<{
      taskId: string;
      agentType: string;
      projectId: string;
      projectName: string;
      taskName: string;
      progress: number;          // 0-100
      startedAt: string;
      estimatedCompletion: string;
    }>;
    recent: Array<{
      taskId: string;
      agentType: string;
      projectId: string;
      projectName: string;
      taskName: string;
      status: "COMPLETED" | "FAILED" | "CANCELLED";
      duration: number;          // seconds
      tokensUsed: number;
      apiCost: number;
      qualityScore: number | null;
      completedAt: string;
    }>;
    stats: {
      totalTasksToday: number;
      totalTokensToday: number;
      totalApiCostToday: number;
      successRate: number;
    };
  };
}
```

---

### 9.4 Get Task Status (Universal)

```
GET /api/v1/tasks/:taskId
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    taskId: string;
    type: string;
    status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
    progress: number;
    result?: any;                // Task-specific result data
    error?: string;
    startedAt: string | null;
    completedAt: string | null;
    estimatedDuration: number;
  };
}
```

---

### 9.5 Cancel Task

```
POST /api/v1/tasks/:taskId/cancel
```

---

## 10. CONFIGURATOR ENDPOINTS (Next.js API)

### 10.1 Get Project Configuration

```
GET /api/v1/projects/:projectId/config
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    project: {
      locations: number[];
      competitors: string[];
      budgetCap: number | null;
    };
    agents: {
      contentCreation: {
        defaultLlmProvider: string;
        defaultTone: string;
        maxWordCount: number;
      };
      aiReviewer: {
        maxIterations: number;
        criteria: Array<{
          name: string;
          weight: number;
          threshold: number;
          enabled: boolean;
          isCustom: boolean;
        }>;
      };
      backlinkSubmission: {
        maxPerHour: number;
        maxPerDay: number;
        maxPerWeek: number;
        timeWindowStart: string;    // "09:00"
        timeWindowEnd: string;      // "18:00"
        randomDelayMin: number;     // seconds
        randomDelayMax: number;     // seconds
      };
      gmbPosts: {
        postsPerWeek: number;
        postTypes: string[];
        requireHumanReview: boolean;
      };
    };
    tracking: {
      rankTracking: {
        frequency: "DAILY" | "EVERY_3_DAYS" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
        keywordCount: number;
        serpDepth: number;
        searchEngines: string[];
        devices: string[];
        serpFeatures: string[];
        competitorTracking: boolean;
      };
      aiVisibility: {
        frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
        trackCompetitors: boolean;
      };
    };
    reporting: {
      frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
      format: "PDF" | "PPTX" | "HTML";
      sections: string[];
      autoSend: boolean;
      clientEmail: string | null;
      branding: {
        logoUrl: string | null;
        primaryColor: string | null;
        companyName: string | null;
      };
    };
    notifications: {
      email: boolean;
      inApp: boolean;
      slackWebhook: string | null;
      alertTypes: string[];
      thresholds: Record<string, number>;
    };
  };
}
```

---

### 10.2 Update Project Configuration

```
PATCH /api/v1/projects/:projectId/config
```

**Request:** Partial update — any subset of the configuration object.

---

### 10.3 Get AI Reviewer Criteria

```
GET /api/v1/projects/:projectId/config/review-criteria
```

---

### 10.4 Update AI Reviewer Criteria

```
PUT /api/v1/projects/:projectId/config/review-criteria
```

**Request:**
```typescript
{
  criteria: Array<{
    name: string;
    description: string;
    weight: number;          // 0-100
    threshold: number;       // Minimum score to pass (0-100)
    enabled: boolean;
    isCustom: boolean;
  }>;
}
```

---

## 11. SETTINGS ENDPOINTS (Next.js API)

### 11.1 User Profile

```
GET    /api/v1/settings/profile
PATCH  /api/v1/settings/profile
```

---

### 11.2 Team Management

```
GET    /api/v1/settings/team                    — List team members
POST   /api/v1/settings/team/invite             — Invite member
PATCH  /api/v1/settings/team/:userId            — Update role
DELETE /api/v1/settings/team/:userId             — Remove member
```

---

### 11.3 Billing (Wave 3 — Stripe + Razorpay)

```
GET    /api/v1/settings/billing                 — Current plan + usage
POST   /api/v1/settings/billing/checkout        — Create checkout session
POST   /api/v1/settings/billing/portal          — Stripe customer portal URL
GET    /api/v1/settings/billing/invoices         — Invoice history
```

---

### 11.4 API Keys (BYOK)

```
GET    /api/v1/settings/api-keys                — List configured keys
POST   /api/v1/settings/api-keys                — Add API key
DELETE /api/v1/settings/api-keys/:keyId          — Remove API key
POST   /api/v1/settings/api-keys/:keyId/test     — Test key validity
```

**Supported key types:** `DATAFORSEO`, `OPENAI`, `ANTHROPIC`, `GOOGLE_AI`, `MISTRAL`, `COHERE`, `GOOGLE_SEARCH_CONSOLE`, `GOOGLE_ANALYTICS`, `GOOGLE_BUSINESS_PROFILE`

---

### 11.5 Integrations

```
GET    /api/v1/settings/integrations             — List integration statuses
POST   /api/v1/settings/integrations/gsc/connect  — Start GSC OAuth flow
POST   /api/v1/settings/integrations/ga4/connect  — Start GA4 OAuth flow
POST   /api/v1/settings/integrations/gbp/connect  — Start GBP OAuth flow
DELETE /api/v1/settings/integrations/:type/disconnect
```

---

### 11.6 Branding (White-label — Wave 3)

```
GET    /api/v1/settings/branding
PATCH  /api/v1/settings/branding
POST   /api/v1/settings/branding/logo            — Upload logo (multipart)
```

---

### 11.7 Notification Preferences

```
GET    /api/v1/settings/notifications
PATCH  /api/v1/settings/notifications
POST   /api/v1/settings/notifications/test        — Send test notification
```

---

## 12. CLIENT PORTAL ENDPOINTS (Next.js API)

Token-based read-only access (no login required in Wave 1).

### 12.1 Get Portal Data

```
GET /api/v1/portal/:token
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    projectName: string;
    clientName: string;
    branding: { logoUrl: string; primaryColor: string; companyName: string };
    sections: {
      rankings: boolean;
      traffic: boolean;
      links: boolean;
      aiVisibility: boolean;
      localSeo: boolean;
      reports: boolean;
    };
    latestReport: { id: string; generatedAt: string; fileUrl: string } | null;
  };
}
```

---

### 12.2 Portal — Rankings

```
GET /api/v1/portal/:token/rankings
```

---

### 12.3 Portal — Traffic

```
GET /api/v1/portal/:token/traffic
```

---

### 12.4 Portal — Reports

```
GET /api/v1/portal/:token/reports
```

---

## 13. ADMIN ENDPOINTS (Next.js API — Wave 3)

Super admin panel for SaaS management.

```
GET    /api/v1/admin/tenants                     — List all organizations
GET    /api/v1/admin/tenants/:orgId              — Get org details
PATCH  /api/v1/admin/tenants/:orgId              — Update org (plan, status)
GET    /api/v1/admin/users                       — List all users
GET    /api/v1/admin/analytics                   — System-wide analytics
GET    /api/v1/admin/analytics/revenue           — Revenue metrics
GET    /api/v1/admin/analytics/usage             — Usage metrics
GET    /api/v1/admin/feature-flags               — List feature flags
PATCH  /api/v1/admin/feature-flags/:flagId       — Toggle feature flag
```

---

## 14. WEBHOOK ENDPOINTS

### 14.1 Incoming Webhooks

| Source | Endpoint | Purpose |
|--------|----------|---------|
| **Stripe** | `POST /api/v1/webhooks/stripe` | Payment events (subscription created/updated/cancelled, invoice paid/failed) |
| **Razorpay** | `POST /api/v1/webhooks/razorpay` | Payment events (India) |
| **Resend** | `POST /api/v1/webhooks/resend` | Email delivery events (bounced, complained) |

**Webhook security:**
- Stripe: Signature verification via `stripe-signature` header
- Razorpay: Signature verification via `x-razorpay-signature` header
- Resend: Signature verification via webhook secret

### 14.2 Outgoing Webhooks (Wave 3 — Public API)

```
POST /api/v1/settings/webhooks                  — Register webhook URL
GET  /api/v1/settings/webhooks                  — List registered webhooks
DELETE /api/v1/settings/webhooks/:webhookId      — Remove webhook

Events:
- project.created
- agent.completed
- agent.failed
- content.approved
- content.rejected
- rank.changed
- report.generated
- submission.completed
```

---

## 15. REAL-TIME EVENTS (WebSocket)

### 15.1 Connection

```
WebSocket: wss://api.optimusseo.com/ws?token=<jwt_token>
```

### 15.2 Event Types

| Event | Payload | Description |
|-------|---------|-------------|
| `agent.started` | `{ taskId, agentType, projectId }` | Agent task started |
| `agent.progress` | `{ taskId, progress, message }` | Agent progress update |
| `agent.completed` | `{ taskId, agentType, projectId, result }` | Agent task completed |
| `agent.failed` | `{ taskId, agentType, error }` | Agent task failed |
| `content.reviewed` | `{ contentId, score, iteration, passed }` | Content review completed |
| `content.human_review` | `{ contentId, reason }` | Content needs human review |
| `submission.status` | `{ submissionId, status }` | Backlink submission status change |
| `rank.alert` | `{ keyword, oldPosition, newPosition, type }` | Rank change alert |
| `approval.new` | `{ approvalId, type, title }` | New item in approval queue |
| `notification` | `{ type, title, message }` | General notification |

### 15.3 Room/Channel Structure

```
Channels:
├── user:{userId}              — User-specific notifications
├── org:{orgId}                — Organization-wide events
├── project:{projectId}        — Project-specific events
└── agent:{taskId}             — Individual agent task events
```

**Client subscribes to channels:**
```json
{ "type": "subscribe", "channels": ["project:proj_abc123", "user:usr_abc123"] }
```

---

## 16. FILE ENDPOINTS

### 16.1 Upload File

```
POST /api/v1/files/upload
Content-Type: multipart/form-data
```

**Form fields:**
- `file`: The file to upload
- `type`: `LOGO` | `REPORT` | `SCREENSHOT` | `ATTACHMENT`
- `projectId`: Optional project association

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "file_abc123",
    "url": "https://storage.optimusseo.com/files/abc123.png",
    "filename": "logo.png",
    "mimeType": "image/png",
    "size": 45678
  }
}
```

---

### 16.2 Download File

```
GET /api/v1/files/:fileId
```

Returns file with appropriate `Content-Type` and `Content-Disposition` headers.

---

## 17. DATAFORSEO PROXY ENDPOINTS (FastAPI — Internal)

These endpoints are internal to the FastAPI backend and not directly called by the frontend. They abstract DataForSEO API calls with caching, rate limiting, and cost tracking.

```
POST /api/v1/internal/dataforseo/serp
POST /api/v1/internal/dataforseo/keywords
POST /api/v1/internal/dataforseo/backlinks
POST /api/v1/internal/dataforseo/onpage
POST /api/v1/internal/dataforseo/labs
POST /api/v1/internal/dataforseo/business-data
POST /api/v1/internal/dataforseo/ai-optimization
POST /api/v1/internal/dataforseo/content-analysis
```

Each endpoint:
- Validates the request against DataForSEO API schema
- Checks cache (Redis) for identical recent requests
- Applies rate limiting per organization
- Tracks API cost per request
- Logs request/response for debugging
- Returns standardized response format

---

## 18. LLM PROXY ENDPOINTS (FastAPI — Internal)

```
POST /api/v1/internal/llm/completion
POST /api/v1/internal/llm/chat
POST /api/v1/internal/llm/structured-output
```

Each endpoint:
- Routes to appropriate provider via LiteLLM
- Uses BYOK keys if configured, platform keys as fallback
- Tracks token usage and cost per request
- Applies organization-level rate limits
- Supports streaming responses

---

## 19. HEALTH & MONITORING

### 19.1 Health Check (Next.js)

```
GET /api/v1/health
```

**Response (200):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 86400,
  "timestamp": "2026-03-13T10:00:00Z"
}
```

### 19.2 Health Check (FastAPI)

```
GET /api/v1/health
```

**Response (200):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected",
    "celery": "running",
    "dataforseo": "reachable",
    "litellm": "configured"
  },
  "uptime": 86400,
  "timestamp": "2026-03-13T10:00:00Z"
}
```

---

## PHASE 0 GATE: API.md

```
[x] API overview and architecture defined
[x] Authentication flow documented
[x] Rate limiting strategy defined
[x] Standard response/error formats defined
[x] All auth endpoints specified
[x] All project CRUD endpoints specified
[x] All Sales Phase endpoints specified (trigger + results)
[x] All Strategy Phase endpoints specified
[x] All Execution Phase endpoints specified
[x] All Reporting Phase endpoints specified
[x] Cross-cutting endpoints (approvals, agents, tasks)
[x] Configurator endpoints specified
[x] Settings endpoints specified
[x] Client portal endpoints specified
[x] Admin endpoints specified (Wave 3)
[x] Webhook endpoints (incoming + outgoing)
[x] WebSocket real-time events defined
[x] File upload/download endpoints
[x] Internal proxy endpoints (DataForSEO, LLM)
[x] Health/monitoring endpoints
[ ] USER APPROVAL — Awaiting
```

---

> **Next**: WIREFRAMES.md → ADR.md → BRAND.md selections
