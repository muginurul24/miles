import { Badge } from '#/components/shared/Badge'
import { cn } from '#/lib/utils'

import type { ComponentProps, ReactElement } from 'react'

export const RATING_LABELS = [
  'Excellent',
  'Very Good',
  'Good',
  'Average',
  'Poor',
] as const

export type RatingLabel = (typeof RATING_LABELS)[number]

export interface RatingBadgeProps extends Omit<
  ComponentProps<typeof Badge>,
  'children' | 'tone'
> {
  rating: RatingLabel
}

const ratingStyles = {
  Excellent:
    'border-green-200 bg-green-100 text-green-800 dark:border-green-900/50 dark:bg-green-900/30 dark:text-green-400',
  'Very Good':
    'border-teal-200 bg-teal-100 text-teal-800 dark:border-teal-900/50 dark:bg-teal-900/30 dark:text-teal-400',
  Good: 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/30 dark:text-yellow-400',
  Average:
    'border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-900/50 dark:bg-orange-900/30 dark:text-orange-400',
  Poor: 'border-red-200 bg-red-100 text-red-800 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-400',
} satisfies Record<RatingLabel, string>

export function RatingBadge({
  rating,
  className,
  ...props
}: RatingBadgeProps): ReactElement {
  return (
    <Badge
      className={cn(ratingStyles[rating], className)}
      aria-label={`Rating ${rating}`}
      {...props}
    >
      {rating}
    </Badge>
  )
}
