# project-context.md — JustMiles Constitution

> Constitution for ALL AI agents working on this project.
> Implementation workflows automatically load this file.
> Focus on UNOBVIOUS conventions — things agents won't infer from code.

---

## Technology Stack & Versions

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 24.x |
| Framework | TanStack Start (SSR) | latest |
| Language | TypeScript | 6.0 |
| Router | TanStack Router (file-based) | latest |
| Styling | Tailwind CSS | 4.1 |
| UI Kit | shadcn/ui (new-york) | latest |
| Icons | Lucide React | latest |
| Auth | Better Auth | 1.5 |
| API | tRPC | 11.11 |
| ORM | Prisma | 7.4 |
| Database | PostgreSQL | 16+ |
| Forms | TanStack Form | latest |
| Tables | TanStack Table | latest |
| State | TanStack Store + Query | latest |
| Validation | Zod | 4.3 |
| Test | Vitest | 4.1 |
| Lint | ESLint (tanstack config) | 9.x |
| Format | Prettier | 3.8 |

## Package Manager

- **pnpm** — always use `rtk pnpm` for install/add/remove
- No workspaces (single package)
- Path alias: `#/*` → `./src/*`

## Code Organization

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (button, input, select, etc.)
│   ├── layout/          # Header, Footer, Navbar, Sidebar, ThemeToggle
│   ├── cards/           # CreditCardCard, ArticleCard, StatCard
│   ├── calculator/      # Calculator form, result display, compare table
│   ├── charts/          # Recharts-based chart components (from shadcn charts)
│   ├── auth/            # Login form, register form, auth guards
│   └── shared/          # Breadcrumb, Toast, Newsletter, Badge, Rating
├── routes/
│   ├── __root.tsx       # Root layout (Header + Footer + Theme script)
│   ├── index.tsx        # Home page
│   ├── calculator.tsx   # Calculator page
│   ├── credit-cards/
│   │   ├── index.tsx    # Directory listing
│   │   └── $slug.tsx    # Card detail
│   ├── compare.tsx      # Compare tool
│   ├── news.tsx         # News listing
│   ├── guides.tsx       # Guides listing
│   ├── deals.tsx        # Deals listing
│   ├── reviews/
│   │   ├── index.tsx    # Redirect to /reviews/flight
│   │   ├── flight.tsx   # Flight reviews
│   │   ├── hotel.tsx    # Hotel reviews
│   │   └── lounge.tsx   # Lounge reviews
│   ├── articles/
│   │   └── $slug.tsx    # Article detail
│   ├── membership.tsx   # Membership tiers
│   ├── consulting.tsx   # Consulting packages + inquiry
│   ├── quiz.tsx         # Advisor quiz
│   ├── about.tsx        # About page
│   ├── privacy.tsx      # Privacy policy
│   ├── terms.tsx        # Terms & conditions
│   ├── disclaimer.tsx   # Disclaimer
│   ├── dashboard/       # Admin dashboard (protected)
│   │   ├── index.tsx    # Dashboard overview
│   │   ├── cards.tsx    # Manage credit cards
│   │   ├── articles.tsx # Manage articles
│   │   ├── inquiries.tsx# Consulting inquiries
│   │   └── subscribers.tsx # Newsletter subscribers
│   ├── auth/
│   │   ├── login.tsx    # Login page
│   │   └── register.tsx # Register page
│   └── api/
│       ├── auth/
│       │   └── $.ts     # Better Auth handler
│       └── trpc/
│           └── $.tsx    # tRPC handler
├── lib/
│   ├── utils.ts         # cn() helper + shared utilities
│   ├── auth.ts          # Better Auth server config
│   ├── auth-client.ts   # Better Auth client
│   ├── calculator.ts    # Miles calculation engine
│   ├── constants.ts     # Static data (banks, programs, transaction types)
│   └── validators.ts    # Zod schemas for forms
├── server/
│   ├── db.ts            # Prisma client singleton
│   ├── trpc/
│   │   ├── init.ts      # tRPC init
│   │   ├── router.ts    # Root router
│   │   ├── cards.ts     # Credit card procedures
│   │   ├── articles.ts  # Article procedures
│   │   ├── calculator.ts# Calculator procedures
│   │   ├── membership.ts# Membership procedures
│   │   ├── consulting.ts# Consulting procedures
│   │   └── admin.ts     # Admin procedures
│   └── repositories/    # Data access layer (one per domain)
├── hooks/               # Shared React hooks
├── stores/              # TanStack Store instances
├── integrations/        # Third-party integration wrappers
│   ├── better-auth/
│   ├── tanstack-query/
│   └── trpc/
└── styles.css           # Tailwind + CSS variables + custom utilities
```

## Critical Implementation Rules

### TypeScript
- Strict mode — no `any` without explicit `// eslint-disable-next-line`
- `interface` for public APIs, `type` for unions/intersections
- Explicit return types on ALL exported functions
- Zod schemas for all form and API input validation
- Use `satisfies` operator for config objects

### React / TanStack Start
- **ALL components must be server-compatible** — no `window`/`document` without guards
- Use `createServerFn` for server mutations that need auth
- Loaders for route data, TanStack Query for client-side fetching
- `use client` directive ONLY when needed (interactivity, state, effects)
- File-based routing — never manually define route configs
- SSR-first: pages should render meaningful HTML on server

### tRPC
- All API calls go through tRPC — no raw fetch
- Protected procedures use middleware auth check
- Input validation with Zod on EVERY procedure
- Error handling with proper tRPC error codes
- Router structure mirrors domain (cards, articles, etc.)

### Database / Prisma
- Repository pattern: `src/server/repositories/` — one file per domain
- NEVER import PrismaClient directly in components — use tRPC
- Migrations via Prisma Migrate (`pnpm db:migrate`)
- Seed file at `prisma/seed.ts` with all reference data
- Naming: snake_case for DB columns, camelCase in TS

### Styling / Tailwind
- Use shadcn/ui `npx shadcn@latest add <component>` for new UI primitives
- Custom utility classes in `src/styles.css` only for shared patterns
- CSS variables (shadcn tokens) for theme colors — never hardcode hex
- Dark mode via `.dark` class on `<html>` — use `dark:` variants
- Responsive: mobile-first, break at sm(640), md(768), lg(1024), xl(1280), 2xl(1536)

### Dark/Light Mode
- Theme toggle available on ALL pages (public + dashboard)
- Three modes: light, dark, system
- Use `next-themes` pattern via Better Auth session or localStorage
- Existing `THEME_INIT_SCRIPT` in `__root.tsx` handles FOUC prevention
- Every component tested in both modes

### Error Handling
- Server errors: tRPC error codes with user-friendly messages
- Client errors: Toast notifications for user feedback
- Form errors: inline field-level validation via TanStack Form + Zod
- 404/500 pages: custom error boundaries per route layout

### Testing
- Unit tests for `src/lib/calculator.ts` (pure functions)
- Component tests for form validation and user interactions
- Integration tests for tRPC procedures
- E2E tests for critical flows: calculator, compare, quiz

## Business Logic: Miles Calculator

Formula (from reference, verified):
```
Points    = ceil(Nominal / SpendPerPoint) × PointsEarned
Miles     = ceil(Points × MilesReceived / PointsRequired)
IDR/Mile  = ceil(Nominal / Miles)   // lower is better
```

Rating thresholds:
| IDR/Mile | Rating |
|---|---|
| ≤ 7,500 | Excellent |
| ≤ 12,500 | Very Good |
| ≤ 20,000 | Good |
| ≤ 30,000 | Average |
| > 30,000 | Poor |

Transaction types: `local`, `overseas`, `dining`, `online`, `travel`

Transfer programs: GarudaMiles, KrisFlyer, Asia Miles, Emirates Skywards, British Airways

## What NOT to Do

- ❌ Don't use raw fetch/axios — always tRPC
- ❌ Don't import PrismaClient in components
- ❌ Don't hardcode hex colors — use Tailwind classes or CSS variables
- ❌ Don't create custom UI primitives that shadcn already provides
- ❌ Don't use inline styles or CSS modules
- ❌ Don't use `any` types
- ❌ Don't skip mobile responsive testing
- ❌ Don't forget dark mode on any component
- ❌ Don't commit `.env.local` or secrets
- ❌ Don't modify `vite.config.ts` without discussion
- ❌ Don't add npm packages — use `rtk pnpm add` and document why

## Reference Data

All 12 credit cards with earning rates, transfer partners, pros/cons, and benefits
are documented in `../reference.html`. This is the SOURCE OF TRUTH for:
- Card names, banks, tiers, networks
- Earning rates per transaction type
- Transfer partner conversion ratios
- Annual fees, minimum income
- Benefits (lounge, insurance, transfer)
- Target user profiles (bestFor, notIdealFor)

The ../reference.html also contains complete UI for every page — use it as the
interaction design spec. Every feature, form, filter, and calculator behavior
must match ../reference.html exactly.

---

*Constitution v1.0 — Claw Kun 🐾 | JustMiles | 2026-05-17*
