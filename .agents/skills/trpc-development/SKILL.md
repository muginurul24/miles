---
name: trpc-development
description: tRPC API development — routers, procedures, middleware, client usage, error handling, Zod validation
---

# Skill: trpc-development

## Purpose
tRPC API development conventions — routers, procedures, middleware, client usage. Activate when creating/modifying ANY API endpoint.

## Patterns

### Procedure Types
```tsx
// Query — read data (GET)
list: publicProcedure
  .input(z.object({ bank: z.string().optional() }))
  .query(async ({ input }) => { ... })

// Mutation — write data (POST/PUT/DELETE)
create: protectedProcedure
  .input(z.object({ name: z.string() }))
  .mutation(async ({ input, ctx }) => { ... })
```

### Router Organization
```
src/server/trpc/
├── init.ts          # TRPC init + public/protected procedures
├── router.ts        # Root router — merges all sub-routers
├── cards.ts         # Credit card procedures
├── articles.ts      # Article procedures
├── calculator.ts    # Calculator procedures
├── membership.ts    # Membership procedures
├── consulting.ts    # Consulting procedures
└── admin.ts         # Admin-only procedures
```

### Router with satisfies TRPCRouterRecord
```tsx
import type { TRPCRouterRecord } from '@trpc/server'

const cardsRouter = {
  list: publicProcedure.query(() => cardsRepo.findAll()),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => cardsRepo.findBySlug(input.slug)),
} satisfies TRPCRouterRecord  // ← MANDATORY for type safety
```

### Client Usage
```tsx
import { trpc } from '#/integrations/trpc/react'

// Query
const { data, isLoading, error } = trpc.cards.list.useQuery({ bank: 'BCA' })

// Mutation
const mutation = trpc.cards.create.useMutation({
  onSuccess: () => { /* toast + invalidate */ },
})
```

### Error Handling
```tsx
import { TRPCError } from '@trpc/server'

// In procedure
if (!card) throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Kartu tidak ditemukan',
})

// Client handling
try {
  await mutation.mutateAsync(data)
} catch (err) {
  // tRPC errors are typed — message is user-friendly
  showToast(err.message)
}
```

### Input Validation
```tsx
// Every procedure with input MUST have Zod schema
.input(z.object({
  slug: z.string().min(1, 'Slug wajib diisi'),
  amount: z.number().positive('Nominal harus positif').max(1000000000),
}))
```

## Anti-patterns
- ❌ Using `fetch()` or `axios` anywhere — ALWAYS tRPC
- ❌ Procedures without `satisfies TRPCRouterRecord`
- ❌ Input procedures without Zod schema
- ❌ Throwing raw Error — always use TRPCError with code
- ❌ Accessing Prisma directly in procedure (use repo)

## Verification
```bash
rtk pnpm build  # TypeScript checks all procedures
```
