# ADR.md — Optimus SEO

> **Version:** 1.0 | **Date:** 2026-03-13
> **Status:** Draft — Awaiting Approval
> **Author:** AI Agent (per heart.md blueprint, Section 3.5)

---

## ADR-001: Hybrid Architecture — Next.js Frontend + FastAPI Backend

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
Optimus SEO requires two fundamentally different capabilities: (1) a modern, responsive web application with SSR, authentication, and CRUD operations, and (2) a heavy AI/ML backend for agent orchestration, LLM calls, DataForSEO API integration, document generation (python-pptx, reportlab), and long-running background tasks. No single framework excels at both.

**Decision:**
Use a **hybrid architecture** (Path C from blueprint):
- **Next.js 15** (App Router) — Frontend + BFF (Backend for Frontend) layer. Handles UI rendering, authentication (Better Auth), Prisma DB queries, Stripe/Razorpay webhooks, file uploads, and SSR data fetching. Deployed on **Vercel**.
- **FastAPI** (Python) — AI/Agent backend. Handles agent orchestration, DataForSEO API calls, LLM calls via LiteLLM, Celery task queue, WebSocket events, and report/deck generation. Deployed on **Railway**.

**Alternatives Considered:**

- **Alternative A: Next.js only (full-stack)** — Rejected because:
  - Python ecosystem is vastly superior for AI/ML (LangChain, LiteLLM, python-pptx, reportlab, Celery)
  - Long-running agent tasks would block Next.js serverless functions (Vercel has 60s timeout on Pro, 300s on Enterprise)
  - No good Node.js equivalent for python-pptx (PowerPoint generation)
  - Celery (Python) is the gold standard for distributed task queues; Bull/BullMQ is capable but less mature for complex workflows

- **Alternative B: FastAPI only (full-stack with React SPA)** — Rejected because:
  - Loses SSR/SSG benefits of Next.js (SEO for marketing pages, performance)
  - Better Auth is a Next.js-native auth solution; Python auth libraries are less polished
  - Prisma (TypeScript) provides better type safety for DB operations than SQLAlchemy
  - Vercel deployment for Next.js is zero-config; deploying a Python app to serve React is more complex

- **Alternative C: Django + HTMX** — Rejected because:
  - HTMX is not suitable for the complex, interactive dashboards required (real-time agent monitoring, drag-and-drop configurators, rich data visualizations)
  - Django's template system is limiting for the UI complexity needed
  - Would require a separate frontend framework anyway for the dashboard

**Consequences:**
- **Positive:** Best-of-both-worlds — Next.js for UI/UX excellence, Python for AI/agent power. Each can scale independently. Team can specialize.
- **Negative:** Two codebases to maintain. Cross-service communication adds latency (~50-100ms per call). Need to keep auth tokens synchronized between services.
- **Risks:** Service-to-service auth must be secure (JWT validation on FastAPI side). Network failures between Vercel and Railway need retry logic.

---

## ADR-002: PostgreSQL as Primary Database

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The application has a highly relational data model (organizations → projects → keywords → content → submissions → reports) with complex queries (joins across 5+ tables for reports), full-text search needs, and JSON storage requirements (agent configurations, DataForSEO responses).

**Decision:**
Use **PostgreSQL** (via Railway managed instance) as the sole database.

**Alternatives Considered:**

- **Alternative A: MongoDB** — Rejected because:
  - Data model is fundamentally relational (organizations, projects, users, roles — all with foreign key relationships)
  - Complex reporting queries require JOINs that MongoDB handles poorly
  - Multi-tenancy with `organizationId` filtering is cleaner with SQL WHERE clauses + RLS
  - Prisma's MongoDB support is less mature than PostgreSQL support

- **Alternative B: PostgreSQL + MongoDB (polyglot)** — Rejected because:
  - PostgreSQL's JSONB columns handle semi-structured data (agent configs, API responses) well enough
  - Two databases doubles operational complexity for marginal benefit
  - Prisma doesn't support cross-database relations

- **Alternative C: MySQL** — Rejected because:
  - PostgreSQL has superior JSON support (JSONB with indexing)
  - PostgreSQL has better full-text search capabilities
  - PostgreSQL supports Row-Level Security (RLS) natively — useful for multi-tenancy
  - Railway's PostgreSQL offering is more mature

**Consequences:**
- **Positive:** Single database simplifies operations. JSONB handles flexible data. Full-text search built-in. RLS for multi-tenancy security.
- **Negative:** PostgreSQL is more resource-intensive than MySQL for simple queries. JSONB queries can be slower than dedicated document stores for deeply nested data.
- **Risks:** Large DataForSEO response payloads stored as JSONB could impact query performance — mitigated by extracting key metrics into typed columns and using JSONB only for raw storage.

---

## ADR-003: Prisma as ORM (Next.js) + SQLAlchemy (FastAPI)

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
Two services need database access: Next.js (TypeScript) and FastAPI (Python). Each needs an ORM suited to its language ecosystem.

**Decision:**
- **Prisma** for Next.js — schema-first, type-safe, excellent DX, handles migrations
- **SQLAlchemy 2.0** for FastAPI — Python's most mature ORM, async support, Pydantic integration

Prisma owns the schema and migrations. SQLAlchemy reads the same database but does NOT run migrations.

**Alternatives Considered:**

- **Alternative A: Drizzle ORM (Next.js)** — Rejected because:
  - Prisma has a larger ecosystem, more documentation, and better tooling (Prisma Studio)
  - Drizzle's migration system is less mature
  - Blueprint recommends Prisma as the default choice
  - Prisma's type generation is more comprehensive

- **Alternative B: TypeORM (Next.js)** — Rejected because:
  - TypeORM has known issues with TypeScript strict mode
  - Decorator-based syntax is less clean than Prisma's schema language
  - Migration system is less reliable than Prisma Migrate

- **Alternative C: Prisma for both (via prisma-client-py)** — Rejected because:
  - prisma-client-py is a community project, not officially supported
  - SQLAlchemy is battle-tested in Python production environments
  - SQLAlchemy's async support (via asyncpg) is more mature

**Consequences:**
- **Positive:** Each service uses the best ORM for its language. Prisma handles schema/migrations centrally. Type safety in both languages.
- **Negative:** Schema changes require updating both Prisma schema AND SQLAlchemy models. Potential for drift.
- **Risks:** Schema drift between Prisma and SQLAlchemy — mitigated by generating SQLAlchemy models from Prisma schema (tooling exists) and CI checks.

---

## ADR-004: Better Auth for Authentication

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The application needs passwordless authentication (magic links), session management, role-based access control, and team invitations. It must work with Next.js App Router and also issue JWTs for the FastAPI backend.

**Decision:**
Use **Better Auth** with **Resend** as the email provider for magic link delivery.

**Alternatives Considered:**

- **Alternative A: NextAuth.js (Auth.js)** — Rejected because:
  - Auth.js v5 has had stability issues and breaking changes
  - Magic link support requires additional configuration
  - Better Auth has a cleaner API and better TypeScript support
  - Better Auth supports custom session storage (PostgreSQL via Prisma)

- **Alternative B: Clerk** — Rejected because:
  - Third-party dependency for core auth — vendor lock-in risk
  - Pricing scales with MAU — expensive at 2,000 users
  - Less control over the auth flow and UI
  - Adds external network dependency for every auth check

- **Alternative C: Supabase Auth** — Rejected because:
  - Would require Supabase as the database provider (we're using Railway PostgreSQL)
  - Tightly coupled to Supabase ecosystem
  - Less flexible for custom auth flows

- **Alternative D: Custom auth (from scratch)** — Rejected because:
  - Auth is a solved problem — building from scratch introduces security risks
  - Magic link flow, session management, CSRF protection, token rotation — all complex to implement correctly
  - Better Auth provides all of this out of the box

**Consequences:**
- **Positive:** Passwordless UX (no passwords to manage/breach). Better Auth is open-source and self-hosted. Full control over auth flow. Works natively with Next.js App Router.
- **Negative:** Better Auth is newer than Auth.js — smaller community. Magic links require reliable email delivery (Resend handles this).
- **Risks:** Email deliverability issues could block login — mitigated by Resend's high deliverability rates and fallback to OTP codes.

---

## ADR-005: Modular Monolith Architecture (Phase 1)

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The blueprint mandates starting with a modular monolith and evolving to a monorepo only when needed (Phase 2 — SaaS launch). The question is how to structure the codebase within each service.

**Decision:**
- **Next.js:** Single Next.js application with feature-based folder structure (`/src/features/projects/`, `/src/features/auth/`, etc.)
- **FastAPI:** Single FastAPI application with domain-based module structure (`/agents/`, `/integrations/dataforseo/`, `/integrations/llm/`, etc.)

Both services are modular monoliths — well-organized single deployments with clear module boundaries.

**Alternatives Considered:**

- **Alternative A: Microservices from Day 1** — Rejected because:
  - Blueprint explicitly prohibits microservices unless 20+ developers and millions of users
  - Operational overhead of managing 5+ services for a team of 1-3 developers is prohibitive
  - Network latency between services adds up
  - Distributed transactions are complex (agent workflows span multiple services)

- **Alternative B: Monorepo from Day 1 (Turborepo)** — Rejected because:
  - Premature optimization — monorepo benefits (shared packages, unified CI) aren't needed until Phase 2
  - Adds build complexity without proportional benefit for a single Next.js + single FastAPI setup
  - Blueprint recommends monorepo at Phase 2 (SaaS launch)

**Consequences:**
- **Positive:** Simple deployment (one Vercel app, one Railway app). Fast development iteration. Easy to reason about.
- **Negative:** Must be disciplined about module boundaries to avoid spaghetti code. Refactoring to monorepo later requires effort.
- **Risks:** Tight coupling between modules if boundaries aren't enforced — mitigated by clear folder structure and import rules.

---

## ADR-006: Stripe + Razorpay for Payments

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The product targets a global audience (Stripe) with specific support for the Indian market (Razorpay, since Stripe India has limitations with recurring payments and UPI).

**Decision:**
Use **Stripe** as the primary payment provider (global) and **Razorpay** as the secondary provider (India-specific). Payment provider is selected based on the user's billing country.

**Alternatives Considered:**

- **Alternative A: Stripe only** — Rejected because:
  - Stripe India doesn't support UPI (India's dominant payment method)
  - Stripe India has higher fees for domestic transactions
  - Many Indian businesses prefer Razorpay for familiarity

- **Alternative B: Razorpay only** — Rejected because:
  - Razorpay is India-focused — limited international support
  - Stripe has better developer experience and documentation
  - Stripe's subscription management is more mature

- **Alternative C: Paddle / Lemon Squeezy (MoR)** — Rejected because:
  - Merchant of Record model takes a larger revenue cut (5-10%)
  - Less control over pricing, invoicing, and customer relationships
  - Doesn't solve the India-specific payment needs

**Consequences:**
- **Positive:** Best payment experience for both global and Indian users. UPI support in India. Stripe's excellent subscription management globally.
- **Negative:** Two payment integrations to maintain. Need to handle webhook events from both providers. Billing logic is more complex.
- **Risks:** Currency conversion and tax handling across providers — mitigated by using each provider's built-in tax calculation.

---

## ADR-007: REST API Style (Not tRPC, Not GraphQL)

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The API needs to serve the Next.js frontend, the FastAPI backend (inter-service), and eventually a public API (Wave 3). The choice between REST, tRPC, and GraphQL affects developer experience, performance, and API design.

**Decision:**
Use **REST** with OpenAPI/Swagger documentation for both Next.js API routes and FastAPI endpoints.

**Alternatives Considered:**

- **Alternative A: tRPC** — Rejected because:
  - tRPC is TypeScript-only — doesn't work with the Python FastAPI backend
  - tRPC is designed for monolithic Next.js apps, not hybrid architectures
  - Public API (Wave 3) would need a separate REST layer anyway
  - tRPC's type inference doesn't cross the Next.js ↔ FastAPI boundary

- **Alternative B: GraphQL** — Rejected because:
  - Blueprint explicitly advises against GraphQL unless deeply relational data with flexible client queries
  - Our data model is relational but queries are predictable (not ad-hoc)
  - GraphQL adds complexity (schema stitching, resolvers, N+1 problems, caching challenges)
  - FastAPI has REST as its native paradigm; adding GraphQL (Strawberry/Ariadne) adds overhead
  - Over-fetching is not a significant problem with well-designed REST endpoints

- **Alternative C: gRPC** — Rejected because:
  - gRPC is designed for service-to-service communication, not browser-to-server
  - Requires protobuf schema management
  - Browser support requires gRPC-Web proxy
  - Overkill for our scale

**Consequences:**
- **Positive:** Universal compatibility. FastAPI generates OpenAPI docs automatically. Easy to understand and debug. Public API (Wave 3) is REST-native. Caching is straightforward (HTTP caching headers).
- **Negative:** No automatic type inference between frontend and backend (mitigated by generating TypeScript types from OpenAPI spec). Multiple round trips for complex views (mitigated by BFF pattern — Next.js API aggregates data).
- **Risks:** API design inconsistency — mitigated by strict conventions (documented in API.md) and OpenAPI validation.

---

## ADR-008: Zustand for Client-Side State Management

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The Next.js frontend needs client-side state management for: real-time agent activity, approval queue, notification state, UI preferences (sidebar collapsed, dark mode), and form state for complex configurators.

**Decision:**
Use **Zustand** for global client-side state, combined with **TanStack Query (React Query)** for server state (API data fetching, caching, and synchronization).

**Alternatives Considered:**

- **Alternative A: Redux Toolkit** — Rejected because:
  - Blueprint explicitly bans Redux ("it's 2026, use lighter alternatives")
  - Redux's boilerplate (slices, reducers, actions) is excessive for our needs
  - Zustand achieves the same with 80% less code

- **Alternative B: Jotai** — Rejected because:
  - Jotai's atomic model is better for fine-grained reactivity (like Recoil)
  - Our state is mostly coarse-grained (agent activity, approval queue) — Zustand's store model is a better fit
  - Zustand has a simpler mental model for the team

- **Alternative C: React Context only** — Rejected because:
  - Context causes unnecessary re-renders for frequently changing state (agent progress updates)
  - No built-in devtools or middleware
  - Doesn't scale well for complex state

- **Alternative D: Zustand only (no TanStack Query)** — Rejected because:
  - TanStack Query handles server state (caching, revalidation, optimistic updates, pagination) far better than manual fetch + Zustand
  - Separating server state (TanStack Query) from client state (Zustand) is a proven pattern

**Consequences:**
- **Positive:** Minimal boilerplate. Excellent performance (no unnecessary re-renders). TanStack Query handles all server state complexity. Zustand devtools for debugging.
- **Negative:** Two state management libraries to learn (though both are simple).
- **Risks:** Minimal — both libraries are mature, well-documented, and widely adopted.

---

## ADR-009: Tailwind CSS v4 for Styling

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The application needs a styling solution that supports: custom design system (not generic), dark mode, responsive design, component-level styling, and fast development iteration.

**Decision:**
Use **Tailwind CSS v4** with a custom design system defined in BRAND.md. No component library — all components built from scratch using Tailwind utility classes.

**Alternatives Considered:**

- **Alternative A: CSS Modules** — Rejected because:
  - Slower development iteration (switching between files)
  - No built-in design system constraints
  - Harder to maintain consistency across a large codebase

- **Alternative B: styled-components / Emotion** — Rejected because:
  - Blueprint explicitly bans CSS-in-JS runtime libraries
  - Runtime overhead (style injection on every render)
  - Tailwind is the blueprint's standard

- **Alternative C: Tailwind + shadcn/ui** — Considered but **partially accepted**:
  - shadcn/ui provides excellent accessible component primitives (built on Radix UI)
  - We will use shadcn/ui as a **starting point** for component primitives (Dialog, Dropdown, Tooltip, etc.)
  - But all visual styling will be customized to match BRAND.md — no default shadcn/ui theme
  - This gives us accessibility for free while maintaining a custom design

- **Alternative D: Chakra UI / Mantine** — Rejected because:
  - Pre-built component libraries enforce their own design language
  - Blueprint mandates "no default/generic themes — every project gets a custom design system"
  - Customizing Chakra/Mantine to match our brand is more work than building with Tailwind + Radix primitives

**Consequences:**
- **Positive:** Full design control. Fast iteration with utility classes. Tiny CSS bundle (purged unused classes). Dark mode via `data-theme` attribute. Design tokens from BRAND.md map directly to Tailwind config.
- **Negative:** More upfront work building components from scratch. Requires discipline to maintain consistency.
- **Risks:** Inconsistent component styling — mitigated by a shared component library (`/src/components/ui/`) with Storybook documentation.

---

## ADR-010: shadcn/ui + Radix UI for Component Primitives

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
Building accessible, keyboard-navigable UI components from scratch is time-consuming and error-prone. We need accessible primitives (dialogs, dropdowns, tooltips, tabs, etc.) without adopting a full component library's design language.

**Decision:**
Use **shadcn/ui** (which is built on **Radix UI** primitives) as the foundation for interactive components. All visual styling is overridden with our custom Tailwind theme from BRAND.md.

**Alternatives Considered:**

- **Alternative A: Radix UI directly (without shadcn/ui)** — Rejected because:
  - shadcn/ui provides pre-wired Tailwind styling on top of Radix, saving significant setup time
  - shadcn/ui components are copy-pasted into the project (not a dependency) — full ownership
  - The community has already solved common patterns (form integration, toast notifications, etc.)

- **Alternative B: Headless UI (Tailwind Labs)** — Rejected because:
  - Fewer components than Radix UI
  - Less active development
  - Radix UI has better accessibility compliance

- **Alternative C: Ark UI** — Rejected because:
  - Newer, smaller community
  - Less documentation and examples
  - Radix UI is the established standard

**Consequences:**
- **Positive:** Accessible components out of the box (WCAG 2.2 AA). Keyboard navigation. Screen reader support. Full styling control. Components live in our codebase (no external dependency).
- **Negative:** Must keep components updated manually (no auto-updates since they're copied in).
- **Risks:** Minimal — Radix UI is maintained by WorkOS and widely adopted.

---

## ADR-011: LiteLLM for LLM Provider Abstraction

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The product must support ALL LLM providers (OpenAI, Anthropic, Google, Mistral, Cohere, etc.) with BYOK (Bring Your Own Key) capability. Users should be able to switch providers without code changes. The platform also needs its own keys as fallback.

**Decision:**
Use **LiteLLM** as the LLM abstraction layer in the FastAPI backend. LiteLLM provides a unified API for 100+ LLM providers with a single interface.

**Alternatives Considered:**

- **Alternative A: Direct provider SDKs** — Rejected because:
  - Each provider has a different API format (OpenAI, Anthropic, Google all differ)
  - Adding a new provider requires new integration code
  - BYOK key routing would need custom logic per provider
  - Cost tracking across providers would need custom implementation

- **Alternative B: LangChain** — Rejected because:
  - LangChain is a full agent framework — overkill for just LLM abstraction
  - LangChain adds significant complexity and dependencies
  - LiteLLM is focused specifically on the LLM call abstraction (one thing, done well)
  - We're building our own agent orchestration — LangChain's agent framework would conflict

- **Alternative C: Vercel AI SDK** — Rejected because:
  - TypeScript-only — doesn't work in our Python FastAPI backend
  - Designed for streaming chat UIs, not backend agent orchestration

**Consequences:**
- **Positive:** Single API for all providers. BYOK routing is trivial (pass the key). Cost tracking built-in. Provider fallback chains (if Anthropic fails, try OpenAI). Streaming support.
- **Negative:** Additional dependency. LiteLLM updates may lag behind provider API changes.
- **Risks:** LiteLLM is open-source with active development — risk of breaking changes in updates. Mitigated by pinning versions.

---

## ADR-012: Celery + Redis for Task Queue

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
Agent tasks are long-running (site audits: 5-10 minutes, content generation: 1-2 minutes, rank tracking: 5+ minutes). These cannot run synchronously in API request handlers. We need a distributed task queue with scheduling (Celery Beat for rank tracking cron jobs), retry logic, and progress tracking.

**Decision:**
Use **Celery** with **Redis** as the message broker and result backend. **Celery Beat** for scheduled tasks (rank tracking, report generation).

**Alternatives Considered:**

- **Alternative A: Bull/BullMQ (Node.js)** — Rejected because:
  - Our agent backend is Python (FastAPI) — Bull is Node.js only
  - Would require a separate Node.js worker service just for the queue
  - Celery is the Python standard for distributed task queues

- **Alternative B: Dramatiq** — Rejected because:
  - Smaller community and ecosystem than Celery
  - Less documentation and fewer production case studies
  - Celery Beat (scheduler) has no equivalent in Dramatiq

- **Alternative C: Temporal** — Rejected because:
  - Temporal is a workflow orchestration engine — more complex than needed
  - Requires running a Temporal server (additional infrastructure)
  - Overkill for our current scale (200-2,000 users)
  - Could be considered for Phase 3 if workflow complexity increases

- **Alternative D: AWS SQS / Google Cloud Tasks** — Rejected because:
  - Vendor lock-in to specific cloud provider
  - We're deploying on Railway + Vercel, not AWS/GCP
  - Celery + Redis is cloud-agnostic

**Consequences:**
- **Positive:** Battle-tested in production. Celery Beat handles all scheduling needs. Redis is already needed for caching. Progress tracking via Celery's task state. Retry logic built-in.
- **Negative:** Celery can be complex to configure and debug. Redis as broker can lose messages on crash (mitigated by Redis persistence).
- **Risks:** Celery worker memory leaks with long-running tasks — mitigated by `--max-tasks-per-child` setting and monitoring.

---

## ADR-013: DataForSEO as Primary SEO Data Provider

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The product needs comprehensive SEO data: SERP rankings, keyword metrics, backlink profiles, site audits, business listings, and AI visibility data. Options are to build our own crawling infrastructure, use a single data provider, or aggregate from multiple sources.

**Decision:**
Use **DataForSEO** as the primary (and initially sole) SEO data provider. DataForSEO provides the same data quality as Ahrefs/SEMrush at pay-as-you-go pricing.

**Alternatives Considered:**

- **Alternative A: Build our own crawling infrastructure** — Rejected because:
  - Building a web crawler at scale requires massive infrastructure investment
  - SERP scraping is legally complex and technically challenging (CAPTCHAs, IP rotation)
  - Backlink index requires crawling billions of pages
  - Would take 12+ months just to build the data layer
  - DataForSEO has already solved this

- **Alternative B: Ahrefs API** — Rejected because:
  - Ahrefs API is expensive (enterprise pricing, not pay-as-you-go)
  - Limited API access (not all features available via API)
  - Would make us dependent on a direct competitor's data

- **Alternative C: SEMrush API** — Rejected because:
  - Similar pricing concerns as Ahrefs
  - API rate limits are restrictive
  - Would create dependency on a competitor

- **Alternative D: Multiple providers (DataForSEO + Moz + custom)** — Rejected for MVP because:
  - Adds integration complexity
  - Data normalization across providers is non-trivial
  - DataForSEO covers all our needs for Wave 1
  - Can add supplementary providers later if needed

**Consequences:**
- **Positive:** Single integration point. Pay-as-you-go pricing (~$1-5/month per project). Comprehensive API coverage (SERP, keywords, backlinks, on-page, business data, AI optimization). Same data quality as Ahrefs/SEMrush.
- **Negative:** Single point of failure for data. If DataForSEO has issues, all agents are affected.
- **Risks:** DataForSEO pricing changes or API deprecation — mitigated by abstracting all DataForSEO calls behind an internal proxy layer (easy to swap providers). DataForSEO downtime — mitigated by caching recent results and retry logic.

---

## ADR-014: Vercel (Next.js) + Railway (FastAPI + PostgreSQL + Redis)

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The application needs hosting for: a Next.js frontend, a FastAPI backend, PostgreSQL database, Redis cache, and Celery workers. The deployment should be simple, cost-effective, and scalable for 200-2,000 users.

**Decision:**
- **Vercel** — Next.js frontend (zero-config deployment, edge network, automatic scaling)
- **Railway** — FastAPI backend, PostgreSQL, Redis, Celery workers (simple container deployment, managed databases)

**Alternatives Considered:**

- **Alternative A: Vercel + AWS (RDS + ElastiCache + ECS)** — Rejected because:
  - AWS is complex to configure and manage for a small team
  - ECS/Fargate requires Docker + task definitions + load balancers
  - RDS + ElastiCache are expensive for our scale
  - Railway provides the same capabilities with 90% less configuration

- **Alternative B: All on Railway** — Rejected because:
  - Railway can host Next.js, but Vercel's edge network and build optimization are superior
  - Vercel's preview deployments and branch deploys are best-in-class for frontend
  - Next.js on Vercel is the intended deployment target (zero-config)

- **Alternative C: All on Vercel (including Python via serverless)** — Rejected because:
  - Vercel's Python runtime has limitations (cold starts, 60s timeout on Pro)
  - Celery workers can't run on Vercel (need persistent processes)
  - PostgreSQL and Redis need dedicated hosting

- **Alternative D: DigitalOcean App Platform** — Rejected because:
  - Less mature than Railway for container deployments
  - No built-in PostgreSQL/Redis provisioning as seamless as Railway
  - Railway's developer experience is superior

**Consequences:**
- **Positive:** Best-in-class hosting for each service. Vercel handles frontend scaling automatically. Railway handles backend + databases with simple configuration. Both have generous free tiers for development.
- **Negative:** Two hosting providers to manage. Cross-provider networking (Vercel → Railway) adds latency.
- **Risks:** Railway is a smaller company than AWS/GCP — mitigated by Railway's growing adoption and the fact that migration to any Docker-compatible host is straightforward.

---

## ADR-015: Custom Agent Orchestration (Not LangChain/CrewAI)

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The product's core differentiator is its AI agent system. Agents need to: call DataForSEO APIs, process results with LLMs, make decisions, loop (content creation ↔ review), respect configurator settings, track costs, and integrate with the approval workflow. The question is whether to use an existing agent framework or build custom.

**Decision:**
Build a **custom agent orchestration layer** in Python, using LiteLLM for LLM calls and Celery for task execution.

**Alternatives Considered:**

- **Alternative A: LangChain Agents** — Rejected because:
  - LangChain's agent abstraction is designed for general-purpose tool-using agents
  - Our agents have very specific, predictable workflows (not open-ended reasoning)
  - LangChain adds significant dependency weight and complexity
  - LangChain's abstractions often get in the way of custom logic
  - Debugging LangChain agent failures is notoriously difficult

- **Alternative B: CrewAI** — Rejected because:
  - CrewAI is designed for multi-agent collaboration with role-playing
  - Our agents are more like specialized workers with defined pipelines, not collaborating peers
  - CrewAI adds abstraction overhead without matching our workflow model
  - Less control over cost tracking and approval gates

- **Alternative C: AutoGen (Microsoft)** — Rejected because:
  - AutoGen is designed for conversational multi-agent systems
  - Our agents don't converse — they execute defined workflows
  - Heavy framework for our use case

- **Alternative D: Temporal + LLM calls** — Rejected because:
  - Temporal is excellent for workflow orchestration but adds infrastructure complexity
  - Could be reconsidered at scale (Phase 3+)

**Consequences:**
- **Positive:** Full control over agent behavior. Custom cost tracking. Custom approval gates. Custom configurator integration. No framework lock-in. Easier to debug.
- **Negative:** More code to write and maintain. No community plugins/extensions. Must implement retry logic, error handling, and monitoring ourselves.
- **Risks:** Building a robust agent system is complex — mitigated by keeping agents simple (defined workflows, not open-ended reasoning) and extensive testing.

---

## ADR-016: Resend for Transactional Email

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The application needs transactional email for: magic link authentication, team invitations, approval notifications, client report delivery, and alert notifications.

**Decision:**
Use **Resend** for all transactional email, with **React Email** for email templates.

**Alternatives Considered:**

- **Alternative A: SendGrid** — Rejected because:
  - SendGrid's developer experience is dated compared to Resend
  - Resend is built by the creator of React Email — tighter integration
  - SendGrid's pricing is less transparent

- **Alternative B: AWS SES** — Rejected because:
  - Requires AWS account and configuration
  - No built-in template system
  - Resend provides better DX with React Email integration

- **Alternative C: Postmark** — Considered viable but Resend chosen because:
  - Resend's React Email integration is superior for our Next.js stack
  - Resend has a more modern API
  - Both have excellent deliverability

**Consequences:**
- **Positive:** Excellent deliverability. React Email templates (JSX-based, type-safe). Simple API. Webhook support for delivery tracking.
- **Negative:** Newer service than SendGrid/Postmark — smaller track record.
- **Risks:** Minimal — Resend is backed by significant funding and growing rapidly.

---

## ADR-017: PostHog for Analytics & Feature Flags

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
The application needs product analytics (user behavior, feature usage, funnel analysis), feature flags (gradual rollouts, A/B testing), and session recording (debugging user issues). These are needed from Day 1 for dogfooding insights.

**Decision:**
Use **PostHog** (self-hosted or cloud) for product analytics, feature flags, and session recording.

**Alternatives Considered:**

- **Alternative A: Mixpanel + LaunchDarkly** — Rejected because:
  - Two separate services to manage
  - Higher combined cost
  - PostHog provides both in one platform

- **Alternative B: Google Analytics 4** — Rejected because:
  - GA4 is designed for marketing analytics, not product analytics
  - No feature flags
  - No session recording
  - Privacy concerns (data sent to Google)

- **Alternative C: Amplitude** — Rejected because:
  - More expensive than PostHog at our scale
  - No built-in feature flags or session recording
  - PostHog's open-source option provides more control

**Consequences:**
- **Positive:** All-in-one platform (analytics + feature flags + session recording). Open-source option available. Self-hostable for data privacy. Generous free tier.
- **Negative:** PostHog's UI is less polished than Mixpanel for complex analysis.
- **Risks:** Minimal — PostHog is well-funded and widely adopted.

---

## ADR-018: WebSocket via FastAPI for Real-Time Updates

**Status:** Accepted
**Date:** 2026-03-13

**Context:**
Agent tasks are long-running (minutes). Users need real-time progress updates, completion notifications, and live activity monitoring without polling.

**Decision:**
Use **FastAPI's native WebSocket support** for real-time communication. The Next.js frontend connects to the FastAPI WebSocket endpoint. Redis Pub/Sub is used for broadcasting events from Celery workers to WebSocket connections.

**Alternatives Considered:**

- **Alternative A: Socket.io** — Rejected because:
  - Socket.io is primarily a Node.js library
  - python-socketio exists but adds another dependency
  - FastAPI's native WebSocket support is sufficient
  - Socket.io's auto-reconnection and room management can be implemented with minimal custom code

- **Alternative B: Server-Sent Events (SSE)** — Rejected because:
  - SSE is unidirectional (server → client only)
  - We need bidirectional communication (client subscribes to channels)
  - SSE has connection limits in browsers (6 per domain)

- **Alternative C: Polling** — Rejected because:
  - Inefficient for frequent updates (agent progress every 1-2 seconds)
  - Higher server load
  - Poor user experience (delayed updates)

- **Alternative D: Pusher / Ably** — Rejected because:
  - Third-party dependency for real-time — adds cost and latency
  - FastAPI can handle WebSocket natively
  - At our scale (200-2,000 users), a managed service is unnecessary

**Consequences:**
- **Positive:** Native FastAPI support (no additional dependencies). Low latency. Bidirectional communication. Redis Pub/Sub enables broadcasting from any Celery worker.
- **Negative:** Must handle reconnection logic on the client side. WebSocket connections consume server resources (one connection per active user).
- **Risks:** WebSocket connections may be dropped by proxies/load balancers — mitigated by heartbeat pings and automatic reconnection on the client.

---

## PHASE 0 GATE: ADR.md

```
[x] ADR-001: Hybrid Architecture (Next.js + FastAPI)
[x] ADR-002: PostgreSQL as Primary Database
[x] ADR-003: Prisma + SQLAlchemy (dual ORM)
[x] ADR-004: Better Auth for Authentication
[x] ADR-005: Modular Monolith Architecture
[x] ADR-006: Stripe + Razorpay for Payments
[x] ADR-007: REST API Style
[x] ADR-008: Zustand + TanStack Query for State
[x] ADR-009: Tailwind CSS v4 for Styling
[x] ADR-010: shadcn/ui + Radix UI for Primitives
[x] ADR-011: LiteLLM for LLM Abstraction
[x] ADR-012: Celery + Redis for Task Queue
[x] ADR-013: DataForSEO as Primary Data Provider
[x] ADR-014: Vercel + Railway for Hosting
[x] ADR-015: Custom Agent Orchestration
[x] ADR-016: Resend for Transactional Email
[x] ADR-017: PostHog for Analytics & Feature Flags
[x] ADR-018: WebSocket via FastAPI for Real-Time
[ ] USER APPROVAL — Awaiting
```

---

> **Next**: WIREFRAMES.md → User approval of all Phase 0 docs
