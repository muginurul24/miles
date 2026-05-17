import { Activity, Crown, Inbox, MousePointerClick } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

import type { AdminOverview } from '#/server/repositories/admin-overview.repo'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

interface DashboardOperationalSnapshotProps {
  overview: AdminOverview
}

const numberFormatter = new Intl.NumberFormat('id-ID')

export function DashboardOperationalSnapshot({
  overview,
}: DashboardOperationalSnapshotProps): ReactElement {
  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-primary">
          Operational snapshot
        </CardTitle>
        <CardDescription>
          Sinyal cepat untuk prioritas konten dan monetisasi.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SnapshotRow
          icon={Inbox}
          label="Total inquiries"
          value={overview.stats.totalInquiries}
        />
        <Separator />
        <SnapshotRow
          icon={MousePointerClick}
          label="Application interest"
          value={overview.stats.totalApplications}
        />
        <Separator />
        <SnapshotRow
          icon={Crown}
          label="Premium articles"
          value={overview.stats.premiumArticles}
        />
        <Separator />
        <SnapshotRow
          icon={Activity}
          label="Public assets"
          value={overview.stats.totalCards + overview.stats.totalArticles}
        />
      </CardContent>
    </Card>
  )
}

interface SnapshotRowProps {
  icon: LucideIcon
  label: string
  value: number
}

function SnapshotRow({
  icon: Icon,
  label,
  value,
}: SnapshotRowProps): ReactElement {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="font-mono text-lg font-semibold text-primary">
        {numberFormatter.format(value)}
      </span>
    </div>
  )
}
