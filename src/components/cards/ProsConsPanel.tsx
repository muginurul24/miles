import { CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '#/components/ui/card'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface ProsConsPanelProps {
  card: CardWithRelations
}

export function ProsConsPanel({ card }: ProsConsPanelProps): ReactElement {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card className="border-emerald-200 bg-emerald-50 p-5 text-emerald-900 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-100">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          Kelebihan
        </h2>
        <ul className="grid gap-2 text-sm leading-6">
          {card.pros.map((pro) => (
            <li key={pro.id} className="flex gap-2">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300"
                aria-hidden="true"
              />
              <span>{pro.text}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-red-200 bg-red-50 p-5 text-red-900 shadow-sm dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-100">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <XCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
          Kekurangan
        </h2>
        <ul className="grid gap-2 text-sm leading-6">
          {card.cons.map((con) => (
            <li key={con.id} className="flex gap-2">
              <XCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-300"
                aria-hidden="true"
              />
              <span>{con.text}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  )
}
