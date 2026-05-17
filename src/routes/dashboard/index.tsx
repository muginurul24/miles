import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { DashboardOverview } from '#/components/dashboard/DashboardOverview'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/dashboard/')({
  loader: async ({ context }) => {
    const overview = await context.queryClient.ensureQueryData(
      context.trpc.admin.overview.queryOptions(),
    )

    return { overview }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Dashboard | JustMiles',
      description: 'Admin dashboard JustMiles.',
      path: '/dashboard',
      noIndex: true,
    }),
    links: buildCanonicalLinks('/dashboard'),
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
