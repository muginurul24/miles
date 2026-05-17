import { CreditCard, PlaneTakeoff } from 'lucide-react'
import { Badge } from '#/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { cn } from '#/lib/utils'

import type { CardPreview } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface CreditCardCardProps {
  card: CardPreview
  className?: string
}

const numberFormatter = new Intl.NumberFormat('id-ID')

function getBestSpendPerPoint(card: CardPreview): number | null {
  if (card.earningRates.length === 0) {
    return null
  }

  return Math.min(...card.earningRates.map((rate) => rate.spendPerPoint))
}

export function CreditCardCard({
  card,
  className,
}: CreditCardCardProps): ReactElement {
  const bestSpendPerPoint = getBestSpendPerPoint(card)

  return (
    <Card className={cn('border-border bg-card shadow-xs', className)}>
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{card.bank}</Badge>
            <Badge>{card.tier}</Badge>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent-light text-accent">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <div className="grid gap-2">
          <CardTitle className="font-display text-xl leading-7 text-primary">
            {card.shortName}
          </CardTitle>
          {card.bestFor ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {card.bestFor}
            </p>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="rounded-md border border-border bg-background p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Best earning rate
          </p>
          <p className="mt-2 font-mono text-lg font-bold text-primary">
            {bestSpendPerPoint === null
              ? '-'
              : `Rp${numberFormatter.format(bestSpendPerPoint)}/poin`}
          </p>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <PlaneTakeoff className="h-4 w-4 text-accent" aria-hidden="true" />
            Transfer partner
          </div>
          <div className="flex flex-wrap gap-2">
            {card.transferPartners.map((partner) => (
              <Badge key={partner.id} size="sm">
                {partner.program}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
