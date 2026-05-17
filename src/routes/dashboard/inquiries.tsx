import { createFileRoute } from '@tanstack/react-router'
import { AdminInquiriesManager } from '#/components/dashboard/AdminInquiriesManager'
import { DashboardShell } from '#/components/dashboard/DashboardShell'

export const Route = createFileRoute('/dashboard/inquiries')({
  loader: async ({ context }) => {
    const inquiries = await context.queryClient.ensureQueryData(
      context.trpc.admin.inquiries.queryOptions(),
    )

    return { inquiries }
  },
  head: () => ({
    meta: [
      {
        title: 'Manage Inquiries | JustMiles',
      },
      {
        name: 'description',
        content: 'Admin inquiry manager untuk consulting JustMiles.',
      },
    ],
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
