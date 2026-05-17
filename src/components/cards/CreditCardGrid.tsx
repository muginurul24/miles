import { CreditCardCard } from '#/components/cards/CreditCardCard'

import type { CardPreview } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface CreditCardGridProps {
  cards: CardPreview[]
  emptyMessage?: string
}

export function CreditCardGrid({
  cards,
  emptyMessage = 'Belum ada kartu untuk ditampilkan.',
}: CreditCardGridProps): ReactElement {
  if (cards.length === 0) {
    return (
      <p className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <CreditCardCard key={card.id} card={card} />
      ))}
    </div>
  )
}
