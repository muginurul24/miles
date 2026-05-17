import { Link } from '@tanstack/react-router'
import { EmptyState, RatingBadge } from '#/components/shared'
import { Badge } from '#/components/shared/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { calculateMiles, getRating } from '#/lib/calculator'

import type { CalculatorFormValue } from '#/components/calculator/CalculatorForm'
import type { CalculationResult, RatingLabel } from '#/lib/calculator'
import type { CalculatorCard } from '#/server/repositories/calculator.repo'
import type { ReactElement } from 'react'

export interface CalculatorCompareTableProps {
  cards: CalculatorCard[]
  value: CalculatorFormValue
}

interface CompareRow {
  card: CalculatorCard
  result: CalculationResult
  rating: RatingLabel | null
}

const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
})

function formatIdr(value: number): string {
  return `Rp${numberFormatter.format(value)}`
}

function sortRows(first: CompareRow, second: CompareRow): number {
  if (first.result.idrPerMile === second.result.idrPerMile) {
    return first.card.shortName.localeCompare(second.card.shortName)
  }

  if (first.result.idrPerMile === null) {
    return 1
  }

  if (second.result.idrPerMile === null) {
    return -1
  }

  return first.result.idrPerMile - second.result.idrPerMile
}

export function CalculatorCompareTable({
  cards,
  value,
}: CalculatorCompareTableProps): ReactElement {
  const rows = cards
    .flatMap<CompareRow>((card) => {
      const earningRate = card.earningRates.find(
        (rate) => rate.transactionType === value.transactionType,
      )
      const transferPartner = card.transferPartners.find(
        (partner) => partner.program === value.partnerProgram,
      )

      if (!earningRate || !transferPartner) {
        return []
      }

      const result = calculateMiles({
        amount: value.amount,
        spendPerPoint: earningRate.spendPerPoint,
        pointsEarned: earningRate.pointsEarned,
        pointsRequired: transferPartner.pointsRequired,
        milesReceived: transferPartner.milesReceived,
      })

      return [
        {
          card,
          result,
          rating:
            result.idrPerMile === null ? null : getRating(result.idrPerMile),
        },
      ]
    })
    .sort(sortRows)

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-2">
            <CardTitle className="font-display text-2xl text-primary">
              Ranking semua kartu
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Urutan kartu yang kompatibel dengan tipe transaksi dan partner
              miles yang kamu pilih.
            </p>
          </div>
          <Badge tone="accent" size="md">
            {rows.length} kartu
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {rows.length === 0 ? (
          <EmptyState
            compact
            eyebrow="No matches"
            title="Kombinasi belum didukung"
            description="Tidak ada kartu yang mendukung kombinasi transaksi dan partner ini."
            className="bg-background"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Kartu</TableHead>
                <TableHead className="text-right">Miles</TableHead>
                <TableHead className="text-right">IDR/Mile</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.card.id}>
                  <TableCell className="font-mono text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/credit-cards/$slug"
                      params={{ slug: row.card.id }}
                      className="font-medium text-primary no-underline hover:text-accent"
                    >
                      {row.card.shortName}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {row.card.bank}
                    </p>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {numberFormatter.format(row.result.miles)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-primary">
                    {row.result.idrPerMile === null
                      ? '-'
                      : formatIdr(row.result.idrPerMile)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.rating ? <RatingBadge rating={row.rating} /> : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
