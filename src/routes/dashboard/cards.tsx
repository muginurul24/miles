import { createFileRoute } from '@tanstack/react-router'
import { AdminCardsManager } from '#/components/dashboard/AdminCardsManager'
import { DashboardShell } from '#/components/dashboard/DashboardShell'

export const Route = createFileRoute('/dashboard/cards')({
  loader: async ({ context }) => {
    const cards = await context.queryClient.ensureQueryData(
      context.trpc.admin.cards.queryOptions(),
    )

    return { cards }
  },
  head: () => ({
    meta: [
      {
        title: 'Manage Cards | JustMiles',
      },
      {
        name: 'description',
        content: 'Admin cards manager untuk kartu kredit JustMiles.',
      },
    ],
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
