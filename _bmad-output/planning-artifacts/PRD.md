# PRD.md — JustMiles

> Product Requirements Document
> Indonesia's Points & Miles Advisor + Travel Media Platform

---

## 1. Ringkasan Eksekutif

JustMiles adalah platform advisor points & miles untuk pengguna Indonesia. Platform ini membantu pengguna memilih kartu kredit, menghitung earning rate, mengoptimalkan strategi miles, dan merencanakan perjalanan bernilai tinggi.

**Masalah:** Banyak pengguna kartu kredit Indonesia memiliki poin reward dan miles tetapi tidak tahu cara mengoptimalkannya. Informasi earning rate, transfer partner, dan sweet spot redemption tersebar dan tidak terstruktur.

**Solusi:** Satu platform yang menggabungkan data, kalkulator, analisis, konten edukasi, dan layanan konsultasi personal.

### Target Stack
- **Frontend:** TanStack Start (React 19 + SSR + file routing)
- **Styling:** Tailwind CSS 4 + shadcn/ui new-york
- **API:** tRPC 11
- **Auth:** Better Auth 1.5
- **Database:** PostgreSQL 16 + Prisma 7
- **State:** TanStack Query + TanStack Store
- **Forms:** TanStack Form + Zod

### Reference
- Complete SPA prototype: `../reference.html` (source of truth for UI/UX, business logic, data)
- All 12 credit cards, calculator formula, rating system, quiz logic implemented

---

## 2. Sumber Kebenaran (Source of Truth)

| Artifact | Location | Contents |
|---|---|---|
| UI Reference | `../reference.html` | Complete interactive SPA with all pages, data, logic |
| Database Schema | `prisma/schema.prisma` | Data model definitions |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` | ADRs, tech decisions |
| Constitution | `_bmad-output/project-context.md` | Coding conventions, rules |

---

## 3. Analisis Reference (../reference.html)

### Halaman yang Ada
1. **Home** (`#home`) — Hero section, stats, calculator preview, latest news, top cards, guides, reviews, newsletter CTA, membership CTA, consulting CTA
2. **Calculator** (`#calculator`) — Full calculator form with compare-all table
3. **Credit Cards Directory** (`#credit-cards`) — Searchable, filterable grid
4. **Card Detail** (`#card/:slug`) — Full card info + sidebar calculator
5. **Compare** (`#compare`) — 2-3 cards side-by-side with spending composition
6. **News** (`#news`) — Article listing
7. **Guides** (`#guides`) — Article listing with premium content
8. **Deals** (`#deals`) — Article listing with deal tags
9. **Reviews** (`#reviews/flight`, `/hotel`, `/lounge`) — Sub-navigation, article listing
10. **Article Detail** (`#article/:id`) — Full article with premium gating
11. **Membership** (`#membership`) — Tier comparison + FAQ
12. **Consulting** (`#consulting`) — Service packages + inquiry form
13. **Quiz** (`#quiz`) — 8 questions → personalized recommendations
14. **About** (`#about`) — Mission, services, team
15. **Legal** (`#privacy`, `#terms`, `#disclaimer`) — Static legal pages

### Data yang Tersedia
- **12 credit cards** — BCA, Citi, BRI, Mandiri, CIMB, Danamon, OCBC, UOB, HSBC, Mega
- **5 transfer programs** — GarudaMiles, KrisFlyer, Asia Miles, Emirates Skywards, British Airways
- **5 transaction types** — local, overseas, dining, online, travel
- **20 articles** — news (4), credit card reviews (4), guides (4), reviews (4), deals (4)
- **4 membership tiers** — Free, Plus, Pro, Concierge
- **4 consulting packages** — Card Audit, Redemption Plan, Full Strategy, Corporate

### Business Logic
- **Calculator formula:** Points = ceil(Amount / SpendPerPoint) × PointsEarned; Miles = ceil(Points × MilesReceived / PointsRequired)
- **Rating system:** 5 tiers based on IDR/Mile thresholds
- **Compare:** Sums miles across all transaction types per card
- **Quiz:** 8 questions with weighted recommendation algorithm

---

## 4. Target Stack & Arsitektur

### Architecture Pattern
```
Client (Browser)
  ↓ SSR via TanStack Start
React Components (src/routes/, src/components/)
  ↓ tRPC Client
tRPC Router (src/server/trpc/)
  ↓ Repository Layer
Prisma ORM (src/server/db.ts)
  ↓
PostgreSQL
```

### Key Decisions
- **TanStack Start SSR** — SEO-critical content site needs server rendering
- **tRPC** — End-to-end type safety, no API docs needed
- **Better Auth** — Flexible auth with social providers support
- **Prisma** — Type-safe ORM with great migration tooling
- **shadcn/ui** — Accessible, customizable, theme-ready components
- **TanStack Query** — Server state management with caching
- **TanStack Table** — Reusable admin data tables
- **TanStack Form** — Type-safe form handling

---

## 5. Environment & Konfigurasi

```env
# .env.local (never commit)
DATABASE_URL=postgresql://user:pass@localhost:5432/justmiles
BETTER_AUTH_SECRET=<generated>
BETTER_AUTH_URL=http://localhost:3000
```

```env
# .env.example (committed)
DATABASE_URL=postgresql://user:password@localhost:5432/justmiles
BETTER_AUTH_SECRET=change-me
BETTER_AUTH_URL=http://localhost:3000
```

### T3Env client vars
```ts
VITE_APP_TITLE=JustMiles
```

---

## 6. Data Model & Schema

### Core Tables

#### credit_cards
| Column | Type | Constraint | Notes |
|---|---|---|---|
| id | text (slug) | PK | e.g., "bca-krisflyer-visa-infinite" |
| name | text | NOT NULL | Full name |
| short_name | text | NOT NULL | Display name |
| bank | text | NOT NULL | Bank name |
| network | text | NOT NULL | Visa/Mastercard |
| tier | text | NOT NULL | Infinite/Signature/Platinum/Black |
| annual_fee | integer | NOT NULL | In IDR |
| min_income | integer | NOT NULL | In IDR |
| image_url | text | | Card image |
| best_for | text | | Use case description |
| not_ideal_for | text | | Anti-use case |
| lounge_access | boolean | DEFAULT false | |
| travel_insurance | boolean | DEFAULT false | |
| airport_transfer | boolean | DEFAULT false | |
| created_at | timestamp | | |
| updated_at | timestamp | | |

#### earning_rates
| Column | Type | Constraint | Notes |
|---|---|---|---|
| id | uuid | PK | |
| card_id | text | FK → credit_cards | |
| transaction_type | text | NOT NULL | local/overseas/dining/online/travel |
| spend_per_point | integer | NOT NULL | IDR needed per point |
| points_earned | float | NOT NULL | Usually 1.0 or 2.0 |

#### transfer_partners
| Column | Type | Constraint | Notes |
|---|---|---|---|
| id | uuid | PK | |
| card_id | text | FK → credit_cards | |
| program | text | NOT NULL | GarudaMiles, KrisFlyer, etc. |
| points_required | integer | NOT NULL | |
| miles_received | integer | NOT NULL | |

#### card_pros
| Column | Type | Constraint |
|---|---|---|
| id | uuid | PK |
| card_id | text | FK → credit_cards |
| text | text | NOT NULL |

#### card_cons
| Column | Type | Constraint |
|---|---|---|
| id | uuid | PK |
| card_id | text | FK → credit_cards |
| text | text | NOT NULL |

#### articles
| Column | Type | Constraint | Notes |
|---|---|---|---|
| id | text (slug) | PK | e.g., "news-1" |
| title | text | NOT NULL | |
| excerpt | text | | |
| content | text | | Markdown/rich text |
| category | text | NOT NULL | News/Guide/Review/Deal/Credit Card |
| sub_category | text | | flight/hotel/lounge (for Review) |
| author | text | | |
| image_url | text | | |
| premium | boolean | DEFAULT false | |
| deal_tag | text | | HOT/SWEET SPOT/PROMO (for Deal) |
| published_at | timestamp | | |
| created_at | timestamp | | |
| updated_at | timestamp | | |

#### membership_tiers
| Column | Type | Constraint |
|---|---|---|
| id | text (slug) | PK |
| name | text | NOT NULL |
| price_idr | integer | NOT NULL |
| period | text | monthly/yearly/once |
| features | jsonb | Array of feature strings |
| is_highlighted | boolean | DEFAULT false |
| sort_order | integer | |

#### consulting_packages
| Column | Type | Constraint |
|---|---|---|
| id | text (slug) | PK |
| name | text | NOT NULL |
| description | text | |
| price_idr | integer | |
| price_label | text | Display label |
| outputs | jsonb | Array of output strings |
| icon | text | MDI icon name |

#### consulting_inquiries
| Column | Type | Constraint |
|---|---|---|
| id | uuid | PK |
| name | text | NOT NULL |
| email | text | NOT NULL |
| phone | text | |
| package_id | text | FK → consulting_packages |
| current_cards | text | |
| needs | text | |
| status | text | DEFAULT 'new' |
| created_at | timestamp | |

#### newsletter_subscribers
| Column | Type | Constraint |
|---|---|---|
| id | uuid | PK |
| email | text | UNIQUE, NOT NULL |
| subscribed_at | timestamp | |
| unsubscribed_at | timestamp | nullable |

#### users (Better Auth managed)
Better Auth handles user table — add custom fields:
| Column | Type | Notes |
|---|---|---|
| membership_tier | text | FK → membership_tiers, default 'free' |
| membership_expires_at | timestamp | nullable |

---

## 7. Role, Permission & Data Scope

| Role | Description | Permissions |
|---|---|---|
| visitor | Not authenticated | Read public articles, use calculator, browse cards |
| member_free | Registered, free tier | Save calculations, bookmark articles, newsletter |
| member_plus | Paid Plus tier | All free + premium articles, advanced calculator |
| member_pro | Paid Pro tier | All Plus + strategy guides, webinars, templates |
| admin | Staff | Manage cards, articles, inquiries, subscribers |

### Auth Flow
1. Register with email/password or social providers (Better Auth)
2. Email verification
3. Default tier: free
4. Upgrade via membership page (payment integration — Phase 3)

---

## 8. Authentication (Better Auth)

### Pages
- **Login page** — `src/routes/auth/login.tsx`
  - Email + password login
  - Social login buttons (Google, GitHub)
  - Link to register
  - Use shadcn `login-01` block

- **Register page** — `src/routes/auth/register.tsx`
  - Email + password + confirm password
  - Name field
  - Terms & privacy checkbox
  - Link to login
  - Use shadcn `signup-01` block

### Auth Guards
- tRPC middleware checks session for protected procedures
- Route-level protection via TanStack Router `beforeLoad`
- Redirect unauthenticated users to login
- Dashboard routes: admin role check

---

## 9. UI/UX Specification

### Layout Shell (__root.tsx)
```
+------------------------------------------+
|  Navbar (sticky, transparent → solid)     |
|  - Logo + site name                       |
|  - Nav links (desktop)                    |
|  - Theme toggle (sun/moon/system)         |
|  - Auth buttons (login/register or avatar)|
|  - Mobile hamburger                       |
+------------------------------------------+
|  Main Content Area ({children})           |
+------------------------------------------+
|  Footer                                    |
|  - Logo, description                      |
|  - Link columns (Tools, Content, Services)|
|  - Social icons                           |
|  - Copyright                              |
+------------------------------------------+
|  Toast Container (fixed bottom-right)     |
+------------------------------------------+
```

### Design Tokens (Tailwind v4 CSS variables)
- Background: cream light / slate dark
- Surface: white light / slate-800 dark  
- Primary text: navy (#0a0f26) light / slate-100 dark
- Accent: indigo-600 light / indigo-400 dark
- Border: slate-200 light / slate-700 dark
- Muted text: slate-500 light / slate-400 dark

### Typography
```css
--font-sans: 'Plus Jakarta Sans', sans-serif;
--font-serif: 'Andada Pro', serif;
--font-display: 'Funnel Display', sans-serif;
--font-mono: 'Fira Mono', monospace;
```

- Headings: `font-display` (Funnel Display)
- Body: `font-sans` (Plus Jakarta Sans)
- Serif accents: `font-serif` (Andada Pro)
- Code/numbers: `font-mono` (Fira Mono)

### Theme Toggle
- **Location:** Navbar (both public + dashboard)
- **Modes:** Light ☀️ / Dark 🌙 / System 💻
- Implemented via CSS class toggle on `<html>`
- FOUC prevention via inline `<script>` (already in `__root.tsx`)
- Persisted to localStorage

### Mobile Responsive
- Navbar collapses to hamburger at < 1024px
- Mobile drawer menu slides from right
- Cards stack single column on mobile
- Tables become scrollable on mobile
- Forms full-width on mobile

---

## 10. Pages — Detailed Specifications

### 10.1 Home Page (`/`)
**Route:** `src/routes/index.tsx`

**Sections (top to bottom):**
1. **Hero** — Full-height with background image overlay
   - Badge: "Points & Miles Advisor"
   - Headline: "Maksimalkan Poin & Miles Kamu"
   - Subtitle: Value proposition
   - CTAs: "Hitung Miles Kamu" (→ calculator), "Bandingkan Kartu Kredit" (→ credit-cards)
   - Secondary link: "atau mulai dari Guide Pemula →"

2. **Stats Bar** — 4 cards: 12+ Kartu Kredit, 5 Program Miles, 50+ Artikel, 100% Gratis

3. **Calculator Preview** — Mini calculator showing earning rate for quick lookup
   - Card select, transaction type, partner, amount → points/miles/rate

4. **Latest News** — 3 most recent news articles in card grid

5. **Top Credit Cards** — 3 cards showing bank, tier, transfer partners, best rate

6. **Latest Guides** — 3 guide articles

7. **Latest Reviews** — 3 review articles

8. **Newsletter CTA** — Email input + subscribe button, privacy note

9. **Membership CTA** — Banner with upgrade link

10. **Bottom CTAs** — Consulting + Quiz cards side by side

**Data Loading:**
- Loader fetches latest articles + top cards via tRPC
- SEO metadata: title, description, OG tags

### 10.2 Calculator (`/calculator`)
**Route:** `src/routes/calculator.tsx`

**Layout:** 2-column (form left, results right)
- **Form:** Card select, transaction type, partner (dynamic), amount
- **Primary Result:** Rating badge + Points/Miles/IDR per Mile cards
- **Compare All Table:** All cards ranked by earning rate for same transaction
- **Formula explanation** collapsible
- **Disclaimer** at bottom

**Behavior:**
- Partner dropdown updates when card changes (only shows card's partners)
- Results update on any form change (no submit button needed)
- Compare table sorts by IDR/Mile (ascending = best first)
- Click any row → navigate to card detail

### 10.3 Credit Cards Directory (`/credit-cards`)
**Route:** `src/routes/credit-cards/index.tsx`

**Header:** Page title + description

**Filters (horizontal bar):**
- Search input (name, bank, short name)
- Bank dropdown
- Partner program dropdown
- Sort dropdown (Name, Annual Fee Low→High, Annual Fee High→Low, Earning Rate Best)

**Grid:** Responsive card grid
- Each card shows: image, bank + tier badge, name, transfer partner chips, best local earning rate
- Click → card detail page

### 10.4 Card Detail (`/credit-cards/$slug`)
**Route:** `src/routes/credit-cards/$slug.tsx`

**Layout:** 3-column (main left 2/3, sidebar right 1/3)

**Main Content:**
- Breadcrumb (Home > Credit Cards > Card Name)
- Hero image + card name + bestFor description
- Key stats row (Annual Fee, Min Income, Transfer Partners, Lounge)
- Earning Rate table (per transaction type, formula, sample at Rp10M)
- Transfer Partner table (program, conversion ratio, miles from 10K points)
- Pros & Cons (green/red cards)
- Benefits (Lounge, Insurance, Transfer — boolean indicators)
- Best For / Not Ideal For
- Similar Cards (cards sharing transfer partners)

**Sidebar (sticky):**
- Mini calculator for this specific card
- CTA card: "Tertarik dengan kartu ini?" + apply button

### 10.5 Compare (`/compare`)
**Route:** `src/routes/compare.tsx`

**Header:** Page title + description

**Card Selection:** 3 columns (Card A, B, C optional)
- Dropdown each with partner selector (shows only if card selected)

**Spending Composition:** Grid of inputs per transaction type
- Default values filled
- Running total (monthly + yearly)

**Results:**
- Best recommendation banner (if 2+ cards selected)
- Result cards side by side showing:
  - Card name, partner, rating badge
  - Miles/month, miles/year, avg earning rate, annual fee, est. net value
- Best card highlighted with border + badge

**Disclaimer** at bottom

### 10.6 News, Guides, Deals (`/news`, `/guides`, `/deals`)
**Route:** `src/routes/news.tsx`, `guides.tsx`, `deals.tsx`

- Page header with category name + description
- First article: large card (hero position)
- Remaining: 3-column grid
- Article cards show: image, category badge, premium/deal badge, title, excerpt, author, date
- Premium CTA banner if category has premium content
- Newsletter CTA at bottom

**Deals special:** Deal tag badges (HOT, SWEET SPOT, PROMO)

### 10.7 Reviews (`/reviews/flight`, `/reviews/hotel`, `/reviews/lounge`)
**Route:** `src/routes/reviews/flight.tsx`, etc.

- Breadcrumb: Home > [Category]
- Sub-navigation tabs: Flight | Hotel | Lounge (active highlighted)
- Article grid (3 columns)
- Empty state if no reviews in category

### 10.8 Article Detail (`/articles/$slug`)
**Route:** `src/routes/articles/$slug.tsx`

- Breadcrumb: Home > Category > Article Title
- Hero image
- Category badge + premium badge
- Title, author, date
- Premium gating: lock overlay + membership CTA if premium + user not subscribed
- Article content (rich text)
- Related articles (3 cards)
- Newsletter CTA

### 10.9 Membership (`/membership`)
**Route:** `src/routes/membership.tsx`

- Page header
- 4 tier cards: Free, Plus (Rp49K/mo), Pro (Rp99K/mo, highlighted), Concierge (Custom)
- Each card: name, price, feature list with checkmarks
- "Most Popular" badge on Pro
- CTA buttons (contextual: already on tier → disabled)
- FAQ accordion (4 questions)

### 10.10 Consulting (`/consulting`)
**Route:** `src/routes/consulting.tsx`

- Page header
- 4 package cards: Card Audit (Rp299K), Redemption Plan (Rp499K), Full Strategy (Rp899K), Corporate (Custom)
- Inquiry form:
  - Name, Email, WhatsApp, Package dropdown, Current cards, Needs textarea
  - Validation + toast on submit
  - Form clears on success

### 10.11 Advisor Quiz (`/quiz`)
**Route:** `src/routes/quiz.tsx`

- Page header
- 8 question cards (numbered)
  - Q1: Monthly spending range (5 options)
  - Q2: Largest transaction category (5 options)
  - Q3: Travel destination (5 options)
  - Q4: Airline preference (5 options)
  - Q5: Overseas transaction frequency (5 options)
  - Q6: Lounge access importance (4 options)
  - Q7: Annual fee tolerance (5 options)
  - Q8: Redemption target (6 options)
- Submit button → hides questions, shows results
- Results: Top 3 recommendations with earning rate, transfer partners, miles/year estimate
- Buttons: "Butuh Strategi Lebih Detail?" (→ consulting), "Ulangi Quiz"

### 10.12 About & Legal (`/about`, `/privacy`, `/terms`, `/disclaimer`)
**Route:** `src/routes/about.tsx`, etc.

- Page header
- Rich text content in white card
- About: mission, services grid, team members, contact info
- Legal: last updated date, sectioned content

### 10.13 Admin Dashboard (`/dashboard/*`)
**Routes:** `src/routes/dashboard/` (all protected, admin-only)

**Dashboard Overview** (`/dashboard`):
- Stats cards (total cards, articles, subscribers, inquiries)
- Recent inquiries list
- Use shadcn `dashboard-01` block
- Charts from shadcn charts (area, bar, line, pie, radar, radial)

**Manage Cards** (`/dashboard/cards`):
- TanStack Table with sort, filter, pagination
- Inline edit or modal form
- Add/Edit/Delete

**Manage Articles** (`/dashboard/articles`):
- TanStack Table
- Rich text editor
- Add/Edit/Delete

**Inquiries** (`/dashboard/inquiries`):
- Table with status filter (new/contacted/resolved)
- View detail modal
- Status update

**Subscribers** (`/dashboard/subscribers`):
- Table with email, date
- Export CSV

---

## 11. Charts (Admin Dashboard)

Following https://ui.shadcn.com/charts — all 7 chart types:

| Chart | Use Case |
|---|---|
| Area Chart | Card applications over time |
| Bar Chart | Articles by category |
| Line Chart | Newsletter subscriber growth |
| Pie Chart | Membership tier distribution |
| Radar Chart | Card feature comparison |
| Radial Chart | Goal progress (miles target) |
| Tooltip | Shared chart tooltip component |

All charts use Recharts (shadcn dependency) + dark/light mode compatible.

---

## 12. Newsletter System

- Email input + Subscribe button across multiple pages (home, article, listing)
- Toast feedback on subscribe
- Admin table for subscriber management
- (Phase 3: actual email sending integration)

---

## 13. Non-Functional Requirements

### Performance
- Lighthouse score: ≥ 90 Performance, ≥ 95 Accessibility
- LCP < 2.5s (server-rendered pages)
- Image optimization: lazy loading, WebP format
- Font loading: preconnect + font-display swap

### Security
- CSRF protection (Better Auth built-in)
- Rate limiting on tRPC procedures
- Input validation: Zod on every tRPC input + TanStack Form
- Parameterized queries (Prisma)
- httpOnly cookies for auth tokens
- CSP headers
- No secrets in client bundles

### Accessibility
- All interactive elements keyboard accessible
- ARIA labels on icon-only buttons
- Color contrast ratios meet WCAG AA
- Focus indicators visible
- Screen reader friendly form labels

### SEO
- SSR for all public pages
- Meta tags per page (title, description, OG)
- Semantic HTML (article, nav, main, section)
- Sitemap generation (Phase 3)

### Maintainability
- No file > 300 lines (prefer 150-200)
- One component per file (except co-located sub-components)
- Consistent naming: kebab-case files, PascalCase components
- All business logic extracted to `lib/`

---

## 14. Implementation Phases

| Phase | Name | Stories | Priority |
|---|---|---|---|
| 00 | Bootstrap & Foundation | 8 | P0 |
| 01 | Database & Seed Data | 6 | P0 |
| 02 | Public Shell (Layout + Theme + Fonts) | 5 | P0 |
| 03 | Auth System | 5 | P0 |
| 04 | Home Page | 8 | P0 |
| 05 | Credit Cards Directory + Detail | 8 | P0 |
| 06 | Calculator | 6 | P0 |
| 07 | Compare Tool | 5 | P0 |
| 08 | Content Pages (News/Guides/Deals/Reviews) | 7 | P1 |
| 09 | Article Detail | 4 | P1 |
| 10 | Membership + Consulting | 6 | P1 |
| 11 | Quiz | 4 | P1 |
| 12 | Admin Dashboard | 10 | P2 |
| 13 | Legal Pages + Newsletter | 4 | P2 |
| 14 | Charts Integration | 5 | P2 |
| 15 | Polish & Production Hardening | 8 | P3 |

---

## 15. Open Issues

1. **Payment Integration** — Membership payment gateway choice TBD (Midtrans/Xendit)
2. **Email Service** — Newsletter email delivery provider TBD (Resend/SendGrid)
3. **Image Storage** — Card/article images: local public/ vs cloud storage
4. **Rich Text Editor** — Admin article editor library TBD (TipTap/Plate/Lexical)
5. **SEO Strategy** — Dynamic sitemap priority, structured data schemas
6. **Analytics** — Privacy-friendly analytics choice (Plausible/Umami/PostHog)

---

## 16. Success Metrics

- Calculator usage: 100+ calculations/day in first month
- Newsletter signup rate: > 5% of visitors
- Card detail page engagement: avg 2+ minutes
- Quiz completion rate: > 60%
- Membership conversion: > 2% free → paid
- Page load time: < 2s on 3G

---

*PRD v1.0 — Claw Kun 🐾 | JustMiles | 2026-05-17*
