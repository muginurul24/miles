# architecture.md — JustMiles

> Architecture Decision Records + System Design
> Based on PRD.md v1.0

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client Browser                     │
│  React 19 + TanStack Start (SSR hydration)           │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐    │
│  │ Routes/  │ │Components│ │ Hooks / Stores     │    │
│  │ Pages    │ │ (shadcn) │ │ (Query, Form,Store)│    │
│  └────┬─────┘ └──────────┘ └───────────────────┘    │
│       │                                               │
│       │ tRPC Client (type-safe, no codegen)          │
├───────┼───────────────────────────────────────────────┤
│       │                   SERVER                       │
│  ┌────┴──────────────────────────────────────────┐   │
│  │              tRPC Router Layer                  │   │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────────┐    │   │
│  │  │ cards   │ │articles  │ │calculator    │    │   │
│  │  │ router  │ │router    │ │router        │    │   │
│  │  ├─────────┤ ├──────────┤ ├──────────────┤    │   │
│  │  │member-  │ │consulting│ │admin         │    │   │
│  │  │ship     │ │router    │ │router        │    │   │
│  │  └────┬────┘ └────┬─────┘ └──────┬───────┘    │   │
│  │       │            │              │            │   │
│  │  ┌────┴────────────┴──────────────┴───────┐    │   │
│  │  │         Repository Layer                │    │   │
│  │  │  cards.repo  articles.repo  users.repo │    │   │
│  │  └────────────────────┬───────────────────┘    │   │
│  │                       │                         │   │
│  │  ┌────────────────────┴───────────────────┐    │   │
│  │  │         Prisma ORM (db.ts singleton)    │    │   │
│  │  └────────────────────┬───────────────────┘    │   │
│  └────────────────────────┼───────────────────────┘   │
│                           │                            │
│                    ┌──────┴──────┐                     │
│                    │ PostgreSQL  │                     │
│                    └─────────────┘                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: TanStack Start over Next.js
**Decision:** Use TanStack Start for full-stack React SSR.
**Rationale:**
- TanStack ecosystem consistency (Router, Query, Table, Form, Store all first-party)
- File-based routing with type-safe navigation
- Server Functions + tRPC integration patterns well-documented
- No vendor lock-in to Vercel
- Better developer experience with TanStack Devtools

**Trade-offs:**
- Smaller community than Next.js
- Fewer deployment templates
- Mitigation: Community growing fast, Vite-based deploy works anywhere

### ADR-002: tRPC over REST/GraphQL
**Decision:** tRPC for all API communication.
**Rationale:**
- End-to-end type safety from DB to UI
- No API documentation overhead
- Automatic input validation with Zod
- Procedure-based organization maps cleanly to domain boundaries
- Built-in middleware for auth, logging, rate limiting

**Trade-offs:**
- Not callable from non-JS clients (not needed for this project)
- Slightly larger bundle than thin REST client
- Mitigation: Public API can be added later if needed via tRPC OpenAPI plugin

### ADR-003: Repository Pattern
**Decision:** All Prisma queries go through repository functions in `src/server/repositories/`.
**Rationale:**
- Single source of truth for data access logic
- Testable: mock repositories in tRPC procedure tests
- Consistent: error handling, logging, query patterns
- Replaceable: can swap Prisma without touching business logic

**Pattern:**
```ts
// src/server/repositories/cards.repo.ts
export const cardsRepo = {
  async findAll(filters: CardFilters): Promise<Card[]> { ... },
  async findBySlug(slug: string): Promise<Card | null> { ... },
  async findByPartner(program: string): Promise<Card[]> { ... },
}
```

**Anti-pattern:**
- ❌ Calling `prisma.creditCard.findMany()` directly in tRPC procedures
- ✅ Calling `cardsRepo.findAll(filters)` in tRPC procedures

### ADR-004: shadcn/ui over Custom Components
**Decision:** All UI primitives come from shadcn/ui (new-york style).
**Rationale:**
- Accessible by default (Radix UI primitives)
- Theme-ready (CSS variables)
- Customizable via Tailwind classes
- Copy-paste model = full control, no dependency
- Blocks available for complex layouts (dashboard-01, login-01, signup-01)

**Exception:** Business-specific components (CalculatorResult, RatingBadge, ArticleCard) are custom but use shadcn primitives internally.

### ADR-005: Server Components First
**Decision:** All pages render as server components by default. Client interactivity is opt-in.
**Rationale:**
- Better SEO (full HTML on first response)
- Faster initial load (no JS needed for static content)
- Better performance (less client JS)
- TanStack Start supports this natively

**Pattern:**
- Static content: server-rendered (articles, about, legal pages)
- Interactive features: `'use client'` boundary (calculator, compare, quiz, forms)
- Data fetching: loaders for initial data, TanStack Query for client mutations

### ADR-006: CSS Variables for Theming
**Decision:** Use Tailwind v4 CSS variables + `.dark` class for theming.
**Rationale:**
- Already set up in `src/styles.css` with shadcn tokens
- Smooth light↔dark transitions
- FOUC prevention via inline `<script>` in `__root.tsx`
- All components work automatically with `dark:` variants

### ADR-007: Font Strategy
**Decision:** Use fonts.bunny.net CDN for all fonts.
**Rationale:**
- GDPR-compliant (no Google Fonts privacy concerns)
- All weights available with single request
- Preconnect for fast loading
- Font list: Andada Pro (serif), Plus Jakarta Sans (sans), Funnel Display (display), Fira Mono (mono)

### ADR-008: Calculator as Pure Functions
**Decision:** Calculator logic exists as pure functions in `src/lib/calculator.ts`.
**Rationale:**
- Testable without React or DB
- Reusable: used in calculator page, card detail sidebar, compare, quiz
- Predictable: same inputs = same outputs
- No side effects, no async

```ts
// src/lib/calculator.ts
export function calculateMiles(input: CalcInput): CalcResult { ... }
export function getRating(idrPerMile: number): Rating { ... }
export function compareCards(inputs: CompareInput[]): CompareResult[] { ... }
```

---

## 3. Data Flow

### Page Load (SSR)
```
Browser → GET /credit-cards/bca-krisflyer → TanStack Start
  → Route loader: cardsRouter.getBySlug("bca-krisflyer-v-i")
    → cardsRepo.findBySlug(slug) → Prisma → PostgreSQL
  → Returns CardWithRelations
  → Renders CardDetailPage (server)
  → HTML sent to browser
  → Client hydrates
```

### Interactive Feature (CSR)
```
Browser → Calculator interaction
  → onChange: client-side update (pure calculation in lib/calculator.ts)
  → Optionally: TanStack Query mutation to save calculation
    → tRPC: calculatorRouter.save(input)
      → calculatorRepo.create(data) → Prisma → PostgreSQL
    → Toast: "Calculation saved"
```

### Auth Flow
```
Browser → Login form submit
  → Better Auth client: authClient.signIn.email({ email, password })
    → Better Auth server handler (src/routes/api/auth/$.ts)
      → Validates credentials
      → Creates session token
      → Sets httpOnly cookie
    → Client receives session
    → Redirect to previous page or home
```

---

## 4. Route Map & Data Dependencies

| Route | Loader Data | Interactive | Auth |
|---|---|---|---|
| `/` | latestArticles, topCards | Calculator preview | No |
| `/calculator` | cards list | Full calculator | No |
| `/credit-cards` | filtered cards | Search, filter, sort | No |
| `/credit-cards/$slug` | card detail + similar | Sidebar calculator | No |
| `/compare` | cards list | Full compare | No |
| `/news` | articles (cat=News) | None | No |
| `/guides` | articles (cat=Guide) | None | No |
| `/deals` | articles (cat=Deal) | None | No |
| `/reviews/flight` | articles (sub=flight) | Sub-nav tabs | No |
| `/articles/$slug` | article + related | None | Premium check |
| `/membership` | tiers | None | Optional |
| `/consulting` | packages | Inquiry form | Optional |
| `/quiz` | none | Quiz form + results | No |
| `/about` | none | None | No |
| `/privacy`, `/terms`, `/disclaimer` | none | None | No |
| `/auth/login` | none | Login form | No |
| `/auth/register` | none | Register form | No |
| `/dashboard` | stats | Charts, interactions | Admin |
| `/dashboard/cards` | all cards | Table CRUD | Admin |
| `/dashboard/articles` | all articles | Table CRUD | Admin |
| `/dashboard/inquiries` | inquiries | Status update | Admin |
| `/dashboard/subscribers` | subscribers | Export | Admin |

---

## 5. Component Tree (Key Pages)

### Home Page
```
HomePage
├── HeroSection
│   ├── HeroBackground (image + gradient overlay)
│   ├── Badge
│   ├── Heading + Subtitle
│   └── CTAButtons
├── StatsBar
│   └── StatCard × 4
├── CalculatorPreview
│   ├── CalculatorForm (card, tx, partner, amount)
│   └── CalculatorResult (points, miles, rate, rating)
├── ArticleGrid ("Latest News") → ArticleCard × 3
├── CardGrid ("Top Cards") → CreditCardCard × 3
├── ArticleGrid ("Latest Guides") → ArticleCard × 3
├── ArticleGrid ("Latest Reviews") → ArticleCard × 3
├── NewsletterCTA
├── MembershipBanner
└── BottomCTAs (ConsultingCard + QuizCard)
```

### Calculator Page
```
CalculatorPage
├── PageHeader
├── CalculatorLayout (2-col)
│   ├── CalculatorForm
│   │   ├── CardSelect
│   │   ├── TransactionTypeSelect
│   │   ├── PartnerSelect (dynamic)
│   │   └── AmountInput
│   └── CalculatorResultPanel
│       ├── RatingBadge
│       ├── StatCards (Points, Miles, IDR/Mile)
│       └── CompareAllTable
│           └── CompareRow × N (clickable)
└── Disclaimer
```

### Card Detail Page
```
CardDetailPage
├── Breadcrumb
├── CardDetailLayout (3-col)
│   ├── MainContent
│   │   ├── HeroImage
│   │   ├── CardHeader (badges, name, bestFor)
│   │   ├── KeyStatsGrid × 4
│   │   ├── EarningRateTable
│   │   ├── TransferPartnerTable
│   │   ├── ProsConsGrid
│   │   │   ├── ProsList
│   │   │   └── ConsList
│   │   ├── BenefitsGrid
│   │   ├── BestForSection
│   │   └── SimilarCards
│   └── Sidebar (sticky)
│       ├── SidebarCalculator
│       └── ApplyCTA
```

---

## 6. Database Indexes

```sql
-- Credit cards
CREATE INDEX idx_cards_bank ON credit_cards(bank);
CREATE INDEX idx_cards_tier ON credit_cards(tier);

-- Earning rates
CREATE INDEX idx_earning_rates_card ON earning_rates(card_id);
CREATE INDEX idx_earning_rates_type ON earning_rates(transaction_type);

-- Transfer partners
CREATE INDEX idx_transfer_partners_card ON transfer_partners(card_id);
CREATE INDEX idx_transfer_partners_program ON transfer_partners(program);

-- Articles
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_premium ON articles(premium) WHERE premium = true;
CREATE INDEX idx_articles_category_published ON articles(category, published_at DESC);

-- Consulting inquiries
CREATE INDEX idx_inquiries_status ON consulting_inquiries(status);
CREATE INDEX idx_inquiries_created ON consulting_inquiries(created_at DESC);

-- Newsletter
CREATE UNIQUE INDEX idx_newsletter_email ON newsletter_subscribers(email);
```

---

## 7. Error Handling Strategy

### Server Errors (tRPC)
```ts
// Pattern for all procedures
.query(({ input }) => {
  const card = await cardsRepo.findBySlug(input.slug)
  if (!card) throw new TRPCError({ code: 'NOT_FOUND', message: 'Card not found' })
  return card
})
```

### Client Errors
- Form validation: TanStack Form + Zod — inline field errors
- Network errors: tRPC client error handler → Toast notification
- 404 pages: Route not found → custom NotFound component
- Premium gating: Article premium + user not subscribed → overlay with CTA

### Error Boundaries
- Per-route layout error boundaries
- Global fallback in `__root.tsx`
- Toast container for non-blocking errors

---

## 8. Deployment Architecture

```
┌─────────────────┐
│   CDN / Proxy   │  (Cloudflare / Nginx)
└────────┬────────┘
         │
┌────────┴────────┐
│   Node.js App   │  (TanStack Start production server)
│   Port 3000     │
└────────┬────────┘
         │
┌────────┴────────┐
│   PostgreSQL    │  (Managed / self-hosted)
└─────────────────┘
```

**Build output:** `pnpm build` produces Vite SSR bundle
**Run:** `node .output/server/index.mjs` (or `pnpm preview`)
**Environment:** `.env.local` for secrets, `.env` for defaults

---

*Architecture v1.0 — Claw Kun 🐾 | JustMiles | 2026-05-17*
