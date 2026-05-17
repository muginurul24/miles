import { Link } from '@tanstack/react-router'
import { ArrowRight, CircleDollarSign, Plane, Star } from 'lucide-react'
import { Badge, RatingBadge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { calculateMiles, getRating } from '#/lib/calculator'

import type { CompareFormValue } from '#/components/compare/CompareForm'
import type { CompareSpendingValue } from '#/components/compare/CompareSpendingInputs'
import type { RatingLabel } from '#/lib/calculator'
import type { CalculatorCard } from '#/server/repositories/calculator.repo'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

export interface CompareResultsProps {
  cards: CalculatorCard[]
  selections: CompareFormValue
  spending: CompareSpendingValue
}

interface CompareResultCard {
  card: CalculatorCard
  partnerProgram: string
  points: number
  miles: number
  totalSpend: number
  idrPerMile: number | null
  rating: RatingLabel | null
}

const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
})

const spendingKeys = [
  'local',
  'overseas',
  'dining',
  'online',
  'travel',
] satisfies (keyof CompareSpendingValue)[]

function formatIdr(value: number): string {
  return `Rp${numberFormatter.format(value)}`
}

function buildCompareResult(
  card: CalculatorCard,
  partnerProgram: string,
  spending: CompareSpendingValue,
): CompareResultCard | null {
  const transferPartner = card.transferPartners.find(
    (partner) => partner.program === partnerProgram,
  )

  if (!transferPartner) {
    return null
  }

  const totals = spendingKeys.reduce(
    (currentTotals, spendingKey) => {
      const amount = spending[spendingKey]
      const earningRate = card.earningRates.find(
        (rate) => rate.transactionType === spendingKey,
      )

      if (!earningRate || amount <= 0) {
        return currentTotals
      }

      const result = calculateMiles({
        amount,
        spendPerPoint: earningRate.spendPerPoint,
        pointsEarned: earningRate.pointsEarned,
        pointsRequired: transferPartner.pointsRequired,
        milesReceived: transferPartner.milesReceived,
      })

      return {
        points: currentTotals.points + result.points,
        miles: currentTotals.miles + result.miles,
        totalSpend: currentTotals.totalSpend + amount,
      }
    },
    { points: 0, miles: 0, totalSpend: 0 },
  )
  const idrPerMile =
    totals.miles > 0 ? Math.ceil(totals.totalSpend / totals.miles) : null

  return {
    card,
    partnerProgram,
    ...totals,
    idrPerMile,
    rating: idrPerMile === null ? null : getRating(idrPerMile),
  }
}

export function CompareResults({
  cards,
  selections,
  spending,
}: CompareResultsProps): ReactElement {
  const results = selections
    .map((selection) => {
      const card = cards.find((item) => item.id === selection.cardId)

      if (!card) {
        return null
      }

      return buildCompareResult(card, selection.partnerProgram, spending)
    })
    .filter((result): result is CompareResultCard => result !== null)

  if (results.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6 text-sm text-muted-foreground">
          Pilih minimal satu kartu untuk melihat hasil perbandingan.
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {results.map((result) => (
        <Card key={result.card.id} className="border-border bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-2">
                <Badge tone="accent">{result.card.bank}</Badge>
                <CardTitle className="font-display text-xl text-primary">
                  {result.card.shortName}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Partner: {result.partnerProgram}
                </p>
              </div>
              {result.rating ? <RatingBadge rating={result.rating} /> : null}
            </div>
          </CardHeader>

          <CardContent className="grid gap-3">
            <Metric
              icon={Star}
              label="Total poin"
              value={numberFormatter.format(result.points)}
            />
            <Metric
              icon={Plane}
              label="Total miles"
              value={numberFormatter.format(result.miles)}
            />
            <Metric
              icon={CircleDollarSign}
              label="IDR/Mile"
              value={
                result.idrPerMile === null ? '-' : formatIdr(result.idrPerMile)
              }
              emphasized
            />

            <Button asChild variant="outline" className="mt-1 w-full">
              <Link
                to="/credit-cards/$slug"
                params={{ slug: result.card.id }}
                className="no-underline"
              >
                Lihat detail kartu
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

interface MetricProps {
  icon: LucideIcon
  label: string
  value: string
  emphasized?: boolean
}

function Metric({
  icon: Icon,
  label,
  value,
  emphasized = false,
}: MetricProps): ReactElement {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 font-mono text-xl font-bold text-primary">{value}</p>
      {emphasized ? (
        <p className="mt-1 text-xs text-muted-foreground">Lower is better.</p>
      ) : null}
    </div>
  )
}
