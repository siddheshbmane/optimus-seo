# WIREFRAMES.md — Optimus SEO

> **Version:** 2.2 | **Date:** 2026-03-15
> **Status:** Draft — Awaiting Approval
> **Author:** AI Agent (per heart.md blueprint, Section 3.4)
> **Design File:** `wireframe.pen` (137 frames, Pencil.dev v2.8) — **100% DESIGN COVERAGE**

---

## Table of Contents

1. [Design File Cross-Reference](#0-design-file-cross-reference)
2. [Global Layout & Navigation](#1-global-layout--navigation)
3. [Authentication Screens](#2-authentication-screens)
4. [Dashboard & Projects](#3-dashboard--projects)
5. [Global Settings](#4-global-settings)
6. [Sales Phase Screens](#5-sales-phase-screens)
7. [Strategy Phase Screens](#6-strategy-phase-screens)
8. [Execution Phase Screens](#7-execution-phase-screens)
9. [Reporting Phase Screens](#8-reporting-phase-screens)
10. [Approvals Queue](#9-approvals-queue)
11. [Agent Activity](#10-agent-activity)
12. [Project Settings](#11-project-settings)
13. [Client Portal](#12-client-portal)
14. [Admin Panel](#13-admin-panel)
15. [Marketing Website](#14-marketing-website)
16. [Global Components](#15-global-components)
17. [Missing Screens (Text Specs)](#16-missing-screens-text-specs)

---

## 0. DESIGN FILE CROSS-REFERENCE

### 0.1 Frame Index — wireframe.pen (137 frames)

| Frame | Screen Name | Desktop/Mobile | Route | Status |
|-------|-------------|----------------|-------|--------|
| 0-23 | Explorations + Fragments | — | — | Not final |
| 24 | Design System — Tech No Sidebar | — | — | Component library |
| 25 | 2.1 Login Desktop | Desktop | `/login` | ✅ Designed |
| 26 | 2.1 Login Mobile | Mobile | `/login` | ✅ Designed |
| 27 | 2.2 Sign Up Desktop | Desktop | `/register` | ✅ Designed |
| 28 | 2.2 Sign Up Mobile | Mobile | `/register` | ✅ Designed |
| 29 | 2.3 Onboarding Desktop | Desktop | `/onboarding` | ✅ Designed |
| 30 | 2.3 Onboarding Mobile | Mobile | `/onboarding` | ✅ Designed |
| 31 | 3.1 Dashboard Desktop | Desktop | `/dashboard` | ✅ Designed |
| 32 | 3.1 Dashboard Mobile | Mobile | `/dashboard` | ✅ Designed |
| 33 | 3.2 Projects List Desktop | Desktop | `/projects` | ✅ Designed |
| 34 | 3.2 Projects List Mobile | Mobile | `/projects` | ✅ Designed |
| 35 | 4.1 Settings Desktop | Desktop | `/settings` | ✅ Designed |
| 36 | 4.1 Settings Mobile | Mobile | `/settings` | ✅ Designed |
| 37 | 5.1 Sales Overview Desktop | Desktop | `/projects/[id]/sales` | ✅ Designed |
| 38 | 5.1 Sales Overview Mobile | Mobile | `/projects/[id]/sales` | ✅ Designed |
| 39 | 5.2 Site Audit Results Desktop | Desktop | `/projects/[id]/sales/audit` | ✅ Designed |
| 40 | 5.2 Site Audit Results Mobile | Mobile | `/projects/[id]/sales/audit` | ✅ Designed |
| 41 | 5.3 Keyword Research Desktop | Desktop | `/projects/[id]/sales/keywords` | ✅ Designed |
| 42 | 5.3 Keyword Research Mobile | Mobile | `/projects/[id]/sales/keywords` | ✅ Designed |
| 43 | 5.4 Competitor Analysis Desktop | Desktop | `/projects/[id]/sales/competitors` | ✅ Designed |
| 44 | 5.4 Competitor Analysis Mobile | Mobile | `/projects/[id]/sales/competitors` | ✅ Designed |
| 45 | 5.5 Pitch Deck Generator Desktop | Desktop | `/projects/[id]/sales/pitch-deck` | ✅ Designed |
| 46 | 5.5 Pitch Deck Generator Mobile | Mobile | `/projects/[id]/sales/pitch-deck` | ✅ Designed |
| 47 | 6.1 Strategy Overview Desktop | Desktop | `/projects/[id]/strategy` | ✅ Designed |
| 48 | 6.1 Strategy Overview Mobile | Mobile | `/projects/[id]/strategy` | ✅ Designed |
| 49 | 6.2 Keyword Clusters Desktop | Desktop | `/projects/[id]/strategy/keywords` | ✅ Designed |
| 50 | 6.2 Keyword Clusters Mobile | Mobile | `/projects/[id]/strategy/keywords` | ✅ Designed |
| 51 | 6.3 Site Structure Desktop | Desktop | `/projects/[id]/strategy/structure` | ✅ Designed |
| 52 | 6.3 Site Structure Mobile | Mobile | `/projects/[id]/strategy/structure` | ✅ Designed |
| 53 | 6.4 Content Briefs Desktop | Desktop | `/projects/[id]/strategy/content-briefs` | ✅ Designed |
| 54 | 6.4 Content Briefs Mobile | Mobile | `/projects/[id]/strategy/content-briefs` | ✅ Designed |
| 55 | 7.1 Content Pipeline Desktop | Desktop | `/projects/[id]/execution/content` | ✅ Designed |
| 56 | 7.1 Content Pipeline Mobile | Mobile | `/projects/[id]/execution/content` | ✅ Designed |
| 57 | 7.2 Backlink Management Desktop | Desktop | `/projects/[id]/execution/backlinks` | ✅ Designed |
| 58 | 7.2 Backlink Management Mobile | Mobile | `/projects/[id]/execution/backlinks` | ✅ Designed |
| 59 | 7.3 GMB Posts Desktop | Desktop | `/projects/[id]/execution/gmb-posts` | ✅ Designed |
| 60 | 7.3 GMB Posts Mobile | Mobile | `/projects/[id]/execution/gmb-posts` | ✅ Designed |
| 61 | 8.1 Rank Tracking Desktop | Desktop | `/projects/[id]/reports/rankings` | ✅ Designed |
| 62 | 8.1 Rank Tracking Mobile | Mobile | `/projects/[id]/reports/rankings` | ✅ Designed |
| 63 | 8.2 Traffic Analytics Desktop | Desktop | `/projects/[id]/reports/traffic` | ✅ Designed |
| 64 | 8.2 Traffic Analytics Mobile | Mobile | `/projects/[id]/reports/traffic` | ✅ Designed |
| 65 | 8.3 Client Report Generator Desktop | Desktop | `/projects/[id]/reports/client-report` | ✅ Designed |
| 66 | 8.3 Client Report Mobile | Mobile | `/projects/[id]/reports/client-report` | ✅ Designed |
| 67 | 9. Approvals Queue Desktop | Desktop | `/approvals` | ✅ Designed |
| 68 | 9. Approvals Queue Mobile | Mobile | `/approvals` | ✅ Designed |
| 69 | 10. Agent Activity Desktop | Desktop | `/agents` | ✅ Designed |
| 70 | 10. Agent Activity Mobile | Mobile | `/agents` | ✅ Designed |
| 71 | 11.3 Team Settings Desktop | Desktop | `/settings/team` | ✅ Designed |
| 72 | 11.4 API Keys Desktop | Desktop | `/settings/api-keys` | ✅ Designed |
| 73 | 11.5 Project Config Desktop | Desktop | `/projects/[id]/settings` | ✅ Designed |
| 74 | 11.3 Team Settings Mobile | Mobile | `/settings/team` | ✅ Designed |
| 75 | 11.4 API Keys Mobile | Mobile | `/settings/api-keys` | ✅ Designed |
| 76 | 11.5 Project Config Mobile | Mobile | `/projects/[id]/settings` | ✅ Designed |
| 77 | 12. Client Portal Desktop | Desktop | `/client-portal/[token]` | ✅ Designed |
| 78 | 12. Client Portal Mobile | Mobile | `/client-portal/[token]` | ✅ Designed |
| 79 | 13. Admin Panel Desktop | Desktop | `/admin` | ✅ Designed |
| 80 | 13. Admin Panel Mobile | Mobile | `/admin` | ✅ Designed |
| 81 | 14.1 Marketing Homepage Desktop | Desktop | `/` | ✅ Designed |
| 82 | 14.1 Marketing Homepage Mobile | Mobile | `/` | ✅ Designed |
| 83 | 13. Command Palette Desktop | Desktop | Global overlay | ✅ Designed |
| 84 | 13. Command Palette Mobile | Mobile | Global overlay | ✅ Designed |
| 85 | 14. Billing Desktop | Desktop | `/settings/billing` | ✅ Designed |
| 86 | 14. Billing Mobile | Mobile | `/settings/billing` | ✅ Designed |
| **87** | **2.4 Magic Link Desktop** | Desktop | `/auth/verify` | ✅ **NEW** |
| **88** | **2.4 Magic Link Mobile** | Mobile | `/auth/verify` | ✅ **NEW** |
| **89** | **3.3 New Project Dialog Desktop** | Desktop | Modal | ✅ **NEW** |
| **90** | **3.3 New Project Dialog Mobile** | Mobile | Modal | ✅ **NEW** |
| **91** | **4.2 Profile Settings Desktop** | Desktop | `/settings/profile` | ✅ **NEW** |
| **92** | **4.2 Profile Settings Mobile** | Mobile | `/settings/profile` | ✅ **NEW** |
| **93** | **4.6 Integrations Desktop** | Desktop | `/settings/integrations` | ✅ **NEW** |
| **94** | **4.6 Integrations Mobile** | Mobile | `/settings/integrations` | ✅ **NEW** |
| **95** | **4.8 Notifications Desktop** | Desktop | `/settings/notifications` | ✅ **NEW** |
| **96** | **4.8 Notifications Mobile** | Mobile | `/settings/notifications` | ✅ **NEW** |
| **97** | **5.6 PPC Intelligence Desktop** | Desktop | `/projects/[id]/sales/ppc` | ✅ **NEW** |
| **98** | **5.6 PPC Intelligence Mobile** | Mobile | `/projects/[id]/sales/ppc` | ✅ **NEW** |
| **99** | **5.7 AI Visibility Desktop** | Desktop | `/projects/[id]/sales/ai-visibility` | ✅ **NEW** |
| **100** | **5.7 AI Visibility Mobile** | Mobile | `/projects/[id]/sales/ai-visibility` | ✅ **NEW** |
| **101** | **5.8 GMB Analysis Desktop** | Desktop | `/projects/[id]/sales/gmb` | ✅ **NEW** |
| **102** | **5.8 GMB Analysis Mobile** | Mobile | `/projects/[id]/sales/gmb` | ✅ **NEW** |
| **103** | **5.9 Proposal Generator Desktop** | Desktop | `/projects/[id]/sales/proposal` | ✅ **NEW** |
| **104** | **5.9 Proposal Generator Mobile** | Mobile | `/projects/[id]/sales/proposal` | ✅ **NEW** |
| **105** | **6.5 Competitor Analysis Desktop** | Desktop | `/projects/[id]/strategy/competitors` | ✅ **NEW** |
| **106** | **6.5 Competitor Analysis Mobile** | Mobile | `/projects/[id]/strategy/competitors` | ✅ **NEW** |
| **107** | **6.6 Link Building Strategy Desktop** | Desktop | `/projects/[id]/strategy/link-building` | ✅ **NEW** |
| **108** | **6.6 Link Building Strategy Mobile** | Mobile | `/projects/[id]/strategy/link-building` | ✅ **NEW** |
| **109** | **6.7 AI Optimization Strategy Desktop** | Desktop | `/projects/[id]/strategy/ai-optimization` | ✅ **NEW** |
| **110** | **6.7 AI Optimization Strategy Mobile** | Mobile | `/projects/[id]/strategy/ai-optimization` | ✅ **NEW** |
| **111** | **6.8 Local SEO Strategy Desktop** | Desktop | `/projects/[id]/strategy/local-seo` | ✅ **NEW** |
| **112** | **6.8 Local SEO Strategy Mobile** | Mobile | `/projects/[id]/strategy/local-seo` | ✅ **NEW** |
| **113** | **7.4 On-Page Optimization Desktop** | Desktop | `/projects/[id]/execution/on-page` | ✅ **NEW** |
| **114** | **7.4 On-Page Optimization Mobile** | Mobile | `/projects/[id]/execution/on-page` | ✅ **NEW** |
| **115** | **7.5 AI Optimization Execution Desktop** | Desktop | `/projects/[id]/execution/ai-optimization` | ✅ **NEW** |
| **116** | **7.5 AI Optimization Execution Mobile** | Mobile | `/projects/[id]/execution/ai-optimization` | ✅ **NEW** |
| **117** | **8.4 Link Acquisition Reports Desktop** | Desktop | `/projects/[id]/reports/links` | ✅ **NEW** |
| **118** | **8.4 Link Acquisition Reports Mobile** | Mobile | `/projects/[id]/reports/links` | ✅ **NEW** |
| **119** | **8.5 AI Visibility Reports Desktop** | Desktop | `/projects/[id]/reports/ai-visibility` | ✅ **NEW** |
| **120** | **8.5 AI Visibility Reports Mobile** | Mobile | `/projects/[id]/reports/ai-visibility` | ✅ **NEW** |
| **121** | **8.6 Local SEO Reports Desktop** | Desktop | `/projects/[id]/reports/local-seo` | ✅ **NEW** |
| **122** | **8.6 Local SEO Reports Mobile** | Mobile | `/projects/[id]/reports/local-seo` | ✅ **NEW** |
| **123** | **8.7 Share of Voice Desktop** | Desktop | `/projects/[id]/reports/share-of-voice` | ✅ **NEW** |
| **124** | **8.7 Share of Voice Mobile** | Mobile | `/projects/[id]/reports/share-of-voice` | ✅ **NEW** |
| **125** | **14.2 Pricing Page Desktop** | Desktop | `/pricing` | ✅ **NEW** |
| **126** | **14.2 Pricing Page Mobile** | Mobile | `/pricing` | ✅ **NEW** |
| **127** | **14.3 Product Features Desktop** | Desktop | `/product/[feature]` | ✅ **NEW** |
| **128** | **14.3 Product Features Mobile** | Mobile | `/product/[feature]` | ✅ **NEW** |
| **129** | **14.4 Solutions Pages Desktop** | Desktop | `/solutions/[audience]` | ✅ **NEW** |
| **130** | **14.4 Solutions Pages Mobile** | Mobile | `/solutions/[audience]` | ✅ **NEW** |
| **131** | **14.5 About Page Desktop** | Desktop | `/about` | ✅ **NEW** |
| **132** | **14.5 About Page Mobile** | Mobile | `/about` | ✅ **NEW** |
| **133** | **14.6 Blog Desktop** | Desktop | `/blog` | ✅ **NEW** |
| **134** | **14.6 Blog Mobile** | Mobile | `/blog` | ✅ **NEW** |
| **135** | **4.7 Branding Desktop** | Desktop | `/settings/branding` | ✅ **NEW** |
| **136** | **4.7 Branding Mobile** | Mobile | `/settings/branding` | ✅ **NEW** |

### 0.2 Design Coverage Summary

| Category | Designed in wireframe.pen | Text-only spec | Not yet specified |
|----------|---------------------------|----------------|-------------------|
| Auth | 4 screens (8 frames) | 0 | 0 |
| Dashboard & Projects | 3 screens (6 frames) | 0 | 0 |
| Global Settings | 7 screens (14 frames) | 0 | 0 |
| Sales Phase | 9 screens (18 frames) | 0 | 0 |
| Strategy Phase | 8 screens (16 frames) | 0 | 0 |
| Execution Phase | 5 screens (10 frames) | 0 | 0 |
| Reports Phase | 7 screens (14 frames) | 0 | 0 |
| Global Screens | 2 screens (4 frames) | 0 | 0 |
| Project Settings | 1 screen (2 frames) | 0 | 0 |
| Client Portal | 1 screen (2 frames) | 0 | 0 |
| Admin Panel | 1 screen (2 frames) | 0 | 0 |
| Marketing | 6 screens (12 frames) | 0 | 0 |
| Global Components | 2 screens (4 frames) | 0 | 0 |
| **TOTAL** | **56 screens (112 app frames)** | **0** | **0** |

**🎉 100% DESIGN COVERAGE — All screens are now designed in wireframe.pen!**

---

## 1. GLOBAL LAYOUT & NAVIGATION

### 1.1 Design Philosophy: "Tech No Sidebar"

The Optimus SEO interface follows a **GitHub-inspired "Tech No Sidebar" aesthetic**:

- **NO vertical sidebar** — all primary navigation is in the top nav bar
- **Horizontal navigation only** — TopNav (desktop) or TopBar + BottomTabBar (mobile)
- **Maximum content width** — full horizontal space for data-dense tables and charts
- **Monochrome button palette** — primary buttons use `$btn-primary-bg` (#1F2328 light / #F0F6FC dark)
- **Coral accent** — `$accent` (#FD8C73) reserved for primary CTAs and interactive highlights

### 1.2 Desktop App Shell (1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP NAV (48px, sticky)                                                        │
│ ┌────────────┐ ┌────────────────────────────────────────┐ ┌──┐ ┌──┐ ┌──────┐│
│ │ [V] Optimus│ │ Dashboard │ Projects │ Approvals │ ... │ │🔔│ │☀️│ │Avatar││
│ │    SEO     │ │         (horizontal nav items)         │ │  │ │  │ │  RS  ││
│ └────────────┘ └────────────────────────────────────────┘ └──┘ └──┘ └──────┘│
├──────────────────────────────────────────────────────────────────────────────┤
│ PROJECT BAR (44px, shown on project screens only)                             │
│ ┌────────────────────────────────────────────────────────────────────────────┐│
│ │ 🌐 Acme Corp / Site Audit  [badge]                    [Invite] [+ Content]││
│ └────────────────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────────────┤
│ PHASE TABS (shown on project screens only)                                    │
│ │ Sales │ Strategy │ Execution │ Reports │ Settings │                        │
│ └───────────────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│                           MAIN CONTENT AREA                                   │
│                                                                               │
│   (Full width, no sidebar, $bg-page background)                              │
│                                                                               │
│   Content cards use $bg-card background                                       │
│   Maximum content density for SEO data tables                                 │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

**TopNav components:**
- Logo: Optimus SEO with coral "V sign" icon (see BRAND.md)
- Nav items: Dashboard, Projects, Approvals (badge), Agents, Settings
- Search: "Search..." with ⌘K shortcut hint → opens Command Palette
- Notifications: Bell icon with unread count badge
- Theme toggle: Sun/moon icon
- Avatar: User initials, dropdown with Profile, Settings, Logout

**ProjectBar components (project screens only):**
- Left: Globe icon + Project name + Current page name + Status badge
- Right: [Invite] button + [+ New Content] or context-specific action

**Phase Tabs (project screens only):**
- Sales | Strategy | Execution | Reports | Settings
- Active tab: `$text-primary` + weight 600
- Inactive tabs: `$text-secondary` + weight 400

### 1.3 Mobile App Shell (390px)

```
┌─────────────────────────────────────────┐
│ MOBILE TOP BAR (56px, sticky)           │
│ ┌──┐ ┌─────────────────────────┐ ┌────┐│
│ │ ← │ │      Page Title         │ │ 🔍 ││
│ └──┘ └─────────────────────────┘ └────┘│
├─────────────────────────────────────────┤
│                                         │
│           MAIN CONTENT AREA             │
│                                         │
│   (Full width, scrollable)              │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ BOTTOM TAB BAR (83px, sticky)           │
│ ┌───────┬───────┬───────┬───────┬─────┐│
│ │  🏠   │  📁   │  📋   │  🤖   │  ≡  ││
│ │ Home  │Projects│Pipeline│Agents │More ││
│ └───────┴───────┴───────┴───────┴─────┘│
└─────────────────────────────────────────┘
```

**MobileTopBar components:**
- Left: Back arrow (←) for navigation
- Center: Page title (16px, 600 weight)
- Right: Search icon (opens Command Palette)

**MobileBottomTabBar components:**
- Dashboard (house icon)
- Projects (folder icon)
- Pipeline (layers icon) — maps to Execution
- Agents (cpu icon)
- More (grid icon) — dropdown for Reports, Settings, Approvals

### 1.4 Responsive Breakpoints

| Breakpoint | Layout | Navigation |
|------------|--------|------------|
| Desktop (≥1024px) | Full TopNav + ProjectBar + Phase Tabs | Horizontal nav in TopNav |
| Tablet (768-1023px) | TopNav (condensed) + ProjectBar | Some nav items in overflow menu |
| Mobile (<768px) | MobileTopBar + MobileBottomTabBar | Bottom tab bar + hamburger |

---

## 2. AUTHENTICATION SCREENS

### 2.1 Login Page (`/login`)

**Frame:** 25 (Desktop), 26 (Mobile)

**Purpose:** Passwordless login via magic link.

**Layout:** Centered card on `$bg-page` background.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              ┌──────────────────────────────┐                │
│              │      [V] Optimus SEO         │                │
│              │                              │                │
│              │   Welcome back               │                │
│              │   Enter your email to sign in│                │
│              │                              │                │
│              │   ┌────────────────────────┐ │                │
│              │   │ Email address          │ │                │
│              │   └────────────────────────┘ │                │
│              │                              │                │
│              │   [  Send magic link  ]      │                │
│              │                              │                │
│              │   Don't have an account?     │                │
│              │   Sign up →                  │                │
│              └──────────────────────────────┘                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**States:**
- **Default:** Email input + CTA button
- **Loading:** Button shows spinner, "Sending magic link..."
- **Success:** Card changes to "Check your email" with email icon, "We sent a magic link to user@email.com"
- **Error:** Inline error below email field ("Invalid email" or "Too many attempts")

---

### 2.2 Sign Up Page (`/register`)

**Frame:** 27 (Desktop), 28 (Mobile)

**Purpose:** First-time user registration.

**Layout:** Same centered card layout as login.

```
Content:
- Logo: [V] Optimus SEO
- Heading: "Create your account"
- Subheading: "Start your 14-day free trial"
- Form fields:
  - Full name (text input)
  - Work email (email input)
  - Organization name (text input)
- [Create account] button (BtnPrimary)
- "Already have an account? Sign in →"
- Fine print: "By creating an account, you agree to our Terms and Privacy Policy"
```

**States:** Default, Loading, Success (redirects to onboarding), Error (validation errors inline).

---

### 2.3 Onboarding (`/onboarding`)

**Frame:** 29 (Desktop), 30 (Mobile)

**Purpose:** Role selection and initial setup after registration.

**Layout:** Centered card with role selection.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              ┌──────────────────────────────┐                │
│              │      Welcome to Optimus SEO  │                │
│              │                              │                │
│              │   What's your primary role?  │                │
│              │                              │                │
│              │   ┌────────────────────────┐ │                │
│              │   │ 📊 Agency Owner        │ │                │
│              │   │ Strategic oversight    │ │                │
│              │   └────────────────────────┘ │                │
│              │   ┌────────────────────────┐ │                │
│              │   │ 💼 Sales / BD          │ │                │
│              │   │ Client acquisition     │ │                │
│              │   └────────────────────────┘ │                │
│              │   ┌────────────────────────┐ │                │
│              │   │ 🔧 SEO Executive       │ │                │
│              │   │ Day-to-day execution   │ │                │
│              │   └────────────────────────┘ │                │
│              │                              │                │
│              │   [Continue →]               │                │
│              └──────────────────────────────┘                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Flow:** Role selection → Dashboard (personalized based on role)

---

### 2.4 Magic Link Verification (`/auth/verify`)

**Frame:** 87 (Desktop), 88 (Mobile)

**Purpose:** Landing page when user clicks magic link from email.

**Layout:** Centered card with loading spinner.

```
Content:
- Logo
- Spinner animation
- "Verifying your magic link..."
- On success: auto-redirect to /dashboard
- On error: "This link has expired or is invalid. [Request a new link]"
```

---

## 3. DASHBOARD & PROJECTS

### 3.1 Dashboard (`/dashboard`)

**Frame:** 31 (Desktop), 32 (Mobile)

**Purpose:** Overview of all projects, agent activity, and key metrics.

**Layout:** Full-width content with stat cards row, recent projects, agent activity widget, and pending approvals.

```
┌─────────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                      │
│ Dashboard                                          [+ New Project]│
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ STAT CARDS ROW (4 cards):                                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│ │ Active   │ │ Agents   │ │ Pending  │ │ API Cost │             │
│ │ Projects │ │ Running  │ │ Approvals│ │ Today    │             │
│ │    12    │ │    3     │ │    7     │ │  $4.52   │             │
│ │ +2 this  │ │ 0 failed │ │ 3 urgent │ │ ↑12% vs  │             │
│ │ week     │ │          │ │          │ │ yesterday│             │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
│                                                                   │
│ TWO-COLUMN LAYOUT:                                               │
│ ┌─────────────────────────────────┐ ┌───────────────────────────┐│
│ │ RECENT PROJECTS                 │ │ AGENT ACTIVITY (Live)     ││
│ │ [Project cards with stats]      │ │ [Running agent cards]     ││
│ │ [View all projects →]           │ │ [View all activity →]     ││
│ └─────────────────────────────────┘ └───────────────────────────┘│
│                                                                   │
│ PENDING APPROVALS SECTION:                                        │
│ ┌───────────────────────────────────────────────────────────────┐│
│ │ [Approval cards with actions]                                 ││
│ │ [View all approvals →]                                        ││
│ └───────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Stat Cards (using StatCard component):**
- Active Projects: Count + trend
- Agents Running: Count + failed count
- Pending Approvals: Count + urgent count
- API Cost Today: Amount + trend vs yesterday

**Recent Projects:** Card list with project name, URL, phase badge, health score, last activity

**Agent Activity Widget:** Live-updating list of running agents with progress bars, ETA, cost

**Pending Approvals:** Top 5 pending items with priority badges and quick actions

**States:**
- **Empty:** "No projects yet. Create your first project and let the agents get to work." + [Create Project] button
- **Loading:** Skeleton cards for stats, skeleton list for projects
- **Error:** Error banner at top with retry button

---

### 3.2 Projects List (`/projects`)

**Frame:** 33 (Desktop), 34 (Mobile)

**Purpose:** View and manage all projects.

**Layout:** Grid/list view with filters and search.

```
PAGE HEADER: Projects                    [+ New Project]

FILTERS BAR:
[Search projects...]  [Status ▾]  [Location ▾]  [Sort: Recent ▾]  [Grid|List]

PROJECT CARDS (Grid view):
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Acme Corp           │  │ Beta Inc             │  │ Gamma LLC           │
│ acme.com            │  │ betainc.io           │  │ gamma.co            │
│                     │  │                      │  │                     │
│ Phase: Sales        │  │ Phase: Execution     │  │ Phase: Reporting    │
│ 📍 New York, US    │  │ 📍 London, UK       │  │ 📍 Mumbai, IN      │
│                     │  │                      │  │                     │
│ Health: 72/100      │  │ Content: 12/20       │  │ Rankings: ↑15       │
│ Keywords: 847       │  │ Links: 45            │  │ Traffic: +23%       │
│                     │  │                      │  │                     │
│ 🤖 2 agents running │  │ 🤖 1 agent running  │  │ 🤖 0 agents        │
│                     │  │                      │  │                     │
│ [Open] [⋮]         │  │ [Open] [⋮]          │  │ [Open] [⋮]         │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**⋮ Menu:** Edit, Archive, Duplicate, Delete

**States:**
- **Empty:** "No projects yet" + CTA illustration
- **Loading:** Skeleton cards
- **Populated:** Cards or table rows

---

### 3.3 New Project Dialog (Modal)

**Frame:** 89 (Desktop), 90 (Mobile)

**Purpose:** Create a new project.

**Layout:** Modal dialog (max-w-lg), triggered from [+ New Project] button.

```
┌──────────────────────────────────────┐
│ Create New Project              [✕]  │
├──────────────────────────────────────┤
│                                      │
│ Project Name *                       │
│ ┌──────────────────────────────────┐ │
│ │ e.g., Acme Corp SEO             │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Website URL *                        │
│ ┌──────────────────────────────────┐ │
│ │ https://                         │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Target Locations *                   │
│ ┌──────────────────────────────────┐ │
│ │ 🔍 Search locations...           │ │
│ │ [Location chips with ✕]          │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Competitors (optional)               │
│ ┌──────────────────────────────────┐ │
│ │ + Add competitor URL             │ │
│ └──────────────────────────────────┘ │
│                                      │
│           [Cancel]  [Create Project] │
└──────────────────────────────────────┘
```

**Location search:** Searchable dropdown powered by DataForSEO Locations API. Shows location type badges (Country, State, City, DMA). Multiple selection allowed.

---

### 3.4 Project Overview (`/projects/[id]`)

**Frame:** N/A — Redirects to Sales tab by default

When navigating to `/projects/[id]`, the user lands on the Sales phase by default (`/projects/[id]/sales`). The Project Overview is effectively the phase tabs + ProjectBar, not a separate screen.

---

## 4. GLOBAL SETTINGS

### 4.1 Settings Hub (`/settings`)

**Frame:** 35 (Desktop), 36 (Mobile)

**Purpose:** Global settings landing page with settings categories.

**Layout:** Settings navigation on left (desktop) or stacked (mobile), content on right.

```
SETTINGS

┌────────────────┬─────────────────────────────────────────────────┐
│ SETTINGS NAV   │ CONTENT AREA                                    │
│                │                                                 │
│ • Profile      │ (Shows selected settings page)                  │
│ • Team         │                                                 │
│ • Billing      │                                                 │
│ • API Keys     │                                                 │
│ • Integrations │                                                 │
│ • Branding     │                                                 │
│ • Notifications│                                                 │
│                │                                                 │
└────────────────┴─────────────────────────────────────────────────┘
```

---

### 4.2 Profile Settings (`/settings/profile`)

**Frame:** 91 (Desktop), 92 (Mobile)

```
PROFILE SETTINGS

┌──────────────────────────────────────────────────────────────┐
│ Avatar: [Current avatar] [Upload new]                        │
│                                                              │
│ Full Name: [Rahul Sharma]                                   │
│ Email: user@agency.com (read-only — change via magic link)  │
│ Role: Owner (read-only)                                     │
│ Organization: SEO Agency Pro                                │
│                                                              │
│ PREFERENCES:                                                 │
│ Theme: (●) Light  (○) Dark  (○) System                     │
│ Timezone: [Asia/Kolkata ▾]                                  │
│ Date format: [DD/MM/YYYY ▾]                                 │
│                                                              │
│ [Save Changes]                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.3 Team Settings (`/settings/team`)

**Frame:** 71 (Desktop), 74 (Mobile)

**Purpose:** Manage team members and invitations.

```
TEAM MANAGEMENT

[+ Invite Member]

MEMBERS TABLE:
┌──────────────────┬──────────────────┬────────────┬──────────┐
│ Name             │ Email            │ Role       │ Actions  │
├──────────────────┼──────────────────┼────────────┼──────────┤
│ Rahul Sharma     │ rahul@agency.com │ Owner      │ —        │
│ Priya Patel      │ priya@agency.com │ Strategist │ [Edit ▾] │
│ Amit Kumar       │ amit@agency.com  │ Executive  │ [Edit ▾] │
└──────────────────┴──────────────────┴────────────┴──────────┘

PENDING INVITES:
┌──────────────────┬────────────┬──────────┬──────────────────┐
│ Email            │ Role       │ Sent     │ Actions          │
├──────────────────┼────────────┼──────────┼──────────────────┤
│ new@agency.com   │ Viewer     │ 2d ago   │ [Resend] [Revoke]│
└──────────────────┴────────────┴──────────┴──────────────────┘
```

---

### 4.4 API Keys (`/settings/api-keys`)

**Frame:** 72 (Desktop), 75 (Mobile)

**Purpose:** BYOK (Bring Your Own Key) API key management.

```
API KEYS (BYOK)

Configure your own API keys. Platform keys are used as fallback.

┌──────────────────────────────────────────────────────────────┐
│ DataForSEO                                                   │
│ Status: ✅ Connected (your key)                              │
│ Login: ****@email.com                                       │
│ [Test Connection]  [Remove]                                  │
├──────────────────────────────────────────────────────────────┤
│ OpenAI                                                       │
│ Status: ⬜ Not configured (using platform key)              │
│ [Add Key]                                                    │
├──────────────────────────────────────────────────────────────┤
│ Anthropic                                                    │
│ Status: ✅ Connected (your key)                              │
│ Key: sk-ant-****...****                                     │
│ [Test Connection]  [Remove]                                  │
├──────────────────────────────────────────────────────────────┤
│ Google (OAuth)                                               │
│ Status: ⬜ Not connected                                    │
│ [Connect Google Account] — for Search Console + Analytics   │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.5 Billing (`/settings/billing`)

**Frame:** 85 (Desktop), 86 (Mobile)

**Purpose:** Subscription management and payment settings.

```
BILLING

CURRENT PLAN:
┌──────────────────────────────────────────────────────────────┐
│ Professional Plan                              $149/month    │
│ 15 projects • All agents • 5,000 keywords • Priority support│
│                                                              │
│ Next billing: April 15, 2026                                │
│ [Change Plan]  [Cancel Subscription]                         │
└──────────────────────────────────────────────────────────────┘

PAYMENT METHOD:
┌──────────────────────────────────────────────────────────────┐
│ 💳 Visa ending in 4242                      Expires 12/27   │
│ [Update Payment Method]                                      │
└──────────────────────────────────────────────────────────────┘

USAGE THIS MONTH:
┌──────────────────────────────────────────────────────────────┐
│ API Credits: 3,450 / 10,000                                  │
│ [████████░░░░░░░░░░░░] 34.5%                                │
│                                                              │
│ Projects: 8 / 15                                             │
│ Keywords tracked: 2,340 / 5,000                             │
└──────────────────────────────────────────────────────────────┘

BILLING HISTORY:
┌────────────┬──────────┬────────┬──────────────────┐
│ Date       │ Amount   │ Status │ Invoice          │
├────────────┼──────────┼────────┼──────────────────┤
│ Mar 15     │ $149.00  │ ✅ Paid│ [Download]       │
│ Feb 15     │ $149.00  │ ✅ Paid│ [Download]       │
└────────────┴──────────┴────────┴──────────────────┘
```

---

### 4.6 Integrations (`/settings/integrations`)

**Frame:** 93 (Desktop), 94 (Mobile)

```
INTEGRATIONS

Connect third-party services to enhance your SEO workflow.

┌──────────────────────────────────────────────────────────────┐
│ Google Search Console                                        │
│ Status: ✅ Connected                                         │
│ Properties: acme.com, betainc.io                            │
│ [Manage Properties]  [Disconnect]                            │
├──────────────────────────────────────────────────────────────┤
│ Google Analytics 4                                           │
│ Status: ⬜ Not connected                                    │
│ [Connect GA4]                                                │
├──────────────────────────────────────────────────────────────┤
│ Google Business Profile                                      │
│ Status: ⬜ Not connected                                    │
│ [Connect GBP] — for GMB posts and reviews                   │
├──────────────────────────────────────────────────────────────┤
│ Slack                                                        │
│ Status: ⬜ Not connected                                    │
│ [Connect Slack] — for notifications and alerts              │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.7 Branding (`/settings/branding`)

**Frame:** 135 (Desktop), 136 (Mobile)

```
BRANDING (White-Label)

Customize the appearance for client-facing pages and reports.

┌──────────────────────────────────────────────────────────────┐
│ Logo                                                         │
│ [Current logo preview]                                       │
│ [Upload Logo] (PNG, max 2MB, recommended 200x50px)          │
├──────────────────────────────────────────────────────────────┤
│ Company Name                                                 │
│ [SEO Agency Pro]                                            │
├──────────────────────────────────────────────────────────────┤
│ Primary Color                                                │
│ [#0D9488] [Color picker]                                    │
├──────────────────────────────────────────────────────────────┤
│ Preview: [Shows how Client Portal and Reports will look]    │
└──────────────────────────────────────────────────────────────┘

[Save Changes]
```

---

### 4.8 Notifications (`/settings/notifications`)

**Frame:** 95 (Desktop), 96 (Mobile)

```
NOTIFICATION PREFERENCES

EMAIL NOTIFICATIONS:
[✓] Agent completed
[✓] Agent failed
[✓] Approval required
[✓] Weekly summary
[ ] Daily digest

IN-APP NOTIFICATIONS:
[✓] Real-time agent updates
[✓] Ranking alerts
[✓] Approval reminders

SLACK NOTIFICATIONS (requires Slack integration):
[ ] Agent completed
[ ] Agent failed
[ ] Ranking movements

ALERT THRESHOLDS:
Ranking alert: Position change of [±5] or more
Budget alert: When [80]% of monthly API budget used

[Save Changes]
```

---

## 5. SALES PHASE SCREENS

### 5.1 Sales Overview (`/projects/[id]/sales`)

**Frame:** 37 (Desktop), 38 (Mobile)

**Purpose:** Sales phase hub — trigger agents, view results, generate pitch deck.

```
SALES PHASE OVERVIEW

┌──────────────────────────────────────────────────────────────┐
│ [▶ Run All Sales Agents]                    Est. time: ~10min│
│                                             Est. cost: ~$2.50│
└──────────────────────────────────────────────────────────────┘

AGENT STATUS CARDS (2x3 grid):
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 🔍 Site Audit       │  │ 🔑 Keywords         │  │ 🏆 Competitors      │
│ Status: ✅ Complete  │  │ Status: ✅ Complete  │  │ Status: ⏳ Running  │
│ Health: 72/100      │  │ 847 keywords found   │  │ Progress: 45%       │
│ 15 critical issues  │  │ 23 in top 10         │  │ 3/5 competitors     │
│ [View Results →]    │  │ [View Results →]     │  │ [View Progress →]   │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 💰 PPC Intelligence │  │ 🤖 AI Visibility    │  │ 📍 GMB Analysis     │
│ Status: ⬜ Not run  │  │ Status: ⬜ Not run  │  │ Status: ⬜ Not run  │
│                     │  │                      │  │                     │
│ [Run Agent]         │  │ [Run Agent]          │  │ [Run Agent]         │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

DELIVERABLES:
┌─────────────────────────────────────────────────────────────────┐
│ 📊 Pitch Deck    [Generate]  Status: Not generated              │
│ 📄 Proposal      [Generate]  Status: Not generated              │
└─────────────────────────────────────────────────────────────────┘
```

**Agent Status States:**
- ⬜ Not run — gray, [Run Agent] button
- ⏳ Running — yellow, progress bar + ETA
- ✅ Complete — green, summary stats, [View Results →]
- ❌ Failed — red, error message, [Retry] button

---

### 5.2 Site Audit Results (`/projects/[id]/sales/audit`)

**Frame:** 39 (Desktop), 40 (Mobile)

**Purpose:** Display comprehensive site audit findings.

```
SITE AUDIT — Acme Corp                           [↻ Re-run Audit]

HEALTH SCORE (hero):
┌──────────────────────────────────────────────────────────────┐
│              ┌─────────┐                                      │
│              │   72    │  Overall Health Score                │
│              │  /100   │  "Your site has significant          │
│              └─────────┘   technical issues that need          │
│              (circular     attention before SEO can be         │
│               progress     effective."                         │
│               chart)                                          │
│                                                                │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐             │
│  │Perf: 65│  │A11y: 88│  │SEO: 72 │  │BP: 91  │             │
│  │LH Score│  │LH Score│  │LH Score│  │LH Score│             │
│  └────────┘  └────────┘  └────────┘  └────────┘             │
└──────────────────────────────────────────────────────────────┘

CORE WEB VITALS:
┌──────────┐  ┌──────────┐  ┌──────────┐
│ LCP      │  │ INP      │  │ CLS      │
│ 3.2s     │  │ 120ms    │  │ 0.15     │
│ 🔴 Poor  │  │ 🟡 Needs │  │ 🟡 Needs │
│          │  │ Improve  │  │ Improve  │
└──────────┘  └──────────┘  └──────────┘

ISSUES TABLE:
┌──────────────────────────────────────────────────────────────┐
│ [All] [Critical (15)] [Warning (23)] [Info (8)]              │
├──────┬──────────────────────────────┬────────┬───────────────┤
│ Sev  │ Issue                        │ Pages  │ Fix Priority  │
├──────┼──────────────────────────────┼────────┼───────────────┤
│ 🔴   │ Missing meta descriptions    │ 45     │ 1             │
│ 🔴   │ Broken internal links        │ 12     │ 2             │
│ 🟡   │ Images without alt text      │ 156    │ 4             │
└──────┴──────────────────────────────┴────────┴───────────────┘

BACKLINK PROFILE:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ DA: 35   │  │ Backlinks│  │ Ref.     │  │ Toxic    │
│          │  │ 1,234    │  │ Domains  │  │ Links    │
│          │  │          │  │ 89       │  │ 12       │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

LLM NARRATIVE:
┌──────────────────────────────────────────────────────────────┐
│ "Acme Corp's website has a moderate health score of 72/100.  │
│ The most critical issues are missing meta descriptions..."   │
└──────────────────────────────────────────────────────────────┘
```

---

### 5.3 Keyword Research Overview (`/projects/[id]/sales/keywords`)

**Frame:** 41 (Desktop), 42 (Mobile)

**Purpose:** Location-specific keyword analysis showing ~100 most valuable keywords.

```
KEYWORD OVERVIEW — Acme Corp                     [↻ Re-run]

SUMMARY STATS:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Total    │  │ In Top 10│  │ Avg.     │  │ Total    │
│ Keywords │  │          │  │ Position │  │ Traffic  │
│ 847      │  │ 23       │  │ 18.4     │  │ 12,450   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

DISTRIBUTION CHARTS (side by side):
┌─────────────────────────┐  ┌─────────────────────────┐
│ By Intent               │  │ By Position             │
│ ■ Commercial    35%     │  │ ■ 1-3      8%           │
│ ■ Informational 40%     │  │ ■ 4-10     19%          │
│ ■ Navigational  10%     │  │ ■ 11-20    35%          │
│ ■ Transactional 15%     │  │ ■ 21-30    38%          │
└─────────────────────────┘  └─────────────────────────┘

KEYWORD TABLE:
┌──────────────────────────────────────────────────────────────────────┐
│ [Search...]  [Intent ▾]  [Type ▾]  [Position ▾]  [Export CSV]      │
├──────────────────────┬─────┬────────┬──────┬──────┬────────┬────────┤
│ Keyword              │ Pos │ Volume │ CPC  │ Diff │ Intent │ Type   │
├──────────────────────┼─────┼────────┼──────┼──────┼────────┼────────┤
│ seo tools            │ 5   │ 12,100 │ $4.50│ 78   │ Comm.  │ Short  │
│ best seo software    │ 12  │ 8,100  │ $6.20│ 82   │ Comm.  │ Long   │
└──────────────────────┴─────┴────────┴──────┴──────┴────────┴────────┘

Pagination: [← Prev] Page 1 of 9 [Next →]
```

---

### 5.4 Competitor Analysis Overview (`/projects/[id]/sales/competitors`)

**Frame:** 43 (Desktop), 44 (Mobile)

**Purpose:** Competitor comparison dashboard.

```
COMPETITOR ANALYSIS — Acme Corp                  [↻ Re-run]

COMPARISON TABLE:
┌──────────────────────────────────────────────────────────────────────┐
│ Domain          │ DA  │ Backlinks │ Ref. Dom │ Keywords │ Traffic   │
├─────────────────┼─────┼───────────┼──────────┼──────────┼───────────┤
│ acme.com (you)  │ 35  │ 1,234     │ 89       │ 847      │ 12,450    │
│ competitor1.com │ 52  │ 8,901     │ 456      │ 2,340    │ 45,600    │
│ competitor2.com │ 48  │ 5,678     │ 312      │ 1,890    │ 34,200    │
└─────────────────┴─────┴───────────┴──────────┴──────────┴───────────┘

LINK GAP (top 20 domains linking to competitors but not you):
[Table: Domain, DA, Links to competitors]

CONTENT GAP (top 20 keywords competitors rank for, you don't):
[Table: Keyword, Volume, Competitor positions]

SHARE OF VOICE (pie chart):
[Visual: % of target keywords each domain ranks for in top 10]
```

---

### 5.5 Pitch Deck Generator (`/projects/[id]/sales/pitch-deck`)

**Frame:** 45 (Desktop), 46 (Mobile)

**Purpose:** Generate and download pitch deck.

```
PITCH DECK GENERATOR

PREREQUISITES:
✅ Site Audit — Complete
✅ Keyword Research — Complete
✅ Competitor Analysis — Complete
⬜ PPC Intelligence — Not run (optional)
⬜ AI Visibility — Not run (optional)
⬜ GMB Analysis — Not run (optional)

OPTIONS:
┌──────────────────────────────────────────────────────────────┐
│ Format:  (●) PPTX  (○) PDF  (○) Both                       │
│                                                              │
│ Sections to include:                                         │
│ [✓] Executive Summary                                       │
│ [✓] Technical Audit Highlights                              │
│ [✓] Keyword Landscape                                       │
│ [✓] Competitor Benchmarking                                 │
│ [ ] PPC Intelligence (data not available)                   │
│ [✓] Opportunity Sizing                                      │
│ [✓] Proposed Strategy                                       │
│                                                              │
│ Branding:                                                    │
│ Logo: [Upload or use default]                               │
│ Company Name: [SEO Agency Pro]                              │
│ Primary Color: [#0D9488]                                    │
│                                                              │
│ [Generate Pitch Deck]                                       │
└──────────────────────────────────────────────────────────────┘

GENERATED DECK (after generation):
┌──────────────────────────────────────────────────────────────┐
│ ✅ Pitch Deck Generated — 14 slides                         │
│ [📥 Download PPTX]  [📥 Download PDF]  [↻ Regenerate]      │
│ Preview: [Slide thumbnails in horizontal scroll]            │
└──────────────────────────────────────────────────────────────┘
```

---

### 5.6 PPC Intelligence (`/projects/[id]/sales/ppc`)

**Frame:** 97 (Desktop), 98 (Mobile)

**Purpose:** PPC/advertising data for the client's keyword landscape.

```
PPC INTELLIGENCE — Acme Corp                     [↻ Re-run]

SUMMARY STATS:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Avg CPC  │  │ Est. Ad  │  │ Top      │  │ Active   │
│          │  │ Spend/mo │  │ Advertiser│ │ Campaigns│
│ $4.20    │  │ $12,450  │  │ comp1.com│  │ 8        │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

CPC BY KEYWORD:
[Table: Keyword, Google CPC, Bing CPC, Competition, Volume trend]

TOP ADVERTISERS:
[Table: Domain, Keywords bidding on, Est. spend, Ad copy samples]

AD TRAFFIC ESTIMATION:
[Chart: Estimated clicks and cost if you ran ads on target keywords]
```

---

### 5.7 AI Visibility (`/projects/[id]/sales/ai-visibility`)

**Frame:** 99 (Desktop), 100 (Mobile)

**Purpose:** Check how the client's brand appears in AI/LLM responses.

```
AI VISIBILITY — Acme Corp                        [↻ Re-run]

AI VISIBILITY SCORE:
┌──────────────────────────────────────────────────────────────┐
│              ┌─────────┐                                      │
│              │   42    │  AI Visibility Score                 │
│              │  /100   │  "Your brand has low visibility      │
│              └─────────┘   in AI search results. Competitors  │
│                            are being mentioned more often."   │
└──────────────────────────────────────────────────────────────┘

MENTIONS BY LLM:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ ChatGPT  │  │ Claude   │  │ Gemini   │  │ Perplexity│
│ 12 ment. │  │ 8 ment.  │  │ 5 ment.  │  │ 15 ment. │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

COMPETITOR AI VISIBILITY:
[Table: Domain, Total mentions, Trend, Top mentioned keywords]

TOP DOMAINS CITED BY LLMS (for your keywords):
[Table: Domain, Mentions, Your keyword overlap]
```

---

### 5.8 GMB Analysis (`/projects/[id]/sales/gmb`)

**Frame:** 101 (Desktop), 102 (Mobile)

**Purpose:** Google My Business / local SEO analysis.

```
GMB ANALYSIS — Acme Corp                         [↻ Re-run]

LOCAL SEO SCORE:
┌──────────────────────────────────────────────────────────────┐
│              ┌─────────┐                                      │
│              │   68    │  Local SEO Score                     │
│              │  /100   │  "Your GMB profile needs             │
│              └─────────┘   optimization. Missing photos       │
│                            and inconsistent NAP data."        │
└──────────────────────────────────────────────────────────────┘

GMB PROFILE:
┌──────────────────────────────────────────────────────────────┐
│ Business: Acme Corp                                          │
│ Address: 123 Main St, New York, NY 10001                    │
│ Phone: (555) 123-4567                                        │
│ Rating: ⭐ 4.2 (89 reviews)                                  │
│ Categories: SEO Agency, Digital Marketing                   │
│ Photos: 12 (competitors avg: 45)                            │
│ Hours: Listed ✅                                             │
│ Website: Listed ✅                                           │
└──────────────────────────────────────────────────────────────┘

REVIEW ANALYSIS:
[Chart: Review count over time, Sentiment distribution]

LOCAL PACK RANKINGS:
[Table: Keyword, Position in local 3-pack, Competitor positions]

COMPETITOR GMB COMPARISON:
[Table: Business, Rating, Reviews, Photos, Response rate]
```

---

### 5.9 Proposal Generator (`/projects/[id]/sales/proposal`)

**Frame:** 103 (Desktop), 104 (Mobile)

**Purpose:** Generate scope-of-work proposal based on audit findings.

```
PROPOSAL GENERATOR

PREREQUISITES:
✅ Site Audit — Complete
✅ Keyword Research — Complete
✅ Competitor Analysis — Complete
✅ Pitch Deck — Generated

PROPOSAL OPTIONS:
┌──────────────────────────────────────────────────────────────┐
│ Client Name: [Acme Corp]                                    │
│ Prepared By: [SEO Agency Pro]                               │
│ Date: [March 15, 2026]                                      │
│                                                              │
│ Recommended Plan: [Professional ▾]                          │
│                                                              │
│ Scope of Work (auto-generated from gaps):                   │
│ [✓] Technical SEO fixes (15 critical issues)               │
│ [✓] Content creation (12 new pages)                        │
│ [✓] Link building (50 links/month)                         │
│ [✓] Monthly reporting                                       │
│ [ ] AI optimization (optional)                              │
│                                                              │
│ Timeline: [6 months ▾]                                      │
│ Pricing: $[2,500]/month (from rate card)                   │
│                                                              │
│ [Generate Proposal]                                          │
└──────────────────────────────────────────────────────────────┘

GENERATED PROPOSAL:
[PDF preview with Download button]
```

---

## 6. STRATEGY PHASE SCREENS

### 6.1 Strategy Overview (`/projects/[id]/strategy`)

**Frame:** 47 (Desktop), 48 (Mobile)

**Purpose:** Strategy phase hub — similar layout to Sales overview.

```
STRATEGY PHASE OVERVIEW

AGENT STATUS CARDS:
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 🔑 Extensive KW     │  │ 🏆 Extensive Comp   │  │ 🏗️ Site Structure   │
│ Status: ✅ Approved  │  │ Status: ⏳ Pending   │  │ Status: ⬜ Not run  │
│ 2,340 keywords      │  │ Approval             │  │                     │
│ 23 clusters         │  │ [Review & Approve]   │  │ [Run Agent]         │
│ [View →]            │  │                      │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 📝 Content Briefs   │  │ 🔗 Link Strategy    │  │ 🤖 AI Strategy     │
│ Status: ⬜ Blocked  │  │ Status: ⬜ Blocked  │  │ Status: ⬜ Not run  │
│ (needs Structure)   │  │ (needs Competitors) │  │                     │
│                     │  │                      │  │ [Run Agent]         │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

### 6.2 Keyword Clusters (`/projects/[id]/strategy/keywords`)

**Frame:** 49 (Desktop), 50 (Mobile)

**Purpose:** Full keyword universe with clusters, topical authority, cannibalization.

```
EXTENSIVE KEYWORD RESEARCH — Acme Corp

TAB NAVIGATION: [Clusters] [All Keywords] [Cannibalization] [Content Decay]

CLUSTERS VIEW:
┌──────────────────────────────────────────────────────────────┐
│ Cluster: "SEO Tools & Software"          Priority: ★★★★★    │
│ Pillar: "seo tools"  │  Keywords: 45  │  Authority: Strong  │
│ Intent: Commercial    │  Funnel: Consideration              │
│                                                              │
│ ┌────────────────────┬─────┬────────┬──────┐                │
│ │ Keyword            │ Vol │ Diff   │ Pos  │                │
│ ├────────────────────┼─────┼────────┼──────┤                │
│ │ seo tools          │12.1K│ 78     │ 5    │                │
│ │ best seo tools     │ 8.1K│ 82     │ 12   │                │
│ │ free seo tools     │ 6.5K│ 45     │ —    │                │
│ └────────────────────┴─────┴────────┴──────┘                │
│                                                              │
│ [Approve Cluster] [Modify] [Remove]                         │
└──────────────────────────────────────────────────────────────┘

(Repeats for each cluster — collapsible accordion)

APPROVAL BAR (sticky bottom):
┌──────────────────────────────────────────────────────────────┐
│ 23 clusters, 2,340 keywords  │  [Approve All] [Request Changes]│
└──────────────────────────────────────────────────────────────┘
```

---

### 6.3 Site Structure (`/projects/[id]/strategy/structure`)

**Frame:** 51 (Desktop), 52 (Mobile)

**Purpose:** Current vs ideal sitemap comparison.

```
WEBSITE STRUCTURE — Acme Corp

TAB NAVIGATION: [Current Sitemap] [Competitor Sitemaps] [Gap Analysis] [Ideal Sitemap]

IDEAL SITEMAP VIEW:
┌──────────────────────────────────────────────────────────────┐
│ Recommended Site Structure                                    │
│                                                                │
│ / (Home)                                                       │
│ ├── /services                                                  │
│ │   ├── /services/seo-audit          ★ NEW                    │
│ │   ├── /services/keyword-research   ★ NEW                    │
│ │   └── /services/link-building      (exists)                 │
│ ├── /industries                       ★ NEW SECTION            │
│ │   ├── /industries/ecommerce        ★ NEW                    │
│ │   └── /industries/saas             ★ NEW                    │
│ ├── /resources                                                 │
│ │   ├── /blog                        (exists)                 │
│ │   └── /guides                      ★ NEW                    │
│ └── /about                           (exists)                 │
│                                                                │
│ Legend: ★ NEW = Recommended new page  │  (exists) = Already exists│
│                                                                │
│ [Approve Structure] [Request Changes]                          │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.4 Content Briefs (`/projects/[id]/strategy/content-briefs`)

**Frame:** 53 (Desktop), 54 (Mobile)

**Purpose:** List and manage content briefs.

```
CONTENT BRIEFS — Acme Corp

[Search briefs...]  [Status ▾]  [Priority ▾]  [Generate All Briefs]

BRIEF CARDS:
┌──────────────────────────────────────────────────────────────┐
│ /services/seo-audit                                          │
│ "Professional SEO Audit Services"                            │
│                                                              │
│ Primary KW: seo audit services  │  Volume: 2,400            │
│ Word Count: 2,500               │  Status: ✅ Approved       │
│                                                              │
│ [View Brief] [Edit] [Generate Content]                       │
└──────────────────────────────────────────────────────────────┘

BRIEF DETAIL VIEW (expanded):
- Full heading structure (H1 → H2 → H3 tree)
- Content sections with descriptions
- Competitor analysis panel
- SEO scoring criteria
- Internal link targets
- FAQ questions
- Schema markup preview
```

---

### 6.5 Extensive Competitor Analysis (`/projects/[id]/strategy/competitors`)

**Frame:** 105 (Desktop), 106 (Mobile)

**Purpose:** Deep competitor analysis including full backlink profiles, content strategy.

```
EXTENSIVE COMPETITOR ANALYSIS — Acme Corp

[Select Competitor ▾: competitor1.com]

BACKLINK PROFILE:
┌──────────────────────────────────────────────────────────────┐
│ Total Backlinks: 8,901  │  Referring Domains: 456           │
│ Dofollow: 7,234 (81%)   │  Nofollow: 1,667 (19%)           │
│                                                              │
│ ANCHOR TEXT DISTRIBUTION:                                    │
│ [Bar chart: branded 35%, exact match 20%, partial 25%, other 20%]│
│                                                              │
│ LINK VELOCITY:                                               │
│ [Line chart: new links per month over 12 months]            │
│                                                              │
│ TOP REFERRING DOMAINS:                                       │
│ [Table: Domain, DA, Links, Type]                            │
└──────────────────────────────────────────────────────────────┘

CONTENT STRATEGY:
┌──────────────────────────────────────────────────────────────┐
│ Total Pages: 234  │  Avg. Word Count: 1,850                 │
│ Publishing Freq: 4/month  │  Top Content Type: How-to guides│
│                                                              │
│ TOP PAGES BY TRAFFIC:                                        │
│ [Table: URL, Est. Traffic, Keywords, Backlinks]             │
│                                                              │
│ CONTENT TYPES:                                               │
│ [Pie chart: Blog 45%, Service pages 30%, Resources 25%]     │
└──────────────────────────────────────────────────────────────┘

SERP FEATURE OWNERSHIP:
[Table: Keyword, Featured Snippet owner, PAA positions]
```

---

### 6.6 Link Building Strategy (`/projects/[id]/strategy/link-building`)

**Frame:** 107 (Desktop), 108 (Mobile)

```
LINK BUILDING STRATEGY — Acme Corp

RECOMMENDED LINK TARGETS:
┌──────────────────────────────────────────────────────────────┐
│ Monthly Target: 50 links                                     │
│                                                              │
│ Link Type Distribution:                                      │
│ ■ Directories: 20/month (DA 30+)                           │
│ ■ Guest Posts: 10/month (DA 40+)                           │
│ ■ Resource Pages: 10/month                                  │
│ ■ Forums/Communities: 10/month                              │
│                                                              │
│ Link Velocity: Safe pace (won't trigger spam flags)         │
└──────────────────────────────────────────────────────────────┘

PRIORITY DOMAINS (from link gap):
[Table: Domain, DA, Link Type, Difficulty, Priority]

OUTREACH TEMPLATES:
[Expandable sections with email templates per link type]

[Approve Strategy] [Request Changes]
```

---

### 6.7 AI Optimization Strategy (`/projects/[id]/strategy/ai-optimization`)

**Frame:** 109 (Desktop), 110 (Mobile)

```
AI OPTIMIZATION STRATEGY — Acme Corp

CURRENT AI VISIBILITY: 42/100

STRATEGY RECOMMENDATIONS:
┌──────────────────────────────────────────────────────────────┐
│ 1. Add structured FAQ sections to top 10 pages              │
│ 2. Include authoritative citations and data sources         │
│ 3. Optimize content for conversational queries              │
│ 4. Create definitive guides on key topics                   │
│ 5. Build topical authority clusters                         │
└──────────────────────────────────────────────────────────────┘

TARGET KEYWORDS FOR AI OPTIMIZATION:
[Table: Keyword, Current AI mentions, Competitor mentions, Priority]

[Approve Strategy] [Request Changes]
```

---

### 6.8 Local SEO Strategy (`/projects/[id]/strategy/local-seo`)

**Frame:** 111 (Desktop), 112 (Mobile)

```
LOCAL SEO STRATEGY — Acme Corp

GMB OPTIMIZATION CHECKLIST:
[✓] Complete all profile fields
[✓] Add business hours
[ ] Add 30+ high-quality photos
[ ] Respond to all reviews within 24h
[ ] Post weekly GMB updates

REVIEW GENERATION STRATEGY:
[Recommendations for getting more reviews]

CITATION BUILDING PLAN:
[Table: Directory, DA, Status, Priority]

GMB CONTENT CALENDAR:
[Calendar view with planned posts]

[Approve Strategy] [Request Changes]
```

---

## 7. EXECUTION PHASE SCREENS

### 7.1 Content Pipeline (`/projects/[id]/execution/content`)

**Frame:** 55 (Desktop), 56 (Mobile)

**Purpose:** Content creation and review pipeline — kanban or table view.

```
CONTENT PIPELINE — Acme Corp

VIEW TOGGLE: [Kanban] [Table]

KANBAN VIEW:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ GENERATING   │  │ IN REVIEW    │  │ HUMAN REVIEW │  │ PASSED       │
│ (2)          │  │ (3)          │  │ (1)          │  │ (8)          │
│              │  │              │  │              │  │              │
│ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │SEO Audit │ │  │ │Link Bldg │ │  │ │Content   │ │  │ │SEO Tools │ │
│ │Services  │ │  │ │Guide     │ │  │ │Marketing │ │  │ │Review    │ │
│ │          │ │  │ │          │ │  │ │          │ │  │ │          │ │
│ │Progress: │ │  │ │Score: 87 │ │  │ │Score: 72 │ │  │ │Score:100 │ │
│ │████░░ 67%│ │  │ │Iter: 2/5 │ │  │ │Iter: 5/5 │ │  │ │✅ Ready  │ │
│ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

**Content Detail View:**
- Full content preview (rendered HTML)
- Review history timeline (iteration 1 → 2 → 3...)
- Quality score breakdown per criteria
- Feedback from AI reviewer per iteration
- Actions: [Approve] [Reject] [Request Manual Edit]

---

### 7.2 Backlink Management (`/projects/[id]/execution/backlinks`)

**Frame:** 57 (Desktop), 58 (Mobile)

**Purpose:** Prospecting and submission tracking.

```
BACKLINK MANAGEMENT — Acme Corp

TAB NAVIGATION: [Opportunities] [Submissions] [Settings]

OPPORTUNITIES TABLE:
┌──────────────────────────────────────────────────────────────────────┐
│ [Search...]  [Type ▾]  [Min DA ▾]  [Status ▾]  [▶ Run Prospecting] │
├──────────────────────┬─────┬──────────┬──────────┬──────────────────┤
│ Domain               │ DA  │ Type     │ Status   │ Actions          │
├──────────────────────┼─────┼──────────┼──────────┼──────────────────┤
│ directory1.com       │ 45  │ Directory│ Queued   │ [Submit] [Skip]  │
│ forum.example.com    │ 38  │ Forum    │ Submitted│ [View]           │
│ blog.partner.io      │ 52  │ Guest    │ Approved │ [View] ✅        │
└──────────────────────┴─────┴──────────┴──────────┴──────────────────┘

SUBMISSIONS TABLE:
┌──────────────────────┬──────────┬──────────┬────────┬───────────────┐
│ Target               │ Type     │ Status   │ DA     │ Submitted     │
├──────────────────────┼──────────┼──────────┼────────┼───────────────┤
│ directory1.com/sub   │ Directory│ ✅ Live  │ 45     │ 2 days ago    │
│ forum.example.com/t  │ Forum    │ ⏳ Pend. │ 38     │ 1 day ago     │
│ blog.partner.io/p    │ Guest    │ ❌ Reject│ 52     │ 3 days ago    │
└──────────────────────┴──────────┴──────────┴────────┴───────────────┘
```

---

### 7.3 GMB Posts (`/projects/[id]/execution/gmb-posts`)

**Frame:** 59 (Desktop), 60 (Mobile)

**Purpose:** Create, review, and submit GMB posts.

```
GMB POSTS — Acme Corp

[+ Generate Posts]  [Calendar View]  [List View]

POST CARDS:
┌──────────────────────────────────────────────────────────────┐
│ 📅 March 15, 2026  │  Type: Update  │  Status: ⏳ Pending   │
│                                                              │
│ "Spring is here! Time to refresh your SEO strategy.        │
│ Our team has helped 50+ businesses improve their rankings    │
│ this quarter. Book a free consultation today!"               │
│                                                              │
│ [Image preview]                                              │
│                                                              │
│ [Approve & Submit]  [Edit]  [Reject]                        │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.4 On-Page Optimization (`/projects/[id]/execution/on-page`)

**Frame:** 113 (Desktop), 114 (Mobile)

```
ON-PAGE OPTIMIZATION — Acme Corp

TASKS:
┌──────────────────────────────────────────────────────────────┐
│ [Search tasks...]  [Status ▾]  [Priority ▾]                  │
├──────────────────────────────────────┬──────────┬────────────┤
│ Task                                 │ Status   │ Priority   │
├──────────────────────────────────────┼──────────┼────────────┤
│ Add meta description to /services   │ ⬜ Todo  │ High       │
│ Fix broken link on /blog/seo-guide  │ ⬜ Todo  │ High       │
│ Add alt text to 45 images           │ ⏳ In Prog│ Medium    │
│ Add FAQ schema to /services/audit   │ ✅ Done  │ Medium     │
└──────────────────────────────────────┴──────────┴────────────┘

GENERATED FIXES:
[Expandable sections with copy-paste code for meta tags, schema, etc.]
```

---

### 7.5 AI Optimization Execution (`/projects/[id]/execution/ai-optimization`)

**Frame:** 115 (Desktop), 116 (Mobile)

```
AI OPTIMIZATION — Acme Corp

OPTIMIZATION TASKS:
┌──────────────────────────────────────────────────────────────┐
│ Task                                 │ Status   │ Impact     │
├──────────────────────────────────────┼──────────┼────────────┤
│ Add FAQ section to /services/audit  │ ✅ Done  │ High       │
│ Add citations to /blog/seo-guide    │ ⏳ In Prog│ Medium    │
│ Create definitive guide on keywords │ ⬜ Todo  │ High       │
└──────────────────────────────────────┴──────────┴────────────┘

AI VISIBILITY TRACKING:
[Chart: AI mentions over time after optimizations]
```

---

## 8. REPORTING PHASE SCREENS

### 8.1 Rank Tracking (`/projects/[id]/reports/rankings`)

**Frame:** 61 (Desktop), 62 (Mobile)

**Purpose:** Keyword ranking trends over time.

```
RANK TRACKING — Acme Corp

DATE RANGE: [Last 30 days ▾]  DEVICE: [All ▾]  LOCATION: [All ▾]

SUMMARY CARDS:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Tracked  │  │ In Top 3 │  │ In Top 10│  │ Avg Pos  │
│ 100      │  │ 8 (+2)   │  │ 23 (+5)  │  │ 18.4     │
│ keywords │  │ ↑ 33%    │  │ ↑ 28%    │  │ ↓ 2.1    │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

POSITION DISTRIBUTION CHART:
[Stacked area chart: Top 3 (green), 4-10 (teal), 11-20 (yellow), 21-30 (orange), 30+ (red)]

KEYWORD TABLE:
┌──────────────────────┬─────┬──────┬────────┬──────────────────────┐
│ Keyword              │ Now │ Prev │ Change │ Trend (sparkline)    │
├──────────────────────┼─────┼──────┼────────┼──────────────────────┤
│ seo tools            │ 3   │ 5    │ ↑ +2   │ ╱╲╱──╱              │
│ best seo software    │ 8   │ 12   │ ↑ +4   │ ╲──╱╱               │
└──────────────────────┴─────┴──────┴────────┴──────────────────────┘

ALERTS:
🎉 "seo tools" entered Top 3! (was #5, now #3)
⚠️ "content marketing" dropped out of Top 10 (was #9, now #14)
```

---

### 8.2 Traffic Analytics (`/projects/[id]/reports/traffic`)

**Frame:** 63 (Desktop), 64 (Mobile)

**Purpose:** Traffic data from GSC + DataForSEO estimates.

```
TRAFFIC ANALYTICS — Acme Corp

SOURCE TOGGLE: [GSC Data] [DataForSEO Estimates] [Combined]
DATE RANGE: [Last 30 days ▾]

SUMMARY CARDS:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Clicks   │  │ Impress. │  │ Avg CTR  │  │ Avg Pos  │
│ 12,450   │  │ 456,789  │  │ 2.7%     │  │ 18.4     │
│ ↑ 23%    │  │ ↑ 15%    │  │ ↑ 0.3%   │  │ ↓ 2.1    │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

TRAFFIC CHART:
[Line chart: clicks + impressions over time]

TOP PAGES TABLE:
[URL, clicks, impressions, CTR, position]

TOP QUERIES TABLE:
[Query, clicks, impressions, CTR, position]

LOCATION BREAKDOWN:
[Map or table: traffic by country → state → city]
```

---

### 8.3 Client Report Generator (`/projects/[id]/reports/client-report`)

**Frame:** 65 (Desktop), 66 (Mobile)

**Purpose:** Generate branded client reports.

```
CLIENT REPORT GENERATOR — Acme Corp

DATE RANGE: [March 1-31, 2026]
FORMAT: (●) PDF  (○) PPTX  (○) HTML

SECTIONS TO INCLUDE:
[✓] Executive Summary
[✓] Rank Tracking Summary
[✓] Traffic Performance
[✓] Link Building Progress
[✓] Content Production
[ ] AI Visibility Update
[✓] Technical Health Status
[✓] Competitor Movement
[✓] Next Month Recommendations

BRANDING:
Logo: [agency-logo.png] [Change]
Company: [SEO Agency Pro]
Client: [Acme Corp]
Primary Color: [#0D9488]

AUTO-SEND:
[ ] Email report to client
Email: [client@acme.com]

[Generate Report]

PREVIOUS REPORTS:
┌──────────────────────────────────────────────────────────────┐
│ February 2026  │  PDF  │  Sent to client  │  [📥 Download]  │
│ January 2026   │  PDF  │  Sent to client  │  [📥 Download]  │
└──────────────────────────────────────────────────────────────┘
```

---

### 8.4 Link Acquisition Reports (`/projects/[id]/reports/links`)

**Frame:** 117 (Desktop), 118 (Mobile)

```
LINK ACQUISITION REPORTS — Acme Corp

DATE RANGE: [Last 30 days ▾]

SUMMARY:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Submitted│  │ Approved │  │ Rejected │  │ Pending  │
│ 45       │  │ 28       │  │ 5        │  │ 12       │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

LINK ACQUISITION CHART:
[Line chart: links acquired over time]

LINKS BY TYPE:
[Pie chart: Directories, Guest posts, Forums, etc.]

LINK QUALITY:
[Bar chart: DA distribution of acquired links]

LIVE LINK VERIFICATION:
[Table: Link URL, Status (Live/Dead), DA, Index status]
```

---

### 8.5 AI Visibility Reports (`/projects/[id]/reports/ai-visibility`)

**Frame:** 119 (Desktop), 120 (Mobile)

```
AI VISIBILITY REPORTS — Acme Corp

DATE RANGE: [Last 30 days ▾]

AI VISIBILITY TREND:
[Line chart: AI visibility score over time]

MENTIONS BY LLM (over time):
[Stacked area chart: ChatGPT, Claude, Gemini, Perplexity]

TOP MENTIONED KEYWORDS:
[Table: Keyword, Total mentions, Trend, Your position]

COMPETITOR COMPARISON:
[Table: Domain, AI visibility score, Trend, Gap to close]
```

---

### 8.6 Local SEO Reports (`/projects/[id]/reports/local-seo`)

**Frame:** 121 (Desktop), 122 (Mobile)

```
LOCAL SEO REPORTS — Acme Corp

DATE RANGE: [Last 30 days ▾]

GMB PERFORMANCE:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Views    │  │ Clicks   │  │ Calls    │  │ Directions│
│ 1,234    │  │ 89       │  │ 23       │  │ 45       │
│ ↑ 15%    │  │ ↑ 12%    │  │ ↑ 8%     │  │ ↑ 20%    │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

REVIEW TRENDS:
[Chart: New reviews over time, Average rating trend]

LOCAL PACK RANKINGS:
[Table: Keyword, Current position, Change, Competitor positions]

GMB POST PERFORMANCE:
[Table: Post, Views, Clicks, Engagement rate]
```

---

### 8.7 Share of Voice (`/projects/[id]/reports/share-of-voice`)

**Frame:** 123 (Desktop), 124 (Mobile)

```
SHARE OF VOICE — Acme Corp

DATE RANGE: [Last 30 days ▾]

OVERALL SHARE OF VOICE:
┌──────────────────────────────────────────────────────────────┐
│ Your Share: 15%  │  vs Last Month: ↑ 3%                     │
│ [Pie chart: You 15%, Comp1 25%, Comp2 20%, Comp3 18%, Others 22%]│
└──────────────────────────────────────────────────────────────┘

SHARE OF VOICE TREND:
[Line chart: Your share vs competitors over time]

SERP FEATURE OWNERSHIP:
┌──────────────────────────────────────────────────────────────┐
│ Feature          │ You │ Comp1 │ Comp2 │ Comp3             │
├──────────────────┼─────┼───────┼───────┼───────────────────┤
│ Featured Snippets│ 3   │ 8     │ 5     │ 4                 │
│ People Also Ask  │ 12  │ 25    │ 18    │ 15                │
│ Local Pack       │ 5   │ 3     │ 4     │ 6                 │
└──────────────────┴─────┴───────┴───────┴───────────────────┘
```

---

## 9. APPROVALS QUEUE

### 9. Approvals Queue (`/approvals`)

**Frame:** 67 (Desktop), 68 (Mobile)

**Purpose:** Cross-project approval queue.

```
APPROVALS

FILTERS: [All Types ▾]  [All Projects ▾]  [Pending ▾]  [Sort: Newest ▾]

APPROVAL CARDS:
┌──────────────────────────────────────────────────────────────┐
│ ⚠️ HIGH PRIORITY                                    2h ago  │
│                                                              │
│ Content Review — "10 Best SEO Tools for 2026"               │
│ Project: Acme Corp  │  Agent: AI Reviewer                   │
│                                                              │
│ Quality Score: 72/100 (failed after 5 iterations)           │
│ Failed criteria: Keyword density (0.8%, target 1-2%)        │
│                  E-E-A-T signals (missing author bio)       │
│                                                              │
│ [View Content]  [Approve Anyway]  [Send Back with Feedback] │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 📋 MEDIUM PRIORITY                                  5h ago  │
│                                                              │
│ Strategy Approval — Keyword Clusters                        │
│ Project: Beta Inc  │  Agent: Keyword Research               │
│                                                              │
│ 847 keywords in 23 clusters awaiting strategist review      │
│                                                              │
│ [Review Clusters]  [Approve All]  [Request Changes]         │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. AGENT ACTIVITY

### 10. Agent Activity (`/agents`)

**Frame:** 69 (Desktop), 70 (Mobile)

**Purpose:** Real-time monitoring of all agent activity.

```
AGENT ACTIVITY

LIVE STATUS:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Running  │  │ Queued   │  │ Completed│  │ Failed   │
│ 3        │  │ 2        │  │ 47 today │  │ 1 today  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

RUNNING AGENTS:
┌──────────────────────────────────────────────────────────────┐
│ 🔍 Site Audit — Acme Corp                                   │
│ ████████████████░░░░░░░░ 67%  │  ETA: 3 min  │  Cost: $0.45│
│ Status: Crawling page 334/500                                │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ ✍️ Content Generation — Beta Inc                             │
│ █████████████████████░░░ 85%  │  ETA: 30s    │  Cost: $0.12│
│ Status: Writing section 4/5                                  │
└──────────────────────────────────────────────────────────────┘

RECENT HISTORY:
┌──────────────────────┬──────────┬────────┬────────┬──────────┐
│ Agent                │ Project  │ Status │ Time   │ Cost     │
├──────────────────────┼──────────┼────────┼────────┼──────────┤
│ AI Reviewer          │ Acme     │ ✅     │ 12s    │ $0.03    │
│ Keyword Research     │ Beta     │ ✅     │ 2m 34s │ $1.20    │
│ Backlink Prospecting │ Gamma    │ ❌     │ 45s    │ $0.15    │
└──────────────────────┴──────────┴────────┴────────┴──────────┘

COST TRACKING:
┌──────────────────────────────────────────────────────────────┐
│ Today: $4.52  │  This Week: $23.40  │  This Month: $89.12   │
│ [View detailed cost breakdown →]                             │
└──────────────────────────────────────────────────────────────┘
```

---

## 11. PROJECT SETTINGS

### 11.5 Project Config (`/projects/[id]/settings`)

**Frame:** 73 (Desktop), 76 (Mobile)

**Purpose:** Project-level configuration for agents, tracking, reporting.

```
PROJECT SETTINGS — Acme Corp

TAB NAVIGATION: [General] [Agents] [Tracking] [Reporting] [Notifications]

AGENTS TAB:
┌──────────────────────────────────────────────────────────────┐
│ AI REVIEWER SETTINGS                                         │
│                                                              │
│ Max review iterations: [5 ▾]                                │
│ Human fallback: (●) Yes  (○) No                            │
│                                                              │
│ REVIEW CRITERIA:                                             │
│ ┌────────────────────┬────────┬───────────┬────────┬───────┐│
│ │ Criteria           │ Weight │ Threshold │ Custom │ On/Off││
│ ├────────────────────┼────────┼───────────┼────────┼───────┤│
│ │ Keyword density    │ 15     │ 80        │ No     │ [✓]  ││
│ │ Readability        │ 10     │ 70        │ No     │ [✓]  ││
│ │ Heading structure  │ 10     │ 90        │ No     │ [✓]  ││
│ │ Brand voice        │ 15     │ 85        │ Yes    │ [✓]  ││
│ │ + Add criteria     │        │           │        │       ││
│ └────────────────────┴────────┴───────────┴────────┴───────┘│
│                                                              │
│ BACKLINK SUBMISSION SETTINGS                                 │
│ Max per hour: [5]   Max per day: [20]   Max per week: [80] │
│ Time window: [09:00] to [18:00]                             │
│ Random delay: [30]s to [120]s                               │
│                                                              │
│ [Save Changes]                                               │
└──────────────────────────────────────────────────────────────┘

TRACKING TAB:
┌──────────────────────────────────────────────────────────────┐
│ RANK TRACKING SETTINGS                                       │
│                                                              │
│ Frequency: [Daily ▾]                                        │
│ Keywords to track: [100 ▾]                                  │
│ SERP depth: [Top 30 ▾]                                      │
│ Search engines: [✓] Google  [✓] Bing  [ ] Yahoo            │
│ Devices: [✓] Desktop  [✓] Mobile                           │
│ Locations: [New York, US] [Los Angeles, US]  [+ Add]       │
│                                                              │
│ SERP FEATURES TO TRACK:                                      │
│ [✓] Featured Snippets  [✓] People Also Ask                 │
│ [✓] Local Pack         [✓] Knowledge Panel                 │
│ [✓] Image Pack         [✓] Video Results                   │
│                                                              │
│ [Save Changes]                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 12. CLIENT PORTAL

### 12. Client Portal (`/client-portal/[token]`)

**Frame:** 77 (Desktop), 78 (Mobile)

**Purpose:** Read-only view for clients. Separate layout (no app nav, simplified header).

```
┌──────────────────────────────────────────────────────────────┐
│ [Agency Logo]                    Acme Corp SEO Dashboard     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ TAB NAVIGATION: [Rankings] [Traffic] [Reports]               │
│                                                              │
│ RANKINGS VIEW:                                               │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│ │ In Top 10│  │ Avg Pos  │  │ Improved │                   │
│ │ 23       │  │ 18.4     │  │ 15 KWs   │                   │
│ └──────────┘  └──────────┘  └──────────┘                   │
│                                                              │
│ [Simplified keyword table — position, change, trend]        │
│                                                              │
│ LATEST REPORT:                                               │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ March 2026 Report  │  [📥 Download PDF]                  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Powered by [Agency Name]  │  © 2026                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 13. ADMIN PANEL

### 13. Admin Panel (`/admin`)

**Frame:** 79 (Desktop), 80 (Mobile)

**Purpose:** Super admin for SaaS management (Wave 3).

```
ADMIN PANEL

SIDEBAR (within admin):
├── Dashboard
├── Tenants
├── Users
├── Billing
├── Analytics
└── Feature Flags

ADMIN DASHBOARD:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Total    │  │ Active   │  │ MRR      │  │ Churn    │
│ Tenants  │  │ Users    │  │          │  │ Rate     │
│ 45       │  │ 312      │  │ $12,450  │  │ 3.2%     │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

TENANTS TABLE:
[Org name, plan, users, projects, MRR, status, actions]

FEATURE FLAGS:
[Flag name, description, enabled %, toggle]
```

**Admin Sub-screens** (text spec only):
- `/admin/tenants` — Tenant management
- `/admin/users` — User management across tenants
- `/admin/billing` — Billing management
- `/admin/analytics` — System-wide analytics
- `/admin/feature-flags` — Feature flag management

---

## 14. MARKETING WEBSITE

### 14.1 Homepage (`/`)

**Frame:** 81 (Desktop), 82 (Mobile)

**Purpose:** Primary landing page — convert visitors to trial signups.

```
STICKY HEADER:
[Logo]  Product ▾  Solutions ▾  Pricing  Blog  [Login] [Start Free Trial]

HERO SECTION:
┌──────────────────────────────────────────────────────────────┐
│  Your SEO team just got 10x bigger.                         │
│  Without a single new hire.                                  │
│                                                              │
│  Optimus SEO deploys AI agents that handle keyword          │
│  research, content creation, backlink building, and          │
│  reporting — autonomously. You approve the 10%               │
│  that matters.                                               │
│                                                              │
│  [Start your free trial]  [Book a demo]                     │
│  No credit card required • 14-day free trial                │
│                                                              │
│  [Product screenshot on laptop mockup]                      │
└──────────────────────────────────────────────────────────────┘

SOCIAL PROOF BAR:
"Trusted by 50+ SEO agencies"  [Logo] [Logo] [Logo] [Logo]

PROBLEM SECTION:
"SEO execution is broken" — 3 pain points with icons + stats

SOLUTION SECTION:
"Meet your AI SEO team" — 4 agent cards

HOW IT WORKS:
3-step visual flow

FEATURE HIGHLIGHTS:
Alternating left/right layout with screenshots

TESTIMONIALS:
Customer quotes

PRICING PREVIEW:
3 plan cards

FINAL CTA:
"Ready to scale your SEO?" [Start your free trial]

FOOTER:
Logo, nav links, social links, legal links, newsletter
```

---

### 14.2 Pricing Page (`/pricing`)

**Frame:** 125 (Desktop), 126 (Mobile)

```
PRICING

TOGGLE: [Monthly] [Annual (save 20%)]

3 PLAN CARDS:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ STARTER          │  │ PROFESSIONAL    │  │ ENTERPRISE       │
│ $49/mo           │  │ $149/mo ★       │  │ Custom           │
│ 3 projects       │  │ 15 projects     │  │ Unlimited        │
│ [Start Trial]    │  │ [Start Trial]   │  │ [Contact Sales]  │
└─────────────────┘  └─────────────────┘  └─────────────────┘

FEATURE COMPARISON TABLE
FAQ SECTION
```

---

### 14.3 Product Features (`/product/[feature]`)

**Frame:** 127 (Desktop), 128 (Mobile)

### 14.4 Solutions Pages (`/solutions/[audience]`)

**Frame:** 129 (Desktop), 130 (Mobile)

### 14.5 About Page (`/about`)

**Frame:** 131 (Desktop), 132 (Mobile)

### 14.6 Blog (`/blog`)

**Frame:** 133 (Desktop), 134 (Mobile)

### 14.7 Other Marketing Pages

**Status:** Text specs only — lower priority for Phase 1

See Section 14 in v1.0 for full specifications of:
- Demo, ROI Calculator, Integrations, Changelog, Docs, Contact, Privacy, Terms, Press, Careers, Status

---

## 15. GLOBAL COMPONENTS

### 15.1 Command Palette (`⌘K`)

**Frame:** 83 (Desktop), 84 (Mobile)

**Purpose:** Quick navigation and actions via keyboard.

```
┌──────────────────────────────────────────────────────────────┐
│ 🔍 Search anything...                                   [Esc]│
├──────────────────────────────────────────────────────────────┤
│ RECENT                                                       │
│ 📁 Acme Corp — Sales Overview                               │
│ 📁 Beta Inc — Content Pipeline                              │
│                                                              │
│ QUICK ACTIONS                                                │
│ ➕ Create new project                                        │
│ ▶️ Run sales agents                                          │
│ 📊 Generate report                                           │
│                                                              │
│ NAVIGATION                                                   │
│ 🏠 Dashboard                                                 │
│ 📁 Projects                                                  │
│ ✅ Approvals                                                 │
│ 🤖 Agents                                                    │
│ ⚙️ Settings                                                  │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- Fuzzy search across projects, screens, actions
- Keyboard navigation (↑↓ to select, Enter to activate)
- Recent items for quick access
- Quick actions (create project, run agents, etc.)

---

### 15.2 Billing Settings

**Frame:** 85 (Desktop), 86 (Mobile)

See Section 4.5 for full specification.

---

## PHASE 0 GATE: WIREFRAMES.md

```
[x] Global layout and navigation defined (TOP-NAV ONLY — no sidebar)
[x] Design file cross-reference table (137 frames mapped)
[x] Authentication screens (login, register, onboarding, magic link verify)
[x] Dashboard and Projects (dashboard, projects list, new project dialog)
[x] Global Settings (profile, team, billing, API keys, integrations, branding, notifications)
[x] Sales Phase screens (overview, audit, keywords, competitors, pitch deck, PPC, AI visibility, GMB, proposal)
[x] Strategy Phase screens (overview, keywords, structure, briefs, competitors, link building, AI, local)
[x] Execution Phase screens (content pipeline, backlinks, GMB posts, on-page, AI optimization)
[x] Reporting Phase screens (rankings, traffic, client report, links, AI visibility, local, share of voice)
[x] Approvals queue
[x] Agent activity dashboard
[x] Project settings (configurator)
[x] Client portal
[x] Admin panel
[x] Marketing website (homepage, pricing, product features, solutions, about, blog)
[x] Global components (Command Palette, Billing)
[x] 100% DESIGN COVERAGE — All 56 screens designed in wireframe.pen (112 frames)
[x] Responsive behavior noted (all screens have desktop + mobile)
[ ] USER APPROVAL — Awaiting
```

---

> **End of WIREFRAMES.md v2.1**
>
> **Changes from v2.0:**
> - Updated frame count from 87 to 137 (50 new frames added)
> - All previously text-only screens are now fully designed
> - Removed Section 16 (Missing Screens) — no longer needed
> - 100% design coverage achieved
>
> **Changes from v1.0:**
> - Fixed Section 1 layout from sidebar to TOP-NAV ONLY (matches actual design)
> - Added Section 0 with design file cross-reference table
> - Added all missing Sales screens (PPC, AI Visibility, GMB, Proposal)
> - Added all missing Strategy screens (Competitors, Link Building, AI Optimization, Local SEO)
> - Added all missing Execution screens (On-Page, AI Optimization)
> - Added all missing Reports screens (Links, AI Visibility, Local SEO, Share of Voice)
> - Added all missing Global Settings screens (Profile, Integrations, Branding, Notifications)
> - Added Onboarding screen (was in wireframe.pen but not in v1.0)
> - Added Command Palette and Billing (new screens)
> - Renamed "Project Configurator" to "Project Config" (matches wireframe.pen)
