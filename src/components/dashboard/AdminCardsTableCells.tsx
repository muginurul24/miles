import { ArrowDownUp } from 'lucide-react'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'

import type { AdminCardRow } from '#/server/repositories/admin.repo'
import type { MouseEventHandler, ReactElement } from 'react'

interface SortableHeaderProps {
  label: string
  onClick: MouseEventHandler<HTMLButtonElement> | undefined
}

export function SortableHeader({
  label,
  onClick,
}: SortableHeaderProps): ReactElement {
  return (
    <Button type="button" variant="ghost" className="-ml-3" onClick={onClick}>
      {label}
      <ArrowDownUp className="h-4 w-4" aria-hidden="true" />
    </Button>
  )
}

export function BenefitsCell({ card }: { card: AdminCardRow }): ReactElement {
  const benefits = [
    card.loungeAccess ? 'Lounge' : null,
    card.travelInsurance ? 'Insurance' : null,
    card.airportTransfer ? 'Transfer' : null,
  ].filter((benefit): benefit is string => benefit !== null)

  if (benefits.length === 0) {
    return <span className="text-sm text-muted-foreground">No highlight</span>
  }

  return (
    <div className="flex min-w-40 flex-wrap gap-1">
      {benefits.map((benefit) => (
        <Badge key={benefit} tone="success">
          {benefit}
        </Badge>
      ))}
    </div>
  )
}
