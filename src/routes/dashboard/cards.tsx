import { createFileRoute } from '@tanstack/react-router'
import { AdminCardsManager } from '#/components/dashboard/AdminCardsManager'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/dashboard/cards')({
  loader: async ({ context }) => {
    const cards = await context.queryClient.ensureQueryData(
      context.trpc.admin.cards.queryOptions(),
    )

    return { cards }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Manage Cards | JustMiles',
      description: 'Admin cards manager untuk kartu kredit JustMiles.',
      path: '/dashboard/cards',
      noIndex: true,
    }),
    links: buildCanonicalLinks('/dashboard/cards'),
  }),
  component: DashboardCardsPage,
})

function DashboardCardsPage() {
  const { cards } = Route.useLoaderData()

  return (
    <DashboardShell
      title="Cards"
      description="Kelola database kartu, metadata utama, benefit, dan data relasi."
    >
      <AdminCardsManager initialCards={cards} />
    </DashboardShell>
  )
}
