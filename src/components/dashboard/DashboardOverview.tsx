import { AlertCircle, CreditCard, FileText, Inbox, Mail } from 'lucide-react'
import { DashboardApplicationTrend } from '#/components/dashboard/DashboardApplicationTrend'
import { DashboardDistributionCharts } from '#/components/dashboard/DashboardDistributionCharts'
import { DashboardOperationalSnapshot } from '#/components/dashboard/DashboardOperationalSnapshot'
import { Badge } from '#/components/shared'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import type { AdminOverview } from '#/server/repositories/admin-overview.repo'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

interface DashboardOverviewProps {
  overview: AdminOverview
}

interface MetricCard {
  title: string
  value: number
  description: string
  icon: LucideIcon
  tone: 'accent' | 'success' | 'warning' | 'info'
}

const numberFormatter = new Intl.NumberFormat('id-ID')

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function DashboardOverview({
  overview,
}: DashboardOverviewProps): ReactElement {
  const metrics = getMetricCards(overview)

  return (
    <section className="grid gap-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-xs md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="island-kicker">Admin overview</p>
            <h2 className="font-display text-3xl font-bold text-primary">
              JustMiles Control Center
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Ringkasan operasional real-time untuk konten, kartu, newsletter,
              dan consulting inquiry.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent" size="md">
              Phase 12
            </Badge>
            <Badge tone="success" size="md">
              Live data
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <DashboardApplicationTrend trend={overview.applicationTrend} />
        <DashboardOperationalSnapshot overview={overview} />
      </div>

      <DashboardDistributionCharts
        articleCategories={overview.articleCategories}
        membershipDistribution={overview.membershipDistribution}
      />

      <RecentInquiries inquiries={overview.recentInquiries} />
    </section>
  )
}

function getMetricCards(overview: AdminOverview): MetricCard[] {
  return [
    {
      title: 'Credit cards',
      value: overview.stats.totalCards,
      description: 'Kartu aktif dalam database.',
      icon: CreditCard,
      tone: 'accent',
    },
    {
      title: 'Articles',
      value: overview.stats.totalArticles,
      description: 'Konten editorial terbit.',
      icon: FileText,
      tone: 'info',
    },
    {
      title: 'Subscribers',
      value: overview.stats.activeSubscribers,
      description: 'Newsletter aktif.',
      icon: Mail,
      tone: 'success',
    },
    {
      title: 'New inquiries',
      value: overview.stats.newInquiries,
      description: 'Lead consulting belum diproses.',
      icon: AlertCircle,
      tone: 'warning',
    },
  ]
}

interface MetricCardProps {
  metric: MetricCard
}

function MetricCard({ metric }: MetricCardProps): ReactElement {
  const Icon = metric.icon

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="grid gap-2">
          <CardDescription>{metric.title}</CardDescription>
          <CardTitle className="font-display text-3xl text-primary">
            {numberFormatter.format(metric.value)}
          </CardTitle>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-light text-accent dark:text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <Badge tone={metric.tone}>{metric.description}</Badge>
      </CardContent>
    </Card>
  )
}

interface RecentInquiriesProps {
  inquiries: AdminOverview['recentInquiries']
}

function RecentInquiries({ inquiries }: RecentInquiriesProps): ReactElement {
  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-primary">
          Recent consulting activity
        </CardTitle>
        <CardDescription>
          Inquiry terbaru untuk follow-up admin dan triage consulting.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {inquiries.length === 0 ? (
          <EmptyActivity />
        ) : (
          inquiries.map((inquiry) => (
            <InquiryRow key={inquiry.id} inquiry={inquiry} />
          ))
        )}
      </CardContent>
    </Card>
  )
}

interface InquiryRowProps {
  inquiry: AdminOverview['recentInquiries'][number]
}

function InquiryRow({ inquiry }: InquiryRowProps): ReactElement {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold text-primary">
              {inquiry.name}
            </h3>
            <Badge tone={getStatusTone(inquiry.status)}>
              {inquiry.status.replaceAll('_', ' ')}
            </Badge>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {inquiry.email}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {inquiry.packageName ?? 'Paket belum dipilih'}
          </p>
        </div>
        <time
          className="text-sm text-muted-foreground"
          dateTime={new Date(inquiry.createdAt).toISOString()}
        >
          {dateFormatter.format(new Date(inquiry.createdAt))}
        </time>
      </div>
    </div>
  )
}

function EmptyActivity(): ReactElement {
  return (
    <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-border bg-background p-6 text-center">
      <div>
        <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 font-display text-xl font-bold text-primary">
          Belum ada inquiry
        </p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Lead consulting baru akan muncul di sini saat user mengirim form.
        </p>
      </div>
    </div>
  )
}

function getStatusTone(status: string): 'neutral' | 'success' | 'warning' {
  if (status === 'new') {
    return 'warning'
  }

  if (status === 'closed' || status === 'completed') {
    return 'success'
  }

  return 'neutral'
}
