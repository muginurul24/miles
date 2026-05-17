# Skill: justmiles-conventions

## Purpose
Enforce JustMiles project-specific rules that Codex must follow on EVERY implementation task. These are the "never forget" conventions not covered by generic TypeScript/React rules.

## Rules

### 1. tRPC Only — No Raw Fetch
- ❌ `fetch('/api/cards')` or `axios.get('/api/cards')`
- ✅ `trpc.cards.list.useQuery({ bank: 'BCA' })`
- All data fetching goes through tRPC procedures
- API routes exist at `src/routes/api/trpc/$.tsx` — never add separate REST endpoints

### 2. shadcn/ui Only — No Custom Primitives
- ❌ Building a custom modal, select, table, dropdown from scratch
- ✅ `pnpm dlx shadcn@latest add dialog` then customize with Tailwind
- Business components (ArticleCard, CalculatorResult, RatingBadge) use shadcn primitives internally
- Check https://ui.shadcn.com/docs/components before building anything

### 3. Dark Mode on EVERY Component
- Every new component MUST work in both light and dark mode
- Test mentally: light background → dark becomes what? light text → dark becomes what?
- Use shadcn `dark:` variants or CSS variable references
- Never hardcode white/black — use `bg-background`, `text-foreground`, `bg-card`

### 4. Mobile-First Responsive
- Every component must be tested at 375px, 768px, 1280px
- Grid layouts: 1 column mobile → 2 tablet → 3 desktop
- Tables: scrollable container on mobile (never shrink text)
- Navigation: hamburger below 1024px

### 5. TypeScript Strict
- No `any` types — use `unknown` + type guard if truly dynamic
- Explicit return types on all exported functions
- Zod schemas for all form and procedure inputs

### 6. RTK Prefix — MANDATORY
```bash
rtk pnpm dev
rtk git add . && rtk git commit -m "feat: ..."
rtk pnpm dlx shadcn@latest add button
```
Never run a terminal command without `rtk` prefix.

### 7. File Router Conventions
- Routes in `src/routes/` — file name = URL path
- Dynamic params: `$slug.tsx` (not `[slug].tsx`)
- Nested layouts: folder with `index.tsx` + sibling files
- Never manually define route config arrays
- Path imports: `#/components/Header` (not `../../components/Header`)

### 8. JustMiles Design Tokens
```css
/* Use these Tailwind classes, never hardcode hex */
Primary text:   text-primary     /* navy #0a0f26 light / slate-100 dark */
Background:     bg-cream         /* #F3F1E7 light / slate-900 dark */
Accent/CTA:     text-accent      /* indigo-600 light / indigo-400 dark */
Surface cards:  bg-card          /* white light / slate-800 dark */
Muted text:     text-muted-foreground
```

### 9. Fonts
```css
Headings:  font-display   → Funnel Display
Body:      font-sans      → Plus Jakarta Sans
Serif:     font-serif     → Andada Pro
Code:      font-mono      → Fira Mono
```
Never use other font families. Fonts load from fonts.bunny.net — already configured.

### 10. Component Co-location Pattern
```
src/components/
├── ui/           # shadcn primitives (don't modify, re-add to update)
├── shared/       # Reusable across pages (Breadcrumb, Badge, PageHeader, NewsletterCTA)
├── cards/        # CreditCardCard, StatCard, ArticleCard
├── calculator/   # CalculatorForm, CalculatorResult, CompareTable
├── layout/       # Header, Footer, MobileMenu, ThemeToggle
└── charts/       # Chart wrappers (from shadcn charts)
```

## Verification
```bash
rtk pnpm lint && rtk pnpm check && rtk pnpm build
```
All must pass with zero errors before considering a story complete.
