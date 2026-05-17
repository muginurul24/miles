import { Separator } from '#/components/ui/separator.tsx'
import { SidebarTrigger } from '#/components/ui/sidebar.tsx'

import type { ReactNode } from 'react'

interface SiteHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function SiteHeader({ title, description, actions }: SiteHeaderProps) {
  return (
    <header className="flex min-h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex w-full items-center gap-3 px-4 py-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-bold text-primary">
            {title}
          </h1>
          {description ? (
            <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  )
}
