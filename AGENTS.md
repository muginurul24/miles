# AGENTS.md — JustMiles

> JustMiles — Indonesia's Points & Miles Advisor + Travel Media
> Technical Bible for Codex AI Coding Agent
> Generated: 2026-05-17 by Claw Kun 🐾

<tanstack-start-guidelines>

=== foundation rules ===

# JustMiles Foundation Rules

These guidelines are specifically curated for this application. Follow them closely.

## Foundational Context

This is a TanStack Start application. You are an expert with all these packages & versions.

| Package | Version |
|---|---|
| react / react-dom | 19.2 |
| @tanstack/react-start | latest |
| @tanstack/react-router | latest |
| @tanstack/react-query | latest |
| @tanstack/react-table | latest |
| @tanstack/react-form | latest |
| @tanstack/react-store | latest |
| @tanstack/store | latest |
| typescript | 6.0 |
| tailwindcss | 4.1 |
| prisma | 7.4 |
| better-auth | 1.5 |
| @trpc/client / @trpc/server | 11.11 |
| zod | 4.3 |
| lucide-react | latest |
| radix-ui | 1.4 |
| vite | 8.0 |
| vitest | 4.1 |

## Package Manager

- **pnpm** — always run with `rtk` prefix
- Path alias: `#/*` → `./src/*` (defined in package.json imports)
- Never use relative imports like `../../components/Header` — use `#/components/Header`

## RTK — MANDATORY

EVERY terminal command MUST be prefixed with `rtk`. Path: `/home/mugiew/.local/bin/rtk`

```bash
# ✅ Correct
rtk pnpm dev
rtk git add . && rtk git commit -m "feat: calculator engine"
rtk pnpm dlx shadcn@latest add button

# ❌ Wrong
pnpm dev
git add .
```

## Skills Activation

This project has domain-specific skills in `.agents/skills/`. Activate them when working in that domain:

- `justmiles-conventions` — Never-forget rules (tRPC only, shadcn only, dark mode always, RTK)
- `justmiles-review` — Adversarial code review checklist (40+ items)

## Conventions

- Follow existing code conventions in sibling files — check before creating
- Use descriptive names: `calculateMilesPerPoint()`, not `calc()`
- Check for existing components before writing new ones — search `src/components/`
- One component per file, co-locate sub-components in same file only if < 50 lines
- File limit: 300 lines max — split into smaller modules if exceeded

## Documentation

- Only create documentation files if explicitly requested
- Existing docs are authoritative: `_bmad-output/` contains PRD, architecture, epics

## Replies

- Be concise — focus on what's important, skip obvious details

=== tanstack-start rules ===

# TanStack Start — Core Patterns

## File-Based Routing

Routes are files in `src/routes/`. File name = URL path. NEVER manually define route config arrays.

```
src/routes/
├── __root.tsx               # Root layout (shared shell)
├── index.tsx                # → /
├── about.tsx                # → /about
├── calculator.tsx           # → /calculator
├── credit-cards/
│   ├── index.tsx            # → /credit-cards
│   └── $slug.tsx            # → /credit-cards/:slug
├── auth/
│   ├── login.tsx            # → /auth/login
│   └── register.tsx         # → /auth/register
└── api/
    ├── auth/$.ts            # Better Auth handler
    └── trpc/$.tsx           # tRPC handler
```

**Dynamic segments:** `$paramName.tsx` (NOT `[param].tsx`)
**Layouts:** Folder with `index.tsx` + sibling routes share layout via `__layout.tsx` or nested `<Outlet />`
**Root shell:** `__root.tsx` wraps all routes with `<html>`, `<head>`, `<body>`, Header, Footer

## Route Definition Pattern

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/calculator')({
  component: CalculatorPage,
})
```

**With loader:**
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/credit-cards/$slug')({
  loader: async ({ params }) => {
    const card = await /* tRPC or server fn */ getCardBySlug(params.slug)
    return { card }
  },
  component: CardDetailPage,
})

function CardDetailPage() {
  const { card } = Route.useLoaderData()
  return <div>{card.name}</div>
}
```

## Links & Navigation

```tsx
import { Link } from '@tanstack/react-router'

// Internal navigation
<Link to="/credit-cards" className="...">Credit Cards</Link>

// With params
<Link to="/credit-cards/$slug" params={{ slug: 'bca-krisflyer' }}>BCA KrisFlyer</Link>

// Active link styling
<Link to="/" activeProps={{ className: 'font-bold text-accent' }}>
  Home
</Link>
```

## Server Functions

For server-side logic that needs auth or DB access:

```tsx
import { createServerFn } from '@tanstack/react-start'

const saveCalculation = createServerFn({ method: 'POST' })
  .validator((input: { cardId: string; amount: number }) => input)
  .handler(async ({ data }) => {
    // This runs on server — has access to DB, env vars, etc.
    const result = calculateMiles(data.cardId, data.amount)
    return result
  })
```

## Root Document (__root.tsx)

```tsx
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'JustMiles' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.bunny.net' },
      { rel: 'stylesheet', href: 'https://fonts.bunny.net/css?family=...' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
```

## Common Mistakes — TanStack Start

- ❌ Manually creating route config objects
- ✅ Files in `src/routes/` with `createFileRoute`
- ❌ Using `[slug].tsx` for dynamic params
- ✅ Using `$slug.tsx`
- ❌ Relative imports (`../../components/...`)
- ✅ Path alias (`#/components/...`)
- ❌ Using `window`/`document` in server components without guard
- ✅ Wrap in `if (typeof window !== 'undefined')` or use `'use client'` directive

=== trpc rules ===

# tRPC — API Layer

## Initialization

```tsx
// src/server/trpc/init.ts
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.create({ transformer: superjson })

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(/* auth middleware */)
```

## Router Pattern

```tsx
// src/server/trpc/routers/cards.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../init'
import { cardsRepo } from '#/server/repositories/cards.repo'
import type { TRPCRouterRecord } from '@trpc/server'

const cardsRouter = {
  list: publicProcedure
    .input(z.object({
      bank: z.string().optional(),
      partner: z.string().optional(),
      search: z.string().optional(),
      sort: z.enum(['name', 'fee_asc', 'fee_desc', 'earning_best']).optional(),
    }))
    .query(async ({ input }) => {
      return cardsRepo.findAll(input)
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const card = await cardsRepo.findBySlug(input.slug)
      if (!card) throw new TRPCError({ code: 'NOT_FOUND', message: 'Kartu tidak ditemukan' })
      return card
    }),
} satisfies TRPCRouterRecord

export { cardsRouter }
```

## Client Usage

```tsx
// In components, use tRPC React hooks
import { trpc } from '#/integrations/trpc/react'

function CardList() {
  const { data, isLoading } = trpc.cards.list.useQuery({ bank: 'BCA' })

  if (isLoading) return <Skeleton />
  if (!data?.length) return <EmptyState message="Tidak ada kartu ditemukan" />

  return data.map(card => <CreditCardCard key={card.id} card={card} />)
}
```

## Common Mistakes — tRPC

- ❌ Using raw `fetch('/api/cards')` or `axios`
- ✅ Always use tRPC client hooks (`trpc.cards.list.useQuery()`)
- ❌ Procedures without input validation
- ✅ Every procedure with input must have Zod schema
- ❌ Skipping `satisfies TRPCRouterRecord` on router objects
- ✅ Always use `satisfies TRPCRouterRecord` for type safety
- ❌ Throwing raw errors in procedures
- ✅ Use `new TRPCError({ code: 'NOT_FOUND', message: '...' })`

=== prisma rules ===

# Prisma ORM — Database

## Client Setup

```ts
// src/db.ts
import { PrismaClient } from './generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })

declare global { var __prisma: PrismaClient | undefined }

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })
if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma
```

## Repository Pattern — MANDATORY

NEVER import `prisma` directly in components or tRPC procedures. Use repositories:

```ts
// src/server/repositories/cards.repo.ts
import { prisma } from '#/db'
import type { Prisma } from '#/generated/prisma/client'

export const cardsRepo = {
  async findAll(filters: CardFilters) {
    return prisma.creditCard.findMany({
      where: {
        ...(filters.bank && { bank: filters.bank }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { bank: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        earningRates: true,
        transferPartners: true,
      },
      orderBy: /* sort logic */,
    })
  },

  async findBySlug(slug: string) {
    return prisma.creditCard.findUnique({
      where: { id: slug },
      include: {
        earningRates: true,
        transferPartners: true,
        pros: true,
        cons: true,
      },
    })
  },
}
```

## Schema Conventions

- Table names: `snake_case` (`credit_cards`, `earning_rates`)
- Column names: `snake_case` in DB, `camelCase` in Prisma client
- IDs: `text` for slug-based IDs, `uuid` for generated IDs
- Timestamps: `created_at`, `updated_at` with `@default(now())`
- Relations: always define both sides with explicit field references
- Indexes: add `@@index` for frequently queried columns

## Common Mistakes — Prisma

- ❌ Importing `prisma` directly in routes or components
- ✅ Use repository layer (`#/server/repositories/`)
- ❌ Forgetting `include` when accessing relations
- ✅ Always `include` needed relations in query
- ❌ Using raw SQL via `$queryRaw` without approval
- ✅ Use Prisma query builder unless performance-critical
- ❌ Not running `pnpm db:generate` after schema changes
- ✅ Run `rtk pnpm db:generate` then `rtk pnpm db:push`

=== better-auth rules ===

# Better Auth — Authentication

## Server Config

```ts
// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  plugins: [tanstackStartCookies()],
})
```

## Client Usage

```tsx
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient()
```

## Auth Forms

```tsx
import { authClient } from '#/lib/auth-client'

// Login
await authClient.signIn.email({ email, password })

// Register
await authClient.signUp.email({ name, email, password })

// Logout
await authClient.signOut()

// Get session
const { data: session } = authClient.useSession()
```

## Protected Routes

```tsx
// tRPC middleware
import { auth } from '#/lib/auth'

const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({ headers: ctx.headers })
  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, user: session.user } })
})
```

## Common Mistakes — Better Auth

- ❌ Using raw JWT or session management — Better Auth handles it
- ✅ Use `authClient` for all auth operations
- ❌ Checking auth on client without session guard
- ✅ Use `authClient.useSession()` + conditional rendering
- ❌ Forgetting `tanstackStartCookies()` plugin
- ✅ Plugin is required for TanStack Start cookie handling

=== shadcn rules ===

# shadcn/ui — Component Library

## Style Config

- **Style:** new-york (not default)
- **CSS variables:** true
- **Base color:** zinc (can override per-component)
- **Icons:** lucide-react (already installed)
- **CSS file:** `src/styles.css`
- **Utils:** `src/lib/utils.ts` exports `cn()` via clsx + tailwind-merge

## Adding Components

```bash
rtk pnpm dlx shadcn@latest add button
rtk pnpm dlx shadcn@latest add dialog
rtk pnpm dlx shadcn@latest add table
rtk pnpm dlx shadcn@latest add sonner        # Toast
rtk pnpm dlx shadcn@latest add dashboard-01  # Admin block
rtk pnpm dlx shadcn@latest add login-01      # Auth block
rtk pnpm dlx shadcn@latest add signup-01     # Auth block
```

**Chart components (from shadcn charts):**
```bash
rtk pnpm dlx shadcn@latest add chart
# Then manually add chart variants from:
# https://ui.shadcn.com/charts/area
# https://ui.shadcn.com/charts/bar
# https://ui.shadcn.com/charts/line
# https://ui.shadcn.com/charts/pie
# https://ui.shadcn.com/charts/radar
# https://ui.shadcn.com/charts/radial
# https://ui.shadcn.com/charts/tooltip
```

Components land in `src/components/ui/`. Install via CLI — never copy-paste from docs.

## Component Usage

```tsx
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'

<Button variant="default" size="lg">Hitung Miles</Button>
<Button variant="outline">Bandingkan</Button>
<Input type="email" placeholder="email@example.com" />
<Select onValueChange={handleChange}>
  <SelectTrigger><SelectValue placeholder="Pilih Kartu" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="bca-krisflyer">BCA KrisFlyer Infinite</SelectItem>
  </SelectContent>
</Select>
```

## Custom Business Components

Business components use shadcn primitives internally:

```
src/components/
├── ui/              # shadcn primitives (never modify — re-add to update)
├── shared/          # Breadcrumb, Badge, PageHeader, NewsletterCTA, RatingBadge
├── cards/           # CreditCardCard, StatCard, ArticleCard
├── calculator/      # CalculatorForm, CalculatorResult, CompareTable
├── layout/          # Header, Footer, MobileMenu, ThemeToggle
└── charts/          # Chart wrappers (area-chart, bar-chart, etc.)
```

## Common Mistakes — shadcn

- ❌ Copy-pasting component source from docs instead of using CLI
- ✅ Always `pnpm dlx shadcn@latest add <name>`
- ❌ Modifying `src/components/ui/button.tsx` directly
- ✅ Re-add via CLI to update, override styles with className
- ❌ Using non-lucide icons (FontAwesome, Material Icons)
- ✅ All icons from `lucide-react`
- ❌ Building custom modal/dropdown/select from scratch
- ✅ Check https://ui.shadcn.com/docs/components first

=== tailwind rules ===

# Tailwind CSS v4 — Styling

## Configuration

- **No `tailwind.config.js`** — Tailwind v4 is CSS-first
- Theme tokens in `src/styles.css` via `@theme` and CSS variables
- Dark mode via `.dark` class strategy (set on `<html>`)

## CSS Variables (JustMiles Theme)

```css
@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);      /* navy #0a0f26 */
  --accent: oklch(0.546 0.245 262.881);        /* indigo-600 */
  /* ... full shadcn tokens */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --accent: oklch(0.646 0.222 262.881);        /* indigo-400 */
}

@theme inline {
  --font-sans: 'Plus Jakarta Sans', sans-serif;
  --font-serif: 'Andada Pro', serif;
  --font-display: 'Funnel Display', sans-serif;
  --font-mono: 'Fira Mono', monospace;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... mapped shadcn tokens */
}
```

## Font Classes

```html
<!-- Headings -->
<h1 class="font-display text-4xl font-bold">JustMiles</h1>

<!-- Body text -->
<p class="font-sans text-base">Deskripsi kartu kredit...</p>

<!-- Serif accent (quotes, testimonials) -->
<blockquote class="font-serif italic">"Miles terbaik untuk travelling"</blockquote>

<!-- Code/numbers (calculator, tables) -->
<code class="font-mono text-sm">1,250,000</code>
```

## Responsive Pattern

```html
<!-- Mobile-first: 1 col → 2 col tablet → 3 col desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Common Mistakes — Tailwind

- ❌ Hardcoding hex colors like `#0a0f26` — use `text-primary`, `bg-background`
- ❌ Using inline styles
- ❌ Creating custom CSS classes for components (use Tailwind utilities)
- ❌ Forgetting dark mode variants — every component needs `dark:` variants
- ❌ Using Google Fonts import — already on fonts.bunny.net

=== typescript rules ===

# TypeScript — Strict Mode

## Rules

- **Strict mode** — `tsconfig.json` has `strict: true`
- **No `any`** — use `unknown` + type guard if truly dynamic
- **Explicit return types** on exported functions: `function calc(): number`
- **`interface` for public APIs**, `type` for unions/intersections
- **Zod schemas** for all form and procedure input validation
- **`satisfies` operator** for config objects and router records

## Path Alias

```ts
// ✅ Use #/ alias (defined in package.json imports)
import { Header } from '#/components/Header'
import { cn } from '#/lib/utils'
import { cardsRepo } from '#/server/repositories/cards.repo'

// ❌ Never relative imports beyond ./ or ../
import { Header } from '../../components/Header'
```

## Common Mistakes — TypeScript

- ❌ `any` types — use `unknown` instead
- ❌ Returning `void` when function returns a value — add explicit return type
- ❌ Using `as` casts without validation — use type guards
- ❌ Forgetting to add Zod input schema on tRPC procedures

=== testing rules ===

# Testing — Vitest

## Commands

```bash
rtk pnpm test                 # Run all tests
rtk pnpm test -- --reporter=verbose  # Detailed output
```

## Test Pattern

```ts
// tests/lib/calculator.test.ts
import { describe, it, expect } from 'vitest'
import { calculateMiles, getRating } from '#/lib/calculator'

describe('calculateMiles', () => {
  it('calculates points correctly for local transaction', () => {
    const result = calculateMiles({
      spendPerPoint: 10000,
      pointsEarned: 1,
      amount: 1500000,
      pointsRequired: 1,
      milesReceived: 1,
    })
    expect(result.points).toBe(150)
    expect(result.miles).toBe(150)
  })

  it('rounds up fractional points (ceil)', () => {
    const result = calculateMiles({
      spendPerPoint: 10000,
      pointsEarned: 1,
      amount: 15001,
      pointsRequired: 1,
      milesReceived: 1,
    })
    expect(result.points).toBe(2) // ceil(1.5001) = 2
  })
})

describe('getRating', () => {
  it('returns Excellent for ≤ 7500', () => {
    expect(getRating(5000)).toBe('Excellent')
    expect(getRating(7500)).toBe('Excellent')
  })
  it('returns Poor for > 30000', () => {
    expect(getRating(35000)).toBe('Poor')
  })
})
```

## What to Test

- **Unit tests:** Pure functions in `src/lib/` (calculator, validators, utilities)
- **Component tests:** Form validation, user interactions
- **Integration tests:** tRPC procedures with test database
- **E2E:** Critical flows only (calculator, compare, quiz) — Phase 15

## Common Mistakes — Testing

- ❌ Testing implementation details (internal state, method names)
- ✅ Test behavior — input → output
- ❌ Not testing edge cases (zero, negative, very large numbers)
- ✅ Test boundaries: min, max, zero, empty, null
- ❌ Tests that depend on each other (order-dependent)
- ✅ Each test is isolated and independent

=== design-system rules ===

# JustMiles Design System

## Theme Tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `#ffffff` | `#0f172a` | Page background |
| `--foreground` | `#0a0f26` | `#f1f5f9` | Primary text |
| `--primary` | `#0a0f26` | `#f1f5f9` | Headings, nav |
| `--accent` | `#4F46E5` | `#6366f1` | CTAs, links, calculator |
| `--muted` | `#64748b` | `#94a3b8` | Secondary text |
| `--card` | `#ffffff` | `#1e293b` | Card backgrounds |
| `--border` | `#e2e8f0` | `#334155` | Card borders |

## Rating Colors

```tsx
const ratingStyles = {
  Excellent:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Very Good': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  Good:        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Average:     'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Poor:        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
} as const
```

## Calculator Formula (Source of Truth)

```
Points    = Math.ceil(Nominal / SpendPerPoint) × PointsEarned
Miles     = Math.ceil(Points × MilesReceived / PointsRequired)
IDR/Mile  = Math.ceil(Nominal / Miles)   // lower = better value
```

## Rating Thresholds

| IDR per Mile | Rating |
|---|---|
| ≤ 7,500 | Excellent |
| 7,501 – 12,500 | Very Good |
| 12,501 – 20,000 | Good |
| 20,001 – 30,000 | Average |
| > 30,000 | Poor |

## Transaction Types

```ts
const TRANSACTION_TYPES = ['local', 'overseas', 'dining', 'online', 'travel'] as const
type TransactionType = typeof TRANSACTION_TYPES[number]
```

## Transfer Programs

```
GarudaMiles, KrisFlyer, Asia Miles, Emirates Skywards, British Airways
```

=== deployment rules ===

# Deployment

- Build: `rtk pnpm build` (Vite SSR bundle)
- Production server: `node .output/server/index.mjs`
- Environment variables in `.env.local` (never commit)
- Database: PostgreSQL with Prisma migrations

</tanstack-start-guidelines>
