import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { CardFilterBar } from '#/components/cards/CardFilterBar'
import { CreditCardGrid } from '#/components/cards/CreditCardGrid'
import { PageHeader } from '#/components/shared'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

import type { CardDirectoryFilters } from '#/components/cards/CardFilterBar'
import type { CardFilters, CardSort } from '#/server/repositories/cards.repo'

const cardSortSchema = z.enum(['name', 'fee_asc', 'fee_desc', 'earning_best'])

const cardDirectorySearchSchema = z.object({
  search: z.string().catch(''),
  bank: z.string().catch(''),
  partner: z.string().catch(''),
  sort: cardSortSchema.catch('name'),
})

interface CardDirectorySearch {
  search: string
  bank: string
  partner: string
  sort: CardSort
}

function toCardFilters(search: CardDirectorySearch): CardFilters {
  return {
    ...(search.search ? { search: search.search } : {}),
    ...(search.bank ? { bank: search.bank } : {}),
    ...(search.partner ? { partner: search.partner } : {}),
    sort: search.sort,
  }
}

export const Route = createFileRoute('/credit-cards/')({
  validateSearch: (search) => cardDirectorySearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const [cards, filterOptions] = await Promise.all([
      context.queryClient.ensureQueryData(
        context.trpc.cards.list.queryOptions(toCardFilters(deps)),
      ),
      context.queryClient.ensureQueryData(
        context.trpc.cards.filters.queryOptions(),
      ),
    ])

    return { cards, filterOptions }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Direktori Kartu Kredit Miles — JustMiles',
      description:
        'Bandingkan kartu kredit miles Indonesia berdasarkan bank, transfer partner, annual fee, dan earning rate.',
      path: '/credit-cards',
    }),
    links: buildCanonicalLinks('/credit-cards'),
  }),
  component: CreditCardsPage,
})

function CreditCardsPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  const { cards, filterOptions } = Route.useLoaderData()

  function handleFiltersChange(nextFilters: CardDirectoryFilters): void {
    void navigate({
      search: nextFilters,
    })
  }

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Credit Cards"
        title="Direktori kartu kredit miles"
        description="Bandingkan kartu berdasarkan bank, transfer partner, biaya tahunan, dan earning rate yang paling relevan untuk strategi kamu."
      />

      <section className="page-wrap grid gap-6">
        <CardFilterBar
          banks={filterOptions.banks}
          partners={filterOptions.partners}
          filters={search}
          onFiltersChange={handleFiltersChange}
        />
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {cards.length} kartu ditemukan
          </p>
        </div>
        <CreditCardGrid
          cards={cards}
          emptyTitle="Tidak ada kartu ditemukan"
          emptyMessage="Tidak ada kartu yang cocok dengan filter ini."
        />
      </section>
    </main>
  )
}
