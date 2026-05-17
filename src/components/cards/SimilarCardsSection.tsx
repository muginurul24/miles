import { CreditCardCard } from '#/components/cards/CreditCardCard'

import type { CardPreview } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface SimilarCardsSectionProps {
  cards: CardPreview[]
}

export function SimilarCardsSection({
  cards,
}: SimilarCardsSectionProps): ReactElement | null {
  if (cards.length === 0) {
    return null
  }

  return (
    <section className="grid gap-4">
      <div className="grid gap-2">
        <h2 className="font-display text-2xl font-bold text-primary">
          Kartu Serupa
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Alternatif dengan bank atau transfer partner yang relevan untuk
          strategi miles yang sama.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <CreditCardCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}
