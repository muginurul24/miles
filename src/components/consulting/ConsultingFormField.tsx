import { Label } from '#/components/ui/label'
import { getFieldErrorId } from '#/lib/accessibility'

import type { ReactElement, ReactNode } from 'react'

interface ConsultingFormFieldProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

export function ConsultingFormField({
  label,
  htmlFor,
  error,
  children,
}: ConsultingFormFieldProps): ReactElement {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p
          id={getFieldErrorId(htmlFor)}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
