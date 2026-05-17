# Epics & Stories — JustMiles

> Each story ≈ 1 day of work. Ordered by dependency.
> Stories include acceptance criteria (AC) and file targets.

---

## Epic 0: Bootstrap & Foundation (8 stories)

### Story 00.1 — Project cleanup: remove demo files
**Priority:** P0 | **Depends on:** None

Remove all demo-prefixed files and routes from the starter template.

**Files to remove:**
- `src/routes/demo/` — entire directory
- `src/components/demo.*.tsx` — all demo components
- `src/hooks/demo.*.ts` — all demo hooks
- `src/lib/demo-*.ts(x)` — all demo lib files
- `src/data/demo-*.ts` — demo data

**AC:**
- [ ] `rtk pnpm dev` starts without errors
- [ ] No demo routes accessible
- [ ] Homepage shows empty shell (header + footer only)

---

### Story 00.2 — Font setup: fonts.bunny.net CDN + Tailwind font families
**Priority:** P0 | **Depends on:** 00.1

Add fonts.bunny.net CDN link and configure Tailwind font families.

**Files:** `src/routes/__root.tsx` (head links), `src/styles.css` (font-family vars)

**Implementation:**
1. Add preconnect + stylesheet link to `__root.tsx` head section
2. Map CSS variables in `styles.css`:
   - `--font-sans: 'Plus Jakarta Sans', sans-serif`
   - `--font-serif: 'Andada Pro', serif`
   - `--font-display: 'Funnel Display', sans-serif`
   - `--font-mono: 'Fira Mono', monospace`
3. Remove old Google Fonts import (Fraunces + Manrope)

**AC:**
- [ ] Fonts load from fonts.bunny.net (check Network tab)
- [ ] All 4 font families available as Tailwind classes
- [ ] No 404s for font files
- [ ] `font-display: swap` behavior

---

### Story 00.3 — Design system: CSS variables for JustMiles theme
**Priority:** P0 | **Depends on:** 00.2

Replace the starter's sea/lagoon theme with JustMiles design tokens matching ../reference.html.

**Files:** `src/styles.css`

**Tokens to define (light):**
| Variable | Value |
|---|---|
| `--justmiles-primary` | `#0a0f26` |
| `--justmiles-cream` | `#F3F1E7` |
| `--justmiles-accent` | `#4F46E5` |
| `--justmiles-accent-hover` | `#4338CA` |
| `--justmiles-accent-light` | `#E0E7FF` |
| `--justmiles-muted` | `#64748b` |

**Dark mode equivalents:** Lighter text, darker backgrounds, brighter accent.

**AC:**
- [ ] Light mode matches ../reference.html colors
- [ ] Dark mode has readable contrast
- [ ] shadcn CSS variables still work (don't break `--background`, `--foreground`, etc.)
- [ ] Remove old sea/lagoon/palm/sand variables

---

### Story 00.4 — Theme toggle: dark/light/system in navbar
**Priority:** P0 | **Depends on:** 00.3

Three-mode theme toggle (☀️ Light / 🌙 Dark / 💻 System) in the navbar, visible on every page.

**Files:** `src/components/ThemeToggle.tsx` (update existing), `src/routes/__root.tsx`

**Implementation:**
1. Update existing ThemeToggle to 3 modes (currently starter has basic toggle)
2. Persist preference to localStorage
3. Apply `.dark` class to `<html>` element
4. Handle system preference via `matchMedia('prefers-color-scheme: dark')`
5. THEME_INIT_SCRIPT in `__root.tsx` already handles FOUC — just update class names if needed

**AC:**
- [ ] Click cycles: Light → Dark → System → Light
- [ ] Icon updates correctly (Sun/Moon/Monitor)
- [ ] Preference persists across page reloads
- [ ] No flash of wrong theme on load
- [ ] Works on both public and dashboard pages

---

### Story 00.5 — Layout shell: header, footer, navbar with responsive mobile menu
**Priority:** P0 | **Depends on:** 00.4

Replace starter Header/Footer with JustMiles branded navigation matching ../reference.html.

**Files:** `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/MobileMenu.tsx` (new)

**Nav links (desktop):**
News | Credit Cards | Calculator | Compare | Reviews ▾ | Guides | Deals | Membership | Consulting

**Reviews dropdown:** Flight Reviews, Hotel Reviews, Lounge Reviews, plus guides/tools links.

**Mobile:** Slide-in drawer from right with full nav tree including review sub-items.

**Footer:** 5 columns — Brand, Tools, Konten, Layanan, Legal + social icons row.

**AC:**
- [ ] Navbar sticky with backdrop blur on scroll
- [ ] Logo (✈️ icon + "JustMiles") links to home
- [ ] Calculator link highlighted in accent color
- [ ] Reviews has dropdown on desktop
- [ ] Mobile menu opens/closes with animation
- [ ] Overlay behind mobile menu
- [ ] Footer matches ../reference.html structure
- [ ] Theme toggle present in both desktop and mobile nav

---

### Story 00.6 — Toast system: reusable toast component
**Priority:** P1 | **Depends on:** 00.5

**Files:** `src/components/Toast.tsx` (new shadcn sonner or custom)

**Implementation:**
- Use shadcn Sonner toast (add via `pnpm dlx shadcn@latest add sonner`)
- Or simple custom toast: fixed bottom-right, slides up, auto-dismiss after 3s
- Green check icon + message
- Export `showToast(msg)` function via TanStack Store or context

**AC:**
- [ ] Toast appears on trigger
- [ ] Slides up from bottom
- [ ] Auto-dismisses after 3 seconds
- [ ] Multiple toasts stack (not overlap)
- [ ] Works in both light and dark mode

---

### Story 00.7 — Shared components: Breadcrumb, Badge, PageHeader, NewsletterCTA
**Priority:** P1 | **Depends on:** 00.5

Create reusable shared components used across multiple pages.

**Files to create:**
- `src/components/shared/Breadcrumb.tsx`
- `src/components/shared/Badge.tsx` (category, premium, deal tags)
- `src/components/shared/PageHeader.tsx` (title + subtitle + optional badge)
- `src/components/shared/NewsletterCTA.tsx` (email input + subscribe button)
- `src/components/shared/RatingBadge.tsx` (Excellent/Good/etc. colored pills)

**AC:**
- [ ] Breadcrumb renders Home > Parent > Current with links
- [ ] Badge supports variants: default, premium (lock icon), deal (HOT/SWEET SPOT/PROMO)
- [ ] PageHeader renders dark navy background with white text, optional badge
- [ ] NewsletterCTA has email validation + subscribe toast
- [ ] RatingBadge shows correct color per rating tier
- [ ] All components work in dark mode

---

### Story 00.8 — Install shadcn blocks: dashboard-01, login-01, signup-01
**Priority:** P1 | **Depends on:** 00.3

Install shadcn block components for admin dashboard, login, and register pages.

**Commands:**
```bash
rtk pnpm dlx shadcn@latest add dashboard-01
rtk pnpm dlx shadcn@latest add login-01
rtk pnpm dlx shadcn@latest add signup-01
```

**AC:**
- [ ] Blocks installed without errors
- [ ] Components placed in `src/components/` correctly
- [ ] Block dependencies (shadcn primitives) auto-installed
- [ ] No TypeScript errors from block components

---

## Epic 1: Database & Seed Data (6 stories)

### Story 01.1 — Define Prisma schema: all tables
**Priority:** P0 | **Depends on:** 00.1

Create complete Prisma schema matching PRD.md section 6.

**File:** `prisma/schema.prisma`

**Models:** credit_cards, earning_rates, transfer_partners, card_pros, card_cons, articles, membership_tiers, consulting_packages, consulting_inquiries, newsletter_subscribers

**Relationships:**
- credit_cards 1→N earning_rates
- credit_cards 1→N transfer_partners
- credit_cards 1→N card_pros
- credit_cards 1→N card_cons

**AC:**
- [ ] `rtk pnpm db:push` succeeds
- [ ] All tables created in PostgreSQL
- [ ] Foreign keys enforce referential integrity
- [ ] No Prisma validation warnings

---

### Story 01.2 — Create repositories: cards, articles, calculator
**Priority:** P0 | **Depends on:** 01.1

Create repository layer for data access.

**Files:** `src/server/repositories/cards.repo.ts`, `articles.repo.ts`, `calculator.repo.ts`

**cards.repo functions:**
- `findAll(filters)` — with bank/partner/sort/search
- `findBySlug(slug)` — with earning_rates, transfer_partners, pros, cons
- `findByPartner(program)` — cards supporting a transfer program
- `getBanks()` — distinct bank list
- `getAllPartners()` — distinct program list

**articles.repo functions:**
- `findAll({ category?, subCategory?, limit?, offset? })` — paginated, filtered
- `findBySlug(slug)` — single article
- `findRelated(slug, category, limit)` — same category, exclude current
- `getLatest(limit)` — most recent

**AC:**
- [ ] Repositories export typed functions
- [ ] All queries return correct Prisma types
- [ ] No raw SQL

---

### Story 01.3 — Seed credit cards: 12 cards with all relations
**Priority:** P0 | **Depends on:** 01.1

Create seed file with all 12 credit cards from ../reference.html.

**File:** `prisma/seed.ts`

**Data from ../reference.html (verify each):**
1. BCA KrisFlyer Visa Infinite — 1:1 KrisFlyer, lounge, insurance
2. Citi PremierMiles — 2:1 GarudaMiles, KrisFlyer, Asia Miles
3. BRI KrisFlyer Platinum — 2:1 KrisFlyer, budget pick
4. Mandiri Garuda Platinum — 2:1 GarudaMiles
5. BCA Visa Infinite — 6:1, premium benefits
6. CIMB TravelWorld — 2:1, lowest annual fee
7. Danamon GO Green — 3:1 GarudaMiles
8. OCBC NSP Platinum — 2:1, excellent overseas/dining rates
9. UOB PRVI Miles — 2:1, 4 partners
10. HSBC Premier — 2:1, 5 partners, lounge
11. BCA Mastercard Black — 5:1, lifestyle focus
12. Mega Travel Card — 3:1, entry level

Each card needs: earning_rates (5 types), transfer_partners, pros (3+), cons (3+)

**AC:**
- [ ] `rtk pnpm db:seed` runs successfully
- [ ] 12 cards inserted with all relations
- [ ] All earning rates match ../reference.html exactly
- [ ] All conversion ratios match exactly

---

### Story 01.4 — Seed articles: 20 articles across all categories
**Priority:** P1 | **Depends on:** 01.1

**File:** `prisma/seed.ts` (add to existing)

Articles from ../reference.html:
- News: 4 (1 premium)
- Credit Card reviews: 4 (2 premium)
- Guides: 4 (1 premium)
- Reviews (flight/hotel/lounge): 4 (1 premium)
- Deals: 4 (with deal tags)

**AC:**
- [ ] 20 articles seeded
- [ ] Categories, sub-categories, premium flags correct
- [ ] Deal tags present (HOT, SWEET SPOT, PROMO)
- [ ] Published dates in descending order

---

### Story 01.5 — Seed membership tiers + consulting packages
**Priority:** P1 | **Depends on:** 01.1

**File:** `prisma/seed.ts` (add to existing)

Membership tiers: Free (Rp0), Plus (Rp49K/mo), Pro (Rp99K/mo, highlighted), Concierge (Custom)

Consulting packages: Card Audit (Rp299K), Redemption Plan (Rp499K), Full Strategy (Rp899K), Corporate (Custom)

**AC:**
- [ ] 4 tiers seeded
- [ ] 4 consulting packages seeded
- [ ] Pro tier has `is_highlighted: true`
- [ ] Feature lists stored as JSON arrays

---

### Story 01.6 — Database indexes + Prisma generate
**Priority:** P1 | **Depends on:** 01.3, 01.4, 01.5

Add database indexes from architecture.md section 6 for query performance.

**AC:**
- [ ] All indexes in schema
- [ ] `rtk pnpm db:push` applies indexes
- [ ] `rtk pnpm db:generate` succeeds
- [ ] Query EXPLAIN shows index usage for common queries

---

## Epic 2: Public Shell (5 stories)
... (Phase 2-15 stories follow same pattern)

### Story 02.1 — Update __root.tsx: fonts, metadata, theme script
### Story 02.2 — Header/Navbar with all features
### Story 02.3 — Footer with all sections
### Story 02.4 — Responsive mobile menu
### Story 02.5 — styles.css JustMiles theme

---

## Epic 3: Auth System (5 stories)

### Story 03.1 — Better Auth configuration
**Priority:** P0 | **Depends on:** 01.1

Configure Better Auth with email/password authentication.

**Files:** `src/lib/auth.ts`, `.env.local`

**Implementation:**
1. Configure Better Auth with PostgreSQL database (use env DATABASE_URL)
2. Email/password provider
3. Session management with httpOnly cookies
4. Custom user fields: membership_tier (default 'free')

**AC:**
- [ ] Auth server starts without errors
- [ ] Database tables created for users, sessions, accounts
- [ ] `BETTER_AUTH_SECRET` set and valid

---

### Story 03.2 — Login page with shadcn login-01 block
**Priority:** P0 | **Depends on:** 03.1, 00.8

**Route:** `src/routes/auth/login.tsx`

Use shadcn login-01 block adapted with JustMiles branding.

**AC:**
- [ ] Email + password form
- [ ] Form validation (email format, password required)
- [ ] Loading state on submit
- [ ] Error display for invalid credentials
- [ ] Redirect to home on success
- [ ] Link to register page
- [ ] Dark mode compatible

---

### Story 03.3 — Register page with shadcn signup-01 block
**Priority:** P0 | **Depends on:** 03.1, 00.8

**Route:** `src/routes/auth/register.tsx`

Use shadcn signup-01 block adapted with JustMiles branding.

**AC:**
- [ ] Name, email, password, confirm password fields
- [ ] Password match validation
- [ ] Terms & privacy checkbox
- [ ] Loading state on submit
- [ ] Success redirect + toast
- [ ] Link to login page
- [ ] Dark mode compatible

---

### Story 03.4 — Auth guards: tRPC middleware + route protection
**Priority:** P0 | **Depends on:** 03.1

Protect admin routes and procedures.

**Files:** `src/server/trpc/init.ts`, `src/routes/dashboard/` route configs

**AC:**
- [ ] tRPC middleware checks session for protected procedures
- [ ] `beforeLoad` on dashboard routes redirects unauthenticated users
- [ ] Admin role check for admin procedures
- [ ] 401/403 errors with proper messages

---

### Story 03.5 — User menu dropdown in navbar
**Priority:** P1 | **Depends on:** 03.1, 00.5

Show user avatar + dropdown when logged in, login/register buttons when not.

**AC:**
- [ ] Logged out: "Masuk" + "Daftar" buttons
- [ ] Logged in: Avatar + dropdown (Dashboard, Settings, Logout)
- [ ] Smooth dropdown animation
- [ ] Responsive on mobile

---

## Epic 4-15: Remaining Epics

Due to file size, epics 4-15 follow the same story structure as defined in `sprint-status.yaml`.
Each story in those epics follows this template:

```
### Story XX.Y — Name
**Priority:** P0/P1/P2 | **Depends on:** XX.Y

Brief description of what to build.

**Files:** src/routes/..., src/components/...

**AC:**
- [ ] Specific, testable criterion
- [ ] Specific, testable criterion
```

Story details are in `sprint-status.yaml` with the full breakdown of 99 stories
across 16 phases. Implementation should follow the order in that file.

Key dependencies:
- All pages depend on Phase 00 (shell + theme + shared components)
- Calculator (Phase 06) must be built before Compare (Phase 07) — shares engine
- Card detail (Phase 05) must be built before Compare references cards
- Content pages (Phase 08) depend on article router + ArticleCard
- Quiz (Phase 11) depends on calculator engine + card data
- Admin (Phase 12) depends on auth (Phase 03)
- Charts (Phase 14) depends on admin dashboard (Phase 12)
- Polish (Phase 15) depends on all other phases

---

*Epics & Stories v1.0 — Claw Kun 🐾 | JustMiles | 2026-05-17*
