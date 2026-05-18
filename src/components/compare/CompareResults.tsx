import { Link } from '@tanstack/react-router'
import { ArrowRight, CircleDollarSign, Plane, Star, Trophy } from 'lucide-react'
import { CardFeatureRadar } from '#/components/compare/CardFeatureRadar'
import { Badge, EmptyState, RatingBadge } from '#/components/shared'
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

interface CompareResultWithValue extends CompareResultCard {
  idrPerMile: number
  rating: RatingLabel
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

function hasMilesValue(
  result: CompareResultCard,
): result is CompareResultWithValue {
  return result.idrPerMile !== null && result.rating !== null
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
  const bestResult =
    [...results]
      .filter(hasMilesValue)
      .sort((first, second) => {
        return first.idrPerMile - second.idrPerMile
      })
      .at(0) ?? null

  if (results.length === 0) {
    return (
      <EmptyState
        eyebrow="Compare"
        title="Pilih kartu untuk mulai"
        description="Pilih minimal satu kartu dan partner miles untuk melihat hasil perbandingan."
      />
    )
  }

  return (
    <section className="grid gap-4">
      {bestResult ? (
        <Card className="border-accent/30 bg-accent-light p-5 text-primary shadow-sm dark:bg-accent-light/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="grid gap-1">
                <p className="island-kicker">Rekomendasi terbaik</p>
                <h2 className="font-display text-xl font-bold">
                  {bestResult.card.shortName}
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Memberi value terbaik untuk komposisi spending saat ini dengan
                  estimasi {formatIdr(bestResult.idrPerMile)} per mile.
                </p>
              </div>
            </div>
            <RatingBadge rating={bestResult.rating} size="md" />
          </div>
        </Card>
      ) : null}

      <CardFeatureRadar results={results} />

      <div className="grid gap-4 lg:grid-cols-3">
        {results.map((result) => (
          <Card
            key={result.card.id}
            className="border-border bg-card shadow-sm"
          >
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
                  result.idrPerMile === null
                    ? '-'
                    : formatIdr(result.idrPerMile)
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
      </div>
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
