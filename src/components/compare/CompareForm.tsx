import { CreditCard, Plane } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

import type { CalculatorCard } from '#/server/repositories/calculator.repo'
import type { ReactElement } from 'react'

export interface CompareSlotValue {
  cardId: string
  partnerProgram: string
}

export type CompareFormValue = [
  CompareSlotValue,
  CompareSlotValue,
  CompareSlotValue,
]

export interface CompareFormProps {
  cards: CalculatorCard[]
  value: CompareFormValue
  onValueChange: (value: CompareFormValue) => void
}

type SlotIndex = 0 | 1 | 2

const slotConfigs = [
  { index: 0, label: 'Kartu A' },
  { index: 1, label: 'Kartu B' },
  { index: 2, label: 'Kartu C (opsional)' },
] satisfies { index: SlotIndex; label: string }[]

function createSlot(card?: CalculatorCard): CompareSlotValue {
  return {
    cardId: card?.id ?? '',
    partnerProgram: card?.transferPartners.at(0)?.program ?? '',
  }
}

function replaceSlot(
  value: CompareFormValue,
  index: SlotIndex,
  slot: CompareSlotValue,
): CompareFormValue {
  return [
    index === 0 ? slot : value[0],
    index === 1 ? slot : value[1],
    index === 2 ? slot : value[2],
  ]
}

export function getInitialCompareFormValue(
  cards: CalculatorCard[],
): CompareFormValue {
  return [createSlot(cards.at(0)), createSlot(cards.at(1)), createSlot()]
}

export function CompareForm({
  cards,
  value,
  onValueChange,
}: CompareFormProps): ReactElement {
  function handleCardChange(index: SlotIndex, cardId: string): void {
    const card = cards.find((item) => item.id === cardId)

    onValueChange(
      replaceSlot(value, index, {
        cardId,
        partnerProgram: card?.transferPartners.at(0)?.program ?? '',
      }),
    )
  }

  function handlePartnerChange(index: SlotIndex, partnerProgram: string): void {
    onValueChange(
      replaceSlot(value, index, {
        ...value[index],
        partnerProgram,
      }),
    )
  }

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {slotConfigs.map((slotConfig) => {
        const slot = value[slotConfig.index]
        const selectedCard = cards.find((card) => card.id === slot.cardId)

        return (
          <Card
            key={slotConfig.index}
            className="border-border bg-card shadow-sm"
          >
            <CardHeader>
              <CardTitle className="font-display text-xl text-primary">
                {slotConfig.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`compare-card-${slotConfig.index}`}>
                  <CreditCard
                    className="h-4 w-4 text-accent"
                    aria-hidden="true"
                  />
                  Kartu kredit
                </Label>
                <Select
                  value={slot.cardId}
                  onValueChange={(cardId) =>
                    handleCardChange(slotConfig.index, cardId)
                  }
                >
                  <SelectTrigger
                    id={`compare-card-${slotConfig.index}`}
                    className="w-full"
                  >
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

              <div className="grid gap-2">
                <Label htmlFor={`compare-partner-${slotConfig.index}`}>
                  <Plane className="h-4 w-4 text-accent" aria-hidden="true" />
                  Transfer partner
                </Label>
                <Select
                  value={slot.partnerProgram}
                  disabled={!selectedCard}
                  onValueChange={(partnerProgram) =>
                    handlePartnerChange(slotConfig.index, partnerProgram)
                  }
                >
                  <SelectTrigger
                    id={`compare-partner-${slotConfig.index}`}
                    className="w-full"
                  >
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
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
