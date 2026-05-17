# Skill: tanstack-start-development

## Purpose
Deep TanStack Start patterns, file routing conventions, SSR/streaming, server functions. Activate when working on ANY route, layout, or server function.

## Patterns

### File Router — Always use createFileRoute
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/credit-cards/$slug')({
  loader: async ({ params }) => {
    const card = await /* data fetch */
    return { card }
  },
  component: CardDetailPage,
})

function CardDetailPage() {
  const { card } = Route.useLoaderData()
  // ...
}
```

### Dynamic Segments
- `$slug.tsx` → `params.slug`
- `$cardId.tsx` → `params.cardId`
- Nested: `reviews/$category.tsx` → `params.category`
- NEVER use `[param].tsx` (Next.js syntax)

### Loader Pattern
```tsx
loader: async ({ params, context }) => {
  // context has queryClient, trpc, etc.
  const cards = await context.trpc.cards.list.query({ bank: 'BCA' })
  return { cards }
}
```

### Link with Active State
```tsx
import { Link } from '@tanstack/react-router'

<Link to="/calculator" activeProps={{ className: 'text-accent font-semibold' }}>
  Calculator
</Link>
```

### Not Found Handling
```tsx
loader: async ({ params }) => {
  const card = await getCard(params.slug)
  if (!card) throw notFound()
  return { card }
}
```

### Head/Meta Per Route
```tsx
export const Route = createFileRoute('/credit-cards/$slug')({
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.card.name} — JustMiles` },
      { name: 'description', content: loaderData.card.bestFor },
    ],
  }),
  // ...
})
```

## Anti-patterns
- ❌ Creating route config arrays manually
- ❌ Using `useEffect` for initial data fetch (use loader instead)
- ❌ `[id].tsx` syntax — this is Next.js, not TanStack
- ❌ `import { useRouter } from 'next/navigation'` — use TanStack Router APIs
- ❌ Server-only code in component body without `'use client'` or guard

## Verification
```bash
rtk pnpm dev  # Check all routes resolve without errors
```
