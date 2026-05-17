import { Badge as UiBadge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

import type { ComponentProps, ReactElement } from 'react'

export type BadgeTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends Omit<
  ComponentProps<typeof UiBadge>,
  'variant'
> {
  tone?: BadgeTone
  size?: BadgeSize
}

const toneStyles = {
  neutral:
    'border-border bg-secondary text-secondary-foreground dark:bg-secondary/70',
  accent:
    'border-accent/20 bg-accent-light text-accent dark:border-accent/30 dark:bg-accent-light dark:text-primary',
  success:
    'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/30 dark:text-emerald-300',
  warning:
    'border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/30 dark:text-amber-300',
  danger:
    'border-red-200 bg-red-100 text-red-800 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-300',
  info: 'border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-900/50 dark:bg-sky-900/30 dark:text-sky-300',
} satisfies Record<BadgeTone, string>

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
} satisfies Record<BadgeSize, string>

export function Badge({
  tone = 'neutral',
  size = 'sm',
  className,
  ...props
}: BadgeProps): ReactElement {
  return (
    <UiBadge
      variant="outline"
      className={cn(toneStyles[tone], sizeStyles[size], className)}
      {...props}
    />
  )
}
