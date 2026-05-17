import { ExternalLink } from 'lucide-react'
import ThemeToggle from '#/components/ThemeToggle'
import { AppSidebar } from '#/components/app-sidebar'
import { SiteHeader } from '#/components/site-header'
import { Button } from '#/components/ui/button'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'

import type { ReactElement, ReactNode } from 'react'

export interface DashboardShellProps {
  title: string
  description?: string
  children: ReactNode
}

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps): ReactElement {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader
          title={title}
          description={description}
          actions={
            <>
              <ThemeToggle />
              <Button asChild variant="outline" size="sm">
                <a href="/" className="hidden no-underline sm:inline-flex">
                  Public site
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </>
          }
        />
        <main className="min-h-[calc(100svh-4rem)] bg-background p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
