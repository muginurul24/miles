import { SearchX } from 'lucide-react'
import { cn } from '#/lib/utils'

import type { LucideIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description: string
  eyebrow?: string
  action?: ReactNode
  icon?: LucideIcon
  compact?: boolean
  className?: string
}

export function EmptyState({
  title,
  description,
  eyebrow,
  action,
  icon: Icon = SearchX,
  compact = false,
  className,
}: EmptyStateProps): ReactElement {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card text-center shadow-xs',
        compact ? 'gap-3 p-5' : 'gap-4 p-8 md:p-10',
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-light text-accent dark:bg-accent-light/70 dark:text-primary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>

      <div className="max-w-xl space-y-2">
        {eyebrow ? <p className="island-kicker">{eyebrow}</p> : null}
        <h3 className="font-display text-xl font-bold text-primary">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  )
}
