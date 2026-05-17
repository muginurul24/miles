import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { DashboardOverview } from '#/components/dashboard/DashboardOverview'

export const Route = createFileRoute('/dashboard/')({
  loader: async ({ context }) => {
    const overview = await context.queryClient.ensureQueryData(
      context.trpc.admin.overview.queryOptions(),
    )

    return { overview }
  },
  head: () => ({
    meta: [
      {
        title: 'Dashboard | JustMiles',
      },
      {
        name: 'description',
        content: 'Admin dashboard JustMiles.',
      },
    ],
  }),
  component: DashboardPage,
})

function DashboardPage() {
  const { overview } = Route.useLoaderData()

  return (
    <DashboardShell
      title="Dashboard"
      description="Operational cockpit untuk konten, kartu, inquiry, subscriber, dan membership JustMiles."
    >
      <DashboardOverview overview={overview} />
    </DashboardShell>
  )
}
