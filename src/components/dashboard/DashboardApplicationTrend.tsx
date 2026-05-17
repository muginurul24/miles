import { AreaTrendChart, getChartColor } from '#/components/charts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import type { AdminApplicationTrendPoint } from '#/server/repositories/admin-overview.repo'
import type { ReactElement } from 'react'

interface DashboardApplicationTrendProps {
  trend: AdminApplicationTrendPoint[]
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
})

const applicationSeries = [
  {
    key: 'applications',
    label: 'Application interest',
    color: getChartColor(0),
  },
] as const

export function DashboardApplicationTrend({
  trend,
}: DashboardApplicationTrendProps): ReactElement {
  const chartData = trend.map((point) => ({
    label: dateFormatter.format(new Date(`${point.date}T00:00:00.000Z`)),
    applications: point.applications,
  }))

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-primary">
          Card application interest
        </CardTitle>
        <CardDescription>
          Trend klik “Ajukan Kartu Ini” selama 14 hari terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AreaTrendChart data={chartData} series={applicationSeries} />
      </CardContent>
    </Card>
  )
}
