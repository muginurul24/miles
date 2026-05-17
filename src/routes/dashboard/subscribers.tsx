import { createFileRoute } from '@tanstack/react-router'
import { AdminSubscribersManager } from '#/components/dashboard/AdminSubscribersManager'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/dashboard/subscribers')({
  loader: async ({ context }) => {
    const subscribers = await context.queryClient.ensureQueryData(
      context.trpc.admin.subscribers.queryOptions(),
    )

    return { subscribers }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Manage Subscribers | JustMiles',
      description: 'Admin subscriber manager untuk newsletter JustMiles.',
      path: '/dashboard/subscribers',
      noIndex: true,
    }),
    links: buildCanonicalLinks('/dashboard/subscribers'),
  }),
  component: DashboardSubscribersPage,
})

function DashboardSubscribersPage() {
  const { subscribers } = Route.useLoaderData()

  return (
    <DashboardShell
      title="Subscribers"
      description="Pantau subscriber newsletter, filter status, dan ekspor audience CSV."
    >
      <AdminSubscribersManager initialSubscribers={subscribers} />
    </DashboardShell>
  )
}
