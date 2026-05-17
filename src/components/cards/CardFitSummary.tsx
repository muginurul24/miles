import { Card } from '#/components/ui/card'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface CardFitSummaryProps {
  card: CardWithRelations
}

export function CardFitSummary({ card }: CardFitSummaryProps): ReactElement {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card className="gap-3 border-border bg-card p-5 shadow-sm">
        <p className="island-kicker">Cocok untuk</p>
        <h2 className="font-display text-xl font-bold text-primary">
          Profil ideal
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          {card.bestFor ?? 'Traveler yang ingin mengoptimalkan poin kartu ini.'}
        </p>
      </Card>

      <Card className="gap-3 border-border bg-card p-5 shadow-sm">
        <p className="island-kicker">Kurang cocok untuk</p>
        <h2 className="font-display text-xl font-bold text-primary">
          Perlu dipikirkan ulang
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          {card.notIdealFor ??
            'Pengguna yang value transaksinya tidak sesuai earning utama kartu ini.'}
        </p>
      </Card>
    </section>
  )
}
