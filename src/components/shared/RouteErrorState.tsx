import { Link } from '@tanstack/react-router'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { Button } from '#/components/ui/button'

import type { ReactElement } from 'react'

interface RouteErrorStateProps {
  error: unknown
  reset: () => void
}

const GENERIC_ROUTE_ERROR_MESSAGE =
  'Maaf, halaman ini sedang mengalami gangguan. Coba muat ulang state halaman, atau kembali ke homepage.'

export function getRouteErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return GENERIC_ROUTE_ERROR_MESSAGE
}

export function RouteErrorState({
  error,
  reset,
}: RouteErrorStateProps): ReactElement {
  const errorMessage = getRouteErrorMessage(error)
  const shouldShowDebugMessage =
    process.env.NODE_ENV !== 'production' &&
    errorMessage !== GENERIC_ROUTE_ERROR_MESSAGE

  return (
    <main className="page-wrap py-12 md:py-16">
      <section
        role="alert"
        className="island-shell rounded-3xl p-6 text-center sm:p-8"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </span>

        <div className="mx-auto mt-5 max-w-2xl space-y-3">
          <p className="island-kicker">Route error</p>
          <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
            Ada gangguan di halaman ini
          </h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            {GENERIC_ROUTE_ERROR_MESSAGE}
          </p>
        </div>

        {shouldShowDebugMessage ? (
          <pre className="mx-auto mt-5 max-w-2xl overflow-x-auto rounded-2xl border border-border bg-background p-4 text-left font-mono text-xs text-muted-foreground">
            {errorMessage}
          </pre>
        ) : null}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Coba lagi
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              Kembali ke homepage
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
