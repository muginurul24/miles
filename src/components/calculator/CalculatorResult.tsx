import { CircleDollarSign, Plane, Star } from 'lucide-react'
import { RatingBadge } from '#/components/shared'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { calculateMiles, getRating } from '#/lib/calculator'

import type { CalculatorFormValue } from '#/components/calculator/CalculatorForm'
import type { CalculatorCard } from '#/server/repositories/calculator.repo'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

export interface CalculatorResultProps {
  cards: CalculatorCard[]
  value: CalculatorFormValue
}

const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
})

function formatIdr(value: number): string {
  return `Rp${numberFormatter.format(value)}`
}

export function CalculatorResult({
  cards,
  value,
}: CalculatorResultProps): ReactElement {
  const selectedCard = cards.find((card) => card.id === value.cardId)
  const earningRate = selectedCard?.earningRates.find(
    (rate) => rate.transactionType === value.transactionType,
  )
  const transferPartner = selectedCard?.transferPartners.find(
    (partner) => partner.program === value.partnerProgram,
  )
  const result =
    earningRate && transferPartner
      ? calculateMiles({
          amount: value.amount,
          spendPerPoint: earningRate.spendPerPoint,
          pointsEarned: earningRate.pointsEarned,
          pointsRequired: transferPartner.pointsRequired,
          milesReceived: transferPartner.milesReceived,
        })
      : null
  const rating =
    result?.idrPerMile === null || result?.idrPerMile === undefined
      ? null
      : getRating(result.idrPerMile)

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <CardTitle className="font-display text-2xl text-primary">
              Hasil kalkulasi
            </CardTitle>
            <CardDescription>
              {selectedCard
                ? `Simulasi untuk ${selectedCard.shortName}`
                : 'Pilih kartu untuk melihat hasil.'}
            </CardDescription>
          </div>
          {rating ? <RatingBadge rating={rating} size="md" /> : null}
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid gap-3">
          <ResultMetric
            icon={Star}
            label="Poin terkumpul"
            value={result ? numberFormatter.format(result.points) : '-'}
          />
          <ResultMetric
            icon={Plane}
            label="Miles diterima"
            value={result ? numberFormatter.format(result.miles) : '-'}
          />
          <ResultMetric
            icon={CircleDollarSign}
            label="IDR per mile"
            value={
              result?.idrPerMile === null || result === null
                ? '-'
                : formatIdr(result.idrPerMile)
            }
            emphasized
          />
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Formula
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Points = ceil(nominal / spend per point) × points earned. Miles =
            ceil(points × miles received / points required). Semakin rendah IDR
            per mile, semakin baik value kartunya.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface ResultMetricProps {
  icon: LucideIcon
  label: string
  value: string
  emphasized?: boolean
}

function ResultMetric({
  icon: Icon,
  label,
  value,
  emphasized = false,
}: ResultMetricProps): ReactElement {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 font-mono text-2xl font-bold text-primary">{value}</p>
      {emphasized ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Lower is better for redemption value.
        </p>
      ) : null}
    </div>
  )
}
