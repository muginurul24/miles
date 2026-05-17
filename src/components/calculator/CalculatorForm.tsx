import { CreditCard, Plane, WalletCards } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

import type { CalculatorCard } from '#/server/repositories/calculator.repo'
import type { ChangeEvent, ReactElement } from 'react'

export interface CalculatorFormValue {
  cardId: string
  transactionType: string
  partnerProgram: string
  amount: number
}

export interface CalculatorFormProps {
  cards: CalculatorCard[]
  value: CalculatorFormValue
  onValueChange: (value: CalculatorFormValue) => void
}

const DEFAULT_AMOUNT = 10_000_000

const transactionLabels: Record<string, string> = {
  dining: 'Dining & Restoran',
  local: 'Transaksi Lokal',
  online: 'Online & E-Commerce',
  overseas: 'Transaksi Overseas',
  travel: 'Travel & Penerbangan',
}

function formatTransactionType(transactionType: string): string {
  return transactionLabels[transactionType] ?? transactionType
}

export function getInitialCalculatorFormValue(
  cards: CalculatorCard[],
): CalculatorFormValue {
  const firstCard = cards.at(0)

  return {
    cardId: firstCard?.id ?? '',
    transactionType: firstCard?.earningRates.at(0)?.transactionType ?? '',
    partnerProgram: firstCard?.transferPartners.at(0)?.program ?? '',
    amount: DEFAULT_AMOUNT,
  }
}

export function CalculatorForm({
  cards,
  value,
  onValueChange,
}: CalculatorFormProps): ReactElement {
  const selectedCard = cards.find((card) => card.id === value.cardId)

  function updateValue(nextValue: Partial<CalculatorFormValue>): void {
    onValueChange({
      ...value,
      ...nextValue,
    })
  }

  function handleCardChange(cardId: string): void {
    const nextCard = cards.find((card) => card.id === cardId)

    onValueChange({
      ...value,
      cardId,
      transactionType: nextCard?.earningRates.at(0)?.transactionType ?? '',
      partnerProgram: nextCard?.transferPartners.at(0)?.program ?? '',
    })
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    const parsedAmount = Number.parseInt(event.target.value, 10)
    updateValue({
      amount: Number.isFinite(parsedAmount) ? Math.max(parsedAmount, 0) : 0,
    })
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-primary">
          Simulasi transaksi
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="calculator-card">
            <CreditCard className="h-4 w-4 text-accent" aria-hidden="true" />
            Kartu kredit
          </Label>
          <Select value={value.cardId} onValueChange={handleCardChange}>
            <SelectTrigger id="calculator-card" className="w-full">
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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="calculator-transaction">
              <WalletCards className="h-4 w-4 text-accent" aria-hidden="true" />
              Tipe transaksi
            </Label>
            <Select
              value={value.transactionType}
              onValueChange={(transactionType) =>
                updateValue({ transactionType })
              }
            >
              <SelectTrigger id="calculator-transaction" className="w-full">
                <SelectValue placeholder="Pilih transaksi" />
              </SelectTrigger>
              <SelectContent>
                {selectedCard?.earningRates.map((rate) => (
                  <SelectItem
                    key={rate.transactionType}
                    value={rate.transactionType}
                  >
                    {formatTransactionType(rate.transactionType)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="calculator-partner">
              <Plane className="h-4 w-4 text-accent" aria-hidden="true" />
              Transfer partner
            </Label>
            <Select
              value={value.partnerProgram}
              onValueChange={(partnerProgram) =>
                updateValue({ partnerProgram })
              }
            >
              <SelectTrigger id="calculator-partner" className="w-full">
                <SelectValue placeholder="Pilih partner" />
              </SelectTrigger>
              <SelectContent>
                {selectedCard?.transferPartners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.program}>
                    {partner.program} ({partner.pointsRequired}:
                    {partner.milesReceived})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="calculator-amount">Nominal transaksi</Label>
          <Input
            id="calculator-amount"
            type="number"
            min={0}
            step={50_000}
            value={value.amount}
            onChange={handleAmountChange}
          />
          <p className="text-xs leading-5 text-muted-foreground">
            Masukkan nominal dalam Rupiah. Kalkulator memakai pembulatan ke atas
            sesuai formula JustMiles.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
