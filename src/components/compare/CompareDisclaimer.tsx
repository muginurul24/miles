import { Info } from 'lucide-react'
import { Card } from '#/components/ui/card'

import type { ReactElement } from 'react'

export function CompareDisclaimer(): ReactElement {
  return (
    <Card className="border-border bg-card p-5 shadow-sm">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
          <Info className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="grid gap-2">
          <h2 className="font-display text-xl font-bold text-primary">
            Catatan perbandingan
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Simulasi ini memakai data earning rate, transfer ratio, dan formula
            JustMiles. Hasil aktual bisa berubah karena aturan bank, perubahan
            program airline, batas kategori transaksi, promo, pajak, dan
            rounding internal masing-masing issuer.
          </p>
        </div>
      </div>
    </Card>
  )
}
