import { createFileRoute } from '@tanstack/react-router'
import { Activity, CreditCard, FileText, Inbox } from 'lucide-react'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { Badge } from '#/components/shared'
import { Card, CardContent } from '#/components/ui/card'
import { requireAdmin } from '#/lib/auth-guards'

import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

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
    <DashboardShell
      title="Dashboard"
      description="Operational cockpit untuk konten, kartu, inquiry, subscriber, dan membership JustMiles."
    >
      <section className="grid gap-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="island-kicker">Admin overview</p>
              <h2 className="font-display text-3xl font-bold text-primary">
                JustMiles Control Center
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Layout dashboard sudah memakai sidebar responsive, top header,
                dan area konten khusus admin. Data operasional akan masuk di
                story berikutnya.
              </p>
            </div>
            <Badge tone="accent" size="md">
              Phase 12
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardSections.map((section) => (
            <DashboardSectionCard key={section.title} section={section} />
          ))}
        </div>
      </section>
    </DashboardShell>
  )
}

const dashboardSections = [
  {
    title: 'Cards',
    description: 'CRUD kartu, earning rates, partners, pros, dan cons.',
    icon: CreditCard,
  },
  {
    title: 'Articles',
    description: 'Kelola news, guides, deals, review, dan premium gating.',
    icon: FileText,
  },
  {
    title: 'Inquiries',
    description: 'Triage consulting inquiry dan status follow-up.',
    icon: Inbox,
  },
  {
    title: 'Analytics',
    description: 'Ringkasan growth subscriber, content, dan membership.',
    icon: Activity,
  },
] as const

interface DashboardSection {
  title: string
  description: string
  icon: LucideIcon
}

interface DashboardSectionCardProps {
  section: DashboardSection
}

function DashboardSectionCard({
  section,
}: DashboardSectionCardProps): ReactElement {
  const Icon = section.icon

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardContent className="grid gap-4 p-5">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-light text-accent dark:text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold text-primary">
            {section.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {section.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
