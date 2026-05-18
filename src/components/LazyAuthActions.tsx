import { Suspense, lazy } from 'react'
import { cn } from '#/lib/utils'

import type { ReactElement } from 'react'

type AuthActionsVariant = 'desktop' | 'mobile'

interface LazyAuthActionsProps {
  variant: AuthActionsVariant
}

const AuthActions = lazy(async () => {
  const module = await import('./AuthActions')
  return { default: module.AuthActions }
})

export function LazyAuthActions({
  variant,
}: LazyAuthActionsProps): ReactElement {
  return (
    <Suspense fallback={<AuthActionsFallback variant={variant} />}>
      <AuthActions variant={variant} />
    </Suspense>
  )
}

function AuthActionsFallback({ variant }: LazyAuthActionsProps): ReactElement {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        variant === 'mobile' ? 'h-20 w-full' : 'h-8 w-28',
      )}
      aria-hidden="true"
    />
  )
}
