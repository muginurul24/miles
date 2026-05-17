import { ArrowRight, Crown } from 'lucide-react'
import { Button } from '#/components/ui/button'

import type { ReactElement } from 'react'

export function MembershipBanner(): ReactElement {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="page-wrap flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/70">
            <Crown className="h-4 w-4" aria-hidden="true" />
            Membership
          </p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Buka analisis premium untuk keputusan redemption yang lebih tajam
          </h2>
          <p className="mt-3 text-sm leading-7 text-primary-foreground/75 sm:text-base">
            Akses review mendalam, sweet spot premium, dan rekomendasi yang
            lebih spesifik untuk portfolio kartu serta target trip kamu.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="w-full bg-accent text-accent-foreground hover:bg-accent-hover md:w-auto"
        >
          <a href="/membership" className="no-underline">
            Lihat Membership
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  )
}
