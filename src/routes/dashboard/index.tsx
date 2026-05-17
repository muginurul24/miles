import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '#/lib/auth-guards'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: requireAdmin,
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
  return (
    <main className="page-wrap py-10 sm:py-14">
      <section className="island-shell rounded-lg p-6 sm:p-8">
        <p className="island-kicker mb-2">Admin</p>
        <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Dashboard
        </h1>
      </section>
    </main>
  )
}
