import { Skeleton } from '#/components/ui/skeleton'

import type { ReactElement } from 'react'

export function RoutePendingSkeleton(): ReactElement {
  return (
    <main className="page-wrap py-10 md:py-14" aria-busy="true">
      <section className="grid gap-6">
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-4 w-32 bg-muted" />
          <Skeleton className="h-10 w-full max-w-xl bg-muted" />
          <Skeleton className="h-5 w-full max-w-2xl bg-muted" />
          <Skeleton className="h-5 w-3/4 max-w-xl bg-muted" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <Skeleton className="h-10 w-10 rounded-2xl bg-muted" />
              <Skeleton className="mt-5 h-5 w-2/3 bg-muted" />
              <Skeleton className="mt-3 h-4 w-full bg-muted" />
              <Skeleton className="mt-2 h-4 w-4/5 bg-muted" />
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-border bg-card p-5">
            <Skeleton className="h-6 w-44 bg-muted" />
            <Skeleton className="mt-5 h-64 w-full rounded-2xl bg-muted" />
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <Skeleton className="h-6 w-36 bg-muted" />
            <div className="mt-5 grid gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-12 w-full bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
