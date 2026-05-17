import { createFileRoute } from '@tanstack/react-router'
import { BenefitsGrid } from '#/components/cards/BenefitsGrid'
import { CardFitSummary } from '#/components/cards/CardFitSummary'
import { CardDetailSidebar } from '#/components/cards/CardDetailSidebar'
import { CardDetailHero } from '#/components/cards/CardDetailHero'
import { CardKeyStats } from '#/components/cards/CardKeyStats'
import { EarningRateTable } from '#/components/cards/EarningRateTable'
import { ProsConsPanel } from '#/components/cards/ProsConsPanel'
import { SimilarCardsSection } from '#/components/cards/SimilarCardsSection'
import { TransferPartnerTable } from '#/components/cards/TransferPartnerTable'
import { Breadcrumb } from '#/components/shared'

export const Route = createFileRoute('/credit-cards/$slug')({
  loader: async ({ context, params }) => {
    const [card, similarCards] = await Promise.all([
      context.queryClient.ensureQueryData(
        context.trpc.cards.getBySlug.queryOptions({ slug: params.slug }),
      ),
      context.queryClient.ensureQueryData(
        context.trpc.cards.similar.queryOptions({
          slug: params.slug,
          limit: 3,
        }),
      ),
    ])

    return { card, similarCards }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData.card.shortName} — JustMiles`,
      },
      {
        name: 'description',
        content:
          loaderData.card.bestFor ??
          `Review earning rate dan benefit ${loaderData.card.shortName}.`,
      },
    ],
  }),
  component: CardDetailPage,
})

function CardDetailPage() {
  const { card, similarCards } = Route.useLoaderData()

  return (
    <main className="page-wrap grid gap-6 py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Credit Cards', to: '/credit-cards' },
          { label: card.shortName },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="grid gap-6">
          <CardDetailHero card={card} />
          <CardKeyStats card={card} />
          <EarningRateTable card={card} />
          <TransferPartnerTable card={card} />
          <ProsConsPanel card={card} />
          <BenefitsGrid card={card} />
          <CardFitSummary card={card} />
          <SimilarCardsSection cards={similarCards} />
        </div>
        <CardDetailSidebar key={card.id} card={card} />
      </div>
    </main>
  )
}
