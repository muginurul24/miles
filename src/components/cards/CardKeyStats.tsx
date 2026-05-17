import { CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface CardKeyStatsProps {
  card: CardWithRelations
}

const numberFormatter = new Intl.NumberFormat('id-ID')

function formatIdr(value: number): string {
  return `Rp${numberFormatter.format(value)}`
}

export function CardKeyStats({ card }: CardKeyStatsProps): ReactElement {
  const loungeAvailable = card.loungeAccess
  const stats = [
    {
      label: 'Annual Fee',
      value: formatIdr(card.annualFee),
      valueClassName: 'text-primary',
    },
    {
      label: 'Min. Income',
      value: formatIdr(card.minIncome),
      valueClassName: 'text-primary',
    },
    {
      label: 'Transfer Partners',
      value: numberFormatter.format(card.transferPartners.length),
      valueClassName: 'text-primary',
    },
    {
      label: 'Lounge',
      value: loungeAvailable ? 'Ya' : 'Tidak',
      valueClassName: loungeAvailable
        ? 'text-emerald-600 dark:text-emerald-300'
        : 'text-red-600 dark:text-red-300',
      icon: loungeAvailable ? CheckCircle2 : XCircle,
    },
  ]

  return (
    <section
      className="grid grid-cols-2 gap-3 md:grid-cols-4"
      aria-label="Ringkasan kartu"
    >
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card
            key={stat.label}
            className="items-center gap-2 border-border bg-card p-4 text-center shadow-xs"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p
              className={cn(
                'flex items-center justify-center gap-1.5 font-display text-lg font-bold',
                stat.valueClassName,
              )}
            >
              {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
              {stat.value}
            </p>
          </Card>
        )
      })}
    </section>
  )
}
