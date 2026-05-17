import {
  ArrowDownWideNarrow,
  CircleDollarSign,
  Plane,
  Star,
} from 'lucide-react'
import { Card } from '#/components/ui/card'

import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

const formulas = [
  {
    icon: Star,
    title: 'Points',
    formula: 'ceil(nominal / spend per point) × points earned',
    description:
      'Poin kartu dihitung dengan pembulatan ke atas agar mengikuti pola earning bank.',
  },
  {
    icon: Plane,
    title: 'Miles',
    formula: 'ceil(points × miles received / points required)',
    description:
      'Poin lalu dikonversi ke airline miles berdasarkan ratio transfer tiap kartu.',
  },
  {
    icon: CircleDollarSign,
    title: 'IDR/Mile',
    formula: 'ceil(nominal / miles)',
    description:
      'Semakin rendah biaya per mile, semakin efisien kartu tersebut untuk strategi miles.',
  },
] satisfies {
  icon: LucideIcon
  title: string
  formula: string
  description: string
}[]

export function CalculatorFormulaExplainer(): ReactElement {
  return (
    <section className="page-wrap mt-6 grid gap-4">
      <div className="grid gap-2">
        <p className="island-kicker">Formula</p>
        <h2 className="font-display text-2xl font-bold text-primary">
          Cara JustMiles membaca value
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Kalkulator ini fokus pada value miles, bukan sekadar jumlah poin. Itu
          sebabnya ranking selalu memakai IDR per mile sebagai kompas utama.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {formulas.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.title} className="gap-3 border-border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent-light text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="grid gap-2">
                <h3 className="font-display text-lg font-bold text-primary">
                  {item.title}
                </h3>
                <code className="text-xs">{item.formula}</code>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="flex-row items-start gap-3 border-accent/20 bg-accent-light p-5 text-primary dark:bg-accent-light/70">
        <ArrowDownWideNarrow
          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
          aria-hidden="true"
        />
        <p className="text-sm leading-7">
          Gunakan ranking sebagai baseline, lalu tetap pertimbangkan annual fee,
          welcome bonus, lounge access, dan program airline yang benar-benar
          kamu pakai.
        </p>
      </Card>
    </section>
  )
}
