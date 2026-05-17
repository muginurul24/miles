import { CreditCardCard } from '#/components/cards/CreditCardCard'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface TopCardsSectionProps {
  cards: CardWithRelations[]
}

export function TopCardsSection({ cards }: TopCardsSectionProps): ReactElement {
  return (
    <section className="page-wrap py-10 md:py-14">
      <div className="mb-6 max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">
          Top Credit Cards
        </p>
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">
          Kartu dengan earning rate paling efisien
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          Bandingkan opsi populer dengan biaya per poin terbaik untuk transaksi
          yang paling relevan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <CreditCardCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}
