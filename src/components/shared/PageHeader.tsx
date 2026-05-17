import { Breadcrumb } from '#/components/shared/Breadcrumb'
import { cn } from '#/lib/utils'

import type { BreadcrumbEntry } from '#/components/shared/Breadcrumb'
import type { ReactElement, ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  breadcrumb?: BreadcrumbEntry[]
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  eyebrow,
  description,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps): ReactElement {
  return (
    <header className={cn('page-wrap py-10 md:py-14', className)}>
      {breadcrumb ? <Breadcrumb items={breadcrumb} className="mb-6" /> : null}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="m-0 font-display text-3xl font-bold tracking-normal text-primary sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  )
}
