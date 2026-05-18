'use client'

import { Link } from '@tanstack/react-router'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Badge } from '#/components/shared/Badge'
import { Button } from '#/components/ui/button'
import { authClient } from '#/lib/auth-client'
import { getPremiumContentCtaCopy } from '#/lib/premium-gate-copy'
import { useHasMounted } from '#/lib/use-has-mounted'
import { cn } from '#/lib/utils'

import type { ReactElement } from 'react'

export interface PremiumContentCTAProps {
  title?: string
  description?: string
  highlight?: string
  className?: string
}

export function PremiumContentCTA({
  title = 'Sebelum transfer poin, baca strateginya dulu',
  description = 'Kami membongkar data aktual, award chart maskapai, timing terbaik transfer, dan rute yang benar-benar worth it — bukan teori. Ini konten yang kami produksi dari jam terbang dan data lapangan.',
  highlight = 'Behind the data',
  className,
}: PremiumContentCTAProps): ReactElement {
  const { data: session, isPending } = authClient.useSession()
  const hasMounted = useHasMounted()
  const ctaCopy = getPremiumContentCtaCopy({
    isSessionPending: !hasMounted || isPending,
    user: hasMounted ? session?.user : undefined,
  })

  return (
    <section
      className={cn(
        'page-wrap overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground shadow-xs',
        className,
      )}
    >
      <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_20rem] md:items-center md:p-8">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              tone="warning"
              size="md"
              className="inline-flex items-center gap-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Member Exclusive
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/65">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {highlight}
            </span>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4">
          <p className="text-sm leading-6 text-primary-foreground/80">
            {ctaCopy.cardText}
          </p>
          {ctaCopy.buttonTo ? (
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent-hover"
            >
              <Link to={ctaCopy.buttonTo}>
                {ctaCopy.buttonLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              disabled={ctaCopy.disabled}
              className="bg-accent text-accent-foreground hover:bg-accent-hover"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {ctaCopy.buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
