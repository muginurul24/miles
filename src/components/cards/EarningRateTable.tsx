import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface EarningRateTableProps {
  card: CardWithRelations
}

const SAMPLE_AMOUNT = 10_000_000

const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
})

const transactionTypes = [
  { value: 'local', label: 'Transaksi Lokal' },
  { value: 'overseas', label: 'Transaksi Overseas' },
  { value: 'dining', label: 'Dining & Restoran' },
  { value: 'online', label: 'Online & E-Commerce' },
  { value: 'travel', label: 'Travel & Penerbangan' },
] as const

function formatIdr(value: number): string {
  return `Rp${numberFormatter.format(value)}`
}

function formatPoints(value: number): string {
  return numberFormatter.format(value)
}

export function EarningRateTable({
  card,
}: EarningRateTableProps): ReactElement {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 grid gap-2">
        <h2 className="font-display text-2xl font-bold text-primary">
          Earning Rate
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Estimasi poin yang terkumpul dari transaksi Rp10.000.000 untuk tiap
          kategori spending.
        </p>
      </div>

      <Table>
        <TableCaption>
          Perhitungan memakai formula JustMiles: ceil(nominal / spend per point)
          × points earned.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis Transaksi</TableHead>
            <TableHead className="text-right">Spend per Point</TableHead>
            <TableHead className="text-right">Poin dari Rp10.000.000</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionTypes.map((transactionType) => {
            const earningRate = card.earningRates.find(
              (rate) => rate.transactionType === transactionType.value,
            )
            const samplePoints = earningRate
              ? Math.ceil(SAMPLE_AMOUNT / earningRate.spendPerPoint) *
                earningRate.pointsEarned
              : null

            return (
              <TableRow key={transactionType.value}>
                <TableCell className="font-medium">
                  {transactionType.label}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {earningRate ? formatIdr(earningRate.spendPerPoint) : '-'}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-primary">
                  {samplePoints === null ? '-' : formatPoints(samplePoints)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}
