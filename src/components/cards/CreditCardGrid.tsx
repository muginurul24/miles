import { CreditCardCard } from '#/components/cards/CreditCardCard'
import { EmptyState } from '#/components/shared'

import type { CardPreview } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface CreditCardGridProps {
  cards: CardPreview[]
  emptyMessage?: string
  emptyTitle?: string
}

export function CreditCardGrid({
  cards,
  emptyMessage = 'Belum ada kartu untuk ditampilkan.',
  emptyTitle = 'Kartu belum tersedia',
}: CreditCardGridProps): ReactElement {
  if (cards.length === 0) {
    return (
      <EmptyState
        eyebrow="No cards"
        title={emptyTitle}
        description={emptyMessage}
      />
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
