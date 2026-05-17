import { Save } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { showErrorToast } from '#/components/Toast'
import {
  BooleanField,
  NumberField,
  TextareaField,
  TextField,
} from '#/components/dashboard/AdminFormFields'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { adminCardCreateInputSchema } from '#/lib/schemas/admin-card'

import type { AdminCardRow } from '#/server/repositories/admin.repo'
import type { FormEvent, ReactElement } from 'react'

export interface AdminCardFormValue {
  id: string
  name: string
  shortName: string
  bank: string
  network: string
  tier: string
  annualFee: number
  minIncome: number
  imageUrl: string
  bestFor: string
  notIdealFor: string
  loungeAccess: boolean
  travelInsurance: boolean
  airportTransfer: boolean
}

interface AdminCardFormProps {
  editingCard: AdminCardRow | null
  isPending: boolean
  onCancelEdit: () => void
  onSubmit: (value: AdminCardFormValue) => void
}

const emptyCardValue: AdminCardFormValue = {
  id: '',
  name: '',
  shortName: '',
  bank: '',
  network: 'Visa',
  tier: '',
  annualFee: 0,
  minIncome: 0,
  imageUrl: '',
  bestFor: '',
  notIdealFor: '',
  loungeAccess: false,
  travelInsurance: false,
  airportTransfer: false,
}

export function AdminCardForm({
  editingCard,
  isPending,
  onCancelEdit,
  onSubmit,
}: AdminCardFormProps): ReactElement {
  const formId = useId()
  const [value, setValue] = useState<AdminCardFormValue>(emptyCardValue)

  useEffect(() => {
    setValue(editingCard ? toFormValue(editingCard) : emptyCardValue)
  }, [editingCard])

  function updateValue(nextValue: Partial<AdminCardFormValue>): void {
    setValue((currentValue) => ({ ...currentValue, ...nextValue }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const parsed = adminCardCreateInputSchema.safeParse(value)

    if (!parsed.success) {
      showErrorToast(parsed.error.issues[0]?.message ?? 'Input belum valid.')
      return
    }

    onSubmit(value)
  }

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="island-kicker">Card editor</p>
            <CardTitle className="font-display text-2xl text-primary">
              {editingCard ? 'Edit kartu' : 'Tambah kartu'}
            </CardTitle>
          </div>
          {editingCard ? (
            <Badge tone="warning" size="md">
              Editing {editingCard.shortName}
            </Badge>
          ) : (
            <Badge tone="accent" size="md">
              New card
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextField
              id={`${formId}-id`}
              label="Slug ID"
              value={value.id}
              disabled={editingCard !== null}
              onChange={(id) => updateValue({ id })}
            />
            <TextField
              id={`${formId}-name`}
              label="Nama kartu"
              value={value.name}
              onChange={(name) => updateValue({ name })}
            />
            <TextField
              id={`${formId}-short-name`}
              label="Short name"
              value={value.shortName}
              onChange={(shortName) => updateValue({ shortName })}
            />
            <TextField
              id={`${formId}-bank`}
              label="Bank"
              value={value.bank}
              onChange={(bank) => updateValue({ bank })}
            />
            <TextField
              id={`${formId}-network`}
              label="Network"
              value={value.network}
              onChange={(network) => updateValue({ network })}
            />
            <TextField
              id={`${formId}-tier`}
              label="Tier"
              value={value.tier}
              onChange={(tier) => updateValue({ tier })}
            />
            <NumberField
              id={`${formId}-annual-fee`}
              label="Annual fee"
              value={value.annualFee}
              onChange={(annualFee) => updateValue({ annualFee })}
            />
            <NumberField
              id={`${formId}-min-income`}
              label="Minimum income"
              value={value.minIncome}
              onChange={(minIncome) => updateValue({ minIncome })}
            />
            <TextField
              id={`${formId}-image-url`}
              label="Image URL"
              value={value.imageUrl}
              onChange={(imageUrl) => updateValue({ imageUrl })}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TextareaField
              id={`${formId}-best-for`}
              label="Best for"
              value={value.bestFor}
              onChange={(bestFor) => updateValue({ bestFor })}
            />
            <TextareaField
              id={`${formId}-not-ideal-for`}
              label="Not ideal for"
              value={value.notIdealFor}
              onChange={(notIdealFor) => updateValue({ notIdealFor })}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <BooleanField
              id={`${formId}-lounge`}
              label="Lounge access"
              checked={value.loungeAccess}
              onCheckedChange={(loungeAccess) => updateValue({ loungeAccess })}
            />
            <BooleanField
              id={`${formId}-insurance`}
              label="Travel insurance"
              checked={value.travelInsurance}
              onCheckedChange={(travelInsurance) =>
                updateValue({ travelInsurance })
              }
            />
            <BooleanField
              id={`${formId}-transfer`}
              label="Airport transfer"
              checked={value.airportTransfer}
              onCheckedChange={(airportTransfer) =>
                updateValue({ airportTransfer })
              }
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              <Save className="h-4 w-4" aria-hidden="true" />
              {isPending ? 'Menyimpan...' : 'Simpan kartu'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function toFormValue(card: AdminCardRow): AdminCardFormValue {
  return {
    id: card.id,
    name: card.name,
    shortName: card.shortName,
    bank: card.bank,
    network: card.network,
    tier: card.tier,
    annualFee: card.annualFee,
    minIncome: card.minIncome,
    imageUrl: card.imageUrl ?? '',
    bestFor: card.bestFor ?? '',
    notIdealFor: card.notIdealFor ?? '',
    loungeAccess: card.loungeAccess,
    travelInsurance: card.travelInsurance,
    airportTransfer: card.airportTransfer,
  }
}
