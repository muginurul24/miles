import { Calculator, CircleDollarSign, Plane, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { RatingBadge } from '#/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { calculateMiles, getRating } from '#/lib/calculator'

import type { CalculatorCard } from '#/server/repositories/calculator.repo'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

export interface CalculatorPreviewProps {
  cards: CalculatorCard[]
}

const currencyFormatter = new Intl.NumberFormat('id-ID')
const transactionLabels = {
  dining: 'Dining',
  local: 'Lokal',
  online: 'Online',
  overseas: 'Overseas',
  travel: 'Travel',
} as const

function formatNumber(value: number): string {
  return currencyFormatter.format(value)
}

function getDefaultAmount(): number {
  return 1_000_000
}

export function CalculatorPreview({
  cards,
}: CalculatorPreviewProps): ReactElement {
  const firstCard = cards.at(0)
  const [cardId, setCardId] = useState(firstCard?.id ?? '')
  const [transactionType, setTransactionType] = useState('local')
  const [partnerProgram, setPartnerProgram] = useState(
    firstCard?.transferPartners[0]?.program ?? '',
  )
  const [amount, setAmount] = useState(getDefaultAmount)

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === cardId),
    [cardId, cards],
  )
  const earningRate = selectedCard?.earningRates.find(
    (rate) => rate.transactionType === transactionType,
  )
  const selectedPartner = selectedCard?.transferPartners.find(
    (partner) => partner.program === partnerProgram,
  )
  const result =
    earningRate && selectedPartner
      ? calculateMiles({
          amount,
          spendPerPoint: earningRate.spendPerPoint,
          pointsEarned: earningRate.pointsEarned,
          pointsRequired: selectedPartner.pointsRequired,
          milesReceived: selectedPartner.milesReceived,
        })
      : null
  const rating =
    result?.idrPerMile === null || result === null
      ? null
      : getRating(result.idrPerMile)

  function handleCardChange(nextCardId: string): void {
    const nextCard = cards.find((card) => card.id === nextCardId)

    setCardId(nextCardId)
    setPartnerProgram(nextCard?.transferPartners[0]?.program ?? '')
  }

  function handleAmountChange(nextValue: string): void {
    const parsedAmount = Number.parseInt(nextValue, 10)
    setAmount(Number.isFinite(parsedAmount) ? Math.max(parsedAmount, 0) : 0)
  }

  if (!firstCard) {
    return (
      <section className="page-wrap py-10 md:py-14">
        <Card className="border-border bg-card">
          <CardContent className="text-sm text-muted-foreground">
            Data kartu belum tersedia.
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="page-wrap py-10 md:py-14">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Calculator Preview
          </p>
          <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">
            Cek cepat value miles dari satu transaksi
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            Pilih kartu, tipe transaksi, program transfer, dan nominal belanja
            untuk melihat estimasi poin, miles, serta biaya per mile.
          </p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="gap-1">
            <CardTitle className="font-display text-xl text-primary">
              Simulasi cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Kartu kredit
              <Select value={cardId} onValueChange={handleCardChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kartu" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.shortName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Tipe transaksi
                <Select
                  value={transactionType}
                  onValueChange={setTransactionType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih transaksi" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCard?.earningRates.map((rate) => (
                      <SelectItem
                        key={rate.transactionType}
                        value={rate.transactionType}
                      >
                        {
                          transactionLabels[
                            rate.transactionType as keyof typeof transactionLabels
                          ]
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-foreground">
                Transfer partner
                <Select
                  value={partnerProgram}
                  onValueChange={setPartnerProgram}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCard?.transferPartners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.program}>
                        {partner.program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-foreground">
              Nominal transaksi
              <Input
                type="number"
                min={0}
                step={50_000}
                value={amount}
                onChange={(event) => handleAmountChange(event.target.value)}
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ResultMetric
                icon={Star}
                label="Poin"
                value={result ? formatNumber(result.points) : '-'}
              />
              <ResultMetric
                icon={Plane}
                label="Miles"
                value={result ? formatNumber(result.miles) : '-'}
              />
              <ResultMetric
                icon={CircleDollarSign}
                label="IDR/Mile"
                value={
                  result?.idrPerMile === null || result === null
                    ? '-'
                    : `Rp${formatNumber(result.idrPerMile)}`
                }
              />
            </div>

            {rating ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2">
                <span className="text-sm text-muted-foreground">
                  Rating value
                </span>
                <RatingBadge rating={rating} />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

interface ResultMetricProps {
  icon: LucideIcon
  label: string
  value: string
}

function ResultMetric({
  icon: Icon,
  label,
  value,
}: ResultMetricProps): ReactElement {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 font-mono text-lg font-bold text-primary">{value}</p>
    </div>
  )
}
