---
name: prisma-development
description: Prisma ORM patterns — schema, migrations, seeding, repository layer
---

# Skill: prisma-development

## Purpose
Prisma ORM patterns — schema, migrations, seeding, repository layer. Activate when working on database, schema, or seed data.

## Patterns

### Schema Naming
```prisma
model credit_card {
  id          String   @id // slug-based
  name        String
  short_name  String
  bank        String
  network     String
  tier        String
  annual_fee  Int
  min_income  Int
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  earning_rates     earning_rate[]
  transfer_partners transfer_partner[]
  pros              card_pro[]
  cons              card_con[]
}
```

- Table names: `snake_case`
- Column names: `snake_case` in DB
- Relations: plural field names match table
- IDs: `String @id` for slug-based, `String @id @default(uuid())` for UUID

### Repository Layer — MANDATORY
```ts
// src/server/repositories/cards.repo.ts
import { prisma } from '#/db'

export const cardsRepo = {
  async findAll(filters: CardFilters) {
    return prisma.creditCard.findMany({
      where: buildWhereClause(filters),
      include: { earningRates: true, transferPartners: true },
      orderBy: buildOrderBy(filters.sort),
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

### Seed File Structure
```ts
// prisma/seed.ts
import { prisma } from '../src/db'

async function main() {
  // Clear existing data
  await prisma.cardCon.deleteMany()
  await prisma.cardPro.deleteMany()
  await prisma.transferPartner.deleteMany()
  await prisma.earningRate.deleteMany()
  await prisma.creditCard.deleteMany()

  // Seed cards with relations
  for (const cardData of creditCardsSeed) {
    const { earningRates, transferPartners, pros, cons, ...card } = cardData
    await prisma.creditCard.create({
      data: {
        ...card,
        earningRates: { create: earningRates },
        transferPartners: { create: transferPartners },
        pros: { create: pros.map(text => ({ text })) },
        cons: { create: cons.map(text => ({ text })) },
      },
    })
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### Schema Changes Workflow
```bash
# 1. Edit prisma/schema.prisma
# 2. Generate client
rtk pnpm db:generate
# 3. Create migration (for production) or push (for dev)
rtk pnpm db:migrate -- --name describe_change
# or
rtk pnpm db:push
# 4. Seed if needed
rtk pnpm db:seed
```

## Anti-patterns
- ❌ Importing `prisma` directly in tRPC procedures or components
- ❌ Raw SQL via `$queryRaw` without explicit approval
- ❌ Forgetting to `include` relations in queries
- ❌ Not adding indexes for frequently queried columns
- ❌ Modifying `src/generated/prisma/` files by hand

## Verification
```bash
rtk pnpm db:generate && rtk pnpm build
```
