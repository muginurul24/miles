import { CircleDollarSign } from 'lucide-react'
import { Badge } from '#/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

import type { ChangeEvent, ReactElement } from 'react'

export interface CompareSpendingValue {
  dining: number
  local: number
  online: number
  overseas: number
  travel: number
}

export interface CompareSpendingInputsProps {
  value: CompareSpendingValue
  onValueChange: (value: CompareSpendingValue) => void
}

type SpendingKey = keyof CompareSpendingValue

const spendingFields = [
  { key: 'local', label: 'Transaksi Lokal', step: 100_000 },
  { key: 'overseas', label: 'Overseas', step: 100_000 },
  { key: 'dining', label: 'Dining & Restoran', step: 50_000 },
  { key: 'online', label: 'Online & E-Commerce', step: 50_000 },
  { key: 'travel', label: 'Travel & Penerbangan', step: 100_000 },
] satisfies { key: SpendingKey; label: string; step: number }[]

const numberFormatter = new Intl.NumberFormat('id-ID')

export function getInitialCompareSpendingValue(): CompareSpendingValue {
  return {
    local: 5_000_000,
    overseas: 2_000_000,
    dining: 1_000_000,
    online: 1_000_000,
    travel: 1_000_000,
  }
}

function formatIdr(value: number): string {
  return `Rp${numberFormatter.format(value)}`
}

export function CompareSpendingInputs({
  value,
  onValueChange,
}: CompareSpendingInputsProps): ReactElement {
  const total = spendingFields.reduce((sum, field) => sum + value[field.key], 0)

  function handleFieldChange(
    key: SpendingKey,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const parsedValue = Number.parseInt(event.target.value, 10)

    onValueChange({
      ...value,
      [key]: Number.isFinite(parsedValue) ? Math.max(parsedValue, 0) : 0,
    })
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-2">
            <CardTitle className="flex items-center gap-2 font-display text-2xl text-primary">
              <CircleDollarSign
                className="h-5 w-5 text-accent"
                aria-hidden="true"
              />
              Komposisi spending
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Masukkan estimasi spending per kategori agar compare tool bisa
              membaca pola belanja yang lebih realistis.
            </p>
          </div>
          <Badge tone="accent" size="md">
            Total {formatIdr(total)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {spendingFields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <Label htmlFor={`compare-spend-${field.key}`}>{field.label}</Label>
            <Input
              id={`compare-spend-${field.key}`}
              type="number"
              min={0}
              step={field.step}
              value={value[field.key]}
              onChange={(event) => handleFieldChange(field.key, event)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
