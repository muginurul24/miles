import { CreditCard } from 'lucide-react'
import { Badge } from '#/components/shared'
import { Card, CardContent } from '#/components/ui/card'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface CardDetailHeroProps {
  card: CardWithRelations
}

export function CardDetailHero({ card }: CardDetailHeroProps): ReactElement {
  return (
    <Card className="overflow-hidden border-border bg-card py-0 shadow-sm">
      {card.imageUrl ? (
        <div className="aspect-[16/8] overflow-hidden bg-secondary">
          <img
            src={card.imageUrl}
            alt={card.shortName}
            className="h-full w-full object-cover"
            decoding="async"
            loading="eager"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/8] items-center justify-center bg-primary text-primary-foreground">
          <CreditCard className="h-16 w-16 opacity-70" aria-hidden="true" />
        </div>
      )}

      <CardContent className="grid gap-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" size="md">
            {card.bank}
          </Badge>
          <Badge size="md">
            {card.network} {card.tier}
          </Badge>
        </div>

        <div className="grid gap-3">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {card.name}
          </h1>
          {card.bestFor ? (
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {card.bestFor}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
