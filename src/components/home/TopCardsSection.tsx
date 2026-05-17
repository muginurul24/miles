import { CreditCardGrid } from '#/components/cards/CreditCardGrid'

import type { CardPreview } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface TopCardsSectionProps {
  cards: CardPreview[]
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

      <CreditCardGrid
        cards={cards}
        emptyMessage="Belum ada kartu unggulan untuk ditampilkan."
      />
    </section>
  )
}
