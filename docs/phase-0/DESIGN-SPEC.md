# DESIGN-SPEC.md — Wireframe Enhancement Specification

> **Version:** 1.0 | **Date:** 2026-03-14
> **For:** Manual execution in Pencil.dev
> **Base file:** `wireframe 11.pen` (84 frames, restored as `wireframe.pen`)

---

## Table of Contents

1. [Task A: Dark Theme Fix (Frames 41-79)](#task-a-dark-theme-fix)
2. [Task B: Sparse Screen Enhancements](#task-b-sparse-screen-enhancements)
3. [Task C: New Screens](#task-c-new-screens)
4. [Task D: Minor Fixes](#task-d-minor-fixes)

---

## TASK A: Dark Theme Fix

### Problem
Frames 41-79 were designed with hardcoded `#000000` backgrounds. The design system uses `$bg-page` variable which supports light/dark toggle. These frames need conversion so Pencil's theme toggle works across ALL screens.

### What to Change

#### A1. Frame Background Fills (39 frames)

Select each frame listed below and change its **Fill** from the hardcoded color to the variable:

| Frame | Name | Current Fill | Change To |
|-------|------|-------------|-----------|
| [41] | 5.3 Keyword Research Desktop | `#000000` | `$bg-page` |
| [42] | 5.3 Keyword Research Mobile | `#000000` | `$bg-page` |
| [43] | 5.4 Competitor Analysis Desktop | `#000000` | `$bg-page` |
| [44] | 5.4 Competitor Analysis Mobile | `#000000` | `$bg-page` |
| [45] | 5.5 Pitch Deck Generator Desktop | `#000000` | `$bg-page` |
| [46] | 5.5 Pitch Deck Generator Mobile | `#000000` | `$bg-page` |
| [47] | 6.1 Strategy Overview Desktop | `#000000` | `$bg-page` |
| [48] | 6.1 Strategy Overview Mobile | `#000000` | `$bg-page` |
| [49] | 6.2 Keyword Clusters Desktop | `#000000` | `$bg-page` |
| [50] | 6.2 Keyword Clusters Mobile | `#000000` | `$bg-page` |
| [51] | 6.3 Site Structure Desktop | `#000000` | `$bg-page` |
| [52] | 6.3 Site Structure Mobile | `#000000` | `$bg-page` |
| [53] | 6.4 Content Briefs Desktop | `#000000` | `$bg-page` |
| [54] | 6.4 Content Briefs Mobile | `#000000` | `$bg-page` |
| [55] | 7.1 Content Pipeline Desktop | `#000000` | `$bg-page` |
| [56] | 7.1 Content Pipeline Mobile | `#000000` | `$bg-page` |
| [57] | 7.2 Backlink Management Desktop | `#000000` | `$bg-page` |
| [58] | 7.2 Backlink Management Mobile | `#000000` | `$bg-page` |
| [59] | 7.3 GMB Posts Desktop | `#000000` | `$bg-page` |
| [60] | 7.3 GMB Posts Mobile | `#000000` | `$bg-page` |
| [61] | 8.1 Rank Tracking Desktop | `#000000` | `$bg-page` |
| [62] | 8.1 Rank Tracking Mobile | `#ffffffff` | `$bg-page` |
| [64] | 8.2 Traffic Analytics Desktop | `#000000` | `$bg-page` |
| [65] | 8.2 Traffic Analytics Mobile | `#000000` | `$bg-page` |
| [66] | 8.3 Client Report Generator Desktop | `#000000` | `$bg-page` |
| [67] | 8.3 Client Report Mobile | `#000000` | `$bg-page` |
| [68] | 9. Approvals Queue Desktop | `#000000` | `$bg-page` |
| [69] | 9. Approvals Queue Mobile | `#000000` | `$bg-page` |
| [70] | 10. Agent Activity Desktop | `#000000` | `$bg-page` |
| [71] | 10. Agent Activity Mobile | `#000000` | `$bg-page` |
| [72] | 11.3 Team Settings Desktop | `#000000` | `$bg-page` |
| [73] | 11.4 API Keys Desktop | `#000000` | `$bg-page` |
| [74] | 11.5 Project Config Desktop | `#000000` | `$bg-page` |
| [75] | 11.3 Team Settings Mobile | `#000000` | `$bg-page` |
| [76] | 11.4 API Keys Mobile | `#000000` | `$bg-page` |
| [77] | 11.5 Project Config Mobile | `#000000` | `$bg-page` |
| [78] | 12. Client Portal Desktop | `#fffafaff` | `$bg-page` |
| [79] | 12. Client Portal Mobile | `#000000` | `$bg-page` |

#### A2. Body/Content Container Fills

Inside each frame above, there's typically a main content area (named `*Body`, `*body`, etc.) with `#ffffffff` fill. Change these to `$bg-card`:

| Frame | Element Name | Current Fill | Change To |
|-------|-------------|-------------|-----------|
| [41] | `kwBody` | `#ffffffff` | `$bg-card` |
| [42] | `kwMBody` | `#ffffffff` | `$bg-card` |
| [43] | `caBody` | `#ffffffff` | `$bg-card` |
| [44] | `caMBody` | `#ffffffff` | `$bg-card` |
| [45] | `pdBody` | `#ffffffff` | `$bg-card` |
| [46] | `pdMBody` | `#ffffffff` | `$bg-card` |
| [47] | `stBody` | `#ffffffff` | `$bg-card` |
| [47] | `stNotesBody` | `#ffffffff` | `$bg-card` |
| [48] | `stMBody` | `#ffffffff` | `$bg-card` |
| [49] | `kcBody` | `#ffffffff` | `$bg-card` |
| [50] | `kcMBody` | `#f4f4f4ff` | `$bg-elevated` |
| [51] | `ssBody` | `#ffffffff` | `$bg-card` |
| [52] | `ssMBody` | `#ffffffff` | `$bg-card` |
| [53] | `cbBody` | `#ffffffff` | `$bg-card` |
| [54] | `mobBody` | `#ffffffff` | `$bg-card` |
| [55] | `toolbar71` | `#ffffffff` | `$bg-card` |
| [55] | `kanban` | `#ffffffff` | `$bg-card` |
| [56] | `m71Body` | `#ffffffff` | `$bg-card` |
| [57] | `d72tb` | `#ffffffff` | `$bg-card` |
| [57] | `d72Stats` | `#ffffffff` | `$bg-card` |
| [57] | `d72body` | `#fcfcfcff` | `$bg-card` |
| [58] | `m72Body` | `#ffffffff` | `$bg-card` |
| [59] | `d73tb` | `#ffffffff` | `$bg-card` |
| [59] | `d73body` | `#ffffffff` | `$bg-card` |
| [60] | `m73Body` | `#ffffffff` | `$bg-card` |
| [61] | `d81Stats` | `#ffffffff` | `$bg-card` |
| [61] | `d81body` | `#ffffffff` | `$bg-card` |
| [64] | `d82Stats` | `#ffffffff` | `$bg-card` |
| [64] | `d82body` | `#ffffffff` | `$bg-card` |
| [65] | `m82Body` | `#ffffffff` | `$bg-card` |
| [66] | `d83body` | `#ffffffff` | `$bg-card` |
| [67] | `m83Body` | `#ffffffff` | `$bg-card` |
| [68] | `d9body` | `#ffffffff` | `$bg-card` |
| [68] | `d9center` | `#ffffffff` | `$bg-card` |
| [69] | `mobBody` | `#ffffffff` | `$bg-card` |
| [70] | `agBody` | `#ffffffff` | `$bg-card` |
| [71] | `m10Body` | `#ffffffff` | `$bg-card` |
| [72] | `s11Body` | `#ffffffff` | `$bg-card` |
| [73] | `s12Body` | `#ffffffff` | `$bg-card` |
| [74] | `s13Body` | `#ffffffff` | `$bg-card` |
| [75] | `m11aBody` | `#ffffffff` | `$bg-card` |
| [76] | `m11bBody` | `#ffffffff` | `$bg-card` |
| [77] | `m11cBody` | `#ffffffff` | `$bg-card` |
| [79] | `cpMobBody` | `#ffffffff` | `$bg-card` |

#### A3. Sub-section Frames with `#000000`

These are inner frames that had `#000000` fill (dark sub-sections). Change to `$bg-elevated`:

| Frame | Element Name | Change To |
|-------|-------------|-----------|
| [43] | `caC1` | `$bg-elevated` |
| [43] | `caGapFilter` | `$bg-elevated` |
| [44] | `caMC1` | `$bg-elevated` |
| [49] | `kcCl1` | `$bg-elevated` |
| [50] | `kcMCl1` | `$bg-elevated` |
| [53] | `cbB1` | `$bg-elevated` |

#### A4. LEAVE AS-IS (Do NOT change these)

These hardcoded colors are **intentional** — they're on colored backgrounds where the text/icon must always be white, or they're data visualization colors:

**White text/icons on colored buttons (`$accent`, `$success`):**
All `#FFFFFF` fills on elements whose parent has `$accent` or `$success` fill — these are button labels/icons. Examples: `caAddIco`, `caAddTxt`, `pdGenIco`, `stApproveIco`, `kcAddIco`, `ssAddPageIco`, `cbGenAllIco`, `tb71AddIco`, `d72tbAddIco`, `d73NewIco`, `m73NewIco`, `m11bNewIco`, `m11cSaveTxt`, etc.

**White text on report cover (gradient background):**
- `rpCoverClient` (`#ffffff80`) — semi-transparent white on gradient
- `rpCoverDate` (`#ffffff99`) — semi-transparent white on gradient
- `m83CoverClient` (`#ffffff80`)
- `m83CoverTitle` (`#FFFFFF`)
- `m83CoverDate` (`#ffffff99`)

**Data visualization / chart colors:**
- `#3B82F6` (blue) — chart bars, progress fills, status dots, info badges
- `#10B981` / `#10B98120` (green/green-bg) — success badges
- `#8B5CF6` / `#8B5CF620` (purple/purple-bg) — category badges, avatars
- `#F59220` / `#F5922020` (orange/orange-bg) — urgency/warning badges
- `#FD8C731A` — accent with opacity (selected row highlight)
- `#3B82F620` / `#3B82F615` / `#3B82F630` — blue with opacity (info backgrounds, borders)

**Avatar colors:**
- `#3B82F6` on `s11R2Avatar`, `m11aM2Av` — blue avatar
- `#8B5CF6` on `s11R3Av`, `m11aM3Av` — purple avatar

**Specific dark elements:**
- `#1e3a2f` on `h1Tag` in [54] — dark green tag background
- `#000000` on `pdClientInput`, `pdTypeSel`, `pdToneSel` in [45] — dark input fields in pitch deck (these are form inputs on the dark slide preview area)
- `#000000` on `cbKWTag1`, `cbKWTag2` in [53] — dark keyword tags
- `#000000` on `pdMS1` in [46] — dark slide step indicator
- `#000000` on `agA1Progress`, `agA2Prog` in [70] — progress bar tracks
- `#000000` on `m10Ag1Prog`, `m10Ag2Prog` in [71] — progress bar tracks

**Checkmark icons on step indicators (Pitch Deck):**
- `#FFFFFF` on `pdS1ChkIco`, `pdS2ChkIco`, `pdS3ChkIco`, `pdS4ChkIco` in [45] — white checkmarks on dark step circles

**Report section checkmarks:**
- `#FFFFFF` on `ccSec1Check` through `ccSec6Check` in [66] — white checks on accent circles
- `#FFFFFF` on `ms1Check`, `ms2Check`, `ms3Check` in [67]

**Info banner in API Keys:**
- `#3B82F615` fill on `s12Info` / `m11bInfo` — blue tinted info background
- `#3B82F6` on `s12InfoIco` / `m11bInfoIco` — blue info icon
- `#3B82F630` stroke on `s12Info` / `m11bInfo` — blue border

#### A5. Special: Pitch Deck Dark Input Fields

In frame [45] (Pitch Deck Generator Desktop), the elements `pdClientInput`, `pdTypeSel`, `pdToneSel` have `#000000` fill. These are form inputs in the configuration panel. Change them to `$bg-input`:

| Frame | Element | Current | Change To |
|-------|---------|---------|-----------|
| [45] | `pdClientInput` | `#000000` | `$bg-input` |
| [45] | `pdTypeSel` | `#000000` | `$bg-input` |
| [45] | `pdToneSel` | `#000000` | `$bg-input` |

#### A6. Special: Progress Bar Tracks

In frames [70] and [71] (Agent Activity), progress bar track elements have `#000000`. Change to `$bg-elevated`:

| Frame | Element | Change To |
|-------|---------|-----------|
| [70] | `agA1Progress` | `$bg-elevated` |
| [70] | `agA2Prog` | `$bg-elevated` |
| [71] | `m10Ag1Prog` | `$bg-elevated` |
| [71] | `m10Ag2Prog` | `$bg-elevated` |

#### A7. Special: Content Brief Tags

In frame [53], keyword tags have `#000000`. Change to `$text-primary`:

| Frame | Element | Change To |
|-------|---------|-----------|
| [53] | `cbKWTag1` | `$text-primary` |
| [53] | `cbKWTag2` | `$text-primary` |

---

## TASK B: Sparse Screen Enhancements

### Design Rules (MUST follow for all enhancements)
- **Navigation:** Top Nav only (component `TopNav` ref `yc4K3`). **NO sidebars.**
- **Project context:** Use `ProjectBar` (ref `6SUY8`) below TopNav on project-scoped screens
- **Phase tabs:** Horizontal tab bar below ProjectBar (Sales | Strategy | Execution | Reports | Settings)
- **Mobile nav:** `MobileTopBar` (ref `EBLjK`) at top, `MobileBottomTabBar` (ref `uF5FC`) at bottom
- **Colors:** Only use `$variables` — never hardcoded hex
- **Components:** Reuse existing design system components (StatCard, BadgeSuccess, TableRow, etc.)
- **Font:** Inter for body text, JetBrains Mono for data/numbers/labels

---

### B1. [62] 8.1 Rank Tracking Mobile — CRITICAL (currently 12 nodes, basically empty)

**Current state:** Only has MobileTopBar, phase tabs (Sales/Strategy/Execution/Reports), and MobileBottomTabBar. No content.

**Reference:** Look at [61] 8.1 Rank Tracking Desktop which has stat cards, rank chart, keyword table, and movers card.

**What to add between phase tabs and bottom bar:**

1. **Stats row** (horizontal, 2 cards per row, 2 rows):
   - Row 1: StatCardAccent "Tracked Keywords" → "142" | StatCard "Avg Position" → "14.3"
   - Row 2: StatCard "Top 10" → "38" | StatCard "Improved" → "67%"
   - Use `StatCardAccent` (ref `hUXB3`) and `StatCard` (ref `lW0bN`) components
   - Gap: 8px, padding: 0 16px

2. **Mini chart card** (`$bg-card`, border `$border`, radius `$radius-lg`, padding 16px):
   - Header row: "Ranking Trend" (`$text-primary`, 14px, 600) | spacer | "Last 30 days" (`$text-muted`, 12px)
   - Chart area: 7 vertical bars using `#3B82F6` fill, varying heights (40, 55, 35, 60, 50, 70, 65px), last 2 bars use `$accent` instead. Bars: width 24px, radius `$radius-sm`, horizontal layout, gap 8px, align bottom.

3. **Keyword list card** (`$bg-card`, border, radius, padding 16px):
   - Header: "Top Keywords" (`$text-primary`, 14px, 600) | spacer | "View all →" (`$accent`, 12px)
   - 5 keyword rows, each horizontal:
     - Keyword text (`$text-primary`, 13px, 500, fill_container width)
     - Position number (`$text-secondary`, 13px, JetBrains Mono)
     - Arrow icon (▲ `$success` or ▼ `$error`, 14px)
     - Change value (`$success` or `$error`, 12px, JetBrains Mono)
   - Data:
     - "seo agency software" | 3 | ▲ +2
     - "ai seo tools" | 7 | ▲ +5
     - "automated seo platform" | 12 | ▲ +1
     - "seo automation" | 18 | ▼ -3
     - "best seo tool 2026" | 24 | ▲ +8
   - Each row: border-bottom `$border` 1px, padding 12px 0

4. **Biggest Movers card** (`$bg-card`, border, radius, padding 16px):
   - Title: "Biggest Movers" (`$text-primary`, 14px, 600)
   - 3 rows:
     - ▲ icon (`$success`) | "ai content optimization" (`$text-primary`, 13px) | "+12" (`$success`, JetBrains Mono, 600)
     - ▲ icon (`$success`) | "seo reporting tool" | "+9"
     - ▼ icon (`$error`) | "backlink checker free" | "-5"

**Wrap all content in a scrollable frame** with vertical layout, gap 12px, padding 12px 16px.

---

### B2. [77] 11.5 Project Config Mobile (currently 24 nodes)

**Current state:** Has MobileTopBar, body with 2 sections (Project Details: 2 fields, AI Model: 1 dropdown), save button, bottom bar.

**Reference:** Look at [74] 11.5 Project Config Desktop which has many more config sections.

**What to add (insert new sections between "AI Model Preferences" and "Save Changes" button):**

3. **Data Sources section** (`$bg-card`, border, radius, padding 16px, gap 12px):
   - Title: "Data Sources" (`$text-primary`, 15px, 600)
   - Field: "SEO Data Provider" label → dropdown showing "DataForSEO"
   - Field: "Search Engine" label → dropdown showing "Google"
   - Field: "Target Location" label → input showing "United States"
   - Use same field styling as existing sections (label `$text-secondary` 13px, input `$bg-elevated` with `$border` stroke, radius `$radius-md`, padding 10px 12px)

4. **Notifications section** (`$bg-card`, border, radius, padding 16px, gap 12px):
   - Title: "Notifications" (`$text-primary`, 15px, 600)
   - 3 toggle rows, each with:
     - Left: Label (`$text-primary`, 13px) + description (`$text-muted`, 12px)
     - Right: Toggle switch (36×20px, `$accent` when on, `$bg-elevated` + `$border` stroke when off, white dot 16×16)
   - Toggles:
     - "Agent Completions" / "Get notified when agents finish tasks" → ON
     - "Weekly Reports" / "Receive weekly SEO summary emails" → OFF
     - "Approval Requests" / "Alert when content needs your review" → ON
   - Divider (`$border`, 1px) between each row

5. **Danger Zone section** (`$bg-card`, border, radius, padding 16px, gap 12px):
   - Title: "Danger Zone" (`$error`, 15px, 600)
   - Description: "Permanently delete this project and all its data. This action cannot be undone." (`$text-muted`, 12px)
   - Delete button: outline style — `$error` border stroke, no fill, "Delete Project" text in `$error` with trash icon

---

### B3. [33] 3.2 Projects List Desktop (25 nodes — uses 9 component refs)

**Current state:** Has TopNav, header with breadcrumb + title + "New Project" button, search + filter tabs, table with header + 5 rows + footer. Actually well-structured but could use more detail.

**Enhancements:**
1. Add subtitle below title: "Manage and monitor all your SEO projects" (`$text-muted`, 13px)
2. Override table header column labels via descendants: "Project Name" | "Health Score" | "Last Updated" | "Status"
3. Override table row data via descendants:
   - Row 1: "Acme Corp Blog" | "78" | "Mar 12, 2026" | (keep existing badge)
   - Row 2: "TechStart Launch" | "92" | "Mar 14, 2026"
   - Row 3: "Local Biz SEO Pack" | "65" | "Mar 10, 2026"
   - Row 4: "Health & Wellness" | "84" | "Mar 13, 2026"
   - Row 5: "FinTech Authority" | "—" | "Mar 8, 2026"

---

### B4. [34] 3.2 Projects List Mobile (25 nodes)

**Current state:** Has 5 project cards with name + badge each.

**Enhancement:** Add a detail row below each card's name + badge:
- "Score: 78" (`$text-muted`, 12px, JetBrains Mono) | spacer | "Updated Mar 12" (`$text-muted`, 12px)
- Repeat for each card with matching data from B3

---

### B5. [30] 2.3 Onboarding Mobile (22 nodes)

**Current state:** Progress bar, step header, 3 role cards (icon + label), next button, skip link.

**Enhancement:** Add description text to each role card:
- Freelancer: "Solo practitioner managing client SEO" (`$text-muted`, 12px)
- Agency: "Team of 5-50 handling multiple clients"
- In-house Team: "Internal team focused on company SEO"

---

### B6. [37] 5.1 Sales Overview Desktop (43 nodes)

**Current state:** Has 6 agent cards + deliverables card with 2 rows (Pitch Deck, Proposal).

**Enhancement:** Add 3 more deliverable rows to the deliverables card:
- Row 3: 📄 icon | "Competitor Report" | Badge "Done" (use `BadgeSuccess` ref `ixqHg`) | Download icon button (`$bg-elevated`)
- Row 4: 🔍 icon | "Site Audit Summary" | Badge "In Progress" (use `BadgeWarning` ref `4caIy`) | Run icon button (`$accent`)
- Row 5: 📊 icon | "Keyword Research" | Badge "Pending" (use `BadgeNeutral` ref `2oDEh`) | Run icon button (`$accent`)
- Each row: horizontal layout, gap 12px, align center, padding 8px 12px, border-bottom `$border`

---

### B7. [38] 5.1 Sales Overview Mobile (32 nodes)

**Enhancement:** Add 2 more deliverable rows to the deliverables section:
- "Competitor Report" | Badge "Done" (`BadgeSuccess`)
- "Site Audit" | Badge "Running" (`BadgeWarning`)
- Same styling as existing rows

---

### B8. [60] 7.3 GMB Posts Mobile (40 nodes)

**Current state:** 4 post cards with titles only.

**Enhancement:** Add status badge + date to each post:
- Post 1: Badge "Published" (`BadgeSuccess`) | "Mar 12" (`$text-muted`, 11px, JetBrains Mono)
- Post 2: Badge "Scheduled" (`BadgeInfo` ref `kcev6`) | "Mar 16"
- Post 3: Badge "Draft" (`BadgeNeutral`) | "Mar 14"
- Post 4: Badge "Draft" (`BadgeNeutral`) | "Mar 13"
- Add as a horizontal row below each post title

---

### B9. [52] 6.3 Site Structure Mobile (41 nodes)

**Current state:** 5 page rows with badges but no page names visible.

**Enhancement:** Add page title + URL to each row's left frame:
- Row 1: "Homepage" (`$text-primary`, 13px, 500) + "/" (`$text-muted`, 11px, JetBrains Mono)
- Row 2: "Services" + "/services"
- Row 3: "Blog" + "/blog"
- Row 4: "About Us" + "/about"
- Row 5: "Contact" + "/contact"

---

### B10. [50] 6.2 Keyword Clusters Mobile (42 nodes)

**Current state:** 5 cluster rows but minimal content.

**Enhancement:** Add cluster name + metadata to each row:
- Cluster 1: "SEO Tools & Software" (`$text-primary`, 13px, 500) + "24 keywords · 12.4K vol" (`$text-muted`, 11px, JetBrains Mono)
- Cluster 2: "Content Marketing" + "18 keywords · 8.7K vol"
- Cluster 3: "Link Building" + "15 keywords · 6.2K vol"
- Cluster 4: "Technical SEO" + "21 keywords · 9.1K vol"
- Cluster 5: "Local SEO" + "12 keywords · 4.8K vol"

---

### B11. [65] 8.2 Traffic Analytics Mobile (44 nodes)

**Current state:** 3 stat cards + traffic sources card.

**Enhancement:** Add a mini traffic trend chart card between stats and sources:
- Card: `$bg-card`, border, radius, padding 16px
- Header: "Traffic Trend" (`$text-primary`, 14px, 600) | "30 days" (`$text-muted`, 12px)
- Chart: 6 dots in `$accent` color (6×6px circles, `$radius-full`) spaced horizontally to suggest a line chart
- X-axis labels: "Feb 14" | spacer | "Mar 14" (`$text-muted`, 10px)

---

### B12. [67] 8.3 Client Report Mobile (39 nodes)

**Enhancement:** Add a "Recent Reports" card below the report sections, before the generate button:
- Card: `$bg-card`, border, radius, padding 16px
- Header: "Recent Reports" (`$text-primary`, 14px, 600) | "View all" (`$accent`, 12px)
- 2 report rows:
  - ✅ icon (`$success`) | "February 2026 Report" + "Sent Feb 28 · Opened" (`$text-muted`, 11px) | download icon
  - ✅ icon (`$success`) | "January 2026 Report" + "Sent Jan 31 · Opened" | download icon
- Divider between rows

---

### B13. [75] 11.3 Team Settings Mobile (39 nodes)

**Enhancement:** Add "Pending Invitations" section before the invite button:
- Divider
- Section title: "Pending Invitations" (`$text-secondary`, 12px, 600)
- 1 pending row:
  - Avatar circle (`$bg-elevated`, "?" in `$text-muted`)
  - "mike@agency.com" (`$text-primary`, 13px) + "Invited 2 days ago · Editor" (`$text-muted`, 11px)
  - "Resend" link (`$accent`, 12px)

---

### B14. [76] 11.4 API Keys Mobile (36 nodes)

**Enhancement:** Add a third API key card (revoked state) before the "Generate New Key" button:
- Card: `$bg-card`, border, radius, padding 12px
- Header: "Development Key" (`$text-primary`, 13px, 500) | Badge "Revoked" (`$error` text on `$error-bg` background)
- Key: "opt_dev_••••••••9d1e" (`$text-muted`, 12px, JetBrains Mono)
- Meta: "Created Dec 1 · Revoked Feb 15" (`$text-muted`, 11px)

---

### B15. [46] 5.5 Pitch Deck Generator Mobile (41 nodes)

**Enhancement:** Add description text to each slide row in the slides list:
- Slide 1: + "Company overview and key metrics" (`$text-muted`, 11px)
- Slide 2: + "Market opportunity and target audience"
- Slide 3: + "Competitive analysis and positioning"
- Slide 4: + "Proposed SEO strategy and timeline"

---

## TASK C: New Screens to Create

### Design Rules (same as Task B)
- Desktop: 1440×900, `$bg-page` fill
- Mobile: 390×844, `$bg-page` fill
- Desktop gets TopNav (ref `yc4K3`), Mobile gets MobileTopBar (ref `EBLjK`) + MobileBottomTabBar (ref `uF5FC`)
- Place desktop at x=0, mobile at x=1540
- Leave ~100px vertical gap between frame rows

---

### C1. Command Palette (⌘K) — Desktop (new frame)

**Purpose:** Global search overlay triggered by ⌘K. Appears over any screen.

**Layout:**
- Frame: 1440×900, `$bg-page` fill
- Semi-transparent overlay: rectangle covering full frame, `$text-primary` fill, ~50% opacity
- Centered modal: 640px wide, `$bg-card` fill, `$border` stroke, `$radius-lg`

**Modal content (vertical layout):**

1. **Search bar** (padding 12px 16px):
   - 🔍 search icon (`$text-muted`, 20px) | placeholder "Search projects, keywords, pages, agents..." (`$text-muted`, 14px) | "ESC" key badge (`$bg-elevated`, `$text-muted`, 10px JetBrains Mono)

2. **Divider** (`$border`, 1px)

3. **Recent section** (padding 8px 0):
   - Label: "Recent" (`$text-muted`, 11px, 600)
   - 3 result rows, each:
     - Icon (`$text-secondary`, 18px) | Label (`$text-primary`, 13px, 500) + Section (`$text-muted`, 11px) | (optional keyboard shortcut badge)
   - Results:
     - 📋 "Acme Corp Blog — Keyword Research" / "Sales Phase · Visited 5 min ago"
     - 📊 "Content Pipeline" / "Execution · Visited 1 hour ago"
     - 📄 "February 2026 Report" / "Reports · Visited yesterday"

4. **Divider**

5. **Quick Actions section**:
   - Label: "Quick Actions"
   - ➕ "Create New Project" / "Projects" / `⌘N`
   - 🔍 "Run Site Audit" / "Agents" / `⌘A`
   - 📄 "Generate Report" / "Reports" / `⌘R`
   - 📊 "Keyword Research" / "Sales" / `⌘K`
   - ⚙️ "Settings" / "Workspace"

6. **Divider**

7. **Navigation section**:
   - Label: "Navigation"
   - 🏠 "Dashboard" / "Home" / `⌘1`
   - 📁 "Projects List" / "All projects" / `⌘2`
   - 🤖 "Agent Activity" / "Monitor agents" / `⌘3`
   - ✅ "Approvals Queue" / "Pending reviews" / `⌘4`

8. **Footer** (`$bg-elevated`, padding 8px 16px):
   - "↑↓ Navigate" | "↵ Open" | "⌘K Toggle" (all `$text-muted`, 11px, horizontal, gap 16px)

---

### C2. Command Palette (⌘K) — Mobile (new frame)

**Layout:** Full-screen search (no overlay needed on mobile)

1. **Search header** (`$bg-card`, border-bottom):
   - ← back icon (`$text-primary`) | Search input (`$bg-elevated`, border, radius, "Search..." placeholder)

2. **Recent section**: Same as desktop but without keyboard shortcuts, add → arrow icon on right

3. **Quick Actions**: 3 items (Create Project, Run Audit, Generate Report)

4. **Navigation**: Dashboard, Projects, Agent Activity, Approvals, Settings — each with → arrow

---

### C3. Billing — Desktop (new frame)

**IMPORTANT: NO sidebar. Use the same layout pattern as [35] 4.1 Settings Desktop.**

Look at frame [35] for reference — it uses TopNav + a settings layout WITHOUT a sidebar. Follow that exact pattern.

**Layout:**
- TopNav (ref `yc4K3`)
- Main content area (padding 24px 32px):
  - Title: "Billing & Subscription" (`$text-primary`, 18px, 600)
  - Subtitle: "Manage your plan, payment methods, and invoices" (`$text-muted`, 13px)
  - Divider

**Content cards:**

1. **Current Plan card** (`$bg-card`, border, radius, padding 20px):
   - Header row: "Pro Plan" (`$text-primary`, 16px, 600) + "$49/month · Billed monthly" (`$text-muted`, 13px) | "Upgrade Plan" button (`$accent` fill, white text)
   - Divider
   - 3 usage bars:
     - "Projects" | "8 / 15" (JetBrains Mono) | progress bar (`$accent` fill, `$bg-elevated` track, 6px height, full radius)
     - "Agent Runs" | "342 / 500" | progress bar (`$warning` fill)
     - "API Calls" | "12.4K / 50K" | progress bar (`$success` fill)

2. **Payment Method card** (`$bg-card`, border, radius, padding 16px):
   - Header: "Payment Method" | "Edit" (`$accent`)
   - Row: VISA badge (dark blue `#1A1F71` bg, white "VISA" text, JetBrains Mono 10px 700) | "•••• •••• •••• 4242" (JetBrains Mono) | "Expires 08/27" (`$text-muted`)

3. **Invoices card** (`$bg-card`, border, radius, padding 16px):
   - Header: "Invoices" | "View all →" (`$accent`)
   - 3 invoice rows:
     - "Mar 1, 2026" | "$49.00" (JetBrains Mono) | Badge "Paid" (`BadgeSuccess`) | download icon
     - "Feb 1, 2026" | "$49.00" | Badge "Paid" | download icon
     - "Jan 1, 2026" | "$49.00" | Badge "Paid" | download icon
   - Dividers between rows

---

### C4. Billing — Mobile (new frame)

- MobileTopBar with title "Billing"
- Scrollable content (padding 12px 16px, gap 12px):
  - Plan card: "Pro Plan" + "$49/month" + "Upgrade Plan" button
  - Usage card: "Usage This Month" title + 3 progress bars (same data as desktop)
  - Payment card: VISA + last 4 digits + expiry
  - Invoices card: 3 rows with date + amount + "Paid" badge
- MobileBottomTabBar

---

## TASK D: Minor Fixes

### D1. [62] 8.1 Rank Tracking Mobile — Orphan Body

Frame [63] `m81Body` appears to be an orphan fragment (43 nodes) that was meant to be inside frame [62]. Check if this content should be placed inside [62] as its body content. If so, move it inside [62] between the phase tabs and bottom bar, then delete frame [63].

### D2. Dashboard Enhancements (if not already done)

Check if [31] Dashboard Desktop and [32] Dashboard Mobile have charts and activity feed. If they only have stat cards and project cards, consider adding:
- **Desktop [31]:** A charts row (Rankings Trend + Traffic Overview) and an Activity Feed section
- **Mobile [32]:** A mini chart card and recent activity list

### D3. Logo Documentation

The V-sign logo is confirmed. When exporting assets in Phase D, the coral V-sign icon from the TopNav component is the official logo mark.

---

## Summary Checklist

| Task | Screens Affected | Effort |
|------|-----------------|--------|
| A1. Frame fills → `$bg-page` | 39 frames | Low (repetitive select + change fill) |
| A2. Body fills → `$bg-card` | 44 elements | Low (same process) |
| A3. Sub-frames → `$bg-elevated` | 6 elements | Low |
| A4. Leave as-is | ~85 elements | None |
| A5-A7. Special fixes | ~10 elements | Low |
| B1. Rank Tracking Mobile | 1 screen | **High** (build from scratch) |
| B2. Project Config Mobile | 1 screen | Medium (add 3 sections) |
| B3-B4. Projects List | 2 screens | Low (add text/overrides) |
| B5. Onboarding Mobile | 1 screen | Low (add 3 text nodes) |
| B6-B7. Sales Overview | 2 screens | Low-Medium (add rows) |
| B8-B15. Various mobile screens | 8 screens | Low each |
| C1-C2. Command Palette | 2 new screens | **High** (new design) |
| C3-C4. Billing | 2 new screens | **High** (new design) |
| D1-D3. Minor fixes | 3 items | Low |

**Recommended order:** A1 → A2 → A3 → A5-A7 → B1 → C1-C4 → B2-B15 → D1-D3

---

> **End of DESIGN-SPEC.md**
