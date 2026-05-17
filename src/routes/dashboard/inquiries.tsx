import { createFileRoute } from '@tanstack/react-router'
import { AdminInquiriesManager } from '#/components/dashboard/AdminInquiriesManager'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/dashboard/inquiries')({
  loader: async ({ context }) => {
    const inquiries = await context.queryClient.ensureQueryData(
      context.trpc.admin.inquiries.queryOptions(),
    )

    return { inquiries }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Manage Inquiries | JustMiles',
      description: 'Admin inquiry manager untuk consulting JustMiles.',
      path: '/dashboard/inquiries',
      noIndex: true,
    }),
    links: buildCanonicalLinks('/dashboard/inquiries'),
  }),
  component: DashboardInquiriesPage,
})

function DashboardInquiriesPage() {
  const { inquiries } = Route.useLoaderData()

  return (
    <DashboardShell
      title="Inquiries"
      description="Triage consulting inquiry, cek detail kebutuhan, dan update status follow-up."
    >
      <AdminInquiriesManager initialInquiries={inquiries} />
    </DashboardShell>
  )
}
