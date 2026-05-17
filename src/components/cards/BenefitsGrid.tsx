import { Car, PlaneTakeoff, ShieldCheck } from 'lucide-react'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface BenefitsGridProps {
  card: CardWithRelations
}

export function BenefitsGrid({ card }: BenefitsGridProps): ReactElement {
  const benefits = [
    {
      label: 'Airport Lounge Access',
      available: card.loungeAccess,
      icon: PlaneTakeoff,
    },
    {
      label: 'Travel Insurance',
      available: card.travelInsurance,
      icon: ShieldCheck,
    },
    {
      label: 'Airport Transfer',
      available: card.airportTransfer,
      icon: Car,
    },
  ]

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 grid gap-2">
        <h2 className="font-display text-2xl font-bold text-primary">
          Benefit Utama
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Ringkasan benefit travel yang paling memengaruhi value kartu.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon

          return (
            <Card
              key={benefit.label}
              className={cn(
                'gap-3 border-border p-4 shadow-xs',
                benefit.available
                  ? 'bg-accent-light text-primary dark:bg-accent-light/70'
                  : 'bg-secondary/60 text-muted-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-6 w-6',
                  benefit.available ? 'text-accent' : 'text-muted-foreground',
                )}
                aria-hidden="true"
              />
              <div className="grid gap-1">
                <p className="text-sm font-semibold">{benefit.label}</p>
                <p
                  className={cn(
                    'text-xs font-semibold',
                    benefit.available
                      ? 'text-accent dark:text-primary'
                      : 'text-muted-foreground',
                  )}
                >
                  {benefit.available ? 'Tersedia' : 'Tidak tersedia'}
                </p>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
