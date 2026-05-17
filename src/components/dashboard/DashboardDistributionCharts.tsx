import {
  BarMetricChart,
  PieDistributionChart,
  getChartColor,
} from '#/components/charts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import type {
  AdminArticleCategoryPoint,
  AdminMembershipDistributionPoint,
} from '#/server/repositories/admin-overview.repo'
import type { ReactElement } from 'react'

interface DashboardDistributionChartsProps {
  articleCategories: AdminArticleCategoryPoint[]
  membershipDistribution: AdminMembershipDistributionPoint[]
}

const articleSeries = [
  {
    key: 'articles',
    label: 'Articles',
    color: getChartColor(1),
  },
] as const

export function DashboardDistributionCharts({
  articleCategories,
  membershipDistribution,
}: DashboardDistributionChartsProps): ReactElement {
  const articleData = articleCategories.map((item) => ({
    label: getDisplayLabel(item.category),
    articles: item.articles,
  }))
  const membershipData = membershipDistribution.map((item) => ({
    label: getDisplayLabel(item.tier),
    value: item.users,
  }))

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-primary">
            Articles by category
          </CardTitle>
          <CardDescription>
            Distribusi konten untuk melihat kategori yang paling berat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {articleData.length === 0 ? (
            <EmptyChartState label="Belum ada artikel." />
          ) : (
            <BarMetricChart data={articleData} series={articleSeries} />
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-primary">
            Membership distribution
          </CardTitle>
          <CardDescription>
            Proporsi user berdasarkan tier membership saat ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {membershipData.length === 0 ? (
            <EmptyChartState label="Belum ada user." />
          ) : (
            <PieDistributionChart data={membershipData} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyChartState({ label }: { label: string }): ReactElement {
  return (
    <div className="grid h-[18rem] place-items-center rounded-2xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  )
}

function getDisplayLabel(value: string): string {
  return value
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}
