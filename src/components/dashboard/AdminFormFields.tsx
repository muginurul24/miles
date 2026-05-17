import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

import type { ReactElement } from 'react'

interface TextFieldProps {
  id: string
  label: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}

export function TextField({
  id,
  label,
  value,
  disabled = false,
  onChange,
}: TextFieldProps): ReactElement {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

interface NumberFieldProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
}

export function NumberField({
  id,
  label,
  value,
  onChange,
}: NumberFieldProps): ReactElement {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

interface TextareaFieldProps extends Omit<TextFieldProps, 'disabled'> {}

export function TextareaField({
  id,
  label,
  value,
  onChange,
}: TextareaFieldProps): ReactElement {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

interface BooleanFieldProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function BooleanField({
  id,
  label,
  checked,
  onCheckedChange,
}: BooleanFieldProps): ReactElement {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 text-sm font-medium text-foreground"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked === true)}
      />
      {label}
    </label>
  )
}
