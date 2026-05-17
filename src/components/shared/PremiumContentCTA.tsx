import { Link } from '@tanstack/react-router'
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react'
import { Badge } from '#/components/shared/Badge'
import { Button } from '#/components/ui/button'
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
  return (
    <section
      className={cn(
        'page-wrap overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground shadow-xs',
        className,
      )}
    >
      <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_20rem] md:items-center md:p-8">
        <div
          className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-accent/35 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-28 -left-24 h-56 w-56 rounded-full bg-primary-foreground/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              tone="warning"
              size="md"
              className="inline-flex items-center gap-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
            >
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
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

        <div className="relative grid gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 backdrop-blur">
          <p className="text-sm leading-6 text-primary-foreground/80">
            Daftar gratis dalam 30 detik untuk buka semua artikel exclusive.
            Tanpa spam, tanpa ribet.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent-hover"
          >
            <Link to="/auth/register">
              Baca semua artikel exclusive
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
